'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
Plus,
Pencil,
Trash2,
WrenchIcon
} from 'lucide-react'

import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/hooks/useAuth'
import { roomService } from '@/services/roomService'
import { cn } from '@/utils/helpers'
import type {
Room,
RoomType,
RoomStatus
} from '@/types'

import toast from 'react-hot-toast'

const emptyRoom=():
Omit<Room,'id'|'created_at'>=>({

name:'',
type:'discussion',
capacity:10,
facilities:[],
photo_url:null,
status:'available',
rules:'',
location:'',
floor:1

})


export default function AdminRoomsPage(){

const router=useRouter()

const {
user,
loading,
isAdmin
}=useAuth()

const [rooms,setRooms]=
useState<Room[]>([])

const [showModal,setShowModal]=
useState(false)

const [editing,setEditing]=
useState<Room|null>(null)

const [form,setForm]=
useState(emptyRoom())

const [
facilitiesInput,
setFacilitiesInput
]=useState('')


useEffect(()=>{

if(
!loading &&
(!user||!isAdmin)
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

roomService
.getAll()
.then(
setRooms
)

}

},[isAdmin])



const openAdd=()=>{

setEditing(null)

setForm(
emptyRoom()
)

setFacilitiesInput('')

setShowModal(true)

}



const openEdit=(
room:Room
)=>{

setEditing(room)

setForm({

name:room.name,
type:room.type,
capacity:room.capacity,
facilities:room.facilities,
photo_url:room.photo_url,
status:room.status,
rules:room.rules,
location:room.location,
floor:room.floor

})

setFacilitiesInput(
room.facilities.join(', ')
)

setShowModal(true)

}



const handleSave=
async()=>{

const facilities=

facilitiesInput
.split(',')
.map(
s=>s.trim()
)
.filter(Boolean)

const data={
...form,
facilities
}

try{

if(editing){

const updated=
await roomService
.update(
editing.id,
data
)

setRooms(prev=>

prev.map(r=>

r.id===
editing.id

?

updated

:

r

)

)

toast.success(
'Room updated'
)

}else{

const created=
await roomService
.create(
data
)

setRooms(prev=>
[
...prev,
created
]
)

toast.success(
'Room added'
)

}

setShowModal(false)

}
catch{

toast.error(
'Failed to save'
)

}

}



const handleDelete=
async(
id:string
)=>{

if(
!confirm(
'Delete room?'
)
)return


try{

await roomService
.delete(id)

setRooms(prev=>

prev.filter(
r=>
r.id!==id
)

)

toast.success(
'Deleted'
)

}
catch{

toast.error(
'Failed'
)

}

}



const toggleMaintenance=
async(
room:Room
)=>{

const updated=
await roomService
.setMaintenance(
room.id,
room.status!==
'maintenance'
)

setRooms(prev=>

prev.map(r=>

r.id===
room.id

?

updated

:

r

)

)

}



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
title="Room Management"
/>

<main className="
flex-1
p-4
md:p-6
space-y-5
overflow-x-hidden
">


<div className="
flex
justify-end
">

<button
onClick={openAdd}
className="
flex
items-center
gap-2
bg-blue-600
text-white
px-4
py-3
rounded-xl
"
>

<Plus size={16}/>

Add Room

</button>

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
'Room',
'Type',
'Capacity',
'Floor',
'Status',
'Facilities',
'Actions'
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

rooms.map(room=>(

<tr
key={room.id}
className="
border-b
"
>

<td className="px-5 py-4">
{room.name}
</td>

<td className="px-5 py-4">
{room.type}
</td>

<td className="px-5 py-4">
{room.capacity}
</td>

<td className="px-5 py-4">
{room.floor}
</td>

<td className="px-5 py-4">

<span className={cn(
'px-2 py-1 rounded-full text-xs',

room.status==='available'

?

'bg-green-100 text-green-700'

:

room.status==='maintenance'

?

'bg-yellow-100 text-yellow-700'

:

'bg-gray-100'

)}>

{room.status}

</span>

</td>

<td className="px-5 py-4">

{
room.facilities.join(', ')
||

'—'
}

</td>


<td className="
px-5
py-4
">

<div className="
flex
gap-2
">

<button
onClick={()=>
openEdit(
room
)
}
>
<Pencil size={16}/>
</button>

<button
onClick={()=>
toggleMaintenance(
room
)
}
>
<WrenchIcon size={16}/>
</button>

<button
onClick={()=>
handleDelete(
room.id
)
}
>
<Trash2 size={16}/>
</button>

</div>

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
