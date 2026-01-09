'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { mockKPIs, mockDeals, mockRisks, mockForecastScenarios } from '@/data/mock-data'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { FileDown, Printer } from 'lucide-react'

export default function BoardPackPage() {
  const handlePrint = () => {
    window.print()
  }

  const handleExport = () => {
    // Simple export stub - in production this would generate a PDF
    alert('Board Pack export functionality would generate a PDF here. In this MVP, use Print (Ctrl+P) to save as PDF.')
  }

  // Key KPIs for board pack
  const keyKPIs = mockKPIs.filter(kpi =>
    ['cash', 'runway', 'burn', 'mrr', 'arr', 'churn'].includes(kpi.id)
  )

  // Top deals
  const topDeals = mockDeals
    .filter(d => d.stage !== 'Closed Lost')
    .sort((a, b) => b.value * b.probability - a.value * a.probability)
    .slice(0, 3)

  // Top risks
  const topRisks = mockRisks
    .filter(r => r.status !== 'Mitigated')
    .filter(r => r.likelihood === 'High' || r.impact === 'High')
    .slice(0, 3)

  // Scenario summary
  const baseScenario = mockForecastScenarios.find(s => s.name === 'Base')

  return (
    <div className="p-6 space-y-6">
      {/* Header - Print/Export Actions */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-3xl font-bold">Board Pack Builder</h1>
          <p className="text-muted-foreground mt-1">
            January 2026 Board Package
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handlePrint} variant="outline" className="gap-2">
            <Printer className="h-4 w-4" />
            Print / Save as PDF
          </Button>
          <Button onClick={handleExport} className="gap-2">
            <FileDown className="h-4 w-4" />
            Export Board Pack
          </Button>
        </div>
      </div>

      {/* Board Pack Content */}
      <div className="max-w-5xl mx-auto space-y-8 print:space-y-6">
        {/* Cover Section */}
        <Card className="border-2">
          <CardContent className="p-8 text-center">
            <div className="h-12 w-12 mx-auto rounded-lg bg-primary flex items-center justify-center mb-4">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">Hormona</h1>
            <h2 className="text-2xl font-semibold text-muted-foreground mb-4">
              Board Package
            </h2>
            <p className="text-lg text-muted-foreground">
              January 2026
            </p>
            <Separator className="my-6" />
            <p className="text-sm text-muted-foreground">
              Prepared by: Head of Operations
            </p>
          </CardContent>
        </Card>

        {/* Executive Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Executive Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">Key Highlights</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>MRR grew 4.2% to $145K, driven by strong December signups and annual plan adoption</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Q4 expenses came in 3.2% under budget due to delayed hiring</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Partnership pipeline at $630K total value with WellnessHub deal nearing close</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2 text-destructive">Key Concerns</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-1">⚠</span>
                  <span>Runway decreased to 8.5 months (target: 12 months) - fundraising recommended</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-1">⚠</span>
                  <span>Churn spiked 22.5% to 6.8% - retention campaign approved and launching</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-1">⚠</span>
                  <span>CAC increased 8.7% to $125 (target: $100) - monitoring Q1 performance</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* KPI Dashboard */}
        <Card>
          <CardHeader>
            <CardTitle>Key Performance Indicators</CardTitle>
            <CardDescription>Current month snapshot with trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {keyKPIs.map((kpi) => (
                <div key={kpi.id} className="p-4 rounded-lg border bg-card">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium text-muted-foreground">{kpi.name}</h4>
                    <Badge
                      variant={
                        kpi.status === 'green'
                          ? 'success'
                          : kpi.status === 'yellow'
                          ? 'warning'
                          : 'danger'
                      }
                    >
                      {kpi.status}
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold">
                    {typeof kpi.value === 'number' && kpi.unit === 'USD'
                      ? formatCurrency(kpi.value)
                      : typeof kpi.value === 'number'
                      ? formatNumber(kpi.value)
                      : kpi.value}
                    {kpi.unit !== 'USD' && ` ${kpi.unit}`}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Trend: {kpi.trendPct >= 0 ? '+' : ''}{kpi.trendPct.toFixed(1)}%
                    {kpi.target && ` • Target: ${typeof kpi.target === 'number' && kpi.unit === 'USD' ? formatCurrency(kpi.target) : kpi.target}`}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Financial Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Overview & Runway</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground mb-1">Cash Balance</p>
                <p className="text-2xl font-bold">{formatCurrency(2400000)}</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground mb-1">Monthly Burn</p>
                <p className="text-2xl font-bold">{formatCurrency(280000)}</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-destructive/10">
                <p className="text-sm text-muted-foreground mb-1">Runway</p>
                <p className="text-2xl font-bold text-destructive">8.5 months</p>
              </div>
            </div>
            {baseScenario && (
              <div className="pt-4 border-t">
                <h4 className="font-semibold text-sm mb-3">Base Case Scenario (Q1 2026)</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Hiring Plan</p>
                    <p className="font-semibold">{baseScenario.assumptions.hiring} people</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Marketing Spend</p>
                    <p className="font-semibold">{formatCurrency(baseScenario.assumptions.marketingSpend)}/mo</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Projected Runway</p>
                    <p className="font-semibold">{baseScenario.outputs.runwayMonths} months</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pipeline Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Partnership Pipeline - Top 3 Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topDeals.map((deal) => (
                <div key={deal.id} className="p-3 rounded-lg border">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-sm">{deal.partnerName}</h4>
                      <p className="text-xs text-muted-foreground">{deal.type}</p>
                    </div>
                    <Badge variant="outline">{deal.stage}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">{formatCurrency(deal.value)}</span>
                    <span className="text-muted-foreground">{deal.probability}% probability</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Next: {deal.nextStep} • Close: {deal.closeDate}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Pipeline Value:</span>
                <span className="font-semibold">{formatCurrency(mockDeals.reduce((sum, d) => sum + d.value, 0))}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Risks & Mitigations */}
        <Card>
          <CardHeader>
            <CardTitle>Top Risks & Mitigation Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topRisks.map((risk) => (
                <div key={risk.id} className="p-4 rounded-lg border-2 border-destructive/20">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-sm">{risk.title}</h4>
                    <div className="flex gap-1">
                      <Badge variant="danger" className="text-xs">{risk.likelihood}</Badge>
                      <Badge variant="danger" className="text-xs">{risk.impact}</Badge>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Mitigation:</span> {risk.mitigation}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium">Owner:</span> {risk.owner} •
                      <span className="font-medium"> Review:</span> {risk.nextReviewDate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Asks & Decisions Needed */}
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle>Asks & Decisions Needed from Board</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 list-decimal list-inside">
              <li className="text-sm">
                <span className="font-semibold">Fundraising Timeline:</span> Approve initiation of Series A fundraising process given 8.5 month runway
              </li>
              <li className="text-sm">
                <span className="font-semibold">Retention Budget:</span> Approve $50K additional spend for Q1 retention campaign to address churn spike
              </li>
              <li className="text-sm">
                <span className="font-semibold">Partnership Strategy:</span> Feedback on HealthInsure Co partnership opportunity ($250K potential value)
              </li>
              <li className="text-sm">
                <span className="font-semibold">Hiring Plan:</span> Confirm Q1 hiring plan (3 roles: Support Specialist, Product Designer, Backend Engineer)
              </li>
              <li className="text-sm">
                <span className="font-semibold">International Expansion:</span> Discussion on UK market entry timing (deferred from last meeting)
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Appendix */}
        <Card>
          <CardHeader>
            <CardTitle>Appendix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold">Prepared by:</span> Head of Operations</p>
              <p><span className="font-semibold">Date:</span> January 9, 2026</p>
              <p><span className="font-semibold">Data Sources:</span> Financial system, subscription platform, CRM, analytics</p>
              <p><span className="font-semibold">Next Board Meeting:</span> February 15, 2026</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
