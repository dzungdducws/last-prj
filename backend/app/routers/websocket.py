# websocket.py

from fastapi import WebSocket, WebSocketDisconnect, APIRouter, Depends
from sqlalchemy.orm import Session
from ..models import Room, Message, User
from ..utils import get_db

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[int, list[WebSocket]] = {}

    async def connect(self, room_id: int, websocket: WebSocket):
        if room_id not in self.active_connections:
            self.active_connections[room_id] = []
        self.active_connections[room_id].append(websocket)
        await websocket.accept()

    def disconnect(self, room_id: int, websocket: WebSocket):
        if room_id in self.active_connections:
            self.active_connections[room_id].remove(websocket)

    async def send_personal_message(self, room_id: int, message: str):
        if room_id in self.active_connections:
            for connection in self.active_connections[room_id]:
                await connection.send_text(message)

manager = ConnectionManager()

@router.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: int, db: Session = Depends(get_db)):
    await manager.connect(room_id, websocket)
    
    try:
        while True:
            data = await websocket.receive_text()
            # Here, save the message to the DB
            room = db.query(Room).filter(Room.room_id == room_id).first()
            if room:
                # Broadcast the message to the room
                await manager.send_personal_message(room_id, f"New message: {data}")
            else:
                await websocket.send_text("Room not found!")
    except WebSocketDisconnect:
        manager.disconnect(room_id, websocket)
