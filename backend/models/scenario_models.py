from pydantic import BaseModel
from typing import Dict

from pydantic import Field
from typing import List, Optional

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


class Environment(BaseModel):
    location: str = Field(..., min_length=1)
    terrain: str = Field(..., min_length=1)
    weather: str = Field(..., min_length=1)

class Casualty(BaseModel):
    name: str = Field(..., min_length=1)
    injuries: List[str] = Field(..., min_items=1)
    status: str = Field(..., min_length=1)

class Inject(BaseModel):
    type: str
    location: str

class Objective(BaseModel):
    type: str
    description: str

class ExpectedAction(BaseModel):
    action: str
    justification: str

class EvaluationMetric(BaseModel):
    metric: str
    target: str

class ScenarioSpec(BaseModel):
    environment: Environment
    skill_category: str
    skill: str
    difficulty: str
    casualties: List[Casualty]
    injects: List[Inject]
    objectives: List[Objective]
    expected_actions: List[ExpectedAction]
    evaluation_metrics: List[EvaluationMetric]
    rationale: Optional[str] = None
