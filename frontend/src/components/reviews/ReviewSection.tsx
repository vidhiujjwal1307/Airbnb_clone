'use client';

import React, { useState } from 'react';
import { Star, MessageSquarePlus } from 'lucide-react';
import { Review } from '@/types';
import AddReviewModal from './AddReviewModal';

interface ReviewSectionProps {
  listingId: number;
  reviews: Review[];
  avgRating: number;
  onRefresh: () => void;
}

export default function ReviewSection({
  listingId,
  reviews,
  avgRating,
  onRefresh
}: ReviewSectionProps) {
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* Overall Ratings Summary Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-2 text-2xl font-bold text-gray-900">
          <Star className="w-6 h-6 fill-black text-black" />
          <span>{avgRating.toFixed(2)}</span>
          <span className="text-gray-400">·</span>
          <span>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
        </div>

        <button
          onClick={() => setIsAddReviewOpen(true)}
          className="inline-flex items-center gap-2 border border-gray-900 hover:bg-gray-50 text-gray-900 font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-sm"
        >
          <MessageSquarePlus className="w-4 h-4 text-airbnb-brand" />
          Write a Review
        </button>
      </div>

      {/* Category Ratings Bar Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-xs text-gray-700 pb-6 border-b border-gray-200">
        {[
          { label: 'Cleanliness', score: 5.0 },
          { label: 'Accuracy', score: 5.0 },
          { label: 'Communication', score: 4.9 },
          { label: 'Location', score: 5.0 },
          { label: 'Check-in', score: 4.9 },
          { label: 'Value', score: 4.8 },
        ].map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex justify-between font-semibold">
              <span>{item.label}</span>
              <span>{item.score}</span>
            </div>
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-black rounded-full w-[98%]" />
            </div>
          </div>
        ))}
      </div>

      {/* Reviews Cards Grid */}
      {reviews.length === 0 ? (
        <p className="text-sm text-gray-500 italic py-4">No reviews yet for this listing. Be the first guest to leave one!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((rev) => (
            <div key={rev.id} className="space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={rev.author?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                  alt={rev.author?.name || 'Guest'}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{rev.author?.name || 'Airbnb Guest'}</h4>
                  <p className="text-xs text-gray-400">
                    {new Date(rev.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.round(rev.rating) ? 'fill-black text-black' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              <p className="text-xs text-gray-700 leading-relaxed line-clamp-4">{rev.comment}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal Popup */}
      {isAddReviewOpen && (
        <AddReviewModal
          listingId={listingId}
          onClose={() => setIsAddReviewOpen(false)}
          onSuccess={() => {
            onRefresh();
          }}
        />
      )}
    </div>
  );
}
