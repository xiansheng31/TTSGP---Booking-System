'use client'

import { Bell, CheckCheck } from 'lucide-react'
import { cn, formatDate } from '@/utils/helpers'
import type { Notification } from '@/types'

interface NotificationCardProps {
  notification: Notification
  onMarkRead?: (id: string) => void
}

export default function NotificationCard({ notification, onMarkRead }: NotificationCardProps) {
  return (
    <div className={cn('flex items-start gap-3 p-4 rounded-xl border transition-colors', notification.read ? 'bg-white border-slate-200' : 'bg-blue-50 border-blue-200')}>
      <div className={cn('p-2 rounded-lg shrink-0', notification.read ? 'bg-slate-100' : 'bg-blue-100')}>
        <Bell size={16} className={notification.read ? 'text-slate-400' : 'text-blue-600'} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800">{notification.title}</p>
        <p className="text-sm text-slate-500 mt-0.5">{notification.message}</p>
        <p className="text-xs text-slate-400 mt-1">{formatDate(notification.created_at)}</p>
      </div>
      {!notification.read && onMarkRead && (
        <button
          onClick={() => onMarkRead(notification.id)}
          title="Mark as read"
          className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-400 transition-colors shrink-0"
        >
          <CheckCheck size={16} />
        </button>
      )}
    </div>
  )
}
