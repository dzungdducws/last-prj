from pydantic import BaseModel
from datetime import datetime

class TaskBase(BaseModel):
    task_id: int
    user_id: int = 0

class TaskCreate(BaseModel):
    sprint_id: int 
    task_title: str 
    task_description: str