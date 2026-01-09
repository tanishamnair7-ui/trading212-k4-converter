'use client'

import { useState } from 'react'
import { KanbanBoard } from '@/components/kanban-board'
import { InsightsPanel } from '@/components/insights-panel'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { mockDeals } from '@/data/mock-data'
import { formatCurrency } from '@/lib/utils'
import { Calculator } from 'lucide-react'

export default function PartnershipsPage() {
  const [dealValue, setDealValue] = useState(100000)
  const [probability, setProbability] = useState(50)

  // Calculate pipeline metrics
  const totalPipelineValue = mockDeals.reduce((sum, deal) => sum + deal.value, 0)
  const weightedPipeline = mockDeals.reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0)
  const avgDealSize = totalPipelineValue / mockDeals.length
  const activeDeals = mockDeals.filter(d => !['Closed Won', 'Closed Lost'].includes(d.stage))

  // Contract tracker - upcoming renewals/obligations
  const contractTracker = [
    { partner: 'WellnessHub', type: 'Distribution', renewalDate: '2026-02-15', value: 120000, status: 'Active' },
    { partner: 'GymnasticsChain', type: 'Referral', renewalDate: '2027-01-05', value: 45000, status: 'Active' },
    { partner: 'FitTech Labs', type: 'Integration', renewalDate: '2026-04-20', value: 80000, status: 'Pending' },
  ]

  const insights = [
    'Total pipeline value: $630K across 5 deals with 56% weighted probability',
    'WellnessHub deal ($120K) in contract review - expect close mid-February',
    'HealthInsure Co partnership could be transformational ($250K) but needs pilot proposal',
    'Q1 partnership revenue target: $200K (66% of target secured or in negotiation)',
    'Average deal cycle: 90 days from prospecting to closed won',
  ]

  const expectedValue = (dealValue * probability / 100).toFixed(0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Partnerships Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Pipeline, deal tracking, and partnership management
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Pipeline</p>
            <p className="text-2xl font-bold">{formatCurrency(totalPipelineValue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Weighted Pipeline</p>
            <p className="text-2xl font-bold">{formatCurrency(weightedPipeline)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Active Deals</p>
            <p className="text-2xl font-bold">{activeDeals.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Avg Deal Size</p>
            <p className="text-2xl font-bold">{formatCurrency(avgDealSize)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Kanban Board */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Partnership Pipeline</h2>
            <KanbanBoard deals={mockDeals} />
          </div>

          {/* Contract Tracker */}
          <Card>
            <CardHeader>
              <CardTitle>Contract Tracker</CardTitle>
              <CardDescription>
                Active partnerships and upcoming renewals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Partner</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Renewal Date</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contractTracker.map((contract) => (
                    <TableRow key={contract.partner}>
                      <TableCell className="font-medium">{contract.partner}</TableCell>
                      <TableCell>{contract.type}</TableCell>
                      <TableCell>{contract.renewalDate}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(contract.value)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={contract.status === 'Active' ? 'success' : 'warning'}
                        >
                          {contract.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Deal Model Calculator */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                <CardTitle>Deal Model Calculator</CardTitle>
              </div>
              <CardDescription>
                Calculate expected value for partnership deals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Deal Value ($)
                  </label>
                  <input
                    type="number"
                    value={dealValue}
                    onChange={(e) => setDealValue(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Probability of Close (%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={probability}
                    onChange={(e) => setProbability(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>0%</span>
                    <span className="font-semibold text-foreground">{probability}%</span>
                    <span>100%</span>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-1">Expected Value</p>
                  <p className="text-3xl font-bold text-primary">
                    {formatCurrency(Number(expectedValue))}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Formula: Deal Value × Probability = {formatCurrency(dealValue)} × {probability}% = {formatCurrency(Number(expectedValue))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <InsightsPanel insights={insights} />

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">
                Add New Deal
              </Button>
              <Button className="w-full" variant="outline">
                Schedule Check-in
              </Button>
              <Button className="w-full" variant="outline">
                Generate Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
