from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class RoomBase(BaseModel):
    room_name: str
    room_description: Optional[str] = None

class RoomCreate(RoomBase):
    pass

class RoomResponse(RoomBase):
    room_id: int
    created_at: datetime

    class Config:
        from_attributes = True
