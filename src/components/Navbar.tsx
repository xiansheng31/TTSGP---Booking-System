'use client'

import { useState,useEffect,useRef } from 'react'
import Link from 'next/link'

import {
Bell,
User,
Settings,
LogOut
} from 'lucide-react'

interface NavbarProps{
title:string
}

export default function Navbar({
title
}:NavbarProps){

const [open,setOpen]=
useState(false)

const menuRef=
useRef<HTMLDivElement>(null)


useEffect(()=>{

function handleClick(
e:MouseEvent
){

if(
menuRef.current &&
!menuRef.current.contains(
e.target as Node
)
){

setOpen(false)

}

}

document.addEventListener(
'mousedown',
handleClick
)

return()=>{

document.removeEventListener(
'mousedown',
handleClick
)

}

},[])


return(

<header
className="
sticky
top-0
z-30
bg-white
border-b
h-20
px-4
md:px-6
flex
items-center
justify-between
shadow-sm
"
>

<div
className="
flex
items-center
min-w-0
"
>

<h1
className="
font-semibold
text-xl
md:text-2xl
truncate
ml-14
lg:ml-0
"
>

{title}

</h1>

</div>


<div
className="
flex
items-center
gap-4
shrink-0
relative
"
ref={menuRef}
>


<Link
href="/notifications"
className="
relative
cursor-pointer
"
>

<Bell
size={22}
className="
text-slate-600
hover:text-blue-600
"
/>

<div
className="
absolute
top-0
right-0
w-2
h-2
bg-red-500
rounded-full
"
/>

</Link>



<button
onClick={()=>
setOpen(
!open
)
}
className="
w-10
h-10
rounded-full
bg-blue-600
text-white
flex
items-center
justify-center
font-semibold
shadow
"
>

X

</button>



{open&&(

<div
className="
absolute
top-14
right-0
w-64
bg-white
border
rounded-xl
shadow-xl
overflow-hidden
"
>

<div
className="
p-4
border-b
"
>

<p className="font-semibold">

Xian Sheng

</p>

<p
className="
text-sm
text-gray-500
"
>

Administrator

</p>

</div>



<Link
href="/account"
className="
flex
items-center
gap-3
px-4
py-3
hover:bg-slate-50
"
>

<User size={18}/>

My Profile

</Link>



<Link
href="/admin/settings"
className="
flex
items-center
gap-3
px-4
py-3
hover:bg-slate-50
"
>

<Settings size={18}/>

Settings

</Link>



<button
className="
w-full
flex
items-center
gap-3
px-4
py-3
hover:bg-red-50
text-red-600
"
>

<LogOut size={18}/>

Logout

</button>

</div>

)}

</div>

</header>

)

}
