'use client';

import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/context/ToastContext';
import { api } from '@/services/api';

interface AddReviewModalProps {
  listingId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddReviewModal({ listingId, onClose, onSuccess }: AddReviewModalProps) {
  const { currentUser } = useUser();
  const { showToast } = useToast();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showToast('Please select a user profile to leave a review', 'error');
      return;
    }

    if (!comment.trim()) {
      showToast('Please write a short comment about your stay', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createReview(
        listingId,
        rating,
        comment,
        {
          cleanliness: rating,
          accuracy: rating,
          communication: rating,
          location: rating,
          checkIn: rating,
          value: rating,
        },
        currentUser.id
      );
      showToast('Review submitted! Thank you for sharing your experience.', 'success');
      onSuccess();
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <h3 className="font-bold text-lg text-gray-900">Leave a Review</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Overall Rating</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-gray-200 text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-sm font-bold text-gray-800 ml-2">{rating}.0 Stars</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Your Experience</label>
            <textarea
              rows={4}
              placeholder="Describe your stay, the host hospitality, location, and cleanliness..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border border-gray-300 rounded-2xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-airbnb-brand hover:bg-airbnb-dark text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow transition disabled:opacity-50"
            >
              {isSubmitting ? 'Posting...' : 'Post Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
