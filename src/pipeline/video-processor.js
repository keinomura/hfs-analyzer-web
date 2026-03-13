/**
 * 動画フレーム抽出
 *
 * HTML5 <video> + Canvas API を用いて動画からフレームを1枚ずつ抽出し、
 * MediaPipe → 指標計算のパイプラインに流す。
 *
 * Python版 cv2.VideoCapture のフレームごと処理に相当。
 */

import { initializeLandmarker, extractLandmarks, disposeLandmarker } from './landmark-extractor.js';
import { extractMetricsFromLandmarks } from './eye-metrics.js';
import { DEFAULT_FPS } from '../constants.js';

/**
 * 動画ファイルを処理して全フレームの指標を抽出する
 *
 * @param {File} videoFile - 動画ファイル
 * @param {number} fps - フレームレート
 * @param {function} onProgress - 進捗コールバック (current, total, step)
 * @returns {Promise<{
 *   rightAperture: Float64Array,
 *   leftAperture: Float64Array,
 *   mar: Float64Array,
 *   timestamps: Float64Array,
 *   width: number,
 *   height: number,
 *   totalFrames: number
 * }>}
 */
export async function processVideo(videoFile, fps = DEFAULT_FPS, onProgress = null) {
  // MediaPipe初期化
  if (onProgress) onProgress(0, 0, 'Initializing MediaPipe...');
  await initializeLandmarker();

  // 動画要素を作成
  const video = document.createElement('video');
  video.muted = true;
  video.playsInline = true;
  const url = URL.createObjectURL(videoFile);
  video.src = url;

  // メタデータの読み込みを待つ
  await new Promise((resolve, reject) => {
    video.onloadedmetadata = resolve;
    video.onerror = () => reject(new Error('Failed to load video'));
  });

  const width = video.videoWidth;
  const height = video.videoHeight;
  const duration = video.duration;
  const totalFrames = Math.floor(duration * fps);

  // Canvas作成
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // 結果配列を事前確保
  const rightAperture = new Float64Array(totalFrames);
  const leftAperture = new Float64Array(totalFrames);
  const mar = new Float64Array(totalFrames);
  const timestamps = new Float64Array(totalFrames);

  // フレームごとに処理
  const BATCH_SIZE = 10; // UIブロックを防ぐため10フレームずつ

  for (let frameIdx = 0; frameIdx < totalFrames; frameIdx++) {
    const time = frameIdx / fps;
    timestamps[frameIdx] = time;

    // フレームをシーク
    video.currentTime = time;
    await new Promise(resolve => {
      video.onseeked = resolve;
    });

    // Canvasに描画
    ctx.drawImage(video, 0, 0, width, height);

    // MediaPipeでランドマーク抽出
    const landmarks = extractLandmarks(video, Math.round(time * 1000), width, height);

    if (landmarks) {
      const metrics = extractMetricsFromLandmarks(landmarks);
      rightAperture[frameIdx] = metrics.rightEAR;
      leftAperture[frameIdx] = metrics.leftEAR;
      mar[frameIdx] = metrics.mar;
    } else {
      rightAperture[frameIdx] = NaN;
      leftAperture[frameIdx] = NaN;
      mar[frameIdx] = NaN;
    }

    // 進捗コールバック（バッチごと）
    if (onProgress && (frameIdx % BATCH_SIZE === 0 || frameIdx === totalFrames - 1)) {
      onProgress(frameIdx + 1, totalFrames, 'Processing frames...');
      // UIスレッドに制御を返す
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }

  // クリーンアップ
  URL.revokeObjectURL(url);
  disposeLandmarker();

  return { rightAperture, leftAperture, mar, timestamps, width, height, totalFrames };
}
