from fastapi import APIRouter, HTTPException
from supabase import create_client
import os

router = APIRouter(prefix="/registry", tags=["registry"])

# Your Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


@router.get("/all")
async def get_all_registries():
    try:
        # Fetch each registry table
        skill_categories = supabase.table("skill_categories").select("*").execute().data
        skills = supabase.table("skills").select("*").execute().data
        difficulty_levels = supabase.table("difficulty_levels").select("*").execute().data
        objective_types = supabase.table("objective_types").select("*").execute().data
        casualty_statuses = supabase.table("casualty_status_options").select("*").execute().data
        injuries = supabase.table("injuries").select("*").execute().data
        inject_types = supabase.table("inject_types").select("*").execute().data
        environments = supabase.table("environment_types").select("*").execute().data
        expected_actions = supabase.table("expected_actions_def").select("*").execute().data
        evaluation_metrics = supabase.table("evaluation_metric_templates").select("*").execute().data

        # Convert skills into category → list structure
        skills_grouped = {}
        for category in skill_categories:
            cat_id = category["id"]
            cat_name = category["name"]
            skills_grouped[cat_name] = [
                s["name"] for s in skills if s["category_id"] == cat_id
            ]

        return {
            "skill_categories": [c["name"] for c in skill_categories],
            "skills_by_category": skills_grouped,
            "difficulty_levels": [d["level"] for d in difficulty_levels],
            "objective_types": objective_types,
            "casualty_status_options": [c["status_name"] for c in casualty_statuses],
            "injuries": injuries,
            "inject_types": inject_types,
            "environment_types": environments,
            "expected_actions": expected_actions,
            "evaluation_metric_templates": evaluation_metrics
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registry fetch failed: {str(e)}")
