'use client';

import React from 'react';
import { EPaperPageData, getCleanText, formatGujaratiDate, BroadsheetArticle } from '../types';
import { Heart, Activity, Sun, Utensils, Home, Smile, Sparkles, Coffee, ShieldCheck, Flame, CheckCircle2, Newspaper } from 'lucide-react';

interface TemplateProps {
  data: EPaperPageData;
}

const cleanHeadline = (text?: string) => {
  if (!text) return '';
  return text.replace(/^#\d+\s*[-–—:]\s*/, '').trim();
};

export const LifestyleTemplate: React.FC<TemplateProps> = ({ data }) => {
  const {
    pageNumber = 10,
    totalPages = 14,
    city = 'Ahmedabad',
    cityGu = 'અમદાવાદ',
    date = '',
    leadArticle,
    secondArticle,
    thirdArticle,
    fourthArticle,
    fifthArticle,
    sixthArticle,
    seventhArticle,
    eighthArticle,
    ninthArticle,
    tenthArticle,
    eleventhArticle,
    twelfthArticle,
    thirteenthArticle,
    fourteenthArticle,
    fifteenthArticle,
    sixteenthArticle,
    seventeenthArticle,
    sideArticles = [],
    bottomArticles = [],
    gridArticles = [],
  } = data;

  const displayCity = cityGu || city;
  const gujaratiDateStr = formatGujaratiDate(date) || 'શનિવાર, ૫ સપ્ટેમ્બર, ૨૦૨૬';

  const pool = [
    secondArticle,
    thirdArticle,
    fourthArticle,
    fifthArticle,
    sixthArticle,
    seventhArticle,
    eighthArticle,
    ninthArticle,
    tenthArticle,
    eleventhArticle,
    twelfthArticle,
    thirteenthArticle,
    fourteenthArticle,
    fifteenthArticle,
    sixteenthArticle,
    seventeenthArticle,
    ...gridArticles,
    ...sideArticles,
    ...bottomArticles,
  ].filter(Boolean) as BroadsheetArticle[];

  // 1. Daily Wellness Strip
  const wellnessIndices = [
    { label: 'આજનો યોગાસન', val: 'સૂર્ય નમસ્કાર (૧૨ ચક્ર)', sub: 'શરીરમાં ઊર્જા સંચાર' },
    { label: 'સુપરફૂડ ઓફ ધ ડે', val: 'આમળા & હળદર જ્યુસ', sub: 'રોગપ્રતિકારક શક્તિ' },
    { label: 'જળ સંતુલન (Hydration)', val: 'દરરોજ ૩ લિટર પાણી', sub: 'ટોક્સિન્સ મુક્તિ' },
    { label: 'માનસિક શાંતિ મંત્ર', val: '૧૫ મિનિટ ધ્યાન', sub: 'તનાવ મુક્તિ માટે' },
  ];

  // 2. Lead Ayurveda Story
  const leadHeadline = cleanHeadline(
    leadArticle?.printHeadline ||
    leadArticle?.titleGu ||
    leadArticle?.title ||
    'આયુર્વેદ અને હોલિસ્ટિક લિવિંગ: બદલાતી ઋતુમાં રોગપ્રતિકારક શક્તિ વધારવા અને દીર્ઘાયુષ્ય માટે સુવર્ણ સ્વાસ્થ્ય નિયમો'
  );

  const leadImage =
    leadArticle?.featuredImage ||
    'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop&q=80';

  const leadCaption =
    leadArticle?.photoCredit || 'તસવીર: ગુજરાત પોસ્ટ વેલનેસ • પ્રાકૃતિક ચિકિત્સા કેન્દ્ર ખાતે આયુર્વેદિક ઉપચાર અને યોગાભ્યાસ';

  const leadSummary =
    leadArticle?.printSummary ||
    getCleanText(
      leadArticle?.excerptGu ||
        leadArticle?.excerpt ||
        leadArticle?.contentGu ||
        leadArticle?.content ||
        'આધુનિક દોડધામભરી જીવનશૈલીમાં શારીરિક અને માનસિક સંતુલન જાળવવું એ સૌથી મોટો પડકાર છે. આયુર્વેદના પ્રાચીન સિદ્ધાંતો અનુસાર દિનચર્યા અને ઋતુચર્યાનું પાલન કરવાથી અનેક બીમારીઓથી કુદરતી રક્ષણ મળે છે. તાજો સાત્વિક આહાર અને યોગ જીવનમાં ઉત્સાહ ભરે છે.',
      280
    );

  const leadSecondParagraph = getCleanText(
    leadArticle?.contentGu ||
      leadArticle?.content ||
      'આયુષ મંત્રાલય દ્વારા પ્રમોટ કરાતા મિલેટ્સ (શ્રી અન્ન), ગિલોય, અશ્વગંધા અને ત્રિફળા જેવા ઔષધીય ઘટકોનું નિયમિત સેવન પાચનતંત્ર મજબૂત બનાવે છે અને જીવનશૈલી સંબંધિત રોગો સામે રક્ષણ આપે છે.',
    260
  );

  const leadLocation = leadArticle?.location || 'અમદાવાદ';

  // 3. 7 Fast Wellness Bulletins (Right 4 cols)
  const wellnessBulletin = [
    { title: cleanHeadline(pool[0]?.printHeadline || pool[0]?.titleGu) || 'મિલેટ્સ (શ્રી અન્ન): ડાયાબિટીસ અને બ્લડ પ્રેશર નિયંત્રણમાં શ્રેષ્ઠ સાબિત', time: '૦૭:૩૦ AM', cat: 'આહાર' },
    { title: cleanHeadline(pool[1]?.printHeadline || pool[1]?.titleGu) || 'પ્રાણાયામના ચમત્કાર: ફેફસાની ક્ષમતા વધારવા અનુલોમ-વિલોમ લાભદાયી', time: '૦૮:૪૫ AM', cat: 'યોગ' },
    { title: cleanHeadline(pool[2]?.printHeadline || pool[2]?.titleGu) || 'હાઈડ્રેશન ગાઇડ: હૂંફાળું પાણી અને હર્બલ ટી પીવાથી ત્વચામાં ચમક', time: '૧૦:૧૫ AM', cat: 'બ્યુટી' },
    { title: cleanHeadline(pool[3]?.printHeadline || pool[3]?.titleGu) || 'ડિજિટલ ડિટોક્સ: સૂવાના ૧ કલાક પહેલા સ્ક્રીન ટાઇમ બંધ રાખવાના ફાયદા', time: '૧૨:૩૦ PM', cat: 'સ્લીપ' },
    { title: cleanHeadline(pool[4]?.printHeadline || pool[4]?.titleGu) || 'ગાર્ડનિંગ થેરાપી: ઘરમાં ઈન્ડોર પ્લાન્ટ્સ રાખવાથી માનસિક તનાવમાં ઘટાડો', time: '૦૨:૪૫ PM', cat: 'પર્યાવરણ' },
    { title: cleanHeadline(pool[5]?.printHeadline || pool[5]?.titleGu) || 'આયુર્વેદિક તેલ માલિશ (અભ્યંગ): સાંધાના દુખાવામાં કુદરતી રાહત', time: '૦૪:૩૦ PM', cat: 'ઉપચાર' },
    { title: cleanHeadline(pool[6]?.printHeadline || pool[6]?.titleGu) || 'માનસિક સ્વાસ્થ્ય સેમિનાર: પોઝિટિવ થિંકિંગ અને મેડિટેશન વર્કશોપ', time: '૦૬:૦૦ PM', cat: 'વેલનેસ' },
  ];

  // 4. Secondary Lifestyle Stories (2 prominent stories with photos)
  const secLife1 = {
    title: cleanHeadline(pool[7]?.printHeadline || pool[7]?.titleGu) || 'સુપરફૂડ્સ અને પૌષ્ટિક આહાર: શરીરને કુદરતી ઊર્જા આપવા માટે અંકુરિત કઠોળ અને સુકામેવાનો પ્રયોગ',
    image: pool[7]?.featuredImage || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[7]?.excerptGu || pool[7]?.contentGu || 'વિટામિન્સ, મિનરલ્સ અને એન્ટી-ઓક્સિડન્ટ્સથી ભરપૂર આહાર લેવાથી હૃદય રોગ અને કોલેસ્ટ્રોલનું જોખમ ઘટે છે. ઓર્ગેનિક ખેતી ઉત્પાદનોની માંગ વધી છે.', 240),
    tag: 'ન્યુટ્રિશન ગાઇડ',
    byline: 'ડાયેટિશિયન બ્યુરો',
    art: pool[7]
  };

  const secLife2 = {
    title: cleanHeadline(pool[8]?.printHeadline || pool[8]?.titleGu) || 'ઈકો-ફ્રેન્ડલી હોમ ડેકોર: માટીના વાસણો, કુદરતી કાપડ અને પ્લાન્ટ્સ સાથે ઘરને સજાવવાનો ટ્રેન્ડ',
    image: pool[8]?.featuredImage || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[8]?.excerptGu || pool[8]?.contentGu || 'પ્લાસ્ટિક મુક્ત ઘરમાં કુદરતી વેન્ટિલેશન અને હરિયાળી વધારવાથી સકારાત્મક ઊર્જાનો સંચાર થાય છે. ટકાઉ જીવનશૈલીનો નવો પ્રવાહ.', 240),
    tag: 'હોમ & લિવિંગ',
    byline: 'ઇન્ટિરિયર ડેસ્ક',
    art: pool[8]
  };

  // 5. Special In-Depth Spotlight (2 Ground Reports with Photos)
  const spotLife1 = {
    title: cleanHeadline(pool[9]?.printHeadline || pool[9]?.titleGu) || 'ઓર્ગેનિક & મિલેટ્સ રિવોલ્યુશન: ગુજરાતમાં પ્રાકૃતિક ખેતી કરતા ૫ લાખથી વધુ ખેડૂતોનું સન્માન',
    image: pool[9]?.featuredImage || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[9]?.excerptGu || pool[9]?.contentGu || 'કેમિકલ મુક્ત પ્રાકૃતિક ખેતી દ્વારા ઉત્પન્ન થયેલા અનાજ અને શાકભાજીની શહેરોમાં સીધી ખરીદી માટે વિશેષ ફાર્મર્સ માર્કેટ્સ શરૂ કરાયા.', 240),
    badge: 'વિશેષ રિપોર્ટ',
    category: 'પ્રાકૃતિક ખેતી',
    byline: 'કૃષિ-વેલનેસ ડેસ્ક',
    art: pool[9]
  };

  const spotLife2 = {
    title: cleanHeadline(pool[10]?.printHeadline || pool[10]?.titleGu) || 'મેન્ટલ વેલનેસ & માઇન્ડફુલનેસ: વર્કપ્લેસ સ્ટ્રેસ મેનેજમેન્ટ માટે કોર્પોરેટ યોગા સત્રો',
    image: pool[10]?.featuredImage || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[10]?.excerptGu || pool[10]?.contentGu || 'કર્મચારીઓના માનસિક સ્વાસ્થ્ય માટે નિયમિત બ્રેક્સ, બ્રીધિંગ એક્સરસાઇઝ અને કાઉન્સેલિંગ સેશન્સથી કાર્યક્ષમતામાં ૨૫% વધારો નોંધાયો.', 240),
    badge: 'માનસિક સ્વાસ્થ્ય',
    category: 'માઇન્ડફુલનેસ',
    byline: 'વેલનેસ કાઉન્સિલર',
    art: pool[10]
  };

  // 6. 4-Wellness Domain Matrix with photos
  const ayurvedaYogaDomain = {
    title: 'આયુર્વેદ & યોગ',
    img: pool[11]?.featuredImage || 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'દિનચર્યા', title: cleanHeadline(pool[11]?.printHeadline || pool[11]?.titleGu) || 'બ્રાહ્મ મુહૂર્તમાં જાગવાના વૈજ્ઞાનિક ફાયદા અને ઊર્જા' },
      { loc: 'પંચકર્મ', title: cleanHeadline(pool[12]?.printHeadline || pool[12]?.titleGu) || 'શરીરના ઝેરી તત્વો બહાર કાઢવા પંચકર્મ ઉપચાર કેન્દ્ર' },
      { loc: 'આસનો', title: cleanHeadline(pool[13]?.printHeadline || pool[13]?.titleGu) || 'કરોડરજ્જુ મજબૂત કરવા ભુજંગાસન અને તાડાસન' },
    ]
  };

  const nutritionDietDomain = {
    title: 'ન્યુટ્રિશન & ડાયેટ',
    img: pool[14]?.featuredImage || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'શ્રી અન્ન', title: cleanHeadline(pool[14]?.printHeadline || pool[14]?.titleGu) || 'રાગી અને જુવારના રોટલા પાચનતંત્ર માટે સર્વોત્તમ' },
      { loc: 'પ્રોટીન', title: cleanHeadline(pool[15]?.printHeadline || pool[15]?.titleGu) || 'શાકાહારી આહારમાં પનીર, ટોફુ અને કઠોળનું સંતુલન' },
      { loc: 'હર્બલ ડ્રિંક્સ', title: cleanHeadline(pool[16]?.printHeadline || pool[16]?.titleGu) || 'તુલસી-આદુ કાઢો શરદી અને ફ્લૂ સામે રામબાણ ઈલાજ' },
    ]
  };

  const mentalHealthDomain = {
    title: 'માનસિક શાંતિ & ધ્યાન',
    img: pool[17]?.featuredImage || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'ધ્યાન', title: cleanHeadline(pool[17]?.printHeadline || pool[17]?.titleGu) || 'વિપશ્યના ધ્યાન પદ્ધતિથી આંતરિક શાંતિની અનુભૂતિ' },
      { loc: 'ઊંઘ', title: cleanHeadline(pool[18]?.printHeadline || pool[18]?.titleGu) || 'ઊંઘની ગુણવત્તા સુધારવા માટે યોગ નિદ્રાનો પ્રયોગ' },
      { loc: 'સ્ટ્રેસ', title: cleanHeadline(pool[19]?.printHeadline || pool[19]?.titleGu) || 'સકારાત્મક સંગીત અને પ્રકૃતિ સાથે સમય વિતાવવો' },
    ]
  };

  const homeLivingDomain = {
    title: 'હોમ & ઈકો લિવિંગ',
    img: pool[20]?.featuredImage || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'હર્બલ ગાર્ડન', title: cleanHeadline(pool[20]?.printHeadline || pool[20]?.titleGu) || 'બાલ્કનીમાં તુલસી, એલોવેરા અને ફુદીનો ઉગાડવાની ટિપ્સ' },
      { loc: 'માટીના વાસણ', title: cleanHeadline(pool[21]?.printHeadline || pool[21]?.titleGu) || 'માટીની હાંડલીમાં રસોઈ બનાવવાથી પોષક તત્વો જળવાય' },
      { loc: 'ગ્રીન એનર્જી', title: cleanHeadline(pool[22]?.printHeadline || pool[22]?.titleGu) || 'ઘરમાં સોલાર વોટર હીટર અને LED લાઇટ્સથી બચત' },
    ]
  };

  // 7. 8 Health & Living Habits Grid (2 rows of 4 cols with photos)
  const lifestyleGridStories = [
    {
      theme: 'ડિટોક્સ વોટર',
      title: cleanHeadline(pool[23]?.printHeadline || pool[23]?.titleGu) || 'લીંબુ, કાકડી અને ફુદીના સાથે ઘરગથ્થુ ડિટોક્સ ડ્રિંક',
      summary: getCleanText(pool[23]?.excerptGu || pool[23]?.contentGu || 'શરીરનું મેટાબોલિઝમ સુધારવા અને વજન નિયંત્રિત રાખવા ઉત્તમ ઉપાય.', 60),
      image: pool[23]?.featuredImage || 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=300&auto=format&fit=crop&q=80',
    },
    {
      theme: 'ઓર્ગેનિક હર્બ્સ',
      title: cleanHeadline(pool[24]?.printHeadline || pool[24]?.titleGu) || 'અશ્વગંધા અને શતાવરી: ઊર્જા અને સ્ટેમિના વધારતા ઔષધ',
      summary: getCleanText(pool[24]?.excerptGu || pool[24]?.contentGu || 'રોજિંદા દૂધ સાથે સેવન કરવાથી રોગપ્રતિકારક શક્તિ બમણી થાય છે.', 60),
      image: pool[24]?.featuredImage || 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=300&auto=format&fit=crop&q=80',
    },
    {
      theme: 'ઈન્ડોર પ્લાન્ટ્સ',
      title: cleanHeadline(pool[25]?.printHeadline || pool[25]?.titleGu) || 'સ્નેક પ્લાન્ટ અને એરિકા પામ: ઘરની હવા શુદ્ધ રાખે છે',
      summary: getCleanText(pool[25]?.excerptGu || pool[25]?.contentGu || 'ઓક્સિજનનું પ્રમાણ વધારે છે અને હાનિકારક વાયુઓનું શોષણ કરે છે.', 60),
      image: pool[25]?.featuredImage || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&auto=format&fit=crop&q=80',
    },
    {
      theme: 'સંતુલિત આહાર',
      title: cleanHeadline(pool[26]?.printHeadline || pool[26]?.titleGu) || 'રેઇનબો ડાયેટ: વિવિધ રંગોના શાકભાજી અને ફળોના ફાયદા',
      summary: getCleanText(pool[26]?.excerptGu || pool[26]?.contentGu || 'તમામ પ્રકારના વિટામિન્સ અને મિનરલ્સ મેળવવા માટે ઉત્તમ આહાર પદ્ધતિ.', 60),
      image: pool[26]?.featuredImage || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300&auto=format&fit=crop&q=80',
    },
    {
      theme: 'હૃદય આરોગ્ય',
      title: cleanHeadline(pool[27]?.printHeadline || pool[27]?.titleGu) || 'દરરોજ ૪૫ મિનિટ મોર્નિંગ વોકથી હાર્ટ એટેકનું જોખમ ૫૦% ઘટે',
      summary: getCleanText(pool[27]?.excerptGu || pool[27]?.contentGu || 'હળવી કસરત અને શુદ્ધ હવામાં શ્વાસ લેવાથી રક્ત પરિભ્રમણ સુધરે છે.', 60),
      image: pool[27]?.featuredImage || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&auto=format&fit=crop&q=80',
    },
    {
      theme: 'ઓર્ગેનિક તેલ',
      title: cleanHeadline(pool[28]?.printHeadline || pool[28]?.titleGu) || 'લાકડાની ઘાણીનું શુદ્ધ તલ અને મગફળીનું તેલ આરોગ્યવર્ધક',
      summary: getCleanText(pool[28]?.excerptGu || pool[28]?.contentGu || 'કોલ્ડ પ્રેસ્ડ તેલમાં કુદરતી એન્ટીઓક્સિડન્ટ્સ અને વિટામિન E અકબંધ રહે છે.', 60),
      image: pool[28]?.featuredImage || 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&auto=format&fit=crop&q=80',
    },
    {
      theme: 'સ્કિન કેર',
      title: cleanHeadline(pool[29]?.printHeadline || pool[29]?.titleGu) || 'ચણાનો લોટ, હળદર અને ગુલાબજળથી નેચરલ ફેસ ગ્લો',
      summary: getCleanText(pool[29]?.excerptGu || pool[29]?.contentGu || 'કેમિકલ યુક્ત કોસ્મેટિક્સ છોડી કુદરતી ઉપચાર અપનાવવાનો ટ્રેન્ડ.', 60),
      image: pool[29]?.featuredImage || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&auto=format&fit=crop&q=80',
    },
    {
      theme: 'માઇન્ડફુલ લિવિંગ',
      title: cleanHeadline(pool[30]?.printHeadline || pool[30]?.titleGu) || 'રોજિંદા જીવનમાં કૃતજ્ઞતા અને સકારાત્મક વલણ કેળવવાની કળા',
      summary: getCleanText(pool[30]?.excerptGu || pool[30]?.contentGu || 'માનસિક શાંતિ અને પારિવારિક સુખ માટે માઇન્ડફુલનેસ અભ્યાસ જરૂરી.', 60),
      image: pool[30]?.featuredImage || 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=300&auto=format&fit=crop&q=80',
    },
  ];

  // 8. Life Hacks Briefs (6 columns)
  const lifestylePulseBriefs = [
    { label: 'યોગાભ્યાસ', text: 'દરરોજ સવારે ૨૦ મિનિટ પ્રાણાયામથી રોગપ્રતિકારક શક્તિ સુધરે છે.', ref: 'આયુષ વિંગ' },
    { label: 'સુપાચ્ય આહાર', text: 'સાંજે ૭ વાગ્યા પહેલા હળવું ભોજન લેવાથી પાચનતંત્ર તંદુરસ્ત રહે છે.', ref: 'ન્યુટ્રિશન' },
    { label: 'હર્બલ ટી', text: 'ગ્રીન ટી અને તુલસી અર્ક એન્ટી-ઓક્સિડન્ટ્સનો શ્રેષ્ઠ સ્ત્રોત.', ref: 'હર્બલ કેર' },
    { label: 'પૂરતી ઊંઘ', text: 'સ્વસ્થ શરીર અને મન માટે દૈનિક ૭ થી ૮ કલાકની ગાઢ ઊંઘ અનિવાર્ય.', ref: 'સ્લીપ સાયન્સ' },
    { label: 'પ્રાકૃતિક ખેતી', text: 'રાજ્યમાં ઓર્ગેનિક શાકભાજી વેચાણ કેન્દ્રો ૧૫૦ નવી જગ્યાએ શરૂ.', ref: 'કૃષિ બોર્ડ' },
    { label: 'મેડિટેશન', text: 'તાણમુક્ત જીવન માટે દૈનિક ધ્યાન કેન્દ્રો પર નિઃશુલ્ક શિબિરો.', ref: 'વેલનેસ સેન્ટર' },
  ];

  return (
    <div className="h-full flex flex-col p-2 bg-white border-[3px] border-slate-900 box-border text-slate-900 font-sans select-none overflow-hidden space-y-0.5 justify-between">
      {/* ==================== 1. LIFESTYLE RUNNING HEADER & FOLIO ==================== */}
      <header className="shrink-0">
        <div className="flex items-center justify-between text-[7.5px] font-bold text-slate-800 border-b border-slate-300 pb-0.5 mb-0.5">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-950 uppercase">ગુજરાત પોસ્ટ</span>
            <span className="text-slate-400">•</span>
            <span className="text-[#B3121B] font-black uppercase">આરોગ્ય, લાઈફસ્ટાઇલ & વેલનેસ</span>
            <span className="text-slate-400">•</span>
            <span>{gujaratiDateStr}</span>
          </div>
          <div className="flex items-center gap-2 font-extrabold">
            <span>લાઈફસ્ટાઇલ ડેસ્ક</span>
            <span>•</span>
            <span className="bg-[#B3121B] text-white px-1.5 py-0.2 rounded-xs text-[7px] font-black uppercase">
              પાનું ૧૦ / ૧૪
            </span>
            <span>•</span>
            <span>₹ ૧૫.૦૦</span>
          </div>
        </div>

        {/* Section Masthead Banner */}
        <div className="bg-slate-950 text-white px-2 py-0.5 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[8.5px] font-black uppercase tracking-wider rounded-xs flex items-center gap-1">
              <Heart className="h-2.5 w-2.5" />
              <span>આરોગ્ય દર્પણ • HOLISTIC WELLNESS & LIFESTYLE</span>
            </span>
            <span className="text-slate-300 text-[8px] font-bold truncate">
              આયુર્વેદ, યોગ, ઓર્ગેનિક આહાર, હોમ ડેકોર, માનસિક શાંતિ અને ફિટનેસ ગાઇડ
            </span>
          </div>
          <div className="flex items-center gap-1 text-amber-300 text-[7.5px] font-extrabold shrink-0">
            <Sparkles className="h-2.5 w-2.5" />
            <span>વેલનેસ & હેલ્થ બ્યુરો</span>
          </div>
        </div>

        {/* Daily Wellness Ticker Ribbon */}
        <div className="grid grid-cols-4 gap-1 bg-slate-100 border-x border-b border-slate-300 p-0.5 text-[6.8px] font-bold text-slate-700">
          {wellnessIndices.map((w, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-0.5 flex flex-col justify-between">
              <span className="text-slate-500 font-extrabold truncate">{w.label}</span>
              <span className="text-[7.5px] font-black text-slate-950 truncate">{w.val}</span>
              <span className="text-[5.8px] font-bold text-emerald-700">{w.sub}</span>
            </div>
          ))}
        </div>
      </header>

      {/* ==================== 2. UPPER LIFESTYLE GRID (8 COLS LEAD + 4 COLS BULLETIN) ==================== */}
      <section className="grid grid-cols-12 gap-2 border-b-2 border-slate-900 pb-1 pt-0.5 shrink-0 items-stretch">
        {/* Left 8 Columns: Dominant Lead Ayurveda Story */}
        <div className="col-span-8 border-r-2 border-slate-900 pr-2 space-y-0.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[7px] font-bold text-slate-600 mb-0.2">
              <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[7px] font-black rounded-xs uppercase">
                આયુર્વેદ વિશેષ • દીર્ઘાયુષ્ય સૂત્રો
              </span>
              <span>પ્રાકૃતિક ચિકિત્સા ડેસ્ક</span>
            </div>

            <h2 className="text-[17px] font-black leading-[1.14] text-slate-950 tracking-tight mt-0.5">
              {leadHeadline}
            </h2>
          </div>

          <div className="grid grid-cols-12 gap-2 items-stretch mt-0.5 flex-1">
            <div className="col-span-7 flex flex-col justify-between space-y-0.5">
              <div className="w-full h-[145px] overflow-hidden border border-slate-300 bg-slate-100">
                <img src={leadImage} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="flex items-center justify-between text-[6.5px] font-semibold text-slate-500 pt-0.2">
                <span className="italic truncate">{leadCaption}</span>
                <span className="text-[#B3121B] font-bold shrink-0 ml-1">► સંપૂર્ણ ઉપચાર</span>
              </div>
            </div>

            <div className="col-span-5 flex flex-col justify-between text-justify space-y-0.5">
              <div>
                <p className="text-[8px] font-semibold text-slate-800 leading-snug">
                  <span className="float-left text-xl font-black text-[#B3121B] mr-1 leading-none">{leadLocation.charAt(0)}</span>
                  <strong>{leadLocation}: </strong>
                  {leadSummary}
                </p>
                <p className="text-[7.2px] font-medium text-slate-700 leading-snug pt-0.5 border-t border-dashed border-slate-200">
                  {leadSecondParagraph}
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-0.5 text-[6.5px] font-bold text-amber-950 space-y-0.2">
                <div className="flex items-center justify-between">
                  <span>• સાત્વિક દિનચર્યા</span>
                  <span>• શ્રી અન્ન મિલેટ્સ</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>• ગિલોય & ત્રિફળા</span>
                  <span>• રોગપ્રતિકારક શક્તિ</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Columns: 7 Fast Wellness Bulletins */}
        <div className="col-span-4 flex flex-col justify-between space-y-0.5 bg-slate-50 p-1 border border-slate-300">
          <div className="flex items-center justify-between border-b border-slate-300 pb-0.5">
            <span className="bg-slate-900 text-amber-300 text-[7px] font-black px-1.5 py-0.2 rounded-xs uppercase">
              વેલનેસ ડાયરી • 7 FAST UPDATES
            </span>
            <span className="text-[#B3121B] text-[6.5px] font-bold">હેલ્થ લાઈવ</span>
          </div>

          <div className="space-y-0.5 flex-1 flex flex-col justify-between">
            {wellnessBulletin.map((item, idx) => (
              <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.8px] leading-tight">
                <div className="flex items-center justify-between text-[6px] font-bold text-slate-500">
                  <span className="text-[#B3121B] uppercase font-black">[{item.cat}]</span>
                  <span>{item.time}</span>
                </div>
                <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.2">{item.title}</h5>
              </div>
            ))}
          </div>

          <div className="text-[6.2px] font-bold text-slate-500 border-t border-slate-200 pt-0.5 flex justify-between">
            <span>આયુષ મંત્રાલય ગાઇડલાઇન્સ</span>
            <span className="text-[#B3121B]">► સંપૂર્ણ ટિપ્સ પાના ૧૦ પર</span>
          </div>
        </div>
      </section>

      {/* ==================== 3. 2 PROMINENT SECONDARY LIFESTYLE STORIES (WITH PHOTOS) ==================== */}
      <section className="grid grid-cols-2 gap-2.5 border-b-2 border-slate-900 pb-1 pt-0.5 shrink-0">
        {/* Story 1 */}
        <div className="space-y-0.5 border-r border-slate-300 pr-2.5">
          <div className="flex items-center justify-between text-[7px] font-bold text-slate-500">
            <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[6.5px] font-black rounded-xs uppercase">
              {secLife1.tag}
            </span>
            <span className="text-[#B3121B] font-bold">► આહાર માર્ગદર્શિકા</span>
          </div>

          <h3 className="text-[10.5px] font-black leading-tight text-slate-950 line-clamp-1">
            {secLife1.title}
          </h3>

          <div className="flex gap-2 items-start mt-0.5">
            <div className="w-[100px] shrink-0 space-y-0.5">
              <div className="w-[100px] h-[66px] overflow-hidden border border-slate-300 bg-slate-100">
                <img src={secLife1.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                તસવીર: ગુજરાત પોસ્ટ
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between min-h-[66px] space-y-0.5">
              <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                {secLife1.summary}
              </p>
              <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                <span className="text-slate-800 font-extrabold truncate">
                  {secLife1.byline}
                </span>
                <span className="text-[#B3121B] font-black shrink-0">
                  વિગત પાના ૦૫ પર
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Story 2 */}
        <div className="space-y-0.5">
          <div className="flex items-center justify-between text-[7px] font-bold text-slate-500">
            <span className="bg-slate-900 text-white px-1.5 py-0.2 text-[6.5px] font-black rounded-xs uppercase">
              {secLife2.tag}
            </span>
            <span className="text-[#B3121B] font-bold">► હોમ ડેકોર</span>
          </div>

          <h3 className="text-[10.5px] font-black leading-tight text-slate-950 line-clamp-1">
            {secLife2.title}
          </h3>

          <div className="flex gap-2 items-start mt-0.5">
            <div className="w-[100px] shrink-0 space-y-0.5">
              <div className="w-[100px] h-[66px] overflow-hidden border border-slate-300 bg-slate-100">
                <img src={secLife2.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                તસવીર: ગુજરાત પોસ્ટ
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between min-h-[66px] space-y-0.5">
              <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                {secLife2.summary}
              </p>
              <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                <span className="text-slate-800 font-extrabold truncate">
                  {secLife2.byline}
                </span>
                <span className="text-[#B3121B] font-black shrink-0">
                  વિગત પાના ૦૫ પર
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 4. SPECIAL IN-DEPTH SPOTLIGHT SECTION (2 STORIES WITH PHOTOS) ==================== */}
      <section className="border-b-2 border-slate-900 pb-1 pt-0.5 shrink-0 space-y-0.5">
        <div className="flex items-center justify-between bg-slate-100 border-l-4 border-[#B3121B] px-1.5 py-0.5">
          <span className="text-[7.5px] font-black text-slate-900 uppercase flex items-center gap-1">
            <Flame className="h-2.5 w-2.5 text-[#B3121B]" />
            <span>ઓર્ગેનિક લિવિંગ & મેન્ટલ વેલનેસ સમીક્ષા (ORGANIC & MENTAL HEALTH SPOTLIGHT)</span>
          </span>
          <span className="text-[6.5px] font-bold text-slate-600">પ્રાકૃતિક ખેતી ઉત્પાદનો & સ્ટ્રેસ મેનેજમેન્ટ</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Spot 1 */}
          <div className="space-y-0.5 border-r border-slate-300 pr-2.5">
            <div className="flex items-center justify-between text-[6.5px] font-bold">
              <span className="bg-indigo-800 text-white px-1.5 py-0.1 text-[6px] font-black rounded-xs uppercase">
                {spotLife1.badge} • {spotLife1.category}
              </span>
              <span className="text-[#B3121B] font-bold">► ઓર્ગેનિક મિશન</span>
            </div>

            <h4 className="text-[10px] font-black leading-tight text-slate-950 line-clamp-1">
              {spotLife1.title}
            </h4>

            <div className="flex gap-2 items-start mt-0.5">
              <div className="w-[100px] shrink-0 space-y-0.5">
                <div className="w-[100px] h-[66px] overflow-hidden border border-slate-300 bg-slate-100">
                  <img src={spotLife1.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
                </div>
                <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                  તસવીર: ગુજરાત પોસ્ટ
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between min-h-[66px] space-y-0.5">
                <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                  {spotLife1.summary}
                </p>
                <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                  <span className="text-slate-800 font-extrabold truncate">
                    {spotLife1.byline}
                  </span>
                  <span className="text-[#B3121B] font-black shrink-0">
                    કૃષિ પાના ૦૩
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Spot 2 */}
          <div className="space-y-0.5">
            <div className="flex items-center justify-between text-[6.5px] font-bold">
              <span className="bg-emerald-800 text-white px-1.5 py-0.1 text-[6px] font-black rounded-xs uppercase">
                {spotLife2.badge} • {spotLife2.category}
              </span>
              <span className="text-[#B3121B] font-bold">► મેન્ટલ હેલ્થ</span>
            </div>

            <h4 className="text-[10px] font-black leading-tight text-slate-950 line-clamp-1">
              {spotLife2.title}
            </h4>

            <div className="flex gap-2 items-start mt-0.5">
              <div className="w-[100px] shrink-0 space-y-0.5">
                <div className="w-[100px] h-[66px] overflow-hidden border border-slate-300 bg-slate-100">
                  <img src={spotLife2.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
                </div>
                <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                  તસવીર: ગુજરાત પોસ્ટ
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between min-h-[66px] space-y-0.5">
                <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                  {spotLife2.summary}
                </p>
                <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                  <span className="text-slate-800 font-extrabold truncate">
                    {spotLife2.byline}
                  </span>
                  <span className="text-[#B3121B] font-black shrink-0">
                    ધ્યાન પાના ૦૬
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 5. 4-WELLNESS DOMAIN MATRIX (WITH PHOTOS) ==================== */}
      <section className="border-b-2 border-slate-900 pb-0.5 shrink-0">
        <div className="flex items-center justify-between text-[7px] font-black text-slate-950 mb-0.5 border-b border-slate-300 pb-0.2">
          <span className="bg-slate-900 text-white px-1 py-0.2 text-[6.5px] uppercase rounded-xs">
            ૪ જીવનશૈલી પરિમાણો • 4 WELLNESS DOMAINS
          </span>
          <span className="text-slate-500 text-[6.5px]">આયુર્વેદ & યોગ • ન્યુટ્રિશન & ડાયેટ • માનસિક શાંતિ • હોમ & ઈકો લિવિંગ</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {/* Domain 1: Ayurveda & Yoga */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-[#B3121B] text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {ayurvedaYogaDomain.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={ayurvedaYogaDomain.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {ayurvedaYogaDomain.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► યોગ માર્ગદર્શિકા</span>
          </div>

          {/* Domain 2: Nutrition & Diet */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-slate-900 text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {nutritionDietDomain.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={nutritionDietDomain.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {nutritionDietDomain.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► આહાર ચાર્ટ</span>
          </div>

          {/* Domain 3: Mental Health */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-amber-700 text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {mentalHealthDomain.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={mentalHealthDomain.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {mentalHealthDomain.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► ધ્યાન સૂત્રો</span>
          </div>

          {/* Domain 4: Home & Eco Living */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-emerald-800 text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {homeLivingDomain.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={homeLivingDomain.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {homeLivingDomain.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► ઈકો લાઈફ</span>
          </div>
        </div>
      </section>

      {/* ==================== 6. 8 HEALTH & LIVING HABITS GRID (2 ROWS OF 4 COLS) ==================== */}
      <section className="border-b-2 border-slate-900 pb-0.5 pt-0.2 shrink-0 space-y-0.5">
        <div className="flex items-center justify-between text-[7px] font-black text-slate-950 border-b border-slate-300 pb-0.2">
          <span className="bg-[#B3121B] text-white px-1 py-0.2 text-[6.5px] uppercase rounded-xs flex items-center gap-1">
            <Newspaper className="h-2 w-2" />
            <span>તંદુરસ્તી & જીવનશૈલી સૂત્રો (WELLNESS & HEALTH HABITS DIGEST)</span>
          </span>
          <span className="text-slate-500 text-[6.2px]">સ્વસ્થ જીવન માટે ૮ સુવર્ણ આદતો</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {lifestyleGridStories.map((item, idx) => (
            <div
              key={idx}
              className={`space-y-0.5 ${idx % 4 !== 3 ? 'border-r border-slate-300 pr-1.5' : ''} ${idx >= 4 ? 'pt-0.5 border-t border-slate-200' : ''}`}
            >
              <div className="flex items-center justify-between text-[6.5px] font-bold text-slate-500">
                <span className="text-[#B3121B] font-black uppercase">[{item.theme}]</span>
                <span className="text-[5.8px] text-slate-400">વેલનેસ</span>
              </div>

              <h4 className="text-[7.8px] font-black leading-tight text-slate-950 line-clamp-1">
                {item.title}
              </h4>

              <div className="flex gap-1 items-start mt-0.1">
                <img src={item.image} alt="" className="w-11 h-8 object-cover border border-slate-300 shrink-0 bg-slate-100" crossOrigin="anonymous" />
                <p className="text-[6.3px] font-medium text-slate-700 leading-snug text-justify line-clamp-2 flex-1">
                  {item.summary}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== 7. LIFE HACKS BRIEFS (6 COLUMNS) ==================== */}
      <section className="shrink-0 space-y-0.5 border-b border-slate-400 pb-0.5">
        <div className="flex items-center gap-1.5 border-b border-slate-300 pb-0.2">
          <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[7px] font-black uppercase rounded-xs">
            સ્વાસ્થ્ય પલ્સ • DAILY WELLNESS BRIEFS
          </span>
          <span className="text-[6.5px] text-slate-500 font-bold">યોગ, આહાર, આયુર્વેદ અને માનસિક સુખાકારી</span>
        </div>

        <div className="grid grid-cols-6 gap-1 pt-0.2">
          {lifestylePulseBriefs.map((brief, idx) => (
            <div key={idx} className={`space-y-0.5 ${idx < 5 ? 'border-r border-slate-300 pr-1' : ''}`}>
              <h5 className="text-[7.2px] font-black leading-tight text-slate-950 line-clamp-1 flex items-center gap-0.5">
                <span className="text-[#B3121B] font-black shrink-0">►</span>
                <span>{brief.label}</span>
              </h5>
              <p className="text-[6.2px] font-medium text-slate-700 leading-tight line-clamp-2 text-justify">
                {brief.text}
              </p>
              <div className="text-right text-[5.8px] font-bold text-[#B3121B]">
                {brief.ref}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== 8. AYUSH HEALTHCARE ADVISORY STRIP ==================== */}
      <section className="bg-slate-50 border border-dashed border-slate-400 p-0.5 rounded-xs flex items-center justify-between text-[6.5px] font-bold text-slate-700 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="bg-slate-900 text-amber-300 px-1 py-0.2 rounded-xs text-[6px] font-black uppercase flex items-center gap-0.5">
            <ShieldCheck className="h-2 w-2" />
            <span>આયુષ મંત્રાલય અધિકૃત પરામર્શ</span>
          </span>
          <span>કોઈપણ ઔષધનું સેવન કરતા પહેલા અધિકૃત આયુર્વેદિક તબીબની સલાહ લેવી હિતાવહ છે.</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <span>પોર્ટલ: <strong>ayush.gov.in</strong></span>
          <span>•</span>
          <span className="text-[#B3121B] font-black">પ્રમાણિત વેલનેસ ડેસ્ક</span>
        </div>
      </section>

      {/* ==================== 9. BROADSHEET NEWSPAPER FOOTER ==================== */}
      <footer className="border-t border-slate-400 pt-0.5 pb-0.5 flex items-center justify-between text-[7px] font-bold text-slate-600 shrink-0">
        <div>
          <span>© ગુજરાત પોસ્ટ લાઈફસ્ટાઇલ બ્યુરો, {displayCity} • અમદાવાદ • ઋષિકેશ • બેંગલુરુ • કેરળ</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#B3121B] font-black uppercase">WWW.GUJARATPOST.IN</span>
          <span>•</span>
          <span>પાનું ૧૦ / ૧૪</span>
        </div>
      </footer>
    </div>
  );
};
