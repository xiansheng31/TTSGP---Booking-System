'use client'

import { useState,useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'

export default function AccountPage(){

const [user,setUser]=
useState<any>(null)

const [email,setEmail]=
useState('')

const [phone,setPhone]=
useState('')

const [saving,setSaving]=
useState(false)



useEffect(()=>{

loadProfile()

},[])



async function loadProfile(){

const {
data:{
user:authUser
}
}=await supabase
.auth
.getUser()

if(!authUser)return


const {data,error}=await supabase
.from('users')
.select('*')
.eq(
'id',
authUser.id
)
.single()

console.log(data)
console.log(error)

if(data){

setUser(data)

setEmail(
data.email || ''
)

setPhone(
data.phone || ''
)

}

}



async function saveProfile(){

setSaving(true)


const {
data:{
user:authUser
}
}=await supabase
.auth
.getUser()


if(!authUser){

toast.error(
'User not found'
)

setSaving(false)

return

}


const {error}=await supabase
.from('users')
.update({

email,
phone

})
.eq(
'id',
authUser.id
)


setSaving(false)


if(error){

toast.error(
error.message
)

return

}


toast.success(
'Profile updated'
)

loadProfile()

}



if(!user){

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

<div className="
p-6
">

Loading...

</div>

</div>

</div>

)

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

{
user.name
?.substring(
0,
2
)
.toUpperCase()
}

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
value={
user.name || ''
}
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
block
">

Department

</label>

<input
value={
user.department || ''
}
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
