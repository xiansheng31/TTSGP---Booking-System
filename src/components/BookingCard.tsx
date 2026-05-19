'use client'

import { Calendar, Clock, MapPin, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import { cn, bookingStatusColor, formatDate, formatTime } from '@/utils/helpers'
import type { Booking } from '@/types'

interface BookingCardProps {
  booking: Booking
  onEdit?: (b: Booking) => void
  onCancel?: (b: Booking) => void
}

export default function BookingCard({ booking, onEdit, onCancel }: BookingCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const canModify = booking.status === 'pending' || booking.status === 'approved'

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-semibold text-slate-800 text-sm">{booking.title || 'Meeting'}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{booking.room?.name ?? '—'}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full border capitalize', bookingStatusColor(booking.status))}>
            {booking.status}
          </span>
          {canModify && (
            <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                <MoreHorizontal size={16} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-8 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-10 overflow-hidden text-sm">
                  {onEdit && (
                    <button onClick={() => { onEdit(booking); setMenuOpen(false) }} className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-slate-700">
                      Edit Booking
                    </button>
                  )}
                  {onCancel && (
                    <button onClick={() => { onCancel(booking); setMenuOpen(false) }} className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-500">
                      Cancel
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Calendar size={13} className="text-slate-400" />
          <span>{formatDate(booking.booking_date)}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Clock size={13} className="text-slate-400" />
          <span>{formatTime(booking.start_time)} – {formatTime(booking.end_time)}</span>
        </div>
        {booking.room?.location && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <MapPin size={13} className="text-slate-400" />
            <span>{booking.room.location}</span>
          </div>
        )}
      </div>
    </div>
  )
}
