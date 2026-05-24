'use client'

import { useState } from 'react'
import { Lock } from 'lucide-react'
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

const [name,setName]=
useState(
user.name
)

const [phone,setPhone]=
useState(
user.phone
)

const [department,setDepartment]=
useState(
user.department
)

const [newPassword,
setNewPassword]=
useState('')

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


function changePassword(){

if(
!newPassword ||
newPassword.length<8
){

toast.error(
'Password minimum 8 characters'
)

return

}

toast.success(
'Password updated'
)

setNewPassword('')

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
">

{user.role}

</p>

</div>

</div>



<div className="
space-y-4
">

<input
value={name}
onChange={(e)=>
setName(
e.target.value
)
}
placeholder="Name"
className="
w-full
border
rounded-lg
p-3
"
/>


<input
value={department}
onChange={(e)=>
setDepartment(
e.target.value
)
}
placeholder="Department"
className="
w-full
border
rounded-lg
p-3
"
/>


<input
value={phone}
onChange={(e)=>
setPhone(
e.target.value
)
}
placeholder="Phone"
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

<div className="
flex
items-center
gap-2
mb-4
">

<Lock size={18}/>

<h3 className="
font-semibold
">

Change Password

</h3>

</div>


<input
type="password"
value={newPassword}
onChange={(e)=>
setNewPassword(
e.target.value
)
}
placeholder="
Minimum 8 characters
"
className="
w-full
border
rounded-lg
p-3
"
/>


<button
onClick={
changePassword
}
className="
mt-4
w-full
sm:w-auto
bg-black
text-white
px-6
py-3
rounded-xl
"
>

Update Password

</button>

</div>

</div>

</main>

</div>

</div>

)

}
