import { Droplets, FlaskConical, Users, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const problems = [
  {
    icon: Droplets,
    title: 'Water Intensive',
    description: 'Large green spaces require heavy irrigation, often around the clock.',
  },
  {
    icon: FlaskConical,
    title: 'Chemical Dependency',
    description:
      'Weed and pest control can harm soil, bees, birds, and small animals.',
  },
  {
    icon: Users,
    title: 'Labour Shortage',
    description: 'Maintenance teams need smarter systems, not more manual checks.',
  },
  {
    icon: TrendingUp,
    title: 'Rising Operating Costs',
    description:
      'Water, chemicals, and energy costs make course upkeep expensive.',
  },
]

export function ProblemSection() {
  return (
    <section id="problem" className="bg-secondary/40 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            The Challenge
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl">
            The Hidden Cost of Course Maintenance
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
            Keeping a course pristine puts pressure on resources, budgets, and
            the ecosystems that share the land.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {problems.map((problem) => (
            <Card
              key={problem.title}
              className="border-border bg-card transition-shadow hover:shadow-lg hover:shadow-primary/5"
            >
              <CardContent className="flex flex-col gap-4 p-6">
                <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <problem.icon className="size-6" />
                </span>
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {problem.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {problem.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
