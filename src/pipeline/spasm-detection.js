/**
 * 閾値ベースの痙攣エピソード検出
 *
 * Python版: analyze_hfs_final.py:37-97
 */

import { label1d } from '../dsp/label.js';
import { THRESHOLD_STD, MIN_DURATION_FRAMES } from '../constants.js';

/**
 * 痙攣エピソードを検出（最終版）
 *
 * アルゴリズム:
 *   1. 除外区間を除いた上で統計量を計算
 *   2. threshold = mean + threshold_std × std
 *   3. 閾値超過の連続区間を検出
 *   4. 最小持続フレーム数以上のものを痙攣エピソードとする
 *
 * @param {Float64Array} asymmetryMetric - Clonic成分（非対称性指標）
 * @param {number} [thresholdStd=0.5] - 閾値の標準偏差倍率
 * @param {number} [minDurationFrames=4] - 最小持続フレーム数
 * @param {Uint8Array|null} [excludeMask=null] - 除外マスク (1=除外)
 * @returns {{
 *   meanVal: number,
 *   stdVal: number,
 *   threshold: number,
 *   episodeCount: number,
 *   spasmMask: Uint8Array,
 *   durations: number[]
 * }}
 */
export function detectSpasmEpisodes(
  asymmetryMetric,
  thresholdStd = THRESHOLD_STD,
  minDurationFrames = MIN_DURATION_FRAMES,
  excludeMask = null,
) {
  const n = asymmetryMetric.length;

  // 統計計算（除外区間を除く）
  let sum = 0;
  let count = 0;
  for (let i = 0; i < n; i++) {
    if (excludeMask && excludeMask[i]) continue;
    sum += asymmetryMetric[i];
    count++;
  }
  const meanVal = count > 0 ? sum / count : 0;

  let sumSq = 0;
  for (let i = 0; i < n; i++) {
    if (excludeMask && excludeMask[i]) continue;
    const d = asymmetryMetric[i] - meanVal;
    sumSq += d * d;
  }
  const stdVal = count > 0 ? Math.sqrt(sumSq / count) : 0;

  const threshold = meanVal + thresholdStd * stdVal;

  // 閾値超過検出（除外区間は自動的に非検出）
  const aboveThreshold = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    if (excludeMask && excludeMask[i]) continue;
    aboveThreshold[i] = asymmetryMetric[i] > threshold ? 1 : 0;
  }

  // エピソード化
  const { labeledArray, numFeatures } = label1d(aboveThreshold);
  const spasmMask = new Uint8Array(n);
  const durations = [];
  let episodeCount = 0;

  for (let lbl = 1; lbl <= numFeatures; lbl++) {
    let duration = 0;
    for (let i = 0; i < n; i++) {
      if (labeledArray[i] === lbl) duration++;
    }
    if (duration >= minDurationFrames) {
      episodeCount++;
      durations.push(duration);
      for (let i = 0; i < n; i++) {
        if (labeledArray[i] === lbl) spasmMask[i] = 1;
      }
    }
  }

  return { meanVal, stdVal, threshold, episodeCount, spasmMask, durations };
}
