from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app import crud, schemas

router = APIRouter(prefix="/api/auth", tags=["Auth & Users"])

def get_current_user_id(x_user_id: Optional[str] = Header(None)) -> int:
    """Header dependency for retrieving the current active user ID (defaults to 1 - Guest)."""
    if x_user_id and x_user_id.isdigit():
        return int(x_user_id)
    return 1

@router.get("/users", response_model=List[schemas.UserOut])
def get_all_users(db: Session = Depends(get_db)):
    """List all available seed users for role switching."""
    return crud.get_users(db)

@router.get("/me", response_model=schemas.UserOut)
def get_current_user_profile(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Retrieve profile of currently active user."""
    user = crud.get_user(db, user_id)
    if not user:
        # Fallback to first user
        users = crud.get_users(db)
        if users:
            return users[0]
        raise ValueError("No users found in database")
    return user
