'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminCreateCourseProps {
  onPublish?: () => void;
}

const validationErrors = [
  'Missing Airway step in MARCH sequence.',
  'Vital signs are incomplete for casualty #1.',
];

const scenarioData = {
  environment: 'Urban street',
  numberOfCasualties: 2,
  injuryType: 'Severe hemorrhage',
  timeLimit: 300,
  requiredActions: ['Control Bleeding', 'Airway Management', 'Shock Prevention'],
};

export function AdminCreateCourse({ onPublish }: AdminCreateCourseProps) {
  const [courseName, setCourseName] = useState('');
  const [description, setDescription] = useState('');
  const [injuryType, setInjuryType] = useState('Severe hemorrhage');
  const [environment, setEnvironment] = useState('Urban street');
  const [difficulty, setDifficulty] = useState('Medium');
  const [traineeType, setTraineeType] = useState('Combat soldier');
  const [timeLimit, setTimeLimit] = useState('300');
  const [casualties, setCasualties] = useState('1');

  const handleSavePublish = () => {
    console.log('[v0] Publishing course and navigating to visualization');
    if (onPublish) {
      onPublish();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Create / Edit Course</h1>
        <p className="text-muted-foreground">Configure training scenarios with AI assistance</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left Column - Scenario Details */}
        <Card>
          <CardHeader>
            <CardTitle>Scenario Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Course Name</label>
              <input
                type="text"
                placeholder="Enter course name"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-input text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Short Description</label>
              <textarea
                placeholder="Enter course description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-input text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none h-24"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Injury Type</label>
              <select
                value={injuryType}
                onChange={(e) => setInjuryType(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option>Severe hemorrhage</option>
                <option>Chest injury</option>
                <option>Abdominal trauma</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Environment</label>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option>Urban street</option>
                <option>Battlefield</option>
                <option>Ambulance</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Difficulty Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Trainee Type</label>
              <select
                value={traineeType}
                onChange={(e) => setTraineeType(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option>Combat soldier</option>
                <option>Military medic</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Time Limit (seconds)</label>
                <input
                  type="number"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Number of Casualties</label>
                <input
                  type="number"
                  value={casualties}
                  onChange={(e) => setCasualties(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                Generate Scenario with AI
              </Button>
              <Button variant="outline" className="flex-1">
                Clear Fields
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right Column - AI Output */}
        <Card>
          <CardHeader>
            <CardTitle>AI Output</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Scenario Narrative</label>
              <textarea
                readOnly
                value="You arrive at an urban street after a small-arms engagement. A soldier is lying on the ground with severe bleeding from the lower limb. The casualty is conscious and alert, showing signs of shock. Your immediate priority is to control the bleeding and prevent further deterioration."
                className="w-full px-4 py-2 rounded-md bg-muted text-foreground border border-border resize-none h-24"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Scenario Data (JSON)</label>
              <pre className="w-full px-4 py-2 rounded-md bg-muted text-foreground border border-border overflow-auto text-xs h-32">
                {JSON.stringify(scenarioData, null, 2)}
              </pre>
            </div>

            <div className="space-y-2">
              <div className="bg-destructive/10 border border-destructive/30 rounded-md p-4 space-y-2">
                <label className="text-sm font-semibold text-destructive">Validation Errors</label>
                <ul className="space-y-1">
                  {validationErrors.map((error, idx) => (
                    <li key={idx} className="text-xs text-destructive/80">• {error}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1">
                Refine with AI
              </Button>
              <Button 
                onClick={handleSavePublish}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Save & Publish
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
