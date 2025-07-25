import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, AlertTriangle, Thermometer, Activity } from "lucide-react"
import { FilterService } from "@/utils/filters"
import type { PatientWithScore } from "@/types/patient"

interface StatsCardsProps {
  patients: PatientWithScore[]
}

export function StatsCards({ patients }: StatsCardsProps) {
  const highRiskCount = FilterService.getHighRiskPatients(patients).length
  const feverCount = FilterService.getFeverPatients(patients).length
  const dataIssuesCount = FilterService.getDataQualityIssues(patients).length

  const stats = [
    {
      title: "Total Patients",
      value: patients.length,
      icon: Users,
      className: "text-muted-foreground",
    },
    {
      title: "High Risk",
      value: highRiskCount,
      icon: AlertTriangle,
      className: "text-destructive",
    },
    {
      title: "Fever Patients",
      value: feverCount,
      icon: Thermometer,
      className: "text-orange-500",
    },
    {
      title: "Data Issues",
      value: dataIssuesCount,
      icon: Activity,
      className: "text-yellow-500",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.className}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.className}`}>{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
