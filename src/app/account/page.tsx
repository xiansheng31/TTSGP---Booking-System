'use client'

import { useState,useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'

export default function AccountPage(){

const [user,setUser]=
useState<any>(null)



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

}

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


<div>

<p className="
font-semibold
text-lg
">

{user.name}

</p>

<p className="
text-sm
text-slate-500
">

{user.email}

</p>

<p className="
text-xs
text-slate-400
capitalize
">

{user.role}

</p>

</div>

</div>



<div className="
space-y-4
">

<label>

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

Please contact administrator for changes

</p>



<label>

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

Please contact administrator for changes

</p>



<label>

Email

</label>

<input
value={
user.email || ''
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

Please contact administrator for changes

</p>



<label>

Phone Number

</label>

<input
value={
user.phone || ''
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

Please contact administrator for changes

</p>

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
rounded-lg
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
