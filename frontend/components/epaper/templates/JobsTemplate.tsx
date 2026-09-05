'use client';

import React from 'react';
import { EPaperPageData, getCleanText, formatGujaratiDate, BroadsheetArticle } from '../types';
import { Briefcase, Building2, Landmark, Shield, Calendar, CheckCircle2, ShieldCheck, FileText, AlertTriangle, Flame, Newspaper } from 'lucide-react';

interface TemplateProps {
  data: EPaperPageData;
}

const cleanHeadline = (text?: string) => {
  if (!text) return '';
  return text.replace(/^#\d+\s*[-–—:]\s*/i, '').trim();
};

export const JobsTemplate: React.FC<TemplateProps> = ({ data }) => {
  const {
    pageNumber = 12,
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
  const gujaratiDateStr = formatGujaratiDate(date) || 'મંગળવાર, ૧ સપ્ટેમ્બર, ૨૦૨૬';

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

  // 1. Total Vacancy Strip
  const vacancyCounters = [
    { cat: 'ગુજરાત પંચાયત & ગૌણ સેવા', count: '૧૨,૫૦૦ જગ્યાઓ', lastDate: '૨૫ સપ્ટેમ્બર' },
    { cat: 'બેંકિંગ (IBPS / SBI / RBI)', count: '૮,૪૦૦ જગ્યાઓ', lastDate: '૩૦ સપ્ટેમ્બર' },
    { cat: 'ભારતીય રેલવે & ડિફેન્સ', count: '૧૫,૨૦૦ જગ્યાઓ', lastDate: '૧૦ ઓક્ટોબર' },
    { cat: 'પ્રાઇવેટ IT & કોર્પોરેટ', count: '૫,૦૦૦+ ઓપનિંગ્સ', lastDate: 'વોક-ઇન ચાલુ' },
  ];

  // 2. Lead Mega Recruitment Story
  const leadHeadline = cleanHeadline(
    leadArticle?.printHeadline ||
    leadArticle?.titleGu ||
    leadArticle?.title ||
    'ગુજરાત સરકાર દ્વારા મેગા ભરતી કેલેન્ડર જાહેર: પોલીસ, તલાટી, સચિવાલય અને વહીવટી વિભાગમાં ૨૫,૦૦૦ જગ્યાઓ ભરાશે'
  );

  const leadImage =
    leadArticle?.featuredImage ||
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80';

  const leadCaption =
    leadArticle?.photoCredit || 'તસવીર: ગુજરાત પોસ્ટ • ગાંધીનગર: રાજ્ય ભરતી બોર્ડ દ્વારા અધિકૃત સૂચના અને પરીક્ષા પદ્ધતિ જાહેર';

  const leadSummary =
    leadArticle?.printSummary ||
    getCleanText(
      leadArticle?.excerptGu ||
        leadArticle?.excerpt ||
        leadArticle?.contentGu ||
        leadArticle?.content ||
        'રાજ્યના બેરોજગાર યુવાનો માટે ખુશખબર. ગુજરાત ગૌણ સેવા પસંદગી મંડળ અને પંચાયત સેવા પસંદગી બોર્ડ દ્વારા સંયુક્ત રીતે વિવિધ સંવર્ગોમાં બમ્પર ભરતીની જાહેરાત કરવામાં આવી છે. ૧૨ પાસ અને ગ્રેજ્યુએટ ઉમેદવારો માટે ઓનલાઇન પોર્ટલ ઓજસ (OJAS) પર અરજી શરૂ થઈ છે.',
      280
    );

  const leadSecondParagraph = getCleanText(
    leadArticle?.contentGu ||
      leadArticle?.content ||
      'પરીક્ષા પદ્ધતિમાં પારદર્શિતા વધારવા માટે તમામ પરીક્ષાઓ સીબીઆરટી (કમ્પ્યુટર બેઝ્ડ રિક્રૂટમેન્ટ ટેસ્ટ) પદ્ધતિથી લેવાશે અને સામાન્ય જ્ઞાન સાથે રીઝનિંગ અને કમ્પ્યુટર પ્રાવીણ્યતાની કસોટી થશે.',
      260
  );

  const leadLocation = leadArticle?.location || 'ગાંધીનગર';

  // 3. 7 Fast Job Notifications (Right 4 cols)
  const jobsBulletin = [
    { title: cleanHeadline(pool[0]?.printHeadline || pool[0]?.titleGu || 'GSSSB સચિવાલય ક્લાર્ક: ૫,૫૦૦ જગ્યાઓ માટે ઓનલાઇન ફોર્મ શરૂ'), time: '૧૦:૦૦ AM', cat: 'સચિવાલય' },
    { title: cleanHeadline(pool[1]?.printHeadline || pool[1]?.titleGu || 'ગુજરાત પોલીસ કોન્સ્ટેબલ & PSI: શારીરિક કસોટી તારીખો જાહેર'), time: '૧૧:૧૫ AM', cat: 'પોલીસ' },
    { title: cleanHeadline(pool[2]?.printHeadline || pool[2]?.titleGu || 'SBI પ્રોબેશનરી ઓફિસર્સ (PO): ૨,૦૦૦ જગ્યાઓ માટે નોટિફિકેશન'), time: '૧૨:૩૦ PM', cat: 'બેંકિંગ' },
    { title: cleanHeadline(pool[3]?.printHeadline || pool[3]?.titleGu || 'રેલવે રિક્રૂટમેન્ટ બોર્ડ (RRB): ટેકનિશિયન અને ALP ૯,૦૦૦ પદો'), time: '૦૨:૦૦ PM', cat: 'રેલવે' },
    { title: cleanHeadline(pool[4]?.printHeadline || pool[4]?.titleGu || 'ISRO અને DRDO: સાયન્ટિસ્ટ અને એન્જિનિયર ગ્રેડ ભરતી જાહેર'), time: '૦૩:૧૫ PM', cat: 'સાયન્સ' },
    { title: cleanHeadline(pool[5]?.printHeadline || pool[5]?.titleGu || 'ટાટા મોટર્સ સાણંદ પ્લાન્ટ: ૧,૨૦૦ ટેકનિકલ ટ્રેઇનીની ભરતી'), time: '૦૪:૩૦ PM', cat: 'ઓટોમોબાઇલ' },
    { title: cleanHeadline(pool[6]?.printHeadline || pool[6]?.titleGu || 'અમદાવાદ AMC: જુનિયર ક્લાર્ક અને સેનિટરી ઇન્સ્પેક્ટર ૮૦૦ જગ્યાઓ'), time: '૦૫:૪૫ PM', cat: 'મ્યુનિસિપલ' },
  ];

  // 4. Secondary Job Stories (2 prominent stories with photos)
  const secJob1 = {
    title: cleanHeadline(pool[7]?.printHeadline || pool[7]?.titleGu || 'બેંકિંગ સેક્ટરમાં બમ્પર ભરતી: IBPS અને SBI દ્વારા ૧૨,૦૦૦ થી વધુ ક્લાર્ક અને PO ની જગ્યાઓ'),
    image: pool[7]?.featuredImage || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=500&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[7]?.excerptGu || pool[7]?.contentGu || 'રાષ્ટ્રીયકૃત બેંકોમાં નિવૃત્ત સ્ટાફની જગ્યાઓ પૂરવા માટે મોટા પાયે ભરતી શરૂ કરાઈ છે. ગુજરાતી ભાષામાં પ્રિલિમ્સ અને મેન્સ પરીક્ષા આપવાનો વિકલ્પ ઉપલબ્ધ.', 240),
    tag: 'બેંકિંગ નોકરી',
    byline: 'રિક્રૂટમેન્ટ ડેસ્ક, મુંબઈ',
    art: pool[7]
  };

  const secJob2 = {
    title: cleanHeadline(pool[8]?.printHeadline || pool[8]?.titleGu || 'આઈટી કંપનીઓમાં કેમ્પસ પ્લેસમેન્ટ તેજ: TCS, ઇન્ફોસિસ અને વિપ્રો દ્વારા ૧ લાખ ફ્રેશર્સની પસંદગી'),
    image: pool[8]?.featuredImage || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[8]?.excerptGu || pool[8]?.contentGu || 'AI, ક્લાઉડ અને સાયબર સિક્યોરિટીમાં કુશળ એન્જિનિયરો માટે સરેરાશ ₹૬ થી ₹૧૨ લાખના વાર્ષિક પેકેજ સાથે ઓફર લેટર્સ અપાયા.', 240),
    tag: 'આઈટી કેમ્પસ',
    byline: 'પ્લેસમેન્ટ બ્યુરો',
    art: pool[8]
  };

  // 5. Special In-Depth Spotlight (2 Ground Reports with Photos)
  const spotJob1 = {
    title: cleanHeadline(pool[9]?.printHeadline || pool[9]?.titleGu || 'મુખ્યમંત્રી એપ્રેન્ટિસશિપ યોજના: રાજ્યના ૫૦,૦૦૦ યુવાનોને માસિક સ્ટાઇપેન્ડ સાથે ઓન-જોબ ટ્રેનિંગ'),
    image: pool[9]?.featuredImage || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[9]?.excerptGu || pool[9]?.contentGu || 'ઉદ્યોગો અને સરકારના સહયોગથી યુવાનોને વાસ્તવિક ઔદ્યોગિક વાતાવરણમાં કામ કરવાનો અનુભવ અને કાયમી નોકરીની સુવર્ણ તક મળી રહી છે.', 240),
    badge: 'વિશેષ રિપોર્ટ',
    category: 'રોજગાર યોજના',
    byline: 'શ્રમ અને રોજગાર બ્યુરો',
    art: pool[9]
  };

  const spotJob2 = {
    title: cleanHeadline(pool[10]?.printHeadline || pool[10]?.titleGu || 'સ્ટાર્ટઅપ ઇકોસિસ્ટમ & ગિગ વર્કર્સ: ઇ-કોમર્સ અને ડિજિટલ પ્લેટફોર્મ્સ દ્વારા લાખો નવી આજીવિકા તકો'),
    image: pool[10]?.featuredImage || 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[10]?.excerptGu || pool[10]?.contentGu || 'લોજિસ્ટિક્સ, ફિનટેક, એગ્રીટેક અને કન્ટેન્ટ ક્રિએશન ક્ષેત્રે ગુજરાતના યુવા સાહસિકો નવા રોજગાર સર્જક બન્યા છે.', 240),
    badge: 'સ્ટાર્ટઅપ ક્ષિતિજ',
    category: 'સ્વરોજગાર',
    byline: 'સ્ટાર્ટઅપ એનાલિસ્ટ',
    art: pool[10]
  };

  // 6. 4-Recruitment Domain Matrix with photos
  const govtAdminDomain = {
    title: 'સરકારી વહીવટ & સચિવાલય',
    img: pool[11]?.featuredImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'GSSSB', title: cleanHeadline(pool[11]?.printHeadline || pool[11]?.titleGu || 'હેડ ક્લાર્ક અને સિનિયર ક્લાર્ક પરીક્ષા તારીખો જાહેર') },
      { loc: 'GPSSB', title: cleanHeadline(pool[12]?.printHeadline || pool[12]?.titleGu || 'ગ્રામ પંચાયત સેક્રેટરી (તલાટી) મેરિટ લિસ્ટ તૈયાર') },
      { loc: 'GPSC', title: cleanHeadline(pool[13]?.printHeadline || pool[13]?.titleGu || 'નાયબ મામલતદાર અને સેક્શન ઓફિસર ભરતી સૂચના') },
    ]
  };

  const policeDefenseDomain = {
    title: 'પોલીસ & સુરક્ષા દળો',
    img: pool[14]?.featuredImage || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'GUJ POLICE', title: cleanHeadline(pool[14]?.printHeadline || pool[14]?.titleGu || 'LRD કોન્સ્ટેબલ શારીરિક માપદંડ અને દોડ ટેસ્ટ માર્ગદર્શિકા') },
      { loc: 'SSC GD', title: cleanHeadline(pool[15]?.printHeadline || pool[15]?.titleGu || 'CRPF, BSF, CISF માં ૨૬,૦૦૦ જગ્યાઓ માટે અરજી શરૂ') },
      { loc: 'ARMY', title: cleanHeadline(pool[16]?.printHeadline || pool[16]?.titleGu || 'અગ્નિવીર ભરતી રેલી: ગુજરાત ઝોન સ્થળ અને તારીખો જાહેર') },
    ]
  };

  const bankingPsuDomain = {
    title: 'બેંકિંગ & PSU ભરતી',
    img: pool[17]?.featuredImage || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'IBPS PO', title: cleanHeadline(pool[17]?.printHeadline || pool[17]?.titleGu || 'પ્રોબેશનરી ઓફિસર્સ મેન્સ પરીક્ષા એડમિટ કાર્ડ રિલીઝ') },
      { loc: 'LIC AAO', title: cleanHeadline(pool[18]?.printHeadline || pool[18]?.titleGu || 'આસિસ્ટન્ટ એડમિનિસ્ટ્રેટિવ ઓફિસર ૩૦૦ જગ્યાઓ') },
      { loc: 'ONGC', title: cleanHeadline(pool[19]?.printHeadline || pool[19]?.titleGu || 'ગ્રેજ્યુએટ ટ્રેઇની એન્જિનિયર ગેટ સ્કોર આધારે પસંદગી') },
    ]
  };

  const corporatePrivateDomain = {
    title: 'કોર્પોરેટ & પ્રાઇવેટ જોબ્સ',
    img: pool[20]?.featuredImage || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'RELIANCE', title: cleanHeadline(pool[20]?.printHeadline || pool[20]?.titleGu || 'જામનગર રિફાઇનરી ખાતે ૨,૦૦૦ ટેકનિકલ ઓપરેટર્સ') },
      { loc: 'ADANI', title: cleanHeadline(pool[21]?.printHeadline || pool[21]?.titleGu || 'પોર્ટ અને લોજિસ્ટિક્સ મેનેજમેન્ટમાં વોક-ઇન ઇન્ટરવ્યૂ') },
      { loc: 'ZOMATO', title: cleanHeadline(pool[22]?.printHeadline || pool[22]?.titleGu || 'ડિલિવરી પાર્ટનર્સ માટે અકસ્માત વીમો અને ઇન્સેન્ટિવ') },
    ]
  };

  // 7. 8 Employment, Career & Opportunities Digest (2 Rows x 4 Cols)
  const jobsGridStories = [
    {
      title: cleanHeadline(pool[23]?.printHeadline || pool[23]?.titleGu || 'જીઆઈડીસી ઔદ્યોગિક ભરતી: ૧૫,૦૦૦ ટેકનિકલ પદો માટે જોબ મેળો'),
      image: pool[23]?.featuredImage || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80',
      summary: getCleanText(pool[23]?.excerptGu || pool[23]?.contentGu || 'રાજ્યના તમામ ઔદ્યોગિક વિસ્તારોમાં સ્થાનિક યુવાનોને રોજગારી આપવા મેગા રોજગાર શિબિર.', 120),
      tag: 'GIDC જોબ્સ'
    },
    {
      title: cleanHeadline(pool[24]?.printHeadline || pool[24]?.titleGu || 'ભારતીય તટરક્ષક દળ (Indian Coast Guard): નાવિક જનરલ ડ્યુટી ભરતી'),
      image: pool[24]?.featuredImage || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=300&auto=format&fit=crop&q=80',
      summary: getCleanText(pool[24]?.excerptGu || pool[24]?.contentGu || '૧૨ સાયન્સ પાસ યુવાનો માટે દેશના દરિયાઈ સુરક્ષા દળમાં જોડાવાની તક, ઓનલાઇન અરજી શરૂ.', 120),
      tag: 'કોસ્ટ ગાર્ડ'
    },
    {
      title: cleanHeadline(pool[25]?.printHeadline || pool[25]?.titleGu || 'ઇસરો (ISRO) સેક અમદાવાદ: જુનિયર રિસર્ચ ફેલોશિપ ઓપનિંગ્સ'),
      image: pool[25]?.featuredImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&auto=format&fit=crop&q=80',
      summary: getCleanText(pool[25]?.excerptGu || pool[25]?.contentGu || 'અવકાશ વિજ્ઞાન અને સેટેલાઇટ કોમ્યુનિકેશનમાં ઉચ્ચ સંશોધન માટે વૈજ્ઞાનિક સહાયકોની પસંદગી.', 120),
      tag: 'અવકાશ ભરતી'
    },
    {
      title: cleanHeadline(pool[26]?.printHeadline || pool[26]?.titleGu || 'મેડિકલ ઓફિસર્સ & સ્ટાફ નર્સ: આરોગ્ય વિભાગમાં ૪,૦૦૦ પદો જાહેર'),
      image: pool[26]?.featuredImage || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&auto=format&fit=crop&q=80',
      summary: getCleanText(pool[26]?.excerptGu || pool[26]?.contentGu || 'સામુદાયિક આરોગ્ય કેન્દ્રો અને સિવિલ હોસ્પિટલોમાં મેડિકલ સ્ટાફની તાત્કાલિક નિમણૂક પ્રક્રિયા.', 120),
      tag: 'આરોગ્ય સ્ટાફ'
    },
    {
      title: cleanHeadline(pool[27]?.printHeadline || pool[27]?.titleGu || 'ટેક મહિન્દ્રા & વિપ્રો: ગાંધીનગર ગિફ્ટ સિટીમાં ૩,૫૦૦ સોફ્ટવેર એન્જિનિયર'),
      image: pool[27]?.featuredImage || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&auto=format&fit=crop&q=80',
      summary: getCleanText(pool[27]?.excerptGu || pool[27]?.contentGu || 'ગ્લોબલ ફિનટેક પ્રોજેક્ટ્સ માટે ક્લાઉડ આર્કિટેક્ટ્સ અને ડેવલપર્સની કેમ્પસ હાયરિંગ ડ્રાઇવ.', 120),
      tag: 'ગિફ્ટ સિટી'
    },
    {
      title: cleanHeadline(pool[28]?.printHeadline || pool[28]?.titleGu || 'ગુજરાત ગેસ & જીએસપીસી: મેનેજમેન્ટ ટ્રેઇની પદો માટે વોક-ઇન'),
      image: pool[28]?.featuredImage || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300&auto=format&fit=crop&q=80',
      summary: getCleanText(pool[28]?.excerptGu || pool[28]?.contentGu || 'ઊર્જા ક્ષેત્રે કારકિર્દી બનાવવા ઇચ્છતા એન્જિનિયરિંગ અને એમબીએ સ્નાતકો માટે આકર્ષક પેકેજ.', 120),
      tag: 'એનર્જી સેક્ટર'
    },
    {
      title: cleanHeadline(pool[29]?.printHeadline || pool[29]?.titleGu || 'રાજ્ય પરિવહન નિગમ (GSRTC): ૧,૮૦૦ ડ્રાઇવર અને કંડક્ટર ભરતી'),
      image: pool[29]?.featuredImage || 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?w=300&auto=format&fit=crop&q=80',
      summary: getCleanText(pool[29]?.excerptGu || pool[29]?.contentGu || 'એસટી નિગમ દ્વારા નવી વોલ્વો અને ઇ-બસોના સંચાલન માટે લાયકાત ધરાવતા સ્ટાફની સીધી ભરતી.', 120),
      tag: 'GSRTC'
    },
    {
      title: cleanHeadline(pool[30]?.printHeadline || pool[30]?.titleGu || 'પ્રધાનમંત્રી કૌશલ્ય વિકાસ: તાલીમાર્થીઓને ₹૧૫,૦૦૦ પ્રોત્સાહક ભથ્થું'),
      image: pool[30]?.featuredImage || 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=300&auto=format&fit=crop&q=80',
      summary: getCleanText(pool[30]?.excerptGu || pool[30]?.contentGu || 'શોર્ટ ટર્મ કોર્સીસ પૂર્ણ કરનાર યુવાનોને સ્વરોજગાર શરૂ કરવા ટૂલકિટ સહાય અને લોન સુવિધા.', 120),
      tag: 'સ્કિલ ઇન્ડિયા'
    },
  ];

  // 8. Walk-In Interviews Strip (6 columns)
  const walkinScheduleBriefs = [
    { label: 'મેગા જોબ ફેર', text: 'અમદાવાદ યુનિવર્સિટી ગ્રાઉન્ડ, ૫૦ કંપનીઓ, ૧૦:૦૦ AM.', ref: 'સ્થળ: ગુજરાત યુનિ.' },
    { label: 'ફાર્મા વોક-ઇન', text: 'ઝાયડસ & સન ફાર્મા QA/QC સ્ટાફ, વડોદરા કેમ્પસ.', ref: 'શનિવારે ૯:૩૦ AM' },
    { label: 'આઈટી પ્લેસમેન્ટ', text: 'ઇન્ફોસિટી ગાંધીનગર, જાવા અને પાયથોન ડેવલપર્સ.', ref: 'વોક-ઇન ઇન્ટરવ્યૂ' },
    { label: 'બેંકિંગ એજન્ટ્સ', text: 'HDFC & ICICI રિલેશનશિપ મેનેજર્સ, રાજકોટ બ્રાન્ચ.', ref: 'સોમવારે ૧૧:૦૦ AM' },
    { label: 'ઓટોમોબાઇલ ટ્રેઇની', text: 'સાણંદ GIDC, ડિપ્લોમા મિકેનિકલ ફ્રેશર્સ માટે.', ref: 'વોક-ઇન ડ્રાઇવ' },
    { label: 'હોસ્પિટાલિટી સ્ટાફ', text: 'હોટેલ એસોસિએશન દ્વારા ફ્રન્ટ ડેસ્ક & શેફ ભરતી.', ref: 'સુરત કેમ્પસ' },
  ];

  return (
    <div className="h-full flex flex-col p-2 bg-white border-[3px] border-slate-900 box-border text-slate-900 font-sans select-none overflow-hidden space-y-0.5 justify-between">
      {/* ==================== 1. JOBS RUNNING HEADER & FOLIO ==================== */}
      <header className="shrink-0">
        <div className="flex items-center justify-between text-[7.5px] font-bold text-slate-800 border-b border-slate-300 pb-0.5 mb-0.5">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-950 uppercase">ગુજરાત પોસ્ટ</span>
            <span className="text-slate-400">•</span>
            <span className="text-[#B3121B] font-black uppercase">રોજગાર સમાચાર, ભરતી & કરિયર ગઝેટ</span>
            <span className="text-slate-400">•</span>
            <span>{gujaratiDateStr}</span>
          </div>
          <div className="flex items-center gap-2 font-extrabold">
            <span>રોજગાર પૃષ્ઠ</span>
            <span>•</span>
            <span className="bg-[#B3121B] text-white px-1.5 py-0.2 rounded-xs text-[7px] font-black uppercase">
              પાનું ૧૨ / ૧૪
            </span>
            <span>•</span>
            <span>₹ ૧૫.૦૦</span>
          </div>
        </div>

        {/* Section Masthead Banner */}
        <div className="bg-slate-950 text-white px-2 py-0.5 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[8.5px] font-black uppercase tracking-wider rounded-xs flex items-center gap-1">
              <Briefcase className="h-2.5 w-2.5" />
              <span>રોજગાર દર્પણ • EMPLOYMENT GAZETTE</span>
            </span>
            <span className="text-slate-300 text-[8px] font-bold truncate">
              સરકારી ભરતીઓ, OJAS અપડેટ્સ, બેંકિંગ, રેલવે, ડિફેન્સ, કોર્પોરેટ જોબ્સ અને પ્લેસમેન્ટ
            </span>
          </div>
          <div className="flex items-center gap-1 text-amber-300 text-[7.5px] font-extrabold shrink-0">
            <Building2 className="h-2.5 w-2.5" />
            <span>રોજગાર બ્યુરો, ગાંધીનગર</span>
          </div>
        </div>

        {/* Total Vacancy Strip */}
        <div className="grid grid-cols-4 gap-1 bg-slate-100 border-x border-b border-slate-300 p-0.5 text-[6.8px] font-bold text-slate-700">
          {vacancyCounters.map((v, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-0.5 flex flex-col justify-between">
              <span className="text-slate-500 text-[6px] font-extrabold truncate">{v.cat}</span>
              <span className="text-[7.5px] font-black text-slate-950">{v.count}</span>
              <span className="text-[5.8px] text-[#B3121B] font-bold">{v.lastDate}</span>
            </div>
          ))}
        </div>
      </header>

      {/* ==================== 2. UPPER JOBS GRID (8 COLS LEAD + 4 COLS BULLETIN) ==================== */}
      <section className="grid grid-cols-12 gap-2 border-b-2 border-slate-900 pb-0.5 pt-0.5 shrink-0 items-stretch">
        {/* Left 8 Columns: Dominant Lead Recruitment Story */}
        <div className="col-span-8 border-r-2 border-slate-900 pr-2 space-y-0.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[7px] font-bold text-slate-600 mb-0.2">
              <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[7px] font-black rounded-xs uppercase">
                મેગા ભરતી કેલેન્ડર • ૨૫,૦૦૦ જગ્યાઓ
              </span>
              <span>ગાંધીનગર સચિવાલય</span>
            </div>

            <h2 className="text-[16px] font-black leading-[1.14] text-slate-950 tracking-tight mt-0.5">
              {leadHeadline}
            </h2>
          </div>

          <div className="grid grid-cols-12 gap-2 items-stretch mt-0.5 flex-1">
            <div className="col-span-7 flex flex-col justify-between space-y-0.5">
              <div className="w-full h-[135px] overflow-hidden border border-slate-300 bg-slate-100">
                <img src={leadImage} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="flex items-center justify-between text-[6.5px] font-semibold text-slate-500 pt-0.2">
                <span className="italic truncate">{leadCaption}</span>
                <span className="text-[#B3121B] font-bold shrink-0 ml-1">► અરજી વિગત પાના ૧૩</span>
              </div>
            </div>

            <div className="col-span-5 flex flex-col justify-between text-justify space-y-0.5">
              <div>
                <p className="text-[7.8px] font-semibold text-slate-800 leading-snug">
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
                  <span>• પોલીસ: ૧૨,૦૦૦ પદો</span>
                  <span>• તલાટી: ૪,૫૦૦ પદો</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>• ક્લાર્ક: ૫,૫૦૦ પદો</span>
                  <span>• ૧૦૦% પારદર્શક CBRT</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Columns: 7 Fast Job Notifications */}
        <div className="col-span-4 flex flex-col justify-between space-y-0.5 bg-slate-50 p-1 border border-slate-300">
          <div className="flex items-center justify-between border-b border-slate-300 pb-0.5">
            <span className="bg-slate-900 text-amber-300 text-[7px] font-black px-1.5 py-0.2 rounded-xs uppercase">
              નોકરી ડાયરી • 7 FAST NOTIFICATIONS
            </span>
            <span className="text-[#B3121B] text-[6.5px] font-bold">ઓજસ લાઈવ</span>
          </div>

          <div className="space-y-0.5 flex-1 flex flex-col justify-between">
            {jobsBulletin.map((item, idx) => (
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
            <span>ઓજસ પોર્ટલ: ojas.gujarat.gov.in</span>
            <span className="text-[#B3121B]">► અરજી કરો</span>
          </div>
        </div>
      </section>

      {/* ==================== 3. 2 PROMINENT SECONDARY JOB STORIES (WITH PHOTOS) ==================== */}
      <section className="grid grid-cols-2 gap-2.5 border-b-2 border-slate-900 pb-0.5 pt-0.5 shrink-0">
        {/* Story 1 */}
        <div className="space-y-0.5 border-r border-slate-300 pr-2.5">
          <div className="flex items-center justify-between text-[7px] font-bold text-slate-500">
            <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[6.5px] font-black rounded-xs uppercase">
              {secJob1.tag}
            </span>
            <span className="text-[#B3121B] font-bold">► સિલેબસ & પેકેજ</span>
          </div>

          <h3 className="text-[10.5px] font-black leading-tight text-slate-950 line-clamp-1">
            {secJob1.title}
          </h3>

          <div className="flex gap-2 items-start mt-0.5">
            <div className="w-[100px] shrink-0 space-y-0.5">
              <div className="w-[100px] h-[64px] overflow-hidden border border-slate-300 bg-slate-100">
                <img src={secJob1.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                તસવીર: ગુજરાત પોસ્ટ
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between min-h-[64px] space-y-0.5">
              <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                {secJob1.summary}
              </p>
              <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                <span className="text-slate-800 font-extrabold truncate">
                  {secJob1.byline}
                </span>
                <span className="text-[#B3121B] font-black shrink-0">
                  વિગત પાના ૧૩ પર
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Story 2 */}
        <div className="space-y-0.5">
          <div className="flex items-center justify-between text-[7px] font-bold text-slate-500">
            <span className="bg-slate-900 text-white px-1.5 py-0.2 text-[6.5px] font-black rounded-xs uppercase">
              {secJob2.tag}
            </span>
            <span className="text-[#B3121B] font-bold">► કેમ્પસ ઓફર્સ</span>
          </div>

          <h3 className="text-[10.5px] font-black leading-tight text-slate-950 line-clamp-1">
            {secJob2.title}
          </h3>

          <div className="flex gap-2 items-start mt-0.5">
            <div className="w-[100px] shrink-0 space-y-0.5">
              <div className="w-[100px] h-[64px] overflow-hidden border border-slate-300 bg-slate-100">
                <img src={secJob2.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                તસવીર: ગુજરાત પોસ્ટ
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between min-h-[64px] space-y-0.5">
              <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                {secJob2.summary}
              </p>
              <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                <span className="text-slate-800 font-extrabold truncate">
                  {secJob2.byline}
                </span>
                <span className="text-[#B3121B] font-black shrink-0">
                  વિગત પાના ૧૩ પર
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 4. SPECIAL IN-DEPTH SPOTLIGHT SECTION (2 STORIES WITH PHOTOS) ==================== */}
      <section className="border-b-2 border-slate-900 pb-0.5 pt-0.5 shrink-0 space-y-0.5">
        <div className="flex items-center justify-between bg-slate-100 border-l-4 border-[#B3121B] px-1.5 py-0.5">
          <span className="text-[7.5px] font-black text-slate-900 uppercase flex items-center gap-1">
            <Flame className="h-2.5 w-2.5 text-[#B3121B]" />
            <span>એપ્રેન્ટિસશિપ & સ્ટાર્ટઅપ રોજગાર સમીક્ષા (APPRENTICESHIP & STARTUP JOBS)</span>
          </span>
          <span className="text-[6.5px] font-bold text-slate-600">૫૦,૦૦૦ એપ્રેન્ટિસશિપ બેઠકો & ગિગ વર્કર્સ ગ્રોથ</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Spotlight 1 */}
          <div className="space-y-0.5 border-r border-slate-300 pr-2.5">
            <div className="flex items-center justify-between text-[6.5px] font-bold">
              <span className="bg-indigo-800 text-white px-1.5 py-0.1 text-[6px] font-black rounded-xs uppercase">
                {spotJob1.badge} • {spotJob1.category}
              </span>
              <span className="text-[#B3121B] font-bold">► પોર્ટલ રજીસ્ટ્રેશન</span>
            </div>

            <h4 className="text-[10px] font-black leading-tight text-slate-950 line-clamp-1">
              {spotJob1.title}
            </h4>

            <div className="flex gap-2 items-start mt-0.5">
              <div className="w-[100px] shrink-0 space-y-0.5">
                <div className="w-[100px] h-[62px] overflow-hidden border border-slate-300 bg-slate-100">
                  <img src={spotJob1.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
                </div>
                <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                  તસવીર: ગુજરાત પોસ્ટ
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between min-h-[62px] space-y-0.5">
                <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                  {spotJob1.summary}
                </p>
                <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                  <span className="text-slate-800 font-extrabold truncate">
                    {spotJob1.byline}
                  </span>
                  <span className="text-[#B3121B] font-black shrink-0">
                    સ્ટાઇપેન્ડ વિગત
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Spotlight 2 */}
          <div className="space-y-0.5">
            <div className="flex items-center justify-between text-[6.5px] font-bold">
              <span className="bg-emerald-800 text-white px-1.5 py-0.1 text-[6px] font-black rounded-xs uppercase">
                {spotJob2.badge} • {spotJob2.category}
              </span>
              <span className="text-[#B3121B] font-bold">► સ્ટાર્ટઅપ જોબ્સ</span>
            </div>

            <h4 className="text-[10px] font-black leading-tight text-slate-950 line-clamp-1">
              {spotJob2.title}
            </h4>

            <div className="flex gap-2 items-start mt-0.5">
              <div className="w-[100px] shrink-0 space-y-0.5">
                <div className="w-[100px] h-[62px] overflow-hidden border border-slate-300 bg-slate-100">
                  <img src={spotJob2.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
                </div>
                <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                  તસવીર: ગુજરાત પોસ્ટ
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between min-h-[62px] space-y-0.5">
                <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                  {spotJob2.summary}
                </p>
                <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                  <span className="text-slate-800 font-extrabold truncate">
                    {spotJob2.byline}
                  </span>
                  <span className="text-[#B3121B] font-black shrink-0">
                    ઓપનિંગ્સ પાના ૧૪
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 5. 4-RECRUITMENT DOMAIN MATRIX (WITH PHOTOS) ==================== */}
      <section className="border-b-2 border-slate-900 pb-0.5 shrink-0">
        <div className="flex items-center justify-between text-[7px] font-black text-slate-950 mb-0.5 border-b border-slate-300 pb-0.2">
          <span className="bg-slate-900 text-white px-1 py-0.2 text-[6.5px] uppercase rounded-xs">
            ભરતી ક્ષેત્ર દર્પણ • 4 RECRUITMENT MATRIX
          </span>
          <span className="text-slate-500 text-[6.5px]">સરકારી વહીવટ • પોલીસ & સુરક્ષા • બેંકિંગ & PSU • કોર્પોરેટ જોબ્સ</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {/* Domain 1: Govt Admin */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-[#B3121B] text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {govtAdminDomain.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={govtAdminDomain.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {govtAdminDomain.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► વહીવટ વિગત</span>
          </div>

          {/* Domain 2: Police */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-slate-900 text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {policeDefenseDomain.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={policeDefenseDomain.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {policeDefenseDomain.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► પોલીસ વિગત</span>
          </div>

          {/* Domain 3: Banking */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-amber-700 text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {bankingPsuDomain.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={bankingPsuDomain.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {bankingPsuDomain.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► બેંકિંગ વિગત</span>
          </div>

          {/* Domain 4: Corporate */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-emerald-800 text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {corporatePrivateDomain.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={corporatePrivateDomain.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {corporatePrivateDomain.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► કોર્પોરેટ વિગત</span>
          </div>
        </div>
      </section>

      {/* ==================== 6. 8 EMPLOYMENT & OPPORTUNITIES DIGEST GRID (2 ROWS OF 4 COLS) ==================== */}
      <section className="border-b-2 border-slate-900 pb-0.5 pt-0.2 shrink-0 space-y-0.5">
        <div className="flex items-center justify-between text-[7px] font-black text-slate-950 border-b border-slate-300 pb-0.2">
          <span className="bg-[#B3121B] text-white px-1 py-0.2 text-[6.5px] uppercase rounded-xs flex items-center gap-1">
            <Newspaper className="h-2 w-2" />
            <span>રોજગાર તકો & ભરતી ડાયરી (CAREER & OPPORTUNITIES DIGEST)</span>
          </span>
          <span className="text-slate-500 text-[6.2px]">રાજ્ય અને રાષ્ટ્રવ્યાપી ૮ નવીન રોજગાર જાહેરાતો</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {jobsGridStories.map((item, idx) => (
            <div
              key={idx}
              className={`space-y-0.5 ${idx % 4 !== 3 ? 'border-r border-slate-300 pr-1.5' : ''} ${idx >= 4 ? 'pt-0.5 border-t border-slate-200' : ''}`}
            >
              <div className="flex items-center justify-between text-[6.5px] font-bold text-slate-500">
                <span className="text-[#B3121B] font-black uppercase">[{item.tag}]</span>
                <span className="text-[5.8px] text-slate-400">રોજગાર દર્પણ</span>
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

      {/* ==================== 7. WALK-IN INTERVIEWS STRIP (6 COLUMNS) ==================== */}
      <section className="shrink-0 space-y-0.5 border-b border-slate-400 pb-0.5">
        <div className="flex items-center gap-1.5 border-b border-slate-300 pb-0.2">
          <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[7px] font-black uppercase rounded-xs">
            વોક-ઇન ઇન્ટરવ્યૂ & પ્લેસમેન્ટ કેલેન્ડર • WALK-IN DRIVES
          </span>
          <span className="text-[6.5px] text-slate-500 font-bold">જોબ ફેર, ફાર્મા, આઈટી, બેંકિંગ અને ઓટોમોબાઇલ તાત્કાલિક ભરતી</span>
        </div>

        <div className="grid grid-cols-6 gap-1 pt-0.2">
          {walkinScheduleBriefs.map((brief, idx) => (
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

      {/* ==================== 8. RECRUITMENT ALERT & ANTI-FRAUD NOTICE ==================== */}
      <section className="bg-slate-50 border border-dashed border-slate-400 p-0.5 rounded-xs flex items-center justify-between text-[6.5px] font-bold text-slate-700 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="bg-slate-900 text-amber-300 px-1 py-0.2 rounded-xs text-[6px] font-black uppercase">
            ભરતી ફ્રોડ સાવચેતી એલર્ટ
          </span>
          <span>સરકારી નોકરી અપાવવાના બહાને નાણાં માગતી અનઅધિકૃત એજન્સીઓથી સાવધ રહો. અધિકૃત માહિતી માત્ર <strong>ojas.gujarat.gov.in</strong> પર ઉપલબ્ધ.</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <span>સત્તાવાર પોર્ટલ: <strong>gsssb.gujarat.gov.in</strong></span>
          <span>•</span>
          <span className="text-[#B3121B] font-black flex items-center gap-0.5">
            <ShieldCheck className="h-2 w-2 text-emerald-600" />
            <span>પ્રમાણિત જોબ ડેસ્ક</span>
          </span>
        </div>
      </section>

      {/* ==================== 9. BROADSHEET NEWSPAPER FOOTER ==================== */}
      <footer className="border-t border-slate-400 pt-0.5 pb-0.5 flex items-center justify-between text-[7px] font-bold text-slate-600 shrink-0">
        <div>
          <span>© ગુજરાત પોસ્ટ રોજગાર બ્યુરો • ગાંધીનગર • અમદાવાદ • વડોદરા • સુરત • રાજકોટ</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#B3121B] font-black uppercase">WWW.GUJARATPOST.IN</span>
          <span>•</span>
          <span>પાનું ૧૨ / ૧૪</span>
        </div>
      </footer>
    </div>
  );
};

