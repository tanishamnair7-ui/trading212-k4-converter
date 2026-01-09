'use client'

import { KpiCard } from '@/components/kpi-card'
import { TrendChart } from '@/components/trend-chart'
import { ScenarioPlanner } from '@/components/scenario-planner'
import { InsightsPanel } from '@/components/insights-panel'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { mockKPIs, mockCashBalanceData, mockForecastScenarios } from '@/data/mock-data'
import { formatCurrency } from '@/lib/utils'
import { CheckCircle2, Circle } from 'lucide-react'

export default function FinancePage() {
  const financeKPIs = mockKPIs.filter(kpi =>
    ['cash', 'runway', 'burn'].includes(kpi.id)
  )

  // Mock budget vs actuals data
  const budgetData = [
    { month: 'Jan 2026', budget: 280000, actual: 275000, variance: -5000, status: 'green' },
    { month: 'Dec 2025', budget: 270000, actual: 280000, variance: 10000, status: 'yellow' },
    { month: 'Nov 2025', budget: 265000, actual: 268000, variance: 3000, status: 'green' },
    { month: 'Oct 2025', budget: 260000, actual: 252000, variance: -8000, status: 'green' },
  ]

  // Mock month-end checklist
  const monthEndTasks = [
    { id: 1, task: 'Close all transactions', owner: 'Finance Team', status: 'completed' },
    { id: 2, task: 'Reconcile bank accounts', owner: 'CFO', status: 'completed' },
    { id: 3, task: 'Review AR/AP aging', owner: 'Finance Team', status: 'completed' },
    { id: 4, task: 'Generate financial statements', owner: 'CFO', status: 'in-progress' },
    { id: 5, task: 'Board reporting package', owner: 'CFO', status: 'pending' },
    { id: 6, task: 'Investor update email', owner: 'CEO', status: 'pending' },
  ]

  const insights = [
    'Burn rate increased 15.2% due to holiday marketing campaign and annual bonuses',
    'Cash runway at 8.5 months - recommend initiating fundraising process immediately',
    'Q4 actuals came in 3.2% under budget, primarily from delayed hiring',
    'Base case scenario projects 9.2 months runway with 3 new hires in Q1',
    'Bear case extends runway to 11.4 months by reducing marketing spend to $30K/month',
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Finance Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Cash, runway, burn, and scenario planning
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {financeKPIs.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </div>

      {/* Charts and Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Cash Trend */}
          <TrendChart
            title="Cash Balance - 12 Month Trend"
            description="Historical cash position"
            data={mockCashBalanceData}
            prefix="$"
            color="#E56B4E"
          />

          {/* Budget vs Actuals */}
          <Card>
            <CardHeader>
              <CardTitle>Budget vs Actuals - Monthly</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead className="text-right">Budget</TableHead>
                    <TableHead className="text-right">Actual</TableHead>
                    <TableHead className="text-right">Variance</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {budgetData.map((row) => (
                    <TableRow key={row.month}>
                      <TableCell className="font-medium">{row.month}</TableCell>
                      <TableCell className="text-right">{formatCurrency(row.budget)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(row.actual)}</TableCell>
                      <TableCell className="text-right">
                        <span className={row.variance < 0 ? 'text-green-600' : 'text-red-600'}>
                          {formatCurrency(Math.abs(row.variance))}
                          {row.variance < 0 ? ' under' : ' over'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={row.status === 'green' ? 'success' : 'warning'}
                        >
                          {row.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Scenario Planner */}
          <ScenarioPlanner scenarios={mockForecastScenarios} />

          {/* Month-End Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>Month-End Close Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {monthEndTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-lg border"
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{task.task}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Owner: {task.owner}
                      </p>
                    </div>
                    <Badge
                      variant={
                        task.status === 'completed'
                          ? 'success'
                          : task.status === 'in-progress'
                          ? 'warning'
                          : 'outline'
                      }
                    >
                      {task.status}
                    </Badge>
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
