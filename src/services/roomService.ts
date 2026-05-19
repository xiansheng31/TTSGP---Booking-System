import { supabase } from '@/lib/supabase'
import type { Room, RoomType, RoomStatus } from '@/types'

export const roomService = {
  async getAll(filters?: { type?: RoomType; status?: RoomStatus; floor?: number }) {
    let query = supabase.from('rooms').select('*').order('name')
    if (filters?.type)   query = query.eq('type', filters.type)
    if (filters?.status) query = query.eq('status', filters.status)
    if (filters?.floor)  query = query.eq('floor', filters.floor)
    const { data, error } = await query
    if (error) throw error
    return data as Room[]
  },

  async getById(id: string) {
    const { data, error } = await supabase.from('rooms').select('*').eq('id', id).single()
    if (error) throw error
    return data as Room
  },

  async create(room: Omit<Room, 'id' | 'created_at'>) {
    const { data, error } = await supabase.from('rooms').insert(room).select().single()
    if (error) throw error
    return data as Room
  },

  async update(id: string, updates: Partial<Room>) {
    const { data, error } = await supabase.from('rooms').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data as Room
  },

  async delete(id: string) {
    const { error } = await supabase.from('rooms').delete().eq('id', id)
    if (error) throw error
  },

  async setMaintenance(id: string, maintenance: boolean) {
    return roomService.update(id, { status: maintenance ? 'maintenance' : 'available' })
  },
}
