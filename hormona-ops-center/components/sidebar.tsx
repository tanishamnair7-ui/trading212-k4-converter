'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  DollarSign,
  TrendingUp,
  Handshake,
  Settings,
  Package,
  AlertTriangle,
  FileText,
} from 'lucide-react'

const navigation = [
  { name: 'Overview', href: '/overview', icon: LayoutDashboard },
  { name: 'Finance', href: '/finance', icon: DollarSign },
  { name: 'Revenue', href: '/revenue', icon: TrendingUp },
  { name: 'Partnerships', href: '/partnerships', icon: Handshake },
  { name: 'Operations', href: '/operations', icon: Settings },
  { name: 'Vendors', href: '/vendors', icon: Package },
  { name: 'Risk', href: '/risk', icon: AlertTriangle },
  { name: 'Board Pack', href: '/board-pack', icon: FileText },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/overview" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">H</span>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none">Hormona</h1>
            <p className="text-xs text-muted-foreground">Ops Center</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-4">
        <div className="text-xs text-muted-foreground">
          <p>Last sync: Just now</p>
          <p className="mt-1">© 2026 Hormona</p>
        </div>
      </div>
    </div>
  )
}
