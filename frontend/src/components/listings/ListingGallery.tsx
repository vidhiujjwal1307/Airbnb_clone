'use client';

import React, { useState } from 'react';
import { Grid, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ListingImage } from '@/types';

interface ListingGalleryProps {
  images: ListingImage[];
  title: string;
}

export default function ListingGallery({ images, title }: ListingGalleryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const displayImages = images.length > 0
    ? images
    : [{ id: 1, listing_id: 0, url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200', is_cover: true, display_order: 0 }];

  const mainImage = displayImages[0];
  const sideImages = displayImages.slice(1, 5);

  return (
    <>
      {/* Airbnb 5-Photo Grid */}
      <div className="relative rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-4 gap-2 aspect-[16/10] md:aspect-[2/1] max-h-[500px]">
        {/* Main Cover Image */}
        <div className="md:col-span-2 relative h-full bg-gray-100 overflow-hidden cursor-pointer group" onClick={() => { setActiveIdx(0); setIsModalOpen(true); }}>
          <img
            src={mainImage.url}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Side Images Grid */}
        <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-2 h-full">
          {sideImages.map((img, idx) => (
            <div
              key={img.id || idx}
              onClick={() => { setActiveIdx(idx + 1); setIsModalOpen(true); }}
              className="relative h-full bg-gray-100 overflow-hidden cursor-pointer group"
            >
              <img
                src={img.url}
                alt={`${title} - ${idx + 2}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
          {/* Fill missing tiles if fewer than 5 images */}
          {Array.from({ length: Math.max(0, 4 - sideImages.length) }).map((_, idx) => (
            <div key={`fill-${idx}`} className="bg-gray-200 h-full" />
          ))}
        </div>

        {/* Show All Photos Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-gray-900 border border-gray-300 font-semibold text-xs px-4 py-2 rounded-xl shadow-md flex items-center gap-2 transition"
        >
          <Grid className="w-4 h-4" />
          Show all photos ({displayImages.length})
        </button>
      </div>

      {/* Fullscreen Photo Lightbox Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-between p-4 animate-in fade-in duration-200">
          <div className="w-full flex items-center justify-between p-2 text-white">
            <span className="text-sm font-semibold">
              {activeIdx + 1} / {displayImages.length}
            </span>
            <button
              onClick={() => setIsModalOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative max-w-4xl max-h-[80vh] w-full flex items-center justify-center">
            <img
              src={displayImages[activeIdx]?.url}
              alt={title}
              className="max-h-[80vh] max-w-full object-contain rounded-xl shadow-2xl"
            />

            {displayImages.length > 1 && (
              <>
                <button
                  onClick={() => setActiveIdx((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1))}
                  className="absolute left-4 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setActiveIdx((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1))}
                  className="absolute right-4 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          <p className="text-white/80 text-xs font-medium py-2">{title}</p>
        </div>
      )}
    </>
  );
}
