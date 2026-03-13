/**
 * 口すぼめ遷移区間の除外マスク
 *
 * Python版: compare_case2_longitudinal.py:29-65
 *
 * Savitzky-Golayフィルタ（3秒窓）によるTonic抽出は、口すぼめ開始・終了時の
 * 急峻なRD変化を追従できず、Clonic残差にフィルタ漏洩アーチファクトを生む。
 * 口すぼめ境界の±transition_sec秒間をマスクし、Clonic検出の偽陽性を抑制する。
 */

import { TRANSITION_SEC } from '../constants.js';

/**
 * 遷移区間除外マスクを生成
 *
 * @param {Uint8Array} pursingMask - 口すぼめマスク (1=口すぼめ, 0=通常)
 * @param {number} [fps=60.0] - フレームレート
 * @param {number} [transitionSec=1.0] - 遷移区間の片側幅（秒）
 * @returns {Uint8Array|null} 遷移区間マスク (1=除外, 0=使用)。pursingMaskがnullの場合null。
 */
export function createTransitionMask(pursingMask, fps = 60.0, transitionSec = TRANSITION_SEC) {
  if (!pursingMask) return null;

  const n = pursingMask.length;
  const transitionFrames = Math.round(transitionSec * fps);
  const mask = new Uint8Array(n);

  // 口すぼめの開始・終了境界を検出
  for (let i = 1; i < n; i++) {
    const diff = pursingMask[i] - pursingMask[i - 1];
    if (diff !== 0) {
      // 0→1 (開始) または 1→0 (終了) の境界
      const start = Math.max(0, i - transitionFrames);
      const end = Math.min(n, i + transitionFrames);
      for (let j = start; j < end; j++) {
        mask[j] = 1;
      }
    }
  }

  return mask;
}
