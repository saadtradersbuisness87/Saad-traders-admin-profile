import Link from 'next/link'
import {
  LayoutDashboard, BookOpen, ShoppingCart, Truck, Boxes,
  Users, Building2, FileBarChart, Settings,
} from 'lucide-react'
import { createClient } from '@/lib/supabase-server'

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/accounts', label: 'Accounting', icon: BookOpen },
  { href: '/sales', label: 'Sales', icon: ShoppingCart },
  { href: '/purchases', label: 'Purchases', icon: Truck },
  { href: '/inventory', label: 'Inventory', icon: Boxes },
  { href: '/customers', label: 'Customers', icon: Users },
  { href: '/suppliers', label: 'Suppliers', icon: Building2 },
  { href: '/reports', label: 'Reports', icon: FileBarChart },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user
    ? await supabase.from('profiles').select('full_name, role').eq('id', user.id).single()
    : { data: null }

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 bg-brand-dark text-white flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-white/10">
          <p className="font-semibold">Business OS</p>
          <p className="text-xs text-white/60">{profile?.full_name ?? '—'} · {profile?.role ?? ''}</p>
        </div>
        <nav className="flex-1 py-3">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-5 py-2.5 text-sm text-white/80 hover:bg-white/10 hover:text-white transition"
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 bg-gray-50 p-6">{children}</main>
    </div>
  )
}
