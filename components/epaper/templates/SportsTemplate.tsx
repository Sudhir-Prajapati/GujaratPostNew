'use client';

import React from 'react';
import { EPaperPageData, getCleanText, formatGujaratiDate, BroadsheetArticle } from '../types';
import { Trophy, Award, Flame, Calendar, ShieldCheck, Sparkles, Activity, Clock, CheckCircle2, Newspaper } from 'lucide-react';

interface TemplateProps {
  data: EPaperPageData;
}

const cleanHeadline = (text?: string) => {
  if (!text) return '';
  return text.replace(/^#\d+\s*[-–—:]\s*/, '').trim();
};

export const SportsTemplate: React.FC<TemplateProps> = ({ data }) => {
  const {
    pageNumber = 7,
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

  // 1. Live Match Scoreboard Strip
  const liveScores = [
    { match: 'ભારત વિ. ઓસ્ટ્રેલિયા (૩જી ટેસ્ટ)', score: 'ભારત: ૩૮૫/૬ (૯૦ ઓવર) • ગિલ ૧૨૪*, પંત ૮૮', status: 'સ્ટમ્પ ડે-૧' },
    { match: 'પ્રીમિયર લીગ ફૂટબોલ', score: 'માન્ચેસ્ટર સિટી ૨ - ૧ લિવરપૂલ', status: 'ફુલ ટાઇમ' },
    { match: 'પ્રો કબડ્ડી લીગ સીઝન', score: 'ગુજરાત જાયન્ટ્સ ૩૮ - ૩૪ પટના પાઇરેટ્સ', status: 'વિજય' },
    { match: 'યુએસ ઓપન ટેનિસ', score: 'અલકારાઝ ૩-૧ થી સેમિફાઇનલમાં પ્રવેશ', status: 'ક્વાર્ટર ફાઇનલ' },
  ];

  // 2. Lead Sports Action Report
  const leadHeadline = cleanHeadline(
    leadArticle?.printHeadline ||
    leadArticle?.titleGu ||
    leadArticle?.title ||
    'અમદાવાદ મોટેરા સ્ટેડિયમમાં ભારતનો શાનદાર વિજય: શુભમન ગિલની આક્રમક સદી અને બુમરાહની ૫ વિકેટથી ઓસ્ટ્રેલિયા પરાજિત'
  );

  const leadImage =
    leadArticle?.featuredImage ||
    'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80';

  const leadCaption =
    leadArticle?.photoCredit || 'તસવીર: ગુજરાત પોસ્ટ સ્પોર્ટ્સ • નરેન્દ્ર મોદી સ્ટેડિયમ: વિજયી ક્ષણે ભારતીય ખેલાડીઓની ઉજવણી';

  const leadSummary =
    leadArticle?.printSummary ||
    getCleanText(
      leadArticle?.excerptGu ||
        leadArticle?.excerpt ||
        leadArticle?.contentGu ||
        leadArticle?.content ||
        'અમદાવાદના નરેન્દ્ર મોદી સ્ટેડિયમ ખાતે ૧.૧૦ લાખ દર્શકોની ઉપસ્થિતિમાં રમાયેલી રોમાંચક મેચમાં ભારતીય ટીમે ઓસ્ટ્રેલિયાને ૮ વિકેટે પરાજય આપી ટેસ્ટ શ્રેણીમાં ૨-૦ ની અજેય સરસાઈ મેળવી લીધી છે. શુભમન ગિલે ૧૪૫ બોલમાં ૧૨ ચોગ્ગા અને ૪ છગ્ગા સાથે યાદગાર સદી ફટકારી હતી.',
      280
    );

  const leadSecondParagraph = getCleanText(
    leadArticle?.contentGu ||
      leadArticle?.content ||
      'જસપ્રીત બુમરાહે ઘાતક રિવર્સ સ્વિંગ બોલિંગ કરી ૫ વિકેટ ઝડપી કાંગારૂ બેટિંગ લાઇન-અપને વેરવિખેર કરી નાખ્યું હતું. રવિન્દ્ર જાડેજાએ પણ ૩ મહત્વની વિકેટ ઝડપી મેન ઓફ ધ મેચનો ખિતાબ પોતાના નામે કર્યો હતો.',
    260
  );

  const leadLocation = leadArticle?.location || 'અમદાવાદ';

  // 3. 7 Fast Sports Bulletins (Right 4 cols)
  const sportsBulletin = [
    { title: cleanHeadline(pool[0]?.printHeadline || pool[0]?.titleGu) || 'IPL ઓક્શન: ભારતીય યુવા ઓલરાઉન્ડર પર ₹૧૨ કરોડની વિક્રમી બોલી', time: '૧૦:૧૫ AM', cat: 'ક્રિકેટ' },
    { title: cleanHeadline(pool[1]?.printHeadline || pool[1]?.titleGu) || 'ચેમ્પિયન્સ લીગ: રિયલ મેડ્રિડનો બાયર્ન મ્યુનિક સામે ૩-૨ થી રોમાંચક વિજય', time: '૧૧:૩૦ AM', cat: 'ફૂટબોલ' },
    { title: cleanHeadline(pool[2]?.printHeadline || pool[2]?.titleGu) || 'બેડમિન્ટન ઓલ ઇંગ્લેન્ડ: ભારતીય શટલર્સ સેમિફાઇનલમાં પ્રવેશ્યા', time: '૧૨:૪૫ PM', cat: 'બેડમિન્ટન' },
    { title: cleanHeadline(pool[3]?.printHeadline || pool[3]?.titleGu) || 'ઓલિમ્પિક્સ ક્વોલિફાયર: ભારતીય બોક્સરોએ ૩ નવા ગોલ્ડ મેડલ જીત્યા', time: '૦૨:૧૫ PM', cat: 'બોક્સિંગ' },
    { title: cleanHeadline(pool[4]?.printHeadline || pool[4]?.titleGu) || 'પ્રો રેસલિંગ લીગ: હરિયાણા અને પંજાબના પહેલવાનો વચ્ચે દિલધડક મુકાબલો', time: '૦૩:૩૦ PM', cat: 'કુસ્તી' },
    { title: cleanHeadline(pool[5]?.printHeadline || pool[5]?.titleGu) || 'ગુજરાત ખેલ મહાકુંભ ૨.૦ માં ૫૦ લાખથી વધુ ખેલાડીઓનું રજીસ્ટ્રેશન', time: '૦૪:૪૫ PM', cat: 'રાજ્ય રમત' },
    { title: cleanHeadline(pool[6]?.printHeadline || pool[6]?.titleGu) || 'ફોર્મ્યુલા વન ગ્રાન્ડ પ્રિક્સ: રેડ બુલ ડ્રાઇવરનો પોલ પોઝિશન સાથે વિજય', time: '૦૬:૦૦ PM', cat: 'F1 રેસ' },
  ];

  // 4. Secondary Sports Stories (2 prominent stories with photos)
  const secSport1 = {
    title: cleanHeadline(pool[7]?.printHeadline || pool[7]?.titleGu) || 'ભારતીય હોકી ટીમનો દબદબો: એશિયન ચેમ્પિયન્સ ટ્રોફીની ફાઇનલમાં દક્ષિણ કોરિયાને હરાવ્યું',
    image: pool[7]?.featuredImage || 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[7]?.excerptGu || pool[7]?.contentGu || 'કેપ્ટન હરમનપ્રીત સિંહના ૨ પેનલ્ટી કોર્નર ગોલ સાથે ભારતે ૪-૧ થી શાનદાર વિજય મેળવી એશિયા કપ ટાઇટલ જાળવી રાખ્યું.', 240),
    tag: 'હોકી ચેમ્પિયનશીપ',
    byline: 'સ્પોર્ટ્સ ડેસ્ક, ચેન્નાઈ',
    art: pool[7]
  };

  const secSport2 = {
    title: cleanHeadline(pool[8]?.printHeadline || pool[8]?.titleGu) || 'નીરજ ચોપરાનો નવો રેકોર્ડ: ડાયમંડ લીગ જેવલિન થ્રોમાં ૮૯.૮૫ મીટર સાથે સુવર્ણ પદક જીત્યો',
    image: pool[8]?.featuredImage || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[8]?.excerptGu || pool[8]?.contentGu || 'સ્વિટ્ઝર્લેન્ડના લુસાને ખાતે યોજાયેલી વર્લ્ડ એથ્લેટિક્સ મીટમાં ભારતીય ગોલ્ડન બોય નીરજ ચોપરાએ પ્રથમ થ્રોમાં જ લીડ મેળવી ટાઇટલ જીત્યું.', 240),
    tag: 'એથ્લેટિક્સ ગોલ્ડ',
    byline: 'એથ્લેટિક્સ બ્યુરો',
    art: pool[8]
  };

  // 5. Special In-Depth Spotlight (2 Ground Reports with Photos)
  const spotSport1 = {
    title: cleanHeadline(pool[9]?.printHeadline || pool[9]?.titleGu) || 'ગુજરાતમાં ૨૦૩૬ ઓલિમ્પિક્સ તૈયારી: સરદાર પટેલ સ્પોર્ટ્સ એન્ક્લેવ અને ૧૦ વર્લ્ડ ક્લાસ સ્ટેડિયમ્સ',
    image: pool[9]?.featuredImage || 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[9]?.excerptGu || pool[9]?.contentGu || 'મોટેરા પરિસરમાં એક્વાટિક્સ સેન્ટર, ફૂટબોલ એરેના અને ઇન્ડોર સ્પોર્ટ્સ કોમ્પ્લેક્સનું નિર્માણ ₹૪,૬૦૦ કરોડના ખર્ચે પૂરજોશમાં ચાલી રહ્યું છે.', 240),
    badge: 'વિશેષ રિપોર્ટ',
    category: 'ઓલિમ્પિક્સ વિઝન',
    byline: 'સ્પોર્ટ્સ ઇન્ફ્રા ડેસ્ક',
    art: pool[9]
  };

  const spotSport2 = {
    title: cleanHeadline(pool[10]?.printHeadline || pool[10]?.titleGu) || 'વિમેન્સ પ્રીમિયર લીગ (WPL): ભારતીય મહિલા ક્રિકેટરોનો વૈશ્વિક મંચ પર શાનદાર દેખાવ',
    image: pool[10]?.featuredImage || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&auto=format&fit=crop&q=80',
    summary: getCleanText(pool[10]?.excerptGu || pool[10]?.contentGu || 'સ્મૃતિ મંધાના અને શેફાલી વર્માની વિસ્ફોટક બેટિંગ સાથે મહિલા ક્રિકેટની લોકપ્રિયતા અને દર્શક સંખ્યામાં રેકોર્ડ ૩૦૦% નો ઉછાળો.', 240),
    badge: 'વિમેન્સ ક્રિકેટ',
    category: 'WPL સીઝન',
    byline: 'ક્રિકેટ પ્રતિનિધિ',
    art: pool[10]
  };

  // 6. 4-Sport Arena Matrix with photos
  const cricketArena = {
    title: 'ક્રિકેટ એરેના',
    img: pool[11]?.featuredImage || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'BCCI', title: cleanHeadline(pool[11]?.printHeadline || pool[11]?.titleGu) || 'ડોમેસ્ટિક ખેલાડીઓની મેચ ફીમાં બમણો વધારો મંજૂર' },
      { loc: 'ICC', title: cleanHeadline(pool[12]?.printHeadline || pool[12]?.titleGu) || '૨૦૨૭ વર્લ્ડ કપ માટે નવા ક્વોલિફાયર નિયમો જાહેર' },
      { loc: 'IPL', title: cleanHeadline(pool[13]?.printHeadline || pool[13]?.titleGu) || 'નવી ૨ ટીમો માટે હોમ ગ્રાઉન્ડ સુવિધાઓ અપગ્રેડ કરાઈ' },
    ]
  };

  const footballArena = {
    title: 'ફૂટબોલ & ISL',
    img: pool[14]?.featuredImage || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'ISL', title: cleanHeadline(pool[14]?.printHeadline || pool[14]?.titleGu) || 'મોહન બગાન અને ઈસ્ટ બંગાળ વચ્ચે ડર્બી મેચ હાઉસફુલ' },
      { loc: 'FIFA', title: cleanHeadline(pool[15]?.printHeadline || pool[15]?.titleGu) || 'વર્લ્ડ કપ ૨૦૨૬ માટે સ્ટેડિયમ સેફ્ટી ગાઇડલાઇન્સ' },
      { loc: 'UCL', title: cleanHeadline(pool[16]?.printHeadline || pool[16]?.titleGu) || 'બાર્સેલોના યુવા ખેલાડી યામલનો શાનદાર હેટ્રિક ગોલ' },
    ]
  };

  const tennisBadmintonArena = {
    title: 'રેકેટ & ટેનિસ',
    img: pool[17]?.featuredImage || 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'ATP', title: cleanHeadline(pool[17]?.printHeadline || pool[17]?.titleGu) || 'રોહન બોપન્ના જોડીએ માસ્ટર્સ ૧૦૦૦ ડબલ્સ ટાઇટલ જીત્યું' },
      { loc: 'BWF', title: cleanHeadline(pool[18]?.printHeadline || pool[18]?.titleGu) || 'પી.વી. સિંધુ અને લક્ષ્ય સેન સુપર ૭૫૦ ક્વાર્ટરમાં' },
      { loc: 'WTA', title: cleanHeadline(pool[19]?.printHeadline || pool[19]?.titleGu) || 'ઇગા સ્વિઆતેકે પાંચમી ગ્રાન્ડ સ્લેમ ટ્રોફી કબજે કરી' },
    ]
  };

  const olympicsKabaddiArena = {
    title: 'ઓલિમ્પિક્સ & કબડ્ડી',
    img: pool[20]?.featuredImage || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&auto=format&fit=crop&q=80',
    stories: [
      { loc: 'PKL', title: cleanHeadline(pool[20]?.printHeadline || pool[20]?.titleGu) || 'ગુજરાત જાયન્ટ્સ ડિફેન્ડર્સે ૧૫ ટેકલ પોઇન્ટ્સ લીધા' },
      { loc: 'IOA', title: cleanHeadline(pool[21]?.printHeadline || pool[21]?.titleGu) || 'નેશનલ ગેમ્સમાં ૨૮ રાજ્યોના ૧૦,૦૦૦ ખેલાડીઓ ભાગ લેશે' },
      { loc: 'શૂટિંગ', title: cleanHeadline(pool[22]?.printHeadline || pool[22]?.titleGu) || 'મનુ ભાકરે વર્લ્ડ કપ ૧૦ મીટર એર પિસ્તોલમાં ગોલ્ડ જીત્યો' },
    ]
  };

  // 7. 8 Multi-Sport Tournament Stories Grid (2 rows of 4 cols with photos)
  const sportsGridStories = [
    {
      sport: 'ટેસ્ટ ક્રિકેટ',
      title: cleanHeadline(pool[23]?.printHeadline || pool[23]?.titleGu) || 'વિરાટ કોહલીના આંતરરાષ્ટ્રીય ક્રિકેટમાં ૨૭,૦૦૦ રન પૂર્ણ',
      summary: getCleanText(pool[23]?.excerptGu || pool[23]?.contentGu || 'સૌથી ઝડપી ૨૭,૦૦૦ રન બનાવનાર વિશ્વના પ્રથમ બેટ્સમેન બન્યા.', 60),
      image: pool[23]?.featuredImage || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=300&auto=format&fit=crop&q=80',
    },
    {
      sport: 'ફૂટબોલ એશિયા',
      title: cleanHeadline(pool[24]?.printHeadline || pool[24]?.titleGu) || 'ભારતીય ફૂટબોલ ટીમનો AFC એશિયન કપમાં શાનદાર પ્રવેશ',
      summary: getCleanText(pool[24]?.excerptGu || pool[24]?.contentGu || 'સુનીલ છેત્રીના વિદાય બાદ યુવા ખેલાડીઓએ અસાધારણ આક્રમક રમત દાખવી.', 60),
      image: pool[24]?.featuredImage || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=300&auto=format&fit=crop&q=80',
    },
    {
      sport: 'ચેસ ઓલિમ્પિયાડ',
      title: cleanHeadline(pool[25]?.printHeadline || pool[25]?.titleGu) || 'ભારતીય ગ્રાન્ડમાસ્ટર ગુકેશ અને પ્રજ્ઞાનંદાનો ઐતિહાસિક વિજય',
      summary: getCleanText(pool[25]?.excerptGu || pool[25]?.contentGu || 'બુડાપેસ્ટ ચેસ ઓલિમ્પિયાડમાં ટીમે સુવર્ણ પદક જીતી ઇતિહાસ રચ્યો.', 60),
      image: pool[25]?.featuredImage || 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=300&auto=format&fit=crop&q=80',
    },
    {
      sport: 'વેઇટલિફ્ટિંગ',
      title: cleanHeadline(pool[26]?.printHeadline || pool[26]?.titleGu) || 'મીરાબાઈ ચાનુએ વર્લ્ડ ચેમ્પિયનશીપમાં સિલ્વર મેડલ જીત્યો',
      summary: getCleanText(pool[26]?.excerptGu || pool[26]?.contentGu || '૪૯ કિલો વર્ગમાં કુલ ૨૦૫ કિલો વજન ઊંચકી પોડિયમ ફિનિશ મેળવ્યું.', 60),
      image: pool[26]?.featuredImage || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=300&auto=format&fit=crop&q=80',
    },
    {
      sport: 'ટેબલ ટેનિસ',
      title: cleanHeadline(pool[27]?.printHeadline || pool[27]?.titleGu) || 'મનિકા બત્રા અને શરથ કમલે એશિયન ટીટી ચેમ્પિયનશીપમાં મેડલ જીત્યો',
      summary: getCleanText(pool[27]?.excerptGu || pool[27]?.contentGu || 'ચીન અને જાપાનના ટોચના ખેલાડીઓને હરાવી ભારતીય ટીમે ઇતિહાસ સર્જ્યો.', 60),
      image: pool[27]?.featuredImage || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&auto=format&fit=crop&q=80',
    },
    {
      sport: 'તીરંદાજી',
      title: cleanHeadline(pool[28]?.printHeadline || pool[28]?.titleGu) || 'અદિતિ સ્વામી અને ઓજસ દેવતળે વર્લ્ડ આર્ચરી ચેમ્પિયન બન્યા',
      summary: getCleanText(pool[28]?.excerptGu || pool[28]?.contentGu || 'કમ્પાઉન્ડ આર્ચરીમાં ૧૫૦/૧૫૦ પરફેક્ટ સ્કોર સાથે ગોલ્ડ મેડલ જીત્યો.', 60),
      image: pool[28]?.featuredImage || 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=300&auto=format&fit=crop&q=80',
    },
    {
      sport: 'સ્વિમિંગ',
      title: cleanHeadline(pool[29]?.printHeadline || pool[29]?.titleGu) || 'શ્રીહરિ નટરાજે નેશનલ સ્વિમિંગમાં ૪ નવા નેશનલ રેકોર્ડ બનાવ્યા',
      summary: getCleanText(pool[29]?.excerptGu || pool[29]?.contentGu || "૧૦૦ મીટર બેકસ્ટ્રોકમાં એશિયન ગેમ્સ 'A' કટ સમય પ્રાપ્ત કર્યો.", 60),
      image: pool[29]?.featuredImage || 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=300&auto=format&fit=crop&q=80',
    },
    {
      sport: 'પેરા સ્પોર્ટ્સ',
      title: cleanHeadline(pool[30]?.printHeadline || pool[30]?.titleGu) || 'ભારતીય પેરા એથ્લેટ્સે વર્લ્ડ પેરા મીટમાં ૨૯ મેડલ જીતી ઇતિહાસ રચ્યો',
      summary: getCleanText(pool[30]?.excerptGu || pool[30]?.contentGu || 'સુમિત એન્ટિલ અને શીતલ દેવીએ વર્લ્ડ રેકોર્ડ સાથે ગોલ્ડ મેડલ જીત્યા.', 60),
      image: pool[30]?.featuredImage || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&auto=format&fit=crop&q=80',
    },
  ];

  // 8. Sports Fixtures Briefs (6 columns)
  const sportsPulseBriefs = [
    { label: 'આગામી ટેસ્ટ', text: 'ભારત વિ. ઓસ્ટ્રેલિયા ચોથી ટેસ્ટ મેચ મેલબોર્નમાં ૨૬ ડિસેમ્બરથી.', ref: 'શેડ્યુલ' },
    { label: 'WPL ડ્રાફ્ટ', text: 'પાંચ ફ્રેન્ચાઇઝીઓ દ્વારા આગામી સીઝન માટે ૩૦ ખેલાડીઓ રિટેન.', ref: 'WPL બોર્ડ' },
    { label: 'ISL પોઇન્ટ્સ', text: 'મોહન બગાન સુપર જાયન્ટ્સ ૨૮ પોઇન્ટ સાથે ટેબલ ટોપ પર.', ref: 'લીગ સ્ટેન્ડિંગ' },
    { label: 'ATP રેન્કિંગ્સ', text: 'કાર્લોસ અલકારાઝ વર્લ્ડ નંબર વન પર યથાવત રહ્યો.', ref: 'ATP ટૂર' },
    { label: 'ખેલ મહાકુંભ', text: 'તાલુકા કક્ષાની સ્પર્ધાઓ ૧૫ સપ્ટેમ્બરથી રાજ્યભરમાં શરૂ થશે.', ref: 'ખેલ સત્તાવાળા' },
    { label: 'દ્રોણાચાર્ય એવોર્ડ', text: 'રાષ્ટ્રીય રમતગમત પુરસ્કારો માટે ૧૫ કોચના નામોની ભલામણ.', ref: 'સ્પોર્ટ્સ મંત્રાલય' },
  ];

  return (
    <div className="h-full flex flex-col p-2 bg-white border-[3px] border-slate-900 box-border text-slate-900 font-sans select-none overflow-hidden space-y-0.5 justify-between">
      {/* ==================== 1. SPORTS RUNNING HEADER & FOLIO ==================== */}
      <header className="shrink-0">
        <div className="flex items-center justify-between text-[7.5px] font-bold text-slate-800 border-b border-slate-300 pb-0.5 mb-0.5">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-950 uppercase">ગુજરાત પોસ્ટ</span>
            <span className="text-slate-400">•</span>
            <span className="text-[#B3121B] font-black uppercase">રમત ગમત & સ્ટેડિયમ સ્પેશિયલ</span>
            <span className="text-slate-400">•</span>
            <span>{gujaratiDateStr}</span>
          </div>
          <div className="flex items-center gap-2 font-extrabold">
            <span>સ્પોર્ટ્સ ડેસ્ક</span>
            <span>•</span>
            <span className="bg-[#B3121B] text-white px-1.5 py-0.2 rounded-xs text-[7px] font-black uppercase">
              પાનું ૭ / ૧૪
            </span>
            <span>•</span>
            <span>₹ ૧૫.૦૦</span>
          </div>
        </div>

        {/* Section Masthead Banner */}
        <div className="bg-slate-950 text-white px-2 py-0.5 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[8.5px] font-black uppercase tracking-wider rounded-xs flex items-center gap-1">
              <Trophy className="h-2.5 w-2.5" />
              <span>રમત જગત • SPORTS ARENA & LIVE STADIUM REPORTS</span>
            </span>
            <span className="text-slate-300 text-[8px] font-bold truncate">
              ક્રિકેટ, ફૂટબોલ, હોકી, ટેનિસ, ઓલિમ્પિક્સ, ખેલ મહાકુંભ અને ખેલાડી પ્રોફાઇલ્સ
            </span>
          </div>
          <div className="flex items-center gap-1 text-amber-300 text-[7.5px] font-extrabold shrink-0">
            <Award className="h-2.5 w-2.5" />
            <span>અમદાવાદ-મોટેરા બ્યુરો</span>
          </div>
        </div>

        {/* Live Scores Ticker Ribbon */}
        <div className="grid grid-cols-4 gap-1 bg-slate-100 border-x border-b border-slate-300 p-0.5 text-[6.8px] font-bold text-slate-700">
          {liveScores.map((s, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-0.5 flex flex-col justify-between">
              <span className="text-slate-500 font-extrabold truncate">{s.match}</span>
              <span className="text-[7.5px] font-black text-slate-950 truncate">{s.score}</span>
              <span className="text-[5.8px] font-bold text-[#B3121B]">{s.status}</span>
            </div>
          ))}
        </div>
      </header>

      {/* ==================== 2. UPPER SPORTS GRID (8 COLS LEAD + 4 COLS BULLETIN) ==================== */}
      <section className="grid grid-cols-12 gap-2 border-b-2 border-slate-900 pb-1 pt-0.5 shrink-0 items-stretch">
        {/* Left 8 Columns: Dominant Lead Match Action Story */}
        <div className="col-span-8 border-r-2 border-slate-900 pr-2 space-y-0.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[7px] font-bold text-slate-600 mb-0.2">
              <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[7px] font-black rounded-xs uppercase">
                મોટેરા ટેસ્ટ વિજય • ભારત ૨-૦ થી આગળ
              </span>
              <span>નરેન્દ્ર મોદી સ્ટેડિયમ</span>
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
                <span className="text-[#B3121B] font-bold shrink-0 ml-1">► મેચ સ્કોરકાર્ડ</span>
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
                  <span>• ગિલ ૧૨૪ રન (૧૪૫ બોલ)</span>
                  <span>• બુમરાહ ૫/૪૨ બોલિંગ</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>• જાડેજા ૩ વિકેટ</span>
                  <span>• ભારત ૮ વિકેટે જીત્યું</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Columns: 7 Fast Sports Bulletins */}
        <div className="col-span-4 flex flex-col justify-between space-y-0.5 bg-slate-50 p-1 border border-slate-300">
          <div className="flex items-center justify-between border-b border-slate-300 pb-0.5">
            <span className="bg-slate-900 text-amber-300 text-[7px] font-black px-1.5 py-0.2 rounded-xs uppercase">
              સ્પોર્ટ્સ ડાયરી • 7 FAST UPDATES
            </span>
            <span className="text-[#B3121B] text-[6.5px] font-bold">લાઇવ એરેના</span>
          </div>

          <div className="space-y-0.5 flex-1 flex flex-col justify-between">
            {sportsBulletin.map((item, idx) => (
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
            <span>BCCI / ICC અધિકૃત સ્કોર</span>
            <span className="text-[#B3121B]">► સંપૂર્ણ સ્કોરકાર્ડ પાના ૭ પર</span>
          </div>
        </div>
      </section>

      {/* ==================== 3. 2 PROMINENT SECONDARY SPORTS STORIES (WITH PHOTOS) ==================== */}
      <section className="grid grid-cols-2 gap-2.5 border-b-2 border-slate-900 pb-1 pt-0.5 shrink-0">
        {/* Story 1 */}
        <div className="space-y-0.5 border-r border-slate-300 pr-2.5">
          <div className="flex items-center justify-between text-[7px] font-bold text-slate-500">
            <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[6.5px] font-black rounded-xs uppercase">
              {secSport1.tag}
            </span>
            <span className="text-[#B3121B] font-bold">► હોકી અહેવાલ</span>
          </div>

          <h3 className="text-[10.5px] font-black leading-tight text-slate-950 line-clamp-1">
            {secSport1.title}
          </h3>

          <div className="flex gap-2 items-start mt-0.5">
            <div className="w-[100px] shrink-0 space-y-0.5">
              <div className="w-[100px] h-[66px] overflow-hidden border border-slate-300 bg-slate-100">
                <img src={secSport1.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                તસવીર: ગુજરાત પોસ્ટ
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between min-h-[66px] space-y-0.5">
              <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                {secSport1.summary}
              </p>
              <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                <span className="text-slate-800 font-extrabold truncate">
                  {secSport1.byline}
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
              {secSport2.tag}
            </span>
            <span className="text-[#B3121B] font-bold">► જેવલિન થ્રો</span>
          </div>

          <h3 className="text-[10.5px] font-black leading-tight text-slate-950 line-clamp-1">
            {secSport2.title}
          </h3>

          <div className="flex gap-2 items-start mt-0.5">
            <div className="w-[100px] shrink-0 space-y-0.5">
              <div className="w-[100px] h-[66px] overflow-hidden border border-slate-300 bg-slate-100">
                <img src={secSport2.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                તસવીર: ગુજરાત પોસ્ટ
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between min-h-[66px] space-y-0.5">
              <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                {secSport2.summary}
              </p>
              <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                <span className="text-slate-800 font-extrabold truncate">
                  {secSport2.byline}
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
            <span>ઓલિમ્પિક્સ વિઝન & વુમન્સ સ્પોર્ટ્સ સમીક્ષા (OLYMPICS VISION & WPL SPOTLIGHT)</span>
          </span>
          <span className="text-[6.5px] font-bold text-slate-600">૨૦૩૬ ગુજરાત ઓલિમ્પિક્સ ઇન્ફ્રા & વિમેન્સ પ્રીમિયર લીગ</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Spot 1 */}
          <div className="space-y-0.5 border-r border-slate-300 pr-2.5">
            <div className="flex items-center justify-between text-[6.5px] font-bold">
              <span className="bg-indigo-800 text-white px-1.5 py-0.1 text-[6px] font-black rounded-xs uppercase">
                {spotSport1.badge} • {spotSport1.category}
              </span>
              <span className="text-[#B3121B] font-bold">► ઓલિમ્પિક્સ વિગત</span>
            </div>

            <h4 className="text-[10px] font-black leading-tight text-slate-950 line-clamp-1">
              {spotSport1.title}
            </h4>

            <div className="flex gap-2 items-start mt-0.5">
              <div className="w-[100px] shrink-0 space-y-0.5">
                <div className="w-[100px] h-[66px] overflow-hidden border border-slate-300 bg-slate-100">
                  <img src={spotSport1.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
                </div>
                <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                  તસવીર: ગુજરાત પોસ્ટ
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between min-h-[66px] space-y-0.5">
                <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                  {spotSport1.summary}
                </p>
                <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                  <span className="text-slate-800 font-extrabold truncate">
                    {spotSport1.byline}
                  </span>
                  <span className="text-[#B3121B] font-black shrink-0">
                    નકશો પાના ૦૮
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Spot 2 */}
          <div className="space-y-0.5">
            <div className="flex items-center justify-between text-[6.5px] font-bold">
              <span className="bg-emerald-800 text-white px-1.5 py-0.1 text-[6px] font-black rounded-xs uppercase">
                {spotSport2.badge} • {spotSport2.category}
              </span>
              <span className="text-[#B3121B] font-bold">► WPL રિપોર્ટ</span>
            </div>

            <h4 className="text-[10px] font-black leading-tight text-slate-950 line-clamp-1">
              {spotSport2.title}
            </h4>

            <div className="flex gap-2 items-start mt-0.5">
              <div className="w-[100px] shrink-0 space-y-0.5">
                <div className="w-[100px] h-[66px] overflow-hidden border border-slate-300 bg-slate-100">
                  <img src={spotSport2.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
                </div>
                <div className="text-[6px] font-bold text-slate-500 text-center truncate">
                  તસવીર: ગુજરાત પોસ્ટ
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between min-h-[66px] space-y-0.5">
                <p className="text-[7.6px] font-medium text-slate-800 leading-[1.35] text-justify line-clamp-4">
                  {spotSport2.summary}
                </p>
                <div className="pt-0.5 border-t border-dashed border-slate-300 text-[6.5px] font-bold text-slate-600 flex items-center justify-between">
                  <span className="text-slate-800 font-extrabold truncate">
                    {spotSport2.byline}
                  </span>
                  <span className="text-[#B3121B] font-black shrink-0">
                    સ્કોર પાના ૦૬
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 5. 4-SPORT ARENA MATRIX (WITH PHOTOS) ==================== */}
      <section className="border-b-2 border-slate-900 pb-0.5 shrink-0">
        <div className="flex items-center justify-between text-[7px] font-black text-slate-950 mb-0.5 border-b border-slate-300 pb-0.2">
          <span className="bg-slate-900 text-white px-1 py-0.2 text-[6.5px] uppercase rounded-xs">
            ૪ રમતગમત મંચ • 4 SPORT ARENA MATRIX
          </span>
          <span className="text-slate-500 text-[6.5px]">ક્રિકેટ • ફૂટબોલ & ISL • રેકેટ & ટેનિસ • ઓલિમ્પિક્સ & કબડ્ડી</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {/* Arena 1: Cricket */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-[#B3121B] text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {cricketArena.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={cricketArena.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {cricketArena.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► ક્રિકેટ રિપોર્ટ</span>
          </div>

          {/* Arena 2: Football */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-slate-900 text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {footballArena.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={footballArena.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {footballArena.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► ફૂટબોલ રિપોર્ટ</span>
          </div>

          {/* Arena 3: Tennis & Badminton */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-amber-700 text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {tennisBadmintonArena.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={tennisBadmintonArena.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {tennisBadmintonArena.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► રેકેટ રિપોર્ટ</span>
          </div>

          {/* Arena 4: Olympics & Kabaddi */}
          <div className="border border-slate-300 p-1 bg-white space-y-0.5 flex flex-col justify-between">
            <div>
              <span className="bg-emerald-800 text-white px-1 py-0.2 text-[6px] font-black uppercase rounded-xs block mb-0.2">
                {olympicsKabaddiArena.title}
              </span>
              <div className="w-full h-[42px] overflow-hidden border border-slate-200 bg-slate-100 mb-0.5">
                <img src={olympicsKabaddiArena.img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <div className="space-y-0.5">
                {olympicsKabaddiArena.stories.map((s, idx) => (
                  <div key={idx} className="border-b border-dashed border-slate-200 pb-0.5 text-[6.5px] leading-tight">
                    <span className="text-[#B3121B] font-bold text-[5.8px]">[{s.loc}]</span>
                    <h5 className="font-bold text-slate-950 line-clamp-1 mt-0.1">{s.title}</h5>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[5.5px] font-bold text-[#B3121B] text-right block pt-0.2">► એથ્લેટિક્સ રિપોર્ટ</span>
          </div>
        </div>
      </section>

      {/* ==================== 6. 8 MULTI-SPORT TOURNAMENTS GRID (2 ROWS OF 4 COLS) ==================== */}
      <section className="border-b-2 border-slate-900 pb-0.5 pt-0.2 shrink-0 space-y-0.5">
        <div className="flex items-center justify-between text-[7px] font-black text-slate-950 border-b border-slate-300 pb-0.2">
          <span className="bg-[#B3121B] text-white px-1 py-0.2 text-[6.5px] uppercase rounded-xs flex items-center gap-1">
            <Newspaper className="h-2 w-2" />
            <span>રાષ્ટ્રીય & આંતરરાષ્ટ્રીય ટૂર્નામેન્ટ ડાયરી (MULTI-SPORT TOURNAMENT DIGEST)</span>
          </span>
          <span className="text-slate-500 text-[6.2px]">વિશ્વ અને રાષ્ટ્રીય સ્તરની ૮ રમતોની ગતિવિધિ</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {sportsGridStories.map((item, idx) => (
            <div
              key={idx}
              className={`space-y-0.5 ${idx % 4 !== 3 ? 'border-r border-slate-300 pr-1.5' : ''} ${idx >= 4 ? 'pt-0.5 border-t border-slate-200' : ''}`}
            >
              <div className="flex items-center justify-between text-[6.5px] font-bold text-slate-500">
                <span className="text-[#B3121B] font-black uppercase">[{item.sport}]</span>
                <span className="text-[5.8px] text-slate-400">સ્પોર્ટ્સ</span>
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

      {/* ==================== 7. SPORTS FIXTURES & RESULTS BRIEFS (6 COLUMNS) ==================== */}
      <section className="shrink-0 space-y-0.5 border-b border-slate-400 pb-0.5">
        <div className="flex items-center gap-1.5 border-b border-slate-300 pb-0.2">
          <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[7px] font-black uppercase rounded-xs">
            મેચ શિડ્યુલ & પરિણામો • FIXTURES & RESULTS
          </span>
          <span className="text-[6.5px] text-slate-500 font-bold">આગામી મુકાબલા, સ્ટેન્ડિંગ્સ અને ખેલ મનોરંજન</span>
        </div>

        <div className="grid grid-cols-6 gap-1 pt-0.2">
          {sportsPulseBriefs.map((brief, idx) => (
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

      {/* ==================== 8. SPORTS AUTHORITY STRIP ==================== */}
      <section className="bg-slate-50 border border-dashed border-slate-400 p-0.5 rounded-xs flex items-center justify-between text-[6.5px] font-bold text-slate-700 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="bg-slate-900 text-amber-300 px-1 py-0.2 rounded-xs text-[6px] font-black uppercase flex items-center gap-0.5">
            <ShieldCheck className="h-2 w-2" />
            <span>સ્પોર્ટ્સ ઓથોરિટી ઓફ ગુજરાત</span>
          </span>
          <span>ખેલ મહાકુંભ, શક્તિદૂત યોજના અને રમતવીરો માટે વિશેષ સ્કોલરશિપ પોર્ટલ.</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <span>પોર્ટલ: <strong>sports.gujarat.gov.in</strong></span>
          <span>•</span>
          <span className="text-[#B3121B] font-black">પ્રમાણિત સ્પોર્ટ્સ ડેસ્ક</span>
        </div>
      </section>

      {/* ==================== 9. BROADSHEET NEWSPAPER FOOTER ==================== */}
      <footer className="border-t border-slate-400 pt-0.5 pb-0.5 flex items-center justify-between text-[7px] font-bold text-slate-600 shrink-0">
        <div>
          <span>© ગુજરાત પોસ્ટ સ્પોર્ટ્સ બ્યુરો, {displayCity} • મોટેરા સ્ટેડિયમ • મુંબઈ • લંડન • મેલબોર્ન</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#B3121B] font-black uppercase">WWW.GUJARATPOST.IN</span>
          <span>•</span>
          <span>પાનું ૭ / ૧૪</span>
        </div>
      </footer>
    </div>
  );
};
