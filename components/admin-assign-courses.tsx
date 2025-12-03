"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

const trainees = [
  { id: 1, name: "John Smith", role: "Soldier", unit: "Alpha Team", assigned: 2 },
  { id: 2, name: "Sarah Johnson", role: "Medic", unit: "Bravo Team", assigned: 3 },
  { id: 3, name: "Mike Davis", role: "Soldier", unit: "Charlie Team", assigned: 1 },
  { id: 4, name: "Emily White", role: "Medic", unit: "Delta Team", assigned: 2 },
]

export function AdminAssignCourses() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTrainees, setSelectedTrainees] = useState<number[]>([])
  const [course, setCourse] = useState("")
  const [startDate, setStartDate] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [isAssigning, setIsAssigning] = useState(false)

  const toggleTrainee = (id: number) => {
    setSelectedTrainees((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]))
  }

  const handleAssignCourse = () => {
    if (selectedTrainees.length === 0 || !course || !startDate || !dueDate) {
      alert("Please select trainees, course, and dates before assigning.")
      return
    }

    console.log("[v0] Admin: Select trainees and course")
    console.log("[v0] Selected trainees:", selectedTrainees)
    console.log("[v0] Course:", course)

    setIsAssigning(true)

    // Simulate system assignment process
    setTimeout(() => {
      console.log("[v0] System: Assigning course to trainees")
      console.log("[v0] System: Updating trainee records")

      setTimeout(() => {
        console.log("[v0] System: Sending notifications to trainees")

        setTimeout(() => {
          console.log("[v0] System: Assignment complete")
          setIsAssigning(false)

          const selectedNames = trainees
            .filter((t) => selectedTrainees.includes(t.id))
            .map((t) => t.name)
            .join(", ")

          alert(
            `✓ Course assigned successfully!\n\n` +
              `Course: ${course}\n` +
              `Trainees: ${selectedNames}\n` +
              `Start: ${startDate}\n` +
              `Due: ${dueDate}\n\n` +
              `Notifications have been sent to all selected trainees.`,
          )

          // Reset form
          setSelectedTrainees([])
          setCourse("")
          setStartDate("")
          setDueDate("")
        }, 1000)
      }, 1000)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Assign Courses</h1>
        <p className="text-muted-foreground">Assign VR courses to trainees with notifications</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left Column - Trainee List */}
        <Card>
          <CardHeader>
            <CardTitle>Trainee List</CardTitle>
            <CardDescription>
              {selectedTrainees.length > 0 ? `${selectedTrainees.length} selected` : "Select trainees"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="text"
              placeholder="Search by name or ID…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-input text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 font-medium text-foreground">
                      <Checkbox />
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-foreground">Name</th>
                    <th className="text-left py-3 px-2 font-medium text-foreground">Role</th>
                    <th className="text-left py-3 px-2 font-medium text-foreground">Unit</th>
                    <th className="text-left py-3 px-2 font-medium text-foreground">Assigned</th>
                  </tr>
                </thead>
                <tbody>
                  {trainees.map((trainee) => (
                    <tr key={trainee.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-2">
                        <Checkbox
                          checked={selectedTrainees.includes(trainee.id)}
                          onCheckedChange={() => toggleTrainee(trainee.id)}
                        />
                      </td>
                      <td className="py-3 px-2 text-foreground">{trainee.name}</td>
                      <td className="py-3 px-2 text-foreground">{trainee.role}</td>
                      <td className="py-3 px-2 text-foreground">{trainee.unit}</td>
                      <td className="py-3 px-2 text-muted-foreground text-xs">{trainee.assigned}</td>
                    </tr>
                  ))}
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
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Course</label>
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                disabled={isAssigning}
                className="w-full px-4 py-2 rounded-md bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              >
                <option value="">Select a course</option>
                <option>Hemorrhage Control – Urban Street</option>
                <option>Mass Casualty Triage</option>
                <option>Chest Injury Response</option>
              </select>
            </div>

            {course && (
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full bg-destructive/20 text-destructive text-xs font-medium">
                  Combat
                </span>
                <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">Medium</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={isAssigning}
                className="w-full px-4 py-2 rounded-md bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={isAssigning}
                className="w-full px-4 py-2 rounded-md bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              />
            </div>

            {isAssigning && (
              <div className="bg-primary/10 border border-primary/30 rounded-md p-4">
                <div className="flex items-center gap-3">
                  <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">Assigning course...</p>
                    <p className="text-xs text-muted-foreground">Updating records and sending notifications</p>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={handleAssignCourse}
              disabled={isAssigning || selectedTrainees.length === 0 || !course}
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
