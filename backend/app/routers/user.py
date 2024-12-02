from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from ..schemas import UserResponse, UserLogin, UserRegister, UserBase
from ..models import User
from ..utils import hash_password, verify_password, get_db, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token   
router = APIRouter()

@router.get("/", response_model=list[UserResponse])
def view_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users

@router.get("/me")
def read_users_me(current_user: str = Depends(get_current_user)):
    return {"username": current_user}

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
    access_token = create_access_token(data={"sub": db_user.username}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}


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