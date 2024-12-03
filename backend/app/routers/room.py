from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..models import Room
from ..schemas import RoomBase
from ..utils import get_db

router = APIRouter()

@router.post("/create_room")
def create_room(roomBase: RoomBase, db: Session = Depends(get_db)):
    new_room = Room(room_name=roomBase.room_name, room_description=roomBase.room_description)
    db.add(new_room)
    db.commit()
    db.refresh(new_room)
    return {"room_id": new_room.room_id, "room_name": new_room.room_name}
