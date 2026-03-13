/**
 * HFS Analyzer 定数定義
 *
 * MediaPipe Face Mesh ランドマークインデックスおよびアルゴリズムパラメータ。
 * Python版 comprehensive_eye_metrics.py, analyze_hfs_final.py,
 * compare_case2_longitudinal.py から移植。
 */

// ── 眼裂測定用ランドマーク (EAR 6点法) ──
// comprehensive_eye_metrics.py:32-33
export const RIGHT_EYE_EAR = [33, 160, 158, 133, 153, 144];
export const LEFT_EYE_EAR = [362, 385, 387, 263, 373, 380];

// ── 口すぼめ検出用ランドマーク ──
// comprehensive_eye_metrics.py:82-85
export const MOUTH_TOP = 0;
export const MOUTH_BOTTOM = 17;
export const MOUTH_LEFT = 61;
export const MOUTH_RIGHT = 291;

// ── Tonic/Clonic 分離パラメータ ──
// compare_case2_longitudinal.py:83-87
export const TONIC_WINDOW_SEC = 3.0;
export const SAVGOL_POLYORDER = 2;

// ── 瞬き検出パラメータ ──
// analyze_eye_asymmetry.py:241-244
export const BLINK_THRESHOLD_RATIO = 0.5;
export const BLINK_MIN_DURATION = 2;
export const BLINK_MAX_DURATION = 10;
export const BLINK_EXTENSION_FRAMES = 3;

// ── 痙攣検出パラメータ ──
// analyze_hfs_final.py:106-109
export const THRESHOLD_STD = 0.5;
export const MIN_DURATION_FRAMES = 4;

// ── 遷移区間除外パラメータ ──
// compare_case2_longitudinal.py:87
export const TRANSITION_SEC = 1.0;

// ── 口すぼめ検出パラメータ ──
// comprehensive_eye_metrics.py:393-419
export const PURSING_BASELINE_WINDOW_SEC = 10.0;
export const PURSING_REDUCTION_THRESHOLD = 0.07;
export const PURSING_GAP_SEC = 2.0;
export const PURSING_MIN_DURATION_SEC = 2.0;

// ── デフォルトFPS ──
export const DEFAULT_FPS = 60.0;

// ── 数値定数 ──
export const EPSILON = 1e-6;
