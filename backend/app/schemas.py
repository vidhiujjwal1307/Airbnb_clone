import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field

# --- USER SCHEMAS ---
class UserBase(BaseModel):
    name: str
    email: str
    avatar_url: Optional[str] = None
    is_host: bool = False
    is_superhost: bool = False

class UserCreate(UserBase):
    pass

class UserOut(UserBase):
    id: int
    created_at: datetime.datetime
    model_config = ConfigDict(from_attributes=True)


# --- IMAGE & AMENITY SCHEMAS ---
class ListingImageBase(BaseModel):
    url: str
    is_cover: bool = False
    display_order: int = 0

class ListingImageCreate(ListingImageBase):
    pass

class ListingImageOut(ListingImageBase):
    id: int
    listing_id: int
    model_config = ConfigDict(from_attributes=True)

class ListingAmenityBase(BaseModel):
    name: str

class ListingAmenityCreate(ListingAmenityBase):
    pass

class ListingAmenityOut(ListingAmenityBase):
    id: int
    listing_id: int
    model_config = ConfigDict(from_attributes=True)


# --- REVIEW SCHEMAS ---
class ReviewBase(BaseModel):
    rating: float = Field(ge=1.0, le=5.0)
    cleanliness_rating: float = 5.0
    accuracy_rating: float = 5.0
    communication_rating: float = 5.0
    location_rating: float = 5.0
    check_in_rating: float = 5.0
    value_rating: float = 5.0
    comment: str

class ReviewCreate(ReviewBase):
    listing_id: int

class ReviewOut(ReviewBase):
    id: int
    listing_id: int
    author_id: int
    author: UserOut
    created_at: datetime.datetime
    model_config = ConfigDict(from_attributes=True)


# --- BOOKING SCHEMAS ---
class BookingBase(BaseModel):
    check_in: datetime.date
    check_out: datetime.date
    guests_count: int = 1

class BookingCreate(BookingBase):
    listing_id: int

class BookingOut(BookingBase):
    id: int
    listing_id: int
    guest_id: int
    check_in: datetime.date
    check_out: datetime.date
    guests_count: int
    total_price: float
    status: str
    created_at: datetime.datetime
    guest: UserOut
    listing: Optional["ListingOutSummary"] = None
    model_config = ConfigDict(from_attributes=True)


# --- LISTING SCHEMAS ---
class ListingBase(BaseModel):
    title: str
    description: str
    category: str
    property_type: str
    location_city: str
    location_country: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    price_per_night: float
    cleaning_fee: float = 50.0
    service_fee: float = 30.0
    max_guests: int = 2
    bedrooms: int = 1
    beds: int = 1
    baths: float = 1.0

class ListingCreate(ListingBase):
    images: List[str] # List of image URLs
    amenities: List[str] # List of amenity names

class ListingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    property_type: Optional[str] = None
    location_city: Optional[str] = None
    location_country: Optional[str] = None
    price_per_night: Optional[float] = None
    cleaning_fee: Optional[float] = None
    service_fee: Optional[float] = None
    max_guests: Optional[int] = None
    bedrooms: Optional[int] = None
    beds: Optional[int] = None
    baths: Optional[float] = None
    images: Optional[List[str]] = None
    amenities: Optional[List[str]] = None

class ListingOutSummary(ListingBase):
    id: int
    host_id: int
    host: UserOut
    images: List[ListingImageOut]
    avg_rating: Optional[float] = 5.0
    review_count: int = 0
    created_at: datetime.datetime
    model_config = ConfigDict(from_attributes=True)

class ListingOutDetail(ListingOutSummary):
    amenities: List[ListingAmenityOut]
    booked_dates: List[str] = [] # List of YYYY-MM-DD string ranges already booked
    reviews: List[ReviewOut] = []
    model_config = ConfigDict(from_attributes=True)

class PaginatedListings(BaseModel):
    items: List[ListingOutSummary]
    total: int
    page: int
    size: int
    pages: int


# --- WISHLIST SCHEMAS ---
class WishlistCreate(BaseModel):
    listing_id: int

class WishlistOut(BaseModel):
    id: int
    user_id: int
    listing_id: int
    listing: ListingOutSummary
    created_at: datetime.datetime
    model_config = ConfigDict(from_attributes=True)
