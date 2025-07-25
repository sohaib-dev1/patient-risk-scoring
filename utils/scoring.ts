import { RISK_THRESHOLDS } from "@/constants/api"
import type { Patient, PatientWithScore, ScoreResult } from "@/types/patient"

export class ScoringService {
  static calculateBPScore(bp: string): ScoreResult {
    if (!bp || bp === null || bp === undefined || bp === "") {
      return { score: 0, hasIssue: true, issue: "Missing blood pressure" }
    }

    if (typeof bp !== "string") {
      return { score: 0, hasIssue: true, issue: "Invalid blood pressure format" }
    }

    const bpParts = bp.split("/")
    if (bpParts.length !== 2) {
      return { score: 0, hasIssue: true, issue: "Invalid blood pressure format" }
    }

    const systolic = Number.parseInt(bpParts[0])
    const diastolic = Number.parseInt(bpParts[1])

    if (isNaN(systolic) || isNaN(diastolic) || bpParts[0] === "" || bpParts[1] === "") {
      return { score: 0, hasIssue: true, issue: "Invalid blood pressure values" }
    }

    // Determine risk category for each reading
    let systolicRisk = 1
    let diastolicRisk = 1

    // Systolic risk
    if (systolic >= 140) systolicRisk = 4
    else if (systolic >= 130) systolicRisk = 3
    else if (systolic >= 120) systolicRisk = 2
    else systolicRisk = 1

    // Diastolic risk
    if (diastolic >= 90) diastolicRisk = 4
    else if (diastolic >= 80) diastolicRisk = 3
    else diastolicRisk = 1

    // Use higher risk stage
    const score = Math.max(systolicRisk, diastolicRisk)
    return { score, hasIssue: false }
  }

  static calculateTempScore(temp: number | string): ScoreResult {
    if (temp === null || temp === undefined || temp === "") {
      return { score: 0, hasIssue: true, issue: "Missing temperature" }
    }

    const tempNum = typeof temp === "string" ? Number.parseFloat(temp) : temp

    if (isNaN(tempNum)) {
      return { score: 0, hasIssue: true, issue: "Invalid temperature value" }
    }

    if (tempNum >= RISK_THRESHOLDS.HIGH_FEVER_TEMPERATURE) return { score: 2, hasIssue: false }
    if (tempNum >= RISK_THRESHOLDS.FEVER_TEMPERATURE) return { score: 1, hasIssue: false }
    return { score: 0, hasIssue: false }
  }

  static calculateAgeScore(age: number | string): ScoreResult {
    if (age === null || age === undefined || age === "") {
      return { score: 0, hasIssue: true, issue: "Missing age" }
    }

    const ageNum = typeof age === "string" ? Number.parseInt(age) : age

    if (isNaN(ageNum)) {
      return { score: 0, hasIssue: true, issue: "Invalid age value" }
    }

    if (ageNum > 65) return { score: 2, hasIssue: false }
    if (ageNum >= 40) return { score: 1, hasIssue: false }
    return { score: 1, hasIssue: false }
  }

  static processPatient(patient: Patient): PatientWithScore {
    const bpResult = this.calculateBPScore(patient.blood_pressure)
    const tempResult = this.calculateTempScore(patient.temperature)
    const ageResult = this.calculateAgeScore(patient.age)

    const dataIssues: string[] = []
    if (bpResult.hasIssue && bpResult.issue) dataIssues.push(bpResult.issue)
    if (tempResult.hasIssue && tempResult.issue) dataIssues.push(tempResult.issue)
    if (ageResult.hasIssue && ageResult.issue) dataIssues.push(ageResult.issue)

    return {
      ...patient,
      bpScore: bpResult.score,
      tempScore: tempResult.score,
      ageScore: ageResult.score,
      totalScore: bpResult.score + tempResult.score + ageResult.score,
      hasDataIssues: dataIssues.length > 0,
      dataIssues,
    }
  }
}

// Also export as default for alternative import syntax
export default ScoringService
