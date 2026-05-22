'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { roomService } from '@/services/roomService'
import type { Room } from '@/types'

export default function BookingsPage() {
  const [rooms, setRooms] = useState<Room[]>([])

  useEffect(() => {
    roomService
      .getAll()
      .then((data) => {
        console.log('ROOMS:', data)
        setRooms(data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  return (
    <div className="flex h-screen overflow-hidden">

      <Sidebar/>

      <div className="flex-1 flex flex-col">

        <Navbar title="Book a Room"/>

        <main className="flex-1 overflow-y-auto p-6">

          <h2 className="text-2xl font-bold mb-6">
            Available Rooms
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            {rooms.map((room)=>(
              <div
                key={room.id}
                className="bg-white p-5 rounded-xl border shadow-sm"
              >
                <h3 className="font-bold text-lg">
                  {room.name}
                </h3>

                <p>
                  Capacity: {room.capacity}
                </p>

                <p>
                  Type: {room.type}
                </p>

              </div>
            ))}

          </div>

        </main>

      </div>

    </div>
  )
}
