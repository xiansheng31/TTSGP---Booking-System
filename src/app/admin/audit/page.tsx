'use client'

import { useEffect,useState } from 'react'
import { useRouter } from 'next/navigation'

import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'

import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

import type {
AuditLog
} from '@/types'

export default function AdminAuditPage(){

const router=
useRouter()

const {
user,
loading,
isAdmin
}=useAuth()

const [logs,setLogs]=
useState<AuditLog[]>([])


useEffect(()=>{

if(
!loading &&
(!user||!isAdmin)
){

router.push(
'/home'
)

}

},[
user,
loading,
isAdmin,
router
])



useEffect(()=>{

if(!isAdmin)return

loadLogs()

},[
isAdmin
])


async function loadLogs(){

const {data}=await supabase
.from(
'audit_logs'
)
.select(`
*,
user:users(
name,
email
)
`)
.order(
'created_at',
{
ascending:false
}
)
.limit(200)

setLogs(
data??[]
)

}



if(
loading||
!user||
!isAdmin
){

return null

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
title="
Audit Logs
"
/>


<main className="
flex-1
p-4
md:p-6
space-y-5
overflow-x-hidden
">

<div className="
bg-white
rounded-xl
border
overflow-x-auto
">

<table
className="
min-w-[900px]
w-full
text-sm
"
>

<thead>

<tr className="
border-b
">

<th className="
text-left
px-5
py-4
text-xs
font-semibold
text-slate-500
uppercase
">

Timestamp

</th>

<th className="
text-left
px-5
py-4
text-xs
font-semibold
text-slate-500
uppercase
">

User

</th>

<th className="
text-left
px-5
py-4
text-xs
font-semibold
text-slate-500
uppercase
">

Action

</th>

<th className="
text-left
px-5
py-4
text-xs
font-semibold
text-slate-500
uppercase
">

Details

</th>

</tr>

</thead>


<tbody>

{

logs.map(log=>(

<tr
key={log.id}
className="
border-b
hover:bg-slate-50
"
>

<td className="
px-5
py-4
text-xs
text-slate-400
whitespace-nowrap
">

{
new Date(
log.created_at
)
.toLocaleString()
}

</td>


<td className="
px-5
py-4
">

<p className="
font-medium
">

{
log.user?.name
||
'—'
}

</p>

<p className="
text-xs
text-slate-400
">

{
log.user?.email
}

</p>

</td>


<td className="
px-5
py-4
">

<span className="
bg-slate-100
text-slate-600
text-xs
px-2
py-1
rounded-lg
">

{
log.action
}

</span>

</td>


<td className="
px-5
py-4
text-xs
text-slate-500
max-w-xs
truncate
">

{
log.details
||
'—'
}

</td>

</tr>

))

}

</tbody>

</table>



{

logs.length===0&&(

<div className="
text-center
py-12
text-slate-400
">

No audit logs yet

</div>

)

}

</div>

</main>

</div>

</div>

)

}
