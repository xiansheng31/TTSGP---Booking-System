import { supabase } from '@/lib/supabase'
import type { User, Role } from '@/types'

export const userService = {
  async getAll() {
    const { data, error } = await supabase.from('users').select('*').order('name')
    if (error) throw error
    return data as User[]
  },

  async getById(id: string) {
    const { data, error } = await supabase.from('users').select('*').eq('id', id).single()
    if (error) throw error
    return data as User
  },

  async update(id: string, updates: Partial<User>) {
    const { data, error } = await supabase.from('users').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data as User
  },

  async updateRole(id: string, role: Role) {
    return userService.update(id, { role })
  },
}
