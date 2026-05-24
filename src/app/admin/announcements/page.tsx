'use client'

import { useEffect,useState } from 'react'
import { useRouter } from 'next/navigation'
import {
Plus,
Pencil,
Trash2
} from 'lucide-react'

import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import type { Announcement } from '@/types'
import toast from 'react-hot-toast'

export default function AdminAnnouncementsPage(){

const router=useRouter()

const {
user,
loading,
isAdmin
}=useAuth()

const [items,setItems]=
useState<Announcement[]>([])

const [showModal,setShowModal]=
useState(false)

const [editing,setEditing]=
useState<Announcement|null>(null)

const [title,setTitle]=
useState('')

const [content,setContent]=
useState('')

const [publishDate,setPublishDate]=
useState(
new Date()
.toISOString()
.split('T')[0]
)


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

loadData()

}

},[
isAdmin
])


async function loadData(){

const {data}=await supabase
.from(
'announcements'
)
.select('*')
.order(
'publish_date',
{
ascending:false
}
)

setItems(
data??[]
)

}



function openAdd(){

setEditing(null)

setTitle('')

setContent('')

setPublishDate(
new Date()
.toISOString()
.split('T')[0]
)

setShowModal(true)

}



function openEdit(
a:Announcement
){

setEditing(a)

setTitle(
a.title
)

setContent(
a.content
)

setPublishDate(
a.publish_date
.split('T')[0]
)

setShowModal(true)

}



async function save(){

const data={

title,
content,

publish_date:
publishDate

}

try{

if(editing){

const {
data:updated
}=await supabase
.from(
'announcements'
)
.update(
data
)
.eq(
'id',
editing.id
)
.select()
.single()

setItems(
prev=>

prev.map(a=>

a.id===
editing.id

?

updated!

:

a

)

)

toast.success(
'Updated'
)

}else{

const {
data:created
}=await supabase
.from(
'announcements'
)
.insert(
data
)
.select()
.single()

setItems(
prev=>[
created!,
...prev
]
)

toast.success(
'Created'
)

}

setShowModal(false)

}
catch{

toast.error(
'Failed'
)

}

}



async function remove(
id:string
){

if(
!confirm(
'Delete announcement?'
)
)return


await supabase
.from(
'announcements'
)
.delete()
.eq(
'id',
id
)

setItems(
prev=>

prev.filter(
a=>
a.id!==id
)

)

toast.success(
'Deleted'
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
title="Announcements"
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

New Announcement

</button>

</div>



<div className="
space-y-4
">

{

items.map(a=>(

<div
key={a.id}
className="
bg-white
rounded-xl
border
p-5
shadow-sm
"
>

<div className="
flex
justify-between
gap-4
items-start
flex-wrap
">

<div className="
flex-1
min-w-[200px]
">

<p className="
font-semibold
">

{a.title}

</p>

<p className="
text-sm
text-slate-500
mt-2
break-words
">

{a.content}

</p>

<p className="
text-xs
text-slate-400
mt-3
">

Publish:

{
new Date(
a.publish_date
)
.toLocaleDateString()
}

</p>

</div>



<div className="
flex
gap-2
">

<button
onClick={()=>
openEdit(a)
}
className="
p-2
rounded
hover:bg-slate-100
"
>

<Pencil size={15}/>

</button>

<button
onClick={()=>
remove(a.id)
}
className="
p-2
rounded
hover:bg-slate-100
text-red-500
"
>

<Trash2 size={15}/>

</button>

</div>

</div>

</div>

))

}



{
items.length===0&&(

<div className="
text-center
py-12
text-slate-400
bg-white
rounded-xl
">

No announcements yet

</div>

)

}

</div>

</main>

</div>



{showModal&&(

<div className="
fixed
inset-0
bg-black/40
flex
items-center
justify-center
z-50
p-4
">

<div className="
bg-white
rounded-2xl
w-full
max-w-lg
p-6
space-y-4
">

<h2 className="
font-semibold
text-lg
">

{
editing
?
'Edit Announcement'
:
'New Announcement'
}

</h2>



<input
value={title}
onChange={(e)=>
setTitle(
e.target.value
)
}
placeholder="
Title
"
className="
w-full
border
rounded-lg
p-3
"
/>



<textarea
value={content}
onChange={(e)=>
setContent(
e.target.value
)
}
rows={4}
placeholder="
Content
"
className="
w-full
border
rounded-lg
p-3
resize-none
"
/>



<input
type="date"
value={publishDate}
onChange={(e)=>
setPublishDate(
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



<div className="
flex
gap-3
">

<button
onClick={save}
className="
flex-1
bg-blue-600
text-white
py-3
rounded-xl
"
>

Save

</button>


<button
onClick={()=>
setShowModal(false)
}
className="
flex-1
border
rounded-xl
py-3
"
>

Cancel

</button>

</div>

</div>

</div>

)}

</div>

)

}
