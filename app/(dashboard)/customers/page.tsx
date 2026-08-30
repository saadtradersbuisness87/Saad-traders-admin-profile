import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'

export default async function CustomersPage() {
  const supabase = createClient()
  const { data: customers } = await supabase
    .from('customers')
    .select('id, name, phone, opening_balance, credit_limit, is_active')
    .order('name')

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Customers</h1>
        <Link href="/customers/new" className="bg-brand text-white text-sm px-4 py-2 rounded-md hover:bg-brand-dark">
          + New Customer
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {!customers || customers.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No customers yet. Create your first customer to start selling.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-2">Name</th>
                <th className="text-left px-4 py-2">Phone</th>
                <th className="text-right px-4 py-2">Balance</th>
                <th className="text-right px-4 py-2">Credit Limit</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">
                    <Link href={`/customers/${c.id}`} className="hover:text-brand">{c.name}</Link>
                  </td>
                  <td className="px-4 py-2 text-gray-500">{c.phone ?? '—'}</td>
                  <td className="px-4 py-2 text-right">{Number(c.opening_balance).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-2 text-right">{c.credit_limit ? Number(c.credit_limit).toLocaleString('en-IN') : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
