import { NextRequest, NextResponse } from 'next/server';

const INSTAGRAM_HANDLE = 'gujaratpost.in';

export const revalidate = 300; // Cache for 5 minutes

export async function GET(request: NextRequest) {
  try {
    const url = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${INSTAGRAM_HANDLE}`;
    
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'X-IG-App-ID': '936619743392459',
        'X-ASBD-ID': '129477',
        'X-IG-WWW-Claim': '0',
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'Referer': `https://www.instagram.com/${INSTAGRAM_HANDLE}/`,
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      console.warn(`Instagram web API returned status ${res.status}`);
      return NextResponse.json({ success: false, data: [] }, { status: 200 });
    }

    const data = await res.json();
    const user = data?.data?.user;
    const media = user?.edge_owner_to_timeline_media?.edges || [];

    const reels = media.map(({ node }: any) => {
      const code = node.shortcode;
      const caption = node.edge_media_to_caption?.edges?.[0]?.node?.text || '';
      // Clean multi-line captions to fit card headings
      const cleanHeading = caption.split('\n')[0]?.trim() || 'Gujarat Post News Reel';
      const thumbnail = node.display_url || node.thumbnail_src || `https://www.instagram.com/p/${code}/media/?size=l`;
      const views = node.video_view_count || node.edge_liked_by?.count || 0;

      return {
        id: `insta-live-${code}`,
        type: 'INSTAGRAM',
        heading: cleanHeading,
        headingGu: cleanHeading,
        headingHi: cleanHeading,
        videoUrl: null,
        instaUrl: `https://www.instagram.com/reel/${code}/`,
        thumbnail,
        views,
        isActive: true,
        createdAt: node.taken_at_timestamp ? new Date(node.taken_at_timestamp * 1000).toISOString() : new Date().toISOString(),
      };
    });

    return NextResponse.json({ success: true, data: reels }, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' }
    });
  } catch (err: any) {
    console.error('Error fetching live Instagram reels:', err?.message || err);
    return NextResponse.json({ success: false, data: [], error: err?.message }, { status: 200 });
  }
}
