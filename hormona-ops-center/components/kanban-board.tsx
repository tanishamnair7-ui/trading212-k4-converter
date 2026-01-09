'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Deal } from '@/data/types'
import { formatCurrency } from '@/lib/utils'

interface KanbanBoardProps {
  deals: Deal[]
}

const stages: Deal['stage'][] = ['Prospecting', 'Qualified', 'Negotiation', 'Closed Won']

export function KanbanBoard({ deals }: KanbanBoardProps) {
  const dealsByStage = stages.map(stage => ({
    stage,
    deals: deals.filter(d => d.stage === stage)
  }))

  const getStageColor = (stage: Deal['stage']) => {
    switch (stage) {
      case 'Prospecting': return 'bg-gray-100 border-gray-300'
      case 'Qualified': return 'bg-blue-50 border-blue-300'
      case 'Negotiation': return 'bg-purple-50 border-purple-300'
      case 'Closed Won': return 'bg-green-50 border-green-300'
      default: return 'bg-gray-100 border-gray-300'
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {dealsByStage.map(({ stage, deals }) => (
        <div key={stage} className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">{stage}</h3>
            <Badge variant="secondary">{deals.length}</Badge>
          </div>

          <div className="space-y-2">
            {deals.map(deal => (
              <Card
                key={deal.id}
                className={`${getStageColor(stage)} cursor-pointer hover:shadow-md transition-shadow`}
              >
                <CardContent className="p-4">
                  <h4 className="font-semibold text-sm mb-2">{deal.partnerName}</h4>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>{deal.type}</p>
                    <p className="font-semibold text-foreground">
                      {formatCurrency(deal.value)}
                    </p>
                    <div className="flex items-center justify-between">
                      <span>{deal.probability}% prob.</span>
                      <span>{deal.closeDate}</span>
                    </div>
                  </div>
                  {deal.nextStep && (
                    <div className="mt-3 pt-3 border-t text-xs">
                      <span className="font-medium">Next: </span>
                      {deal.nextStep}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {deals.length === 0 && (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No deals in this stage
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
