import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDestination } from '@/features/destinations/actions';
import { DestinationEditor } from '@/components/admin/destination-editor';
import type { DestinationFormData } from '@/types/cms';

export const metadata: Metadata = { title: 'Edit Destination' };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditDestinationPage({ params }: Props) {
  const { id } = await params;

  let doc;
  try {
    doc = await getDestination(id);
  } catch {
    notFound();
  }

  const initialData: DestinationFormData & { $id: string } = {
    $id: doc.$id,
    title: doc.title,
    slug: doc.slug,
    district: doc.district,
    summary: doc.summary,
    story: doc.story || '',
    heroImage: doc.heroImage || '',
    gallery: doc.gallery ? JSON.parse(doc.gallery) : [],
    highlights: doc.highlights ? JSON.parse(doc.highlights) : [],
    experiences: doc.experiences ? JSON.parse(doc.experiences) : [],
    bestTime: doc.bestTime || '',
    lat: doc.lat || 0,
    lng: doc.lng || 0,
    nearbyPlaces: doc.nearbyPlaces ? JSON.parse(doc.nearbyPlaces) : [],
    seoTitle: doc.seoTitle || '',
    seoDescription: doc.seoDescription || '',
    seoOgImage: doc.seoOgImage || '',
    seoKeywords: doc.seoKeywords || '',
    featured: doc.featured || false,
    status: doc.status,
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Edit: {doc.title}</h1>
      <DestinationEditor mode="edit" initialData={initialData} />
    </div>
  );
}
