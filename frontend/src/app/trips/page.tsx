'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import { Booking } from '@/types';
import { api } from '@/services/api';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/context/ToastContext';
import { Calendar, MapPin, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import AddReviewModal from '@/components/reviews/AddReviewModal';

export default function TripsPage() {
  const { currentUser } = useUser();
  const { showToast } = useToast();
  const [trips, setTrips] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReviewListingId, setSelectedReviewListingId] = useState<number | null>(null);

  const loadTrips = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      setTrips(await api.getMyTrips(currentUser.id));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadTrips(); }, [currentUser]);

  const handleCancelTrip = async (bookingId: number) => {
    if (!currentUser || !confirm('Cancel this reservation?')) return;
    try {
      await api.cancelBooking(bookingId, currentUser.id);
      showToast('Trip reservation cancelled', 'info');
      loadTrips();
    } catch (err: any) {
      showToast(err.message || 'Failed to cancel', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header showSearchBar={false} />
      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Trips & Bookings</h1>
          <p className="text-xs text-gray-500 mt-1">Profile: <span className="font-bold">{currentUser?.name}</span></p>
        </div>

        {isLoading ? (
          <div className="text-xs text-gray-400">Loading trips...</div>
        ) : trips.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-200">
            <Calendar className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <h3 className="text-base font-bold text-gray-900 mb-1">No trips booked yet</h3>
            <Link href="/" className="bg-airbnb-brand text-white text-xs font-bold px-5 py-2.5 rounded-xl inline-flex items-center gap-1 mt-3"><span>Explore Stays</span><ArrowRight className="w-4 h-4" /></Link>
          </div>
        ) : (
          <div className="space-y-4">
            {trips.map((trip) => {
              const isCancelled = trip.status === 'cancelled';
              const listing = trip.listing;
              return (
                <div key={trip.id} className="flex flex-col sm:flex-row items-start justify-between border rounded-2xl p-4 gap-4 bg-white shadow-sm">
                  <div className="flex items-start gap-4">
                    <img src={listing?.images[0]?.url || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300'} className="w-28 h-24 rounded-xl object-cover" />
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        {isCancelled ? <span className="bg-rose-100 text-rose-700 font-bold text-[10px] px-2 py-0.5 rounded">CANCELLED</span> : <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded">CONFIRMED</span>}
                      </div>
                      <Link href={`/listings/${trip.listing_id}`} className="font-bold text-sm text-gray-900 hover:underline">{listing?.title}</Link>
                      <p className="text-gray-500">{listing?.location_city}, {listing?.location_country}</p>
                      <p className="font-semibold text-gray-700">{trip.check_in} → {trip.check_out} ({trip.guests_count} Guests)</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between self-stretch shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 uppercase font-bold">Total Price</span>
                      <p className="text-lg font-bold text-gray-900">₹{trip.total_price.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {!isCancelled && (
                        <>
                          <button onClick={() => setSelectedReviewListingId(trip.listing_id)} className="bg-gray-100 text-gray-900 font-bold text-xs px-3 py-1.5 rounded-lg">Write Review</button>
                          <button onClick={() => handleCancelTrip(trip.id)} className="bg-rose-50 text-rose-700 font-bold text-xs px-3 py-1.5 rounded-lg border border-rose-200">Cancel</button>
                        </>
                      )}
                      <Link href={`/listings/${trip.listing_id}`} className="bg-black text-white font-bold text-xs px-3 py-1.5 rounded-lg">View</Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {selectedReviewListingId && (
        <AddReviewModal listingId={selectedReviewListingId} onClose={() => setSelectedReviewListingId(null)} onSuccess={loadTrips} />
      )}
    </div>
  );
}
