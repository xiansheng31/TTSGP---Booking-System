'use client'

import { useEffect,useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function MyBookingsPage(){

const router=useRouter()

const [tab,setTab]=
useState<'upcoming'|'history'>(
'upcoming'
)

const [bookings,setBookings]=
useState<any[]>([])

const [loading,setLoading]=
useState(true)



useEffect(()=>{

loadBookings()

},[])



async function loadBookings(){

const {
data:{user}
}=await supabase
.auth
.getUser()

if(!user){

setLoading(false)

return

}


const {data,error}=await supabase
.from('bookings')
.select(`
*,
rooms(
name
)
`)
.eq(
'user_id',
user.id
)
.order(
'booking_date',
{
ascending:true
}
)

if(data){

setBookings(data)

}

setLoading(false)

}



async function cancelBooking(
id:string
){

const {error}=await supabase
.from('bookings')
.update({

status:'cancelled'

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
'Booking cancelled'
)

loadBookings()

}



function canCancel(
booking:any
){

const bookingTime=
new Date(
`${booking.booking_date}T${booking.start_time}`
)

const now=
new Date()

const diff=

bookingTime.getTime()

-

now.getTime()


const oneHour=

60*60*1000

return diff>oneHour

}



const now=
new Date()


const filtered=
bookings.filter((b)=>{

const bookingEnd=
new Date(
`${b.booking_date}T${b.end_time}`
)

if(tab==='upcoming'){

return(

bookingEnd>now

&&

b.status!=='cancelled'

)

}


return(

bookingEnd<=now

||

b.status==='cancelled'

)

})



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

<Navbar
title="My Bookings"
/>

<main className="
p-4
md:p-6
space-y-6
">

<div className="
flex
gap-3
">

<button
onClick={()=>
setTab(
'upcoming'
)
}
className={`

px-6
py-3
rounded-xl

${
tab==='upcoming'
?
'bg-blue-600 text-white'
:
'bg-white border'
}

`}
>

Upcoming

</button>


<button
onClick={()=>
setTab(
'history'
)
}
className={`

px-6
py-3
rounded-xl

${
tab==='history'
?
'bg-blue-600 text-white'
:
'bg-white border'
}

`}
>

History

</button>

</div>



<h2 className="
text-3xl
font-bold
">

{

tab==='upcoming'

?

'Upcoming Bookings'

:

'Booking History'

}

</h2>



<div className="
bg-white
rounded-xl
border
p-6
">

{loading&&(

<p>

Loading...

</p>

)}



{

!loading &&

filtered.length===0&&(

<div className="
text-center
py-12
space-y-4
">

<p className="
text-gray-400
">

No bookings yet

</p>


<button
onClick={()=>
router.push(
'/bookings'
)
}
className="
text-blue-600
font-medium
"
>

Book a room →

</button>

</div>

)

}



<div className="
space-y-4
">

{

filtered.map(b=>(

<div
key={b.id}
className="
border
rounded-xl
p-5
space-y-3
"
>

<h3 className="
font-bold
text-lg
">

{b.title}

</h3>


<p>

Room:
{' '}
{b.rooms?.name}

</p>


<p>

Date:
{' '}
{b.booking_date}

</p>


<p>

Time:
{' '}
{b.start_time}
-
{b.end_time}

</p>


<p>

Status:
{' '}

<span className={`

px-3
py-1
rounded-full

${
b.status==='approved'
?
'bg-green-100 text-green-700'

: b.status==='cancelled'
?
'bg-red-100 text-red-700'

:
'bg-gray-100'
}

`}>

{b.status}

</span>

</p>



{

tab==='upcoming'
&&
b.status!=='cancelled'
&&
canCancel(b)
&&(

<button
onClick={()=>
cancelBooking(
b.id
)
}
className="
bg-red-600
text-white
px-5
py-2
rounded-lg
"
>

Cancel Booking

</button>

)

}



{

tab==='upcoming'
&&
b.status!=='cancelled'
&&
!canCancel(b)
&&(

<p className="
text-sm
text-red-500
">

Cancellation locked
within 1 hour
before booking

</p>

)

}

</div>

))

}

</div>

</div>

</main>

</div>

</div>

)

}
