import { NextRequest, NextResponse } from 'next/server';

const YOUTUBE_CHANNEL_ID = 'UCqQ8YbFSZ4j8J4iVJOHurTw';
const CHANNEL_HANDLE = '@Gujaratpostnews';

export const revalidate = 300; // Cache for 5 minutes

function parseNumericViews(viewsText: string): number {
  if (!viewsText) return 500;
  const clean = viewsText.replace(/,/g, '').toLowerCase();
  if (clean.includes('k')) {
    return Math.round(parseFloat(clean) * 1000);
  }
  if (clean.includes('m')) {
    return Math.round(parseFloat(clean) * 1000000);
  }
  const match = clean.match(/(\d+)/);
  return match ? parseInt(match[1]) : 500;
}

// Scrape YouTube channel page tab directly for 30+ real items with accurate metadata
async function fetchChannelTab(tab: 'videos' | 'shorts'): Promise<any[]> {
  try {
    const url = `https://www.youtube.com/${CHANNEL_HANDLE}/${tab}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) return [];

    const html = await res.text();
    const match = html.match(/ytInitialData\s*=\s*({[\s\S]*?});/);
    if (!match) return [];

    const data = JSON.parse(match[1]);
    const items: any[] = [];
    const seen = new Set<string>();

    function walk(node: any) {
      if (!node || typeof node !== 'object') return;

      // 1. Modern YouTube lockupViewModel structure
      if (node.lockupViewModel) {
        const vm = node.lockupViewModel;
        const videoId = vm.contentId;
        if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId) && !seen.has(videoId)) {
          seen.add(videoId);

          const title = vm.metadata?.lockupMetadataViewModel?.title?.content || '';

          // Duration from overlays
          let duration = tab === 'shorts' ? '0:58' : '0:00';
          const jsonStr = JSON.stringify(vm);
          const durationMatch = jsonStr.match(/"text":"(\d{1,2}:\d{2}(?::\d{2})?)"/);
          if (durationMatch) {
            duration = durationMatch[1];
          }

          // Metadata rows (views + published time)
          const metadataRows = vm.metadata?.lockupMetadataViewModel?.metadata?.contentMetadataViewModel?.metadataRows || [];
          let viewsText = '';
          let publishedTime = '';
          for (const row of metadataRows) {
            const parts = row.metadataParts || [];
            for (const p of parts) {
              const txt = p.text?.content || '';
              if (txt.includes('view')) viewsText = txt;
              else if (txt.includes('ago') || txt.includes('day') || txt.includes('hour') || txt.includes('month') || txt.includes('year')) {
                publishedTime = txt;
              }
            }
          }

          items.push({
            id: `yt-live-${videoId}`,
            youtubeId: videoId,
            title,
            titleGu: title,
            titleHi: title,
            description: title,
            thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
            publishedAt: publishedTime || new Date().toISOString(),
            type: tab === 'shorts' ? 'short' : 'video',
            views: parseNumericViews(viewsText),
            duration,
            category: 'News',
            channelUrl: `https://www.youtube.com/${CHANNEL_HANDLE}`,
            videoUrl: tab === 'shorts' ? `https://www.youtube.com/shorts/${videoId}` : `https://www.youtube.com/watch?v=${videoId}`,
          });
          return;
        }
      }

      // 2. Traditional videoRenderer structure
      const v = node.videoRenderer || node.gridVideoRenderer || node.reelItemRenderer;
      if (v && (v.videoId || v.reelId)) {
        const videoId = v.videoId || v.reelId;
        if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId) && !seen.has(videoId)) {
          seen.add(videoId);

          const title = v.title?.runs?.[0]?.text || v.title?.simpleText || v.headline?.simpleText || '';
          const duration = v.lengthText?.simpleText || v.lengthText?.runs?.[0]?.text || (tab === 'shorts' ? '0:58' : '10:00');
          const viewsText = v.viewCountText?.simpleText || v.viewCountText?.runs?.[0]?.text || '';
          const publishedTime = v.publishedTimeText?.simpleText || v.publishedTimeText?.runs?.[0]?.text || '';

          items.push({
            id: `yt-live-${videoId}`,
            youtubeId: videoId,
            title,
            titleGu: title,
            titleHi: title,
            description: title,
            thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
            publishedAt: publishedTime || new Date().toISOString(),
            type: tab === 'shorts' ? 'short' : 'video',
            views: parseNumericViews(viewsText),
            duration,
            category: 'News',
            channelUrl: `https://www.youtube.com/${CHANNEL_HANDLE}`,
            videoUrl: tab === 'shorts' ? `https://www.youtube.com/shorts/${videoId}` : `https://www.youtube.com/watch?v=${videoId}`,
          });
          return;
        }
      }

      for (const k of Object.keys(node)) {
        walk(node[k]);
      }
    }

    walk(data);
    return items;
  } catch (err) {
    console.error(`Error scraping channel tab ${tab}:`, err);
    return [];
  }
}

// Fallback RSS parser if page scraping fails
async function fetchRssFeed(): Promise<{ videos: any[]; shorts: any[] }> {
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;
  const rssRes = await fetch(rssUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; GujaratPost/1.0)' },
    next: { revalidate: 300 },
  });

  if (!rssRes.ok) return { videos: [], shorts: [] };

  const xmlText = await rssRes.text();
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  const videos: any[] = [];
  const shorts: any[] = [];
  let match;

  while ((match = entryRegex.exec(xmlText)) !== null) {
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
    const viewsMatch = entryXml.match(/views="(\d+)"/);
    const viewsCount = viewsMatch ? parseInt(viewsMatch[1]) : 500;

    if (!videoId) continue;

    const itemIsShort =
      link.includes('/shorts/') ||
      title.toLowerCase().includes('#short') ||
      title.toLowerCase().includes('#shorts');

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
      views: viewsCount,
      duration: itemIsShort ? '0:58' : '10:00',
      category: 'News',
      channelUrl: `https://www.youtube.com/${CHANNEL_HANDLE}`,
      videoUrl: link,
    };

    if (itemIsShort) shorts.push(videoObj);
    else videos.push(videoObj);
  }

  return { videos, shorts };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type'); // 'video' | 'short' | null for all

  try {
    let result: any[] = [];

    if (type === 'video') {
      const channelVideos = await fetchChannelTab('videos');
      if (channelVideos.length > 0) {
        result = channelVideos;
      } else {
        const rss = await fetchRssFeed();
        result = rss.videos;
      }
    } else if (type === 'short') {
      const channelShorts = await fetchChannelTab('shorts');
      if (channelShorts.length > 0) {
        result = channelShorts;
      } else {
        const rss = await fetchRssFeed();
        result = rss.shorts;
      }
    } else {
      const [v, s] = await Promise.all([fetchChannelTab('videos'), fetchChannelTab('shorts')]);
      if (v.length > 0 || s.length > 0) {
        result = [...v, ...s];
      } else {
        const rss = await fetchRssFeed();
        result = [...rss.videos, ...rss.shorts];
      }
    }

    return NextResponse.json({ success: true, data: result }, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' }
    });
  } catch (err: any) {
    console.error('YouTube fetch error:', err?.message || err);
    return NextResponse.json({ success: false, data: [], error: err?.message }, { status: 200 });
  }
}
