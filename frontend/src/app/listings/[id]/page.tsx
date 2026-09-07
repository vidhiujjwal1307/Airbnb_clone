'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import ListingGallery from '@/components/listings/ListingGallery';
import BookingWidget from '@/components/booking/BookingWidget';
import ReviewSection from '@/components/reviews/ReviewSection';
import MapView from '@/components/listings/MapView';
import { ListingDetail } from '@/types';
import { api } from '@/services/api';
import { useWishlist } from '@/context/WishlistContext';
import {
  Star,
  Heart,
  Share,
  Award,
  ShieldCheck,
  Check,
  ChevronLeft,
  Wifi,
  Tv,
  Car,
  Utensils,
  Wind,
  Flame,
  Waves
} from 'lucide-react';

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const saved = listing ? isInWishlist(listing.id) : false;

  const loadListingDetail = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await api.getListingById(id);
      setListing(data);
    } catch (err) {
      console.error('Failed to load listing detail:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadListingDetail();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header showSearchBar={false} />
        <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="aspect-[2/1] bg-gray-200 rounded-3xl w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-full" />
            </div>
            <div className="h-80 bg-gray-200 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-white">
        <Header showSearchBar={false} />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Listing not found</h2>
          <button
            onClick={() => router.push('/')}
            className="bg-black text-white px-6 py-2.5 rounded-xl text-xs font-bold"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header showSearchBar={false} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-8">
        
        {/* Title & Actions Bar */}
        <div className="space-y-2">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-black mb-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to listings
          </button>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{listing.title}</h1>

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-gray-700">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-black text-black" />
                <span>{Number(listing.avg_rating || 0).toFixed(2)}</span>
                <span className="underline">({listing.review_count} reviews)</span>
              </div>
              <span>·</span>
              {listing.host?.is_superhost && (
                <>
                  <div className="flex items-center gap-1 text-gray-900 font-bold">
                    <Award className="w-4 h-4 text-airbnb-brand fill-airbnb-brand/20" />
                    <span>Superhost</span>
                  </div>
                  <span>·</span>
                </>
              )}
              <span className="underline">{listing.location_city}, {listing.location_country}</span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => toggleWishlist(listing.id)}
                className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-xl transition"
              >
                <Heart
                  className={`w-4 h-4 ${
                    saved
                      ? 'fill-airbnb-brand text-airbnb-brand'
                      : 'text-gray-700'
                  }`}
                />
                <span className="underline">{saved ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Photo Gallery Grid */}
        <ListingGallery images={listing.images} title={listing.title} />

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-4">
          
          {/* Left Column: Description, Host Info, Amenities */}
          <div className="lg:col-span-2 space-y-8 divide-y divide-gray-200">
            
            {/* Hosted By Header */}
            <div className="flex items-center justify-between pb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {listing.property_type} hosted by {listing.host?.name}
                </h2>
                <p className="text-xs text-gray-600 font-medium mt-1">
                  {listing.max_guests} guests · {listing.bedrooms} bedrooms · {listing.beds} beds · {listing.baths} baths
                </p>
              </div>
              <img
                src={listing.host?.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'}
                alt={listing.host?.name}
                className="w-14 h-14 rounded-full object-cover border border-gray-200 shrink-0"
              />
            </div>

            {/* Highlights */}
            <div className="py-6 space-y-4">
              <div className="flex items-start gap-4">
                <Award className="w-6 h-6 text-airbnb-brand shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-sm text-gray-900">Experienced Superhost</h3>
                  <p className="text-xs text-gray-500">{listing.host?.name} has 5-star ratings from recent guests.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-sm text-gray-900">Great Location & AirCover</h3>
                  <p className="text-xs text-gray-500">100% of recent guests gave the location a 5-star rating.</p>
                </div>
              </div>
            </div>

            {/* Description Text */}
            <div className="py-6 space-y-3">
              <h3 className="font-bold text-lg text-gray-900">About this space</h3>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="py-6 space-y-4">
              <h3 className="font-bold text-lg text-gray-900">What this place offers</h3>
              <div className="grid grid-cols-2 gap-4">
                {(listing.amenities || []).map((am) => (
                  <div key={am.id} className="flex items-center gap-3 text-xs font-medium text-gray-800">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{am.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="pt-8">
              <ReviewSection
                listingId={listing.id}
                reviews={listing.reviews}
                avgRating={listing.avg_rating}
                onRefresh={loadListingDetail}
              />
            </div>

            {/* Location Map Preview */}
            <div className="pt-8 space-y-4">
              <h3 className="font-bold text-lg text-gray-900">Where you'll be</h3>
              <p className="text-xs text-gray-600">{listing.location_city}, {listing.location_country}</p>
              <MapView listings={[listing]} />
            </div>

          </div>

          {/* Right Column: Sticky Booking Card */}
          <div className="lg:col-span-1">
            <BookingWidget
              listing={listing}
              onBookingSuccess={loadListingDetail}
            />
          </div>

        </div>
      </main>
    </div>
  );
}
