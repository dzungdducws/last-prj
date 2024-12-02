from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: str

class UserLogin(BaseModel):
    email: EmailStr
    password:str

class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password:str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
