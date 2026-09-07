import math
import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import crud, schemas
from app.routers.auth import get_current_user_id

router = APIRouter(prefix="/api/listings", tags=["Listings"])

def _build_summary(db: Session, item: crud.models.Listing) -> schemas.ListingOutSummary:
    avg_rating, count = crud.get_listing_avg_rating(db, item.id)
    return schemas.ListingOutSummary(
        id=item.id, title=item.title, description=item.description, category=item.category,
        property_type=item.property_type, location_city=item.location_city, location_country=item.location_country,
        latitude=item.latitude, longitude=item.longitude, price_per_night=item.price_per_night,
        cleaning_fee=item.cleaning_fee, service_fee=item.service_fee, max_guests=item.max_guests,
        bedrooms=item.bedrooms, beds=item.beds, baths=item.baths, host_id=item.host_id,
        host=schemas.UserOut.model_validate(item.host),
        images=[schemas.ListingImageOut.model_validate(img) for img in item.images],
        avg_rating=avg_rating, review_count=count, created_at=item.created_at
    )

@router.get("", response_model=schemas.PaginatedListings)
def get_listings(
    category: Optional[str] = Query(None), location: Optional[str] = Query(None),
    check_in: Optional[datetime.date] = Query(None), check_out: Optional[datetime.date] = Query(None),
    guests: Optional[int] = Query(None), min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None), property_type: Optional[str] = Query(None),
    amenities: Optional[List[str]] = Query(None), page: int = Query(1, ge=1),
    size: int = Query(12, ge=1, le=50), db: Session = Depends(get_db)
):
    items, total = crud.filter_listings(
        db, category=category, location=location, check_in=check_in, check_out=check_out,
        guests=guests, min_price=min_price, max_price=max_price, property_type=property_type,
        amenities=amenities, page=page, size=size
    )
    summaries = [_build_summary(db, item) for item in items]
    pages = math.ceil(total / size) if size > 0 else 1
    return schemas.PaginatedListings(items=summaries, total=total, page=page, size=size, pages=pages)

@router.get("/host/my-listings", response_model=List[schemas.ListingOutSummary])
def get_my_host_listings(host_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    items = db.query(crud.models.Listing).filter(crud.models.Listing.host_id == host_id).all()
    return [_build_summary(db, item) for item in items]

@router.get("/{listing_id}", response_model=schemas.ListingOutDetail)
def get_listing_detail(listing_id: int, db: Session = Depends(get_db)):
    item = crud.get_listing_by_id(db, listing_id)
    if not item:
        raise HTTPException(status_code=404, detail="Listing not found")

    avg_rating, count = crud.get_listing_avg_rating(db, item.id)
    booked_dates = crud.get_booked_date_strings(db, item.id)
    reviews = crud.get_listing_reviews(db, item.id)

    return schemas.ListingOutDetail(
        id=item.id, title=item.title, description=item.description, category=item.category,
        property_type=item.property_type, location_city=item.location_city, location_country=item.location_country,
        latitude=item.latitude, longitude=item.longitude, price_per_night=item.price_per_night,
        cleaning_fee=item.cleaning_fee, service_fee=item.service_fee, max_guests=item.max_guests,
        bedrooms=item.bedrooms, beds=item.beds, baths=item.baths, host_id=item.host_id,
        host=schemas.UserOut.model_validate(item.host),
        images=[schemas.ListingImageOut.model_validate(img) for img in item.images],
        amenities=[schemas.ListingAmenityOut.model_validate(am) for am in item.amenities],
        avg_rating=avg_rating, review_count=count, booked_dates=booked_dates,
        reviews=[schemas.ReviewOut.model_validate(r) for r in reviews], created_at=item.created_at
    )

@router.post("", response_model=schemas.ListingOutSummary, status_code=status.HTTP_201_CREATED)
def create_new_listing(listing_in: schemas.ListingCreate, host_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    listing = crud.create_listing(db, listing_in, host_id=host_id)
    return _build_summary(db, listing)

@router.put("/{listing_id}", response_model=schemas.ListingOutSummary)
def update_existing_listing(listing_id: int, listing_in: schemas.ListingUpdate, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    existing = crud.get_listing_by_id(db, listing_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Listing not found")
    if existing.host_id != user_id:
        raise HTTPException(status_code=403, detail="Unauthorized")
    listing = crud.update_listing(db, listing_id, listing_in)
    return _build_summary(db, listing)

@router.delete("/{listing_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_listing(listing_id: int, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    existing = crud.get_listing_by_id(db, listing_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Listing not found")
    if existing.host_id != user_id:
        raise HTTPException(status_code=403, detail="Unauthorized")
    crud.delete_listing(db, listing_id)
    return None
