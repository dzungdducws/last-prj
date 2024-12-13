from sqlalchemy import Column, Integer, String, ForeignKey, Text, TIMESTAMP, Enum, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base, create_database

class User(Base):
    __tablename__ = "user"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), nullable=False)
    email = Column(String(100), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())

    roles = relationship("Role", back_populates="user")
    messages = relationship("Message", back_populates="user")
    commenttask = relationship("CommentTask", back_populates="user")

class Room(Base):
    __tablename__ = "room"

    room_id = Column(Integer, primary_key=True, index=True)
    room_name = Column(String(50), nullable=False)
    room_description = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())

    roles = relationship("Role", back_populates="room")
    messages = relationship("Message", back_populates="room")
    sprints = relationship("Sprint", back_populates="room")

class RoleSelect(Base):
    __tablename__ = "roleselect"

    role_select_id = Column(Integer, primary_key=True, index=True)
    role_select_detail = Column(Enum("Admin", "Member", "Guest", name="role_type"), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())

class Role(Base):
    __tablename__ = "role"

    role_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.user_id"), nullable=False)
    room_id = Column(Integer, ForeignKey("room.room_id"), nullable=False)
    role_detail = Column(Integer, ForeignKey("roleselect.role_select_id"), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())

    user = relationship("User", back_populates="roles")
    room = relationship("Room", back_populates="roles")

class Message(Base):    
    __tablename__ = "message"

    message_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.user_id"), nullable=False)
    room_id = Column(Integer, ForeignKey("room.room_id"), nullable=False)
    message_detail = Column(Text)
    message_attachments = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())

    user = relationship("User", back_populates="messages")
    room = relationship("Room", back_populates="messages")

class Sprint(Base):
    __tablename__ = "sprint"

    sprint_id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("room.room_id"), nullable=False)
    sprint_name = Column(String(255), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())

    room = relationship("Room", back_populates="sprints")
    tasks = relationship("Task", back_populates="sprint")

class Task(Base):
    __tablename__ = "task"

    task_id = Column(Integer, primary_key=True, index=True)
    sprint_id = Column(Integer, ForeignKey("sprint.sprint_id"))
    task_title = Column(String(255), index=True)
    task_description = Column(Text)
    task_type = Column(Integer)
    due_date = Column(TIMESTAMP, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())

    sprint = relationship("Sprint", back_populates="tasks")
    commenttasks = relationship("CommentTask", back_populates="task")

class CommentTask(Base):    
    __tablename__ = "commenttask"

    comment_task_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.user_id"), nullable=False)
    task_id = Column(Integer, ForeignKey("task.task_id"), nullable=False)
    message_detail = Column(Text)
    message_attachments = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())

    user = relationship("User", back_populates="commenttask")
    task = relationship("Task", back_populates="commenttasks")
