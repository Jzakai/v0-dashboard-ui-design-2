'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

const trainees = [
  { id: 1, name: 'John Smith', role: 'Soldier', unit: 'Alpha Team', assigned: 2 },
  { id: 2, name: 'Sarah Johnson', role: 'Medic', unit: 'Bravo Team', assigned: 3 },
  { id: 3, name: 'Mike Davis', role: 'Soldier', unit: 'Charlie Team', assigned: 1 },
  { id: 4, name: 'Emily White', role: 'Medic', unit: 'Delta Team', assigned: 2 },
];

export function AdminAssignCourses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrainees, setSelectedTrainees] = useState<number[]>([]);
  const [course, setCourse] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');

  const toggleTrainee = (id: number) => {
    setSelectedTrainees(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Assign Courses</h1>
        <p className="text-muted-foreground">Assign VR courses to trainees</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left Column - Trainee List */}
        <Card>
          <CardHeader>
            <CardTitle>Trainee List</CardTitle>
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
                          onChange={() => toggleTrainee(trainee.id)}
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
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Course</label>
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
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
                <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">
                  Medium
                </span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-6">
              Assign to Selected Trainees
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
