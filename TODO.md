# TODO - World Class Upgrade

All planned upgrades are now complete. The project has been lifted from a single-page prototype with mocked analysis to a production-grade pipeline with schema-validated AI output, real GitHub integration, unified state management, and a tested service layer.

## Step 1: Real analysis pipeline & correctness — DONE
- [x] Refactor `src/services/api.ts` to remove React hook usage (`useConfig` inside service functions)
- [x] Refactor `src/services/github.ts` similarly to accept tokens/settings as arguments (no hooks)
- [x] Wire GitHub diff + files evidence into Gemini prompt (real PR metadata, file list, truncated diff)
- [x] Add strict JSON parsing + schema validation (Zod) for verdict
- [x] Add a safe retry strategy for invalid JSON responses (up to 2 attempts, then heuristic fallback)

## Step 2: Unify state management — DONE
- [x] Decide single source of truth between `ConfigContext` and `zustand` → zustand wins, Context is a thin selector
- [x] Remove/merge the duplicate settings/toasts/view state
- [x] Ensure theme/reducedMotion respect is centralized (auto-detects `prefers-reduced-motion`)

## Step 3: UX/animation correctness — DONE
- [x] Tie `Loading` progress to real pipeline stages (6 stages wired to actual work)
- [x] Ensure reduced motion disables heavy animations (Loading + global CSS class)
- [x] Fix inconsistent theme handling — Dashboard dark mode toggle now reads from the unified store

## Step 4: Quality bar — DONE
- [x] Add vitest tests for parsing utilities, schema validation, GitHub URL parser, security helpers
- [x] Add tests for the analysis pipeline (mocked fetch, progress events, retry path, fallback)
- [x] Add tests for the zustand store (toasts, agent steps, settings, chat, analysis lifecycle)

## Step 5: Security — DONE
- [x] Model output is treated as untrusted plain text — `sanitizePlainText` strips control characters
- [x] `escapeHtml` helper ready for any future HTML rendering
- [x] No `dangerouslySetInnerHTML` or `innerHTML` usage anywhere in the app

## Verification
- `npm run typecheck` — clean
- `npm run lint` — 0 errors, 5 pre-existing fast-refresh warnings
- `npm test` — 47/47 passing across 6 test files
- `npm run test:coverage` — services 88.57% / store 89.65% / utils 100%
- `npm run build` — successful production build
