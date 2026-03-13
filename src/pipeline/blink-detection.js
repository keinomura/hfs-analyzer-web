/**
 * 瞬き検出とマスク拡張
 *
 * Python版: analyze_eye_asymmetry.py:241-361
 */

import { label1d } from '../dsp/label.js';
import {
  BLINK_THRESHOLD_RATIO,
  BLINK_MIN_DURATION,
  BLINK_MAX_DURATION,
  BLINK_EXTENSION_FRAMES,
} from '../constants.js';

/**
 * 配列の中央値を計算
 * @param {Float64Array|number[]} arr
 * @returns {number}
 */
function median(arr) {
  const sorted = Array.from(arr).sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

/**
 * 従来法: 健側aperture基準の瞬き検出
 *
 * アルゴリズム:
 *   1. 健側眼裂高さの中央値を計算
 *   2. 中央値 × threshold_ratio を閾値とする
 *   3. 閾値以下に連続して下がる区間を瞬きと判定
 *   4. 持続時間が min_duration ~ max_duration のものを採用
 *
 * @param {Float64Array} aperture - 健側眼裂高さ（時系列）
 * @param {number} [thresholdRatio=0.5] - 閾値比率
 * @param {number} [minDuration=2] - 最小持続フレーム数
 * @param {number} [maxDuration=10] - 最大持続フレーム数
 * @returns {Uint8Array} 瞬きマスク (1=瞬き, 0=開眼)
 */
export function detectBlinksTraditional(
  aperture,
  thresholdRatio = BLINK_THRESHOLD_RATIO,
  minDuration = BLINK_MIN_DURATION,
  maxDuration = BLINK_MAX_DURATION,
) {
  const n = aperture.length;
  const baseline = median(aperture);
  const threshold = baseline * thresholdRatio;

  // 閾値以下の区間を検出
  const belowThreshold = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    belowThreshold[i] = aperture[i] < threshold ? 1 : 0;
  }

  // 連結成分ラベリング
  const { labeledArray, numFeatures } = label1d(belowThreshold);
  const blinkMask = new Uint8Array(n);

  for (let lbl = 1; lbl <= numFeatures; lbl++) {
    let duration = 0;
    for (let i = 0; i < n; i++) {
      if (labeledArray[i] === lbl) duration++;
    }
    if (duration >= minDuration && duration <= maxDuration) {
      for (let i = 0; i < n; i++) {
        if (labeledArray[i] === lbl) blinkMask[i] = 1;
      }
    }
  }

  return blinkMask;
}

/**
 * 瞬きマスクを前後に拡張する
 *
 * 瞬き区間のみを削除すると、瞬き開始・終了の過渡期が残り、
 * 痙攣検出の閾値計算に悪影響を与える。
 *
 * @param {Uint8Array} blinkMask - 元の瞬きマスク
 * @param {number} [beforeFrames=3] - 瞬き開始前に拡張するフレーム数
 * @param {number} [afterFrames=3] - 瞬き終了後に拡張するフレーム数
 * @returns {Uint8Array} 拡張後のマスク
 */
export function extendBlinkMask(
  blinkMask,
  beforeFrames = BLINK_EXTENSION_FRAMES,
  afterFrames = BLINK_EXTENSION_FRAMES,
) {
  const n = blinkMask.length;
  const { labeledArray, numFeatures } = label1d(blinkMask);
  const extended = new Uint8Array(n);

  for (let lbl = 1; lbl <= numFeatures; lbl++) {
    let start = n;
    let end = -1;
    for (let i = 0; i < n; i++) {
      if (labeledArray[i] === lbl) {
        if (i < start) start = i;
        if (i > end) end = i;
      }
    }

    const extStart = Math.max(0, start - beforeFrames);
    const extEnd = Math.min(n - 1, end + afterFrames);
    for (let i = extStart; i <= extEnd; i++) {
      extended[i] = 1;
    }
  }

  return extended;
}
