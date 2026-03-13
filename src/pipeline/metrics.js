/**
 * Tonic/Clonic メトリクス集計
 *
 * Python版: analyze_tonic_clonic_metrics.py:46-146
 */

import { label1d } from '../dsp/label.js';

/**
 * Tonic成分の評価指標を計算
 *
 * @param {Float64Array} tonicSignal - Tonic成分（ベースライン）
 * @param {Uint8Array} pursingMask - 口すぼめ刺激マスク
 * @returns {{
 *   meanBaseline: number,
 *   stdBaseline: number,
 *   rangeBaseline: number,
 *   meanDuringPursing: number,
 *   meanNoPursing: number,
 *   baselineElevation: number
 * }}
 */
export function analyzeTonicMetrics(tonicSignal, pursingMask) {
  const n = tonicSignal.length;

  // 全体統計
  let sum = 0, min = Infinity, max = -Infinity;
  for (let i = 0; i < n; i++) {
    sum += tonicSignal[i];
    if (tonicSignal[i] < min) min = tonicSignal[i];
    if (tonicSignal[i] > max) max = tonicSignal[i];
  }
  const meanBaseline = sum / n;

  let sumSq = 0;
  for (let i = 0; i < n; i++) {
    const d = tonicSignal[i] - meanBaseline;
    sumSq += d * d;
  }
  const stdBaseline = Math.sqrt(sumSq / n);

  // 刺激中 vs 非刺激中
  let sumPursing = 0, countPursing = 0;
  let sumNoPursing = 0, countNoPursing = 0;

  for (let i = 0; i < n; i++) {
    if (pursingMask && pursingMask[i]) {
      sumPursing += tonicSignal[i];
      countPursing++;
    } else {
      sumNoPursing += tonicSignal[i];
      countNoPursing++;
    }
  }

  const meanDuringPursing = countPursing > 0 ? sumPursing / countPursing : 0;
  const meanNoPursing = countNoPursing > 0 ? sumNoPursing / countNoPursing : 0;
  const baselineElevation = meanDuringPursing - meanNoPursing;

  return {
    meanBaseline,
    stdBaseline,
    rangeBaseline: max - min,
    meanDuringPursing,
    meanNoPursing,
    baselineElevation,
  };
}

/**
 * Clonic成分の評価指標を計算
 *
 * @param {Float64Array} clonicSignal - Clonic成分
 * @param {Uint8Array} spasmMask - 痙攣マスク
 * @param {Uint8Array} pursingMask - 口すぼめ刺激マスク
 * @param {number} fps - フレームレート
 * @param {Uint8Array|null} [excludeMask=null] - 除外マスク（遷移区間など）
 * @returns {{
 *   spasmEpisodes: number,
 *   spasmRatePerSec: number,
 *   spasmCoverage: number,
 *   meanAmplitude: number,
 *   maxAmplitude: number,
 *   meanDurationMs: number
 * }}
 */
export function analyzeClonicMetrics(clonicSignal, spasmMask, pursingMask, fps, excludeMask = null) {
  const n = clonicSignal.length;

  // 有効な口すぼめ区間（遷移区間を除外）
  const effectivePursing = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    if (pursingMask && pursingMask[i]) {
      if (excludeMask && excludeMask[i]) continue;
      effectivePursing[i] = 1;
    }
  }

  // 刺激中の痙攣
  const spasmDuringPursing = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    spasmDuringPursing[i] = (spasmMask[i] && effectivePursing[i]) ? 1 : 0;
  }

  const { labeledArray, numFeatures } = label1d(spasmDuringPursing);

  let pursingFrames = 0;
  for (let i = 0; i < n; i++) {
    if (effectivePursing[i]) pursingFrames++;
  }
  const pursingDuration = pursingFrames / fps;

  const spasmEpisodes = numFeatures;
  const spasmRatePerSec = pursingDuration > 0 ? spasmEpisodes / pursingDuration : 0;

  let spasmDuringPursingFrames = 0;
  for (let i = 0; i < n; i++) {
    if (spasmDuringPursing[i]) spasmDuringPursingFrames++;
  }
  const spasmCoverage = pursingFrames > 0
    ? (spasmDuringPursingFrames / pursingFrames) * 100
    : 0;

  // 痙攣振幅・持続時間の解析
  const amplitudes = [];
  const durations = [];

  for (let lbl = 1; lbl <= numFeatures; lbl++) {
    let maxVal = -Infinity;
    let count = 0;
    for (let i = 0; i < n; i++) {
      if (labeledArray[i] === lbl) {
        if (clonicSignal[i] > maxVal) maxVal = clonicSignal[i];
        count++;
      }
    }
    if (count > 0) {
      amplitudes.push(maxVal);
      durations.push(count);
    }
  }

  const meanAmplitude = amplitudes.length > 0
    ? amplitudes.reduce((a, b) => a + b, 0) / amplitudes.length
    : 0;
  const maxAmplitude = amplitudes.length > 0
    ? Math.max(...amplitudes)
    : 0;
  const meanDurationMs = durations.length > 0
    ? (durations.reduce((a, b) => a + b, 0) / durations.length) / fps * 1000
    : 0;

  return {
    spasmEpisodes,
    spasmRatePerSec,
    spasmCoverage,
    meanAmplitude,
    maxAmplitude,
    meanDurationMs,
  };
}
