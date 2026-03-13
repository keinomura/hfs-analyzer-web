/**
 * Chart.js 波形チャート
 */

import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Legend,
  Tooltip,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import zoomPlugin from 'chartjs-plugin-zoom';
import { t } from '../i18n/index.js';

Chart.register(
  LineController, LineElement, PointElement,
  LinearScale, CategoryScale,
  Filler, Legend, Tooltip,
  annotationPlugin, zoomPlugin,
);

const chartInstances = [];

/**
 * 全チャートを破棄する
 */
export function destroyAllCharts() {
  chartInstances.forEach(c => c.destroy());
  chartInstances.length = 0;
}

/**
 * チャート共通のズーム設定
 */
const zoomOptions = {
  zoom: {
    wheel: { enabled: true },
    pinch: { enabled: true },
    mode: 'x',
  },
  pan: {
    enabled: true,
    mode: 'x',
  },
};

/**
 * 口すぼめ区間のアノテーションを生成
 *
 * @param {Float64Array} timestamps
 * @param {Uint8Array} pursingMask
 * @returns {Object[]}
 */
function pursingAnnotations(timestamps, pursingMask) {
  if (!pursingMask) return {};
  const annotations = {};
  let inPursing = false;
  let start = 0;
  let idx = 0;

  for (let i = 0; i < timestamps.length; i++) {
    if (pursingMask[i] && !inPursing) {
      start = i;
      inPursing = true;
    } else if (!pursingMask[i] && inPursing) {
      annotations[`pursing${idx}`] = {
        type: 'box',
        xMin: start,
        xMax: i,
        backgroundColor: 'rgba(255, 222, 59, 0.3)',
        borderColor: 'rgba(255, 222, 59, 0.5)',
        borderWidth: 1,
      };
      idx++;
      inPursing = false;
    }
  }
  if (inPursing) {
    annotations[`pursing${idx}`] = {
      type: 'box',
      xMin: start,
      xMax: timestamps.length - 1,
      backgroundColor: 'rgba(255, 222, 59, 0.3)',
      borderColor: 'rgba(255, 222, 59, 0.5)',
      borderWidth: 1,
    };
  }
  return annotations;
}

/**
 * チャート1: 眼瞼開度（健側 vs 患側）
 */
export function renderApertureChart(canvasId, timestamps, healthyAp, affectedAp, pursingMask, sideInfo) {
  const ctx = document.getElementById(canvasId)?.getContext('2d');
  if (!ctx) return;

  // 間引き（データポイントが多い場合）
  const labels = Array.from(timestamps).map(t => t.toFixed(2));

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: t('chart.dataset.healthy', { side: sideInfo.healthySide.toUpperCase() }),
          data: Array.from(healthyAp),
          borderColor: 'rgba(54, 162, 235, 0.8)',
          borderWidth: 1,
          pointRadius: 0,
          fill: false,
        },
        {
          label: t('chart.dataset.affected', { side: sideInfo.affectedSide.toUpperCase() }),
          data: Array.from(affectedAp),
          borderColor: 'rgba(255, 99, 132, 0.8)',
          borderWidth: 1,
          pointRadius: 0,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: t('chart.axis.timeSeconds') }, ticks: { maxTicksLimit: 20 } },
        y: { title: { display: true, text: t('chart.axis.aperturePx') } },
      },
      plugins: {
        zoom: zoomOptions,
        annotation: { annotations: pursingAnnotations(timestamps, pursingMask) },
      },
    },
  });
  chartInstances.push(chart);
}

/**
 * チャート2: RD + Tonic ベースライン
 */
export function renderRDChart(canvasId, timestamps, rd, tonic, pursingMask) {
  const ctx = document.getElementById(canvasId)?.getContext('2d');
  if (!ctx) return;

  const labels = Array.from(timestamps).map(t => t.toFixed(2));

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: t('chart.dataset.rd'),
          data: Array.from(rd),
          borderColor: 'rgba(75, 192, 192, 0.8)',
          borderWidth: 1,
          pointRadius: 0,
          fill: false,
        },
        {
          label: t('chart.dataset.tonic'),
          data: Array.from(tonic),
          borderColor: 'rgba(153, 102, 255, 0.9)',
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: t('chart.axis.timeSeconds') }, ticks: { maxTicksLimit: 20 } },
        y: { title: { display: true, text: t('chart.axis.relativeDifference') } },
      },
      plugins: {
        zoom: zoomOptions,
        annotation: { annotations: pursingAnnotations(timestamps, pursingMask) },
      },
    },
  });
  chartInstances.push(chart);
}

/**
 * チャート3: Clonic成分 + 痙攣検出
 */
export function renderClonicChart(canvasId, timestamps, clonic, spasmMask, threshold, pursingMask) {
  const ctx = document.getElementById(canvasId)?.getContext('2d');
  if (!ctx) return;

  const labels = Array.from(timestamps).map(t => t.toFixed(2));

  // 痙攣区間の背景を生成
  const spasmAnnotations = {};
  let inSpasm = false;
  let start = 0;
  let idx = 0;
  for (let i = 0; i < timestamps.length; i++) {
    if (spasmMask[i] && !inSpasm) {
      start = i;
      inSpasm = true;
    } else if (!spasmMask[i] && inSpasm) {
      spasmAnnotations[`spasm${idx}`] = {
        type: 'box',
        xMin: start,
        xMax: i,
        backgroundColor: 'rgba(255, 99, 132, 0.3)',
        borderWidth: 0,
      };
      idx++;
      inSpasm = false;
    }
  }

  const annotations = {
    ...pursingAnnotations(timestamps, pursingMask),
    ...spasmAnnotations,
    threshold: {
      type: 'line',
      yMin: threshold,
      yMax: threshold,
      borderColor: 'rgba(255, 99, 132, 0.8)',
      borderWidth: 2,
      borderDash: [6, 6],
      label: {
        display: true,
        content: t('chart.thresholdLabel', { value: threshold.toFixed(3) }),
        position: 'end',
      },
    },
  };

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: t('chart.dataset.clonic'),
          data: Array.from(clonic),
          borderColor: 'rgba(54, 162, 235, 0.8)',
          borderWidth: 1,
          pointRadius: 0,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: t('chart.axis.timeSeconds') }, ticks: { maxTicksLimit: 20 } },
        y: { title: { display: true, text: t('chart.axis.clonicComponent') } },
      },
      plugins: {
        zoom: zoomOptions,
        annotation: { annotations },
      },
    },
  });
  chartInstances.push(chart);
}

/**
 * チャート4: 口すぼめ (MAR)
 */
export function renderPursingChart(canvasId, timestamps, mar, pursingMask) {
  const ctx = document.getElementById(canvasId)?.getContext('2d');
  if (!ctx) return;

  const labels = Array.from(timestamps).map(t => t.toFixed(2));

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: t('chart.dataset.mar'),
          data: Array.from(mar),
          borderColor: 'rgba(255, 159, 64, 0.8)',
          borderWidth: 1,
          pointRadius: 0,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: t('chart.axis.timeSeconds') }, ticks: { maxTicksLimit: 20 } },
        y: { title: { display: true, text: t('chart.axis.mouthAspectRatio') } },
      },
      plugins: {
        zoom: zoomOptions,
        annotation: { annotations: pursingAnnotations(timestamps, pursingMask) },
      },
    },
  });
  chartInstances.push(chart);
}
