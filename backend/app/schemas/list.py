from pydantic import BaseModel
from datetime import datetime

class ListBase(BaseModel):
    room_id: int
    list_name: str

class ListCreate(ListBase):
    pass

class ListResponse(ListBase):
    list_id: int
    created_at: datetime

    class Config:
        from_attributes = True
