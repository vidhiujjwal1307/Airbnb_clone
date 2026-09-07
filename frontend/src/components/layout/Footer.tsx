'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20 text-xs text-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-gray-200">
          <div>
            <h4 className="font-bold text-gray-900 mb-3 text-sm">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Help Center</a></li>
              <li><a href="#" className="hover:underline">AirCover</a></li>
              <li><a href="#" className="hover:underline">Anti-discrimination</a></li>
              <li><a href="#" className="hover:underline">Disability support</a></li>
              <li><a href="#" className="hover:underline">Cancellation options</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-3 text-sm">Hosting</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">air bnb your home</a></li>
              <li><a href="#" className="hover:underline">AirCover for Hosts</a></li>
              <li><a href="#" className="hover:underline">Hosting resources</a></li>
              <li><a href="#" className="hover:underline">Community forum</a></li>
              <li><a href="#" className="hover:underline">Hosting responsibly</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-3 text-sm">air bnb</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Newsroom</a></li>
              <li><a href="#" className="hover:underline">New features</a></li>
              <li><a href="#" className="hover:underline">Careers</a></li>
              <li><a href="#" className="hover:underline">Investors</a></li>
              <li><a href="#" className="hover:underline">Gift cards</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-3 text-sm">Mocked Placeholders</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Payment Processing (Mocked)</li>
              <li>Guest & Host Messaging (Coming Soon)</li>
              <li>Identity Verification (Coming Soon)</li>
              <li>Real-time Live Map (Static / Basic)</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 air bnb, Inc. · Privacy · Terms · Sitemap · Company details</p>
          <div className="flex items-center gap-6 font-semibold">
            <span>English (IN)</span>
            <span>₹ INR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
