'use client';

import React from 'react';
import { EPaperPageData, getCleanText, formatGujaratiDate, BroadsheetArticle } from '../types';
import { Feather, MessageSquare, BookOpen, Quote, Smile, ShieldCheck, PenTool, Lightbulb, MessageCircle, Flame, CheckCircle2, Newspaper } from 'lucide-react';

interface TemplateProps {
  data: EPaperPageData;
}

const cleanHeadline = (text?: string) => {
  if (!text) return '';
  return text.replace(/^#\d+\s*[-–—:]\s*/i, '').trim();
};

export const EditorialTemplate: React.FC<TemplateProps> = ({ data }) => {
  const {
    pageNumber = 13,
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

  // 1. Columnists Roster Strip
  const columnists = [
    { name: 'સુધીર પ્રજાપતિ', role: 'મુખ્ય તંત્રી', topic: 'લોકશાહી & શાસન નીતિ' },
    { name: 'પ્રો. નરેન્દ્ર વ્યાસ', role: 'રાજકીય વિશ્લેષક', topic: 'વિચાર મંથન • ટેકનોલોજી' },
    { name: 'ડો. કુમારપાળ દેસાઈ', role: 'સાહિત્યકાર', topic: 'સાંસ્કૃતિક ચિંતન & વારસો' },
    { name: 'અભય કુમાર', role: 'અર્થશાસ્ત્રી', topic: 'રાજ્ય અર્થતંત્ર & જીડીપી' },
  ];

  // 2. Lead Chief Editorial
  const editorialHeadline = cleanHeadline(
    leadArticle?.printHeadline ||
    leadArticle?.titleGu ||
    leadArticle?.title ||
    'મુખ્ય તંત્રીલેખ: લોકશાહીમાં નાગરિક જાગૃતિ, સંસદીય મૂલ્યો અને રચનાત્મક વિરોધ પક્ષનું અસ્તિત્વ'
  );

  const editorialSummary =
    leadArticle?.printSummary ||
    getCleanText(
      leadArticle?.excerptGu ||
        leadArticle?.excerpt ||
        leadArticle?.contentGu ||
        leadArticle?.content ||
        'કોઈપણ દેશ કે રાજ્યના સર્વાંગી વિકાસ માટે માત્ર આર્થિક આંકડાઓ પૂરતા નથી, પરંતુ પ્રજાના પાયાના અધિકારોનું રક્ષણ અને સામાજિક સદભાવ પણ અનિવાર્ય છે. શાસન વ્યવસ્થામાં પારદર્શિતા અને સામાન્ય માણસના પ્રશ્નો પ્રત્યે સંવેદનશીલતા એ જ સાચી લોકશાહીની કસોટી છે.',
      280
    );

  const editorialSecondParagraph = getCleanText(
    leadArticle?.contentGu ||
      leadArticle?.content ||
      'શિક્ષણ અને આરોગ્ય ક્ષેત્રે સરકારી રોકાણ વધારવું એ ભવિષ્યની પેઢી માટે શ્રેષ્ઠ ભેટ છે. સામાજિક અસમાનતા દૂર કરવા માટે દરેક વર્ગના સહકારથી નવી પહેલ જરૂરી છે અને રચનાત્મક ટીકાને હંમેશા આવકારવી જોઈએ.',
      260
  );

  // 3. Guest Op-Ed Feature
  const guestOpEd = {
    author: 'પ્રો. નરેન્દ્ર વ્યાસ (વિચાર મંથન)',
    title: cleanHeadline(pool[0]?.printHeadline || pool[0]?.titleGu || 'ટેકનોલોજી અને માનવ મૂલ્યો: આર્ટિફિશિયલ ઇન્ટેલિજન્સના યુગમાં માનવતાનું ભવિષ્ય'),
    image: pool[0]?.featuredImage || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=400&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[0]?.excerptGu || pool[0]?.contentGu || 'AI જેટલી ઝડપથી વિકસી રહ્યું છે તેટલી જ ઝડપે નૈતિક માળખું ઘડવું અનિવાર્ય છે. ટેકનોલોજી માનવતાના કલ્યાણ માટે હોવી જોઈએ, માનવ વિસ્થાપન માટે નહીં.', 240)
  };

  // 4. Secondary Critical Essays (2 prominent stories with photos)
  const secEdit1 = {
    title: cleanHeadline(pool[7]?.printHeadline || pool[7]?.titleGu || 'બંધારણીય મૂલ્યો અને સંઘીય માળખું: કેન્દ્ર અને રાજ્યો વચ્ચે સંકલનની અનિવાર્યતા'),
    image: pool[7]?.featuredImage || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[7]?.excerptGu || pool[7]?.contentGu || 'સહકારી સંઘવાદના સિદ્ધાંતોનું પાલન કરવાથી દેશના વિકાસને નવી ગતિ મળે છે. નીતિ આયોગ અને જીએસટી કાઉન્સિલ આ દિશામાં મહત્વના મંચ છે.', 240),
    tag: 'બંધારણીય ચિંતન',
    byline: 'ડો. કુમારપાળ દેસાઈ',
    art: pool[7]
  };

  const secEdit2 = {
    title: cleanHeadline(pool[8]?.printHeadline || pool[8]?.titleGu || 'ગુજરાતનો સાંસ્કૃતિક વારસો: ભાષા, સાહિત્ય અને સ્થાપત્ય કલાનું ઐતિહાસિક સંરક્ષણ'),
    image: pool[8]?.featuredImage || 'https://images.unsplash.com/photo-1596405835955-465de5c3dfb7?w=500&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[8]?.excerptGu || pool[8]?.contentGu || 'ગુજરાતી ભાષાના ગૌરવ અને પ્રાચીન ગ્રંથોના ડિજિટાઈઝેશનથી નવી પેઢી પોતાના સમૃદ્ધ મૂળિયાં સાથે જોડાયેલી રહેશે.', 240),
    tag: 'સાંસ્કૃતિક વારસો',
    byline: 'સાહિત્યિક પ્રતિનિધિ',
    art: pool[8]
  };

  // 5. Special In-Depth Spotlight (2 Ground Reports with Photos)
  const spotEdit1 = {
    title: cleanHeadline(pool[9]?.printHeadline || pool[9]?.titleGu || 'ગ્રામીણ અર્થતંત્ર & કૃષિ ચિંતન: ખેડૂતની આવક બમણી કરવા માટે ટકાઉ મોડેલની જરૂરિયાત'),
    image: pool[9]?.featuredImage || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[9]?.excerptGu || pool[9]?.contentGu || 'પાક સંગ્રહ ક્ષમતા, ફૂડ પ્રોસેસિંગ અને સીધા બજાર જોડાણથી ગ્રામીણ ક્ષેત્રમાં સ્થળાંતર રોકી શકાય છે અને સમૃદ્ધિ લાવી શકાય છે.', 240),
    badge: 'અર્થતંત્ર સમીક્ષા',
    category: 'કૃષિ વિશ્લેષણ',
    byline: 'અભય કુમાર (અર્થશાસ્ત્રી)',
    art: pool[9]
  };

  const spotEdit2 = {
    title: cleanHeadline(pool[10]?.printHeadline || pool[10]?.titleGu || 'શહેરીકરણ & પર્યાવરણ સંતુલન: સ્માર્ટ સિટીઝમાં ગ્રીન કવર અને જળ સંરક્ષણ પ્રાથમિકતા'),
    image: pool[10]?.featuredImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[10]?.excerptGu || pool[10]?.contentGu || 'કોંક્રીટના જંગલો વચ્ચે ઓક્સિજન પાર્ક્સ, તળાવોનું પુનર્જીવન અને પબ્લિક ટ્રાન્સપોર્ટ સુધારણા ભવિષ્યના શહેરો માટે સંજીવની છે.', 240),
    badge: 'પર્યાવરણ ચિંતન',
    category: 'શહેરી વિકાસ',
    byline: 'શહેરી નીતિ વિશ્લેષક',
    art: pool[10]
  };

  // 6. 4-Op-Ed Domain Matrix with photos
  const publicPolicyDomain = {
    title: 'જાહેર નીતિ & શાસન',
    img: pool[11]?.featuredImage || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'શાસન', title: cleanHeadline(pool[11]?.printHeadline || pool[11]?.titleGu || 'ઈ-ગવર્નન્સથી છેવાડાના માનવી સુધી લાભ પહોંચ્યો') },
      { loc: 'સંસદ', title: cleanHeadline(pool[12]?.printHeadline || pool[12]?.titleGu || 'ખરડાઓ પર ગહન ચર્ચા અને સંસદીય સમિતિઓની ભૂમિકા') },
      { loc: 'ન્યાય', title: cleanHeadline(pool[13]?.printHeadline || pool[13]?.titleGu || 'ન્યાયિક પ્રક્રિયામાં ઝડપ અને ટેકનોલોજીનો ઉપયોગ') },
    ]
  };

  const socialCultureDomain = {
    title: 'સમાજ & સંસ્કૃતિ',
    img: pool[14]?.featuredImage || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'પરંપરા', title: cleanHeadline(pool[14]?.printHeadline || pool[14]?.titleGu || 'સંયુક્ત કુટુંબ વ્યવસ્થા અને નૈતિક મૂલ્યોનું મહત્વ') },
      { loc: 'સાહિત્ય', title: cleanHeadline(pool[15]?.printHeadline || pool[15]?.titleGu || 'ગુજરાતી કવિતા અને નવલકથામાં લોકજીવનનું પ્રતિબિંબ') },
      { loc: 'કલા', title: cleanHeadline(pool[16]?.printHeadline || pool[16]?.titleGu || 'ગરબા અને લોકનૃત્યોની વૈશ્વિક સ્વીકૃતિ') },
    ]
  };

  const globalGeopoliticsDomain = {
    title: 'વૈશ્વિક પરિપ્રેક્ષ્ય',
    img: pool[17]?.featuredImage || 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'ગ્લોબલ', title: cleanHeadline(pool[17]?.printHeadline || pool[17]?.titleGu || 'બહુધ્રુવીય વિશ્વમાં ભારતની મુત્સદ્દીગીરીની સફળતા') },
      { loc: 'વેપાર', title: cleanHeadline(pool[18]?.printHeadline || pool[18]?.titleGu || 'સપ્લાય ચેઇનમાં આત્મનિર્ભરતાનું વધતું મહત્વ') },
      { loc: 'સુરક્ષા', title: cleanHeadline(pool[19]?.printHeadline || pool[19]?.titleGu || 'સાયબર સ્પેસમાં રાષ્ટ્રીય સુરક્ષાના નવા પડકારો') },
    ]
  };

  const readersForumDomain = {
    title: 'વાચકોનો અવાજ • પત્ર મંચ',
    img: pool[20]?.featuredImage || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'અમદાવાદ', title: cleanHeadline(pool[20]?.printHeadline || pool[20]?.titleGu || 'શહેરમાં ટ્રાફિક વ્યવસ્થા સુધારવા નાગરિક સૂચન') },
      { loc: 'રાજકોટ', title: cleanHeadline(pool[21]?.printHeadline || pool[21]?.titleGu || 'સરકારી હોસ્પિટલોમાં સુવિધાઓ વધારવા વાચક પત્ર') },
      { loc: 'સુરત', title: cleanHeadline(pool[22]?.printHeadline || pool[22]?.titleGu || 'શિક્ષણમાં માતૃભાષાના મહત્વ પર વિસ્તૃત પ્રતિભાવ') },
    ]
  };

  // 7. 8 Editorial Essays, Columnists & Perspectives Digest (2 Rows x 4 Cols)
  const editorialGridStories = [
    {
      title: cleanHeadline(pool[23]?.printHeadline || pool[23]?.titleGu || 'લોકશાહી અને મીડિયા: સ્વતંત્ર અખબારોની નૈતિક જવાબદારી'),
      image: pool[23]?.featuredImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=300&auto=format&fit=crop&q=80',
      summary: getCleanText(pool[23]?.excerptGu || pool[23]?.contentGu || 'ચોથી જાગીર તરીકે મીડિયાએ સત્તા સામે સત્ય બોલવાની હિંમત જાળવી રાખવી પડશે.', 120),
      tag: 'મીડિયા નૈતિકતા'
    },
    {
      title: cleanHeadline(pool[24]?.printHeadline || pool[24]?.titleGu || 'જળ સંકટ અને ભાવિ પેઢી: નર્મદા નીરનું વિવેકપૂર્ણ આયોજન'),
      image: pool[24]?.featuredImage || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=300&auto=format&fit=crop&q=80',
      summary: getCleanText(pool[24]?.excerptGu || pool[24]?.contentGu || 'પાણીના પ્રત્યેક ટીપાનો સંગ્રહ અને ભૂગર્ભ જળ રિચાર્જિંગ રાજ્યવ્યાપી જનઆંદોલન બનવું જોઈએ.', 120),
      tag: 'જળ સંરક્ષણ'
    },
    {
      title: cleanHeadline(pool[25]?.printHeadline || pool[25]?.titleGu || 'માનસિક સ્વાસ્થ્ય અને આધુનિક જીવનશૈલી: સામાજિક સંવાદ જરૂરી'),
      image: pool[25]?.featuredImage || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop&q=80',
      summary: getCleanText(pool[25]?.excerptGu || pool[25]?.contentGu || 'ડિજિટલ એકલતા અને તણાવ સામે લડવા પારિવારિક હૂંફ અને ખુલ્લા મનની ચર્ચાઓ અનિવાર્ય.', 120),
      tag: 'માનસિક સ્વાસ્થ્ય'
    },
    {
      title: cleanHeadline(pool[26]?.printHeadline || pool[26]?.titleGu || 'ભારતીય અવકાશ વિજ્ઞાન: ચંદ્રયાનથી ગગનયાન સુધીનો વૈજ્ઞાનિક પ્રવાસ'),
      image: pool[26]?.featuredImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&auto=format&fit=crop&q=80',
      summary: getCleanText(pool[26]?.excerptGu || pool[26]?.contentGu || 'સ્વદેશી ટેકનોલોજી અને વૈજ્ઞાનિકોની નિષ્ઠાથી વૈશ્વિક સ્તરે ભારતની પ્રતિષ્ઠા વધી.', 120),
      tag: 'વિજ્ઞાન ચિંતન'
    },
    {
      title: cleanHeadline(pool[27]?.printHeadline || pool[27]?.titleGu || 'સાહિત્ય અને સમાજ: ગુજરાતી નવલકથાઓમાં ગામડું અને નગર સંસ્કૃતિ'),
      image: pool[27]?.featuredImage || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=300&auto=format&fit=crop&q=80',
      summary: getCleanText(pool[27]?.excerptGu || pool[27]?.contentGu || 'પન્નાલાલ પટેલથી લઈને આધુનિક લેખકો સુધીના સાહિત્યિક પ્રવાહોનું ઊંડાણપૂર્વક વિશ્લેષણ.', 120),
      tag: 'સાહિત્ય'
    },
    {
      title: cleanHeadline(pool[28]?.printHeadline || pool[28]?.titleGu || 'ઊર્જા સંક્રમણ: સૌર અને પવન ઊર્જાથી સ્વચ્છ ભવિષ્યની દિશા'),
      image: pool[28]?.featuredImage || 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=300&auto=format&fit=crop&q=80',
      summary: getCleanText(pool[28]?.excerptGu || pool[28]?.contentGu || 'કાર્બન ઉત્સર્જન ઘટાડવા અને ગ્રીન હાઇડ્રોજન ક્ષેત્રે ગુજરાતે દેશને નવો માર્ગ બતાવ્યો.', 120),
      tag: 'ક્લાઈમેટ એક્શન'
    },
    {
      title: cleanHeadline(pool[29]?.printHeadline || pool[29]?.titleGu || 'યુવા પેઢી અને પુસ્તક સંસ્કૃતિ: ઈ-રીડિંગ સામે મુદ્રિત પુસ્તકોનો જાદુ'),
      image: pool[29]?.featuredImage || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&auto=format&fit=crop&q=80',
      summary: getCleanText(pool[29]?.excerptGu || pool[29]?.contentGu || 'સ્ક્રીન ટાઇમ ઘટાડીને પુસ્તક વાંચનની ટેવ કેળવવી એ બૌદ્ધિક વિકાસ માટે જરૂરી છે.', 120),
      tag: 'પુસ્તક વાચન'
    },
    {
      title: cleanHeadline(pool[30]?.printHeadline || pool[30]?.titleGu || 'ન્યાયિક સુધારા: સામાન્ય નાગરિકો માટે સસ્તો અને ઝડપી ન્યાય'),
      image: pool[30]?.featuredImage || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=300&auto=format&fit=crop&q=80',
      summary: getCleanText(pool[30]?.excerptGu || pool[30]?.contentGu || 'લોક અદાલતો અને ઈ-કોર્ટ્સ દ્વારા પેન્ડિંગ કેસોનો ત્વરિત નિકાલ લાવવાની દિશામાં પ્રગતિ.', 120),
      tag: 'ન્યાયિક પ્રક્રિયા'
    },
  ];

  // 8. Quotable Wisdom Strip (6 columns)
  const editorialWisdomBriefs = [
    { label: 'મહાત્મા ગાંધી', text: '“તમે જે પરિવર્તન દુનિયામાં જોવા માંગો છો, તે પહેલા તમારામાં લાવો.”', ref: 'વિચાર સૂત્ર' },
    { label: 'સરદાર પટેલ', text: '“કઠિન પરિશ્રમ વિના કોઈ રાષ્ટ્ર મહાન બની શકતું નથી.”', ref: 'રાષ્ટ્રીય મંત્ર' },
    { label: 'સ્વામી વિવેકાનંદ', text: '“ઊઠો, જાગો અને ધ્યેયપ્રાપ્તિ સુધી મંડ્યા રહો.”', ref: 'યુવા પ્રેરણા' },
    { label: 'રવીન્દ્રનાથ ટાગોર', text: '“જ્યાં મન ભયમુક્ત હોય અને મસ્તક ગર્વથી ઊંચું હોય.”', ref: 'સાહિત્ય રત્ન' },
    { label: 'ડો. આંબેડકર', text: '“શિક્ષિત બનો, સંગઠિત બનો અને સંઘર્ષ કરો.”', ref: 'સામાજિક ન્યાય' },
    { label: 'કવિ નર્મદ', text: '“જય જય ગરવી ગુજરાત, દીપે અરુણું પરભાત.”', ref: 'ગુજરાત ગૌરવ' },
  ];

  return (
    <div className="h-full flex flex-col p-2 bg-white border-[3px] border-slate-900 box-border text-slate-900 font-sans select-none overflow-hidden space-y-0.5 justify-between">
      {/* ==================== 1. EDITORIAL RUNNING HEADER & FOLIO ==================== */}
      <header className="shrink-0">
        <div className="flex items-center justify-between text-[7.5px] font-bold text-slate-800 border-b border-slate-300 pb-0.5 mb-0.5">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-950 uppercase">ગુજરાત પોસ્ટ</span>
            <span className="text-slate-400">•</span>
            <span className="text-[#B3121B] font-black uppercase">તંત્રીલેખ, વિચાર મંથન & વાચક મંચ</span>
            <span className="text-slate-400">•</span>
            <span>{gujaratiDateStr}</span>
          </div>
          <div className="flex items-center gap-2 font-extrabold">
            <span>સંપાદકીય પૃષ્ઠ</span>
            <span>•</span>
            <span className="bg-[#B3121B] text-white px-1.5 py-0.2 rounded-xs text-[7px] font-black uppercase">
              પાનું ૧૩ / ૧૪
            </span>
            <span>•</span>
            <span>₹ ૧૫.૦૦</span>
          </div>
        </div>

        {/* Section Masthead Banner */}
        <div className="bg-slate-950 text-white px-2 py-0.5 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[8.5px] font-black uppercase tracking-wider rounded-xs flex items-center gap-1">
              <Feather className="h-2.5 w-2.5" />
              <span>વિચાર દર્પણ • EDITORIAL BROADSHEET</span>
            </span>
            <span className="text-slate-300 text-[8px] font-bold truncate">
              મુખ્ય તંત્રીલેખ, ગંભીર વિશ્લેષણ, સાહિત્યિક ચિંતન, શાસન નીતિ અને પ્રજામત
            </span>
          </div>
          <div className="flex items-center gap-1 text-amber-300 text-[7.5px] font-extrabold shrink-0">
            <PenTool className="h-2.5 w-2.5" />
            <span>તંત્રી બોર્ડ</span>
          </div>
        </div>

        {/* Columnists Roster Strip */}
        <div className="grid grid-cols-4 gap-1 bg-slate-100 border-x border-b border-slate-300 p-0.5 text-[6.8px] font-bold text-slate-700">
          {columnists.map((c, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-0.5 flex flex-col justify-between">
              <span className="text-slate-500 text-[6px] font-extrabold truncate">{c.name} ({c.role})</span>
              <span className="text-[7.5px] font-black text-slate-950">{c.topic}</span>
              <span className="text-[5.8px] text-[#B3121B] font-bold">વિશેષ કોલમ</span>
            </div>
          ))}
        </div>
      </header>

      {/* ==================== 2. UPPER EDITORIAL DUAL LEAD (6 COLS CHIEF + 6 COLS OP-ED) ==================== */}
      <section className="grid grid-cols-12 gap-2 border-b-2 border-slate-900 pb-0.5 pt-0.5 shrink-0 items-stretch">
        {/* Left 6 Columns: Chief Editorial */}
        <div className="col-span-6 border-r-2 border-slate-900 pr-2 space-y-0.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[7px] font-bold text-slate-600 mb-0.2">
              <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[7px] font-black rounded-xs uppercase">
                મુખ્ય તંત્રીલેખ • સુધીર પ્રજાપતિ
              </span>
              <span>અમદાવાદ</span>
            </div>

            <h2 className="text-[14px] font-black leading-[1.15] text-slate-950 tracking-tight mt-0.5">
              {editorialHeadline}
            </h2>
          </div>

          <p className="text-[7.8px] font-semibold text-slate-800 leading-snug text-justify">
            <span className="float-left text-2xl font-black text-[#B3121B] mr-1 leading-none">કો</span>
            {editorialSummary}
          </p>

          <p className="text-[7.2px] font-medium text-slate-700 leading-snug pt-0.5 border-t border-dashed border-slate-200 text-justify">
            {editorialSecondParagraph}
          </p>

          <div className="bg-slate-50 border border-slate-300 p-0.5 text-[6.5px] font-bold text-slate-800 flex items-center justify-between">
            <span>સંપાદકીય મુદ્રાલેખ: <strong>સત્યમેવ જયતે</strong></span>
            <span className="text-[#B3121B]">► તંત્રી મંડળ</span>
          </div>
        </div>

        {/* Right 6 Columns: Guest Op-Ed Feature */}
        <div className="col-span-6 flex flex-col justify-between space-y-0.5 bg-slate-50 p-1 border border-slate-300">
          <div>
            <div className="flex items-center justify-between text-[7px] font-bold text-slate-600 mb-0.2">
              <span className="bg-slate-900 text-amber-300 px-1.5 py-0.2 text-[7px] font-black rounded-xs uppercase">
                {guestOpEd.author}
              </span>
              <span className="text-[#B3121B] font-bold">વિચાર મંથન</span>
            </div>

            <h3 className="text-[12.5px] font-black leading-tight text-slate-950 tracking-tight mt-0.5">
              {guestOpEd.title}
            </h3>
          </div>

          <div className="flex gap-2 items-start my-0.5">
            <div className="w-[85px] h-[64px] overflow-hidden border border-slate-300 bg-slate-100 shrink-0">
              <img src={guestOpEd.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
            </div>
            <p className="text-[7.5px] font-medium text-slate-800 leading-snug text-justify flex-1">
              {guestOpEd.summary}
            </p>
          </div>

          <span className="text-[6.2px] font-bold text-slate-500 border-t border-slate-200 pt-0.5 flex justify-between">
            <span>વિશેષ ચિંતન શ્રેણી</span>
            <span className="text-[#B3121B]">► સંપૂર્ણ લેખ પાના ૧૪</span>
          </span>
        </div>
      </section>

      {/* ==================== 3. 2 PROMINENT SECONDARY ESSAYS (WITH PHOTOS) ==================== */}
      <section className="grid grid-cols-2 gap-2.5 border-b-2 border-slate-900 pb-0.5 pt-0.5 shrink-0">
        {/* Essay 1 */}
        <div className="space-y-0.5 border-r border-slate-300 pr-2.5">
          <div className="flex items-center justify-between text-[7px] font-bold text-slate-500">
            <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[6.5px] font-black rounded-xs uppercase">
              {secEdit1.tag}
            </span>
            <span className="text-[#B3121B] font-bold">► બંધારણ વિશ્લેષણ</span>
          </div>

          <h3 className="text-[10.5px] font-black leading-tight text-slate-950 line-clamp-1">
            {secEdit1.title}
          </h3>

          <div className="flex gap-2 items-start mt-0.5">
            <div className="w-[100px] shrink-0 space-y-0.5">
              <div className="w-[100px] h-[64px] overflow-hidden border border-slate-300 bg-slate-100">
                <img src={secEdit1.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                તસવીર: ગુજરાત પોસ્ટ
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between min-h-[64px] space-y-0.5">
              <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                {secEdit1.summary}
              </p>
              <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                <span className="text-slate-800 font-extrabold truncate">
                  {secEdit1.byline}
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
              {secEdit2.tag}
            </span>
            <span className="text-[#B3121B] font-bold">► સાંસ્કૃતિક વારસો</span>
          </div>

          <h3 className="text-[10.5px] font-black leading-tight text-slate-950 line-clamp-1">
            {secEdit2.title}
          </h3>

          <div className="flex gap-2 items-start mt-0.5">
            <div className="w-[100px] shrink-0 space-y-0.5">
              <div className="w-[100px] h-[64px] overflow-hidden border border-slate-300 bg-slate-100">
                <img src={secEdit2.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                તસવીર: ગુજરાત પોસ્ટ
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between min-h-[64px] space-y-0.5">
              <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                {secEdit2.summary}
              </p>
              <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                <span className="text-slate-800 font-extrabold truncate">
                  {secEdit2.byline}
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
            <span>અર્થતંત્ર & શહેરી વિકાસ સમીક્ષા (ECONOMIC & URBAN PARADIGM)</span>
          </span>
          <span className="text-[6.5px] font-bold text-slate-600">કૃષિ આવક ટકાઉ મોડેલ & ગ્રીન સ્માર્ટ સિટીઝ</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Spotlight 1 */}
          <div className="space-y-0.5 border-r border-slate-300 pr-2.5">
            <div className="flex items-center justify-between text-[6.5px] font-bold">
              <span className="bg-indigo-800 text-white px-1.5 py-0.1 text-[6px] font-black rounded-xs uppercase">
                {spotEdit1.badge} • {spotEdit1.category}
              </span>
              <span className="text-[#B3121B] font-bold">► અર્થશાસ્ત્ર વિશ્લેષણ</span>
            </div>

            <h4 className="text-[10px] font-black leading-tight text-slate-950 line-clamp-1">
              {spotEdit1.title}
            </h4>

            <div className="flex gap-2 items-start mt-0.5">
              <div className="w-[100px] shrink-0 space-y-0.5">
                <div className="w-[100px] h-[62px] overflow-hidden border border-slate-300 bg-slate-100">
                  <img src={spotEdit1.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
                </div>
                <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                  તસવીર: ગુજરાત પોસ્ટ
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between min-h-[62px] space-y-0.5">
                <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                  {spotEdit1.summary}
                </p>
                <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                  <span className="text-slate-800 font-extrabold truncate">
                    {spotEdit1.byline}
                  </span>
                  <span className="text-[#B3121B] font-black shrink-0">
                    અહેવાલ પાના ૧૪
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Spotlight 2 */}
          <div className="space-y-0.5">
            <div className="flex items-center justify-between text-[6.5px] font-bold">
              <span className="bg-emerald-800 text-white px-1.5 py-0.1 text-[6px] font-black rounded-xs uppercase">
                {spotEdit2.badge} • {spotEdit2.category}
              </span>
              <span className="text-[#B3121B] font-bold">► સ્માર્ટ સિટી વિઝન</span>
            </div>

            <h4 className="text-[10px] font-black leading-tight text-slate-950 line-clamp-1">
              {spotEdit2.title}
            </h4>

            <div className="flex gap-2 items-start mt-0.5">
              <div className="w-[100px] shrink-0 space-y-0.5">
                <div className="w-[100px] h-[62px] overflow-hidden border border-slate-300 bg-slate-100">
                  <img src={spotEdit2.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
                </div>
                <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                  તસવીર: ગુજરાત પોસ્ટ
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between min-h-[62px] space-y-0.5">
                <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                  {spotEdit2.summary}
                </p>
                <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                  <span className="text-slate-800 font-extrabold truncate">
                    {spotEdit2.byline}
                  </span>
                  <span className="text-[#B3121B] font-black shrink-0">
                    સમીક્ષા પાના ૧૪
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 5. 4-OP-ED DOMAIN MATRIX (WITH PHOTOS) ==================== */}
      <section className="border-b-2 border-slate-900 pb-0.5 shrink-0">
        <div className="flex items-center justify-between text-[7px] font-black text-slate-950 mb-0.5 border-b border-slate-300 pb-0.2">
          <span className="bg-slate-900 text-white px-1 py-0.2 text-[6.5px] uppercase rounded-xs">
            વિચાર ક્ષેત્ર દર્પણ • 4 OP-ED MATRIX
          </span>
          <span className="text-slate-500 text-[6.5px]">જાહેર નીતિ • સમાજ & સંસ્કૃતિ • વૈશ્વિક પરિપ્રેક્ષ્ય • વાચકોનો અવાજ</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {/* Domain 1: Public Policy */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-[#B3121B] text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {publicPolicyDomain.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={publicPolicyDomain.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {publicPolicyDomain.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► નીતિ વિગત</span>
          </div>

          {/* Domain 2: Culture */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-slate-900 text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {socialCultureDomain.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={socialCultureDomain.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {socialCultureDomain.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► સંસ્કૃતિ વિગત</span>
          </div>

          {/* Domain 3: Geopolitics */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-amber-700 text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {globalGeopoliticsDomain.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={globalGeopoliticsDomain.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {globalGeopoliticsDomain.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► વૈશ્વિક વિગત</span>
          </div>

          {/* Domain 4: Readers */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-emerald-800 text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {readersForumDomain.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={readersForumDomain.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {readersForumDomain.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► પત્રો મોકલો</span>
          </div>
        </div>
      </section>

      {/* ==================== 6. 8 OP-ED & ESSAYS DIGEST GRID (2 ROWS OF 4 COLS) ==================== */}
      <section className="border-b-2 border-slate-900 pb-0.5 pt-0.2 shrink-0 space-y-0.5">
        <div className="flex items-center justify-between text-[7px] font-black text-slate-950 border-b border-slate-300 pb-0.2">
          <span className="bg-[#B3121B] text-white px-1 py-0.2 text-[6.5px] uppercase rounded-xs flex items-center gap-1">
            <Newspaper className="h-2 w-2" />
            <span>ચિંતન & વિશ્લેષણ ડાયરી (ESSAYS & OP-ED DIGEST)</span>
          </span>
          <span className="text-slate-500 text-[6.2px]">સમકાલીન વિષયો પર ૮ પ્રબુદ્ધ અભિપ્રાયો</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {editorialGridStories.map((item, idx) => (
            <div
              key={idx}
              className={`space-y-0.5 ${idx % 4 !== 3 ? 'border-r border-slate-300 pr-1.5' : ''} ${idx >= 4 ? 'pt-0.5 border-t border-slate-200' : ''}`}
            >
              <div className="flex items-center justify-between text-[6.5px] font-bold text-slate-500">
                <span className="text-[#B3121B] font-black uppercase">[{item.tag}]</span>
                <span className="text-[5.8px] text-slate-400">વિચાર દર્પણ</span>
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

      {/* ==================== 7. QUOTABLE WISDOM STRIP (6 COLUMNS) ==================== */}
      <section className="shrink-0 space-y-0.5 border-b border-slate-400 pb-0.5">
        <div className="flex items-center gap-1.5 border-b border-slate-300 pb-0.2">
          <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[7px] font-black uppercase rounded-xs">
            વિચાર મોતી & સુવાક્ય • QUOTABLE WISDOM
          </span>
          <span className="text-[6.5px] text-slate-500 font-bold">ગાંધીજી, સરદાર પટેલ, વિવેકાનંદ, ટાગોર, આંબેડકર અને કવિ નર્મદના અમૃત વિચારો</span>
        </div>

        <div className="grid grid-cols-6 gap-1 pt-0.2">
          {editorialWisdomBriefs.map((brief, idx) => (
            <div key={idx} className={`space-y-0.5 ${idx < 5 ? 'border-r border-slate-300 pr-1' : ''}`}>
              <h5 className="text-[7.2px] font-black leading-tight text-slate-950 line-clamp-1 flex items-center gap-0.5">
                <span className="text-[#B3121B] font-black shrink-0">►</span>
                <span>{brief.label}</span>
              </h5>
              <p className="text-[6.2px] font-medium text-slate-700 leading-tight line-clamp-2 text-justify italic">
                {brief.text}
              </p>
              <div className="text-right text-[5.8px] font-bold text-[#B3121B]">
                {brief.ref}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== 8. EDITORIAL FREEDOM & ETHICS DECLARATION ==================== */}
      <section className="bg-slate-50 border border-dashed border-slate-400 p-0.5 rounded-xs flex items-center justify-between text-[6.5px] font-bold text-slate-700 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="bg-slate-900 text-amber-300 px-1 py-0.2 rounded-xs text-[6px] font-black uppercase">
            તંત્રી વિભાગ જાહેર ઘોષણા
          </span>
          <span>ગુજરાત પોસ્ટ નિષ્પક્ષ, નિર્ભિક અને સચોટ પત્રકારત્વના સિદ્ધાંતો માટે કટિબદ્ધ છે. વાચકોના પત્રો editor@gujaratpost.in પર આવકાર્ય છે.</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <span>પ્રેસ કાઉન્સિલ આચારસંહિતા</span>
          <span>•</span>
          <span className="text-[#B3121B] font-black flex items-center gap-0.5">
            <ShieldCheck className="h-2 w-2 text-emerald-600" />
            <span>તંત્રી ડેસ્ક</span>
          </span>
        </div>
      </section>

      {/* ==================== 9. BROADSHEET NEWSPAPER FOOTER ==================== */}
      <footer className="border-t border-slate-400 pt-0.5 pb-0.5 flex items-center justify-between text-[7px] font-bold text-slate-600 shrink-0">
        <div>
          <span>© ગુજરાત પોસ્ટ તંત્રી વિભાગ • સંપાદક: સુધીર પ્રજાપતિ • અમદાવાદ • ગાંધીનગર • નવી દિલ્હી</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#B3121B] font-black uppercase">WWW.GUJARATPOST.IN</span>
          <span>•</span>
          <span>પાનું ૧૩ / ૧૪</span>
        </div>
      </footer>
    </div>
  );
};

