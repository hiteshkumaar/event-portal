'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { eventSchema, EventFormData } from '@/types/zodSchemas'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { CalendarIcon, Users, FileText } from 'lucide-react'

export default function EventForm() {
  const qc = useQueryClient()
  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      date: '',
      capacity: 10,
    }
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
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to create event')
      }
      return res.json()
    },
    onMutate: async (newEvent) => {
      await qc.cancelQueries({ queryKey: ['events'] })
      const previousEvents = qc.getQueryData(['events'])

      qc.setQueryData(['events'], (old: any) => {
        const optimisticEvent = {
          id: `temp-${Date.now()}`,
          ...newEvent,
          date: new Date(newEvent.date),
          attendees: [],
          createdAt: new Date(),
        }
        return old ? [optimisticEvent, ...old] : [optimisticEvent]
      })

      return { previousEvents }
    },
    onSuccess: () => {
      toast.success('Event created successfully!')
      form.reset()
    },
    onError: (error, _, context) => {
      qc.setQueryData(['events'], context?.previousEvents)
      toast.error(error.message || 'Failed to create event')
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['events'] })
    }
  })

  return (
    <Card className="h-fit sticky top-8 border-t-4 border-t-primary">
      <CardHeader>
        <CardTitle className="text-xl">Create New Event</CardTitle>
        <CardDescription>
          Fill in the details below to organize a new event.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              {...form.register('title')}
              placeholder="e.g. Annual Developer Conference"
            />
            {form.formState.errors.title && (
              <p className="text-destructive text-xs font-medium pl-1">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <div className="relative">
                <Input
                  id="date"
                  type="date"
                  {...form.register('date')}
                  className="pl-8"
                />
                <CalendarIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
              {form.formState.errors.date && (
                <p className="text-destructive text-xs font-medium pl-1">
                  {form.formState.errors.date.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <div className="relative">
                <Input
                  id="capacity"
                  type="number"
                  {...form.register('capacity', { valueAsNumber: true })}
                  className="pl-8"
                />
                <Users className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
              {form.formState.errors.capacity && (
                <p className="text-destructive text-xs font-medium pl-1">
                  {form.formState.errors.capacity.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <div className="relative">
              <textarea
                id="description"
                {...form.register('description')}
                rows={4}
                placeholder="Describe what your event is about..."
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            {form.formState.errors.description && (
              <p className="text-destructive text-xs font-medium pl-1">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full font-semibold"
            disabled={mutation.isPending || !form.formState.isValid}
          >
            {mutation.isPending ? 'Creating...' : 'Create Event'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}