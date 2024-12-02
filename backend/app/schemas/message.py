from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MessageBase(BaseModel):
    user_id: int
    room_id: int
    message_detail: str
    message_attachments: Optional[str] = None

class MessageCreate(MessageBase):
    pass

class MessageResponse(MessageBase):
    message_id: int
    created_at: datetime

    class Config:
        from_attributes = True
