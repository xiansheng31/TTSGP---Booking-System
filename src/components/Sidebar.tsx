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

const menuItems=[

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
href:'/my-account'
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
},

{
name:'Settings',
icon:Settings,
href:'/admin/settings'
}

]

export default function Sidebar(){

const pathname=usePathname()

const [open,setOpen]=useState(false)

return(

<>

<button
onClick={()=>setOpen(true)}
className="
lg:hidden
fixed
top-5
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
h-full
w-72
bg-[#07152d]
text-white
z-50
transform
transition-transform
duration-300

${open?'translate-x-0':'-translate-x-full'}

lg:translate-x-0
lg:static
lg:w-72
`}
>

<div className="
flex
justify-between
items-center
p-6
border-b
border-slate-800
">

<h1 className="
font-bold
text-2xl
">

TTSGP Booking

</h1>


<button
onClick={()=>setOpen(false)}
className="
lg:hidden
"
>

<X/>

</button>

</div>



<div className="p-4 space-y-2">

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

</div>

</>

)

}
