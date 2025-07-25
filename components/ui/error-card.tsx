"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface ErrorCardProps {
  error: string
  onRetry: () => void
}

export function ErrorCard({ error, onRetry }: ErrorCardProps) {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex flex-col gap-2">
        <div>
          <strong>Error:</strong> {error}
        </div>
        <div className="text-sm text-muted-foreground">
          <p>This API simulates real-world conditions with:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Rate limiting (429 errors)</li>
            <li>~8% chance of server errors (500/503)</li>
            <li>Inconsistent response formats</li>
            <li>5 patients per page pagination</li>
          </ul>
          <p className="mt-2">
            The system will automatically retry failed requests. If data is still missing, it's likely due to persistent
            API issues or pages that could not be retrieved after all retries.
          </p>
        </div>
        <Button variant="outline" size="sm" className="w-fit bg-transparent" onClick={onRetry}>
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  )
}
