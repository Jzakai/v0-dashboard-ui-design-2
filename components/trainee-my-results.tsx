'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const resultsData = [
  { course: 'Hemorrhage Control – Urban', score: '92%', duration: '8m 32s', errors: 1, date: '2025-01-10' },
  { course: 'Chest Injury Response', score: '85%', duration: '9m 15s', errors: 3, date: '2025-01-08' },
  { course: 'Shock Management', score: '88%', duration: '7m 48s', errors: 2, date: '2025-01-05' },
  { course: 'Airway Management', score: '91%', duration: '8m 01s', errors: 1, date: '2025-01-02' },
];

export function TraineeMyResults() {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Results</h1>
        <p className="text-muted-foreground">History of completed sessions and performance</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters */}
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

          {/* Results Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-foreground">Course</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Score</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Duration</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Critical Errors</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {resultsData.map((result, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 text-foreground">{result.course}</td>
                    <td className="py-3 px-4 text-foreground font-medium">{result.score}</td>
                    <td className="py-3 px-4 text-foreground">{result.duration}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        result.errors <= 1
                          ? 'bg-primary/20 text-primary'
                          : result.errors <= 2
                          ? 'bg-accent/20 text-accent'
                          : 'bg-destructive/20 text-destructive'
                      }`}>
                        {result.errors}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{result.date}</td>
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
