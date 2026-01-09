# Hormona Operations Center

A production-quality MVP of a Head of Operations Command Center for Hormona, a digital health/wellness startup. This dashboard helps the Head of Ops manage finance, revenue, partnerships, operations, vendors, and compliance with comprehensive KPI tracking and board-pack export capabilities.

## 🎯 Features

### Core Modules

1. **Overview (Weekly Operating Review)** - `/overview`
   - KPI scoreboard with key metrics across all areas
   - Alert strip for critical issues (runway, churn, vendor renewals)
   - This week's priorities and active initiatives
   - Partnership pipeline snapshot (top 5 deals)
   - Risks to watch panel
   - Cash balance trend chart

2. **Finance** - `/finance`
   - Cash, runway, and burn rate KPIs
   - 12-month cash balance trend
   - Budget vs actuals table
   - Interactive scenario planner (Base/Bear/Bull cases)
   - Month-end close checklist

3. **Revenue** - `/revenue`
   - MRR/ARR tracking with growth trends
   - Churn rate monitoring
   - Unit economics panel (CAC, LTV, LTV:CAC ratio, payback period)
   - Cohort retention analysis
   - Pricing & packaging experiment results

4. **Partnerships** - `/partnerships`
   - Partnership pipeline kanban board (4 stages)
   - Deal value calculator (expected value = value × probability)
   - Contract tracker with renewal dates
   - Pipeline metrics (total value, weighted pipeline, avg deal size)

5. **Operations** - `/operations`
   - Bottleneck radar with root cause analysis
   - Cross-functional execution board (initiatives by status)
   - Support/ops KPIs (response time, CSAT, refund rate)
   - Team capacity tracking
   - Process improvement log

6. **Vendors** - `/vendors`
   - Vendor directory with all contracts
   - Spend breakdown by category (pie chart)
   - Renewal alerts (90-day lookout)
   - High-risk vendor flagging
   - Procurement workflow stub

7. **Risk & Compliance** - `/risk`
   - Risk register with likelihood/impact matrix
   - Risk heat map visualization
   - Compliance checklist (GDPR, privacy, security)
   - Incident log with resolutions
   - Risk trend tracking

8. **Board Pack** - `/board-pack`
   - Executive summary (highlights & concerns)
   - KPI dashboard snapshot
   - Financial overview with scenario planning
   - Top 3 partnership deals
   - Top risks & mitigation plans
   - Board asks & decisions needed
   - Print/export functionality

### Key Features

- **KPI Definitions Modal**: Click any KPI to see definition, formula, owner, target, and data source
- **Alerts System**: Automated alerts based on thresholds (runway < 9mo, churn spike, etc.)
- **Change Log Timeline**: Track major events (price changes, campaigns, vendor swaps) with impact notes
- **Interactive Components**: Scenario planner sliders, deal calculator, kanban boards
- **Date Range Selector**: Global filter for Last 7/30 days, QTD, YTD
- **Responsive Design**: Mobile-friendly layout with Hormona brand aesthetic

## 🎨 Design System

**Hormona Brand Palette:**
- Background: `#FFF7F3` (warm white)
- Card: `#F6EFEA` (soft beige)
- Border: `#E7DED7` (subtle tan)
- Primary: `#E56B4E` (coral accent)
- Secondary: `#F4C7B8` (soft peach)
- Accent3: `#D45A3E` (deep coral)

**Design Principles:**
- Rounded cards (2xl) with soft shadows
- Generous whitespace for calm, clinical feel
- Subtle charts and minimal color usage
- Clean typography (Inter font)

## 🛠 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui (Radix UI primitives)
- **Charts**: Recharts
- **Data Validation**: Zod schemas
- **Data**: Local mock data (no backend required)

## 📦 Installation

### Prerequisites

- Node.js 18+ or 20+
- pnpm (recommended) or npm

### Setup

1. Navigate to the project directory:
```bash
cd hormona-ops-center
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Run the development server:
```bash
pnpm dev
# or
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

The app will automatically redirect to `/overview`.

## 🗂 Project Structure

```
hormona-ops-center/
├── app/                          # Next.js 14 App Router
│   ├── layout.tsx               # Root layout with sidebar & top bar
│   ├── page.tsx                 # Redirects to /overview
│   ├── overview/page.tsx        # Weekly Operating Review
│   ├── finance/page.tsx         # Finance dashboard
│   ├── revenue/page.tsx         # Revenue & unit economics
│   ├── partnerships/page.tsx    # Pipeline & deals
│   ├── operations/page.tsx      # Bottlenecks & execution
│   ├── vendors/page.tsx         # Vendor management
│   ├── risk/page.tsx            # Risk & compliance
│   ├── board-pack/page.tsx      # Board pack builder
│   └── globals.css              # Global styles
├── components/                   # Reusable components
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   └── separator.tsx
│   ├── alerts-strip.tsx         # Alert banners
│   ├── insights-panel.tsx       # Key insights sidebar
│   ├── kanban-board.tsx         # Partnership pipeline kanban
│   ├── kpi-card.tsx             # KPI metric card
│   ├── kpi-definitions-dialog.tsx # KPI detail modal
│   ├── scenario-planner.tsx     # Financial scenario planner
│   ├── sidebar.tsx              # Left navigation
│   ├── timeline.tsx             # Change log timeline
│   ├── top-bar.tsx              # Top navigation bar
│   └── trend-chart.tsx          # Line/area charts
├── data/                         # Mock data & types
│   ├── types.ts                 # TypeScript interfaces & Zod schemas
│   └── mock-data.ts             # All mock data
├── lib/
│   └── utils.ts                 # Utility functions (cn, formatters)
├── public/                       # Static assets
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
├── next.config.js               # Next.js configuration
├── postcss.config.js            # PostCSS configuration
├── package.json                 # Dependencies
└── README.md                    # This file
```

