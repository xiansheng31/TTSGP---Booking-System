'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home, Calendar, BookOpen, Bell, User,
  LayoutDashboard, DoorOpen, Users, ClipboardList,
  BarChart2, Settings, ScrollText, Megaphone,
  LogOut, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { cn } from '@/utils/helpers'

const employeeNav = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/bookings', label: 'Book a Room', icon: Calendar },
  { href: '/my-bookings', label: 'My Bookings', icon: BookOpen },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/account', label: 'My Account', icon: User },
]

const adminNav = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/rooms', label: 'Rooms', icon: DoorOpen },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/booking-management', label: 'Bookings', icon: ClipboardList },
  { href: '/admin/reports', label: 'Reports', icon: BarChart2 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
  { href: '/admin/audit', label: 'Audit Logs', icon: ScrollText },
  { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { user, isAdmin } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const NavItem = ({
    href,
    label,
    icon: Icon,
  }: {
    href: string
    label: string
    icon: React.ElementType
  }) => {
    const active =
      pathname === href ||
      (href !== '/home' && pathname.startsWith(href))

    return (
      <Link
        href={href}
        scroll={false}
        title={collapsed ? label : undefined}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
          active
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-slate-400 hover:bg-[#1a2333] hover:text-white'
        )}
      >
        <Icon size={18} className="shrink-0" />
        {!collapsed && <span>{label}</span>}
      </Link>
    )
  }

  return (
    <aside
      className={cn(
        'flex flex-col h-screen bg-[#0f1623] sticky top-0 transition-all duration-300 border-r border-[#1e2d3d] shrink-0',
        collapsed ? 'w-[64px]' : 'w-[240px]'
      )}
    >
      <div className="flex items-center justify-between px-4 py-5 border-b border-[#1e2d3d]">
        {!collapsed && (
          <div>
            <span className="text-white font-bold text-base">
              TTSGP
            </span>
            <span className="text-blue-400 font-bold text-base">
              {' '}Booking
            </span>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-500 hover:text-white p-1 rounded-md hover:bg-[#1a2333]"
        >
          {collapsed
            ? <ChevronRight size={16}/>
            : <ChevronLeft size={16}/>
          }
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {!collapsed && (
          <p className="text-xs font-semibold text-slate-600 uppercase px-3 mb-2">
            Main
          </p>
        )}

        {employeeNav.map((item)=>(
          <NavItem key={item.href} {...item}/>
        ))}

        {isAdmin && (
          <>
            {!collapsed && (
              <p className="text-xs font-semibold text-slate-600 uppercase px-3 mt-5 mb-2">
                Admin
              </p>
            )}

            {adminNav.map((item)=>(
              <NavItem key={item.href} {...item}/>
            ))}
          </>
        )}
      </nav>

      <div className="px-2 py-4 border-t border-[#1e2d3d]">
        {!collapsed && user && (
          <div className="px-3 mb-3">
            <p className="text-white text-sm font-medium">
              {user.name}
            </p>

            <p className="text-slate-500 text-xs capitalize">
              {user.role}
            </p>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-[#1a2333] hover:text-red-400"
        >
          <LogOut size={18}/>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}
