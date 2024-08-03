# seed.py
from sqlalchemy.orm import Session
from database import engine
from models import Base, User, Task
from auth import get_password_hash

def seed():
    Base.metadata.create_all(bind=engine)
    db = Session(bind=engine)
    
    user1 = User(username="user1", hashed_password=get_password_hash("password1"))
    user2 = User(username="user2", hashed_password=get_password_hash("password2"))
    
    task1 = Task(title="Task 1", description="Description for Task 1", owner=user1)
    task2 = Task(title="Task 2", description="Description for Task 2", owner=user1)
    task3 = Task(title="Task 3", description="Description for Task 3", owner=user2)
    
    db.add(user1)
    db.add(user2)
    db.add(task1)
    db.add(task2)
    db.add(task3)
    
    db.commit()
    db.close()

if __name__ == "__main__":
    seed()
