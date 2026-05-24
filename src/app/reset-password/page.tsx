'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage(){

const [password,setPassword]=
useState('')

const [loading,setLoading]=
useState(false)

const router=
useRouter()


async function updatePassword(){

setLoading(true)

const {error}=
await supabase.auth.updateUser({

password

})

setLoading(false)

if(error){

toast.error(
error.message
)

return

}

toast.success(
'Password updated'
)

router.push('/')

}


return(

<div className="
min-h-screen
flex
items-center
justify-center
bg-slate-100
">

<div className="
bg-white
p-8
rounded-xl
shadow
w-[400px]
space-y-4
">

<h1 className="
text-2xl
font-bold
">

Reset Password

</h1>

<input
type="password"
placeholder="New password"
value={password}
onChange={(e)=>
setPassword(
e.target.value
)}
className="
w-full
border
p-3
rounded
"
/>

<button
onClick={updatePassword}
className="
w-full
bg-blue-600
text-white
p-3
rounded
"
>

{
loading
?
'Updating...'
:
'Update Password'
}

</button>

</div>

</div>

)

}
