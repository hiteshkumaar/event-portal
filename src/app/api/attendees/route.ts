import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const event = await prisma.event.findUnique({
      where: { id: body.eventId },
      include: { attendees: true },
    })

    if (!event) {
      return NextResponse.json(
        { message: 'Event not found' },
        { status: 404 }
      )
    }

    if (event.attendees.length >= event.capacity) {
      return NextResponse.json(
        { message: 'Event capacity reached' },
        { status: 400 }
      )
    }

    const attendee = await prisma.attendee.create({
      data: {
        name: body.name,
        email: body.email,
        eventId: body.eventId,
      },
    })

    return NextResponse.json(attendee)
  } catch (error: any) {
    console.error('POST /api/attendees error:', error)
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    )
  }
}
