"use client"

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Droplets,
  Bird,
  Wallet,
  FlaskConical,
  Target,
  Gauge,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { api, Assessment } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'

export function DashboardSection() {
  const { user, loading } = useAuth()
  const [latestAssessment, setLatestAssessment] = useState<Assessment | null>(null)
  const [fetchError, setFetchError] = useState('')

  const loadLatestAssessment = useCallback(async () => {
    if (!user) {
      setLatestAssessment(null)
      return
    }

    try {
      setFetchError('')
      const assessments = await api.getAssessments()
      if (assessments.length === 0) {
        setLatestAssessment(null)
        return
      }

      const latest = [...assessments].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )[0]
      setLatestAssessment(latest)
    } catch {
      setFetchError('Unable to load your latest assessment data right now.')
    }
  }, [user])

  useEffect(() => {
    if (!loading) loadLatestAssessment()
  }, [loading, loadLatestAssessment])

  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<Assessment>
      if (customEvent.detail) {
        setLatestAssessment(customEvent.detail)
      } else {
        loadLatestAssessment()
      }
    }

    window.addEventListener('gf:assessment-updated', handler)
    return () => window.removeEventListener('gf:assessment-updated', handler)
  }, [loadLatestAssessment])

  const score = latestAssessment?.sustainability_score ?? 0
  const waterSavings = latestAssessment?.water_savings_pct ? `${latestAssessment.water_savings_pct}%` : '0%'
  const monthlySavings = useMemo(() => {
    const value = Number(latestAssessment?.estimated_cost_saving_monthly ?? 0)
    return `₹${value.toLocaleString('en-IN')}`
  }, [latestAssessment?.estimated_cost_saving_monthly])
  const biodiversityRisk = latestAssessment?.biodiversity_risk || 'Not available'
  const biodiversityTone = latestAssessment?.biodiversity_risk?.toLowerCase() === 'high'
    ? 'destructive'
    : 'secondary'
  const chemicalDependency = latestAssessment?.chemical_dependency || 'Not available'
  const priorityRecommendation = latestAssessment?.priority_recommendation || 'Complete an assessment to get a priority action.'
  const speciesCount = latestAssessment?.species_observed?.length ?? 0
  const hasData = !!latestAssessment

  return (
    <section id="dashboard" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Live Dashboard
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl">
            A clear view of where you stand
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            {hasData ? 'Updated from your latest submitted assessment.' : 'Submit an assessment to populate this dashboard.'}
          </p>
          {fetchError && <p className="mt-2 text-sm text-destructive">{fetchError}</p>}
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          <Card className="border-border bg-primary text-primary-foreground lg:row-span-2">
            <CardContent className="flex h-full flex-col justify-between gap-8 p-8">
              <div className="flex items-center gap-2 text-sm font-medium text-primary-foreground/80">
                <Gauge className="size-4" />
                Overall Sustainability Score
              </div>
              <div>
                <p className="font-heading text-7xl font-semibold leading-none">
                  {score}
                  <span className="text-2xl text-primary-foreground/70">
                    /100
                  </span>
                </p>
                <p className="mt-3 text-sm text-primary-foreground/80">
                  {hasData
                    ? 'Your latest result is reflected here. Keep iterating to improve the score.'
                    : 'No assessment data yet. Fill the assessment form to generate your score.'}
                </p>
              </div>
              <Progress
                value={score}
                className="bg-primary-foreground/20 [&>div]:bg-primary-foreground"
              />
            </CardContent>
          </Card>

          <Metric
            icon={Droplets}
            label="Potential Water Savings"
            value={waterSavings}
            note={hasData ? 'Estimated reduction based on your current operations.' : 'Estimate appears after first assessment.'}
          />
          <Metric
            icon={Wallet}
            label="Est. Monthly Cost Reduction"
            value={monthlySavings}
            note={hasData ? 'Combined estimate across water, chemicals, and energy.' : 'Estimated savings appear after scoring.'}
          />
          <BiodiversityMetric risk={biodiversityRisk} speciesCount={speciesCount} tone={biodiversityTone} />
          <Metric
            icon={FlaskConical}
            label="Chemical Dependency"
            value={chemicalDependency}
            note={hasData ? 'Model output from your latest inputs.' : 'Dependency signal appears after scoring.'}
            tone={chemicalDependency.toLowerCase() === 'high' ? 'warn' : 'default'}
          />
          <Card className="border-border bg-accent/40 sm:col-span-2 lg:col-span-1">
            <CardContent className="flex h-full flex-col gap-3 p-6">
              <span className="flex size-11 items-center justify-center rounded-xl bg-card text-accent-foreground">
                <Target className="size-5" />
              </span>
              <p className="text-sm font-medium text-accent-foreground">
                Recommended Priority
              </p>
              <p className="font-heading text-xl font-semibold text-foreground">
                {priorityRecommendation}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

function Metric({
  icon: Icon,
  label,
  value,
  note,
  tone = 'default',
}: {
  icon: typeof Droplets
  label: string
  value: string
  note: string
  tone?: 'default' | 'warn'
}) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="flex flex-col gap-3 p-6">
        <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p
          className={
            tone === 'warn'
              ? 'font-heading text-3xl font-semibold text-destructive'
              : 'font-heading text-3xl font-semibold text-foreground'
          }
        >
          {value}
        </p>
        <p className="text-xs text-muted-foreground">{note}</p>
      </CardContent>
    </Card>
  )
}

function BiodiversityMetric({
  risk,
  speciesCount,
  tone,
}: {
  risk: string
  speciesCount: number
  tone: 'secondary' | 'destructive'
}) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="flex flex-col gap-3 p-6">
        <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Bird className="size-5" />
        </span>
        <p className="text-sm font-medium text-muted-foreground">
          Biodiversity Risk
        </p>
        <div className="flex items-center gap-2">
          <p className="font-heading text-3xl font-semibold text-foreground">
            {risk}
          </p>
          {speciesCount > 0 && <Badge variant={tone}>{speciesCount} species recorded</Badge>}
        </div>
        <p className="text-xs text-muted-foreground">
          {speciesCount > 0 ? 'Based on species selected in your latest assessment.' : 'Species insights appear after assessment submission.'}
        </p>
      </CardContent>
    </Card>
  )
}