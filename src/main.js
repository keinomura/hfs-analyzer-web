/**
 * HFS Analyzer Web - メインエントリポイント
 *
 * 動画アップロード → MediaPipe処理 → 解析パイプライン → 結果表示 の全体を配線する。
 */

import { initUpload } from './ui/upload.js';
import { updateProgress, resetProgress, completeProgress } from './ui/progress.js';
import { renderSummary } from './ui/results.js';
import { initTooltips } from './ui/tooltips.js';
import { initI18n, t } from './i18n/index.js';
import { destroyAllCharts, renderApertureChart, renderRDChart, renderClonicChart, renderPursingChart } from './ui/charts.js';
import { processVideo } from './pipeline/video-processor.js';
import { detectMouthPursing } from './pipeline/mouth-pursing.js';
import { detectAffectedSide } from './pipeline/affected-side.js';
import { computeAsymmetryMetrics } from './pipeline/asymmetry.js';
import { detectBlinksTraditional, extendBlinkMask } from './pipeline/blink-detection.js';
import { separateTonicClonic } from './pipeline/tonic-clonic.js';
import { createTransitionMask } from './pipeline/transition-mask.js';
import { detectSpasmEpisodes } from './pipeline/spasm-detection.js';
import { analyzeTonicMetrics, analyzeClonicMetrics } from './pipeline/metrics.js';
import { interpolateNaN } from './dsp/interpolate.js';
import { label1d } from './dsp/label.js';
import { generateCSV, downloadCSV } from './export/csv-export.js';
import { DEFAULT_FPS } from './constants.js';

let latestSummary = null;
let latestChartPayload = null;

function translateProgressStep(stepName) {
  const stepMap = {
    'Initializing MediaPipe...': 'progress.initializingMediaPipe',
    'Processing frames...': 'progress.processingFrames',
    'Interpolating missing frames...': 'progress.interpolatingMissingFrames',
    'Detecting mouth pursing...': 'progress.detectingMouthPursing',
    'Determining affected side...': 'progress.determiningAffectedSide',
    'Computing asymmetry metrics...': 'progress.computingAsymmetryMetrics',
    'Detecting blinks...': 'progress.detectingBlinks',
    'Separating tonic/clonic components...': 'progress.separatingTonicClonic',
    'Detecting spasm episodes...': 'progress.detectingSpasmEpisodes',
    'Computing metrics...': 'progress.computingMetrics',
  };

  const key = stepMap[stepName];
  return key ? t(key) : stepName;
}

function updateLocalizedProgress(current, total, stepName) {
  updateProgress(current, total, translateProgressStep(stepName));
}

function renderLocalizedCharts(chartPayload) {
  if (!chartPayload) return;

  destroyAllCharts();
  renderApertureChart(
    'chart-aperture',
    chartPayload.timestamps,
    chartPayload.healthyAperture,
    chartPayload.affectedAperture,
    chartPayload.pursingMask,
    chartPayload.sideInfo,
  );
  renderRDChart('chart-rd', chartPayload.timestamps, chartPayload.rd, chartPayload.tonic, chartPayload.pursingMask);
  renderClonicChart(
    'chart-clonic',
    chartPayload.timestamps,
    chartPayload.clonic,
    chartPayload.spasmMask,
    chartPayload.threshold,
    chartPayload.pursingMask,
  );
  renderPursingChart('chart-pursing', chartPayload.timestamps, chartPayload.marArray, chartPayload.pursingMask);
}

/**
 * 解析パイプラインを実行する
 *
 * @param {File} videoFile - 動画ファイル
 */
