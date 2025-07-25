import { CheckCircle } from "lucide-react"

interface EmptyStateProps {
  message: string
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="text-center py-8 text-muted-foreground">
      <CheckCircle className="h-8 w-8 mx-auto mb-2" />
      {message}
    </div>
  )
}
