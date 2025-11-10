/**
 * Centralized Test Data
 * 
 * Test data for settings.spec.ts, search.spec.ts, and chat.spec.ts
 * This demonstrates the Test Data Factory Pattern with focused, practical data.
 */

// ============================================================================
// Settings Test Data
// ============================================================================

/**
 * Locale configurations used in settings tests
 */
export const Locales = {
  japanese: 'ja',
  english: 'en'
} as const;

/**
 * Theme configurations used in settings tests
 */
export const Themes = {
  dark: 'dark' as const,
  light: 'light' as const
} as const;

/**
 * Screenshot names for settings tests
 */
export const SettingsScreenshots = {
  localeJapanese: 'settings-1-locale-ja',
  localeEnglish: 'settings-2-locale-en',
  themeDark: 'settings-3-theme-dark',
  themeLight: 'settings-4-theme-light'
} as const;

// ============================================================================
// Search Test Data
// ============================================================================

/**
 * Script-like input queries for security testing
 */
export const ScriptQueries = {
  alert: "<script>alert('Hello AI')</script>",
  alertAgain: "<script>alert('Hello AI again')</script>"
} as const;

/**
 * Search queries used in search tests
 */
export const SearchQueries = {
  simple: 'AI'
} as const;

/**
 * Expected response patterns for script-like inputs
 */
export const ScriptResponsePattern = /(script|cannot|execute|run|code|safe|security|help)/i;

/**
 * Screenshot names for search tests
 */
export const SearchScreenshots = {
  initialResponse: 'search-1-initial-response',
  newChatResponse: 'search-2-newchat-response',
  progressBar: 'search-3-progress-bar'
} as const;

// ============================================================================
// Chat Test Data
// ============================================================================

/**
 * Chat prompts used in chat tests
 */
export const ChatPrompts = {
  nvidia: 'Nvidia Blackwell chip demand surge',
  japaneseRequest: 'Please answer me in Japanese'
} as const;

/**
 * Expected response patterns for chat tests
 */
export const ChatResponsePatterns = {
  nvidia: /Nvidia[\s\S]*Blackwell/i,
  blackwell: /Blackwell/i
} as const;

/**
 * Timeout configurations for chat tests
 */
export const ChatTimeouts = {
  japaneseResponse: 20_000
} as const;

/**
 * Screenshot names for chat tests
 */
export const ChatScreenshots = {
  primaryResponse: 'chat-1-primary-response',
  japaneseResponse: 'chat-2-japanese-response',
  redoResponse: 'chat-3-redo-response'
} as const;

/**
 * Artifact names for chat tests
 */
export const ChatArtifacts = {
  copiedText: 'chat-copied-text'
} as const;

// ============================================================================
// Type Exports
// ============================================================================

export type Locale = typeof Locales[keyof typeof Locales];
export type Theme = typeof Themes[keyof typeof Themes];

