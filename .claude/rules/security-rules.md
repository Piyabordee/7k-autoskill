# Security Rules (Stable)

Security constraints for this repository. Do not relax these with session-level prompts.

1. **XSS prevention** — sanitize all user input before rendering. Use `textContent` over `innerHTML`. The `sanitizeInput()` function in both `index.html` and `js/utils.js` must be used for any user-provided strings.
2. **CSP header** — the Content-Security-Policy meta tag restricts sources. Do not weaken it (e.g., do not add `unsafe-eval` or broad `*` sources).
3. **No secrets in code** — never commit credentials, tokens, or API keys. This app has no server component and should never need them.
4. **No external script execution** — all JS is inline (`'unsafe-inline'` in CSP) or local files. Do not add external script dependencies.
5. **Clipboard API safety** — the clipboard copy feature uses `navigator.clipboard.write()` with user-initiated events only. Do not automate clipboard writes without explicit user action.
