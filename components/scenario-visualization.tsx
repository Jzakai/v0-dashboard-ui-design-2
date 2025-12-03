'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ScenarioVisualizationProps {
  onAssignCourse: () => void;
  onBackToCourse: () => void;
}

export function ScenarioVisualization({ onAssignCourse, onBackToCourse }: ScenarioVisualizationProps) {
  const [courseName] = useState('Urban Street Hemorrhage Control');
  const [environment] = useState('Urban street');
  const [injuryType] = useState('Severe hemorrhage');
  const [difficulty] = useState('Medium');
  const [timeLimit] = useState(300);
  const [numberOfCasualties] = useState(2);

  const casualties = [
    {
      id: 1,
      injury: 'Lower limb hemorrhage',
      hr: '120 bpm',
      bp: '90/60 mmHg',
      actions: ['Tourniquet', 'Pressure dressing', 'Reassess bleeding'],
    },
    {
      id: 2,
      injury: 'Chest trauma',
      hr: '110 bpm',
      bp: '95/65 mmHg',
      actions: ['Check breathing', 'Seal wound', 'Monitor vitals'],
    },
  ];

  const steps = [
    'Move to cover and assess surroundings',
    'Apply tourniquet to lower limb',
    'Control bleeding with pressure dressing',
    'Reassess casualty vital signs',
    'Prepare for evacuation',
    'Hand over to receiving unit',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Scenario Visualization</h1>
          <p className="text-muted-foreground mt-2">Course successfully published and ready for assignment</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold">
              Published · Version 1.0
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onBackToCourse}>
            Back to Course
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={onAssignCourse}>
            Assign Course
          </Button>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-[70%_30%] gap-6">
        {/* Left Side - 3D Visualization Placeholder */}
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 aspect-video flex flex-col items-center justify-center relative border-b border-border">
              {/* Grid Pattern Background */}
              <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* 3D Scene Elements */}
              <div className="relative z-10 text-center space-y-8">
                <div>
                  <div className="text-2xl font-bold text-slate-300">3D SCENE PREVIEW</div>
                </div>

                {/* Scene Markers */}
                <div className="space-y-4 text-sm">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-slate-300">Environment: {environment}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-slate-300">Casualty Position</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-slate-300">Medic Position</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-slate-300">Threat Direction</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <CardContent className="pt-4">
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Rotate: mouse drag</p>
                <p>Zoom: mouse scroll</p>
                <p>Reset camera: double click</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Information Panel */}
        <div className="space-y-4">
          {/* Scenario Summary Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Scenario Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">Course Name</p>
                <p className="text-sm text-foreground">{courseName}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">Environment</p>
                <p className="text-sm text-foreground">{environment}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">Injury Type</p>
                <p className="text-sm text-foreground">{injuryType}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">Difficulty</p>
                <span className="inline-block px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-600 text-xs font-medium">
                  {difficulty}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground">Time Limit</p>
                  <p className="text-sm font-semibold text-foreground">{timeLimit}s</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground">Casualties</p>
                  <p className="text-sm font-semibold text-foreground">{numberOfCasualties}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Casualties Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Casualties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {casualties.map((casualty) => (
                <div key={casualty.id} className="border-l-2 border-primary pl-3 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">Casualty {casualty.id}</p>
                  <p className="text-sm text-foreground font-medium">{casualty.injury}</p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>HR: {casualty.hr}</p>
                    <p>BP: {casualty.bp}</p>
                  </div>
                  <div className="space-y-1 pt-1">
                    <p className="text-xs font-semibold text-muted-foreground">Required Actions</p>
                    <ul className="text-xs text-foreground space-y-0.5">
                      {casualty.actions.map((action, idx) => (
                        <li key={idx}>• {action}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Key Steps Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Key Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2">
                {steps.map((step, idx) => (
                  <li key={idx} className="text-xs text-foreground flex gap-2">
                    <span className="font-semibold text-primary min-w-fit">{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
