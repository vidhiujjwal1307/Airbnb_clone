'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import CategoryBar from '@/components/layout/CategoryBar';
import ListingGrid from '@/components/listings/ListingGrid';
import FilterModal from '@/components/listings/FilterModal';
import MapView from '@/components/listings/MapView';
import { ListingSummary, ListingFilterState } from '@/types';
import { api } from '@/services/api';
import { Map, List } from 'lucide-react';

export const dynamic = 'force-dynamic';

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [listings, setListings] = useState<ListingSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // Active filter state
  const [filters, setFilters] = useState<ListingFilterState>({
    category: searchParams.get('category') || 'All',
    location: searchParams.get('location') || '',
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    guests: searchParams.get('guests') ? Number(searchParams.get('guests')) : undefined,
    page: 1,
  });

  // Sync state when URL searchParams change
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: searchParams.get('category') || 'All',
      location: searchParams.get('location') || '',
      checkIn: searchParams.get('checkIn') || '',
      checkOut: searchParams.get('checkOut') || '',
      guests: searchParams.get('guests') ? Number(searchParams.get('guests')) : undefined,
    }));
  }, [searchParams]);

  // Fetch listings from API
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await api.getListings(filters);
        setListings(data.items);
        setTotal(data.total);
        setTotalPages(data.pages);
      } catch (err) {
        console.error('Failed to fetch listings:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [filters]);

  const handleSelectCategory = (cat: string) => {
    const updated = { ...filters, category: cat, page: 1 };
    setFilters(updated);
    
    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    if (cat === 'All') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    router.push(`/?${params.toString()}`);
  };

  const handlePageChange = (p: number) => {
    setFilters((prev) => ({ ...prev, page: p }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header onOpenFilter={() => setIsFilterOpen(true)} />
      
      <CategoryBar
        activeCategory={filters.category || 'All'}
        onSelectCategory={handleSelectCategory}
        onOpenFilter={() => setIsFilterOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full pt-4">
        {showMap ? (
          <div className="py-4 animate-in fade-in duration-200">
            <MapView listings={listings} />
          </div>
        ) : (
          <ListingGrid
            listings={listings}
            total={total}
            currentPage={filters.page || 1}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        )}
      </main>

      {/* Floating Toggle Map / List Button */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => setShowMap(!showMap)}
          className="bg-black hover:bg-gray-800 text-white font-bold text-xs py-3.5 px-6 rounded-full shadow-2xl flex items-center gap-2 transition transform hover:scale-105 active:scale-95"
        >
          {showMap ? (
            <>
              <span>Show list</span>
              <List className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>Show map</span>
              <Map className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Filter Modal */}
      {isFilterOpen && (
        <FilterModal
          filters={filters}
          onApplyFilters={(newFilters) => setFilters(newFilters)}
          onClose={() => setIsFilterOpen(false)}
        />
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm font-bold text-gray-500">Loading air bnb...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
