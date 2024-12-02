from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from .routers import user
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

@app.get("/me")
def test():
    return {"username": "test"}

app.include_router(user.router, prefix="/users", tags=["users"])

