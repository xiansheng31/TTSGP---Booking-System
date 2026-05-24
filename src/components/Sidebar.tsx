'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
Menu,
X,
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
Settings,
LogOut
} from 'lucide-react'

export default function Sidebar(){

const pathname=usePathname()

const [open,setOpen]=useState(false)

const menuItems=[

{
name:'Home',
href:'/home',
icon:Home
},

{
name:'Book a Room',
href:'/bookings',
icon:Calendar
},

{
name:'My Bookings',
href:'/my-bookings',
icon:BookOpen
},

{
name:'Notifications',
href:'/notifications',
icon:Bell
},

{
name:'My Account',
href:'/my-account',
icon:User
},

{
name:'Dashboard',
href:'/admin/dashboard',
icon:LayoutDashboard
},

{
name:'Rooms',
href:'/admin/rooms',
icon:DoorOpen
},

{
name:'Users',
href:'/admin/users',
icon:Users
},

{
name:'Bookings',
href:'/admin/booking-management',
icon:ClipboardList
},

{
name:'Reports',
href:'/admin/reports',
icon:BarChart3
},

{
name:'Settings',
href:'/admin/settings',
icon:Settings
}

]

return(

<>

<button
onClick={()=>setOpen(true)}
className="
lg:hidden
fixed
top-4
left-4
z-[60]
bg-white
shadow-md
rounded-lg
p-2
"
>

<Menu size={20}/>

</button>


{open&&(

<div
onClick={()=>setOpen(false)}
className="
fixed
inset-0
bg-black/50
z-40
lg:hidden
"
/>

)}


<aside
className={`
fixed
top-0
left-0
h-screen
w-72
bg-[#07152d]
text-white
z-50
transition-transform
duration-300

${open
?'translate-x-0'
:'-translate-x-full'
}

lg:translate-x-0
`}
>

<div className="
flex
items-center
justify-between
p-6
border-b
border-slate-800
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
px-4
py-6
space-y-2
overflow-y-auto
h-[calc(100vh-130px)]
">

{menuItems.map(item=>{

const Icon=item.icon

const active=
pathname===item.href

return(

<Link
key={item.name}
href={item.href}
onClick={()=>setOpen(false)}
className={`
flex
items-center
gap-3
px-4
py-3
rounded-xl
transition

${active
?'bg-blue-600'
:'hover:bg-slate-800'
}
`}
>

<Icon size={18}/>

{item.name}

</Link>

)

})}

</div>


<div className="
absolute
bottom-6
left-4
right-4
">

<button
className="
w-full
flex
items-center
gap-3
px-4
py-3
rounded-xl
hover:bg-slate-800
"
>

<LogOut size={18}/>

Logout

</button>

</div>

</aside>

</>

)

}
