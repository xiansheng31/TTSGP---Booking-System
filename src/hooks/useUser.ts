'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@/types'

export function useUser(userId: string | null) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    supabase.from('users').select('*').eq('id', userId).single().then(({ data }) => {
      setUser(data ?? null)
      setLoading(false)
    })
  }, [userId])

  return { user, loading }
}
