from fastapi import Depends, HTTPException, status
from fastapi_jwt_auth import AuthJWT
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from pydantic import BaseSettings

import models, database

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def authenticate_user(db: Session, username: str, password: str):
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def get_current_user(Authorize: AuthJWT = Depends(), db: Session = Depends(database.get_db)):
    try:
        Authorize.jwt_required()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    
    username = Authorize.get_jwt_subject()
    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

# Configuration for JWT
class Settings(BaseSettings):
    authjwt_secret_key: str = "your_secret_key"

@AuthJWT.load_config
def get_config():
    return Settings()
