'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { ChangeLogEntry } from '@/data/types'

interface TimelineProps {
  entries: ChangeLogEntry[]
  title?: string
}

const categoryColors: Record<ChangeLogEntry['category'], string> = {
  'Price Change': 'bg-purple-100 text-purple-800',
  'Campaign': 'bg-blue-100 text-blue-800',
  'Vendor Change': 'bg-orange-100 text-orange-800',
  'Product Launch': 'bg-green-100 text-green-800',
  'Policy Update': 'bg-gray-100 text-gray-800',
}

export function Timeline({ entries, title = 'Change Log' }: TimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4">
          <div className="absolute left-[9px] top-2 bottom-2 w-[2px] bg-border" />

          {entries.map((entry) => (
            <div key={entry.id} className="relative flex gap-4 pl-8">
              <div className="absolute left-0 top-2 h-5 w-5 rounded-full bg-primary border-4 border-background" />

              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-sm">{entry.title}</h4>
                  <Badge
                    variant="outline"
                    className={categoryColors[entry.category]}
                  >
                    {entry.category}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground">{entry.description}</p>

                <div className="flex items-center gap-4 text-xs">
                  <span className="text-muted-foreground">{entry.date}</span>
                  <span className="text-primary font-medium">{entry.impact}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
