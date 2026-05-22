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
  const [user, setUser] =
    useState<User | null>(null)

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {

    supabase.auth
      .getSession()
      .then(({data}) => {

        if(data.session?.user){

          setUser({

            id:data.session.user.id,

            name:
              data.session.user.email
              ?.split('@')[0]
              || 'User',

            email:
              data.session.user.email || '',

            role:'admin',

            department:'IT',

            employee_id:'TTSGP001'

          } as User)

        }

        setLoading(false)

      })

    const {
      data: listener
    } =
    supabase.auth
      .onAuthStateChange(
        (_event,session)=>{

          if(session?.user){

            setUser({

              id:session.user.id,

              name:
                session.user.email
                ?.split('@')[0]
                || 'User',

              email:
                session.user.email || '',

              role:'admin',

              department:'IT',

              employee_id:'TTSGP001'

            } as User)

          } else {

            setUser(null)

          }

          setLoading(false)

      })

    return () =>
      listener.subscription
      .unsubscribe()

  },[])

  return {

    user,

    loading,

    isAdmin:true,

    isSuperAdmin:false

  }
}
