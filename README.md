# PR Autopilot - AI-Powered Code Review

<div align="center">
  <img src="https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-3.4.1-06B6D4?style=for-the-badge&logo=tailwind-css" alt="Tailwind">
  <img src="https://img.shields.io/badge/Vite-6.3.5-646CFF?style=for-the-badge&logo=vite" alt="Vite">
</div>

## Overview

PR Autopilot is a sophisticated AI-powered code review tool that evaluates GitHub Pull Requests against Jira ticket requirements. It provides instant, detailed analysis with evidence-based verification and auto-generated test cases.

### Key Features

- **AI-Powered Analysis**: Leverages Gemini AI for deep code review
- **Requirements Tracking**: Evaluates PRs against specific acceptance criteria
- **Evidence-Based**: Provides file paths and line numbers for findings
- **Auto-Generated Tests**: Creates Jest/Mocha test cases for verification
- **Real GitHub Integration**: Fetches PR diffs and metadata directly
- **Beautiful UI**: Stunning glassmorphism design with smooth animations
- **Accessibility**: Full keyboard navigation and ARIA support

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Gemini API key (optional, for AI chat)
- GitHub Personal Access Token (optional, for private repos)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd pr_autopilot

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file with:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_GITHUB_TOKEN=your_github_token_here
```

- **Gemini API Key**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
- **GitHub Token**: Create at [GitHub Settings](https://github.com/settings/tokens) (needs `repo` scope for private repos)

## Usage

### 1. Landing Page

- Enter Jira ticket JSON in the first field
- Enter GitHub PR URL in the second field
- Click "Run AI Evaluation" or use a demo preset

### 2. Demo Presets

The app includes 6 demo scenarios:
- Bug Fix - Partial pass with missing token expiry
- Feature Request - Full pass with all criteria met
- Refactor - Partial with API breaking changes
- Performance - Full optimization success
- Security - XSS vulnerabilities detected
- API Integration - Payment processing with issues

### 3. Results Dashboard

- View overall verdict (Pass/Partial/Fail)
- Check confidence score with animated ring
- Expand requirements to see evidence
- Copy generated test cases
- Ask follow-up questions via chat

### 4. Settings

Press `Ctrl+,` or click the Settings button to:
- Configure API keys
- Toggle animations
- Manage preferences

## Project Structure

```
src/
├── components/          # React components
│   ├── Landing.tsx      # Hero page
│   ├── Dashboard.tsx    # Results view
│   ├── Loading.tsx      # Analysis progress
│   ├── Chat.tsx         # AI chat interface
│   ├── AgentLog.tsx     # Reasoning display
│   ├── ui.tsx           # Reusable UI components
│   └── ...
├── context/
│   └── ConfigContext.tsx  # App settings provider
├── services/
│   ├── api.ts           # AI analysis service
│   └── github.ts        # GitHub API integration
├── hooks/
│   └── useAccessibility.tsx  # A11y utilities
├── data/
│   └── demoData.ts      # Demo presets
└── App.tsx              # Main app component
```

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19.1.0 |
| Build Tool | Vite 6.3.5 |
| Language | TypeScript 5.8.3 |
| Styling | Tailwind CSS 3.4.1 |
| Animations | Framer Motion 12.36.0 |
| Icons | Lucide React |
| HTTP | Axios |

## Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build

# Linting & Type Checking
npm run lint         # Run ESLint
npm run typecheck    # TypeScript check

# Utilities
npm run lint:fix     # Autofix formatting/lint issues
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + K` | Open settings |
| `Ctrl + ,` | Open settings |
| `Escape` | Close modal |

## Deployment

### Netlify

The project is configured for Netlify deployment with `_redirects` support:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Manual Deployment

```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## API Reference

### analyzePR(options)

Performs AI analysis on a PR.

```typescript
interface AnalyzeOptions {
  jiraJson: string;
  githubUrl: string;
  onProgress?: (status: string, progress: number) => void;
}

// Returns
interface AnalysisResult {
  verdict: VerdictData;
  agentLogs: string[];
  processingTime: number;
}
```

### askFollowUp(question, verdict)

Gets AI response to follow-up questions.

```typescript
const response = await askFollowUp(
  "Why did requirement 3 fail?",
  verdict
);
```

## Component Library

The `ui.tsx` file exports reusable components:

- `Button` - Multi-variant button with loading states
- `Card` - Glass/gradient card with glow effects
- `Badge` - Status badges with color variants
- `ProgressBar` - Animated progress indicator
- `Tooltip` - Hover tooltip component
- `Skeleton` - Loading skeleton with shimmer
- `Modal` - Animated modal dialog
- `Tabs` - Tab navigation component
- `Avatar` - User avatar with fallback
- `Switch` - Toggle switch component

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT

---

Built with passion for better code reviews 🚀