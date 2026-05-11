from fastapi import APIRouter
from repositories.assignment_repo import get_assignment_by_launch_code
from services.assignment_service import orchestrate_assignment
from pydantic import BaseModel

router = APIRouter(prefix="/assignment")

class AssignRequest(BaseModel):
    trainee_id: str
    scenario_id: str

@router.post("/assign_course")
def assign_course(req: AssignRequest):
    return orchestrate_assignment(req)



router = APIRouter(prefix="/assignment", tags=["Assignment"])

@router.get("/vr_training_by_code/{launch_code}")
def get_vr_training_by_code(launch_code: str):
    data = get_assignment_by_launch_code(launch_code)
    return data