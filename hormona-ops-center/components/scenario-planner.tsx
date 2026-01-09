'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import type { ForecastScenario } from '@/data/types'
import { formatCurrency, formatNumber } from '@/lib/utils'

interface ScenarioPlannerProps {
  scenarios: ForecastScenario[]
}

export function ScenarioPlanner({ scenarios }: ScenarioPlannerProps) {
  const [activeScenario, setActiveScenario] = useState<ForecastScenario['name']>('Base')

  const currentScenario = scenarios.find(s => s.name === activeScenario) || scenarios[0]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scenario Planning</CardTitle>
        <CardDescription>
          Compare different forecast scenarios based on key assumptions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeScenario} onValueChange={(v) => setActiveScenario(v as ForecastScenario['name'])}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="Bear">Bear 🐻</TabsTrigger>
            <TabsTrigger value="Base">Base 📊</TabsTrigger>
            <TabsTrigger value="Bull">Bull 🚀</TabsTrigger>
          </TabsList>

          {scenarios.map(scenario => (
            <TabsContent key={scenario.id} value={scenario.name} className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Assumptions</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Hiring Plan</p>
                    <p className="text-lg font-semibold">{scenario.assumptions.hiring} people</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Marketing Spend</p>
                    <p className="text-lg font-semibold">{formatCurrency(scenario.assumptions.marketingSpend)}/mo</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">COGS %</p>
                    <p className="text-lg font-semibold">{scenario.assumptions.cogsPct}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Price Point</p>
                    <p className="text-lg font-semibold">{formatCurrency(scenario.assumptions.price)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Churn Rate</p>
                    <p className="text-lg font-semibold">{scenario.assumptions.churn}%</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-3">Projected Outcomes</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-primary/20">
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground mb-1">Monthly Burn</p>
                      <p className="text-2xl font-bold">{formatCurrency(scenario.outputs.burn)}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-primary/20">
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground mb-1">Runway</p>
                      <p className="text-2xl font-bold">{formatNumber(scenario.outputs.runwayMonths)} months</p>
                      <Badge
                        variant={scenario.outputs.runwayMonths >= 12 ? 'default' : 'destructive'}
                        className="mt-2"
                      >
                        {scenario.outputs.runwayMonths >= 12 ? 'Healthy' : 'At Risk'}
                      </Badge>
                    </CardContent>
                  </Card>
                  <Card className="border-primary/20">
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground mb-1">Projected MRR</p>
                      <p className="text-2xl font-bold">{formatCurrency(scenario.outputs.mrr)}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
