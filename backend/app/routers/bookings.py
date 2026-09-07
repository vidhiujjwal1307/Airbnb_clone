from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import crud, schemas
from app.routers.auth import get_current_user_id

router = APIRouter(prefix="/api/bookings", tags=["Bookings"])

def _format_booking_out(db: Session, booking: crud.models.Booking) -> schemas.BookingOut:
    """Helper to convert ORM booking to BookingOut schema with listing summary."""
    avg_rating, count = crud.get_listing_avg_rating(db, booking.listing_id)
    listing_summary = schemas.ListingOutSummary(
        id=booking.listing.id,
        title=booking.listing.title,
        description=booking.listing.description,
        category=booking.listing.category,
        property_type=booking.listing.property_type,
        location_city=booking.listing.location_city,
        location_country=booking.listing.location_country,
        latitude=booking.listing.latitude,
        longitude=booking.listing.longitude,
        price_per_night=booking.listing.price_per_night,
        cleaning_fee=booking.listing.cleaning_fee,
        service_fee=booking.listing.service_fee,
        max_guests=booking.listing.max_guests,
        bedrooms=booking.listing.bedrooms,
        beds=booking.listing.beds,
        baths=booking.listing.baths,
        host_id=booking.listing.host_id,
        host=schemas.UserOut.model_validate(booking.listing.host),
        images=[schemas.ListingImageOut.model_validate(img) for img in booking.listing.images],
        avg_rating=avg_rating,
        review_count=count,
        created_at=booking.listing.created_at
    )

    return schemas.BookingOut(
        id=booking.id,
        listing_id=booking.listing_id,
        guest_id=booking.guest_id,
        check_in=booking.check_in,
        check_out=booking.check_out,
        guests_count=booking.guests_count,
        total_price=booking.total_price,
        status=booking.status,
        created_at=booking.created_at,
        guest=schemas.UserOut.model_validate(booking.guest),
        listing=listing_summary
    )

@router.post("", response_model=schemas.BookingOut, status_code=status.HTTP_201_CREATED)
def create_booking(
    booking_in: schemas.BookingCreate,
    guest_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Reserve a stay for selected dates."""
    try:
        booking = crud.create_booking(db, booking_in, guest_id=guest_id)
        return _format_booking_out(db, booking)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/my-trips", response_model=List[schemas.BookingOut])
def get_my_trips(
    guest_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Retrieve active guest's booked trips."""
    bookings = crud.get_user_bookings(db, guest_id=guest_id)
    return [_format_booking_out(db, b) for b in bookings]

@router.get("/host-reservations", response_model=List[schemas.BookingOut])
def get_host_reservations(
    host_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Retrieve reservations made on host's listings."""
    bookings = crud.get_host_bookings(db, host_id=host_id)
    return [_format_booking_out(db, b) for b in bookings]

@router.post("/{booking_id}/cancel", response_model=schemas.BookingOut)
def cancel_booking(
    booking_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Cancel an upcoming stay booking."""
    success = crud.cancel_booking(db, booking_id, user_id=user_id)
    if not success:
        raise HTTPException(status_code=400, detail="Booking not found or not authorized to cancel")
    booking = db.query(crud.models.Booking).filter(crud.models.Booking.id == booking_id).first()
    return _format_booking_out(db, booking)
