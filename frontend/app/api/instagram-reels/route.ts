import { NextRequest, NextResponse } from 'next/server';

const INSTAGRAM_HANDLE = 'gujaratpost.in';
const IG_HEADERS = {
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
};

export const revalidate = 300; // Cache for 5 minutes

function mapNode(node: any) {
  const code = node.shortcode || node.code;
  if (!code) return null;
  const caption = node.edge_media_to_caption?.edges?.[0]?.node?.text || node.caption?.text || '';
  const cleanHeading = caption.split('\n')[0]?.trim() || 'Gujarat Post News Reel';
  const thumbnail =
    node.display_url ||
    node.thumbnail_src ||
    node.image_versions2?.candidates?.[0]?.url ||
    node.thumbnail_url ||
    `https://www.instagram.com/p/${code}/media/?size=l`;
  const views = node.video_view_count || node.play_count || node.view_count || node.edge_liked_by?.count || 0;
  const takenAt = node.taken_at_timestamp || node.taken_at;

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
    createdAt: takenAt ? new Date(takenAt * 1000).toISOString() : new Date().toISOString(),
  };
}

export async function GET(_request: NextRequest) {
  try {
    const TARGET = 50;
    const reels: any[] = [];

    // ── Page 1: web_profile_info (12 items) ──
    const profileRes = await fetch(
      `https://www.instagram.com/api/v1/users/web_profile_info/?username=${INSTAGRAM_HANDLE}`,
      { headers: IG_HEADERS, next: { revalidate: 300 } }
    );

    if (!profileRes.ok) {
      return NextResponse.json({ success: false, data: [] }, { status: 200 });
    }

    const profileData = await profileRes.json();
    const mediaObj = profileData?.data?.user?.edge_owner_to_timeline_media;
    const page1Edges = mediaObj?.edges || [];
    let nextMaxId: string = mediaObj?.page_info?.end_cursor || '';

    for (const { node } of page1Edges) {
      const mapped = mapNode(node);
      if (mapped) reels.push(mapped);
    }

    // ── Pages 2–5 via feed/user endpoint ──
    let page = 2;
    while (reels.length < TARGET && nextMaxId && page <= 5) {
      await new Promise(r => setTimeout(r, 600));

      const feedUrl = `https://www.instagram.com/api/v1/feed/user/${INSTAGRAM_HANDLE}/username/?max_id=${encodeURIComponent(nextMaxId)}`;
      const feedRes = await fetch(feedUrl, { headers: IG_HEADERS });

      if (feedRes.status === 429) {
        // Rate limited — stop gracefully with what we have
        break;
      }
      if (!feedRes.ok) break;

      const feedData = await feedRes.json();
      const items: any[] = feedData?.items || [];
      nextMaxId = feedData?.next_max_id || '';

      if (items.length === 0) break;

      for (const item of items) {
        if (reels.length >= TARGET) break;
        const mapped = mapNode(item);
        if (mapped) reels.push(mapped);
      }

      page++;
      if (!nextMaxId) break;
    }

    return NextResponse.json({ success: true, data: reels }, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' }
    });
  } catch (err: any) {
    console.error('Error fetching live Instagram reels:', err?.message || err);
    return NextResponse.json({ success: false, data: [], error: err?.message }, { status: 200 });
  }
}
