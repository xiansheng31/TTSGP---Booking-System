'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Check, X } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/hooks/useAuth'
import { bookingService } from '@/services/bookingService'
import { cn, formatDate, formatTime } from '@/utils/helpers'
import type { Booking, BookingStatus } from '@/types'
import toast from 'react-hot-toast'

export default function AdminBookingManagementPage() {
  const router = useRouter()
  const { user, loading, isAdmin } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<BookingStatus | ''>('')

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.push('/home')
  }, [user, loading, isAdmin, router])

  useEffect(() => {
    if (isAdmin) bookingService.getAll().then(setBookings)
  }, [isAdmin])

  const updateStatus = async (id: string, status: BookingStatus) => {
    try {
      await bookingService.updateStatus(id, status)
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b))
      toast.success(`Booking ${status}.`)
    } catch { toast.error('Failed to update.') }
  }

  const filtered = bookings.filter((b) => {
    const matchSearch = b.user?.name.toLowerCase().includes(search.toLowerCase()) || b.room?.name.toLowerCase().includes(search.toLowerCase()) || b.title?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFilter || b.status === statusFilter
    return matchSearch && matchStatus
  })

  if (loading || !user || !isAdmin) return null

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="Booking Management" />
        <main className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[220px]">
              <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search bookings..." className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as BookingStatus | '')} className="px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-100">
                  {['User', 'Room', 'Title', 'Date', 'Time', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-5 py-3 text-slate-700">{b.user?.name ?? '—'}</td>
                    <td className="px-5 py-3 text-slate-700">{b.room?.name ?? '—'}</td>
                    <td className="px-5 py-3 text-slate-600 max-w-[160px] truncate">{b.title}</td>
                    <td className="px-5 py-3 text-slate-500">{formatDate(b.booking_date)}</td>
                    <td className="px-5 py-3 text-slate-500">{formatTime(b.start_time)} – {formatTime(b.end_time)}</td>
                    <td className="px-5 py-3">
                      <span className={cn('text-xs font-semibold px-2 py-1 rounded-full capitalize',
                        b.status === 'approved'  ? 'bg-green-100 text-green-700' :
                        b.status === 'pending'   ? 'bg-amber-100 text-amber-700' :
                        b.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                      )}>{b.status}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        {b.status === 'pending' && (
                          <button onClick={() => updateStatus(b.id, 'approved')} title="Approve" className="p-1.5 rounded hover:bg-green-50 text-slate-400 hover:text-green-600"><Check size={15} /></button>
                        )}
                        {(b.status === 'pending' || b.status === 'approved') && (
                          <button onClick={() => updateStatus(b.id, 'cancelled')} title="Cancel" className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-500"><X size={15} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-slate-400">No bookings found.</div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
