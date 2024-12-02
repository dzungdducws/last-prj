from pydantic import BaseModel
from datetime import datetime

class RoleBase(BaseModel):
    user_id: int
    room_id: int
    role_detail: int

class RoleCreate(RoleBase):
    pass

class RoleResponse(RoleBase):
    role_id: int
    created_at: datetime

    class Config:
        from_attributes = True
