'use client';

import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import { ListingDetail } from '@/types';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/context/ToastContext';
import { api } from '@/services/api';

interface CheckoutModalProps {
  listing: ListingDetail;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  nights: number;
  subtotal: number;
  total: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CheckoutModal({
  listing, checkIn, checkOut, guestsCount, nights, subtotal, total, onClose, onSuccess
}: CheckoutModalProps) {
  const { currentUser } = useUser();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'upi'>('card');

  const handleConfirmBooking = async () => {
    if (!currentUser) return showToast('Please select a user profile to book', 'error');

    setIsSubmitting(true);
    try {
      await api.createBooking(listing.id, checkIn, checkOut, guestsCount, currentUser.id);
      showToast('Booking confirmed! Reservation added to your trips.', 'success');
      onSuccess();
    } catch (err: any) {
      showToast(err.message || 'Failed to place booking', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in duration-200">
        <div className="flex items-center justify-between p-5 border-b">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-base text-gray-900">Request to book (Mocked Checkout)</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border">
            <img src={listing.images[0]?.url || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300'} alt={listing.title} className="w-20 h-20 rounded-xl object-cover shrink-0" />
            <div>
              <span className="text-[11px] font-bold uppercase text-airbnb-brand">{listing.property_type} · {listing.category}</span>
              <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{listing.title}</h4>
              <p className="text-xs text-gray-500">{listing.location_city}, {listing.location_country}</p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 text-sm mb-3">Your trip details</h4>
            <div className="grid grid-cols-2 gap-4 bg-white border rounded-2xl p-4">
              <div><span className="text-gray-500 font-medium">Dates</span><p className="font-bold text-gray-900 mt-0.5">{checkIn} to {checkOut} ({nights} nights)</p></div>
              <div><span className="text-gray-500 font-medium">Guests</span><p className="font-bold text-gray-900 mt-0.5">{guestsCount} guest{guestsCount > 1 ? 's' : ''}</p></div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 text-sm mb-3">Price details</h4>
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between"><span>₹{listing.price_per_night.toLocaleString('en-IN')} x {nights} nights</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span>Cleaning fee</span><span>₹{listing.cleaning_fee.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span>Service fee</span><span>₹{listing.service_fee.toLocaleString('en-IN')}</span></div>
              <hr />
              <div className="flex justify-between font-bold text-sm text-gray-900 pt-1"><span>Total (INR)</span><span>₹{total.toLocaleString('en-IN')}</span></div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 text-sm mb-3">Pay with (Mocked)</h4>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'card', label: 'Credit Card', icon: CreditCard },
                { id: 'paypal', label: 'Net Banking', icon: ShieldCheck },
                { id: 'upi', label: 'UPI / GPay', icon: CheckCircle2 },
              ].map((pm) => (
                <button key={pm.id} type="button" onClick={() => setPaymentMethod(pm.id as any)} className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-semibold gap-1.5 ${paymentMethod === pm.id ? 'border-airbnb-brand bg-airbnb-light text-airbnb-brand' : 'border-gray-200'}`}>
                  <pm.icon className="w-5 h-5" /><span>{pm.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5 border-t bg-gray-50 rounded-b-3xl flex items-center justify-between gap-4">
          <div className="text-xs text-gray-500">Dates will be blocked on calendar upon confirmation.</div>
          <button onClick={handleConfirmBooking} disabled={isSubmitting} className="bg-airbnb-brand text-white font-bold text-sm py-3 px-8 rounded-xl shadow shrink-0 disabled:opacity-50">{isSubmitting ? 'Confirming...' : 'Confirm & Book'}</button>
        </div>
      </div>
    </div>
  );
}
