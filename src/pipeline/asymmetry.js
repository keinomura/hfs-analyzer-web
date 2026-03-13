/**
 * 非対称性指標の計算
 *
 * Python版: analyze_eye_asymmetry.py:110-178
 */

import { EPSILON } from '../constants.js';

/**
 * 非対称性指標を計算
 *
 * @param {Float64Array} healthyAperture - 健側眼裂高さ（時系列）
 * @param {Float64Array} affectedAperture - 患側眼裂高さ（時系列）
 * @returns {{
 *   absoluteDiff: Float64Array,
 *   relativeDiff: Float64Array,
 *   asymmetryIndex: Float64Array
 * }}
 *
 * relativeDiff: RD = (healthy - affected) / (healthy + epsilon)
 *   範囲: 0-1 (0=対称, 1=患側完全閉鎖)
 *   利点: 撮影条件・個人差を自動補正
 */
export function computeAsymmetryMetrics(healthyAperture, affectedAperture) {
  const n = healthyAperture.length;
  const absoluteDiff = new Float64Array(n);
  const relativeDiff = new Float64Array(n);
  const asymmetryIndex = new Float64Array(n);

  for (let i = 0; i < n; i++) {
    const h = healthyAperture[i];
    const a = affectedAperture[i];

    absoluteDiff[i] = h - a;
    relativeDiff[i] = (h - a) / (h + EPSILON);
    asymmetryIndex[i] = (h - a) / (h + a + EPSILON);
  }

  return { absoluteDiff, relativeDiff, asymmetryIndex };
}
