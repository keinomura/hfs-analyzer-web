# HFS Analyzer Web

[![Public App](https://img.shields.io/badge/App-hfs--analysis.klabo--med.com-2563eb)](https://hfs-analysis.klabo-med.com)
[![Method DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.18845312.svg)](https://doi.org/10.5281/zenodo.18845312)

Browser-based automated quantification of hemifacial spasm (HFS) severity from smartphone video. All video processing runs entirely in your browser using MediaPipe — **no data leaves your device**.

## Features

- **Client-side processing**: Video is analyzed in the browser via MediaPipe Face Landmarker (WASM/GPU)
- **Tonic-clonic decomposition**: Savitzky-Golay filter separates sustained narrowing (tonic) from intermittent spasms (clonic)
- **Automated affected-side detection**: Coefficient of variation (CV) based determination
- **Mouth-pursing provocation**: Automatic detection via mouth aspect ratio (MAR)
- **Quantitative metrics**: Tonic mean/elevation, clonic spasm rate/coverage/amplitude/duration
- **CSV export**: Download full time-series data for further analysis

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173` and drop a video file.

## Build & Deploy

```bash
npm run build   # Output to dist/
npm run preview # Preview production build
```

Designed for deployment on **Cloudflare Pages** (static site).

Public deployment:

https://hfs-analysis.klabo-med.com

## Architecture

```
Video File
  → MediaPipe Face Landmarker (478 landmarks, browser WASM)
  → Eye Aperture (EAR 6-point) + Mouth Aspect Ratio
  → Affected Side Detection (CV ratio)
  → Relative Difference (RD)
  → Blink Detection + Mask Extension
  → Savitzky-Golay Tonic/Clonic Separation
  → Transition Exclusion Mask
  → Spasm Episode Detection (threshold + min duration)
  → Tonic/Clonic Metric Aggregation
  → Dashboard + CSV Export
```

## Derived From

Analysis algorithms are ported from [HFS_analysis_app](https://github.com/keinomura/HFS_analysis_app) (Python + MediaPipe).

## Citation

If you use this tool in your research, please cite:

> Nomura K, Sakai H. Automated Tonic-Clonic Decomposition of Hemifacial Spasm Severity from Smartphone Video Using MediaPipe Face Mesh. *Computer Methods and Programs in Biomedicine* (submitted).

## Intended Users

- Primary target users are clinicians and researchers.
- The app is not designed as a patient-facing self-diagnosis tool.
- If patients access the tool, results must be reviewed by qualified medical professionals.

## Copyright

Copyright (c) 2026 Kei Nomura and contributors.

Unless otherwise stated, source code in this repository is protected by copyright and distributed under the MIT License.

## DOI Policy

- Software DOI: will be issued via Zenodo after the first release suitable for citation.
- Paper DOI: will be added once the CMPB manuscript is accepted and DOI is assigned.
- Method reference DOI (HFS_analysis_app): https://doi.org/10.5281/zenodo.18845312
- Until DOI assignment, cite the manuscript information shown above.

## Terms Of Use

- Research and clinical decision-support use only.
- Not a standalone medical device and not intended to replace physician judgment.
- Users are responsible for compliance with local regulations, institutional review rules, and ethics requirements.
- Do not share personally identifiable information in filenames, screenshots, or exported CSV files.

## Permission And Reuse Conditions

- You may use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies under the MIT License.
- You must include the original copyright notice and license text in substantial portions of the software.
- For academic publications using this tool or algorithm, citation of the paper listed above is required by project policy.

## License

MIT
