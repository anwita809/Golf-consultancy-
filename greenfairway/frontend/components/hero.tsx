'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Droplets, Bird, Wallet, ArrowRight, TrendingUp, Leaf } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { AuthModal } from './auth-modal'

export function Hero() {
  const { user } = useAuth()
  const [showAuth, setShowAuth] = useState(false)

  const scrollToAssessment = () => {
    document.getElementById('assessment')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleStart = () => {
    if (user) {
      scrollToAssessment()
    } else {
      setShowAuth(true)
    }
  }

  return (
    <>
      {showAuth && <AuthModal onClose={() => { setShowAuth(false); scrollToAssessment() }} defaultTab="register" />}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:gap-8 lg:py-24">
          <div className="flex flex-col gap-7">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground">
              <Leaf />
              Sustainability consulting for golf courses
            </span>

            <h1 className="font-heading text-4xl font-semibold leading-[1.05] tracking-tight text-foreground text-balance sm:text-5xl lg:text-6xl">
              Smarter Sustainability for Modern Golf Courses
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
              A consulting platform that helps golf courses reduce water use, protect biodiversity, and improve maintenance efficiency without compromising play quality.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="h-12 px-6 text-base" onClick={handleStart}>
                Start Course Assessment
                <ArrowRight data-icon="inline-end" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 bg-card px-6 text-base" onClick={scrollToAssessment}>
                View Sample Report
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-primary" />
                120+ courses assessed
              </span>
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-primary" />
                Avg. 26% water reduction
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl border border-border shadow-2xl shadow-primary/10">
              <Image
                src="/golf-hero.png"
                alt="Aerial view of a pristine golf course fairway beside a reflective pond"
                width={720}
                height={520}
                className="h-64 w-full object-cover sm:h-72"
                priority
              />
            </div>

            <div className="absolute -bottom-8 -left-4 w-[88%] rounded-2xl border border-border bg-card/95 p-5 shadow-xl backdrop-blur sm:left-6 sm:w-80">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Sustainability Score</p>
                <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  <TrendingUp className="size-3" />
                  +14
                </span>
              </div>
              <p className="mt-1 font-heading text-4xl font-semibold text-foreground">
                62<span className="text-xl text-muted-foreground">/100</span>
              </p>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <Stat icon={Droplets} label="Water" value="-28%" tone="accent" />
                <Stat icon={Bird} label="Biodiv." value="Med" tone="primary" />
                <Stat icon={Wallet} label="Cost" value="₹1.8L" tone="muted" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function Stat({ icon: Icon, label, value, tone }: { icon: typeof Droplets; label: string; value: string; tone: 'accent' | 'primary' | 'muted' }) {
  const toneClasses = { accent: 'text-accent-foreground', primary: 'text-primary', muted: 'text-foreground' }[tone]
  return (
    <div className="rounded-xl border border-border bg-secondary/50 p-2.5">
      <Icon className={`size-4 ${toneClasses}`} />
      <p className="mt-1.5 text-xs text-muted-foreground">{label}</p>
      <p className={`text-sm font-semibold ${toneClasses}`}>{value}</p>
    </div>
  )
}
