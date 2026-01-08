'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { attendeeSchema, AttendeeFormData } from '@/types/zodSchemas'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface AttendeeFormProps {
  eventId: string
  eventCapacity: number
  currentAttendees: number
}

export default function AttendeeForm({ eventId, eventCapacity, currentAttendees }: AttendeeFormProps) {
  const qc = useQueryClient()
  const form = useForm<AttendeeFormData>({ 
    resolver: zodResolver(attendeeSchema),
    defaultValues: {
      name: '',
      email: '',
      eventId,
    }
  })

  const isFull = currentAttendees >= eventCapacity

  const mutation = useMutation({
    mutationFn: async (data: AttendeeFormData) => {
      const res = await fetch('/api/attendees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to register')
      }
      return res.json()
    },
    onMutate: async (newAttendee) => {
      // Cancel outgoing refetches
      await qc.cancelQueries({ queryKey: ['events'] })
      await qc.cancelQueries({ queryKey: ['event', eventId] })
      
      // Snapshot previous value
      const previousEvents = qc.getQueryData(['events'])
      const previousEvent = qc.getQueryData(['event', eventId])
      
      // Optimistically update event list
      qc.setQueryData(['events'], (old: any) => {
        if (!old) return old
        return old.map((event: any) => 
          event.id === eventId 
            ? { 
                ...event, 
                attendees: [...event.attendees, { 
                  id: `temp-${Date.now()}`,
                  ...newAttendee,
                  createdAt: new Date() 
                }] 
              }
            : event
        )
      })
      
      // Optimistically update single event
      qc.setQueryData(['event', eventId], (old: any) => {
        if (!old) return old
        return {
          ...old,
          attendees: [...old.attendees, { 
            id: `temp-${Date.now()}`,
            ...newAttendee,
            createdAt: new Date() 
          }]
        }
      })
      
      return { previousEvents, previousEvent }
    },
    onSuccess: () => {
      toast.success('Successfully registered!')
      form.reset({ name: '', email: '', eventId })
    },
    onError: (error, _, context) => {
      // Rollback on error
      if (context?.previousEvents) {
        qc.setQueryData(['events'], context.previousEvents)
      }
      if (context?.previousEvent) {
        qc.setQueryData(['event', eventId], context.previousEvent)
      }
      toast.error(error.message || 'Failed to register')
    },
    onSettled: () => {
      // Refetch to sync with server
      qc.invalidateQueries({ queryKey: ['events'] })
      qc.invalidateQueries({ queryKey: ['event', eventId] })
    }
  })

  if (isFull) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800 font-medium">This event is fully booked</p>
        <p className="text-red-600 text-sm mt-1">
          {eventCapacity} / {eventCapacity} spots filled
        </p>
      </div>
    )
  }

  return (
    <form 
      onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
      className="space-y-4 bg-white p-6 rounded-lg border shadow-sm"
    >
      <h3 className="text-lg font-semibold mb-4">Register for this Event</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input 
          {...form.register('name')} 
          placeholder="Enter your name"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {form.formState.errors.name && (
          <p className="text-red-600 text-sm mt-1">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input 
          type="email"
          {...form.register('email')} 
          placeholder="Enter your email"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {form.formState.errors.email && (
          <p className="text-red-600 text-sm mt-1">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between pt-2">
        <span className="text-sm text-gray-600">
          {eventCapacity - currentAttendees} spots remaining
        </span>
      </div>

      <button 
        type="submit" 
        disabled={mutation.isPending}
        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {mutation.isPending ? 'Registering...' : 'Register Now'}
      </button>
    </form>
  )
}