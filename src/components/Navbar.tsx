'use client'

import { Bell } from 'lucide-react'

interface NavbarProps{
title:string
}

export default function Navbar({
title
}:NavbarProps){

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
"
>

<div className="relative">

<Bell
size={22}
className="
text-slate-600
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

</div>


<div
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

</div>

</div>

</header>

)

}
