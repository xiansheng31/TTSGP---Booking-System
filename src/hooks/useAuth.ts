'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  loading: boolean
  isAdmin: boolean
  isSuperAdmin: boolean
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async (authId: string) => {
      const { data } = await supabase.from('users').select('*').eq('id', authId).single()
      setUser(data ?? null)
      setLoading(false)
    }

    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) fetchProfile(data.session.user.id)
      else setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) fetchProfile(session.user.id)
      else { setUser(null); setLoading(false) }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  return {
    user,
    loading,
    isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
    isSuperAdmin: user?.role === 'super_admin',
  }
}
