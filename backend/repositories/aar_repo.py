from supabase import create_client
# Supabase client
supabaseUrl = 'https://xbqubafoxtqfvnvgsaod.supabase.co'
supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhicXViYWZveHRxZnZudmdzYW9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MjcwNDUsImV4cCI6MjA4MDUwMzA0NX0.0gODUNUIonqOmGoc6GoSlPchvxoDSbDr0c0p1Xcssds"
supabase = create_client(supabaseUrl, supabaseKey)

def save_aar_result(req):
    response = supabase.table("aar_results").insert({
        "assignment_id": req.assignment_id,
        "scenario_id": req.scenario_id,
        "trainee_id": req.trainee_id,

        "final_score": req.final_score,
        "sequence_accuracy": req.sequence_accuracy,
        "speed_score": req.speed_score,
        "completion_time": req.completion_time,

        "selected_actions": req.selected_actions,
        "action_timestamps": req.action_timestamps,
        "expected_actions": req.expected_actions,
    }).execute()

    return response.data

def get_aar_results():
    response = supabase.table("aar_results") \
        .select("*") \
        .order("created_at", desc=True) \
        .execute()

    return response.data