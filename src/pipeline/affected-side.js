/**
 * CV比による患側自動判定
 *
 * Python版: analyze_eye_asymmetry.py:38-107
 *
 * 理論的根拠:
 *   HFSは片側性疾患 → 患側は痙攣により変動が大きい
 *   変動係数 CV = (標準偏差 / 平均) × 100%
 *   CV値が大きい方が患側
 */

/**
 * 配列の平均値を計算
 * @param {Float64Array|number[]} arr
 * @returns {number}
 */
function mean(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) sum += arr[i];
  return sum / arr.length;
}

/**
 * 配列の標準偏差を計算
 * @param {Float64Array|number[]} arr
 * @returns {number}
 */
function std(arr) {
  const m = mean(arr);
  let sumSq = 0;
  for (let i = 0; i < arr.length; i++) {
    const d = arr[i] - m;
    sumSq += d * d;
  }
  return Math.sqrt(sumSq / arr.length);
}

/**
 * 健側・患側を変動係数(CV)に基づいて自動判定
 *
 * @param {Float64Array} rightAperture - 右眼眼裂高さの時系列
 * @param {Float64Array} leftAperture - 左眼眼裂高さの時系列
 * @returns {{
 *   affectedSide: 'left'|'right',
 *   healthySide: 'right'|'left',
 *   affectedCv: number,
 *   healthyCv: number,
 *   cvRatio: number,
 *   healthyAperture: Float64Array,
 *   affectedAperture: Float64Array
 * }}
 */
export function detectAffectedSide(rightAperture, leftAperture) {
  const cvRight = (std(rightAperture) / mean(rightAperture)) * 100;
  const cvLeft = (std(leftAperture) / mean(leftAperture)) * 100;

  let affectedSide, healthySide, affectedCv, healthyCv;
  let healthyAperture, affectedAperture;

  if (cvLeft > cvRight) {
    affectedSide = 'left';
    healthySide = 'right';
    affectedCv = cvLeft;
    healthyCv = cvRight;
    healthyAperture = rightAperture;
    affectedAperture = leftAperture;
  } else {
    affectedSide = 'right';
    healthySide = 'left';
    affectedCv = cvRight;
    healthyCv = cvLeft;
    healthyAperture = leftAperture;
    affectedAperture = rightAperture;
  }

  const cvRatio = affectedCv / healthyCv;

  return {
    affectedSide,
    healthySide,
    affectedCv,
    healthyCv,
    cvRatio,
    healthyAperture,
    affectedAperture,
  };
}
