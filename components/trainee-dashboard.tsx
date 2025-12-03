'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TraineeDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Trainee Dashboard</h1>
        <p className="text-muted-foreground">Quick overview of your trainings</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Assigned Trainings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">8</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed Trainings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">5</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">87%</div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Trainings */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Trainings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-foreground">Course</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { course: 'Hemorrhage Control', status: 'Not Started', dueDate: '2025-01-25' },
                  { course: 'Chest Injury Response', status: 'In Progress', dueDate: '2025-01-28' },
                  { course: 'Mass Casualty Triage', status: 'Not Started', dueDate: '2025-02-05' },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 text-foreground">{row.course}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        row.status === 'Not Started'
                          ? 'bg-muted text-muted-foreground'
                          : row.status === 'In Progress'
                          ? 'bg-accent/20 text-accent'
                          : 'bg-primary/20 text-primary'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{row.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
