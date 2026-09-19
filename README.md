<div align="center">

# ⚡ PR AUTOPILOT

### *Does your PR actually work — or just vibes?*

**The AI agent that verifies whether a GitHub Pull Request actually satisfies its Jira ticket.**

Paste a ticket + a PR link → get a stamped verdict with file:line evidence and runnable tests.

[![Live on Vercel](https://img.shields.io/badge/🚀_LIVE-pr--autopilot--chi.vercel.app-16130e?style=for-the-badge&labelColor=ffbe0b)](https://pr-autopilot-chi.vercel.app)

[![React 19](https://img.shields.io/badge/React-19-149ECA?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite 6](https://img.shields.io/badge/Vite-6.4-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-black?style=flat-square)](https://motion.dev/)
[![Tests](https://img.shields.io/badge/Tests-47%2F47_passing-06d6a0?style=flat-square)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-ffbe0b?style=flat-square)](./LICENSE)

</div>

---

> **No signup. No install. Paste & go — a full verdict in ~30 seconds.**

PR Autopilot reads the **actual diff** of your pull request, checks every acceptance criterion
from your Jira ticket against it, and stamps a **PASS / PARTIAL / FAIL** verdict — with
`file:line` evidence you can click and verify, plus a **runnable Jest test** for every requirement.

It doesn't review vibes. It reviews evidence.

---

## ✨ Feature Highlights

| | |
|---|---|
| 🌍 **Interactive dot globe** | Hand-rolled canvas globe (Cobe-style) — drag it, throw it, watch live verdict arcs flow between cities |
| 🧲 **Magnetic UI** | Buttons physically pull toward your cursor with spring physics |
| 🖃 **Draggable verdict stamp** | Your PASS / PARTIAL / FAIL verdict is a real stamp — grab it and throw it |
| 🔬 **Evidence, not opinions** | Every finding cites `file:line` — click through and verify yourself |
| 🧪 **Generated Jest tests** | A runnable test case for every single acceptance criterion |
| 🤖 **Ask-the-Agent chat** | Interrogate the verdict: why it failed, and exactly how to fix it |
| 📜 **Agent reasoning log** | Watch the AI think in real time, step by step |
| 📄 **One-click PDF report** | A print-ready official document of the analysis |
| 🎛️ **Demo cartridges** | Six pre-loaded scenarios — bug fixes, features, security audits — analyze instantly |
| ♿ **Accessible & calm** | Full keyboard support, `prefers-reduced-motion` respected everywhere |
| 📱 **Responsive** | From phones (hamburger menu) to ultrawides |

## 🚀 Quick Start

**Or skip all of this — it's already live: [pr-autopilot-chi.vercel.app](https://pr-autopilot-chi.vercel.app)**

```bash
# 1. Clone
git clone https://github.com/TarunTheDev/pr-autopilot.git
cd pr-autopilot

# 2. Install
npm install

# 3. Configure (optional — the app works with demo cartridges without keys)
cp .env.example .env
#    then edit .env:
#    VITE_GEMINI_API_KEY="your-gemini-key"   → get one free at https://makersuite.google.com/app/apikey

# 4. Run
npm run dev
# → http://localhost:5173
```

### Using it for real

1. **Export your Jira ticket** as JSON (include an `acceptance_criteria` array — one criterion per string)
2. **Paste it** into `jira_ticket.json` in the analyzer
3. **Paste the PR URL** — `https://github.com/owner/repo/pull/123`
4. Hit **RUN ANALYSIS** (or `Ctrl + Enter`)
5. Read the verdict. Verify the evidence. Copy the tests. Merge with confidence.

> 🔏 **Private repos?** Add a GitHub token in Settings — it stays in your browser's localStorage and never touches any server.

## 🧠 How the Verdict Engine Works

```
 Jira JSON ──▶ Parse & extract acceptance criteria
                    │
 GitHub PR ──▶ Fetch real diff + changed files (GitHub API)
                    │
                    ▼
        Gemini AI evaluates EVERY criterion
        against the actual code changes
                    │
                    ▼
        ✅ PASS  ⚠️ PARTIAL  ❌ FAIL
        each with file:line evidence
        each with a generated Jest test
                    │
                    ▼
        Official stamped report (+ PDF export)
```

**The philosophy:** a review you can't verify is an opinion. Every claim PR Autopilot makes
is backed by a location in the diff — so you never have to trust the stamp blindly.

## 🧱 Tech Stack

| Layer | Tech |
|---|---|
| UI | React 19, TypeScript 5.8, Tailwind CSS 3 |
| Motion | Framer Motion 12 (springs, gestures, drag physics) |
| State | Zustand 5 (persisted settings) |
| Icons | Lucide |
| AI | Google Gemini (schema-validated JSON output) |
| PDF | jsPDF |
| Build | Vite 6, PWA-enabled |
| Testing | Vitest + Testing Library — **47 tests, all passing** |

## 📁 Project Structure

```
src/
├── components/
│   ├── retro/              # 🎨 The "Paper & Pixels" design system
│   │   ├── RetroGlobe.tsx      # Hand-built canvas dot globe (drag-to-spin, live arcs)
│   │   ├── Magnetic.tsx        # Cursor-magnetic spring wrapper
│   │   ├── Reveal.tsx          # Scroll-triggered spring reveals + stagger
│   │   ├── Typewriter.tsx      # Cycling typewriter text
│   │   ├── RetroCountUp.tsx    # Scroll-triggered count-up numbers
│   │   ├── RetroHero.tsx       # Hero: globe + kinetic headline + live ticker
│   │   ├── RetroNavbar.tsx     # Hide-on-scroll nav + progress bar + mobile menu
│   │   ├── RetroAnalyzer.tsx   # The terminal-window input form
│   │   ├── RetroPresets.tsx    # Demo cartridges
│   │   ├── RetroFeatures.tsx   # Steps + feature bento + animated stats
│   │   ├── RetroTestimonials.tsx / RetroCompare.tsx
│   │   ├── RetroPricing.tsx / RetroFAQ.tsx / RetroFooter.tsx
│   │   └── RetroBits.tsx       # Starbursts, stickers, section tags
│   ├── Dashboard.tsx       # 📊 Draggable verdict stamp, ink gauge, requirements table
│   ├── Chat.tsx            # Ask-the-agent follow-ups
│   ├── AgentLog.tsx        # Real-time reasoning ticker
│   ├── Loading.tsx         # Retro boot sequence
│   ├── PdfView.tsx         # Official paper report + PDF export
│   ├── SettingsModal.tsx   # control-panel.exe
│   ├── Toast.tsx / ErrorBoundary.tsx
│   └── Landing.tsx         # Landing composition
├── services/               # Gemini schema (aiSchema), GitHub, Jira, API orchestration
├── store/                  # Zustand store (views, verdicts, settings)
├── data/                   # Demo cartridges
├── utils/                  # Security helpers
└── test/                   # ✅ 47 passing tests
```

## 🎨 Design System — "Paper & Pixels"

The entire product runs on one neo-brutalist retro system: **cream paper, ink borders,
hard offset shadows, sticker chips, rubber stamps and 8-bit pixel tags** — with a custom
motion language (springy entrances, magnetic pulls, drags with inertia).

Built with inspiration from the best of the web — retroui, 8bitcn, Cobe, awwwards-grade
landing pages — but 100% hand-rolled: the globe, the physics, and the components are all
written from scratch in this repo.

## 🧪 Scripts

```bash
npm run dev          # Start dev server
npm run build        # Type-check + production build
npm run preview      # Preview the production build
npm run test         # Run the 47-test suite
npm run test:coverage
npm run lint
npm run typecheck
```

## ☁️ Deploy Your Own

Deploy to Vercel in one command:

```bash
npm i -g vercel
vercel login
vercel --prod
```

Or click the button:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FTarunTheDev%2Fpr-autopilot&env=VITE_GEMINI_API_KEY)

Add `VITE_GEMINI_API_KEY` as an environment variable in your Vercel project for live AI analysis
(users can also supply their own key in-app — it never leaves their browser).

## 🗺️ Roadmap

- [x] Verdict engine with file:line evidence
- [x] Generated Jest tests per criterion
- [x] Ask-the-agent follow-up chat
- [x] PDF report export
- [ ] GitHub App — verdicts posted as PR comments
- [ ] GitLab & Azure DevOps support
- [ ] Custom verdict policies for teams

## 🤝 Contributing

PRs welcome! The codebase is fully typed, tested, and organized — pick something from the
roadmap, run `npm run test` before you submit, and stamp your own work first. 😉

## 📜 License

[MIT](./LICENSE) — © 2026 Tarun Singh Jodha. Free to use, fork, and ship.

---

<div align="center">

**⭐ Star this repo if PR Autopilot saved you from a vibes-based merge!**

[🚀 **Try it live**](https://pr-autopilot-chi.vercel.app) · [🐛 Report a bug](https://github.com/TarunTheDev/pr-autopilot/issues) · [💡 Request a feature](https://github.com/TarunTheDev/pr-autopilot/issues)

*Made with ink & pixels.*

</div>




