import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';

// Helper to generate clean SEO metadata fallback if AI keys fail or timeout
function generateFallbackSeo(title: string, categoryName: string, location: string) {
  const promptTitle = title.trim();
  const promptCat = categoryName ? categoryName.trim() : 'News';
  const promptLoc = location ? location.trim() : 'Gujarat';
  const brandSuffix = 'gujaratpost news';

  let seoTitle = promptTitle;
  if (promptLoc && !seoTitle.toLowerCase().includes(promptLoc.toLowerCase())) {
    seoTitle += ` in ${promptLoc}`;
  }
  if (!seoTitle.toLowerCase().includes(brandSuffix)) {
    seoTitle += ` ${brandSuffix}`;
  }

  let seoDescription = promptTitle;
  if (promptLoc && !seoDescription.toLowerCase().includes(promptLoc.toLowerCase())) {
    seoDescription += ` in ${promptLoc}`;
  }
  if (!seoDescription.toLowerCase().includes(brandSuffix)) {
    seoDescription += ` ${brandSuffix}`;
  }

  const keywords = [
    `${promptLoc.toLowerCase()} news`,
    `${promptCat.toLowerCase()} news`,
    `${promptTitle.slice(0, 45)}`,
    'gujarat news',
    'gujaratpost news',
    'gujarat post'
  ];

  const tags = [
    promptCat.toLowerCase(),
    promptLoc.toLowerCase(),
    'gujarat',
    'gujaratpost'
  ];

  return {
    seoTitle,
    seoDescription,
    seoKeywords: Array.from(new Set(keywords)).join(', '),
    tags: Array.from(new Set(tags)).join(', ')
  };
}

// Call Google Gemini API with Timeout & Markdown Cleanup
async function callGeminiApi(apiKey: string, promptTitle: string, promptCat: string, promptLoc: string, promptSnippet: string) {
  const models = ['gemini-3.6-flash', 'gemini-2.0-flash', 'gemini-2.5-flash'];
  const promptText = `You are a professional SEO expert for Gujarat Post (gujaratpost.in), a top news media portal in Gujarat, India.
Generate high-ranking bilingual (English & Gujarati) SEO metadata for the following article:

Article Title: "${promptTitle}"
Category: "${promptCat}"
Location: "${promptLoc}"
Snippet: "${promptSnippet}"

You must return a JSON object with exact 4 keys:
1. "seoTitle": High CTR headline ending with "gujaratpost news"
2. "seoDescription": Meta description (120-160 chars) summarizing key story ending with "gujaratpost news"
3. "seoKeywords": Comma-separated list of 8-12 high-volume search phrases in English and Gujarati (e.g., ahmedabad murder news, ahmedabad police, crime news, gujarat news, gujaratpost news)
4. "tags": Comma-separated list of 6-10 clean single-word or short tags in English and Gujarati (e.g. murder, crime, police, ahmedabad, gujarat, મર્ડર, ક્રાઇમ, અમદાવાદ) - DO NOT include stop words like "જેટલા" or "એક".`;

  let lastError: any = null;

  for (const model of models) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.3,
          },
        }),
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errText = await res.text();
        lastError = new Error(`Gemini API Error (${res.status}): ${errText}`);
        continue;
      }

      const json: any = await res.json();
      const textStr = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textStr) continue;

      const cleanText = textStr.replace(/^```json\s*/gi, '').replace(/\s*```$/gi, '').trim();
      return JSON.parse(cleanText);
    } catch (err: any) {
      lastError = err;
    }
  }

  throw lastError || new Error('Failed to generate content with Google Gemini API.');
}

export class AiController {
  /**
   * Generate high-ranking bilingual SEO metadata using Google Gemini AI (100% FREE).
   * Guarantees HTTP 200 output with zero socket hang ups.
   */
  static async generateSeo(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, categoryName, location, content } = req.body || {};

      if (!title || typeof title !== 'string' || !title.trim()) {
        return sendError(res, 'Article title is required to generate SEO metadata.', 400);
      }

      const geminiApiKey = process.env.GEMINI_API_KEY || '';
      const promptTitle = title.trim();
      const promptCat = categoryName ? String(categoryName).trim() : 'News';
      const promptLoc = location ? String(location).trim() : 'Gujarat';
      const promptSnippet = content ? String(content).slice(0, 300).trim() : '';

      if (!geminiApiKey) {
        const fallbackData = generateFallbackSeo(promptTitle, promptCat, promptLoc);
        return sendSuccess(res, fallbackData, 'SEO details generated successfully.');
      }

      try {
        const parsed = await callGeminiApi(geminiApiKey, promptTitle, promptCat, promptLoc, promptSnippet);
        return sendSuccess(
          res,
          {
            seoTitle: parsed.seoTitle || `${promptTitle} gujaratpost news`,
            seoDescription: parsed.seoDescription || `${promptTitle} in ${promptLoc} gujaratpost news`,
            seoKeywords: parsed.seoKeywords || `${promptTitle}, ${promptLoc} news, gujaratpost news`,
            tags: parsed.tags || `${promptCat}, ${promptLoc}, gujaratpost`,
            provider: 'Google Gemini AI',
          },
          'AI SEO details generated successfully with Google Gemini AI.'
        );
      } catch (geminiErr: any) {
        console.warn('[Gemini AI Auto-Recovered Notice]:', geminiErr?.message || geminiErr);
        const fallbackData = generateFallbackSeo(promptTitle, promptCat, promptLoc);
        return sendSuccess(res, fallbackData, 'SEO details generated successfully.');
      }
    } catch (error: any) {
      console.warn('[AiController.generateSeo Emergency Catch]:', error?.message || error);
      const { title, categoryName, location } = req.body || {};
      const fallbackData = generateFallbackSeo(title || 'News', categoryName || 'News', location || 'Gujarat');
      return sendSuccess(res, fallbackData, 'SEO details generated successfully.');
    }
  }
}
