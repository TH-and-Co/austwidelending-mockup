# Aust Wide Lending - Mortgage Solutions

Modern, high-performance web platform for **Aust Wide Lending**, an Australian mortgage brokerage specializing in residential lending, refinancing, and investment property finance.

Built with semantic HTML5, modern vanilla CSS tokens, and reactive vanilla JavaScript bundled via [Vite](https://vitejs.dev/).

---

## 🌟 Key Features

- **Heritage Brand Design System**: Tailored palette reflecting the client's authentic logo:
  - Deep Forest Pine (`#0B1E14` / `#081810`)
  - Warm Earthy Gold (`#C29B38` / `#D99E26`)
  - British Bottle Green (`#114227`)
  - Soft Alabaster (`#F8F9F7` / `#FCFCFD`)
- **Interactive Mortgage Repayment Calculator**:
  - Live calculation for Principal & Interest and Interest-Only loans.
  - Property value tactile slider & AUD currency input formatter.
  - Quick deposit ratio presets (10%, 20% No LMI, 25%, 30%).
  - Frequency switcher (Monthly, Fortnightly, Weekly) with fluid animated transitions.
  - 5-year Interest-Only reversion amortization schedule.
  - Single-variable rate benchmark configuration in `calculator.js`.
- **High-Resolution Vector Identity**:
  - Recreated SVG vector brand mark combining the Australian geographic silhouette and modern architectural roofline.
- **Accredited Lenders Trust Strip**:
  - Official monochrome SVG/PNG logo marks for Australia's major lenders (Commonwealth Bank, Westpac, NAB, ANZ, Macquarie, Bankwest, ING, Suncorp) with subtle interactive hover reveal.
- **Pre-Approval Lead Capture Modal**:
  - Accessible dialog modal for customer inquiries and fast-track pre-approvals.
- **Responsive Architecture**:
  - Optimized for mobile, tablet, and ultra-wide displays with responsive navigation drawer and sticky glassmorphic header.

---

## 📁 Project Structure

```
aus-wide-lending/
├── assets/
│   ├── aust-wide-logo.svg       # Brand vector SVG identity
│   ├── hero-home.jpg            # Dusk Australian residence facade
│   └── lenders/                 # Official Australian bank logo marks
│       ├── anz.svg
│       ├── bankwest.png
│       ├── commbank.svg
│       ├── ing.svg
│       ├── macquarie.svg
│       ├── nab.svg
│       ├── suncorp.svg
│       └── westpac.svg
├── calculator.js                # Reactive mortgage calculation engine & rate configs
├── index.html                   # Semantic markup, hero section & trust components
├── main.js                      # Modal dialog, scroll header & mobile drawer logic
├── styles.css                   # Modern CSS design system, tokens & responsive styles
├── package.json                 # Project configuration & npm scripts
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ recommended)
- `npm` or `pnpm` / `yarn`

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd aus-wide-lending

# Install development dependencies
npm install
```

### Running Locally

```bash
# Start the local Vite development server
npm run dev
```

The dev server will be accessible at `http://localhost:5173/`.

### Building for Production

```bash
# Generate the optimized production bundle
npm run build
```

Production files will be output to the `dist/` directory.

### Previewing the Production Build

```bash
# Preview the production build locally
npm run preview
```

---

## ⚙️ Mortgage Rate Configuration

The benchmark interest rates are centralized in [`calculator.js`](./calculator.js) for simple 1-line client updates without modifying markup:

```javascript
export const DEFAULT_VARIABLE_RATE = 0.0614; // 6.14% p.a. standard variable benchmark
export const IO_VARIABLE_RATE = 0.0644;      // 6.44% p.a. interest-only benchmark
```

---

## 🚢 Deployment

The project can be deployed to any static hosting service:

- **Vercel**: Import repository -> Framework: `Vite` -> Build Command: `npm run build` -> Output Directory: `dist`
- **Netlify**: Connect repository -> Build Command: `npm run build` -> Publish Directory: `dist`
- **Cloudflare Pages**: Connect repository -> Build Command: `npm run build` -> Output Directory: `dist`
- **GitHub Pages**: Build and deploy `dist` branch or configure GitHub Actions workflow.

---

## 📄 License
Private & Proprietary - Aust Wide Lending.
