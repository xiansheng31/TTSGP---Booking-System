'use client'

import { useEffect,useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function RoomDisplayPage(){

const params=useParams()

const roomId=params.id

const [room,setRoom]=useState<any>(null)

const [bookings,setBookings]=
useState<any[]>([])

const [current,setCurrent]=
useState<any>(null)

const [upcoming,setUpcoming]=
useState<any[]>([])



useEffect(()=>{

loadData()

const interval=
setInterval(

loadData,

30000

)

return()=>
clearInterval(
interval
)

},[])



async function loadData(){

const today=
new Date()
.toISOString()
.split('T')[0]


const now=
new Date()
.toLocaleTimeString(
'en-GB',
{
hour:'2-digit',
minute:'2-digit',
hour12:false
}
)



const {data:roomData}=
await supabase

.from('rooms')

.select('*')

.eq(
'id',
roomId
)

.single()



setRoom(
roomData
)



const {data}=await supabase

.from('bookings')

.select(`
*,
users(name)
`)

.eq(
'room_id',
roomId
)

.eq(
'booking_date',
today
)

.order(
'start_time'
)



if(!data)return



setBookings(
data
)



const currentBooking=
data.find(

b=>

now>=b.start_time &&

now<b.end_time

)



setCurrent(
currentBooking
)



const next=

data.filter(

b=>

b.start_time>
now

)



setUpcoming(
next
)

}



return(

<div className="min-h-screen bg-slate-100 p-8">

<div className="max-w-5xl mx-auto">

<div className="bg-white rounded-3xl p-10 shadow">

<h1 className="
text-5xl
font-bold
mb-3
">

{room?.name}

</h1>


<p className="
text-gray-500
mb-8
">

Floor {room?.floor}

</p>



<div className="
mb-8
p-6
rounded-2xl

${
current

?

'bg-red-100'

:

'bg-green-100'
}

">

<h2 className="
text-3xl
font-bold
">

{

current

?

'🔴 Occupied'

:

'🟢 Available'

}

</h2>



{

current&&(

<div className="mt-4">

<p className="text-xl">

{current.users?.name}

</p>

<p>

{current.start_time}

-

{current.end_time}

</p>

<p>

{current.title}

</p>

</div>

)

}

</div>



<div>

<h3 className="
text-2xl
font-bold
mb-5
">

Upcoming Today

</h3>


<div className="space-y-4">

{

upcoming.map(b=>(

<div
key={b.id}
className="
border
rounded-xl
p-5
bg-gray-50
"
>

<p className="
font-bold
">

{b.start_time}

-

{b.end_time}

</p>

<p>

{b.users?.name}

</p>

<p>

{b.title}

</p>

</div>

))

}

</div>

</div>

</div>

</div>

</div>

)

}
