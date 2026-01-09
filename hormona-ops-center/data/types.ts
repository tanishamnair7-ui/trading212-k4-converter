import { z } from 'zod'

// KPI Types
export const KPIStatusSchema = z.enum(['green', 'yellow', 'red'])
export type KPIStatus = z.infer<typeof KPIStatusSchema>

export const KPISchema = z.object({
  id: z.string(),
  name: z.string(),
  value: z.union([z.number(), z.string()]),
  unit: z.string(),
  target: z.union([z.number(), z.string()]).optional(),
  trendPct: z.number(),
  status: KPIStatusSchema,
  owner: z.string(),
  definition: z.string(),
  formula: z.string(),
  source: z.string(),
  updatedAt: z.date(),
})

export type KPI = z.infer<typeof KPISchema>

// Forecast Scenario Types
export const ForecastScenarioSchema = z.object({
  id: z.string(),
  name: z.enum(['Base', 'Bear', 'Bull']),
  assumptions: z.object({
    hiring: z.number(),
    marketingSpend: z.number(),
    cogsPct: z.number(),
    price: z.number(),
    churn: z.number(),
  }),
  outputs: z.object({
    burn: z.number(),
    runwayMonths: z.number(),
    mrr: z.number(),
  }),
  updatedAt: z.date(),
})

export type ForecastScenario = z.infer<typeof ForecastScenarioSchema>

// Deal/Partnership Types
export const DealStageSchema = z.enum(['Prospecting', 'Qualified', 'Negotiation', 'Closed Won', 'Closed Lost'])
export type DealStage = z.infer<typeof DealStageSchema>

export const DealSchema = z.object({
  id: z.string(),
  partnerName: z.string(),
  type: z.string(),
  stage: DealStageSchema,
  value: z.number(),
  probability: z.number(),
  nextStep: z.string(),
  closeDate: z.string(),
  notes: z.string(),
})

export type Deal = z.infer<typeof DealSchema>

// Vendor Types
export const VendorSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  spendMonthly: z.number(),
  renewalDate: z.string(),
  sla: z.string(),
  riskRating: z.enum(['Low', 'Medium', 'High']),
  issues: z.string(),
})

export type Vendor = z.infer<typeof VendorSchema>

// Risk Types
export const RiskLikelihoodSchema = z.enum(['Low', 'Medium', 'High'])
export const RiskImpactSchema = z.enum(['Low', 'Medium', 'High'])

export const RiskSchema = z.object({
  id: z.string(),
  title: z.string(),
  likelihood: RiskLikelihoodSchema,
  impact: RiskImpactSchema,
  mitigation: z.string(),
  owner: z.string(),
  nextReviewDate: z.string(),
  status: z.enum(['Open', 'In Progress', 'Mitigated', 'Accepted']),
})

export type Risk = z.infer<typeof RiskSchema>

// Initiative Types
export const InitiativeSchema = z.object({
  id: z.string(),
  title: z.string(),
  team: z.string(),
  owner: z.string(),
  status: z.enum(['Not Started', 'In Progress', 'Blocked', 'Completed']),
  dueDate: z.string(),
  dependencies: z.array(z.string()),
  impactScore: z.number(),
})

export type Initiative = z.infer<typeof InitiativeSchema>

// Report Types
export const ReportSchema = z.object({
  id: z.string(),
  month: z.string(),
  summary: z.string(),
  kpiHighlights: z.array(z.string()),
  risks: z.array(z.string()),
  asks: z.array(z.string()),
})

export type Report = z.infer<typeof ReportSchema>

// Alert Types
export const AlertSchema = z.object({
  id: z.string(),
  type: z.enum(['critical', 'warning', 'info']),
  title: z.string(),
  message: z.string(),
  timestamp: z.date(),
})

export type Alert = z.infer<typeof AlertSchema>

// Time Series Data
export const TimeSeriesDataPointSchema = z.object({
  date: z.string(),
  value: z.number(),
  label: z.string().optional(),
})

export type TimeSeriesDataPoint = z.infer<typeof TimeSeriesDataPointSchema>

// Chart Data Types
export interface ChartData {
  name: string
  value: number
  [key: string]: string | number
}

// Bottleneck Types
export const BottleneckSchema = z.object({
  id: z.string(),
  area: z.string(),
  issue: z.string(),
  rootCause: z.string(),
  impact: z.string(),
  owner: z.string(),
  fixBy: z.string(),
})

export type Bottleneck = z.infer<typeof BottleneckSchema>

// Pricing Experiment Types
export const PricingExperimentSchema = z.object({
  id: z.string(),
  name: z.string(),
  hypothesis: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  result: z.string(),
  impact: z.string(),
  status: z.enum(['Planning', 'Running', 'Completed', 'Abandoned']),
})

export type PricingExperiment = z.infer<typeof PricingExperimentSchema>

// Change Log Types
export const ChangeLogEntrySchema = z.object({
  id: z.string(),
  date: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.enum(['Price Change', 'Campaign', 'Vendor Change', 'Product Launch', 'Policy Update']),
  impact: z.string(),
})

export type ChangeLogEntry = z.infer<typeof ChangeLogEntrySchema>
