from pydantic import BaseModel
from typing import Dict

class GenerateScenarioRequest(BaseModel):
    skill_category: str
    skill: str
    difficulty: str


class SaveScenarioRequest(BaseModel):
    user_id: str | None = None
    scenario_id: str | None = None
    scenario_json: Dict
    skill: str
    skill_category: str
    difficulty: str
    course_name: str | None = None
    rationale: str | None = None
    status: str | None = "draft"
    edits: Dict | None = None



class EditScenarioRequest(BaseModel):
    edits: str
