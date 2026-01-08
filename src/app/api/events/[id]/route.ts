import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params   // ✅ IMPORTANT FIX

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        attendees: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!event) {
      return NextResponse.json(
        { message: 'Event not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error('GET /api/events/[id] error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch event' },
      { status: 500 }
    )
  }
}
