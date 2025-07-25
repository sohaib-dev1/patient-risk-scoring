"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Thermometer, Activity } from "lucide-react"

import { usePatients } from "@/hooks/usePatients"
import { FilterService } from "@/utils/filters"

import { LoadingCard } from "@/components/ui/loading-card"
import { ErrorCard } from "@/components/ui/error-card"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { ScoringCriteria } from "@/components/dashboard/scoring-criteria"
import { PatientList } from "@/components/patients/patient-list"
import { AlertList } from "@/components/patients/alert-list"
import { DataIssuesList } from "@/components/patients/data-issues-list"

export default function PatientRiskScoring() {
  const { patients, loading, error, progress, fetchComplete, refetch } = usePatients()

  const highRiskPatients = FilterService.getHighRiskPatients(patients)
  const feverPatients = FilterService.getFeverPatients(patients)
  const dataQualityIssues = FilterService.getDataQualityIssues(patients)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Patient Risk Scoring System</h1>
        <p className="text-muted-foreground">
          Comprehensive risk assessment based on blood pressure, temperature, and age
        </p>
      </div>

      {loading && <LoadingCard progress={progress} />}

      {error && <ErrorCard error={error} onRetry={refetch} />}

      {fetchComplete && (
        <>
          <StatsCards patients={patients} />

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Patients</TabsTrigger>
              <TabsTrigger value="high-risk">High Risk</TabsTrigger>
              <TabsTrigger value="fever">Fever</TabsTrigger>
              <TabsTrigger value="data-issues">Data Issues</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <PatientList
                patients={patients}
                title="All Patients"
                description="Complete patient list with risk scores"
              />
            </TabsContent>

            <TabsContent value="high-risk" className="space-y-4">
              <AlertList
                patients={highRiskPatients}
                title="High-Risk Patients"
                description="Patients with total risk score ≥ 4"
                icon={<AlertTriangle className="h-5 w-5 text-destructive" />}
                badgeVariant="destructive"
                badgeContent={(patient) => `Score: ${patient.totalScore}`}
                emptyMessage="No high-risk patients found"
              />
            </TabsContent>

            <TabsContent value="fever" className="space-y-4">
              <AlertList
                patients={feverPatients}
                title="Fever Patients"
                description="Patients with temperature ≥ 99.6°F"
                icon={<Thermometer className="h-5 w-5 text-orange-500" />}
                badgeVariant="secondary"
                badgeContent={(patient) => `${patient.temperature}°F`}
                emptyMessage="No fever patients found"
              />
            </TabsContent>

            <TabsContent value="data-issues" className="space-y-4">
              <DataIssuesList
                patients={dataQualityIssues}
                title="Data Quality Issues"
                description="Patients with invalid or missing data"
                icon={<Activity className="h-5 w-5 text-yellow-500" />}
                emptyMessage="No data quality issues found"
              />
            </TabsContent>
          </Tabs>

          <ScoringCriteria />
        </>
      )}
    </div>
  )
}
