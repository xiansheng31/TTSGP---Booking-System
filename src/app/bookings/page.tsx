'use client'

import { useEffect, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import RoomCard from '@/components/RoomCard'
import Calendar from '@/components/Calendar'
import { roomService } from '@/services/roomService'
import { bookingService } from '@/services/bookingService'
import type { Room, Booking, RoomType } from '@/types'

export default function BookingsPage() {

  // temporary user
  const user = {
    id: '1',
    name: 'Xian Sheng'
  }

  const [rooms, setRooms] = useState<Room[]>([])
  const [allBookings, setAllBookings] = useState<Booking[]>([])
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<RoomType | ''>('')
  const [floorFilter, setFloorFilter] = useState<string>('')
  const [capacityFilter, setCapacityFilter] = useState<string>('')
  const [showFilters, setShowFilters] = useState(false)
  const [view, setView] =
    useState<'rooms' | 'calendar'>('rooms')

  useEffect(() => {
    roomService.getAll().then(setRooms)
    bookingService.getAll().then(setAllBookings)
  }, [])

  const filtered = rooms.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase())

    const matchType =
      !typeFilter || r.type === typeFilter

    const matchFloor =
      !floorFilter || r.floor === parseInt(floorFilter)

    const matchCap =
      !capacityFilter ||
      r.capacity >= parseInt(capacityFilter)

    return (
      matchSearch &&
      matchType &&
      matchFloor &&
      matchCap
    )
  })

  const clearFilters = () => {
    setTypeFilter('')
    setFloorFilter('')
    setCapacityFilter('')
    setSearch('')
  }

  const hasFilters =
    typeFilter ||
    floorFilter ||
    capacityFilter ||
    search

  return (
    <div className="flex h-screen overflow-hidden">

      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        <Navbar title="Book a Room" />

        <main className="flex-1 overflow-y-auto p-6 space-y-5">

          <div className="flex items-center gap-3 flex-wrap">

            <div className="relative flex-1 min-w-[220px]">

              <Search
                size={16}
                className="absolute left-3 top-2.5 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e)=>
                  setSearch(e.target.value)
                }
                placeholder="Search rooms..."
                className="w-full pl-9 pr-4 py-2.5 border rounded-lg"
              />

            </div>

            <button
              onClick={() =>
                setShowFilters(!showFilters)
              }
              className="flex items-center gap-2 px-4 py-2.5 border rounded-lg"
            >
              <SlidersHorizontal size={16}/>
              Filters

              {hasFilters &&
                <span className="w-2 h-2 rounded-full bg-blue-500"/>
              }

            </button>

          </div>

          {showFilters && (

            <div className="bg-white border rounded-xl p-4 flex gap-4 flex-wrap">

              <select
                value={typeFilter}
                onChange={(e)=>
                  setTypeFilter(
                    e.target.value as RoomType | ''
                  )
                }
              >
                <option value="">
                  All Types
                </option>

                <option value="discussion">
                  Discussion
                </option>

                <option value="training">
                  Training
                </option>

              </select>

              {hasFilters && (

                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1"
                >
                  <X size={14}/>
                  Clear
                </button>

              )}

            </div>

          )}

          {view === 'calendar' ? (

            <Calendar
              bookings={allBookings}
              onEventClick={(id)=>
                console.log(id)
              }
            />

          ) : (

            <>
              <p className="text-sm text-slate-500">
                {filtered.length} rooms found
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                {filtered.map((room)=>(
                  <RoomCard
                    key={room.id}
                    room={room}
                  />
                ))}

              </div>

            </>

          )}

        </main>

      </div>

    </div>
  )
}
