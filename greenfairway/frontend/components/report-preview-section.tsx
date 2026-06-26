import {
  FileText,
  Droplets,
  Bug,
  Bird,
  Wallet,
  CalendarCheck,
  ArrowRight,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const reportSections = [
  { icon: FileText, label: 'Executive summary' },
  { icon: Droplets, label: 'Water optimisation plan' },
  { icon: Bug, label: 'Pest & weed strategy' },
  { icon: Bird, label: 'Biodiversity preservation plan' },
  { icon: Wallet, label: 'Cost estimate' },
  { icon: CalendarCheck, label: '30-day action plan' },
]

export function ReportPreviewSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Report Preview
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl">
            Everything in one polished report
          </h2>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          {/* Contents list */}
          <Card className="border-border bg-card">
            <CardContent className="p-8">
              <h3 className="font-heading text-xl font-semibold text-foreground">
                Report Contents
              </h3>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {reportSections.map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center gap-3 rounded-xl border border-border bg-secondary/40 p-4"
                  >
                    <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <s.icon className="size-4" />
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Before / after */}
          <Card className="border-border bg-card">
            <CardContent className="flex flex-col gap-6 p-8">
              <h3 className="font-heading text-xl font-semibold text-foreground">
                Before / After Comparison
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border bg-muted/40 p-5 text-center">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Before
                  </p>
                  <p className="mt-2 font-heading text-4xl font-semibold text-muted-foreground">
                    62
                  </p>
                  <p className="text-xs text-muted-foreground">/ 100</p>
                </div>
                <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 text-center">
                  <p className="text-xs uppercase tracking-wide text-primary">
                    After
                  </p>
                  <p className="mt-2 font-heading text-4xl font-semibold text-primary">
                    84
                  </p>
                  <p className="text-xs text-primary/70">/ 100</p>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-4">
                <CompareRow label="Water use" before="100%" after="-28%" />
                <CompareRow label="Chemical load" before="High" after="Low" />
                <CompareRow
                  label="Biodiversity risk"
                  before="Medium"
                  after="Low"
                />
                <CompareRow
                  label="Monthly cost"
                  before="Baseline"
                  after="-₹1.8L"
                />
              </div>

              <a
                href="#"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                View full sample report
                <ArrowRight className="size-4" />
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

function CompareRow({
  label,
  before,
  after,
}: {
  label: string
  before: string
  after: string
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="font-medium text-foreground">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground line-through">{before}</span>
        <ArrowRight className="size-3.5 text-muted-foreground" />
        <span className="font-semibold text-primary">{after}</span>
      </div>
    </div>
  )
}
