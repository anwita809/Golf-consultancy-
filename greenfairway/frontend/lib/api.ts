const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api'

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('gf_token')
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Token ${token}`
  if (options.body instanceof FormData) delete headers['Content-Type']

  const res = await fetch(`${BASE}${path}`, { ...options, headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error ?? err.detail ?? 'Request failed')
  }
  return res.json()
}

export const api = {
  register: (data: { username: string; email: string; password: string }) =>
    request<{ token: string; user: User }>('/auth/register/', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { username: string; password: string }) =>
    request<{ token: string; user: User }>('/auth/login/', { method: 'POST', body: JSON.stringify(data) }),

  logout: () => request('/auth/logout/', { method: 'POST' }),

  me: () => request<User>('/auth/me/'),

  getCourses: () => request<Course[]>('/courses/'),
  createCourse: (data: Partial<Course>) =>
    request<Course>('/courses/', { method: 'POST', body: JSON.stringify(data) }),

  getAssessments: () => request<Assessment[]>('/assessments/'),
  createAssessment: (data: Partial<Assessment>) =>
    request<Assessment>('/assessments/', { method: 'POST', body: JSON.stringify(data) }),
  updateAssessment: (id: number, data: Partial<Assessment>) =>
    request<Assessment>(`/assessments/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  getAssessment: (id: number) => request<Assessment>(`/assessments/${id}/`),

  uploadPhoto: (assessmentId: number, formData: FormData) => {
    const token = getToken()
    return fetch(`${BASE}/assessments/${assessmentId}/photos/`, {
      method: 'POST',
      headers: token ? { Authorization: `Token ${token}` } : {},
      body: formData,
    }).then((r) => r.json())
  },

  sampleReport: () => request<SampleReport>('/sample-report/'),
}

export interface User {
  id: number
  username: string
  email: string
}

export interface Course {
  id: number
  name: string
  location: string
  holes: number
  created_at: string
  assessments: Assessment[]
}

export interface Assessment {
  id: number
  course: number
  created_at: string
  sprinkler_duration: number
  water_source: string
  irrigation_schedule: string
  moisture_sensors: string
  chemical_frequency: string
  pest_control_method: string
  weed_severity: string
  pest_severity: string
  species_observed: string[]
  mowing_frequency: number
  team_size: string
  energy_source: string
  labour_availability: string
  sustainability_score: number | null
  water_savings_pct: string | null
  estimated_cost_saving_monthly: string | null
  biodiversity_risk: string
  chemical_dependency: string
  priority_recommendation: string
  photos: Photo[]
  recommendations: Recommendation[]
}

export interface Photo {
  id: number
  zone: string
  image: string
  uploaded_at: string
}

export interface Recommendation {
  id: number
  title: string
  impact: string
  estimated_cost: string
  benefit: string
  difficulty: string
  order: number
}

export interface SampleReport {
  before: Record<string, string>
  after: Record<string, string>
  recommendations: Array<{
    title: string
    impact: string
    estimated_cost: string
    benefit: string
    difficulty: string
  }>
}