async function runAnalysis(videoFile) {
  const fpsInput = document.getElementById('fps-input');
  const fps = fpsInput ? parseFloat(fpsInput.value) || DEFAULT_FPS : DEFAULT_FPS;

  // UIリセット
  resetProgress();
  destroyAllCharts();
  document.getElementById('results-section').style.display = 'none';
  document.getElementById('export-section').style.display = 'none';

  try {
    // ── Step 1: 動画処理 + ランドマーク抽出 ──
    const raw = await processVideo(videoFile, fps, updateLocalizedProgress);

    // NaN補間
    updateProgress(0, 0, t('progress.interpolatingMissingFrames'));
    const rightAperture = interpolateNaN(raw.rightAperture);
    const leftAperture = interpolateNaN(raw.leftAperture);
    const marArray = interpolateNaN(raw.mar);
    const timestamps = raw.timestamps;

    // ── Step 2: 口すぼめ検出 ──
    updateProgress(0, 0, t('progress.detectingMouthPursing'));
    const pursingMask = detectMouthPursing(marArray, fps);

    // 口すぼめサマリーメトリクスを計算
    const { numFeatures: pursingEpisodes } = label1d(pursingMask);
    let pursingFrames = 0;
    for (let i = 0; i < pursingMask.length; i++) {
      if (pursingMask[i]) pursingFrames++;
    }
    const pursingTotalDurationSec = pursingFrames / fps;

    // ── Step 3: 患側判定 ──
    updateProgress(0, 0, t('progress.determiningAffectedSide'));
    const sideInfo = detectAffectedSide(rightAperture, leftAperture);

    // ── Step 4: 非対称性指標 ──
    updateProgress(0, 0, t('progress.computingAsymmetryMetrics'));
    const asymmetry = computeAsymmetryMetrics(sideInfo.healthyAperture, sideInfo.affectedAperture);
    const rd = asymmetry.relativeDiff;

    // ── Step 5: 瞬き検出 ──
    updateProgress(0, 0, t('progress.detectingBlinks'));
    const blinkMaskCore = detectBlinksTraditional(sideInfo.healthyAperture);
    const blinkMask = extendBlinkMask(blinkMaskCore);

    // ── Step 6: Tonic/Clonic分離 ──
    updateProgress(0, 0, t('progress.separatingTonicClonic'));
    const { tonic, clonic } = separateTonicClonic(rd, undefined, fps);

    // ── Step 7: 遷移区間マスク ──
    const transitionMask = createTransitionMask(pursingMask, fps);

    // 統合除外マスク（瞬き + 遷移区間）
    const n = rd.length;
    const combinedExclude = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      combinedExclude[i] = (blinkMask[i] || (transitionMask && transitionMask[i])) ? 1 : 0;
    }

    // ── Step 8: 痙攣検出 ──
    updateProgress(0, 0, t('progress.detectingSpasmEpisodes'));
    const spasmResult = detectSpasmEpisodes(clonic, undefined, undefined, combinedExclude);

    // ── Step 9: メトリクス集計 ──
    updateProgress(0, 0, t('progress.computingMetrics'));
    const tonicMetrics = analyzeTonicMetrics(tonic, pursingMask, combinedExclude);
    const clonicMetrics = analyzeClonicMetrics(clonic, spasmResult.spasmMask, pursingMask, fps, combinedExclude);

    // Tonic追加統計
    let tonicPower = 0, clonicPower = 0;
    for (let i = 0; i < n; i++) {
      tonicPower += Math.abs(tonic[i]);
      clonicPower += Math.abs(clonic[i]);
    }

    // ── Step 10: 結果表示 ──
    completeProgress(t('progress.complete'));

    latestSummary = {
      affectedSide: sideInfo.affectedSide,
      cvRatio: sideInfo.cvRatio,
      pursingEpisodes,
      pursingDuration: pursingTotalDurationSec,
      tonicMean: tonicMetrics.meanBaseline,
      tonicElevation: tonicMetrics.baselineElevation,
      clonicEpisodes: clonicMetrics.spasmEpisodes,
      clonicRate: clonicMetrics.spasmRatePerSec,
      clonicCoverage: clonicMetrics.spasmCoverage,
      clonicAmplitude: clonicMetrics.meanAmplitude,
      clonicDurationMs: clonicMetrics.meanDurationMs,
    };

    renderSummary(latestSummary);

    // チャート描画
    latestChartPayload = {
      timestamps,
      healthyAperture: sideInfo.healthyAperture,
      affectedAperture: sideInfo.affectedAperture,
      pursingMask,
      sideInfo,
      rd,
      tonic,
      clonic,
      spasmMask: spasmResult.spasmMask,
      threshold: spasmResult.threshold,
      marArray,
    };
    renderLocalizedCharts(latestChartPayload);

    // CSVエクスポートを有効化
    const exportSection = document.getElementById('export-section');
    exportSection.style.display = 'block';

    const csvBtn = document.getElementById('btn-download-csv');
    csvBtn.onclick = () => {
      const csvData = {
        timestamps, rightAperture, leftAperture, mar: marArray,
        pursingMask, rd, rdTonic: tonic, rdClonic: clonic,
        blinkMask, spasmMask: spasmResult.spasmMask,
        affectedSide: sideInfo.affectedSide,
      };
      const csv = generateCSV(csvData);
      const baseName = videoFile.name.replace(/\.[^.]+$/, '');
      downloadCSV(csv, `${baseName}_hfs_analysis.csv`);
    };

  } catch (error) {
    console.error('Analysis failed:', error);
    updateProgress(0, 0, t('progress.errorPrefix', { message: error.message }));
  }
}

// ── 初期化 ──
document.addEventListener('DOMContentLoaded', () => {
  initI18n();
  const uploadContainer = document.getElementById('upload-section');
  initUpload(uploadContainer, runAnalysis);
  initTooltips(document);

  document.addEventListener('app:language-changed', () => {
    if (latestSummary) {
      renderSummary(latestSummary);
    }
    if (latestChartPayload) {
      renderLocalizedCharts(latestChartPayload);
    }
  });
});
