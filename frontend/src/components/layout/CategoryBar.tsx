'use client';

import React from 'react';
import {
  Sparkles,
  Waves,
  TreePine,
  Building,
  Castle,
  Mountain,
  Sunset,
  Flame,
  Home,
  SlidersHorizontal
} from 'lucide-react';

export const CATEGORIES = [
  { id: 'All', label: 'All Stays', icon: Sparkles },
  { id: 'Beachfront', label: 'Beachfront', icon: Waves },
  { id: 'Cabins', label: 'Cabins', icon: TreePine },
  { id: 'Iconic Cities', label: 'Iconic Cities', icon: Building },
  { id: 'Mansions', label: 'Mansions', icon: Castle },
  { id: 'Countryside', label: 'Countryside', icon: Mountain },
  { id: 'Lakefront', label: 'Lakefront', icon: Sunset },
  { id: 'Tiny Homes', label: 'Tiny Homes', icon: Home },
  { id: 'Trending', label: 'Trending', icon: Flame },
];

interface CategoryBarProps {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  onOpenFilter: () => void;
}

export default function CategoryBar({
  activeCategory,
  onSelectCategory,
  onOpenFilter
}: CategoryBarProps) {
  return (
    <div className="bg-white border-b border-gray-200 py-3 sticky top-20 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Scrollable Categories List */}
        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar py-1 scroll-smooth">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex flex-col items-center gap-2 pb-2 transition border-b-2 whitespace-nowrap shrink-0 group ${
                  isSelected
                    ? 'border-black text-black font-semibold'
                    : 'border-transparent text-gray-500 hover:text-black hover:border-gray-300'
                }`}
              >
                <Icon className={`w-6 h-6 transition transform group-hover:scale-110 ${isSelected ? 'text-black' : 'text-gray-500'}`} />
                <span className="text-xs">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Filter Trigger Button */}
        <button
          onClick={onOpenFilter}
          className="flex items-center gap-2 border border-gray-300 hover:border-black rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-800 transition shrink-0 bg-white shadow-sm hover:shadow"
        >
          <SlidersHorizontal className="w-4 h-4 text-gray-600" />
          <span>Filters</span>
        </button>
      </div>
    </div>
  );
}
