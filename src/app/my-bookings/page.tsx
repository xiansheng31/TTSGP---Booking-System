'use client'

import { useEffect,useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'

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


const today=
new Date()
.toISOString()
.split('T')[0]


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

console.log(data)
console.log(error)

if(data){

setBookings(data)

}

setLoading(false)

}



const filtered=

bookings.filter(b=>

tab==='upcoming'

? b.booking_date>=
new Date()
.toISOString()
.split('T')[0]

: b.booking_date<
new Date()
.toISOString()
.split('T')[0]

)



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
?'bg-blue-600 text-white'
:'bg-white border'
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
?'bg-blue-600 text-white'
:'bg-white border'
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

<span className="
bg-gray-100
px-3
py-1
rounded-full
"

>

{b.status}

</span>

</p>

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
