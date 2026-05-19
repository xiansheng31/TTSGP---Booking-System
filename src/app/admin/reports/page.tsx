'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Download, FileSpreadsheet } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/hooks/useAuth'
import { bookingService } from '@/services/bookingService'
import { roomService } from '@/services/roomService'
import type { Booking, Room } from '@/types'

export default function AdminReportsPage() {
  const router = useRouter()
  const { user, loading, isAdmin } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [rooms, setRooms] = useState<Room[]>([])

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.push('/home')
  }, [user, loading, isAdmin, router])

  useEffect(() => {
    if (!isAdmin) return
    Promise.all([bookingService.getAll(), roomService.getAll()]).then(([b, r]) => { setBookings(b); setRooms(r) })
  }, [isAdmin])

  // Monthly stats for last 6 months
  const monthlyData = (() => {
    const months: { name: string; bookings: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(); d.setMonth(d.getMonth() - i)
      const label = d.toLocaleDateString('en', { month: 'short', year: '2-digit' })
      const count = bookings.filter((b) => {
        const bd = new Date(b.booking_date)
        return bd.getMonth() === d.getMonth() && bd.getFullYear() === d.getFullYear()
      }).length
      months.push({ name: label, bookings: count })
    }
    return months
  })()

  // Room usage
  const roomUsage = rooms.map((r) => ({
    name: r.name,
    bookings: bookings.filter((b) => b.room_id === r.id).length,
  })).sort((a, b) => b.bookings - a.bookings).slice(0, 10)

  const exportCSV = () => {
    const headers = ['ID', 'User', 'Room', 'Date', 'Start', 'End', 'Status', 'Title']
    const rows = bookings.map((b) => [b.id, b.user?.name ?? '', b.room?.name ?? '', b.booking_date, b.start_time, b.end_time, b.status, b.title])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'bookings-report.csv'; a.click()
  }

  if (loading || !user || !isAdmin) return null

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="Reports" />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Export */}
          <div className="flex gap-3">
            <button onClick={exportCSV} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors">
              <FileSpreadsheet size={16} /> Export CSV
            </button>
          </div>

          {/* Monthly Chart */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm font-semibold text-slate-700 mb-4">Monthly Bookings (Last 6 Months)</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="bookings" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Room Usage */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm font-semibold text-slate-700 mb-4">Room Usage</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={roomUsage} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={120} />
                <Tooltip />
                <Bar dataKey="bookings" fill="#22c55e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Bookings', value: bookings.length },
              { label: 'Approved', value: bookings.filter((b) => b.status === 'approved').length },
              { label: 'Cancelled', value: bookings.filter((b) => b.status === 'cancelled').length },
              { label: 'Pending', value: bookings.filter((b) => b.status === 'pending').length },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                <p className="text-2xl font-bold text-slate-800">{s.value}</p>
                <p className="text-xs text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
