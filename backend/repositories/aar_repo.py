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
    # 1. Get AAR results
    aar_response = supabase.table("aar_results") \
        .select("*") \
        .order("created_at", desc=True) \
        .execute()

    aar_rows = aar_response.data or []

    if not aar_rows:
        return []

    # 2. Collect unique trainee and scenario IDs
    trainee_ids = list({
        row.get("trainee_id")
        for row in aar_rows
        if row.get("trainee_id")
    })

    scenario_ids = list({
        row.get("scenario_id")
        for row in aar_rows
        if row.get("scenario_id")
    })

    # 3. Fetch trainee names
    users = []
    if trainee_ids:
        users_response = supabase.table("users") \
            .select("user_id,name") \
            .in_("user_id", trainee_ids) \
            .execute()

        users = users_response.data or []

    # 4. Fetch scenario/course names
    scenarios = []
    if scenario_ids:
        scenarios_response = supabase.table("scenarios") \
            .select("scenario_id,course_name") \
            .in_("scenario_id", scenario_ids) \
            .execute()

        scenarios = scenarios_response.data or []

    # 5. Create lookup dictionaries
    user_by_id = {
        user["user_id"]: user
        for user in users
    }

    scenario_by_id = {
        scenario["scenario_id"]: scenario
        for scenario in scenarios
    }

    # 6. Add readable fields to each AAR row
    enriched_results = []

    for row in aar_rows:
        trainee = user_by_id.get(row.get("trainee_id"))
        scenario = scenario_by_id.get(row.get("scenario_id"))

        enriched_results.append({
            **row,
            "trainee_name": trainee["name"] if trainee else row.get("trainee_id"),
            "course_name": scenario["course_name"] if scenario else row.get("scenario_id"),
        })

    return enriched_results