'use client';

import React from 'react';
import { EPaperPageData, getCleanText, formatGujaratiDate, BroadsheetArticle } from '../types';
import { Film, Clapperboard, Star, Music, Tv, Ticket, Sparkles, Heart, Flame, ShieldCheck, Newspaper } from 'lucide-react';

interface TemplateProps {
  data: EPaperPageData;
}

const cleanHeadline = (text?: string) => {
  if (!text) return '';
  return text.replace(/^#\d+\s*[-–—:]\s*/, '').trim();
};

export const EntertainmentTemplate: React.FC<TemplateProps> = ({ data }) => {
  const {
    pageNumber = 9,
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

  // 1. Box Office Ticker
  const showbizTicker = [
    { title: 'ઢોલીવુડ બ્લોકબસ્ટર', news: 'પ્રથમ સપ્તાહે ₹૩૫ કરોડ ગ્રોસ કલેક્શન', tag: 'ઓલ-ટાઇમ રેકોર્ડ' },
    { title: 'નેશનલ ફિલ્મ એવોર્ડ્સ', news: 'ગુજરાતી સિનેમાને ૩ શ્રેષ્ઠ કેટેગરીમાં એવોર્ડ', tag: 'ગૌરવ' },
    { title: 'ઓસ્કાર એન્ટ્રી ૨૦૨૭', news: 'ભારતીય ફિલ્મની સત્તાવાર શોર્ટલિસ્ટમાં પસંદગી', tag: 'હોલીવુડ' },
    { title: 'ઓટીટી પ્રીમિયર', news: 'નવી સસ્પેન્સ થ્રિલર સિરીઝ આ શુક્રવારે રિલીઝ', tag: 'સ્ટ્રીમિંગ' },
  ];

  // 2. Cinematic Lead Story
  const leadHeadline = cleanHeadline(
    leadArticle?.printHeadline ||
    leadArticle?.titleGu ||
    leadArticle?.title ||
    'ગુજરાતી સિનેમાનો સુવર્ણકાળ: આધુનિક સ્ટોરીટેલિંગ, VFX અને વૈશ્વિક રજૂઆતથી ઢોલીવુડ ફિલ્મો બોક્સ ઓફિસ પર છવાઈ'
  );

  const leadImage =
    leadArticle?.featuredImage ||
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80';

  const leadCaption =
    leadArticle?.photoCredit || 'તસવીર: ગુજરાત પોસ્ટ શોબિઝ • અમદાવાદ મલ્ટિપ્લેક્સ ખાતે પ્રીમિયર શો દરમિયાન ફિલ્મ સ્ટાર્સનો ભવ્ય મેળાવડો';

  const leadSummary =
    leadArticle?.printSummary ||
    getCleanText(
      leadArticle?.excerptGu ||
        leadArticle?.excerpt ||
        leadArticle?.contentGu ||
        leadArticle?.content ||
        'ગુજરાતી ફિલ્મ ઉદ્યોગ આજે અભૂતપૂર્વ પરિવર્તનના દોરમાંથી પસાર થઈ રહ્યો છે. યુવા નિર્દેશકો અને પ્રતિભાશાળી કલાકારો દ્વારા તૈયાર કરાતી ફિલ્મો દેશ-વિદેશના મલ્ટિપ્લેક્સમાં હાઉસફુલ શો સાથે દર્શકોનું દિલ જીતી રહી છે. મનોરંજન સાથે સામાજિક સંદેશ આપતી વાર્તાઓની લોકપ્રિયતા વધી છે.',
      280
    );

  const leadSecondParagraph = getCleanText(
    leadArticle?.contentGu ||
      leadArticle?.content ||
      'રાજ્ય સરકારની ફિલ્મ પ્રોત્સાહક નીતિ અને સબસિડી યોજનાના કારણે મોટા બજેટની ફિલ્મોનું નિર્માણ શક્ય બન્યું છે. યુએસ, યુકે, કેનેડા અને ઓસ્ટ્રેલિયામાં પણ ગુજરાતી ફિલ્મોને બહોળો દર્શકવર્ગ મળી રહ્યો છે.',
    260
  );

  const leadLocation = leadArticle?.location || 'અમદાવાદ';

  // 3. 7 Fast Showbiz Bulletins (Right 4 cols)
  const showbizBulletin = [
    { title: cleanHeadline(pool[0]?.printHeadline || pool[0]?.titleGu) || 'બોલીવુડ મેગાસ્ટારની નવી એક્શન ફિલ્મનું ટ્રેલર ૨૪ કલાકમાં ૫ કરોડ વ્યૂઝ', time: '૧૦:૧૫ AM', cat: 'બોલીવુડ' },
    { title: cleanHeadline(pool[1]?.printHeadline || pool[1]?.titleGu) || 'સંગીત ઉસ્તાદો દ્વારા નવરાત્રિ સ્પેશિયલ ગરબા આલ્બમ લોન્ચ', time: '૧૧:૩૦ AM', cat: 'સંગીત' },
    { title: cleanHeadline(pool[2]?.printHeadline || pool[2]?.titleGu) || 'ગુજરાતી નાટ્ય મહોત્સવ: મુંબઈ અને સુરતમાં ૧૫ નવા નાટકોનું મંચન', time: '૧૨:૪૫ PM', cat: 'રંગભૂમિ' },
    { title: cleanHeadline(pool[3]?.printHeadline || pool[3]?.titleGu) || 'OTT પ્લેટફોર્મ પર ગુજરાતી વેબ સિરીઝનો બીજો ભાગ રેકોર્ડ સ્ટ્રીમિંગ', time: '૦૨:૧૫ PM', cat: 'OTT' },
    { title: cleanHeadline(pool[4]?.printHeadline || pool[4]?.titleGu) || 'દાદાસાહેબ ફાળકે ઇન્ટરનેશનલ ફિલ્મ ફેસ્ટિવલમાં કલાકારોનું સન્માન', time: '૦૩:૩૦ PM', cat: 'એવોર્ડ્સ' },
    { title: cleanHeadline(pool[5]?.printHeadline || pool[5]?.titleGu) || 'હોલીવુડ સાયન્સ ફિક્શન મૂવી ભારતમાં ૪ ભાષાઓમાં રિલીઝ થશે', time: '૦૪:૪૫ PM', cat: 'હોલીવુડ' },
    { title: cleanHeadline(pool[6]?.printHeadline || pool[6]?.titleGu) || 'ટેલિવિઝન રેટિંગ્સ (TRP): ગુજરાતી રિયાલિટી શો નંબર વન બન્યો', time: '૦૬:૦૦ PM', cat: 'ટેલિવિઝન' },
  ];

  // 4. Secondary Showbiz Stories (2 prominent stories with photos)
  const secShow1 = {
    title: cleanHeadline(pool[7]?.printHeadline || pool[7]?.titleGu) || 'બોલીવુડ બિગ બજેટ પ્રોડક્શન્સ: ગુજરાતના પ્રાકૃતિક લોકેશન્સ ફિલ્મ શૂટિંગનું નવું ફેવરિટ ડેસ્ટિનેશન',
    image: pool[7]?.featuredImage || 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=500&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[7]?.excerptGu || pool[7]?.contentGu || 'કચ્છનું સફેદ રણ, ગીરના જંગલો અને સાબરમતી રિવરફ્રન્ટ પર બોલીવુડ અને દક્ષિણ ભારતીય સિનેમાના નિર્માતાઓ દ્વારા મોટાપાયે શૂટિંગ ચાલી રહ્યું છે.', 240),
    tag: 'ફિલ્મ શૂટિંગ હબ',
    byline: 'શોબિઝ બ્યુરો, મુંબઈ',
    art: pool[7]
  };

  const secShow2 = {
    title: cleanHeadline(pool[8]?.printHeadline || pool[8]?.titleGu) || 'ગુજરાતી રંગભૂમિ પુનર્જીવન: યુવા પેઢીમાં લાઈવ થિયેટર અને પ્રાયોગિક નાટકોનું વધતું આકર્ષણ',
    image: pool[8]?.featuredImage || 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=500&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[8]?.excerptGu || pool[8]?.contentGu || 'અમદાવાદ, વડોદરા અને મુંબઈના થિયેટરોમાં સામાજિક વિષયો અને કોમેડી નાટકોના હાઉસફુલ શો ચાલી રહ્યા છે. એડવાન્સ ટિકિટ બુકિંગમાં તેજી.', 240),
    tag: 'નાટ્ય દર્પણ',
    byline: 'કલ્ચરલ ડેસ્ક',
    art: pool[8]
  };

  // 5. Special In-Depth Spotlight (2 Ground Reports with Photos)
  const spotShow1 = {
    title: cleanHeadline(pool[9]?.printHeadline || pool[9]?.titleGu) || 'ઓટીટી સ્ટ્રીમિંગ ક્રાંતિ: પ્રાદેશિક ભાષાઓમાં કન્ટેન્ટ સર્જનથી સ્થાનિક પ્રતિભાઓને વૈશ્વિક મંચ',
    image: pool[9]?.featuredImage || 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[9]?.excerptGu || pool[9]?.contentGu || 'નેટફ્લિક્સ, એમેઝોન પ્રાઇમ અને જિયો સિનેમા દ્વારા પ્રાદેશિક સિરીઝ અને ફિલ્મો માટે ₹૫૦૦ કરોડનું વાર્ષિક બજેટ ફાળવાયું.', 240),
    badge: 'વિશેષ રિપોર્ટ',
    category: 'OTT ક્રાંતિ',
    byline: 'ડિજિટલ એન્ટરટેઈનમેન્ટ',
    art: pool[9]
  };

  const spotShow2 = {
    title: cleanHeadline(pool[10]?.printHeadline || pool[10]?.titleGu) || 'ગુજરાતી સુગમ સંગીત & લોકસાહિત્ય: ફ્યુઝન અને આધુનિક ઈન્સ્ટ્રુમેન્ટ્સ સાથે ગ્લોબલ ચાર્ટ્સમાં ચમક્યું',
    image: pool[10]?.featuredImage || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[10]?.excerptGu || pool[10]?.contentGu || 'લોકગીતો અને દોહા-છંદને આધુનિક બીટ્સ સાથે રજૂ કરતા યંગ આર્ટિસ્ટ્સ સ્પોટિફાય અને યુટ્યુબ પર મિલિયન સ્ટ્રીમ્સ મેળવી રહ્યા છે.', 240),
    badge: 'સંગીત સરવાણી',
    category: 'મ્યુઝિક ચાર્ટ્સ',
    byline: 'મ્યુઝિક એનાલિસ્ટ',
    art: pool[10]
  };

  // 6. 4-Entertainment Domain Matrix with photos
  const dhollywoodDomain = {
    title: 'ઢોલીવુડ સિનેમા',
    img: pool[11]?.featuredImage || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'મલ્ટિપ્લેક્સ', title: cleanHeadline(pool[11]?.printHeadline || pool[11]?.titleGu) || 'નવી પારિવારિક ફિલ્મનું એડવાન્સ બુકિંગ રેકોર્ડ સ્તરે' },
      { loc: 'એવોર્ડ્સ', title: cleanHeadline(pool[12]?.printHeadline || pool[12]?.titleGu) || 'શ્રેષ્ઠ અભિનેતા અને નિર્દેશક કેટેગરીમાં નોમિનેશન જાહેર' },
      { loc: 'સબસિડી', title: cleanHeadline(pool[13]?.printHeadline || pool[13]?.titleGu) || 'રાજ્ય સરકાર દ્વારા ૨૫ નવી ફિલ્મોને આર્થિક પ્રોત્સાહન' },
    ]
  };

  const bollywoodDomain = {
    title: 'બોલીવુડ ગેલરી',
    img: pool[14]?.featuredImage || 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'દિવાળી રિલીઝ', title: cleanHeadline(pool[14]?.printHeadline || pool[14]?.titleGu) || 'તહેવારો પર ૩ મેગા બજેટ ફિલ્મો વચ્ચે બોક્સ ઓફિસ ટક્કર' },
      { loc: 'કાસ્ટિંગ', title: cleanHeadline(pool[15]?.printHeadline || pool[15]?.titleGu) || 'ઐતિહાસિક ડ્રામા ફિલ્મમાં ટોચના સ્ટાર્સનો સંયુક્ત અભિનય' },
      { loc: 'મ્યુઝિક', title: cleanHeadline(pool[16]?.printHeadline || pool[16]?.titleGu) || 'નવું રોમેન્ટિક ગીત સોશિયલ મીડિયા પર નંબર વન ટ્રેન્ડિંગ' },
    ]
  };

  const ottWebDomain = {
    title: 'ઓટીટી & વેબ શોઝ',
    img: pool[17]?.featuredImage || 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'ક્રાઇમ થ્રિલર', title: cleanHeadline(pool[17]?.printHeadline || pool[17]?.titleGu) || 'અમદાવાદ બેઝ્ડ ઇન્વેસ્ટિગેટિવ સિરીઝને દર્શકોની દાદ' },
      { loc: 'કોમેડી', title: cleanHeadline(pool[18]?.printHeadline || pool[18]?.titleGu) || 'સ્ટુડન્ટ લાઇફ પર આધારિત નવી સિરીઝનું સ્ટ્રીમિંગ શરૂ' },
      { loc: 'ડોક્યુમેન્ટરી', title: cleanHeadline(pool[19]?.printHeadline || pool[19]?.titleGu) || 'ગીર સિંહ અને સાગરકાંઠા પર્યાવરણ ડોક્યુમેન્ટરી હિટ' },
    ]
  };

  const musicTheatreDomain = {
    title: 'સંગીત & લોકકળા',
    img: pool[20]?.featuredImage || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'સુગમ સંગીત', title: cleanHeadline(pool[20]?.printHeadline || pool[20]?.titleGu) || 'ગઝલ અને ગીત સ્પર્ધામાં રાજ્યના ૫૦ યુવા ગાયકો વિજેતા' },
      { loc: 'ડાયરો', title: cleanHeadline(pool[21]?.printHeadline || pool[21]?.titleGu) || 'સાહિત્યિક ડાયરામાં હાસ્ય અને શોર્ય રસની જમાવટ' },
      { loc: 'લાઈવ કોન્સર્ટ', title: cleanHeadline(pool[22]?.printHeadline || pool[22]?.titleGu) || 'વૈશ્વિક મ્યુઝિક ફેસ્ટિવલનું અમદાવાદમાં ભવ્ય આયોજન' },
    ]
  };

  // 7. 8 Movies, Music & Celebrity News Grid (2 rows of 4 cols with photos)
  const showbizGridStories = [
    {
      genre: 'ફિલ્મ રિવ્યુ',
      title: cleanHeadline(pool[23]?.printHeadline || pool[23]?.titleGu) || 'નવી સસ્પેન્સ મિસ્ટ્રી ફિલ્મ: ૪/૫ સ્ટાર રેટિંગ સાથે દર્શકોમાં હિટ',
      summary: getCleanText(pool[23]?.excerptGu || pool[23]?.contentGu || 'દમદાર સ્ક્રીનપ્લે, અણધાર્યા ટ્વિસ્ટ અને ઉત્કૃષ્ટ બેકગ્રાઉન્ડ સ્કોર.', 60),
      image: pool[23]?.featuredImage || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&auto=format&fit=crop&q=80',
    },
    {
      genre: 'સંગીત વાયર',
      title: cleanHeadline(pool[24]?.printHeadline || pool[24]?.titleGu) || 'નવું ક્લાસિકલ ફ્યુઝન ગીત બિલબોર્ડ ગ્લોબલ ચાર્ટ્સમાં પ્રવેશ્યું',
      summary: getCleanText(pool[24]?.excerptGu || pool[24]?.contentGu || 'ભારતીય શાસ્ત્રીય રાગ અને પશ્ચિમી ઓર્કેસ્ટ્રાનું અદભુત મિલન.', 60),
      image: pool[24]?.featuredImage || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
    },
    {
      genre: 'રંગમંચ',
      title: cleanHeadline(pool[25]?.printHeadline || pool[25]?.titleGu) || "ઐતિહાસિક નાટક 'સરદાર': ૧૦૦મા સિલ્વર જ્યુબિલી શોની ઉજવણી",
      summary: getCleanText(pool[25]?.excerptGu || pool[25]?.contentGu || 'ભારતના લોખંડી પુરુષના જીવન પર આધારિત નાટકને સ્ટેન્ડિંગ ઓવેશન.', 60),
      image: pool[25]?.featuredImage || 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=300&auto=format&fit=crop&q=80',
    },
    {
      genre: 'ઓટીટી સિરીઝ',
      title: cleanHeadline(pool[26]?.printHeadline || pool[26]?.titleGu) || 'બિઝનેસ ડ્રામા વેબ સિરીઝ: ભારતીય સ્ટાર્ટઅપ્સની સંઘર્ષગાથા',
      summary: getCleanText(pool[26]?.excerptGu || pool[26]?.contentGu || 'વાસ્તવિક ઘટનાઓ પર આધારિત રોમાંચક એપિસોડ્સ દર્શકોને જકડી રાખે છે.', 60),
      image: pool[26]?.featuredImage || 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=300&auto=format&fit=crop&q=80',
    },
    {
      genre: 'સાહિત્ય ઉત્સવ',
      title: cleanHeadline(pool[27]?.printHeadline || pool[27]?.titleGu) || 'અમદાવાદ લિટરેચર ફેસ્ટિવલમાં દેશ-વિદેશના લેખકોનો મેળાવડો',
      summary: getCleanText(pool[27]?.excerptGu || pool[27]?.contentGu || 'સમકાલીન નવલકથાઓ અને કવિતાઓ પર પરિસંવાદો અને પુસ્તક વિમોચન.', 60),
      image: pool[27]?.featuredImage || 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&auto=format&fit=crop&q=80',
    },
    {
      genre: 'લોકનૃત્ય',
      title: cleanHeadline(pool[28]?.printHeadline || pool[28]?.titleGu) || 'યુનેસ્કો અમૂર્ત વારસો: ગરબા ઉત્સવની વૈશ્વિક સ્તરે ભવ્ય ઉજવણી',
      summary: getCleanText(pool[28]?.excerptGu || pool[28]?.contentGu || 'લંડન, ન્યૂયોર્ક અને દુબઈમાં ભારતીય પ્રવાસીઓ દ્વારા પરંપરાગત રાસ-ગરબા.', 60),
      image: pool[28]?.featuredImage || 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=300&auto=format&fit=crop&q=80',
    },
    {
      genre: 'સિનેમા ટેક',
      title: cleanHeadline(pool[29]?.printHeadline || pool[29]?.titleGu) || 'IMAX લેસર અને ડોલ્બી એટમોસ 3D થિયેટર્સનું વિસ્તરણ',
      summary: getCleanText(pool[29]?.excerptGu || pool[29]?.contentGu || 'સિનેમા હોલમાં અલ્ટ્રા હાઇ ડેફિનેશન સ્ક્રીનિંગ અને ઇમર્સિવ સાઉન્ડ.', 60),
      image: pool[29]?.featuredImage || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&auto=format&fit=crop&q=80',
    },
    {
      genre: 'એનિમેશન',
      title: cleanHeadline(pool[30]?.printHeadline || pool[30]?.titleGu) || 'ભારતીય પૌરાણિક કથાઓ પર 3D એનિમેટેડ સીરિઝ તૈયાર',
      summary: getCleanText(pool[30]?.excerptGu || pool[30]?.contentGu || 'બાળકો અને પરિવારો માટે વૈશ્વિક સ્તરનું વર્લ્ડ ક્લાસ એનિમેશન.', 60),
      image: pool[30]?.featuredImage || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&auto=format&fit=crop&q=80',
    },
  ];

  // 8. Showbiz Pulse Briefs (6 columns)
  const showbizPulseBriefs = [
    { label: 'બોક્સ ઓફિસ', text: 'વીકએન્ડ પર મલ્ટિપ્લેક્સ ઓક્યુપન્સી ૮૮% નોંધાઈ.', ref: 'ટ્રેડ એનાલિસ્ટ' },
    { label: 'ફિલ્મ સબસિડી', text: 'નવી ૧૫ ગુજરાતી ફિલ્મોને ₹૫ કરોડની સબસિડી મંજૂર.', ref: 'માહિતી ખાતું' },
    { label: 'નેશનલ એવોર્ડ', text: 'પ્રાદેશિક સિનેમા કેટેગરીમાં ગુજરાતી ફિલ્મો મોખરે.', ref: 'ફિલ્મ ફેસ્ટિવલ' },
    { label: 'ડિજિટલ મ્યુઝિક', text: 'ગરબા ગીતોના સ્ટ્રીમિંગમાં વાર્ષિક ૪૦% નો ઉછાળો.', ref: 'ઓડિયો બોર્ડ' },
    { label: 'નાટ્ય સ્પર્ધા', text: 'આંતર-કોલેજ નાટ્ય સ્પર્ધામાં ૨૫ યુનિવર્સિટીઓ સામેલ.', ref: 'યુવા કલ્યાણ' },
    { label: 'સેન્સર બોર્ડ', text: 'તમામ ફિલ્મોને ઓનલાઇન સર્ટિફિકેશન પ્રક્રિયા ઝડપી બનાવાઈ.', ref: 'CBFC ડેસ્ક' },
  ];

  return (
    <div className="h-full flex flex-col p-2 bg-white border-[3px] border-slate-900 box-border text-slate-900 font-sans select-none overflow-hidden space-y-0.5 justify-between">
      {/* ==================== 1. SHOWBIZ RUNNING HEADER & FOLIO ==================== */}
      <header className="shrink-0">
        <div className="flex items-center justify-between text-[7.5px] font-bold text-slate-800 border-b border-slate-300 pb-0.5 mb-0.5">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-950 uppercase">ગુજરાત પોસ્ટ</span>
            <span className="text-slate-400">•</span>
            <span className="text-[#B3121B] font-black uppercase">સિનેમા, મનોરંજન & રંગભૂમિ</span>
            <span className="text-slate-400">•</span>
            <span>{gujaratiDateStr}</span>
          </div>
          <div className="flex items-center gap-2 font-extrabold">
            <span>શોબિઝ ડેસ્ક</span>
            <span>•</span>
            <span className="bg-[#B3121B] text-white px-1.5 py-0.2 rounded-xs text-[7px] font-black uppercase">
              પાનું ૯ / ૧૪
            </span>
            <span>•</span>
            <span>₹ ૧૫.૦૦</span>
          </div>
        </div>

        {/* Section Masthead Banner */}
        <div className="bg-slate-950 text-white px-2 py-0.5 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[8.5px] font-black uppercase tracking-wider rounded-xs flex items-center gap-1">
              <Film className="h-2.5 w-2.5" />
              <span>શોબિઝ વાયર • CINEMA, THEATRE & ENTERTAINMENT</span>
            </span>
            <span className="text-slate-300 text-[8px] font-bold truncate">
              ઢોલીવુડ, બોલીવુડ, ઓટીટી, ગુજરાતી રંગભૂમિ, સંગીત અને સેલિબ્રિટી સમાચાર
            </span>
          </div>
          <div className="flex items-center gap-1 text-amber-300 text-[7.5px] font-extrabold shrink-0">
            <Clapperboard className="h-2.5 w-2.5" />
            <span>મુંબઈ-અમદાવાદ બ્યુરો</span>
          </div>
        </div>

        {/* Box Office Ticker Ribbon */}
        <div className="grid grid-cols-4 gap-1 bg-slate-100 border-x border-b border-slate-300 p-0.5 text-[6.8px] font-bold text-slate-700">
          {showbizTicker.map((s, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-0.5 flex flex-col justify-between">
              <span className="text-slate-500 font-extrabold truncate">{s.title}</span>
              <span className="text-[7.5px] font-black text-slate-950 truncate">{s.news}</span>
              <span className="text-[5.8px] font-bold text-rose-700">{s.tag}</span>
            </div>
          ))}
        </div>
      </header>

      {/* ==================== 2. UPPER SHOWBIZ GRID (8 COLS LEAD + 4 COLS BULLETIN) ==================== */}
      <section className="grid grid-cols-12 gap-2 border-b-2 border-slate-900 pb-1 pt-0.5 shrink-0 items-stretch">
        {/* Left 8 Columns: Dominant Lead Cinema Story */}
        <div className="col-span-8 border-r-2 border-slate-900 pr-2 space-y-0.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[7px] font-bold text-slate-600 mb-0.2">
              <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[7px] font-black rounded-xs uppercase">
                ઢોલીવુડ વિશેષ • બોક્સ ઓફિસ તેજી
              </span>
              <span>અમદાવાદ મલ્ટિપ્લેક્સ બ્યુરો</span>
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
                <span className="text-[#B3121B] font-bold shrink-0 ml-1">► સંપૂર્ણ રિવ્યુ</span>
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
                  <span>• મલ્ટિપ્લેક્સ હાઉસફુલ</span>
                  <span>• ગ્લોબલ રિલીઝ</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>• ફિલ્મ સબસિડી પોલિસી</span>
                  <span>• યુવા નિર્દેશકો</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Columns: 7 Fast Showbiz Bulletins */}
        <div className="col-span-4 flex flex-col justify-between space-y-0.5 bg-slate-50 p-1 border border-slate-300">
          <div className="flex items-center justify-between border-b border-slate-300 pb-0.5">
            <span className="bg-slate-900 text-amber-300 text-[7px] font-black px-1.5 py-0.2 rounded-xs uppercase">
              શોબિઝ ડાયરી • 7 FAST UPDATES
            </span>
            <span className="text-[#B3121B] text-[6.5px] font-bold">લાઇવ અપડેટ</span>
          </div>

          <div className="space-y-0.5 flex-1 flex flex-col justify-between">
            {showbizBulletin.map((item, idx) => (
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
            <span>સિનેમા & મનોરંજન ડેસ્ક</span>
            <span className="text-[#B3121B]">► સંપૂર્ણ લિસ્ટ પાના ૯ પર</span>
          </div>
        </div>
      </section>

      {/* ==================== 3. 2 PROMINENT SECONDARY SHOWBIZ STORIES (WITH PHOTOS) ==================== */}
      <section className="grid grid-cols-2 gap-2.5 border-b-2 border-slate-900 pb-1 pt-0.5 shrink-0">
        {/* Story 1 */}
        <div className="space-y-0.5 border-r border-slate-300 pr-2.5">
          <div className="flex items-center justify-between text-[7px] font-bold text-slate-500">
            <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[6.5px] font-black rounded-xs uppercase">
              {secShow1.tag}
            </span>
            <span className="text-[#B3121B] font-bold">► શૂટિંગ લોકેશન્સ</span>
          </div>

          <h3 className="text-[10.5px] font-black leading-tight text-slate-950 line-clamp-1">
            {secShow1.title}
          </h3>

          <div className="flex gap-2 items-start mt-0.5">
            <div className="w-[100px] shrink-0 space-y-0.5">
              <div className="w-[100px] h-[66px] overflow-hidden border border-slate-300 bg-slate-100">
                <img src={secShow1.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                તસવીર: ગુજરાત પોસ્ટ
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between min-h-[66px] space-y-0.5">
              <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                {secShow1.summary}
              </p>
              <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                <span className="text-slate-800 font-extrabold truncate">
                  {secShow1.byline}
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
              {secShow2.tag}
            </span>
            <span className="text-[#B3121B] font-bold">► નાટ્ય સમીક્ષા</span>
          </div>

          <h3 className="text-[10.5px] font-black leading-tight text-slate-950 line-clamp-1">
            {secShow2.title}
          </h3>

          <div className="flex gap-2 items-start mt-0.5">
            <div className="w-[100px] shrink-0 space-y-0.5">
              <div className="w-[100px] h-[66px] overflow-hidden border border-slate-300 bg-slate-100">
                <img src={secShow2.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                તસવીર: ગુજરાત પોસ્ટ
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between min-h-[66px] space-y-0.5">
              <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                {secShow2.summary}
              </p>
              <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                <span className="text-slate-800 font-extrabold truncate">
                  {secShow2.byline}
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
            <span>OTT ક્રાંતિ & સુગમ સંગીત સમીક્ષા (OTT & MUSIC SPOTLIGHT)</span>
          </span>
          <span className="text-[6.5px] font-bold text-slate-600">પ્રાદેશિક વેબ કન્ટેન્ટ & લોકસાહિત્ય ફ્યુઝન</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Spot 1 */}
          <div className="space-y-0.5 border-r border-slate-300 pr-2.5">
            <div className="flex items-center justify-between text-[6.5px] font-bold">
              <span className="bg-indigo-800 text-white px-1.5 py-0.1 text-[6px] font-black rounded-xs uppercase">
                {spotShow1.badge} • {spotShow1.category}
              </span>
              <span className="text-[#B3121B] font-bold">► OTT રિપોર્ટ</span>
            </div>

            <h4 className="text-[10px] font-black leading-tight text-slate-950 line-clamp-1">
              {spotShow1.title}
            </h4>

            <div className="flex gap-2 items-start mt-0.5">
              <div className="w-[100px] shrink-0 space-y-0.5">
                <div className="w-[100px] h-[66px] overflow-hidden border border-slate-300 bg-slate-100">
                  <img src={spotShow1.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
                </div>
                <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                  તસવીર: ગુજરાત પોસ્ટ
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between min-h-[66px] space-y-0.5">
                <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                  {spotShow1.summary}
                </p>
                <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                  <span className="text-slate-800 font-extrabold truncate">
                    {spotShow1.byline}
                  </span>
                  <span className="text-[#B3121B] font-black shrink-0">
                    સિરીઝ પાના ૦૬
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Spot 2 */}
          <div className="space-y-0.5">
            <div className="flex items-center justify-between text-[6.5px] font-bold">
              <span className="bg-emerald-800 text-white px-1.5 py-0.1 text-[6px] font-black rounded-xs uppercase">
                {spotShow2.badge} • {spotShow2.category}
              </span>
              <span className="text-[#B3121B] font-bold">► મ્યુઝિક ચાર્ટ્સ</span>
            </div>

            <h4 className="text-[10px] font-black leading-tight text-slate-950 line-clamp-1">
              {spotShow2.title}
            </h4>

            <div className="flex gap-2 items-start mt-0.5">
              <div className="w-[100px] shrink-0 space-y-0.5">
                <div className="w-[100px] h-[66px] overflow-hidden border border-slate-300 bg-slate-100">
                  <img src={spotShow2.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
                </div>
                <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                  તસવીર: ગુજરાત પોસ્ટ
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between min-h-[66px] space-y-0.5">
                <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                  {spotShow2.summary}
                </p>
                <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                  <span className="text-slate-800 font-extrabold truncate">
                    {spotShow2.byline}
                  </span>
                  <span className="text-[#B3121B] font-black shrink-0">
                    ગીતો પાના ૦૬
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 5. 4-ENTERTAINMENT DOMAIN MATRIX (WITH PHOTOS) ==================== */}
      <section className="border-b-2 border-slate-900 pb-0.5 shrink-0">
        <div className="flex items-center justify-between text-[7px] font-black text-slate-950 mb-0.5 border-b border-slate-300 pb-0.2">
          <span className="bg-slate-900 text-white px-1 py-0.2 text-[6.5px] uppercase rounded-xs">
            ૪ મનોરંજન ક્ષેત્રો • 4 SHOWBIZ DOMAINS
          </span>
          <span className="text-slate-500 text-[6.5px]">ઢોલીવુડ • બોલીવુડ • ઓટીટી & વેબ શોઝ • સંગીત & લોકકળા</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {/* Domain 1: Dhollywood */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-[#B3121B] text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {dhollywoodDomain.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={dhollywoodDomain.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {dhollywoodDomain.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► સિનેમા રિપોર્ટ</span>
          </div>

          {/* Domain 2: Bollywood */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-slate-900 text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {bollywoodDomain.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={bollywoodDomain.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {bollywoodDomain.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► બોલીવુડ ગેલરી</span>
          </div>

          {/* Domain 3: OTT Web */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-amber-700 text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {ottWebDomain.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={ottWebDomain.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {ottWebDomain.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► OTT સમીક્ષા</span>
          </div>

          {/* Domain 4: Music & Theatre */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-emerald-800 text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {musicTheatreDomain.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={musicTheatreDomain.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {musicTheatreDomain.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► સંગીત મંચ</span>
          </div>
        </div>
      </section>

      {/* ==================== 6. 8 MOVIES, MUSIC & CELEBRITY GRID (2 ROWS OF 4 COLS) ==================== */}
      <section className="border-b-2 border-slate-900 pb-0.5 pt-0.2 shrink-0 space-y-0.5">
        <div className="flex items-center justify-between text-[7px] font-black text-slate-950 border-b border-slate-300 pb-0.2">
          <span className="bg-[#B3121B] text-white px-1 py-0.2 text-[6.5px] uppercase rounded-xs flex items-center gap-1">
            <Newspaper className="h-2 w-2" />
            <span>સિનેમા સમીક્ષા & સેલિબ્રિટી ડાયરી (MOVIES & CELEBRITY DIGEST)</span>
          </span>
          <span className="text-slate-500 text-[6.2px]">મનોરંજન જગતની ૮ પ્રમુખ રજૂઆતો</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {showbizGridStories.map((item, idx) => (
            <div
              key={idx}
              className={`space-y-0.5 ${idx % 4 !== 3 ? 'border-r border-slate-300 pr-1.5' : ''} ${idx >= 4 ? 'pt-0.5 border-t border-slate-200' : ''}`}
            >
              <div className="flex items-center justify-between text-[6.5px] font-bold text-slate-500">
                <span className="text-[#B3121B] font-black uppercase">[{item.genre}]</span>
                <span className="text-[5.8px] text-slate-400">શોબિઝ</span>
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

      {/* ==================== 7. SHOWBIZ PULSE BRIEFS (6 COLUMNS) ==================== */}
      <section className="shrink-0 space-y-0.5 border-b border-slate-400 pb-0.5">
        <div className="flex items-center gap-1.5 border-b border-slate-300 pb-0.2">
          <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[7px] font-black uppercase rounded-xs">
            સિનેમા પલ્સ • SHOWBIZ BRIEFS
          </span>
          <span className="text-[6.5px] text-slate-500 font-bold">બોક્સ ઓફિસ, મ્યુઝિક રેટિંગ્સ અને એવોર્ડ્સ</span>
        </div>

        <div className="grid grid-cols-6 gap-1 pt-0.2">
          {showbizPulseBriefs.map((brief, idx) => (
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

      {/* ==================== 8. CULTURAL & FILM BOARD STRIP ==================== */}
      <section className="bg-slate-50 border border-dashed border-slate-400 p-0.5 rounded-xs flex items-center justify-between text-[6.5px] font-bold text-slate-700 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="bg-slate-900 text-amber-300 px-1 py-0.2 rounded-xs text-[6px] font-black uppercase flex items-center gap-0.5">
            <ShieldCheck className="h-2 w-2" />
            <span>ગુજરાત સિનેમા & સાંસ્કૃતિક પરિષદ</span>
          </span>
          <span>ગુજરાતી ફિલ્મ નિર્માણ સબસિડી, લોકેશન શૂટિંગ પરમિશન અને કલાકાર કલ્યાણ નિધિ.</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <span>પોર્ટલ: <strong>gujarattourism.com/films</strong></span>
          <span>•</span>
          <span className="text-[#B3121B] font-black">પ્રમાણિત શોબિઝ ડેસ્ક</span>
        </div>
      </section>

      {/* ==================== 9. BROADSHEET NEWSPAPER FOOTER ==================== */}
      <footer className="border-t border-slate-400 pt-0.5 pb-0.5 flex items-center justify-between text-[7px] font-bold text-slate-600 shrink-0">
        <div>
          <span>© ગુજરાત પોસ્ટ સિનેમા બ્યુરો, {displayCity} • મુંબઈ • અમદાવાદ • સુરત • લોસ એન્જલસ</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#B3121B] font-black uppercase">WWW.GUJARATPOST.IN</span>
          <span>•</span>
          <span>પાનું ૯ / ૧૪</span>
        </div>
      </footer>
    </div>
  );
};
