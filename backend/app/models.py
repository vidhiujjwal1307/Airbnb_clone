import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    DateTime,
    ForeignKey,
    Text,
    Date
)
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    """User ORM model representing hosts and guests."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    avatar_url = Column(String, nullable=True)
    is_host = Column(Boolean, default=False)
    is_superhost = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    listings = relationship("Listing", back_populates="host", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="guest", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="author", cascade="all, delete-orphan")
    wishlists = relationship("Wishlist", back_populates="user", cascade="all, delete-orphan")


class Listing(Base):
    """Property Listing ORM model."""
    __tablename__ = "listings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String, index=True, nullable=False) # e.g., Beachfront, Cabins, Mansions
    property_type = Column(String, nullable=False) # Entire home, Private room, Shared room
    location_city = Column(String, index=True, nullable=False)
    location_country = Column(String, nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    price_per_night = Column(Float, nullable=False)
    cleaning_fee = Column(Float, default=50.0)
    service_fee = Column(Float, default=30.0)
    max_guests = Column(Integer, default=2)
    bedrooms = Column(Integer, default=1)
    beds = Column(Integer, default=1)
    baths = Column(Float, default=1.0)
    host_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    host = relationship("User", back_populates="listings")
    images = relationship("ListingImage", back_populates="listing", cascade="all, delete-orphan", order_by="ListingImage.display_order")
    amenities = relationship("ListingAmenity", back_populates="listing", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="listing", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="listing", cascade="all, delete-orphan")
    wishlists = relationship("Wishlist", back_populates="listing", cascade="all, delete-orphan")


class ListingImage(Base):
    """Images associated with property listings."""
    __tablename__ = "listing_images"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("listings.id"), nullable=False)
    url = Column(String, nullable=False)
    is_cover = Column(Boolean, default=False)
    display_order = Column(Integer, default=0)

    listing = relationship("Listing", back_populates="images")


class ListingAmenity(Base):
    """Amenities for listings (Wifi, Pool, Kitchen, etc.)."""
    __tablename__ = "listing_amenities"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("listings.id"), nullable=False)
    name = Column(String, nullable=False)

    listing = relationship("Listing", back_populates="amenities")


class Booking(Base):
    """Reservation booking model."""
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("listings.id"), nullable=False)
    guest_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    check_in = Column(Date, nullable=False)
    check_out = Column(Date, nullable=False)
    guests_count = Column(Integer, default=1)
    total_price = Column(Float, nullable=False)
    status = Column(String, default="confirmed") # confirmed, cancelled
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    listing = relationship("Listing", back_populates="bookings")
    guest = relationship("User", back_populates="bookings")


class Review(Base):
    """Listing review and rating model."""
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("listings.id"), nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    rating = Column(Float, nullable=False)
    cleanliness_rating = Column(Float, default=5.0)
    accuracy_rating = Column(Float, default=5.0)
    communication_rating = Column(Float, default=5.0)
    location_rating = Column(Float, default=5.0)
    check_in_rating = Column(Float, default=5.0)
    value_rating = Column(Float, default=5.0)
    comment = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    listing = relationship("Listing", back_populates="reviews")
    author = relationship("User", back_populates="reviews")


class Wishlist(Base):
    """Wishlist/Favorites model."""
    __tablename__ = "wishlists"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    listing_id = Column(Integer, ForeignKey("listings.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="wishlists")
    listing = relationship("Listing", back_populates="wishlists")
