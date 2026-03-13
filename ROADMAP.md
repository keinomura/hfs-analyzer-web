# HFS Analyzer Web — ROADMAP

## Phase 1: ブラウザ内解析ツール（現在）

### 1.1 ローカル動作確認
- [ ] `npm run dev` でブラウザ起動
- [ ] 実際のHFS動画（Case 1/2/3）で処理実行
- [ ] Python出力（`*_comprehensive_metrics.csv`）との定量比較
  - EAR/MAR値の一致確認
  - Tonic/Clonic分離結果の差異を1e-3以内に収束
  - 痙攣エピソード検出数の一致確認
- [ ] Savitzky-Golayフィルタの精度調整（ml-savitzky-golay vs scipy差異がある場合）

### 1.2 Cloudflare Pages デプロイ
- [ ] GitHub リポジトリに push
- [ ] Cloudflare Pages プロジェクト作成（GitHub連携）
  - Build command: `npm run build`
  - Output directory: `dist`
- [ ] `_headers` による CORS設定の動作確認
- [ ] カスタムドメイン設定（任意）

### 1.3 ブラウザ互換性テスト
- [ ] Chrome（推奨ブラウザ）
- [ ] Firefox（MediaPipe初期化が遅い可能性あり）
- [ ] Safari（`requestVideoFrameCallback` フォールバック確認）
- [ ] モバイルブラウザ（iPhone Safari, Android Chrome）

### 1.4 公開前ドキュメント整備
- [x] 使用上の注意（UI表示）
- [x] 著作権表示（README）
- [x] DOI方針の明記（README/ROADMAP）
- [x] 使用許諾条件の明記（README）
- [ ] DOI確定後の値反映（README/CITATION.cff）

---

## Phase 2: ユーザー登録 + データ蓄積

### 2.1 認証基盤
- [ ] Cloudflare Workers で API エンドポイント構築
- [ ] 認証方式の選定（JWT / OAuth / Cloudflare Access）
- [ ] ユーザー登録・ログイン画面

### 2.2 データベース（Neon PostgreSQL）
- [ ] スキーマ設計
  - `users`: メール、所属施設、ロール
  - `patients`: 匿名ID、患側、診断日
  - `analyses`: タイムポイント、全メトリクス（tonic/clonic scores）
  - `sessions`: 解析実行ログ
- [ ] Neon Free Tier でDB作成
- [ ] Cloudflare Workers → Neon 接続（`@neondatabase/serverless`）

### 2.3 データ送信フロー
- [ ] ブラウザ内解析完了後、メトリクスのみをAPIに送信（動画は送信しない）
- [ ] 患者データの匿名化ルール策定
- [ ] データ保存のオプトイン同意画面

### 2.4 ダッシュボード拡張
- [ ] 患者ごとの縦断データ表示（術前→術後経時変化グラフ）
- [ ] 施設間比較（匿名化済みデータ）
- [ ] データエクスポート（研究用一括CSV/JSON）

---

## Phase 3: 高度な機能

### 3.1 解析の高度化
- [ ] 顔面麻痺（paresis）対応アルゴリズム
  - 術後の眼瞼開大によるRD反転を検出・補正
  - Paresis-aware clonic detection
- [ ] 複数動画の縦断解析（ブラウザ内で術前アンカー方式）
- [ ] Web Workers によるバックグラウンド処理（UI完全非ブロック化）
- [ ] WebCodecs API による高精度フレーム抽出

### 3.2 多言語対応
- [x] 英語（デフォルト）
- [x] 日本語
- [x] i18n 基盤
- [ ] 追加言語（後続アップデート）
  - [ ] 韓国語
  - [ ] 中国語（簡体字）
  - [ ] スペイン語

### 3.3 レポート生成
- [ ] PDF レポート出力（ブラウザ内生成）
- [ ] 論文用フィギュア自動生成

---

## 公開・引用・ライセンスに関する取り決め

### ライセンス

MIT License を採用する。学術利用においては以下の引用を必須条件とする。

### 引用要件

本ツールまたはそのアルゴリズムを使用した研究を発表する場合、以下の論文を引用すること：

> Nomura K, Sakai H. Automated Tonic-Clonic Decomposition of Hemifacial Spasm Severity from Smartphone Video Using MediaPipe Face Mesh. *Computer Methods and Programs in Biomedicine* (submitted).

論文の DOI が確定次第、README.md および本ドキュメントを更新する。

### DOI（デジタルオブジェクト識別子）

#### ソフトウェア DOI
- [ ] 論文アクセプト後、Zenodo でリリースタグに対して DOI を発行する
  - GitHub Releases → Zenodo 連携で自動発行可能
  - バージョンごとに concept DOI（全バージョン共通）と version DOI（個別）を取得
- [ ] README.md に DOI バッジを追加
- [ ] CITATION.cff ファイルを作成（GitHub の "Cite this repository" 機能対応）

#### 論文 DOI
- [ ] CMPB 論文の DOI 確定後、README.md の Citation セクションを更新
- [ ] CITATION.cff に論文 DOI を追記

### CITATION.cff（予定）

```yaml
cff-version: 1.2.0
title: "HFS Analyzer Web"
message: "If you use this software, please cite it as below."
type: software
authors:
  - family-names: Nomura
    given-names: Kei
  - family-names: Sakai
    given-names: Hiroyuki
repository-code: "https://github.com/keinomura/hfs-analyzer-web"
license: MIT
preferred-citation:
  type: article
  title: "Automated Tonic-Clonic Decomposition of Hemifacial Spasm Severity from Smartphone Video Using MediaPipe Face Mesh"
  authors:
    - family-names: Nomura
      given-names: Kei
    - family-names: Sakai
      given-names: Hiroyuki
  journal: "Computer Methods and Programs in Biomedicine"
  year: 2026
  # doi: "10.1016/j.cmpb.2026.XXXXX"  # 確定後に追記
```

### 利用規約（Phase 2 以降）

- ユーザー登録時に利用規約・プライバシーポリシーへの同意を求める
- 蓄積データの使用目的：
  - 集計・匿名化された統計データの研究利用
  - 個別データの第三者提供は行わない
- データ削除リクエストへの対応（GDPR準拠）

### コントリビューション

- 外部コントリビューションは GitHub Issues / Pull Requests で受け付ける
- コントリビューターは CITATION.cff の contributors セクションに追加
- 重要な貢献には論文の acknowledgments で謝辞

---

## 技術スタック概要

| レイヤー | Phase 1 | Phase 2 |
|---------|---------|---------|
| フロントエンド | Cloudflare Pages (静的) | Cloudflare Pages |
| 解析エンジン | ブラウザ内 (MediaPipe JS) | ブラウザ内 (変更なし) |
| API | なし | Cloudflare Workers |
| データベース | なし | Neon PostgreSQL (Free Tier) |
| 認証 | なし | JWT / Cloudflare Access |
| 月額コスト | $0 | $0 (Free Tier内) |
