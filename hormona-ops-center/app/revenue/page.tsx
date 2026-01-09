'use client'

import { KpiCard } from '@/components/kpi-card'
import { TrendChart } from '@/components/trend-chart'
import { InsightsPanel } from '@/components/insights-panel'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { mockKPIs, mockMRRData, mockChurnData, mockPricingExperiments } from '@/data/mock-data'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function RevenuePage() {
  const revenueKPIs = mockKPIs.filter(kpi =>
    ['mrr', 'arr', 'churn', 'arpu', 'cac', 'ltv'].includes(kpi.id)
  )

  // Mock cohort retention data
  const cohortData = [
    { cohort: 'Dec 2025', month0: 100, month1: 93, month2: 88, month3: 85 },
    { cohort: 'Nov 2025', month0: 100, month1: 95, month2: 90, month3: 87 },
    { cohort: 'Oct 2025', month0: 100, month1: 94, month2: 89, month3: 86 },
    { cohort: 'Sep 2025', month0: 100, month1: 96, month2: 91, month3: 88 },
  ]

  // Unit economics
  const unitEconomics = [
    { metric: 'CAC', value: 125, unit: 'USD', definition: 'Customer Acquisition Cost' },
    { metric: 'LTV', value: 850, unit: 'USD', definition: 'Customer Lifetime Value' },
    { metric: 'LTV:CAC Ratio', value: 6.8, unit: ':1', definition: 'Ratio of LTV to CAC' },
    { metric: 'Payback Period', value: 3.0, unit: 'months', definition: 'Time to recover CAC' },
    { metric: 'Gross Margin', value: 75, unit: '%', definition: 'Revenue minus COGS' },
  ]

  const insights = [
    'MRR grew 4.2% to $145K driven by strong December signups (38% increase YoY)',
    'Churn spiked to 6.8% in December - correlation with onboarding friction identified',
    'Annual plan experiment exceeded expectations: 28% conversion vs 15% baseline',
    'LTV:CAC ratio of 6.8:1 is healthy (target >3:1), but CAC trending up',
    'Premium tier ($59/mo) pilot showing early promise with 12% uptake among trialists',
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Revenue Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          MRR, ARR, churn, retention, and unit economics
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {revenueKPIs.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* MRR Trend */}
          <TrendChart
            title="MRR Growth - 12 Month Trend"
            description="Monthly Recurring Revenue"
            data={mockMRRData}
            prefix="$"
            color="#E56B4E"
          />

          {/* Churn Trend */}
          <TrendChart
            title="Monthly Churn Rate"
            description="Percentage of customers churning each month"
            data={mockChurnData}
            suffix="%"
            color="#D45A3E"
            chartType="line"
          />

          {/* Unit Economics Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Unit Economics</CardTitle>
              <CardDescription>
                Key metrics for customer profitability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {unitEconomics.map((item) => (
                  <div
                    key={item.metric}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div>
                      <p className="font-semibold text-sm">{item.metric}</p>
                      <p className="text-xs text-muted-foreground">{item.definition}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">
                        {item.unit === 'USD' ? formatCurrency(item.value) : formatNumber(item.value)}
                        {item.unit !== 'USD' && ` ${item.unit}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cohort Retention */}
          <Card>
            <CardHeader>
              <CardTitle>Cohort Retention Analysis</CardTitle>
              <CardDescription>
                Retention rates by signup cohort (%)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cohort</TableHead>
                    <TableHead className="text-right">Month 0</TableHead>
                    <TableHead className="text-right">Month 1</TableHead>
                    <TableHead className="text-right">Month 2</TableHead>
                    <TableHead className="text-right">Month 3</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cohortData.map((row) => (
                    <TableRow key={row.cohort}>
                      <TableCell className="font-medium">{row.cohort}</TableCell>
                      <TableCell className="text-right">{row.month0}%</TableCell>
                      <TableCell className="text-right">{row.month1}%</TableCell>
                      <TableCell className="text-right">{row.month2}%</TableCell>
                      <TableCell className="text-right">{row.month3}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pricing Experiments */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Packaging Experiments</CardTitle>
              <CardDescription>
                Test results and impact on revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockPricingExperiments.map((experiment) => (
                  <div
                    key={experiment.id}
                    className="p-4 rounded-lg border space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold text-sm">{experiment.name}</h4>
                      <Badge
                        variant={
                          experiment.status === 'Completed'
                            ? 'success'
                            : experiment.status === 'Running'
                            ? 'warning'
                            : 'outline'
                        }
                      >
                        {experiment.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Hypothesis:</span> {experiment.hypothesis}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Result:</span> {experiment.result}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {experiment.startDate} → {experiment.endDate}
                      </span>
                      <span className="font-semibold text-primary">
                        {experiment.impact}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <InsightsPanel insights={insights} />
        </div>
      </div>
    </div>
  )
}