## 📊 Data Model

All data is defined in `data/types.ts` with Zod schemas for validation:

- **KPI**: id, name, value, unit, target, trendPct, status, owner, definition, formula, source, updatedAt
- **ForecastScenario**: name (Base/Bear/Bull), assumptions, outputs (burn, runway, mrr)
- **Deal**: partnerName, type, stage, value, probability, nextStep, closeDate, notes
- **Vendor**: name, category, spendMonthly, renewalDate, sla, riskRating, issues
- **Risk**: title, likelihood, impact, mitigation, owner, nextReviewDate, status
- **Initiative**: title, team, owner, status, dueDate, dependencies, impactScore
- **Bottleneck**: area, issue, rootCause, impact, owner, fixBy
- **PricingExperiment**: name, hypothesis, startDate, endDate, result, impact, status
- **ChangeLogEntry**: date, title, description, category, impact

Mock data lives in `data/mock-data.ts` and includes realistic values for all modules.

## 🎯 Key Interactions

### KPI Cards
- Click any KPI card to open the Definitions Dialog
- Shows formula, owner, target, data source, and last update time

### Scenario Planner
- Toggle between Bear/Base/Bull scenarios via tabs
- View different assumptions (hiring, marketing spend, COGS%, price, churn)
- See projected outcomes (burn, runway, MRR)

### Deal Calculator
- Enter deal value and adjust probability slider
- Calculates expected value automatically
- Formula shown: Deal Value × Probability

### Alerts
- Auto-generated based on thresholds:
  - Runway < 9 months → Critical alert
  - Churn > 6% → Critical alert
  - Vendor renewal < 60 days → Warning alert
  - CAC > target → Warning alert
- Dismissible with X button

### Board Pack Export
- Click "Print / Save as PDF" for browser print dialog
- Use Ctrl/Cmd+P to save as PDF
- "Export Board Pack" button shows stub message (would generate PDF in production)

## 🎨 Customization

### Changing Brand Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  background: "#FFF7F3",  // Main background
  card: "#F6EFEA",        // Card background
  border: "#E7DED7",      // Borders
  primary: {
    DEFAULT: "#E56B4E",   // Primary CTA color
  },
  // ... other colors
}
```

### Adding New KPIs

1. Add to `data/mock-data.ts`:
```typescript
export const mockKPIs: KPI[] = [
  // ... existing KPIs
  {
    id: 'new-kpi',
    name: 'New Metric',
    value: 100,
    unit: 'units',
    // ... rest of KPI properties
  }
]
```

2. Display in relevant page:
```typescript
const newKPI = mockKPIs.find(kpi => kpi.id === 'new-kpi')
```

### Adding New Routes

1. Create `app/new-route/page.tsx`
2. Add to sidebar navigation in `components/sidebar.tsx`:
```typescript
const navigation = [
  // ... existing routes
  { name: 'New Route', href: '/new-route', icon: YourIcon },
]
```

## 🚀 Production Deployment

### Build

```bash
pnpm build
# or
npm run build
```

### Start Production Server

```bash
pnpm start
# or
npm start
```

### Deploy to Vercel (Recommended)

1. Push to GitHub
2. Import repository on [Vercel](https://vercel.com)
3. Deploy (zero configuration needed)

### Deploy to Other Platforms

- **Netlify**: Use Next.js plugin
- **AWS Amplify**: Connect repo and deploy
- **Docker**: Create Dockerfile with `next build` and `next start`

## 🔧 Development

### Code Style

- Uses TypeScript strict mode
- Follows Next.js 14 App Router conventions
- Server components by default, 'use client' where needed
- Tailwind utility classes for styling
- shadcn/ui patterns for components

### Key Conventions

- All routes are in `app/` directory
- Reusable components in `components/`
- Mock data centralized in `data/mock-data.ts`
- Utility functions in `lib/utils.ts`
- Use `cn()` helper for conditional classes

### Adding New Mock Data

Edit `data/mock-data.ts` and export new arrays/objects. Example:

```typescript
export const mockNewData: NewType[] = [
  { id: '1', field: 'value' },
  // ...
]
```

Then import in your page:
```typescript
import { mockNewData } from '@/data/mock-data'
```

## 📝 Notes

### No Backend Required
This is a **fully client-side application**. All data is mocked locally. No API calls, no database, no authentication. Perfect for:
- MVP demos
- Design reviews
- Stakeholder presentations
- Architecture planning

### Future Enhancements (Not Included)

To make this production-ready, you would add:

1. **Backend Integration**
   - Replace mock data with API calls
   - Add authentication (NextAuth.js)
   - Connect to database (Prisma + PostgreSQL)

2. **Real-Time Updates**
   - WebSocket connections for live data
   - Auto-refresh intervals

3. **Advanced Features**
   - PDF export with libraries (jsPDF, Puppeteer)
   - Email scheduling for board packs
   - Multi-user roles & permissions
   - Data export to CSV/Excel
   - Historical data comparison

4. **Analytics Integration**
   - Connect to actual data sources (Stripe, analytics platforms)
   - Automated KPI calculations
   - Real-time alerting via email/Slack

## 📄 License

MIT License - feel free to use this for your own projects!

## 🙋 Support

For questions or issues:
1. Check the code comments in each file
2. Review the data model in `data/types.ts`
3. Examine mock data structure in `data/mock-data.ts`

---

**Built with ❤️ for Hormona by Claude Sonnet 4.5**

*January 2026*
