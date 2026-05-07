"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getStoredTraineeId } from "@/lib/trainee-session"

type TraineeAARResult = {
  id: string
  assignment_id?: string | null
  scenario_id?: string | null
  trainee_id?: string | null
  course_name?: string | null

  final_score: number
  sequence_accuracy: number
  speed_score: number
  completion_time: number

  selected_actions?: string[]
  expected_actions?: string[]
  action_timestamps?: number[]

  created_at: string
}

function formatDuration(seconds: number) {
  if (seconds === null || seconds === undefined) return "--"

  const mins = Math.floor(seconds / 60)
  const secs = Math.round(seconds % 60)

  if (mins === 0) return `${secs}s`
  return `${mins}m ${secs}s`
}

function formatDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString()
}

export function TraineeMyResults() {
  const [selectedCourse, setSelectedCourse] = useState("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [expandedResult, setExpandedResult] = useState<string | null>(null)

  const [traineeId, setTraineeId] = useState<string | null>(null)
  const [results, setResults] = useState<TraineeAARResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

  useEffect(() => {
    const storedTraineeId = getStoredTraineeId()

    if (!storedTraineeId) {
      setError("No signed-in trainee found.")
      setLoading(false)
      return
    }

    setTraineeId(storedTraineeId)
  }, [])

  useEffect(() => {
    if (!traineeId) return

    async function loadResults() {
      try {
        setLoading(true)
        setError("")

        const res = await fetch(`${API_BASE_URL}/aar/results/trainee/${traineeId}`)

        if (!res.ok) {
          throw new Error(`Failed to fetch trainee results: ${res.status}`)
        }

        const data = await res.json()
        setResults(data.results || [])
      } catch (err) {
        console.error(err)
        setError("Unable to load your AAR results.")
      } finally {
        setLoading(false)
      }
    }

    void loadResults()
  }, [traineeId, API_BASE_URL])

  const filteredResults = useMemo(() => {
    return results.filter((result) => {
      const resultDate = result.created_at ? result.created_at.slice(0, 10) : ""

      const matchesCourse =
        !selectedCourse ||
        (result.course_name || "")
          .toLowerCase()
          .includes(selectedCourse.toLowerCase())

      const matchesFromDate = !fromDate || resultDate >= fromDate
      const matchesToDate = !toDate || resultDate <= toDate

      return matchesCourse && matchesFromDate && matchesToDate
    })
  }, [results, selectedCourse, fromDate, toDate])

  const courseOptions = Array.from(
    new Set(results.map((r) => r.course_name).filter(Boolean))
  ) as string[]

  const toggleAARDetails = (id: string) => {
    setExpandedResult(expandedResult === id ? null : id)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">My Results</h1>
        <p className="text-muted-foreground">
          After-Action Review (AAR) and performance history
        </p>
      </div>

      {loading && (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Loading your results...
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-destructive/40">
          <CardContent className="pt-6 text-sm text-destructive">
            {error}
          </CardContent>
        </Card>
      )}

      {!loading && !error && filteredResults.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            No completed training results found yet.
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {filteredResults.map((result) => (
          <Card key={result.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-lg">
                    {result.course_name || "Unknown Course"}
                  </CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Completed on {formatDate(result.created_at)}
                  </p>
                </div>

                <div
                  className={`shrink-0 self-start rounded-lg px-4 py-2 text-center text-lg font-semibold sm:self-auto ${
                    result.final_score >= 90
                      ? "bg-primary/20 text-primary"
                      : result.final_score >= 80
                        ? "bg-accent/20 text-accent"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {result.final_score}%
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-foreground sm:text-2xl">
                    {formatDuration(result.completion_time)}
                  </div>
                  <div className="text-xs text-muted-foreground">Duration</div>
                </div>

                <div className="text-center">
                  <div className="text-xl font-bold text-foreground sm:text-2xl">
                    {result.sequence_accuracy}%
                  </div>
                  <div className="text-xs text-muted-foreground">Sequence Accuracy</div>
                </div>

                <div className="text-center">
                  <div className="text-xl font-bold text-foreground sm:text-2xl">
                    {result.speed_score}%
                  </div>
                  <div className="text-xs text-muted-foreground">Speed Score</div>
                </div>

                <div className="text-center">
                  <div
                    className={`text-xl font-bold sm:text-2xl ${
                      result.sequence_accuracy >= 70 ? "text-primary" : "text-destructive"
                    }`}
                  >
                    {result.sequence_accuracy >= 70 ? "Pass" : "Review"}
                  </div>
                  <div className="text-xs text-muted-foreground">Status</div>
                </div>
              </div>

              {expandedResult === result.id && (
                <div className="space-y-4 border-t border-border pt-4">
                  <div>
                    <h4 className="mb-2 text-sm font-semibold text-foreground">
                      Action Timeline
                    </h4>

                    <div className="space-y-2">
                      {(result.selected_actions || []).map((action, index) => {
                        const expected = result.expected_actions?.[index]
                        const timestamp = result.action_timestamps?.[index]
                        const isCorrect = action === expected

                        return (
                          <div key={`${result.id}-${index}`} className="flex items-start gap-3">
                            <div
                              className={`mt-1 h-2 w-2 rounded-full ${
                                isCorrect ? "bg-primary" : "bg-destructive"
                              }`}
                            />

                            <div className="flex-1 text-sm">
                              <p className="text-foreground">
                                <span className="font-semibold">Selected:</span> {action}
                              </p>

                              {expected && (
                                <p className="text-xs text-muted-foreground">
                                  Expected: {expected}
                                </p>
                              )}

                              {timestamp !== undefined && (
                                <p className="text-xs text-muted-foreground">
                                  Time: {timestamp.toFixed(1)}s
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="rounded-lg bg-muted/50 p-4">
                    <h4 className="mb-2 text-sm font-semibold text-foreground">
                      System Feedback
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Final Score: {result.final_score}%. Sequence Accuracy:{" "}
                      {result.sequence_accuracy}%. Completion Time:{" "}
                      {formatDuration(result.completion_time)}.
                    </p>
                  </div>
                </div>
              )}

              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => toggleAARDetails(result.id)}
              >
                {expandedResult === result.id ? "Hide" : "View"} Detailed AAR
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Results</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Course</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="min-h-11 w-full rounded-md border border-border bg-input px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Courses</option>
                {courseOptions.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">From Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="min-h-11 w-full rounded-md border border-border bg-input px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="min-h-11 w-full rounded-md border border-border bg-input px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}