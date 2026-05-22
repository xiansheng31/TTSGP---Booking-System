'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { roomService } from '@/services/roomService'

export default function BookingsPage() {
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    roomService
      .getAll()
      .then((data) => {
        console.log('ROOMS:', data)
        setRooms(data || [])
      })
      .catch((err) => {
        console.log('ROOM ERROR:', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar title="Book a Room" />

        <main className="flex-1 overflow-y-auto p-6">

          <h1 className="text-2xl font-bold mb-6">
            Available Rooms
          </h1>

          {loading && (
            <p>Loading rooms...</p>
          )}

          {!loading && rooms.length === 0 && (
            <p>No rooms found.</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            {rooms.map((room) => (
              <div
                key={room.id}
                className="bg-white border rounded-xl p-5 shadow"
              >
                <h2 className="font-bold text-lg">
                  {room.name || 'No name'}
                </h2>

                <p>
                  Capacity: {room.capacity ?? '-'}
                </p>

                <p>
                  Type: {room.type ?? '-'}
                </p>

                <p>
                  Status: {room.status ?? '-'}
                </p>

              </div>
            ))}

          </div>

        </main>
      </div>
    </div>
  )
}
