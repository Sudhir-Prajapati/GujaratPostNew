import { NextRequest, NextResponse } from 'next/server';

const YOUTUBE_CHANNEL_ID = 'UCqQ8YbFSZ4j8J4iVJOHurTw';

export const revalidate = 300; // Cache for 5 minutes

function extractYouTubeId(link: string, guid: string): string {
  if (link) {
    const m = link.match(/(?:watch\?v=|shorts\/|v\/)([a-zA-Z0-9_-]{11})/);
    if (m) return m[1];
  }
  if (guid) {
    const m2 = guid.match(/([a-zA-Z0-9_-]{11})$/);
    if (m2) return m2[1];
  }
  return '';
}

function isShortVideo(item: any): boolean {
  return (
    item.link?.includes('/shorts/') ||
    item.title?.toLowerCase().includes('#short') ||
    item.title?.toLowerCase().includes('#shorts')
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type'); // 'video' | 'short' | null for all

  try {
    // Fetch YouTube RSS feed directly on the server (no CORS issue)
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;
    const rssRes = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GujaratPost/1.0)',
      },
      next: { revalidate: 300 },
    });

    if (!rssRes.ok) {
      throw new Error(`RSS fetch failed: ${rssRes.status}`);
    }

    const xmlText = await rssRes.text();

    // Parse XML entries manually (no xml parser needed for simple RSS)
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    const videos: any[] = [];
    const shorts: any[] = [];
    let idx = 0;
    let match;

    while ((match = entryRegex.exec(xmlText)) !== null && idx < 50) {
      const entryXml = match[1];

      const getTag = (tag: string) => {
        const m = entryXml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
        return m ? m[1].trim().replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"') : '';
      };
      const getAttr = (tag: string, attr: string) => {
        const m = entryXml.match(new RegExp(`<${tag}[^>]*\\s${attr}="([^"]*)"[^>]*>`));
        return m ? m[1] : '';
      };

      const videoId = getAttr('yt:videoId', 'url') || getTag('yt:videoId');
      const title = getTag('title');
      const link = getAttr('link', 'href') || `https://www.youtube.com/watch?v=${videoId}`;
      const published = getTag('published') || new Date().toISOString();
      const thumbnail = getAttr('media:thumbnail', 'url') || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

      if (!videoId) { idx++; continue; }

      const itemIsShort =
        link.includes('/shorts/') ||
        title.toLowerCase().includes('#short') ||
        title.toLowerCase().includes('#shorts');

      // Parse real view count from <media:statistics views="321"/>
      const viewsMatch = entryXml.match(/<media:statistics[^>]*\sviews="(\d+)"/);
      const realViews = viewsMatch ? parseInt(viewsMatch[1], 10) : 0;

      // Parse real duration (seconds) from <media:content duration="976"/>
      const durationSecMatch = entryXml.match(/<media:content[^>]*\sduration="(\d+)"/);
      const durationSecs = durationSecMatch ? parseInt(durationSecMatch[1], 10) : 0;
      const durationStr = durationSecs > 0
        ? `${Math.floor(durationSecs / 60)}:${String(durationSecs % 60).padStart(2, '0')}`
        : itemIsShort ? '0:58' : '12:00';

      const videoObj = {
        id: `yt-live-${videoId}`,
        youtubeId: videoId,
        title,
        titleGu: title,
        titleHi: title,
        description: title,
        thumbnail,
        publishedAt: published,
        type: itemIsShort ? 'short' : 'video',
        views: realViews,
        duration: durationStr,
        category: 'News',
        channelUrl: `https://www.youtube.com/@Gujaratpostnews`,
        videoUrl: link,
      };

      if (itemIsShort) {
        shorts.push(videoObj);
      } else {
        videos.push(videoObj);
      }

      idx++;
    }

    let result;
    if (type === 'short') result = shorts;
    else if (type === 'video') result = videos;
    else result = [...videos, ...shorts];

    return NextResponse.json({ success: true, data: result }, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' }
    });
  } catch (err: any) {
    console.error('YouTube RSS fetch error:', err?.message || err);
    return NextResponse.json({ success: false, data: [], error: err?.message }, { status: 200 });
  }
}
