
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
from .routers import user, message, room, websocket, task
from .database import create_database
import logging

logging.basicConfig(level=logging.DEBUG, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    handlers=[logging.FileHandler("app.log"), logging.StreamHandler()])

logger = logging.getLogger(__name__)

app = FastAPI()
create_database()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,  
    allow_methods=["*"], 
    allow_headers=["*"],  
)

app.include_router(user.router, prefix="/users", tags=["users"])
app.include_router(message.router, prefix="/messages", tags=["messages"])
app.include_router(room.router, prefix="/room", tags=["room"])
app.include_router(task.router, prefix="/task", tags=["task"])

app.include_router(websocket.router, prefix="/ws", tags=["ws"])


@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

