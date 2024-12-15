from pydantic import BaseModel
from datetime import datetime

class TaskBase(BaseModel):
    task_id: int
