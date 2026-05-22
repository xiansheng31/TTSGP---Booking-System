'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'

const slots = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
]

export default function BookingsPage() {
  const [rooms,setRooms]=useState<any[]>([])
  const [selectedDate,setSelectedDate]=useState('')
  const [loading,setLoading]=useState(true)

  useEffect(()=>{

    async function loadRooms(){

      const {data}=await supabase
      .from('rooms')
      .select('*')
      .order('name')

      if(data){
        setRooms(data)
      }

      setLoading(false)
    }

    loadRooms()

  },[])

  async function bookSlot(
    room:any,
    start:string
  ){

    const {data:userData}=
      await supabase.auth.getUser()

    if(!userData.user){
      alert('Please login')
      return
    }

    const endMap:any={
      '09:00 AM':'10:00',
      '10:00 AM':'11:00',
      '11:00 AM':'12:00',
      '01:00 PM':'14:00',
      '02:00 PM':'15:00',
      '03:00 PM':'16:00',
    }

    const start24=
      start.replace(' AM','')
      .replace(' PM','')

    const {error}=await supabase
      .from('bookings')
      .insert({
        room_id:room.id,
        user_id:userData.user.id,
        booking_date:selectedDate,
        start_time:start24,
        end_time:endMap[start],
        status:'confirmed'
      })

    if(error){
      console.log(error)
      alert('Booking failed')
      return
    }

    alert('Booked successfully')
  }

  return(
    <div className="flex h-screen overflow-hidden">

      <Sidebar/>

      <div className="flex-1 flex flex-col overflow-hidden">

        <Navbar title="Bookings"/>

        <main className="flex-1 overflow-y-auto p-6">

          <h1 className="text-3xl font-bold mb-2">
            Bookings
          </h1>

          <p className="text-gray-500 mb-6">
            Find and book available rooms
          </p>

          <div className="mb-8">

            <input
              type="date"
              value={selectedDate}
              onChange={(e)=>
                setSelectedDate(
                  e.target.value
                )
              }
              className="
              border
              rounded
              px-4
              py-2
              "
            />

          </div>

          {loading && (
            <p>Loading...</p>
          )}

          <div className="space-y-5">

            {rooms.map(room=>(

              <div
                key={room.id}
                className="
                bg-white
                rounded-xl
                border
                p-5
                flex
                gap-6
                "
              >

                <img
                  src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=300"
                  className="
                  w-40
                  h-28
                  object-cover
                  rounded
                  "
                />

                <div className="flex-1">

                  <h2 className="font-bold text-lg">
                    {room.name}
                  </h2>

                  <p className="text-sm text-gray-500">

                    👥 {room.capacity} seats

                    &nbsp;&nbsp;

                    📺 TV

                    &nbsp;&nbsp;

                    📝 Whiteboard

                  </p>

                  <div className="
                  flex
                  gap-2
                  mt-5
                  flex-wrap
                  ">

                    {slots.map(slot=>(

                      <button
                        key={slot}
                        onClick={()=>
                          bookSlot(
                            room,
                            slot
                          )
                        }
                        className="
                        px-4
                        py-2
                        rounded
                        bg-green-100
                        hover:bg-green-200
                        text-sm
                        "
                      >
                        {slot}
                      </button>

                    ))}

                  </div>

                </div>

              </div>

            ))}

          </div>

        </main>

      </div>

    </div>
  )
}
