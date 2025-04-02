import uuid
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc
from typing import List, Optional
from database.models import Post, User, UserCreate, post_likes
from models.post import PostCreate

from passlib.context import CryptContext

def get_all_posts(
    db: Session, 
    skip: int = 0, 
    limit: int = 100, 
    sort_by: str = "newest"
) -> List[Post]:
    query = db.query(Post).options(joinedload(Post.author))
    
    if sort_by == "newest":
        query = query.order_by(desc(Post.created_at))
    elif sort_by == "popular":
        query = query.outerjoin(post_likes).group_by(Post.id).order_by(desc(db.func.count(post_likes.c.post_id)))
    
    return query.offset(skip).limit(limit).all()

def get_total_posts_count(db: Session) -> int:
    return db.query(Post).count()

def create_post(db: Session, content: str, user_id: str) -> Post:
    db_post = Post(
        content=content,
        posted_by=user_id,
        
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

def get_post(db: Session, post_id: str) -> Optional[Post]:
    return db.query(Post).filter(Post.id == post_id).first()

def get_posts_by_user(db: Session, user_id: str, skip: int = 0, limit: int = 100) -> List[Post]:
    return db.query(Post).filter(Post.posted_by == user_id).order_by(desc(Post.created_at)).offset(skip).limit(limit).all()

def like_post(db: Session, post_id: str, user_id: str) -> bool:
    post = get_post(db, post_id)
    user = db.query(User).filter(User.id == user_id).first()
    
    if not post or not user:
        return False
    
    if user in post.liked_by:
        post.liked_by.remove(user)
        db.commit()
        return False
    else:
        post.liked_by.append(user)
        db.commit()
        return True

def delete_post(db: Session, post_id: str) -> bool:
    post = get_post(db, post_id)

    if not post:
        return False

    db.delete(post)
    db.commit()

    return True

def get_user(db: Session, user_id: str) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_username(db: Session, username: str) -> Optional[User]:
    return db.query(User).filter(User.username == username).first()

def create_user(db: Session, user: UserCreate) -> User:

    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    password_hash = pwd_context.hash(user.password)
    
    user_id = str(uuid.uuid4())
    
    db_user = User(
        id=user_id,
        username=user.username,
        password_hash=password_hash,
        display_name=user.display_name if hasattr(user, 'display_name') else user.username,
        avatar_url=user.avatar_url if hasattr(user, 'avatar_url') else None
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

def update_user(db: Session, user_id: str, user_data: dict) -> Optional[User]:
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    
    for key, value in user_data.items():
        if hasattr(db_user, key) and key != "id" and key != "hashed_password":
            setattr(db_user, key, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: str) -> bool:
    db_user = get_user(db, user_id)
    if not db_user:
        return False
    
    db.delete(db_user)
    db.commit()
    return True