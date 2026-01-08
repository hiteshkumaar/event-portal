'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import AttendeeForm from '@/components/AttendeeForm'
import AttendeeList from '@/components/AttendeeList'
import { ArrowLeft, Calendar, Users, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { ErrorBoundary } from '@/components/ErrorBoundary'

interface Event {
  id: string
  title: string
  description: string
  date: string
  capacity: number
  attendees: any[]
  createdAt: string
}

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.id as string

  const { data: event, isLoading, isError, error } = useQuery<Event>({
    queryKey: ['event', eventId],
    queryFn: async () => {
      const res = await fetch(`/api/events/${eventId}`)
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('Event not found')
        }
        throw new Error('Failed to fetch event')
      }
      return res.json()
    }
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-12 bg-gray-200 rounded w-3/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (isError || !event) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-5xl mx-auto">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to events
          </Link>
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="rounded-full bg-red-100 p-6 mb-4">
              <AlertCircle className="h-12 w-12 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {error instanceof Error && error.message === 'Event not found' 
                ? 'Event not found' 
                : 'Failed to load event'}
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-sm">
              {error instanceof Error ? error.message : 'An error occurred'}
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-5xl mx-auto">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to events
          </Link>

          <div className="bg-white rounded-lg shadow-sm border p-8 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {event.title}
            </h1>

            <div className="flex items-center gap-6 text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>
                  {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>
                  {event.attendees.length} / {event.capacity} registered
                </span>
              </div>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">
                {event.description}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <AttendeeForm 
                eventId={event.id}
                eventCapacity={event.capacity}
                currentAttendees={event.attendees.length}
              />
            </div>
            <div>
              <AttendeeList attendees={event.attendees} />
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}