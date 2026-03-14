# 🚀 PR Autopilot - AI-Powered Code Review Revolution

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.4.1-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-blue.svg)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-Powered-green.svg)](https://ai.google.dev/)

> Transform your code reviews from tedious checklists to intelligent conversations! PR Autopilot uses cutting-edge AI to automatically evaluate pull requests against Jira tickets, providing detailed feedback, scoring, and actionable insights.

## ✨ What Makes PR Autopilot Special?

Imagine having a senior developer who never sleeps, instantly reviews your code, and gives you a complete report card. That's PR Autopilot!

- 🤖 **AI-Powered Analysis**: Uses Google's Gemini AI to understand code changes and requirements
- 🎯 **Jira Integration**: Automatically fetches and analyzes Jira ticket requirements
- 📊 **Smart Scoring**: Provides detailed scores for code quality, completeness, and requirements matching
- 🎨 **Cinematic UI**: Beautiful, modern interface with smooth animations and glassmorphism design
- 🔄 **Real-time Evaluation**: Instant feedback as you work
- 📱 **Responsive Design**: Works perfectly on desktop and mobile
- 💾 **Persistent History**: Saves all your evaluations for future reference

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite for lightning-fast development
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion for smooth transitions
- **AI**: Google Gemini AI for intelligent analysis
- **APIs**: GitHub API for PR data, Jira API for ticket details

## 🚀 Quick Start

Want to see PR Autopilot in action? Follow these simple steps:

1. **Clone the repository**
   ```bash
   git clone https://github.com/TarunTheDev/pr-autopilot.git
   cd pr-autopilot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up your API keys** (see Configuration section below)

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser** to `http://localhost:5173` and start evaluating PRs!

## 📋 Detailed Installation

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn
- A code editor (VS Code recommended)

### Step-by-Step Setup

1. **Download the project**
   - If you cloned from GitHub, you're good!
   - Or download the ZIP file and extract it

2. **Open in your code editor**
   - Open the project folder in VS Code or your preferred editor

3. **Install all the required packages**
   ```bash
   npm install
   ```
   This might take a few minutes - it's downloading all the tools needed to run the app.

4. **Configure API keys** (see next section)

5. **Start the app**
   ```bash
   npm run dev
   ```

6. **View in browser**
   - The app will open at `http://localhost:5173`
   - If that port is busy, it will use `http://localhost:5174`

## 🔑 Configuration (API Keys Setup)

PR Autopilot needs API keys to connect to external services. Don't worry - this is easy and secure!

### 1. Get Your API Keys

**Gemini AI Key** (Required for AI analysis):
- Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
- Create a new API key
- Copy the key

**GitHub Personal Access Token** (Required for PR data):
- Go to GitHub Settings → Developer settings → Personal access tokens
- Generate new token with `repo` permissions
- Copy the token

**Jira API Token** (Required for ticket data):
- Go to [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens)
- Create API token
- Copy the token
- Note your Jira email and domain

### 2. Create Environment File

1. In the project root, create a new file called `.env`
2. Copy this content into it:
   ```
   VITE_GEMINI_API_KEY=your_gemini_key_here
   VITE_GITHUB_TOKEN=your_github_token_here
   VITE_JIRA_EMAIL=your_jira_email@example.com
   VITE_JIRA_API_TOKEN=your_jira_token_here
   VITE_JIRA_DOMAIN=yourcompany.atlassian.net
   ```
3. Replace the placeholder values with your actual keys

### 3. Security Note
- Never share your `.env` file or commit it to GitHub
- The `.gitignore` file already protects you from accidentally uploading secrets

## 🎯 How to Use PR Autopilot

### Basic Evaluation

1. **Open the app** in your browser
2. **Enter PR details**:
   - Paste the GitHub PR URL (e.g., `https://github.com/owner/repo/pull/123`)
   - Paste the Jira ticket URL (e.g., `https://yourcompany.atlassian.net/browse/PROJ-456`)
3. **Click "Evaluate PR"**
4. **Wait for magic** - The AI analyzes everything automatically!
5. **Review results** - See scores, feedback, and recommendations

### Understanding the Results

- **Overall Score**: 0-100 rating of how well the PR meets requirements
- **Code Quality**: Technical excellence of the implementation
- **Requirements Match**: How completely the PR addresses the Jira ticket
- **Detailed Feedback**: Specific suggestions for improvement
- **Action Items**: Concrete steps to make the PR better

### Advanced Features

- **History Page**: View all your past evaluations
- **Remediation Simulator**: Test how changes would improve scores
- **Benchmark Arena**: Compare different PR approaches
- **Judge Toolkit**: Advanced analysis tools for reviewers

## 📸 Screenshots

*Coming soon - screenshots of the beautiful cinematic interface!*

## 🤝 Contributing

Love PR Autopilot? Want to make it even better?

1. Fork the repository
2. Create a feature branch (`git checkout -b amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin amazing-feature`)
7. Open a Pull Request

We welcome contributions of all kinds - bug fixes, features, documentation, or just ideas!

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ using modern web technologies
- Powered by Google's Gemini AI
- Inspired by the need for better code review processes
- Created for hackathons and real-world development teams

## 🆘 Troubleshooting

**App won't start?**
- Make sure you ran `npm install`
- Check that Node.js is installed (`node --version`)

**API errors?**
- Verify your `.env` file has the correct keys
- Check that your GitHub token has `repo` permissions
- Ensure your Jira domain and email are correct

**Slow performance?**
- The AI analysis takes 10-30 seconds - this is normal!
- Check your internet connection

**Need help?**
- Open an issue on GitHub
- Check the console for error messages (F12 → Console)

---

**Ready to revolutionize your code reviews?** ⭐ Star this repo and share with your team!

*Built for the future of software development* 🚀