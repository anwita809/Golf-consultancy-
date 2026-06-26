import {
  Droplets,
  Bug,
  Flower2,
  Radar,
  Clock,
  ArrowUpRight,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const recommendations = [
  {
    icon: Droplets,
    title: 'Reduce sprinkler runtime by 18% in shaded zones',
    impact: 'High',
    cost: '₹0 (config)',
    benefit: '~9% total water saved',
    difficulty: 'Easy',
  },
  {
    icon: Bug,
    title: 'Replace broad-spectrum pesticides with targeted biological control',
    impact: 'High',
    cost: '₹45,000',
    benefit: 'Healthier soil & pollinators',
    difficulty: 'Medium',
  },
  {
    icon: Flower2,
    title: 'Add bee-safe flowering buffer zones away from play areas',
    impact: 'Medium',
    cost: '₹28,000',
    benefit: 'Restored pollinator habitat',
    difficulty: 'Easy',
  },
  {
    icon: Radar,
    title: 'Introduce moisture sensors for fairway irrigation',
    impact: 'High',
    cost: '₹1,20,000',
    benefit: '~19% irrigation efficiency',
    difficulty: 'Medium',
  },
  {
    icon: Clock,
    title: 'Shift mowing schedules to protect ground-nesting species',
    impact: 'Medium',
    cost: '₹0 (schedule)',
    benefit: 'Lower energy + nest safety',
    difficulty: 'Easy',
  },
]

const impactTone: Record<string, string> = {
  High: 'bg-primary/10 text-primary',
  Medium: 'bg-accent/50 text-accent-foreground',
}

export function RecommendationsSection() {
  return (
    <section className="bg-secondary/40 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Recommendations
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl">
            Practical, prioritised next steps
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
            Every recommendation comes with impact, cost, expected benefit, and
            implementation difficulty.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {recommendations.map((rec, i) => (
            <Card
              key={rec.title}
              className={
                i === 0
                  ? 'border-border bg-card transition-shadow hover:shadow-lg hover:shadow-primary/5 md:col-span-2'
                  : 'border-border bg-card transition-shadow hover:shadow-lg hover:shadow-primary/5'
              }
            >
              <CardContent className="flex flex-col gap-5 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <rec.icon className="size-5" />
                    </span>
                    <h3 className="font-heading text-lg font-semibold leading-snug text-foreground text-pretty">
                      {rec.title}
                    </h3>
                  </div>
                  <ArrowUpRight className="size-5 shrink-0 text-muted-foreground" />
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border pt-4 sm:grid-cols-4">
                  <Detail label="Impact">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${impactTone[rec.impact]}`}
                    >
                      {rec.impact}
                    </span>
                  </Detail>
                  <Detail label="Est. Cost">
                    <span className="text-sm font-semibold text-foreground">
                      {rec.cost}
                    </span>
                  </Detail>
                  <Detail label="Benefit">
                    <span className="text-sm font-medium text-foreground">
                      {rec.benefit}
                    </span>
                  </Detail>
                  <Detail label="Difficulty">
                    <Badge variant="secondary">{rec.difficulty}</Badge>
                  </Detail>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function Detail({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
    </div>
  )
}
