# Gemini 未ログイン交互テストケース / Gemini Interaction Test Cases Without Login

## 追加ドキュメント / Additional Documentation
- 日本語サマリーは [docs/AIテストのジャーニー.md](https://github.com/clampist/gemini-player/blob/main/docs/AIテストのジャーニー.md) を参照してください。
- For the end-to-end selection journey and architectural rationale, see [docs/AI_Testing_Journey.md](https://github.com/clampist/gemini-player/blob/main/docs/AI_Testing_Journey.md).

- 詳細な使用ガイド / Detailed usage guide: [docs/使用ガイド.md](https://github.com/clampist/gemini-player/blob/main/docs/使用ガイド.md) (日本語版) / [docs/USAGE.md](https://github.com/clampist/gemini-player/blob/main/docs/USAGE.md) (English).


## 手動テストケース（日本語）

### 1. 未ログインでのチャット
- **前提条件**: 最新版 Chrome を使用し、`https://gemini.google.com/` にアクセス。ログインしていない状態で、クリップボード利用を許可する。
- **手順**:
  1. Gemini チャットを開き、ページタイトルに “Gemini” が含まれることを確認する。
  2. `Nvidia Blackwell chip demand surge` を送信する。
  3. 最初の応答に Nvidia の Blackwell チップに関する記述があることを確認する。
  4. `Please answer me in Japanese` を送信する。
  5. 最新の応答に日本語（かな・漢字など）が含まれることを確認する。
  6. 最新の応答で “Redo” をクリックし、再生成を待つ。
  7. 再生成後の最新応答が更新されていることを確認する。
  8. 同じ応答で “Copy” をクリックし、他のアプリに貼り付けて “Blackwell” が含まれることを確認する。
- **期待結果**: 応答はすべて問題なく表示され、Redo が成功し、コピーした内容がクリップボードに保存される。

### 2. 未ログインでの検索
- **前提条件**: 最新版 Chrome、`https://gemini.google.com/` に未ログインでアクセス。
- **手順**:
  1. `<script>alert('Hello AI')</script>` を送信し、テキストとして安全に表示されることを確認する。
  2. 新しいチャットを開始して確認後、同じスクリプトを再送信する。
  3. `https://gemini.google.com/search` にアクセスし、「No recent threads.」の空状態表示を確認する。
  4. 検索ボックスに `AI` と入力し、進捗バーが表示され、空状態が維持されることを確認する。
- **期待結果**: スクリプト形式の入力は安全に処理され、新規チャットは正常に開始でき、検索画面は空状態とロード中アニメーションを表示する。

### 3. 設定
- **言語切り替え**:
  1. `https://gemini.google.com/?hl=ja` を開き、`<html lang="ja">` であることを確認する。
  2. `https://gemini.google.com/` に移動し、`<html lang="en">` に戻っていることを確認する。
- **テーマ切り替え**:
  1. ホーム画面から “Settings & help” を開く。
  2. “Dark” テーマを選び、画面がダークテーマに変わり、`dark-theme` クラスが付与されることを確認する。
  3. “Light” テーマに戻し、画面がライトテーマに変わり、`light-theme` クラスが付与されることを確認する。
- **期待結果**: `hl` パラメータに応じて言語が切り替わり、テーマ変更が即座に反映される。


### Playwright テスト記法ガイド
- 変数・定数命名: テストファイル内で都度定義する値は camelCase を使用し、モジュール全体で共有する定数のみ SCREAMING_SNAKE_CASE を使用します。
- アサーション: 失敗時にシナリオを即停止すべきチェックでは通常の `expect` を、必須ではない補足検証のみ `expect.soft` を使用します。特別な理由がある場合はテスト内コメントで意図を明記してください。
- ステップ定義: `test.step` ではビジネス上の意味が分かる説明文を付け、ページ操作の詳細は `tests/support/` 配下のヘルパーに集約してください。
- Page Object パターン: `tests/pages/` 配下に Page Object クラスを用意しています。選択器・待機・リトライ戦略を Page Object に集約し、テスト本体ではビジネスロジックのみを記述できます。詳細は [tests/pages/README.md](tests/pages/README.md) を参照してください。


---


## Manual Test Cases (English)

### 1. Chat Without Login
- **Preconditions**: Chrome latest; visit `https://gemini.google.com/`; not authenticated; allow clipboard access.
- **Steps**:
  1. Open Gemini chat and confirm the page title contains “Gemini”.
  2. Send `Nvidia Blackwell chip demand surge`.
  3. Verify the first response mentions Nvidia’s Blackwell chips.
  4. Send `Please answer me in Japanese`.
  5. Confirm the latest response contains Japanese characters.
  6. Click “Redo” on the latest response and wait for regeneration.
  7. Ensure the latest response updates successfully.
  8. Click “Copy” on the same response and paste elsewhere to confirm clipboard content includes “Blackwell”.
- **Expected**: All responses render correctly; redo succeeds; copy places the answer on the clipboard.

### 2. Search Without Login
- **Preconditions**: Chrome latest; visit `https://gemini.google.com/`; not authenticated.
- **Steps**:
  1. Send `<script>alert('Hello AI')</script>` and verify the reply treats it as text.
  2. Start a new chat, confirm, and resend the same script input.
  3. Visit `https://gemini.google.com/search`; confirm “No recent threads.” appears.
  4. Enter `AI` in the search box; ensure the progress bar appears and the empty state persists.
- **Expected**: Script input is handled safely; new chat works; search page displays empty state and shows loading progress.

### 3. Settings
- **Language Toggle**:
  1. Open `https://gemini.google.com/?hl=ja` and verify `<html lang="ja">`.
  2. Navigate to `https://gemini.google.com/` and verify `<html lang="en">`.
- **Theme Toggle**:
  1. From the homepage, open “Settings & help”.
  2. Choose “Dark” theme and confirm the UI switches (body class includes `dark-theme`).
  3. Switch back to “Light” and confirm the UI reverts (body class includes `light-theme`).
- **Expected**: Locale changes match the `hl` parameter; theme toggles update the appearance immediately.


### Playwright Test Conventions
- **Naming:** Use camelCase for ad-hoc values declared inside a test. Reserve SCREAMING_SNAKE_CASE for constants shared across the module.
- **Assertions:** Prefer regular `expect` for critical checks. Only use `expect.soft` for non-blocking validations and document the rationale with comments when you do.
- **Steps:** Give each `test.step` a business-meaningful description and keep page-operation details inside helpers under `tests/support/`.
- **Page Objects:** Page Object classes are available in `tests/pages/`. They encapsulate selectors, waits, and retry logic, allowing test specs to focus on business scenarios. See [tests/pages/README.md](tests/pages/README.md) for details.