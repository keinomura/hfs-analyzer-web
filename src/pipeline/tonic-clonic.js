/**
 * Tonic/Clonic成分分離
 *
 * Python版: separate_tonic_clonic.py:38-69
 *
 * Savitzky-GolayフィルタでTonic成分（ベースライン）を抽出し、
 * 元信号からTonicを引いてClonic成分を得る。
 */

import { savgolFilter } from '../dsp/savitzky-golay.js';
import { TONIC_WINDOW_SEC, SAVGOL_POLYORDER } from '../constants.js';

/**
 * Tonic成分（ベースライン）を抽出
 *
 * @param {Float64Array} signal - 入力信号（RD）
 * @param {number} [windowSeconds=3.0] - フィルタ窓幅（秒）
 * @param {number} [fps=60.0] - フレームレート
 * @returns {Float64Array} Tonic成分
 */
export function extractTonicBaseline(signal, windowSeconds = TONIC_WINDOW_SEC, fps = 60.0) {
  let windowFrames = Math.round(windowSeconds * fps);
  // Savitzky-Golayは奇数窓が必要
  if (windowFrames % 2 === 0) windowFrames += 1;

  return savgolFilter(signal, windowFrames, SAVGOL_POLYORDER);
}

/**
 * Tonic/Clonic分離を実行
 *
 * @param {Float64Array} rd - Relative Difference 時系列
 * @param {number} [windowSeconds=3.0] - Tonic窓幅（秒）
 * @param {number} [fps=60.0] - フレームレート
 * @returns {{ tonic: Float64Array, clonic: Float64Array }}
 */
export function separateTonicClonic(rd, windowSeconds = TONIC_WINDOW_SEC, fps = 60.0) {
  const tonic = extractTonicBaseline(rd, windowSeconds, fps);
  const clonic = new Float64Array(rd.length);
  for (let i = 0; i < rd.length; i++) {
    clonic[i] = rd[i] - tonic[i];
  }
  return { tonic, clonic };
}
