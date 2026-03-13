/**
 * Savitzky-Golay フィルタラッパー
 *
 * scipy.signal.savgol_filter に相当。
 * ml-savitzky-golay パッケージを使用。
 *
 * @param {Float64Array|number[]} signal - 入力信号
 * @param {number} windowLength - 窓幅（フレーム数、奇数）
 * @param {number} polyorder - 多項式次数
 * @returns {Float64Array} フィルタ適用後の信号
 */
import savitzkyGolay from 'ml-savitzky-golay';

export function savgolFilter(signal, windowLength, polyorder) {
  // 奇数にする
  if (windowLength % 2 === 0) {
    windowLength += 1;
  }

  // 信号長がwindowLengthより短い場合のガード
  if (signal.length < windowLength) {
    return new Float64Array(signal);
  }

  const result = savitzkyGolay(Array.from(signal), 1, {
    windowSize: windowLength,
    polynomial: polyorder,
    derivative: 0,
    pad: 'pre',
    padValue: 'replicate',
  });

  return new Float64Array(result);
}
