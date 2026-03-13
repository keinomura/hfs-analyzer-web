/**
 * NaN線形補間
 *
 * numpy の NaN 線形補間に相当。
 * NaN でないデータ点を基に、NaN 区間を線形補間で埋める。
 * 先頭・末尾のNaNは最近傍の有効値で埋める。
 *
 * @param {Float64Array|number[]} signal - NaN を含む可能性のある入力信号
 * @returns {Float64Array} NaN が補間された信号
 */
export function interpolateNaN(signal) {
  const n = signal.length;
  const result = new Float64Array(n);

  // 有効値のインデックスと値を収集
  const validIndices = [];
  const validValues = [];

  for (let i = 0; i < n; i++) {
    if (!isNaN(signal[i]) && isFinite(signal[i])) {
      validIndices.push(i);
      validValues.push(signal[i]);
    }
  }

  // 有効値がない場合は全てゼロ
  if (validIndices.length === 0) {
    return result; // Float64Arrayは初期値0
  }

  // 有効値が1つだけの場合は全て同じ値
  if (validIndices.length === 1) {
    result.fill(validValues[0]);
    return result;
  }

  for (let i = 0; i < n; i++) {
    if (!isNaN(signal[i]) && isFinite(signal[i])) {
      result[i] = signal[i];
      continue;
    }

    // 先頭のNaN → 最初の有効値で埋める
    if (i < validIndices[0]) {
      result[i] = validValues[0];
      continue;
    }

    // 末尾のNaN → 最後の有効値で埋める
    if (i > validIndices[validIndices.length - 1]) {
      result[i] = validValues[validValues.length - 1];
      continue;
    }

    // 中間のNaN → 線形補間
    // 前後の有効値を二分探索で見つける
    let lo = 0;
    let hi = validIndices.length - 1;
    while (lo < hi - 1) {
      const mid = Math.floor((lo + hi) / 2);
      if (validIndices[mid] <= i) {
        lo = mid;
      } else {
        hi = mid;
      }
    }

    const i0 = validIndices[lo];
    const i1 = validIndices[hi];
    const v0 = validValues[lo];
    const v1 = validValues[hi];
    const t = (i - i0) / (i1 - i0);
    result[i] = v0 + t * (v1 - v0);
  }

  return result;
}
