'use client';

import React from 'react';
import ListingCard from './ListingCard';
import { ListingSummary } from '@/types';

interface ListingGridProps {
  listings: ListingSummary[];
  total: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export default function ListingGrid({
  listings,
  total,
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false
}: ListingGridProps) {

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[4/3] bg-gray-200 rounded-2xl mb-3" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100 my-8">
        <h3 className="text-xl font-bold text-gray-900 mb-2">No exact matches</h3>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Try changing or clearing some of your filters or searching a different destination.
        </p>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-8">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-4 py-2 text-sm font-semibold rounded-xl border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
          >
            Previous
          </button>
          
          <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const p = idx + 1;
              return (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`w-9 h-9 rounded-xl font-bold transition ${
                    p === currentPage
                      ? 'bg-black text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-4 py-2 text-sm font-semibold rounded-xl border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
