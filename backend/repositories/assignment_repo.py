from supabase import create_client
# Supabase client
supabaseUrl = 'https://xbqubafoxtqfvnvgsaod.supabase.co'
supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhicXViYWZveHRxZnZudmdzYW9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MjcwNDUsImV4cCI6MjA4MDUwMzA0NX0.0gODUNUIonqOmGoc6GoSlPchvxoDSbDr0c0p1Xcssds"
supabase = create_client(supabaseUrl, supabaseKey)


def insert_assignment(trainee_id, scenario_id):
    supabase.table("assigned_courses").insert({
        "trainee_id": trainee_id,
        "scenario_id": scenario_id
    }).execute()




def get_assignment_by_launch_code(launch_code: str):
    assignment_response = supabase.table("assignments") \
        .select("*") \
        .eq("launch_code", launch_code) \
        .single() \
        .execute()

    assignment = assignment_response.data

    if not assignment:
        return {"error": "Invalid launch code"}

    scenario_id = assignment["scenario_id"]

    scenario_response = supabase.table("scenarios") \
        .select("*") \
        .eq("scenario_id", scenario_id) \
        .single() \
        .execute()

    scenario = scenario_response.data

    if not scenario:
        return {"error": "Scenario not found"}

    return {
        "assignment_id": assignment["assignment_id"],
        "trainee_id": assignment["trainee_id"],
        "scenario_id": scenario_id,
        "launch_code": assignment["launch_code"],
        "course_name": scenario.get("course_name"),
        "scenario_json": scenario["scenario_spec"]
    }