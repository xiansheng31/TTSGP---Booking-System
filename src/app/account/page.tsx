'use client'

import { useState } from 'react'
import { Save, Lock } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import toast from 'react-hot-toast'

export default function AccountPage() {

  const user = {
    id:'1',
    name:'Xian Sheng',
    email:'xiansheng@gmail.com',
    employee_id:'TTSGP001',
    role:'admin',
    department:'IT',
    phone:'0123456789'
  }

  const [name,setName] =
    useState(user.name)

  const [phone,setPhone] =
    useState(user.phone)

  const [department,setDepartment] =
    useState(user.department)

  const [newPassword,setNewPassword] =
    useState('')

  const [saving,setSaving] =
    useState(false)

  async function saveProfile(){

    setSaving(true)

    setTimeout(()=>{

      toast.success(
        'Profile updated.'
      )

      setSaving(false)

    },1000)

  }

  function changePassword(){

    if(
      !newPassword ||
      newPassword.length<8
    ){

      toast.error(
        'Password minimum 8 characters'
      )

      return
    }

    toast.success(
      'Password updated'
    )

    setNewPassword('')

  }

  return (

    <div className="flex h-screen overflow-hidden">

      <Sidebar/>

      <div className="flex-1 flex flex-col overflow-hidden">

        <Navbar title="My Account"/>

        <main className="flex-1 overflow-y-auto p-6 space-y-6 max-w-2xl">

          <div className="bg-white rounded-xl border p-6">

            <div className="flex items-center gap-4 mb-6">

              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">

                XS

              </div>

              <div>

                <p className="font-semibold">
                  {user.name}
                </p>

                <p className="text-sm text-slate-500">
                  {user.email}
                </p>

              </div>

            </div>

            <input
              value={name}
              onChange={(e)=>
                setName(e.target.value)
              }
              className="w-full border p-3 rounded mb-3"
            />

            <input
              value={department}
              onChange={(e)=>
                setDepartment(e.target.value)
              }
              className="w-full border p-3 rounded mb-3"
            />

            <input
              value={phone}
              onChange={(e)=>
                setPhone(e.target.value)
              }
              className="w-full border p-3 rounded"
            />

            <button
              onClick={saveProfile}
              className="mt-5 bg-blue-600 text-white px-5 py-3 rounded"
            >
              {saving
                ? 'Saving...'
                : 'Save Profile'
              }
            </button>

          </div>

          <div className="bg-white rounded-xl border p-6">

            <div className="flex gap-2 mb-4">

              <Lock size={18}/>

              <h3>
                Change Password
              </h3>

            </div>

            <input
              type="password"
              value={newPassword}
              onChange={(e)=>
                setNewPassword(
                  e.target.value
                )
              }
              placeholder="minimum 8 characters"
              className="w-full border p-3 rounded"
            />

            <button
              onClick={changePassword}
              className="mt-4 bg-black text-white px-5 py-3 rounded"
            >
              Update Password
            </button>

          </div>

        </main>

      </div>

    </div>
  )
}
