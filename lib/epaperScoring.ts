/**
 * GujaratPost E-Paper Scoring, Section Allocation & Validation Engine
 * 
 * Implements:
 * 1. Primary Section + Location Resolution Hierarchy
 * 2. 0-100 Weighted Article Scoring Engine
 * 3. Page Capacity Definitions for 14 Specialized Templates
 * 4. Cross-Page Deduplication Engine (with allowDuplicate override)
 * 5. Page Locking Support (isLocked skips locked pages during auto-arrange)
 * 6. Template-Specific Pre-Flight Validation Engine
 */

import { BroadsheetArticle, EPaperPageData } from '@/components/epaper/types';

export interface PageSectionConfig {
  pageNumber: number;
  sectionKey: string;
  titleGu: string;
  titleEn: string;
  defaultTemplateId: string;
  categoryKeywords: string[];
  defaultEnabled: boolean;
  color: string;
  capacity: {
    lead: number;
    secondary: number;
    standard: number;
    brief: number;
  };
}

export const PAGE_SECTIONS_CONFIG: PageSectionConfig[] = [
  {
    pageNumber: 1,
    sectionKey: 'front_page',
    titleGu: 'મુખ્ય સમાચાર',
    titleEn: 'Front Page',
    defaultTemplateId: 'FrontPageTemplate',
    categoryKeywords: ['breaking', 'lead', 'top', 'મુખ્ય', 'breaking-news', 'important'],
    defaultEnabled: true,
    color: 'from-red-600 to-rose-700',
    capacity: { lead: 1, secondary: 2, standard: 3, brief: 4 },
  },
  {
    pageNumber: 2,
    sectionKey: 'local_city',
    titleGu: 'સ્થાનિક શહેર',
    titleEn: 'Local City',
    defaultTemplateId: 'LocalCityTemplate',
    categoryKeywords: ['local', 'city', 'amc', 'civic', 'crime', 'traffic', 'શહેર', 'સ્થાનિક', 'મ્યુનિસિપલ'],
    defaultEnabled: true,
    color: 'from-blue-600 to-cyan-700',
    capacity: { lead: 1, secondary: 2, standard: 4, brief: 4 },
  },
  {
    pageNumber: 3,
    sectionKey: 'state_gujarat',
    titleGu: 'ગુજરાત રાજ્ય',
    titleEn: 'Gujarat State',
    defaultTemplateId: 'GujaratTemplate',
    categoryKeywords: ['gujarat', 'state', 'district', 'saurashtra', 'surat', 'rajkot', 'vadodara', 'ગુજરાત', 'રાજ્ય'],
    defaultEnabled: true,
    color: 'from-emerald-600 to-teal-700',
    capacity: { lead: 1, secondary: 2, standard: 4, brief: 6 },
  },
  {
    pageNumber: 4,
    sectionKey: 'national_india',
    titleGu: 'ભારત / રાષ્ટ્રીય',
    titleEn: 'National News',
    defaultTemplateId: 'NationalTemplate',
    categoryKeywords: ['national', 'india', 'politics', 'delhi', 'parliament', 'supreme-court', 'defense', 'railways', 'ભારત', 'દેશ'],
    defaultEnabled: true,
    color: 'from-indigo-600 to-blue-700',
    capacity: { lead: 1, secondary: 2, standard: 4, brief: 4 },
  },
  {
    pageNumber: 5,
    sectionKey: 'world_international',
    titleGu: 'વિશ્વ સમાચાર',
    titleEn: 'World / International',
    defaultTemplateId: 'WorldTemplate',
    categoryKeywords: ['world', 'international', 'global', 'foreign', 'usa', 'europe', 'asia', 'વિશ્વ', 'વિદેશ'],
    defaultEnabled: true,
    color: 'from-purple-600 to-violet-700',
    capacity: { lead: 1, secondary: 2, standard: 4, brief: 4 },
  },
  {
    pageNumber: 6,
    sectionKey: 'business_market',
    titleGu: 'બિઝનેસ & અર્થતંત્ર',
    titleEn: 'Business & Markets',
    defaultTemplateId: 'BusinessTemplate',
    categoryKeywords: ['business', 'market', 'economy', 'finance', 'share-market', 'gold', 'silver', 'sensex', 'startups', 'બિઝનેસ', 'શેરબજાર', 'અર્થતંત્ર'],
    defaultEnabled: true,
    color: 'from-amber-600 to-orange-700',
    capacity: { lead: 1, secondary: 2, standard: 4, brief: 4 },
  },
  {
    pageNumber: 7,
    sectionKey: 'sports',
    titleGu: 'રમતગમત',
    titleEn: 'Sports',
    defaultTemplateId: 'SportsTemplate',
    categoryKeywords: ['sports', 'cricket', 'ipl', 'football', 'tennis', 'olympics', 'રમત', 'ક્રિકેટ'],
    defaultEnabled: true,
    color: 'from-green-600 to-emerald-700',
    capacity: { lead: 1, secondary: 2, standard: 4, brief: 4 },
  },
  {
    pageNumber: 8,
    sectionKey: 'technology',
    titleGu: 'ટેક & વિજ્ઞાન',
    titleEn: 'Tech & Science',
    defaultTemplateId: 'TechnologyTemplate',
    categoryKeywords: ['technology', 'tech', 'science', 'ai', 'gadgets', 'smartphones', 'space', 'isro', 'cyber', 'ટેકનોલોજી', 'વિજ્ઞાન'],
    defaultEnabled: true,
    color: 'from-sky-600 to-blue-700',
    capacity: { lead: 1, secondary: 2, standard: 4, brief: 3 },
  },
  {
    pageNumber: 9,
    sectionKey: 'entertainment',
    titleGu: 'મનોરંજન & સિનેમા',
    titleEn: 'Entertainment',
    defaultTemplateId: 'EntertainmentTemplate',
    categoryKeywords: ['entertainment', 'cinema', 'bollywood', 'movies', 'ott', 'celebrity', 'gujarati-cinema', 'મનોરંજન', 'સિનેમા'],
    defaultEnabled: true,
    color: 'from-pink-600 to-rose-700',
    capacity: { lead: 1, secondary: 2, standard: 3, brief: 3 },
  },
  {
    pageNumber: 10,
    sectionKey: 'lifestyle',
    titleGu: 'લાઇફસ્ટાઇલ & આરોગ્ય',
    titleEn: 'Lifestyle & Health',
    defaultTemplateId: 'LifestyleTemplate',
    categoryKeywords: ['lifestyle', 'health', 'food', 'travel', 'fashion', 'fitness', 'culture', 'heritage', 'લાઇફસ્ટાઇલ', 'આરોગ્ય'],
    defaultEnabled: false,
    color: 'from-rose-600 to-pink-700',
    capacity: { lead: 1, secondary: 2, standard: 4, brief: 4 },
  },
  {
    pageNumber: 11,
    sectionKey: 'education',
    titleGu: 'શિક્ષણ વિશેષ',
    titleEn: 'Education',
    defaultTemplateId: 'EducationTemplate',
    categoryKeywords: ['education', 'exam', 'board', 'gseb', 'cbse', 'university', 'admission', 'results', 'scholarship', 'શિક્ષણ', 'પરીક્ષા'],
    defaultEnabled: false,
    color: 'from-teal-600 to-cyan-700',
    capacity: { lead: 1, secondary: 2, standard: 4, brief: 4 },
  },
  {
    pageNumber: 12,
    sectionKey: 'jobs_career',
    titleGu: 'નોકરી & કારકિર્દી',
    titleEn: 'Jobs & Careers',
    defaultTemplateId: 'JobsTemplate',
    categoryKeywords: ['jobs', 'career', 'recruitment', 'gpsc', 'upsc', 'banking', 'railway', 'vacancy', 'નોકરી', 'ભરતી'],
    defaultEnabled: false,
    color: 'from-yellow-600 to-amber-700',
    capacity: { lead: 1, secondary: 2, standard: 4, brief: 4 },
  },
  {
    pageNumber: 13,
    sectionKey: 'editorial_opinion',
    titleGu: 'અભિપ્રાય & તંત્રીલેખ',
    titleEn: 'Editorial & Opinion',
    defaultTemplateId: 'EditorialTemplate',
    categoryKeywords: ['editorial', 'opinion', 'column', 'analysis', 'letters', 'તંત્રીલેખ', 'અભિપ્રાય'],
    defaultEnabled: false,
    color: 'from-slate-700 to-zinc-900',
    capacity: { lead: 1, secondary: 1, standard: 3, brief: 2 },
  },
  {
    pageNumber: 14,
    sectionKey: 'photo_special',
    titleGu: 'આજના ખાસ ફોટા',
    titleEn: 'Photo Special',
    defaultTemplateId: 'PhotoTemplate',
    categoryKeywords: ['photo', 'gallery', 'special', 'picture', 'તસવીર', 'ફોટો'],
    defaultEnabled: false,
    color: 'from-zinc-800 to-stone-900',
    capacity: { lead: 1, secondary: 2, standard: 2, brief: 2 },
  },
];

