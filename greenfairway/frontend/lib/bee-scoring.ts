import type { Assessment } from './api'

export type BeeAction = {
  title: string
  detail: string
  severity: 'urgent' | 'consider' | 'good'
}

export type BeeAssessmentResult = {
  beeSafetyScore: number // 0-100
  label: string
  actions: BeeAction[]
  speciesPresent: boolean
}

/**
 * Derives a bee-safety read-out from the same Assessment fields already
 * captured in the survey — no new backend fields required. Every input
 * is named explicitly so the score is auditable, not a black box.
 */
export function evaluateBeeSafety(assessment: Assessment): BeeAssessmentResult {
  let score = 100
  const actions: BeeAction[] = []

  // Chemical frequency: bees forage through daylight hours, so frequent
  // broad applications carry the highest contact risk.
  const chemPenalty: Record<string, number> = {
    weekly: 30,
    biweekly: 16,
    monthly: 6,
    seasonal: 0,
  }
  score -= chemPenalty[assessment.chemical_frequency] ?? 12

  if (assessment.chemical_frequency === 'weekly') {
    actions.push({
      title: 'Move spraying to early evening',
      detail:
        'Weekly applications are your single biggest lever. Bees forage almost entirely in daylight, so shifting any unavoidable spraying to after 6pm — once foraging activity drops — cuts direct contact risk without changing your schedule\u2019s frequency.',
      severity: 'urgent',
    })
  }

  // Pest control method: broad-spectrum hits pollinators indiscriminately.
  const methodPenalty: Record<string, number> = {
    broad_spectrum: 25,
    mixed: 10,
    targeted: 5,
    biological: 0,
  }
  score -= methodPenalty[assessment.pest_control_method] ?? 15

  if (assessment.pest_control_method === 'broad_spectrum') {
    actions.push({
      title: 'Swap to targeted or biological control',
      detail:
        'Broad-spectrum products don\u2019t distinguish between the pest and the pollinator standing next to it. Targeted treatments or biological controls (like introducing beneficial insects) solve the same turf problem with far less collateral damage to bees.',
      severity: 'urgent',
    })
  } else if (assessment.pest_control_method === 'targeted' || assessment.pest_control_method === 'mixed') {
    actions.push({
      title: 'Keep narrowing your treatment zones',
      detail:
        'You\u2019re already past the highest-risk approach. The next gain is spot-treating only the affected patch rather than the full zone, which keeps drift away from any nearby forage plants.',
      severity: 'consider',
    })
  }

  // Weed severity interacts with chemical use — high/severe weed pressure
  // usually drives more frequent herbicide use, which is its own bee risk
  // even though it's not insecticide-specific.
  const weedPenalty: Record<string, number> = {
    severe: 10,
    high: 6,
    moderate: 2,
    low: 0,
  }
  score -= weedPenalty[assessment.weed_severity] ?? 3

  // Species observed: a present, logged bee population is itself a signal
  // your current practices aren't actively driving them off — reward it,
  // and treat zero logged species as a visibility gap worth flagging.
  const speciesPresent = assessment.species_observed?.includes('Bees') ?? false
  if (speciesPresent) {
    score += 8
  } else {
    actions.push({
      title: 'Log bee sightings during your next walk',
      detail:
        'No bees were recorded in your last biodiversity check. That could mean genuinely low activity, or just that no one was looking in the right spots — flowering rough, clover patches, water-body margins. Worth a deliberate 10-minute walk before assuming the worst.',
      severity: 'consider',
    })
  }

  if (assessment.species_observed?.length >= 4) {
    actions.push({
      title: 'You\u2019re supporting a healthy pollinator mix',
      detail:
        'Multiple species logged on the same course usually means forage and water are both available somewhere on the property. Keep whichever rough or buffer areas are responsible for that exactly as low-intervention as they are now.',
      severity: 'good',
    })
  }

  score = Math.max(0, Math.min(100, Math.round(score)))

  const label = score >= 80 ? 'Bee-friendly' : score >= 55 ? 'Moderate risk' : 'High risk'

  // Always include at least one structural, non-chemical recommendation —
  // forage and buffer zones help regardless of current chemical profile.
  actions.push({
    title: 'Set up a flowering buffer away from play lines',
    detail:
      'A buffer strip along a fence line or out-of-play rough gives foraging bees a destination away from tee boxes and greens — reducing incidental encounters with golfers while giving the colony what it actually needs.',
    severity: 'consider',
  })

  return { beeSafetyScore: score, label, actions, speciesPresent }
}