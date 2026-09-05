'use client';

import React from 'react';
import { EPaperPageData, getCleanText, formatGujaratiDate, BroadsheetArticle } from '../types';
import { TrendingUp, DollarSign, Building2, Coins, Landmark, ArrowUpRight, ArrowDownRight, ShieldCheck, Sparkles, Flame, CheckCircle2, Newspaper } from 'lucide-react';

interface TemplateProps {
  data: EPaperPageData;
}

const cleanHeadline = (text?: string) => {
  if (!text) return '';
  return text.replace(/^#\d+\s*[-–—:]\s*/, '').trim();
};

export const BusinessTemplate: React.FC<TemplateProps> = ({ data }) => {
  const {
    pageNumber = 6,
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

  // 1. Live Market Indices
  const marketIndices = [
    { name: 'BSE સેન્સેક્સ', val: '૮૨,૭૫૦.૪૦', change: '+૬૮૫.૫૦ (+૦.૮૪%)', isUp: true },
    { name: 'NSE નિફ્ટી ૫૦', val: '૨૫,૩૨૦.૧૫', change: '+૨૧૦.૮૦ (+૦.૮૪%)', isUp: true },
    { name: 'બેંક નિફ્ટી', val: '૫૧,૮૪૦.૯૦', change: '+૩૪૦.૨૫ (+૦.૬૬%)', isUp: true },
    { name: 'નિફ્ટી આઈટી', val: '૪૨,૧૫૦.૬૦', change: '+૫૧૫.૦૦ (+૧.૨૪%)', isUp: true },
  ];

  // 2. Lead Financial Record Story
  const leadHeadline = cleanHeadline(
    leadArticle?.printHeadline ||
    leadArticle?.titleGu ||
    leadArticle?.title ||
    'દલાલ સ્ટ્રીટમાં ઐતિહાસિક તેજી: સેન્સેક્સ પ્રથમવાર ૮૨,૫૦૦ પાર, FII દ્વારા ₹૪,૫૦૦ કરોડની જંગી ખરીદીથી રોકાણકારો ગેલમાં'
  );

  const leadImage =
    leadArticle?.featuredImage ||
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80';

  const leadCaption =
    leadArticle?.photoCredit || 'તસવીર: ગુજરાત પોસ્ટ • મુંબઈ: બોમ્બે સ્ટોક એક્સચેન્જ (BSE) બુલ ખાતે ઉજવણીનો માહોલ';

  const leadSummary =
    leadArticle?.printSummary ||
    getCleanText(
      leadArticle?.excerptGu ||
        leadArticle?.excerpt ||
        leadArticle?.contentGu ||
        leadArticle?.content ||
        'ભારતીય શેરબજારમાં વૈશ્વિક સંકેતો અને મજબૂત જીડીપી વૃદ્ધિના પગલે સર્વાંગી તેજી જોવા મળી છે. બેંકિંગ, આઈટી, ઓટો અને કેપિટલ ગુડ્સ શેરોમાં ભારે લેવાલીથી રોકાણકારોની સંપત્તિમાં ₹૩.૫ લાખ કરોડનો ઉમેરો થયો છે.',
      280
    );

  const leadSecondParagraph = getCleanText(
    leadArticle?.contentGu ||
      leadArticle?.content ||
      'સ્થાનિક સંસ્થાગત રોકાણકારો (DII) અને મ્યુચ્યુઅલ ફંડ્સની સતત એસઆઈપી ઈનફ્લો દ્વારા બજારને મજબૂત આધાર મળી રહ્યો છે. વિદેશી ફંડ્સ પણ ભારતીય બજારોમાં મોટાપાયે પુનઃ પ્રવેશ કરી રહ્યા છે.',
    260
  );

  const leadLocation = leadArticle?.location || 'મુંબઈ';

  // 3. 7 Fast Corporate & Market Updates (Right 4 cols)
  const corporateBulletin = [
    { title: cleanHeadline(pool[0]?.printHeadline || pool[0]?.titleGu) || 'રિઝર્વ બેંક ઓફ ઇન્ડિયા (RBI): રેપો રેટ ૬.૫૦% પર સ્થિર રાખવાની જાહેરાત', time: '૧૦:૦૦ AM', cat: 'મોનેટરી' },
    { title: cleanHeadline(pool[1]?.printHeadline || pool[1]?.titleGu) || 'GIFT સિટી IFSC માં વિદેશી બેંકોનું કુલ ટ્રાન્ઝેક્શન $૫૦૦ અબજ પાર', time: '૧૧:૩૦ AM', cat: 'IFSC' },
    { title: cleanHeadline(pool[2]?.printHeadline || pool[2]?.titleGu) || 'ટાટા મોટર્સ અને મહિન્દ્રા દ્વારા નવા ઈવી મોડેલ્સનું ધમાકેદાર બુકિંગ', time: '૧૨:૪૫ PM', cat: 'ઓટો' },
    { title: cleanHeadline(pool[3]?.printHeadline || pool[3]?.titleGu) || 'રિલાયન્સ ઇન્ડસ્ટ્રીઝ: નવી ગ્રીન એનર્જી ગીગા ફેક્ટરીઓનું ટ્રાયલ શરૂ', time: '૦૨:૧૫ PM', cat: 'ઊર્જા' },
    { title: cleanHeadline(pool[4]?.printHeadline || pool[4]?.titleGu) || 'ઇન્ફોસિસ અને TCS ને અમેરિકા-યુરોપમાંથી $૨ અબજના નવા AI પ્રોજેક્ટ્સ', time: '૦૩:૩૦ PM', cat: 'આઈટી' },
    { title: cleanHeadline(pool[5]?.printHeadline || pool[5]?.titleGu) || 'IPO માર્કેટમાં ધૂમ: ૩ નવી કંપનીઓના પબ્લિક ઇશ્યૂ ૩૫ ગણા છલકાયા', time: '૦૪:૪૫ PM', cat: 'IPO' },
    { title: cleanHeadline(pool[6]?.printHeadline || pool[6]?.titleGu) || 'સોવરેન ગોલ્ડ બોન્ડમાં રોકાણકારોનું વિક્રમી ₹૮,૦૦૦ કરોડનું રોકાણ', time: '૦૬:૦૦ PM', cat: 'સોનું' },
  ];

  // 4. Secondary Corporate Stories (2 prominent stories with photos)
  const secBiz1 = {
    title: cleanHeadline(pool[7]?.printHeadline || pool[7]?.titleGu) || 'બેંકિંગ સેક્ટરમાં NPA ૧૨ વર્ષની નીચલી સપાટીએ: નેટ નફામાં ૨૮% ની મજબૂત વૃદ્ધિ',
    image: pool[7]?.featuredImage || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=500&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[7]?.excerptGu || pool[7]?.contentGu || 'જાહેર અને ખાનગી ક્ષેત્રની બેંકોની બેલેન્સ શીટ મજબૂત બની છે. રિટેલ અને કોર્પોરેટ લોન ગ્રોથ ૧૬% ના દરે આગળ વધી રહ્યો છે.', 240),
    tag: 'બેંકિંગ એનાલિસિસ',
    byline: 'ફાઇનાન્સ બ્યુરો, મુંબઈ',
    art: pool[7]
  };

  const secBiz2 = {
    title: cleanHeadline(pool[8]?.printHeadline || pool[8]?.titleGu) || 'ભારતીય ફાર્મા નિકાસ $૩૦ અબજ પાર: વૈશ્વિક જેનેરિક દવા બજારમાં ભારત મોખરે',
    image: pool[8]?.featuredImage || 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=500&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[8]?.excerptGu || pool[8]?.contentGu || 'યુએસ એફડીએ અને યુરોપિયન રેગ્યુલેટર્સ દ્વારા ભારતીય મેન્યુફેક્ચરિંગ પ્લાન્ટ્સને ઝડપી મંજૂરી મળતા એક્સપોર્ટમાં ૨૨% નો ઉછાળો.', 240),
    tag: 'ફાર્મા એક્સપોર્ટ',
    byline: 'હેલ્થકેર ડેસ્ક, અમદાવાદ',
    art: pool[8]
  };

  // 5. Special In-Depth Spotlight (2 Ground Reports with Photos)
  const spotBiz1 = {
    title: cleanHeadline(pool[9]?.printHeadline || pool[9]?.titleGu) || 'ભારતમાં સેમિકન્ડક્ટર ક્રાંતિ: ₹૧.૫ લાખ કરોડના ૫ ચિપ પ્લાન્ટ્સનું ઝડપી નિર્માણ કાર્ય',
    image: pool[9]?.featuredImage || 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=400&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[9]?.excerptGu || pool[9]?.contentGu || 'ધોલેરા અને સાણંદ ખાતે ટાટા અને માઇક્રોન દ્વારા ચિપ મેન્યુફેક્ચરિંગ શરૂ થતાં ભારત વૈશ્વિક સેમિકન્ડક્ટર સપ્લાય ચેઇનમાં પાવરહાઉસ બનશે.', 240),
    badge: 'વિશેષ રિપોર્ટ',
    category: 'સેમિકન્ડક્ટર',
    byline: 'ટેક-બિઝનેસ ડેસ્ક',
    art: pool[9]
  };

  const spotBiz2 = {
    title: cleanHeadline(pool[10]?.printHeadline || pool[10]?.titleGu) || 'રિયલ એસ્ટેટ સેક્ટરમાં તેજી: રેસિડેન્શિયલ અને કોમર્શિયલ બુકિંગમાં રેકોર્ડ ૪૦% નો વધારો',
    image: pool[10]?.featuredImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[10]?.excerptGu || pool[10]?.contentGu || 'ટોચના ૭ મહાનગરોમાં પ્રીમિયમ હાઉસિંગ ડિમાન્ડ સર્વોચ્ચ સપાટીએ પહોંચી છે. નવા ઈન્ફ્રાસ્ટ્રક્ચર અને મેટ્રો લાઈનોથી પ્રોપર્ટી વેલ્યૂમાં વધારો.', 240),
    badge: 'રિયલ એસ્ટેટ',
    category: 'પ્રોપર્ટી માર્કેટ',
    byline: 'ઇન્ફ્રા ડેસ્ક',
    art: pool[10]
  };

  // 6. 4-Sector Industry Matrix with photos
  const bankingSector = {
    title: 'બેંકિંગ & ફાઇનાન્સ',
    img: pool[11]?.featuredImage || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'HDFC', title: cleanHeadline(pool[11]?.printHeadline || pool[11]?.titleGu) || 'ડિપોઝિટ વૃદ્ધિમાં ૧૮% નો વધારો, હોમ લોન ડિમાન્ડ મજબૂત' },
      { loc: 'SBI', title: cleanHeadline(pool[12]?.printHeadline || pool[12]?.titleGu) || 'યોનો એપ દ્વારા દૈનિક ₹૫,૦૦૦ કરોડના ટ્રાન્ઝેક્શન' },
      { loc: 'ICICI', title: cleanHeadline(pool[13]?.printHeadline || pool[13]?.titleGu) || 'ડિજિટલ ક્રેડિટ કાર્ડ સેગમેન્ટમાં ૨૫% વાર્ષિક વૃદ્ધિ' },
    ]
  };

  const techAiSector = {
    title: 'આઈટી & AI સર્વિસિસ',
    img: pool[14]?.featuredImage || 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'TCS', title: cleanHeadline(pool[14]?.printHeadline || pool[14]?.titleGu) || 'જનરેટિવ AI પ્લેટફોર્મ પર ૧ લાખ એન્જિનિયરો સજ્જ' },
      { loc: 'INFY', title: cleanHeadline(pool[15]?.printHeadline || pool[15]?.titleGu) || 'યુરોપિયન ક્લાઉડ પ્રોજેક્ટ્સમાંથી $૫૦૦ મિલિયન આવક' },
      { loc: 'WIPRO', title: cleanHeadline(pool[16]?.printHeadline || pool[16]?.titleGu) || 'સાયબર સિક્યોરિટી અને ડેટા એનાલિટિક્સમાં મોટો નફો' },
    ]
  };

  const energyAutoSector = {
    title: 'ઓટોમોબાઇલ & એનર્જી',
    img: pool[17]?.featuredImage || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'TATA', title: cleanHeadline(pool[17]?.printHeadline || pool[17]?.titleGu) || 'ઈવી પેસેન્જર કાર સેલ્સમાં ૭૦% માર્કેટ શેર જાળવ્યો' },
      { loc: 'RIL', title: cleanHeadline(pool[18]?.printHeadline || pool[18]?.titleGu) || 'જામનગરમાં સોલાર ગીગાફેક્ટરી ફેઝ-૧ શરૂ કરવાની તૈયારી' },
      { loc: 'ADANI', title: cleanHeadline(pool[19]?.printHeadline || pool[19]?.titleGu) || 'ખાવડા ખાતે ૩૦ GW રિન્યુએબલ એનર્જી પાર્ક ઝડપથી કાર્યરત' },
    ]
  };

  const pharmaFmcgSector = {
    title: 'ફાર્મા & એફએમસીજી',
    img: pool[20]?.featuredImage || 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'SUN', title: cleanHeadline(pool[20]?.printHeadline || pool[20]?.titleGu) || 'સ્પેશિયાલિટી પ્રોડક્ટ્સના વૈશ્વિક વેચાણમાં ૩૨% ઉછાળો' },
      { loc: 'ITC', title: cleanHeadline(pool[21]?.printHeadline || pool[21]?.titleGu) || 'એગ્રી-બિઝનેસ અને એફએમસીજી નફામાં મજબૂત સુધારો' },
      { loc: 'ZYDUS', title: cleanHeadline(pool[22]?.printHeadline || pool[22]?.titleGu) || 'નવી બાયોસિમિલર દવાઓને યુએસ એફડીએ મંજૂરી મળી' },
    ]
  };

  // 7. 8 Corporate & Market Sectors Grid (2 rows of 4 cols with photos)
  const businessGridStories = [
    {
      sector: 'મ્યુચ્યુઅલ ફંડ',
      title: cleanHeadline(pool[23]?.printHeadline || pool[23]?.titleGu) || 'માસિક SIP ઇનફ્લો ₹૨૨,૫૦૦ કરોડની સર્વોચ્ચ સપાટીએ',
      summary: getCleanText(pool[23]?.excerptGu || pool[23]?.contentGu || 'રિટેલ રોકાણકારોનો ઇક્વિટી માર્કેટમાં અવિરત વિશ્વાસ, કુલ AUM ₹૬૫ લાખ કરોડ પાર.', 60),
      image: pool[23]?.featuredImage || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&auto=format&fit=crop&q=80',
    },
    {
      sector: 'બુલિયન માર્કેટ',
      title: cleanHeadline(pool[24]?.printHeadline || pool[24]?.titleGu) || 'સોના-ચાંદીમાં તેજી: તહેવારો પૂર્વે જ્વેલરી સેક્ટરમાં ભારે ખરીદી',
      summary: getCleanText(pool[24]?.excerptGu || pool[24]?.contentGu || 'લગ્નસરાની માંગ અને આંતરરાષ્ટ્રીય સેફ-હેવન લેવાલીથી કિંમતી ધાતુઓમાં ઉછાળો.', 60),
      image: pool[24]?.featuredImage || 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=300&auto=format&fit=crop&q=80',
    },
    {
      sector: 'GIFT સિટી',
      title: cleanHeadline(pool[25]?.printHeadline || pool[25]?.titleGu) || 'ગ્લોબલ ફિનટેક ઇનોવેશન હબમાં ૧૦૦ નવા વૈશ્વિક ફંડ્સ નોંધાયા',
      summary: getCleanText(pool[25]?.excerptGu || pool[25]?.contentGu || 'સિંગાપોર અને લંડન સ્થિત એસેટ મેનેજમેન્ટ કંપનીઓ દ્વારા ભારતમાં કાર્યાલયો શરૂ.', 60),
      image: pool[25]?.featuredImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&auto=format&fit=crop&q=80',
    },
    {
      sector: 'ઇલેક્ટ્રિક વાહન',
      title: cleanHeadline(pool[26]?.printHeadline || pool[26]?.titleGu) || 'દેશમાં ઈ-ટુવ્હીલર અને ઈ-બસના વેચાણમાં વાર્ષિક ૪૫% વૃદ્ધિ',
      summary: getCleanText(pool[26]?.excerptGu || pool[26]?.contentGu || 'બેટરી સ્વેપિંગ નેટવર્ક અને સરકારી સબસિડીના સહારે ગ્રીન મોબિલિટીને વેગ.', 60),
      image: pool[26]?.featuredImage || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=300&auto=format&fit=crop&q=80',
    },
    {
      sector: 'MSME ઉદ્યોગ',
      title: cleanHeadline(pool[27]?.printHeadline || pool[27]?.titleGu) || 'નાના ઉદ્યોગો માટે કોલેટરલ ફ્રી લોન મર્યાદા વધારી ₹૧૦ કરોડ કરાઈ',
      summary: getCleanText(pool[27]?.excerptGu || pool[27]?.contentGu || 'ઉત્પાદન ક્ષમતા વધારવા અને રોજગાર સર્જન માટે કેન્દ્ર સરકારનું વિશેષ પેકેજ.', 60),
      image: pool[27]?.featuredImage || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=300&auto=format&fit=crop&q=80',
    },
    {
      sector: 'ઈ-કોમર્સ લોજિસ્ટિક્સ',
      title: cleanHeadline(pool[28]?.printHeadline || pool[28]?.titleGu) || 'તહેવારોની સીઝનમાં ઓનલાઇન વેચાણ ₹૧.૨ લાખ કરોડ વટાવશે',
      summary: getCleanText(pool[28]?.excerptGu || pool[28]?.contentGu || 'ટાયર-૨ અને ૩ શહેરોમાંથી ભારે ઓર્ડર, વેરહાઉસિંગ ક્ષમતામાં ૨૫% વધારો.', 60),
      image: pool[28]?.featuredImage || 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=300&auto=format&fit=crop&q=80',
    },
    {
      sector: 'રિન્યુએબલ ઊર્જા',
      title: cleanHeadline(pool[29]?.printHeadline || pool[29]?.titleGu) || 'ગુજરાતમાં રુફટોપ સોલાર સ્થાપનમાં ૫ લાખ ઘરોનો ઐતિહાસિક આંકડો',
      summary: getCleanText(pool[29]?.excerptGu || pool[29]?.contentGu || 'પીએમ સૂર્ય ઘર યોજના હેઠળ નાગરિકોને શૂન્ય વીજળી બિલનો મોટો લાભ.', 60),
      image: pool[29]?.featuredImage || 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=300&auto=format&fit=crop&q=80',
    },
    {
      sector: 'એગ્રી એક્સપોર્ટ',
      title: cleanHeadline(pool[30]?.printHeadline || pool[30]?.titleGu) || 'ભારતીય બાસમતી ચોખા અને મસાલાની વૈશ્વિક નિકાસમાં ૩૫% ઉછાળો',
      summary: getCleanText(pool[30]?.excerptGu || pool[30]?.contentGu || 'યુરોપ અને અમેરિકામાં ભારતીય ઓર્ગેનિક એગ્રો ઉત્પાદનોની ભારે લોકપ્રિયતા.', 60),
      image: pool[30]?.featuredImage || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=300&auto=format&fit=crop&q=80',
    },
  ];

  // 8. Financial Snapshot Briefs (6 columns)
  const businessPulseBriefs = [
    { label: 'રૂપિયો vs ડોલર', text: 'વિદેશી રોકાણ પ્રવાહ વધતા રૂપિયો ₹૮૩.૨૦ પ્રતિ ડોલર પર મજબૂત.', ref: 'ફોરેક્સ ડેસ્ક' },
    { label: 'સોવરેન બોન્ડ', text: 'ભારતીય ૧૦-વર્ષીય સરકારી બોન્ડ યીલ્ડ ૬.૮૮% પર સ્થિર રહી.', ref: 'બોન્ડ માર્કેટ' },
    { label: 'ક્રૂડ ઓઇલ', text: 'બ્રેન્ટ ક્રૂડ $૭૮.૧૦ પ્રતિ બેરલ પર ટ્રેડ થતાં ઇંધણ મોંઘવારી કાબૂમાં.', ref: 'કોમોડિટી' },
    { label: 'GIFT નિફ્ટી', text: 'સવારના સત્રમાં ગિફ્ટ નિફ્ટી +૧૨૦ પોઇન્ટના ઉછાળા સાથે ટ્રેડ.', ref: 'IFSC એક્સચેન્જ' },
    { label: 'GST કલેક્શન', text: 'ઈ-વે બિલ જનરેશનમાં ૧૬% વૃદ્ધિ સાથે માસિક કલેક્શન રેકોર્ડ સ્તરે.', ref: 'રેવન્યુ બોર્ડ' },
    { label: 'સ્ટાર્ટઅપ ફંડિંગ', text: 'ફિનટેક અને એગ્રીટેક સ્ટાર્ટઅપ્સને ચાલુ ક્વાર્ટરમાં $૧.૮ અબજ મળ્યા.', ref: 'વેન્ચર કેપિટલ' },
  ];

  return (
    <div className="h-full flex flex-col p-2 bg-white border-[3px] border-slate-900 box-border text-slate-900 font-sans select-none overflow-hidden space-y-0.5 justify-between">
      {/* ==================== 1. BUSINESS RUNNING HEADER & FOLIO ==================== */}
      <header className="shrink-0">
        <div className="flex items-center justify-between text-[7.5px] font-bold text-slate-800 border-b border-slate-300 pb-0.5 mb-0.5">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-950 uppercase">ગુજરાત પોસ્ટ</span>
            <span className="text-slate-400">•</span>
            <span className="text-[#B3121B] font-black uppercase">વેપાર વાણિજ્ય & બજાર વિશેષ</span>
            <span className="text-slate-400">•</span>
            <span>{gujaratiDateStr}</span>
          </div>
          <div className="flex items-center gap-2 font-extrabold">
            <span>બિઝનેસ ડેસ્ક</span>
            <span>•</span>
            <span className="bg-[#B3121B] text-white px-1.5 py-0.2 rounded-xs text-[7px] font-black uppercase">
              પાનું ૬ / ૧૪
            </span>
            <span>•</span>
            <span>₹ ૧૫.૦૦</span>
          </div>
        </div>

        {/* Section Masthead Banner */}
        <div className="bg-slate-950 text-white px-2 py-0.5 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[8.5px] font-black uppercase tracking-wider rounded-xs flex items-center gap-1">
              <TrendingUp className="h-2.5 w-2.5" />
              <span>કોર્પોરેટ & બજાર દર્પણ • FINANCIAL & MARKET CHRONICLE</span>
            </span>
            <span className="text-slate-300 text-[8px] font-bold truncate">
              શેરબજાર, બેંકિંગ, કોમોડિટી, GIFT સિટી, રિયલ એસ્ટેટ અને કોર્પોરેટ પરિણામો
            </span>
          </div>
          <div className="flex items-center gap-1 text-amber-300 text-[7.5px] font-extrabold shrink-0">
            <DollarSign className="h-2.5 w-2.5" />
            <span>મુંબઈ-અમદાવાદ બ્યુરો</span>
          </div>
        </div>

        {/* Market Indices Ticker Ribbon */}
        <div className="grid grid-cols-4 gap-1 bg-slate-100 border-x border-b border-slate-300 p-0.5 text-[6.8px] font-bold text-slate-700">
          {marketIndices.map((m, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-0.5 flex flex-col justify-between">
              <span className="text-slate-500 font-extrabold truncate">{m.name}</span>
              <span className="text-[7.5px] font-black text-slate-950">{m.val}</span>
              <span className="text-[5.8px] font-bold text-emerald-700">{m.change}</span>
            </div>
          ))}
        </div>
      </header>

      {/* ==================== 2. UPPER BUSINESS GRID (8 COLS LEAD + 4 COLS BULLETIN) ==================== */}
      <section className="grid grid-cols-12 gap-2 border-b-2 border-slate-900 pb-1 pt-0.5 shrink-0 items-stretch">
        {/* Left 8 Columns: Dominant Lead Market Record Story */}
        <div className="col-span-8 border-r-2 border-slate-900 pr-2 space-y-0.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[7px] font-bold text-slate-600 mb-0.2">
              <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[7px] font-black rounded-xs uppercase">
                દલાલ સ્ટ્રીટ રેકોર્ડ • BSE & NSE તેજી
              </span>
              <span>મુંબઈ સ્ટોક એક્સચેન્જ</span>
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
                <span className="text-[#B3121B] font-bold shrink-0 ml-1">► માર્કેટ એનાલિસિસ</span>
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
                  <span>• સેન્સેક્સ ૮૨,૭૫૦ પાર</span>
                  <span>• નિફ્ટી ૨૫,૩૦૦ પાર</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>• FII ખરીદી ₹૪,૫૦૦ કરોડ</span>
                  <span>• ₹૩.૫ લાખ કરોડ સંપત્તિ</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Columns: 7 Corporate Bulletins */}
        <div className="col-span-4 flex flex-col justify-between space-y-0.5 bg-slate-50 p-1 border border-slate-300">
          <div className="flex items-center justify-between border-b border-slate-300 pb-0.5">
            <span className="bg-slate-900 text-amber-300 text-[7px] font-black px-1.5 py-0.2 rounded-xs uppercase">
              કોર્પોરેટ ડાયરી • 7 FAST UPDATES
            </span>
            <span className="text-[#B3121B] text-[6.5px] font-bold">બિઝનેસ લાઈવ</span>
          </div>

          <div className="space-y-0.5 flex-1 flex flex-col justify-between">
            {corporateBulletin.map((item, idx) => (
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
            <span>BSE / NSE લાઇવ ડેટા</span>
            <span className="text-[#B3121B]">► સંપૂર્ણ લિસ્ટ પાના ૬ પર</span>
          </div>
        </div>
      </section>

      {/* ==================== 3. 2 PROMINENT SECONDARY CORPORATE STORIES (WITH PHOTOS) ==================== */}
      <section className="grid grid-cols-2 gap-2.5 border-b-2 border-slate-900 pb-1 pt-0.5 shrink-0">
        {/* Story 1 */}
        <div className="space-y-0.5 border-r border-slate-300 pr-2.5">
          <div className="flex items-center justify-between text-[7px] font-bold text-slate-500">
            <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[6.5px] font-black rounded-xs uppercase">
              {secBiz1.tag}
            </span>
            <span className="text-[#B3121B] font-bold">► બેંકિંગ રિપોર્ટ</span>
          </div>

          <h3 className="text-[10.5px] font-black leading-tight text-slate-950 line-clamp-1">
            {secBiz1.title}
          </h3>

          <div className="flex gap-2 items-start mt-0.5">
            <div className="w-[100px] shrink-0 space-y-0.5">
              <div className="w-[100px] h-[66px] overflow-hidden border border-slate-300 bg-slate-100">
                <img src={secBiz1.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                તસવીર: ગુજરાત પોસ્ટ
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between min-h-[66px] space-y-0.5">
              <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                {secBiz1.summary}
              </p>
              <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                <span className="text-slate-800 font-extrabold truncate">
                  {secBiz1.byline}
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
              {secBiz2.tag}
            </span>
            <span className="text-[#B3121B] font-bold">► ફાર્મા બુલેટિન</span>
          </div>

          <h3 className="text-[10.5px] font-black leading-tight text-slate-950 line-clamp-1">
            {secBiz2.title}
          </h3>

          <div className="flex gap-2 items-start mt-0.5">
            <div className="w-[100px] shrink-0 space-y-0.5">
              <div className="w-[100px] h-[66px] overflow-hidden border border-slate-300 bg-slate-100">
                <img src={secBiz2.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                તસવીર: ગુજરાત પોસ્ટ
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between min-h-[66px] space-y-0.5">
              <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                {secBiz2.summary}
              </p>
              <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                <span className="text-slate-800 font-extrabold truncate">
                  {secBiz2.byline}
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
            <span>ઔદ્યોગિક ક્રાંતિ & રિયલ એસ્ટેટ સમીક્ષા (INDUSTRIAL & REAL ESTATE SPOTLIGHT)</span>
          </span>
          <span className="text-[6.5px] font-bold text-slate-600">સેમિકન્ડક્ટર ચિપ પ્લાન્ટ્સ & પ્રીમિયમ હાઉસિંગ તેજી</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Spot 1 */}
          <div className="space-y-0.5 border-r border-slate-300 pr-2.5">
            <div className="flex items-center justify-between text-[6.5px] font-bold">
              <span className="bg-indigo-800 text-white px-1.5 py-0.1 text-[6px] font-black rounded-xs uppercase">
                {spotBiz1.badge} • {spotBiz1.category}
              </span>
              <span className="text-[#B3121B] font-bold">► ચિપ પ્લાન્ટ</span>
            </div>

            <h4 className="text-[10px] font-black leading-tight text-slate-950 line-clamp-1">
              {spotBiz1.title}
            </h4>

            <div className="flex gap-2 items-start mt-0.5">
              <div className="w-[100px] shrink-0 space-y-0.5">
                <div className="w-[100px] h-[66px] overflow-hidden border border-slate-300 bg-slate-100">
                  <img src={spotBiz1.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
                </div>
                <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                  તસવીર: ગુજરાત પોસ્ટ
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between min-h-[66px] space-y-0.5">
                <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                  {spotBiz1.summary}
                </p>
                <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                  <span className="text-slate-800 font-extrabold truncate">
                    {spotBiz1.byline}
                  </span>
                  <span className="text-[#B3121B] font-black shrink-0">
                    ટેક પાના ૦૮
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Spot 2 */}
          <div className="space-y-0.5">
            <div className="flex items-center justify-between text-[6.5px] font-bold">
              <span className="bg-emerald-800 text-white px-1.5 py-0.1 text-[6px] font-black rounded-xs uppercase">
                {spotBiz2.badge} • {spotBiz2.category}
              </span>
              <span className="text-[#B3121B] font-bold">► રિયલ એસ્ટેટ</span>
            </div>

            <h4 className="text-[10px] font-black leading-tight text-slate-950 line-clamp-1">
              {spotBiz2.title}
            </h4>

            <div className="flex gap-2 items-start mt-0.5">
              <div className="w-[100px] shrink-0 space-y-0.5">
                <div className="w-[100px] h-[66px] overflow-hidden border border-slate-300 bg-slate-100">
                  <img src={spotBiz2.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
                </div>
                <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                  તસવીર: ગુજરાત પોસ્ટ
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between min-h-[66px] space-y-0.5">
                <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                  {spotBiz2.summary}
                </p>
                <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                  <span className="text-slate-800 font-extrabold truncate">
                    {spotBiz2.byline}
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

      {/* ==================== 5. 4-SECTOR INDUSTRY MATRIX (WITH PHOTOS) ==================== */}
      <section className="border-b-2 border-slate-900 pb-0.5 shrink-0">
        <div className="flex items-center justify-between text-[7px] font-black text-slate-950 mb-0.5 border-b border-slate-300 pb-0.2">
          <span className="bg-slate-900 text-white px-1 py-0.2 text-[6.5px] uppercase rounded-xs">
            ૪ ઔદ્યોગિક સ્તંભો • 4 SECTOR INDUSTRY MATRIX
          </span>
          <span className="text-slate-500 text-[6.5px]">બેંકિંગ • આઈટી & AI • ઓટોમોબાઇલ & એનર્જી • ફાર્મા & FMCG</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {/* Sector 1: Banking */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-[#B3121B] text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {bankingSector.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={bankingSector.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {bankingSector.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► સેક્ટર રિપોર્ટ</span>
          </div>

          {/* Sector 2: IT & AI */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-slate-900 text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {techAiSector.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={techAiSector.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {techAiSector.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► સેક્ટર રિપોર્ટ</span>
          </div>

          {/* Sector 3: Energy & Auto */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-amber-700 text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {energyAutoSector.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={energyAutoSector.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {energyAutoSector.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► સેક્ટર રિપોર્ટ</span>
          </div>

          {/* Sector 4: Pharma & FMCG */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-emerald-800 text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {pharmaFmcgSector.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={pharmaFmcgSector.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {pharmaFmcgSector.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► સેક્ટર રિપોર્ટ</span>
          </div>
        </div>
      </section>

      {/* ==================== 6. 8 CORPORATE & MARKET SECTORS GRID (2 ROWS OF 4 COLS) ==================== */}
      <section className="border-b-2 border-slate-900 pb-0.5 pt-0.2 shrink-0 space-y-0.5">
        <div className="flex items-center justify-between text-[7px] font-black text-slate-950 border-b border-slate-300 pb-0.2">
          <span className="bg-[#B3121B] text-white px-1 py-0.2 text-[6.5px] uppercase rounded-xs flex items-center gap-1">
            <Newspaper className="h-2 w-2" />
            <span>વેપાર વાણિજ્ય & કોર્પોરેટ રોકાણ (CORPORATE INVESTMENT & COMMERCE DIGEST)</span>
          </span>
          <span className="text-slate-500 text-[6.2px]">બજારના ૮ અગ્રણી સેક્ટર્સની ગતિવિધિ</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {businessGridStories.map((item, idx) => (
            <div
              key={idx}
              className={`space-y-0.5 ${idx % 4 !== 3 ? 'border-r border-slate-300 pr-1.5' : ''} ${idx >= 4 ? 'pt-0.5 border-t border-slate-200' : ''}`}
            >
              <div className="flex items-center justify-between text-[6.5px] font-bold text-slate-500">
                <span className="text-[#B3121B] font-black uppercase">[{item.sector}]</span>
                <span className="text-[5.8px] text-slate-400">બિઝનેસ</span>
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

      {/* ==================== 7. FINANCIAL SNAPSHOT BRIEFS (6 COLUMNS) ==================== */}
      <section className="shrink-0 space-y-0.5 border-b border-slate-400 pb-0.5">
        <div className="flex items-center gap-1.5 border-b border-slate-300 pb-0.2">
          <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[7px] font-black uppercase rounded-xs">
            બજાર સ્નેપશોટ • FINANCIAL PULSE BRIEFS
          </span>
          <span className="text-[6.5px] text-slate-500 font-bold">ફોરેક્સ, બોન્ડ્સ, કોમોડિટી અને ફંડિંગ સમાચાર</span>
        </div>

        <div className="grid grid-cols-6 gap-1 pt-0.2">
          {businessPulseBriefs.map((brief, idx) => (
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

      {/* ==================== 8. CORPORATE ADVISORY STRIP ==================== */}
      <section className="bg-slate-50 border border-dashed border-slate-400 p-0.5 rounded-xs flex items-center justify-between text-[6.5px] font-bold text-slate-700 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="bg-slate-900 text-amber-300 px-1 py-0.2 rounded-xs text-[6px] font-black uppercase flex items-center gap-0.5">
            <ShieldCheck className="h-2 w-2" />
            <span>સેબી & આરબીઆઈ ગાઇડલાઇન</span>
          </span>
          <span>શેરબજાર અને મ્યુચ્યુઅલ ફંડ્સમાં રોકાણ બજાર જોખમોને આધીન છે. વિવેકપૂર્ણ રોકાણ કરો.</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <span>સત્તાવાર પોર્ટલ: <strong>sebi.gov.in</strong></span>
          <span>•</span>
          <span className="text-[#B3121B] font-black">પ્રમાણિત બિઝનેસ ડેસ્ક</span>
        </div>
      </section>

      {/* ==================== 9. BROADSHEET NEWSPAPER FOOTER ==================== */}
      <footer className="border-t border-slate-400 pt-0.5 pb-0.5 flex items-center justify-between text-[7px] font-bold text-slate-600 shrink-0">
        <div>
          <span>© ગુજરાત પોસ્ટ બિઝનેસ બ્યુરો, {displayCity} • મુંબઈ • દિલ્હી • અમદાવાદ • GIFT સિટી</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#B3121B] font-black uppercase">WWW.GUJARATPOST.IN</span>
          <span>•</span>
          <span>પાનું ૬ / ૧૪</span>
        </div>
      </footer>
    </div>
  );
};
