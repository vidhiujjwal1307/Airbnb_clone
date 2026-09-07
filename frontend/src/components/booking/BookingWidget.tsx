'use client';

import React, { useState } from 'react';
import { Star, AlertCircle } from 'lucide-react';
import { ListingDetail } from '@/types';
import CheckoutModal from './CheckoutModal';

interface BookingWidgetProps {
  listing: ListingDetail;
  onBookingSuccess: () => void;
}

export default function BookingWidget({ listing, onBookingSuccess }: BookingWidgetProps) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestsCount, setGuestsCount] = useState(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const calculateNights = (): number => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const nights = calculateNights();
  const subtotal = listing.price_per_night * nights;
  const total = nights > 0 ? subtotal + listing.cleaning_fee + listing.service_fee : 0;

  const checkDateAvailability = (startStr: string, endStr: string): boolean => {
    if (!startStr || !endStr) return true;
    const start = new Date(startStr);
    const end = new Date(endStr);
    let cur = new Date(start);
    while (cur < end) {
      const dateIso = cur.toISOString().split('T')[0];
      if (listing.booked_dates.includes(dateIso)) return false;
      cur.setDate(cur.getDate() + 1);
    }
    return true;
  };

  const handleReserveClick = () => {
    setErrorMsg(null);
    if (!checkIn || !checkOut) return setErrorMsg('Please select check-in and check-out dates.');
    if (nights <= 0) return setErrorMsg('Check-out date must be after check-in date.');
    if (guestsCount > listing.max_guests) return setErrorMsg(`Maximum guest capacity is ${listing.max_guests}.`);
    if (!checkDateAvailability(checkIn, checkOut)) return setErrorMsg('Selected dates overlap with existing reservations.');

    setIsCheckoutOpen(true);
  };

  return (
    <>
      <div className="sticky top-28 bg-white rounded-3xl border border-gray-200 shadow-xl p-6 space-y-6">
        <div className="flex items-baseline justify-between border-b border-gray-100 pb-4">
          <div>
            <span className="text-2xl font-bold text-gray-900">₹{listing.price_per_night.toLocaleString('en-IN')}</span>
            <span className="text-gray-500 text-sm"> / night</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-gray-800">
            <Star className="w-4 h-4 fill-black text-black" />
            <span>{listing.avg_rating.toFixed(2)}</span>
            <span className="text-gray-400">({listing.review_count})</span>
          </div>
        </div>

        <div className="border border-gray-300 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-2 divide-x divide-gray-300 border-b border-gray-300">
            <div className="p-3">
              <label className="block text-[10px] font-bold text-gray-700 uppercase">Check-in</label>
              <input type="date" value={checkIn} onChange={(e) => { setCheckIn(e.target.value); setErrorMsg(null); }} className="w-full text-xs font-semibold focus:outline-none bg-transparent" />
            </div>
            <div className="p-3">
              <label className="block text-[10px] font-bold text-gray-700 uppercase">Check-out</label>
              <input type="date" value={checkOut} onChange={(e) => { setCheckOut(e.target.value); setErrorMsg(null); }} className="w-full text-xs font-semibold focus:outline-none bg-transparent" />
            </div>
          </div>

          <div className="p-3">
            <label className="block text-[10px] font-bold text-gray-700 uppercase">Guests</label>
            <select value={guestsCount} onChange={(e) => setGuestsCount(Number(e.target.value))} className="w-full text-xs font-semibold focus:outline-none bg-transparent cursor-pointer">
              {Array.from({ length: listing.max_guests }).map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1} guest{i > 0 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 text-rose-700 p-3 rounded-xl text-xs font-medium flex items-start gap-2 border border-rose-200">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <button onClick={handleReserveClick} className="w-full bg-airbnb-brand hover:bg-airbnb-dark text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition active:scale-95 text-sm">
          Reserve
        </button>

        <p className="text-center text-xs text-gray-500">You won't be charged yet</p>

        {nights > 0 && (
          <div className="space-y-3 pt-4 border-t border-gray-100 text-xs text-gray-700">
            <div className="flex justify-between">
              <span className="underline">₹{listing.price_per_night.toLocaleString('en-IN')} x {nights} nights</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between"><span className="underline">Cleaning fee</span><span>₹{listing.cleaning_fee.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between"><span className="underline">Service fee</span><span>₹{listing.service_fee.toLocaleString('en-IN')}</span></div>
            <hr className="border-gray-200" />
            <div className="flex justify-between text-sm font-bold text-gray-900 pt-1">
              <span>Total before taxes</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}
      </div>

      {isCheckoutOpen && (
        <CheckoutModal
          listing={listing} checkIn={checkIn} checkOut={checkOut} guestsCount={guestsCount}
          nights={nights} subtotal={subtotal} total={total}
          onClose={() => setIsCheckoutOpen(false)}
          onSuccess={() => { setIsCheckoutOpen(false); onBookingSuccess(); }}
        />
      )}
    </>
  );
}
