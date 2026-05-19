export type Role = 'employee' | 'admin' | 'super_admin'
export type BookingStatus = 'pending' | 'approved' | 'cancelled' | 'completed'
export type RoomStatus = 'available' | 'maintenance' | 'inactive'
export type RoomType = 'discussion' | 'training'

export interface User {
  id: string
  employee_id: string
  name: string
  email: string
  department: string
  role: Role
  phone: string | null
  created_at: string
}

export interface Room {
  id: string
  name: string
  type: RoomType
  capacity: number
  facilities: string[]
  photo_url: string | null
  status: RoomStatus
  rules: string | null
  location: string
  floor: number
  created_at: string
}

export interface Booking {
  id: string
  user_id: string
  room_id: string
  booking_date: string
  start_time: string
  end_time: string
  title: string
  description: string | null
  participants: string[]
  status: BookingStatus
  created_at: string
  user?: User
  room?: Room
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  read: boolean
  created_at: string
}

export interface Announcement {
  id: string
  title: string
  content: string
  publish_date: string
  created_at: string
}

export interface AuditLog {
  id: string
  user_id: string
  action: string
  details: string | null
  created_at: string
  user?: User
}

export interface TimeSlot {
  time: string
  available: boolean
  bookingId?: string
}

export interface DashboardStats {
  totalBookingsToday: number
  roomOccupancy: number
  pendingApprovals: number
  activeRooms: number
}
