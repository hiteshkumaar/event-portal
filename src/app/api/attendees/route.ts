import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'


export async function POST(req: Request) {
const body = await req.json()


const count = await prisma.attendee.count({
where: { eventId: body.eventId }
})


const event = await prisma.event.findUnique({
where: { id: body.eventId }
})


if (!event || count >= event.capacity) {
return NextResponse.json({ message: 'Event full' }, { status: 400 })
}


const attendee = await prisma.attendee.create({ data: body })
return NextResponse.json(attendee)
}