"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminDashboard() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">Admin Dashboard</h1>
          <p className="text-base text-muted-foreground">AI-powered VR training management and AAR analytics</p>
        </div>
        <div className="shrink-0 text-left sm:text-right">
          <p className="text-sm text-muted-foreground">Last updated</p>
          <p className="text-sm font-semibold text-foreground">Today, 2:45 PM</p>
        </div>
      </div>

      {/* Summary Cards with enhanced design */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        <Card className="bg-gradient-to-br from-card to-primary/5 border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <span className="text-2xl">📚</span>
              VR Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-4xl font-bold text-foreground sm:text-5xl">12</div>
              <p className="text-sm text-muted-foreground">AI-generated scenarios published</p>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-1 rounded-md bg-primary/20 text-primary font-medium">+2 this month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-accent/5 border-accent/20 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <span className="text-2xl">👥</span>
              Active Trainees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-4xl font-bold text-foreground sm:text-5xl">34</div>
              <p className="text-sm text-muted-foreground">Combat & Paramedic trainees</p>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-1 rounded-md bg-accent/20 text-accent font-medium">+5 this week</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-primary/5 border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              VR Sessions (Week)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-4xl font-bold text-foreground sm:text-5xl">18</div>
              <p className="text-sm text-muted-foreground">Completed VR training sessions</p>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-1 rounded-md bg-primary/20 text-primary font-medium">86% avg score</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sessions Table with enhanced styling */}
      <Card className="shadow-lg">
        <CardHeader className="border-b border-border bg-muted/30">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg sm:text-xl">Recent VR Training Sessions</CardTitle>
            <button
              type="button"
              className="min-h-11 w-full rounded-lg text-left text-sm font-medium text-primary hover:text-primary/80 sm:min-h-0 sm:w-auto sm:text-right"
            >
              View All AAR →
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="px-3 py-3 text-left text-xs font-semibold text-foreground sm:px-6 sm:py-4 sm:text-sm">Trainee</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-foreground sm:px-6 sm:py-4 sm:text-sm">Course</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-foreground sm:px-6 sm:py-4 sm:text-sm">Score</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-foreground sm:px-6 sm:py-4 sm:text-sm">MARCH</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-foreground sm:px-6 sm:py-4 sm:text-sm">Date</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-foreground sm:px-6 sm:py-4 sm:text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    trainee: "John Smith",
                    course: "Hemorrhage Control",
                    score: 95,
                    march: 98,
                    date: "2025-01-15",
                    status: "Completed",
                  },
                  {
                    trainee: "Sarah Johnson",
                    course: "Chest Injury",
                    score: 87,
                    march: 85,
                    date: "2025-01-14",
                    status: "Completed",
                  },
                  {
                    trainee: "Mike Davis",
                    course: "Triage Training",
                    score: 78,
                    march: 82,
                    date: "2025-01-13",
                    status: "Completed",
                  },
                  {
                    trainee: "Emma Wilson",
                    course: "Hemorrhage Control",
                    score: 92,
                    march: 95,
                    date: "2025-01-13",
                    status: "Completed",
                  },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="px-3 py-3 sm:px-6 sm:py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
                          {row.trainee.charAt(0)}
                        </div>
                        <span className="font-medium text-foreground">{row.trainee}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-foreground sm:px-6 sm:py-4">{row.course}</td>
                    <td className="px-3 py-3 sm:px-6 sm:py-4">
                      <span
                        className={`font-semibold ${row.score >= 90 ? "text-primary" : row.score >= 80 ? "text-accent" : "text-muted-foreground"}`}
                      >
                        {row.score}%
                      </span>
                    </td>
                    <td className="px-3 py-3 sm:px-6 sm:py-4">
                      <span
                        className={`font-semibold ${row.march >= 90 ? "text-primary" : row.march >= 80 ? "text-accent" : "text-muted-foreground"}`}
                      >
                        {row.march}%
                      </span>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground sm:px-6 sm:py-4">{row.date}</td>
                    <td className="px-3 py-3 sm:px-6 sm:py-4">
                      <span className="px-3 py-1.5 rounded-lg bg-primary/15 text-primary text-xs font-semibold">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
