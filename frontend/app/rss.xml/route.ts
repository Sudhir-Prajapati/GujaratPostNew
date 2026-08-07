import { getBackendApiUrl } from '@/lib/api';

export async function GET() {
  try {
    const backendUrl = getBackendApiUrl('/api/public/rss');
    const res = await fetch(backendUrl, { cache: 'no-store' });
    const xmlText = await res.text();

    return new Response(xmlText, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 's-maxage=300, stale-while-revalidate',
      },
    });
  } catch (error) {
    return new Response(
      '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Gujarat Post</title></channel></rss>',
      {
        status: 500,
        headers: { 'Content-Type': 'application/xml; charset=utf-8' },
      }
    );
  }
}
