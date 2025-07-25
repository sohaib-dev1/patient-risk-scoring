import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "./empty-state"
import type { PatientWithScore } from "@/types/patient"

interface DataIssuesListProps {
  patients: PatientWithScore[]
  title: string
  description: string
  icon: React.ReactNode
  emptyMessage?: string
}

export function DataIssuesList({
  patients,
  title,
  description,
  icon,
  emptyMessage = "No data quality issues found",
}: DataIssuesListProps) {
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
          <div className="space-y-2">
            {patients.map((patient) => (
              <div key={patient.patient_id} className="p-3 border rounded">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-medium">{patient.patient_id}</span>
                    <span className="text-muted-foreground ml-2">{patient.name}</span>
                  </div>
                </div>
                <div className="text-sm text-yellow-600">Issues: {patient.dataIssues.join(", ")}</div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message={emptyMessage} />
        )}
      </CardContent>
    </Card>
  )
}
