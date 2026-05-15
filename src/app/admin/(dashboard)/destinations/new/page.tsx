import type { Metadata } from 'next';
import { DestinationEditor } from '@/components/admin/destination-editor';

export const metadata: Metadata = { title: 'New Destination' };

export default function NewDestinationPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">New Destination</h1>
      <DestinationEditor mode="create" />
    </div>
  );
}
