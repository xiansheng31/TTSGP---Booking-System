'use client'

import { useEffect,useState } from 'react'
import { useRouter } from 'next/navigation'
import {
FileSpreadsheet
} from 'lucide-react'

import {
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer
} from 'recharts'

import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/hooks/useAuth'
import { bookingService } from '@/services/bookingService'
import { roomService } from '@/services/roomService'

import type {
Booking,
Room
} from '@/types'

export default function AdminReportsPage(){

const router=useRouter()

const {
user,
loading,
isAdmin
}=useAuth()

const [bookings,setBookings]=
useState<Booking[]>([])

const [rooms,setRooms]=
useState<Room[]>([])


useEffect(()=>{

if(
!loading &&
(!user||!isAdmin)
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

bookingService.getAll(),
roomService.getAll()

]).then(([b,r])=>{

setBookings(b)

setRooms(r)

})

},[
isAdmin
])



const monthlyData=(()=>{

const months=[]

for(
let i=5;
i>=0;
i--
){

const d=
new Date()

d.setMonth(
d.getMonth()-i
)

const label=
d.toLocaleDateString(
'en',
{
month:'short',
year:'2-digit'
}
)

const count=

bookings.filter(b=>{

const bd=
new Date(
b.booking_date
)

return(

bd.getMonth()===
d.getMonth()

&&

bd.getFullYear()===
d.getFullYear()

)

}).length

months.push({

name:label,

bookings:count

})

}

return months

})()



const roomUsage=

rooms.map(r=>({

name:r.name,

bookings:

bookings.filter(

b=>
b.room_id===r.id

).length

}))

.sort(
(a,b)=>
b.bookings-a.bookings
)

.slice(0,10)



function exportCSV(){

const headers=[

'ID',
'User',
'Room',
'Date',
'Start',
'End',
'Status',
'Title'

]

const rows=

bookings.map(b=>([

b.id,

b.user?.name??'',

b.room?.name??'',

b.booking_date,

b.start_time,

b.end_time,

b.status,

b.title

]))


const csv=

[headers,...rows]

.map(
r=>r.join(',')
)

.join('\n')


const blob=
new Blob(
[csv]
)

const url=
URL.createObjectURL(
blob
)

const a=
document.createElement(
'a'
)

a.href=url

a.download=
'bookings-report.csv'

a.click()

}



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

<Navbar title="Reports"/>


<main className="
flex-1
p-4
md:p-6
space-y-6
overflow-x-hidden
">

<div>

<button
onClick={exportCSV}
className="
flex
items-center
gap-2
bg-green-600
text-white
px-4
py-3
rounded-xl
"
>

<FileSpreadsheet
size={16}
/>

Export CSV

</button>

</div>



<div className="
bg-white
rounded-xl
border
p-5
">

<p className="
font-semibold
mb-5
">

Monthly Bookings
(Last 6 Months)

</p>

<div className="
h-[260px]
">

<ResponsiveContainer>

<BarChart
data={monthlyData}
>

<XAxis
dataKey="name"
/>

<YAxis
allowDecimals={false}
/>

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
mb-5
">

Room Usage

</p>

<div className="
h-[350px]
">

<ResponsiveContainer>

<BarChart
data={roomUsage}
layout="vertical"
>

<XAxis
type="number"
/>

<YAxis
width={120}
type="category"
dataKey="name"
/>

<Tooltip/>

<Bar
dataKey="bookings"
fill="#22c55e"
/>

</BarChart>

</ResponsiveContainer>

</div>

</div>



<div className="
grid
grid-cols-2
xl:grid-cols-4
gap-4
">

{[
{
label:'Total',
value:bookings.length
},
{
label:'Approved',
value:
bookings.filter(
b=>
b.status==='approved'
).length
},
{
label:'Cancelled',
value:
bookings.filter(
b=>
b.status==='cancelled'
).length
},
{
label:'Pending',
value:
bookings.filter(
b=>
b.status==='pending'
).length
}

].map(s=>(

<div
key={s.label}
className="
bg-white
rounded-xl
border
p-5
text-center
"
>

<p className="
text-3xl
font-bold
">

{s.value}

</p>

<p className="
text-sm
text-slate-500
mt-2
">

{s.label}

</p>

</div>

))}

</div>

</main>

</div>

</div>

)

}
