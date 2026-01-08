'use client'

import { Users } from 'lucide-react'
import { EmptyState } from './EmptyState'
import { AttendeeListSkeleton } from './skeleton/AttendeeListSkeleton'

interface Attendee {
  id: string
  name: string
  email: string
  createdAt: string
}

interface AttendeeListProps {
  attendees?: Attendee[]
  isLoading?: boolean
}

export default function AttendeeList({ attendees, isLoading }: AttendeeListProps) {
  if (isLoading) {
    return <AttendeeListSkeleton />
  }

  if (!attendees || attendees.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <EmptyState
          icon={Users}
          title="No attendees yet"
          description="Be the first to register for this event!"
        />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-900">
          Registered Attendees ({attendees.length})
        </h3>
      </div>
      <div className="divide-y">
        {attendees.map((attendee) => (
          <div key={attendee.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{attendee.name}</p>
                <p className="text-sm text-gray-500">{attendee.email}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">
                  Registered on
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(attendee.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}