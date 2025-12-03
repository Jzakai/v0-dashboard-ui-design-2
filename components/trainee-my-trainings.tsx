'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const courses = [
  {
    id: 1,
    title: 'Hemorrhage Control – Urban',
    description: 'Manage a casualty with severe limb bleeding under fire in an urban environment.',
    type: 'Combat',
    difficulty: 'Medium',
    status: 'Not Started',
    dueDate: '2025-01-25',
  },
  {
    id: 2,
    title: 'Chest Injury Response',
    description: 'Respond to a penetrating chest wound with rapid intervention techniques.',
    type: 'Combat',
    difficulty: 'Hard',
    status: 'In Progress',
    dueDate: '2025-01-28',
  },
  {
    id: 3,
    title: 'Mass Casualty Triage',
    description: 'Triage and prioritize multiple casualties in a high-pressure scenario.',
    type: 'Combat',
    difficulty: 'Hard',
    status: 'Not Started',
    dueDate: '2025-02-05',
  },
];

export function TraineeMyTrainings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Trainings</h1>
        <p className="text-muted-foreground">VR courses assigned to you</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{course.description}</p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    course.type === 'Combat'
                      ? 'bg-destructive/20 text-destructive'
                      : 'bg-accent/20 text-accent'
                  }`}>
                    {course.type}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">
                    {course.difficulty}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    course.status === 'Not Started'
                      ? 'bg-muted text-muted-foreground'
                      : course.status === 'In Progress'
                      ? 'bg-accent/20 text-accent'
                      : 'bg-primary/20 text-primary'
                  }`}>
                    {course.status}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground">Due date: {course.dueDate}</p>

                <div className="flex gap-3 pt-2">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2">
                    ⬇ Download VR Package
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    👁 View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
