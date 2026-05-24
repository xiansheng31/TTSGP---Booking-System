'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
BarChart2,
Settings,
ScrollText,
Megaphone,
LogOut,
ChevronLeft,
ChevronRight,
Menu,
X
} from 'lucide-react'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { cn } from '@/utils/helpers'

const employeeNav=[
{href:'/home',label:'Home',icon:Home},
{href:'/bookings',label:'Book a Room',icon:Calendar},
{href:'/my-bookings',label:'My Bookings',icon:BookOpen},
{href:'/notifications',label:'Notifications',icon:Bell},
{href:'/account',label:'My Account',icon:User},
]

const adminNav=[
{href:'/admin/dashboard',label:'Dashboard',icon:LayoutDashboard},
{href:'/admin/rooms',label:'Rooms',icon:DoorOpen},
{href:'/admin/users',label:'Users',icon:Users},
{href:'/admin/booking-management',label:'Bookings',icon:ClipboardList},
{href:'/admin/reports',label:'Reports',icon:BarChart2},
{href:'/admin/settings',label:'Settings',icon:Settings},
{href:'/admin/audit',label:'Audit Logs',icon:ScrollText},
{href:'/admin/announcements',label:'Announcements',icon:Megaphone},
]

export default function Sidebar(){

const pathname=usePathname()

const {user,isAdmin}=useAuth()

const [collapsed,setCollapsed]=
useState(false)

const [mobileOpen,setMobileOpen]=
useState(false)

async function handleLogout(){

await supabase.auth.signOut()

window.location.href='/login'

}

const NavItem=({
href,
label,
icon:Icon
}:any)=>{

const active=
pathname===href||
(href!=='/home'&&pathname.startsWith(href))

return(

<Link
href={href}
onClick={()=>
setMobileOpen(false)
}
className={cn(
'flex items-center gap-3 px-3 py-3 rounded-lg text-sm',

active
?
'bg-blue-600 text-white'
:
'text-slate-400 hover:bg-[#1a2333]'
)}
>

<Icon size={18}/>

{!collapsed&&(
<span>
{label}
</span>
)}

</Link>

)

}

return(

<>

<button
onClick={()=>
setMobileOpen(
!mobileOpen
)
}
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

{
mobileOpen
?
<X size={20}/>
:
<Menu size={20}/>
}

</button>


{mobileOpen&&(

<div
onClick={()=>
setMobileOpen(false)
}
className="
lg:hidden
fixed
inset-0
bg-black/50
z-40
"
/>

)}


<aside
className={cn(

`
fixed
lg:static
z-50
top-0
left-0
h-screen
bg-[#0f1623]
border-r
border-[#1e2d3d]
transition-all
duration-300
`,

mobileOpen
?
'translate-x-0'
:
'-translate-x-full lg:translate-x-0',

collapsed
?
'w-[70px]'
:
'w-[240px]'
)}
>

<div className="
flex
justify-between
items-center
p-5
border-b
border-[#1e2d3d]
">

{!collapsed&&(

<div>

<span className="
text-white
font-bold
">

TTSGP

</span>

<span className="
text-blue-400
font-bold
">

Booking

</span>

</div>

)}

<button
onClick={()=>
setCollapsed(
!collapsed
)
}
className="
hidden
lg:block
text-white
"
>

{
collapsed
?
<ChevronRight size={16}/>
:
<ChevronLeft size={16}/>
}

</button>

</div>


<nav className="
p-3
space-y-2
overflow-y-auto
">

{employeeNav.map(item=>(

<NavItem
key={item.href}
{...item}
/>

))}

{isAdmin&&
adminNav.map(item=>(

<NavItem
key={item.href}
{...item}
/>

))
}

</nav>


<div className="
absolute
bottom-5
left-0
right-0
px-3
">

<button
onClick={handleLogout}
className="
w-full
flex
items-center
gap-3
text-slate-400
px-3
py-3
hover:bg-[#1a2333]
rounded-lg
"
>

<LogOut size={18}/>

{!collapsed&&(
<span>
Logout
</span>
)}

</button>

</div>

</aside>

</>

)

}
