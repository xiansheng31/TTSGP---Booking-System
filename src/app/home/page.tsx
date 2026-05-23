'use client'

import { useEffect,useState } from 'react'
import { useRouter } from 'next/navigation'
import {
Calendar,
Clock,
DoorOpen,
Plus,
Megaphone
} from 'lucide-react'

import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import DashboardCard from '@/components/DashboardCard'
import { supabase } from '@/lib/supabase'

export default function HomePage(){

const router=useRouter()

const user={
id:'1',
name:'Xian Sheng'
}

const [availableNow,setAvailableNow]=useState(0)

const [todayCount,setTodayCount]=useState(0)

const [myUpcoming,setMyUpcoming]=useState<any[]>([])

const [announcements,setAnnouncements]=
useState<any[]>([])

useEffect(()=>{

loadData()

},[])

async function loadData(){

await Promise.all([

loadRooms(),
loadBookings(),
loadAnnouncements()

])

}


async function loadRooms(){

const {data}=await supabase
.from('rooms')
.select('*')
.eq(
'status',
'available'
)

if(data){

setAvailableNow(
data.length
)

}

}


async function loadBookings(){

const today=
new Date()
.toISOString()
.split('T')[0]

const {data:userData}=
await supabase.auth.getUser()

if(!userData.user)return


const {data}=await supabase
.from('bookings')
.select('*')
.eq(
'booking_date',
today
)

if(data){

setTodayCount(
data.length
)

}


const {data:upcoming}=await supabase
.from('bookings')
.select('*')
.eq(
'user_id',
userData.user.id
)
.gte(
'booking_date',
today
)

if(upcoming){

setMyUpcoming(
upcoming
)

}

}


async function loadAnnouncements(){

const {data,error}=await supabase
.from('announcements')
.select('*')
.order(
'created_at',
{
ascending:false
}
)
.limit(5)

console.log(data)
console.log(error)

if(data){

setAnnouncements(data)

}

}

const hour=
new Date().getHours()

const greeting=

hour<12
?'Good morning'
:hour<17
?'Good afternoon'
:'Good evening'


return(

<div className="flex h-screen overflow-hidden">

<Sidebar/>

<div className="flex-1 flex flex-col overflow-hidden">

<Navbar title="Home"/>

<main className="flex-1 overflow-y-auto p-6 space-y-6">

<div className="
bg-gradient-to-r
from-blue-600
to-blue-700
rounded-2xl
p-6
text-white
">

<h2 className="
text-2xl
font-bold
">

{greeting},
{' '}
{user.name}
! 👋

</h2>

<p className="
text-blue-100
mt-1
text-sm
">

Manage your room bookings below

</p>

<button
onClick={()=>
router.push(
'/bookings'
)
}
className="
mt-4
inline-flex
items-center
gap-2
bg-white
text-blue-600
text-sm
font-semibold
px-4
py-2
rounded-lg
"
>

<Plus size={16}/>

Quick Book

</button>

</div>


<div className="
grid
grid-cols-1
sm:grid-cols-3
gap-4
">

<DashboardCard
title="Available Rooms"
value={availableNow}
icon={DoorOpen}
/>

<DashboardCard
title="Today's Bookings"
value={todayCount}
icon={Calendar}
/>

<DashboardCard
title="My Upcoming"
value={myUpcoming.length}
icon={Clock}
/>

</div>


<div className="
bg-white
p-6
rounded-xl
">

<div className="
flex
items-center
gap-2
mb-4
">

<Megaphone size={16}/>

<h3 className="font-semibold">

Announcements

</h3>

</div>


{announcements.length===0&&(

<p className="text-gray-400">

No announcements

</p>

)}

{announcements.map(a=>(

<div
key={a.id}
className="
border-b
py-4
"
>

<p className="
font-bold
">

{a.title}

</p>

<p className="
text-gray-600
">

{a.content}

</p>

</div>

))}

</div>

</main>

</div>

</div>

)

}
