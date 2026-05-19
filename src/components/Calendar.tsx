'use client'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { Booking } from '@/types'

interface CalendarProps {
  bookings: Booking[]
  onDateClick?: (date: string) => void
  onEventClick?: (bookingId: string) => void
}

export default function Calendar({ bookings, onDateClick, onEventClick }: CalendarProps) {
  const events = bookings.map((b) => ({
    id: b.id,
    title: `${b.title || 'Meeting'} — ${b.room?.name ?? ''}`,
    start: `${b.booking_date}T${b.start_time}`,
    end:   `${b.booking_date}T${b.end_time}`,
    backgroundColor:
      b.status === 'approved' ? '#22c55e' :
      b.status === 'pending'  ? '#f59e0b' :
      b.status === 'cancelled'? '#ef4444' : '#94a3b8',
    borderColor: 'transparent',
  }))

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={events}
        height="auto"
        dateClick={(info) => onDateClick?.(info.dateStr)}
        eventClick={(info) => onEventClick?.(info.event.id)}
        slotMinTime="07:00:00"
        slotMaxTime="22:00:00"
        allDaySlot={false}
        nowIndicator
      />
    </div>
  )
}
