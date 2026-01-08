import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: { attendees: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('GET /api/events error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const event = await prisma.event.create({
      data: {
        title: body.title,
        description: body.description,
        date: new Date(body.date),
        capacity: body.capacity,
      },
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error('POST /api/events error:', error)
    return NextResponse.json(
      { message: 'Failed to create event' },
      { status: 500 }
    )
  }
}
