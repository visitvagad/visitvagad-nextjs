import type { Metadata } from 'next';
import { Route } from 'lucide-react';

export const metadata: Metadata = { title: 'Itineraries' };

export default function AdminItinerariesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Itineraries</h1>
        <p className="mt-1 text-sm text-text-muted">Curated travel plans for Vagad visitors.</p>
      </div>

      <div className="text-center py-16 bg-surface border border-border rounded-2xl">
        <Route size={32} className="mx-auto text-text-muted mb-3" />
        <p className="text-text-muted text-sm">Itinerary management coming soon.</p>
        <p className="text-xs text-text-muted mt-1">This module will support multi-day trip planning with stops, maps, and recommendations.</p>
      </div>
    </div>
  );
}
