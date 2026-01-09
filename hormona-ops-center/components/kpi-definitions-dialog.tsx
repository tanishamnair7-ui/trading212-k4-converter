'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { KPI } from '@/data/types'
import { formatDate } from '@/lib/utils'

interface KPIDefinitionsDialogProps {
  kpi: KPI | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function KPIDefinitionsDialog({ kpi, open, onOpenChange }: KPIDefinitionsDialogProps) {
  if (!kpi) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{kpi.name}</DialogTitle>
          <DialogDescription>
            Detailed definition and calculation methodology
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <h4 className="font-semibold text-sm mb-2">Definition</h4>
            <p className="text-sm text-muted-foreground">{kpi.definition}</p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-2">Formula</h4>
            <code className="text-sm bg-muted px-3 py-2 rounded-md block">
              {kpi.formula}
            </code>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">Owner</h4>
              <p className="text-sm text-muted-foreground">{kpi.owner}</p>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-2">Data Source</h4>
              <p className="text-sm text-muted-foreground">{kpi.source}</p>
            </div>
          </div>

          {kpi.target && (
            <div>
              <h4 className="font-semibold text-sm mb-2">Target</h4>
              <p className="text-sm text-muted-foreground">
                {kpi.target} {kpi.unit}
              </p>
            </div>
          )}

          <div>
            <h4 className="font-semibold text-sm mb-2">Last Updated</h4>
            <p className="text-sm text-muted-foreground">
              {formatDate(kpi.updatedAt)}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
