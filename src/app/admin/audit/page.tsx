'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import type { AuditLog } from '@/types'

export default function AdminAuditPage() {
  const router = useRouter()
  const { user, loading, isAdmin } = useAuth()
  const [logs, setLogs] = useState<AuditLog[]>([])

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.push('/home')
  }, [user, loading, isAdmin, router])

  useEffect(() => {
    if (!isAdmin) return
    supabase.from('audit_logs').select('*, user:users(name, email)').order('created_at', { ascending: false }).limit(200).then(({ data }) => setLogs(data ?? []))
  }, [isAdmin])

  if (loading || !user || !isAdmin) return null

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="Audit Logs" />
        <main className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Timestamp', 'User', 'Action', 'Details'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-5 py-3 text-slate-400 text-xs whitespace-nowrap">{new Date(log.created_at).toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-slate-700">{log.user?.name ?? '—'}</p>
                      <p className="text-xs text-slate-400">{log.user?.email}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2 py-1 rounded-md">{log.action}</span>
                    </td>
                    <td className="px-5 py-3 text-slate-500 text-xs max-w-xs truncate">{log.details ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {logs.length === 0 && <div className="text-center py-12 text-slate-400">No audit logs yet.</div>}
          </div>
        </main>
      </div>
    </div>
  )
}
