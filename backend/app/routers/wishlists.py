from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import crud, schemas
from app.routers.auth import get_current_user_id

router = APIRouter(prefix="/api/wishlists", tags=["Wishlists"])

@router.post("/toggle")
def toggle_wishlist_item(
    wishlist_in: schemas.WishlistCreate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Toggle a listing in the user's wishlist/favorites."""
    listing = crud.get_listing_by_id(db, wishlist_in.listing_id)
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
        
    is_saved = crud.toggle_wishlist(db, user_id=user_id, listing_id=wishlist_in.listing_id)
    return {"saved": is_saved, "listing_id": wishlist_in.listing_id}

@router.get("", response_model=List[schemas.WishlistOut])
def get_user_wishlist(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get saved wishlist items for active user."""
    items = crud.get_user_wishlist(db, user_id=user_id)
    results = []
    for item in items:
        avg_rating, count = crud.get_listing_avg_rating(db, item.listing_id)
        listing_summary = schemas.ListingOutSummary(
            id=item.listing.id,
            title=item.listing.title,
            description=item.listing.description,
            category=item.listing.category,
            property_type=item.listing.property_type,
            location_city=item.listing.location_city,
            location_country=item.listing.location_country,
            latitude=item.listing.latitude,
            longitude=item.listing.longitude,
            price_per_night=item.listing.price_per_night,
            cleaning_fee=item.listing.cleaning_fee,
            service_fee=item.listing.service_fee,
            max_guests=item.listing.max_guests,
            bedrooms=item.listing.bedrooms,
            beds=item.listing.beds,
            baths=item.listing.baths,
            host_id=item.listing.host_id,
            host=schemas.UserOut.model_validate(item.listing.host),
            images=[schemas.ListingImageOut.model_validate(img) for img in item.listing.images],
            avg_rating=avg_rating,
            review_count=count,
            created_at=item.listing.created_at
        )
        results.append(schemas.WishlistOut(
            id=item.id,
            user_id=item.user_id,
            listing_id=item.listing_id,
            listing=listing_summary,
            created_at=item.created_at
        ))
    return results
