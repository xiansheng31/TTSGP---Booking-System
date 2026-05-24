'use client'

import { useEffect,useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save } from 'lucide-react'

import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'

import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

import toast from 'react-hot-toast'

interface Settings{

buffer_minutes:number
max_booking_hours:number
operating_start:string
operating_end:string
require_approval:boolean
max_advance_days:number

}

const defaults:Settings={

buffer_minutes:15,
max_booking_hours:4,
operating_start:'07:00',
operating_end:'22:00',
require_approval:true,
max_advance_days:30

}


export default function AdminSettingsPage(){

const router=
useRouter()

const {
user,
loading,
isAdmin
}=useAuth()

const [settings,setSettings]=
useState(defaults)

const [saving,setSaving]=
useState(false)


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

loadSettings()

},[
isAdmin
])


async function loadSettings(){

const {data}=await supabase
.from(
'system_settings'
)
.select('*')
.single()

if(data){

setSettings({

...defaults,
...data

})

}

}



async function save(){

setSaving(true)

try{

await supabase
.from(
'system_settings'
)
.upsert({

id:1,
...settings

})

toast.success(
'Settings saved'
)

}
catch{

toast.error(
'Failed to save'
)

}
finally{

setSaving(false)

}

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
System Settings
"
/>


<main className="
flex-1
p-4
md:p-6
overflow-x-hidden
">

<div className="
max-w-4xl
space-y-6
">

<div className="
bg-white
rounded-xl
border
p-6
space-y-6
">

<h2 className="
font-bold
text-lg
">

Booking Rules

</h2>


<div className="
grid
grid-cols-1
md:grid-cols-2
gap-5
">

<div>

<label className="
block
mb-2
text-sm
font-medium
">

Buffer Time
(minutes)

</label>

<input
type="number"
value={settings.buffer_minutes}
onChange={(e)=>

setSettings({

...settings,
buffer_minutes:
parseInt(
e.target.value
)

})

}
className="
w-full
border
rounded-lg
px-4
py-3
"
/>

</div>



<div>

<label className="
block
mb-2
text-sm
font-medium
">

Max Booking Hours

</label>

<input
type="number"
value={settings.max_booking_hours}
onChange={(e)=>

setSettings({

...settings,
max_booking_hours:
parseInt(
e.target.value
)

})

}
className="
w-full
border
rounded-lg
px-4
py-3
"
/>

</div>



<div>

<label className="
block
mb-2
text-sm
font-medium
">

Operating Start

</label>

<input
type="time"
value={settings.operating_start}
onChange={(e)=>

setSettings({

...settings,
operating_start:
e.target.value

})

}
className="
w-full
border
rounded-lg
px-4
py-3
"
/>

</div>



<div>

<label className="
block
mb-2
text-sm
font-medium
">

Operating End

</label>

<input
type="time"
value={settings.operating_end}
onChange={(e)=>

setSettings({

...settings,
operating_end:
e.target.value

})

}
className="
w-full
border
rounded-lg
px-4
py-3
"
/>

</div>



<div>

<label className="
block
mb-2
text-sm
font-medium
">

Advance Booking Days

</label>

<input
type="number"
value={settings.max_advance_days}
onChange={(e)=>

setSettings({

...settings,
max_advance_days:
parseInt(
e.target.value
)

})

}
className="
w-full
border
rounded-lg
px-4
py-3
"
/>

</div>



<div className="
flex
items-center
gap-3
mt-8
">

<input
type="checkbox"
checked={settings.require_approval}
onChange={(e)=>

setSettings({

...settings,
require_approval:
e.target.checked

})

}
/>

<label>

Require Admin Approval

</label>

</div>

</div>


<button
onClick={save}
disabled={saving}
className="
bg-blue-600
text-white
px-6
py-3
rounded-lg
flex
items-center
gap-2
hover:bg-blue-700
"
>

<Save size={18}/>

{

saving
?
'Saving...'
:
'Save Settings'

}

</button>

</div>

</div>

</main>

</div>

</div>

)

}
