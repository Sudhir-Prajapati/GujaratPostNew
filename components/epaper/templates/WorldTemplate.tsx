'use client';

import React from 'react';
import { EPaperPageData, getCleanText, formatGujaratiDate, BroadsheetArticle } from '../types';
import { Globe2, Plane, Compass, DollarSign, ShieldAlert, Sparkles, MapPin, CheckCircle2, ShieldCheck, Flame, Newspaper } from 'lucide-react';

interface TemplateProps {
  data: EPaperPageData;
}

const cleanHeadline = (text?: string) => {
  if (!text) return '';
  return text.replace(/^#\d+\s*[-–—:]\s*/, '').trim();
};

export const WorldTemplate: React.FC<TemplateProps> = ({ data }) => {
  const {
    pageNumber = 5,
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

  // 1. World Timezones & Markets Strip
  const worldTimezones = [
    { city: 'ન્યૂયોર્ક (EST)', time: '૦૧:૩૦ AM', status: 'વોલ સ્ટ્રીટ સ્થિર' },
    { city: 'લંડન (GMT)', time: '૦૬:૩૦ AM', status: 'FTSE ફ્યુચર્સ પોઝિટિવ' },
    { city: 'દુબઈ (GST)', time: '૧૦:૩૦ AM', status: 'ખાડી વેપાર શરૂ' },
    { city: 'ટોક્યો (JST)', time: '૦૩:૩૦ PM', status: 'નિક્કી ૨૨૫ +૧.૨%' },
  ];

  // 2. Global Lead Story
  const leadHeadline = cleanHeadline(
    leadArticle?.printHeadline ||
    leadArticle?.titleGu ||
    leadArticle?.title ||
    'સંયુક્ત રાષ્ટ્ર સુરક્ષા પરિષદ (UNSC) માં વૈશ્વિક શાંતિ ઠરાવ: આબોહવા પરિવર્તન અને સાયબર સુરક્ષા સહયોગ પર ૧૯૩ દેશોની સહમતિ'
  );

  const leadImage =
    leadArticle?.featuredImage ||
    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80';

  const leadCaption =
    leadArticle?.photoCredit || 'તસવીર: ગુજરાત પોસ્ટ વાયર • ન્યૂયોર્ક: યુએન મુખ્યાલય ખાતે ૧૯૩ દેશોના વડાઓની વાર્ષિક મહાસભા';

  const leadSummary =
    leadArticle?.printSummary ||
    getCleanText(
      leadArticle?.excerptGu ||
        leadArticle?.excerpt ||
        leadArticle?.contentGu ||
        leadArticle?.content ||
        'ન્યૂયોર્કમાં યોજાયેલી સંયુક્ત રાષ્ટ્ર મહાસભામાં વિશ્વના અગ્રણી નેતાઓએ આંતરરાષ્ટ્રીય સરહદો પર શાંતિ જાળવવા અને સાયબર હુમલાઓ રોકવા સંયુક્ત સંકલ્પ લીધો છે. ભારતના પ્રતિનિધિમંડળે ગ્લોબલ સાઉથના દેશોના હિતોનું જોરદાર સમર્થન કર્યું હતું.',
      280
    );

  const leadSecondParagraph = getCleanText(
    leadArticle?.contentGu ||
      leadArticle?.content ||
      'વિશ્વ શાંતિ માટે આતંકવાદ સામે શૂન્ય સહિષ્ણુતા નીતિ અપનાવવા તેમજ સ્વચ્છ ઊર્જા તરફ ઝડપી સંક્રમણ માટે વિકસિત દેશો દ્વારા $૧૦૦ અબજના ક્લાઇમેટ ફંડની ખાતરી આપવામાં આવી છે.',
    260
  );

  const leadLocation = leadArticle?.location || 'ન્યૂયોર્ક';

  // 3. 7 Fast World Wire Updates (Right 4 cols)
  const worldBulletin = [
    { title: cleanHeadline(pool[0]?.printHeadline || pool[0]?.titleGu) || 'અમેરિકી ફેડરલ રિઝર્વ: વ્યાજદરમાં ૦.૨૫% નો ઘટાડો, વૈશ્વિક બજારોમાં તેજી', time: '૦૯:૩૦ AM', cat: 'અમેરિકા' },
    { title: cleanHeadline(pool[1]?.printHeadline || pool[1]?.titleGu) || 'યુરોપિયન યુનિયન દ્વારા આર્ટિફિશિયલ ઇન્ટેલિજન્સ એક્ટ અમલમાં મુકાયો', time: '૧૧:૦૦ AM', cat: 'યુરોપ' },
    { title: cleanHeadline(pool[2]?.printHeadline || pool[2]?.titleGu) || 'દુબઈમાં વર્લ્ડ ગ્રીન ઇકોનોમી સમિટ: ભારત સાથે ₹૨૫,૦૦૦ કરોડના કરાર', time: '૧૨:૪૫ PM', cat: 'મિડલ ઈસ્ટ' },
    { title: cleanHeadline(pool[3]?.printHeadline || pool[3]?.titleGu) || 'જાપાન અને દક્ષિણ કોરિયા વચ્ચે નવી સેમિકન્ડક્ટર ભાગીદારી શરૂ', time: '૦૨:૧૫ PM', cat: 'એશિયા' },
    { title: cleanHeadline(pool[4]?.printHeadline || pool[4]?.titleGu) || 'બ્રિટન સંસદમાં ફ્રી ટ્રેડ એગ્રીમેન્ટ (FTA) પર ચર્ચા તેજ બની', time: '૦૩:૩૦ PM', cat: 'યુકે' },
    { title: cleanHeadline(pool[5]?.printHeadline || pool[5]?.titleGu) || 'ઓસ્ટ્રેલિયામાં ભારતીય વિદ્યાર્થીઓ માટે વર્ક વિઝા નિયમો સરળ કરાયા', time: '૦૪:૪૫ PM', cat: 'ઓશનિયા' },
    { title: cleanHeadline(pool[6]?.printHeadline || pool[6]?.titleGu) || 'જી-૨૦ શિખર પરિષદમાં આફ્રિકન યુનિયનના એકીકરણની પ્રશંસા', time: '૦૬:૦૦ PM', cat: 'જી-૨૦' },
  ];

  // 4. Secondary Global Stories (2 prominent stories with photos)
  const secWorld1 = {
    title: cleanHeadline(pool[7]?.printHeadline || pool[7]?.titleGu) || 'અમેરિકા-યુરોપ ટેક સમિટ: વૈશ્વિક ડેટા સુરક્ષા અને AI નિયમન માટે સંયુક્ત માળખું',
    image: pool[7]?.featuredImage || 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=500&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[7]?.excerptGu || pool[7]?.contentGu || 'વોશિંગ્ટન અને બ્રસેલ્સ વચ્ચે ટેકનોલોજી એકાધિકાર નિયંત્રિત કરવા અને આર્ટિફિશિયલ ઇન્ટેલિજન્સના નૈતિક ઉપયોગ માટે નવી આંતરરાષ્ટ્રીય માર્ગદર્શિકા તૈયાર કરાઈ છે.', 240),
    tag: 'ટેક પોલિસી',
    byline: 'વોશિંગ્ટન બ્યુરો',
    art: pool[7]
  };

  const secWorld2 = {
    title: cleanHeadline(pool[8]?.printHeadline || pool[8]?.titleGu) || 'ખાડી દેશોમાં ગ્રીન હાઇડ્રોજન ક્રાંતિ: સાઉદી અરેબિયા અને UAE માં $૫૦ અબજનું મૂડીરોકાણ',
    image: pool[8]?.featuredImage || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=500&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[8]?.excerptGu || pool[8]?.contentGu || 'ઓઇલ અર્થતંત્રમાંથી રિન્યુએબલ એનર્જી તરફ વળવા અખાતી દેશો વિશ્વના સૌથી મોટા સોલાર અને હાઇડ્રોજન પ્લાન્ટ્સ ઊભા કરી રહ્યા છે. ભારતીય કંપનીઓને મોટા કોન્ટ્રાક્ટ્સ.', 240),
    tag: 'ગ્રીન એનર્જી',
    byline: 'દુબઈ પ્રતિનિધિ',
    art: pool[8]
  };

  // 5. Special In-Depth Spotlight (2 Ground Reports with Photos)
  const spotWorld1 = {
    title: cleanHeadline(pool[9]?.printHeadline || pool[9]?.titleGu) || 'ઈન્ડો-પેસિફિક સમુદ્રી સુરક્ષા: ક્વાડ (QUAD) દેશો દ્વારા સંયુક્ત નેવલ પેટ્રોલિંગ અને સેટેલાઇટ ટ્રેકિંગ',
    image: pool[9]?.featuredImage || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[9]?.excerptGu || pool[9]?.contentGu || 'ભારત, અમેરિકા, જાપાન અને ઓસ્ટ્રેલિયા વચ્ચે દરિયાઈ વેપાર માર્ગોની સુરક્ષા અને કુદરતી આપત્તિ રાહત માટે અદ્યતન ડિજિટલ મોનિટરિંગ સેન્ટર કાર્યરત કરાયું.', 240),
    badge: 'સંરક્ષણ વિશ્લેષણ',
    category: 'ક્વાડ સમિટ',
    byline: 'ઇન્ડો-પેસિફિક ડેસ્ક',
    art: pool[9]
  };

  const spotWorld2 = {
    title: cleanHeadline(pool[10]?.printHeadline || pool[10]?.titleGu) || 'ગ્લોબલ ક્લાઇમેટ સમિટ: આર્ક્ટિક હિમશિલાઓ પીગળવા સામે વિશ્વના વૈજ્ઞાનિકોની નવી ચેતવણી',
    image: pool[10]?.featuredImage || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[10]?.excerptGu || pool[10]?.contentGu || 'જિનીવા ખાતે ક્લાઇમેટ પેનલના તાજા અહેવાલ મુજબ કાર્બન ઉત્સર્જન ઘટાડવા તમામ ઔદ્યોગિક દેશોએ ૨૦૩૦ સુધીમાં ૫૦% ગ્રીન એનર્જી લક્ષ્યાંક સિદ્ધ કરવો અનિવાર્ય છે.', 240),
    badge: 'પર્યાવરણ એલર્ટ',
    category: 'ક્લાઇમેટ સમિટ',
    byline: 'જિનીવા બ્યુરો',
    art: pool[10]
  };

  // 6. 4-Continent Global Matrix (Americas, Europe, Asia-Pacific, Middle East) with photos
  const americasZone = {
    title: 'અમેરિકા ખંડ (AMERICAS)',
    img: pool[11]?.featuredImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'વોશિંગ્ટન', title: cleanHeadline(pool[11]?.printHeadline || pool[11]?.titleGu) || 'અમેરિકામાં નવા ઇમિગ્રેશન સુધારા ખરડા પર ચર્ચા' },
      { loc: 'સિલિકોન વેલી', title: cleanHeadline(pool[12]?.printHeadline || pool[12]?.titleGu) || 'ટેક જાયન્ટ્સ દ્વારા ક્વોન્ટમ કમ્પ્યુટિંગમાં મોટી સફળતા' },
      { loc: 'બ્રાઝિલ', title: cleanHeadline(pool[13]?.printHeadline || pool[13]?.titleGu) || 'એમેઝોન રેઇનફોરેસ્ટ સંરક્ષણ માટે ગ્લોબલ ફંડની સ્થાપના' },
    ]
  };

  const europeZone = {
    title: 'યુરોપ ખંડ (EUROPE)',
    img: pool[14]?.featuredImage || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'લંડન', title: cleanHeadline(pool[14]?.printHeadline || pool[14]?.titleGu) || 'બેંક ઓફ ઈંગ્લેન્ડ દ્વારા ફુગાવા નિયંત્રણ માટે નવા પગલાં' },
      { loc: 'પેરિસ', title: cleanHeadline(pool[15]?.printHeadline || pool[15]?.titleGu) || 'ફ્રાન્સમાં ન્યૂક્લિયર એનર્જી પ્રોજેક્ટ્સનું આધુનિકીકરણ' },
      { loc: 'બર્લિન', title: cleanHeadline(pool[16]?.printHeadline || pool[16]?.titleGu) || 'જર્મન ઓટોમોબાઇલ ઉદ્યોગમાં ૧૦૦% ઈ-વ્હીકલ તરફ સ્થળાંતર' },
    ]
  };

  const asiaPacificZone = {
    title: 'એશિયા-પેસિફિક (ASIA-PACIFIC)',
    img: pool[17]?.featuredImage || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'ટોક્યો', title: cleanHeadline(pool[17]?.printHeadline || pool[17]?.titleGu) || 'જાપાનમાં બુલેટ ટ્રેન નેટવર્કનું હાઇડ્રોજન સંચાલિત વિસ્તરણ' },
      { loc: 'સિંગાપોર', title: cleanHeadline(pool[18]?.printHeadline || pool[18]?.titleGu) || 'ગ્લોબલ ફિનટેક સમિટમાં ભારતીય પેમેન્ટ્સ સિસ્ટમની પ્રશંસા' },
      { loc: 'સિડની', title: cleanHeadline(pool[19]?.printHeadline || pool[19]?.titleGu) || 'ઓસ્ટ્રેલિયામાં ક્રિટિકલ મિનરલ્સ એક્સપ્લોરેશન મિશન શરૂ' },
    ]
  };

  const middleEastAfricaZone = {
    title: 'મધ્ય પૂર્વ & આફ્રિકા (MENA)',
    img: pool[20]?.featuredImage || 'https://images.unsplash.com/photo-1596405835955-465de5c3dfb7?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'રિયાધ', title: cleanHeadline(pool[20]?.printHeadline || pool[20]?.titleGu) || 'સાઉદી વિઝન ૨૦૩૦: નિયોમ સિટી પ્રોજેક્ટમાં ભારત ભાગીદાર' },
      { loc: 'અબુ ધાબી', title: cleanHeadline(pool[21]?.printHeadline || pool[21]?.titleGu) || 'ભારત-યુએઈ લોકલ કરન્સી સેટલમેન્ટ વોલ્યુમ બમણું' },
      { loc: 'કૈરો', title: cleanHeadline(pool[22]?.printHeadline || pool[22]?.titleGu) || 'સુએઝ કેનાલ ઇકોનોમિક ઝોનમાં નવા ઇન્ડસ્ટ્રીયલ પાર્ક્સ' },
    ]
  };

  // 7. 8 Global Geo-Politics & Economy Stories (2 rows of 4 cols with photos)
  const worldGridStories = [
    {
      region: 'વોશિંગ્ટન',
      title: cleanHeadline(pool[23]?.printHeadline || pool[23]?.titleGu) || 'અમેરિકામાં ઇન્ફ્રાસ્ટ્રક્ચર બિલ હેઠળ $૧ ટ્રિલિયનનું રાષ્ટ્રીય રોકાણ',
      summary: getCleanText(pool[23]?.excerptGu || pool[23]?.contentGu || 'બ્રિજ, હાઇવે, ક્લીન વોટર અને હાઇ-સ્પીડ ઇન્ટરનેટ કનેક્ટિવિટી માટે ગ્રાન્ટ્સ.', 60),
      image: pool[23]?.featuredImage || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=300&auto=format&fit=crop&q=80',
    },
    {
      region: 'લંડન',
      title: cleanHeadline(pool[24]?.printHeadline || pool[24]?.titleGu) || 'ટેમ્સ વેલીમાં નવું ગ્લોબલ લાઇફ સાયન્સિસ એન્ડ મેડિકલ રિસર્ચ પાર્ક',
      summary: getCleanText(pool[24]?.excerptGu || pool[24]?.contentGu || 'કેન્સર અને જિનેટિક રોગોના સચોટ ઇલાજ માટે અબજો પાઉન્ડના પ્રોજેક્ટ્સ.', 60),
      image: pool[24]?.featuredImage || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=300&auto=format&fit=crop&q=80',
    },
    {
      region: 'ટોક્યો',
      title: cleanHeadline(pool[25]?.printHeadline || pool[25]?.titleGu) || 'જાપાન સ્પેસ એજન્સીનું નવું મૂન લેન્ડર રોવર સફળતાપૂર્વક કાર્યરત',
      summary: getCleanText(pool[25]?.excerptGu || pool[25]?.contentGu || 'ચંદ્રની સપાટી પર ખનિજ સંસાધનો અને જળ સ્ત્રોતોની શોધખોળ શરૂ કરાઈ.', 60),
      image: pool[25]?.featuredImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&auto=format&fit=crop&q=80',
    },
    {
      region: 'દુબઈ',
      title: cleanHeadline(pool[26]?.printHeadline || pool[26]?.titleGu) || 'દુબઈ AI & વેબ3 સેન્ટરમાં વૈશ્વિક કંપનીઓનું નવું હેડક્વાર્ટર',
      summary: getCleanText(pool[26]?.excerptGu || pool[26]?.contentGu || 'ડિજિટલ એસેટ્સ અને આર્ટિફિશિયલ ઇન્ટેલિજન્સ ઇનોવેશન માટે સ્પેશિયલ ફ્રી ઝોન.', 60),
      image: pool[26]?.featuredImage || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=300&auto=format&fit=crop&q=80',
    },
    {
      region: 'જિનીવા',
      title: cleanHeadline(pool[27]?.printHeadline || pool[27]?.titleGu) || 'WHO દ્વારા નવી ગ્લોબલ હેલ્થ ઇમરજન્સી પ્રિપેરેડનેસ ગાઇડલાઇન્સ',
      summary: getCleanText(pool[27]?.excerptGu || pool[27]?.contentGu || 'તમામ સભ્ય રાષ્ટ્રોમાં રોગચાળા સામે ઝડપી રસી વિતરણ માટે સંયુક્ત ફંડ.', 60),
      image: pool[27]?.featuredImage || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&auto=format&fit=crop&q=80',
    },
    {
      region: 'સિંગાપોર',
      title: cleanHeadline(pool[28]?.printHeadline || pool[28]?.titleGu) || 'સિંગાપોર પોર્ટ પર વિશ્વનું પ્રથમ સંપૂર્ણ સ્વાયત્ત કન્ટેનર યાર્ડ',
      summary: getCleanText(pool[28]?.excerptGu || pool[28]?.contentGu || 'AI સંચાલિત ક્રેન્સ અને ઇલેક્ટ્રિક વાહનો દ્વારા વાર્ષિક ૬.૫ કરોડ TEU હેન્ડલિંગ.', 60),
      image: pool[28]?.featuredImage || 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=300&auto=format&fit=crop&q=80',
    },
    {
      region: 'સિડની',
      title: cleanHeadline(pool[29]?.printHeadline || pool[29]?.titleGu) || 'ઓસ્ટ્રેલિયામાં ગ્રેટ બેરિયર રીફ સંરક્ષણ માટે ડ્રોન મોનિટરિંગ',
      summary: getCleanText(pool[29]?.excerptGu || pool[29]?.contentGu || 'સમુદ્રી પરવાળાનું રક્ષણ કરવા માટે અદ્યતન અંડરવોટર સેન્સર સિસ્ટમ સ્થાપિત.', 60),
      image: pool[29]?.featuredImage || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop&q=80',
    },
    {
      region: 'બર્લિન',
      title: cleanHeadline(pool[30]?.printHeadline || pool[30]?.titleGu) || 'જર્મનીમાં સોલિડ-સ્ટેટ બેટરી ટેકનોલોજી પ્લાન્ટનું નિર્માણ શરૂ',
      summary: getCleanText(pool[30]?.excerptGu || pool[30]?.contentGu || 'ઇલેક્ટ્રિક કાર માટે ૧,૦૦૦ કિમી રેન્જ આપતી નવીનતમ બેટરી સેલ્સનું ઉત્પાદન.', 60),
      image: pool[30]?.featuredImage || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=300&auto=format&fit=crop&q=80',
    },
  ];

  // 8. Global Barometer Briefs (6 columns)
  const globalPulseBriefs = [
    { label: 'વૈશ્વિક ક્રૂડ', text: 'ઓપેક પ્લસ દ્વારા ઉત્પાદન સ્તર યથાવત રખાતા ક્રૂડ $૭૮ પ્રતિ બેરલ.', ref: 'ઓઇલ બ્યુરો' },
    { label: 'વિશ્વ બેંક', text: 'વિકાસશીલ દેશો માટે નવીન ક્લાઇમેટ રેઝિલિયન્સ લોન સ્કીમ મંજૂર.', ref: 'વોશિંગ્ટન' },
    { label: 'WTO વેપાર', text: 'વૈશ્વિક ઈ-કોમર્સ વેપારમાં વાર્ષિક ૧૮% વૃદ્ધિ સાથે નવો વિક્રમ.', ref: 'જિનીવા ડેસ્ક' },
    { label: 'એવિએશન', text: 'આંતરરાષ્ટ્રીય ફ્લાઇટ્સ અને પ્રવાસીઓની સંખ્યા પ્રી-કોવિડ સ્તર વટાવી ગઈ.', ref: 'IATA રિપોર્ટ' },
    { label: 'સાઈબર સુરક્ષા', text: 'વૈશ્વિક રેન્સમવેર હુમલા રોકવા ઇન્ટરપોલ દ્વારા ગ્લોબલ ટાસ્ક ફોર્સ.', ref: 'સાયબર વિંગ' },
    { label: 'સ્પેસ સ્ટેશન', text: 'આંતરરાષ્ટ્રીય સ્પેસ સ્ટેશન પર નવા વૈજ્ઞાનિક પ્રયોગો સફળતાપૂર્વક શરૂ.', ref: 'નાસા બુલેટિન' },
  ];

  return (
    <div className="h-full flex flex-col p-2 bg-white border-[3px] border-slate-900 box-border text-slate-900 font-sans select-none overflow-hidden space-y-0.5 justify-between">
      {/* ==================== 1. WORLD RUNNING HEADER & FOLIO ==================== */}
      <header className="shrink-0">
        <div className="flex items-center justify-between text-[7.5px] font-bold text-slate-800 border-b border-slate-300 pb-0.5 mb-0.5">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-950 uppercase">ગુજરાત પોસ્ટ</span>
            <span className="text-slate-400">•</span>
            <span className="text-[#B3121B] font-black uppercase">વિશ્વ પ્રવાહ & આંતરરાષ્ટ્રીય બાબતો</span>
            <span className="text-slate-400">•</span>
            <span>{gujaratiDateStr}</span>
          </div>
          <div className="flex items-center gap-2 font-extrabold">
            <span>આંતરરાષ્ટ્રીય ડેસ્ક</span>
            <span>•</span>
            <span className="bg-[#B3121B] text-white px-1.5 py-0.2 rounded-xs text-[7px] font-black uppercase">
              પાનું ૫ / ૧૪
            </span>
            <span>•</span>
            <span>₹ ૧૫.૦૦</span>
          </div>
        </div>

        {/* Section Masthead Banner */}
        <div className="bg-slate-950 text-white px-2 py-0.5 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[8.5px] font-black uppercase tracking-wider rounded-xs flex items-center gap-1">
              <Globe2 className="h-2.5 w-2.5" />
              <span>વિશ્વ વાયર • GLOBAL GEO-POLITICS & WORLD NEWS</span>
            </span>
            <span className="text-slate-300 text-[8px] font-bold truncate">
              સંયુક્ત રાષ્ટ્ર, વ્હાઇટ હાઉસ, યુરોપિયન યુનિયન, મિડલ ઈસ્ટ અને વૈશ્વિક અર્થતંત્ર
            </span>
          </div>
          <div className="flex items-center gap-1 text-amber-300 text-[7.5px] font-extrabold shrink-0">
            <Plane className="h-2.5 w-2.5" />
            <span>ગ્લોબલ વાયર ડેસ્ક</span>
          </div>
        </div>

        {/* World Timezones Strip */}
        <div className="grid grid-cols-4 gap-1 bg-slate-100 border-x border-b border-slate-300 p-0.5 text-[6.8px] font-bold text-slate-700">
          {worldTimezones.map((w, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-0.5 flex flex-col justify-between">
              <span className="text-slate-500 font-extrabold truncate">{w.city}</span>
              <span className="text-[7.5px] font-black text-slate-950">{w.time}</span>
              <span className="text-[5.8px] text-slate-500">{w.status}</span>
            </div>
          ))}
        </div>
      </header>

      {/* ==================== 2. UPPER WORLD GRID (8 COLS LEAD + 4 COLS BULLETIN) ==================== */}
      <section className="grid grid-cols-12 gap-2 border-b-2 border-slate-900 pb-1 pt-0.5 shrink-0 items-stretch">
        {/* Left 8 Columns: Dominant Lead Global Story */}
        <div className="col-span-8 border-r-2 border-slate-900 pr-2 space-y-0.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[7px] font-bold text-slate-600 mb-0.2">
              <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[7px] font-black rounded-xs uppercase">
                સંયુક્ત રાષ્ટ્ર વિશેષ • ન્યૂયોર્ક
              </span>
              <span>UN મહાસભા • વોશિંગ્ટન વાયર</span>
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
                <span className="text-[#B3121B] font-bold shrink-0 ml-1">► સંપૂર્ણ ઠરાવ</span>
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
                  <span>• સાયબર સુરક્ષા સંધિ</span>
                  <span>• $૧૦૦ અબજ ગ્રીન ફંડ</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>• સરહદી શાંતિ કરાર</span>
                  <span>• ૧૯૩ દેશોની મંજૂરી</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Columns: 7 Fast World Bulletins */}
        <div className="col-span-4 flex flex-col justify-between space-y-0.5 bg-slate-50 p-1 border border-slate-300">
          <div className="flex items-center justify-between border-b border-slate-300 pb-0.5">
            <span className="bg-slate-900 text-amber-300 text-[7px] font-black px-1.5 py-0.2 rounded-xs uppercase">
              વર્લ્ડ વાયર • 7 GLOBAL UPDATES
            </span>
            <span className="text-[#B3121B] text-[6.5px] font-bold">વિશ્વ લાઈવ</span>
          </div>

          <div className="space-y-0.5 flex-1 flex flex-col justify-between">
            {worldBulletin.map((item, idx) => (
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
            <span>રોઇટર્સ & AP સ્ત્રોત</span>
            <span className="text-[#B3121B]">► સંપૂર્ણ વિગત પાના ૫ પર</span>
          </div>
        </div>
      </section>

      {/* ==================== 3. 2 PROMINENT SECONDARY GLOBAL STORIES (WITH PHOTOS) ==================== */}
      <section className="grid grid-cols-2 gap-2.5 border-b-2 border-slate-900 pb-1 pt-0.5 shrink-0">
        {/* Story 1 */}
        <div className="space-y-0.5 border-r border-slate-300 pr-2.5">
          <div className="flex items-center justify-between text-[7px] font-bold text-slate-500">
            <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[6.5px] font-black rounded-xs uppercase">
              {secWorld1.tag}
            </span>
            <span className="text-[#B3121B] font-bold">► ટેક પોલિસી</span>
          </div>

          <h3 className="text-[10.5px] font-black leading-tight text-slate-950 line-clamp-1">
            {secWorld1.title}
          </h3>

          <div className="flex gap-2 items-start mt-0.5">
            <div className="w-[100px] shrink-0 space-y-0.5">
              <div className="w-[100px] h-[66px] overflow-hidden border border-slate-300 bg-slate-100">
                <img src={secWorld1.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                તસવીર: ગુજરાત પોસ્ટ વાયર
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between min-h-[66px] space-y-0.5">
              <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                {secWorld1.summary}
              </p>
              <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                <span className="text-slate-800 font-extrabold truncate">
                  {secWorld1.byline}
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
              {secWorld2.tag}
            </span>
            <span className="text-[#B3121B] font-bold">► ગ્રીન એનર્જી</span>
          </div>

          <h3 className="text-[10.5px] font-black leading-tight text-slate-950 line-clamp-1">
            {secWorld2.title}
          </h3>

          <div className="flex gap-2 items-start mt-0.5">
            <div className="w-[100px] shrink-0 space-y-0.5">
              <div className="w-[100px] h-[66px] overflow-hidden border border-slate-300 bg-slate-100">
                <img src={secWorld2.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                તસવીર: ગુજરાત પોસ્ટ વાયર
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between min-h-[66px] space-y-0.5">
              <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                {secWorld2.summary}
              </p>
              <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                <span className="text-slate-800 font-extrabold truncate">
                  {secWorld2.byline}
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
            <span>વૈશ્વિક સુરક્ષા & પર્યાવરણ સમીક્ષા (GLOBAL SECURITY & CLIMATE SPOTLIGHT)</span>
          </span>
          <span className="text-[6.5px] font-bold text-slate-600">ઇન્ડો-પેસિફિક ક્વાડ નેવલ ડિફેન્સ & આર્ક્ટિક રિસર્ચ</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Spot 1 */}
          <div className="space-y-0.5 border-r border-slate-300 pr-2.5">
            <div className="flex items-center justify-between text-[6.5px] font-bold">
              <span className="bg-indigo-800 text-white px-1.5 py-0.1 text-[6px] font-black rounded-xs uppercase">
                {spotWorld1.badge} • {spotWorld1.category}
              </span>
              <span className="text-[#B3121B] font-bold">► ક્વાડ સમિટ</span>
            </div>

            <h4 className="text-[10px] font-black leading-tight text-slate-950 line-clamp-1">
              {spotWorld1.title}
            </h4>

            <div className="flex gap-2 items-start mt-0.5">
              <div className="w-[100px] shrink-0 space-y-0.5">
                <div className="w-[100px] h-[66px] overflow-hidden border border-slate-300 bg-slate-100">
                  <img src={spotWorld1.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
                </div>
                <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                  તસવીર: ગુજરાત પોસ્ટ વાયર
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between min-h-[66px] space-y-0.5">
                <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                  {spotWorld1.summary}
                </p>
                <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                  <span className="text-slate-800 font-extrabold truncate">
                    {spotWorld1.byline}
                  </span>
                  <span className="text-[#B3121B] font-black shrink-0">
                    સંરક્ષણ પાના ૦૫
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Spot 2 */}
          <div className="space-y-0.5">
            <div className="flex items-center justify-between text-[6.5px] font-bold">
              <span className="bg-emerald-800 text-white px-1.5 py-0.1 text-[6px] font-black rounded-xs uppercase">
                {spotWorld2.badge} • {spotWorld2.category}
              </span>
              <span className="text-[#B3121B] font-bold">► ક્લાઇમેટ રિપોર્ટ</span>
            </div>

            <h4 className="text-[10px] font-black leading-tight text-slate-950 line-clamp-1">
              {spotWorld2.title}
            </h4>

            <div className="flex gap-2 items-start mt-0.5">
              <div className="w-[100px] shrink-0 space-y-0.5">
                <div className="w-[100px] h-[66px] overflow-hidden border border-slate-300 bg-slate-100">
                  <img src={spotWorld2.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
                </div>
                <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                  તસવીર: ગુજરાત પોસ્ટ વાયર
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between min-h-[66px] space-y-0.5">
                <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                  {spotWorld2.summary}
                </p>
                <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                  <span className="text-slate-800 font-extrabold truncate">
                    {spotWorld2.byline}
                  </span>
                  <span className="text-[#B3121B] font-black shrink-0">
                    વિસ્તાર પાના ૦૬
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 5. 4-CONTINENT GLOBAL MATRIX (WITH PHOTOS) ==================== */}
      <section className="border-b-2 border-slate-900 pb-0.5 shrink-0">
        <div className="flex items-center justify-between text-[7px] font-black text-slate-950 mb-0.5 border-b border-slate-300 pb-0.2">
          <span className="bg-slate-900 text-white px-1 py-0.2 text-[6.5px] uppercase rounded-xs">
            ૪ ખંડોની મહાસત્તાઓ • 4 CONTINENT MATRIX
          </span>
          <span className="text-slate-500 text-[6.5px]">અમેરિકા • યુરોપ • એશિયા-પેસિફિક • મધ્ય પૂર્વ & આફ્રિકા</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {/* Zone 1: Americas */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-[#B3121B] text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {americasZone.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={americasZone.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {americasZone.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► વૈશ્વિક રિપોર્ટ</span>
          </div>

          {/* Zone 2: Europe */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-slate-900 text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {europeZone.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={europeZone.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {europeZone.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► વૈશ્વિક રિપોર્ટ</span>
          </div>

          {/* Zone 3: Asia-Pacific */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-amber-700 text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {asiaPacificZone.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={asiaPacificZone.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {asiaPacificZone.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► વૈશ્વિક રિપોર્ટ</span>
          </div>

          {/* Zone 4: Middle East & Africa */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-emerald-800 text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {middleEastAfricaZone.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={middleEastAfricaZone.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {middleEastAfricaZone.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► વૈશ્વિક રિપોર્ટ</span>
          </div>
        </div>
      </section>

      {/* ==================== 6. 8 GLOBAL GEO-POLITICS STORIES (2 ROWS OF 4 COLS) ==================== */}
      <section className="border-b-2 border-slate-900 pb-0.5 pt-0.2 shrink-0 space-y-0.5">
        <div className="flex items-center justify-between text-[7px] font-black text-slate-950 border-b border-slate-300 pb-0.2">
          <span className="bg-[#B3121B] text-white px-1 py-0.2 text-[6.5px] uppercase rounded-xs flex items-center gap-1">
            <Newspaper className="h-2 w-2" />
            <span>આંતરરાષ્ટ્રીય બાબતો & વૈશ્વિક વિકાસ (GLOBAL GEO-POLITICS & TRADE DIGEST)</span>
          </span>
          <span className="text-slate-500 text-[6.2px]">વિશ્વના ૮ પ્રમુખ રાજધાનીઓની ગતિવિધિ</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {worldGridStories.map((item, idx) => (
            <div
              key={idx}
              className={`space-y-0.5 ${idx % 4 !== 3 ? 'border-r border-slate-300 pr-1.5' : ''} ${idx >= 4 ? 'pt-0.5 border-t border-slate-200' : ''}`}
            >
              <div className="flex items-center justify-between text-[6.5px] font-bold text-slate-500">
                <span className="text-[#B3121B] font-black uppercase">[{item.region}]</span>
                <span className="text-[5.8px] text-slate-400">વિશ્વ</span>
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

      {/* ==================== 7. GLOBAL BAROMETER BRIEFS (6 COLUMNS) ==================== */}
      <section className="shrink-0 space-y-0.5 border-b border-slate-400 pb-0.5">
        <div className="flex items-center gap-1.5 border-b border-slate-300 pb-0.2">
          <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[7px] font-black uppercase rounded-xs">
            વૈશ્વિક બેરોમીટર • GLOBAL PULSE BRIEFS
          </span>
          <span className="text-[6.5px] text-slate-500 font-bold">વૈશ્વિક બજારો, કોમોડિટીઝ અને આંતરરાષ્ટ્રીય સંગઠનો</span>
        </div>

        <div className="grid grid-cols-6 gap-1 pt-0.2">
          {globalPulseBriefs.map((brief, idx) => (
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

      {/* ==================== 8. GLOBAL DIPLOMATIC STRIP ==================== */}
      <section className="bg-slate-50 border border-dashed border-slate-400 p-0.5 rounded-xs flex items-center justify-between text-[6.5px] font-bold text-slate-700 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="bg-slate-900 text-amber-300 px-1 py-0.2 rounded-xs text-[6px] font-black uppercase flex items-center gap-0.5">
            <ShieldCheck className="h-2 w-2" />
            <span>રાજદ્વારી વાયર</span>
          </span>
          <span>વિદેશ મંત્રાલય અધિકૃત પ્રવક્તા: આંતરરાષ્ટ્રીય સંધિઓ, દ્વિપક્ષીય વાટાઘાટો અને વિઝા નિયમો.</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <span>સત્તાવાર પોર્ટલ: <strong>mea.gov.in</strong></span>
          <span>•</span>
          <span className="text-[#B3121B] font-black">પ્રમાણિત ગ્લોબલ ડેસ્ક</span>
        </div>
      </section>

      {/* ==================== 9. BROADSHEET NEWSPAPER FOOTER ==================== */}
      <footer className="border-t border-slate-400 pt-0.5 pb-0.5 flex items-center justify-between text-[7px] font-bold text-slate-600 shrink-0">
        <div>
          <span>© ગુજરાત પોસ્ટ વૈશ્વિક બ્યુરો, {displayCity} • ન્યૂયોર્ક • લંડન • દુબઈ • સિંગાપોર • ટોક્યો</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#B3121B] font-black uppercase">WWW.GUJARATPOST.IN</span>
          <span>•</span>
          <span>પાનું ૫ / ૧૪</span>
        </div>
      </footer>
    </div>
  );
};
