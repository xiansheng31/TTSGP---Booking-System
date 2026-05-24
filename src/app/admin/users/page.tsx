'use client'

import { useEffect,useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/hooks/useAuth'
import { userService } from '@/services/userService'
import type {
User,
Role
} from '@/types'
import toast from 'react-hot-toast'

const roles:Role[]=[
'employee',
'admin',
'super_admin'
]

export default function AdminUsersPage(){

const router=useRouter()

const {
user,
loading,
isAdmin
}=useAuth()

const [users,setUsers]=
useState<User[]>([])

const [search,setSearch]=
useState('')


useEffect(()=>{

if(
!loading &&
(!user || !isAdmin)
){

router.push('/home')

}

},[
user,
loading,
isAdmin,
router
])


useEffect(()=>{

if(isAdmin){

userService
.getAll()
.then(
setUsers
)

}

},[
isAdmin
])


const handleRoleChange=
async(
id:string,
role:Role
)=>{

try{

await userService
.updateRole(
id,
role
)

setUsers(
prev=>

prev.map(u=>

u.id===id

?

{
...u,
role
}

:

u

)

)

toast.success(
'Role updated'
)

}
catch{

toast.error(
'Failed to update'
)

}

}



const filtered=

users.filter(u=>

u.name
.toLowerCase()
.includes(
search.toLowerCase()
)

||

u.email
.toLowerCase()
.includes(
search.toLowerCase()
)

||

u.department
.toLowerCase()
.includes(
search.toLowerCase()
)

)



if(
loading||
!user||
!isAdmin
)return null



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
title="User Management"
/>


<main className="
flex-1
p-4
md:p-6
space-y-5
overflow-x-hidden
">

<div className="
relative
w-full
md:max-w-sm
">

<Search
size={16}
className="
absolute
left-3
top-3.5
text-slate-400
"
/>

<input
value={search}
onChange={(e)=>
setSearch(
e.target.value
)
}
placeholder="
Search users...
"
className="
w-full
pl-9
pr-4
py-3
border
rounded-xl
bg-white
"
/>

</div>



<div className="
bg-white
rounded-xl
border
overflow-x-auto
">

<table className="
w-full
min-w-[1000px]
">

<thead>

<tr className="
border-b
">

{
[
'Employee',
'Employee ID',
'Department',
'Phone',
'Role',
'Joined'
]
.map(h=>(

<th
key={h}
className="
text-left
px-5
py-4
"
>

{h}

</th>

))
}

</tr>

</thead>


<tbody>

{

filtered.map(u=>(

<tr
key={u.id}
className="
border-b
hover:bg-slate-50
"
>

<td className="
px-5
py-4
">

<div>

<p className="
font-medium
">

{u.name}

</p>

<p className="
text-xs
text-slate-400
">

{u.email}

</p>

</div>

</td>



<td className="
px-5
py-4
">

{u.employee_id}

</td>


<td className="
px-5
py-4
">

{u.department}

</td>


<td className="
px-5
py-4
">

{
u.phone
||
'—'
}

</td>



<td className="
px-5
py-4
">

<select
value={u.role}
onChange={(e)=>

handleRoleChange(
u.id,
e.target.value as Role
)

}
className="
border
rounded-lg
px-3
py-2
capitalize
"
>

{

roles.map(r=>(

<option
key={r}
value={r}
>

{
r.replace(
'_',
' '
)
}

</option>

))

}

</select>

</td>



<td className="
px-5
py-4
text-sm
text-slate-400
">

{
new Date(
u.created_at
)
.toLocaleDateString()
}

</td>

</tr>

))

}

</tbody>

</table>

</div>

</main>

</div>

</div>

)

}
