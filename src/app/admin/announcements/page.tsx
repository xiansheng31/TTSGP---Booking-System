'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import type { Announcement } from '@/types'
import toast from 'react-hot-toast'

export default function AdminAnnouncementsPage() {
  const router = useRouter()
  const { user, loading, isAdmin } = useAuth()
  const [items, setItems] = useState<Announcement[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Announcement | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [publishDate, setPublishDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.push('/home')
  }, [user, loading, isAdmin, router])

  useEffect(() => {
    if (isAdmin) supabase.from('announcements').select('*').order('publish_date', { ascending: false }).then(({ data }) => setItems(data ?? []))
  }, [isAdmin])

  const openAdd = () => { setEditing(null); setTitle(''); setContent(''); setPublishDate(new Date().toISOString().split('T')[0]); setShowModal(true) }
  const openEdit = (a: Announcement) => { setEditing(a); setTitle(a.title); setContent(a.content); setPublishDate(a.publish_date.split('T')[0]); setShowModal(true) }

  const save = async () => {
    const data = { title, content, publish_date: publishDate }
    try {
      if (editing) {
        const { data: updated } = await supabase.from('announcements').update(data).eq('id', editing.id).select().single()
        setItems((prev) => prev.map((a) => a.id === editing.id ? updated! : a))
        toast.success('Announcement updated.')
      } else {
        const { data: created } = await supabase.from('announcements').insert(data).select().single()
        setItems((prev) => [created!, ...prev])
        toast.success('Announcement created.')
      }
      setShowModal(false)
    } catch { toast.error('Failed to save.') }
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this announcement?')) return
    await supabase.from('announcements').delete().eq('id', id)
    setItems((prev) => prev.filter((a) => a.id !== id))
    toast.success('Deleted.')
  }

  if (loading || !user || !isAdmin) return null

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="Announcements" />
        <main className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="flex justify-end">
            <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
              <Plus size={16} /> New Announcement
            </button>
          </div>

          <div className="space-y-3">
            {items.map((a) => (
              <div key={a.id} className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-800">{a.title}</p>
                    <p className="text-sm text-slate-500 mt-1">{a.content}</p>
                    <p className="text-xs text-slate-400 mt-2">Publish: {new Date(a.publish_date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(a)} className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-blue-600"><Pencil size={15} /></button>
                    <button onClick={() => remove(a.id)} className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-red-500"><Trash2 size={15} /></button>
                  </div>
                </div>
              </div>
            ))}
            {items.length === 0 && <div className="text-center py-16 text-slate-400">No announcements yet.</div>}
          </div>
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">{editing ? 'Edit Announcement' : 'New Announcement'}</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Content</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Publish Date</label>
              <input type="date" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex gap-3">
              <button onClick={save} className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700">Save</button>
              <button onClick={() => setShowModal(false)} className="flex-1 border border-slate-300 text-slate-600 py-2.5 rounded-lg text-sm hover:bg-slate-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
