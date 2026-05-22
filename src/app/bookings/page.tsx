'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { roomService } from '@/services/roomService'

export default function BookingsPage() {
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRooms() {
      try {
        const data = await roomService.getAll()

        console.log('ROOMS:', data)

        setRooms(data)
      } catch (error) {
        console.log('ROOM ERROR:', error)
      }

      setLoading(false)
    }

    loadRooms()
  }, [])

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="Book a Room" />

        <main className="flex-1 overflow-y-auto p-6">

          <h1 className="text-3xl font-bold mb-10">
            Available Rooms
          </h1>

          {loading && (
            <p>Loading...</p>
          )}

          {!loading && rooms.length === 0 && (
            <p>No rooms found.</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {rooms.map((room) => (
              <div
                key={room.id}
                className="border rounded-xl p-5 bg-white"
              >
                <h2 className="font-bold text-xl">
                  {room.name}
                </h2>

                <p>
                  Type: {room.type}
                </p>

                <p>
                  Capacity: {room.capacity}
                </p>

                <p>
                  Facilities:
                </p>

                <pre className="text-sm">
                  {JSON.stringify(
                    room.facilities,
                    null,
                    2
                  )}
                </pre>
              </div>
            ))}

          </div>

        </main>
      </div>
    </div>
  )
}