/**
 * Resolves the primary section of an article based on explicit field, category, slug, or location.
 */
export function resolvePrimarySection(article: BroadsheetArticle): string {
  // 0. Explicit CMS override
  if (article.primarySection && article.primarySection !== 'auto' && article.primarySection !== 'general') {
    return article.primarySection;
  }

  const catSlug = (article.category?.slug || '').toLowerCase();
  const catName = (article.category?.name || '').toLowerCase();
  const catGu = (article.category?.nameGu || '').toLowerCase();
  const title = (article.title || '').toLowerCase();

  // 1. Sports (Primary section wins over location)
  if (['sport', 'sports', 'cricket', 'ipl', 'football', 'tennis', 'hockey', 'olympic', 'રમત', 'ક્રિકેટ'].some((k) => catSlug.includes(k) || catName.includes(k) || catGu.includes(k) || title.includes(k))) {
    return 'sports';
  }

  // 2. Business & Markets
  if (['business', 'market', 'economy', 'finance', 'money', 'stock', 'share', 'sensex', 'nifty', 'gold', 'silver', 'બિઝનેસ', 'શેરબજાર'].some((k) => catSlug.includes(k) || catName.includes(k) || catGu.includes(k) || title.includes(k))) {
    return 'business_market';
  }

  // 3. Tech & Science
  if (['tech', 'technology', 'science', 'ai', 'gadget', 'mobile', 'smartphone', 'space', 'isro', 'cyber', 'ટેકનોલોજી', 'વિજ્ઞાન'].some((k) => catSlug.includes(k) || catName.includes(k) || catGu.includes(k) || title.includes(k))) {
    return 'technology';
  }

  // 4. Entertainment & Cinema
  if (['entertainment', 'cinema', 'bollywood', 'movie', 'film', 'ott', 'celebrity', 'actor', 'actress', 'music', 'song', 'મનોરંજન', 'સિનેમા'].some((k) => catSlug.includes(k) || catName.includes(k) || catGu.includes(k) || title.includes(k))) {
    return 'entertainment';
  }

  // 5. Education
  if (['education', 'exam', 'board', 'school', 'college', 'university', 'gseb', 'cbse', 'admission', 'scholarship', 'result', 'શિક્ષણ', 'પરીક્ષા'].some((k) => catSlug.includes(k) || catName.includes(k) || catGu.includes(k) || title.includes(k))) {
    return 'education';
  }

  // 6. Jobs & Career
  if (['job', 'jobs', 'career', 'recruitment', 'gpsc', 'upsc', 'banking', 'railway', 'vacancy', 'interview', 'નોકરી', 'ભરતી'].some((k) => catSlug.includes(k) || catName.includes(k) || catGu.includes(k) || title.includes(k))) {
    return 'jobs_career';
  }

  // 7. Lifestyle & Health
  if (['lifestyle', 'health', 'food', 'travel', 'fashion', 'recipe', 'fitness', 'yoga', 'ayurveda', 'culture', 'લાઇફસ્ટાઇલ', 'આરોગ્ય'].some((k) => catSlug.includes(k) || catName.includes(k) || catGu.includes(k) || title.includes(k))) {
    return 'lifestyle';
  }

  // 8. Editorial & Opinion
  if (['editorial', 'opinion', 'column', 'analysis', 'columnist', 'તંત્રીલેખ', 'અભિપ્રાય'].some((k) => catSlug.includes(k) || catName.includes(k) || catGu.includes(k) || title.includes(k))) {
    return 'editorial_opinion';
  }

  // 9. Photo Special
  if (['photo', 'gallery', 'picture', 'photos', 'visual', 'તસવીર', 'ફોટો'].some((k) => catSlug.includes(k) || catName.includes(k) || catGu.includes(k) || title.includes(k))) {
    return 'photo_special';
  }

  // 10. World / International
  if (['world', 'international', 'global', 'foreign', 'usa', 'uk', 'europe', 'russia', 'china', 'middle-east', 'વિશ્વ', 'વિદેશ'].some((k) => catSlug.includes(k) || catName.includes(k) || catGu.includes(k) || title.includes(k))) {
    return 'world_international';
  }

  // 11. National / India
  if (['national', 'india', 'politics', 'delhi', 'parliament', 'supreme-court', 'રાષ્ટ્રીય', 'ભારત', 'દેશ'].some((k) => catSlug.includes(k) || catName.includes(k) || catGu.includes(k) || title.includes(k))) {
    return 'national_india';
  }

  // 12. Local vs State (Location-based check)
  const loc = (article.location || '').toLowerCase();
  if (loc.includes('ahmedabad') || loc.includes('surat') || loc.includes('rajkot') || loc.includes('vadodara') || loc.includes('gandhinagar') || loc.includes('amc')) {
    return 'local_city';
  }

  if (loc.includes('gujarat') || loc.includes('saurashtra') || loc.includes('kutch') || loc.includes('mehsana') || loc.includes('bhavnagar') || loc.includes('jamnagar')) {
    return 'state_gujarat';
  }

  return 'front_page';
}

