export const API_CONFIG = {
  BASE_URL: "https://assessment.ksensetech.com/api",
  API_KEY: "ak_d9d2930d36e4d57d38a7f5a8653cf593f35b13dd2b6731a5",
  DEFAULT_LIMIT: 5,
  MAX_RETRIES: 5, // Increased from 3 to 5 for more resilience against intermittent failures
} as const

export const RISK_THRESHOLDS = {
  HIGH_RISK_SCORE: 4,
  FEVER_TEMPERATURE: 99.6,
  HIGH_FEVER_TEMPERATURE: 101.0,
  NORMAL_TEMPERATURE: 99.5,
} as const

export const SCORING_CRITERIA = {
  BLOOD_PRESSURE: {
    NORMAL: { min: { systolic: 0, diastolic: 0 }, max: { systolic: 119, diastolic: 79 }, score: 1 },
    ELEVATED: { min: { systolic: 120, diastolic: 0 }, max: { systolic: 129, diastolic: 79 }, score: 2 },
    STAGE_1: { min: { systolic: 130, diastolic: 80 }, max: { systolic: 139, diastolic: 89 }, score: 3 },
    STAGE_2: { min: { systolic: 140, diastolic: 90 }, max: { systolic: 999, diastolic: 999 }, score: 4 },
  },
  TEMPERATURE: {
    NORMAL: { max: 99.5, score: 0 },
    LOW_FEVER: { min: 99.6, max: 100.9, score: 1 },
    HIGH_FEVER: { min: 101.0, score: 2 },
  },
  AGE: {
    UNDER_40: { max: 39, score: 1 },
    MIDDLE_AGE: { min: 40, max: 65, score: 1 },
    OVER_65: { min: 66, score: 2 },
  },
} as const
