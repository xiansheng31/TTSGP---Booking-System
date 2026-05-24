'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import {
Home,
Calendar,
BookOpen,
Bell,
User,
LayoutDashboard,
DoorOpen,
Users,
ClipboardList,
BarChart3,
LogOut,
Menu,
X
} from 'lucide-react'

export default function Sidebar(){

const pathname=usePathname()

const [open,setOpen]=useState(false)

const menu=[

{
name:'Home',
icon:Home,
href:'/home'
},

{
name:'Book a Room',
icon:Calendar,
href:'/bookings'
},

{
name:'My Bookings',
icon:BookOpen,
href:'/my-bookings'
},

{
name:'Notifications',
icon:Bell,
href:'/notifications'
},

{
name:'My Account',
icon:User,
href:'/account'
},

{
name:'Dashboard',
icon:LayoutDashboard,
href:'/admin/dashboard'
},

{
name:'Rooms',
icon:DoorOpen,
href:'/admin/rooms'
},

{
name:'Users',
icon:Users,
href:'/admin/users'
},

{
name:'Bookings',
icon:ClipboardList,
href:'/admin/booking-management'
},

{
name:'Reports',
icon:BarChart3,
href:'/admin/reports'
}

]

return(

<>

{/* mobile button */}

<button
onClick={()=>setOpen(true)}
className="
lg:hidden
fixed
top-4
left-4
z-50
bg-white
p-2
rounded-lg
shadow
"
>

<Menu size={22}/>

</button>



{open&&(

<div
onClick={()=>setOpen(false)}
className="
fixed
inset-0
bg-black/40
z-40
lg:hidden
"
/>

)}



<div
className={`
fixed
top-0
left-0
h-screen
w-72
bg-[#02122c]
text-white
z-50
transform
transition-transform
duration-300
flex
flex-col

${open
?'translate-x-0'
:'-translate-x-full lg:translate-x-0'
}
`}
>

<div className="
h-24
px-8
flex
items-center
justify-between
border-b
border-white/10
">

<h1 className="
font-bold
text-3xl
">

TTSGP
<span className="text-blue-400">
Booking
</span>

</h1>


<button
onClick={()=>setOpen(false)}
className="lg:hidden"
>

<X/>

</button>

</div>



<div className="
flex-1
overflow-y-auto
py-6
px-4
space-y-2
">

{menu.map(item=>{

const Icon=item.icon

const active=
pathname===item.href

return(

<Link
key={item.href}
href={item.href}
onClick={()=>setOpen(false)}
className={`
flex
items-center
gap-4
px-5
py-4
rounded-2xl
transition

${active
?'bg-blue-600'
:'hover:bg-white/10'
}
`}
>

<Icon size={22}/>

<span>

{item.name}

</span>

</Link>

)

})}

</div>



<div className="
border-t
border-white/10
p-5
">

<button
className="
w-full
flex
items-center
gap-3
hover:text-red-300
"
>

<LogOut/>

Logout

</button>

</div>

</div>

</>

)

}
