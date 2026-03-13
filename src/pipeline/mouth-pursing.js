/**
 * 2パス口すぼめ検出
 *
 * Python版: comprehensive_eye_metrics.py:384-441
 *
 * パス1: MAR移動平均ベースラインからの減少率で閾値
 * パス2: ギャップ充填 + 最小持続時間フィルタ
 */

import { uniformFilter1d } from '../dsp/uniform-filter.js';
import { label1d } from '../dsp/label.js';
import {
  PURSING_BASELINE_WINDOW_SEC,
  PURSING_REDUCTION_THRESHOLD,
  PURSING_GAP_SEC,
  PURSING_MIN_DURATION_SEC,
} from '../constants.js';

/**
 * MAR時系列から口すぼめ区間を検出
 *
 * @param {Float64Array} marArray - MAR値の時系列
 * @param {number} fps - フレームレート
 * @returns {Uint8Array} 口すぼめマスク (1=口すぼめ, 0=通常)
 */
export function detectMouthPursing(marArray, fps) {
  const n = marArray.length;

  // パス1: ベースラインからの減少率で閾値
  const baselineWindow = Math.round(PURSING_BASELINE_WINDOW_SEC * fps);
  const baseline = uniformFilter1d(marArray, baselineWindow);

  const raw = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    if (baseline[i] > 1e-6) {
      const reduction = (baseline[i] - marArray[i]) / baseline[i];
      raw[i] = reduction > PURSING_REDUCTION_THRESHOLD ? 1 : 0;
    }
  }

  // パス2a: ギャップ充填 (2秒以下のギャップを埋める)
  const maxGapFrames = Math.round(PURSING_GAP_SEC * fps);
  const filled = new Uint8Array(raw);

  const { labeledArray: rawLabels, numFeatures: rawNum } = label1d(raw);
  // ギャップを検出するために、非活性区間もラベリング
  const inverted = new Uint8Array(n);
  for (let i = 0; i < n; i++) inverted[i] = filled[i] ? 0 : 1;
  const { labeledArray: gapLabels, numFeatures: gapNum } = label1d(inverted);

  for (let lbl = 1; lbl <= gapNum; lbl++) {
    let count = 0;
    let start = n;
    let end = -1;
    for (let i = 0; i < n; i++) {
      if (gapLabels[i] === lbl) {
        count++;
        if (i < start) start = i;
        if (i > end) end = i;
      }
    }
    // ギャップの前後が口すぼめ区間の場合のみ充填
    if (count <= maxGapFrames && start > 0 && end < n - 1) {
      if (filled[start - 1] === 1 && filled[end + 1] === 1) {
        for (let i = start; i <= end; i++) filled[i] = 1;
      }
    }
  }

  // パス2b: 最小持続時間フィルタ (2秒未満を除去)
  const minDurationFrames = Math.round(PURSING_MIN_DURATION_SEC * fps);
  const result = new Uint8Array(n);
  const { labeledArray: finalLabels, numFeatures: finalNum } = label1d(filled);

  for (let lbl = 1; lbl <= finalNum; lbl++) {
    let count = 0;
    for (let i = 0; i < n; i++) {
      if (finalLabels[i] === lbl) count++;
    }
    if (count >= minDurationFrames) {
      for (let i = 0; i < n; i++) {
        if (finalLabels[i] === lbl) result[i] = 1;
      }
    }
  }

  return result;
}
