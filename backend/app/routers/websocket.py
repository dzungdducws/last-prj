# websocket_router.py

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from ..websocket_handler import ConnectionManager
from ..utils import get_db
from ..models import Message, CommentTask

import json
router = APIRouter()

manager = ConnectionManager()

@router.websocket("/chat_room/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: int, db: Session = Depends(get_db)):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
         
            message = Message(room_id=room_id, user_id=message_data['user_id'], message_detail=message_data["messageText"])
            db.add(message)
            db.commit()
            db.refresh(message)

            await manager.broadcast(
                    json.dumps({
                        "type": "broadcast",
                        "message_id": message.message_id,
                        "room_id": room_id,
                        "user_id": message_data['user_id'],
                        "username": message_data['username'],
                        "message_detail": message_data["messageText"],
                        "created_at": message.created_at.isoformat()
                    })
                )
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        # await manager.broadcast(f"Client #{room_id} left the chat")


@router.websocket("/cmt/{task_id}")
async def websocket_endpoint(websocket: WebSocket, task_id: int, db: Session = Depends(get_db)):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            _data = json.loads(data)
         
            message = CommentTask(task_id=task_id, user_id=_data['user_id'], message_detail=_data["message_detail"])
            db.add(message)
            db.commit()
            db.refresh(message)

            await manager.broadcast(
                    json.dumps({
                        "type": "broadcast",
                        "comment_task_id": message.comment_task_id,
                        "task_id": task_id,
                        "user_id": _data['user_id'],
                        "username": _data['username'],
                        "message_detail": _data["message_detail"],
                        "created_at": message.created_at.isoformat()
                    })
                )
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        # await manager.broadcast(f"Client #{room_id} left the chat")
