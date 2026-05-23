'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import {
Users,
MapPin,
ArrowLeft,
Tv,
PenLine,
Video,
Projector,
CheckCircle,
XCircle
} from 'lucide-react'

import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/hooks/useAuth'
import { roomService } from '@/services/roomService'
import { supabase } from '@/lib/supabase'
import { generateTimeSlots, formatTime, cn } from '@/utils/helpers'
import toast from 'react-hot-toast'

const facilityMap = {
tv:{icon:Tv,label:'TV'},
projector:{icon:Projector,label:'Projector'},
whiteboard:{icon:PenLine,label:'Whiteboard'},
zoom:{icon:Video,label:'Zoom'}
}

const slots = generateTimeSlots(7,22)

export default function RoomDetailPage(){

const router=useRouter()
const params=useParams()

const {user,loading}=useAuth()

const [room,setRoom]=useState<any>(null)
const [bookings,setBookings]=useState<any[]>([])

const [selectedDate,setSelectedDate]=useState(
new Date().toISOString().split('T')[0]
)

const [selectedStart,setSelectedStart]=useState('')
const [selectedEnd,setSelectedEnd]=useState('')

const [title,setTitle]=useState('')
const [description,setDescription]=useState('')

const [submitting,setSubmitting]=useState(false)

useEffect(()=>{

if(!loading && !user){
router.push('/login')
}

},[user,loading])

useEffect(()=>{

if(!params.id)return

loadRoom()

},[params.id])

useEffect(()=>{

if(!params.id)return

loadBookings()

},[params.id,selectedDate])


async function loadRoom(){

const data=
await roomService.getById(
params.id as string
)

setRoom(data)

}


async function loadBookings(){

const {data,error}=await supabase
.from('bookings')
.select('*')
.eq('room_id',params.id)
.eq('booking_date',selectedDate)

if(error){

console.log(error)

return
}

setBookings(data||[])

}


function isBooked(slot:string){

return bookings.some(

(b)=>

b.start_time<=slot &&
b.end_time>slot

)

}

async function handleBook(){

if(
!selectedStart||
!selectedEnd||
!title
){

toast.error(
'Complete all fields'
)

return

}

setSubmitting(true)

const {error}=await supabase
.from('bookings')
.insert({

room_id:room.id,

user_id:user?.id,

booking_date:selectedDate,

start_time:selectedStart,

end_time:selectedEnd,

title,

description,

status:'pending'

})

setSubmitting(false)

if(error){

console.log(error)

toast.error(
'Booking failed'
)

return

}

toast.success(
'Booking created'
)

router.push(
'/my-bookings'
)

}

if(
loading||
!user||
!room
)return null

return(

<div className="flex h-screen overflow-hidden">

<Sidebar/>

<div className="flex-1 flex flex-col overflow-hidden">

<Navbar title={room.name}/>

<main className="flex-1 overflow-y-auto p-6">

<button
onClick={()=>router.back()}
className="flex items-center gap-2 mb-5"
>

<ArrowLeft size={16}/>

Back

</button>

<div className="grid lg:grid-cols-3 gap-6">

<div className="lg:col-span-2 space-y-6">

<div className="
relative
h-72
rounded-xl
overflow-hidden
bg-slate-100
">

<Image
src={
room.photo_url ||
'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200'
}
fill
alt=""
className="object-cover"
/>

</div>

<div className="
bg-white
border
rounded-xl
p-6
">

<h1 className="text-2xl font-bold">

{room.name}

</h1>

<div className="
flex
gap-4
text-slate-500
mt-2
">

<div>

<MapPin size={14}/>

{room.location}

</div>

<div>

<Users size={14}/>

{room.capacity}

</div>

</div>

<div className="
flex
gap-2
mt-4
flex-wrap
">

{room.facilities?.map(
(f:string)=>{

const item=
facilityMap[
f as keyof typeof facilityMap
]

if(!item)return null

const Icon=item.icon

return(

<div
key={f}
className="
border
rounded
px-3
py-1
flex
items-center
gap-2
"
>

<Icon size={14}/>

{item.label}

</div>

)

})}

</div>

</div>

<div
className="
bg-white
rounded-xl
border
p-6
"
>

<div className="
flex
justify-between
mb-4
">

<h2>
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
/>

</div>

<div className="
grid
grid-cols-4
gap-2
">

{slots.map((slot)=>{

const booked=
isBooked(slot)

return(

<button

key={slot}

disabled={booked}

onClick={()=>{

if(
!selectedStart||
selectedEnd
){

setSelectedStart(slot)

setSelectedEnd('')

}

else{

setSelectedEnd(
slot
)

}

}}

className={cn(

'rounded p-2 text-xs',

booked

? 'bg-red-100 text-red-500'

: 'bg-green-100 text-green-700'

)}

>

{formatTime(slot)}

</button>

)

})}

</div>

</div>

</div>

<div>

<div
className="
bg-white
border
rounded-xl
p-6
sticky
top-4
"
>

<h2 className="font-bold">

Book Room

</h2>

<input
placeholder="Meeting title"
value={title}
onChange={(e)=>
setTitle(e.target.value)
}
className="
border
w-full
p-3
rounded
mt-4
"
/>

<textarea
placeholder="Description"
value={description}
onChange={(e)=>
setDescription(
e.target.value
)}
className="
border
w-full
p-3
rounded
mt-4
"
/>

<div className="
mt-4
space-y-2
text-sm
">

<div>

Date:
{selectedDate}

</div>

<div>

Start:
{selectedStart}

</div>

<div>

End:
{selectedEnd}

</div>

</div>

<button

onClick={
handleBook
}

disabled={
submitting
}

className="
bg-blue-600
w-full
mt-5
text-white
rounded-lg
p-3
"

>

{submitting
?'Booking...'
:'Confirm Booking'}

</button>

</div>

</div>

</div>

</main>

</div>

</div>

)

}
