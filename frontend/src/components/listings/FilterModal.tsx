'use client';

import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { ListingFilterState } from '@/types';

interface FilterModalProps {
  filters: ListingFilterState;
  onApplyFilters: (newFilters: ListingFilterState) => void;
  onClose: () => void;
}

const AMENITY_OPTIONS = ['Wifi', 'Pool', 'Hot Tub', 'Air Conditioning', "Chef's Kitchen", 'Free Parking', 'Sauna', 'Indoor Fireplace', 'Ocean View', 'Gym'];

export default function FilterModal({ filters, onApplyFilters, onClose }: FilterModalProps) {
  const [minPrice, setMinPrice] = useState<number | undefined>(filters.minPrice);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(filters.maxPrice);
  const [propertyType, setPropertyType] = useState<string>(filters.propertyType || 'Any');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(filters.amenities || []);

  const toggleAmenity = (name: string) => {
    setSelectedAmenities((prev) => prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]);
  };

  const handleApply = () => {
    onApplyFilters({ ...filters, minPrice, maxPrice, propertyType, amenities: selectedAmenities, page: 1 });
    onClose();
  };

  const handleClear = () => {
    setMinPrice(undefined); setMaxPrice(undefined); setPropertyType('Any'); setSelectedAmenities([]);
    onApplyFilters({ ...filters, minPrice: undefined, maxPrice: undefined, propertyType: 'Any', amenities: [], page: 1 });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in duration-200">
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="font-bold text-base text-gray-900">Filters</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          <div>
            <h4 className="font-bold text-gray-900 text-sm mb-1">Price range (₹ INR)</h4>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <label className="block font-bold text-gray-600 uppercase mb-1">Minimum</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₹</span>
                  <input type="number" placeholder="0" value={minPrice ?? ''} onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)} className="w-full border rounded-xl pl-7 pr-3 py-2.5 text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className="block font-bold text-gray-600 uppercase mb-1">Maximum</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₹</span>
                  <input type="number" placeholder="10000+" value={maxPrice ?? ''} onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)} className="w-full border rounded-xl pl-7 pr-3 py-2.5 text-sm outline-none" />
                </div>
              </div>
            </div>
          </div>

          <hr />

          <div>
            <h4 className="font-bold text-gray-900 text-sm mb-3">Type of place</h4>
            <div className="grid grid-cols-3 gap-3">
              {['Any', 'Entire home', 'Room', 'Shared room'].map((type) => (
                <button key={type} type="button" onClick={() => setPropertyType(type)} className={`py-2.5 px-3 rounded-2xl border font-semibold ${propertyType === type ? 'bg-black text-white border-black' : 'border-gray-300 text-gray-700'}`}>{type}</button>
              ))}
            </div>
          </div>

          <hr />

          <div>
            <h4 className="font-bold text-gray-900 text-sm mb-3">Amenities</h4>
            <div className="grid grid-cols-2 gap-2">
              {AMENITY_OPTIONS.map((am) => {
                const isChecked = selectedAmenities.includes(am);
                return (
                  <button key={am} type="button" onClick={() => toggleAmenity(am)} className={`flex items-center gap-2 p-2.5 rounded-xl border text-left font-medium ${isChecked ? 'bg-gray-50 font-bold border-black' : 'border-gray-200'}`}>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${isChecked ? 'bg-black text-white' : 'border-gray-400'}`}>{isChecked && <Check className="w-3 h-3" />}</div>
                    <span>{am}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-5 border-t bg-gray-50 rounded-b-3xl">
          <button type="button" onClick={handleClear} className="text-xs font-bold underline text-gray-700">Clear all</button>
          <button type="button" onClick={handleApply} className="bg-black text-white font-bold text-xs py-3 px-6 rounded-xl">Show results</button>
        </div>
      </div>
    </div>
  );
}
