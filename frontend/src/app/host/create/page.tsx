'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/context/ToastContext';
import { api } from '@/services/api';
import { CATEGORIES } from '@/components/layout/CategoryBar';
import { ChevronLeft, Trash2, Check, Upload } from 'lucide-react';

const AMENITY_CHOICES = ['Fast Wifi', 'Heated Pool', 'Ocean View', 'Air Conditioning', "Chef's Kitchen", 'Free Parking', 'Hot Tub', 'Sauna', 'Mountain View'];

export default function CreateListingPage() {
  const router = useRouter();
  const { currentUser } = useUser();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Beachfront');
  const [propertyType, setPropertyType] = useState('Entire home');
  const [locationCity, setLocationCity] = useState('');
  const [locationCountry, setLocationCountry] = useState('India');
  const [pricePerNight, setPricePerNight] = useState(250);
  const [cleaningFee, setCleaningFee] = useState(60);
  const [serviceFee, setServiceFee] = useState(30);
  const [maxGuests, setMaxGuests] = useState(4);
  const [bedrooms, setBedrooms] = useState(2);
  const [beds, setBeds] = useState(2);
  const [baths, setBaths] = useState(2);
  
  const [images, setImages] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(['Fast Wifi', 'Air Conditioning']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []).filter((file) => file.type.startsWith('image/'));
    if (files.some((file) => file.size > 4 * 1024 * 1024)) return showToast('Each photo must be 4 MB or smaller', 'error');
    const remaining = Math.max(0, 8 - images.length);
    if (!remaining) return showToast('You can add up to 8 photos', 'error');
    const photos = await Promise.all(files.slice(0, remaining).map((file) => new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    })));
    setImages((current) => [...current, ...photos]);
    event.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return showToast('Please select a Host profile', 'error');
    if (!title.trim() || !description.trim() || !locationCity.trim()) return showToast('Complete required fields', 'error');
    if (images.length === 0) return showToast('Add at least one photo', 'error');

    setIsSubmitting(true);
    try {
      await api.createListing({
        title, description, category, property_type: propertyType, location_city: locationCity, location_country: locationCountry,
        price_per_night: pricePerNight, cleaning_fee: cleaningFee, service_fee: serviceFee, max_guests: maxGuests, bedrooms, beds, baths,
        images, amenities: selectedAmenities
      }, currentUser.id);

      showToast('Listing created successfully!', 'success');
      router.push('/host/dashboard');
    } catch (err: any) {
      showToast(err.message || 'Failed to create listing', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header showSearchBar={false} />
      <main className="max-w-3xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
        <button onClick={() => router.back()} className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-black">
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <h1 className="text-2xl font-bold text-gray-900">Create New Listing</h1>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Listing Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded-xl p-3 text-sm" required />
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Description</label>
              <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded-xl p-3 text-sm" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border rounded-xl p-3 bg-white">
                  {CATEGORIES.filter((c) => c.id !== 'All').map((cat) => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Property Type</label>
                <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className="w-full border rounded-xl p-3 bg-white">
                  <option value="Entire home">Entire home</option>
                  <option value="Private room">Private room</option>
                  <option value="Shared room">Shared room</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">City / Region</label>
                <input type="text" value={locationCity} onChange={(e) => setLocationCity(e.target.value)} className="w-full border rounded-xl p-3" required />
              </div>
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Country</label>
                <input type="text" value={locationCountry} onChange={(e) => setLocationCountry(e.target.value)} className="w-full border rounded-xl p-3" required />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Price / Night (₹)</label>
                <input type="number" value={pricePerNight} onChange={(e) => setPricePerNight(Number(e.target.value))} className="w-full border rounded-xl p-3" required />
              </div>
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Cleaning Fee (₹)</label>
                <input type="number" value={cleaningFee} onChange={(e) => setCleaningFee(Number(e.target.value))} className="w-full border rounded-xl p-3" />
              </div>
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Service Fee (₹)</label>
                <input type="number" value={serviceFee} onChange={(e) => setServiceFee(Number(e.target.value))} className="w-full border rounded-xl p-3" />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div><label className="block font-bold text-gray-700 uppercase mb-1">Max Guests</label><input type="number" value={maxGuests} onChange={(e) => setMaxGuests(Number(e.target.value))} className="w-full border rounded-xl p-2" /></div>
              <div><label className="block font-bold text-gray-700 uppercase mb-1">Bedrooms</label><input type="number" value={bedrooms} onChange={(e) => setBedrooms(Number(e.target.value))} className="w-full border rounded-xl p-2" /></div>
              <div><label className="block font-bold text-gray-700 uppercase mb-1">Beds</label><input type="number" value={beds} onChange={(e) => setBeds(Number(e.target.value))} className="w-full border rounded-xl p-2" /></div>
              <div><label className="block font-bold text-gray-700 uppercase mb-1">Baths</label><input type="number" step="0.5" value={baths} onChange={(e) => setBaths(Number(e.target.value))} className="w-full border rounded-xl p-2" /></div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Photos</label>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-gray-400 p-4 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                <Upload className="w-4 h-4" /> Choose photos (up to 8)
                <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
              </label>
              <div className="grid grid-cols-4 gap-2">
                {images.map((url, idx) => (
                  <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border">
                    <img src={url} alt={`Photo ${idx}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setImages(images.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded"><Trash2 className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase mb-2">Amenities</label>
              <div className="grid grid-cols-3 gap-2">
                {AMENITY_CHOICES.map((am) => {
                  const isChecked = selectedAmenities.includes(am);
                  return (
                    <button key={am} type="button" onClick={() => setSelectedAmenities(isChecked ? selectedAmenities.filter(a => a !== am) : [...selectedAmenities, am])} className={`p-2 rounded-xl border text-left flex items-center gap-1.5 ${isChecked ? 'bg-black text-white' : 'bg-white text-gray-800'}`}>
                      <Check className="w-3 h-3" /> <span className="truncate">{am}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button type="button" onClick={() => router.back()} className="text-gray-600 font-bold">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="bg-airbnb-brand text-white font-bold py-2.5 px-6 rounded-xl shadow">{isSubmitting ? 'Publishing...' : 'Publish Listing'}</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
