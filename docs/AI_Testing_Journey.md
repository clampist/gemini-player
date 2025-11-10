## AI Testing Journey

### Tool Selection Rationale
- Evaluated `ChatGPT` first because it exposed stable `data-testid` attributes and accepted cookie-based authentication that unlocked a broader action surface. The login flow initially succeeded, but automation was later blocked when the service detected Playwright traffic.
- Investigated login-free alternatives to avoid authentication hurdles. Both `Perplexity.ai` and `Gemini` were validated, yet Perplexity similarly flagged scripted usage and withheld chat responses.
- Chose `Gemini` as the final target: the public site remains accessible without authentication and survives basic Playwright-driven interactions long enough to validate the end-to-end flow.

### Development Approach
- Prioritized a minimal MVP that proved the full path: run end-to-end tests locally, integrate them into GitHub automation, and publish a reusable Playwright HTML report.
- Expanded iteratively only after the vertical slice passed, keeping the workflow reproducible across local and CI environments.

### Test Design Principles
- Kept the project lightweight for the unauthenticated scenario; directories are intentionally concise (`data`, `support`, etc.).
- Enforced separation of concerns: configuration isolated in dedicated files, test business logic encapsulated in helper utilities, and selectors centralized to reduce drift.

### Operational Considerations
- Gemini can temporarily throttle or block frequent scripted requests; limited execution to Chromium and recommend spacing out runs to reduce rate-limit risk.
- Maintain awareness that selectors may change without notice on public AI frontends; plan for periodic locator audits.


