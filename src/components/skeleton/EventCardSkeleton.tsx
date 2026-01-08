// components/skeletons/EventCardSkeleton.tsx
export function EventCardSkeleton() {
  return (
    <div className="border rounded-lg p-6 space-y-4 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-9 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  )
}

// components/skeletons/EventListSkeleton.tsx
