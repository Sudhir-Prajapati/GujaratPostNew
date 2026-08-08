import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { path, slug } = body;

    // 1. Revalidate homepage
    revalidatePath('/');

    // 2. Revalidate specific article path if slug provided
    if (slug) {
      revalidatePath(`/news/${slug}`);
    }

    // 3. Revalidate custom path if provided
    if (path) {
      revalidatePath(path);
    }

    return NextResponse.json({
      revalidated: true,
      message: 'On-demand ISR revalidation triggered successfully',
      now: Date.now(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { revalidated: false, message: err?.message || 'Error revalidating' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get('path');
    const slug = searchParams.get('slug');

    revalidatePath('/');
    if (slug) revalidatePath(`/news/${slug}`);
    if (path) revalidatePath(path);

    return NextResponse.json({
      revalidated: true,
      message: 'On-demand ISR revalidation triggered successfully',
      now: Date.now(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { revalidated: false, message: err?.message || 'Error revalidating' },
      { status: 500 }
    );
  }
}
