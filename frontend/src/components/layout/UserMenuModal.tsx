'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Compass, PlusCircle, Building2, UserCheck, ShieldCheck, Check } from 'lucide-react';
import { useUser } from '@/context/UserContext';

interface UserMenuModalProps {
  onClose: () => void;
}

export default function UserMenuModal({ onClose }: UserMenuModalProps) {
  const { currentUser, usersList, setCurrentUser, isHostMode, toggleHostMode } = useUser();

  return (
    <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in duration-150">
      
      {/* Active User Switcher Section */}
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
          Switch User Profile
        </p>
        <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
          {usersList.map((u) => {
            const isSelected = currentUser?.id === u.id;
            return (
              <button
                key={u.id}
                onClick={() => {
                  setCurrentUser(u);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition ${
                  isSelected ? 'bg-gray-100 font-bold text-gray-900' : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <img
                    src={u.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                    alt={u.name}
                    className="w-7 h-7 rounded-full object-cover shrink-0"
                  />
                  <div className="truncate">
                    <div className="flex items-center gap-1 font-semibold">
                      <span>{u.name}</span>
                      {u.is_superhost && (
                        <span className="bg-rose-100 text-airbnb-brand text-[9px] px-1.5 py-0.5 rounded font-extrabold">
                          SUPERHOST
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-500">{u.is_host ? 'Host Profile' : 'Guest Profile'}</span>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-airbnb-brand shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Links */}
      <div className="py-2 border-b border-gray-100">
        <Link
          href="/trips"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium transition"
        >
          <Compass className="w-4 h-4 text-gray-500" />
          My Trips & Bookings
        </Link>
        <Link
          href="/wishlists"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium transition"
        >
          <Heart className="w-4 h-4 text-airbnb-brand" />
          Saved Wishlists
        </Link>
      </div>

      {/* Host Section */}
      <div className="py-2">
        <button
          onClick={() => {
            toggleHostMode();
            onClose();
          }}
          className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium transition"
        >
          <Building2 className="w-4 h-4 text-airbnb-brand" />
          {isHostMode ? 'Switch to Guest Mode' : 'Switch to Host Mode'}
        </button>

        {isHostMode && (
          <>
            <Link
              href="/host/dashboard"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium transition"
            >
              <ShieldCheck className="w-4 h-4 text-gray-500" />
              Host Dashboard
            </Link>
            <Link
              href="/host/create"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium transition"
            >
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              Create New Listing
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
