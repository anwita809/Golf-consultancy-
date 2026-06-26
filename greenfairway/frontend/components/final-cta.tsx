'use client'

import { useState } from 'react'
import { Leaf, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { AuthModal } from './auth-modal'

export function FinalCta() {
  const { user } = useAuth()
  const [showAuth, setShowAuth] = useState(false)

  const handleAssessment = () => {
    if (user) {
      document.getElementById('assessment')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      setShowAuth(true)
    }
  }

  return (
    <>
      {showAuth && <AuthModal onClose={() => { setShowAuth(false); document.getElementById('assessment')?.scrollIntoView({ behavior: 'smooth' }) }} defaultTab="register" />}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-secondary/60 px-6 py-16 text-center sm:px-12">
            <h2 className="mx-auto max-w-2xl font-heading text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl lg:text-5xl">
              Make Your Course Greener, Smarter, and More Efficient
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
              Run a sample assessment in minutes, or book a review with our sustainability consultants.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" className="h-12 px-6 text-base" onClick={handleAssessment}>
                Run a Sample Assessment
                <ArrowRight data-icon="inline-end" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 bg-card px-6 text-base">
                Book a Sustainability Review
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Leaf className="size-5" />
            </span>
            <span className="font-heading text-lg font-semibold tracking-tight text-foreground">
              GreenFairway Consulting
            </span>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <a href="#problem" className="hover:text-foreground">Problem</a>
            <a href="#how-it-works" className="hover:text-foreground">How It Works</a>
            <a href="#assessment" className="hover:text-foreground">Assessment</a>
            <a href="#dashboard" className="hover:text-foreground">Dashboard</a>
            <a href="#biodiversity" className="hover:text-foreground">Biodiversity</a>
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} GreenFairway Consulting. All rights reserved.</p>
          <p>Sustainability without compromising play quality.</p>
        </div>
      </div>
    </footer>
  )
}
