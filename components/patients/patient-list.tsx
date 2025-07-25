import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PatientCard } from "./patient-card"
import { EmptyState } from "./empty-state"
import type { PatientWithScore } from "@/types/patient"

interface PatientListProps {
  patients: PatientWithScore[]
  title: string
  description: string
  icon?: React.ReactNode
  emptyMessage?: string
}

export function PatientList({
  patients,
  title,
  description,
  icon,
  emptyMessage = "No patients found",
}: PatientListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title} ({patients.length})
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {patients.length > 0 ? (
          <div className="space-y-4">
            {patients.map((patient) => (
              <PatientCard key={patient.patient_id} patient={patient} />
            ))}
          </div>
        ) : (
          <EmptyState message={emptyMessage} />
        )}
      </CardContent>
    </Card>
  )
}
