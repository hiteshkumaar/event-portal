import EventForm from '@/components/EventForm'
import EventList from '@/components/EventList'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Badge } from '@/components/ui/badge'

export default function Home() {
  return (
    <ErrorBoundary>
      <main className="min-h-screen bg-background relative overflow-hidden selection:bg-primary/10">
        {/* Background Gradients */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl opacity-50 mix-blend-multiply animate-blob" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-secondary/20 blur-3xl opacity-50 mix-blend-multiply animate-blob animation-delay-2000" />
          <div className="absolute top-[40%] left-[20%] w-[400px] h-[400px] rounded-full bg-accent/10 blur-3xl opacity-30 mix-blend-multiply animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Header Section */}
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/40 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="rounded-full py-1 px-3 border-primary/20 text-primary bg-primary/5">
                  Beta v1.0
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Event Dashboard
              </h1>
              <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
                Manage your organizations events, track real-time registrations, and analyze capacity with our premium dashboard.
              </p>
            </div>
          </div>

          {/* Main Layout Grid */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">

            {/* Left Column: Form (Sticky) */}
            <div className="lg:col-span-4 xl:col-span-4 lg:sticky lg:top-8 order-2 lg:order-1">
              <div className="space-y-6">
                <EventForm />

                {/* Helper Card / Tip */}
                <div className="glass-card p-6 rounded-xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent">
                  <h3 className="font-semibold text-primary mb-2">Pro Tip</h3>
                  <p className="text-sm text-muted-foreground">
                    Events with detailed descriptions and custom banners tend to get 30% more registrations.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: List */}
            <div className="lg:col-span-8 xl:col-span-8 order-1 lg:order-2">
              <EventList />
            </div>

          </div>
        </div>
      </main>
    </ErrorBoundary>
  )
}