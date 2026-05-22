'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, DoorOpen, Plus, Megaphone } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import DashboardCard from '@/components/DashboardCard'

export default function HomePage() {
  const router = useRouter()

  // temporary fake user
  const user = {
    id: '1',
    name: 'Xian Sheng'
  }

  const [availableNow, setAvailableNow] = useState(5)
  const [todayCount, setTodayCount] = useState(8)
  const [myUpcoming] = useState([
    {
      id: 1,
      room: 'Meeting Room A',
      date: 'Today 3:00 PM'
    }
  ])

  const [announcements] = useState([
    {
      id: 1,
      title: 'System Ready',
      content: 'Dashboard loaded successfully.',
      publish_date: new Date().toISOString()
    }
  ])

  const hour = new Date().getHours()

  const greeting =
    hour < 12
      ? 'Good morning'
      : hour < 17
      ? 'Good afternoon'
      : 'Good evening'

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="Home" />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
            <h2 className="text-2xl font-bold">
              {greeting}, {user.name}! 👋
            </h2>

            <p className="text-blue-100 mt-1 text-sm">
              Manage your room bookings below
            </p>

            <button
              onClick={() => router.push('/bookings')}
              className="mt-4 inline-flex items-center gap-2 bg-white text-blue-600 text-sm font-semibold px-4 py-2 rounded-lg"
            >
              <Plus size={16}/>
              Quick Book
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <DashboardCard
              title="Available Rooms"
              value={availableNow}
              icon={DoorOpen}
            />

            <DashboardCard
              title="Today's Bookings"
              value={todayCount}
              icon={Calendar}
            />

            <DashboardCard
              title="My Upcoming"
              value={myUpcoming.length}
              icon={Clock}
            />

          </div>

          <div className="bg-white p-6 rounded-xl">

            <div className="flex items-center gap-2 mb-4">
              <Megaphone size={16}/>
              <h3 className="font-semibold">
                Announcements
              </h3>
            </div>

            {announcements.map(a=>(
              <div key={a.id}>
                <p className="font-bold">
                  {a.title}
                </p>

                <p>
                  {a.content}
                </p>
              </div>
            ))}

          </div>

        </main>
      </div>
    </div>
  )
}
