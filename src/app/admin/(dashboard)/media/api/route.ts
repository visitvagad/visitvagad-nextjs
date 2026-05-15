import { NextResponse } from 'next/server';
import { Query } from 'node-appwrite';
import { adminStorage } from '@/lib/appwrite-admin';
import { BUCKET_ID } from '@/lib/appwrite-schema';
import { getUser } from '@/lib/auth';

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const result = await adminStorage.listFiles(BUCKET_ID, [
      Query.orderDesc('$createdAt'),
      Query.limit(100),
    ]);

    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;

    const files = result.files.map((f) => ({
      $id: f.$id,
      name: f.name,
      mimeType: f.mimeType,
      sizeOriginal: f.sizeOriginal,
      $createdAt: f.$createdAt,
      url: `${endpoint}/storage/buckets/${BUCKET_ID}/files/${f.$id}/view?project=${projectId}`,
    }));

    return NextResponse.json({ files });
  } catch {
    return NextResponse.json({ files: [] });
  }
}
