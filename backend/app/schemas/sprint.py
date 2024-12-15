from pydantic import BaseModel
from datetime import datetime

class SprintBase(BaseModel):
    room_id: int
    sprint_name: str
