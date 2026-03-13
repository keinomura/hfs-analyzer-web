/**
 * ドラッグ&ドロップ動画アップロードUI
 */

/**
 * アップロードUIを初期化する
 *
 * @param {HTMLElement} container - アップロードゾーンのコンテナ要素
 * @param {function} onFileSelected - ファイル選択時のコールバック (File) => void
 */
export function initUpload(container, onFileSelected) {
  const zone = container.querySelector('#upload-zone');
  const input = container.querySelector('#file-input');

  // クリックでファイル選択
  zone.addEventListener('click', () => input.click());

  // ファイル選択
  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) onFileSelected(file);
  });

  // ドラッグ&ドロップ
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('drag-over');
  });

  zone.addEventListener('dragleave', () => {
    zone.classList.remove('drag-over');
  });

  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      onFileSelected(file);
    }
  });
}
