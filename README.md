# Upwork Proposal Generator

An AI-powered tool that helps freelancers analyze job postings and generate winning proposals on Upwork. Built to eliminate guesswork — know whether a job is worth your Connects before you apply.

🔗 **Live Demo**: [upwork-proposal-generator](https://upwork-proposal-generator-l5o3klla4-luzaipings-projects.vercel.app/)

---

## Features

### 🧠 AI-Powered Analysis
- **Job Analysis** — evaluates difficulty, skill match, required/missing skills, and strategy using DeepSeek AI
- **Proposal Generation** — generates a cover letter and full proposal with real-time streaming output

### 📊 Scoring Engine
- **Job Score** — calculates overall score, apply confidence, estimated win rate, and risk level
- **Competition Estimation** — detects competition level, market saturation, market type, and differentiation potential from job description keywords
- **Price Evaluation** — assesses client budget against your target hourly rate and recommends a bid range
- **Timing Advice** — evaluates how long ago the job was posted and whether the application window is still open
- **Connects Estimation** — estimates how many Connects the job requires and whether it's worth spending them

### ✅ Decision Engine
- **Final Verdict** — consolidates all analysis into a single `APPLY / CONSIDER / SKIP` decision with confidence score, highlights, and concerns
- **Smart Gating** — proposal generation is skipped when verdict is `SKIP`, with an option to override

### ⚙️ Advanced Options
- Job title, budget (fixed / hourly), client history, job posted time, and target hourly rate — all optional fields that improve analysis accuracy
- Designed for manual input now, ready for automated CDP integration later

---

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **AI**: DeepSeek API (chat completions, streaming)
- **Build**: Vite
- **Deploy**: Vercel

---

## Local Development

### Prerequisites
- Node.js 18+
- DeepSeek API Key — get one at [platform.deepseek.com](https://platform.deepseek.com)

### Setup

```bash
# Clone the repo
git clone https://github.com/luzaiping/upwork-proposal-generator.git
cd upwork-proposal-generator

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Add your DeepSeek API key to .env:
# VITE_DEEPSEEK_API_KEY=your_api_key_here

# Start development server
npm run dev
```

---

## How It Works

```
Job Description + Skills (Form Input)
        ↓
   Job Mapper — normalizes form data into a canonical Job model
        ↓
   AI Analysis — DeepSeek evaluates difficulty, match score, skills
        ↓
   ┌─────────────────────────────────┐
   │  Local Scoring Engine           │
   │  • Job Score                    │
   │  • Competition Estimation       │
   │  • Price Evaluation             │
   │  • Timing Advice                │
   │  • Connects Estimation          │
   └─────────────────────────────────┘
        ↓
   Decision Engine — APPLY / CONSIDER / SKIP
        ↓
   AI Proposal Generation (streaming)
        ↓
   Cover Letter + Full Proposal
```

---

## Project Structure

```
src/
├── features/
│   └── proposal/
│       └── components/
│           ├── ProposalForm.tsx        # Left panel: input form
│           ├── ProposalResult.tsx      # Right panel: results
│           └── AnalysisAccordion.tsx   # Collapsible analysis details
├── services/
│   ├── ai.ts                          # DeepSeek streaming proposal generation
│   ├── analysis.ts                    # DeepSeek job analysis
│   ├── scoring.ts                     # Job scoring algorithm
│   ├── competition.ts                 # Competition estimation
│   ├── pricing.ts                     # Price evaluation
│   ├── timing.ts                      # Job posting timing advice
│   ├── decision.ts                    # Final decision engine
│   └── connects.ts                    # Connects estimation
├── types/
│   ├── job.ts                         # Job, JobAnalysis, Budget, ClientHistory types
│   ├── proposal.ts                    # ProposalFormData, ProposalContent types
│   └── scoring.ts                     # JobScore, CompetitionEstimation, DecisionSummary types
├── prompts/
│   ├── analysis.ts                    # DeepSeek analysis prompt
│   └── proposal.ts                    # DeepSeek proposal prompt
└── utils/
    └── mapFormToJob.ts                # Form → Job model mapper
```

---

## Roadmap

- [x] Job history — save and compare analyzed jobs
- [x] Export — download analysis and proposal as Markdown
- [ ] CDP integration — auto-fetch job details and user profile from Upwork
- [ ] Candidate profile layer — pull skills and hourly rate from Upwork User Profile

---

## Author
Frontend developer with 10+ years of experience specializing in React, Vue, TypeScript, and modern frontend architecture.

Strong experience building internal enterprise platforms, H5 applications, AI-integrated web apps, and frontend engineering tooling using Vite, Webpack, and Node.js ecosystems.

Skilled in:

* React / Vue / TypeScript
* Tailwind CSS
* AI API integration & streaming UI
* Frontend architecture & component systems
* Vite / Webpack tooling
* Node.js / Egg.js
* AI-assisted product development

Currently focused on AI-powered SaaS tools, freelancer productivity systems, and AI copilot workflows.

Available for freelance work on [Upwork](https://www.upwork.com).