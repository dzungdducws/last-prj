from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CardBase(BaseModel):
    list_id: int
    card_title: str
    card_description: Optional[str] = None
    due_date: Optional[datetime] = None

class CardCreate(CardBase):
    pass

class CardResponse(CardBase):
    card_id: int
    created_at: datetime

    class Config:
        from_attributes = True
