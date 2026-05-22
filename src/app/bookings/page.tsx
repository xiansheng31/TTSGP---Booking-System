'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'

export default function MyBookingsPage() {
  const router = useRouter()

  const [tab, setTab] =
    useState<'upcoming' | 'history'>(
      'upcoming'
    )

  return (
    <div className="flex h-screen overflow-hidden">

      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        <Navbar title="My Bookings" />

        <main className="flex-1 overflow-y-auto p-6">

          <div className="flex gap-3 mb-6">

            <button
              onClick={() =>
                setTab('upcoming')
              }
              className="px-4 py-2 border rounded"
            >
              Upcoming
            </button>

            <button
              onClick={() =>
                setTab('history')
              }
              className="px-4 py-2 border rounded"
            >
              History
            </button>

          </div>

          <h2 className="text-xl font-bold">

            {tab === 'upcoming'
              ? 'Upcoming Bookings'
              : 'Booking History'}

          </h2>

          <div className="mt-6 p-6 bg-white rounded border">

            No bookings yet.

          </div>

          <button
            onClick={() =>
              router.push('/bookings')
            }
            className="mt-4 text-blue-600"
          >
            Book a room →
          </button>

        </main>

      </div>

    </div>
  )
}
