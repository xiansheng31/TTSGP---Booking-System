'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

export default function RoomDetailPage() {
  const router = useRouter()
  const params = useParams()

  const [room, setRoom] = useState<any>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedDate, setSelectedDate] =
    useState(
      new Date()
        .toISOString()
        .split('T')[0]
    )

  const [title, setTitle] =
    useState('')

  const [description, setDescription] =
    useState('')

  const [startTime, setStartTime] =
    useState('')

  const [endTime, setEndTime] =
    useState('')

  const slots = [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00'
  ]

  useEffect(() => {

    async function loadData() {

      if (!params?.id) return

      const { data: roomData } =
        await supabase
          .from('rooms')
          .select('*')
          .eq(
            'id',
            params.id
          )
          .single()

      setRoom(roomData)

      const {
        data: bookingData
      } =
      await supabase
      .from('bookings')
      .select('*')
      .eq(
        'room_id',
        params.id
      )
      .eq(
        'booking_date',
        selectedDate
      )

      setBookings(
        bookingData || []
      )

      setLoading(false)
    }

    loadData()

  },[
    params,
    selectedDate
  ])


  function booked(
    slot:string
  ){

    return bookings.some(

      (b)=>

      b.start_time <= slot &&

      b.end_time > slot

    )

  }


  async function bookRoom(){

    const {
      data
    }=
    await supabase
    .auth
    .getUser()

    if(
      !data.user
    ){

      alert(
        'Please login'
      )

      return
    }

    if(
      !title ||
      !startTime ||
      !endTime
    ){

      alert(
        'Fill all details'
      )

      return
    }

    const {error}=
    await supabase
    .from(
      'bookings'
    )
    .insert({

      room_id:
      room.id,

      user_id:
      data.user.id,

      booking_date:
      selectedDate,

      start_time:
      startTime,

      end_time:
      endTime,

      title,

      description,

      status:
      'pending'

    })

    if(error){

      console.log(
        error
      )

      alert(
        'Booking failed'
      )

      return
    }

    alert(
      'Booking success'
    )

    router.push(
      '/my-bookings'
    )

  }

  if(
    loading
  ){

    return(
      <div>
        Loading...
      </div>
    )
  }

  if(
    !room
  ){

    return(
      <div>
        Room not found
      </div>
    )
  }

  return(

<div className="flex h-screen overflow-hidden">

<Sidebar/>

<div className="flex-1 flex flex-col overflow-hidden">

<Navbar title={room.name}/>

<main className="flex-1 overflow-y-auto p-6">

<button
onClick={()=>
router.back()
}
className="
mb-5
text-blue-600
"
>
← Back
</button>


<div className="
grid
lg:grid-cols-3
gap-6
">

<div className="
lg:col-span-2
space-y-6
">

<div className="
relative
h-[300px]
rounded-xl
overflow-hidden
">

<Image

fill

alt=""

className="
object-cover
"

src={
room.photo_url ||

'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200'
}

/>

</div>


<div className="
bg-white
border
rounded-xl
p-6
">

<h1 className="
text-3xl
font-bold
mb-4
">

{room.name}

</h1>

<p>
Type:
{room.type}
</p>

<p>
Capacity:
{room.capacity}
</p>

<p>
Floor:
{room.floor}
</p>

<p>
Location:
{room.location}
</p>

</div>


<div className="
bg-white
border
rounded-xl
p-6
">

<div className="
flex
justify-between
mb-4
">

<h2 className="
font-bold
">
Availability
</h2>

<input

type="date"

value={
selectedDate
}

onChange={
(e)=>

setSelectedDate(
e.target.value
)

}

/>

</div>


<div className="
grid
grid-cols-3
gap-3
">

{slots.map(
(slot)=>{

const isBooked=
booked(
slot
)

return(

<button

key={slot}

disabled={
isBooked
}

onClick={()=>{

if(
!startTime
){

setStartTime(
slot
)

}

else{

setEndTime(
slot
)

}

}}

className={`
p-3
rounded-lg
text-sm

${
isBooked

?

'bg-red-100 text-red-600'

:

'bg-green-100 text-green-700'

}

`}

>

{slot}

</button>

)

})}

</div>

</div>

</div>


<div>

<div className="
bg-white
border
rounded-xl
p-6
sticky
top-5
">

<h2 className="
font-bold
mb-5
">

Book Room

</h2>

<input

placeholder="
Meeting title
"

value={
title
}

onChange={
(e)=>

setTitle(
e.target.value
)

}

className="
border
w-full
rounded
p-3
mb-4
"

/>

<textarea

placeholder="
Description
"

value={
description
}

onChange={
(e)=>

setDescription(
e.target.value
)

}

className="
border
w-full
rounded
p-3
mb-4
"

/>


<div className="
text-sm
space-y-2
mb-5
">

<p>
Date:
{selectedDate}
</p>

<p>
Start:
{startTime}
</p>

<p>
End:
{endTime}
</p>

</div>


<button

onClick={
bookRoom
}

className="
bg-blue-600
text-white
w-full
rounded-lg
p-3
"

>

Confirm Booking

</button>

</div>

</div>

</div>

</main>

</div>

</div>

)

}
