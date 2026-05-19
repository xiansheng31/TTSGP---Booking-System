'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { Users, MapPin, ArrowLeft, Tv, PenLine, Video, Projector, CheckCircle, XCircle } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/hooks/useAuth'
import { roomService } from '@/services/roomService'
import { bookingService } from '@/services/bookingService'
import { generateTimeSlots, formatTime, cn } from '@/utils/helpers'
import type { Room, Booking } from '@/types'
import toast from 'react-hot-toast'

const facilityMap: Record<string, { icon: React.ElementType; label: string }> = {
  tv:         { icon: Tv,         label: 'TV' },
  projector:  { icon: Projector,  label: 'Projector' },
  whiteboard: { icon: PenLine,    label: 'Whiteboard' },
  zoom:       { icon: Video,      label: 'Zoom' },
}

const slots = generateTimeSlots(7, 22)

export default function RoomDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { user, loading } = useAuth()
  const [room, setRoom] = useState<Room | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedStart, setSelectedStart] = useState('')
  const [selectedEnd, setSelectedEnd] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  useEffect(() => {
    if (!params.id) return
    roomService.getById(params.id as string).then(setRoom)
  }, [params.id])

  useEffect(() => {
    if (!params.id) return
    bookingService.getByRoom(params.id as string, selectedDate).then(setBookings)
  }, [params.id, selectedDate])

  const isSlotBooked = (slot: string) => {
    return bookings.some((b) => b.start_time <= slot && b.end_time > slot)
  }

  const handleBook = async () => {
    if (!user || !room || !selectedStart || !selectedEnd || !title) {
      toast.error('Please fill in all required fields.')
      return
    }
    if (selectedStart >= selectedEnd) {
      toast.error('End time must be after start time.')
      return
    }
    setSubmitting(true)
    try {
      const conflict = await bookingService.checkConflict(room.id, selectedDate, selectedStart, selectedEnd)
      if (conflict) { toast.error('This slot is already booked. Please choose another time.'); return }
      await bookingService.create({
        user_id: user.id,
        room_id: room.id,
        booking_date: selectedDate,
        start_time: selectedStart,
        end_time: selectedEnd,
        title,
        description,
        participants: [],
        status: 'pending',
      })
      toast.success('Booking submitted! Awaiting approval.')
      router.push('/my-bookings')
    } catch {
      toast.error('Failed to create booking.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || !user || !room) return null

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title={room.name} />
        <main className="flex-1 overflow-y-auto p-6">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-5">
            <ArrowLeft size={16} /> Back to Rooms
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left — Room Info */}
            <div className="lg:col-span-2 space-y-5">
              {/* Photo */}
              <div className="relative h-72 rounded-2xl overflow-hidden bg-slate-100">
                {room.photo_url ? (
                  <Image src={room.photo_url} alt={room.name} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                    <span className="text-6xl">🏢</span>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">{room.name}</h2>
                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                      <span className="flex items-center gap-1"><MapPin size={14} />{room.location} · Floor {room.floor}</span>
                      <span className="flex items-center gap-1"><Users size={14} />{room.capacity} pax</span>
                    </div>
                  </div>
                  <span className={cn('text-xs font-semibold px-3 py-1.5 rounded-full capitalize',
                    room.status === 'available' ? 'bg-green-100 text-green-700' :
                    room.status === 'maintenance' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                  )}>{room.status}</span>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Facilities</p>
                  <div className="flex flex-wrap gap-2">
                    {room.facilities?.map((f) => {
                      const item = facilityMap[f]
                      if (!item) return null
                      const Icon = item.icon
                      return <div key={f} className="flex items-center gap-1.5 text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5"><Icon size={14} />{item.label}</div>
                    })}
                  </div>
                </div>

                {room.rules && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Room Rules</p>
                    <p className="text-sm text-slate-600 whitespace-pre-line">{room.rules}</p>
                  </div>
                )}
              </div>

              {/* Time Slots */}
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-slate-700">Availability</p>
                  <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex items-center gap-4 mb-3 text-xs">
                  <span className="flex items-center gap-1.5"><CheckCircle size={12} className="text-green-500" /> Available</span>
                  <span className="flex items-center gap-1.5"><XCircle size={12} className="text-red-400" /> Booked</span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {slots.map((slot) => {
                    const booked = isSlotBooked(slot)
                    return (
                      <button
                        key={slot}
                        disabled={booked || room.status !== 'available'}
                        onClick={() => {
                          if (!selectedStart || (selectedStart && selectedEnd)) {
                            setSelectedStart(slot); setSelectedEnd('')
                          } else {
                            if (slot <= selectedStart) { setSelectedStart(slot); setSelectedEnd('') }
                            else setSelectedEnd(slot)
                          }
                        }}
                        className={cn(
                          'py-1.5 text-xs rounded-lg border font-medium transition-colors',
                          booked ? 'bg-red-50 border-red-200 text-red-400 cursor-not-allowed' :
                          slot === selectedStart || slot === selectedEnd ? 'bg-blue-600 border-blue-600 text-white' :
                          (selectedStart && selectedEnd && slot > selectedStart && slot < selectedEnd) ? 'bg-blue-100 border-blue-200 text-blue-600' :
                          'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                        )}
                      >
                        {formatTime(slot)}
                      </button>
                    )
                  })}
                </div>
                {selectedStart && (
                  <p className="text-xs text-slate-500 mt-3">
                    Selected: {formatTime(selectedStart)} {selectedEnd ? `→ ${formatTime(selectedEnd)}` : '(select end time)'}
                  </p>
                )}
              </div>
            </div>

            {/* Right — Booking Form */}
            <div>
              <div className="bg-white rounded-xl border border-slate-200 p-5 sticky top-4">
                <h3 className="font-semibold text-slate-800 mb-4">Book This Room</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Meeting Title *</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Weekly Sync" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Optional notes..." className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 text-sm space-y-1">
                    <div className="flex justify-between text-slate-600"><span>Date</span><span className="font-medium">{selectedDate}</span></div>
                    <div className="flex justify-between text-slate-600"><span>Start</span><span className="font-medium">{selectedStart ? formatTime(selectedStart) : '—'}</span></div>
                    <div className="flex justify-between text-slate-600"><span>End</span><span className="font-medium">{selectedEnd ? formatTime(selectedEnd) : '—'}</span></div>
                  </div>
                  <button
                    onClick={handleBook}
                    disabled={submitting || !selectedStart || !selectedEnd || !title || room.status !== 'available'}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitting ? 'Booking...' : 'Confirm Booking'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
