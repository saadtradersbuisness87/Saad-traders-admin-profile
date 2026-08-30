import { createClient } from '@/lib/supabase-server'
import { ModuleToggle } from '@/components/ModuleToggle'

const LABELS: Record<string, string> = {
  tax_gst: 'Tax / GST compliance',
  payroll: 'Payroll',
  cost_centres: 'Cost Centres',
  budgets: 'Budgets',
  bank_reconciliation: 'Bank Reconciliation',
  cheque_management: 'Cheque Management',
  multi_currency: 'Multi-Currency',
  pos_mode: 'POS Mode',
  batch_expiry_tracking: 'Batch & Expiry Tracking',
  godowns: 'Multiple Godowns / Warehouses',
  reorder_automation: 'Auto Reorder Suggestions',
  ratio_analysis: 'Ratio Analysis Reports',
  credit_control: 'Customer Credit Limit Control',
}

export default async function SettingsPage() {
  const supabase = createClient()
  const { data: modules } = await supabase
    .from('module_settings')
    .select('key, enabled')
    .order('key')

  return (
    <div>
      <h1 className="text-lg font-semibold mb-1">Settings</h1>
      <p className="text-sm text-gray-500 mb-6">
        Turn optional modules on or off. Everything stays hidden until you enable it.
      </p>

      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
        {(modules ?? []).map((m) => (
          <ModuleToggle key={m.key} moduleKey={m.key} label={LABELS[m.key] ?? m.key} initialEnabled={m.enabled} />
        ))}
      </div>
    </div>
  )
}
