'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatNumber, formatPercent, cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Info } from 'lucide-react'
import type { KPI } from '@/data/types'

interface KpiCardProps {
  kpi: KPI
  onClick?: () => void
}

export function KpiCard({ kpi, onClick }: KpiCardProps) {
  const isPositiveTrend = kpi.trendPct > 0
  const statusColor = {
    green: 'bg-green-100 text-green-800 border-green-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    red: 'bg-red-100 text-red-800 border-red-200',
  }[kpi.status]

  const formattedValue = typeof kpi.value === 'number' && kpi.unit === 'USD'
    ? formatCurrency(kpi.value)
    : typeof kpi.value === 'number'
    ? formatNumber(kpi.value)
    : kpi.value

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all hover:shadow-md",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-muted-foreground">{kpi.name}</h3>
            {onClick && <Info className="h-4 w-4 text-muted-foreground" />}
          </div>
          <Badge variant="outline" className={cn("font-normal", statusColor)}>
            {kpi.status}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{formattedValue}</span>
            {kpi.unit !== 'USD' && (
              <span className="text-lg text-muted-foreground">{kpi.unit}</span>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              {isPositiveTrend ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span className={isPositiveTrend ? 'text-green-600' : 'text-red-600'}>
                {formatPercent(kpi.trendPct)}
              </span>
            </div>
            {kpi.target && (
              <span className="text-muted-foreground">
                Target: {typeof kpi.target === 'number' && kpi.unit === 'USD'
                  ? formatCurrency(kpi.target)
                  : kpi.target}
              </span>
            )}
          </div>

          <div className="pt-2 border-t text-xs text-muted-foreground">
            Owner: {kpi.owner}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
