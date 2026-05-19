'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/hooks/useAuth'
import { userService } from '@/services/userService'
import type { User, Role } from '@/types'
import toast from 'react-hot-toast'

const roles: Role[] = ['employee', 'admin', 'super_admin']

export default function AdminUsersPage() {
  const router = useRouter()
  const { user, loading, isAdmin } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.push('/home')
  }, [user, loading, isAdmin, router])

  useEffect(() => {
    if (isAdmin) userService.getAll().then(setUsers)
  }, [isAdmin])

  const handleRoleChange = async (id: string, role: Role) => {
    try {
      await userService.updateRole(id, role)
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, role } : u))
      toast.success('Role updated.')
    } catch { toast.error('Failed to update role.') }
  }

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.department.toLowerCase().includes(search.toLowerCase())
  )

  if (loading || !user || !isAdmin) return null

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="User Management" />
        <main className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Employee', 'Employee ID', 'Department', 'Phone', 'Role', 'Joined'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <div>
                        <p className="font-medium text-slate-800">{u.name}</p>
                        <p className="text-xs text-slate-400">{u.email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-500">{u.employee_id}</td>
                    <td className="px-5 py-3 text-slate-600">{u.department}</td>
                    <td className="px-5 py-3 text-slate-500">{u.phone ?? '—'}</td>
                    <td className="px-5 py-3">
                      <select value={u.role} onChange={(e) => handleRoleChange(u.id, e.target.value as Role)} className="px-2 py-1 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize">
                        {roles.map((r) => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
                      </select>
                    </td>
                    <td className="px-5 py-3 text-slate-400 text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  )
}
