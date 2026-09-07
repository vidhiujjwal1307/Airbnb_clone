from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import crud, schemas
from app.routers.auth import get_current_user_id

router = APIRouter(prefix="/api/reviews", tags=["Reviews"])

@router.post("", response_model=schemas.ReviewOut, status_code=status.HTTP_201_CREATED)
def add_listing_review(
    review_in: schemas.ReviewCreate,
    author_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Post a rating and review for a listing."""
    listing = crud.get_listing_by_id(db, review_in.listing_id)
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
        
    review = crud.create_review(db, review_in, author_id=author_id)
    return schemas.ReviewOut.model_validate(review)

@router.get("/listing/{listing_id}", response_model=List[schemas.ReviewOut])
def get_listing_reviews(listing_id: int, db: Session = Depends(get_db)):
    """Retrieve reviews for a listing."""
    reviews = crud.get_listing_reviews(db, listing_id)
    return [schemas.ReviewOut.model_validate(r) for r in reviews]
