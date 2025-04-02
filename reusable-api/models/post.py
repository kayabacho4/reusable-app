from datetime import datetime
from pydantic import BaseModel
from typing import Optional, List
from models.user import User

class PostBase(BaseModel):
    content: str

class PostCreate(BaseModel):
    content: str
    user_id: str

class PostUpdate(BaseModel):
    content: Optional[str] = None

class Post(PostBase):
    id: str
    posted_by: str
    created_at: datetime
    likes: int = 0

    class Config:
        from_attributes = True

class PostWithAuthor(Post):
    author: User

    class Config:
        orm_mode = True

class PostInDB(Post):
    pass

class PostsResponse(BaseModel):
    items: List[PostWithAuthor]
    total: int

class LikeAction(BaseModel):
    post_id: str
    user_id: str
