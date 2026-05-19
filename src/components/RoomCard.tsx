'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Users, Tv, PenLine, Video, Projector } from 'lucide-react'
import { cn, roomStatusColor } from '@/utils/helpers'
import type { Room } from '@/types'

const facilityMap: Record<string, { icon: React.ElementType; label: string }> = {
  tv:         { icon: Tv,         label: 'TV' },
  projector:  { icon: Projector,  label: 'Projector' },
  whiteboard: { icon: PenLine,    label: 'Whiteboard' },
  zoom:       { icon: Video,      label: 'Zoom' },
}

export default function RoomCard({ room }: { room: Room }) {
  return (
    <Link href={`/room/${room.id}`} className="block group">
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group-hover:-translate-y-0.5">
        <div className="relative h-44 bg-slate-100">
          {room.photo_url ? (
            <Image src={room.photo_url} alt={room.name} fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
              <span className="text-4xl">🏢</span>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full capitalize', roomStatusColor(room.status))}>
              {room.status}
            </span>
          </div>
          <div className="absolute top-3 left-3">
            <span className="text-xs font-medium px-2 py-1 rounded-md bg-black/40 text-white capitalize">
              {room.type}
            </span>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-slate-800 text-sm">{room.name}</h3>
            <div className="flex items-center gap-1 text-slate-500 shrink-0">
              <Users size={13} />
              <span className="text-xs">{room.capacity}</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mb-3">{room.location} · Floor {room.floor}</p>
          {room.facilities?.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {room.facilities.map((f) => {
                const item = facilityMap[f]
                if (!item) return null
                const Icon = item.icon
                return (
                  <div key={f} title={item.label} className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-md px-2 py-1">
                    <Icon size={12} /><span>{item.label}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
