'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type AARResult = {
  id: string;
  assignment_id?: string | null;
  scenario_id?: string | null;
  trainee_id?: string | null;
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
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [results, setResults] = useState<AARResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Change this depending on your backend URL
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

    loadAARResults();
  }, [API_BASE_URL]);

  const filteredResults = useMemo(() => {
    return results.filter((result) => {
      const resultDate = result.created_at ? result.created_at.slice(0, 10) : '';

      const matchesCourse =
        !selectedCourse ||
        result.scenario_id?.toLowerCase().includes(selectedCourse.toLowerCase());

      const matchesTrainee =
        !selectedTrainee ||
        result.trainee_id?.toLowerCase().includes(selectedTrainee.toLowerCase());

      const matchesFromDate =
        !fromDate || resultDate >= fromDate;

      const matchesToDate =
        !toDate || resultDate <= toDate;

      return matchesCourse && matchesTrainee && matchesFromDate && matchesToDate;
    });
  }, [results, selectedCourse, selectedTrainee, fromDate, toDate]);

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
    if (!seconds && seconds !== 0) return '--';

    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);

    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Course / Scenario</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="min-h-11 w-full rounded-md border border-border bg-input px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Scenarios</option>
                <option value="hemorrhage">Hemorrhage Control</option>
                <option value="chest">Chest Injury Response</option>
                <option value="triage">Mass Casualty Triage</option>
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
                {[...new Set(results.map((r) => r.trainee_id).filter(Boolean))].map((trainee) => (
                  <option key={trainee as string} value={trainee as string}>
                    {trainee}
                  </option>
                ))}
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

          {loading && (
            <p className="text-sm text-muted-foreground">Loading Unity performance results...</p>
          )}

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          {/* KPI Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground mb-1">Average Score</p>
              <div className="text-3xl font-bold text-foreground">{averageScore}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Based on {filteredResults.length} selected sessions
              </p>
            </div>

            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground mb-1">Average Completion Time</p>
              <div className="text-3xl font-bold text-foreground">
                {formatDuration(averageCompletionTime)}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground mb-1">Correct Action Sequence Rate</p>
              <div className="text-3xl font-bold text-foreground">
                {averageSequenceAccuracy}%
              </div>
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
                    <th className="text-left py-3 px-4 font-medium text-foreground">Scenario</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Final Score</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Sequence Accuracy</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Speed Score</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Duration</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredResults.length === 0 && !loading ? (
                    <tr>
                      <td colSpan={7} className="py-6 px-4 text-center text-muted-foreground">
                        No AAR results found.
                      </td>
                    </tr>
                  ) : (
                    filteredResults.map((result) => (
                      <tr key={result.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-4 text-foreground">
                          {result.trainee_id || 'Unknown trainee'}
                        </td>

                        <td className="py-3 px-4 text-foreground">
                          {result.scenario_id || 'Unknown scenario'}
                        </td>

                        <td className="py-3 px-4 text-foreground font-medium">
                          {result.final_score}%
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              result.sequence_accuracy >= 70
                                ? 'bg-primary/20 text-primary'
                                : 'bg-destructive/20 text-destructive'
                            }`}
                          >
                            {result.sequence_accuracy}%
                          </span>
                        </td>

                        <td className="py-3 px-4 text-foreground">
                          {result.speed_score}%
                        </td>

                        <td className="py-3 px-4 text-foreground">
                          {formatDuration(result.completion_time)}
                        </td>

                        <td className="py-3 px-4 text-muted-foreground text-xs">
                          {result.created_at
                            ? new Date(result.created_at).toLocaleDateString()
                            : '--'}
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