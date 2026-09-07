'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';
import { useToast } from './ToastContext';
import { api } from '@/services/api';
import { WishlistItem } from '@/types';

interface WishlistContextType {
  wishlistIds: Set<number>;
  wishlistItems: WishlistItem[];
  toggleWishlist: (listingId: number) => Promise<void>;
  isInWishlist: (listingId: number) => boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useUser();
  const { showToast } = useToast();
  const [wishlistIds, setWishlistIds] = useState<Set<number>>(new Set());
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  const refreshWishlist = async () => {
    if (!currentUser) return;
    try {
      const items = await api.getWishlist(currentUser.id);
      setWishlistItems(items);
      setWishlistIds(new Set(items.map((i) => i.listing_id)));
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
    }
  };

  useEffect(() => {
    refreshWishlist();
  }, [currentUser]);

  const toggleWishlist = async (listingId: number) => {
    if (!currentUser) {
      showToast('Please select a user profile to save wishlists', 'info');
      return;
    }

    try {
      const res = await api.toggleWishlist(listingId, currentUser.id);
      if (res.saved) {
        setWishlistIds((prev) => new Set(prev).add(listingId));
        showToast('Saved to Wishlist!', 'success');
      } else {
        setWishlistIds((prev) => {
          const updated = new Set(prev);
          updated.delete(listingId);
          return updated;
        });
        showToast('Removed from Wishlist', 'info');
      }
      refreshWishlist();
    } catch (err: any) {
      showToast(err.message || 'Failed to update wishlist', 'error');
    }
  };

  const isInWishlist = (listingId: number) => wishlistIds.has(listingId);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistItems,
        toggleWishlist,
        isInWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
