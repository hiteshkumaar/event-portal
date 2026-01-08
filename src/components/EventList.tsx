'use client'


import { useQuery } from '@tanstack/react-query'


export default function EventList() {
const { data, isLoading } = useQuery({
queryKey: ['events'],
queryFn: () => fetch('/api/events').then(res => res.json())
})


if (isLoading) return <p>Loading events...</p>
if (!data.length) return <p>No events created yet</p>


return data.map((event: any) => (
<div key={event.id}>
<h3>{event.title}</h3>
<p>{event.attendees.length}/{event.capacity} registered</p>
</div>
))
}