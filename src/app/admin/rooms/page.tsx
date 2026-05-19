'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, WrenchIcon } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/hooks/useAuth'
import { roomService } from '@/services/roomService'
import { cn } from '@/utils/helpers'
import type { Room, RoomType, RoomStatus } from '@/types'
import toast from 'react-hot-toast'

const emptyRoom = (): Omit<Room, 'id' | 'created_at'> => ({
  name: '', type: 'discussion', capacity: 10, facilities: [], photo_url: null,
  status: 'available', rules: '', location: '', floor: 1,
})

export default function AdminRoomsPage() {
  const router = useRouter()
  const { user, loading, isAdmin } = useAuth()
  const [rooms, setRooms] = useState<Room[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Room | null>(null)
  const [form, setForm] = useState(emptyRoom())
  const [facilitiesInput, setFacilitiesInput] = useState('')

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.push('/home')
  }, [user, loading, isAdmin, router])

  useEffect(() => {
    if (isAdmin) roomService.getAll().then(setRooms)
  }, [isAdmin])

  const openAdd = () => { setEditing(null); setForm(emptyRoom()); setFacilitiesInput(''); setShowModal(true) }
  const openEdit = (room: Room) => {
    setEditing(room)
    setForm({ name: room.name, type: room.type, capacity: room.capacity, facilities: room.facilities, photo_url: room.photo_url, status: room.status, rules: room.rules, location: room.location, floor: room.floor })
    setFacilitiesInput(room.facilities.join(', '))
    setShowModal(true)
  }

  const handleSave = async () => {
    const facilities = facilitiesInput.split(',').map((s) => s.trim()).filter(Boolean)
    const data = { ...form, facilities }
    try {
      if (editing) {
        const updated = await roomService.update(editing.id, data)
        setRooms((prev) => prev.map((r) => r.id === editing.id ? updated : r))
        toast.success('Room updated.')
      } else {
        const created = await roomService.create(data)
        setRooms((prev) => [...prev, created])
        toast.success('Room added.')
      }
      setShowModal(false)
    } catch { toast.error('Failed to save room.') }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this room?')) return
    try { await roomService.delete(id); setRooms((prev) => prev.filter((r) => r.id !== id)); toast.success('Room deleted.') }
    catch { toast.error('Failed to delete.') }
  }

  const toggleMaintenance = async (room: Room) => {
    const updated = await roomService.setMaintenance(room.id, room.status !== 'maintenance')
    setRooms((prev) => prev.map((r) => r.id === room.id ? updated : r))
    toast.success(`Room ${updated.status === 'maintenance' ? 'set to maintenance' : 'restored'}.`)
  }

  if (loading || !user || !isAdmin) return null

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="Room Management" />
        <main className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="flex justify-end">
            <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
              <Plus size={16} /> Add Room
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Room', 'Type', 'Capacity', 'Floor', 'Status', 'Facilities', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-5 py-3 font-medium text-slate-800">{room.name}</td>
                    <td className="px-5 py-3 capitalize text-slate-600">{room.type}</td>
                    <td className="px-5 py-3 text-slate-600">{room.capacity}</td>
                    <td className="px-5 py-3 text-slate-600">{room.floor}</td>
                    <td className="px-5 py-3">
                      <span className={cn('text-xs font-semibold px-2 py-1 rounded-full capitalize',
                        room.status === 'available' ? 'bg-green-100 text-green-700' :
                        room.status === 'maintenance' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                      )}>{room.status}</span>
                    </td>
                    <td className="px-5 py-3 text-slate-500 text-xs">{room.facilities.join(', ') || '—'}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(room)} className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-blue-600"><Pencil size={15} /></button>
                        <button onClick={() => toggleMaintenance(room)} title="Toggle maintenance" className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-amber-600"><WrenchIcon size={15} /></button>
                        <button onClick={() => handleDelete(room.id)} className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-red-500"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-slate-800">{editing ? 'Edit Room' : 'Add Room'}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Room Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as RoomType })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="discussion">Discussion</option>
                  <option value="training">Training</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Capacity</label>
                <input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Floor</label>
                <input type="number" value={form.floor} onChange={(e) => setForm({ ...form, floor: parseInt(e.target.value) })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as RoomStatus })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="available">Available</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Facilities (comma-separated)</label>
                <input value={facilitiesInput} onChange={(e) => setFacilitiesInput(e.target.value)} placeholder="tv, projector, whiteboard, zoom" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Photo URL</label>
                <input value={form.photo_url ?? ''} onChange={(e) => setForm({ ...form, photo_url: e.target.value || null })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Rules</label>
                <textarea value={form.rules ?? ''} onChange={(e) => setForm({ ...form, rules: e.target.value })} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700">Save</button>
              <button onClick={() => setShowModal(false)} className="flex-1 border border-slate-300 text-slate-600 py-2.5 rounded-lg text-sm hover:bg-slate-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
