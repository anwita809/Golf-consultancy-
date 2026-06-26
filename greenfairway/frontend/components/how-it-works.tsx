import { Camera, ClipboardList, FileBarChart } from 'lucide-react'

const steps = [
  {
    icon: Camera,
    step: 'Step 1',
    title: 'Upload course photos',
    description:
      'Maintenance teams upload photos of greens, rough patches, water bodies, pest-affected zones, and high-maintenance areas.',
  },
  {
    icon: ClipboardList,
    step: 'Step 2',
    title: 'Complete operations survey',
    description:
      'The platform asks about sprinkler timings, chemical use, mowing frequency, water sources, labour availability, and recurring pest or weed issues.',
  },
  {
    icon: FileBarChart,
    step: 'Step 3',
    title: 'Receive sustainability plan',
    description:
      'Generate a structured report with water, biodiversity, pest management, and cost-saving recommendations.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            How It Works
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl">
            From photos to a plan in three steps
          </h2>
        </div>

        <div className="relative mt-16 grid gap-10 md:grid-cols-3">
          {/* connecting line */}
          <div className="absolute left-0 top-7 hidden h-px w-full bg-border md:block" />

          {steps.map((step) => (
            <div key={step.step} className="relative flex flex-col gap-5">
              <span className="relative z-10 flex size-14 items-center justify-center rounded-2xl border border-border bg-card text-primary shadow-sm">
                <step.icon className="size-6" />
              </span>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {step.step}
                </span>
                <h3 className="font-heading text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
