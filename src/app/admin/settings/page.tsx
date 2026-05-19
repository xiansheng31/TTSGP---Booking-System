'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface Settings {
  buffer_minutes: number
  max_booking_hours: number
  operating_start: string
  operating_end: string
  require_approval: boolean
  max_advance_days: number
}

const defaults: Settings = {
  buffer_minutes: 15,
  max_booking_hours: 4,
  operating_start: '07:00',
  operating_end: '22:00',
  require_approval: true,
  max_advance_days: 30,
}

export default function AdminSettingsPage() {
  const router = useRouter()
  const { user, loading, isAdmin } = useAuth()
  const [settings, setSettings] = useState<Settings>(defaults)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.push('/home')
  }, [user, loading, isAdmin, router])

  useEffect(() => {
    if (!isAdmin) return
    supabase.from('system_settings').select('*').single().then(({ data }) => {
      if (data) setSettings({ ...defaults, ...data })
    })
  }, [isAdmin])

  const save = async () => {
    setSaving(true)
    try {
      await supabase.from('system_settings').upsert({ id: 1, ...settings })
      toast.success('Settings saved.')
    } catch { toast.error('Failed to save.') } finally { setSaving(false) }
  }

  if (loading || !user || !isAdmin) return null

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="System Settings" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
              <h2 className="font-semibold text-slate-800">Booking Rules</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Buffer Time (minutes)</label>
                  <input type="number" value={settings.buffer_minutes} onChange={(e) => setSettings({ ...settings, buffer_minutes: parseInt(e.target.value) })} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Max Booking Duration (hours)</label>
                  <input type="number" value={settings.max_booking_hours} onChange={(e) => setSettings({ ...settings, max_booking_hours: parseInt(e.target.value) })} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Operating Hours Start</label>
                  <input type="time" value={settings.operating_start} onChange={(e) => setSettings({ ...settings, operating_start: e.target.value })} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Operating Hours End</label>
                  <input type="time" value={settings.operating_end} onChange={(e) => setSettings({ ...settings, operating_end: e.target.value })} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Max Advance Booking (days)</label>
                  <input type="number" value={settings.max_advance_days} onChange={(e) => setSettings({ ...settings, max_advance_days: parseInt(e.target.value) })} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <input type="checkbox" id="approval" checked={settings.require_approval} onChange={(e) => setSettings({ ...settings, require_approval: e.target.checked })} className="w-4 h-4 rounded border-slate-300 text-blue-600" />
                  <label htmlFor="approval" className="text-sm font-medium text-slate-700">Require Admin Approval</label>
                </div>
              </div>
              <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors">
                <Save size={16} /> {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
