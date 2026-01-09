'use client'

import { InsightsPanel } from '@/components/insights-panel'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { mockBottlenecks, mockInitiatives, mockKPIs } from '@/data/mock-data'
import { AlertCircle, TrendingUp } from 'lucide-react'
import { KpiCard } from '@/components/kpi-card'

export default function OperationsPage() {
  // Support/ops KPIs
  const supportMetrics = [
    { metric: 'Avg Response Time', value: '18h', target: '4h', status: 'red' as const },
    { metric: 'CSAT Score', value: '4.2/5', target: '4.5/5', status: 'yellow' as const },
    { metric: 'Refund Rate', value: '2.1%', target: '<3%', status: 'green' as const },
    { metric: 'Ticket Volume', value: '156', target: '-', status: 'green' as const },
  ]

  // Cross-functional initiatives
  const initiativesByStatus = {
    'In Progress': mockInitiatives.filter(i => i.status === 'In Progress'),
    'Blocked': mockInitiatives.filter(i => i.status === 'Blocked'),
    'Not Started': mockInitiatives.filter(i => i.status === 'Not Started'),
    'Completed': mockInitiatives.filter(i => i.status === 'Completed'),
  }

  const insights = [
    'Support response time at 18h (4.5x target) - recommend hiring 1 support specialist',
    'Onboarding bottleneck causing 40% drop-off - payment form redesign prioritized for Feb 10',
    '5 cross-functional initiatives in progress, none currently blocked',
    'Content moderation taking 15h/week - automation could save 80% of time',
    'CSAT score of 4.2/5 is solid but response time complaints increasing',
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Operations Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Bottlenecks, execution tracking, and operational metrics
        </p>
      </div>

      {/* Support Metrics */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Support & Operations KPIs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {supportMetrics.map((metric) => (
            <Card key={metric.metric}>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-1">{metric.metric}</p>
                <p className="text-2xl font-bold mb-2">{metric.value}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Target: {metric.target}
                  </span>
                  <Badge
                    variant={
                      metric.status === 'green'
                        ? 'success'
                        : metric.status === 'yellow'
                        ? 'warning'
                        : 'danger'
                    }
                  >
                    {metric.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Bottleneck Radar */}
          <Card className="border-destructive/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <CardTitle>Bottleneck Radar</CardTitle>
              </div>
              <CardDescription>
                Critical operational bottlenecks requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockBottlenecks.map((bottleneck) => (
                  <div
                    key={bottleneck.id}
                    className="p-4 rounded-lg border-2 border-destructive/20 bg-destructive/5 space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-sm">{bottleneck.area}</h4>
                        <p className="text-sm text-destructive font-medium mt-1">
                          {bottleneck.issue}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-muted-foreground">Root Cause</p>
                        <p className="font-medium">{bottleneck.rootCause}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Business Impact</p>
                        <p className="font-medium text-destructive">{bottleneck.impact}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t text-xs">
                      <span className="text-muted-foreground">
                        Owner: {bottleneck.owner}
                      </span>
                      <Badge variant="destructive">
                        Fix by: {bottleneck.fixBy}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cross-Functional Execution Board */}
          <Card>
            <CardHeader>
              <CardTitle>Cross-Functional Execution Board</CardTitle>
              <CardDescription>
                All initiatives across teams
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(initiativesByStatus).map(([status, initiatives]) => (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-sm">{status}</h3>
                      <Badge variant="secondary">{initiatives.length}</Badge>
                    </div>
                    <div className="space-y-2">
                      {initiatives.length > 0 ? (
                        initiatives.map((initiative) => (
                          <div
                            key={initiative.id}
                            className="flex items-start justify-between p-3 rounded-lg border"
                          >
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm">{initiative.title}</h4>
                              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                <span>{initiative.team}</span>
                                <span>•</span>
                                <span>{initiative.owner}</span>
                                <span>•</span>
                                <span>Due: {initiative.dueDate}</span>
                              </div>
                              {initiative.dependencies.length > 0 && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Depends on: {initiative.dependencies.join(', ')}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                Impact: {initiative.impactScore}/10
                              </Badge>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No initiatives in this status
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Process Improvements */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle>Recent Process Improvements</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 rounded-lg border">
                  <h4 className="font-semibold text-sm">Automated onboarding emails</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Reduced manual work by 8h/week, improved time-to-value by 40%
                  </p>
                  <Badge variant="success" className="mt-2">
                    Completed Dec 2025
                  </Badge>
                </div>
                <div className="p-3 rounded-lg border">
                  <h4 className="font-semibold text-sm">Self-service help center</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Deflected 25% of support tickets, improved CSAT by 0.3 points
                  </p>
                  <Badge variant="success" className="mt-2">
                    Completed Nov 2025
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <InsightsPanel insights={insights} />

          {/* Team Capacity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Team Capacity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Support Team</span>
                    <span className="font-semibold">85%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500" style={{ width: '85%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Operations</span>
                    <span className="font-semibold">70%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: '70%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Compliance</span>
                    <span className="font-semibold">60%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: '60%' }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
