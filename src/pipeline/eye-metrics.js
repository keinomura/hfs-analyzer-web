/**
 * 眼裂・口指標の計算
 *
 * Python版 comprehensive_eye_metrics.py:88-213 から移植。
 */

import {
  RIGHT_EYE_EAR, LEFT_EYE_EAR,
  MOUTH_TOP, MOUTH_BOTTOM, MOUTH_LEFT, MOUTH_RIGHT,
} from '../constants.js';

/**
 * 2点間のユークリッド距離を計算
 *
 * @param {number[]} p1 - [x, y]
 * @param {number[]} p2 - [x, y]
 * @returns {number} 距離
 */
function dist(p1, p2) {
  return Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
}

/**
 * EAR (Eye Aspect Ratio) を計算
 *
 * 6点法: [P1=外眼角, P2=上瞼外, P3=上瞼内, P4=内眼角, P5=下瞼内, P6=下瞼外]
 * EAR = (|P2-P6| + |P3-P5|) / 2
 *
 * Python版: comprehensive_eye_metrics.py:88-111
 *
 * @param {number[][]} eyePoints - 6個のランドマーク座標 [[x,y], ...]
 * @returns {number} 眼裂高さ（ピクセル）
 */
export function calculateEAR(eyePoints) {
  if (eyePoints.length !== 6) return 0.0;

  const [p1, p2, p3, p4, p5, p6] = eyePoints;
  const dist1 = dist(p2, p6); // 上瞼外 - 下瞼外
  const dist2 = dist(p3, p5); // 上瞼内 - 下瞼内
  return (dist1 + dist2) / 2.0;
}

/**
 * MAR (Mouth Aspect Ratio) を計算
 *
 * MAR = width / height
 * 口すぼめ時に MAR が低下する（幅が狭くなり高さが大きくなる）。
 *
 * Python版: comprehensive_eye_metrics.py:190-213
 *
 * @param {Object} mouthLandmarks - { top: [x,y], bottom: [x,y], left: [x,y], right: [x,y] }
 * @returns {number} MAR値（無次元比）
 */
export function calculateMAR(mouthLandmarks) {
  const { top, bottom, left, right } = mouthLandmarks;
  const width = dist(left, right);
  const height = dist(top, bottom);

  if (height < 1e-6) return 0.0;
  return width / height;
}

/**
 * フレームのランドマーク配列から眼裂・口指標を抽出
 *
 * @param {number[][]} landmarks - 478個のランドマーク座標 [[x,y], ...]
 * @returns {{ rightEAR: number, leftEAR: number, mar: number }}
 */
export function extractMetricsFromLandmarks(landmarks) {
  // 右眼EAR
  const rightPoints = RIGHT_EYE_EAR.map(i => landmarks[i]);
  const rightEAR = calculateEAR(rightPoints);

  // 左眼EAR
  const leftPoints = LEFT_EYE_EAR.map(i => landmarks[i]);
  const leftEAR = calculateEAR(leftPoints);

  // MAR
  const mouthLandmarks = {
    top: landmarks[MOUTH_TOP],
    bottom: landmarks[MOUTH_BOTTOM],
    left: landmarks[MOUTH_LEFT],
    right: landmarks[MOUTH_RIGHT],
  };
  const mar = calculateMAR(mouthLandmarks);

  return { rightEAR, leftEAR, mar };
}
