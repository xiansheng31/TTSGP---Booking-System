'use client'

import { useEffect, useState } from 'react'
import { CheckCheck } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import NotificationCard from '@/components/NotificationCard'
import { supabase } from '@/lib/supabase'
import type { Notification } from '@/types'

export default function NotificationsPage() {

  // temporary fake user
  const user = {
    id:'1',
    name:'Xian Sheng'
  }

  const [notifications,
    setNotifications] =
    useState<Notification[]>([])

  useEffect(() => {

    supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order(
        'created_at',
        { ascending:false }
      )
      .then(({data})=>
        setNotifications(
          data ?? []
        )
      )

  }, [])

  async function markRead(
    id:string
  ) {

    await supabase
      .from('notifications')
      .update({
        read:true
      })
      .eq('id',id)

    setNotifications(
      prev =>
      prev.map(
        n =>
        n.id===id
        ? {
            ...n,
            read:true
          }
        : n
      )
    )

  }

  async function markAllRead(){

    await supabase
      .from('notifications')
      .update({
        read:true
      })
      .eq(
        'user_id',
        user.id
      )
      .eq(
        'read',
        false
      )

    setNotifications(
      prev =>
      prev.map(
        n=>({
          ...n,
          read:true
        })
      )
    )

  }

  const unreadCount =
    notifications.filter(
      n=>!n.read
    ).length

  return (

    <div className="flex h-screen overflow-hidden">

      <Sidebar/>

      <div className="flex-1 flex flex-col overflow-hidden">

        <Navbar title="Notifications"/>

        <main className="flex-1 overflow-y-auto p-6 space-y-5">

          <div className="flex items-center justify-between">

            <p className="text-sm text-slate-500">
              {unreadCount} unread
            </p>

            {unreadCount>0 && (

              <button
                onClick={
                  markAllRead
                }
                className="flex items-center gap-2 text-sm text-blue-600"
              >
                <CheckCheck
                  size={15}
                />
                Mark all read
              </button>

            )}

          </div>

          {notifications.length===0 ? (

            <div className="text-center py-16">

              <p className="text-slate-400">
                No notifications yet.
              </p>

            </div>

          ) : (

            <div className="space-y-3 max-w-2xl">

              {notifications.map(
                n=>(
                  <NotificationCard
                    key={n.id}
                    notification={n}
                    onMarkRead={
                      markRead
                    }
                  />
                )
              )}

            </div>

          )}

        </main>

      </div>

    </div>

  )
}
