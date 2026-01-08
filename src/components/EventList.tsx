'use client'

import { useQuery } from '@tanstack/react-query'
import { EventListSkeleton } from './skeleton/EventListSkeleton'
import { EmptyState } from './EmptyState'
import { Calendar, AlertCircle, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Event {
  id: string
  title: string
  description: string
  date: string
  capacity: number
  attendees: any[]
  createdAt: string
}

export default function EventList() {
  const { data: events, isLoading, isError, error, refetch } = useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: async () => {
      const res = await fetch('/api/events')
      if (!res.ok) {
        throw new Error('Failed to fetch events')
      }
      return res.json()
    }
  })

  if (isLoading) {
    return <EventListSkeleton />
  }

  if (isError) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="rounded-full bg-destructive/10 p-4 mb-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            Failed to load events
          </h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            {error instanceof Error ? error.message : 'An error occurred while fetching events'}
          </p>
          <Button onClick={() => refetch()} variant="outline">
            Try again
          </Button>
        </div>
      </Card>
    )
  }

  if (!events || events.length === 0) {
    return (
      <div className="mt-12">
        <EmptyState
          icon={Calendar}
          title="No events yet"
          description="Get started by creating your first event using the form."
          action={{
            label: 'Create Event',
            onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Upcoming Events</h2>
        <Badge variant="secondary" className="px-3 py-1">
          {events.length} Total
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
        {events.map((event) => {
          const filled = event.attendees.length;
          const isFull = filled >= event.capacity;
          const percentage = Math.round((filled / event.capacity) * 100);

          return (
            <Link href={`/events/${event.id}`} key={event.id} className="group block h-full">
              <Card className="h-full flex flex-col hover:border-primary/50 transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-1">
                      {event.title}
                    </CardTitle>
                    {isFull ? (
                      <Badge variant="destructive" className="shrink-0">Full</Badge>
                    ) : (
                      <Badge variant="secondary" className="shrink-0 text-primary bg-primary/10 hover:bg-primary/20">
                        Open
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-grow pb-4">
                  <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                    {event.description}
                  </p>
                </CardContent>

                <CardFooter className="pt-0 flex flex-col gap-3 border-t bg-muted/20 p-4 mt-auto">
                  <div className="w-full flex justify-between items-center text-sm mb-1">
                    <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                      <Users className="h-4 w-4" />
                      {filled} / {event.capacity}
                    </span>
                    <span className="text-xs font-semibold text-primary">{percentage}% Full</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isFull ? 'bg-destructive' : 'bg-primary'}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </CardFooter>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}