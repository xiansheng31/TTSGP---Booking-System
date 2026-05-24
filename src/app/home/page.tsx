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

const [myUpcoming,setMyUpcoming]=
useState<any[]>([])

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

const now=
new Date()

const {data:userData}=
await supabase
.auth
.getUser()

if(!userData.user)return


const {data}=await supabase
.from('bookings')
.select('*')
.eq(
'booking_date',
today
)
.neq(
'status',
'cancelled'
)

if(data){

const activeToday=
data.filter(b=>{

const bookingEnd=
new Date(
`${b.booking_date}T${b.end_time}`
)

return bookingEnd>now

})

setTodayCount(
activeToday.length
)

}



const {data:upcoming}=await supabase
.from('bookings')
.select('*')
.eq(
'user_id',
userData.user.id
)
.neq(
'status',
'cancelled'
)


if(upcoming){

const filteredUpcoming=
upcoming.filter(b=>{

const bookingEnd=
new Date(
`${b.booking_date}T${b.end_time}`
)

return bookingEnd>now

})

setMyUpcoming(
filteredUpcoming
)

}

}



async function loadAnnouncements(){

const {data}=await supabase
.from('announcements')
.select('*')
.order(
'created_at',
{
ascending:false
}
)
.limit(5)

if(data){

setAnnouncements(
data
)

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

<div className="
min-h-screen
bg-slate-100
">

<Sidebar/>


<div className="
lg:ml-72
flex
flex-col
min-h-screen
">

<Navbar title="Home"/>


<main className="
flex-1
p-4
md:p-6
space-y-6
overflow-x-hidden
">


<div className="
bg-gradient-to-r
from-blue-600
to-blue-700
rounded-2xl
p-6
text-white
">

<h2 className="
text-xl
md:text-3xl
font-bold
">

{greeting},
{' '}
{user.name}
👋

</h2>

<p className="
text-blue-100
mt-2
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
mt-5
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
md:grid-cols-2
xl:grid-cols-3
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
rounded-xl
p-6
">

<div className="
flex
items-center
gap-2
mb-5
">

<Megaphone
size={18}
/>

<h3 className="
font-semibold
">

Announcements

</h3>

</div>



{announcements.length===0&&(

<p className="
text-gray-400
">

No announcements

</p>

)}



{announcements.map(a=>(

<div
key={a.id}
className="
border-b
last:border-none
py-4
"
>

<p className="
font-bold
mb-1
">

{a.title}

</p>


<p className="
text-gray-600
text-sm
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
