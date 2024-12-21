from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc 
from ..models import Room, Task, Sprint, TaskPerform, User, Role
from ..schemas import RoomBase, SprintBase
from ..utils import get_db

router = APIRouter()

@router.post("/create_room")
def create_room(roomBase: RoomBase, db: Session = Depends(get_db)):
    new_room = Room(room_name=roomBase.room_name, room_description=roomBase.room_description)
    db.add(new_room)
    db.commit()
    db.refresh(new_room)
    return {"room_id": new_room.room_id, "room_name": new_room.room_name}

@router.post("/create_sprint")
def create_sprint(room_id: int, db: Session = Depends(get_db)):
    lastest_sprint = db.query(Sprint).filter(Sprint.room_id == room_id).order_by(desc(Sprint.created_at), desc(Sprint.sprint_name)).all()
    new_sprint = Sprint(room_id=room_id, sprint_name="Sprint no. " + str(len(lastest_sprint)+1))
    db.add(new_sprint)
    db.commit()
    db.refresh(new_sprint)
    return {"sprint_id": new_sprint.sprint_id,"room_id": new_sprint.room_id, "sprint_name": new_sprint.sprint_name}

@router.get("/view_sprint_by_room")
def view_sprint(room_id: int, db: Session = Depends(get_db)):
    res = db.query(Sprint).filter(Sprint.room_id == room_id).order_by(desc(Sprint.created_at), desc(Sprint.sprint_name)).all()
    return res

@router.get("/view_role")
def view_sprint(user_id: int,room_id:int, db: Session = Depends(get_db)):
    res = db.query(Role).filter(Role.room_id == room_id,Role.user_id == user_id).first()
    return res


@router.get("/view_task_by_sprint")
def view_task(sprint_id: int, db: Session = Depends(get_db)):
    # Truy vấn tất cả nhiệm vụ trong sprint
    all_tasks = db.query(Task).filter(Task.sprint_id == sprint_id).all()

    # Truy vấn nhiệm vụ có người thực hiện
    assigned_tasks = (
        db.query(Task.task_id, User.username)
        .join(TaskPerform, TaskPerform.task_id == Task.task_id)
        .join(User, User.user_id == TaskPerform.user_id)
        .filter(Task.sprint_id == sprint_id)
        .all()
    )

    # Chuyển kết quả assigned_tasks thành dict để dễ tìm kiếm
    assigned_dict = {task_id: username for task_id, username in assigned_tasks}

    # Kết hợp dữ liệu
    result = [
        {
            "task": task.to_dict(),  # Sử dụng phương thức `to_dict` từ model Task
            "username": assigned_dict.get(task.task_id, ""),  # Lấy username nếu có, nếu không để trống
        }
        for task in all_tasks
    ]

    return result
