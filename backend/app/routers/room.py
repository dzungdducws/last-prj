from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc 
from ..models import Room, Task, Sprint, TaskPerform, User
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



@router.get("/view_sprint_by_room")
def view_sprint(room_id: int, db: Session = Depends(get_db)):
    res = db.query(Sprint).filter(Sprint.room_id == room_id).order_by(desc(Sprint.created_at), desc(Sprint.sprint_name)).all()
    return res

@router.get("/view_task_by_sprint")
def view_task(sprint_id: int, db: Session = Depends(get_db)):
    res = (
        db.query(Task, User.username)
        .join(TaskPerform, TaskPerform.task_id == Task.task_id)
        .join(User, User.user_id == TaskPerform.user_id)
        .filter(Task.sprint_id == sprint_id)
        .all()
    )
    result = [
        {
            "task": task.__dict__,
            "username": username,
        }
        for task, username in res
    ]
    return result

