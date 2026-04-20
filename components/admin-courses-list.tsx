'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const courses = [
  { id: 1, name: 'Hemorrhage Control – Urban', type: 'Combat', difficulty: 'Medium', status: 'Published', updated: '2025-01-10' },
  { id: 2, name: 'Chest Injury Response', type: 'Combat', difficulty: 'Hard', status: 'Published', updated: '2025-01-08' },
  { id: 3, name: 'Abdominal Trauma – Civilian', type: 'Civilian', difficulty: 'Easy', status: 'Draft', updated: '2025-01-05' },
  { id: 4, name: 'Mass Casualty Triage', type: 'Combat', difficulty: 'Hard', status: 'Published', updated: '2025-01-03' },
  { id: 5, name: 'Shock Management', type: 'Civilian', difficulty: 'Medium', status: 'Published', updated: '2024-12-28' },
];

export function AdminCoursesList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficulty, setDifficulty] = useState('All levels');
  const [courseType, setCourseType] = useState('All types');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Courses (Admin)</h1>
        <p className="text-muted-foreground">Manage VR training courses</p>
      </div>

      {/* Courses List Card */}
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <CardTitle>Course List</CardTitle>
          </div>
          <Button className="w-full shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto">
            + New Course
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch sm:gap-4">
            <div className="min-w-0 flex-1 sm:min-w-[12rem]">
              <input
                type="text"
                placeholder="Search by name…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="min-h-11 w-full rounded-md border border-border bg-input px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="min-h-11 w-full rounded-md border border-border bg-input px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary sm:w-auto sm:min-w-[10rem]"
            >
              <option>All levels</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
            <select
              value={courseType}
              onChange={(e) => setCourseType(e.target.value)}
              className="min-h-11 w-full rounded-md border border-border bg-input px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary sm:w-auto sm:min-w-[10rem]"
            >
              <option>All types</option>
              <option>Combat</option>
              <option>Civilian</option>
            </select>
          </div>

          {/* Courses Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-foreground">Course Name</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Difficulty</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Last Updated</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 text-foreground">{course.name}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        course.type === 'Combat'
                          ? 'bg-destructive/20 text-destructive'
                          : 'bg-accent/20 text-accent'
                      }`}>
                        {course.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-foreground">{course.difficulty}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        course.status === 'Published'
                          ? 'bg-primary/20 text-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {course.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{course.updated}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                          title="Edit"
                        >
                          ✎
                        </button>
                        <button
                          type="button"
                          className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-destructive"
                          title="Delete"
                        >
                          🗑
                        </button>
                      </div>
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
