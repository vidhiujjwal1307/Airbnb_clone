'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, Heart, ChevronLeft, ChevronRight, Award } from 'lucide-react';
import { ListingSummary } from '@/types';
import { useWishlist } from '@/context/WishlistContext';

interface ListingCardProps {
  listing: ListingSummary;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const saved = isInWishlist(listing.id);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  const images = listing.images.length > 0
    ? listing.images
    : [{ url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800' }];

  const handlePrevImg = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setCurrentImgIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImg = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setCurrentImgIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    toggleWishlist(listing.id);
  };

  return (
    <div className="group flex flex-col cursor-pointer">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-100 mb-3">
        <Link href={`/listings/${listing.id}`}>
          <img
            src={images[currentImgIdx]?.url || images[0].url}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        <button onClick={handleWishlistClick} className="absolute top-3 right-3 p-2 rounded-full hover:scale-110 transition z-10">
          <Heart className={`w-6 h-6 stroke-[2] ${saved ? 'fill-airbnb-brand text-airbnb-brand' : 'fill-black/30 text-white'}`} />
        </button>

        {listing.host?.is_superhost && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-gray-900 flex items-center gap-1 shadow-sm">
            <Award className="w-3.5 h-3.5 text-airbnb-brand" />
            <span>Superhost</span>
          </div>
        )}

        {images.length > 1 && (
          <>
            <button onClick={handlePrevImg} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 rounded-full shadow text-gray-800 opacity-0 group-hover:opacity-100 transition"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={handleNextImg} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 rounded-full shadow text-gray-800 opacity-0 group-hover:opacity-100 transition"><ChevronRight className="w-4 h-4" /></button>
          </>
        )}
      </div>

      <Link href={`/listings/${listing.id}`} className="space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-gray-900 text-sm truncate">{listing.location_city}, {listing.location_country}</h3>
          <div className="flex items-center gap-1 text-sm font-semibold shrink-0"><Star className="w-3.5 h-3.5 fill-black text-black" /><span>{Number(listing.avg_rating || 0).toFixed(2)}</span></div>
        </div>

        <p className="text-gray-500 text-xs truncate">{listing.title}</p>
        <p className="text-gray-500 text-xs">{listing.bedrooms} beds · {listing.max_guests} guests</p>
        
        <div className="pt-1 flex items-baseline gap-1 text-sm">
          <span className="font-bold text-gray-900">₹{listing.price_per_night.toLocaleString('en-IN')}</span>
          <span className="text-gray-600 text-xs">night</span>
        </div>
      </Link>
    </div>
  );
}
