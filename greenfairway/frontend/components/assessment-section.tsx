'use client'

import { useState, useRef } from 'react'
import {
  Camera, Droplets, Bug, Bird, Settings2, Upload, ImageIcon, CheckCircle2, Loader2,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/lib/auth-context'
import { api } from '@/lib/api'
import { AuthModal } from './auth-modal'

const SPECIES = ['Bees', 'Birds', 'Frogs', 'Butterflies', 'Small mammals']

type SelectOption = {
  label: string
  value: string
}

const WATER_SOURCE_OPTIONS: SelectOption[] = [
  { label: 'Municipal supply', value: 'municipal' },
  { label: 'Borewell / groundwater', value: 'borewell' },
  { label: 'Recycled greywater', value: 'recycled' },
  { label: 'Rainwater harvesting', value: 'rainwater' },
]

const IRRIGATION_SCHEDULE_OPTIONS: SelectOption[] = [
  { label: 'Early morning only', value: 'early_morning' },
  { label: 'Morning & evening', value: 'morning_evening' },
  { label: 'Continuous cycles', value: 'continuous' },
  { label: 'On-demand / manual', value: 'on_demand' },
]

const MOISTURE_SENSOR_OPTIONS: SelectOption[] = [
  { label: 'None', value: 'none' },
  { label: 'Partial coverage', value: 'partial' },
  { label: 'Full coverage', value: 'full' },
]

const CHEMICAL_FREQUENCY_OPTIONS: SelectOption[] = [
  { label: 'Weekly', value: 'weekly' },
  { label: 'Every two weeks', value: 'biweekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Seasonal / as needed', value: 'seasonal' },
]

const PEST_CONTROL_OPTIONS: SelectOption[] = [
  { label: 'Broad-spectrum pesticides', value: 'broad_spectrum' },
  { label: 'Targeted treatments', value: 'targeted' },
  { label: 'Biological control', value: 'biological' },
  { label: 'Mixed approach', value: 'mixed' },
]

const SEVERITY_OPTIONS: SelectOption[] = [
  { label: 'Low', value: 'low' },
  { label: 'Moderate', value: 'moderate' },
  { label: 'High', value: 'high' },
  { label: 'Severe', value: 'severe' },
]

const TEAM_SIZE_OPTIONS: SelectOption[] = [
  { label: '1–5', value: '1-5' },
  { label: '6–12', value: '6-12' },
  { label: '13–25', value: '13-25' },
  { label: '25+', value: '25+' },
]

const ENERGY_SOURCE_OPTIONS: SelectOption[] = [
  { label: 'Petrol / diesel', value: 'petrol_diesel' },
  { label: 'Mixed fleet', value: 'mixed' },
  { label: 'Electric', value: 'electric' },
  { label: 'Hybrid', value: 'hybrid' },
]

const LABOUR_OPTIONS: SelectOption[] = [
  { label: 'Limited', value: 'limited' },
  { label: 'Adequate', value: 'adequate' },
  { label: 'Seasonal shortage', value: 'seasonal' },
]

export function AssessmentSection() {
  const { user } = useAuth()
  const [showAuth, setShowAuth] = useState(false)
  const [tab, setTab] = useState('photos')

  const [sprinkler, setSprinkler] = useState(45)
  const [mowing, setMowing] = useState(4)
  const [checked, setChecked] = useState<string[]>(['Bees', 'Birds'])
  const [waterSource, setWaterSource] = useState('')
  const [irrigationSchedule, setIrrigationSchedule] = useState('')
  const [moistureSensors, setMoistureSensors] = useState('')
  const [chemicalFrequency, setChemicalFrequency] = useState('')
  const [pestControlMethod, setPestControlMethod] = useState('')
  const [weedSeverity, setWeedSeverity] = useState('')
  const [pestSeverity, setPestSeverity] = useState('')
  const [teamSize, setTeamSize] = useState('')
  const [energySource, setEnergySource] = useState('')
  const [labourAvailability, setLabourAvailability] = useState('')

  const [uploadedPhotos, setUploadedPhotos] = useState<{ name: string; zone: string }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)

  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ score: number; water: string; cost: string; priority: string } | null>(null)
  const [error, setError] = useState('')

  const sprinklerDuration = sprinkler
  const mowingFrequency = mowing

  const toggleSpecies = (name: string) =>
    setChecked((prev) => prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setPendingFile(e.target.files[0])
  }

  const submit = async () => {
    if (!user) { setShowAuth(true); return }
    setSubmitting(true)
    setError('')
    try {
      let courses = await api.getCourses()
      let course = courses[0]
      if (!course) {
        course = await api.createCourse({ name: `${user.username}'s Course`, holes: 18 })
      }

      const assessment = await api.createAssessment({
        course: course.id,
        sprinkler_duration: sprinklerDuration,
        water_source: waterSource,
        irrigation_schedule: irrigationSchedule,
        moisture_sensors: moistureSensors,
        chemical_frequency: chemicalFrequency,
        pest_control_method: pestControlMethod,
        weed_severity: weedSeverity,
        pest_severity: pestSeverity,
        species_observed: checked,
        mowing_frequency: mowing,
        team_size: teamSize,
        energy_source: energySource,
        labour_availability: labourAvailability,
      })

      window.dispatchEvent(new CustomEvent('gf:assessment-updated', { detail: assessment }))

      if (pendingFile) {
        const fd = new FormData()
        fd.append('image', pendingFile)
        fd.append('zone', 'other')
        await api.uploadPhoto(assessment.id, fd)
      }

      setResult({
        score: assessment.sustainability_score ?? 0,
        water: `${assessment.water_savings_pct ?? 0}%`,
        cost: `₹${Number(assessment.estimated_cost_saving_monthly ?? 0).toLocaleString('en-IN')}`,
        priority: assessment.priority_recommendation,
      })
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (result) {
    return (
      <section id="assessment" className="bg-secondary/40 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Assessment Complete</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl">
              Your Sustainability Score
            </h2>
          </div>
          <Card className="mt-12 border-border bg-card shadow-xl shadow-primary/5">
            <CardContent className="flex flex-col items-center gap-8 p-10 text-center">
              <CheckCircle2 className="size-14 text-primary" />
              <div>
                <p className="font-heading text-7xl font-semibold text-foreground">
                  {result.score}<span className="text-2xl text-muted-foreground">/100</span>
                </p>
              </div>
              <div className="grid w-full max-w-lg grid-cols-3 gap-4 text-center">
                <div className="rounded-xl border border-border bg-secondary/50 p-4">
                  <p className="text-xs text-muted-foreground">Water Savings</p>
                  <p className="mt-1 text-lg font-semibold text-primary">-{result.water}</p>
                </div>
                <div className="rounded-xl border border-border bg-secondary/50 p-4">
                  <p className="text-xs text-muted-foreground">Monthly Saving</p>
                  <p className="mt-1 text-lg font-semibold text-primary">{result.cost}</p>
                </div>
                <div className="rounded-xl border border-border bg-secondary/50 p-4">
                  <p className="text-xs text-muted-foreground">Top Priority</p>
                  <p className="mt-1 text-sm font-semibold text-foreground leading-tight">{result.priority}</p>
                </div>
              </div>
              <Button onClick={() => setResult(null)} variant="outline">Run Another Assessment</Button>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} defaultTab="register" />}
      <section id="assessment" className="bg-secondary/40 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Interactive Assessment</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl">
              Tell us about your course
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
              A guided survey that captures everything needed to build your tailored sustainability plan.
            </p>
          </div>

          <Card className="mt-12 overflow-hidden border-border bg-card shadow-xl shadow-primary/5">
            <CardContent className="p-0">
              <Tabs value={tab} onValueChange={setTab} className="w-full gap-0">
                <div className="border-b border-border bg-muted/40 p-2">
                  <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-transparent p-0">
                    <TabsTrigger value="photos" className="gap-2"><Camera className="size-4" />Course Photos</TabsTrigger>
                    <TabsTrigger value="water" className="gap-2"><Droplets className="size-4" />Water Usage</TabsTrigger>
                    <TabsTrigger value="pest" className="gap-2"><Bug className="size-4" />Pest &amp; Weed</TabsTrigger>
                    <TabsTrigger value="biodiversity" className="gap-2"><Bird className="size-4" />Biodiversity</TabsTrigger>
                    <TabsTrigger value="operations" className="gap-2"><Settings2 className="size-4" />Operations</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="photos" className="p-6 lg:p-8">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <label
                      className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-muted/30 p-10 text-center transition-colors hover:border-primary/50 hover:bg-muted/50"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Upload className="size-6" />
                      </span>
                      <span className="font-medium text-foreground">
                        {pendingFile ? pendingFile.name : 'Drag photos here or click to upload'}
                      </span>
                      <span className="text-sm text-muted-foreground">Greens, fairways, water bodies, pest zones</span>
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Greens', 'Water body', 'Rough patch', 'Pest zone'].map((zone) => (
                        <div key={zone} className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-secondary/40 p-4 text-center">
                          <ImageIcon className="size-6 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{zone}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button onClick={() => setTab('water')}>Next: Water Usage →</Button>
                  </div>
                </TabsContent>

                <TabsContent value="water" className="p-6 lg:p-8">
                  <div className="grid gap-8 sm:grid-cols-2">
                    <Field label={`Sprinkler duration — ${sprinklerDuration} min/zone`}>
                      <Slider value={sprinkler} onValueChange={setSprinkler} min={10} max={90} step={5} />
                    </Field>
                    <Field label="Primary water source">
                      <SurveySelect value={waterSource} onChange={setWaterSource} placeholder="Select source" options={WATER_SOURCE_OPTIONS} />
                    </Field>
                    <Field label="Irrigation schedule">
                      <SurveySelect value={irrigationSchedule} onChange={setIrrigationSchedule} placeholder="Select schedule" options={IRRIGATION_SCHEDULE_OPTIONS} />
                    </Field>
                    <Field label="Moisture sensors installed?">
                      <SurveySelect value={moistureSensors} onChange={setMoistureSensors} placeholder="Select option" options={MOISTURE_SENSOR_OPTIONS} />
                    </Field>
                  </div>
                  <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={() => setTab('photos')}>← Back</Button>
                    <Button onClick={() => setTab('pest')}>Next: Pest & Weed →</Button>
                  </div>
                </TabsContent>

                <TabsContent value="pest" className="p-6 lg:p-8">
                  <div className="grid gap-8 sm:grid-cols-2">
                    <Field label="Chemical usage frequency">
                      <SurveySelect value={chemicalFrequency} onChange={setChemicalFrequency} placeholder="Select frequency" options={CHEMICAL_FREQUENCY_OPTIONS} />
                    </Field>
                    <Field label="Primary control method">
                      <SurveySelect value={pestControlMethod} onChange={setPestControlMethod} placeholder="Select method" options={PEST_CONTROL_OPTIONS} />
                    </Field>
                    <Field label="Recurring weed issues">
                      <SurveySelect value={weedSeverity} onChange={setWeedSeverity} placeholder="Select severity" options={SEVERITY_OPTIONS} />
                    </Field>
                    <Field label="Recurring pest issues">
                      <SurveySelect value={pestSeverity} onChange={setPestSeverity} placeholder="Select severity" options={SEVERITY_OPTIONS} />
                    </Field>
                  </div>
                  <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={() => setTab('water')}>← Back</Button>
                    <Button onClick={() => setTab('biodiversity')}>Next: Biodiversity →</Button>
                  </div>
                </TabsContent>

                <TabsContent value="biodiversity" className="p-6 lg:p-8">
                  <p className="mb-5 text-sm font-medium text-foreground">Species observed or affected on the course</p>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {SPECIES.map((name) => (
                      <label key={name} className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-secondary/30 p-4 transition-colors hover:bg-secondary/60">
                        <Checkbox checked={checked.includes(name)} onCheckedChange={() => toggleSpecies(name)} />
                        <span className="font-medium text-foreground">{name}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={() => setTab('pest')}>← Back</Button>
                    <Button onClick={() => setTab('operations')}>Next: Operations →</Button>
                  </div>
                </TabsContent>

                <TabsContent value="operations" className="p-6 lg:p-8">
                  <div className="grid gap-8 sm:grid-cols-2">
                    <Field label={`Mowing frequency — ${mowingFrequency}× / week`}>
                      <Slider value={mowing} onValueChange={setMowing} min={1} max={7} step={1} />
                    </Field>
                    <Field label="Maintenance team size">
                      <SurveySelect value={teamSize} onChange={setTeamSize} placeholder="Select range" options={TEAM_SIZE_OPTIONS} />
                    </Field>
                    <Field label="Equipment energy source">
                      <SurveySelect value={energySource} onChange={setEnergySource} placeholder="Select source" options={ENERGY_SOURCE_OPTIONS} />
                    </Field>
                    <Field label="Labour availability">
                      <SurveySelect value={labourAvailability} onChange={setLabourAvailability} placeholder="Select level" options={LABOUR_OPTIONS} />
                    </Field>
                  </div>
                  {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
                  <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={() => setTab('biodiversity')}>← Back</Button>
                    <Button onClick={submit} disabled={submitting} className="gap-2">
                      {submitting && <Loader2 className="size-4 animate-spin" />}
                      {submitting ? 'Analysing…' : 'Generate My Sustainability Plan'}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      {children}
    </div>
  )
}

function SurveySelect({
  placeholder, options, value, onChange,
}: { placeholder: string; options: SelectOption[]; value: string; onChange: (v: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full bg-background">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}