'use client';

import React from 'react';
import { EPaperPageData, getCleanText, formatGujaratiDate, BroadsheetArticle } from '../types';
import { GraduationCap, BookOpen, HelpCircle, Lightbulb, Award, Calendar, ShieldCheck, CheckCircle2, Flame, Newspaper } from 'lucide-react';

interface TemplateProps {
  data: EPaperPageData;
}

const cleanHeadline = (text?: string) => {
  if (!text) return '';
  return text.replace(/^#\d+\s*[-–—:]\s*/i, '').trim();
};

export const EducationTemplate: React.FC<TemplateProps> = ({ data }) => {
  const {
    pageNumber = 11,
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

  // 1. Exam Deadlines Strip
  const examDeadlines = [
    { exam: 'GPSC ક્લાસ ૧-૨', date: 'છેલ્લી તારીખ: ૧૫ સપ્ટેમ્બર', note: '૫૫૦ જગ્યાઓ' },
    { exam: 'UPSC સિવિલ સર્વિસ', date: 'પ્રિલિમ્સ ફોર્મ શરૂ', note: 'ઓલ ઇન્ડિયા કેડર' },
    { exam: 'ગુજરાત બોર્ડ ધો. ૧૦/૧૨', date: 'પરીક્ષા ફોર્મ રજિસ્ટ્રેશન', note: 'gseb.org પોર્ટલ' },
    { exam: 'NEET / JEE ૨૦૨૭', date: 'ઓનલાઇન મોક ટેસ્ટ લિંક', note: 'nta.ac.in અધિકૃત' },
  ];

  // 2. Lead Education Story
  const leadHeadline = cleanHeadline(
    leadArticle?.printHeadline ||
    leadArticle?.titleGu ||
    leadArticle?.title ||
    'સ્પર્ધાત્મક પરીક્ષાઓમાં સફળતાનો રોડમેપ: GPSC અને UPSC તૈયારી માટે સમય વ્યવસ્થાપન, સચોટ મટિરિયલ અને આન્સર રાઇટિંગ કૌશલ્ય'
  );

  const leadImage =
    leadArticle?.featuredImage ||
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80';

  const leadCaption =
    leadArticle?.photoCredit || 'તસવીર: ગુજરાત પોસ્ટ • ગાંધીનગર: સિવિલ સર્વિસ તાલીમ કેન્દ્ર ખાતે ટોપર્સ અને વિષય નિષ્ણાતોનું માર્ગદર્શન સત્ર';

  const leadSummary =
    leadArticle?.printSummary ||
    getCleanText(
      leadArticle?.excerptGu ||
        leadArticle?.excerpt ||
        leadArticle?.contentGu ||
        leadArticle?.content ||
        'ગુજરાતના યુવાનો સ્પર્ધાત્મક પરીક્ષાઓમાં શ્રેષ્ઠ પરિણામ મેળવે તે માટે રાજ્ય સરકાર અને અગ્રણી એકેડેમીઓ દ્વારા વિશેષ કોચિંગ અને મોક ટેસ્ટનું આયોજન કરાયું છે. સામાન્ય જ્ઞાન, કરંટ અફેર્સ અને મુખ્ય પરીક્ષાના લખાણ કૌશલ્ય પર વિશેષ ધ્યાન આપવાની જરૂર છે.',
      280
    );

  const leadSecondParagraph = getCleanText(
    leadArticle?.contentGu ||
      leadArticle?.content ||
      'નવી શિક્ષણ નીતિ (NEP ૨૦૨૦) અંતર્ગત સ્કૂલ અને કોલેજ સ્તરેથી જ વ્યવસાયિક કૌશલ્ય, વિવેચનાત્મક વિચારસરણી અને ડિજિટલ શિક્ષણ પર ભાર મુકાઈ રહ્યો છે જેથી વિદ્યાર્થીઓ વૈશ્વિક સ્પર્ધામાં આગળ વધી શકે.',
      260
  );

  const leadLocation = leadArticle?.location || 'ગાંધીનગર';

  // 3. 7 Fast Campus & Career Bulletins (Right 4 cols)
  const educationBulletin = [
    { title: cleanHeadline(pool[0]?.printHeadline || pool[0]?.titleGu || 'ગુજરાત યુનિવર્સિટી: નવા AI અને ડેટા સાયન્સ પીજી કોર્સીસમાં પ્રવેશ શરૂ'), time: '૧૦:૦૦ AM', cat: 'યુનિવર્સિટી' },
    { title: cleanHeadline(pool[1]?.printHeadline || pool[1]?.titleGu || 'મુખ્યમંત્રી સ્કોલરશીપ સ્કીમ: તેજસ્વી વિદ્યાર્થીઓ માટે ₹૧ લાખ સુધી સહાય'), time: '૧૧:૧૫ AM', cat: 'સ્કોલરશીપ' },
    { title: cleanHeadline(pool[2]?.printHeadline || pool[2]?.titleGu || 'GSEB બોર્ડ સુધારા: ધો. ૧૦ અને ૧૨ ની પરીક્ષાઓમાં ૫૦% પ્રશ્નો એપ્લિકેશન બેઝ્ડ'), time: '૧૨:૩૦ PM', cat: 'બોર્ડ' },
    { title: cleanHeadline(pool[3]?.printHeadline || pool[3]?.titleGu || 'IIT ગાંધીનગર ખાતે આંતરરાષ્ટ્રીય રિસર્ચ ફેલોશિપ પ્રોગ્રામ જાહેર'), time: '૦૨:૦૦ PM', cat: 'રિસર્ચ' },
    { title: cleanHeadline(pool[4]?.printHeadline || pool[4]?.titleGu || 'ડિજિટલ લાઈબ્રેરી નેટવર્ક: રાજ્યના તમામ જિલ્લાઓમાં ઈ-પુસ્તકાલય કાર્યરત'), time: '૦૩:૧૫ PM', cat: 'લાઈબ્રેરી' },
    { title: cleanHeadline(pool[5]?.printHeadline || pool[5]?.titleGu || 'વિદેશ અભ્યાસ સેમિનાર: યુએસ, યુકે અને જર્મની માટે સ્ટુડન્ટ વિઝા માર્ગદર્શન'), time: '૦૪:૩૦ PM', cat: 'વિદેશ' },
    { title: cleanHeadline(pool[6]?.printHeadline || pool[6]?.titleGu || 'શિક્ષક યોગ્યતા કસોટી (TET/TAT): નવું ઓનલાઇન મોક ટેસ્ટ પોર્ટલ શરૂ'), time: '૦૫:૪૫ PM', cat: 'ભરતી' },
  ];

  // 4. Secondary Education Stories (2 prominent stories with photos)
  const secEdu1 = {
    title: cleanHeadline(pool[7]?.printHeadline || pool[7]?.titleGu || 'નવી રાષ્ટ્રીય શિક્ષણ નીતિ (NEP 2020): કોલેજોમાં મલ્ટી-ડિસિપ્લિનરી ડિગ્રી અને ફ્લેક્સિબલ ક્રેડિટ સિસ્ટમ'),
    image: pool[7]?.featuredImage || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[7]?.excerptGu || pool[7]?.contentGu || 'વિદ્યાર્થીઓ હવે સાયન્સ સાથે મ્યુઝિક કે આર્ટ્સનો અભ્યાસ કરી શકશે. એકેડેમિક બેંક ઓફ ક્રેડિટ્સ (ABC) દ્વારા અભ્યાસ સ્થળાંતર સરળ બન્યું છે.', 240),
    tag: 'NEP સુધારા',
    byline: 'શિક્ષણ બ્યુરો, ગાંધીનગર',
    art: pool[7]
  };

  const secEdu2 = {
    title: cleanHeadline(pool[8]?.printHeadline || pool[8]?.titleGu || 'ગિફ્ટ સિટીમાં ઓસ્ટ્રેલિયન યુનિવર્સિટીઝ: ડીકિન અને વોલોંગોંગ કેમ્પસમાં એડમિશન તેજ'),
    image: pool[8]?.featuredImage || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=500&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[8]?.excerptGu || pool[8]?.contentGu || 'ભારતમાં બેઠા ઓસ્ટ્રેલિયન ડિગ્રી મેળવવાની સુવિધા સાથે સાયબર સિક્યોરિટી અને ફિનટેક કોર્સીસમાં વિદ્યાર્થીઓનો જોરદાર ઉત્સાહ જોવા મળ્યો.', 240),
    tag: 'ગ્લોબલ કેમ્પસ',
    byline: 'હાયર એજ્યુકેશન ડેસ્ક',
    art: pool[8]
  };

  // 5. Special In-Depth Spotlight (2 Ground Reports with Photos)
  const spotEdu1 = {
    title: cleanHeadline(pool[9]?.printHeadline || pool[9]?.titleGu || 'મિશન સ્કૂલ્સ ઓફ એક્સેલન્સ: રાજ્યની ૨૦,૦૦૦ સરકારી શાળાઓમાં સ્માર્ટ ઇન્ટરેક્ટિવ ક્લાસરૂમ્સ'),
    image: pool[9]?.featuredImage || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[9]?.excerptGu || pool[9]?.contentGu || 'વિશ્વ બેંક સહાયિત ₹૧૦,૦૦૦ કરોડના મેગા પ્રોજેક્ટ હેઠળ સરકારી શાળાઓનું માળખાગત નવીનીકરણ અને આધુનિક કમ્પ્યુટર લેબ્સ તૈયાર કરાઈ.', 240),
    badge: 'વિશેષ રિપોર્ટ',
    category: 'સ્કૂલ એજ્યુકેશન',
    byline: 'પ્રાથમિક શિક્ષણ બ્યુરો',
    art: pool[9]
  };

  const spotEdu2 = {
    title: cleanHeadline(pool[10]?.printHeadline || pool[10]?.titleGu || 'આઈટીઆઈ અને કૌશલ્ય વર્ધન: ઇન્ડસ્ટ્રી ૪.૦ માટે રોબોટિક્સ અને CNC ઓપરેટર તાલીમ'),
    image: pool[10]?.featuredImage || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[10]?.excerptGu || pool[10]?.contentGu || 'ટાટા ટેકનોલોજીસ સાથે મળીને રાજ્યની ૧૫૦ આઈટીઆઈનું આધુનિકીકરણ કરાયું. ૧૦૦% જોબ પ્લેસમેન્ટ ગેરંટી સાથે નવા બેચ શરૂ.', 240),
    badge: 'સ્કિલ ડેવલપમેન્ટ',
    category: 'કૌશલ્ય ભારત',
    byline: 'રોજગાર તાલીમ ડેસ્ક',
    art: pool[10]
  };

  // 6. 4-Education Domain Matrix with photos
  const civilServicesDomain = {
    title: 'GPSC & UPSC તૈયારી',
    img: pool[11]?.featuredImage || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'સિલેબસ', title: cleanHeadline(pool[11]?.printHeadline || pool[11]?.titleGu || 'પ્રિલિમ્સ અને મેન્સ માટે સ્ટેટિક GK અને કરંટ લિંકિંગ') },
      { loc: 'ટોપર્સ ટીપ્સ', title: cleanHeadline(pool[12]?.printHeadline || pool[12]?.titleGu || 'દૈનિક ૬ કલાક ગુણવત્તાસભર વાંચન અને મોક ટેસ્ટ') },
      { loc: 'ઇન્ટરવ્યૂ', title: cleanHeadline(pool[13]?.printHeadline || pool[13]?.titleGu || 'મોક ઇન્ટરવ્યૂ સત્રો દ્વારા કોન્ફિડન્સ બિલ્ડિંગ') },
    ]
  };

  const entranceExamsDomain = {
    title: 'JEE / NEET એન્ટ્રન્સ',
    img: pool[14]?.featuredImage || 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'ફિઝિક્સ', title: cleanHeadline(pool[14]?.printHeadline || pool[14]?.titleGu || 'ન્યુમેરિકલ પ્રેક્ટિસ અને ફોર્મ્યુલા શીટ રિવિઝન') },
      { loc: 'બાયોલોજી', title: cleanHeadline(pool[15]?.printHeadline || pool[15]?.titleGu || 'NCERT પુસ્તકોનું લાઇન-ટુ-લાઇન અધ્યયન અનિવાર્ય') },
      { loc: 'કેમિસ્ટ્રી', title: cleanHeadline(pool[16]?.printHeadline || pool[16]?.titleGu || 'ઓર્ગેનિક રિએક્શન્સ અને કેમિકલ બોન્ડિંગ શોર્ટકટ્સ') },
    ]
  };

  const boardExamsDomain = {
    title: 'બોર્ડ પરીક્ષા ૧૦ & ૧૨',
    img: pool[17]?.featuredImage || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'ગણિત', title: cleanHeadline(pool[17]?.printHeadline || pool[17]?.titleGu || 'પ્રમેય અને રચનામાં પૂરા ગુણ મેળવવાની ટ્રીક્સ') },
      { loc: 'વિજ્ઞાન', title: cleanHeadline(pool[18]?.printHeadline || pool[18]?.titleGu || 'આકૃતિઓ અને સમીકરણોનું સચોટ પ્રેઝન્ટેશન') },
      { loc: 'ભાષા', title: cleanHeadline(pool[19]?.printHeadline || pool[19]?.titleGu || 'નિબંધ લેખન અને વ્યાકરણ વિભાગમાં સ્કોરિંગ ગાઇડ') },
    ]
  };

  const studyAbroadDomain = {
    title: 'વિદેશ અભ્યાસ & સ્કોલરશીપ',
    img: pool[20]?.featuredImage || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'IELTS / GRE', title: cleanHeadline(pool[20]?.printHeadline || pool[20]?.titleGu || 'બેન્ડ ૭.૫+ સ્કોર કરવા લિસનિંગ અને સ્પીકિંગ પ્રેક્ટિસ') },
      { loc: 'સ્કોલરશીપ', title: cleanHeadline(pool[21]?.printHeadline || pool[21]?.titleGu || 'વિદેશમાં ૧૦૦% ટ્યુશન ફી માફી માટે અરજી પ્રક્રિયા') },
      { loc: 'વિઝા ગાઇડ', title: cleanHeadline(pool[22]?.printHeadline || pool[22]?.titleGu || 'ફાઇનાન્સિયલ ડોક્યુમેન્ટેશન અને SOP ડ્રાફ્ટિંગ') },
    ]
  };

  // 7. 8 Campus, Career & Skill Digest (2 Rows x 4 Cols)
  const educationGridStories = [
    {
      title: cleanHeadline(pool[23]?.printHeadline || pool[23]?.titleGu || 'ડિજિટલ એજ્યુકેશન મિશન: શાળાઓમાં કોડિંગ અને AI લેબ્સ શરૂ'),
      image: pool[23]?.featuredImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&auto=format&fit=crop&q=80',
      summary: getCleanText(pool[23]?.excerptGu || pool[23]?.contentGu || 'ધોરણ ૬થી જ વિદ્યાર્થીઓને પાયથોન પ્રોગ્રામિંગ અને રોબોટિક્સનું શિક્ષણ આપવા નવી પહેલ શરૂ કરાઈ.', 120),
      tag: 'ટેક શિક્ષણ'
    },
    {
      title: cleanHeadline(pool[24]?.printHeadline || pool[24]?.titleGu || 'વિદેશી સ્કોલરશીપ: ફુલબ્રાઈટ અને શેવનિંગ ફેલોશિપ અરજી ચાલુ'),
      image: pool[24]?.featuredImage || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=300&auto=format&fit=crop&q=80',
      summary: getCleanText(pool[24]?.excerptGu || pool[24]?.contentGu || 'ભારતીય સ્નાતકો માટે યુએસ અને યુકેની પ્રતિષ્ઠિત યુનિવર્સિટીઓમાં સંપૂર્ણ ફ્રી માસ્ટર્સ પ્રોગ્રામ.', 120),
      tag: 'ગ્લોબલ'
    },
    {
      title: cleanHeadline(pool[25]?.printHeadline || pool[25]?.titleGu || 'સાયબર સિક્યોરિટી ડિપ્લોમા: નેશનલ ફોરેન્સિક સાયન્સ યુનિ.માં એડમિશન'),
      image: pool[25]?.featuredImage || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&auto=format&fit=crop&q=80',
      summary: getCleanText(pool[25]?.excerptGu || pool[25]?.contentGu || 'NFSU ગાંધીનગર ખાતે એથિકલ હેકિંગ અને ડિજિટલ ફોરેન્સિક્સના વિશેષ પ્રમાણપત્ર અભ્યાસક્રમો.', 120),
      tag: 'ફોરેન્સિક્સ'
    },
    {
      title: cleanHeadline(pool[26]?.printHeadline || pool[26]?.titleGu || 'યુવા સંશોધન પ્રોત્સાહન: શોધ યોજના હેઠળ ₹૨૦,૦૦૦ માસિક સ્ટાઈપેન્ડ'),
      image: pool[26]?.featuredImage || 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=300&auto=format&fit=crop&q=80',
      summary: getCleanText(pool[26]?.excerptGu || pool[26]?.contentGu || 'રાજ્યના પીએચડી સંશોધકોને ગુણવત્તાસભર રિસર્ચ પેપર્સ તૈયાર કરવા સરકાર દ્વારા આર્થિક સહાય.', 120),
      tag: 'સંશોધન'
    },
    {
      title: cleanHeadline(pool[27]?.printHeadline || pool[27]?.titleGu || 'તબીબી શિક્ષણ વિસ્તાર: રાજ્યમાં નવી ૫ મેડિકલ કોલેજોને મંજૂરી'),
      image: pool[27]?.featuredImage || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&auto=format&fit=crop&q=80',
      summary: getCleanText(pool[27]?.excerptGu || pool[27]?.contentGu || 'MBBS સીટોમાં વધારો થતાં સ્થાનિક વિદ્યાર્થીઓને ઘરઆંગણે ગુણવત્તાયુક્ત તબીબી શિક્ષણ મળશે.', 120),
      tag: 'મેડિકલ'
    },
    {
      title: cleanHeadline(pool[28]?.printHeadline || pool[28]?.titleGu || 'કૃષિ યુનિવર્સિટીઓ: ડ્રોન ટેકનોલોજી અને ઓર્ગેનિક ફાર્મિંગ ડિગ્રી'),
      image: pool[28]?.featuredImage || 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=300&auto=format&fit=crop&q=80',
      summary: getCleanText(pool[28]?.excerptGu || pool[28]?.contentGu || 'આણંદ અને જૂનાગઢ કૃષિ કેમ્પસમાં એગ્રી-ટેક સ્ટાર્ટઅપ ઇન્ક્યુબેટર હેઠળ તાલીમ શરૂ કરાઈ.', 120),
      tag: 'એગ્રીકલ્ચર'
    },
    {
      title: cleanHeadline(pool[29]?.printHeadline || pool[29]?.titleGu || 'શિક્ષક પ્રશિક્ષણ: દીક્ષા પોર્ટેલ પર ૧ લાખ શિક્ષકોનું ઓનલાઇન અપસ્કિલિંગ'),
      image: pool[29]?.featuredImage || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=300&auto=format&fit=crop&q=80',
      summary: getCleanText(pool[29]?.excerptGu || pool[29]?.contentGu || 'નવી પેડાગોજી અને ઇન્ટરેક્ટિવ ક્લાસરૂમ મેનેજમેન્ટ માટે સાત દિવસીય ખાસ કાર્યશાળા પૂર્ણ.', 120),
      tag: 'શિક્ષક ટ્રેનિંગ'
    },
    {
      title: cleanHeadline(pool[30]?.printHeadline || pool[30]?.titleGu || 'ખેલ મહાકુંભ સ્પોર્ટ્સ ક્વોટા: એથ્લેટ્સ માટે એડમિશન અને સ્કોલરશીપ'),
      image: pool[30]?.featuredImage || 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=300&auto=format&fit=crop&q=80',
      summary: getCleanText(pool[30]?.excerptGu || pool[30]?.contentGu || 'રાષ્ટ્રીય સ્તરે મેડલ વિજેતા રમતવીરોને ઉચ્ચ શિક્ષણમાં અનામત સીટો અને વિશેષ ગ્રેસ માર્ક્સ.', 120),
      tag: 'સ્પોર્ટ્સ ક્વોટા'
    },
  ];

  // 8. General Knowledge Quiz Strip (6 columns)
  const gkQuizBriefs = [
    { label: 'પ્રશ્ન ૧: બંધારણ', text: 'ભારતીય બંધારણના કયા અનુચ્છેદમાં શિક્ષણનો અધિકાર મૂળભૂત અધિકાર છે?', ref: 'જવાબ: ૨૧-A' },
    { label: 'પ્રશ્ન ૨: ઇતિહાસ', text: 'ગુજરાતમાં દાંડી કૂચ કઈ તારીખે સાબરમતી આશ્રમથી શરૂ થઈ હતી?', ref: 'જવાબ: ૧૨ માર્ચ ૧૯૩૦' },
    { label: 'પ્રશ્ન ૩: ભૂગોળ', text: 'નર્મદા નદીનું ઉદ્ગમ સ્થાન કઈ પર્વતમાળામાં આવેલું છે?', ref: 'જવાબ: અમરકંટક' },
    { label: 'પ્રશ્ન ૪: વિજ્ઞાન', text: 'માનવ શરીરમાં રક્તનું શુદ્ધિકરણ કયા મહત્વપૂર્ણ અંગમાં થાય છે?', ref: 'જવાબ: કિડની (મૂત્રપિંડ)' },
    { label: 'પ્રશ્ન ૫: અર્થતંત્ર', text: 'રિઝર્વ બેંક ઓફ ઇન્ડિયા (RBI) ની સ્થાપના કયા વર્ષમાં થઈ હતી?', ref: 'જવાબ: ૧ એપ્રિલ ૧૯૩૫' },
    { label: 'પ્રશ્ન ૬: અવકાશ', text: 'ઇસરોનું મુખ્યાલય ભારતના કયા મહાનગરમાં આવેલું છે?', ref: 'જવાબ: બેંગલુરુ' },
  ];

  return (
    <div className="h-full flex flex-col p-2 bg-white border-[3px] border-slate-900 box-border text-slate-900 font-sans select-none overflow-hidden space-y-0.5 justify-between">
      {/* ==================== 1. EDUCATION RUNNING HEADER & FOLIO ==================== */}
      <header className="shrink-0">
        <div className="flex items-center justify-between text-[7.5px] font-bold text-slate-800 border-b border-slate-300 pb-0.5 mb-0.5">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-950 uppercase">ગુજરાત પોસ્ટ</span>
            <span className="text-slate-400">•</span>
            <span className="text-[#B3121B] font-black uppercase">શિક્ષણ, કારકિર્દી & સ્પર્ધાત્મક ગઝેટ</span>
            <span className="text-slate-400">•</span>
            <span>{gujaratiDateStr}</span>
          </div>
          <div className="flex items-center gap-2 font-extrabold">
            <span>શિક્ષણ પૃષ્ઠ</span>
            <span>•</span>
            <span className="bg-[#B3121B] text-white px-1.5 py-0.2 rounded-xs text-[7px] font-black uppercase">
              પાનું ૧૧ / ૧૪
            </span>
            <span>•</span>
            <span>₹ ૧૫.૦૦</span>
          </div>
        </div>

        {/* Section Masthead Banner */}
        <div className="bg-slate-950 text-white px-2 py-0.5 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[8.5px] font-black uppercase tracking-wider rounded-xs flex items-center gap-1">
              <GraduationCap className="h-2.5 w-2.5" />
              <span>વિદ્યા દર્પણ • EDUCATION BROADSHEET</span>
            </span>
            <span className="text-slate-300 text-[8px] font-bold truncate">
              GPSC, UPSC, બોર્ડ પરીક્ષાઓ, યુનિવર્સિટી એડમિશન, વિદેશ અભ્યાસ અને સામાન્ય જ્ઞાન
            </span>
          </div>
          <div className="flex items-center gap-1 text-amber-300 text-[7.5px] font-extrabold shrink-0">
            <BookOpen className="h-2.5 w-2.5" />
            <span>શિક્ષણ & કારકિર્દી ડેસ્ક</span>
          </div>
        </div>

        {/* Exam Deadlines Strip */}
        <div className="grid grid-cols-4 gap-1 bg-slate-100 border-x border-b border-slate-300 p-0.5 text-[6.8px] font-bold text-slate-700">
          {examDeadlines.map((e, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-0.5 flex flex-col justify-between">
              <span className="text-slate-500 text-[6px] font-extrabold truncate">{e.exam}</span>
              <span className="text-[7.5px] font-black text-slate-950">{e.date}</span>
              <span className="text-[5.8px] text-[#B3121B] font-bold">{e.note}</span>
            </div>
          ))}
        </div>
      </header>

      {/* ==================== 2. UPPER EDUCATION GRID (8 COLS LEAD + 4 COLS BULLETIN) ==================== */}
      <section className="grid grid-cols-12 gap-2 border-b-2 border-slate-900 pb-0.5 pt-0.5 shrink-0 items-stretch">
        {/* Left 8 Columns: Dominant Lead Exam Strategy Story */}
        <div className="col-span-8 border-r-2 border-slate-900 pr-2 space-y-0.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[7px] font-bold text-slate-600 mb-0.2">
              <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[7px] font-black rounded-xs uppercase">
                સ્પર્ધાત્મક પરીક્ષા વિશેષ • સફળતા મંત્ર
              </span>
              <span>ગાંધીનગર સિવિલ સેન્ટર</span>
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
                <span className="text-[#B3121B] font-bold shrink-0 ml-1">► તૈયારી પ્લાન પાના ૧૨</span>
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
                  <span>• દૈનિક મોક ટેસ્ટ પ્લાનિંગ</span>
                  <span>• NCERT આધારિત વાંચન</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>• આન્સર રાઇટિંગ પ્રેક્ટિસ</span>
                  <span>• કરંટ અફેર્સ રિવિઝન</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Columns: 7 Fast Campus Bulletins */}
        <div className="col-span-4 flex flex-col justify-between space-y-0.5 bg-slate-50 p-1 border border-slate-300">
          <div className="flex items-center justify-between border-b border-slate-300 pb-0.5">
            <span className="bg-slate-900 text-amber-300 text-[7px] font-black px-1.5 py-0.2 rounded-xs uppercase">
              કેમ્પસ ડાયરી • 7 FAST UPDATES
            </span>
            <span className="text-[#B3121B] text-[6.5px] font-bold">શિક્ષણ લાઈવ</span>
          </div>

          <div className="space-y-0.5 flex-1 flex flex-col justify-between">
            {educationBulletin.map((item, idx) => (
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
            <span>શિક્ષણ બોર્ડ પોર્ટલ</span>
            <span className="text-[#B3121B]">► સંપૂર્ણ પરિણામ અપડેટ</span>
          </div>
        </div>
      </section>

      {/* ==================== 3. 2 PROMINENT SECONDARY EDUCATION STORIES (WITH PHOTOS) ==================== */}
      <section className="grid grid-cols-2 gap-2.5 border-b-2 border-slate-900 pb-0.5 pt-0.5 shrink-0">
        {/* Story 1 */}
        <div className="space-y-0.5 border-r border-slate-300 pr-2.5">
          <div className="flex items-center justify-between text-[7px] font-bold text-slate-500">
            <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[6.5px] font-black rounded-xs uppercase">
              {secEdu1.tag}
            </span>
            <span className="text-[#B3121B] font-bold">► NEP પોલિસી</span>
          </div>

          <h3 className="text-[10.5px] font-black leading-tight text-slate-950 line-clamp-1">
            {secEdu1.title}
          </h3>

          <div className="flex gap-2 items-start mt-0.5">
            <div className="w-[100px] shrink-0 space-y-0.5">
              <div className="w-[100px] h-[64px] overflow-hidden border border-slate-300 bg-slate-100">
                <img src={secEdu1.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                તસવીર: ગુજરાત પોસ્ટ
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between min-h-[64px] space-y-0.5">
              <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                {secEdu1.summary}
              </p>
              <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                <span className="text-slate-800 font-extrabold truncate">
                  {secEdu1.byline}
                </span>
                <span className="text-[#B3121B] font-black shrink-0">
                  વિગત પાના ૧૨ પર
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Story 2 */}
        <div className="space-y-0.5">
          <div className="flex items-center justify-between text-[7px] font-bold text-slate-500">
            <span className="bg-slate-900 text-white px-1.5 py-0.2 text-[6.5px] font-black rounded-xs uppercase">
              {secEdu2.tag}
            </span>
            <span className="text-[#B3121B] font-bold">► ગિફ્ટ કેમ્પસ</span>
          </div>

          <h3 className="text-[10.5px] font-black leading-tight text-slate-950 line-clamp-1">
            {secEdu2.title}
          </h3>

          <div className="flex gap-2 items-start mt-0.5">
            <div className="w-[100px] shrink-0 space-y-0.5">
              <div className="w-[100px] h-[64px] overflow-hidden border border-slate-300 bg-slate-100">
                <img src={secEdu2.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                તસવીર: ગુજરાત પોસ્ટ
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between min-h-[64px] space-y-0.5">
              <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                {secEdu2.summary}
              </p>
              <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                <span className="text-slate-800 font-extrabold truncate">
                  {secEdu2.byline}
                </span>
                <span className="text-[#B3121B] font-black shrink-0">
                  વિગત પાના ૧૨ પર
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
            <span>શાળા આધુનિકીકરણ & કૌશલ્ય ભારત સમીક્ષા (SCHOOLS & SKILL REVOLUTION)</span>
          </span>
          <span className="text-[6.5px] font-bold text-slate-600">૨૦,૦૦૦ સ્માર્ટ ક્લાસરૂમ્સ & ૧૫૦ ITI અપગ્રેડેશન</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Spotlight 1 */}
          <div className="space-y-0.5 border-r border-slate-300 pr-2.5">
            <div className="flex items-center justify-between text-[6.5px] font-bold">
              <span className="bg-indigo-800 text-white px-1.5 py-0.1 text-[6px] font-black rounded-xs uppercase">
                {spotEdu1.badge} • {spotEdu1.category}
              </span>
              <span className="text-[#B3121B] font-bold">► સ્માર્ટ સ્કૂલ નકશો</span>
            </div>

            <h4 className="text-[10px] font-black leading-tight text-slate-950 line-clamp-1">
              {spotEdu1.title}
            </h4>

            <div className="flex gap-2 items-start mt-0.5">
              <div className="w-[100px] shrink-0 space-y-0.5">
                <div className="w-[100px] h-[62px] overflow-hidden border border-slate-300 bg-slate-100">
                  <img src={spotEdu1.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
                </div>
                <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                  તસવીર: ગુજરાત પોસ્ટ
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between min-h-[62px] space-y-0.5">
                <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                  {spotEdu1.summary}
                </p>
                <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                  <span className="text-slate-800 font-extrabold truncate">
                    {spotEdu1.byline}
                  </span>
                  <span className="text-[#B3121B] font-black shrink-0">
                    નકશો પાના ૧૩
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Spotlight 2 */}
          <div className="space-y-0.5">
            <div className="flex items-center justify-between text-[6.5px] font-bold">
              <span className="bg-emerald-800 text-white px-1.5 py-0.1 text-[6px] font-black rounded-xs uppercase">
                {spotEdu2.badge} • {spotEdu2.category}
              </span>
              <span className="text-[#B3121B] font-bold">► સ્કિલ એડમિશન</span>
            </div>

            <h4 className="text-[10px] font-black leading-tight text-slate-950 line-clamp-1">
              {spotEdu2.title}
            </h4>

            <div className="flex gap-2 items-start mt-0.5">
              <div className="w-[100px] shrink-0 space-y-0.5">
                <div className="w-[100px] h-[62px] overflow-hidden border border-slate-300 bg-slate-100">
                  <img src={spotEdu2.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
                </div>
                <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                  તસવીર: ગુજરાત પોસ્ટ
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between min-h-[62px] space-y-0.5">
                <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                  {spotEdu2.summary}
                </p>
                <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                  <span className="text-slate-800 font-extrabold truncate">
                    {spotEdu2.byline}
                  </span>
                  <span className="text-[#B3121B] font-black shrink-0">
                    વિગત પાના ૧૩
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 5. 4-EDUCATION DOMAIN MATRIX (WITH PHOTOS) ==================== */}
      <section className="border-b-2 border-slate-900 pb-0.5 shrink-0">
        <div className="flex items-center justify-between text-[7px] font-black text-slate-950 mb-0.5 border-b border-slate-300 pb-0.2">
          <span className="bg-slate-900 text-white px-1 py-0.2 text-[6.5px] uppercase rounded-xs">
            શિક્ષણ ક્ષેત્ર દર્પણ • 4 DOMAIN MATRIX
          </span>
          <span className="text-slate-500 text-[6.5px]">GPSC / UPSC • JEE / NEET • બોર્ડ ૧૦ & ૧૨ • વિદેશ અભ્યાસ</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {/* Domain 1: Civil Services */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-[#B3121B] text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {civilServicesDomain.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={civilServicesDomain.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {civilServicesDomain.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► GPSC વિગત</span>
          </div>

          {/* Domain 2: Entrance */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-slate-900 text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {entranceExamsDomain.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={entranceExamsDomain.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {entranceExamsDomain.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► JEE/NEET વિગત</span>
          </div>

          {/* Domain 3: Boards */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-amber-700 text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {boardExamsDomain.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={boardExamsDomain.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {boardExamsDomain.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► બોર્ડ વિગત</span>
          </div>

          {/* Domain 4: Study Abroad */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-emerald-800 text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {studyAbroadDomain.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={studyAbroadDomain.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {studyAbroadDomain.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► વિદેશ વિગત</span>
          </div>
        </div>
      </section>

      {/* ==================== 6. 8 CAMPUS, CAREER & SKILL DIGEST GRID (2 ROWS OF 4 COLS) ==================== */}
      <section className="border-b-2 border-slate-900 pb-0.5 pt-0.2 shrink-0 space-y-0.5">
        <div className="flex items-center justify-between text-[7px] font-black text-slate-950 border-b border-slate-300 pb-0.2">
          <span className="bg-[#B3121B] text-white px-1 py-0.2 text-[6.5px] uppercase rounded-xs flex items-center gap-1">
            <Newspaper className="h-2 w-2" />
            <span>કેમ્પસ સંશોધન & કારકિર્દી ડાયરી (CAMPUS & CAREER DIGEST)</span>
          </span>
          <span className="text-slate-500 text-[6.2px]">શિક્ષણ અને કૌશલ્ય જગતના ૮ મહત્વપૂર્ણ અહેવાલો</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {educationGridStories.map((item, idx) => (
            <div
              key={idx}
              className={`space-y-0.5 ${idx % 4 !== 3 ? 'border-r border-slate-300 pr-1.5' : ''} ${idx >= 4 ? 'pt-0.5 border-t border-slate-200' : ''}`}
            >
              <div className="flex items-center justify-between text-[6.5px] font-bold text-slate-500">
                <span className="text-[#B3121B] font-black uppercase">[{item.tag}]</span>
                <span className="text-[5.8px] text-slate-400">વિદ્યા દર્પણ</span>
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

      {/* ==================== 7. GENERAL KNOWLEDGE QUIZ STRIP (6 COLUMNS) ==================== */}
      <section className="shrink-0 space-y-0.5 border-b border-slate-400 pb-0.5">
        <div className="flex items-center gap-1.5 border-b border-slate-300 pb-0.2">
          <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[7px] font-black uppercase rounded-xs">
            સામાન્ય જ્ઞાન & ક્વિઝ માસ્ટર • GK & QUIZ
          </span>
          <span className="text-[6.5px] text-slate-500 font-bold">સ્પર્ધાત્મક પરીક્ષાઓ માટે બંધારણ, ઇતિહાસ, ભૂગોળ અને વિજ્ઞાન સવાલ-જવાબ</span>
        </div>

        <div className="grid grid-cols-6 gap-1 pt-0.2">
          {gkQuizBriefs.map((brief, idx) => (
            <div key={idx} className={`space-y-0.5 ${idx < 5 ? 'border-r border-slate-300 pr-1' : ''}`}>
              <h5 className="text-[7.2px] font-black leading-tight text-slate-950 line-clamp-1 flex items-center gap-0.5">
                <span className="text-[#B3121B] font-black shrink-0">►</span>
                <span>{brief.label}</span>
              </h5>
              <p className="text-[6.2px] font-medium text-slate-700 leading-tight line-clamp-2 text-justify">
                {brief.text}
              </p>
              <div className="text-right text-[5.8px] font-bold text-emerald-700">
                {brief.ref}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== 8. GSEB, GPSC & EDUCATION NOTICE ==================== */}
      <section className="bg-slate-50 border border-dashed border-slate-400 p-0.5 rounded-xs flex items-center justify-between text-[6.5px] font-bold text-slate-700 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="bg-slate-900 text-amber-300 px-1 py-0.2 rounded-xs text-[6px] font-black uppercase">
            શિક્ષણ વિભાગ સત્તાવાર નોટિસ
          </span>
          <span>સરકારી શિષ્યવૃત્તિ, હોસ્ટેલ પ્રવેશ અને ઓનલાઇન સ્કોલરશીપ પોર્ટલ <strong>digitalgujarat.gov.in</strong> પર અરજી ચાલુ છે.</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <span>સત્તાવાર પોર્ટલ: <strong>gujarat.gov.in</strong></span>
          <span>•</span>
          <span className="text-[#B3121B] font-black flex items-center gap-0.5">
            <ShieldCheck className="h-2 w-2 text-emerald-600" />
            <span>શિક્ષણ ડેસ્ક</span>
          </span>
        </div>
      </section>

      {/* ==================== 9. BROADSHEET NEWSPAPER FOOTER ==================== */}
      <footer className="border-t border-slate-400 pt-0.5 pb-0.5 flex items-center justify-between text-[7px] font-bold text-slate-600 shrink-0">
        <div>
          <span>© ગુજરાત પોસ્ટ શિક્ષણ બ્યુરો • ગાંધીનગર સચિવાલય • અમદાવાદ • વડોદરા યુનિવર્સિટી</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#B3121B] font-black uppercase">WWW.GUJARATPOST.IN</span>
          <span>•</span>
          <span>પાનું ૧૧ / ૧૪</span>
        </div>
      </footer>
    </div>
  );
};

