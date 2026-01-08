import EventForm from '@/components/EventForm'
import EventList from '@/components/EventList'


export default function Home() {
return (
<main>
<h1>Event Dashboard</h1>
<EventForm />
<EventList />
</main>
)
}