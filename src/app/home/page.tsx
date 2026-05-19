'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, DoorOpen, Plus, Megaphone } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import DashboardCard from '@/components/DashboardCard'
import BookingCard from '@/components/BookingCard'
import { useAuth } from '@/hooks/useAuth'
import { bookingService } from '@/services/bookingService'
import { roomService } from '@/services/roomService'
import { supabase } from '@/lib/supabase'
import type { Booking, Announcement } from '@/types'

export default function HomePage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [myUpcoming, setMyUpcoming] = useState<Booking[]>([])
  const [availableNow, setAvailableNow] = useState(0)
  const [todayCount, setTodayCount] = useState(0)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return
    bookingService.getByUser(user.id).then((data) => {
      const upcoming = data.filter((b) => {
        const now = new Date()
        const bookingDate = new Date(b.booking_date)
        return (b.status === 'approved' || b.status === 'pending') && bookingDate >= new Date(now.toDateString())
      })
      setMyUpcoming(upcoming.slice(0, 3))
    })
    bookingService.getToday().then((data) => setTodayCount(data.length))
    roomService.getAll({ status: 'available' }).then((rooms) => setAvailableNow(rooms.length))
    supabase.from('announcements').select('*').order('publish_date', { ascending: false }).limit(3).then(({ data }) => setAnnouncements(data ?? []))
  }, [user])

  if (loading || !user) return null

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="Home" />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Welcome */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
            <h2 className="text-2xl font-bold">{greeting}, {user.name.split(' ')[0]}! 👋</h2>
            <p className="text-blue-100 mt-1 text-sm">Manage your room bookings and check availability below.</p>
            <button
              onClick={() => router.push('/bookings')}
              className="mt-4 inline-flex items-center gap-2 bg-white text-blue-600 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Plus size={16} /> Quick Book
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <DashboardCard title="Available Rooms" value={availableNow} icon={DoorOpen} iconColor="text-green-600" iconBg="bg-green-50" subtitle="Right now" />
            <DashboardCard title="Today's Bookings" value={todayCount} icon={Calendar} iconColor="text-blue-600" iconBg="bg-blue-50" subtitle="Across all rooms" />
            <DashboardCard title="My Upcoming" value={myUpcoming.length} icon={Clock} iconColor="text-purple-600" iconBg="bg-purple-50" subtitle="Scheduled bookings" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upcoming Bookings */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-800">My Upcoming Bookings</h3>
                <button onClick={() => router.push('/my-bookings')} className="text-xs text-blue-600 hover:underline">View all</button>
              </div>
              {myUpcoming.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                  <Calendar size={32} className="text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm">No upcoming bookings.</p>
                  <button onClick={() => router.push('/bookings')} className="mt-3 text-sm text-blue-600 hover:underline">Book a room →</button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myUpcoming.map((b) => <BookingCard key={b.id} booking={b} />)}
                </div>
              )}
            </div>

            {/* Announcements */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Megaphone size={16} className="text-slate-500" />
                <h3 className="font-semibold text-slate-800">Announcements</h3>
              </div>
              {announcements.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                  <p className="text-slate-400 text-sm">No announcements.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {announcements.map((a) => (
                    <div key={a.id} className="bg-white rounded-xl border border-slate-200 p-4">
                      <p className="text-sm font-semibold text-slate-800">{a.title}</p>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{a.content}</p>
                      <p className="text-xs text-slate-400 mt-2">{new Date(a.publish_date).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
