'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Menu, User as UserIcon, Compass, Building2 } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import UserMenuModal from './UserMenuModal';

interface HeaderProps {
  onOpenFilter?: () => void;
  showSearchBar?: boolean;
}

function HeaderSearchContent({ onOpenSearch }: { onOpenSearch: () => void }) {
  const searchParams = useSearchParams();
  const loc = searchParams.get('location') || '';
  const g = searchParams.get('guests') || '1';
  const cIn = searchParams.get('checkIn') || '';
  const cOut = searchParams.get('checkOut') || '';

  return (
    <div onClick={onOpenSearch} className="flex items-center justify-between border border-gray-300 shadow-sm hover:shadow-md transition rounded-full py-2 px-4 cursor-pointer text-sm font-semibold divide-x divide-gray-200">
      <span className="px-2 text-gray-900 truncate max-w-[120px] sm:max-w-[160px]">{loc || 'Anywhere'}</span>
      <span className="px-3 text-gray-900 hidden md:inline">{cIn ? `${cIn} - ${cOut || 'Any date'}` : 'Any week'}</span>
      <div className="flex items-center gap-3 pl-3 text-gray-500 font-normal">
        <span className="hidden sm:inline">{g ? `${g} guests` : 'Add guests'}</span>
        <div className="bg-airbnb-brand text-white p-2 rounded-full shadow"><Search className="w-3.5 h-3.5" /></div>
      </div>
    </div>
  );
}

function ExpandedSearchModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [guests, setGuests] = useState(searchParams.get('guests') || '1');
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location && location.trim() && location.toLowerCase() !== 'anywhere') {
      params.set('location', location.trim());
    }
    if (guests) params.set('guests', guests);
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);

    onClose();
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-16 px-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-2xl shadow-2xl animate-in fade-in duration-200">
        <div className="flex items-center justify-between mb-4 border-b pb-3">
          <h3 className="font-bold text-lg text-gray-900">Search Stays</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">✕</button>
        </div>

        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Where</label>
            <input
              type="text"
              placeholder="Search destinations (e.g. Noida, Delhi, Mussoorie)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-airbnb-brand"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Check-in</label>
              <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-airbnb-brand" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Check-out</label>
              <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-airbnb-brand" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Who</label>
            <select value={guests} onChange={(e) => setGuests(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-airbnb-brand bg-white">
              <option value="1">1 Guest</option>
              <option value="2">2 Guests</option>
              <option value="3">3 Guests</option>
              <option value="4">4 Guests</option>
              <option value="6">6+ Guests</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <button type="button" onClick={() => { setLocation(''); setCheckIn(''); setCheckOut(''); setGuests('1'); }} className="text-sm font-semibold underline text-gray-700 hover:text-black">Clear all</button>
            <button type="submit" className="bg-airbnb-brand text-white font-bold py-3 px-8 rounded-xl hover:bg-airbnb-dark transition flex items-center gap-2 shadow-lg">
              <Search className="w-4 h-4" /> Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Header({ showSearchBar = true }: HeaderProps) {
  const { currentUser, isHostMode, toggleHostMode } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 text-airbnb-brand font-bold text-2xl tracking-tight shrink-0">
            <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32"><path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.011.315c0 4.308-3.287 7.806-7.5 7.806-3.24 0-6.044-2.062-7.1-5.025l-.2-.615-.2.615c-1.056 2.963-3.86 5.025-7.1 5.025-4.213 0-7.5-3.498-7.5-7.806 0-1.258.337-2.456.97-3.711l.147-.28c.987-2.296 5.147-11.006 7.1-14.836l.533-1.025C12.537 1.963 13.992 1 16 1zm0 2c-1.24 0-2.257.607-3.238 2.37l-.427.818c-1.9 3.725-5.992 12.302-6.953 14.545l-.13.313c-.5.187-.752 1.134-.752 2.148 0 3.208 2.467 5.806 5.5 5.806 2.639 0 4.908-1.785 5.485-4.329l.178-.79.178.79c.577 2.544 2.846 4.329 5.485 4.329 3.033 0 5.5-2.598 5.5-5.806 0-.877-.202-1.705-.623-2.52l-.129-.341c-.961-2.243-5.053-10.82-6.953-14.545l-.427-.818C18.257 3.607 17.24 3 16 3zm0 15a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/></svg>
            <span className="hidden sm:inline font-black text-xl">air bnb</span>
          </Link>

          {showSearchBar && (
            <Suspense fallback={<div className="text-xs text-gray-400">Loading search...</div>}>
              <HeaderSearchContent onOpenSearch={() => setIsSearchOpen(true)} />
            </Suspense>
          )}

          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={toggleHostMode} className="hidden md:flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 py-2.5 px-3.5 rounded-full transition">
              {isHostMode ? <><Compass className="w-4 h-4 text-airbnb-brand" />Switch to Guest</> : <><Building2 className="w-4 h-4 text-airbnb-brand" />air bnb your home</>}
            </button>

            <div className="relative">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-3 border border-gray-300 rounded-full p-2 pl-3 hover:shadow-md transition bg-white">
                <Menu className="w-4 h-4 text-gray-600" />
                {currentUser?.avatar_url ? <img src={currentUser.avatar_url} alt={currentUser.name} className="w-7 h-7 rounded-full object-cover border border-gray-200" /> : <div className="w-7 h-7 bg-gray-600 text-white rounded-full flex items-center justify-center text-xs font-bold"><UserIcon className="w-4 h-4" /></div>}
              </button>
              {isMenuOpen && <UserMenuModal onClose={() => setIsMenuOpen(false)} />}
            </div>
          </div>
        </div>
      </header>

      {isSearchOpen && (
        <Suspense fallback={null}>
          <ExpandedSearchModal onClose={() => setIsSearchOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
