/**
 * 1Dメディアンフィルタ
 *
 * scipy.signal.medfilt に相当。
 * 各位置の周囲 kernelSize 個の値の中央値を返す。
 *
 * @param {Float64Array|number[]} signal - 入力信号
 * @param {number} kernelSize - カーネルサイズ（奇数）
 * @returns {Float64Array} フィルタ適用後の信号
 */
export function medianFilter(signal, kernelSize = 5) {
  const n = signal.length;
  const result = new Float64Array(n);
  const half = Math.floor(kernelSize / 2);

  for (let i = 0; i < n; i++) {
    const window = [];
    for (let j = i - half; j <= i + half; j++) {
      const idx = Math.max(0, Math.min(n - 1, j));
      window.push(signal[idx]);
    }
    window.sort((a, b) => a - b);
    result[i] = window[Math.floor(window.length / 2)];
  }

  return result;
}
