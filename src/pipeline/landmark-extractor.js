/**
 * MediaPipe FaceLandmarker ラッパー
 *
 * @mediapipe/tasks-vision の FaceLandmarker を初期化し、
 * 動画フレームからランドマーク座標を抽出する。
 */

import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

let faceLandmarker = null;

/**
 * FaceLandmarker を初期化する
 *
 * @returns {Promise<FaceLandmarker>}
 */
export async function initializeLandmarker() {
  if (faceLandmarker) return faceLandmarker;

  const vision = await FilesetResolver.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
  );

  faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
      delegate: 'GPU',
    },
    runningMode: 'VIDEO',
    numFaces: 1,
    minFaceDetectionConfidence: 0.5,
    minFacePresenceConfidence: 0.5,
    minTrackingConfidence: 0.5,
    outputFaceBlendshapes: false,
    outputFacialTransformationMatrixes: false,
  });

  return faceLandmarker;
}

/**
 * 動画フレームからランドマーク座標を抽出
 *
 * @param {HTMLVideoElement|HTMLCanvasElement} source - 入力フレーム
 * @param {number} timestampMs - フレームのタイムスタンプ（ミリ秒）
 * @param {number} width - 動画の幅（ピクセル）
 * @param {number} height - 動画の高さ（ピクセル）
 * @returns {number[][]|null} ランドマーク座標 [[x,y], ...] (ピクセル座標) またはnull
 */
export function extractLandmarks(source, timestampMs, width, height) {
  if (!faceLandmarker) return null;

  const result = faceLandmarker.detectForVideo(source, timestampMs);

  if (!result.faceLandmarks || result.faceLandmarks.length === 0) {
    return null;
  }

  // 正規化座標 [0,1] → ピクセル座標に変換
  // Python版: comprehensive_eye_metrics.py:298-303
  const landmarks = result.faceLandmarks[0].map(lm => [
    Math.round(lm.x * width),
    Math.round(lm.y * height),
  ]);

  return landmarks;
}

/**
 * FaceLandmarker を破棄する
 */
export function disposeLandmarker() {
  if (faceLandmarker) {
    faceLandmarker.close();
    faceLandmarker = null;
  }
}
