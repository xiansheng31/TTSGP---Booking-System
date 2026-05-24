'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage(){

const [email,setEmail]=
useState('')

const [loading,setLoading]=
useState(false)



async function sendReset(){

if(!email){

toast.error(
'Please enter email'
)

return

}


setLoading(true)


const {error}=
await supabase
.auth
.resetPasswordForEmail(

email,

{
redirectTo:
'https://ttsgp-booking-system.vercel.app/reset-password'
}

)


setLoading(false)


if(error){

toast.error(
error.message
)

return

}


toast.success(
'Password reset link sent'
)

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

Forgot Password

</h1>

<p className="
text-gray-500
text-sm
">

Enter your email to receive a reset link

</p>


<input
type="email"
value={email}
onChange={(e)=>
setEmail(
e.target.value
)}
placeholder="Email"
className="
w-full
border
rounded
p-3
"
/>


<button
onClick={sendReset}
className="
w-full
bg-blue-600
text-white
rounded
p-3
"
>

{
loading
?
'Sending...'
:
'Send Reset Link'
}

</button>

</div>

</div>

)

}
