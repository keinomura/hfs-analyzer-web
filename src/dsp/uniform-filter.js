/**
 * 1D均一移動平均フィルタ
 *
 * scipy.ndimage.uniform_filter1d (mode='nearest') に相当。
 * 境界ではエッジの値を繰り返してパディングする。
 *
 * @param {Float64Array|number[]} signal - 入力信号
 * @param {number} windowSize - 窓幅（フレーム数）
 * @returns {Float64Array} フィルタ適用後の信号
 *
 * 例:
 *   uniformFilter1d([1, 2, 3, 4, 5], 3)
 *   // => [1.333, 2, 3, 4, 4.667] (境界はnearest paddingで拡張)
 */
export function uniformFilter1d(signal, windowSize) {
  const n = signal.length;
  const result = new Float64Array(n);
  const halfWindow = Math.floor(windowSize / 2);

  for (let i = 0; i < n; i++) {
    let sum = 0;
    let count = 0;

    for (let j = i - halfWindow; j <= i + halfWindow; j++) {
      // mode='nearest': 範囲外はエッジ値を使う
      const idx = Math.max(0, Math.min(n - 1, j));
      sum += signal[idx];
      count++;
    }

    result[i] = sum / count;
  }

  return result;
}
