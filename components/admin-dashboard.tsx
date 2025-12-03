'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground text-base">Training activity overview and performance metrics</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Last updated</p>
          <p className="text-sm font-semibold text-foreground">Today, 2:45 PM</p>
        </div>
      </div>

      {/* Summary Cards with enhanced design */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-card to-primary/5 border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <span className="text-2xl">📚</span>
              Total Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-5xl font-bold text-foreground">12</div>
              <p className="text-sm text-muted-foreground">Published VR training scenarios</p>
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
              Total Trainees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-5xl font-bold text-foreground">34</div>
              <p className="text-sm text-muted-foreground">Active users in the system</p>
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
              Sessions This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-5xl font-bold text-foreground">18</div>
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
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Recent Training Sessions</CardTitle>
            <button className="text-sm text-primary hover:text-primary/80 font-medium">View All →</button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Trainee</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Course</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Score</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Date</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { trainee: 'John Smith', course: 'Hemorrhage Control', score: 95, date: '2025-01-15', status: 'Completed' },
                  { trainee: 'Sarah Johnson', course: 'Chest Injury', score: 87, date: '2025-01-14', status: 'Completed' },
                  { trainee: 'Mike Davis', course: 'Triage Training', score: 78, date: '2025-01-13', status: 'Completed' },
                  { trainee: 'Emma Wilson', course: 'Hemorrhage Control', score: 92, date: '2025-01-13', status: 'Completed' },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
                          {row.trainee.charAt(0)}
                        </div>
                        <span className="font-medium text-foreground">{row.trainee}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-foreground">{row.course}</td>
                    <td className="py-4 px-6">
                      <span className={`font-semibold ${row.score >= 90 ? 'text-primary' : row.score >= 80 ? 'text-accent' : 'text-muted-foreground'}`}>
                        {row.score}%
                      </span>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">{row.date}</td>
                    <td className="py-4 px-6">
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
  );
}
