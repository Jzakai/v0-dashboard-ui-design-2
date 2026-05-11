'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type AARResult = {
  id: string;
  assignment_id?: string | null;
  scenario_id?: string | null;
  trainee_id?: string | null;

  trainee_name?: string | null;
  course_name?: string | null;

  final_score: number;
  sequence_accuracy: number;
  speed_score: number;
  completion_time: number;
  selected_actions?: string[];
  action_timestamps?: number[];
  expected_actions?: string[];
  created_at: string;
};

export function AdminAARAnalytics() {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedTrainee, setSelectedTrainee] = useState('');

  const [results, setResults] = useState<AARResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

  useEffect(() => {
    async function loadAARResults() {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(`${API_BASE_URL}/aar/results`);

        if (!response.ok) {
          throw new Error(`Failed to fetch AAR results: ${response.status}`);
        }

        const data = await response.json();
        setResults(data.results || []);
      } catch (err) {
        console.error(err);
        setError('Unable to load AAR results.');
      } finally {
        setLoading(false);
      }
    }

    void loadAARResults();
  }, [API_BASE_URL]);

  const courseOptions = useMemo(() => {
    return Array.from(
      new Set(
        results
          .map((r) => r.course_name || r.scenario_id)
          .filter(Boolean)
      )
    ) as string[];
  }, [results]);

  const traineeOptions = useMemo(() => {
    return Array.from(
      new Set(
        results
          .map((r) => r.trainee_name || r.trainee_id)
          .filter(Boolean)
      )
    ) as string[];
  }, [results]);

  const filteredResults = useMemo(() => {
    return results.filter((result) => {
      const courseValue = result.course_name || result.scenario_id || '';
      const traineeValue = result.trainee_name || result.trainee_id || '';

      const matchesCourse =
        !selectedCourse ||
        courseValue.toLowerCase() === selectedCourse.toLowerCase();

      const matchesTrainee =
        !selectedTrainee ||
        traineeValue.toLowerCase() === selectedTrainee.toLowerCase();

      return matchesCourse && matchesTrainee;
    });
  }, [results, selectedCourse, selectedTrainee]);

  const averageScore =
    filteredResults.length > 0
      ? Math.round(
          filteredResults.reduce((sum, item) => sum + item.final_score, 0) /
            filteredResults.length
        )
      : 0;

  const averageCompletionTime =
    filteredResults.length > 0
      ? Math.round(
          filteredResults.reduce((sum, item) => sum + item.completion_time, 0) /
            filteredResults.length
        )
      : 0;

  const averageSequenceAccuracy =
    filteredResults.length > 0
      ? Math.round(
          filteredResults.reduce((sum, item) => sum + item.sequence_accuracy, 0) /
            filteredResults.length
        )
      : 0;

  function formatDuration(seconds: number) {
    if (seconds === null || seconds === undefined) return '--';

    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);

    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  }

  function formatDate(dateString: string) {
    if (!dateString) return '--';

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return '--';

    return date.toLocaleDateString();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          After-Action Review (AAR) Analytics
        </h1>
        <p className="text-muted-foreground">
          Performance metrics from completed Unity VR training sessions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Filters */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Course / Scenario
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="min-h-11 w-full rounded-md border border-border bg-input px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Scenarios</option>
                {courseOptions.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Trainee
              </label>
              <select
                value={selectedTrainee}
                onChange={(e) => setSelectedTrainee(e.target.value)}
                className="min-h-11 w-full rounded-md border border-border bg-input px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Trainees</option>
                {traineeOptions.map((trainee) => (
                  <option key={trainee} value={trainee}>
                    {trainee}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading && (
            <p className="text-sm text-muted-foreground">
              Loading Unity performance results...
            </p>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          {/* KPI Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-muted p-4">
              <p className="mb-1 text-sm text-muted-foreground">Average Score</p>
              <div className="text-3xl font-bold text-foreground">
                {averageScore}%
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Based on {filteredResults.length} selected sessions
              </p>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <p className="mb-1 text-sm text-muted-foreground">
                Average Completion Time
              </p>
              <div className="text-3xl font-bold text-foreground">
                {formatDuration(averageCompletionTime)}
              </div>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <p className="mb-1 text-sm text-muted-foreground">
                Correct Action Sequence Rate
              </p>
              <div className="text-3xl font-bold text-foreground">
                {averageSequenceAccuracy}%
              </div>
            </div>
          </div>

          {/* Sessions Table */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              Sessions Detail
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left font-medium text-foreground">
                      Trainee
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-foreground">
                      Scenario
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-foreground">
                      Final Score
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-foreground">
                      Sequence Accuracy
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-foreground">
                      Speed Score
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-foreground">
                      Duration
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-foreground">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredResults.length === 0 && !loading ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-6 text-center text-muted-foreground"
                      >
                        No AAR results found.
                      </td>
                    </tr>
                  ) : (
                    filteredResults.map((result) => (
                      <tr
                        key={result.id}
                        className="border-b border-border hover:bg-muted/50"
                      >
                        <td className="px-4 py-3 text-foreground">
                          {result.trainee_name ||
                            result.trainee_id ||
                            'Unknown trainee'}
                        </td>

                        <td className="px-4 py-3 text-foreground">
                          {result.course_name ||
                            result.scenario_id ||
                            'Unknown scenario'}
                        </td>

                        <td className="px-4 py-3 font-medium text-foreground">
                          {result.final_score}%
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              result.sequence_accuracy >= 70
                                ? 'bg-primary/20 text-primary'
                                : 'bg-destructive/20 text-destructive'
                            }`}
                          >
                            {result.sequence_accuracy}%
                          </span>
                        </td>

                        <td className="px-4 py-3 text-foreground">
                          {result.speed_score}%
                        </td>

                        <td className="px-4 py-3 text-foreground">
                          {formatDuration(result.completion_time)}
                        </td>

                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {formatDate(result.created_at)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}