import { supabase } from '@/lib/supabase'
import type { Booking, BookingStatus } from '@/types'

export const bookingService = {
  async getAll() {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, user:users(*), room:rooms(*)')
      .order('booking_date', { ascending: false })
    if (error) throw error
    return data as Booking[]
  },

  async getByUser(userId: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, room:rooms(*)')
      .eq('user_id', userId)
      .order('booking_date', { ascending: false })
    if (error) throw error
    return data as Booking[]
  },

  async getByRoom(roomId: string, date: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('room_id', roomId)
      .eq('booking_date', date)
      .in('status', ['pending', 'approved'])
    if (error) throw error
    return data as Booking[]
  },

  async getToday() {
    const today = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase
      .from('bookings')
      .select('*, user:users(*), room:rooms(*)')
      .eq('booking_date', today)
      .in('status', ['pending', 'approved'])
    if (error) throw error
    return data as Booking[]
  },

  async create(booking: Omit<Booking, 'id' | 'created_at'>) {
    const { data, error } = await supabase.from('bookings').insert(booking).select().single()
    if (error) throw error
    return data as Booking
  },

  async update(id: string, updates: Partial<Booking>) {
    const { data, error } = await supabase.from('bookings').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data as Booking
  },

  async updateStatus(id: string, status: BookingStatus) {
    return bookingService.update(id, { status })
  },

  async cancel(id: string) {
    return bookingService.updateStatus(id, 'cancelled')
  },

  async checkConflict(roomId: string, date: string, startTime: string, endTime: string, excludeId?: string) {
    let query = supabase
      .from('bookings')
      .select('id')
      .eq('room_id', roomId)
      .eq('booking_date', date)
      .in('status', ['pending', 'approved'])
      .lt('start_time', endTime)
      .gt('end_time', startTime)
    if (excludeId) query = query.neq('id', excludeId)
    const { data, error } = await query
    if (error) throw error
    return (data?.length ?? 0) > 0
  },
}
