'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { eventSchema } from '@/types/zodSchemas'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { z } from 'zod'

type EventFormData = z.infer<typeof eventSchema>

export default function EventForm() {
  const qc = useQueryClient()
  const form = useForm<EventFormData>({ 
    resolver: zodResolver(eventSchema) 
  })

  const mutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error('Failed to create event')
      return res.json()
    },
    onSuccess: () => {
      toast.success('Event created')
      qc.invalidateQueries({ queryKey: ['events'] })
      form.reset()
    },
    onError: () => {
      toast.error('Failed to create event')
    }
  })

  return (
    <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))}>
      <input {...form.register('title')} placeholder="Title" />
      <input type="date" {...form.register('date')} />
      <input 
        type="number" 
        {...form.register('capacity', { valueAsNumber: true })} 
      />
      <textarea {...form.register('description')} />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create Event'}
      </button>
    </form>
  )
}