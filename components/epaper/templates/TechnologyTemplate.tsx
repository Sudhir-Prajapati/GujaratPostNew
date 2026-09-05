'use client';

import React from 'react';
import { EPaperPageData, getCleanText, formatGujaratiDate, BroadsheetArticle } from '../types';
import { Cpu, Smartphone, ShieldCheck, Zap, Globe, Sparkles, Star, Laptop, Wifi, Flame, CheckCircle2, Newspaper } from 'lucide-react';

interface TemplateProps {
  data: EPaperPageData;
}

const cleanHeadline = (text?: string) => {
  if (!text) return '';
  return text.replace(/^#\d+\s*[-–—:]\s*/, '').trim();
};

export const TechnologyTemplate: React.FC<TemplateProps> = ({ data }) => {
  const {
    pageNumber = 8,
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

  // 1. Silicon Valley & Gadget Ticker
  const techTicker = [
    { brand: 'OpenAI GPT-5', news: 'નવું મલ્ટિમોડલ મોડેલ રિલીઝ', status: 'AI સુપરપાવર' },
    { brand: 'Apple iPhone 17 Pro', news: '૨nm A19 પ્રો પ્રોસેસર લોન્ચ', status: 'પ્રી-ઓર્ડર શરૂ' },
    { brand: 'Nvidia Blackwell', news: 'AI ડેટા સેન્ટર ચિપ ડિલિવરી', status: 'શેર +૩.૫%' },
    { brand: 'ગુજરાત સેમિકન્ડક્ટર', news: 'ધોલેરા ચિપ પ્લાન્ટ નિર્માણ તેજ', status: 'ટાટા પાર્ટનર' },
  ];

  // 2. Lead AI & Quantum Story
  const leadHeadline = cleanHeadline(
    leadArticle?.printHeadline ||
    leadArticle?.titleGu ||
    leadArticle?.title ||
    'આર્ટિફિશિયલ ઇન્ટેલિજન્સ ક્રાંતિ: જનરેટિવ AI અને ક્વોન્ટમ કમ્પ્યુટિંગથી શિક્ષણ, આરોગ્ય અને ભારતીય ઉદ્યોગોમાં મોટો બદલાવ'
  );

  const leadImage =
    leadArticle?.featuredImage ||
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80';

  const leadCaption =
    leadArticle?.photoCredit || 'તસવીર: ગુજરાત પોસ્ટ ટેક • બેંગલુરુ / સિલિકોન વેલી: નેક્સ્ટ જનરેશન AI ન્યુરલ નેટવર્ક પ્રોસેસિંગ રિસર્ચ લેબ';

  const leadSummary =
    leadArticle?.printSummary ||
    getCleanText(
      leadArticle?.excerptGu ||
        leadArticle?.excerpt ||
        leadArticle?.contentGu ||
        leadArticle?.content ||
        'આર્ટિફિશિયલ ઇન્ટેલિજન્સ (AI) ટેકનોલોજી હવે માત્ર લેબ પૂરતી સીમિત નથી રહી પરંતુ માનવ જીવનના દરેક ક્ષેત્રમાં ક્રાંતિકારી પરિવર્તન લાવી રહી છે. ઓટોમેટેડ કોડિંગથી લઈને મેડિકલ ડાયગ્નોસ્ટિક્સ અને પર્સનલાઇઝ્ડ એજ્યુકેશન સુધી AI ટૂલ્સ ઉત્પાદકતામાં ૫ ગણો વધારો કરી રહ્યા છે.',
      280
    );

  const leadSecondParagraph = getCleanText(
    leadArticle?.contentGu ||
      leadArticle?.content ||
      'ભારત સરકારે ઇન્ડિયા AI મિશન હેઠળ ₹૧૦,૩૭૨ કરોડના બજેટ સાથે ૧૦,૦૦૦ થી વધુ GPU ક્લસ્ટરની સ્થાપના શરૂ કરી છે જેથી સ્થાનિક સ્ટાર્ટઅપ્સ પોતાના મોટા ભાષા મોડેલ્સ (LLM) વિકસાવી શકે.',
    260
  );

  const leadLocation = leadArticle?.location || 'બેંગલુરુ';

  // 3. 7 Fast Tech Wire Updates (Right 4 cols)
  const techBulletin = [
    { title: cleanHeadline(pool[0]?.printHeadline || pool[0]?.titleGu) || 'ભારત 6G એલાયન્સ: ૨૦૩૦ સુધીમાં સ્વદેશી હાઇ-સ્પીડ 6G રોલઆઉટ પ્લાન', time: '૧૦:૧૫ AM', cat: 'ટેલિકોમ' },
    { title: cleanHeadline(pool[1]?.printHeadline || pool[1]?.titleGu) || 'ગૂગલ અને મેટા દ્વારા ભારતીય ભાષાઓ માટે અદ્યતન AI ટૂલ્સ લોન્ચ', time: '૧૧:૩૦ AM', cat: 'AI ટૂલ્સ' },
    { title: cleanHeadline(pool[2]?.printHeadline || pool[2]?.titleGu) || 'સોલિડ સ્ટેટ બેટરી: ઇલેક્ટ્રિક કાર ૧૦ મિનિટમાં ૮૦૦ કિમી ચાર્જ થશે', time: '૧૨:૪૫ PM', cat: 'ઈવી ટેક' },
    { title: cleanHeadline(pool[3]?.printHeadline || pool[3]?.titleGu) || 'ભારત સાયબર સેલ: ડીપફેક અને ઓનલાઇન સ્કેમ રોકવા AI ડિટેક્ટર સક્રિય', time: '૦૨:૧૫ PM', cat: 'સિક્યોરિટી' },
    { title: cleanHeadline(pool[4]?.printHeadline || pool[4]?.titleGu) || 'સેમસંગ અને શાઓમી દ્વારા નવા ફોલ્ડેબલ સ્માર્ટફોન્સ રજૂ કરાયા', time: '૦૩:૩૦ PM', cat: 'ગેજેટ્સ' },
    { title: cleanHeadline(pool[5]?.printHeadline || pool[5]?.titleGu) || 'ISRO સ્પેસ ટેક: ખાનગી રોકેટ સ્ટાર્ટઅપ્સને શ્રીહરિકોટા લોન્ચપેડ મંજૂરી', time: '૦૪:૪૫ PM', cat: 'સ્પેસ' },
    { title: cleanHeadline(pool[6]?.printHeadline || pool[6]?.titleGu) || 'હ્યુમનોઇડ રોબોટ્સ: ફેક્ટરીઓમાં વેરહાઉસિંગ અને એસેમ્બલી કામ સંભાળશે', time: '૦૬:૦૦ PM', cat: 'રોબોટિક્સ' },
  ];

  // 4. Secondary Tech Stories (2 prominent stories with photos)
  const secTech1 = {
    title: cleanHeadline(pool[7]?.printHeadline || pool[7]?.titleGu) || 'સાયબર સિક્યોરિટી એલર્ટ: ક્વોન્ટમ એન્ક્રિપ્શન દ્વારા બેંકિંગ અને સરકારી ડેટા સુરક્ષિત',
    image: pool[7]?.featuredImage || 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[7]?.excerptGu || pool[7]?.contentGu || 'હેકિંગ અને ડેટા ચોરી સામે રક્ષણ મેળવવા ભારતીય ટેક ફર્મ્સ ક્વોન્ટમ કી ડિસ્ટ્રિબ્યુશન (QKD) ટેકનોલોજી અપનાવી રહી છે.', 240),
    tag: 'સાયબર ડિફેન્સ',
    byline: 'સાયબર સિક્યોરિટી ડેસ્ક',
    art: pool[7]
  };

  const secTech2 = {
    title: cleanHeadline(pool[8]?.printHeadline || pool[8]?.titleGu) || 'સ્વાયત્ત વાહનો (Autonomous EVs): AI સંચાલિત ડ્રાઈવરલેસ ટેક્સીનું ભારતીય શહેરોમાં ટેસ્ટિંગ',
    image: pool[8]?.featuredImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[8]?.excerptGu || pool[8]?.contentGu || 'લાઇડાર સેન્સર્સ અને સેટેલાઇટ નેવિગેશનથી સજ્જ સેલ્ફ-ડ્રાઇવિંગ વાહનો ટ્રાફિક અકસ્માતો ઘટાડવામાં ૯૯% સચોટ સાબિત થયા છે.', 240),
    tag: 'ઓટો ટેક',
    byline: 'ઓટોમોટિવ એનાલિસિસ',
    art: pool[8]
  };

  // 5. Special In-Depth Spotlight (2 Ground Reports with Photos)
  const spotTech1 = {
    title: cleanHeadline(pool[9]?.printHeadline || pool[9]?.titleGu) || 'ગુજરાતમાં સેમિકન્ડક્ટર હબ: સાણંદ અને ધોલેરામાં અદ્યતન ચિપ ફેબ્રિકેશન યુનિટ્સ સજ્જ',
    image: pool[9]?.featuredImage || 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=400&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[9]?.excerptGu || pool[9]?.contentGu || 'માઇક્રોન અને ટાટા ઇલેક્ટ્રોનિક્સ દ્વારા ગુજરાતમાં ચિપ પેકેજિંગ અને ફેબ યુનિટ્સ શરૂ થતાં ભારત વૈશ્વિક સેમિકન્ડક્ટર નકશા પર ચમકશે.', 240),
    badge: 'વિશેષ રિપોર્ટ',
    category: 'સેમિકન્ડક્ટર',
    byline: 'સેમિકન્ડક્ટર બ્યુરો',
    art: pool[9]
  };

  const spotTech2 = {
    title: cleanHeadline(pool[10]?.printHeadline || pool[10]?.titleGu) || 'ક્લાઉડ કમ્પ્યુટિંગ & ડેટા સેન્ટર્સ: ભારતમાં $૧૦ અબજનું હાઇપરસ્કેલ ઇન્વેસ્ટમેન્ટ',
    image: pool[10]?.featuredImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[10]?.excerptGu || pool[10]?.contentGu || 'ગ્રીન એનર્જી સંચાલિત વિશાળ ડેટા સેન્ટર્સ સ્થાપવા મુંબઈ, ચેન્નાઈ અને નોઈડા ખાતે વૈશ્વિક ક્લાઉડ પ્રોવાઇડર્સ સાથે કરાર થયા.', 240),
    badge: 'ક્લાઉડ ટેક',
    category: 'ડેટા સેન્ટર',
    byline: 'ક્લાઉડ એનાલિસ્ટ',
    art: pool[10]
  };

  // 6. 4-Tech Domain Matrix with photos
  const smartphonesDomain = {
    title: 'સ્માર્ટફોન્સ & ચિપસેટ',
    img: pool[11]?.featuredImage || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'QUALCOMM', title: cleanHeadline(pool[11]?.printHeadline || pool[11]?.titleGu) || 'સ્નેપડ્રેગન ૮ જેન ૪ માં ૪૦% પાવર સેવિંગ ક્ષમતા' },
      { loc: 'APPLE', title: cleanHeadline(pool[12]?.printHeadline || pool[12]?.titleGu) || 'ભારતમાં આઇફોન ઉત્પાદન હિસ્સેદારી ૨૫% પહોંચી' },
      { loc: 'ONEPLUS', title: cleanHeadline(pool[13]?.printHeadline || pool[13]?.titleGu) || 'નવી ૧૫૦W સુપરવૂક ફાસ્ટ ચાર્જિંગ ટેકનોલોજી' },
    ]
  };

  const aiSoftwareDomain = {
    title: 'AI & સોફ્ટવેર ટૂલ્સ',
    img: pool[14]?.featuredImage || 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'GOOGLE', title: cleanHeadline(pool[14]?.printHeadline || pool[14]?.titleGu) || 'જેમિની AI એસિસ્ટન્ટ તમામ એન્ડ્રોઇડ ફોનમાં સંકલિત' },
      { loc: 'MICROSOFT', title: cleanHeadline(pool[15]?.printHeadline || pool[15]?.titleGu) || 'કોપાઇલટ પ્રોમાં કોડિંગ અને ઓફિસ ટૂલ્સ અપગ્રેડ' },
      { loc: 'ANTHROPIC', title: cleanHeadline(pool[16]?.printHeadline || pool[16]?.titleGu) || 'ક્લોડ ૩.૫ સોનેટ તર્કશક્તિ અને કોડિંગમાં અવ્વલ' },
    ]
  };

  const evRenewableDomain = {
    title: 'ઈવી & બેટરી ટેક',
    img: pool[17]?.featuredImage || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'BATTERY', title: cleanHeadline(pool[17]?.printHeadline || pool[17]?.titleGu) || 'સોડિયમ-આયન બેટરીનું ભારતમાં કોમર્શિયલ ઉત્પાદન' },
      { loc: 'CHARGING', title: cleanHeadline(pool[18]?.printHeadline || pool[18]?.titleGu) || 'નેશનલ હાઇવે પર દર ૨૫ કિમીએ અલ્ટ્રાફાસ્ટ ચાર્જર' },
      { loc: 'DRIVE', title: cleanHeadline(pool[19]?.printHeadline || pool[19]?.titleGu) || 'સ્માર્ટ BMS સિસ્ટમથી બેટરી લાઇફ ૮ વર્ષ સુધી વધશે' },
    ]
  };

  const spaceQuantumDomain = {
    title: 'સ્પેસ & ક્વોન્ટમ ટેક',
    img: pool[20]?.featuredImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'ISRO', title: cleanHeadline(pool[20]?.printHeadline || pool[20]?.titleGu) || 'રીયૂઝેબલ લોન્ચ વ્હીકલ (RLV) લેન્ડિંગ પ્રયોગ સફળ' },
      { loc: 'QUANTUM', title: cleanHeadline(pool[21]?.printHeadline || pool[21]?.titleGu) || 'નેશનલ ક્વોન્ટમ મિશન હેઠળ ૫૦-ક્યુબિટ કમ્પ્યુટર' },
      { loc: 'SATELLITE', title: cleanHeadline(pool[22]?.printHeadline || pool[22]?.titleGu) || 'લો-અર્થ ઓર્બિટ સેટેલાઇટ બ્રોડબેન્ડ સર્વિસ શરૂ' },
    ]
  };

  // 7. 8 Gadgets, Apps & Innovations Grid (2 rows of 4 cols with photos)
  const techGridStories = [
    {
      gadget: 'સ્માર્ટવોચ',
      title: cleanHeadline(pool[23]?.printHeadline || pool[23]?.titleGu) || 'AI હેલ્થ ટ્રેકિંગ અને ECG મોનિટરિંગ સાથે નવી સ્માર્ટવોચ',
      summary: getCleanText(pool[23]?.excerptGu || pool[23]?.contentGu || 'રક્તમાં સુગર લેવલ અને હૃદયના ધબકારાનું ૨૪ કલાક નોન-ઇન્વેસિવ મોનિટરિંગ.', 60),
      image: pool[23]?.featuredImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80',
    },
    {
      gadget: 'લેપટોપ્સ',
      title: cleanHeadline(pool[24]?.printHeadline || pool[24]?.titleGu) || 'ARM આર્કિટેક્ચર AI લેપટોપ્સ: ૨૪ કલાકની બેટરી લાઇફ',
      summary: getCleanText(pool[24]?.excerptGu || pool[24]?.contentGu || 'ઓન-ડિવાઇસ ન્યુરલ પ્રોસેસિંગ સાથે અલ્ટ્રા ફાસ્ટ પરફોર્મન્સ ઉપલબ્ધ.', 60),
      image: pool[24]?.featuredImage || 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&auto=format&fit=crop&q=80',
    },
    {
      gadget: 'VR હેડસેટ',
      title: cleanHeadline(pool[25]?.printHeadline || pool[25]?.titleGu) || 'સ્પેશિયલ કમ્પ્યુટિંગ અને 4K મિક્સ્ડ રિયાલિટી ચશ્મા લોન્ચ',
      summary: getCleanText(pool[25]?.excerptGu || pool[25]?.contentGu || 'ઓનલાઇન વર્કસ્પેસ અને એન્ટરટેઇનમેન્ટ માટે 3D વર્ચ્યુઅલ સ્ક્રીન.', 60),
      image: pool[25]?.featuredImage || 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=300&auto=format&fit=crop&q=80',
    },
    {
      gadget: 'ડ્રોન ટેક',
      title: cleanHeadline(pool[26]?.printHeadline || pool[26]?.titleGu) || 'કૃષિ અને લોજિસ્ટિક્સ માટે મેડ ઇન ઇન્ડિયા હેવી-લિફ્ટ ડ્રોન',
      summary: getCleanText(pool[26]?.excerptGu || pool[26]?.contentGu || '૫૦ કિલો પેલોડ ક્ષમતા સાથે છેવાડાના વિસ્તારોમાં દવા અને ખાતર ડિલિવરી.', 60),
      image: pool[26]?.featuredImage || 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=300&auto=format&fit=crop&q=80',
    },
    {
      gadget: 'વાયરલેસ ઑડિયો',
      title: cleanHeadline(pool[27]?.printHeadline || pool[27]?.titleGu) || 'લોસલેસ હાઇ-રેસ ઓડિયો અને એડપ્ટિવ નોઇઝ કેન્સલેશન ઇયરબડ્સ',
      summary: getCleanText(pool[27]?.excerptGu || pool[27]?.contentGu || 'સ્પેશિયલ ઑડિયો અને લાંબી બેટરી ક્ષમતા સાથે પ્રીમિયમ સાઉન્ડ.', 60),
      image: pool[27]?.featuredImage || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&auto=format&fit=crop&q=80',
    },
    {
      gadget: 'સ્માર્ટ હોમ',
      title: cleanHeadline(pool[28]?.printHeadline || pool[28]?.titleGu) || 'મેટર પ્રોટોકોલ આધારિત ઓટોમેટેડ હોમ સિક્યોરિટી એપ્લાયન્સિસ',
      summary: getCleanText(pool[28]?.excerptGu || pool[28]?.contentGu || 'વોઇસ કમાન્ડથી લાઈટ્સ, એસી અને સિક્યોરિટી કેમેરાનું સીમલેસ સંચાલન.', 60),
      image: pool[28]?.featuredImage || 'https://images.unsplash.com/photo-1558002038-1055907df827?w=300&auto=format&fit=crop&q=80',
    },
    {
      gadget: 'સાયબર ટૂલ્સ',
      title: cleanHeadline(pool[29]?.printHeadline || pool[29]?.titleGu) || 'પાસવર્ડલેસ પાસકી સિક્યોરિટી તમામ ભારતીય બેંકિંગમાં લાગુ',
      summary: getCleanText(pool[29]?.excerptGu || pool[29]?.contentGu || 'બાયોમેટ્રિક ફિંગરપ્રિન્ટ અને ફેસ આઈડી દ્વારા ૧૦૦% સેફ લોગિન.', 60),
      image: pool[29]?.featuredImage || 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=300&auto=format&fit=crop&q=80',
    },
    {
      gadget: 'ગ્રીન ગેજેટ્સ',
      title: cleanHeadline(pool[30]?.printHeadline || pool[30]?.titleGu) || 'સોલાર પાવર્ડ પોર્ટેબલ પાવર સ્ટેશન્સ અને ઇકો ચાર્જર્સ',
      summary: getCleanText(pool[30]?.excerptGu || pool[30]?.contentGu || 'કેમ્પિંગ અને આઉટડોર વર્ક માટે રિન્યુએબલ એનર્જી બેકઅપ ડિવાઇસ.', 60),
      image: pool[30]?.featuredImage || 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=300&auto=format&fit=crop&q=80',
    },
  ];

  // 8. Tech Pulse Briefs (6 columns)
  const techPulseBriefs = [
    { label: '5G કનેક્ટિવિટી', text: 'દેશના તમામ જિલ્લાઓમાં 5G નેટવર્ક કવરેજ ૧૦૦% પૂર્ણ થયું.', ref: 'DoT બ્યુરો' },
    { label: 'AI સ્ટાર્ટઅપ્સ', text: 'ભારતમાં AI ફાઉન્ડ્રી હેઠળ નવા ૨૫૦ સ્ટાર્ટઅપ્સને ગ્રાન્ટ મળી.', ref: 'NASSCOM' },
    { label: 'ચિપ ફેબ્રિકેશન', text: 'ધોલેરા સેમિકન્ડક્ટર પ્લાન્ટમાં પ્રથમ વેફર પ્રોડક્શન ૨૦૨૫ અંતે.', ref: 'ISM ઇન્ડિયા' },
    { label: 'ડેટા પ્રાઇવસી', text: 'DPDP કાયદા હેઠળ કંપનીઓએ ડેટા સુરક્ષા ઓડિટ પૂર્ણ કરવું પડશે.', ref: 'મેઇટી (MeitY)' },
    { label: 'ગ્રીન ડેટા સેન્ટર', text: 'ભારતમાં નવા ડેટા સેન્ટર્સ ૮૦% રિન્યુએબલ પાવર પર કાર્યરત.', ref: 'ક્લાઉડ બોર્ડ' },
    { label: 'સાયબર હેલ્પલાઇન', text: 'ઓનલાઇન નાણાકીય છેતરપિંડી સામે ૧૯૩૦ હેલ્પલાઇન ૨૪ કલાક સક્રિય.', ref: 'I4C સેલ' },
  ];

  return (
    <div className="h-full flex flex-col p-2 bg-white border-[3px] border-slate-900 box-border text-slate-900 font-sans select-none overflow-hidden space-y-0.5 justify-between">
      {/* ==================== 1. TECH RUNNING HEADER & FOLIO ==================== */}
      <header className="shrink-0">
        <div className="flex items-center justify-between text-[7.5px] font-bold text-slate-800 border-b border-slate-300 pb-0.5 mb-0.5">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-950 uppercase">ગુજરાત પોસ્ટ</span>
            <span className="text-slate-400">•</span>
            <span className="text-[#B3121B] font-black uppercase">સાયન્સ, ટેકનોલોજી & ગેજેટ્સ</span>
            <span className="text-slate-400">•</span>
            <span>{gujaratiDateStr}</span>
          </div>
          <div className="flex items-center gap-2 font-extrabold">
            <span>ટેકનોલોજી ડેસ્ક</span>
            <span>•</span>
            <span className="bg-[#B3121B] text-white px-1.5 py-0.2 rounded-xs text-[7px] font-black uppercase">
              પાનું ૮ / ૧૪
            </span>
            <span>•</span>
            <span>₹ ૧૫.૦૦</span>
          </div>
        </div>

        {/* Section Masthead Banner */}
        <div className="bg-slate-950 text-white px-2 py-0.5 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[8.5px] font-black uppercase tracking-wider rounded-xs flex items-center gap-1">
              <Cpu className="h-2.5 w-2.5" />
              <span>ટેક ક્રાંતિ • INNOVATION & DIGITAL FUTURE</span>
            </span>
            <span className="text-slate-300 text-[8px] font-bold truncate">
              આર્ટિફિશિયલ ઇન્ટેલિજન્સ, સેમિકન્ડક્ટર, સ્માર્ટફોન, સાયબર સુરક્ષા અને સ્પેસ ટેક
            </span>
          </div>
          <div className="flex items-center gap-1 text-amber-300 text-[7.5px] font-extrabold shrink-0">
            <Sparkles className="h-2.5 w-2.5" />
            <span>બેંગલુરુ-સિલિકોન વેલી ડેસ્ક</span>
          </div>
        </div>

        {/* Tech Ticker Ribbon */}
        <div className="grid grid-cols-4 gap-1 bg-slate-100 border-x border-b border-slate-300 p-0.5 text-[6.8px] font-bold text-slate-700">
          {techTicker.map((t, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-0.5 flex flex-col justify-between">
              <span className="text-slate-500 font-extrabold truncate">{t.brand}</span>
              <span className="text-[7.5px] font-black text-slate-950 truncate">{t.news}</span>
              <span className="text-[5.8px] font-bold text-indigo-700">{t.status}</span>
            </div>
          ))}
        </div>
      </header>

      {/* ==================== 2. UPPER TECH GRID (8 COLS LEAD + 4 COLS BULLETIN) ==================== */}
      <section className="grid grid-cols-12 gap-2 border-b-2 border-slate-900 pb-1 pt-0.5 shrink-0 items-stretch">
        {/* Left 8 Columns: Dominant Lead AI Story */}
        <div className="col-span-8 border-r-2 border-slate-900 pr-2 space-y-0.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[7px] font-bold text-slate-600 mb-0.2">
              <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[7px] font-black rounded-xs uppercase">
                AI ક્રાંતિ • ઇન્ડિયા AI મિશન
              </span>
              <span>બેંગલુરુ AI સેન્ટર</span>
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
                <span className="text-[#B3121B] font-bold shrink-0 ml-1">► ટેક એનાલિસિસ</span>
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
                  <span>• ₹૧૦,૩૭૨ કરોડ AI મિશન</span>
                  <span>• ૧૦,૦૦૦ GPU ક્લસ્ટર</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>• સ્થાનિક LLM મોડેલ્સ</span>
                  <span>• ૫ ગણી ઉત્પાદકતા</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Columns: 7 Fast Tech Bulletins */}
        <div className="col-span-4 flex flex-col justify-between space-y-0.5 bg-slate-50 p-1 border border-slate-300">
          <div className="flex items-center justify-between border-b border-slate-300 pb-0.5">
            <span className="bg-slate-900 text-amber-300 text-[7px] font-black px-1.5 py-0.2 rounded-xs uppercase">
              ટેક ડાયરી • 7 FAST UPDATES
            </span>
            <span className="text-[#B3121B] text-[6.5px] font-bold">ટેક લાઈવ</span>
          </div>

          <div className="space-y-0.5 flex-1 flex flex-col justify-between">
            {techBulletin.map((item, idx) => (
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
            <span>સિલિકોન & ગેજેટ બ્યુરો</span>
            <span className="text-[#B3121B]">► સંપૂર્ણ લિસ્ટ પાના ૮ પર</span>
          </div>
        </div>
      </section>

      {/* ==================== 3. 2 PROMINENT SECONDARY TECH STORIES (WITH PHOTOS) ==================== */}
      <section className="grid grid-cols-2 gap-2.5 border-b-2 border-slate-900 pb-1 pt-0.5 shrink-0">
        {/* Story 1 */}
        <div className="space-y-0.5 border-r border-slate-300 pr-2.5">
          <div className="flex items-center justify-between text-[7px] font-bold text-slate-500">
            <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[6.5px] font-black rounded-xs uppercase">
              {secTech1.tag}
            </span>
            <span className="text-[#B3121B] font-bold">► સાયબર સુરક્ષા</span>
          </div>

          <h3 className="text-[10.5px] font-black leading-tight text-slate-950 line-clamp-1">
            {secTech1.title}
          </h3>

          <div className="flex gap-2 items-start mt-0.5">
            <div className="w-[100px] shrink-0 space-y-0.5">
              <div className="w-[100px] h-[66px] overflow-hidden border border-slate-300 bg-slate-100">
                <img src={secTech1.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                તસવીર: ગુજરાત પોસ્ટ
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between min-h-[66px] space-y-0.5">
              <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                {secTech1.summary}
              </p>
              <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                <span className="text-slate-800 font-extrabold truncate">
                  {secTech1.byline}
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
              {secTech2.tag}
            </span>
            <span className="text-[#B3121B] font-bold">► સ્વાયત્ત ઈવી</span>
          </div>

          <h3 className="text-[10.5px] font-black leading-tight text-slate-950 line-clamp-1">
            {secTech2.title}
          </h3>

          <div className="flex gap-2 items-start mt-0.5">
            <div className="w-[100px] shrink-0 space-y-0.5">
              <div className="w-[100px] h-[66px] overflow-hidden border border-slate-300 bg-slate-100">
                <img src={secTech2.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                તસવીર: ગુજરાત પોસ્ટ
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between min-h-[66px] space-y-0.5">
              <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                {secTech2.summary}
              </p>
              <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                <span className="text-slate-800 font-extrabold truncate">
                  {secTech2.byline}
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
            <span>સેમિકન્ડક્ટર & ક્લાઉડ ટેક સમીક્ષા (SEMICONDUCTOR & CLOUD TECH SPOTLIGHT)</span>
          </span>
          <span className="text-[6.5px] font-bold text-slate-600">ગુજરાત ચિપ ફેબ્સ & હાઇપરસ્કેલ ડેટા સેન્ટર્સ</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Spot 1 */}
          <div className="space-y-0.5 border-r border-slate-300 pr-2.5">
            <div className="flex items-center justify-between text-[6.5px] font-bold">
              <span className="bg-indigo-800 text-white px-1.5 py-0.1 text-[6px] font-black rounded-xs uppercase">
                {spotTech1.badge} • {spotTech1.category}
              </span>
              <span className="text-[#B3121B] font-bold">► ચિપ પ્લાન્ટ</span>
            </div>

            <h4 className="text-[10px] font-black leading-tight text-slate-950 line-clamp-1">
              {spotTech1.title}
            </h4>

            <div className="flex gap-2 items-start mt-0.5">
              <div className="w-[100px] shrink-0 space-y-0.5">
                <div className="w-[100px] h-[66px] overflow-hidden border border-slate-300 bg-slate-100">
                  <img src={spotTech1.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
                </div>
                <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                  તસવીર: ગુજરાત પોસ્ટ
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between min-h-[66px] space-y-0.5">
                <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                  {spotTech1.summary}
                </p>
                <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                  <span className="text-slate-800 font-extrabold truncate">
                    {spotTech1.byline}
                  </span>
                  <span className="text-[#B3121B] font-black shrink-0">
                    ફેબ પાના ૦૮
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Spot 2 */}
          <div className="space-y-0.5">
            <div className="flex items-center justify-between text-[6.5px] font-bold">
              <span className="bg-emerald-800 text-white px-1.5 py-0.1 text-[6px] font-black rounded-xs uppercase">
                {spotTech2.badge} • {spotTech2.category}
              </span>
              <span className="text-[#B3121B] font-bold">► ક્લાઉડ ટેક</span>
            </div>

            <h4 className="text-[10px] font-black leading-tight text-slate-950 line-clamp-1">
              {spotTech2.title}
            </h4>

            <div className="flex gap-2 items-start mt-0.5">
              <div className="w-[100px] shrink-0 space-y-0.5">
                <div className="w-[100px] h-[66px] overflow-hidden border border-slate-300 bg-slate-100">
                  <img src={spotTech2.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
                </div>
                <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                  તસવીર: ગુજરાત પોસ્ટ
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between min-h-[66px] space-y-0.5">
                <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                  {spotTech2.summary}
                </p>
                <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                  <span className="text-slate-800 font-extrabold truncate">
                    {spotTech2.byline}
                  </span>
                  <span className="text-[#B3121B] font-black shrink-0">
                    ડેટા પાના ૦૬
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 5. 4-TECH DOMAIN MATRIX (WITH PHOTOS) ==================== */}
      <section className="border-b-2 border-slate-900 pb-0.5 shrink-0">
        <div className="flex items-center justify-between text-[7px] font-black text-slate-950 mb-0.5 border-b border-slate-300 pb-0.2">
          <span className="bg-slate-900 text-white px-1 py-0.2 text-[6.5px] uppercase rounded-xs">
            ૪ ટેકનોલોજી ક્ષેત્રો • 4 TECH DOMAINS
          </span>
          <span className="text-slate-500 text-[6.5px]">સ્માર્ટફોન્સ • AI & સોફ્ટવેર • ઈવી & બેટરી • સ્પેસ & ક્વોન્ટમ</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {/* Domain 1: Smartphones */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-[#B3121B] text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {smartphonesDomain.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={smartphonesDomain.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {smartphonesDomain.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► ગેજેટ રિપોર્ટ</span>
          </div>

          {/* Domain 2: AI Software */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-slate-900 text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {aiSoftwareDomain.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={aiSoftwareDomain.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {aiSoftwareDomain.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► AI રિપોર્ટ</span>
          </div>

          {/* Domain 3: EV & Battery */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-amber-700 text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {evRenewableDomain.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={evRenewableDomain.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {evRenewableDomain.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► ઈવી રિપોર્ટ</span>
          </div>

          {/* Domain 4: Space & Quantum */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-emerald-800 text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {spaceQuantumDomain.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={spaceQuantumDomain.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {spaceQuantumDomain.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► સ્પેસ રિપોર્ટ</span>
          </div>
        </div>
      </section>

      {/* ==================== 6. 8 GADGETS, APPS & INNOVATIONS GRID (2 ROWS OF 4 COLS) ==================== */}
      <section className="border-b-2 border-slate-900 pb-0.5 pt-0.2 shrink-0 space-y-0.5">
        <div className="flex items-center justify-between text-[7px] font-black text-slate-950 border-b border-slate-300 pb-0.2">
          <span className="bg-[#B3121B] text-white px-1 py-0.2 text-[6.5px] uppercase rounded-xs flex items-center gap-1">
            <Newspaper className="h-2 w-2" />
            <span>ગેજેટ્સ, એપ્સ & ઇનોવેશન ડાયરી (GADGETS & TECH INNOVATION DIGEST)</span>
          </span>
          <span className="text-slate-500 text-[6.2px]">ટેક જગતના ૮ અગ્રણી ઉપકરણો અને શોધો</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {techGridStories.map((item, idx) => (
            <div
              key={idx}
              className={`space-y-0.5 ${idx % 4 !== 3 ? 'border-r border-slate-300 pr-1.5' : ''} ${idx >= 4 ? 'pt-0.5 border-t border-slate-200' : ''}`}
            >
              <div className="flex items-center justify-between text-[6.5px] font-bold text-slate-500">
                <span className="text-[#B3121B] font-black uppercase">[{item.gadget}]</span>
                <span className="text-[5.8px] text-slate-400">ટેક</span>
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

      {/* ==================== 7. TECH PULSE BRIEFS (6 COLUMNS) ==================== */}
      <section className="shrink-0 space-y-0.5 border-b border-slate-400 pb-0.5">
        <div className="flex items-center gap-1.5 border-b border-slate-300 pb-0.2">
          <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[7px] font-black uppercase rounded-xs">
            ટેક પલ્સ • DIGITAL INDIA BRIEFS
          </span>
          <span className="text-[6.5px] text-slate-500 font-bold">ટેલિકોમ, સેમિકન્ડક્ટર અને સાયબર સિક્યોરિટી એલર્ટ્સ</span>
        </div>

        <div className="grid grid-cols-6 gap-1 pt-0.2">
          {techPulseBriefs.map((brief, idx) => (
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

      {/* ==================== 8. DIGITAL SECURITY ADVISORY STRIP ==================== */}
      <section className="bg-slate-50 border border-dashed border-slate-400 p-0.5 rounded-xs flex items-center justify-between text-[6.5px] font-bold text-slate-700 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="bg-slate-900 text-amber-300 px-1 py-0.2 rounded-xs text-[6px] font-black uppercase flex items-center gap-0.5">
            <ShieldCheck className="h-2 w-2" />
            <span>CERT-In સાયબર સુરક્ષા બ્યુરો</span>
          </span>
          <span>કોઈપણ શંકાસ્પદ OTP કે લિંક શેર કરશો નહીં. સાયબર ફ્રોડ ફરિયાદ માટે <strong>1930</strong> પર કૉલ કરો.</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <span>પોર્ટલ: <strong>cybercrime.gov.in</strong></span>
          <span>•</span>
          <span className="text-[#B3121B] font-black">પ્રમાણિત ડિજિટલ ડેસ્ક</span>
        </div>
      </section>

      {/* ==================== 9. BROADSHEET NEWSPAPER FOOTER ==================== */}
      <footer className="border-t border-slate-400 pt-0.5 pb-0.5 flex items-center justify-between text-[7px] font-bold text-slate-600 shrink-0">
        <div>
          <span>© ગુજરાત પોસ્ટ ટેકનોલોજી બ્યુરો, {displayCity} • બેંગલુરુ • હૈદરાબાદ • સાણંદ • સિલિકોન વેલી</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#B3121B] font-black uppercase">WWW.GUJARATPOST.IN</span>
          <span>•</span>
          <span>પાનું ૮ / ૧૪</span>
        </div>
      </footer>
    </div>
  );
};
