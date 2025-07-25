import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ScoringCriteria() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Scoring Criteria</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Blood Pressure Risk</h4>
            <ul className="text-sm space-y-1">
              <li>Normal ({"<120 AND <80"}): 1 point</li>
              <li>Elevated (120-129 AND {"<80"}): 2 points</li>
              <li>Stage 1 (130-139 OR 80-89): 3 points</li>
              <li>Stage 2 ({"≥140 OR ≥90"}): 4 points</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Temperature Risk</h4>
            <ul className="text-sm space-y-1">
              <li>Normal ({"≤99.5°F"}): 0 points</li>
              <li>Low Fever (99.6-100.9°F): 1 point</li>
              <li>High Fever ({"≥101.0°F"}): 2 points</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Age Risk</h4>
            <ul className="text-sm space-y-1">
              <li>Under 40: 1 point</li>
              <li>40-65: 1 point</li>
              <li>Over 65: 2 points</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
