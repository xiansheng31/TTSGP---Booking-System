'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import toast from 'react-hot-toast'

export default function AccountPage(){

const user={

id:'1',
name:'Xian Sheng',
email:'xiansheng@gmail.com',
employee_id:'TTSGP001',
role:'admin',
department:'IT',
phone:'0123456789'

}

const [email,setEmail]=
useState(
user.email
)

const [phone,setPhone]=
useState(
user.phone
)

const [saving,setSaving]=
useState(false)


async function saveProfile(){

setSaving(true)

setTimeout(()=>{

toast.success(
'Profile updated'
)

setSaving(false)

},1000)

}


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
title="My Account"
/>


<main className="
flex-1
p-4
md:p-6
overflow-x-hidden
">

<div className="
max-w-3xl
space-y-6
">


<div className="
bg-white
rounded-2xl
border
p-6
shadow-sm
">

<div className="
flex
flex-col
sm:flex-row
items-center
sm:items-start
gap-4
mb-6
">

<div className="
w-20
h-20
rounded-full
bg-blue-600
flex
items-center
justify-center
text-white
text-3xl
font-bold
shrink-0
">

XS

</div>


<div className="
text-center
sm:text-left
">

<p className="
font-semibold
text-lg
">

{user.name}

</p>

<p className="
text-sm
text-slate-500
break-all
">

{user.email}

</p>

<p className="
text-xs
text-slate-400
mt-1
capitalize
">

{user.role}

</p>

</div>

</div>



<div className="
space-y-4
">

<label className="
text-sm
font-medium
">

Full Name

</label>

<input
value={user.name}
disabled
className="
w-full
border
rounded-lg
p-3
bg-gray-100
text-gray-500
cursor-not-allowed
"
/>

<p className="
text-xs
text-gray-400
">

Managed by administrator

</p>



<label className="
text-sm
font-medium
mt-4
block
">

Department

</label>

<input
value={user.department}
disabled
className="
w-full
border
rounded-lg
p-3
bg-gray-100
text-gray-500
cursor-not-allowed
"
/>

<p className="
text-xs
text-gray-400
">

Managed by administrator

</p>



<label className="
text-sm
font-medium
mt-4
block
">

Email

</label>

<input
value={email}
onChange={(e)=>

setEmail(
e.target.value
)

}
className="
w-full
border
rounded-lg
p-3
"
/>



<label className="
text-sm
font-medium
mt-4
block
">

Phone

</label>

<input
value={phone}
onChange={(e)=>

setPhone(
e.target.value
)

}
className="
w-full
border
rounded-lg
p-3
"
/>



<button
onClick={
saveProfile
}
className="
w-full
sm:w-auto
bg-blue-600
text-white
px-6
py-3
rounded-xl
hover:bg-blue-700
mt-5
"
>

{
saving
?
'Saving...'
:
'Save Profile'
}

</button>

</div>

</div>



<div className="
bg-white
rounded-2xl
border
p-6
shadow-sm
">

<h3 className="
font-semibold
mb-3
">

Account Security

</h3>

<div className="
bg-yellow-50
border
border-yellow-200
rounded-xl
p-4
text-sm
text-yellow-700
">

Password updates are managed by administrators.

Please contact IT if changes are required.

</div>

</div>

</div>

</main>

</div>

</div>

)

}
