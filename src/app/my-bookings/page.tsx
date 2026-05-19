'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import BookingCard from '@/components/BookingCard'
import { useAuth } from '@/hooks/useAuth'
import { bookingService } from '@/services/bookingService'
import type { Booking } from '@/types'
import toast from 'react-hot-toast'

export default function MyBookingsPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [tab, setTab] = useState<'upcoming' | 'history'>('upcoming')

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return
    bookingService.getByUser(user.id).then(setBookings)
  }, [user])

  const now = new Date().toISOString().split('T')[0]
  const upcoming = bookings.filter((b) => b.booking_date >= now && (b.status === 'pending' || b.status === 'approved'))
  const history = bookings.filter((b) => b.booking_date < now || b.status === 'cancelled' || b.status === 'completed')

  const handleCancel = async (booking: Booking) => {
    if (!confirm('Cancel this booking?')) return
    try {
      await bookingService.cancel(booking.id)
      setBookings((prev) => prev.map((b) => b.id === booking.id ? { ...b, status: 'cancelled' } : b))
      toast.success('Booking cancelled.')
    } catch {
      toast.error('Failed to cancel booking.')
    }
  }

  if (loading || !user) return null
  const displayed = tab === 'upcoming' ? upcoming : history

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="My Bookings" />
        <main className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            {(['upcoming', 'history'] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`px-5 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${tab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                {t} {t === 'upcoming' ? `(${upcoming.length})` : `(${history.length})`}
              </button>
            ))}
          </div>

          {displayed.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-400">No {tab} bookings.</p>
              {tab === 'upcoming' && (
                <button onClick={() => router.push('/bookings')} className="mt-2 text-sm text-blue-600 hover:underline">Book a room →</button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayed.map((b) => (
                <BookingCard key={b.id} booking={b} onCancel={handleCancel} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
