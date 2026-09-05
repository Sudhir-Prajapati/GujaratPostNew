'use client';

import React from 'react';
import { EPaperPageData, getCleanText, formatGujaratiDate, BroadsheetArticle } from '../types';
import { Camera, Image as ImageIcon, Sparkles, Aperture, Eye, Compass, ShieldCheck, Sun, Mountain, Layers, Film, Flame, CheckCircle2, Newspaper } from 'lucide-react';

interface TemplateProps {
  data: EPaperPageData;
}

const cleanHeadline = (text?: string) => {
  if (!text) return '';
  return text.replace(/^#\d+\s*[-–—:]\s*/i, '').trim();
};

export const PhotoTemplate: React.FC<TemplateProps> = ({ data }) => {
  const {
    pageNumber = 14,
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

  // 1. Photo Gear Specs Strip
  const photoSpecs = [
    { label: 'ફોટો ઓફ ધ ડે', val: 'સાબરમતી સૂર્યાસ્ત', spec: 'Sony A7R V • 24-70mm GM' },
    { label: 'વાઈલ્ડલાઈફ ક્લિક', val: 'ગીર સાવજ પરિવાર', spec: '400mm f/2.8 • 1/2000s' },
    { label: 'ડ્રોન એરિયલ વ્યુ', val: 'સ્ટેચ્યુ ઓફ યુનિટી', spec: 'DJI Mavic 3 Pro • 4K UHD' },
    { label: 'હેરિટેજ ફોકસ', val: 'રાણકી વાવ શિલ્પો', spec: '35mm Prime • f/1.8' },
  ];

  // 2. Grand Centerfold Panoramic Hero
  const leadHeadline = cleanHeadline(
    leadArticle?.printHeadline ||
    leadArticle?.titleGu ||
    leadArticle?.title ||
    'ગુજરાતના આકાશે સંધ્યાકાળે અદભૂત રંગછટા: કેમેરામાં કેદ થયેલી કુદરતી સૌંદર્યની મનમોહક ક્ષણો'
  );

  const leadImage =
    leadArticle?.featuredImage ||
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80';

  const leadCaption =
    leadArticle?.photoCredit || 'તસવીર: ગુજરાત પોસ્ટ ફોટો ડેસ્ક • સાબરમતી રિવરફ્રન્ટ પર સૂર્યાસ્ત વેળાએ ગોલ્ડન અવરનું નયનરમ્ય દ્રશ્ય';

  const leadSummary =
    leadArticle?.printSummary ||
    getCleanText(
      leadArticle?.excerptGu ||
        leadArticle?.excerpt ||
        leadArticle?.contentGu ||
        leadArticle?.content ||
        'કુદરતની સુંદરતા જ્યારે કેમેરાના લેન્સમાં ઝીલાય છે ત્યારે શબ્દો પણ ઓછા પડે છે. ગુજરાતના વિવિધ શહેરો અને પ્રાકૃતિક ધામોમાં ઋતુ પરિવર્તનની અદભૂત ક્ષણોને ગુજરાત પોસ્ટના તસવીરકારોએ પોતાના કેમેરામાં કેદ કરી છે.',
      280
    );

  const leadSecondParagraph = getCleanText(
    leadArticle?.contentGu ||
      leadArticle?.content ||
      'સાબરમતી નદીના કિનારે સાંજના સમયે ઢળતા સૂરજના કિરણો પાણીમાં સોનેરી ઝળહળાટ પાથરી રહ્યા હતા. પક્ષીઓના કલરવ અને આકાશમાં લાલ-કેસરી રંગોની છટાએ સમગ્ર વાતાવરણને અતિ મંત્રમુગ્ધ બનાવ્યું હતું.',
      260
  );

  const leadLocation = leadArticle?.location || 'અમદાવાદ';

  // 3. 7 Fast Photo Wire Bulletins (Right 4 cols)
  const photoBulletin = [
    { title: cleanHeadline(pool[0]?.printHeadline || pool[0]?.titleGu || 'ગીર અભયારણ્યમાં એશિયાટિક સિંહબાળની પાણી પીતી દુર્લભ તસવીર'), time: '૦૬:૩૦ AM', cat: 'વાઈલ્ડલાઈફ' },
    { title: cleanHeadline(pool[1]?.printHeadline || pool[1]?.titleGu || 'કચ્છના સફેદ રણમાં પૂર્ણિમાની રાત્રે ચાંદનીનો અદભૂત નજારો'), time: '૦૮:૧૫ PM', cat: 'રણોત્સવ' },
    { title: cleanHeadline(pool[2]?.printHeadline || pool[2]?.titleGu || 'પાવાગઢ મહાકાળી શિખર પર વાદળોની ચાદર વચ્ચે સૂર્યોદય'), time: '૦૬:૪૫ AM', cat: 'તીર્થધામ' },
    { title: cleanHeadline(pool[3]?.printHeadline || pool[3]?.titleGu || 'સ્ટેચ્યુ ઓફ યુનિટી પર સાંજે લેસર મ્યુઝિકલ શોની આકાશી ઝલક'), time: '૦૭:૩૦ PM', cat: 'નર્મદા' },
    { title: cleanHeadline(pool[4]?.printHeadline || pool[4]?.titleGu || 'પોલો ફોરેસ્ટ વિજયનગરમાં ચોમાસા બાદ ખળખળ વહેતા ઝરણાં'), time: '૧૧:૦૦ AM', cat: 'પ્રકૃતિ' },
    { title: cleanHeadline(pool[5]?.printHeadline || pool[5]?.titleGu || 'અમદાવાદ ઓલ્ડ સિટી પોળની લાકડાની કોતરણીવાળી બારીઓ'), time: '૦૩:૩૦ PM', cat: 'હેરિટેજ' },
    { title: cleanHeadline(pool[6]?.printHeadline || pool[6]?.titleGu || 'સોમનાથ સાગરકાંઠે મોજાં અને આરતી વેળાએ દીપદાનનો માહોલ'), time: '૦૭:૦૦ PM', cat: 'દરિયાકિનારો' },
  ];

  // 4. Secondary Photographic Essays (2 prominent stories with photos)
  const secPhoto1 = {
    title: cleanHeadline(pool[7]?.printHeadline || pool[7]?.titleGu || 'ગીરના સિંહ પરિવારની દુર્લભ ક્ષણો: વન્યજીવ ફોટોગ્રાફીમાં કેદ થયેલો સાવજનો દબદબો'),
    image: pool[7]?.featuredImage || 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=500&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[7]?.excerptGu || pool[7]?.contentGu || 'સાસણ ગીરના ઊંડા જંગલોમાં સવારના ધુમ્મસ વચ્ચે સાવજ પરિવારની ચહલપહલને ૪૦૦mm ટેલિફોટો લેન્સથી કેદ કરવામાં આવી.', 240),
    tag: 'વાઈલ્ડલાઈફ ક્લિક',
    byline: 'વાઈલ્ડલાઈફ ફોટો ડેસ્ક',
    art: pool[7]
  };

  const secPhoto2 = {
    title: cleanHeadline(pool[8]?.printHeadline || pool[8]?.titleGu || 'પાટણની રાણકી વાવ સ્થાપત્ય વૈભવ: યુનેસ્કો વર્લ્ડ હેરિટેજ સાઇટની બેનમૂન શિલ્પકળા'),
    image: pool[8]?.featuredImage || 'https://images.unsplash.com/photo-1596405835955-465de5c3dfb7?w=500&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[8]?.excerptGu || pool[8]?.contentGu || '૭ માળ ઊંડી વાવના સ્તંભો અને દિવાલો પર કંડારેલી દેવી-દેવતાઓની ૮૦૦થી વધુ પ્રતિમાઓની સચોટ લાઈટિંગ સાથે તસવીરો.', 240),
    tag: 'હેરિટેજ ફોટો',
    byline: 'હેરિટેજ આર્કાઇવ',
    art: pool[8]
  };

  // 5. Special In-Depth Spotlight (2 Ground Reports with Photos)
  const spotPhoto1 = {
    title: cleanHeadline(pool[9]?.printHeadline || pool[9]?.titleGu || 'કચ્છનું સફેદ રણ: મીઠાની ચાદર પર સૂર્યાસ્ત અને ચાંદની રાતનું અલૌકિક દ્રશ્ય'),
    image: pool[9]?.featuredImage || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[9]?.excerptGu || pool[9]?.contentGu || 'ધોરડો ખાતે યોજાતા રણોત્સવ દરમિયાન અનંત ક્ષિતિજ સુધી પથરાયેલા શ્વેત રણમાં રંગબેરંગી સાંસ્કૃતિક પરિવેશનું સુંદર સંયોજન.', 240),
    badge: 'વિશેષ ફોટો એસે',
    category: 'રણ દર્શન',
    byline: 'પ્રવાસન તસવીરકાર',
    art: pool[9]
  };

  const spotPhoto2 = {
    title: cleanHeadline(pool[10]?.printHeadline || pool[10]?.titleGu || 'સાપુતારા હિલ સ્ટેશન: ડાંગના ગીચ જંગલોમાં વાદળો વચ્ચે વિહરતી કુદરતી સુંદરતા'),
    image: pool[10]?.featuredImage || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[10]?.excerptGu || pool[10]?.contentGu || 'ગુજરાતના એકમાત્ર હિલ સ્ટેશન સાપુતારામાં સનરાઇઝ પોઇન્ટ અને ગિરા ધોધ ખાતે પ્રવાસીઓનો ઘોડાપૂર ઉમટ્યો હતો.', 240),
    badge: 'લેન્ડસ્કેપ ક્લિક',
    category: 'હિલ સ્ટેશન',
    byline: 'નેચર ફોટોગ્રાફર',
    art: pool[10]
  };

  // 6. 4-Photo Theme Domain Matrix with photos
  const aerialDroneDomain = {
    title: 'ડ્રોન એરિયલ વ્યુઝ',
    img: pool[11]?.featuredImage || 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'નર્મદા', title: cleanHeadline(pool[11]?.printHeadline || pool[11]?.titleGu || 'સરદાર સરોવર ડેમ ઓવરફ્લોનો 4K ડ્રોન શોટ') },
      { loc: 'અમદાવાદ', title: cleanHeadline(pool[12]?.printHeadline || pool[12]?.titleGu || 'અટલ બ્રિજ અને રિવરફ્રન્ટનું રાત્રિ રોશની દ્રશ્ય') },
      { loc: 'દ્વારકા', title: cleanHeadline(pool[13]?.printHeadline || pool[13]?.titleGu || 'સુદર્શન સેતુ સિગ્નેચર બ્રિજનો આકાશી નજારો') },
    ]
  };

  const natureMonsoonDomain = {
    title: 'મોસમ & પ્રકૃતિ રંગો',
    img: pool[14]?.featuredImage || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'ડાંગ', title: cleanHeadline(pool[14]?.printHeadline || pool[14]?.titleGu || 'ગીરા ધોધ પર મેઘધનુષની અદભૂત રંગછટા') },
      { loc: 'નળ સરોવર', title: cleanHeadline(pool[15]?.printHeadline || pool[15]?.titleGu || 'યાયાવર ફ્લેમિંગો પક્ષીઓનું સામૂહિક ઉડાન') },
      { loc: 'તારંગા', title: cleanHeadline(pool[16]?.printHeadline || pool[16]?.titleGu || 'પહાડી ટેકરીઓ પર લીલીછમ હરિયાળી ચાદર') },
    ]
  };

  const streetCultureDomain = {
    title: 'સ્ટ્રીટ & સંસ્કૃતિ પળો',
    img: pool[17]?.featuredImage || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'માણેકચોક', title: cleanHeadline(pool[17]?.printHeadline || pool[17]?.titleGu || 'રાત્રિ ફૂડ માર્કેટમાં ઉમટતી જનમેદનીનો ધબકારો') },
      { loc: 'ગરબા', title: cleanHeadline(pool[18]?.printHeadline || pool[18]?.titleGu || 'પરંપરાગત ચણિયાચોળીમાં ઘૂમતી ખેલૈયાઓની મુદ્રાઓ') },
      { loc: 'પતંગોત્સવ', title: cleanHeadline(pool[19]?.printHeadline || pool[19]?.titleGu || 'સાબરમતી કિનારે આકાશમાં રંગબેરંગી પતંગો') },
    ]
  };

  const astroNightDomain = {
    title: 'એસ્ટ્રો & નાઇટ સ્કાઇ',
    img: pool[20]?.featuredImage || 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'ધોળાવીરા', title: cleanHeadline(pool[20]?.printHeadline || pool[20]?.titleGu || 'મિલ્કી વે ગેલેક્સીનો અતિ સ્પષ્ટ નાઇટ શોટ') },
      { loc: 'નારાયણ સરોવર', title: cleanHeadline(pool[21]?.printHeadline || pool[21]?.titleGu || 'તારામંડળ વચ્ચે ચમકતો ઐતિહાસિક દીવાદાંડી') },
      { loc: 'પોરબંદર', title: cleanHeadline(pool[22]?.printHeadline || pool[22]?.titleGu || 'ચોપાટી પર પૂર્ણ ચંદ્રનું પાણીમાં પ્રતિબિંબ') },
    ]
  };

  // 7. 8 Photojournalism, Visual Stories & Moments Digest (2 Rows x 4 Cols)
  const photoGridStories = [
    {
      title: cleanHeadline(pool[23]?.printHeadline || pool[23]?.titleGu || 'સાબરમતી રિવરફ્રન્ટ ફ્લાવર શો: રંગબેરંગી પુષ્પોની શોભા'),
      image: pool[23]?.featuredImage || 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=300&auto=format&fit=crop&q=80',
      summary: getCleanText(pool[23]?.excerptGu || pool[23]?.contentGu || 'વિદેશી અને દેશી ફૂલોના આકર્ષક સ્કલ્પચર્સ જોવા હજારો નગરજનો ઉમટ્યા.', 120),
      tag: 'ફ્લાવર શો'
    },
    {
      title: cleanHeadline(pool[24]?.printHeadline || pool[24]?.titleGu || 'મોઢેરા સૂર્ય મંદિર: શિલ્પ સ્થાપત્ય અને લાઇટ એન્ડ સાઉન્ડ શો'),
      image: pool[24]?.featuredImage || 'https://images.unsplash.com/photo-1596405835955-465de5c3dfb7?w=300&auto=format&fit=crop&q=80',
      summary: getCleanText(pool[24]?.excerptGu || pool[24]?.contentGu || 'ઐતિહાસિક સૂર્ય કુંડ અને ગર્ભગૃહની અદભૂત લાઇટિંગ તસવીરકારોનું મુખ્ય આકર્ષણ બન્યું.', 120),
      tag: 'સૂર્ય મંદિર'
    },
    {
      title: cleanHeadline(pool[25]?.printHeadline || pool[25]?.titleGu || 'ગીરનાર રોપ-વે: લીલીછમ ખીણો પરથી વિહંગાવલોકન ક્લિક્સ'),
      image: pool[25]?.featuredImage || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&auto=format&fit=crop&q=80',
      summary: getCleanText(pool[25]?.excerptGu || pool[25]?.contentGu || 'વાદળો વચ્ચેથી પસાર થતી કેબિન કાર અને અંબાજી મંદિર શિખરનો રમણીય નજારો.', 120),
      tag: 'ગીરનાર'
    },
    {
      title: cleanHeadline(pool[26]?.printHeadline || pool[26]?.titleGu || 'શિયાળુ પ્રવાસી પક્ષીઓ: થોળ પક્ષી અભયારણ્યમાં નયનરમ્ય ઝલક'),
      image: pool[26]?.featuredImage || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&auto=format&fit=crop&q=80',
      summary: getCleanText(pool[26]?.excerptGu || pool[26]?.contentGu || 'સાઇબિરીયાથી હજારો કિમીનું અંતર કાપીને આવેલા પક્ષીઓનું સવારના સૂર્યોદય વેળાએ ક્લિક.', 120),
      tag: 'પક્ષી દર્શન'
    },
    {
      title: cleanHeadline(pool[27]?.printHeadline || pool[27]?.titleGu || 'અલંગ શિપ બ્રેકિંગ યાર્ડ: વિશાળ જહાજોનું ડિસ્મેન્ટલિંગ દ્રશ્ય'),
      image: pool[27]?.featuredImage || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop&q=80',
      summary: getCleanText(pool[27]?.excerptGu || pool[27]?.contentGu || 'વિશ્વના સૌથી મોટા શિપ બ્રેકિંગ યાર્ડ પર કામ કરતા શ્રમિકો અને વિશાળ લોખંડી કાયાઓ.', 120),
      tag: 'ઔદ્યોગિક ક્લિક'
    },
    {
      title: cleanHeadline(pool[28]?.printHeadline || pool[28]?.titleGu || 'દ્વારકાધીશ જગત મંદિર: ધ્વજારોહણ ઉત્સવનો ભક્તિમય માહોલ'),
      image: pool[28]?.featuredImage || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=300&auto=format&fit=crop&q=80',
      summary: getCleanText(pool[28]?.excerptGu || pool[28]?.contentGu || 'ગોમતી ઘાટ અને ૫૨ ગજની ધ્વજા બદલવાની પાવન પરંપરાનું આબેહૂબ દ્રશ્ય.', 120),
      tag: 'તીર્થ દર્શન'
    },
    {
      title: cleanHeadline(pool[29]?.printHeadline || pool[29]?.titleGu || 'ચંપાનેર પાવાગઢ: વર્લ્ડ હેરિટેજ જામા મસ્જિદ કમાનો અને મિનારા'),
      image: pool[29]?.featuredImage || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=300&auto=format&fit=crop&q=80',
      summary: getCleanText(pool[29]?.excerptGu || pool[29]?.contentGu || 'ઇન્ડો-ઇસ્લામિક વાસ્તુશૈલીના બેનમૂન નમૂનાની સવારના સોનેરી કિરણોમાં લેવાયેલી તસવીર.', 120),
      tag: 'હેરિટેજ સ્થાપત્ય'
    },
    {
      title: cleanHeadline(pool[30]?.printHeadline || pool[30]?.titleGu || 'માંડવી વિજય વિલાસ પેલેસ: સમુદ્રકાંઠે રજવાડાના વૈભવની ઝાંખી'),
      image: pool[30]?.featuredImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&auto=format&fit=crop&q=80',
      summary: getCleanText(pool[30]?.excerptGu || pool[30]?.contentGu || 'લાલ સેન્ડસ્ટોનથી બનેલા પેલેસના ઝરૂખા અને ખાનગી બીચ પર મોજાંઓની રમઝટ.', 120),
      tag: 'પેલેસ વ્યુ'
    },
  ];

  // 8. Photojournalism Masterclass Strip (6 columns)
  const photoTipsBriefs = [
    { label: 'ગોલ્ડન અવર', text: 'સૂર્યોદયના ૧ કલાક અને સૂર્યાસ્ત પહેલાં સોનેરી કુદરતી પ્રકાશ સર્વશ્રેષ્ઠ.', ref: 'લાઈટિંગ ટીપ' },
    { label: 'રૂલ ઓફ થર્ડ્સ', text: 'વિષયને ફ્રેમના કેન્દ્રને બદલે ગ્રિડ લાઇન પર રાખવાથી આકર્ષણ વધે.', ref: 'કમ્પોઝિશન' },
    { label: 'શટર સ્પીડ', text: 'દોડતા પ્રાણીઓ કે વહેતા પાણીને ફ્રીઝ કરવા ૧/૨૦૦૦ સેકન્ડ સ્પીડ રાખો.', ref: 'એક્શન ફોટો' },
    { label: 'એપર્ચર f/1.8', text: 'પોર્ટ્રેટમાં બેકગ્રાઉન્ડ બ્લર (બોકેહ) મેળવવા વાઈડ એપર્ચર વાપરો.', ref: 'પોર્ટ્રેટ ટીપ' },
    { label: 'ISO સેટિંગ', text: 'તસવીરમાં અવાજ (નોઈઝ) ઘટાડવા શક્ય હોય ત્યાં સુધી ISO ૧૦૦ રાખો.', ref: 'ક્વોલિટી ટીપ' },
    { label: 'લેન્સ કેર', text: 'દરિયાકાંઠે શૂટ કરતી વખતે લેન્સ પર UV ફિલ્ટર લગાવી સુરક્ષિત રાખો.', ref: 'કેમેરા કેર' },
  ];

  return (
    <div className="h-full flex flex-col p-2 bg-white border-[3px] border-slate-900 box-border text-slate-900 font-sans select-none overflow-hidden space-y-0.5 justify-between">
      {/* ==================== 1. PHOTO RUNNING HEADER & FOLIO ==================== */}
      <header className="shrink-0">
        <div className="flex items-center justify-between text-[7.5px] font-bold text-slate-800 border-b border-slate-300 pb-0.5 mb-0.5">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-950 uppercase">ગુજરાત પોસ્ટ</span>
            <span className="text-slate-400">•</span>
            <span className="text-[#B3121B] font-black uppercase">તસવીરી દર્શન & ફોટોજર્નાલિઝમ વિશેષ</span>
            <span className="text-slate-400">•</span>
            <span>{gujaratiDateStr}</span>
          </div>
          <div className="flex items-center gap-2 font-extrabold">
            <span>અંતિમ પૃષ્ઠ</span>
            <span>•</span>
            <span className="bg-[#B3121B] text-white px-1.5 py-0.2 rounded-xs text-[7px] font-black uppercase">
              પાનું ૧૪ / ૧૪
            </span>
            <span>•</span>
            <span>₹ ૧૫.૦૦</span>
          </div>
        </div>

        {/* Section Masthead Banner */}
        <div className="bg-slate-950 text-white px-2 py-0.5 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[8.5px] font-black uppercase tracking-wider rounded-xs flex items-center gap-1">
              <Camera className="h-2.5 w-2.5" />
              <span>તસવીર દર્પણ • PHOTOJOURNALISM BROADSHEET</span>
            </span>
            <span className="text-slate-300 text-[8px] font-bold truncate">
              વાઈલ્ડલાઈફ, પ્રકૃતિ, સ્થાપત્ય વારસો, ડ્રોન સિનેમેટોગ્રાફી અને સ્ટ્રીટ લાઇફ
            </span>
          </div>
          <div className="flex items-center gap-1 text-amber-300 text-[7.5px] font-extrabold shrink-0">
            <Aperture className="h-2.5 w-2.5" />
            <span>મુખ્ય ફોટો બ્યુરો</span>
          </div>
        </div>

        {/* Photo Gear Specs Strip */}
        <div className="grid grid-cols-4 gap-1 bg-slate-100 border-x border-b border-slate-300 p-0.5 text-[6.8px] font-bold text-slate-700">
          {photoSpecs.map((p, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-0.5 flex flex-col justify-between">
              <span className="text-slate-500 text-[6px] font-extrabold truncate">{p.label}</span>
              <span className="text-[7.5px] font-black text-slate-950">{p.val}</span>
              <span className="text-[5.8px] text-[#B3121B] font-bold">{p.spec}</span>
            </div>
          ))}
        </div>
      </header>

      {/* ==================== 2. UPPER HERO PHOTO GRID (8 COLS LEAD + 4 COLS BULLETIN) ==================== */}
      <section className="grid grid-cols-12 gap-2 border-b-2 border-slate-900 pb-0.5 pt-0.5 shrink-0 items-stretch">
        {/* Left 8 Columns: Dominant Centerfold Panoramic Hero */}
        <div className="col-span-8 border-r-2 border-slate-900 pr-2 space-y-0.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[7px] font-bold text-slate-600 mb-0.2">
              <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[7px] font-black rounded-xs uppercase">
                ફોટો ઓફ ધ ડે • ગોલ્ડન અવર
              </span>
              <span>સાબરમતી રિવરફ્રન્ટ</span>
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
                <span className="text-[#B3121B] font-bold shrink-0 ml-1">► 4K ફોટો ગેલરી</span>
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
                  <span>• કેમેરા: Sony Alpha 7R V</span>
                  <span>• શટર સ્પીડ: 1/500s</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>• લેન્સ: 24-70mm f/2.8 GM</span>
                  <span>• ISO: 100 • f/8.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Columns: 7 Fast Photo Wire Bulletins */}
        <div className="col-span-4 flex flex-col justify-between space-y-0.5 bg-slate-50 p-1 border border-slate-300">
          <div className="flex items-center justify-between border-b border-slate-300 pb-0.5">
            <span className="bg-slate-900 text-amber-300 text-[7px] font-black px-1.5 py-0.2 rounded-xs uppercase">
              તસવીરી વાયર • 7 FAST CLICKS
            </span>
            <span className="text-[#B3121B] text-[6.5px] font-bold">ફોટો લાઈવ</span>
          </div>

          <div className="space-y-0.5 flex-1 flex flex-col justify-between">
            {photoBulletin.map((item, idx) => (
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
            <span>ફોટોજર્નાલિઝમ ડેસ્ક</span>
            <span className="text-[#B3121B]">► હાઈ-રિઝોલ્યુશન</span>
          </div>
        </div>
      </section>

      {/* ==================== 3. 2 PROMINENT SECONDARY PHOTO ESSAYS (WITH PHOTOS) ==================== */}
      <section className="grid grid-cols-2 gap-2.5 border-b-2 border-slate-900 pb-0.5 pt-0.5 shrink-0">
        {/* Essay 1 */}
        <div className="space-y-0.5 border-r border-slate-300 pr-2.5">
          <div className="flex items-center justify-between text-[7px] font-bold text-slate-500">
            <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[6.5px] font-black rounded-xs uppercase">
              {secPhoto1.tag}
            </span>
            <span className="text-[#B3121B] font-bold">► ગીર સફારી</span>
          </div>

          <h3 className="text-[10.5px] font-black leading-tight text-slate-950 line-clamp-1">
            {secPhoto1.title}
          </h3>

          <div className="flex gap-2 items-start mt-0.5">
            <div className="w-[100px] shrink-0 space-y-0.5">
              <div className="w-[100px] h-[64px] overflow-hidden border border-slate-300 bg-slate-100">
                <img src={secPhoto1.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                તસવીર: ગુજરાત પોસ્ટ
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between min-h-[64px] space-y-0.5">
              <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                {secPhoto1.summary}
              </p>
              <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                <span className="text-slate-800 font-extrabold truncate">
                  {secPhoto1.byline}
                </span>
                <span className="text-[#B3121B] font-black shrink-0">
                  વિગત પાના ૧૪ પર
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Essay 2 */}
        <div className="space-y-0.5">
          <div className="flex items-center justify-between text-[7px] font-bold text-slate-500">
            <span className="bg-slate-900 text-white px-1.5 py-0.2 text-[6.5px] font-black rounded-xs uppercase">
              {secPhoto2.tag}
            </span>
            <span className="text-[#B3121B] font-bold">► રાણકી વાવ શિલ્પ</span>
          </div>

          <h3 className="text-[10.5px] font-black leading-tight text-slate-950 line-clamp-1">
            {secPhoto2.title}
          </h3>

          <div className="flex gap-2 items-start mt-0.5">
            <div className="w-[100px] shrink-0 space-y-0.5">
              <div className="w-[100px] h-[64px] overflow-hidden border border-slate-300 bg-slate-100">
                <img src={secPhoto2.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                તસવીર: ગુજરાત પોસ્ટ
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between min-h-[64px] space-y-0.5">
              <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                {secPhoto2.summary}
              </p>
              <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                <span className="text-slate-800 font-extrabold truncate">
                  {secPhoto2.byline}
                </span>
                <span className="text-[#B3121B] font-black shrink-0">
                  વિગત પાના ૧૪ પર
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
            <span>રણ દર્શન & સાપુતારા હિલ સમીક્ષા (DESERT & HILL PHOTOGRAPHY)</span>
          </span>
          <span className="text-[6.5px] font-bold text-slate-600">કચ્છનું સફેદ રણ & ડાંગ સાપુતારા ફોટો એસે</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Spotlight 1 */}
          <div className="space-y-0.5 border-r border-slate-300 pr-2.5">
            <div className="flex items-center justify-between text-[6.5px] font-bold">
              <span className="bg-indigo-800 text-white px-1.5 py-0.1 text-[6px] font-black rounded-xs uppercase">
                {spotPhoto1.badge} • {spotPhoto1.category}
              </span>
              <span className="text-[#B3121B] font-bold">► કચ્છ રણોત્સવ</span>
            </div>

            <h4 className="text-[10px] font-black leading-tight text-slate-950 line-clamp-1">
              {spotPhoto1.title}
            </h4>

            <div className="flex gap-2 items-start mt-0.5">
              <div className="w-[100px] shrink-0 space-y-0.5">
                <div className="w-[100px] h-[62px] overflow-hidden border border-slate-300 bg-slate-100">
                  <img src={spotPhoto1.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
                </div>
                <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                  તસવીર: ગુજરાત પોસ્ટ
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between min-h-[62px] space-y-0.5">
                <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                  {spotPhoto1.summary}
                </p>
                <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                  <span className="text-slate-800 font-extrabold truncate">
                    {spotPhoto1.byline}
                  </span>
                  <span className="text-[#B3121B] font-black shrink-0">
                    તસવીર સંગ્રહ
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Spotlight 2 */}
          <div className="space-y-0.5">
            <div className="flex items-center justify-between text-[6.5px] font-bold">
              <span className="bg-emerald-800 text-white px-1.5 py-0.1 text-[6px] font-black rounded-xs uppercase">
                {spotPhoto2.badge} • {spotPhoto2.category}
              </span>
              <span className="text-[#B3121B] font-bold">► ડાંગ સાપુતારા</span>
            </div>

            <h4 className="text-[10px] font-black leading-tight text-slate-950 line-clamp-1">
              {spotPhoto2.title}
            </h4>

            <div className="flex gap-2 items-start mt-0.5">
              <div className="w-[100px] shrink-0 space-y-0.5">
                <div className="w-[100px] h-[62px] overflow-hidden border border-slate-300 bg-slate-100">
                  <img src={spotPhoto2.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
                </div>
                <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                  તસવીર: ગુજરાત પોસ્ટ
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between min-h-[62px] space-y-0.5">
                <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                  {spotPhoto2.summary}
                </p>
                <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                  <span className="text-slate-800 font-extrabold truncate">
                    {spotPhoto2.byline}
                  </span>
                  <span className="text-[#B3121B] font-black shrink-0">
                    તસવીર સંગ્રહ
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 5. 4-THEME PHOTO MATRIX (WITH PHOTOS) ==================== */}
      <section className="border-b-2 border-slate-900 pb-0.5 shrink-0">
        <div className="flex items-center justify-between text-[7px] font-black text-slate-950 mb-0.5 border-b border-slate-300 pb-0.2">
          <span className="bg-slate-900 text-white px-1 py-0.2 text-[6.5px] uppercase rounded-xs">
            તસવીરી ક્ષેત્ર દર્પણ • 4 THEME PHOTO MATRIX
          </span>
          <span className="text-slate-500 text-[6.5px]">ડ્રોન એરિયલ • મોસમ & પ્રકૃતિ • સ્ટ્રીટ & સંસ્કૃતિ • એસ્ટ્રો નાઇટ</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {/* Theme 1: Drone */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-[#B3121B] text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {aerialDroneDomain.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={aerialDroneDomain.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {aerialDroneDomain.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► ડ્રોન વિગત</span>
          </div>

          {/* Theme 2: Nature */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-slate-900 text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {natureMonsoonDomain.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={natureMonsoonDomain.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {natureMonsoonDomain.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► પ્રકૃતિ વિગત</span>
          </div>

          {/* Theme 3: Street */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-amber-700 text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {streetCultureDomain.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={streetCultureDomain.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {streetCultureDomain.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► કલ્ચર વિગત</span>
          </div>

          {/* Theme 4: Astro */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-emerald-800 text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {astroNightDomain.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={astroNightDomain.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {astroNightDomain.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► નાઇટ વિગત</span>
          </div>
        </div>
      </section>

      {/* ==================== 6. 8 PHOTOJOURNALISM & VISUAL MOMENTS GRID (2 ROWS OF 4 COLS) ==================== */}
      <section className="border-b-2 border-slate-900 pb-0.5 pt-0.2 shrink-0 space-y-0.5">
        <div className="flex items-center justify-between text-[7px] font-black text-slate-950 border-b border-slate-300 pb-0.2">
          <span className="bg-[#B3121B] text-white px-1 py-0.2 text-[6.5px] uppercase rounded-xs flex items-center gap-1">
            <Newspaper className="h-2 w-2" />
            <span>તસવીર ગાથા & વિઝ્યુઅલ મોમેન્ટ્સ (VISUAL MOMENTS DIGEST)</span>
          </span>
          <span className="text-slate-500 text-[6.2px]">ગુજરાતના પ્રાકૃતિક અને ઐતિહાસિક વૈભવની ૮ જીવંત પળો</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {photoGridStories.map((item, idx) => (
            <div
              key={idx}
              className={`space-y-0.5 ${idx % 4 !== 3 ? 'border-r border-slate-300 pr-1.5' : ''} ${idx >= 4 ? 'pt-0.5 border-t border-slate-200' : ''}`}
            >
              <div className="flex items-center justify-between text-[6.5px] font-bold text-slate-500">
                <span className="text-[#B3121B] font-black uppercase">[{item.tag}]</span>
                <span className="text-[5.8px] text-slate-400">તસવીર દર્પણ</span>
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

      {/* ==================== 7. PHOTOJOURNALISM MASTERCLASS STRIP (6 COLUMNS) ==================== */}
      <section className="shrink-0 space-y-0.5 border-b border-slate-400 pb-0.5">
        <div className="flex items-center gap-1.5 border-b border-slate-300 pb-0.2">
          <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[7px] font-black uppercase rounded-xs">
            ફોટોગ્રાફી માસ્ટરક્લાસ • CAMERA PRO TIPS
          </span>
          <span className="text-[6.5px] text-slate-500 font-bold">ગોલ્ડન અવર, રૂલ ઓફ થર્ડ્સ, શટર સ્પીડ, એપર્ચર બોકેહ, ISO અને લેન્સ કેર</span>
        </div>

        <div className="grid grid-cols-6 gap-1 pt-0.2">
          {photoTipsBriefs.map((brief, idx) => (
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

      {/* ==================== 8. PHOTO CONTEST & SUBMISSION NOTICE ==================== */}
      <section className="bg-slate-50 border border-dashed border-slate-400 p-0.5 rounded-xs flex items-center justify-between text-[6.5px] font-bold text-slate-700 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="bg-slate-900 text-amber-300 px-1 py-0.2 rounded-xs text-[6px] font-black uppercase">
            વાર્ષિક તસવીર સ્પર્ધા
          </span>
          <span>તમારી શ્રેષ્ઠ તસવીરો મોકલો photo@gujaratpost.in પર. પસંદગી પામેલ તસવીરોને રોકડ પુરસ્કાર અને અખબારમાં સ્થાન મળશે.</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <span>સત્તાવાર નિયમો: <strong>gujaratpost.in/photo</strong></span>
          <span>•</span>
          <span className="text-[#B3121B] font-black flex items-center gap-0.5">
            <ShieldCheck className="h-2 w-2 text-emerald-600" />
            <span>ફોટો બ્યુરો</span>
          </span>
        </div>
      </section>

      {/* ==================== 9. BROADSHEET NEWSPAPER FOOTER ==================== */}
      <footer className="border-t border-slate-400 pt-0.5 pb-0.5 flex items-center justify-between text-[7px] font-bold text-slate-600 shrink-0">
        <div>
          <span>© ગુજરાત પોસ્ટ ફોટોજર્નાલિઝમ ટીમ • અમદાવાદ • ગાંધીનગર • ગીર • કચ્છ • સુરત</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#B3121B] font-black uppercase">WWW.GUJARATPOST.IN</span>
          <span>•</span>
          <span>અંતિમ પૃષ્ઠ ૧૪ / ૧૪</span>
        </div>
      </footer>
    </div>
  );
};

