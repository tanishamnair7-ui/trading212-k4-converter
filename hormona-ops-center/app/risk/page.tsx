'use client'

import { InsightsPanel } from '@/components/insights-panel'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { mockRisks } from '@/data/mock-data'
import { AlertTriangle, Shield, CheckCircle2, Circle } from 'lucide-react'
import type { Risk } from '@/data/types'

export default function RiskPage() {
  // Calculate risk matrix
  const riskMatrix: Record<string, Risk[]> = {
    'High/High': [],
    'High/Medium': [],
    'High/Low': [],
    'Medium/High': [],
    'Medium/Medium': [],
    'Medium/Low': [],
    'Low/High': [],
    'Low/Medium': [],
    'Low/Low': [],
  }

  mockRisks.forEach(risk => {
    const key = `${risk.likelihood}/${risk.impact}`
    if (riskMatrix[key]) {
      riskMatrix[key].push(risk)
    }
  })

  // Compliance checklist
  const complianceItems = [
    { id: 1, item: 'GDPR compliance audit', status: 'in-progress', owner: 'Legal', dueDate: '2026-02-15' },
    { id: 2, item: 'Privacy policy update', status: 'completed', owner: 'Legal', dueDate: '2025-12-31' },
    { id: 3, item: 'Marketing claims review', status: 'completed', owner: 'Compliance', dueDate: '2026-01-05' },
    { id: 4, item: 'Data retention policy review', status: 'pending', owner: 'Legal', dueDate: '2026-03-01' },
    { id: 5, item: 'Third-party vendor audit', status: 'pending', owner: 'Compliance', dueDate: '2026-02-28' },
    { id: 6, item: 'Security penetration test', status: 'in-progress', owner: 'CTO', dueDate: '2026-01-31' },
  ]

  // Incident log
  const incidentLog = [
    {
      id: 1,
      date: '2025-12-18',
      severity: 'Medium',
      title: 'API rate limit exceeded',
      description: 'Stripe API rate limit hit during high-traffic period',
      resolution: 'Implemented exponential backoff, added monitoring',
      status: 'Resolved',
    },
    {
      id: 2,
      date: '2025-11-22',
      severity: 'Low',
      title: 'Email delivery delay',
      description: 'SendGrid deliverability issue affected 50 users',
      resolution: 'Worked with SendGrid support, issue resolved within 4h',
      status: 'Resolved',
    },
    {
      id: 3,
      date: '2025-10-30',
      severity: 'High',
      title: 'Payment processing outage',
      description: 'Stripe webhook failures caused payment tracking issues',
      resolution: 'Manual reconciliation completed, webhook retry logic added',
      status: 'Resolved',
    },
  ]

  const insights = [
    '2 critical risks (High likelihood + High impact): Runway and Churn spike',
    'GDPR audit in progress - external auditor engaged, completion target Feb 15',
    'No major incidents in last 30 days - incident response procedures working well',
    'Vendor dependency risk: Single cloud provider (AWS) - multi-cloud strategy under evaluation',
    'Compliance posture: 4/6 checklist items completed or in progress',
  ]

  const getRiskColor = (likelihood: string, impact: string) => {
    if (likelihood === 'High' && impact === 'High') return 'bg-red-500'
    if ((likelihood === 'High' && impact === 'Medium') || (likelihood === 'Medium' && impact === 'High')) return 'bg-orange-500'
    if (likelihood === 'High' || impact === 'High') return 'bg-yellow-500'
    if (likelihood === 'Medium' && impact === 'Medium') return 'bg-yellow-400'
    return 'bg-green-500'
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Risk & Compliance Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Risk register, compliance tracking, and incident management
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <p className="text-sm text-muted-foreground">Open Risks</p>
            </div>
            <p className="text-2xl font-bold">{mockRisks.filter(r => r.status !== 'Mitigated').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-green-600" />
              <p className="text-sm text-muted-foreground">Mitigated</p>
            </div>
            <p className="text-2xl font-bold">{mockRisks.filter(r => r.status === 'Mitigated').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Critical Risks</p>
            <p className="text-2xl font-bold">
              {mockRisks.filter(r => r.likelihood === 'High' && r.impact === 'High').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Incidents (YTD)</p>
            <p className="text-2xl font-bold">{incidentLog.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Risk Register */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Register</CardTitle>
              <CardDescription>
                All identified risks with mitigation plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Risk</TableHead>
                    <TableHead>Likelihood</TableHead>
                    <TableHead>Impact</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Review Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRisks.map((risk) => (
                    <TableRow key={risk.id}>
                      <TableCell className="font-medium max-w-[200px]">
                        <div>
                          <p className="text-sm">{risk.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {risk.mitigation}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={risk.likelihood === 'High' ? 'danger' : risk.likelihood === 'Medium' ? 'warning' : 'success'}
                        >
                          {risk.likelihood}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={risk.impact === 'High' ? 'danger' : risk.impact === 'Medium' ? 'warning' : 'success'}
                        >
                          {risk.impact}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{risk.owner}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            risk.status === 'Mitigated'
                              ? 'success'
                              : risk.status === 'In Progress'
                              ? 'warning'
                              : 'outline'
                          }
                        >
                          {risk.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{risk.nextReviewDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Risk Matrix Visualization */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Matrix</CardTitle>
              <CardDescription>
                Likelihood vs Impact heat map
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {['High', 'Medium', 'Low'].map((likelihood) => (
                  ['High', 'Medium', 'Low'].map((impact) => {
                    const key = `${likelihood}/${impact}`
                    const risks = riskMatrix[key] || []
                    const color = getRiskColor(likelihood, impact)
                    return (
                      <div
                        key={key}
                        className={`p-4 rounded-lg border-2 ${color} bg-opacity-20 min-h-[100px]`}
                      >
                        <p className="text-xs font-semibold mb-2">
                          {likelihood} / {impact}
                        </p>
                        <p className="text-lg font-bold">{risks.length}</p>
                        {risks.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {risks.slice(0, 2).map(r => (
                              <p key={r.id} className="text-xs truncate">
                                • {r.title}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Compliance Checklist */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <CardTitle>Compliance Checklist</CardTitle>
              </div>
              <CardDescription>
                Regulatory and compliance requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {complianceItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-lg border"
                  >
                    {item.status === 'completed' ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.item}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Owner: {item.owner} • Due: {item.dueDate}
                      </p>
                    </div>
                    <Badge
                      variant={
                        item.status === 'completed'
                          ? 'success'
                          : item.status === 'in-progress'
                          ? 'warning'
                          : 'outline'
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Incident Log */}
          <Card>
            <CardHeader>
              <CardTitle>Incident Log</CardTitle>
              <CardDescription>
                Historical incidents and resolutions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {incidentLog.map((incident) => (
                  <div
                    key={incident.id}
                    className="p-4 rounded-lg border space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-sm">{incident.title}</h4>
                        <p className="text-xs text-muted-foreground">{incident.date}</p>
                      </div>
                      <Badge
                        variant={
                          incident.severity === 'High'
                            ? 'danger'
                            : incident.severity === 'Medium'
                            ? 'warning'
                            : 'outline'
                        }
                      >
                        {incident.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{incident.description}</p>
                    <div className="pt-2 border-t">
                      <p className="text-xs">
                        <span className="font-medium">Resolution:</span> {incident.resolution}
                      </p>
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

          {/* Risk Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Risk Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Open Risks</span>
                    <span className="font-semibold">{mockRisks.filter(r => r.status === 'Open').length}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-red-500" style={{ width: `${(mockRisks.filter(r => r.status === 'Open').length / mockRisks.length) * 100}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>In Progress</span>
                    <span className="font-semibold">{mockRisks.filter(r => r.status === 'In Progress').length}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500" style={{ width: `${(mockRisks.filter(r => r.status === 'In Progress').length / mockRisks.length) * 100}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Mitigated</span>
                    <span className="font-semibold">{mockRisks.filter(r => r.status === 'Mitigated').length}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: `${(mockRisks.filter(r => r.status === 'Mitigated').length / mockRisks.length) * 100}%` }} />
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
