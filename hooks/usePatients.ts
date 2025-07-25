"use client"

import { useState, useEffect } from "react"
import { ApiService } from "@/services/api"
import { ScoringService } from "@/utils/scoring"
import type { PatientWithScore } from "@/types/patient"

export function usePatients() {
  const [patients, setPatients] = useState<PatientWithScore[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [fetchComplete, setFetchComplete] = useState(false)

  const fetchAllPatients = async () => {
    setLoading(true)
    setError(null)
    setProgress(0)
    setFetchComplete(false)

    try {
      console.log("Hook: Starting to fetch patients...")
      const rawPatients = await ApiService.fetchAllPatients(setProgress)

      if (!rawPatients || !Array.isArray(rawPatients)) {
        throw new Error("Invalid patient data received from API")
      }

      console.log(`Hook: Processing ${rawPatients.length} patients...`)

      // Process patients with error handling
      const processedPatients: PatientWithScore[] = []

      for (let i = 0; i < rawPatients.length; i++) {
        const patient = rawPatients[i]
        try {
          if (!patient || typeof patient !== "object") {
            console.warn(`Skipping invalid patient at index ${i}:`, patient)
            continue
          }

          const processedPatient = ScoringService.processPatient(patient)
          processedPatients.push(processedPatient)
        } catch (processingError) {
          console.error(`Error processing patient at index ${i}:`, patient, processingError)
          // Create a fallback patient record
          const fallbackPatient: PatientWithScore = {
            patient_id: patient.patient_id || `UNKNOWN_${i}`,
            name: patient.name || "Unknown Patient",
            age: patient.age || "Unknown",
            gender: patient.gender || "Unknown",
            blood_pressure: patient.blood_pressure || "Unknown",
            temperature: patient.temperature || "Unknown",
            visit_date: patient.visit_date || "Unknown",
            diagnosis: patient.diagnosis || "Unknown",
            medications: patient.medications || "Unknown",
            bpScore: 0,
            tempScore: 0,
            ageScore: 0,
            totalScore: 0,
            hasDataIssues: true,
            dataIssues: ["Processing error"],
          }
          processedPatients.push(fallbackPatient)
        }
      }

      console.log(`Hook: Successfully processed ${processedPatients.length} patients`)
      setPatients(processedPatients)
      setFetchComplete(true)
    } catch (err) {
      console.error("Hook: Error fetching patients:", err)
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => {
    console.log("Hook: Refetching patients...")
    fetchAllPatients()
  }

  useEffect(() => {
    fetchAllPatients()
  }, [])

  return {
    patients,
    loading,
    error,
    progress,
    fetchComplete,
    refetch,
  }
}
