# Page Object Pattern

This directory contains Page Object classes that encapsulate page interactions and element selectors.

## Architecture

### Design Principles

- **Separation of Concerns**: Page Objects handle "how" (selectors, waits, retries), while test specs focus on "what" (business scenarios)
- **Reusability**: Common operations are centralized in Page Object methods
- **Maintainability**: When UI changes, only Page Objects need updates, not all test files
- **Readability**: Test specs read like business requirements

### Page Objects

#### `GeminiChatPage`
Encapsulates chat interactions:
- `open()`: Navigate to chat page
- `submitPrompt(text)`: Submit a chat prompt with automatic fallback strategies
- `expectResponseAt(index, matcher?, options?)`: Validate response content
- `redoLatestResponse()`: Trigger redo on the latest response
- `copyLatestResponse()`: Copy response to clipboard and return text
- `startNewChat()`: Start a new chat session
- `takeScreenshot(name)`: Capture screenshot with test info

#### `GeminiSearchPage`
Encapsulates search page interactions:
- `open()`: Navigate to search page
- `expectEmptyState()`: Verify empty state message
- `searchFor(query)`: Enter search query
- `expectProgressBar()`: Verify progress indicator
- `takeScreenshot(name)`: Capture screenshot

#### `GeminiSettingsPage`
Encapsulates settings interactions:
- `openWithLocale(locale?)`: Navigate with optional locale parameter
- `expectLocale(locale)`: Verify HTML lang attribute
- `openSettingsPanel()`: Open settings panel
- `switchTheme(theme)`: Switch between dark/light themes
- `expectTheme(theme)`: Verify theme is applied
- `takeScreenshot(name)`: Capture screenshot

## Usage Examples

### Before (Direct Playwright API)

```typescript
await test.step('Submit search request', async () => {
  await submitChatPrompt(page, SEARCH_QUERY, test.info());
});

await test.step('Confirm search response', async () => {
  const firstResponseIndex = 0;
  await expectResponseContains(
    page,
    { index: firstResponseIndex, matcher: /Nvidia[\s\S]*Blackwell/i },
    { testInfo: test.info() }
  );
  await captureScreenshot(test.info(), page, 'chat-1-primary-response');
});
```

### After (Page Object)

```typescript
const chatPage = new GeminiChatPage(page, test.info());

await test.step('Submit search request', async () => {
  await chatPage.submitPrompt(SEARCH_QUERY);
});

await test.step('Confirm search response', async () => {
  await chatPage.expectResponseAt(0, /Nvidia[\s\S]*Blackwell/i);
  await chatPage.takeScreenshot('chat-1-primary-response');
});
```

## Benefits

1. **Cleaner Tests**: Business logic is clear without implementation details
2. **Centralized Retry Logic**: All wait/retry strategies are in Page Objects
3. **Easy Refactoring**: Change selectors in one place
4. **Type Safety**: TypeScript ensures correct method usage
5. **Better Logging**: Automatic logging integrated into Page Object methods

## Migration Guide

Both patterns coexist in this project:
- Original tests: `chat.spec.ts`, `search.spec.ts`, `settings.spec.ts`
- Refactored tests: `*-refactored.spec.ts`

Compare them to see the differences and choose the pattern that fits your needs.

