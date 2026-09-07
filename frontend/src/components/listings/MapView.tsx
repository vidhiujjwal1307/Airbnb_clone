'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ListingSummary } from '@/types';
import { MapPin, Star, X } from 'lucide-react';

interface MapViewProps {
  listings: ListingSummary[];
  onClose?: () => void;
}

export default function MapView({ listings, onClose }: MapViewProps) {
  const [selectedListing, setSelectedListing] = useState<ListingSummary | null>(null);

  return (
    <div className="relative w-full h-[calc(100vh-140px)] min-h-[500px] bg-slate-100 rounded-3xl overflow-hidden border border-gray-200 shadow-inner flex flex-col">
      <div className="relative flex-1 w-full h-full bg-[#E5E3DF] p-6 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow border border-gray-200 flex items-center gap-2 text-xs font-bold text-gray-800">
          <MapPin className="w-4 h-4 text-airbnb-brand" />
          <span>Showing {listings.length} stays on map</span>
        </div>

        <div className="relative w-full max-w-5xl h-full flex flex-wrap items-center justify-center gap-12 p-8 overflow-auto z-10">
          {listings.map((item) => {
            const isSelected = selectedListing?.id === item.id;
            return (
              <div key={item.id} className="relative transition-all duration-300 hover:z-30">
                <button
                  onClick={() => setSelectedListing(item)}
                  className={`px-3 py-1.5 rounded-full font-bold text-xs shadow-lg transition flex items-center gap-1 border ${
                    isSelected ? 'bg-black text-white border-black scale-110' : 'bg-white text-gray-900 border-gray-300 hover:scale-105'
                  }`}
                >
                  <span>₹{item.price_per_night.toLocaleString('en-IN')}</span>
                </button>
              </div>
            );
          })}
        </div>

        {selectedListing && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-sm bg-white rounded-3xl shadow-2xl p-3 border border-gray-100 animate-in fade-in duration-200">
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-3">
              <img src={selectedListing.images[0]?.url || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600'} alt={selectedListing.title} className="w-full h-full object-cover" />
              <button onClick={() => setSelectedListing(null)} className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full"><X className="w-4 h-4" /></button>
            </div>

            <div className="px-2">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-bold text-gray-900 truncate">{selectedListing.location_city}, {selectedListing.location_country}</span>
                <div className="flex items-center gap-1 text-xs font-semibold shrink-0"><Star className="w-3 h-3 fill-black text-black" /><span>{selectedListing.avg_rating.toFixed(2)}</span></div>
              </div>
              <p className="text-xs text-gray-500 truncate mb-2">{selectedListing.title}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-900">₹{selectedListing.price_per_night.toLocaleString('en-IN')} <span className="font-normal text-xs text-gray-500">night</span></span>
                <Link href={`/listings/${selectedListing.id}`} className="bg-airbnb-brand text-white text-xs font-bold px-4 py-2 rounded-xl">View Stay</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
