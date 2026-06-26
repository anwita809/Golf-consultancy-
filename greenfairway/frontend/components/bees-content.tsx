'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { api, type Assessment } from '@/lib/api'
import { evaluateBeeSafety, type BeeAssessmentResult } from '@/lib/bee-scoring'

const HONEYCOMB_PRINCIPLES = [
  {
    title: 'Spray at dusk, not midday',
    detail: 'Bees forage almost entirely in daylight. Moving unavoidable applications to evening cuts direct contact without changing how often you treat.',
  },
  {
    title: 'Mow around bloom, not on a fixed clock',
    detail: 'Clover and flowering rough are food sources mid-bloom. Timing mows just after peak flowering keeps forage available longer without leaving rough unkempt.',
  },
  {
    title: 'Buffer zones, not no-go zones',
    detail: 'A flowering strip along a fence line or out-of-play rough gives bees somewhere to forage that isn’t the fairway golfers are walking.',
  },
  {
    title: 'Targeted beats broad, every time',
    detail: 'Spot-treating the affected patch protects the pest-control outcome you need while leaving everything around it untouched.',
  },
  {
    title: 'Water access away from greens',
    detail: 'A shallow dish or pond margin gives bees a hydration point that isn’t a sprinkler head golfers are standing near.',
  },
  {
    title: 'Hives, if you go there, go corner-of-property',
    detail: 'Courses that’ve added apiaries place them far from tee boxes and cart paths — plenty of foraging range, minimal golfer contact.',
  },
]

const PLAYER_SAFETY_POINTS = [
  {
    title: 'Bees aren’t aggressive away from a nest',
    detail: 'A foraging bee on a flower has no reason to sting unless handled or stepped on barefoot. The handful of real incidents on courses involve disturbed nests, not bees mid-forage.',
  },
  {
    title: 'Keep hives and known nests off play lines',
    detail: 'If you do introduce hives or find a wild nest, the fix is distance — corner of the property, away from tee boxes, fairways, and cart paths — not removal.',
  },
  {
    title: 'Signage for visible activity, not panic',
    detail: 'A small sign near a known flowering buffer or apiary (“Active pollinator zone — please don’t disturb”) sets golfer expectations without alarming anyone.',
  },
  {
    title: 'Swarm season has a 2–3 week window',
    detail: 'Spring swarming is brief and the swarms are typically docile and temporary. Knowing the local window lets staff flag a relocating swarm without it becoming a course-wide scare.',
  },
]

function ScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (score / 100) * circumference
  const color =
    score >= 80
      ? 'hsl(var(--primary))'
      : score >= 55
        ? '#B8860B' // amber: intentionally not a theme token, this is a status color (warning), not a brand color
        : 'hsl(var(--destructive))'

  return (
    <svg width="140" height="140" viewBox="0 0 140 140" className="shrink-0">
      <circle cx="70" cy="70" r="54" fill="none" stroke="hsl(var(--border))" strokeWidth="12" />
      <circle
        cx="70"
        cy="70"
        r="54"
        fill="none"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 70 70)"
      />
      <text
        x="70"
        y="64"
        textAnchor="middle"
        fontSize="30"
        fontWeight="600"
        fill="hsl(var(--foreground))"
        className="font-heading"
      >
        {score}
      </text>
      <text x="70" y="86" textAnchor="middle" fontSize="11" fill="hsl(var(--muted-foreground))">
        / 100
      </text>
    </svg>
  )
}

function severityStyles(severity: BeeAssessmentResult['actions'][number]['severity']) {
  switch (severity) {
    case 'urgent':
      return { dot: 'hsl(var(--destructive))', label: 'Priority' }
    case 'consider':
      return { dot: '#B8860B', label: 'Worth doing' } // amber status color, intentionally outside the brand palette
    case 'good':
      return { dot: 'hsl(var(--primary))', label: 'Going well' }
  }
}

