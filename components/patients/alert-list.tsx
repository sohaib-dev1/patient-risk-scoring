import type React from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "./empty-state"
import type { PatientWithScore } from "@/types/patient"

interface AlertListProps {
  patients: PatientWithScore[]
  title: string
  description: string
  icon: React.ReactNode
  badgeVariant?: "default" | "secondary" | "destructive"
  badgeContent: (patient: PatientWithScore) => string
  emptyMessage?: string
}

export function AlertList({
  patients,
  title,
  description,
  icon,
  badgeVariant = "secondary",
  badgeContent,
  emptyMessage = "No patients found",
}: AlertListProps) {
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
              <div key={patient.patient_id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <span className="font-medium">{patient.patient_id}</span>
                  <span className="text-muted-foreground ml-2">{patient.name}</span>
                </div>
                <Badge variant={badgeVariant}>{badgeContent(patient)}</Badge>
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
