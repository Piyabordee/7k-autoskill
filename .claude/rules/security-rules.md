# Security Rules

Security constraints for this repository. Do not relax these with session-level prompts.

1. **XSS prevention** — Sanitize all user input before rendering. Use `sanitizeInput()` function in `lib/utils.ts`. Never use `dangerouslySetInnerHTML` with unsanitized data.
2. **CSP header** — Defined in `next.config.ts`. Restricts sources. Do not weaken it (e.g., do not add `unsafe-eval` or broad `*` sources in production). Development allows `unsafe-eval` for Next.js HMR.
3. **No secrets in code** — Never commit credentials, tokens, or API keys. Phase 1 has no server components.
4. **No external script execution** — All JS is framework-served from `/_next/`. Do not add external script dependencies. CDN scripts are not allowed.
5. **Clipboard API safety** — Clipboard copy uses `navigator.clipboard.write()` with user-initiated events only. Do not automate clipboard writes without explicit user action.