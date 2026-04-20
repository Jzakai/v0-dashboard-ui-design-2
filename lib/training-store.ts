import { getSupabaseClient } from '@/lib/supabase/client';

// Exact schema mappings (as provided by user)
const TABLE_USERS = 'users';
const TABLE_SCENARIOS = 'scenarios';
const TABLE_ASSIGNMENTS = 'assignments';

export type User = { user_id: string; name: string };
export type Scenario = { scenario_id: string; course_name: string };
export type AssignmentStatus = 'Not Started' | 'In Progress' | 'Completed' | string;
export type AssignmentRow = {
  assignment_id: string;
  trainee_id: string;
  scenario_id: string;
  assigned_at: string;
  status: AssignmentStatus;
  /** ISO `YYYY-MM-DD` from Supabase `date` */
  start_date?: string | null;
  /** ISO `YYYY-MM-DD` from Supabase `date` */
  due_date?: string | null;
};
export type TraineeAssignmentItem = {
  assignment: AssignmentRow;
  scenario: Scenario;
};

export async function listScenarios(): Promise<Scenario[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE_SCENARIOS)
    .select('scenario_id,course_name')
    .order('course_name', { ascending: true });
  if (error) throw error;
  const rows = (data ?? []) as Array<Partial<Scenario>>;
  return rows
    .filter((r): r is Partial<Scenario> & { scenario_id: string } => typeof r.scenario_id === 'string')
    .map((r) => ({
      scenario_id: r.scenario_id,
      course_name: typeof r.course_name === 'string' && r.course_name.trim() ? r.course_name : 'Unnamed Course',
    }));
}

export async function listUsers(): Promise<User[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE_USERS)
    .select('user_id,name')
    .eq('role', 'trainee')
    .order('name', { ascending: true });
  if (error) throw error;
  return (data ?? []) as User[];
}

export async function findUserByName(name: string): Promise<User | null> {
  const supabase = getSupabaseClient();
  const trimmedName = name.trim();
  if (!trimmedName) return null;
  const { data, error } = await supabase
    .from(TABLE_USERS)
    .select('user_id,name')
    .ilike('name', trimmedName) // match exact (case-insensitive) in demo-style usage
    .limit(1);
  if (error) throw error;
  return (data?.[0] as User | undefined) ?? null;
}

export async function createAssignments(params: {
  traineeIds: string[];
  scenarioId: string;
  status?: AssignmentStatus;
  startDate?: string;
  dueDate?: string;
}): Promise<AssignmentRow[]> {
  const supabase = getSupabaseClient();
  const now = new Date().toISOString();

  const start = params.startDate?.trim() ? params.startDate.trim() : null;
  const due = params.dueDate?.trim() ? params.dueDate.trim() : null;

  const rows = params.traineeIds.map((traineeId) => ({
    trainee_id: traineeId,
    scenario_id: params.scenarioId,
    assigned_at: now,
    status: params.status ?? 'Not Started',
    start_date: start,
    due_date: due,
  }));

  const { data, error } = await supabase
    .from(TABLE_ASSIGNMENTS)
    .insert(rows)
    .select('assignment_id,trainee_id,scenario_id,assigned_at,status,start_date,due_date');
  if (error) throw error;
  return (data ?? []) as AssignmentRow[];
}

export async function listAssignmentsForTrainee(traineeId: string): Promise<TraineeAssignmentItem[]> {
  const supabase = getSupabaseClient();

  const { data: assignmentRows, error } = await supabase
    .from(TABLE_ASSIGNMENTS)
    .select('assignment_id,trainee_id,scenario_id,assigned_at,status,start_date,due_date')
    .eq('trainee_id', traineeId)
    .order('assigned_at', { ascending: false });

  if (error) throw error;

  const rows = (assignmentRows ?? []) as AssignmentRow[];
  const scenarioIds = Array.from(new Set(rows.map((r) => r.scenario_id)));
  if (!scenarioIds.length) return [];

  const { data: scenarios, error: scenarioError } = await supabase
    .from(TABLE_SCENARIOS)
    .select('scenario_id,course_name')
    .in('scenario_id', scenarioIds);
  if (scenarioError) throw scenarioError;

  const scenarioRows = (scenarios ?? []) as Scenario[];
  const scenarioById = new Map<string, Scenario>(
    scenarioRows.map((s) => [s.scenario_id, s])
  );

  return rows
    .map((r) => {
      const scenario = scenarioById.get(r.scenario_id);
      if (!scenario) return null;
      return {
        assignment: r,
        scenario,
      } as TraineeAssignmentItem;
    })
    .filter((x): x is TraineeAssignmentItem => Boolean(x));
}

