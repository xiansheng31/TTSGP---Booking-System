'use client'

import { useEffect,useState } from 'react'
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
mb-8
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
text-xl
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
capitalize
mt-1
">

{user.role}

</p>

</div>

</div>



<div className="
space-y-5
">

<div>

<label className="
text-sm
font-medium
mb-2
block
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
rounded-xl
p-3
bg-slate-50
text-slate-500
cursor-not-allowed
"
/>

</div>



<div>

<label className="
text-sm
font-medium
mb-2
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
rounded-xl
p-3
bg-slate-50
text-slate-500
cursor-not-allowed
"
/>

</div>



<div>

<label className="
text-sm
font-medium
mb-2
block
">

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
rounded-xl
p-3
bg-slate-50
text-slate-500
cursor-not-allowed
"
/>

</div>



<div>

<label className="
text-sm
font-medium
mb-2
block
">

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
rounded-xl
p-3
bg-slate-50
text-slate-500
cursor-not-allowed
"
/>

</div>



<div className="
bg-blue-50
border
border-blue-100
rounded-xl
p-4
mt-6
">

<p className="
text-sm
text-blue-700
">

Profile information is managed by IT.

Please contact IT if updates are required.

</p>

</div>

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

Password updates are managed by IT.

Please contact IT if changes are required.

</div>

</div>


</div>

</main>

</div>

</div>

)

}