/**
 * Calculates a weighted 0-100 score for placing an article into a specific page section.
 */
export function calculateArticleScore(
  article: BroadsheetArticle,
  targetSection: PageSectionConfig,
  targetCity: string
): number {
  let score = 0;
  const primarySection = resolvePrimarySection(article);

  // 1. Primary Section Match (+40 pts)
  if (primarySection === targetSection.sectionKey) {
    score += 40;
  } else if (targetSection.sectionKey === 'front_page') {
    score += 25; // Front page welcomes high-priority stories
  }

  // 2. Keyword Match (+15 pts)
  const allText = `${article.title || ''} ${article.titleGu || ''} ${article.category?.name || ''} ${article.category?.slug || ''}`.toLowerCase();
  const keywordMatched = targetSection.categoryKeywords.some((k) => allText.includes(k.toLowerCase()));
  if (keywordMatched) {
    score += 15;
  }

  // 3. Image Presence & Quality (+15 pts)
  if (article.featuredImage && article.featuredImage.trim().length > 0) {
    score += 15;
  }

  // 4. City / Location Match (+15 pts)
  const loc = (article.location || '').toLowerCase();
  const city = targetCity.toLowerCase();
  if (targetSection.sectionKey === 'local_city' && (loc.includes(city) || loc.includes('ahmedabad') || loc.includes('surat') || loc.includes('rajkot'))) {
    score += 15;
  } else if (targetSection.sectionKey === 'state_gujarat' && (loc.includes('gujarat') || loc.includes('saurashtra') || loc.includes('kutch'))) {
    score += 15;
  } else if (targetSection.sectionKey === 'national_india' && (loc.includes('national') || loc.includes('delhi') || loc.includes('india'))) {
    score += 15;
  } else if (targetSection.sectionKey === 'world_international' && (loc.includes('international') || loc.includes('usa') || loc.includes('world'))) {
    score += 15;
  }

  // 5. Freshness / Editorial Priority Bonus (+15 pts)
  if (allText.includes('breaking') || allText.includes('તાજા') || allText.includes('મુખ્ય') || (article.score && article.score > 80)) {
    score += 15;
  } else {
    score += 8;
  }

  return Math.min(100, score);
}

