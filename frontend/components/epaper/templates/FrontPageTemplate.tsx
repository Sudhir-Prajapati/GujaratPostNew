'use client';

import React from 'react';
import { EPaperPageData, getCleanText, formatGujaratiDate, BroadsheetArticle } from '../types';
import { CloudSun, TrendingUp, Megaphone, ShieldCheck, Flame } from 'lucide-react';

interface TemplateProps {
  data: EPaperPageData;
}

export const FrontPageTemplate: React.FC<TemplateProps> = ({ data }) => {
  const {
    pageNumber = 1,
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
    gridArticles = [],
    bottomArticles = [],
  } = data;

  const displayCity = cityGu || city;
  const gujaratiDateStr = formatGujaratiDate(date) || 'મંગળવાર, ૧ સપ્ટેમ્બર, ૨૦૨૬';

  // Lead Story Data
  const leadHeadline =
    leadArticle?.printHeadline ||
    leadArticle?.titleGu ||
    leadArticle?.title ||
    'ગુજરાત સરકાર દ્વારા શહેરી અને ગ્રામીણ વિકાસ માટે ₹૨૫,૦૦૦ કરોડના મેગા પ્રોજેક્ટ્સની જાહેરાત';
  const leadImage =
    leadArticle?.featuredImage ||
    'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&auto=format&fit=crop&q=80';
  const leadCaption =
    leadArticle?.photoCredit || 'તસવીર: ગુજરાત પોસ્ટ • વિકાસનું નવું અધ્યાય: યોજનાઓ માટે ટાસ્ક ફોર્સ';
  const leadSummary =
    leadArticle?.printSummary ||
    getCleanText(
      leadArticle?.excerptGu ||
        leadArticle?.excerpt ||
        leadArticle?.contentGu ||
        leadArticle?.content ||
        'રાજ્યના તમામ મહાનગરો અને જિલ્લાઓમાં માળખાકીય સુવિધાઓ, રસ્તા અને જળ વ્યવસ્થાપન માટે ઐતિહાસિક ફાળવણી કરવામાં આવી છે. મુખ્યમંત્રીના અધ્યક્ષસ્થાને મળેલી ઉચ્ચસ્તરીય બેઠકમાં આ પ્રોજેક્ટ્સને તાકીદે મંજૂરી અપાઈ છે જેથી રાજ્યભરમાં વિકાસ કાર્યોને નવી ઊંચાઈ મળશે.',
      240
    );
  const leadSecondParagraph = getCleanText(
    leadArticle?.contentGu ||
      leadArticle?.content ||
      'આ યોજના હેઠળ રાજ્યના ૩૩ જિલ્લાઓમાં ગ્રામીણ રસ્તાઓનું નવીનીકરણ, પીવાના શુદ્ધ પાણીનું વિતરણ, આરોગ્ય સબસેન્ટર્સ અને આધુનિક શાળાઓનું નિર્માણ કરાશે. તમામ પ્રોજેક્ટ્સની પ્રગતિનું રિયલ-ટાઇમ મોનિટરિંગ કરવામાં આવશે જેથી સમયસર લક્ષ્યાંક સિદ્ધ થઈ શકે.',
    240
  );
  const leadLocation = leadArticle?.location || 'ગાંધીનગર';

  // Articles Pool from Real Database / Props
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
    ...bottomArticles,
  ].filter(Boolean) as BroadsheetArticle[];

  // 1. Right-Side News Column (7 compact stories)
  const rightColumnStories = [
    {
      category: 'રાષ્ટ્રીય',
      pageRef: 'પાના ૦૪ પર',
      defaultTitle: 'નવી શિક્ષણ નીતિ અંતર્ગત દેશભરમાં મોટા સુધારાની જાહેરાત',
      defaultSummary: 'કેન્દ્ર સરકારે ડિજિટલ શિક્ષણ અને વ્યવસાયિક તાલીમ માટે નવા પ્રોજેક્ટ્સને મંજૂરી આપી.',
      art: pool[0],
    },
    {
      category: displayCity,
      pageRef: 'પાના ૦૨ પર',
      defaultTitle: 'શહેરમાં ₹૧,૨૦૦ કરોડના ઈન્ફ્રાસ્ટ્રક્ચર અને ફ્લાયઓવર કામો તેજ',
      defaultSummary: 'મ્યુનિસિપલ કોર્પોરેશન દ્વારા ટ્રાફિક વ્યવસ્થા સુધારવા નવા બ્રિજ પ્રોજેક્ટ્સ શરૂ.',
      art: pool[1],
    },
    {
      category: 'ગુજરાત',
      pageRef: 'પાના ૦૩ પર',
      defaultTitle: 'કૃષિ પાક વીમા યોજના માટે વિશેષ આર્થિક સહાય પેકેજ મંજૂર',
      defaultSummary: 'રાજ્યના લાખો ખેડૂતોને કમોસમી વરસાદ સામે રક્ષણ આપવા સરકારે પેકેજ જાહેર કર્યું.',
      art: pool[2],
    },
    {
      category: 'બિઝનેસ',
      pageRef: 'પાના ૦૬ પર',
      defaultTitle: 'શેરબજારમાં વિક્રમી તેજી: સેન્સેક્સ અને નિફ્ટી નવી ઊંચાઈએ',
      defaultSummary: 'સ્થાનિક અને વિદેશી સંસ્થાગત રોકાણકારોની જોરદાર લેવાલીથી માર્કેટમાં ઉછાળો.',
      art: pool[3],
    },
    {
      category: 'વિશ્વ',
      pageRef: 'પાના ૦૫ પર',
      defaultTitle: 'આંતરરાષ્ટ્રીય સમિટમાં વેપાર અને સંરક્ષણ સમજૂતી પર હસ્તાક્ષર',
      defaultSummary: 'વૈશ્વિક મંચ પર ભારતના પ્રસ્તાવને અગ્રણી દેશો દ્વારા વ્યાપક સમર્થન પ્રાપ્ત થયું.',
      art: pool[4],
    },
    {
      category: 'ટેકનોલોજી',
      pageRef: 'પાના ૦૮ પર',
      defaultTitle: 'AI ટેકનોલોજી મિશન હેઠળ ₹૧૦,૦૦ કરોડનું રાષ્ટ્રીય રોકાણ',
      defaultSummary: 'ડિજિટલ ઈન્ડિયા પ્રોજેક્ટ અંતર્ગત નવા સ્ટાર્ટઅપ્સ માટે ખાસ ઈન્સેન્ટિવ સ્કીમ.',
      art: pool[5],
    },
    {
      category: 'પર્યાવરણ',
      pageRef: 'પાના ૧૦ પર',
      defaultTitle: 'ગુજરાતમાં સોલાર & રિન્યુએબલ એનર્જી ક્ષમતામાં ૨૫% વૃદ્ધિ',
      defaultSummary: 'રાજ્યમાં ગ્રીન એનર્જી પ્રોજેક્ટ્સ ઝડપથી પૂર્ણ કરવા વિશેષ સબસિડી પોલિસી જાહેર.',
      art: pool[6],
    },
  ];

  // 2. Secondary Feature Stories (2 prominent stories with medium photos)
  const secondaryStories = [
    {
      category: 'પ્રાદેશિક વિશેષ',
      pageRef: 'પાના ૦૩ પર',
      defaultTitle: 'સૌરાષ્ટ્ર અને ઉત્તર ગુજરાતમાં સિંચાઈ યોજનાઓનું વ્યાપક વિસ્તરણ',
      defaultSummary: 'જળ સંસાધન વિભાગ દ્વારા ડેમ આધારિત નવી પાઇપલાઇન પ્રોજેક્ટ્સને લીલી ઝંડી આપવામાં આવી છે જેથી લાખો ખેડૂતોને સીધો લાભ મળશે. પીવાના પાણી અને ખેતી માટે પર્યાપ્ત જથ્થો ઉપલબ્ધ થશે.',
      defaultImage: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&auto=format&fit=crop&q=80',
      art: pool[7],
    },
    {
      category: 'રાષ્ટ્રીય રાજકારણ',
      pageRef: 'પાના ૦૪ પર',
      defaultTitle: 'સંસદના ચોમાસુ સત્ર પૂર્વે સર્વપક્ષીય બેઠક: મહત્વના બિલો રજૂ થશે',
      defaultSummary: 'કેન્દ્ર સરકાર દ્વારા આગામી સત્રમાં આર્થિક અને શાસકીય સુધારાઓને લગતા મહત્વના ખરડા રજૂ કરવાની તૈયારી. તમામ રાજકીય પક્ષો સાથે સકારાત્મક ચર્ચા વિચારણા હાથ ધરાશે.',
      defaultImage: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=400&auto=format&fit=crop&q=80',
      art: pool[8],
    },
  ];

  // 3. Special In-Depth Spotlight Row (2 Detailed Ground-Report Stories)
  const spotlightStories = [
    {
      category: 'ગ્રાઉન્ડ રિપોર્ટ',
      badge: 'વિશેષ અહેવાલ',
      pageRef: 'પાના ૦૫ પર',
      defaultTitle: 'ગુજરાતના બંદરો અને લોજિસ્ટિક્સ સેક્ટરમાં ₹૧૫,૦૦૦ કરોડનું નવું રોકાણ',
      defaultSummary: 'રાજ્યના સાગરકાંઠા વિસ્તારમાં આધુનિક કાર્ગો ટર્મિનલ અને ડેડિકેટેડ ફ્રેઇટ કોરિડોરના નિર્માણથી નિકાસ વેપારમાં મોટો ઉછાળો આવશે. નવા ઔદ્યોગિક પાર્ક્સની પણ સ્થાપના થશે.',
      defaultImage: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=400&auto=format&fit=crop&q=80',
      art: pool[9],
    },
    {
      category: 'રાજ્ય સમીક્ષા',
      badge: 'નીતિ વિશ્લેષણ',
      pageRef: 'પાના ૦૬ પર',
      defaultTitle: 'ગામડાઓમાં ૨૪ કલાક થ્રી-ફેઝ વીજળી અને ડિજિટલ સેવા કેન્દ્રોનું વિસ્તરણ',
      defaultSummary: 'ઊર્જા વિભાગ દ્વારા રાજ્યના ૧૮,૦૦૦થી વધુ ગામોમાં સ્માર્ટ મીટરિંગ અને હાઇ-સ્પીડ ફાઇબર નેટવર્ક પહોંચાડવાની કામગીરી પૂર્ણતાના આરે છે. ગ્રામીણ અર્થતંત્રને નવો વેગ મળશે.',
      defaultImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&auto=format&fit=crop&q=80',
      art: pool[10],
    },
  ];

  // 4. Category Stories Grid (4 Rows of 4 Stories = 16 Stories)
  const categoryGridStories = [
    // Row 1
    {
      category: 'રાજકારણ',
      pageRef: 'પાના ૦૪ પર',
      defaultTitle: 'વિધાનસભા સત્રની તારીખો જાહેર',
      defaultSummary: 'આગામી સત્રમાં જનહિતના પ્રશ્નો અને વિકાસ યોજનાઓ પર વિસ્તૃત ચર્ચા થશે.',
      defaultImage: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=300&auto=format&fit=crop&q=80',
      art: pool[11],
    },
    {
      category: 'દેશ',
      pageRef: 'પાના ૦૪ પર',
      defaultTitle: 'મોંઘવારી દરમાં નોંધપાત્ર નરમાઈ',
      defaultSummary: 'અનાજ અને કઠોળના ભાવમાં સ્થિરતા આવતા સામાન્ય નાગરિકોને રાહત મળી.',
      defaultImage: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=300&auto=format&fit=crop&q=80',
      art: pool[12],
    },
    {
      category: 'વિશ્વ',
      pageRef: 'પાના ૦૫ પર',
      defaultTitle: 'વૈશ્વિક શાંતિ મંત્રણાઓને વેગ',
      defaultSummary: 'સંયુક્ત રાષ્ટ્ર પરિષદમાં પર્યાવરણ અને સરહદી સુરક્ષા અંગે મહત્વના નિર્ણયો.',
      defaultImage: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=300&auto=format&fit=crop&q=80',
      art: pool[13],
    },
    {
      category: 'ટેકનોલોજી',
      pageRef: 'પાના ૦૮ પર',
      defaultTitle: 'નવી સેમિકન્ડક્ટર નીતિ જાહેર',
      defaultSummary: 'ગુજરાતમાં નવા ચિપ પ્લાન્ટ સ્થાપવા માટે બહુરાષ્ટ્રીય કંપનીઓ સાથે કરાર.',
      defaultImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=300&auto=format&fit=crop&q=80',
      art: pool[14],
    },
    // Row 2
    {
      category: 'બિઝનેસ',
      pageRef: 'પાના ૦૬ પર',
      defaultTitle: 'કોર્પોરેટ પરિણામોમાં મજબૂત નફો',
      defaultSummary: 'બેંકિંગ અને ઓટોમોબાઇલ ક્ષેત્રની કંપનીઓએ ત્રિમાસિક પરિણામોમાં સારો દેખાવ કર્યો.',
      defaultImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&auto=format&fit=crop&q=80',
      art: pool[15],
    },
    {
      category: 'સ્પોર્ટ્સ',
      pageRef: 'પાના ૦૭ પર',
      defaultTitle: 'એશિયા કપમાં ભારતની ભવ્ય જીત',
      defaultSummary: 'ભારતીય બોલરો અને બેટ્સમેનોના શાનદાર પ્રદર્શનથી ટીમ ઈન્ડિયાનો વિજય.',
      defaultImage: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=300&auto=format&fit=crop&q=80',
      art: pool[16],
    },
    {
      category: 'સિનેમા',
      pageRef: 'પાના ૦૯ પર',
      defaultTitle: 'ગુજરાતી ફિલ્મો બોક્સ ઓફિસ પર હિટ',
      defaultSummary: 'નવી પારિવારિક ફિલ્મોને દર્શકો તરફથી અભૂતપૂર્વ પ્રતિસાદ મળી રહ્યો છે.',
      defaultImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&auto=format&fit=crop&q=80',
      art: pool[17],
    },
    {
      category: 'લાઇફસ્ટાઇલ',
      pageRef: 'પાના ૧૦ પર',
      defaultTitle: 'તંદુરસ્ત જીવનશૈલી માટે આયુર્વેદ & યોગ',
      defaultSummary: 'રોજિંદા જીવનમાં સંતુલિત આહાર અને પ્રાણાયામ અપનાવવાથી આરોગ્ય સારું રહે છે.',
      defaultImage: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=300&auto=format&fit=crop&q=80',
      art: pool[18],
    },
    // Row 3
    {
      category: 'સૌરાષ્ટ્ર વિશેષ',
      pageRef: 'પાના ૦૩ પર',
      defaultTitle: 'રાજકોટ-જામનગર હાઈવે વિસ્તરણ',
      defaultSummary: 'સૌરાષ્ટ્રના ઔદ્યોગિક કોરિડોરને જોડતા નવા ૬-લેન પ્રોજેક્ટનું ખાતમુહૂર્ત સંપન્ન.',
      defaultImage: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=300&auto=format&fit=crop&q=80',
      art: pool[19],
    },
    {
      category: 'ઉત્તર ગુજરાત',
      pageRef: 'પાના ૦૪ પર',
      defaultTitle: 'મહેસાણા-પાટણમાં સૌર ઉર્જા પ્લાન્ટ',
      defaultSummary: 'ગ્રીન એનર્જી ક્ષેત્રે ઉત્તર ગુજરાત મોડેલ હબ તરીકે વિકસી રહ્યું છે.',
      defaultImage: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=300&auto=format&fit=crop&q=80',
      art: pool[20],
    },
    {
      category: 'શિક્ષણ & કારકિર્દી',
      pageRef: 'પાના ૧૧ પર',
      defaultTitle: 'યુનિવર્સિટીઓમાં નવી ડિગ્રી સ્કીમ',
      defaultSummary: 'વિદ્યાર્થીઓને ઉદ્યોગલક્ષી રોજગારી તાલીમ આપવા માટે નવીન અભ્યાસક્રમો શરૂ.',
      defaultImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=300&auto=format&fit=crop&q=80',
      art: pool[21],
    },
    {
      category: 'સાયન્સ & સ્પેસ',
      pageRef: 'પાના ૧૨ પર',
      defaultTitle: 'ઈસરોનું નવું સેટેલાઇટ મિશન સફળ',
      defaultSummary: 'હવામાન અને નેવિગેશન ક્ષમતા સુધારવા માટે નવો ઉપગ્રહ કક્ષામાં સફળતાપૂર્વક સ્થાપિત.',
      defaultImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&auto=format&fit=crop&q=80',
      art: pool[22],
    },
    // Row 4 (New Row - 4 More Articles)
    {
      category: 'કૃષિ વિકાસ',
      pageRef: 'પાના ૦૩ પર',
      defaultTitle: 'ડ્રીપ ઇરિગેશન પર ૮૦% સરકારી સબસિડી',
      defaultSummary: 'પાક ઉત્પાદન વધારવા અને પાણીની બચત કરવા રાજ્યભરના ખેડૂતો માટે વિશેષ પ્રોત્સાહક યોજના.',
      defaultImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=300&auto=format&fit=crop&q=80',
      art: pool[23],
    },
    {
      category: 'આરોગ્ય દર્પણ',
      pageRef: 'પાના ૧૦ પર',
      defaultTitle: 'નવી સુપર સ્પેશિયાલિટી હોસ્પિટલ મંજૂર',
      defaultSummary: 'જિલ્લા કક્ષાએ અદ્યતન કાર્ડિયાક અને કેન્સર સારવાર કેન્દ્રો શરૂ કરવાની કામગીરી તેજ.',
      defaultImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=300&auto=format&fit=crop&q=80',
      art: pool[24],
    },
    {
      category: 'ક્રાઇમ બ્યુરો',
      pageRef: 'પાના ૧૧ પર',
      defaultTitle: 'ડિજિટલ સિક્યોરિટી એલર્ટ જાહેર',
      defaultSummary: 'ઓનલાઈન બેંકિંગ ટ્રાન્ઝેક્શનમાં સાવચેતી રાખવા રાજ્ય સાયબર સેલની માર્ગદર્શિકા.',
      defaultImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=300&auto=format&fit=crop&q=80',
      art: pool[25],
    },
    {
      category: 'દક્ષિણ ગુજરાત',
      pageRef: 'પાના ૦૫ પર',
      defaultTitle: 'સુરત-નવસારી ટેક્સટાઇલ પાર્ક મંજૂર',
      defaultSummary: 'કાપડ ઉદ્યોગને વૈશ્વિક સ્તરે સ્પર્ધાત્મક બનાવવા આધુનિક પ્રોસેસિંગ હબ તૈયાર થશે.',
      defaultImage: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=300&auto=format&fit=crop&q=80',
      art: pool[26],
    },
  ];

  // 5. News Briefs at bottom (6 columns)
  const briefItems = [
    {
      headline: 'શહેરમાં વાદળછાયું વાતાવરણ રહેશે',
      summary: 'હવામાન વિભાગની આગાહી મુજબ આગામી બે દિવસમાં હળવા ઝાપટાંની સંભાવના.',
      pageNo: 'પાના: ૦૨',
    },
    {
      headline: 'પેટ્રોલ-ડીઝલના ભાવમાં સ્થિરતા',
      summary: 'આંતરરાષ્ટ્રીય ક્રૂડના ભાવો વચ્ચે સ્થાનિક બજારમાં ઈંધણના દરો યથાવત રહ્યા.',
      pageNo: 'પાના: ૦૬',
    },
    {
      headline: 'GPSC ભરતી પ્રક્રિયા માટે નોટિફિકેશન',
      summary: 'વર્ગ-૧ અને ૨ની વિવિધ જગ્યાઓ માટે ઓનલાઈન અરજી કરવાનો પ્રારંભ થયો.',
      pageNo: 'પાના: ૧૨',
    },
    {
      headline: 'સોના-ચાંદીના ભાવમાં નવો ઉછાળો',
      summary: 'લગ્નસરાની માંગ અને વૈશ્વિક સંકેતોને પગલે કિંમતી ધાતુઓમાં તેજી જોવા મળી.',
      pageNo: 'પાના: ૦૬',
    },
    {
      headline: 'શિક્ષકો માટે રાજ્યવ્યાપી તાલીમ સત્ર',
      summary: 'શિક્ષણની ગુણવત્તા સુધારવા સમગ્ર રાજ્યમાં ૫ દિવસીય પ્રશિક્ષણ કાર્યક્રમ.',
      pageNo: 'પાના: ૧૧',
    },
    {
      headline: 'રેલવે દ્વારા વિશેષ ટ્રેનોની જાહેરાત',
      summary: 'તહેવારોની મોસમમાં મુસાફરોની સુવિધા માટે વિશેષ એક્સપ્રેસ ટ્રેનો દોડાવાશે.',
      pageNo: 'પાના: ૦૭',
    },
  ];

  return (
    <div className="h-full flex flex-col p-2 bg-white border-[3px] border-slate-900 box-border text-slate-900 font-sans select-none overflow-hidden space-y-0.5 justify-between">
      {/* ==================== 1. AUTHENTIC BROADSHEET MASTHEAD ==================== */}
      <header className="shrink-0">
        {/* Topmost Hairline Strip */}
        <div className="flex items-center justify-between text-[7.5px] font-bold text-slate-800 border-b border-slate-300 pb-0.5 mb-0.5">
          <div className="flex items-center gap-2">
            <span className="bg-[#B3121B] text-white px-1.5 py-0.2 rounded-xs text-[7px] font-black uppercase">
              દૈનિક અખબાર
            </span>
            <span>{gujaratiDateStr}</span>
          </div>
          <div className="flex items-center gap-2 font-extrabold">
            <span className="uppercase text-[#B3121B]">{displayCity.toUpperCase()} EDITION</span>
            <span>•</span>
            <span>પાનું ૧</span>
            <span>•</span>
            <span>₹ ૧૫.૦૦</span>
          </div>
        </div>

        {/* Main Logo Strip */}
        <div className="flex items-center justify-between py-0.5 px-0.5">
          <div className="text-left w-1/4">
            <div className="text-[7.5px] font-extrabold uppercase text-slate-600">
              VOLUME 14 • ISSUE 248
            </div>
            <div className="text-[8.5px] font-black text-[#B3121B] mt-0.2">
              મુખપૃષ્ઠ • FRONT PAGE
            </div>
          </div>

          {/* Central Logo */}
          <div className="text-center flex-1">
            <h1 className="text-[35px] font-black tracking-tight leading-none flex items-center justify-center gap-1.5">
              <span className="text-slate-950 font-black">ગુજરાત</span>
              <span className="text-[#B3121B] font-black">પોસ્ટ</span>
            </h1>
            <p className="text-[7px] font-bold text-slate-600 uppercase tracking-[0.22em] mt-0.5 border-t border-slate-300 pt-0.2 inline-block">
              THE VOICE OF GUJARAT • WWW.GUJARATPOST.COM
            </p>
          </div>

          <div className="text-right w-1/4">
            <span className="inline-block border border-slate-800 rounded px-1.5 py-0.2 text-[7.5px] font-extrabold text-slate-800 uppercase">
              E-PAPER EDITION
            </span>
            <div className="text-[7px] font-bold text-slate-500 mt-0.2">
              સંસ્કરણ: {date || '2026-09-01'}
            </div>
          </div>
        </div>

        {/* Red Breaking / Section Banner */}
        <div className="mt-0.5 bg-[#B3121B] text-white px-2 py-0.5 flex items-center justify-between text-[8px] font-black">
          <span className="flex items-center gap-1">
            <span className="text-amber-300">🎯</span>
            <span>મુખ્ય સમાચાર, સચોટ વિશ્લેષણ, ઝડપી અહેવાલ</span>
          </span>
          <span className="text-amber-200 uppercase tracking-wider">
            {displayCity.toUpperCase()} • સત્ય અને સચોટ સમાચાર
          </span>
        </div>
      </header>

      {/* ==================== 2. UPPER EDITORIAL GRID (LEAD 8 COLS + QUICK NEWS 4 COLS) ==================== */}
      <section className="grid grid-cols-12 gap-2 border-b-2 border-slate-900 pb-1 pt-0.5 shrink-0 items-stretch">
        {/* Left 8 Columns: Dominant Lead Story (Tight spacing, NO GAP after title, perfectly leveled) */}
        <div className="col-span-8 border-r-2 border-slate-900 pr-2 space-y-0.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[7.5px] font-bold text-slate-600 mb-0.2">
              <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[7.5px] font-black rounded-xs uppercase">
                મુખ્ય સમાચાર
              </span>
              <span>અમદાવાદ, ગાંધીનગર • વિશેષ પ્રતિનિધિ</span>
            </div>

            <h2 className="text-[19.5px] font-black leading-[1.14] text-slate-950 tracking-tight mt-0.5">
              {leadHeadline}
            </h2>
          </div>

          <div className="grid grid-cols-12 gap-2 items-stretch mt-0.5 flex-1">
            {/* Lead Photo (7 cols of lead) */}
            <div className="col-span-7 flex flex-col justify-between space-y-0.5">
              <div className="w-full h-[155px] overflow-hidden border border-slate-300 bg-slate-100">
                <img src={leadImage} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="flex items-center justify-between text-[6.8px] font-semibold text-slate-600 pt-0.2">
                <span className="italic truncate">{leadCaption}</span>
                <span className="text-[#B3121B] font-bold shrink-0 ml-1">► વિગત પાના ૦૩ પર</span>
              </div>
            </div>

            {/* Lead Story Text (5 cols of lead - Rich, Multi-Paragraph & Fully Leveled) */}
            <div className="col-span-5 flex flex-col justify-between text-justify space-y-0.5">
              <div>
                <p className="text-[8.5px] font-semibold text-slate-800 leading-[1.3]">
                  <span className="float-left text-2xl font-black text-[#B3121B] mr-1 leading-none">{leadLocation.charAt(0)}</span>
                  <strong>{leadLocation}: </strong>
                  {leadSummary}
                </p>

                <p className="text-[7.8px] font-medium text-slate-700 leading-snug pt-0.5 mt-0.5 border-t border-dashed border-slate-300">
                  {leadSecondParagraph}
                </p>
              </div>

              <div className="space-y-0.5 pt-0.5 border-t border-slate-200 text-[6.8px] font-bold text-slate-900">
                <div className="flex items-start gap-1">
                  <span className="text-[#B3121B] shrink-0 font-black">►</span>
                  <span><strong>૩૩ જિલ્લાઓમાં વિકાસ:</strong> રસ્તા, ડ્રેનેજ, શુદ્ધ પેયજળ અને આરોગ્ય ક્ષેત્રે મોટું રોકાણ.</span>
                </div>
                <div className="flex items-start gap-1">
                  <span className="text-[#B3121B] shrink-0 font-black">►</span>
                  <span><strong>સમયસર પૂર્ણતા:</strong> ઝડપી પ્રગતિ માટે સચિવ સ્તરે ટાસ્ક ફોર્સની રચના.</span>
                </div>
                <div className="flex items-start gap-1">
                  <span className="text-[#B3121B] shrink-0 font-black">►</span>
                  <span><strong>રોજગારી સર્જન:</strong> ગ્રામીણ અને શહેરી સ્તરે નવી રોજગારીની તકો ઊભી થશે.</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-300 p-0.5 text-[6.5px] font-bold text-slate-800 flex items-center justify-between">
                <span>બજેટ: <strong>₹૨૫,૦૦૦ કરોડ</strong> • સમયગાળો: <strong>૩ વર્ષ</strong></span>
                <span className="text-[#B3121B] font-extrabold uppercase">► વિગત પાના ૦૩ પર</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Columns: "આજના મહત્વના સમાચાર" / QUICK NEWS COLUMN (7 STORIES) */}
        <div className="col-span-4 flex flex-col justify-between space-y-0.5">
          <div className="border-b-2 border-slate-900 pb-0.2">
            <span className="text-[8.5px] font-black uppercase text-[#B3121B] tracking-wide block">
              આજના મહત્વના સમાચાર (QUICK NEWS)
            </span>
          </div>

          <div className="space-y-0.5 flex-1 flex flex-col justify-between">
            {rightColumnStories.map((item, idx) => {
              const headline = item.art?.printHeadline || item.art?.titleGu || item.art?.title || item.defaultTitle;
              const summary = item.art?.printSummary || getCleanText(item.art?.contentGu || item.art?.content || item.defaultSummary, 65);

              return (
                <div key={idx} className="border-b border-dashed border-slate-300 pb-0.5 last:border-b-0 last:pb-0">
                  <div className="flex items-center justify-between text-[6.5px] font-bold text-slate-500">
                    <span className="text-[#B3121B] font-black uppercase">{item.category}</span>
                    <span className="text-slate-600">વિગત {item.pageRef}</span>
                  </div>
                  <h4 className="text-[8.5px] font-black leading-tight text-slate-950 line-clamp-1 mt-0.1">
                    {headline}
                  </h4>
                  <p className="text-[6.8px] font-medium text-slate-700 leading-tight line-clamp-2 text-justify">
                    {summary}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== 3. SECONDARY STORIES (2 PROMINENT STORIES WITH PHOTOS) ==================== */}
      <section className="grid grid-cols-2 gap-2.5 border-b-2 border-slate-900 pb-1 pt-0.5 shrink-0">
        {secondaryStories.map((item, idx) => {
          const headline = item.art?.printHeadline || item.art?.titleGu || item.art?.title || item.defaultTitle;
          const rawSummary = item.art?.printSummary || item.art?.excerptGu || item.art?.excerpt || item.art?.contentGu || item.art?.content || item.defaultSummary;
          const fullContent = item.art?.contentGu || item.art?.content || '';
          const combinedText = rawSummary && fullContent && rawSummary.length < 120
            ? `${rawSummary} ${fullContent}`
            : (rawSummary || item.defaultSummary);
          const summary = getCleanText(combinedText, 300);
          const image = item.art?.featuredImage || item.defaultImage;

          return (
            <div key={idx} className={`space-y-0.5 ${idx === 0 ? 'border-r border-slate-300 pr-2.5' : ''}`}>
              <div className="flex items-center justify-between text-[7px] font-bold text-slate-500">
                <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[6.5px] font-black rounded-xs uppercase">
                  {item.category}
                </span>
                <span className="text-[#B3121B] font-bold">► વિગત {item.pageRef}</span>
              </div>

              <h3 className="text-[10.5px] font-black leading-tight text-slate-950 line-clamp-1">
                {headline}
              </h3>

              <div className="flex gap-2 items-start mt-0.5">
                <div className="w-[100px] shrink-0 space-y-0.5">
                  <div className="w-[100px] h-[66px] overflow-hidden border border-slate-300 bg-slate-100">
                    <img
                      src={image}
                      alt=""
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                  </div>
                  <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                    {item.art?.location ? `${item.art.location} • વિશેષ બ્યુરો` : 'તસવીર: ગુજરાત પોસ્ટ'}
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between min-h-[66px] space-y-0.5">
                  <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                    {summary}
                  </p>
                  <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                    <span className="text-slate-800 font-extrabold truncate">
                      {item.art?.byline || 'વિશેષ પ્રતિનિધિ'}
                    </span>
                    <span className="text-[#B3121B] font-black shrink-0">
                      વિગત {item.pageRef}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* ==================== 4. SPECIAL IN-DEPTH SPOTLIGHT SECTION (2 STORIES) ==================== */}
      <section className="border-b-2 border-slate-900 pb-1 pt-0.5 shrink-0 space-y-0.5">
        <div className="flex items-center justify-between bg-slate-100 border-l-4 border-[#B3121B] px-1.5 py-0.5">
          <span className="text-[7.5px] font-black text-slate-900 uppercase flex items-center gap-1">
            <Flame className="h-2.5 w-2.5 text-[#B3121B]" />
            <span>વિશેષ અહેવાલ & રાજ્ય સમીક્ષા (SPECIAL IN-DEPTH REPORT)</span>
          </span>
          <span className="text-[6.5px] font-bold text-slate-600">ગ્રાઉન્ડ ઝીરો એક્સક્લુઝિવ વિશ્લેષણ</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {spotlightStories.map((item, idx) => {
            const headline = item.art?.printHeadline || item.art?.titleGu || item.art?.title || item.defaultTitle;
            const rawSummary = item.art?.printSummary || item.art?.excerptGu || item.art?.excerpt || item.art?.contentGu || item.art?.content || item.defaultSummary;
            const fullContent = item.art?.contentGu || item.art?.content || '';
            const combinedText = rawSummary && fullContent && rawSummary.length < 120
              ? `${rawSummary} ${fullContent}`
              : (rawSummary || item.defaultSummary);
            const summary = getCleanText(combinedText, 300);
            const image = item.art?.featuredImage || item.defaultImage;

            return (
              <div key={idx} className={`space-y-0.5 ${idx === 0 ? 'border-r border-slate-300 pr-2.5' : ''}`}>
                <div className="flex items-center justify-between text-[6.5px] font-bold">
                  <span className="bg-slate-800 text-white px-1.5 py-0.1 text-[6px] font-black rounded-xs uppercase">
                    {item.badge} • {item.category}
                  </span>
                  <span className="text-[#B3121B] font-bold">► {item.pageRef}</span>
                </div>

                <h4 className="text-[10px] font-black leading-tight text-slate-950 line-clamp-1">
                  {headline}
                </h4>

                <div className="flex gap-2 items-start mt-0.5">
                  <div className="w-[100px] shrink-0 space-y-0.5">
                    <div className="w-[100px] h-[66px] overflow-hidden border border-slate-300 bg-slate-100">
                      <img
                        src={image}
                        alt=""
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                      />
                    </div>
                    <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                      {item.art?.location ? `${item.art.location} • વિશેષ ડેસ્ક` : 'તસવીર: ગુજરાત પોસ્ટ'}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between min-h-[66px] space-y-0.5">
                    <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                      {summary}
                    </p>
                    <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                      <span className="text-slate-800 font-extrabold truncate">
                        {item.art?.byline || 'વિશેષ તપાસ ટીમ'}
                      </span>
                      <span className="text-[#B3121B] font-black shrink-0">
                        વિગત {item.pageRef}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================== 5. 16 CATEGORY STORIES GRID (4 ROWS OF 4 STORIES) ==================== */}
      <section className="grid grid-cols-4 gap-1.5 border-b-2 border-slate-900 pb-0.5 pt-0.5 shrink-0">
        {categoryGridStories.map((item, idx) => {
          const headline = item.art?.printHeadline || item.art?.titleGu || item.art?.title || item.defaultTitle;
          const summary = item.art?.printSummary || getCleanText(item.art?.contentGu || item.art?.content || item.defaultSummary, 65);
          const image = item.art?.featuredImage || item.defaultImage;

          return (
            <div
              key={idx}
              className={`space-y-0.5 ${idx % 4 !== 3 ? 'border-r border-slate-300 pr-1.5' : ''} ${idx >= 4 ? 'pt-0.5 border-t border-slate-200' : ''}`}
            >
              <div className="flex items-center justify-between text-[6.5px] font-bold text-slate-500">
                <span className="text-[#B3121B] font-black uppercase">{item.category}</span>
                <span>{item.pageRef}</span>
              </div>

              <h4 className="text-[7.8px] font-black leading-tight text-slate-950 line-clamp-1">
                {headline}
              </h4>

              <div className="flex gap-1 items-start mt-0.1">
                <img src={image} alt="" className="w-11 h-8 object-cover border border-slate-300 shrink-0 bg-slate-100" crossOrigin="anonymous" />
                <p className="text-[6.3px] font-medium text-slate-700 leading-snug text-justify line-clamp-2 flex-1">
                  {summary}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* ==================== 6. MARKET & WEATHER SNAPSHOT STRIP ==================== */}
      <section className="grid grid-cols-12 gap-1 items-center border-b-2 border-slate-900 pb-0.5 pt-0.2 shrink-0">
        {/* Left Market Snapshot (8 cols) */}
        <div className="col-span-8 border-r border-slate-300 pr-1">
          <div className="flex items-center justify-between text-[6.5px] font-bold text-slate-700 border-b border-slate-200 pb-0.2 mb-0.5">
            <span className="font-black text-[#B3121B] uppercase flex items-center gap-0.5">
              <TrendingUp className="h-2.5 w-2.5" />
              <span>બજાર સ્નેપશોટ (MARKET CLOSE)</span>
            </span>
            <span>01 SEP 2026 (As of 3:30 PM)</span>
          </div>

          <div className="grid grid-cols-6 gap-1 text-[6.5px] text-center font-bold">
            <div className="bg-slate-50 border border-slate-200 p-0.5 rounded-xs">
              <span className="text-[5.5px] text-slate-500 block">SENSEX</span>
              <span className="text-emerald-700 font-black">81,735 ▲</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-0.5 rounded-xs">
              <span className="text-[5.5px] text-slate-500 block">NIFTY 50</span>
              <span className="text-emerald-700 font-black">25,001 ▲</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-0.5 rounded-xs">
              <span className="text-[5.5px] text-slate-500 block">GOLD 24K</span>
              <span className="text-slate-900 font-black">₹72,150</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-0.5 rounded-xs">
              <span className="text-[5.5px] text-slate-500 block">SILVER</span>
              <span className="text-slate-900 font-black">₹84,900</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-0.5 rounded-xs">
              <span className="text-[5.5px] text-slate-500 block">BRENT CRUDE</span>
              <span className="text-slate-900 font-black">$78.10</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-0.5 rounded-xs">
              <span className="text-[5.5px] text-slate-500 block">USD/INR</span>
              <span className="text-slate-900 font-black">₹83.20</span>
            </div>
          </div>
        </div>

        {/* Right Weather Snapshot (4 cols) */}
        <div className="col-span-4 pl-0.5">
          <div className="flex items-center justify-between text-[6.5px] font-bold text-slate-700 border-b border-slate-200 pb-0.2 mb-0.5">
            <span className="font-black text-[#B3121B] uppercase">{displayCity} હવામાન</span>
            <span>01 SEP 2026</span>
          </div>

          <div className="flex items-center justify-between bg-amber-50/60 border border-amber-200 p-0.5 rounded-xs">
            <CloudSun className="h-4.5 w-4.5 text-amber-500 shrink-0" />
            <div className="text-right">
              <div className="text-[8.5px] font-black text-slate-900 leading-none">
                32°C <span className="text-[6.5px] font-semibold text-slate-600">વાદળછાયું</span>
              </div>
              <div className="text-[6px] text-slate-600 font-bold mt-0.2">
                ભેજ: 68% | પવન: 12 km/h
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 7. BOTTOM BRIEFS ("ઝડપી અહેવાલ" - 6 COLUMNS) ==================== */}
      <section className="shrink-0 space-y-0.5 border-b border-slate-400 pb-0.5">
        <div className="flex items-center gap-1.5 border-b border-slate-300 pb-0.2">
          <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[7px] font-black uppercase rounded-xs">
            ઝડપી અહેવાલ • QUICK BRIEFS
          </span>
          <span className="text-[6.5px] text-slate-500 font-bold">રાજ્ય અને રાષ્ટ્રના સંક્ષિપ્ત સમાચારો</span>
        </div>

        <div className="grid grid-cols-6 gap-1 pt-0.2">
          {briefItems.map((brief, idx) => (
            <div key={idx} className={`space-y-0.5 ${idx < 5 ? 'border-r border-slate-300 pr-1' : ''}`}>
              <h5 className="text-[7.2px] font-black leading-tight text-slate-950 line-clamp-1 flex items-center gap-0.5">
                <span className="text-[#B3121B] font-black shrink-0">►</span>
                <span>{brief.headline}</span>
              </h5>
              <p className="text-[6.2px] font-medium text-slate-700 leading-tight line-clamp-2 text-justify">
                {brief.summary}
              </p>
              <div className="text-right text-[5.8px] font-bold text-slate-600">
                {brief.pageNo}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== 8. AUTHENTIC NEWSPAPER TENDER & NOTICE STRIP ==================== */}
      <section className="bg-slate-50 border border-dashed border-slate-400 px-2 py-0.2 rounded-xs flex items-center justify-between text-[6.5px] font-bold text-slate-700 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="bg-slate-800 text-white px-1 py-0.2 rounded-xs text-[6px] font-black uppercase flex items-center gap-0.5">
            <Megaphone className="h-2 w-2 text-amber-400" />
            <span>જાહેર સૂચના</span>
          </span>
          <span>ગુજરાત પોસ્ટ વિશેષ ઈ-પેપર, દૈનિક સંસ્કરણ અને ડિજિટલ સબસ્ક્રિપ્શન ઉપલબ્ધ.</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <span>જાહેરાત અને ટેન્ડર પ્રસિદ્ધિ માટે: <strong>advt@gujaratpost.com</strong></span>
          <span>•</span>
          <span className="text-[#B3121B] font-black flex items-center gap-0.5">
            <ShieldCheck className="h-2.5 w-2.5 text-emerald-600" />
            <span>પ્રમાણિત દૈનિક</span>
          </span>
        </div>
      </section>

      {/* ==================== 9. FOOTER ==================== */}
      <footer className="border-t border-slate-400 pt-0.5 pb-0.5 flex items-center justify-between text-[7px] font-bold text-slate-600 shrink-0">
        <div>
          <span>© ગુજરાત પોસ્ટ પ્રેસ, {displayCity} • સત્ય, નિષ્પક્ષ અને સચોટ સમાચાર માટે પ્રતિબદ્ધ</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#B3121B] font-black uppercase">WWW.GUJARATPOST.COM</span>
          <span>•</span>
          <span>પાનું ૧ / ૧૪</span>
        </div>
      </footer>
    </div>
  );
};
