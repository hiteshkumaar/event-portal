import { EventCardSkeleton } from './EventCardSkeleton'

export function EventListSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  )
}
