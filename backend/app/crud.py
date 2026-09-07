import datetime
from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, func
from app import models, schemas

def get_user(db: Session, user_id: int) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_users(db: Session) -> List[models.User]:
    return db.query(models.User).all()

def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    db_user = models.User(**user.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_listing_by_id(db: Session, listing_id: int) -> Optional[models.Listing]:
    return db.query(models.Listing).filter(models.Listing.id == listing_id).first()

def get_listing_avg_rating(db: Session, listing_id: int) -> Tuple[float, int]:
    res = db.query(func.avg(models.Review.rating), func.count(models.Review.id)).filter(models.Review.listing_id == listing_id).first()
    return round(res[0], 2) if res[0] is not None else 5.0, res[1] or 0

def get_booked_date_strings(db: Session, listing_id: int) -> List[str]:
    bookings = db.query(models.Booking).filter(models.Booking.listing_id == listing_id, models.Booking.status == "confirmed").all()
    booked = set()
    for b in bookings:
        cur = b.check_in
        while cur < b.check_out:
            booked.add(cur.strftime("%Y-%m-%d"))
            cur += datetime.timedelta(days=1)
    return sorted(list(booked))

def is_listing_available(db: Session, listing_id: int, check_in: datetime.date, check_out: datetime.date) -> bool:
    overlap = db.query(models.Booking).filter(
        models.Booking.listing_id == listing_id,
        models.Booking.status == "confirmed",
        and_(models.Booking.check_in < check_out, models.Booking.check_out > check_in)
    ).first()
    return overlap is None

def filter_listings(
    db: Session,
    category: Optional[str] = None,
    location: Optional[str] = None,
    check_in: Optional[datetime.date] = None,
    check_out: Optional[datetime.date] = None,
    guests: Optional[int] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    property_type: Optional[str] = None,
    amenities: Optional[List[str]] = None,
    page: int = 1,
    size: int = 12
) -> Tuple[List[models.Listing], int]:
    query = db.query(models.Listing).filter(models.Listing.location_country == "India")
    
    if category and category.strip().lower() not in ["all", "any"]:
        query = query.filter(models.Listing.category.ilike(f"%{category.strip()}%"))
        
    if location and location.strip():
        loc_raw = location.strip().lower()
        if loc_raw not in ["anywhere", "any week", "any", "all"]:
            tokens = [t.strip() for t in loc_raw.replace(',', ' ').split() if t.strip()]
            for token in tokens:
                pat = f"%{token}%"
                query = query.filter(or_(
                    models.Listing.location_city.ilike(pat),
                    models.Listing.location_country.ilike(pat),
                    models.Listing.title.ilike(pat),
                    models.Listing.description.ilike(pat),
                    models.Listing.category.ilike(pat)
                ))
            
    if guests and guests > 0:
        query = query.filter(models.Listing.max_guests >= guests)
        
    if min_price is not None:
        query = query.filter(models.Listing.price_per_night >= min_price)
    if max_price is not None:
        query = query.filter(models.Listing.price_per_night <= max_price)
        
    if property_type and property_type.strip().lower() not in ["any", "all"]:
        query = query.filter(models.Listing.property_type.ilike(f"%{property_type.strip()}%"))

    if check_in and check_out:
        subq = db.query(models.Booking.listing_id).filter(
            models.Booking.status == "confirmed",
            and_(models.Booking.check_in < check_out, models.Booking.check_out > check_in)
        ).subquery()
        query = query.filter(models.Listing.id.not_in(subq))

    if amenities:
        flat = []
        for am in amenities:
            if isinstance(am, str):
                flat.extend([a.strip() for a in am.split(",") if a.strip()])
        for item in flat:
            query = query.filter(models.Listing.amenities.any(models.ListingAmenity.name.ilike(f"%{item}%")))

    total = query.count()
    items = query.order_by(models.Listing.id.desc()).offset((page - 1) * size).limit(size).all()
    return items, total

def create_listing(db: Session, listing_in: schemas.ListingCreate, host_id: int) -> models.Listing:
    db_listing = models.Listing(**listing_in.model_dump(exclude={"images", "amenities"}), host_id=host_id)
    db.add(db_listing)
    db.commit()
    db.refresh(db_listing)

    for idx, url in enumerate(listing_in.images):
        db.add(models.ListingImage(listing_id=db_listing.id, url=url, is_cover=(idx == 0), display_order=idx))

    for am in listing_in.amenities:
        db.add(models.ListingAmenity(listing_id=db_listing.id, name=am))

    db.commit()
    db.refresh(db_listing)
    return db_listing

def update_listing(db: Session, listing_id: int, listing_in: schemas.ListingUpdate) -> Optional[models.Listing]:
    db_listing = get_listing_by_id(db, listing_id)
    if not db_listing:
        return None
    data = listing_in.model_dump(exclude_unset=True)
    imgs = data.pop("images", None)
    ams = data.pop("amenities", None)

    for k, v in data.items():
        setattr(db_listing, k, v)

    if imgs is not None:
        db.query(models.ListingImage).filter(models.ListingImage.listing_id == listing_id).delete()
        for idx, url in enumerate(imgs):
            db.add(models.ListingImage(listing_id=listing_id, url=url, is_cover=(idx == 0), display_order=idx))

    if ams is not None:
        db.query(models.ListingAmenity).filter(models.ListingAmenity.listing_id == listing_id).delete()
        for am in ams:
            db.add(models.ListingAmenity(listing_id=listing_id, name=am))

    db.commit()
    db.refresh(db_listing)
    return db_listing

def delete_listing(db: Session, listing_id: int) -> bool:
    item = get_listing_by_id(db, listing_id)
    if not item:
        return False
    db.delete(item)
    db.commit()
    return True

def create_booking(db: Session, booking_in: schemas.BookingCreate, guest_id: int) -> models.Booking:
    listing = get_listing_by_id(db, booking_in.listing_id)
    if not listing:
        raise ValueError("Listing not found")
    if not is_listing_available(db, booking_in.listing_id, booking_in.check_in, booking_in.check_out):
        raise ValueError("Selected dates are unavailable or already booked")
    nights = (booking_in.check_out - booking_in.check_in).days
    if nights <= 0:
        raise ValueError("Check-out date must be after check-in date")

    total = (listing.price_per_night * nights) + listing.cleaning_fee + listing.service_fee
    booking = models.Booking(
        listing_id=booking_in.listing_id, guest_id=guest_id, check_in=booking_in.check_in,
        check_out=booking_in.check_out, guests_count=booking_in.guests_count, total_price=total, status="confirmed"
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking

def get_user_bookings(db: Session, guest_id: int) -> List[models.Booking]:
    return db.query(models.Booking).filter(models.Booking.guest_id == guest_id).order_by(models.Booking.created_at.desc()).all()

def get_host_bookings(db: Session, host_id: int) -> List[models.Booking]:
    return db.query(models.Booking).join(models.Listing).filter(models.Listing.host_id == host_id).order_by(models.Booking.created_at.desc()).all()

def cancel_booking(db: Session, booking_id: int, user_id: int) -> bool:
    b = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not b or (b.guest_id != user_id and b.listing.host_id != user_id):
        return False
    b.status = "cancelled"
    db.commit()
    return True

def create_review(db: Session, review_in: schemas.ReviewCreate, author_id: int) -> models.Review:
    rev = models.Review(**review_in.model_dump(), author_id=author_id)
    db.add(rev)
    db.commit()
    db.refresh(rev)
    return rev

def get_listing_reviews(db: Session, listing_id: int) -> List[models.Review]:
    return db.query(models.Review).filter(models.Review.listing_id == listing_id).order_by(models.Review.created_at.desc()).all()

def toggle_wishlist(db: Session, user_id: int, listing_id: int) -> bool:
    item = db.query(models.Wishlist).filter(models.Wishlist.user_id == user_id, models.Wishlist.listing_id == listing_id).first()
    if item:
        db.delete(item)
        db.commit()
        return False
    db.add(models.Wishlist(user_id=user_id, listing_id=listing_id))
    db.commit()
    return True

def get_user_wishlist(db: Session, user_id: int) -> List[models.Wishlist]:
    return db.query(models.Wishlist).filter(models.Wishlist.user_id == user_id).order_by(models.Wishlist.created_at.desc()).all()