/**
 * Intelligent Auto-Arrange Engine:
 * Distributes articles across enabled section pages with Cross-Page Deduplication
 * and Page Locking (skips pages where isLocked === true).
 */
export function autoArrangeEdition(
  availableArticles: BroadsheetArticle[],
  enabledPageConfigs: PageSectionConfig[],
  targetCity: string,
  targetCityGu: string,
  dateStr: string,
  existingPagesData?: EPaperPageData[]
): EPaperPageData[] {
  const resultPages: EPaperPageData[] = [];
  const assignedArticleIds = new Set<string>();

  // 1. Mark articles from locked pages as assigned so they are not repeated elsewhere
  if (existingPagesData && existingPagesData.length > 0) {
    existingPagesData.forEach((page) => {
      if (page.isLocked) {
        if (page.leadArticle?.id) assignedArticleIds.add(page.leadArticle.id);
        if (page.secondArticle?.id) assignedArticleIds.add(page.secondArticle.id);
        if (page.thirdArticle?.id) assignedArticleIds.add(page.thirdArticle.id);
        if (page.fourthArticle?.id) assignedArticleIds.add(page.fourthArticle.id);
        if (page.fifthArticle?.id) assignedArticleIds.add(page.fifthArticle.id);
        if (page.sixthArticle?.id) assignedArticleIds.add(page.sixthArticle.id);
        if (page.seventhArticle?.id) assignedArticleIds.add(page.seventhArticle.id);
        (page.gridArticles || []).forEach((a) => a.id && assignedArticleIds.add(a.id));
        (page.sideArticles || []).forEach((a) => a.id && assignedArticleIds.add(a.id));
        (page.bottomArticles || []).forEach((a) => a.id && assignedArticleIds.add(a.id));
      }
    });
  }

  // Clone pool of available articles
  const unassignedPool = [...availableArticles];

  // Helper to pick top scored article
  const pickTopArticle = (section: PageSectionConfig, minScore: number = 20): BroadsheetArticle | null => {
    let bestArt: BroadsheetArticle | null = null;
    let bestScore = -1;
    let bestIdx = -1;

    for (let i = 0; i < unassignedPool.length; i++) {
      const art = unassignedPool[i];
      if (!art.allowDuplicate && assignedArticleIds.has(art.id)) continue;

      const sc = calculateArticleScore(art, section, targetCity);
      if (sc > bestScore && sc >= minScore) {
        bestScore = sc;
        bestArt = art;
        bestIdx = i;
      }
    }

    if (bestArt && bestIdx !== -1) {
      if (!bestArt.allowDuplicate) {
        assignedArticleIds.add(bestArt.id);
        unassignedPool.splice(bestIdx, 1);
      }
      return bestArt;
    }

    return null;
  };

  for (const pageConfig of enabledPageConfigs) {
    // If this page was previously locked, preserve existing data
    const existing = existingPagesData?.find((p) => p.pageNumber === pageConfig.pageNumber);
    if (existing && existing.isLocked) {
      resultPages.push(existing);
      continue;
    }

    // 1. Lead Story (Hero)
    const leadArt = pickTopArticle(pageConfig, 30);

    // 2. Secondary Stories (2 slots)
    const secondArt = pickTopArticle(pageConfig, 25);
    const thirdArt = pickTopArticle(pageConfig, 25);

    // 3. Editorial Rows / Standard Slots
    const fourthArt = pickTopArticle(pageConfig, 15);
    const fifthArt = pickTopArticle(pageConfig, 15);
    const sixthArt = pickTopArticle(pageConfig, 15);
    const seventhArt = pickTopArticle(pageConfig, 15);
    const eighthArt = pickTopArticle(pageConfig, 15);

    // 4. Grid Articles (3 slots)
    const gridArts: BroadsheetArticle[] = [];
    for (let g = 0; g < 3; g++) {
      const gArt = pickTopArticle(pageConfig, 10);
      if (gArt) gridArts.push(gArt);
    }

    // 5. Side Articles (up to 6)
    const sideArts: BroadsheetArticle[] = [];
    for (let s = 0; s < 6; s++) {
      const sArt = pickTopArticle(pageConfig, 10);
      if (sArt) sideArts.push(sArt);
    }

    // 6. Bottom Articles (up to 4)
    const bottomArts: BroadsheetArticle[] = [];
    for (let b = 0; b < 4; b++) {
      const bArt = pickTopArticle(pageConfig, 10);
      if (bArt) bottomArts.push(bArt);
    }

    resultPages.push({
      pageNumber: pageConfig.pageNumber,
      totalPages: enabledPageConfigs.length,
      city: targetCity,
      cityGu: targetCityGu,
      date: dateStr,
      pageTitle: `${pageConfig.titleGu} (${pageConfig.titleEn})`,
      sectionKey: pageConfig.sectionKey,
      templateId: pageConfig.defaultTemplateId,
      isLocked: false,
      leadArticle: leadArt,
      secondArticle: secondArt,
      thirdArticle: thirdArt,
      fourthArticle: fourthArt,
      fifthArticle: fifthArt,
      sixthArticle: sixthArt,
      seventhArticle: seventhArt,
      eighthArticle: eighthArt,
      gridArticles: gridArts,
      sideArticles: sideArts,
      bottomArticles: bottomArts,
    });
  }

  return resultPages;
}

