## Gemini ホームページ Playwright テスト

このプロジェクトは、gemini.google.com の未ログインフローを検証する Playwright 自動化スイートです。チャット画面（英語/日本語プロンプト、再生成、コピー）、スクリプト風入力の取り扱いと検索の空状態、言語・テーマ設定の切り替えを網羅します。

### 前提条件

- Node.js 18 以上
- npm 9 以上

### インストール

```bash
npm install
```

### テスト実行

```bash
npm test
```

#### バリエーション

- `npm run test:headed` — 実ブラウザを表示しながらテストを実行。
- `npm run test:ui` — Playwright Test Runner UI を起動してデバッグ。
- `npm run test:report` — 直近の実行で生成された HTML レポートを開く。

### プロジェクト構成

このプロジェクトは **Page Object パターン** を採用し、保守性の高いテストコードを実現しています。

```
tests/
├── chat.spec.ts                  (チャットテスト - ビジネスロジックのみ)
├── search.spec.ts                (検索テスト - ビジネスロジックのみ)
├── settings.spec.ts              (設定テスト - ビジネスロジックのみ)
├── pages/
│   ├── GeminiChatPage.ts         (チャットページの操作)
│   ├── GeminiSearchPage.ts       (検索ページの操作)
│   └── GeminiSettingsPage.ts     (設定ページの操作)
├── support/
│   ├── artifacts.ts              (スクリーンショット・テキストヘルパー)
│   ├── logger.ts                 (ログユーティリティ)
│   └── utils.ts                  (共通ユーティリティ)
└── data/
    └── selectors.ts              (セレクタの集中管理)
```

**主要ファイル:**
- `playwright.config.ts` — Gemini のベース URL を含む共通設定。
- `tests/pages/` — ページ操作、セレクタ、待機戦略をカプセル化した Page Object クラス。
- `tests/*.spec.ts` — Page Object を使用してビジネスシナリオに集中したテストファイル。
- `tests/support/` — ログ、スクリーンショット、共通操作の再利用可能なユーティリティ。
- `tests/data/selectors.ts` — セレクタや data-test-id の集中管理。
- `env.example` — 環境変数のサンプル（`.env` にコピーして上書き）。

### アーティファクト

- `artifacts/` — テストスイートごとのスクリーンショットとテキスト（`tests/support/artifacts.ts` のヘルパーで生成）。
- `test-results/` — 各実行ごとの Playwright 出力（自動生成、削除可能）。
- `playwright-report/` — 最新 HTML レポート（`npm run test:report` で開く）。
- `logs/` — `tests/support/logger.ts` で集約した Playwright ログ。

### 設定

`env.example` を `.env` にコピーし、環境固有の値を設定します。

- `ENV` — 対象環境を示すラベル（任意、`process.env` 経由で参照）。
- `BASE_URL` — テスト対象のフロントエンド URL。
- `HEADLESS` — ヘッドレスモードの切り替え（`true`/`false`）。CI では既定で `true`。

`playwright.config.ts` はタイムアウトやレポーター、ブラウザ設定などフレームワーク動作に専念し、上記環境変数を読み取ってテスト対象を決定します。

### 継続的インテグレーション

GitHub Actions ワークフロー（`.github/workflows/playwright.yml`）は `main` への push と pull request で実行されます。Playwright ブラウザをインストールし、`npm test` を走らせ、次の 2 つのアーティファクトをアップロードします。

- `playwright-report` — `index.html` をダウンロードしてローカルで実行結果を確認。
- `screenshots` — テストスイート中に取得した PNG ファイル。

アーティファクトの保管期間は 7 日です。必要に応じてワークフロー内の `retention-days` を調整してください。

### Page Object を使用したテスト記述

テスト構造の例:

```typescript
import { test } from '@playwright/test';
import { GeminiChatPage } from './pages/GeminiChatPage';

test('Gemini に質問して応答を検証', async ({ page }) => {
  const chatPage = new GeminiChatPage(page, test.info());

  await test.step('チャットを開く', async () => {
    await chatPage.open();
  });

  await test.step('プロンプトを送信', async () => {
    await chatPage.submitPrompt('AI について教えて');
  });

  await test.step('応答を検証', async () => {
    await chatPage.expectResponseAt(0, /AI|人工知能/i);
    await chatPage.takeScreenshot('ai-response');
  });
});
```

**ベストプラクティス:**
- Page Object を `page` と `test.info()` で初期化して自動ログを有効化
- `test.step()` でテストシナリオを整理
- Page Object メソッドがすべてのセレクタ、待機、リトライを処理
- テストはビジネスロジックに集中し、実装詳細は記述しない

Page Object の詳細なドキュメントは [tests/pages/README.md](../tests/pages/README.md) を参照してください。

### 注意事項

- 検索フローは Gemini の一般的なセレクタに依存しています。公開サイトが変更された場合は `tests/data/selectors.ts` のロケータを更新してください。
- ブラウザバイナリは `npx playwright install` で管理しています。Playwright キャッシュを削除した場合は再実行してください。

