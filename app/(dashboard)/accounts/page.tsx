import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'

export default async function AccountsPage() {
  const supabase = createClient()
  const { data: accounts } = await supabase
    .from('chart_of_accounts')
    .select('id, code, name, type, opening_balance, is_group, is_active')
    .order('code')

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Chart of Accounts</h1>
        <Link href="/accounts/new" className="bg-brand text-white text-sm px-4 py-2 rounded-md hover:bg-brand-dark">
          + New Account
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {!accounts || accounts.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No accounts yet. Create your Chart of Accounts to start recording transactions.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-2">Code</th>
                <th className="text-left px-4 py-2">Name</th>
                <th className="text-left px-4 py-2">Type</th>
                <th className="text-right px-4 py-2">Opening Balance</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((a) => (
                <tr key={a.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-500">{a.code}</td>
                  <td className="px-4 py-2 font-medium">
                    <Link href={`/accounts/${a.id}`} className="hover:text-brand">{a.name}</Link>
                  </td>
                  <td className="px-4 py-2 capitalize">{a.type}</td>
                  <td className="px-4 py-2 text-right">{Number(a.opening_balance).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
