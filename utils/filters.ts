import { RISK_THRESHOLDS } from "@/constants/api"
import type { PatientWithScore } from "@/types/patient"

export class FilterService {
  static getHighRiskPatients(patients: PatientWithScore[]): PatientWithScore[] {
    // Filter for patients with a total risk score >= 4 AND no data quality issues
    return patients.filter((p) => p.totalScore >= RISK_THRESHOLDS.HIGH_RISK_SCORE && !p.hasDataIssues)
  }

  static getFeverPatients(patients: PatientWithScore[]): PatientWithScore[] {
    return patients.filter((p) => {
      const temp = typeof p.temperature === "string" ? Number.parseFloat(p.temperature) : p.temperature
      return !isNaN(temp) && temp >= RISK_THRESHOLDS.FEVER_TEMPERATURE
    })
  }

  static getDataQualityIssues(patients: PatientWithScore[]): PatientWithScore[] {
    return patients.filter((p) => p.hasDataIssues)
  }

  static getRiskBadgeVariant(score: number): "default" | "secondary" | "destructive" {
    if (score >= 4) return "destructive"
    if (score >= 3) return "secondary"
    return "default"
  }
}
