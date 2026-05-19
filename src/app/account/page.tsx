'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Lock } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/hooks/useAuth'
import { userService } from '@/services/userService'
import { authService } from '@/services/authService'
import toast from 'react-hot-toast'

export default function AccountPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [department, setDepartment] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!loading && !user) router.push('/login')
    if (user) { setName(user.name); setPhone(user.phone ?? ''); setDepartment(user.department) }
  }, [user, loading, router])

  const saveProfile = async () => {
    if (!user) return
    setSaving(true)
    try {
      await userService.update(user.id, { name, phone, department })
      toast.success('Profile updated.')
    } catch {
      toast.error('Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  const changePassword = async () => {
    if (!newPassword || newPassword.length < 8) { toast.error('Password must be at least 8 characters.'); return }
    try {
      await authService.updatePassword(newPassword)
      toast.success('Password updated.')
      setNewPassword('')
    } catch {
      toast.error('Failed to update password.')
    }
  }

  if (loading || !user) return null

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="My Account" />
        <main className="flex-1 overflow-y-auto p-6 space-y-6 max-w-2xl">
          {/* Profile Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                {user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <div>
                <p className="font-semibold text-slate-800">{user.name}</p>
                <p className="text-sm text-slate-500">{user.email}</p>
                <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full capitalize mt-1 inline-block">{user.role.replace('_', ' ')}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Employee ID</label>
                <input value={user.employee_id} disabled className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-400 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Department</label>
                <input value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <button onClick={saveProfile} disabled={saving} className="mt-5 flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors">
              <Save size={16} /> {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>

          {/* Password Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock size={18} className="text-slate-500" />
              <h3 className="font-semibold text-slate-800">Change Password</h3>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Minimum 8 characters" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-sm" />
            </div>
            <button onClick={changePassword} className="mt-4 flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-900 transition-colors">
              Update Password
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}
