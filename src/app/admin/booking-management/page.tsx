'use client'

import { useEffect,useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import {
Search,
Check,
X
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function BookingManagementPage(){

const [bookings,setBookings]=
useState<any[]>([])

const [search,setSearch]=
useState('')

const [statusFilter,setStatusFilter]=
useState('')


useEffect(()=>{

loadBookings()

},[])



async function loadBookings(){

const {data,error}=await supabase
.from('bookings')
.select(`
id,
title,
booking_date,
start_time,
end_time,
status,
user_id,
room_id
`)
.order(
'created_at',
{
ascending:false
}
)

if(error){

toast.error(
error.message
)

return

}

if(!data){

setBookings([])

return

}


const {data:rooms}=await supabase
.from('rooms')
.select('id,name')


const {data:users}=await supabase
.from('users')
.select('id,name')


const merged=data.map(

booking=>({

...booking,

rooms:
rooms?.find(
r=>
r.id===booking.room_id
),

users:
users?.find(
u=>
u.id===booking.user_id
)

})

)

setBookings(
merged
)

}



async function updateStatus(
id:string,
status:string
){

const {error}=await supabase
.from('bookings')
.update({
status
})
.eq(
'id',
id
)

if(error){

toast.error(
error.message
)

return

}

toast.success(
'Updated successfully'
)

loadBookings()

}



const filtered=

bookings.filter(

b=>{

const matchSearch=

((b.users?.name||'')
.toLowerCase()
.includes(
search.toLowerCase()
))

||

((b.rooms?.name||'')
.toLowerCase()
.includes(
search.toLowerCase()
))

||

((b.title||'')
.toLowerCase()
.includes(
search.toLowerCase()
))


const matchStatus=

!statusFilter

||

b.status===
statusFilter


return(
matchSearch
&&
matchStatus
)

}

)



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
title="
Booking Management
"
/>


<main className="
flex-1
p-4
md:p-6
space-y-5
overflow-x-hidden
">

<div className="
flex
flex-col
md:flex-row
gap-3
">

<div className="
relative
flex-1
">

<Search
size={16}
className="
absolute
left-3
top-3.5
text-slate-400
"
/>

<input
value={search}
onChange={(e)=>
setSearch(
e.target.value
)
}
placeholder="
Search bookings...
"
className="
w-full
pl-10
pr-4
py-3
border
rounded-xl
bg-white
"
/>

</div>



<select
value={statusFilter}
onChange={(e)=>
setStatusFilter(
e.target.value
)
}
className="
border
rounded-xl
px-4
py-3
bg-white
"
>

<option value="">
All Statuses
</option>

<option value="pending">
Pending
</option>

<option value="approved">
Approved
</option>

<option value="cancelled">
Cancelled
</option>

<option value="completed">
Completed
</option>

</select>

</div>



<div className="
bg-white
rounded-xl
border
overflow-x-auto
">

<table className="
min-w-[900px]
w-full
">

<thead>

<tr className="
border-b
">

<th className="p-4 text-left">
USER
</th>

<th className="p-4 text-left">
ROOM
</th>

<th className="p-4 text-left">
TITLE
</th>

<th className="p-4 text-left">
DATE
</th>

<th className="p-4 text-left">
TIME
</th>

<th className="p-4 text-left">
STATUS
</th>

<th className="p-4 text-left">
ACTION
</th>

</tr>

</thead>


<tbody>

{

filtered.map((b)=>(

<tr
key={b.id}
className="
border-b
"
>

<td className="p-4">
{b.users?.name||'-'}
</td>

<td className="p-4">
{b.rooms?.name||'-'}
</td>

<td className="p-4">
{b.title||'-'}
</td>

<td className="p-4">
{b.booking_date}
</td>

<td className="p-4">
{b.start_time}
-
{b.end_time}
</td>

<td className="p-4">

<span className="
bg-gray-100
px-3
py-1
rounded-full
capitalize
">

{b.status}

</span>

</td>

<td className="
p-4
">

<div className="
flex
gap-2
">

{b.status==='pending'&&(

<button
onClick={()=>
updateStatus(
b.id,
'approved'
)
}
className="
bg-green-600
text-white
p-2
rounded
"
>

<Check size={14}/>

</button>

)}


<button
onClick={()=>
updateStatus(
b.id,
'cancelled'
)
}
className="
bg-red-600
text-white
p-2
rounded
"
>

<X size={14}/>

</button>

</div>

</td>

</tr>

))

}

</tbody>

</table>


{

filtered.length===0&&(

<div className="
p-10
text-center
text-gray-400
">

No bookings found

</div>

)

}

</div>

</main>

</div>

</div>

)

}
