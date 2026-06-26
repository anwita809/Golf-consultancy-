import Image from 'next/image'
import { Bird, Bug, Flower2, Fish } from 'lucide-react'

const species = [
  {
    icon: Bug,
    name: 'Bees',
    guidance: 'Avoid chemical spraying during active pollination hours.',
  },
  {
    icon: Bird,
    name: 'Birds',
    guidance: 'Protect nesting zones during mowing season.',
  },
  {
    icon: Fish,
    name: 'Frogs',
    guidance: 'Reduce chemical runoff near water bodies.',
  },
  {
    icon: Flower2,
    name: 'Butterflies',
    guidance: 'Add native plants around non-play areas.',
  },
]

export function BiodiversitySection() {
  return (
    <section id="biodiversity" className="bg-primary py-20 text-primary-foreground lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/70">
            What makes us different
          </p>
          <h2 className="font-heading text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Protect the Course. Protect the Life Around It.
          </h2>
          <p className="max-w-lg text-lg leading-relaxed text-primary-foreground/85 text-pretty">
            Most platforms focus only on water or energy. We identify the animal
            and insect life affected by maintenance practices and recommend
            safer alternatives — because a pristine course does not have to come
            at the cost of local biodiversity.
          </p>

          <div className="mt-2 overflow-hidden rounded-2xl border border-primary-foreground/15">
            <Image
              src="/biodiversity.png"
              alt="A honeybee resting on a wildflower beside a golf course fairway"
              width={640}
              height={360}
              className="h-52 w-full object-cover"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {species.map((s) => (
            <div
              key={s.name}
              className="flex flex-col gap-3 rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-6 backdrop-blur-sm"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-primary-foreground/15">
                <s.icon className="size-6" />
              </span>
              <h3 className="font-heading text-xl font-semibold">{s.name}</h3>
              <p className="text-sm leading-relaxed text-primary-foreground/80">
                {s.guidance}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
