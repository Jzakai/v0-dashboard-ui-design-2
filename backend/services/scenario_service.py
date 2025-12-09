from agent.rag_agent_openrouter import generate_scenario_from_agent, modify_scenario_with_agent, extract_json_from_llm_output, normalize_scenario_spec
from repositories import scenario_repo
from utils.schema_validator import validate_scenario_schema

def orchestrate_generate_scenario(req):
    result = generate_scenario_from_agent(
        req.skill_category, req.skill, req.difficulty
    )


    scenario_spec = result["scenario_spec"]
    rationale = result["rationale"]

    # Validate ONLY the scenario spec (not the wrapper)
    validate_scenario_schema(scenario_spec)

    #save version to DB
    scenario_id = scenario_repo.save_scenario(
            scenario_spec,
            req.skill,
            req.skill_category,
            req.difficulty,
            version=1,
        
        )
    
    #create an instance of savescenariorequest to save the scenario attributes

    # Return exactly what the frontend expects
    return {
        "scenario_id": scenario_id,
        "scenario_spec": scenario_spec,
        "rationale": rationale
    }
    
    
    

    '''

    return {
        #"scenario_id": scenario_id,
        "scenario_json": scenario_json,
        "skill": req.skill,
        "skill_category": req.skill_category,
        "difficulty": req.difficulty,
        "version": 1,
    }

     '''

def orchestrate_save_scenario(req):

    # Validate JSON structure
    validate_scenario_schema(req.scenario_json)

    # If edits exist – use the LLM to modify
    updated_json = req.scenario_json
    if req.edits:
        updated_json = modify_scenario_with_agent(req.scenario_json, req.edits)
        validate_scenario_schema(updated_json)

    # Save FINAL VERSION
    scenario_repo.update_scenario(
        user_id = req.user_id,
        scenario_id=req.scenario_id,
        scenario_json=updated_json,
        skill=req.skill,
        skill_category=req.skill_category,
        difficulty=req.difficulty,
        course_name=req.course_name,
        status="final",
        rationale=req.rationale
    )

    return {"status": "Saved", "scenario_id": req.scenario_id}

'''
def orchestrate_save_scenario(req):
    validate_scenario_schema(req.scenario_json)

    updated_json = req.scenario_json

    if req.edits:
        updated_json = modify_scenario_with_agent(req.scenario_json, req.edits)
        validate_scenario_schema(updated_json)

    scenario_repo.save_scenario(
        updated_json,
        req.skill,
        req.skill_category,
        req.difficulty,
        req.version,
        req.course_name

    )

    return {"status": "Saved", "scenario_id": req.scenario_id}

'''
def orchestrate_edit_scenario(req):

    if req.edits:
        updated_json = modify_scenario_with_agent(req.scenario_json, req.edits)
        validate_scenario_schema(updated_json)

    else:
        updated_json = req.scenario_json

    scenario_repo.save_scenario(
        updated_json,
        req.skill,
        req.skill_category,
        req.difficulty,
        req.version,
        req.course_name

    )

    return {"status": "Saved", "scenario_id": req.scenario_id}
