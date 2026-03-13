/**
 * 処理進捗バーUI
 */

/**
 * 進捗表示を更新する
 *
 * @param {number} current - 現在のフレーム番号
 * @param {number} total - 総フレーム数
 * @param {string} stepName - 現在のステップ名
 */
export function updateProgress(current, total, stepName) {
  const section = document.getElementById('progress-section');
  const bar = document.getElementById('progress-bar');
  const text = document.getElementById('progress-text');

  if (!section || !bar || !text) return;

  section.style.display = 'block';

  if (total > 0) {
    const percent = Math.round((current / total) * 100);
    bar.style.width = `${percent}%`;
    text.textContent = `${stepName} (${current} / ${total}) ${percent}%`;
  } else {
    bar.style.width = '0%';
    text.textContent = stepName;
  }
}

/**
 * 進捗表示をリセットする
 */
export function resetProgress() {
  const section = document.getElementById('progress-section');
  const bar = document.getElementById('progress-bar');
  const text = document.getElementById('progress-text');

  if (section) section.style.display = 'none';
  if (bar) bar.style.width = '0%';
  if (text) text.textContent = '';
}

/**
 * 進捗表示を完了状態にする
 *
 * @param {string} [message] - 完了メッセージ
 */
export function completeProgress(message = 'Analysis complete!') {
  const bar = document.getElementById('progress-bar');
  const text = document.getElementById('progress-text');

  if (bar) bar.style.width = '100%';
  if (text) text.textContent = message;
}
