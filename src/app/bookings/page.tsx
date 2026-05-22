'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import BookingCard from '@/components/BookingCard'
import { bookingService } from '@/services/bookingService'
import type { Booking } from '@/types'
import toast from 'react-hot-toast'

export default function MyBookingsPage() {
  const router = useRouter()

  const user = {
    id: '1',
    name: 'Xian Sheng'
  }

  const [bookings, setBookings] = useState<Booking[]>([])
  const [tab, setTab] = useState<'upcoming' | 'history'>('upcoming')

  useEffect(() => {
    bookingService
      .getByUser(user.id)
      .then(setBookings)
  }, [])

  const now =
    new Date().toISOString().split('T')[0]

  const upcoming = bookings.filter(
    (b) =>
      b.booking_date >= now &&
      (
        b.status === 'pending' ||
        b.status === 'approved'
      )
  )

  const history = bookings.filter(
    (b) =>
      b.booking_date < now ||
      b.status === 'cancelled' ||
      b.status === 'completed'
  )

  async function handleCancel(
    booking: Booking
  ) {
    if (!confirm(
      'Cancel this booking?'
    )) return

    try {
      await bookingService.cancel(
        booking.id
      )

      setBookings(prev =>
        prev.map(b =>
          b.id === booking.id
            ? {
                ...b,
                status: 'cancelled'
              }
            : b
        )
      )

      toast.success(
        'Booking cancelled.'
      )

    } catch {

      toast.error(
        'Failed to cancel booking.'
      )

    }
  }

  const displayed =
    tab === 'upcoming'
      ? upcoming
      : history

  return (
    <div className="flex h-screen overflow-hidden">

      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        <Navbar title="My Bookings" />

        <main className="flex-1 overflow-y-auto p-6 space-y-5">

          <div className="flex border-b">

            {(['upcoming','history'] as const)
            .map((t)=>(

              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-5 py-3"
              >
                {t}
              </button>

            ))}

          </div>

          {displayed.length===0 ? (

            <div className="text-center py-16">

              <p>
                No {tab} bookings
              </p>

              <button
                onClick={() =>
                  router.push('/bookings')
                }
              >
                Book a room →
              </button>

            </div>

          ) : (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              {displayed.map((b)=>(
                <BookingCard
                  key={b.id}
                  booking={b}
                  onCancel={handleCancel}
                />
              ))}

            </div>

          )}

        </main>

      </div>

    </div>
  )
}
