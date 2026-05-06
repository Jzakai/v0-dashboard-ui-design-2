from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional, Any
from repositories.aar_repo import save_aar_result
from repositories.aar_repo import save_aar_result, get_aar_results

router = APIRouter(prefix="/aar", tags=["AAR"])


class AARResultRequest(BaseModel):
    assignment_id: Optional[str] = None
    scenario_id: Optional[str] = None
    trainee_id: Optional[str] = None

    final_score: int
    sequence_accuracy: int
    speed_score: int
    completion_time: float

    selected_actions: List[str]
    action_timestamps: List[float]
    expected_actions: List[str]


@router.post("/save_result")
def save_result(req: AARResultRequest):
    result = save_aar_result(req)
    return {
        "message": "AAR result saved successfully",
        "result": result
    }

@router.get("/results")
def results():
    data = get_aar_results()
    return {"results": data}