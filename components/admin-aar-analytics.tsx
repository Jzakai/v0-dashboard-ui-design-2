'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const sessionsData = [
  { trainee: 'John Smith', score: '95%', duration: '8m 32s', errors: 0, date: '2025-01-15' },
  { trainee: 'Sarah Johnson', score: '87%', duration: '9m 15s', errors: 2, date: '2025-01-14' },
  { trainee: 'Mike Davis', score: '78%', duration: '10m 05s', errors: 4, date: '2025-01-13' },
  { trainee: 'Emily White', score: '92%', duration: '8m 48s', errors: 1, date: '2025-01-12' },
];

export function AdminAARAnalytics() {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedTrainee, setSelectedTrainee] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">After-Action Review (AAR) Analytics</h1>
        <p className="text-muted-foreground">Performance metrics by course and trainee</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Course</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="min-h-11 w-full rounded-md border border-border bg-input px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Courses</option>
                <option>Hemorrhage Control</option>
                <option>Chest Injury Response</option>
                <option>Mass Casualty Triage</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Trainee</label>
              <select
                value={selectedTrainee}
                onChange={(e) => setSelectedTrainee(e.target.value)}
                className="min-h-11 w-full rounded-md border border-border bg-input px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Trainees</option>
                <option>John Smith</option>
                <option>Sarah Johnson</option>
                <option>Mike Davis</option>
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

          {/* KPI Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground mb-1">Average Score</p>
              <div className="text-3xl font-bold text-foreground">82%</div>
              <p className="text-xs text-muted-foreground mt-1">For selected sessions</p>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground mb-1">Average Time to First Intervention</p>
              <div className="text-3xl font-bold text-foreground">45s</div>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground mb-1">Correct MARCH Sequence Rate</p>
              <div className="text-3xl font-bold text-foreground">71%</div>
            </div>
          </div>

          {/* Sessions Table */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Sessions Detail</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-foreground">Trainee</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Score</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Duration</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Critical Errors</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {sessionsData.map((session, idx) => (
                    <tr key={idx} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 text-foreground">{session.trainee}</td>
                      <td className="py-3 px-4 text-foreground font-medium">{session.score}</td>
                      <td className="py-3 px-4 text-foreground">{session.duration}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          session.errors === 0
                            ? 'bg-primary/20 text-primary'
                            : 'bg-destructive/20 text-destructive'
                        }`}>
                          {session.errors}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-xs">{session.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
