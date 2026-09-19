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
    title: '🐛 Bug Fix',
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
          test: "test('sends reset email on submit', async () => {\n  const mockSend = jest.fn();\n  emailService.send = mockSend;\n  await resetPassword('user@test.com');\n  expect(mockSend).toHaveBeenCalledWith('user@test.com', expect.any(String));\n  expect(mockSend).toHaveBeenCalledTimes(1);\n});"
        },
        {
          id: 2,
          text: "User sees error message if email service fails",
          verdict: "Pass",
          confidence: 85,
          evidence: "src/auth/resetPassword.js line 31 — catch block calls toast.error('Failed to send reset email')",
          test: "test('shows error when email fails', async () => {\n  emailService.send.mockRejectedValue(new Error('SMTP error'));\n  const toastSpy = jest.spyOn(toast, 'error');\n  await resetPassword('x@x.com');\n  expect(toastSpy).toHaveBeenCalledWith('Failed to send reset email');\n});"
        },
        {
          id: 3,
          text: "Reset token expires after 24 hours",
          verdict: "Fail",
          confidence: 95,
          evidence: "No token expiry logic found in any of the 4 changed files. generateToken() called without expiresIn parameter.",
          test: "test('reset token expires after 24h', () => {\n  const token = generateToken(userId);\n  expect(token.expiresAt).toBeDefined();\n  const diff = token.expiresAt - Date.now();\n  expect(diff).toBeLessThanOrEqual(86400000); // 24 hours in ms\n  expect(diff).toBeGreaterThan(0);\n});"
        }
      ]
    }
  },
  feature: {
    id: 'feature',
    title: '✨ Feature Request',
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
          test: "test('navbar shows theme toggle button', () => {\n  render(<Navbar />);\n  const toggleButton = screen.getByRole('button', { name: /theme/i });\n  expect(toggleButton).toBeInTheDocument();\n  expect(toggleButton).toBeVisible();\n});"
        },
        {
          id: 2,
          text: "User preference saved to localStorage",
          verdict: "Pass",
          confidence: 96,
          evidence: "hooks/useTheme.js line 11 — localStorage.setItem('theme', newTheme) called on every toggle",
          test: "test('saves theme preference to localStorage', () => {\n  const { result } = renderHook(() => useTheme());\n  const { toggleTheme } = result.current;\n  act(() => toggleTheme());\n  expect(localStorage.getItem('theme')).toBe('dark');\n  act(() => toggleTheme());\n  expect(localStorage.getItem('theme')).toBe('light');\n});"
        },
        {
          id: 3,
          text: "All pages and components respect the selected theme",
          verdict: "Pass",
          confidence: 88,
          evidence: "styles/globals.css lines 45-68 — CSS variables defined for both [data-theme='light'] and [data-theme='dark'] applied at root level",
          test: "test('applies dark theme to document root', () => {\n  renderWithTheme('dark', <App />);\n  expect(document.documentElement.dataset.theme).toBe('dark');\n  const styles = getComputedStyle(document.documentElement);\n  expect(styles.getPropertyValue('--bg-primary')).toBe('#09090b');\n});"
        }
      ]
    }
  },
  refactor: {
    id: 'refactor',
    title: '🔧 Refactor',
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
          test: "test('auth functions are async', () => {\n  const functions = ['login', 'logout', 'register', 'verifyUser', 'refreshToken', 'resetPassword', 'verifyEmail', 'updateProfile'];\n  functions.forEach(fn => {\n    expect(auth[fn].constructor.name).toBe('AsyncFunction');\n  });\n});"
        },
        {
          id: 2,
          text: "No change in external API behaviour or function signatures",
          verdict: "Fail",
          confidence: 88,
          evidence: "src/auth.js line 45 — verifyUser() signature changed from verifyUser(id, cb) to verifyUser(id). Breaking change for 12 callers.",
          test: "test('verifyUser maintains original callback signature', () => {\n  const mockCallback = jest.fn();\n  verifyUser(123, mockCallback);\n  expect(mockCallback).toHaveBeenCalled();\n  expect(mockCallback).toHaveBeenCalledWith(null, expect.any(Object));\n});"
        },
        {
          id: 3,
          text: "All existing unit tests continue to pass",
          verdict: "Partial",
          confidence: 61,
          evidence: "tests/auth.test.js — 2 of 9 tests deleted in this PR. Test count: 7 (was 9). Remaining tests pass.",
          test: "test('all auth tests pass', async () => {\n  const results = await runTests('tests/auth.test.js');\n  expect(results.passed).toBeGreaterThanOrEqual(7);\n  expect(results.total).toBe(9);\n});"
        }
      ]
    }
  },
  performance: {
    id: 'performance',
    title: '⚡ Performance',
    color: 'border-success',
    jira: JSON.stringify({
      title: "Performance: Optimize dashboard load time",
      type: "Task",
      priority: "High",
      description: "Dashboard takes 8+ seconds to load in production. Need to reduce initial load time to under 2 seconds.",
      acceptance_criteria: [
        "Initial load time under 2 seconds on 3G network",
        "First Contentful Paint under 1.5 seconds",
        "No render-blocking resources in critical path",
        "Lazy load non-critical components"
      ]
    }, null, 2),
    pr: "https://github.com/vercel/vercel/pull/2345",
    verdict: {
      overall_verdict: "Pass",
      confidence: 88,
      summary: "Excellent performance improvements. All metrics meet or exceed targets.",
      requirements: [
        {
          id: 1,
          text: "Initial load time under 2 seconds on 3G network",
          verdict: "Pass",
          confidence: 91,
          evidence: "lighthouse-report.json line 12 — FCP: 1.2s, LCP: 1.8s, TTI: 1.9s on simulated 3G",
          test: "test('dashboard loads under 2s on 3G', async () => {\n  const metrics = await measureLoadTime('dashboard', '3g');\n  expect(metrics.loadTime).toBeLessThan(2000);\n});"
        },
        {
          id: 2,
          text: "First Contentful Paint under 1.5 seconds",
          verdict: "Pass",
          confidence: 94,
          evidence: "performance-monitor.js — FCP measured at 1.2s via Lighthouse CI in production",
          test: "test('FCP under 1.5s', async () => {\n  const fcp = await measureFCP('https://app.example.com/dashboard');\n  expect(fcp).toBeLessThan(1500);\n});"
        },
        {
          id: 3,
          text: "No render-blocking resources in critical path",
          verdict: "Pass",
          confidence: 86,
          evidence: "webpack-bundle-analyzer — All JS bundled, CSS inlined for critical path. async/defer added to non-critical scripts.",
          test: "test('no render-blocking resources', async () => {\n  const resources = await getCriticalResources();\n  const blocking = resources.filter(r => r.renderBlocking);\n  expect(blocking.length).toBe(0);\n});"
        },
        {
          id: 4,
          text: "Lazy load non-critical components",
          verdict: "Pass",
          confidence: 82,
          evidence: "routes.js — Dashboard, Charts, Analytics components wrapped in React.lazy(). Code split into 6 chunks.",
          test: "test('non-critical components are lazy loaded', () => {\n  const lazyComponents = ['Dashboard', 'Charts', 'Analytics', 'Reports'];\n  lazyComponents.forEach(name => {\n    expect(dynamicImports[name]).toBeDefined();\n  });\n});"
        }
      ]
    }
  },
  security: {
    id: 'security',
    title: '🔒 Security',
    color: 'border-warning',
    jira: JSON.stringify({
      title: "Security: Implement XSS protection",
      type: "Security",
      priority: "Critical",
      description: "Application is vulnerable to XSS attacks through user-generated content. Need to implement proper sanitization.",
      acceptance_criteria: [
        "All user input sanitized before rendering",
        "Content Security Policy headers configured",
        "DOMPurify integrated for HTML content",
        "No XSS vulnerabilities in OWASP ZAP scan"
      ]
    }, null, 2),
    pr: "https://github.com/facebook/react/pull/890",
    verdict: {
      overall_verdict: "Fail",
      confidence: 75,
      summary: "XSS vulnerabilities remain. CSP headers are configured but DOMPurify integration is incomplete.",
      requirements: [
        {
          id: 1,
          text: "All user input sanitized before rendering",
          verdict: "Partial",
          confidence: 68,
          evidence: "components/Comment.jsx line 23 — dangerouslySetInnerHTML used without sanitization. UserForm.jsx lines 45-67 properly escaped.",
          test: "test('user input is sanitized', () => {\n  const malicious = '<script>alert(\"xss\")</script>';\n  const sanitized = sanitize(malicious);\n  expect(sanitized).not.toContain('<script>');\n  expect(sanitized).not.toContain('alert');\n});"
        },
        {
          id: 2,
          text: "Content Security Policy headers configured",
          verdict: "Pass",
          confidence: 95,
          evidence: "server/middleware/security.js line 15 — CSP header set with nonce-based script-src, default-src 'self'",
          test: "test('CSP headers present', async () => {\n  const res = await fetch('/');\n  const csp = res.headers.get('content-security-policy');\n  expect(csp).toBeTruthy();\n  expect(csp).toContain(\"default-src 'self'\");\n});"
        },
        {
          id: 3,
          text: "DOMPurify integrated for HTML content",
          verdict: "Fail",
          confidence: 90,
          evidence: "package.json line 45 — DOMPurify installed but import not found in any component. Only used in 0 files.",
          test: "test('DOMPurify sanitizes HTML', () => {\n  const dirty = '<img src=x onerror=alert(1)>';\n  const clean = DOMPurify.sanitize(dirty);\n  expect(clean).not.toContain('onerror');\n  expect(clean).toBe('<img src=\"x\">');\n});"
        },
        {
          id: 4,
          text: "No XSS vulnerabilities in OWASP ZAP scan",
          verdict: "Fail",
          confidence: 85,
          evidence: "zap-report.html — 3 XSS findings: comment rendering, profile bio, search input. All high severity.",
          test: "test('ZAP scan finds no XSS', async () => {\n  const scan = await runZAPScan('https://staging.example.com');\n  const xssIssues = scan.findings.filter(f => f.type === 'XSS');\n  expect(xssIssues.length).toBe(0);\n});"
        }
      ]
    }
  },
  api: {
    id: 'api',
    title: '🌐 API Integration',
    color: 'border-pink-500',
    jira: JSON.stringify({
      title: "API Integration: Stripe payment processing",
      type: "Feature",
      priority: "High",
      description: "Implement Stripe payment processing for subscription billing. Users should be able to subscribe and manage their payment methods.",
      acceptance_criteria: [
        "Users can enter payment details and subscribe",
        "Webhook handles subscription events correctly",
        "Payment history stored and retrievable",
        "Handles failed payments gracefully with user notification"
      ]
    }, null, 2),
    pr: "https://github.com/stripe/stripe-node/pull/567",
    verdict: {
      overall_verdict: "Partial",
      confidence: 77,
      summary: "Core payment flow implemented but webhook handling has edge cases and failed payment UX is incomplete.",
      requirements: [
        {
          id: 1,
          text: "Users can enter payment details and subscribe",
          verdict: "Pass",
          confidence: 93,
          evidence: "pages/checkout.jsx lines 34-67 — Stripe Elements integrated, subscription created via POST /api/subscribe",
          test: "test('user can complete subscription', async () => {\n  const { token } = await createTestToken();\n  const result = await subscribe({ token, plan: 'pro' });\n  expect(result.subscriptionId).toBeDefined();\n  expect(result.status).toBe('active');\n});"
        },
        {
          id: 2,
          text: "Webhook handles subscription events correctly",
          verdict: "Partial",
          confidence: 71,
          evidence: "pages/api/webhooks/stripe.js — Handles customer.subscription.created and updated but missing invoice.payment_failed",
          test: "test('webhook handles all subscription events', async () => {\n  const events = ['created', 'updated', 'deleted', 'trial_will_end', 'payment_failed'];\n  for (const event of events) {\n    const result = await processWebhook(`customer.subscription.${event}`);\n    expect(result.handled).toBe(true);\n  }\n});"
        },
        {
          id: 3,
          text: "Payment history stored and retrievable",
          verdict: "Pass",
          confidence: 88,
          evidence: "lib/payments.js line 56 — Payment records stored in payments table with customer_id, amount, status, created_at",
          test: "test('payment history is stored and retrievable', async () => {\n  const payments = await getPaymentHistory(userId);\n  expect(Array.isArray(payments)).toBe(true);\n  expect(payments.length).toBeGreaterThan(0);\n  expect(payments[0]).toHaveProperty('amount');\n  expect(payments[0]).toHaveProperty('created_at');\n});"
        },
        {
          id: 4,
          text: "Handles failed payments gracefully with user notification",
          verdict: "Fail",
          confidence: 82,
          evidence: "No failed payment handling found. Email notification logic missing. User shown generic 'payment failed' without recovery options.",
          test: "test('failed payment shows user-friendly message', async () => {\n  // Simulate failed payment\n  const result = await processPayment({ amount: 100, fail: true });\n  expect(result.userNotification).toBeDefined();\n  expect(result.userNotification.type).toBe('error');\n  expect(result.userNotification.recoveryUrl).toBeDefined();\n});"
        }
      ]
    }
  },
};

export function getPresetById(id: string): Preset | undefined {
  return presets[id];
}

export function getAllPresets(): Preset[] {
  return Object.values(presets);
}

export function getPresetsByVerdict(verdict: 'Pass' | 'Partial' | 'Fail'): Preset[] {
  return Object.values(presets).filter(p => p.verdict.overall_verdict === verdict);
}