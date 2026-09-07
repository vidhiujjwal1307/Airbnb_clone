export interface User {
  id: number;
  name: string;
  email: string;
  avatar_url?: string;
  is_host: boolean;
  is_superhost: boolean;
  created_at: string;
}

export interface ListingImage {
  id: number;
  listing_id: number;
  url: string;
  is_cover: boolean;
  display_order: number;
}

export interface ListingAmenity {
  id: number;
  listing_id: number;
  name: string;
}

export interface Review {
  id: number;
  listing_id: number;
  author_id: number;
  author: User;
  rating: number;
  cleanliness_rating: number;
  accuracy_rating: number;
  communication_rating: number;
  location_rating: number;
  check_in_rating: number;
  value_rating: number;
  comment: string;
  created_at: string;
}

export interface ListingSummary {
  id: number;
  title: string;
  description: string;
  category: string;
  property_type: string;
  location_city: string;
  location_country: string;
  latitude?: number;
  longitude?: number;
  price_per_night: number;
  cleaning_fee: number;
  service_fee: number;
  max_guests: number;
  bedrooms: number;
  beds: number;
  baths: number;
  host_id: number;
  host: User;
  images: ListingImage[];
  avg_rating: number;
  review_count: number;
  created_at: string;
}

export interface ListingDetail extends ListingSummary {
  amenities: ListingAmenity[];
  booked_dates: string[]; // YYYY-MM-DD strings
  reviews: Review[];
}

export interface PaginatedListings {
  items: ListingSummary[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface Booking {
  id: number;
  listing_id: number;
  guest_id: number;
  check_in: string;
  check_out: string;
  guests_count: number;
  total_price: number;
  status: 'confirmed' | 'cancelled';
  created_at: string;
  guest: User;
  listing?: ListingSummary;
}

export interface WishlistItem {
  id: number;
  user_id: number;
  listing_id: number;
  listing: ListingSummary;
  created_at: string;
}

export interface ListingFilterState {
  category?: string;
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  amenities?: string[];
  page?: number;
}