export function BeesPageContent() {
  const { user, loading: authLoading } = useAuth()
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [loadingAssessment, setLoadingAssessment] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setLoadingAssessment(false)
      return
    }
    api
      .getAssessments()
      .then((list) => {
        const latest = [...list].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0]
        setAssessment(latest ?? null)
      })
      .catch(() => setAssessment(null))
      .finally(() => setLoadingAssessment(false))
  }, [user, authLoading])

  const result = assessment ? evaluateBeeSafety(assessment) : null

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border bg-secondary/30 px-6 py-4">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Looking for the main assessment flow or home page?
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Back to Home
            </Link>
            <Link
              href="/#assessment"
              className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Go to Assessment
            </Link>
          </div>
        </div>
      </section>

      {/* Hero */}
      <section className="border-b border-border px-6 pb-20 pt-16 lg:pt-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Biodiversity &middot; Pollinators
          </p>
          <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Bees on Course
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
            Pollinators and play aren’t in competition. The courses doing this well treat bees as a
            maintenance variable, not a hazard — protecting both the colony and the round.
          </p>
        </div>
      </section>

      {/* Why it matters */}
      <section className="px-6 py-16 lg:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-semibold sm:text-3xl">Why this is worth your attention</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <StatCard
              stat="1 in 3"
              label="bites of food"
              note="depends on pollinator activity — bees chief among them — across the food system."
            />
            <StatCard
              stat="90%"
              label="of flowering plants"
              note="rely on pollination to reproduce, including the forage and ornamental planting on most courses."
            />
            <StatCard
              stat="~2 miles"
              label="foraging range"
              note="a single colony can cover — meaning a healthy patch on your course supports the whole neighbourhood, not just itself."
            />
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Figures drawn from turfgrass and pollinator-conservation research (USGA, Xerces Society, golf-industry
            turf publications).
          </p>
        </div>
      </section>

      {/* Honeycomb principles — signature element */}
      <section className="bg-primary px-6 py-16 text-primary-foreground lg:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
            Coexistence, not compromise
          </h2>
          <p className="mt-3 max-w-2xl text-primary-foreground/80">
            Every principle below changes how or when you do something you’re already doing — not whether
            you do it.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {HONEYCOMB_PRINCIPLES.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-5 transition-colors hover:bg-primary-foreground/10"
                style={{ clipPath: 'polygon(8% 0%, 92% 0%, 100% 50%, 92% 100%, 8% 100%, 0% 50%)' }}
              >
                <p className="px-3 py-1 font-semibold text-primary-foreground">{p.title}</p>
                <p className="mt-2 px-3 pb-1 text-sm leading-relaxed text-primary-foreground/75">{p.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Player safety */}
      <section className="px-6 py-16 lg:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
            Keeping it safe and unremarkable for players
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            The goal is a round of golf where nobody notices the bee program is even there.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {PLAYER_SAFETY_POINTS.map((point) => (
              <div key={point.title} className="rounded-2xl border border-border bg-card p-6">
                <p className="font-semibold">{point.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{point.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personalized section */}
      <section className="bg-secondary/40 px-6 py-16 lg:py-20" id="your-course">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-semibold sm:text-3xl">Your course, specifically</h2>

          {authLoading || loadingAssessment ? (
            <div className="mt-8 h-40 animate-pulse rounded-2xl bg-card/60" />
          ) : !user ? (
            <EmptyState
              heading="Sign in to see your course’s bee-safety read-out"
              body="This section pulls straight from your last sustainability assessment — pest control method, chemical frequency, species observed — and turns it into specific guidance for your course."
              cta={{ href: '/#assessment', label: 'Go to Assessment' }}
            />
          ) : !assessment ? (
            <EmptyState
              heading="Run an assessment first"
              body="Nothing to read yet — once you complete the survey in the Assessment tab, this section will tailor itself to your course’s actual pest, chemical, and biodiversity data."
              cta={{ href: '/#assessment', label: 'Start Assessment' }}
            />
          ) : (
            result && <PersonalizedReport result={result} assessment={assessment} />
          )}
        </div>
      </section>
    </main>
  )
}

function StatCard({ stat, label, note }: { stat: string; label: string; note: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <p className="font-heading text-4xl font-semibold text-primary">{stat}</p>
      <p className="mt-1 text-sm font-medium text-foreground">{label}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{note}</p>
    </div>
  )
}

function EmptyState({
  heading,
  body,
  cta,
}: {
  heading: string
  body: string
  cta: { href: string; label: string }
}) {
  return (
    <div className="mt-8 rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
      <p className="font-heading text-xl font-semibold">{heading}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{body}</p>
      <Link
        href={cta.href}
        className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        {cta.label}
      </Link>
    </div>
  )
}

function PersonalizedReport({
  result,
  assessment,
}: {
  result: BeeAssessmentResult
  assessment: Assessment
}) {
  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[auto_1fr]">
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-8">
        <ScoreRing score={result.beeSafetyScore} />
        <p className="font-medium">{result.label}</p>
        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          Based on chemical frequency, pest control method, weed severity, and species logged in your latest
          assessment.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-semibold">What your data says to do next</p>
          <p className="text-xs text-muted-foreground">
            From assessment on {new Date(assessment.created_at).toLocaleDateString()}
          </p>
        </div>
        <ul className="mt-5 space-y-4">
          {result.actions.map((action, i) => {
            const styles = severityStyles(action.severity)
            return (
              <li key={i} className="flex gap-3">
                <span
                  className="mt-1.5 size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: styles.dot }}
                  aria-hidden
                />
                <div>
                  <p className="text-sm font-medium">
                    {action.title}{' '}
                    <span className="font-normal text-muted-foreground">&middot; {styles.label}</span>
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{action.detail}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}