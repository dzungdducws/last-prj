from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from .routers import user, message, room, websocket  
from .database import create_database
from sqlalchemy.orm import Session

# Create FastAPI app
app = FastAPI()
create_database()

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all domains
    allow_credentials=True,  # Allow sending cookies
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


app.include_router(user.router, prefix="/users", tags=["users"])
app.include_router(message.router, prefix="/messages", tags=["messages"])
app.include_router(room.router, prefix="/room", tags=["room"])
app.include_router(websocket.router, prefix="/ws", tags=["websocket"])

