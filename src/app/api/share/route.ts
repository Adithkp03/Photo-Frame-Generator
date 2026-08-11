import { NextResponse } from 'next/server';
import { createShare } from '@/lib/storage';

export async function POST(req: Request) {
  try {
    const { image, format, metadata } = await req.json();
    
    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }
    
    const shareData = await createShare(image, format, metadata);
    
    return NextResponse.json(shareData);
  } catch (error) {
    console.error('Error creating share:', error);
    return NextResponse.json({ error: 'Failed to create share' }, { status: 500 });
  }
}
