"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const resultsData = [
  {
    id: 1,
    course: "Hemorrhage Control – Urban",
    score: 92,
    duration: "4m 32s",
    criticalErrors: 0,
    kpis: {
      tourniquetTime: 52,
      tourniquetTarget: 60,
      marchCompliance: 95,
      decisionAccuracy: 90,
    },
    date: "2025-01-10",
    status: "Pass",
    feedback: "Excellent tourniquet application under pressure. Consider faster initial assessment.",
  },
  {
    id: 2,
    course: "Chest Injury Response",
    score: 85,
    duration: "5m 15s",
    criticalErrors: 1,
    kpis: {
      chestSealTime: 68,
      chestSealTarget: 60,
      marchCompliance: 82,
      decisionAccuracy: 88,
    },
    date: "2025-01-08",
    status: "Pass",
    feedback: "Good response to chest trauma. Chest seal application was slightly delayed.",
  },
  {
    id: 3,
    course: "Shock Management",
    score: 88,
    duration: "3m 48s",
    criticalErrors: 0,
    kpis: {
      ivAccessTime: 95,
      ivAccessTarget: 90,
      marchCompliance: 90,
      decisionAccuracy: 85,
    },
    date: "2025-01-05",
    status: "Pass",
    feedback: "Strong performance in shock assessment. IV access established efficiently.",
  },
]

export function TraineeMyResults() {
  const [selectedCourse, setSelectedCourse] = useState("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [expandedResult, setExpandedResult] = useState<number | null>(null)

  const toggleAARDetails = (id: number) => {
    setExpandedResult(expandedResult === id ? null : id)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Results</h1>
        <p className="text-muted-foreground">After-Action Review (AAR) and performance history</p>
      </div>

      <div className="space-y-4">
        {resultsData.map((result) => (
          <Card key={result.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{result.course}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Completed on {result.date}</p>
                </div>
                <div
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    result.score >= 90
                      ? "bg-primary/20 text-primary"
                      : result.score >= 80
                        ? "bg-accent/20 text-accent"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {result.score}%
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{result.duration}</div>
                  <div className="text-xs text-muted-foreground">Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{result.kpis.marchCompliance}%</div>
                  <div className="text-xs text-muted-foreground">MARCH Compliance</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{result.kpis.decisionAccuracy}%</div>
                  <div className="text-xs text-muted-foreground">Decision Accuracy</div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${result.criticalErrors === 0 ? "text-primary" : "text-destructive"}`}
                  >
                    {result.criticalErrors}
                  </div>
                  <div className="text-xs text-muted-foreground">Critical Errors</div>
                </div>
              </div>

              {expandedResult === result.id && (
                <div className="space-y-4 pt-4 border-t border-border">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Action Timeline</h4>
                    <div className="space-y-2">
                      {Object.entries(result.kpis)
                        .filter(([key]) => key.includes("Time"))
                        .map(([key, value]) => {
                          const targetKey = key.replace("Time", "Target")
                          const target = result.kpis[targetKey as keyof typeof result.kpis]
                          const label = key
                            .replace("Time", "")
                            .replace(/([A-Z])/g, " $1")
                            .trim()
                          const isOnTarget = value <= target

                          return (
                            <div key={key} className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${isOnTarget ? "bg-primary" : "bg-accent"}`}></div>
                              <div className="flex-1 text-sm text-foreground">
                                {label}: <span className="font-semibold">{value}s</span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Target: ≤{target}s {isOnTarget ? "✓" : "⚠️"}
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-foreground mb-2">Instructor Feedback</h4>
                    <p className="text-sm text-muted-foreground">{result.feedback}</p>
                  </div>
                </div>
              )}

              <Button variant="outline" className="w-full bg-transparent" onClick={() => toggleAARDetails(result.id)}>
                {expandedResult === result.id ? "Hide" : "View"} Detailed AAR
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters Card */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Course</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Courses</option>
                <option>Hemorrhage Control – Urban</option>
                <option>Chest Injury Response</option>
                <option>Shock Management</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">From Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
