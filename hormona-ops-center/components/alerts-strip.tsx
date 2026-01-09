'use client'

import { Alert } from '@/data/types'
import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface AlertsStripProps {
  alerts: Alert[]
}

export function AlertsStrip({ alerts }: AlertsStripProps) {
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([])

  const visibleAlerts = alerts.filter(a => !dismissedAlerts.includes(a.id))

  if (visibleAlerts.length === 0) return null

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return <AlertCircle className="h-5 w-5" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />
      case 'info':
        return <Info className="h-5 w-5" />
    }
  }

  const getAlertStyles = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-900'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-900'
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-900'
    }
  }

  return (
    <div className="space-y-2">
      {visibleAlerts.map((alert) => (
        <div
          key={alert.id}
          className={cn(
            'flex items-start gap-3 p-4 rounded-lg border',
            getAlertStyles(alert.type)
          )}
        >
          <div className="flex-shrink-0 mt-0.5">
            {getAlertIcon(alert.type)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm">{alert.title}</h4>
            <p className="text-sm mt-1 opacity-90">{alert.message}</p>
          </div>
          <button
            onClick={() => setDismissedAlerts([...dismissedAlerts, alert.id])}
            className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
