'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import { ListingSummary, Booking } from '@/types';
import { api } from '@/services/api';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/context/ToastContext';
import { Building2, Plus, DollarSign, Calendar, Eye, Edit, Trash2 } from 'lucide-react';

export default function HostDashboardPage() {
  const { currentUser } = useUser();
  const { showToast } = useToast();
  const [hostListings, setHostListings] = useState<ListingSummary[]>([]);
  const [hostReservations, setHostReservations] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadHostData = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      setHostListings(await api.getHostListings(currentUser.id));
      setHostReservations(await api.getHostReservations(currentUser.id));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadHostData(); }, [currentUser]);

  const handleDelete = async (id: number) => {
    if (!currentUser || !confirm('Delete this listing?')) return;
    try {
      await api.deleteListing(id, currentUser.id);
      showToast('Listing deleted', 'info');
      loadHostData();
    } catch (err: any) {
      showToast(err.message || 'Error deleting listing', 'error');
    }
  };

  const revenue = hostReservations.filter((r) => r.status === 'confirmed').reduce((sum, r) => sum + r.total_price, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header showSearchBar={false} />
      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Host Dashboard</h1>
            <p className="text-xs text-gray-500">Welcome, <span className="font-bold">{currentUser?.name}</span></p>
          </div>
          <Link href="/host/create" className="bg-airbnb-brand text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow flex items-center gap-1.5"><Plus className="w-4 h-4" /> Create Listing</Link>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-2xl border flex items-center gap-3"><DollarSign className="w-8 h-8 text-emerald-600" /><div><span className="text-xs text-gray-500 font-semibold">Total Revenue</span><p className="text-xl font-bold">₹{revenue.toLocaleString('en-IN')}</p></div></div>
          <div className="bg-white p-5 rounded-2xl border flex items-center gap-3"><Building2 className="w-8 h-8 text-blue-600" /><div><span className="text-xs text-gray-500 font-semibold">Properties</span><p className="text-xl font-bold">{hostListings.length}</p></div></div>
          <div className="bg-white p-5 rounded-2xl border flex items-center gap-3"><Calendar className="w-8 h-8 text-purple-600" /><div><span className="text-xs text-gray-500 font-semibold">Reservations</span><p className="text-xl font-bold">{hostReservations.length}</p></div></div>
        </div>

        <div className="bg-white rounded-2xl border p-5 space-y-3">
          <h2 className="text-lg font-bold">Your Listings</h2>
          {isLoading ? <div className="text-xs text-gray-400">Loading...</div> : hostListings.length === 0 ? <p className="text-xs text-gray-500">No listings created yet.</p> : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 uppercase text-[10px] text-gray-400 font-bold">
                  <tr><th className="p-2">Property</th><th className="p-2">Category</th><th className="p-2">Price</th><th className="p-2">Rating</th><th className="p-2 text-right">Actions</th></tr>
                </thead>
                <tbody className="divide-y">
                  {hostListings.map((item) => (
                    <tr key={item.id}>
                      <td className="p-2 font-bold flex items-center gap-2"><img src={item.images[0]?.url} className="w-8 h-8 rounded object-cover" /><span>{item.title}</span></td>
                      <td className="p-2">{item.category}</td>
                      <td className="p-2 font-bold">₹{item.price_per_night.toLocaleString('en-IN')}</td>
                      <td className="p-2">★ {item.avg_rating.toFixed(2)}</td>
                      <td className="p-2 text-right space-x-1">
                        <Link href={`/listings/${item.id}`} className="p-1 border rounded inline-block"><Eye className="w-3.5 h-3.5" /></Link>
                        <Link href={`/host/edit/${item.id}`} className="p-1 border rounded inline-block text-blue-600"><Edit className="w-3.5 h-3.5" /></Link>
                        <button onClick={() => handleDelete(item.id)} className="p-1 border rounded text-rose-600"><Trash2 className="w-3.5 h-3.5" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border p-5 space-y-3">
          <h2 className="text-lg font-bold">Guest Reservations</h2>
          {hostReservations.length === 0 ? <p className="text-xs text-gray-500">No reservations on your properties.</p> : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 uppercase text-[10px] text-gray-400 font-bold">
                  <tr><th className="p-2">Guest</th><th className="p-2">Property</th><th className="p-2">Dates</th><th className="p-2">Total</th><th className="p-2">Status</th></tr>
                </thead>
                <tbody className="divide-y">
                  {hostReservations.map((res) => (
                    <tr key={res.id}>
                      <td className="p-2 font-bold">{res.guest?.name}</td>
                      <td className="p-2">{res.listing?.title}</td>
                      <td className="p-2">{res.check_in} → {res.check_out}</td>
                      <td className="p-2 font-bold">₹{res.total_price.toLocaleString('en-IN')}</td>
                      <td className="p-2">{res.status === 'confirmed' ? <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">CONFIRMED</span> : <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-bold">CANCELLED</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
