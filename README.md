# easyFinance (FinLens)

> An always-on-top, translucent desktop HUD designed to demystify financial jargon into plain everyday metaphors, unmask contract fine-print traps with real-time Red Flag alerts, and visualize cash-flow logic directly across your workspace.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![GitHub release](https://img.shields.io/github/v/release/kudraet7-cmyk/EasyFinance?include_prereleases&style=flat-square)](https://github.com/kudraet7-cmyk/EasyFinance/releases)
[![Build & Test](https://github.com/kudraet7-cmyk/EasyFinance/actions/workflows/ci.yml/badge.svg)](https://github.com/kudraet7-cmyk/EasyFinance/actions/workflows/ci.yml)

---

## Why We Built This

The financial industry possesses a structural incentive: **wrapping straightforward concepts in convoluted jargon to widen the information asymmetry.**

- Deducting money from your balance daily regardless of whether an asset makes or loses money is phrased as *"accrued daily against net asset value"*.
- Forfeiting 1.5% of your principal for exiting an investment within seven days is termed a *"compensatory exit penalty fee"*.
- Extrapolating a few fortunate trading days into a hypothetical year-long annualized benchmark is promoted as *"expected annualized return"*.

Everyday investors—young graduates, retirees investing pensions, or everyday working people—do not lack intelligence. Rather, **they are intentionally locked out by towering walls of terminology and buried fine print.**

The market has plenty of trading terminals, but almost zero **neutral, plainspoken, uncompromised companions built strictly for regular people—without ads, brokers, or trading incentives.**

---

## Architecture & Design Philosophy

### 1. Why an "Always-on-Top Floating HUD" Instead of Another Web Dashboard?
We deliberately rejected the conventional route of creating an isolated, full-screen portal.
In real-world scenarios, no user wants to interrupt their flow by copying obscure clauses, opening a browser tab, and pasting them into a chatbot.

- **Zero Flow Disruption**: Functions as an ultra-lightweight floating heads-up display (HUD) anchored above your active workspace.
- **Desktop Transparency**: Floats seamlessly over whatever you are looking at—trading terminals, banking PDFs, brokerage apps, or chat messages.
- **On-Demand Access**: Trigger an instant screen snip (<kbd>⌘⇧4</kbd> or <kbd>Win+Shift+S</kbd>) or select text anywhere on your screen for immediate, in-place decryption.

### 2. Why Dual-Mode: "Everyday Metaphors" vs. "Rigorous Financial Logic"?
Dry textbook definitions leave beginners overwhelmed, while simplistic oversimplifications strip away contractual fidelity.
We resolve this tension with **one-click mode switching**:
- **Plain Metaphor Mode**: Compels explanations using everyday relatable analogies (e.g., *"Like a landlord deducting utility fees every morning whether you stayed home or were away on vacation"*).
- **Pro Logic Mode**: Provides formal mathematical equations, directed acyclic cash-flow diagrams (DAG), and regulatory statutory citations.

### 3. Why the "Red Flag Alert" Radar?
Most retail investors do not lose capital due to ordinary market fluctuations—they get caught by traps buried in terms and conditions.
When clauses containing *"guaranteed return"*, *"mandatory lockup"*, or *"accrued daily"* are detected, the assistant instantly ignites an **amber warning halo** and surfaces a dedicated risk-analysis briefing detailing liquidity constraints and hidden drag costs.

---

## Non-Negotiable Boundary: Why We Explain Principles but NEVER Predict Price

Within the design doctrine of easyFinance, one boundary sits paramount:

> **easyFinance is purely a cognitive tool, never a trading advisory or algorithmic oracle.**

### 1. Technical Indicators Are Backward-Looking Statistics, Not Future Crystal Balls
When you capture a chart featuring MACD, RSI, or Bollinger Bands:
- **What easyFinance DOES**:
  Explains how the indicator is mathematically derived from exponential moving averages, the statistical significance of momentum divergence, and its inherent lag.
- **What easyFinance NEVER DOES**:
  **It will NEVER tell you "Buy here" or "The market will rally tomorrow."**

### 2. Why We Hold This Line
1. **Preventing False Security**: If an AI purports to generate entry/exit signals, users naturally develop dependency, surrender their own critical analysis, and abandon risk discipline.
2. **Rejecting Churn & Pump-and-Dump Dynamics**: Products that promise short-term price predictions inevitably degenerate into paid subscription rooms, referral rackets, or predatory schemes. Open-source integrity requires an absolute wall between explanation and speculation.
3. **Teaching to Fish, Not Handing Out Bait**: Our goal is to illuminate the rules of the playing field and clarify how institutional mechanics operate—not to pull the trigger for you. Financial risk must remain the sober responsibility of an educated individual.

---

## Community-Driven Anti-Trap Glossary

Financial terminology evolves constantly, and institutional fine print finds new ways to obfuscate.
We invite university students, legal professionals, and financial literacy advocates to collaborate:

- Contribute hidden contractual traps and vivid everyday metaphors in [`src/data/communityGlossary.ts`](./src/data/communityGlossary.ts).
- Add high-risk clause definitions to the radar engine in [`src/utils/riskRadar.ts`](./src/utils/riskRadar.ts).

See [CONTRIBUTING.md](./CONTRIBUTING.md) for full submission guidelines.

---

## Local Development & Packaging

Built on **React + TypeScript + Vite + Tailwind CSS**, with desktop cross-compilation powered by **Tauri (Rust)** and **Electron**.

### Local Setup
```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Lint and build check
npm run lint
npm run build
