import { Badge } from "@/components/ui/badge"
import { FilterService } from "@/utils/filters"
import type { PatientWithScore } from "@/types/patient"

interface PatientCardProps {
  patient: PatientWithScore
}

export function PatientCard({ patient }: PatientCardProps) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold">{patient.name}</h3>
          <p className="text-sm text-muted-foreground">ID: {patient.patient_id}</p>
        </div>
        <Badge variant={FilterService.getRiskBadgeVariant(patient.totalScore)}>Risk Score: {patient.totalScore}</Badge>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <span className="font-medium">Age:</span> {patient.age}
          <span className="text-muted-foreground"> ({patient.ageScore}pt)</span>
        </div>
        <div>
          <span className="font-medium">BP:</span> {patient.blood_pressure}
          <span className="text-muted-foreground"> ({patient.bpScore}pt)</span>
        </div>
        <div>
          <span className="font-medium">Temp:</span> {patient.temperature}°F
          <span className="text-muted-foreground"> ({patient.tempScore}pt)</span>
        </div>
        <div>
          <span className="font-medium">Visit:</span> {patient.visit_date}
        </div>
      </div>
      {patient.hasDataIssues && (
        <div className="mt-2">
          <Badge variant="outline" className="text-yellow-600">
            Data Issues: {patient.dataIssues.join(", ")}
          </Badge>
        </div>
      )}
    </div>
  )
}
