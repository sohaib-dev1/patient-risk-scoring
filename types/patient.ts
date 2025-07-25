export interface Patient {
  patient_id: string
  name: string
  age: number | string
  gender: string
  blood_pressure: string
  temperature: number | string
  visit_date: string
  diagnosis: string
  medications: string
}

export interface PatientWithScore extends Patient {
  bpScore: number
  tempScore: number
  ageScore: number
  totalScore: number
  hasDataIssues: boolean
  dataIssues: string[]
}

export interface ApiResponseV1 {
  data: Patient[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
  metadata: {
    timestamp: string
    version: string
    requestId: string
  }
}

export interface ApiResponseV2 {
  patients: Patient[]
  count: number
  total_records: number
  current_page: number
  per_page: number
}

// Union type for both possible response formats
export type ApiResponse = ApiResponseV1 | ApiResponseV2

// Normalized interface for internal use
export interface NormalizedApiResponse {
  data: Patient[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
  metadata: {
    timestamp: string
    version: string
    requestId: string
  }
}

export interface ScoreResult {
  score: number
  hasIssue: boolean
  issue?: string
}
