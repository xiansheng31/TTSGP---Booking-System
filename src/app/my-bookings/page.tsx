'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'

export default function MyBookingsPage(){

const router=useRouter()

const [tab,setTab]=
useState<
'upcoming'
|
'history'
>(
'upcoming'
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
title="My Bookings"
/>


<main className="
flex-1
p-4
md:p-6
overflow-x-hidden
">

<div className="
flex
flex-wrap
gap-3
mb-6
">

<button
onClick={()=>
setTab(
'upcoming'
)
}
className={`
px-5
py-3
rounded-lg
border
transition

${
tab==='upcoming'
?
'bg-blue-600 text-white border-blue-600'
:
'bg-white'
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
px-5
py-3
rounded-lg
border
transition

${
tab==='history'
?
'bg-blue-600 text-white border-blue-600'
:
'bg-white'
}
`}
>

History

</button>

</div>



<h2 className="
text-xl
md:text-2xl
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
mt-6
bg-white
rounded-xl
border
p-8
shadow-sm
">

<div className="
text-center
py-10
">

<p className="
text-gray-500
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
mt-6
text-blue-600
font-medium
hover:underline
"
>

Book a room →

</button>

</div>

</div>

</main>

</div>

</div>

)

}
