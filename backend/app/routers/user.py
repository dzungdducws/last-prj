from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import asc 
from datetime import timedelta
from ..schemas import UserResponse, UserLogin, UserRegister, UserBase
from ..models import User, Role, Room, RoleSelect
from ..utils import hash_password, verify_password, get_db, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token   
router = APIRouter()

@router.get("/", response_model=list[UserResponse])
def view_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users

@router.get("/me")
def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user

@router.post("/login")
def login(userLogin: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == userLogin.email).first()

    if not db_user or not verify_password(userLogin.password, db_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"username": db_user.username, "user_id": db_user.user_id}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer", "user_id": db_user.user_id}


@router.post("/register", response_model=UserBase)
def create_user(userRegister: UserRegister, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == userRegister.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    hashed_password = hash_password(userRegister.password)
    db_user = User(username=userRegister.username, email=userRegister.email, password_hash=hashed_password)
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    db_user = db.query(User).filter(User.email == userRegister.email).first()

    return db_user

@router.get("/view_room_by_id")
def view_room(user_id: int, db: Session = Depends(get_db)):
    roles = (
        db.query(Role, Room.room_name, RoleSelect.role_select_id)
        .join(Room, Role.room_id == Room.room_id)
        .join(RoleSelect, RoleSelect.role_select_id == Role.role_detail)
        .filter(Role.user_id == user_id)
        .order_by(asc(RoleSelect.role_select_id))
        .all()
    )
    
    if not roles:
        raise HTTPException(status_code=404, detail="No roles found for the given user ID")
    
    results = [
        {
            "role": role, 
            "room_name": room_name,
            "role_select_id": role_select_id,
        }
        for role, room_name, role_select_id in roles
    ]
    return results