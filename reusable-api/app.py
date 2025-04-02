from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.security import OAuth2PasswordRequestForm

from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from passlib.context import CryptContext

from database.models import get_db
from models.user import User, UserCreate, LoginRequest, UserBase
from models.post import Post, PostCreate, PostWithAuthor, PostsResponse
import crud.crud as crud

from logging import getLogger, StreamHandler

logger = getLogger(__name__)
logger.addHandler(StreamHandler())
logger.setLevel("INFO")  

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

@app.post("/api/users/", response_model=User)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    logger.info(user)
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    return crud.create_user(db=db, user=user)

@app.post("/api/users/{user_id}/update", response_model=User)
def update_user(user: UserBase, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username=user.username)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User does not exist"
        )
    logger.info(user)
    return crud.update_user(db=db, user_id=db_user.id, user_data=vars(user))
    

@app.get("/api/users/{user_id}", response_model=User)
def read_user(user_id: str, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return db_user


@app.post("/api/login")
def login(
    login_data: LoginRequest, 
    db: Session = Depends(get_db)
):
    user = crud.get_user_by_username(db, username=login_data.username)
    
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return {
        "id": str(user.id),
        "username": user.username,
        "display_name": user.display_name,
        "avatar_url": user.avatar_url,
        "authenticated": True,
        "created_at": user.created_at.isoformat()
    }

@app.post("/api/posts/", response_model=Post)
def create_post(
    post_data: PostCreate,
    db: Session = Depends(get_db)
):
    return crud.create_post(
        db=db, 
        content=post_data.content, 
        user_id=post_data.user_id
    )

@app.get("/api/posts/", response_model=PostsResponse)
def read_all_posts(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    sort_by: str = Query("newest", pattern="^(newest|popular)$"),
    db: Session = Depends(get_db)
):
    posts = crud.get_all_posts(db, skip=skip, limit=limit, sort_by=sort_by)
    total = crud.get_total_posts_count(db)
    
    return {
        "items": posts,
        "total": total
    }

@app.delete("/api/posts/{post_id}/")
def delete_post(post_id: str, db: Session = Depends(get_db)):
    return crud.delete_post(db, post_id=post_id)

@app.get("/api/users/{user_id}/posts", response_model=List[Post])
def read_user_posts(user_id: str, db: Session = Depends(get_db)):
    return crud.get_posts_by_user(db, user_id=user_id)

@app.post("/api/posts/{post_id}/like")
def like_post(post_id: str, user_id: str, db: Session = Depends(get_db)):
    return crud.like_post(db=db, post_id=post_id, user_id=user_id)

@app.get("/")
async def root():
    return {"message": "Hello from Fast API"}