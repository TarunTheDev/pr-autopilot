export type Requirement = {
  id: number;
  text: string;
  verdict: 'Pass' | 'Partial' | 'Fail';
  confidence: number;
  evidence: string;
  test: string;
};

export type VerdictData = {
  overall_verdict: 'Pass' | 'Partial' | 'Fail';
  confidence: number;
  summary: string;
  requirements: Requirement[];
};

export type Preset = {
  id: string;
  title: string;
  color: string;
  jira: string;
  pr: string;
  verdict: VerdictData;
};

export const presets: Record<string, Preset> = {
  bug: {
    id: 'bug',
    title: '🐛 Bug Fix Demo',
    color: 'border-danger',
    jira: JSON.stringify({
      title: "Fix: Password reset email not sending",
      type: "Bug",
      priority: "High",
      description: "Users report that clicking Forgot Password shows a success message but the reset email is never delivered.",
      acceptance_criteria: [
        "Reset email is sent within 5 seconds of form submission",
        "User sees an error message if the email service fails",
        "Reset token expires after 24 hours"
      ]
    }, null, 2),
    pr: "https://github.com/gothinkster/realworld/pull/123",
    verdict: {
      overall_verdict: "Partial",
      confidence: 71,
      summary: "PR fixes email sending and error handling but token expiry logic is missing.",
      requirements: [
        {
          id: 1,
          text: "Reset email is sent within 5 seconds of form submission",
          verdict: "Pass",
          confidence: 92,
          evidence: "src/auth/resetPassword.js line 23 — await emailService.send(user.email, resetToken)",
          test: "test('sends reset email on submit', async () => {\n  await resetPassword('user@test.com');\n  expect(emailService.send).toHaveBeenCalledWith('user@test.com', expect.any(String));\n});"
        },
        {
          id: 2,
          text: "User sees error message if email service fails",
          verdict: "Pass",
          confidence: 85,
          evidence: "src/auth/resetPassword.js line 31 — catch block calls toast.error('Failed to send reset email')",
          test: "test('shows error when email fails', async () => {\n  emailService.send.mockRejectedValue(new Error('SMTP error'));\n  await resetPassword('x@x.com');\n  expect(toast.error).toHaveBeenCalled();\n});"
        },
        {
          id: 3,
          text: "Reset token expires after 24 hours",
          verdict: "Fail",
          confidence: 95,
          evidence: "No token expiry logic found in any of the 4 changed files. generateToken() called without expiresIn parameter.",
          test: "test('reset token expires after 24h', () => {\n  const token = generateToken(userId);\n  expect(token.expiresIn).toBe('24h');\n  expect(token.exp - token.iat).toBe(86400);\n});"
        }
      ]
    }
  },
  feature: {
    id: 'feature',
    title: '✨ Feature Request Demo',
    color: 'border-primary',
    jira: JSON.stringify({
      title: "Feature: Add dark mode toggle",
      type: "Feature",
      priority: "Medium",
      description: "Users want a dark/light mode switch accessible from the navbar. Preference should persist across sessions.",
      acceptance_criteria: [
        "Toggle button visible in top navbar on all pages",
        "User preference saved to localStorage",
        "All pages and components respect the selected theme"
      ]
    }, null, 2),
    pr: "https://github.com/vercel/next.js/pull/456",
    verdict: {
      overall_verdict: "Pass",
      confidence: 91,
      summary: "All three acceptance criteria are satisfied. Theme toggle is implemented, persisted, and applied globally.",
      requirements: [
        {
          id: 1,
          text: "Toggle button visible in top navbar on all pages",
          verdict: "Pass",
          confidence: 94,
          evidence: "components/Navbar.jsx line 18 — <ThemeToggle /> added inside nav bar, rendered on _app.js root layout",
          test: "test('navbar shows theme toggle', () => {\n  render(<Navbar />);\n  expect(screen.getByRole('button', { name: /theme/i })).toBeInTheDocument();\n});"
        },
        {
          id: 2,
          text: "User preference saved to localStorage",
          verdict: "Pass",
          confidence: 96,
          evidence: "hooks/useTheme.js line 11 — localStorage.setItem('theme', newTheme) called on every toggle",
          test: "test('saves theme to localStorage', () => {\n  const { toggleTheme } = renderHook(() => useTheme());\n  act(() => toggleTheme());\n  expect(localStorage.getItem('theme')).toBe('dark');\n});"
        },
        {
          id: 3,
          text: "All pages and components respect the selected theme",
          verdict: "Pass",
          confidence: 88,
          evidence: "styles/globals.css — CSS variables defined for both [data-theme='light'] and [data-theme='dark'] applied at root level",
          test: "test('applies dark theme class to root', () => {\n  renderWithTheme('dark', <App />);\n  expect(document.documentElement.dataset.theme).toBe('dark');\n});"
        }
      ]
    }
  },
  refactor: {
    id: 'refactor',
    title: '🔧 Refactor Demo',
    color: 'border-secondary',
    jira: JSON.stringify({
      title: "Refactor: Replace callbacks with async/await in auth module",
      type: "Refactor",
      priority: "Low",
      description: "The auth.js module uses legacy callback patterns making it hard to read and maintain. Convert all callbacks to async/await.",
      acceptance_criteria: [
        "All callback functions in auth.js replaced with async/await",
        "No change in external API behaviour or function signatures",
        "All existing unit tests continue to pass"
      ]
    }, null, 2),
    pr: "https://github.com/expressjs/express/pull/789",
    verdict: {
      overall_verdict: "Partial",
      confidence: 68,
      summary: "Callbacks successfully converted but two function signatures were changed and test coverage dropped.",
      requirements: [
        {
          id: 1,
          text: "All callback functions in auth.js replaced with async/await",
          verdict: "Pass",
          confidence: 97,
          evidence: "src/auth.js — 8 callback functions converted. No remaining .then() or callback(err, result) patterns found in diff.",
          test: "test('auth functions are async', () => {\n  expect(login.constructor.name).toBe('AsyncFunction');\n  expect(register.constructor.name).toBe('AsyncFunction');\n});"
        },
        {
          id: 2,
          text: "No change in external API behaviour or function signatures",
          verdict: "Fail",
          confidence: 88,
          evidence: "src/auth.js line 45 — verifyUser() signature changed from verifyUser(id, cb) to verifyUser(id). Breaking change for callers.",
          test: "test('verifyUser maintains original signature', () => {\n  expect(verifyUser.length).toBe(2);\n});"
        },
        {
          id: 3,
          text: "All existing unit tests continue to pass",
          verdict: "Partial",
          confidence: 61,
          evidence: "tests/auth.test.js — 2 of 9 tests deleted in this PR instead of being updated. Remaining 7 tests appear intact.",
          test: "test('all original test cases exist', () => {\n  const tests = getTestNames('tests/auth.test.js');\n  expect(tests.length).toBeGreaterThanOrEqual(9);\n});"
        }
      ]
    }
  }
};
