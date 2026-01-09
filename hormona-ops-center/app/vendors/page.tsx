'use client'

import { InsightsPanel } from '@/components/insights-panel'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { mockVendors } from '@/data/mock-data'
import { formatCurrency } from '@/lib/utils'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { AlertCircle, Calendar } from 'lucide-react'

export default function VendorsPage() {
  // Calculate totals
  const totalMonthlySpend = mockVendors.reduce((sum, v) => sum + v.spendMonthly, 0)
  const totalAnnualSpend = totalMonthlySpend * 12

  // Spend by category
  const spendByCategory = mockVendors.reduce((acc, vendor) => {
    acc[vendor.category] = (acc[vendor.category] || 0) + vendor.spendMonthly
    return acc
  }, {} as Record<string, number>)

  const chartData = Object.entries(spendByCategory).map(([name, value]) => ({
    name,
    value,
  }))

  const COLORS = ['#E56B4E', '#F4C7B8', '#D45A3E', '#E7DED7', '#1F2328', '#6B7280']

  // Upcoming renewals (within 90 days)
  const today = new Date()
  const ninetyDaysFromNow = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000)

  const upcomingRenewals = mockVendors
    .filter(v => {
      const renewalDate = new Date(v.renewalDate)
      return renewalDate <= ninetyDaysFromNow && renewalDate >= today
    })
    .sort((a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime())

  // High-risk vendors
  const highRiskVendors = mockVendors.filter(v => v.riskRating === 'High' || v.issues)

  const insights = [
    `Total vendor spend: ${formatCurrency(totalMonthlySpend)}/month (${formatCurrency(totalAnnualSpend)}/year)`,
    'Infrastructure (AWS) is largest category at 47% of total spend',
    '3 vendors up for renewal in next 90 days - Notion renewal most critical (22 days)',
    'Intercom price increase announced - evaluating alternatives could save $15K/year',
    'Opportunity: Consolidate analytics stack (Segment + others) for 20% cost reduction',
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Vendors Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Vendor management, spend tracking, and renewal alerts
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Monthly Spend</p>
            <p className="text-2xl font-bold">{formatCurrency(totalMonthlySpend)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Annual Spend</p>
            <p className="text-2xl font-bold">{formatCurrency(totalAnnualSpend)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Vendors</p>
            <p className="text-2xl font-bold">{mockVendors.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Renewals (90d)</p>
            <p className="text-2xl font-bold">{upcomingRenewals.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Spend Breakdown Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Spend Breakdown by Category</CardTitle>
              <CardDescription>
                Monthly vendor spend distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {chartData.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-2 text-sm">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span>{item.name}: {formatCurrency(item.value)}/mo</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Vendor Directory */}
          <Card>
            <CardHeader>
              <CardTitle>Vendor Directory</CardTitle>
              <CardDescription>
                All active vendors and contracts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Monthly Spend</TableHead>
                    <TableHead>Renewal</TableHead>
                    <TableHead>Risk</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockVendors.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell className="font-medium">{vendor.name}</TableCell>
                      <TableCell>{vendor.category}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(vendor.spendMonthly)}
                      </TableCell>
                      <TableCell>{vendor.renewalDate}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            vendor.riskRating === 'Low'
                              ? 'success'
                              : vendor.riskRating === 'Medium'
                              ? 'warning'
                              : 'danger'
                          }
                        >
                          {vendor.riskRating}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Procurement Workflow Stub */}
          <Card>
            <CardHeader>
              <CardTitle>Procurement Workflow</CardTitle>
              <CardDescription>
                Request → Approve → Purchase process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="p-3 rounded-lg border bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-sm">Zendesk Enterprise License</h4>
                      <p className="text-xs text-muted-foreground">
                        Requested by: Lisa Anderson • $3,200/month
                      </p>
                    </div>
                    <Badge variant="warning">Pending Approval</Badge>
                  </div>
                </div>
                <div className="p-3 rounded-lg border bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-sm">Notion Team Plan Upgrade</h4>
                      <p className="text-xs text-muted-foreground">
                        Requested by: Operations • $450/month
                      </p>
                    </div>
                    <Badge variant="success">Approved</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <InsightsPanel insights={insights} />

          {/* Renewal Alerts */}
          <Card className="border-yellow-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-yellow-600" />
                <CardTitle className="text-lg">Upcoming Renewals</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingRenewals.length > 0 ? (
                  upcomingRenewals.map((vendor) => (
                    <div
                      key={vendor.id}
                      className="p-3 rounded-lg border border-yellow-200 bg-yellow-50"
                    >
                      <h4 className="font-semibold text-sm">{vendor.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {vendor.renewalDate} • {formatCurrency(vendor.spendMonthly)}/mo
                      </p>
                      {vendor.issues && (
                        <p className="text-xs text-yellow-800 mt-2 font-medium">
                          ⚠️ {vendor.issues}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No renewals in next 90 days
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* High-Risk Vendors */}
          {highRiskVendors.length > 0 && (
            <Card className="border-destructive/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <CardTitle className="text-lg">High-Risk Vendors</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {highRiskVendors.map((vendor) => (
                    <div
                      key={vendor.id}
                      className="p-3 rounded-lg border border-destructive/20 bg-destructive/5"
                    >
                      <h4 className="font-semibold text-sm">{vendor.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {vendor.category}
                      </p>
                      {vendor.issues && (
                        <p className="text-xs text-destructive mt-2">
                          {vendor.issues}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
