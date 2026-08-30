import { createClient } from '@/lib/supabase-server'
import { StatCard } from '@/components/StatCard'

function money(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
}

export default async function DashboardPage() {
  const supabase = createClient()

  const today = new Date().toISOString().slice(0, 10)
  const { data: todaysSales } = await supabase
    .from('vouchers')
    .select('total_amount')
    .eq('type', 'sales')
    .eq('date', today)

  const { count: customerCount } = await supabase
    .from('customers')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  const { count: lowStockCount } = await supabase
    .from('current_stock')
    .select('*', { count: 'exact', head: true })
    .lt('quantity_on_hand', 1)

  const salesTotal = (todaysSales ?? []).reduce((sum, v) => sum + Number(v.total_amount), 0)

  return (
    <div>
      <h1 className="text-lg font-semibold mb-4">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Today's Sales" value={money(salesTotal)} />
        <StatCard label="Active Customers" value={String(customerCount ?? 0)} />
        <StatCard label="Low Stock Alerts" value={String(lowStockCount ?? 0)} />
        <StatCard label="Outstanding Invoices" value="—" hint="Wire up once bill-wise view is added" />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-sm text-gray-500">
        No recent transactions yet. Create your first sale, purchase, or customer to see activity here.
      </div>
    </div>
  )
}
