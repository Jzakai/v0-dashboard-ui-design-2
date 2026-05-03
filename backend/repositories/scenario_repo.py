from supabase import create_client
# Supabase client
supabaseUrl = 'https://xbqubafoxtqfvnvgsaod.supabase.co'
supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhicXViYWZveHRxZnZudmdzYW9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MjcwNDUsImV4cCI6MjA4MDUwMzA0NX0.0gODUNUIonqOmGoc6GoSlPchvxoDSbDr0c0p1Xcssds"
supabase = create_client(supabaseUrl, supabaseKey)

def save_scenario(scenario_json, skill, skill_category, difficulty, version):
    result = supabase.table("scenarios").insert({
        "scenario_spec": scenario_json,
        "skill": skill,
        "skill_category": skill_category,
        "difficulty": difficulty,
        "version": version,

    }).execute()

    return result.data[0]["scenario_id"]


def update_scenario(user_id, scenario_id, scenario_json, skill, skill_category, difficulty, course_name, status, rationale):
    supabase.table("scenarios").update({
        "created_by": user_id,
        "scenario_spec": scenario_json,
        "skill": skill,
        "skill_category": skill_category,
        "difficulty": difficulty,
        "course_name": course_name,
        "status": status,
        "rationale": rationale
    }).eq("scenario_id", scenario_id).execute()


def get_scenario_by_id(scenario_id):
    result = supabase.table("scenarios").select("*").eq("id", scenario_id).execute()
    return result.data[0] if result.data else None
