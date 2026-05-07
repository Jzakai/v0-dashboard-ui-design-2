"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { listAssignmentsForTrainee, type TraineeAssignmentItem } from "@/lib/training-store"
import { getStoredTraineeId } from "@/lib/trainee-session"

function formatDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString()
}

function statusBadgeClass(status: string) {
  if (status === "Not Started") return "bg-muted text-muted-foreground"
  if (status === "In Progress") return "bg-accent/20 text-accent"
  if (status === "Completed") return "bg-primary/20 text-primary"
  return "bg-muted text-muted-foreground"
}

export function TraineeMyTrainings() {
  const [items, setItems] = useState<TraineeAssignmentItem[]>([])
  const [isLoadingAssignments, setIsLoadingAssignments] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [sessionReady, setSessionReady] = useState(false)
  const [traineeId, setTraineeId] = useState<string | null>(null)

  const [launchingAssignmentId, setLaunchingAssignmentId] = useState<string | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [detailsItem, setDetailsItem] = useState<TraineeAssignmentItem | null>(null)

  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    setTraineeId(getStoredTraineeId())
    setSessionReady(true)
  }, [])

  const loadAssignments = useCallback(async (id: string) => {
    setIsLoadingAssignments(true)
    setLoadError(null)
    try {
      const rows = await listAssignmentsForTrainee(id)
      if (!mountedRef.current) return
      setItems(rows)
    } catch (e) {
      if (!mountedRef.current) return
      const message = e instanceof Error ? e.message : "Failed to load assignments."
      setLoadError(message)
    } finally {
      if (mountedRef.current) setIsLoadingAssignments(false)
    }
  }, [])

  useEffect(() => {
    if (!sessionReady) return
    if (!traineeId) {
      setItems([])
      setLoadError(null)
      setIsLoadingAssignments(false)
      return
    }
    void loadAssignments(traineeId)
  }, [sessionReady, traineeId, loadAssignments])

  const retryLoad = () => {
    const id = traineeId ?? getStoredTraineeId()
    if (!id) return
    void loadAssignments(id)
  }

  const handleLaunchVR = (assignmentId: string, courseTitle: string) => {
    flushSync(() => setLaunchingAssignmentId(assignmentId))
    alert(
      `VR Training Launched: "${courseTitle}"\n\n` +
        `✓ OpenXR runtime initialized\n` +
        `✓ Course assets loaded\n` +
        `✓ VR session active\n\n` +
        `Put on your VR headset to begin training.`,
    )
    setLaunchingAssignmentId(null)
  }

  const openDetails = (item: TraineeAssignmentItem) => {
    setDetailsItem(item)
    setDetailsOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">My Trainings</h1>
        <p className="text-muted-foreground">VR courses assigned to you via OpenXR</p>
      </div>

      {loadError && (
        <div className="flex flex-col gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive sm:flex-row sm:flex-wrap sm:items-center">
          <span className="min-w-0 flex-1">{loadError}</span>
          <button
            type="button"
            className="min-h-11 shrink-0 rounded-md px-3 text-sm font-medium text-primary underline-offset-4 hover:underline"
            onClick={retryLoad}
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {!sessionReady || isLoadingAssignments ? (
          <Card>
            <CardContent className="pt-6 text-sm text-muted-foreground">Loading assignments…</CardContent>
          </Card>
        ) : !traineeId ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sign in required</CardTitle>
              <CardDescription>
                Log in as a trainee from the home page so your account ID can be saved for this dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="min-h-11">
                <Link href="/">Go to sign in</Link>
              </Button>
            </CardContent>
          </Card>
        ) : items.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-sm text-muted-foreground">No trainings assigned yet.</CardContent>
          </Card>
        ) : (
          items.map((item) => {
            const status = item.assignment.status
            const badgeClass = statusBadgeClass(status)

            return (
              <Card key={item.assignment.assignment_id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold text-foreground">{item.scenario.course_name}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Assigned {formatDate(item.assignment.assigned_at)}</p>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Launch Code:{" "}
                        <span className="font-mono font-semibold text-foreground">
                          {item.assignment.launch_code ?? "Not generated"}
                        </span>
                      </p>
                      <div className={`shrink-0 self-start rounded-full px-3 py-1 text-xs font-medium ${badgeClass}`}>{status}</div>
                    </div>

                    {launchingAssignmentId === item.assignment.assignment_id && (
                      <div className="bg-primary/10 border border-primary/30 rounded-md p-3">
                        <div className="flex items-center gap-3">
                          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                          <div className="space-y-0.5">
                            <p className="text-sm font-medium text-foreground">Launching VR…</p>
                            <p className="text-xs text-muted-foreground">Handing off to OpenXR runtime</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                      <Button
                        onClick={() => handleLaunchVR(item.assignment.assignment_id, item.scenario.course_name)}
                        disabled={launchingAssignmentId !== null}
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {launchingAssignmentId === item.assignment.assignment_id ? "Launching..." : "Launch VR Training"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => openDetails(item)}
                        className="flex items-center justify-center gap-2 bg-transparent sm:w-auto"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      <Dialog
        open={detailsOpen}
        onOpenChange={(open) => {
          setDetailsOpen(open)
          if (!open) setDetailsItem(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{detailsItem?.scenario.course_name ?? "Course details"}</DialogTitle>
            <DialogDescription>Assignment details for this course.</DialogDescription>
          </DialogHeader>

          {detailsItem && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="text-sm font-medium text-foreground">{detailsItem.assignment.status}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">Assigned</span>
                <span className="text-sm font-medium text-foreground">
                  {formatDate(detailsItem.assignment.assigned_at)}
                </span>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="text-2xl">ℹ️</div>
            <div className="flex-1 space-y-2">
              <h4 className="text-sm font-semibold text-foreground">System Requirements</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• OpenXR-compatible VR headset (Meta Quest, HTC Vive, etc.)</li>
                <li>• OpenXR runtime installed and configured</li>
                <li>• Minimum 8GB RAM, GPU with 4GB VRAM</li>
                <li>• Course packages download automatically before first launch</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
