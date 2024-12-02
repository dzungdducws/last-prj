from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CommentCardBase(BaseModel):
    user_id: int
    card_id: int
    message_detail: str
    message_attachments: Optional[str] = None

class CommentCardCreate(CommentCardBase):
    pass

class CommentCardResponse(CommentCardBase):
    comment_card_id: int
    created_at: datetime

    class Config:
        from_attributes = True
