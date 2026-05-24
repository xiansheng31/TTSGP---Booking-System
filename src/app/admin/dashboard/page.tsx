'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
Calendar,
DoorOpen,
Users,
Clock
} from 'lucide-react'

import {
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
PieChart,
Pie,
Cell,
Legend
} from 'recharts'

import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import DashboardCard from '@/components/DashboardCard'
import { useAuth } from '@/hooks/useAuth'
import { bookingService } from '@/services/bookingService'
import { roomService } from '@/services/roomService'
import { userService } from '@/services/userService'
import type { Booking } from '@/types'

const COLORS=[
'#2563eb',
'#22c55e',
'#f59e0b',
'#ef4444',
'#8b5cf6'
]

export default function AdminDashboardPage(){

const router=useRouter()

const {
user,
loading,
isAdmin
}=useAuth()

const [stats,setStats]=
useState({

todayBookings:0,
totalRooms:0,
totalUsers:0,
pendingApprovals:0

})

const [recentBookings,setRecentBookings]=
useState<Booking[]>([])

const [chartData,setChartData]=
useState<any[]>([])

const [roomTypeData,setRoomTypeData]=
useState<any[]>([])



useEffect(()=>{

if(
!loading &&
(!user || !isAdmin)
){

router.push('/home')

}

},[
user,
loading,
isAdmin,
router
])


useEffect(()=>{

if(!isAdmin)return

Promise.all([

bookingService.getToday(),
bookingService.getAll(),
roomService.getAll(),
userService.getAll()

]).then(([today,all,rooms,users])=>{

const pending=

all.filter(
b=>
b.status==='pending'
).length


setStats({

todayBookings:
today.length,

totalRooms:
rooms.length,

totalUsers:
users.length,

pendingApprovals:
pending

})


setRecentBookings(
all.slice(0,5)
)


const days=[]

for(
let i=6;
i>=0;
i--
){

const d=
new Date()

d.setDate(
d.getDate()-i
)

const dateStr=
d.toISOString()
.split('T')[0]

const label=
d.toLocaleDateString(
'en',
{
weekday:'short'
}
)

days.push({

name:label,

bookings:
all.filter(
b=>
b.booking_date===
dateStr
).length

})

}

setChartData(days)


const discussion=
rooms.filter(
r=>
r.type==='discussion'
).length


const training=
rooms.filter(
r=>
r.type==='training'
).length


setRoomTypeData([

{
name:'Discussion',
value:discussion
},

{
name:'Training',
value:training
}

])

})

},[isAdmin])


if(
loading||
!user||
!isAdmin
)return null



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
title="Admin Dashboard"
/>

<main className="
flex-1
p-4
md:p-6
space-y-6
overflow-x-hidden
">

<div className="
grid
grid-cols-1
sm:grid-cols-2
xl:grid-cols-4
gap-4
">

<DashboardCard
title="Bookings Today"
value={stats.todayBookings}
icon={Calendar}
/>

<DashboardCard
title="Pending"
value={stats.pendingApprovals}
icon={Clock}
/>

<DashboardCard
title="Rooms"
value={stats.totalRooms}
icon={DoorOpen}
/>

<DashboardCard
title="Users"
value={stats.totalUsers}
icon={Users}
/>

</div>



<div className="
grid
grid-cols-1
xl:grid-cols-3
gap-6
">

<div className="
xl:col-span-2
bg-white
rounded-xl
border
p-5
">

<p className="
font-semibold
mb-4
">

Bookings Last 7 Days

</p>

<div className="h-[250px]">

<ResponsiveContainer>

<BarChart
data={chartData}
>

<XAxis
dataKey="name"
/>

<YAxis/>

<Tooltip/>

<Bar
dataKey="bookings"
fill="#2563eb"
/>

</BarChart>

</ResponsiveContainer>

</div>

</div>



<div className="
bg-white
rounded-xl
border
p-5
">

<p className="
font-semibold
mb-4
">

Room Types

</p>

<div className="
h-[250px]
">

<ResponsiveContainer>

<PieChart>

<Pie
data={roomTypeData}
dataKey="value"
innerRadius={50}
outerRadius={80}
>

{
roomTypeData.map(
(_,i)=>(
<Cell
key={i}
fill={
COLORS[
i%
COLORS.length
]
}
/>
)
)
}

</Pie>

<Legend/>

<Tooltip/>

</PieChart>

</ResponsiveContainer>

</div>

</div>

</div>



<div className="
bg-white
rounded-xl
border
overflow-x-auto
">

<div className="
px-5
py-4
border-b
flex
justify-between
items-center
">

<p className="
font-semibold
">

Recent Bookings

</p>

<button
onClick={()=>
router.push(
'/admin/booking-management'
)
}
className="
text-blue-600
text-sm
"
>

View all

</button>

</div>


<table className="
min-w-[800px]
w-full
">

<thead>

<tr className="
border-b
">

{
[
'User',
'Room',
'Date',
'Time',
'Status'
]
.map(h=>(

<th
key={h}
className="
text-left
px-5
py-3
"
>

{h}

</th>

))
}

</tr>

</thead>


<tbody>

{

recentBookings.map(b=>(

<tr
key={b.id}
className="
border-b
"
>

<td className="px-5 py-4">
{b.user?.name ?? '—'}
</td>

<td className="px-5 py-4">
{b.room?.name ?? '—'}
</td>

<td className="px-5 py-4">
{b.booking_date}
</td>

<td className="px-5 py-4">
{b.start_time}
-
{b.end_time}
</td>

<td className="px-5 py-4">

<span className="
px-2
py-1
rounded-full
bg-slate-100
text-xs
capitalize
">

{b.status}

</span>

</td>

</tr>

))

}

</tbody>

</table>

</div>

</main>

</div>

</div>

)

}
