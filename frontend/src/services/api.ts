import {
  ListingSummary,
  ListingDetail,
  PaginatedListings,
  Booking,
  Review,
  WishlistItem,
  User,
  ListingFilterState
} from '@/types';

const API_BASE_URL = 'https://airbnb-clone-jlh2.onrender.com/api';

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}, userId?: number): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (userId) {
    headers['X-User-Id'] = userId.toString();
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(errorData.detail || 'An unexpected error occurred');
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  // Auth & Users
  getUsers: () => fetchAPI<User[]>('/auth/users'),
  getCurrentUser: (userId: number) => fetchAPI<User>('/auth/me', {}, userId),

  // Listings
  getListings: (filters: ListingFilterState = {}) => {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'All') params.append('category', filters.category);
    if (filters.location) params.append('location', filters.location);
    if (filters.checkIn) params.append('check_in', filters.checkIn);
    if (filters.checkOut) params.append('check_out', filters.checkOut);
    if (filters.guests) params.append('guests', filters.guests.toString());
    if (filters.minPrice !== undefined) params.append('min_price', filters.minPrice.toString());
    if (filters.maxPrice !== undefined) params.append('max_price', filters.maxPrice.toString());
    if (filters.propertyType && filters.propertyType !== 'Any') params.append('property_type', filters.propertyType);
    if (filters.amenities && filters.amenities.length > 0) {
      filters.amenities.forEach(am => params.append('amenities', am));
    }
    if (filters.page) params.append('page', filters.page.toString());
    params.append('size', '12');

    return fetchAPI<PaginatedListings>(`/listings?${params.toString()}`);
  },

  getListingById: (id: number) => fetchAPI<ListingDetail>(`/listings/${id}`),
  getHostListings: (userId: number) => fetchAPI<ListingSummary[]>('/listings/host/my-listings', {}, userId),

  createListing: (data: any, userId: number) =>
    fetchAPI<ListingSummary>('/listings', {
      method: 'POST',
      body: JSON.stringify(data),
    }, userId),

  updateListing: (id: number, data: any, userId: number) =>
    fetchAPI<ListingSummary>(`/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, userId),

  deleteListing: (id: number, userId: number) =>
    fetchAPI<void>(`/listings/${id}`, {
      method: 'DELETE',
    }, userId),

  // Bookings
  createBooking: (listingId: number, checkIn: string, checkOut: string, guestsCount: number, userId: number) =>
    fetchAPI<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify({
        listing_id: listingId,
        check_in: checkIn,
        check_out: checkOut,
        guests_count: guestsCount,
      }),
    }, userId),

  getMyTrips: (userId: number) => fetchAPI<Booking[]>('/bookings/my-trips', {}, userId),
  getHostReservations: (userId: number) => fetchAPI<Booking[]>('/bookings/host-reservations', {}, userId),
  cancelBooking: (bookingId: number, userId: number) =>
    fetchAPI<Booking>(`/bookings/${bookingId}/cancel`, {
      method: 'POST',
    }, userId),

  // Reviews
  createReview: (listingId: number, rating: number, comment: string, ratingsObj: any, userId: number) =>
    fetchAPI<Review>('/reviews', {
      method: 'POST',
      body: JSON.stringify({
        listing_id: listingId,
        rating,
        comment,
        cleanliness_rating: ratingsObj?.cleanliness || 5,
        accuracy_rating: ratingsObj?.accuracy || 5,
        communication_rating: ratingsObj?.communication || 5,
        location_rating: ratingsObj?.location || 5,
        check_in_rating: ratingsObj?.checkIn || 5,
        value_rating: ratingsObj?.value || 5,
      }),
    }, userId),

  getListingReviews: (listingId: number) => fetchAPI<Review[]>(`/reviews/listing/${listingId}`),

  // Wishlists
  toggleWishlist: (listingId: number, userId: number) =>
    fetchAPI<{ saved: boolean; listing_id: number }>('/wishlists/toggle', {
      method: 'POST',
      body: JSON.stringify({ listing_id: listingId }),
    }, userId),

  getWishlist: (userId: number) => fetchAPI<WishlistItem[]>('/wishlists', {}, userId),
};
