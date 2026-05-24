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
LogOut,
ChevronLeft,
ChevronRight,
Menu,
X
} from 'lucide-react'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Sidebar(){

const pathname=usePathname()

const [collapsed,setCollapsed]=
useState(false)

const [mobileOpen,setMobileOpen]=
useState(false)

async function logout(){

await supabase.auth.signOut()

window.location.href='/login'

}

const navItems=[

{
href:'/home',
label:'Home',
icon:Home
},

{
href:'/bookings',
label:'Book a Room',
icon:Calendar
},

{
href:'/my-bookings',
label:'My Bookings',
icon:BookOpen
},

{
href:'/notifications',
label:'Notifications',
icon:Bell
},

{
href:'/account',
label:'My Account',
icon:User
},

{
href:'/admin/dashboard',
label:'Dashboard',
icon:LayoutDashboard
},

{
href:'/admin/rooms',
label:'Rooms',
icon:DoorOpen
},

{
href:'/admin/users',
label:'Users',
icon:Users
},

{
href:'/admin/booking-management',
label:'Bookings',
icon:ClipboardList
},

{
href:'/admin/reports',
label:'Reports',
icon:BarChart2
},

{
href:'/admin/settings',
label:'Settings',
icon:Settings
}

]

return(

<>

<button
onClick={()=>
setMobileOpen(
!mobileOpen
)
}
className="
fixed
top-4
left-4
z-50
lg:hidden
bg-white
rounded-lg
shadow
p-2
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
z-50
h-screen
bg-[#0f172a]
text-white
transition-all
duration-300

${

mobileOpen
?
'translate-x-0'
:
'-translate-x-full lg:translate-x-0'

}

${

collapsed
?
'w-[80px]'
:
'w-[260px]'

}

`}
>

<div
className="
h-16
border-b
px-5
flex
items-center
justify-between
"
>

{

!collapsed&&(

<div>

<span
className="
font-bold
text-white
"
>

TTSGP

</span>

<span
className="
text-blue-400
font-bold
ml-1
"
>

Booking

</span>

</div>

)

}


<button
onClick={()=>
setCollapsed(
!collapsed
)
}
className="
hidden
lg:block
"
>

{

collapsed
?

<ChevronRight size={18}/>

:

<ChevronLeft size={18}/>

}

</button>

</div>



<div
className="
p-3
space-y-2
overflow-y-auto
h-[calc(100vh-120px)]
"
>

{

navItems.map(item=>{

const Icon=item.icon

const active=

pathname===item.href

return(

<Link
key={item.href}
href={item.href}
onClick={()=>
setMobileOpen(
false
)
}
className={`

flex
items-center
gap-3
px-3
py-3
rounded-lg
text-sm

${

active

?

'bg-blue-600'

:

'hover:bg-slate-800'

}

`}
>

<Icon size={18}/>

{

!collapsed&&(

<span>

{item.label}

</span>

)

}

</Link>

)

})

}

</div>



<div
className="
absolute
bottom-4
left-0
right-0
px-3
"
>

<button
onClick={logout}
className="
w-full
flex
items-center
gap-3
px-3
py-3
rounded-lg
hover:bg-slate-800
"
>

<LogOut size={18}/>

{

!collapsed&&(

<span>

Logout

</span>

)

}

</button>

</div>

</aside>

</>

)

}
