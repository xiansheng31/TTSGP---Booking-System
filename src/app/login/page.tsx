'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function login() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
      return
    }

    router.push('/home')
  }

  return (
    <div style={{ padding: '40px', maxWidth: '500px' }}>
      <h1>Login Page</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        style={{
          width:'100%',
          padding:'15px',
          marginTop:'20px'
        }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        style={{
          width:'100%',
          padding:'15px',
          marginTop:'20px'
        }}
      />

      <button
        onClick={login}
        style={{
          width:'100%',
          padding:'15px',
          marginTop:'20px',
          cursor:'pointer'
        }}
      >
        Login
      </button>
    </div>
  )
}
