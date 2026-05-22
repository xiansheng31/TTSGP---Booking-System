'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'

export default function BookingsPage() {
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRooms() {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('name')

      console.log('ROOM DATA:', data)
      console.log('ROOM ERROR:', error)

      if (data) {
        setRooms(data)
      }

      setLoading(false)
    }

    loadRooms()
  }, [])

  async function bookRoom(room: any) {
    const { data: sessionData } =
      await supabase.auth.getUser()

    const user = sessionData.user

    if (!user) {
      alert('Please login')
      return
    }

    const { error } =
      await supabase
        .from('bookings')
        .insert({
          room_id: room.id,
          user_id: user.id,

          booking_date:
            new Date()
              .toISOString()
              .split('T')[0],

          start_time: '09:00',

          end_time: '10:00',

          status: 'pending'
        })

    if (error) {
      console.log(error)
      alert('Booking failed')
      return
    }

    alert(`${room.name} booked successfully`)
  }

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {rooms.map((room) => (

              <div
                key={room.id}
                className="bg-white border rounded-xl p-6 shadow-sm"
              >
                <h2 className="font-bold text-2xl mb-4">
                  {room.name}
                </h2>

                <p>
                  <b>Type:</b> {room.type}
                </p>

                <p>
                  <b>Capacity:</b> {room.capacity}
                </p>

                <p>
                  <b>Floor:</b> {room.floor}
                </p>

                <p>
                  <b>Location:</b> {room.location}
                </p>

                <button
                  onClick={() =>
                    bookRoom(room)
                  }
                  className="
                    mt-5
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    px-5
                    py-2
                    rounded-lg
                  "
                >
                  Book Room
                </button>

              </div>

            ))}

          </div>

        </main>

      </div>

    </div>
  )
}
