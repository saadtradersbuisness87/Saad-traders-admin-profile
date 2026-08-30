'use client'

import { useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase-browser'

export function ModuleToggle({
  moduleKey,
  label,
  initialEnabled,
}: {
  moduleKey: string
  label: string
  initialEnabled: boolean
}) {
  const [enabled, setEnabled] = useState(initialEnabled)
  const [isPending, startTransition] = useTransition()
  const supabase = createClient()

  function toggle() {
    const next = !enabled
    setEnabled(next)
    startTransition(async () => {
      await supabase.from('module_settings').update({ enabled: next, updated_at: new Date().toISOString() }).eq('key', moduleKey)
    })
  }

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-sm">{label}</span>
      <button
        onClick={toggle}
        disabled={isPending}
        className={`w-11 h-6 rounded-full relative transition-colors ${enabled ? 'bg-brand' : 'bg-gray-300'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
            enabled ? 'translate-x-5' : ''
          }`}
        />
      </button>
    </div>
  )
}
