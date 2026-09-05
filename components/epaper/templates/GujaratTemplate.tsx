'use client';

import React from 'react';
import { EPaperPageData, getCleanText, formatGujaratiDate, BroadsheetArticle } from '../types';
import { Landmark, Compass, Droplets, Wheat, ShieldCheck, TrendingUp, Sparkles, MapPin, CheckCircle2, Newspaper } from 'lucide-react';

interface TemplateProps {
  data: EPaperPageData;
}

const cleanHeadline = (text?: string) => {
  if (!text) return '';
  return text.replace(/^#\d+\s*[-–—:]\s*/, '').trim();
};

export const GujaratTemplate: React.FC<TemplateProps> = ({ data }) => {
  const {
    pageNumber = 3,
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

  // 1. Regional Water & Agro Ticker
  const regionalMetrics = [
    { label: 'નર્મદા ડેમ સપાટી', val: '૧૩૮.૬૮ મીટર (૧૦૦%)', sub: 'સરદાર સરોવર છલકાયો' },
    { label: 'સરેરાશ મોસમનો વરસાદ', val: '૧૦૨.૪%', sub: 'રાજ્યમાં ૧૦૦% થી વધુ' },
    { label: 'APMC કપાસ ભાવ', val: '₹૧,૫૫૦ - ₹૧,૭૫૦', sub: 'પ્રતિ ૨૦ કિલો (ગોંડલ)' },
    { label: 'ઊંઝા જીરું બજાર', val: '₹૫,૨૦૦ - ₹૫,૮૦૦', sub: 'મણ દીઠ રેકોર્ડ ભાવ' },
  ];

  // 2. Full-Width Grand Banner Headline & Story
  const leadHeadline = cleanHeadline(
    leadArticle?.printHeadline ||
    leadArticle?.titleGu ||
    leadArticle?.title ||
    'ગુજરાત કેબિનેટનો મોટો નિર્ણય: રાજ્યમાં સિંચાઈ, કૃષિ સબસિડી અને ઔદ્યોગિક નીતિ હેઠળ ₹૧૫,૦૦૦ કરોડના પ્રોજેક્ટ્સ મંજૂર'
  );

  const leadImage =
    leadArticle?.featuredImage ||
    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80';

  const leadCaption =
    leadArticle?.photoCredit || 'તસવીર: ગુજરાત પોસ્ટ • ગાંધીનગર સ્વર્ણિમ સંકુલ ખાતે કેબિનેટ બેઠક બાદ મુખ્યમંત્રીની પ્રેસ કોન્ફરન્સ';

  const leadSummary =
    leadArticle?.printSummary ||
    getCleanText(
      leadArticle?.excerptGu ||
        leadArticle?.excerpt ||
        leadArticle?.contentGu ||
        leadArticle?.content ||
        'ગાંધીનગર ખાતે મુખ્યમંત્રીના અધ્યક્ષસ્થાને મળેલી કેબિનેટ બેઠકમાં રાજ્યના ખેડૂતો અને ઉદ્યોગો માટે ઐતિહાસિક નિર્ણયો લેવાયા છે. સૌની યોજના અને સુજલામ સુફલામ યોજના હેઠળ વધુ ૫૦૦ તળાવોને નર્મદાના નીરથી ભરવા માટે વિશેષ બજેટ ફાળવાયું છે. ૩૩ જિલ્લાઓમાં ગ્રામીણ માળખાકીય સુવિધાઓ સુદ્રઢ બનશે.',
      280
    );

  const leadSecondParagraph = getCleanText(
    leadArticle?.contentGu ||
      leadArticle?.content ||
      'ગ્રામીણ અર્થતંત્રને વેગ આપવા માટે સહકારી મંડળીઓ અને દૂધ ઉત્પાદક સંઘોને સોલાર રૂફટોપ માટે ૭૫% સબસિડી આપવાની જાહેરાત કરાઈ છે. પંચાયત રસ્તાઓ અને પુલ નિર્માણ માટે ₹૪,૦૦૦ કરોડની વધારાની ગ્રાન્ટ ફાળવવામાં આવી છે.',
    260
  );

  const leadLocation = leadArticle?.location || 'ગાંધીનગર';

  // 3. 7 Secretariat & Regional Updates (Right 4 cols)
  const regionalBulletin = [
    { title: cleanHeadline(pool[0]?.printHeadline || pool[0]?.titleGu) || 'રાજ્ય સેવકો માટે મોંઘવારી ભથ્થામાં ૪% નો વધારો તાત્કાલિક લાગુ', time: '૧૦:૦૦ AM', cat: 'સચિવાલય' },
    { title: cleanHeadline(pool[1]?.printHeadline || pool[1]?.titleGu) || 'નવી ટેક્સટાઇલ અને ગારમેન્ટ પોલિસી હેઠળ ₹૫,૦૦૦ કરોડનું રોકાણ', time: '૧૧:૧૫ AM', cat: 'ઉદ્યોગ' },
    { title: cleanHeadline(pool[2]?.printHeadline || pool[2]?.titleGu) || 'રાજ્યમાં ૧,૨૦૦ નવી ઇલેક્ટ્રિક બસો ખરીદવા GSRTC ને મંજૂરી', time: '૧૨:૩૦ PM', cat: 'વાહનવ્યવહાર' },
    { title: cleanHeadline(pool[3]?.printHeadline || pool[3]?.titleGu) || 'ડિજિટલ ગુજરાત પોર્ટલ પર વધુ ૫૦ સરકારી સેવાઓ ઉપલબ્ધ કરાઈ', time: '૦૨:૦૦ PM', cat: 'ઈ-ગવર્નન્સ' },
    { title: cleanHeadline(pool[4]?.printHeadline || pool[4]?.titleGu) || 'સૌરાષ્ટ્ર અને ઉત્તર ગુજરાતના ડેમોમાં ૯૦% થી વધુ જળસંગ્રહ', time: '૦૩:૧૫ PM', cat: 'જળસંપત્તિ' },
    { title: cleanHeadline(pool[5]?.printHeadline || pool[5]?.titleGu) || 'રાજ્યની ૫,૦૦૦ ગ્રામ પંચાયતોમાં હાઇ-સ્પીડ બ્રોડબેન્ડ કનેક્ટિવિટી', time: '૦૪:૩૦ PM', cat: 'ગ્રામવિકાસ' },
    { title: cleanHeadline(pool[6]?.printHeadline || pool[6]?.titleGu) || 'પશુપાલકો માટે પશુધન આરોગ્ય મેળાઓનું આયોજન જાહેર', time: '૦૫:૪૫ PM', cat: 'પશુપાલન' },
  ];

  // 4. Secondary Regional Stories (2 prominent stories with photos)
  const secReg1 = {
    title: cleanHeadline(pool[7]?.printHeadline || pool[7]?.titleGu) || 'સૌરાષ્ટ્ર નર્મદા અવતરણ સિંચાઈ (SAUNI) યોજના ફેઝ-૩ ના કામો પૂર્ણતાના આરે',
    image: pool[7]?.featuredImage || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[7]?.excerptGu || pool[7]?.contentGu || 'રાજકોટ, જામનગર, મોરબી અને સુરેન્દ્રનગર જિલ્લાના ૧૧૫ ડેમોમાં નર્મદાના નીર પહોંચાડવાથી લાખો હેક્ટર જમીન સિંચાઈ હેઠળ આવી છે. ખેડૂતોને રવિ પાક માટે પૂરતું પાણી મળશે.', 240),
    tag: 'સૌની યોજના',
    byline: 'વિશેષ બ્યુરો, રાજકોટ',
    art: pool[7]
  };

  const secReg2 = {
    title: cleanHeadline(pool[8]?.printHeadline || pool[8]?.titleGu) || 'દક્ષિણ ગુજરાતમાં બાગાયતી પાકો માટે કોલ્ડ સ્ટોરેજ અને નિકાસ સુવિધાઓનું વિસ્તરણ',
    image: pool[8]?.featuredImage || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=500&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[8]?.excerptGu || pool[8]?.contentGu || 'નવસારી અને વલસાડના કેરી અને ચીકુ ઉત્પાદક ખેડૂતોને આંતરરાષ્ટ્રીય બજારો સુધી પહોંચવા માટે વિશેષ પેકહાઉસ સબસિડી અપાશે. એગ્રો એક્સપોર્ટ ઝોન સ્થાપવા મંજૂરી મળી છે.', 240),
    tag: 'બાગાયત મિશન',
    byline: 'કૃષિ ડેસ્ક, સુરત',
    art: pool[8]
  };

  // 5. Special In-Depth Regional Spotlight (2 Ground Reports with Photos)
  const spotReg1 = {
    title: cleanHeadline(pool[9]?.printHeadline || pool[9]?.titleGu) || 'ધોલેરા સ્પેશિયલ ઇન્વેસ્ટમેન્ટ રીજન (SIR): દેશનું પ્રથમ સ્માર્ટ ઔદ્યોગિક શહેર આકાર લઈ રહ્યું છે',
    image: pool[9]?.featuredImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[9]?.excerptGu || pool[9]?.contentGu || 'પ્લગ એન્ડ પ્લે ઇન્ફ્રાસ્ટ્રક્ચર, એક્સપ્રેસવે અને ગ્રીનફીલ્ડ ઇન્ટરનેશનલ એરપોર્ટ સાથે ધોલેરા ગ્લોબલ મેન્યુફેક્ચરિંગ હબ બનવા સજ્જ. સેમિકન્ડક્ટર પ્લાન્ટ્સનું ઝડપી બાંધકામ શરૂ.', 240),
    badge: 'વિશેષ અહેવાલ',
    category: 'ધોલેરા SIR',
    byline: 'ઔદ્યોગિક વિકાસ ડેસ્ક',
    art: pool[9]
  };

  const spotReg2 = {
    title: cleanHeadline(pool[10]?.printHeadline || pool[10]?.titleGu) || 'ગીર સોમનાથ પ્રવાસન સર્કિટ: સાગરકાંઠા રોડવે અને નવી બોટિંગ જેટીઓનું નિર્માણ',
    image: pool[10]?.featuredImage || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[10]?.excerptGu || pool[10]?.contentGu || 'સોમનાથ મહાદેવ મંદિર દર્શનાર્થીઓ માટે અદ્યતન ફેસિલિટેશન સેન્ટર અને મરીન વોકવે ખુલ્લો મુકાયો. સાસણ ગીર અભયારણ્યમાં ઈકો ટુરિઝમ ઝોન વિકસાવવામાં આવ્યો છે.', 240),
    badge: 'પ્રવાસન વિકાસ',
    category: 'ટૂરિઝમ સર્કિટ',
    byline: 'પ્રવાસન પ્રતિનિધિ',
    art: pool[10]
  };

  // 6. 4 Regional Matrix Boxes (Saurashtra, South, North, Central) with photos
  const saurashtraKutch = {
    title: 'સૌરાષ્ટ્ર & કચ્છ વિશેષ',
    img: pool[11]?.featuredImage || 'https://images.unsplash.com/photo-1596405835955-465de5c3dfb7?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'રાજકોટ', title: cleanHeadline(pool[11]?.printHeadline || pool[11]?.titleGu) || 'AIIMS ખાતે સ્પેશિયાલિટી ઓપીડી સેવાઓ સંપૂર્ણ કાર્યરત' },
      { loc: 'જામનગર', title: cleanHeadline(pool[12]?.printHeadline || pool[12]?.titleGu) || 'રિલાયન્સ ગ્રીન એનર્જી સંકુલમાં સોલાર પેનલ ઉત્પાદન' },
      { loc: 'ભુજ', title: cleanHeadline(pool[13]?.printHeadline || pool[13]?.titleGu) || 'ધોળાવીરા હેરિટેજ રૂટ પર નવી હેલિપોર્ટ સુવિધા શરૂ' },
    ]
  };

  const southGujarat = {
    title: 'દક્ષિણ ગુજરાત ડાયરી',
    img: pool[14]?.featuredImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'સુરત', title: cleanHeadline(pool[14]?.printHeadline || pool[14]?.titleGu) || 'ડાયમંડ બુર્સ ખાતે આંતરરાષ્ટ્રીય જેમ્સ એન્ડ જ્વેલરી ફેસ્ટ' },
      { loc: 'વલસાડ', title: cleanHeadline(pool[15]?.printHeadline || pool[15]?.titleGu) || 'વાપી હાઇવે પર નવો સિક્સ-લેન ફ્લાયઓવર ખુલ્લો મુકાયો' },
      { loc: 'ભરૂચ', title: cleanHeadline(pool[16]?.printHeadline || pool[16]?.titleGu) || 'દહેજ PCPIR ઝોનમાં ₹૩,૦૦૦ કરોડનું નવું રોકાણ' },
    ]
  };

  const northGujarat = {
    title: 'ઉત્તર ગુજરાત સમાચાર',
    img: pool[17]?.featuredImage || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'મહેસાણા', title: cleanHeadline(pool[17]?.printHeadline || pool[17]?.titleGu) || 'દૂધસાગર ડેરી દ્વારા પશુપાલકોને ભાવફેર બોનસ જાહેર' },
      { loc: 'પાટણ', title: cleanHeadline(pool[18]?.printHeadline || pool[18]?.titleGu) || 'રાણકી વાવ મહોત્સવમાં રાષ્ટ્રીય કલાકારોની સંગીત સંધ્યા' },
      { loc: 'ડીસા', title: cleanHeadline(pool[19]?.printHeadline || pool[19]?.titleGu) || 'બનાસકાંઠામાં બટાકા પ્રોસેસિંગ પ્લાન્ટનું વિસ્તરણ' },
    ]
  };

  const centralGujarat = {
    title: 'મધ્ય ગુજરાત વિકાસ',
    img: pool[20]?.featuredImage || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'વડોદરા', title: cleanHeadline(pool[20]?.printHeadline || pool[20]?.titleGu) || 'એરપોર્ટ પર નવું ઇન્ટરનેશનલ કાર્ગો ટર્મિનલ શરૂ' },
      { loc: 'આણંદ', title: cleanHeadline(pool[21]?.printHeadline || pool[21]?.titleGu) || 'અમૂલ ડેરી ચોકલેટ પ્લાન્ટ વિસ્તરણ: દૈનિક ૧૦૦ ટન' },
      { loc: 'ગોધરા', title: cleanHeadline(pool[22]?.printHeadline || pool[22]?.titleGu) || 'પાવાગઢ તીર્થ પરિસર નવીનીકરણ પ્રોજેક્ટ પૂર્ણ' },
    ]
  };

  // 7. 8 District Development Stories (2 rows of 4 cols with photos)
  const districtGridStories = [
    {
      dist: 'ભાવનગર',
      title: cleanHeadline(pool[23]?.printHeadline || pool[23]?.titleGu) || 'અલંગ શિપ રિસાયક્લિંગ યાર્ડમાં ગ્રીન શિપિંગ પોલિસી લાગુ',
      summary: getCleanText(pool[23]?.excerptGu || pool[23]?.contentGu || 'પર્યાવરણ સુરક્ષા અને વર્કર્સ સેફ્ટી માટે આંતરરાષ્ટ્રીય હોંગકોંગ કન્વેન્શન નિયમોનું પાલન.', 60),
      image: pool[23]?.featuredImage || 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=300&auto=format&fit=crop&q=80',
    },
    {
      dist: 'મોરબી',
      title: cleanHeadline(pool[24]?.printHeadline || pool[24]?.titleGu) || 'સિરામિક ક્લસ્ટરમાં નેચરલ ગેસ કન્સેશનથી નિકાસમાં ૨૦% વૃદ્ધિ',
      summary: getCleanText(pool[24]?.excerptGu || pool[24]?.contentGu || 'યુરોપ અને અમેરિકન બજારોમાં મોરબીની ટાઇલ્સની ભારે માંગથી ઉદ્યોગોમાં તેજી.', 60),
      image: pool[24]?.featuredImage || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&auto=format&fit=crop&q=80',
    },
    {
      dist: 'પોરબંદર',
      title: cleanHeadline(pool[25]?.printHeadline || pool[25]?.titleGu) || 'મરીન ફિશિંગ પોર્ટ આધુનિકીકરણ પ્રોજેક્ટ માટે ગ્રાન્ટ મંજૂર',
      summary: getCleanText(pool[25]?.excerptGu || pool[25]?.contentGu || 'સાગરખેડૂતો માટે કોલ્ડ સ્ટોરેજ અને નવી બોટ પાર્કિંગ જેટીનું બાંધકામ શરૂ.', 60),
      image: pool[25]?.featuredImage || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&auto=format&fit=crop&q=80',
    },
    {
      dist: 'સાબરકાંઠા',
      title: cleanHeadline(pool[26]?.printHeadline || pool[26]?.titleGu) || 'સાબર ડેરી દ્વારા નવો પાવડર પ્લાન્ટ અને ડેરી પાર્ક સ્થાપના',
      summary: getCleanText(pool[26]?.excerptGu || pool[26]?.contentGu || 'હિંમતનગર પાસે ₹૩૫૦ કરોડના ખર્ચે અદ્યતન મિલ્ક પ્રોસેસિંગ યુનિટ કાર્યરત કરાશે.', 60),
      image: pool[26]?.featuredImage || 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?w=300&auto=format&fit=crop&q=80',
    },
    {
      dist: 'દાહોદ',
      title: cleanHeadline(pool[27]?.printHeadline || pool[27]?.titleGu) || 'દાહોદ સ્માર્ટ સિટી પ્રોજેક્ટ: ટ્રાયબલ મ્યુઝિયમ અને રિંગ રોડ',
      summary: getCleanText(pool[27]?.excerptGu || pool[27]?.contentGu || 'આદિવાસી સંસ્કૃતિના જતન અને શહેરી માળખાકીય વિકાસના કામો પૂરજોશમાં.', 60),
      image: pool[27]?.featuredImage || 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=300&auto=format&fit=crop&q=80',
    },
    {
      dist: 'અમરેલી',
      title: cleanHeadline(pool[28]?.printHeadline || pool[28]?.titleGu) || 'શેત્રુંજી ડેમ કેનાલ નેટવર્ક રિપેરિંગ: છેવાડાના ખેડૂતોને પાણી',
      summary: getCleanText(pool[28]?.excerptGu || pool[28]?.contentGu || 'સિંચાઈ વિભાગ દ્વારા ૧૨૦ કિમી લાંબી નહેરોની સફાઈ અને લાઇનિંગ પૂર્ણ.', 60),
      image: pool[28]?.featuredImage || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=300&auto=format&fit=crop&q=80',
    },
    {
      dist: 'નર્મદા',
      title: cleanHeadline(pool[29]?.printHeadline || pool[29]?.titleGu) || 'સ્ટેચ્યુ ઓફ યુનિટી પરિસરમાં નવો ગ્રીન બટરફ્લાય પાર્ક શરૂ',
      summary: getCleanText(pool[29]?.excerptGu || pool[29]?.contentGu || 'એકતા નગરમાં પર્યટકો માટે ઈ-કાર સુવિધા અને હોટેલ રિસોર્ટ એક્સટેન્શન.', 60),
      image: pool[29]?.featuredImage || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop&q=80',
    },
    {
      dist: 'ગીર સોમનાથ',
      title: cleanHeadline(pool[30]?.printHeadline || pool[30]?.titleGu) || 'સાસણ ગીર સફારી બુકિંગમાં વધારો: વાઇલ્ડલાઇફ ટૂરિઝમ તેજ',
      summary: getCleanText(pool[30]?.excerptGu || pool[30]?.contentGu || 'સિંહ દર્શન માટે નવી ઓનલાઇન સ્લોટ સિસ્ટમ અને પ્રકૃતિ શિક્ષણ શિબિરો.', 60),
      image: pool[30]?.featuredImage || 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=300&auto=format&fit=crop&q=80',
    },
  ];

  // 8. APMC Mandi Rates Table
  const apmcRates = [
    { crop: 'કપાસ (શંકર)', market: 'ગોંડલ / રાજકોટ', min: '₹૧,૫૨૦', max: '₹૧,૭૬૫' },
    { crop: 'મગફળી (જી-૨૦)', market: 'જૂનાગઢ / હિંમતનગર', min: '₹૧,૨૪૦', max: '₹૧,૪૫૦' },
    { crop: 'જીરું (સુપર)', market: 'ઊંઝા / થરાદ', min: '₹૫,૧૦૦', max: '₹૫,૮૫૦' },
    { crop: 'ઘઉં (ટુકડા)', market: 'અમદાવાદ / આણંદ', min: '₹૫૫૦', max: '₹૬૨૫' },
    { crop: 'એરંડા (દિવેલા)', market: 'કડી / પાટણ', min: '₹૧,૧૮૦', max: '₹૧,૩૧૦' },
  ];

  // 9. Regional Pulse Briefs (6 columns)
  const regionalPulseBriefs = [
    { label: 'કૃષિ સહાય', text: 'પાક નુકસાની સામે સહાય પેકેજ માટે ઓનલાઇન પોર્ટલ પર નોંધણી શરૂ.', ref: 'કૃષિ વિભાગ' },
    { label: 'GSRTC બસ', text: 'તહેવારો નિમિત્તે રાજ્યભરમાં ૧,૫૦૦ વધારાની એક્સપ્રેસ બસો દોડશે.', ref: 'પરિવહન નિગમ' },
    { label: 'નર્મદા નીર', text: 'રાજ્યના છેવાડાના ગામો સુધી સિંચાઈનું પાણી પહોંચાડવા નહેર કામ તેજ.', ref: 'જળ સંપત્તિ' },
    { label: 'પંચાયત વિકાસ', text: 'સ્માર્ટ વિલેજ યોજના અંતર્ગત નવી ૧૦૦ પંચાયતોની પસંદગી કરાઈ.', ref: 'પંચાયત વિભાગ' },
    { label: 'સહકારી બેંક', text: 'ખેડૂતોને શૂન્ય ટકા વ્યાજે ધિરાણ વિતરણ લક્ષ્યાંક ૧૦૦% સિદ્ધ.', ref: 'સહકાર બોર્ડ' },
    { label: 'ઈ-ધરા કેન્દ્ર', text: 'જમીન રેકોર્ડ્સ અને ૭/૧૨ નકલો ડિજિટલ સહી સાથે તુરંત ઉપલબ્ધ.', ref: 'મહેસૂલ શાખા' },
  ];

  return (
    <div className="h-full flex flex-col p-2 bg-white border-[3px] border-slate-900 box-border text-slate-900 font-sans select-none overflow-hidden space-y-0.5 justify-between">
      {/* ==================== 1. GUJARAT RUNNING HEADER & FOLIO ==================== */}
      <header className="shrink-0">
        <div className="flex items-center justify-between text-[7.5px] font-bold text-slate-800 border-b border-slate-300 pb-0.5 mb-0.5">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-950 uppercase">ગુજરાત પોસ્ટ</span>
            <span className="text-slate-400">•</span>
            <span className="text-[#B3121B] font-black uppercase">રાજ્ય સમાચાર & પ્રાદેશિક ગઝેટ</span>
            <span className="text-slate-400">•</span>
            <span>{gujaratiDateStr}</span>
          </div>
          <div className="flex items-center gap-2 font-extrabold">
            <span>ગુજરાત પૃષ્ઠ</span>
            <span>•</span>
            <span className="bg-[#B3121B] text-white px-1.5 py-0.2 rounded-xs text-[7px] font-black uppercase">
              પાનું ૩ / ૧૪
            </span>
            <span>•</span>
            <span>₹ ૧૫.૦૦</span>
          </div>
        </div>

        {/* Section Masthead Banner */}
        <div className="bg-slate-950 text-white px-2 py-0.5 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[8.5px] font-black uppercase tracking-wider rounded-xs flex items-center gap-1">
              <Landmark className="h-2.5 w-2.5" />
              <span>ગુજરાત દર્પણ • STATE REGIONAL GAZETTE</span>
            </span>
            <span className="text-slate-300 text-[8px] font-bold truncate">
              સૌરાષ્ટ્ર, કચ્છ, ઉત્તર, દક્ષિણ અને મધ્ય ગુજરાતના ૩૩ જિલ્લાઓના સમાચારો
            </span>
          </div>
          <div className="flex items-center gap-1 text-amber-300 text-[7.5px] font-extrabold shrink-0">
            <Compass className="h-2.5 w-2.5" />
            <span>ગાંધીનગર બ્યુરો</span>
          </div>
        </div>

        {/* Regional Water & Agro Ticker */}
        <div className="grid grid-cols-4 gap-1 bg-amber-50/70 border-x border-b border-amber-200 p-0.5 text-[6.8px] font-bold text-slate-700">
          {regionalMetrics.map((r, idx) => (
            <div key={idx} className="bg-white border border-amber-200 p-0.5 flex flex-col justify-between">
              <span className="text-amber-900 font-extrabold truncate">{r.label}</span>
              <span className="text-[7.5px] font-black text-slate-950">{r.val}</span>
              <span className="text-[5.8px] text-slate-500">{r.sub}</span>
            </div>
          ))}
        </div>
      </header>

      {/* ==================== 2. UPPER REGIONAL GRID (8 COLS LEAD + 4 COLS BULLETIN) ==================== */}
      <section className="grid grid-cols-12 gap-2 border-b-2 border-slate-900 pb-1 pt-0.5 shrink-0 items-stretch">
        {/* Left 8 Columns: Dominant Lead State Story */}
        <div className="col-span-8 border-r-2 border-slate-900 pr-2 space-y-0.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[7px] font-bold text-slate-600 mb-0.2">
              <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[7px] font-black rounded-xs uppercase">
                ગાંધીનગર કેબિનેટ નિર્ણય • ₹૧૫,૦૦૦ કરોડ પેકેજ
              </span>
              <span>સ્વર્ણિમ સંકુલ • સચિવાલય</span>
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
                <span className="text-[#B3121B] font-bold shrink-0 ml-1">► સચિવાલય બુલેટિન</span>
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
                  <span>• ૫૦૦ તળાવો નર્મદાથી ભરાશે</span>
                  <span>• પશુપાલકો સોલાર સબસિડી</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>• ₹૪,૦૦૦ કરોડ રસ્તા ગ્રાન્ટ</span>
                  <span>• ૩૩ જિલ્લામાં વિકાસ</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Columns: 7 Regional Fast Bulletins */}
        <div className="col-span-4 flex flex-col justify-between space-y-0.5 bg-slate-50 p-1 border border-slate-300">
          <div className="flex items-center justify-between border-b border-slate-300 pb-0.5">
            <span className="bg-slate-900 text-amber-300 text-[7px] font-black px-1.5 py-0.2 rounded-xs uppercase">
              સચિવાલય & પ્રાદેશિક ડાયરી
            </span>
            <span className="text-[#B3121B] text-[6.5px] font-bold">૭ સમાચાર</span>
          </div>

          <div className="space-y-0.5 flex-1 flex flex-col justify-between">
            {regionalBulletin.map((item, idx) => (
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
            <span>ગાંધીનગર ભવન</span>
            <span className="text-[#B3121B]">► સંપૂર્ણ લિસ્ટ પાના ૩ પર</span>
          </div>
        </div>
      </section>

      {/* ==================== 3. 2 PROMINENT SECONDARY REGIONAL STORIES (WITH PHOTOS) ==================== */}
      <section className="grid grid-cols-2 gap-2.5 border-b-2 border-slate-900 pb-1 pt-0.5 shrink-0">
        {/* Story 1 */}
        <div className="space-y-0.5 border-r border-slate-300 pr-2.5">
          <div className="flex items-center justify-between text-[7px] font-bold text-slate-500">
            <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[6.5px] font-black rounded-xs uppercase">
              {secReg1.tag}
            </span>
            <span className="text-[#B3121B] font-bold">► સિંચાઈ અહેવાલ</span>
          </div>

          <h3 className="text-[10.5px] font-black leading-tight text-slate-950 line-clamp-1">
            {secReg1.title}
          </h3>

          <div className="flex gap-2 items-start mt-0.5">
            <div className="w-[100px] shrink-0 space-y-0.5">
              <div className="w-[100px] h-[66px] overflow-hidden border border-slate-300 bg-slate-100">
                <img src={secReg1.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                તસવીર: ગુજરાત પોસ્ટ
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between min-h-[66px] space-y-0.5">
              <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                {secReg1.summary}
              </p>
              <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                <span className="text-slate-800 font-extrabold truncate">
                  {secReg1.byline}
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
              {secReg2.tag}
            </span>
            <span className="text-[#B3121B] font-bold">► બાગાયત સહાય</span>
          </div>

          <h3 className="text-[10.5px] font-black leading-tight text-slate-950 line-clamp-1">
            {secReg2.title}
          </h3>

          <div className="flex gap-2 items-start mt-0.5">
            <div className="w-[100px] shrink-0 space-y-0.5">
              <div className="w-[100px] h-[66px] overflow-hidden border border-slate-300 bg-slate-100">
                <img src={secReg2.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                તસવીર: ગુજરાત પોસ્ટ
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between min-h-[66px] space-y-0.5">
              <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                {secReg2.summary}
              </p>
              <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                <span className="text-slate-800 font-extrabold truncate">
                  {secReg2.byline}
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
            <Landmark className="h-2.5 w-2.5 text-[#B3121B]" />
            <span>મેગા પ્રોજેક્ટ્સ & પ્રવાસન સમીક્ષા (STATE MEGA PROJECTS SPOTLIGHT)</span>
          </span>
          <span className="text-[6.5px] font-bold text-slate-600">ધોલેરા SIR & સૌરાષ્ટ્ર ટૂરિઝમ સર્કિટ</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Spot 1 */}
          <div className="space-y-0.5 border-r border-slate-300 pr-2.5">
            <div className="flex items-center justify-between text-[6.5px] font-bold">
              <span className="bg-indigo-800 text-white px-1.5 py-0.1 text-[6px] font-black rounded-xs uppercase">
                {spotReg1.badge} • {spotReg1.category}
              </span>
              <span className="text-[#B3121B] font-bold">► ધોલેરા વિગત</span>
            </div>

            <h4 className="text-[10px] font-black leading-tight text-slate-950 line-clamp-1">
              {spotReg1.title}
            </h4>

            <div className="flex gap-2 items-start mt-0.5">
              <div className="w-[100px] shrink-0 space-y-0.5">
                <div className="w-[100px] h-[66px] overflow-hidden border border-slate-300 bg-slate-100">
                  <img src={spotReg1.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
                </div>
                <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                  તસવીર: ગુજરાત પોસ્ટ
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between min-h-[66px] space-y-0.5">
                <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                  {spotReg1.summary}
                </p>
                <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                  <span className="text-slate-800 font-extrabold truncate">
                    {spotReg1.byline}
                  </span>
                  <span className="text-[#B3121B] font-black shrink-0">
                    નકશો પાના ૦૬
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Spot 2 */}
          <div className="space-y-0.5">
            <div className="flex items-center justify-between text-[6.5px] font-bold">
              <span className="bg-emerald-800 text-white px-1.5 py-0.1 text-[6px] font-black rounded-xs uppercase">
                {spotReg2.badge} • {spotReg2.category}
              </span>
              <span className="text-[#B3121B] font-bold">► સોમનાથ ટૂરિઝમ</span>
            </div>

            <h4 className="text-[10px] font-black leading-tight text-slate-950 line-clamp-1">
              {spotReg2.title}
            </h4>

            <div className="flex gap-2 items-start mt-0.5">
              <div className="w-[100px] shrink-0 space-y-0.5">
                <div className="w-[100px] h-[66px] overflow-hidden border border-slate-300 bg-slate-100">
                  <img src={spotReg2.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
                </div>
                <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                  તસવીર: ગુજરાત પોસ્ટ
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between min-h-[66px] space-y-0.5">
                <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                  {spotReg2.summary}
                </p>
                <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                  <span className="text-slate-800 font-extrabold truncate">
                    {spotReg2.byline}
                  </span>
                  <span className="text-[#B3121B] font-black shrink-0">
                    વિગત પાના ૦૬
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 5. 4 REGIONAL MATRIX BOXES (WITH PHOTOS) ==================== */}
      <section className="border-b-2 border-slate-900 pb-0.5 shrink-0">
        <div className="flex items-center justify-between text-[7px] font-black text-slate-950 mb-0.5 border-b border-slate-300 pb-0.2">
          <span className="bg-slate-900 text-white px-1 py-0.2 text-[6.5px] uppercase rounded-xs">
            પ્રાદેશિક દર્પણ • 4 REGIONAL MATRIX
          </span>
          <span className="text-slate-500 text-[6.5px]">સૌરાષ્ટ્ર • દક્ષિણ • ઉત્તર • મધ્ય ગુજરાત</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {/* Region 1: Saurashtra */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-[#B3121B] text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {saurashtraKutch.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={saurashtraKutch.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {saurashtraKutch.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► સૌરાષ્ટ્ર સમાચાર</span>
          </div>

          {/* Region 2: South */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-slate-900 text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {southGujarat.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={southGujarat.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {southGujarat.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► દક્ષિણ સમાચાર</span>
          </div>

          {/* Region 3: North */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-amber-700 text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {northGujarat.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={northGujarat.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {northGujarat.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► ઉત્તર સમાચાર</span>
          </div>

          {/* Region 4: Central */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-emerald-800 text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {centralGujarat.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={centralGujarat.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {centralGujarat.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► મધ્ય સમાચાર</span>
          </div>
        </div>
      </section>

      {/* ==================== 6. 8 DISTRICT DEVELOPMENT STORIES (2 ROWS OF 4 COLS) ==================== */}
      <section className="border-b-2 border-slate-900 pb-0.5 pt-0.2 shrink-0 space-y-0.5">
        <div className="flex items-center justify-between text-[7px] font-black text-slate-950 border-b border-slate-300 pb-0.2">
          <span className="bg-[#B3121B] text-white px-1 py-0.2 text-[6.5px] uppercase rounded-xs flex items-center gap-1">
            <Newspaper className="h-2 w-2" />
            <span>જિલ્લા વિકાસ & પંચાયત સમાચારો (DISTRICT DEVELOPMENT & GROUND REPORTS)</span>
          </span>
          <span className="text-slate-500 text-[6.2px]">રાજ્યના ૮ અગ્રણી જિલ્લાઓની ગતિવિધિ</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {districtGridStories.map((item, idx) => (
            <div
              key={idx}
              className={`space-y-0.5 ${idx % 4 !== 3 ? 'border-r border-slate-300 pr-1.5' : ''} ${idx >= 4 ? 'pt-0.5 border-t border-slate-200' : ''}`}
            >
              <div className="flex items-center justify-between text-[6.5px] font-bold text-slate-500">
                <span className="text-[#B3121B] font-black uppercase">[{item.dist}]</span>
                <span className="text-[5.8px] text-slate-400">જિલ્લા ડેસ્ક</span>
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

      {/* ==================== 7. APMC MANDI COMMODITY RATES & AGRO DESK ==================== */}
      <section className="grid grid-cols-12 gap-2 border-b-2 border-slate-900 pb-0.5 shrink-0 items-stretch">
        {/* Left 8 Columns: APMC Mandi Rates Table */}
        <div className="col-span-8 border-r-2 border-slate-900 pr-2 bg-slate-50 p-1 border border-slate-300 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[6.8px] font-black text-slate-950 mb-0.5">
            <span className="uppercase flex items-center gap-1">
              <Wheat className="h-2.5 w-2.5 text-amber-700" />
              <span>મુખ્ય APMC માર્કેટિંગ યાર્ડ દૈનિક જણસી ભાવ (ભાવ પ્રતિ ૨૦ કિલો / મણ)</span>
            </span>
            <span className="text-[#B3121B]">લાઈવ બજાર ભાવ</span>
          </div>

          <div className="grid grid-cols-5 gap-1 text-[6.2px] text-center">
            {apmcRates.map((a, idx) => (
              <div key={idx} className="bg-white p-0.5 border border-slate-200 flex flex-col justify-between">
                <span className="font-black text-slate-950 block">{a.crop}</span>
                <span className="text-[5.5px] text-slate-500">{a.market}</span>
                <span className="text-[6.8px] font-black text-emerald-800 mt-0.2">{a.max}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right 4 Columns: i-Khedut Portal Desk */}
        <div className="col-span-4 bg-emerald-950 text-white p-1 flex flex-col justify-between text-[6.2px]">
          <div className="flex items-center justify-between border-b border-emerald-800 pb-0.2">
            <span className="text-emerald-300 text-[6.8px] font-black uppercase flex items-center gap-1">
              <CheckCircle2 className="h-2 w-2" />
              <span>આઈ-ખેડૂત સહાય ડેસ્ક</span>
            </span>
            <span className="text-amber-300 text-[6px]">સબસિડી</span>
          </div>

          <p className="text-[6px] text-emerald-100 leading-tight py-0.5">
            ટ્રેક્ટર, તાડપત્રી, ડ્રિપ ઇરિગેશન અને સોલાર પંપ સબસિડી માટે પોર્ટલ પર ઓનલાઇન અરજી શરૂ છે.
          </p>

          <span className="text-[5.5px] text-emerald-300 border-t border-emerald-900 pt-0.2 block text-center font-bold">
            સત્તાવાર પોર્ટલ: <strong>ikhedut.gujarat.gov.in</strong>
          </span>
        </div>
      </section>

      {/* ==================== 8. REGIONAL BRIEFS (6 COLUMNS) ==================== */}
      <section className="shrink-0 space-y-0.5 border-b border-slate-400 pb-0.5">
        <div className="flex items-center gap-1.5 border-b border-slate-300 pb-0.2">
          <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[7px] font-black uppercase rounded-xs">
            પ્રાદેશિક ઝલક • REGIONAL BRIEFS
          </span>
          <span className="text-[6.5px] text-slate-500 font-bold">રાજ્યના ૩૩ જિલ્લાઓની સંક્ષિપ્ત ગતિવિધિ</span>
        </div>

        <div className="grid grid-cols-6 gap-1 pt-0.2">
          {regionalPulseBriefs.map((brief, idx) => (
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

      {/* ==================== 9. BROADSHEET NEWSPAPER FOOTER ==================== */}
      <footer className="border-t border-slate-400 pt-0.5 pb-0.5 flex items-center justify-between text-[7px] font-bold text-slate-600 shrink-0">
        <div>
          <span>© ગુજરાત પોસ્ટ પ્રાદેશિક બ્યુરો, {displayCity} • ગાંધીનગર • રાજકોટ • સુરત • વડોદરા</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#B3121B] font-black uppercase">WWW.GUJARATPOST.IN</span>
          <span>•</span>
          <span>પાનું ૩ / ૧૪</span>
        </div>
      </footer>
    </div>
  );
};
