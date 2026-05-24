'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'

export default function BookingsPage() {

const router=useRouter()

const [availableRooms,setAvailableRooms]=
useState<any[]>([])

const [selectedDate,setSelectedDate]=
useState('')

const [loading,setLoading]=
useState(true)


useEffect(()=>{

async function loadRooms(){

const {data,error}=await supabase
.from('rooms')
.select('*')
.order('name')

console.log(data)
console.log(error)

if(data){

setAvailableRooms(data)

}

setLoading(false)

}

loadRooms()

},[])



async function checkAvailability(){

if(!selectedDate){

alert(
'Please select a date'
)

return

}


const {data,error}=await supabase
.from('rooms')
.select('*')
.eq(
'status',
'available'
)
.order(
'name'
)

console.log(data)
console.log(error)

if(data){

setAvailableRooms(data)

}

}



return(

<div className="
min-h-screen
bg-slate-100
">

<Sidebar/>


<div className="
lg:ml-72
min-h-screen
flex
flex-col
">

<Navbar
title="Bookings"
/>


<main className="
flex-1
p-4
md:p-6
overflow-x-hidden
">

<h1 className="
text-2xl
md:text-3xl
font-bold
">

Bookings

</h1>

<p className="
text-gray-500
mb-6
">

Find and book available rooms

</p>



<div className="
flex
flex-col
sm:flex-row
gap-4
mb-8
">

<input
type="date"
value={selectedDate}
onChange={(e)=>
setSelectedDate(
e.target.value
)
}
className="
bg-white
border
rounded-lg
px-4
py-3
"
/>


<button
onClick={
checkAvailability
}
className="
bg-blue-600
text-white
px-6
py-3
rounded-lg
hover:bg-blue-700
"
>

Check Availability

</button>

</div>



{loading&&(

<p>

Loading...

</p>

)}



{
!loading&&
availableRooms.length===0&&(

<p>

No rooms available

</p>

)
}



<div className="
space-y-5
">

{
availableRooms.map(room=>(

<div
key={room.id}
className="
bg-white
border
rounded-xl
p-5
shadow-sm

flex
flex-col
md:flex-row
gap-5
"
>

<img
src={
room.photo_url ||

'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=300'
}
className="
w-full
md:w-44
h-48
md:h-28
rounded-lg
object-cover
"
/>



<div className="
flex-1
">

<h2 className="
font-bold
text-xl
">

{room.name}

</h2>


<p className="
text-gray-500
text-sm
mb-3
">

👥 {room.capacity} Seats

&nbsp;&nbsp;

📺 TV

&nbsp;&nbsp;

📝 Whiteboard

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



<div className="
flex
justify-end
mt-5
">

<button
onClick={()=>
router.push(
`/room/${room.id}`
)
}
className="
text-blue-600
font-medium
hover:underline
"
>

View Details

</button>

</div>

</div>

</div>

))

}

</div>

</main>

</div>

</div>

)

}
