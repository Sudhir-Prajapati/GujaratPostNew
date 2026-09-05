'use client';

import React from 'react';
import { EPaperPageData, getCleanText, formatGujaratiDate, BroadsheetArticle } from '../types';
import { Flag, Compass, Shield, Rocket, Landmark, Award, TrendingUp, CheckCircle2, ShieldCheck, Flame, Newspaper } from 'lucide-react';

interface TemplateProps {
  data: EPaperPageData;
}

const cleanHeadline = (text?: string) => {
  if (!text) return '';
  return text.replace(/^#\d+\s*[-–—:]\s*/, '').trim();
};

export const NationalTemplate: React.FC<TemplateProps> = ({ data }) => {
  const {
    pageNumber = 4,
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

  // 1. National Indicators
  const nationalIndices = [
    { label: 'ભારત GDP વૃદ્ધિ દર', val: '૭.૮% (વાર્ષિક)', sub: 'વિશ્વમાં સૌથી ઝડપી અર્થતંત્ર' },
    { label: 'માસિક GST કલેક્શન', val: '₹૧.૮૨ લાખ કરોડ', sub: 'રેકોર્ડ આવક વૃદ્ધિ' },
    { label: 'ફોરેક્સ અનામત ભંડોળ', val: '$૬૭૫ અબજ ડોલર', sub: 'સર્વોચ્ચ ઐતિહાસિક સપાટી' },
    { label: 'ઇસરો સ્પેસ મિશન', val: 'ગગનયાન તૈયારી', sub: 'શ્રીહરિકોટા અંતરિક્ષ કેન્દ્ર' },
  ];

  // 2. Lead Capital Story
  const leadHeadline = cleanHeadline(
    leadArticle?.printHeadline ||
    leadArticle?.titleGu ||
    leadArticle?.title ||
    'સંસદનું ચોમાસુ સત્ર: ઐતિહાસિક ડિજિટલ ડેટા પ્રોટેક્શન અને રાષ્ટ્રીય સુરક્ષા સંહિતા ખરડાને બહુમતીથી મંજૂરી'
  );

  const leadImage =
    leadArticle?.featuredImage ||
    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80';

  const leadCaption =
    leadArticle?.photoCredit || 'તસવીર: ગુજરાત પોસ્ટ • નવી દિલ્હી: નવા સંસદ ભવન ખાતે મહત્વપૂર્ણ ખરડાઓ પર ચર્ચા બાદ મતદાન';

  const leadSummary =
    leadArticle?.printSummary ||
    getCleanText(
      leadArticle?.excerptGu ||
        leadArticle?.excerpt ||
        leadArticle?.contentGu ||
        leadArticle?.content ||
        'નવી દિલ્હી સંસદ ભવન ખાતે ચાલી રહેલા સત્ર દરમિયાન કેન્દ્ર સરકાર દ્વારા દેશના સામાન્ય નાગરિકોના ડિજિટલ અધિકારો અને ડેટા પ્રાઇવસી અંગેનો મહત્વપૂર્ણ ખરડો ધ્વનિમતથી પસાર કરાયો છે. વિપક્ષી સાંસદોના સૂચનો સ્વીકારી કાયદાને વધુ મજબૂત બનાવાયો છે.',
      280
    );

  const leadSecondParagraph = getCleanText(
    leadArticle?.contentGu ||
      leadArticle?.content ||
      'ગૃહમંત્રી અને કાયદામંત્રીએ જણાવ્યું હતું કે આ કાયદાથી દેશમાં સાયબર સુરક્ષા વધુ સુદ્રઢ બનશે અને નાગરિકોના વ્યક્તિગત ડેટાનો દુરુપયોગ કરનાર કંપનીઓ સામે કડક દંડની જોગવાઈ અમલી બનશે.',
    260
  );

  const leadLocation = leadArticle?.location || 'નવી દિલ્હી';

  // 3. 7 Capital & Parliament Updates (Right 4 cols)
  const capitalBulletin = [
    { title: cleanHeadline(pool[0]?.printHeadline || pool[0]?.titleGu) || 'સુપ્રીમ કોર્ટ સંવિધાન પીઠ: ચૂંટણી સુધારાઓ અંગે ઐતિહાસિક સુનાવણી પૂર્ણ', time: '૧૦:૦૦ AM', cat: 'ન્યાયપાલિકા' },
    { title: cleanHeadline(pool[1]?.printHeadline || pool[1]?.titleGu) || 'કેન્દ્રીય કેબિનેટ: રાષ્ટ્રીય સેમિકન્ડક્ટર મિશન માટે ₹૨૦,૦૦૦ કરોડ મંજૂર', time: '૧૧:૧૫ AM', cat: 'કેબિનેટ' },
    { title: cleanHeadline(pool[2]?.printHeadline || pool[2]?.titleGu) || 'ભારતીય રેલવે દ્વારા ૨૦૦ નવી વંદે ભારત સ્લીપર ટ્રેનો દોડાવવાનો નિર્ણય', time: '૧૨:૩૦ PM', cat: 'રેલવે' },
    { title: cleanHeadline(pool[3]?.printHeadline || pool[3]?.titleGu) || 'નીતિ આયોગ: રાજ્યો સાથે મળીને ૨૦૪૭ વિકસિત ભારત રોડમેપ તૈયાર', time: '૦૨:૦૦ PM', cat: 'નીતિ' },
    { title: cleanHeadline(pool[4]?.printHeadline || pool[4]?.titleGu) || 'સંરક્ષણ મંત્રાલય દ્વારા સ્વદેશી તેજસ ફાઇટર જેટ્સનો નવો કાફલો મંજૂર', time: '૦૩:૧૫ PM', cat: 'સંરક્ષણ' },
    { title: cleanHeadline(pool[5]?.printHeadline || pool[5]?.titleGu) || 'નેશનલ હાઇવે ઓથોરિટી: ૧૦,૦૦૦ કિમી નવા એક્સપ્રેસવે નિર્માણ લક્ષ્યાંક', time: '૦૪:૩૦ PM', cat: 'ઇન્ફ્રા' },
    { title: cleanHeadline(pool[6]?.printHeadline || pool[6]?.titleGu) || 'CBSE અને UGC દ્વારા યુનિવર્સિટી પ્રવેશ માટે એકીકૃત પોર્ટલ શરૂ', time: '૦૫:૪૫ PM', cat: 'શિક્ષણ' },
  ];

  // 4. Secondary National Stories (2 prominent stories with photos)
  const secNat1 = {
    title: cleanHeadline(pool[7]?.printHeadline || pool[7]?.titleGu) || 'સંરક્ષણ ક્ષેત્રે આત્મનિર્ભરતા: ₹૫૦,૦૦૦ કરોડના સ્વદેશી મિસાઇલ અને રડાર પ્રોજેક્ટ્સને મંજૂરી',
    image: pool[7]?.featuredImage || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[7]?.excerptGu || pool[7]?.contentGu || 'સંરક્ષણ સંપાદન પરિષદ (DAC) દ્વારા ત્રણેય સેનાઓ માટે સ્વદેશી બનાવટના અદ્યતન શસ્ત્રો, ડ્રોન અને એર ડિફેન્સ સિસ્ટમ ખરીદવા લીલી ઝંડી આપવામાં આવી છે.', 240),
    tag: 'મેક ઇન ઇન્ડિયા',
    byline: 'સંરક્ષણ બ્યુરો, નવી દિલ્હી',
    art: pool[7]
  };

  const secNat2 = {
    title: cleanHeadline(pool[8]?.printHeadline || pool[8]?.titleGu) || 'ભારત-મધ્ય પૂર્વ-યુરોપ ઇકોનોમિક કોરિડોર (IMEC): વૈશ્વિક વેપાર માટે નવો માર્ગ મોકળો',
    image: pool[8]?.featuredImage || 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=500&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[8]?.excerptGu || pool[8]?.contentGu || 'બંદર અને રેલવે કનેક્ટિવિટી દ્વારા ભારતીય માલસામાન યુરોપિયન બજારોમાં ૪૦% ઝડપથી પહોંચશે. વૈશ્વિક સપ્લાય ચેઇનમાં ભારત અગ્રણી ભૂમિકા ભજવશે.', 240),
    tag: 'વૈશ્વિક વેપાર',
    byline: 'આંતરરાષ્ટ્રીય ડેસ્ક',
    art: pool[8]
  };

  // 5. Special In-Depth National Spotlight (2 Ground Reports with Photos)
  const spotNat1 = {
    title: cleanHeadline(pool[9]?.printHeadline || pool[9]?.titleGu) || 'ઇસરો ગગનયાન મિશન: માનવ રહિત ક્રૂ મોડ્યુલ પરીક્ષણ સફળ, આગામી વર્ષે ભારતીય અવકાશયાત્રી ઉડાન ભરશે',
    image: pool[9]?.featuredImage || 'https://images.unsplash.com/photo-1517976487502-570a25695cf6?w=500&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[9]?.excerptGu || pool[9]?.contentGu || 'શ્રીહરિકોટા સતીશ ધવન સ્પેસ સેન્ટર ખાતે ક્રૂ એસ્કેપ સિસ્ટમ અને લિક્વિડ એન્જિનનું સફળ પરીક્ષણ પૂર્ણ કરાયું. અંતરિક્ષ યાત્રીઓનું પ્રશિક્ષણ પૂર્ણતાના આરે છે.', 240),
    badge: 'ઇસરો વિશેષ',
    category: 'સ્પેસ મિશન',
    byline: 'સાયન્સ & સ્પેસ બ્યુરો',
    art: pool[9]
  };

  const spotNat2 = {
    title: cleanHeadline(pool[10]?.printHeadline || pool[10]?.titleGu) || 'દિલ્હી-મુંબઈ એક્સપ્રેસવે પ્રોજેક્ટ: દેશના લોજિસ્ટિક્સ ખર્ચમાં વાર્ષિક ₹૧ લાખ કરોડની બચત થશે',
    image: pool[10]?.featuredImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[10]?.excerptGu || pool[10]?.contentGu || '૧,૩૮૬ કિમી લાંબો ૮-લેન ગ્રીનફીલ્ડ એક્સપ્રેસવે દેશની રાજધાનીને આર્થિક રાજધાની સાથે માત્ર ૧૨ કલાકમાં જોડશે. ઔદ્યોગિક નોડ્સ વિકસાવાઈ રહ્યા છે.', 240),
    badge: 'ઇન્ફ્રાસ્ટ્રક્ચર',
    category: 'નેશનલ કોરિડોર',
    byline: 'પરિવહન મંત્રાલય ડેસ્ક',
    art: pool[10]
  };

  // 6. 4-Zone State Politics Matrix (North, South, West, East) with photos
  const northZone = {
    title: 'ઉત્તર ભારત (NORTH ZONE)',
    img: pool[11]?.featuredImage || 'https://images.unsplash.com/photo-1596405835955-465de5c3dfb7?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'યુપી', title: cleanHeadline(pool[11]?.printHeadline || pool[11]?.titleGu) || 'અયોધ્યા અને કાશીમાં પર્યટન આવકમાં રેકોર્ડ ૪૫% વૃદ્ધિ' },
      { loc: 'કાશ્મીર', title: cleanHeadline(pool[12]?.printHeadline || pool[12]?.titleGu) || 'શ્રીનગર-જમ્મુ રેલવે લાઇન દ્વારા ઘાટી દેશ સાથે જોડાઈ' },
      { loc: 'પંજાબ', title: cleanHeadline(pool[13]?.printHeadline || pool[13]?.titleGu) || 'ખેડૂતો માટે અદ્યતન સિંચાઈ અને પાક વૈવિધ્યીકરણ યોજના' },
    ]
  };

  const southZone = {
    title: 'દક્ષિણ ભારત (SOUTH ZONE)',
    img: pool[14]?.featuredImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'કર્ણાટક', title: cleanHeadline(pool[14]?.printHeadline || pool[14]?.titleGu) || 'બેંગલુરુ ટેક સમિટમાં ₹૫૦,૦૦૦ કરોડના વૈશ્વિક કરાર' },
      { loc: 'તમિલનાડુ', title: cleanHeadline(pool[15]?.printHeadline || pool[15]?.titleGu) || 'ચેન્નાઈ ખાતે ઇલેક્ટ્રિક વાહન ઉત્પાદન હબનું વિસ્તરણ' },
      { loc: 'તેલંગાણા', title: cleanHeadline(pool[16]?.printHeadline || pool[16]?.titleGu) || 'હૈદરાબાદ ફાર્મા સિટીમાં ₹૫,૦૦૦ કરોડનું નવું મૂડીરોકાણ' },
    ]
  };

  const westCentralZone = {
    title: 'પશ્ચિમ & મધ્ય ભારત',
    img: pool[17]?.featuredImage || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'મહારાષ્ટ્ર', title: cleanHeadline(pool[17]?.printHeadline || pool[17]?.titleGu) || 'મુંબઈ કોસ્ટલ રોડ ફેઝ-૨ નું કામ નિર્ધારિત સમય કરતાં આગળ' },
      { loc: 'રાજસ્થાન', title: cleanHeadline(pool[18]?.printHeadline || pool[18]?.titleGu) || 'થાર રણમાં એશિયાનો સૌથી મોટો સોલાર પાવર પાર્ક કાર્યરત' },
      { loc: 'એમપી', title: cleanHeadline(pool[19]?.printHeadline || pool[19]?.titleGu) || 'ઇન્દોર દેશનું સર્વશ્રેષ્ઠ સ્વચ્છ શહેર એવોર્ડ ફરી જીત્યું' },
    ]
  };

  const eastZone = {
    title: 'પૂર્વ & ઉત્તર-પૂર્વ ભારત',
    img: pool[20]?.featuredImage || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'બંગાળ', title: cleanHeadline(pool[20]?.printHeadline || pool[20]?.titleGu) || 'કોલકાતા પોર્ટ ખાતે નવું ડીપ-સી કન્ટેનર ટર્મિનલ મંજૂર' },
      { loc: 'ઓડિશા', title: cleanHeadline(pool[21]?.printHeadline || pool[21]?.titleGu) || 'પારાદીપ પોર્ટ પર ગ્રીન હાઇડ્રોજન એક્સપોર્ટ હબ બનશે' },
      { loc: 'આસામ', title: cleanHeadline(pool[22]?.printHeadline || pool[22]?.titleGu) || 'ગુવાહાટી AIIMS કેમ્પસમાં સુપર સ્પેશિયાલિટી બ્લોક શરૂ' },
    ]
  };

  // 7. 8 National States & Policy Digest (2 rows of 4 cols with photos)
  const nationalGridStories = [
    {
      state: 'દિલ્હી NCR',
      title: cleanHeadline(pool[23]?.printHeadline || pool[23]?.titleGu) || 'દિલ્હી એરપોર્ટ પર નવું ટર્મિનલ-૪ અને ઓટોમેટેડ પીપલ મુવર',
      summary: getCleanText(pool[23]?.excerptGu || pool[23]?.contentGu || 'વાર્ષિક ૧૦ કરોડ મુસાફરોની ક્ષમતા સાથે ભારતનું સૌથી મોટું એવિએશન હબ બનશે.', 60),
      image: pool[23]?.featuredImage || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&auto=format&fit=crop&q=80',
    },
    {
      state: 'મહારાષ્ટ્ર',
      title: cleanHeadline(pool[24]?.printHeadline || pool[24]?.titleGu) || 'નવી મુંબઈ ઇન્ટરનેશનલ એરપોર્ટનું ટ્રાયલ રન ડિસેમ્બરમાં શરૂ થશે',
      summary: getCleanText(pool[24]?.excerptGu || pool[24]?.contentGu || 'સિડકો અને અદાણી એરપોર્ટ હોલ્ડિંગ્સ દ્વારા બાંધકામ પૂર્ણતાના આરે.', 60),
      image: pool[24]?.featuredImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&auto=format&fit=crop&q=80',
    },
    {
      state: 'કર્ણાટક',
      title: cleanHeadline(pool[25]?.printHeadline || pool[25]?.titleGu) || 'બેંગલુરુ એરોસ્પેસ પાર્કમાં નવા સેટેલાઇટ મેન્યુફેક્ચરિંગ યુનિટ્સ',
      summary: getCleanText(pool[25]?.excerptGu || pool[25]?.contentGu || 'ગ્લોબલ સ્પેસ કંપનીઓ દ્વારા ભારતીય સ્ટાર્ટઅપ્સ સાથે સંયુક્ત સાહસની જાહેરાત.', 60),
      image: pool[25]?.featuredImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&auto=format&fit=crop&q=80',
    },
    {
      state: 'યુપી',
      title: cleanHeadline(pool[26]?.printHeadline || pool[26]?.titleGu) || 'નોઈડા જેવર ઇન્ટરનેશનલ એરપોર્ટ કાર્ગો હબનું ઉદ્ઘાટન સંપન્ન',
      summary: getCleanText(pool[26]?.excerptGu || pool[26]?.contentGu || 'ઉત્તર ભારતના ઔદ્યોગિક ઉત્પાદનોની વૈશ્વિક નિકાસને અસાધારણ વેગ મળશે.', 60),
      image: pool[26]?.featuredImage || 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=300&auto=format&fit=crop&q=80',
    },
    {
      state: 'તમિલનાડુ',
      title: cleanHeadline(pool[27]?.printHeadline || pool[27]?.titleGu) || 'કુડનકુલમ અણુ ઊર્જા મથકના નવા બે રિયેક્ટર્સ કાર્યરત કરાયા',
      summary: getCleanText(pool[27]?.excerptGu || pool[27]?.contentGu || 'દક્ષિણ ભારતના રાજ્યોને ૨,૦૦૦ મેગાવોટ સ્વચ્છ અવિરત વીજળી મળશે.', 60),
      image: pool[27]?.featuredImage || 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=300&auto=format&fit=crop&q=80',
    },
    {
      state: 'કેરળ',
      title: cleanHeadline(pool[28]?.printHeadline || pool[28]?.titleGu) || 'વિઝિંજમ ઇન્ટરનેશનલ ટ્રાન્સશિપમેન્ટ પોર્ટ પર પ્રથમ મધરશિપ આવી',
      summary: getCleanText(pool[28]?.excerptGu || pool[28]?.contentGu || 'કોલંબો અને સિંગાપોર પર ભારતની નિર્ભરતા ઘટી, વિદેશી હૂંડિયામણની બચત.', 60),
      image: pool[28]?.featuredImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&auto=format&fit=crop&q=80',
    },
    {
      state: 'રાજસ્થાન',
      title: cleanHeadline(pool[29]?.printHeadline || pool[29]?.titleGu) || 'જેસલમેરમાં ૨,૦૦૦ મેગાવોટનો ગ્રીન હાઇડ્રોજન પ્લાન્ટ મંજૂર',
      summary: getCleanText(pool[29]?.excerptGu || pool[29]?.contentGu || 'વિશ્વની અગ્રણી એનર્જી જાયન્ટ્સ દ્વારા થારમાં ₹૧૫,૦૦૦ કરોડનું રોકાણ.', 60),
      image: pool[29]?.featuredImage || 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=300&auto=format&fit=crop&q=80',
    },
    {
      state: 'ઓડિશા',
      title: cleanHeadline(pool[30]?.printHeadline || pool[30]?.titleGu) || 'ભુવનેશ્વર આઈટી પાર્કમાં નવી ગ્લોબલ કેપેબિલિટી સેન્ટર્સ સ્થાપના',
      summary: getCleanText(pool[30]?.excerptGu || pool[30]?.contentGu || 'પૂર્વી ભારતમાં યુવા ટેક પ્રોફેશનલ્સ માટે ૨૫,૦૦૦ નવી નોકરીઓનું સર્જન.', 60),
      image: pool[30]?.featuredImage || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&auto=format&fit=crop&q=80',
    },
  ];

  // 8. National Pulse Briefs (6 columns)
  const nationalPulseBriefs = [
    { label: 'આધાર-યુપીઆઈ', text: 'ડિજિટલ પેમેન્ટ્સ વોલ્યુમમાં વાર્ષિક ૫૨% નો ઐતિહાસિક ઉછાળો નોંધાયો.', ref: 'NPCI બ્યુરો' },
    { label: 'પીએમ આવાસ', text: 'ગ્રામીણ અને શહેરી ગરીબો માટે વધુ ૨ કરોડ પાકા મકાનો મંજૂર.', ref: 'આવાસ મંત્રાલય' },
    { label: 'આયુષ્માન ભારત', text: '૭૦ વર્ષથી વધુ વયના તમામ વરિષ્ઠ નાગરિકોને ₹૫ લાખનું મફત કવચ.', ref: 'આરોગ્ય મિશન' },
    { label: 'કૃષિ કિસાન', text: 'પીએમ કિસાન સન્માન નિધિનો ૧૮મો હપ્તો સીધા ખાતામાં જમા.', ref: 'કૃષિ મંત્રાલય' },
    { label: 'સ્ટાર્ટઅપ ઈન્ડિયા', text: 'દેશમાં યુનિકોર્ન સ્ટાર્ટઅપ્સની સંખ્યા ૧૧૫ને પાર પહોંચી.', ref: 'વાણિજ્ય મંત્રાલય' },
    { label: 'સ્વચ્છ ભારત', text: 'દેશભરના ૫૦૦ શહેરોમાં વેસ્ટ-ટુ-એનર્જી પ્લાન્ટ્સ કાર્યરત કરાયા.', ref: 'શહેરી વિકાસ' },
  ];

  return (
    <div className="h-full flex flex-col p-2 bg-white border-[3px] border-slate-900 box-border text-slate-900 font-sans select-none overflow-hidden space-y-0.5 justify-between">
      {/* ==================== 1. NATIONAL RUNNING HEADER & FOLIO ==================== */}
      <header className="shrink-0">
        <div className="flex items-center justify-between text-[7.5px] font-bold text-slate-800 border-b border-slate-300 pb-0.5 mb-0.5">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-950 uppercase">ગુજરાત પોસ્ટ</span>
            <span className="text-slate-400">•</span>
            <span className="text-[#B3121B] font-black uppercase">રાષ્ટ્રીય પ્રવાહ & દિલ્હી દરબાર</span>
            <span className="text-slate-400">•</span>
            <span>{gujaratiDateStr}</span>
          </div>
          <div className="flex items-center gap-2 font-extrabold">
            <span>રાષ્ટ્રીય આવૃત્તિ</span>
            <span>•</span>
            <span className="bg-[#B3121B] text-white px-1.5 py-0.2 rounded-xs text-[7px] font-black uppercase">
              પાનું ૪ / ૧૪
            </span>
            <span>•</span>
            <span>₹ ૧૫.૦૦</span>
          </div>
        </div>

        {/* Section Masthead Banner */}
        <div className="bg-slate-950 text-white px-2 py-0.5 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[8.5px] font-black uppercase tracking-wider rounded-xs flex items-center gap-1">
              <Flag className="h-2.5 w-2.5" />
              <span>રાષ્ટ્રીય મંચ • NATIONAL NEWS DESK</span>
            </span>
            <span className="text-slate-300 text-[8px] font-bold truncate">
              સંસદ ભવન, સર્વોચ્ચ અદાલત, સંરક્ષણ, અવકાશ વિજ્ઞાન અને ૨૮ રાજ્યોના સમાચારો
            </span>
          </div>
          <div className="flex items-center gap-1 text-amber-300 text-[7.5px] font-extrabold shrink-0">
            <Compass className="h-2.5 w-2.5" />
            <span>નવી દિલ્હી બ્યુરો</span>
          </div>
        </div>

        {/* National Indicators Ticker Ribbon */}
        <div className="grid grid-cols-4 gap-1 bg-slate-100 border-x border-b border-slate-300 p-0.5 text-[6.8px] font-bold text-slate-700">
          {nationalIndices.map((n, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-0.5 flex flex-col justify-between">
              <span className="text-slate-500 font-extrabold truncate">{n.label}</span>
              <span className="text-[7.5px] font-black text-slate-950">{n.val}</span>
              <span className="text-[5.8px] text-slate-500">{n.sub}</span>
            </div>
          ))}
        </div>
      </header>

      {/* ==================== 2. UPPER NATIONAL GRID (8 COLS LEAD + 4 COLS BULLETIN) ==================== */}
      <section className="grid grid-cols-12 gap-2 border-b-2 border-slate-900 pb-1 pt-0.5 shrink-0 items-stretch">
        {/* Left 8 Columns: Dominant Lead Capital Story */}
        <div className="col-span-8 border-r-2 border-slate-900 pr-2 space-y-0.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[7px] font-bold text-slate-600 mb-0.2">
              <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[7px] font-black rounded-xs uppercase">
                સંસદ વિશેષ • કાયદાકીય સુધારા
              </span>
              <span>નવી દિલ્હી • સંસદ ભવન</span>
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
                <span className="text-[#B3121B] font-bold shrink-0 ml-1">► સંપૂર્ણ ખરડો</span>
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
                  <span>• ડેટા પ્રાઇવસી કાયદો</span>
                  <span>• સાયબર સિક્યોરિટી બોડી</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>• ઉલ્લંઘન પર કડક દંડ</span>
                  <span>• નાગરિકોને સંપૂર્ણ રક્ષણ</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Columns: 7 Capital Bulletins */}
        <div className="col-span-4 flex flex-col justify-between space-y-0.5 bg-slate-50 p-1 border border-slate-300">
          <div className="flex items-center justify-between border-b border-slate-300 pb-0.5">
            <span className="bg-slate-900 text-amber-300 text-[7px] font-black px-1.5 py-0.2 rounded-xs uppercase">
              દિલ્હી ડાયરી • 7 FAST UPDATES
            </span>
            <span className="text-[#B3121B] text-[6.5px] font-bold">રાષ્ટ્રીય લાઈવ</span>
          </div>

          <div className="space-y-0.5 flex-1 flex flex-col justify-between">
            {capitalBulletin.map((item, idx) => (
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
            <span>સત્તાવાર સંસદ બુલેટિન</span>
            <span className="text-[#B3121B]">► સંપૂર્ણ વિગત પાના ૪ પર</span>
          </div>
        </div>
      </section>

      {/* ==================== 3. 2 PROMINENT SECONDARY NATIONAL STORIES (WITH PHOTOS) ==================== */}
      <section className="grid grid-cols-2 gap-2.5 border-b-2 border-slate-900 pb-1 pt-0.5 shrink-0">
        {/* Story 1 */}
        <div className="space-y-0.5 border-r border-slate-300 pr-2.5">
          <div className="flex items-center justify-between text-[7px] font-bold text-slate-500">
            <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[6.5px] font-black rounded-xs uppercase">
              {secNat1.tag}
            </span>
            <span className="text-[#B3121B] font-bold">► સંરક્ષણ વિગત</span>
          </div>

          <h3 className="text-[10.5px] font-black leading-tight text-slate-950 line-clamp-1">
            {secNat1.title}
          </h3>

          <div className="flex gap-2 items-start mt-0.5">
            <div className="w-[100px] shrink-0 space-y-0.5">
              <div className="w-[100px] h-[66px] overflow-hidden border border-slate-300 bg-slate-100">
                <img src={secNat1.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                તસવીર: ગુજરાત પોસ્ટ
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between min-h-[66px] space-y-0.5">
              <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                {secNat1.summary}
              </p>
              <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                <span className="text-slate-800 font-extrabold truncate">
                  {secNat1.byline}
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
              {secNat2.tag}
            </span>
            <span className="text-[#B3121B] font-bold">► વેપાર કોરિડોર</span>
          </div>

          <h3 className="text-[10.5px] font-black leading-tight text-slate-950 line-clamp-1">
            {secNat2.title}
          </h3>

          <div className="flex gap-2 items-start mt-0.5">
            <div className="w-[100px] shrink-0 space-y-0.5">
              <div className="w-[100px] h-[66px] overflow-hidden border border-slate-300 bg-slate-100">
                <img src={secNat2.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                તસવીર: ગુજરાત પોસ્ટ
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between min-h-[66px] space-y-0.5">
              <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                {secNat2.summary}
              </p>
              <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                <span className="text-slate-800 font-extrabold truncate">
                  {secNat2.byline}
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
            <span>રાષ્ટ્રીય વિજ્ઞાન & ઇન્ફ્રાસ્ટ્રક્ચર સમીક્ષા (NATIONAL SCIENCE & INFRA SPOTLIGHT)</span>
          </span>
          <span className="text-[6.5px] font-bold text-slate-600">ગગનયાન સ્પેસ મિશન & દિલ્હી-મુંબઈ કોરિડોર</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Spot 1 */}
          <div className="space-y-0.5 border-r border-slate-300 pr-2.5">
            <div className="flex items-center justify-between text-[6.5px] font-bold">
              <span className="bg-indigo-800 text-white px-1.5 py-0.1 text-[6px] font-black rounded-xs uppercase">
                {spotNat1.badge} • {spotNat1.category}
              </span>
              <span className="text-[#B3121B] font-bold">► ઇસરો રિપોર્ટ</span>
            </div>

            <h4 className="text-[10px] font-black leading-tight text-slate-950 line-clamp-1">
              {spotNat1.title}
            </h4>

            <div className="flex gap-2 items-start mt-0.5">
              <div className="w-[100px] shrink-0 space-y-0.5">
                <div className="w-[100px] h-[66px] overflow-hidden border border-slate-300 bg-slate-100">
                  <img src={spotNat1.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
                </div>
                <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                  તસવીર: ગુજરાત પોસ્ટ
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between min-h-[66px] space-y-0.5">
                <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                  {spotNat1.summary}
                </p>
                <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                  <span className="text-slate-800 font-extrabold truncate">
                    {spotNat1.byline}
                  </span>
                  <span className="text-[#B3121B] font-black shrink-0">
                    સાયન્સ પાના ૦૮
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Spot 2 */}
          <div className="space-y-0.5">
            <div className="flex items-center justify-between text-[6.5px] font-bold">
              <span className="bg-emerald-800 text-white px-1.5 py-0.1 text-[6px] font-black rounded-xs uppercase">
                {spotNat2.badge} • {spotNat2.category}
              </span>
              <span className="text-[#B3121B] font-bold">► એક્સપ્રેસવે નકશો</span>
            </div>

            <h4 className="text-[10px] font-black leading-tight text-slate-950 line-clamp-1">
              {spotNat2.title}
            </h4>

            <div className="flex gap-2 items-start mt-0.5">
              <div className="w-[100px] shrink-0 space-y-0.5">
                <div className="w-[100px] h-[66px] overflow-hidden border border-slate-300 bg-slate-100">
                  <img src={spotNat2.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
                </div>
                <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                  તસવીર: ગુજરાત પોસ્ટ
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between min-h-[66px] space-y-0.5">
                <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                  {spotNat2.summary}
                </p>
                <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                  <span className="text-slate-800 font-extrabold truncate">
                    {spotNat2.byline}
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

      {/* ==================== 5. 4-ZONE STATE POLITICS MATRIX (WITH PHOTOS) ==================== */}
      <section className="border-b-2 border-slate-900 pb-0.5 shrink-0">
        <div className="flex items-center justify-between text-[7px] font-black text-slate-950 mb-0.5 border-b border-slate-300 pb-0.2">
          <span className="bg-slate-900 text-white px-1 py-0.2 text-[6.5px] uppercase rounded-xs">
            ૨૮ રાજ્યોની ગતિવિધિ • 4 ZONE STATE MATRIX
          </span>
          <span className="text-slate-500 text-[6.5px]">ઉત્તર • દક્ષિણ • પશ્ચિમ-મધ્ય • પૂર્વ ભારત</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {/* Zone 1: North */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-[#B3121B] text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
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
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► રાજ્ય રિપોર્ટ</span>
          </div>

          {/* Zone 2: South */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-slate-900 text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {southZone.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={southZone.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {southZone.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► રાજ્ય રિપોર્ટ</span>
          </div>

          {/* Zone 3: West-Central */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-amber-700 text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {westCentralZone.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={westCentralZone.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {westCentralZone.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► રાજ્ય રિપોર્ટ</span>
          </div>

          {/* Zone 4: East */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-emerald-800 text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
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
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► રાજ્ય રિપોર્ટ</span>
          </div>
        </div>
      </section>

      {/* ==================== 6. 8 NATIONAL STATES & POLICY DIGEST (2 ROWS OF 4 COLS) ==================== */}
      <section className="border-b-2 border-slate-900 pb-0.5 pt-0.2 shrink-0 space-y-0.5">
        <div className="flex items-center justify-between text-[7px] font-black text-slate-950 border-b border-slate-300 pb-0.2">
          <span className="bg-[#B3121B] text-white px-1 py-0.2 text-[6.5px] uppercase rounded-xs flex items-center gap-1">
            <Newspaper className="h-2 w-2" />
            <span>રાષ્ટ્રીય વિકાસ & નીતિ સંહિતા (NATIONAL STATES & GOVERNANCE DIGEST)</span>
          </span>
          <span className="text-slate-500 text-[6.2px]">દેશના ૮ અગ્રણી રાજ્યોની ગતિવિધિ</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {nationalGridStories.map((item, idx) => (
            <div
              key={idx}
              className={`space-y-0.5 ${idx % 4 !== 3 ? 'border-r border-slate-300 pr-1.5' : ''} ${idx >= 4 ? 'pt-0.5 border-t border-slate-200' : ''}`}
            >
              <div className="flex items-center justify-between text-[6.5px] font-bold text-slate-500">
                <span className="text-[#B3121B] font-black uppercase">[{item.state}]</span>
                <span className="text-[5.8px] text-slate-400">રાષ્ટ્રીય</span>
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

      {/* ==================== 7. NATIONAL PULSE BRIEFS (6 COLUMNS) ==================== */}
      <section className="shrink-0 space-y-0.5 border-b border-slate-400 pb-0.5">
        <div className="flex items-center gap-1.5 border-b border-slate-300 pb-0.2">
          <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[7px] font-black uppercase rounded-xs">
            રાષ્ટ્રીય ઝલક • NATIONAL PULSE BRIEFS
          </span>
          <span className="text-[6.5px] text-slate-500 font-bold">કેન્દ્ર સરકારની મુખ્ય યોજનાઓ અને નીતિઓ</span>
        </div>

        <div className="grid grid-cols-6 gap-1 pt-0.2">
          {nationalPulseBriefs.map((brief, idx) => (
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

      {/* ==================== 8. NATIONAL GAZETTE STRIP ==================== */}
      <section className="bg-slate-50 border border-dashed border-slate-400 p-0.5 rounded-xs flex items-center justify-between text-[6.5px] font-bold text-slate-700 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="bg-slate-900 text-amber-300 px-1 py-0.2 rounded-xs text-[6px] font-black uppercase flex items-center gap-0.5">
            <ShieldCheck className="h-2 w-2" />
            <span>રાષ્ટ્રીય ગઝેટ</span>
          </span>
          <span>કેન્દ્રીય સૂચના અને પ્રસારણ મંત્રાલય: સંસદીય અહેવાલ અને અધિકૃત સરકારી નોટિફિકેશન્સ.</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <span>પોર્ટલ: <strong>india.gov.in</strong></span>
          <span>•</span>
          <span className="text-[#B3121B] font-black">પ્રમાણિત રાષ્ટ્રીય ડેસ્ક</span>
        </div>
      </section>

      {/* ==================== 9. BROADSHEET NEWSPAPER FOOTER ==================== */}
      <footer className="border-t border-slate-400 pt-0.5 pb-0.5 flex items-center justify-between text-[7px] font-bold text-slate-600 shrink-0">
        <div>
          <span>© ગુજરાત પોસ્ટ રાષ્ટ્રીય બ્યુરો, {displayCity} • નવી દિલ્હી • મુંબઈ • કોલકાતા • ચેન્નાઈ</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#B3121B] font-black uppercase">WWW.GUJARATPOST.IN</span>
          <span>•</span>
          <span>પાનું ૪ / ૧૪</span>
        </div>
      </footer>
    </div>
  );
};
