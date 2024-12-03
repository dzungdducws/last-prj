from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc 
from ..models import User, Room, Message
from ..utils import get_db

router = APIRouter()

@router.get("/view_message_by_room_id")
def view_message(room_id: int, db: Session = Depends(get_db)):
    messages = (
        db.query(Message, User.user_id, User.username)
        .join(User, User.user_id == Message.user_id)
        .filter(Message.room_id == room_id)
        .order_by(desc(Message.created_at))
        .all()
    )
    
    if not messages:
        raise HTTPException(status_code=404, detail="No messages found for the given room ID")
    
    results = [
        {
            "user_id": user_id,
            "user_name": username,
            "message_detail": message.message_detail,  # Ensuring the field name matches your schema
            "created_at": message.created_at,
        }
        for message, user_id, username in messages
    ]
    return results

@router.post("/send_message")
def send_message(room_id: int, user_id: int, message_detail: str, db: Session = Depends(get_db)):
    room = db.query(Room).filter(Room.room_id == room_id).first()
    user = db.query(User).filter(User.user_id == user_id).first()

    if not room or not user:
        raise HTTPException(status_code=404, detail="Room or User not found")

    message = Message(room_id=room.room_id, user_id=user.user_id, message_detail=message_detail)
    db.add(message)
    db.commit()
    db.refresh(message)
    return {"message": "Message sent successfully"}