export const messages = {
  en: {
    app: {
      title: 'HFS Analyzer - Hemifacial Spasm Quantification',
    },
    language: {
      label: 'Language',
      en: 'English',
      ja: 'Japanese',
    },
    header: {
      title: 'HFS Analyzer',
      subtitle: 'Automated tonic-clonic decomposition of hemifacial spasm severity from smartphone video',
      privacy: 'All processing runs locally - no data leaves your device',
    },
    notice: {
      title: 'Usage Notice',
      items: {
        notDiagnostic: 'This tool is for research/support use and is not a standalone diagnostic device.',
        captureCondition: 'Use clear frontal face video with stable framing and adequate lighting.',
        reviewRequired: 'Always interpret outputs together with clinical findings and physician judgment.',
        privacy: 'Do not include personally identifiable information in filenames or exported data when sharing.',
      },
    },
    legal: {
      title: 'Copyright, DOI, and Terms',
      items: {
        copyright: 'Copyright (c) 2026 Kei Nomura and contributors. Released under the MIT License.',
        doiLabel: 'Method reference DOI (HFS_analysis_app):',
        terms: 'Use is limited to research and clinical decision-support. Not a standalone diagnostic device.',
        targetUsers: 'Intended users are clinicians and researchers; patient self-interpretation is not an intended use.',
      },
    },
    upload: {
      dropPromptHtml: '<strong>Drop video file here</strong> or click to browse',
      accepts: 'Accepts .mp4, .mov, .avi',
    },
    settings: {
      summary: 'Advanced Settings',
      fps: {
        label: 'FPS',
        tooltip: 'The frame rate (frames per second) at which the video should be processed. This should match the source video\'s frame rate for accurate analysis.',
      },
      tonicWindow: {
        label: 'Tonic Window (s)',
        tooltip: 'The size of the moving average window (in seconds) used to calculate the slow-moving tonic baseline of the signal.',
      },
      threshold: {
        label: 'Threshold (xSD)',
        tooltip: 'The threshold for detecting a clonic spasm. A spasm is detected if the signal exceeds this many multiples of its standard deviation.',
      },
      minDuration: {
        label: 'Min Duration (frames)',
        tooltip: 'The minimum number of consecutive frames a spasm must last to be counted as a valid episode.',
      },
      transition: {
        label: 'Transition (s)',
        tooltip: 'The duration (in seconds) at the beginning and end of a pursing event that is excluded from spasm analysis to avoid artifacts from the movement itself.',
      },
    },
    results: {
      title: 'Analysis Results',
      side: {
        left: 'LEFT',
        right: 'RIGHT',
      },
      cards: {
        affectedSide: {
          label: 'Affected Side',
          tooltip: 'The side of the face (left or right) determined to be more affected by spasms.',
        },
        cvRatio: {
          label: 'CV Ratio',
          tooltip: 'Coefficient of Variation Ratio. The ratio of eye-opening variability between the affected and healthy sides. Higher values suggest more instability on the affected side.',
        },
        pursingEpisodes: {
          label: 'Pursing Episodes',
          tooltip: 'Total number of times mouth pursing or similar synkinetic movement was detected.',
        },
        pursingDuration: {
          label: 'Pursing Duration',
          tooltip: 'Total duration in seconds of all detected mouth pursing events.',
        },
        tonicMean: {
          label: 'Tonic Mean',
          tooltip: 'The average baseline closure of the eye on the affected side (tonic component). A higher value indicates more constant, underlying spasm.',
        },
        tonicElevation: {
          label: 'Tonic Elevation',
          tooltip: 'The increase in the tonic (baseline) component during mouth pursing, indicating synkinesis.',
        },
        spasmEpisodes: {
          label: 'Spasm Episodes',
          tooltip: 'Total number of fast, twitch-like (clonic) spasms detected during pursing events.',
        },
        spasmRate: {
          label: 'Spasm Rate',
          tooltip: 'The frequency of clonic spasms, measured in episodes per second during pursing events.',
        },
        spasmCoverage: {
          label: 'Spasm Coverage',
          tooltip: 'The percentage of time that clonic spasms were active during pursing events.',
        },
        meanAmplitude: {
          label: 'Mean Amplitude',
          tooltip: 'The average strength (peak intensity) of the clonic spasm twitches.',
        },
        meanDuration: {
          label: 'Mean Duration',
          tooltip: 'The average length of a single clonic spasm twitch, in milliseconds.',
        },
      },
      units: {
        seconds: 's',
        perSecond: '/sec',
        milliseconds: 'ms',
      },
      charts: {
        apertureTitle: 'Eye Aperture (Healthy vs Affected)',
        rdTitle: 'Relative Difference + Tonic Baseline',
        clonicTitle: 'Clonic Component + Spasm Detection',
        pursingTitle: 'Mouth Pursing (MAR)',
      },
    },
    export: {
      downloadCsv: 'Download CSV',
    },
    progress: {
      initializingMediaPipe: 'Initializing MediaPipe...',
      processingFrames: 'Processing frames...',
      interpolatingMissingFrames: 'Interpolating missing frames...',
      detectingMouthPursing: 'Detecting mouth pursing...',
      determiningAffectedSide: 'Determining affected side...',
      computingAsymmetryMetrics: 'Computing asymmetry metrics...',
      detectingBlinks: 'Detecting blinks...',
      separatingTonicClonic: 'Separating tonic/clonic components...',
      detectingSpasmEpisodes: 'Detecting spasm episodes...',
      computingMetrics: 'Computing metrics...',
      complete: 'Analysis complete!',
      errorPrefix: 'Error: {message}',
    },
    chart: {
      dataset: {
        healthy: 'Healthy ({side})',
        affected: 'Affected ({side})',
        rd: 'RD (Relative Difference)',
        tonic: 'Tonic Baseline',
        clonic: 'Clonic Component',
        mar: 'MAR (Mouth Aspect Ratio)',
      },
      axis: {
        timeSeconds: 'Time (s)',
        aperturePx: 'Aperture (px)',
        relativeDifference: 'Relative Difference',
        clonicComponent: 'Clonic Component',
        mouthAspectRatio: 'Mouth Aspect Ratio',
      },
      thresholdLabel: 'Threshold: {value}',
    },
  },
  ja: {
    app: {
      title: 'HFS Analyzer - 片側顔面けいれん定量化',
    },
    language: {
      label: '言語',
      en: 'English',
      ja: '日本語',
    },
    header: {
      title: 'HFS Analyzer',
      subtitle: 'スマホ動画から片側顔面けいれんの重症度を自動で tonic/clonic 分解します',
      privacy: '処理はすべてローカル実行され、データは端末外に送信されません',
    },
    notice: {
      title: '使用上の注意',
      items: {
        notDiagnostic: '本ツールは研究・診療支援用途であり、単独で診断を確定する機器ではありません。',
        captureCondition: '顔が正面で、手ぶれが少なく、十分な照明条件の動画を使用してください。',
        reviewRequired: '出力結果は必ず臨床所見および医師の判断とあわせて解釈してください。',
        privacy: '共有時はファイル名や出力データに個人を特定できる情報を含めないでください。',
      },
    },
    legal: {
      title: '著作権・DOI・使用許諾条件',
      items: {
        copyright: 'Copyright (c) 2026 Kei Nomura and contributors。MIT License で公開しています。',
        doiLabel: '手法参照 DOI（HFS_analysis_app）:',
        terms: '研究および診療支援用途に限定して使用してください。単独診断を目的とした医療機器ではありません。',
        targetUsers: '想定利用者は医療従事者・研究者です。患者本人による自己解釈用途は想定していません。',
      },
    },
    upload: {
      dropPromptHtml: '<strong>ここに動画をドロップ</strong> またはクリックして選択',
      accepts: '.mp4, .mov, .avi に対応',
    },
    settings: {
      summary: '詳細設定',
      fps: {
        label: 'FPS',
        tooltip: '動画を処理するフレームレートです。正確な解析のため、元動画のフレームレートに合わせてください。',
      },
      tonicWindow: {
        label: 'Tonic 窓幅 (秒)',
        tooltip: '信号の緩やかな tonic ベースラインを計算するための移動平均窓の長さ（秒）です。',
      },
      threshold: {
        label: '閾値 (xSD)',
        tooltip: 'clonic 痙攣を検出する閾値です。信号が標準偏差の何倍を超えたら痙攣とみなすかを指定します。',
      },
      minDuration: {
        label: '最小持続 (フレーム)',
        tooltip: '痙攣として有効カウントする最小連続フレーム数です。',
      },
      transition: {
        label: '遷移除外 (秒)',
        tooltip: '口すぼめ開始/終了付近のアーチファクトを避けるために解析から除外する時間（秒）です。',
      },
    },
    results: {
      title: '解析結果',
      side: {
        left: '左',
        right: '右',
      },
      cards: {
        affectedSide: {
          label: '患側',
          tooltip: '痙攣の影響が強いと判定された顔面側（左/右）です。',
        },
        cvRatio: {
          label: 'CV 比',
          tooltip: '変動係数比。患側と健側の開眼変動の比率で、値が高いほど患側の不安定性が高いことを示します。',
        },
        pursingEpisodes: {
          label: '口すぼめ回数',
          tooltip: '口すぼめまたは類似する共同運動が検出された総回数です。',
        },
        pursingDuration: {
          label: '口すぼめ時間',
          tooltip: '検出された口すぼめイベントの合計時間（秒）です。',
        },
        tonicMean: {
          label: 'Tonic 平均',
          tooltip: '患側の眼瞼閉鎖の基線レベル（tonic 成分）の平均値です。高いほど持続的な痙攣傾向を示します。',
        },
        tonicElevation: {
          label: 'Tonic 上昇',
          tooltip: '口すぼめ時に tonic 基線がどれだけ上昇したかを示し、共同運動の程度を表します。',
        },
        spasmEpisodes: {
          label: '痙攣エピソード',
          tooltip: '口すぼめ中に検出された速い twitch 様（clonic）痙攣の総数です。',
        },
        spasmRate: {
          label: '痙攣頻度',
          tooltip: '口すぼめ中における clonic 痙攣の発生頻度（1秒あたり）です。',
        },
        spasmCoverage: {
          label: '痙攣カバレッジ',
          tooltip: '口すぼめ中に clonic 痙攣が活動していた時間割合（%）です。',
        },
        meanAmplitude: {
          label: '平均振幅',
          tooltip: 'clonic 痙攣 twitch の平均強度（ピーク）です。',
        },
        meanDuration: {
          label: '平均持続',
          tooltip: '1回の clonic 痙攣 twitch の平均持続時間（ミリ秒）です。',
        },
      },
      units: {
        seconds: '秒',
        perSecond: '/秒',
        milliseconds: 'ms',
      },
      charts: {
        apertureTitle: '眼瞼開度（健側 vs 患側）',
        rdTitle: '相対差 + Tonic ベースライン',
        clonicTitle: 'Clonic 成分 + 痙攣検出',
        pursingTitle: '口すぼめ（MAR）',
      },
    },
    export: {
      downloadCsv: 'CSV をダウンロード',
    },
    progress: {
      initializingMediaPipe: 'MediaPipe を初期化中...',
      processingFrames: 'フレームを処理中...',
      interpolatingMissingFrames: '欠損フレームを補間中...',
      detectingMouthPursing: '口すぼめを検出中...',
      determiningAffectedSide: '患側を判定中...',
      computingAsymmetryMetrics: '非対称性指標を計算中...',
      detectingBlinks: '瞬きを検出中...',
      separatingTonicClonic: 'tonic/clonic 成分を分離中...',
      detectingSpasmEpisodes: '痙攣エピソードを検出中...',
      computingMetrics: 'メトリクスを計算中...',
      complete: '解析が完了しました',
      errorPrefix: 'エラー: {message}',
    },
    chart: {
      dataset: {
        healthy: '健側 ({side})',
        affected: '患側 ({side})',
        rd: 'RD（相対差）',
        tonic: 'Tonic ベースライン',
        clonic: 'Clonic 成分',
        mar: 'MAR（口唇アスペクト比）',
      },
      axis: {
        timeSeconds: '時間 (秒)',
        aperturePx: '開度 (px)',
        relativeDifference: '相対差',
        clonicComponent: 'Clonic 成分',
        mouthAspectRatio: '口唇アスペクト比',
      },
      thresholdLabel: '閾値: {value}',
    },
  },
};
