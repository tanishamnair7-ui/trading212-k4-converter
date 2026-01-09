'use client'

import { useState } from 'react'
import { KpiCard } from '@/components/kpi-card'
import { AlertsStrip } from '@/components/alerts-strip'
import { TrendChart } from '@/components/trend-chart'
import { InsightsPanel } from '@/components/insights-panel'
import { KPIDefinitionsDialog } from '@/components/kpi-definitions-dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { mockKPIs, mockAlerts, mockInitiatives, mockDeals, mockCashBalanceData } from '@/data/mock-data'
import type { KPI } from '@/data/types'
import { formatCurrency } from '@/lib/utils'

export default function OverviewPage() {
  const [selectedKPI, setSelectedKPI] = useState<KPI | null>(null)

  // Select key KPIs for overview
  const keyKPIs = mockKPIs.filter(kpi =>
    ['cash', 'runway', 'mrr', 'churn', 'cac', 'burn'].includes(kpi.id)
  )

  // Active initiatives
  const activeInitiatives = mockInitiatives.filter(i => i.status === 'In Progress')

  // Top deals
  const topDeals = mockDeals
    .filter(d => d.stage !== 'Closed Lost')
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  const insights = [
    'Churn spike of 22.5% in December requires immediate attention - retention campaign approved',
    'Runway decreased to 8.5 months. Recommend accelerating fundraising conversations',
    'WellnessHub partnership ($120K value) moving to contract review - high confidence close',
    'CAC increased 8.7% due to holiday campaign costs - expected to normalize in Q1',
    'MRR growth of 4.2% driven by strong December signups and annual plan adoption',
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Weekly Operating Review</h1>
        <p className="text-muted-foreground mt-1">
          Key metrics, alerts, and priorities for the week
        </p>
      </div>

      {/* Alerts */}
      <AlertsStrip alerts={mockAlerts} />

      {/* KPI Scoreboard */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Key Performance Indicators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {keyKPIs.map((kpi) => (
            <KpiCard
              key={kpi.id}
              kpi={kpi}
              onClick={() => setSelectedKPI(kpi)}
            />
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cash + Runway Snapshot */}
          <TrendChart
            title="Cash Balance Trend"
            description="Last 12 months"
            data={mockCashBalanceData}
            prefix="$"
            color="#E56B4E"
          />

          {/* This Week's Priorities */}
          <Card>
            <CardHeader>
              <CardTitle>This Week&apos;s Priorities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeInitiatives.map((initiative) => (
                  <div
                    key={initiative.id}
                    className="flex items-start justify-between p-3 rounded-lg border bg-card hover:shadow-sm transition-shadow"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{initiative.title}</h4>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>{initiative.team}</span>
                        <span>•</span>
                        <span>Owner: {initiative.owner}</span>
                        <span>•</span>
                        <span>Due: {initiative.dueDate}</span>
                      </div>
                    </div>
                    <Badge
                      variant={initiative.status === 'In Progress' ? 'default' : 'secondary'}
                    >
                      {initiative.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pipeline Snapshot */}
          <Card>
            <CardHeader>
              <CardTitle>Partnership Pipeline - Top 5 Deals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {topDeals.map((deal) => (
                  <div
                    key={deal.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{deal.partnerName}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{deal.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(deal.value)}</p>
                      <Badge variant="outline" className="mt-1">
                        {deal.stage}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Insights */}
        <div className="space-y-6">
          <InsightsPanel insights={insights} />

          {/* Risks to Watch */}
          <Card className="border-destructive/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                <CardTitle className="text-lg">Risks to Watch</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="text-sm">
                  <span className="font-semibold">Runway:</span> Below 9 months threshold
                </li>
                <li className="text-sm">
                  <span className="font-semibold">Churn:</span> 22.5% increase MoM
                </li>
                <li className="text-sm">
                  <span className="font-semibold">Vendor:</span> Notion renewal in 22 days
                </li>
                <li className="text-sm">
                  <span className="font-semibold">CAC:</span> 25% above target
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* KPI Definitions Dialog */}
      <KPIDefinitionsDialog
        kpi={selectedKPI}
        open={!!selectedKPI}
        onOpenChange={(open) => !open && setSelectedKPI(null)}
      />
    </div>
  )
}
