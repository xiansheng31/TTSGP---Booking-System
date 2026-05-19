'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, DoorOpen, Users, Clock, CheckCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import DashboardCard from '@/components/DashboardCard'
import { useAuth } from '@/hooks/useAuth'
import { bookingService } from '@/services/bookingService'
import { roomService } from '@/services/roomService'
import { userService } from '@/services/userService'
import type { Booking } from '@/types'

const COLORS = ['#2563eb', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6']

export default function AdminDashboardPage() {
  const router = useRouter()
  const { user, loading, isAdmin } = useAuth()
  const [stats, setStats] = useState({ todayBookings: 0, totalRooms: 0, totalUsers: 0, pendingApprovals: 0 })
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [chartData, setChartData] = useState<{ name: string; bookings: number }[]>([])
  const [roomTypeData, setRoomTypeData] = useState<{ name: string; value: number }[]>([])

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.push('/home')
  }, [user, loading, isAdmin, router])

  useEffect(() => {
    if (!isAdmin) return
    Promise.all([
      bookingService.getToday(),
      bookingService.getAll(),
      roomService.getAll(),
      userService.getAll(),
    ]).then(([today, all, rooms, users]) => {
      const pending = all.filter((b) => b.status === 'pending').length
      setStats({ todayBookings: today.length, totalRooms: rooms.length, totalUsers: users.length, pendingApprovals: pending })
      setRecentBookings(all.slice(0, 5))

      // Simple 7-day chart
      const days: { name: string; bookings: number }[] = []
      for (let i = 6; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i)
        const dateStr = d.toISOString().split('T')[0]
        const label = d.toLocaleDateString('en', { weekday: 'short' })
        days.push({ name: label, bookings: all.filter((b) => b.booking_date === dateStr).length })
      }
      setChartData(days)

      const discussion = rooms.filter((r) => r.type === 'discussion').length
      const training = rooms.filter((r) => r.type === 'training').length
      setRoomTypeData([{ name: 'Discussion', value: discussion }, { name: 'Training', value: training }])
    })
  }, [isAdmin])

  if (loading || !user || !isAdmin) return null

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="Admin Dashboard" />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardCard title="Bookings Today" value={stats.todayBookings} icon={Calendar} iconColor="text-blue-600" iconBg="bg-blue-50" />
            <DashboardCard title="Pending Approvals" value={stats.pendingApprovals} icon={Clock} iconColor="text-amber-600" iconBg="bg-amber-50" />
            <DashboardCard title="Total Rooms" value={stats.totalRooms} icon={DoorOpen} iconColor="text-green-600" iconBg="bg-green-50" />
            <DashboardCard title="Total Users" value={stats.totalUsers} icon={Users} iconColor="text-purple-600" iconBg="bg-purple-50" />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
              <p className="text-sm font-semibold text-slate-700 mb-4">Bookings — Last 7 Days</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="text-sm font-semibold text-slate-700 mb-4">Room Types</p>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={roomTypeData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                    {roomTypeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <p className="font-semibold text-slate-800 text-sm">Recent Bookings</p>
              <button onClick={() => router.push('/admin/booking-management')} className="text-xs text-blue-600 hover:underline">View all</button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {['User', 'Room', 'Date', 'Time', 'Status'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-5 py-3 text-slate-700">{b.user?.name ?? '—'}</td>
                    <td className="px-5 py-3 text-slate-700">{b.room?.name ?? '—'}</td>
                    <td className="px-5 py-3 text-slate-500">{b.booking_date}</td>
                    <td className="px-5 py-3 text-slate-500">{b.start_time} – {b.end_time}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
                        b.status === 'approved' ? 'bg-green-100 text-green-700' :
                        b.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        b.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                      }`}>{b.status}</span>
                    </td>
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
