"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const courses = [
  {
    id: 1,
    title: "Hemorrhage Control – Urban",
    description: "Apply MARCH protocol to manage casualty with severe limb bleeding in urban combat environment.",
    skillCategory: "Hemorrhage Control",
    protocol: "MARCH",
    difficulty: "Medium",
    status: "Not Started",
    dueDate: "2025-01-25",
    assignedDate: "2025-01-10",
    timeLimit: "5 min",
  },
  {
    id: 2,
    title: "Chest Injury Response",
    description: "Respond to penetrating chest wound using rapid intervention techniques per TCCC guidelines.",
    skillCategory: "Chest Trauma",
    protocol: "MARCH",
    difficulty: "Hard",
    status: "In Progress",
    dueDate: "2025-01-28",
    assignedDate: "2025-01-08",
    timeLimit: "4 min",
  },
  {
    id: 3,
    title: "Mass Casualty Triage",
    description: "Triage and prioritize multiple casualties in high-pressure combat scenario.",
    skillCategory: "Mass Casualty",
    protocol: "START Triage",
    difficulty: "Hard",
    status: "Not Started",
    dueDate: "2025-02-05",
    assignedDate: "2025-01-12",
    timeLimit: "10 min",
  },
]

export function TraineeMyTrainings() {
  const handleLaunchVR = (courseId: number, courseTitle: string) => {
    console.log("[v0] Launching VR course via OpenXR:", courseId)
    console.log("[v0] Checking device compatibility...")
    alert(
      `Launching "${courseTitle}" via OpenXR runtime.\n\nPlease ensure your VR headset is connected and OpenXR runtime is installed.`,
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Trainings</h1>
        <p className="text-muted-foreground">VR courses assigned to you via OpenXR</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{course.description}</p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      course.status === "Not Started"
                        ? "bg-muted text-muted-foreground"
                        : course.status === "In Progress"
                          ? "bg-accent/20 text-accent"
                          : "bg-primary/20 text-primary"
                    }`}
                  >
                    {course.status}
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                    {course.skillCategory}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">
                    {course.protocol}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                    {course.difficulty}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                    ⏱️ {course.timeLimit}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Assigned: </span>
                    <span className="text-foreground font-medium">{course.assignedDate}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Due: </span>
                    <span className="text-foreground font-medium">{course.dueDate}</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={() => handleLaunchVR(course.id, course.title)}
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
                    Launch VR Training
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2 bg-transparent">
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
        ))}
      </div>

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
