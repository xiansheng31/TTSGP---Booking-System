'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'

export default function RoomDetailsPage(){

const {id}=useParams()

const [room,setRoom]=useState<any>(null)
const [bookings,setBookings]=useState<any[]>([])

const [selectedDate,setSelectedDate]=useState(
new Date()
.toISOString()
.split('T')[0]
)

const [start,setStart]=useState('')
const [end,setEnd]=useState('')
const [title,setTitle]=useState('')
const [description,setDescription]=useState('')

useEffect(()=>{

loadRoom()
loadBookings()

},[id,selectedDate])


async function loadRoom(){

const {data,error}=await supabase
.from('rooms')
.select('*')
.eq('id',id)
.single()

if(error){

console.log(error)
return

}

setRoom(data)

}


async function loadBookings(){

const {data,error}=await supabase
.from('bookings')
.select('*')
.eq('room_id',id)
.eq(
'booking_date',
selectedDate
)

if(error){

console.log(error)
return

}

setBookings(data||[])

}


const slots=[

'09:00',
'09:30',
'10:00',
'10:30',
'11:00',
'11:30',
'12:00',
'12:30',
'13:00',
'13:30',
'14:00',
'14:30',
'15:00',
'15:30',
'16:00',
'16:30',
'17:00'

]


function isBooked(time:string){

return bookings.some(

booking=>

time>=booking.start_time &&

time<booking.end_time

)

}


async function confirmBooking(){

if(!start){

alert(
'Please select start time'
)

return

}

if(!end){

alert(
'Please select end time'
)

return

}

const {data:{user}}=
await supabase
.auth
.getUser()

if(!user){

alert('Please login')
return

}

const {error}=await supabase
.from('bookings')
.insert({

room_id:id,
user_id:user.id,
title,
description,
booking_date:selectedDate,
start_time:start,
end_time:end,

status:'approved'

})

if(error){

alert(error.message)
return

}

alert(
'Booking successful'
)

loadBookings()

setStart('')
setEnd('')
setTitle('')
setDescription('')

}


if(!room){

return(
<div className="p-10">
Loading...
</div>
)

}


return(

<div className="min-h-screen bg-slate-100">

<Sidebar/>

<div className="lg:ml-72 flex flex-col min-h-screen">

<Navbar title={room.name}/>

<main className="p-4 md:p-6">

<div className="
grid
grid-cols-1
xl:grid-cols-3
gap-6
">

<div className="
xl:col-span-2
space-y-6
">

<div className="
bg-white
rounded-xl
border
p-6
">

<h1 className="
text-2xl
md:text-4xl
font-bold
mb-6
">

{room.name}

</h1>

<div className="
grid
grid-cols-2
gap-4
text-sm
">

<p>
Type:
{' '}
{room.type}
</p>

<p>
Capacity:
{' '}
{room.capacity}
</p>

<p>
Floor:
{' '}
{room.floor}
</p>

<p>
Location:
{' '}
{room.location}
</p>

</div>

</div>


<div className="
bg-white
rounded-xl
border
p-6
">

<div className="
flex
flex-col
md:flex-row
justify-between
gap-4
mb-6
">

<h2 className="
font-bold
text-xl
">

Availability

</h2>

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
rounded-lg
px-4
py-2
"
/>

</div>


<div className="
grid
grid-cols-2
md:grid-cols-3
gap-4
">

{slots.map(time=>{

const booked=
isBooked(time)

return(

<button
key={time}
disabled={booked}
onClick={()=>{
setStart(time)
setEnd('')
}}
className={`

p-4
rounded-xl
font-medium
transition

${
booked
?'bg-gray-300 text-gray-500'
:start===time
?'bg-blue-600 text-white'
:'bg-green-100 text-green-700'
}

`}
>

{time}

</button>

)

})}

</div>


<div className="
mt-6
">

<p className="
font-semibold
mb-2
">

Select End Time

</p>

<select
value={end}
onChange={(e)=>
setEnd(
e.target.value
)}
className="
border
rounded-lg
p-3
w-full
"
>

<option value="">
Select end time
</option>

{
slots
.filter(
slot=>slot>start
)
.map(slot=>(

<option
key={slot}
value={slot}
>

{slot}

</option>

))
}

</select>

</div>

</div>

</div>



<div className="
bg-white
rounded-xl
border
p-6
h-fit
">

<h2 className="
text-2xl
font-bold
mb-6
">

Book Room

</h2>


<input
placeholder="Meeting title"
value={title}
onChange={(e)=>
setTitle(
e.target.value
)
}
className="
border
w-full
p-3
rounded-lg
mb-4
"
/>


<textarea
placeholder="Description"
value={description}
onChange={(e)=>
setDescription(
e.target.value
)
}
className="
border
w-full
h-28
p-3
rounded-lg
mb-4
"
/>


<p>

Date:
{' '}
{selectedDate}

</p>


<div className="
mt-4
space-y-2
">

<p>

<b>
Selected Start:
</b>

{' '}

{start||'Not selected'}

</p>


<p>

<b>
Selected End:
</b>

{' '}

{end||'Not selected'}

</p>

</div>


<button
onClick={confirmBooking}
className="
w-full
mt-6
py-4
rounded-xl
bg-blue-600
text-white
hover:bg-blue-700
"
>

Confirm Booking

</button>

</div>

</div>

</main>

</div>

</div>

)

}
