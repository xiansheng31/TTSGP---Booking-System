import { format, parseISO, isFuture, isToday } from 'date-fns'
import type { BookingStatus, RoomStatus } from '@/types'

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'dd MMM yyyy')
}

export function formatTime(timeStr: string): string {
  const [h, m] = timeStr.split(':')
  const hour = parseInt(h)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const display = hour % 12 === 0 ? 12 : hour % 12
  return `${display}:${m} ${ampm}`
}

export function formatDateTime(dateStr: string, timeStr: string): string {
  return `${formatDate(dateStr)}, ${formatTime(timeStr)}`
}

export function isBookingUpcoming(dateStr: string): boolean {
  return isFuture(parseISO(dateStr)) || isToday(parseISO(dateStr))
}

export function bookingStatusColor(status: BookingStatus): string {
  const map: Record<BookingStatus, string> = {
    pending:   'bg-amber-100 text-amber-700 border-amber-200',
    approved:  'bg-green-100 text-green-700 border-green-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
    completed: 'bg-slate-100 text-slate-600 border-slate-200',
  }
  return map[status]
}

export function roomStatusColor(status: RoomStatus): string {
  const map: Record<RoomStatus, string> = {
    available:   'bg-green-100 text-green-700',
    maintenance: 'bg-amber-100 text-amber-700',
    inactive:    'bg-slate-100 text-slate-500',
  }
  return map[status]
}

export function generateTimeSlots(startHour = 7, endHour = 22): string[] {
  const slots: string[] = []
  for (let h = startHour; h < endHour; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`)
    slots.push(`${String(h).padStart(2, '0')}:30`)
  }
  return slots
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
