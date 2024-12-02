from sqlalchemy import Column, Integer, String , ForeignKey, Text, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy import Enum
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
    commentcart = relationship("CommentCard", back_populates="user")

class Room(Base):
    __tablename__ = "room"

    room_id = Column(Integer, primary_key=True, index=True)
    room_name = Column(String(50), nullable=False)
    room_description = Column(Text)

    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())

    roles = relationship("Role", back_populates="room")
    messages = relationship("Message", back_populates="room")
    lists = relationship("List", back_populates="room")

class RoleSelect(Base):
    __tablename__ = "roleselect"

    role_select_id = Column(Integer, primary_key=True, index=True)
    role_select_detail = Column(String(50), nullable=False)

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
    message_attachments =  Column(Text, nullable=True)

    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())

    user = relationship("User", back_populates="messages")
    room = relationship("Room", back_populates="messages")    

class List(Base):
    __tablename__ = "list"

    list_id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("room.room_id"), nullable=False)

    list_name = Column(String(255), nullable=False)
    
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())

    room = relationship("Room", back_populates="lists")
    cards = relationship("Card", back_populates="list")

class Card(Base):
    __tablename__ = "card"

    card_id = Column(Integer, primary_key=True, index=True)
    list_id = Column(Integer, ForeignKey("list.list_id"))

    card_title = Column(String(255), index=True)
    card_description = Column(Text)

    due_date = Column(TIMESTAMP, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())

    list = relationship("List", back_populates="cards")
    commentcart = relationship("CommentCard", back_populates="card")

class CommentCard(Base):    
    __tablename__ = "commentcart"

    comment_cart_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.user_id"), nullable=False)
    card_id = Column(Integer, ForeignKey("card.card_id"), nullable=False)

    message_detail = Column(Text)
    message_attachments =  Column(Text, nullable=True)

    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())

    user = relationship("User", back_populates="commentcart")
    card = relationship("Card", back_populates="commentcart")   

