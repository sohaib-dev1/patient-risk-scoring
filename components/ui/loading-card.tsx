import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RefreshCw } from "lucide-react"

interface LoadingCardProps {
  progress: number
}

export function LoadingCard({ progress }: LoadingCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Fetching patient data...</span>
          </div>
          <Progress value={progress} className="w-full" />
          <div className="text-sm text-muted-foreground space-y-1">
            <p>{Math.round(progress)}% complete</p>
            <p className="text-xs">
              • Fetching all pages (~5 patients per page, ~10 pages total)
              <br />• Handling rate limiting and intermittent failures with retries
              <br />• Processing inconsistent response formats
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
