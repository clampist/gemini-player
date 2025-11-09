export const selectors = {
  chat: {
    sendButton: 'button.send-button.submit[aria-label="Send message"]',
    stopButtonRole: { name: /stop response/i },
    responseItem: 'model-response.ng-star-inserted',
    redoButton: 'button[aria-label="Redo"]',
    copyButton: '[data-test-id="copy-button"]',
    newChatButton: 'button[aria-label="New chat"]:not([disabled])',
    newChatFallbackRole: /new chat/i,
    confirmNewChatButton: '[data-test-id="confirm-button"]'
  },
  search: {
    input: '[data-test-id="search-input"]',
    progressBar: 'mat-progress-bar[aria-label="Loading search results"]'
  },
  settings: {
    panelTrigger: '[data-test-id="settings-and-help-button"]',
    themeMenuTrigger: '[data-test-id="desktop-theme-menu-button"]',
    menuItem: (label: RegExp) => ({ name: label })
  }
} as const;

