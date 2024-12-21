from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc 
from ..models import Room, Task, Sprint, CommentTask, User, TaskPerform
from ..schemas import TaskBase, TaskCreate
from ..utils import get_db

router = APIRouter()

@router.post("/create_task")
def create_task(taskCreate: TaskCreate, db: Session = Depends(get_db)):
    task = Task(sprint_id = taskCreate.sprint_id, task_title = taskCreate.task_title, task_description = taskCreate.task_description, task_type = 0)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.post("/change_to_backlog")
def change_to_backlog(taskBase: TaskBase, db: Session = Depends(get_db)):
    res = db.query(Task).filter(Task.task_id == taskBase.task_id).first()
    res.task_type = 0
    db.commit()
    return 200

@router.post("/change_to_todo")
def change_to_todo(taskBase: TaskBase, db: Session = Depends(get_db)):
    res = db.query(Task).filter(Task.task_id == taskBase.task_id).first()
    res.task_type = 1
    db.commit()
    return 200

@router.post("/change_to_inprogress")
def change_to_inprogress(taskBase: TaskBase, db: Session = Depends(get_db)):
    res = db.query(Task).filter(Task.task_id == taskBase.task_id).first()
    res.task_type = 2
    db.commit()
    return 200

@router.post("/change_to_testing")
def change_to_testing(taskBase: TaskBase, db: Session = Depends(get_db)):
    res = db.query(Task).filter(Task.task_id == taskBase.task_id).first()
    res.task_type = 3
    db.commit()
    return 200

@router.post("/change_to_review")
def change_to_review(taskBase: TaskBase, db: Session = Depends(get_db)):
    res = db.query(Task).filter(Task.task_id == taskBase.task_id).first()
    res.task_type = 4
    db.commit()
    return 200


@router.post("/change_to_done")
def change_to_done(taskBase: TaskBase, db: Session = Depends(get_db)):
    res = db.query(Task).filter(Task.task_id == taskBase.task_id).first()
    res.task_type = 5
    db.commit()
    return 200

@router.post("/come_back")
def come_back(taskBase: TaskBase, db: Session = Depends(get_db)):
    res = db.query(Task).filter(Task.task_id == taskBase.task_id).first()
    res.task_type = res.task_type - 1
    if res.task_type == 0:
        delRes = db.query(TaskPerform).filter(TaskPerform.task_id == taskBase.task_id).first()
        db.delete(delRes)
    db.commit()
    return res

@router.post("/move_forward")
def move_forward(taskBase: TaskBase, db: Session = Depends(get_db)):
    res = db.query(Task).filter(Task.task_id == taskBase.task_id).first()
    if res.task_type == 0:
        addRes = TaskPerform(task_id = taskBase.task_id, user_id = taskBase.user_id)
        db.add(addRes)
        db.commit()
        db.refresh(addRes)

    res.task_type = res.task_type + 1
    db.commit()
    return res

@router.get("/comments")
def comments(task_id: int, db: Session = Depends(get_db)):
    res = (
        db.query(CommentTask, User.username)
        .join(User, User.user_id == CommentTask.user_id)
        .filter(CommentTask.task_id == task_id)
        .order_by(desc(CommentTask.created_at))
        .all()
    )

    # Mapping the result into a readable format for the frontend
    comments_data = [
        {
            "comment_task_id": comment_task.comment_task_id,
            "message_detail": comment_task.message_detail,
            "created_at": comment_task.created_at,
            "user_id": comment_task.user_id,
            "task_id": comment_task.task_id,
            "message_attachments": comment_task.message_attachments,
            "username": username
        }
        for comment_task, username in res
    ]

    return comments_data