/**
 * Pre-Flight "Validate Edition" Engine:
 * Returns an automated readiness report and score (0-100) before compiling PDF.
 * Applies template-specific rules.
 */
export interface ValidationReport {
  score: number;
  isReady: boolean;
  issues: string[];
  warnings: string[];
  passedChecks: string[];
}

export function validateEdition(
  pages: EPaperPageData[],
  targetCity: string
): ValidationReport {
  const issues: string[] = [];
  const warnings: string[] = [];
  const passedChecks: string[] = [];
  let score = 100;

  if (!pages || pages.length === 0) {
    return {
      score: 0,
      isReady: false,
      issues: ['No active pages configured in edition.'],
      warnings: [],
      passedChecks: [],
    };
  }

  const seenIds = new Map<string, number>();

  pages.forEach((page) => {
    const pNum = page.pageNumber;
    const templateId = page.templateId || '';

    // Template-specific validation checks
    if (templateId === 'EditorialTemplate' || pNum === 13) {
      // Editorial page: requires editorial column
      if (!page.leadArticle && !page.secondArticle) {
        issues.push(`Page ${pNum} (Editorial): Missing required Chief Editorial or Guest Column.`);
        score -= 15;
      } else {
        passedChecks.push(`Page ${pNum} (Editorial): Editorial column present.`);
      }
    } else if (templateId === 'PhotoTemplate' || pNum === 14) {
      // Photo page: requires hero photo
      if (!page.leadArticle?.featuredImage) {
        issues.push(`Page ${pNum} (Photo Special): Missing required Photo of the Day image.`);
        score -= 15;
      } else {
        passedChecks.push(`Page ${pNum} (Photo Special): Photo of the Day showcase present.`);
      }
    } else {
      // Standard news pages: require Lead Headline Story
      if (!page.leadArticle) {
        issues.push(`Page ${pNum} (${page.pageTitle || 'Section'}): Missing required Lead Headline Story.`);
        score -= 15;
      } else {
        passedChecks.push(`Page ${pNum}: Lead Headline present.`);
        if (!page.leadArticle.featuredImage) {
          warnings.push(`Page ${pNum}: Lead story has no featured photograph.`);
          score -= 5;
        }
      }
    }

    // Minimum story density check
    let storyCount = 0;
    if (page.leadArticle) storyCount++;
    if (page.secondArticle) storyCount++;
    if (page.thirdArticle) storyCount++;
    if (page.fourthArticle) storyCount++;
    if (page.fifthArticle) storyCount++;
    storyCount += (page.gridArticles || []).length;
    storyCount += (page.sideArticles || []).length;
    storyCount += (page.bottomArticles || []).length;

    if (storyCount < 3) {
      warnings.push(`Page ${pNum}: Low story density (${storyCount} stories). Recommend adding more articles.`);
      score -= 5;
    } else {
      passedChecks.push(`Page ${pNum}: Healthy content density (${storyCount} stories).`);
    }

    // Duplicate detection across pages (unless allowDuplicate is true)
    const checkDuplicate = (art?: BroadsheetArticle | null) => {
      if (!art?.id || art.allowDuplicate) return;
      if (seenIds.has(art.id)) {
        issues.push(`Duplicate article found: "${(art.titleGu || art.title).slice(0, 25)}..." appears on Page ${seenIds.get(art.id)} and Page ${pNum}.`);
        score -= 10;
      } else {
        seenIds.set(art.id, pNum);
      }
    };

    checkDuplicate(page.leadArticle);
    checkDuplicate(page.secondArticle);
    checkDuplicate(page.thirdArticle);
    checkDuplicate(page.fourthArticle);
    checkDuplicate(page.fifthArticle);
    (page.gridArticles || []).forEach(checkDuplicate);
    (page.sideArticles || []).forEach(checkDuplicate);
    (page.bottomArticles || []).forEach(checkDuplicate);
  });

  score = Math.max(0, Math.min(100, score));
  const isReady = issues.length === 0 && score >= 70;

  return {
    score,
    isReady,
    issues,
    warnings,
    passedChecks,
  };
}
