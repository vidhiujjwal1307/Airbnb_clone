'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import ListingCard from '@/components/listings/ListingCard';
import { useWishlist } from '@/context/WishlistContext';
import { Heart, ArrowRight } from 'lucide-react';

export default function WishlistsPage() {
  const { wishlistItems } = useWishlist();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header showSearchBar={false} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Wishlists & Saved Stays</h1>
          <p className="text-xs text-gray-500 mt-1">Your collection of dream stays and favorite properties.</p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-200">
            <Heart className="w-12 h-12 text-airbnb-brand mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">Your wishlist is empty</h3>
            <p className="text-xs text-gray-500 mb-6 max-w-sm mx-auto">
              As you search, click the heart icon on any stay to save your favorite spots.
            </p>
            <Link
              href="/"
              className="bg-airbnb-brand text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-airbnb-dark transition inline-flex items-center gap-2"
            >
              <span>Start Exploring</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <ListingCard key={item.id} listing={item.listing} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
