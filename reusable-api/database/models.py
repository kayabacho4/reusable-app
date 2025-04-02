from pydantic import BaseModel, Field
from sqlalchemy import Column, ForeignKey, Integer, String, Text, DateTime, Table, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker, Session
from typing import Generator, Optional
import datetime
import uuid

DATABASE_URL = "mysql+pymysql://sns_user:sns_password@db:3306/sns_app"

Base = declarative_base()

def generate_uuid():
    return str(uuid.uuid4())

engine = create_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    pool_recycle=3600,
    pool_pre_ping=True,
    echo=False
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

post_likes = Table(
    "post_likes",
    Base.metadata,
    Column("user_id", String(36), ForeignKey("users.id")),
    Column("post_id", String(36), ForeignKey("posts.id")),
    Column("created_at", DateTime, default=datetime.datetime.utcnow)
)

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    username = Column(String(50), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    avatar_url = Column(String(255), nullable=True)
    display_name = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    posts = relationship("Post", back_populates="author")
    liked_posts = relationship("Post", secondary=post_likes, back_populates="liked_by")

class Post(Base):
    __tablename__ = "posts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    posted_by = Column(String(36), ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    author = relationship("User", back_populates="posts")
    liked_by = relationship("User", secondary=post_likes, back_populates="liked_posts")

    @property
    def likes(self):
        return len(self.liked_by)

def init_db():
    Base.metadata.create_all(bind=engine)


class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    display_name: str = Field(..., min_length=1, max_length=100)
    avatar_url: Optional[str] = Field(None, max_length=255)

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(UserBase):
    id: str
    created_at: datetime.datetime

    class Config:
        orm_mode = True