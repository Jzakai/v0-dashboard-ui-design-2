"use client"

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "lucide-react"
import { createAssignments, listScenarios, listUsers, type Scenario, type User } from "@/lib/training-store"
import { cn } from "@/lib/utils"

export function AdminAssignCourses() {
  const UI_VERSION = "admin-assign-courses-2026-04-16-1"
  const [traineeNameFilter, setTraineeNameFilter] = useState("")
  const [selectedTrainees, setSelectedTrainees] = useState<string[]>([])

  const [trainees, setTrainees] = useState<User[]>([])
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [selectedScenarioId, setSelectedScenarioId] = useState("")
  const [startDate, setStartDate] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [startDateError, setStartDateError] = useState("")
  const [dueDateError, setDueDateError] = useState("")
  const [isAssigning, setIsAssigning] = useState(false)

  const startDateRef = useRef<HTMLInputElement | null>(null)
  const dueDateRef = useRef<HTMLInputElement | null>(null)

  const hasValidationErrors = Boolean(startDateError || dueDateError)

  /** String compare on YYYY-MM-DD matches calendar order; blocks submit if values ever desync from handler state. */
  const hasInvalidDateValues = useMemo(() => {
    const todayIso = new Date().toISOString().split("T")[0]
    if (startDate && startDate < todayIso) return true
    if (dueDate && dueDate < todayIso) return true
    if (startDate && dueDate && dueDate <= startDate) return true
    return false
  }, [startDate, dueDate])

  const cannotAssignDates = hasValidationErrors || hasInvalidDateValues

  const handleStartDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (!value) {
      setStartDate("")
      setStartDateError("")
      return
    }
    const selectedDate = new Date(value)
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    selectedDate.setHours(0, 0, 0, 0)
    if (selectedDate < todayStart) {
      setStartDateError("Start date cannot be in the past")
      setStartDate("")
      return
    }
    setStartDateError("")
    setStartDate(value)
    if (dueDate && value && dueDate <= value) {
      setDueDate("")
      setDueDateError("Due date must be after start date")
    } else {
      setDueDateError("")
    }
  }

  const handleDueDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (!value) {
      setDueDate("")
      setDueDateError("")
      return
    }
    const selectedDate = new Date(value)
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    selectedDate.setHours(0, 0, 0, 0)
    if (selectedDate < todayStart) {
      setDueDateError("Due date cannot be in the past")
      setDueDate("")
      return
    }
    if (startDate) {
      const startD = new Date(startDate)
      startD.setHours(0, 0, 0, 0)
      if (selectedDate <= startD) {
        setDueDateError("Due date must be after start date")
        setDueDate("")
        return
      }
    }
    setDueDateError("")
    setDueDate(value)
  }

  const filteredTrainees = useMemo(() => {
    const needle = traineeNameFilter.trim().toLowerCase()
    if (!needle) return trainees
    return trainees.filter((t) => t.name.toLowerCase().includes(needle))
  }, [traineeNameFilter, trainees])

  const selectedScenario = useMemo(
    () => scenarios.find((s) => s.scenario_id === selectedScenarioId) ?? null,
    [scenarios, selectedScenarioId],
  )

  const load = async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      const [users, scenarioRows] = await Promise.all([listUsers(), listScenarios()])
      setTrainees(users)
      setScenarios(scenarioRows)
      console.log("[AdminAssignCourses] listScenarios() ->", scenarioRows)
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to load trainees/courses."
      setLoadError(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleTrainee = (userId: string) => {
    setSelectedTrainees((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const handleAssignCourse = async () => {
    if (selectedTrainees.length === 0 || !selectedScenarioId) {
      alert("Please select at least one trainee and a course before assigning.")
      return
    }

    if (cannotAssignDates) {
      alert(
        startDateError ||
          dueDateError ||
          (hasInvalidDateValues ? "Please correct the start and due dates before assigning." : "") ||
          "Please fix date validation errors.",
      )
      return
    }

    setIsAssigning(true)
    try {
      await createAssignments({
        traineeIds: selectedTrainees,
        scenarioId: selectedScenarioId,
        status: "Not Started",
        startDate: startDate || undefined,
        dueDate: dueDate || undefined,
      })

      const selectedNames = trainees
        .filter((t) => selectedTrainees.includes(t.user_id))
        .map((t) => t.name)
        .join(", ")

      alert(
        `✓ Course assigned successfully!\n\n` +
          `Course: ${selectedScenario?.course_name ?? selectedScenarioId}\n` +
          `Trainees: ${selectedNames}\n` +
          (startDate ? `Start: ${startDate}\n` : "") +
          (dueDate ? `Due: ${dueDate}\n` : ""),
      )

      setSelectedTrainees([])
      setSelectedScenarioId("")
      setStartDate("")
      setDueDate("")
      setStartDateError("")
      setDueDateError("")
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to assign course."
      alert(`Assignment failed: ${message}`)
    } finally {
      setIsAssigning(false)
    }
  }

  return (
    <div key={UI_VERSION} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Assign Courses</h1>
        <p className="text-muted-foreground">Assign VR courses to trainees with notifications</p>
      </div>

      {loadError && (
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle>Couldn’t load data</CardTitle>
            <CardDescription className="text-destructive">{loadError}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={load} disabled={isLoading}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
        {/* Left Column - Trainee List */}
        <Card>
          <CardHeader>
            <CardTitle>Trainee List</CardTitle>
            <CardDescription>
              {selectedTrainees.length > 0 ? `${selectedTrainees.length} selected` : "Select trainees"}
            </CardDescription>
            <CardDescription>
              {selectedTrainees.length > 0 ? `${selectedTrainees.length} selected` : "Select trainees"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Search by name…"
                value={traineeNameFilter}
                onChange={(e) => setTraineeNameFilter(e.target.value)}
                disabled={isLoading || isAssigning}
                className="min-h-11 w-full rounded-md border border-border bg-input px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 font-medium text-foreground">
                      <Checkbox
                        checked={filteredTrainees.length > 0 && selectedTrainees.length === filteredTrainees.length}
                        onCheckedChange={(checked) => {
                          if (!checked) {
                            setSelectedTrainees([])
                            return
                          }
                          setSelectedTrainees(filteredTrainees.map((t) => t.user_id))
                        }}
                        disabled={isLoading || isAssigning || filteredTrainees.length === 0}
                      />
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-foreground">Name</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={2} className="py-6 px-2 text-muted-foreground">
                        Loading trainees…
                      </td>
                    </tr>
                  ) : filteredTrainees.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="py-6 px-2 text-muted-foreground">
                        No trainees found.
                      </td>
                    </tr>
                  ) : (
                    filteredTrainees.map((trainee) => (
                      <tr key={trainee.user_id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-2">
                        <Checkbox
                          checked={selectedTrainees.includes(trainee.user_id)}
                          onCheckedChange={() => toggleTrainee(trainee.user_id)}
                          disabled={isAssigning}
                        />
                      </td>
                      <td className="py-3 px-2 text-foreground">{trainee.name}</td>
                    </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Assignment Details */}
        <Card>
          <CardHeader>
            <CardTitle>Assignment Details</CardTitle>
            <CardDescription>Course and timeline configuration</CardDescription>
            <CardDescription>Course and timeline configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Skill Category</label>
              <select
                value={selectedScenarioId}
                onChange={(e) => setSelectedScenarioId(e.target.value)}
                disabled={isLoading || isAssigning}
                className="min-h-11 w-full rounded-md border border-border bg-input px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              >
                <option value="">Select a course</option>
                {scenarios.map((s) => (
                  <option key={s.scenario_id} value={s.scenario_id}>
                    {(s.course_name?.trim() || "Untitled Scenario")}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Start Date</label>
              <div className="relative">
                <input
                  ref={startDateRef}
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={startDate}
                  onChange={handleStartDateChange}
                  disabled={isAssigning || isLoading}
                  aria-invalid={startDateError ? true : undefined}
                  aria-describedby="assign-start-date-hint"
                  className={cn(
                    "min-h-11 w-full appearance-none rounded-md border bg-input px-4 py-2.5 pr-10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 [&::-webkit-calendar-picker-indicator]:pointer-events-none [&::-webkit-calendar-picker-indicator]:opacity-0",
                    startDateError ? "border-destructive ring-destructive/30 ring-2" : "border-border",
                  )}
                />
                <button
                  type="button"
                  aria-label="Open start date picker"
                  className="absolute inset-y-0 right-1 flex min-h-11 min-w-11 items-center justify-center rounded-md text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  onClick={() => {
                    const el = startDateRef.current
                    if (!el) return
                    if (typeof el.showPicker === "function") el.showPicker()
                    else el.focus()
                  }}
                  disabled={isAssigning || isLoading}
                >
                  <Calendar className="h-4 w-4" />
                </button>
              </div>
              {startDateError ? (
                <p
                  role="alert"
                  aria-live="polite"
                  className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm font-medium leading-snug text-destructive"
                >
                  {startDateError}
                </p>
              ) : null}
              <p id="assign-start-date-hint" className="text-xs leading-relaxed text-muted-foreground">
                Past dates are disabled
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Due Date</label>
              <div className="relative">
                <input
                  ref={dueDateRef}
                  type="date"
                  min={startDate || new Date().toISOString().split("T")[0]}
                  value={dueDate}
                  onChange={handleDueDateChange}
                  disabled={isAssigning || isLoading}
                  aria-invalid={dueDateError ? true : undefined}
                  aria-describedby="assign-due-date-hint"
                  className={cn(
                    "min-h-11 w-full appearance-none rounded-md border bg-input px-4 py-2.5 pr-10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 [&::-webkit-calendar-picker-indicator]:pointer-events-none [&::-webkit-calendar-picker-indicator]:opacity-0",
                    dueDateError ? "border-destructive ring-destructive/30 ring-2" : "border-border",
                  )}
                />
                <button
                  type="button"
                  aria-label="Open due date picker"
                  className="absolute inset-y-0 right-1 flex min-h-11 min-w-11 items-center justify-center rounded-md text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  onClick={() => {
                    const el = dueDateRef.current
                    if (!el) return
                    if (typeof el.showPicker === "function") el.showPicker()
                    else el.focus()
                  }}
                  disabled={isAssigning || isLoading}
                >
                  <Calendar className="h-4 w-4" />
                </button>
              </div>
              {dueDateError ? (
                <p
                  role="alert"
                  aria-live="polite"
                  className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm font-medium leading-snug text-destructive"
                >
                  {dueDateError}
                </p>
              ) : null}
              <p id="assign-due-date-hint" className="text-xs leading-relaxed text-muted-foreground">
                Past dates are disabled
              </p>
            </div>

            {isAssigning && (
              <div className="bg-primary/10 border border-primary/30 rounded-md p-4">
                <div className="flex items-center gap-3">
                  <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">Assigning course...</p>
                    <p className="text-xs text-muted-foreground">Creating assignments in the database</p>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={handleAssignCourse}
              disabled={
                isLoading ||
                isAssigning ||
                cannotAssignDates ||
                selectedTrainees.length === 0 ||
                !selectedScenarioId
              }
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-6"
            >
              {isAssigning ? "Assigning..." : "Assign to Selected Trainees"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
  
}
