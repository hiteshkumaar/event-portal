import { z } from 'zod'

export const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  date: z.string().min(1, 'Date is required'),
  capacity: z.number().min(1, 'Capacity must be at least 1').max(1000, 'Capacity cannot exceed 1000'),
})

export const attendeeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  eventId: z.string().min(1, 'Event ID is required'),
})

export type EventFormData = z.infer<typeof eventSchema>
export type AttendeeFormData = z.infer<typeof attendeeSchema>