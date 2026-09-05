'use client';

import React from 'react';
import { EPaperPageData, getCleanText, formatGujaratiDate, BroadsheetArticle } from '../types';
import { MapPin, Building, AlertCircle, Clock, Shield, Flame, Activity, PhoneCall, Bus, Droplets, CheckCircle2, ShieldCheck, Newspaper } from 'lucide-react';

interface TemplateProps {
  data: EPaperPageData;
}

// Clean any raw '#92 - ' or ID prefix from headlines
const cleanHeadline = (text?: string) => {
  if (!text) return '';
  return text.replace(/^#\d+\s*[-–—:]\s*/, '').trim();
};

export const LocalCityTemplate: React.FC<TemplateProps> = ({ data }) => {
  const {
    pageNumber = 2,
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

  // 1. Weather & Civic Ticker
  const cityMetrics = [
    { label: 'તાપમાન', val: '૩૪°C / ૨૫°C', sub: 'મહત્તમ / લઘુત્તમ' },
    { label: 'હવાની ગુણવત્તા (AQI)', val: '૯૨ (મધ્યમ)', sub: 'સાબરમતી / પાલડી સ્ટેશન' },
    { label: 'મેટ્રો ટ્રેન ફ્રિક્વન્સી', val: 'દર ૬ મિનિટે', sub: 'મોટેરા થી APMC લાઇન' },
    { label: 'AMC ફરિયાદ નિવારણ', val: '૧૫૫૩૦૩ હેલ્પલાઇન', sub: '૨૪ કલાક સેવારત' },
  ];

  // 2. Lead City Investigation Story
  const rawLeadHeadline =
    leadArticle?.printHeadline ||
    leadArticle?.titleGu ||
    leadArticle?.title ||
    'અમદાવાદ મ્યુનિસિપલ કોર્પોરેશનનો ₹૧૨,૫૦૦ કરોડનો સ્માર્ટ સિટી ડ્રાફ્ટ મંજૂર: નવા ૪ ફ્લાયઓવર, ૨૪ કલાક પાણી અને ફ્લાવર પાર્કનું આયોજન';
  const leadHeadline = cleanHeadline(rawLeadHeadline);

  const leadImage =
    leadArticle?.featuredImage ||
    'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop&q=80';

  const leadCaption =
    leadArticle?.photoCredit || 'તસવીર: ગુજરાત પોસ્ટ • દાણાપીઠ AMC મુખ્યાલય ખાતે સ્ટેન્ડિંગ કમિટીની બેઠકમાં શહેરના મહત્વના પ્રોજેક્ટ્સને મંજૂરી';

  const leadSummary =
    leadArticle?.printSummary ||
    getCleanText(
      leadArticle?.excerptGu ||
        leadArticle?.excerpt ||
        leadArticle?.contentGu ||
        leadArticle?.content ||
        'અમદાવાદ મ્યુનિસિપલ કોર્પોરેશન (AMC) દ્વારા શહેરના સર્વાંગી વિકાસ માટે ઐતિહાસિક બજેટ મંજૂર કરવામાં આવ્યું છે. પશ્ચિમ અને પૂર્વ ઝોનમાં ટ્રાફિક સમસ્યા નિવારવા નવા ૪ ફ્લાયઓવર બ્રિજ તથા સાબરમતી રિવરફ્રન્ટ ફેઝ-૨ માટે ₹૮૦૦ કરોડની જોગવાઈ કરાઈ છે. શહેરના ૪૮ વોર્ડમાં પાયાની સુવિધાઓ સુદ્રઢ બનશે.',
      280
    );

  const leadSecondParagraph = getCleanText(
    leadArticle?.contentGu ||
      leadArticle?.content ||
      'તમામ વોર્ડમાં પીવાના શુદ્ધ પાણી માટે નવી પાઇપલાઇન અને ડ્રેનેજ સિસ્ટમનું આધુનિકીકરણ કરાશે. પ્રદૂષણ નિયંત્રણ માટે વધુ ૩૦૦ ઇલેક્ટ્રિક એરકન્ડિશન્ડ બસો બીઆરટીએસ અને એએમટીએસ કાફલામાં સામેલ કરવામાં આવશે જેથી જાહેર પરિવહનને મોટો વેગ મળશે.',
    260
  );

  const leadLocation = leadArticle?.location || 'અમદાવાદ';

  // 3. 7 City Quick Stories (Right 4 cols)
  const cityBulletin = [
    { title: cleanHeadline(pool[0]?.printHeadline || pool[0]?.titleGu) || 'એસ.જી. હાઇવે ઇસ્કોન ફ્લાયઓવર સમારકામ અર્થે રાત્રિ ડાયવર્ઝન જાહેર', time: '૧૦:૧૫ AM', cat: 'ટ્રાફિક' },
    { title: cleanHeadline(pool[1]?.printHeadline || pool[1]?.titleGu) || 'કાંકરિયા લેકફ્રન્ટ પરિસરમાં નવું લેસર ફાઉન્ટેન અને ફૂડ કોર્ટ શરૂ', time: '૧૧:૩૦ AM', cat: 'પર્યટન' },
    { title: cleanHeadline(pool[2]?.printHeadline || pool[2]?.titleGu) || 'કોતરપુર વોટર વર્ક્સ ખાતે નવી ફિલ્ટરેશન લાઇનનું ટેસ્ટિંગ પૂર્ણ', time: '૧૨:૪૫ PM', cat: 'જળ સપ્લાય' },
    { title: cleanHeadline(pool[3]?.printHeadline || pool[3]?.titleGu) || 'રિલીફ રોડ અને કાલુપુર માર્કેટમાં AMC દ્વારા ગેરકાયદે દબાણો હટાવાયા', time: '૦૨:૧૫ PM', cat: 'એસ્ટેટ' },
    { title: cleanHeadline(pool[4]?.printHeadline || pool[4]?.titleGu) || 'અમદાવાદ સાયબર ક્રાઇમ સેલ દ્વારા ઓનલાઇન લોન ફ્રોડ ગેંગ ઝડપાઈ', time: '૦૩:૩૦ PM', cat: 'ક્રાઇમ' },
    { title: cleanHeadline(pool[5]?.printHeadline || pool[5]?.titleGu) || 'શહેરની ૨૫ સરકારી શાળાઓમાં સ્માર્ટ ડિજિટલ ક્લાસરૂમ્સ કાર્યરત', time: '૦૪:૪૫ PM', cat: 'શિક્ષણ' },
    { title: cleanHeadline(pool[6]?.printHeadline || pool[6]?.titleGu) || 'પાલડી અને વાસણા અર્બન હેલ્થ સેન્ટર ખાતે ફ્રી હેલ્થ ચેકઅપ કેમ્પ', time: '૦૬:૦૦ PM', cat: 'આરોગ્ય' },
  ];

  // 4. Secondary Prominent Metro Stories (2 stories with photos)
  const secMetro1 = {
    title: cleanHeadline(pool[7]?.printHeadline || pool[7]?.titleGu) || 'સાબરમતી રિવરફ્રન્ટ ફેઝ-૨ પ્રોજેક્ટ: ઇન્દિરા બ્રિજ સુધી ૫.૫ કિમી નવો રિવરફ્રન્ટ કોરિડોર',
    image: pool[7]?.featuredImage || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[7]?.excerptGu || pool[7]?.contentGu || 'સાબરમતી નદીના પૂર્વ અને પશ્ચિમ કિનારે ઇકો-ફ્રેન્ડલી વોકવે, સાયકલિંગ ટ્રેક, બાયોડાયવર્સિટી પાર્ક અને મનોરંજન ઝોનનું નિર્માણ પૂરજોશમાં ચાલી રહ્યું છે. આગામી ડિસેમ્બર સુધીમાં પ્રથમ તબક્કો નાગરિકો માટે ખુલ્લો મૂકવામાં આવશે.', 240),
    tag: 'રિવરફ્રન્ટ ફેઝ-૨',
    byline: 'વિશેષ પ્રતિનિધિ, સાબરમતી ડેસ્ક',
    art: pool[7]
  };

  const secMetro2 = {
    title: cleanHeadline(pool[8]?.printHeadline || pool[8]?.titleGu) || 'એસ.જી. હાઇવે અને સિંધુભવન રોડ પર સ્માર્ટ AI સિગ્નલિંગ: ટ્રાફિક જામમાંથી મુક્તિ',
    image: pool[8]?.featuredImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[8]?.excerptGu || pool[8]?.contentGu || 'શહેર ટ્રાફિક પોલીસ અને AMC દ્વારા સંયુક્ત રીતે ૧૨ મુખ્ય જંક્શનો પર સેન્સર-બેઝ્ડ ઓટોમેટિક ટ્રાફિક લાઇટ્સ ઇન્સ્ટોલ કરવામાં આવી છે. વાહનોની ગીચતા મુજબ ટ્રાફિક સિગ્નલ આપોઆપ સમય એડજસ્ટ કરશે.', 240),
    tag: 'સ્માર્ટ ટ્રાફિક',
    byline: 'ક્રાઇમ & ટ્રાફિક બ્યુરો',
    art: pool[8]
  };

  // 5. Special In-Depth Spotlight Row (2 Ground Reports with Photos)
  const spotlight1 = {
    title: cleanHeadline(pool[9]?.printHeadline || pool[9]?.titleGu) || 'અમદાવાદ મેટ્રો ફેઝ-૨: ગાંધીનગર ગિફ્ટ સિટી ટ્રાયલ રન સફળ, આવતા મહિને પ્રવાસીઓ માટે શરૂ',
    image: pool[9]?.featuredImage || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[9]?.excerptGu || pool[9]?.contentGu || 'મોટેરા સ્ટેડિયમથી મહાત્મા મંદિર અને ગિફ્ટ સિટી સુધીની ૨૮ કિમી લાંબી મેટ્રો લાઇનનું સેફ્ટી કમિશનર દ્વારા નિરીક્ષણ પૂર્ણ. દૈનિક ૫૦,૦૦૦ મુસાફરોને આરામદાયક મુસાફરીનો લાભ મળશે.', 240),
    badge: 'વિશેષ રિપોર્ટ',
    category: 'મેટ્રો એક્સપ્રેસ',
    byline: 'મેટ્રો રેલ પ્રોજેક્ટ ડેસ્ક',
    art: pool[9]
  };

  const spotlight2 = {
    title: cleanHeadline(pool[10]?.printHeadline || pool[10]?.titleGu) || 'નવા ૪ ઓવરબ્રિજ નિર્માણ: કાલુપુર, નરોડા, વાસણા અને થલતેજ જંક્શન પર ટ્રાફિક મુક્ત યાતાયાત',
    image: pool[10]?.featuredImage || 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[10]?.excerptGu || pool[10]?.contentGu || 'રેલવે ક્રોસિંગ અને ભારે ટ્રાફિક વાળા જંક્શનો પર ફ્લાયઓવર માટે ₹૬૫૦ કરોડના ટેન્ડર મંજૂર કરાયા. ૨ વર્ષમાં પ્રોજેક્ટ પૂર્ણ કરવાનો સમયગાળો નિયત કરાયો છે.', 240),
    badge: 'ઇન્ફ્રાસ્ટ્રક્ચર',
    category: 'બ્રિજ પ્રોજેક્ટ',
    byline: 'શહેરી વિકાસ બ્યુરો',
    art: pool[10]
  };

  // 6. 4 Zone Columns (West, East, North, Central & South) with Zone Photos
  const westZone = {
    title: 'પશ્ચિમ ઝોન (WEST ZONE)',
    img: pool[11]?.featuredImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'બોડકદેવ', title: cleanHeadline(pool[11]?.printHeadline || pool[11]?.titleGu) || 'વસ્ત્રાપુર તળાવ પાસે નવું સ્પોર્ટ્સ કોમ્પ્લેક્સ મંજૂર' },
      { loc: 'સેટેલાઇટ', title: cleanHeadline(pool[12]?.printHeadline || pool[12]?.titleGu) || 'શ્યામલ ચાર રસ્તા અંડરપાસ રિનોવેશન કામગીરી પૂર્ણ' },
      { loc: 'SBR રોડ', title: cleanHeadline(pool[13]?.printHeadline || pool[13]?.titleGu) || 'સિંધુભવન રોડ પર પેઇડ મલ્ટીલેવલ પાર્કિંગ શરૂ' },
    ]
  };

  const eastZone = {
    title: 'પૂર્વ ઝોન (EAST ZONE)',
    img: pool[14]?.featuredImage || 'https://images.unsplash.com/photo-1596405835955-465de5c3dfb7?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'મણિનગર', title: cleanHeadline(pool[14]?.printHeadline || pool[14]?.titleGu) || 'કાંકરિયા પ્રાણીસંગ્રહાલયમાં નવા વિદેશી પક્ષીઓનું આગમન' },
      { loc: 'નિકોલ', title: cleanHeadline(pool[15]?.printHeadline || pool[15]?.titleGu) || 'નિકોલ-નરોડા રોડ પર વરસાદી પાણી નિકાલ લાઇન તેજ' },
      { loc: 'બાપુનગર', title: cleanHeadline(pool[16]?.printHeadline || pool[16]?.titleGu) || 'ઇન્ડસ્ટ્રીયલ એસ્ટેટમાં ફાયર સેફ્ટી કમ્પ્લાયન્સ ડ્રાઇવ' },
    ]
  };

  const northZone = {
    title: 'ઉત્તર ઝોન (NORTH ZONE)',
    img: pool[17]?.featuredImage || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'સાબરમતી', title: cleanHeadline(pool[17]?.printHeadline || pool[17]?.titleGu) || 'સાબરમતી બુલેટ ટ્રેન સ્ટેશનનું ૮૫% સિવિલ વર્ક પૂર્ણ' },
      { loc: 'ચાંદખેડા', title: cleanHeadline(pool[18]?.printHeadline || pool[18]?.titleGu) || 'ચાંદખેડા-મોટેરા રોડ વાઇડનિંગ અને ફ્લાવર બેડ નિર્માણ' },
      { loc: 'રાણીપ', title: cleanHeadline(pool[19]?.printHeadline || pool[19]?.titleGu) || 'રાણીપ GSRTC બસ ટર્મિનલ પર ફાસ્ટ ઈ-ચાર્જિંગ હબ' },
    ]
  };

  const southCentralZone = {
    title: 'મધ્ય & દક્ષિણ ઝોન',
    img: pool[20]?.featuredImage || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'લાલદરવાજા', title: cleanHeadline(pool[20]?.printHeadline || pool[20]?.titleGu) || 'લાલદરવાજા હેરિટેજ માર્કેટનું રી-ડેવલપમેન્ટ પ્રોજેક્ટ' },
      { loc: 'વાસણા', title: cleanHeadline(pool[21]?.printHeadline || pool[21]?.titleGu) || 'વાસણા બેરેજ પાસે નદી સફાઈ અને ગાર્ડન ડેવલપમેન્ટ' },
      { loc: 'ઇસનપુર', title: cleanHeadline(pool[22]?.printHeadline || pool[22]?.titleGu) || 'દાણીલીમડા-ઇસનપુર ડ્રેનેજ પમ્પિંગ સ્ટેશન ક્ષમતા ડબલ' },
    ]
  };

  // 7. 8 Ward & Neighborhood News Grid (2 rows of 4 cols = 8 stories with photos)
  const wardGridStories = [
    {
      ward: 'વસ્ત્રાપુર',
      title: cleanHeadline(pool[23]?.printHeadline || pool[23]?.titleGu) || 'વસ્ત્રાપુર તળાવ બ્યુટીફિકેશન અને જોગિંગ ટ્રેક તૈયાર',
      summary: getCleanText(pool[23]?.excerptGu || pool[23]?.contentGu || 'તળાવ પરિસરમાં નવો ઓપન જિમ, ચિલ્ડ્રન પ્લે એરિયા અને ગાર્ડનિંગનું લોકાર્પણ કરાયું.', 60),
      image: pool[23]?.featuredImage || 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=300&auto=format&fit=crop&q=80',
      art: pool[23]
    },
    {
      ward: 'આશ્રમ રોડ',
      title: cleanHeadline(pool[24]?.printHeadline || pool[24]?.titleGu) || 'આશ્રમ રોડ સેન્ટ્રલ બિઝનેસ ડિસ્ટ્રિક્ટમાં નવી ગગનચુંબી ઇમારતો',
      summary: getCleanText(pool[24]?.excerptGu || pool[24]?.contentGu || 'રિવરફ્રન્ટ નજીક પ્રીમિયમ કોમર્શિયલ ટાવર્સ માટે વિશેષ FSI પોલીસીને મંજૂરી મળી.', 60),
      image: pool[24]?.featuredImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&auto=format&fit=crop&q=80',
      art: pool[24]
    },
    {
      ward: 'નારણપુરા',
      title: cleanHeadline(pool[25]?.printHeadline || pool[25]?.titleGu) || 'નારણપુરા વર્લ્ડ ક્લાસ સ્પોર્ટ્સ કોમ્પ્લેક્સનું નિર્માણ આખરી તબક્કામાં',
      summary: getCleanText(pool[25]?.excerptGu || pool[25]?.contentGu || 'ઓલિમ્પિક સ્તરના એક્વાટિક પૂલ અને ઇન્ડોર સ્ટેડિયમનું ટ્રાયલ આગામી સપ્તાહે શરૂ થશે.', 60),
      image: pool[25]?.featuredImage || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&auto=format&fit=crop&q=80',
      art: pool[25]
    },
    {
      ward: 'ગોતા-ચાંદલોડિયા',
      title: cleanHeadline(pool[26]?.printHeadline || pool[26]?.titleGu) || 'ગોતા-વંદેમાતરમ રોડ પર નવી સ્ટ્રોમ વોટર ડ્રેનેજ લાઇન',
      summary: getCleanText(pool[26]?.excerptGu || pool[26]?.contentGu || 'ચોમાસામાં પાણી ભરાવાની સમસ્યા નિવારવા ₹૪૫ કરોડના પાઇપલાઇન પ્રોજેક્ટની મંજૂરી.', 60),
      image: pool[26]?.featuredImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&auto=format&fit=crop&q=80',
      art: pool[26]
    },
    {
      ward: 'મણિનગર',
      title: cleanHeadline(pool[27]?.printHeadline || pool[27]?.titleGu) || 'એલ.જી. હોસ્પિટલમાં નવું ૨૦૦ બેડનું અત્યાધુનિક ટ્રોમા સેન્ટર',
      summary: getCleanText(pool[27]?.excerptGu || pool[27]?.contentGu || 'દક્ષિણ અને પૂર્વ અમદાવાદના દર્દીઓ માટે ૨૪ કલાક ફ્રી ઈમરજન્સી અને આઈસીયુ સુવિધા.', 60),
      image: pool[27]?.featuredImage || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=300&auto=format&fit=crop&q=80',
      art: pool[27]
    },
    {
      ward: 'કોટ વિસ્તાર',
      title: cleanHeadline(pool[28]?.printHeadline || pool[28]?.titleGu) || 'હેરિટેજ સિટી વોક અને પોળના ઐતિહાસિક મકાનોનું સંરક્ષણ',
      summary: getCleanText(pool[28]?.excerptGu || pool[28]?.contentGu || 'યુનેસ્કો વર્લ્ડ હેરિટેજ સાઇટના વિકાસ માટે કેન્દ્ર અને રાજ્ય સરકારની સંયુક્ત ગ્રાન્ટ.', 60),
      image: pool[28]?.featuredImage || 'https://images.unsplash.com/photo-1596405835955-465de5c3dfb7?w=300&auto=format&fit=crop&q=80',
      art: pool[28]
    },
    {
      ward: 'બોપલ-ઘુમા',
      title: cleanHeadline(pool[29]?.printHeadline || pool[29]?.titleGu) || 'બોપલ-આંબલી જંક્શન પર નવો ૬-લેન અંડરપાસ અને ફ્લાયઓવર',
      summary: getCleanText(pool[29]?.excerptGu || pool[29]?.contentGu || 'એસ.પી. રિંગ રોડ સાથે કનેક્ટિવિટી સુધારવા ઓડા અને એએમસી દ્વારા કામગીરી તેજ.', 60),
      image: pool[29]?.featuredImage || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&auto=format&fit=crop&q=80',
      art: pool[29]
    },
    {
      ward: 'સાયન્સ સિટી',
      title: cleanHeadline(pool[30]?.printHeadline || pool[30]?.titleGu) || 'સાયન્સ સિટીમાં નવું એડવાન્સ્ડ સ્પેસ એન્ડ એસ્ટ્રોનોમી થીમ પાર્ક',
      summary: getCleanText(pool[30]?.excerptGu || pool[30]?.contentGu || 'વિદ્યાર્થીઓ અને સંશોધકો માટે 3D પ્લેનેટોરિયમ અને રોકેટ મોડલિંગ લેબનું ઉદ્ઘાટન.', 60),
      image: pool[30]?.featuredImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&auto=format&fit=crop&q=80',
      art: pool[30]
    },
  ];

  // 8. City Pulse Briefs (6 columns)
  const cityPulseBriefs = [
    { label: 'પ્રોપર્ટી ટેક્સ', text: 'AMC દ્વારા ઓનલાઇન એડવાન્સ ટેક્સ ભરવા પર ૧૦% રિબેટ સ્કીમ જાહેર.', ref: 'વોર્ડ ટેક્સ ડેસ્ક' },
    { label: 'પીવાનું પાણી', text: 'પૂર્વ ઝોનના ૮ વોર્ડમાં નવી શુદ્ધિકરણ લાઇન દ્વારા ૨૪ કલાક પાણી પુરવઠો.', ref: 'જળ શાખા' },
    { label: 'AMTS / BRTS', text: 'દૈનિક મુસાફરોની સુવિધા માટે ૧૫ નવા રૂટ્સ પર ૫૦ ઈલેક્ટ્રિક બસો કાર્યરત.', ref: 'ટ્રાન્સપોર્ટ બોર્ડ' },
    { label: 'અર્બન હેલ્થ', text: 'શહેરના તમામ સીએચસી કેન્દ્રો પર મફત નિદાન અને દવા વિતરણ કેમ્પ શરૂ.', ref: 'આરોગ્ય શાખા' },
    { label: 'ડોર ટુ ડોર સફાઈ', text: 'ઘન કચરા નિકાલ માટે ૧૦૦% સેગ્રીગેશન અને સ્માર્ટ ટ્રેકિંગ લાગુ.', ref: 'સોલિડ વેસ્ટ શાખા' },
    { label: 'ફાયર સેફ્ટી', text: 'શહેરની હાઈરાઈઝ ઈમારતો અને મોલ્સમાં એનઓસી ચેકિંગ ઝુંબેશ તેજ.', ref: 'ફાયર કંટ્રોલ' },
  ];

  return (
    <div className="h-full flex flex-col p-2 bg-white border-[3px] border-slate-900 box-border text-slate-900 font-sans select-none overflow-hidden space-y-0.5 justify-between">
      {/* ==================== 1. CITY RUNNING HEADER & FOLIO ==================== */}
      <header className="shrink-0">
        <div className="flex items-center justify-between text-[7.5px] font-bold text-slate-800 border-b border-slate-300 pb-0.5 mb-0.5">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-950 uppercase">ગુજરાત પોસ્ટ</span>
            <span className="text-slate-400">•</span>
            <span className="text-[#B3121B] font-black uppercase">મેટ્રો સિટી સમાચાર & વોર્ડ જર્નલ</span>
            <span className="text-slate-400">•</span>
            <span>{gujaratiDateStr}</span>
          </div>
          <div className="flex items-center gap-2 font-extrabold">
            <span>{displayCity} આવૃત્તિ</span>
            <span>•</span>
            <span className="bg-[#B3121B] text-white px-1.5 py-0.2 rounded-xs text-[7px] font-black uppercase">
              પાનું ૨ / ૧૪
            </span>
            <span>•</span>
            <span>₹ ૧૫.૦૦</span>
          </div>
        </div>

        {/* Section Masthead Banner */}
        <div className="bg-slate-950 text-white px-2 py-0.5 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[8.5px] font-black uppercase tracking-wider rounded-xs flex items-center gap-1">
              <Building className="h-2.5 w-2.5" />
              <span>અમદાવાદ મેટ્રો વિશેષ • CITY METRO JOURNAL</span>
            </span>
            <span className="text-slate-300 text-[8px] font-bold truncate">
              AMC નીતિઓ, ૪૮ વોર્ડની ગતિવિધિ, ટ્રાફિક વ્યવસ્થાપન, સ્માર્ટ પ્રોજેક્ટ્સ અને નાગરિક સેવાઓ
            </span>
          </div>
          <div className="flex items-center gap-1 text-amber-300 text-[7.5px] font-extrabold shrink-0">
            <MapPin className="h-2.5 w-2.5" />
            <span>અમદાવાદ હેડક્વાર્ટર</span>
          </div>
        </div>

        {/* Weather & Civic Ticker Ribbon */}
        <div className="grid grid-cols-4 gap-1 bg-slate-100 border-x border-b border-slate-300 p-0.5 text-[6.8px] font-bold text-slate-700">
          {cityMetrics.map((m, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-0.5 flex flex-col justify-between">
              <span className="text-slate-500 text-[6px] font-extrabold truncate">{m.label}</span>
              <span className="text-[7.5px] font-black text-slate-950">{m.val}</span>
              <span className="text-[5.8px] text-slate-500">{m.sub}</span>
            </div>
          ))}
        </div>
      </header>

      {/* ==================== 2. UPPER METRO GRID (8 COLS LEAD + 4 COLS BULLETIN) ==================== */}
      <section className="grid grid-cols-12 gap-2 border-b-2 border-slate-900 pb-1 pt-0.5 shrink-0 items-stretch">
        {/* Left 8 Columns: Dominant Lead City Investigation */}
        <div className="col-span-8 border-r-2 border-slate-900 pr-2 space-y-0.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[7px] font-bold text-slate-600 mb-0.2">
              <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[7px] font-black rounded-xs uppercase">
                AMC વિકાસ નકશો • ₹૧૨,૫૦૦ કરોડ સ્માર્ટ સિટી
              </span>
              <span>દાણાપીઠ મ્યુનિસિપલ ભવન</span>
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
                <span className="text-[#B3121B] font-bold shrink-0 ml-1">► સંપૂર્ણ ડ્રાફ્ટ</span>
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
                  <span>• ૪ નવા ફ્લાયઓવર બ્રિજ</span>
                  <span>• ૩૦૦ નવી ઈ-બસો</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>• રિવરફ્રન્ટ ફેઝ-૨</span>
                  <span>• ૨૪ કલાક પેયજળ</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Columns: 7 City Fast News & Civic Updates */}
        <div className="col-span-4 flex flex-col justify-between space-y-0.5 bg-slate-50 p-1 border border-slate-300">
          <div className="flex items-center justify-between border-b border-slate-300 pb-0.5">
            <span className="bg-slate-900 text-amber-300 text-[7px] font-black px-1.5 py-0.2 rounded-xs uppercase">
              શહેરી ડાયરી • 7 FAST UPDATES
            </span>
            <span className="text-[#B3121B] text-[6.5px] font-bold">મેટ્રો લાઈવ</span>
          </div>

          <div className="space-y-0.5 flex-1 flex flex-col justify-between">
            {cityBulletin.map((item, idx) => (
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
            <span>AMC પોર્ટલ: ahmedabadcity.gov.in</span>
            <span className="text-[#B3121B]">► હેલ્પલાઇન 155303</span>
          </div>
        </div>
      </section>

      {/* ==================== 3. 2 PROMINENT SECONDARY METRO STORIES (WITH PHOTOS) ==================== */}
      <section className="grid grid-cols-2 gap-2.5 border-b-2 border-slate-900 pb-1 pt-0.5 shrink-0">
        {/* Story 1 */}
        <div className="space-y-0.5 border-r border-slate-300 pr-2.5">
          <div className="flex items-center justify-between text-[7px] font-bold text-slate-500">
            <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[6.5px] font-black rounded-xs uppercase">
              {secMetro1.tag}
            </span>
            <span className="text-[#B3121B] font-bold">► સંપૂર્ણ યોજના</span>
          </div>

          <h3 className="text-[10.5px] font-black leading-tight text-slate-950 line-clamp-1">
            {secMetro1.title}
          </h3>

          <div className="flex gap-2 items-start mt-0.5">
            <div className="w-[100px] shrink-0 space-y-0.5">
              <div className="w-[100px] h-[66px] overflow-hidden border border-slate-300 bg-slate-100">
                <img src={secMetro1.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                તસવીર: ગુજરાત પોસ્ટ
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between min-h-[66px] space-y-0.5">
              <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                {secMetro1.summary}
              </p>
              <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                <span className="text-slate-800 font-extrabold truncate">
                  {secMetro1.byline}
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
              {secMetro2.tag}
            </span>
            <span className="text-[#B3121B] font-bold">► ટ્રાફિક અપડેટ</span>
          </div>

          <h3 className="text-[10.5px] font-black leading-tight text-slate-950 line-clamp-1">
            {secMetro2.title}
          </h3>

          <div className="flex gap-2 items-start mt-0.5">
            <div className="w-[100px] shrink-0 space-y-0.5">
              <div className="w-[100px] h-[66px] overflow-hidden border border-slate-300 bg-slate-100">
                <img src={secMetro2.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                તસવીર: ગુજરાત પોસ્ટ
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between min-h-[66px] space-y-0.5">
              <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                {secMetro2.summary}
              </p>
              <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                <span className="text-slate-800 font-extrabold truncate">
                  {secMetro2.byline}
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
            <span>મેટ્રો ઇન્ફ્રાસ્ટ્રક્ચર વિશેષ સમીક્ષા (METRO INFRA & TRANSIT SPOTLIGHT)</span>
          </span>
          <span className="text-[6.5px] font-bold text-slate-600">શહેરી પરિવહન & ફ્લાયઓવર પ્રોજેક્ટ્સ</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Spotlight 1 */}
          <div className="space-y-0.5 border-r border-slate-300 pr-2.5">
            <div className="flex items-center justify-between text-[6.5px] font-bold">
              <span className="bg-indigo-800 text-white px-1.5 py-0.1 text-[6px] font-black rounded-xs uppercase">
                {spotlight1.badge} • {spotlight1.category}
              </span>
              <span className="text-[#B3121B] font-bold">► ટ્રાયલ રન વિગત</span>
            </div>

            <h4 className="text-[10px] font-black leading-tight text-slate-950 line-clamp-1">
              {spotlight1.title}
            </h4>

            <div className="flex gap-2 items-start mt-0.5">
              <div className="w-[100px] shrink-0 space-y-0.5">
                <div className="w-[100px] h-[66px] overflow-hidden border border-slate-300 bg-slate-100">
                  <img src={spotlight1.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
                </div>
                <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                  તસવીર: ગુજરાત પોસ્ટ
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between min-h-[66px] space-y-0.5">
                <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                  {spotlight1.summary}
                </p>
                <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                  <span className="text-slate-800 font-extrabold truncate">
                    {spotlight1.byline}
                  </span>
                  <span className="text-[#B3121B] font-black shrink-0">
                    ટાઇમટેબલ પાના ૦૬
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Spotlight 2 */}
          <div className="space-y-0.5">
            <div className="flex items-center justify-between text-[6.5px] font-bold">
              <span className="bg-emerald-800 text-white px-1.5 py-0.1 text-[6px] font-black rounded-xs uppercase">
                {spotlight2.badge} • {spotlight2.category}
              </span>
              <span className="text-[#B3121B] font-bold">► પ્રોજેક્ટ નકશો</span>
            </div>

            <h4 className="text-[10px] font-black leading-tight text-slate-950 line-clamp-1">
              {spotlight2.title}
            </h4>

            <div className="flex gap-2 items-start mt-0.5">
              <div className="w-[100px] shrink-0 space-y-0.5">
                <div className="w-[100px] h-[66px] overflow-hidden border border-slate-300 bg-slate-100">
                  <img src={spotlight2.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
                </div>
                <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                  તસવીર: ગુજરાત પોસ્ટ
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between min-h-[66px] space-y-0.5">
                <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                  {spotlight2.summary}
                </p>
                <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                  <span className="text-slate-800 font-extrabold truncate">
                    {spotlight2.byline}
                  </span>
                  <span className="text-[#B3121B] font-black shrink-0">
                    નકશો પાના ૦૬
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 5. 4-ZONE METRO WARD MATRIX (WITH ZONE PHOTOS) ==================== */}
      <section className="border-b-2 border-slate-900 pb-0.5 shrink-0">
        <div className="flex items-center justify-between text-[7px] font-black text-slate-950 mb-0.5 border-b border-slate-300 pb-0.2">
          <span className="bg-slate-900 text-white px-1 py-0.2 text-[6.5px] uppercase rounded-xs">
            ૪૮ વોર્ડ કવરેજ • 4 ZONE METRO JOURNAL
          </span>
          <span className="text-slate-500 text-[6.5px]">પશ્ચિમ • પૂર્વ • ઉત્તર • મધ્ય અને દક્ષિણ અમદાવાદ</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {/* Zone 1: West */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-[#B3121B] text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {westZone.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={westZone.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {westZone.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► વોર્ડ રિપોર્ટ</span>
          </div>

          {/* Zone 2: East */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-slate-900 text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {eastZone.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={eastZone.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {eastZone.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► વોર્ડ રિપોર્ટ</span>
          </div>

          {/* Zone 3: North */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-amber-700 text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {northZone.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={northZone.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {northZone.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► વોર્ડ રિપોર્ટ</span>
          </div>

          {/* Zone 4: Central & South */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-emerald-800 text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {southCentralZone.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={southCentralZone.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {southCentralZone.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► વોર્ડ રિપોર્ટ</span>
          </div>
        </div>
      </section>

      {/* ==================== 6. 8 WARD & NEIGHBORHOOD NEWS GRID (2 ROWS OF 4 COLS) ==================== */}
      <section className="border-b-2 border-slate-900 pb-0.5 pt-0.2 shrink-0 space-y-0.5">
        <div className="flex items-center justify-between text-[7px] font-black text-slate-950 border-b border-slate-300 pb-0.2">
          <span className="bg-[#B3121B] text-white px-1 py-0.2 text-[6.5px] uppercase rounded-xs flex items-center gap-1">
            <Newspaper className="h-2 w-2" />
            <span>શહેરી વિકાસ & વોર્ડ સમાચારો (WARD DEVELOPMENT & CITIZEN DIGEST)</span>
          </span>
          <span className="text-slate-500 text-[6.2px]">અમદાવાદના ૮ અગ્રણી વિસ્તારોની ગતિવિધિ</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {wardGridStories.map((item, idx) => (
            <div
              key={idx}
              className={`space-y-0.5 ${idx % 4 !== 3 ? 'border-r border-slate-300 pr-1.5' : ''} ${idx >= 4 ? 'pt-0.5 border-t border-slate-200' : ''}`}
            >
              <div className="flex items-center justify-between text-[6.5px] font-bold text-slate-500">
                <span className="text-[#B3121B] font-black uppercase">[{item.ward}]</span>
                <span className="text-[5.8px] text-slate-400">સ્થાનિક</span>
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

      {/* ==================== 7. CITY PULSE & CIVIC SERVICES STRIP (6 COLUMNS) ==================== */}
      <section className="shrink-0 space-y-0.5 border-b-2 border-slate-900 pb-0.5">
        <div className="flex items-center gap-1.5 border-b border-slate-300 pb-0.2">
          <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[7px] font-black uppercase rounded-xs">
            સિટી પલ્સ & નાગરિક સુવિધાઓ • CIVIC PULSE
          </span>
          <span className="text-[6.5px] text-slate-500 font-bold">વોર્ડ સેવાઓ, પબ્લિક ટ્રાન્સપોર્ટ અને ફરિયાદ નિવારણ</span>
        </div>

        <div className="grid grid-cols-6 gap-1 pt-0.2">
          {cityPulseBriefs.map((brief, idx) => (
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

      {/* ==================== 8. CIVIC NOTICE & EMERGENCY HELPLINES STRIP ==================== */}
      <section className="bg-slate-50 border border-dashed border-slate-400 p-0.5 rounded-xs flex items-center justify-between text-[6.5px] font-bold text-slate-700 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="bg-slate-900 text-amber-300 px-1 py-0.2 rounded-xs text-[6px] font-black uppercase flex items-center gap-0.5">
            <PhoneCall className="h-2 w-2" />
            <span>૨૪x૭ સિટી હેલ્પલાઇન</span>
          </span>
          <span>AMC કંટ્રોલ: <strong>155303</strong> • પોલીસ: <strong>100/112</strong> • ફાયર: <strong>101</strong> • એમ્બ્યુલન્સ: <strong>108</strong> • ટોરેન્ટ પાવર: <strong>19122</strong></span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <span>ઓનલાઇન સેવાઓ: <strong>ahmedabadcity.gov.in</strong></span>
          <span>•</span>
          <span className="text-[#B3121B] font-black flex items-center gap-0.5">
            <ShieldCheck className="h-2.5 w-2.5 text-emerald-600" />
            <span>પ્રમાણિત સિવિક ડેસ્ક</span>
          </span>
        </div>
      </section>

      {/* ==================== 9. BROADSHEET NEWSPAPER FOOTER ==================== */}
      <footer className="border-t border-slate-400 pt-0.5 pb-0.5 flex items-center justify-between text-[7px] font-bold text-slate-600 shrink-0">
        <div>
          <span>© ગુજરાત પોસ્ટ મેટ્રો બ્યુરો, {displayCity} • લાલદરવાજા • એસ.જી. હાઇવે • પાલડી • દાણાપીઠ</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#B3121B] font-black uppercase">WWW.GUJARATPOST.IN</span>
          <span>•</span>
          <span>પાનું ૨ / ૧૪</span>
        </div>
      </footer>
    </div>
  );
};
