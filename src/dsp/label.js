/**
 * 1D連結成分ラベリング
 *
 * scipy.ndimage.label の1次元版に相当。
 * boolean配列中の連続するtrue区間に一意のラベル(1, 2, 3...)を付与する。
 *
 * @param {Uint8Array|boolean[]} booleanArray - 入力boolean配列 (true/1 = 活性)
 * @returns {{ labeledArray: Int32Array, numFeatures: number }}
 *   labeledArray: 各要素にラベル番号 (0=非活性, 1,2,...=各領域)
 *   numFeatures: 検出された連結領域の総数
 *
 * 例:
 *   label1d([0,1,1,0,1,0]) => { labeledArray: [0,1,1,0,2,0], numFeatures: 2 }
 */
export function label1d(booleanArray) {
  const n = booleanArray.length;
  const labeled = new Int32Array(n);
  let currentLabel = 0;

  for (let i = 0; i < n; i++) {
    if (booleanArray[i]) {
      if (i === 0 || !booleanArray[i - 1]) {
        currentLabel++;
      }
      labeled[i] = currentLabel;
    }
    // labeled[i] は Int32Array なので初期値0（非活性）
  }

  return { labeledArray: labeled, numFeatures: currentLabel };
}
