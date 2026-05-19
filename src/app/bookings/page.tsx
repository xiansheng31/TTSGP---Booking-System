'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import RoomCard from '@/components/RoomCard'
import Calendar from '@/components/Calendar'
import { useAuth } from '@/hooks/useAuth'
import { roomService } from '@/services/roomService'
import { bookingService } from '@/services/bookingService'
import type { Room, Booking, RoomType } from '@/types'

export default function BookingsPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [rooms, setRooms] = useState<Room[]>([])
  const [allBookings, setAllBookings] = useState<Booking[]>([])
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<RoomType | ''>('')
  const [floorFilter, setFloorFilter] = useState<string>('')
  const [capacityFilter, setCapacityFilter] = useState<string>('')
  const [showFilters, setShowFilters] = useState(false)
  const [view, setView] = useState<'rooms' | 'calendar'>('rooms')

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  useEffect(() => {
    roomService.getAll().then(setRooms)
    bookingService.getAll().then(setAllBookings)
  }, [])

  const filtered = rooms.filter((r) => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.location.toLowerCase().includes(search.toLowerCase())
    const matchType = !typeFilter || r.type === typeFilter
    const matchFloor = !floorFilter || r.floor === parseInt(floorFilter)
    const matchCap = !capacityFilter || r.capacity >= parseInt(capacityFilter)
    return matchSearch && matchType && matchFloor && matchCap
  })

  const clearFilters = () => { setTypeFilter(''); setFloorFilter(''); setCapacityFilter(''); setSearch('') }
  const hasFilters = typeFilter || floorFilter || capacityFilter || search

  if (loading || !user) return null

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="Book a Room" />
        <main className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Search + Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[220px]">
              <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search rooms or location..."
                className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
            >
              <SlidersHorizontal size={16} /> Filters
              {hasFilters && <span className="w-2 h-2 rounded-full bg-blue-500" />}
            </button>
            <div className="flex rounded-lg border border-slate-300 overflow-hidden text-sm">
              <button onClick={() => setView('rooms')} className={`px-4 py-2.5 ${view === 'rooms' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>Rooms</button>
              <button onClick={() => setView('calendar')} className={`px-4 py-2.5 ${view === 'calendar' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>Calendar</button>
            </div>
          </div>

          {/* Filter Row */}
          {showFilters && (
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 flex-wrap">
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as RoomType | '')} className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">All Types</option>
                <option value="discussion">Discussion</option>
                <option value="training">Training</option>
              </select>
              <select value={floorFilter} onChange={(e) => setFloorFilter(e.target.value)} className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">All Floors</option>
                {[1,2,3,4,5].map((f) => <option key={f} value={f}>Floor {f}</option>)}
              </select>
              <select value={capacityFilter} onChange={(e) => setCapacityFilter(e.target.value)} className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Any Capacity</option>
                <option value="4">4+ pax</option>
                <option value="8">8+ pax</option>
                <option value="15">15+ pax</option>
                <option value="30">30+ pax</option>
              </select>
              {hasFilters && (
                <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-slate-500 hover:text-red-500">
                  <X size={14} /> Clear
                </button>
              )}
            </div>
          )}

          {view === 'calendar' ? (
            <Calendar bookings={allBookings} onEventClick={(id) => console.log(id)} />
          ) : (
            <>
              <p className="text-sm text-slate-500">{filtered.length} room{filtered.length !== 1 ? 's' : ''} found</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((room) => <RoomCard key={room.id} room={room} />)}
              </div>
              {filtered.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-slate-400">No rooms match your criteria.</p>
                  <button onClick={clearFilters} className="mt-2 text-sm text-blue-600 hover:underline">Clear filters</button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
