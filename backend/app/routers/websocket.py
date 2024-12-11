# websocket_router.py

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from ..websocket_handler import ConnectionManager
from ..utils import get_db
from ..models import Message

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
            # await manager.send_personal_message(
            #                     json.dumps({
            #                             "type": "personal", 
            #                             "message": message_data['messageText']
            #                         }),
            #                     websocket,
            #                 )            

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
