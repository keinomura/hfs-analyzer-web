/**
 * CSV生成・ダウンロード
 *
 * 解析結果をCSVファイルとしてダウンロードする。
 */

/**
 * 解析結果をCSV文字列に変換
 *
 * @param {Object} data - 解析結果データ
 * @param {Float64Array} data.timestamps - 時刻（秒）
 * @param {Float64Array} data.rightAperture - 右眼眼裂高さ
 * @param {Float64Array} data.leftAperture - 左眼眼裂高さ
 * @param {Float64Array} data.mar - MAR値
 * @param {Uint8Array} data.pursingMask - 口すぼめマスク
 * @param {Float64Array} data.rd - Relative Difference
 * @param {Float64Array} data.rdTonic - Tonic成分
 * @param {Float64Array} data.rdClonic - Clonic成分
 * @param {Uint8Array} data.blinkMask - 瞬きマスク
 * @param {Uint8Array} data.spasmMask - 痙攣マスク
 * @param {string} data.affectedSide - 患側
 * @returns {string} CSV文字列
 */
export function generateCSV(data) {
  const headers = [
    'frame',
    'time_s',
    'right_aperture_px',
    'left_aperture_px',
    'mar',
    'mouth_pursing',
    'relative_diff',
    'rd_tonic',
    'rd_clonic',
    'blink_mask',
    'spasm_mask',
    'affected_side',
  ];

  const rows = [headers.join(',')];
  const n = data.timestamps.length;

  for (let i = 0; i < n; i++) {
    const row = [
      i,
      data.timestamps[i].toFixed(4),
      data.rightAperture[i].toFixed(2),
      data.leftAperture[i].toFixed(2),
      data.mar[i].toFixed(4),
      data.pursingMask ? data.pursingMask[i] : 0,
      data.rd ? data.rd[i].toFixed(6) : '',
      data.rdTonic ? data.rdTonic[i].toFixed(6) : '',
      data.rdClonic ? data.rdClonic[i].toFixed(6) : '',
      data.blinkMask ? data.blinkMask[i] : 0,
      data.spasmMask ? data.spasmMask[i] : 0,
      data.affectedSide || '',
    ];
    rows.push(row.join(','));
  }

  return rows.join('\n');
}

/**
 * CSV文字列をファイルとしてダウンロードする
 *
 * @param {string} csvContent - CSV文字列
 * @param {string} [filename='hfs_analysis.csv'] - ファイル名
 */
export function downloadCSV(csvContent, filename = 'hfs_analysis.csv') {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();

  // クリーンアップ
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}
