'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles, Calendar, User, Award, ShieldCheck, Heart, Activity, Briefcase } from 'lucide-react';
import { ZodiacIcon, GUJARAT_ZODIAC_LETTERS } from '@/components/ui/ZodiacIcon';
import type { ZodiacSign } from '@/components/sections/AstrologySection';

interface ZodiacDetailModalProps {
  sign: ZodiacSign | null;
  onClose: () => void;
  language: 'gu' | 'en' | 'hi';
}

export const NUMEROLOGY_DATA: Record<number, {
  number: number;
  dates: string;
  prediction: string;
  career: string;
  love: string;
  luckyNum: string;
  luckyColor: string;
  remedy: string;
  celebrities: string;
}> = {
  1: {
    number: 1,
    dates: '(જેમનો જન્મ 1, 10, 19, 28 તારીખે થયો છે.)',
    prediction: 'શરૂઆતમાં આશા મુજબ સફળતા મળવામાં શંકા રહેશે અને દરેક કાર્યમાં વિલંબ તથા અસ્થિરતા અનુભવાશે. આગળના દિવસોમાં સુધારો થવાથી તમે ઇચ્છિત રીતે આગળ વધી શકશો. પિતા સાથે વૈચારિક મતભેદ થઈ શકે છે.',
    career: 'નોકરીમાં અધિકારીઓ અનુકૂળ રહેશે. વેપાર-ધંધામાં સુધારો થશે.',
    love: 'પ્રેમ સંબંધોનો અંત શક્ય છે. નવી મિત્રતામાં વિચારીને આગળ વધો.',
    luckyNum: '4-7-9',
    luckyColor: 'વાદળી',
    remedy: 'શ્રીરામ નામના જાપ કરો.',
    celebrities: 'મુકેશ અંબાણી, રાહુલ ગાંધી, સુંદર પીચાઈ, રતન ટાટા, અનુષ્કા શર્મા, રેખા, લતા મંગેશકર, ઐશ્વર્યા રાય, સંજીવ કપૂર, સુનીલ ગાવસ્કર.',
  },
  2: {
    number: 2,
    dates: '(જેમનો જન્મ 2, 11, 20, 29 તારીખે થયો છે.)',
    prediction: 'લાગણીશીલતા વધશે. માનસિક શાંતિ જાળવી રાખવી જરૂરી છે. માતાજીના આશીર્વાદથી કાર્યોમાં સફળતા પ્રાપ્ત થશે. કલા અને સાહિત્ય ક્ષેત્રે નવી તકો સાંપડશે.',
    career: 'ભાગીદારીના ધંધામાં સાવચેતી રાખવી. નોકરીમાં પ્રમોશનના સારો યોગ છે.',
    love: 'જીવનસાથી સાથે મતભેદો ઉકેલાશે. પ્રેમમાં નિકટતા વધશે.',
    luckyNum: '2-5-7',
    luckyColor: 'સફેદ / ક્રીમ',
    remedy: 'શિવલિંગ પર દૂધ અને જળ અર્પિત કરો.',
    celebrities: 'અમિતાભ બચ્ચન, શાહરૂખ ખાન, મહાત્મા ગાંધી, પન્નાલાલ પટેલ, નરેન્દ્ર મોદી.',
  },
  3: {
    number: 3,
    dates: '(જેમનો જન્મ 3, 12, 21, 30 તારીખે થયો છે.)',
    prediction: 'જ્ઞાન અને અનુભવથી જટિલ સમસ્યાઓનો ઉકેલ મળશે. ધાર્મિક અને સામાજિક કાર્યોમાં રસ વધશે. વિદ્યાર્થીઓ માટે ઉત્તમ સમય છે.',
    career: 'શિક્ષણ, કન્સલ્ટન્સી અને બેંકિંગ ક્ષેત્રે પ્રગતિ થશે.',
    love: 'પારિવારિક જીવનમાં સુખ-શાંતિ જળવાઈ રહેશે.',
    luckyNum: '3-6-9',
    luckyColor: 'પીળો / ગોલ્ડન',
    remedy: 'વિષ્ણુ સહસ્રનામનો પાઠ કરો.',
    celebrities: 'રજનીકાંત, વિરાટ કોહલી, પ્રિયંકા ચોપરા, અક્ષય કુમાર.',
  },
  4: {
    number: 4,
    dates: '(જેમનો જન્મ 4, 13, 22, 31 તારીખે થયો છે.)',
    prediction: 'અચાનક ધનલાભ કે તકો સાંપડી શકે છે. તાર્કિક ક્ષમતાથી મોટા નિર્ણયો સરળ બનશે. બજેટનું ધ્યાન રાખવું.',
    career: 'આઈટી, ટેકનોલોજી અને રિસર્ચ ક્ષેત્રે મોટી તકો મળશે.',
    love: 'સંબંધોમાં પારદર્શિતા રાખવી હિતાવહ છે.',
    luckyNum: '1-4-8',
    luckyColor: 'ભૂરો / કાળો',
    remedy: 'હનુમાન ચાલીસાના પાઠ કરો.',
    celebrities: 'કિશોર કુમાર, સચિન તેંડુલકર, શ્રીદેવી.',
  },
  5: {
    number: 5,
    dates: '(જેમનો જન્મ 5, 14, 23 તારીખે થયો છે.)',
    prediction: 'બુદ્ધિ અને ચતુરાઈથી અટકેલા કામો પૂર્ણ થશે. વાણીમાં મધુરતા રાખવી. મુસાફરીના યોગ બની રહ્યા છે.',
    career: 'માર્કેટિંગ, મીડિયા અને વેપારમાં મોટો ફાયદો થશે.',
    love: 'નવા મિત્રો સાથે સંબંધો ગાઢ બનશે.',
    luckyNum: '5-6-8',
    luckyColor: 'લીલો',
    remedy: 'ગણેશજીને દૂર્વા અર્પણ કરો.',
    celebrities: 'આમિર ખાન, દીપિકા પાદુકોણ, જવાહરલાલ નેહરુ.',
  },
  6: {
    number: 6,
    dates: '(જેમનો જન્મ 6, 15, 24 તારીખે થયો છે.)',
    prediction: 'ભૌતિક સુખ-સુવિધાઓમાં વધારો થશે. કલા અને સંગીત તરફ ઝુકાવ વધશે. આકર્ષક તકો સામે આવશે.',
    career: 'ડિઝાઇનિંગ, ફેશન અને એન્ટરટેઇનમેન્ટ ક્ષેત્રે સફળતા મળશે.',
    love: 'દાંપત્ય જીવનમાં રોમાન્સ અને મધુરતા વધશે.',
    luckyNum: '3-6-9',
    luckyColor: 'ગુલાબી / રોયલ બ્લુ',
    remedy: 'મહાલક્ષ્મીજીના મંત્રનો જાપ કરો.',
    celebrities: 'રણવીર સિંહ, માધુરી દીક્ષિત, આલિયા ભટ્ટ.',
  },
  7: {
    number: 7,
    dates: '(જેમનો જન્મ 7, 16, 25 તારીખે થયો છે.)',
    prediction: 'આધ્યાત્મિક અને સંશોધનાત્મક કાર્યોમાં સફળતા મળશે. મન શાંત રહેશે. નિર્ણય લેવામાં ઉતાવળ ન કરવી.',
    career: 'સંશોધન, લેખન અને શિક્ષણ ક્ષેત્ર ઉત્તમ રહેશે.',
    love: 'પરસ્પર વિશ્વાસ અને આદર વધશે.',
    luckyNum: '2-7-9',
    luckyColor: 'આછો લીલો / ક્રીમ',
    remedy: 'ઓમ નમઃ શિવાય મંત્રનો જાપ કરો.',
    celebrities: 'એમ.એસ. ધોની, એકતા કપૂર, કરણ જોહર.',
  },
  8: {
    number: 8,
    dates: '(જેમનો જન્મ 8, 17, 26 તારીખે થયો છે.)',
    prediction: 'મહેનત અને શિસ્તથી મોટું લક્ષ્ય પ્રાપ્ત થશે. ધીરજ રાખવાથી અટકેલું નાણું પરત મળશે.',
    career: 'કન્સ્ટ્રક્શન, રિયલ એસ્ટેટ અને આયર્ન સેક્ટરમાં સફળતા મળશે.',
    love: 'ગંભીરતાથી સંબંધો નિભાવવા.',
    luckyNum: '4-8-9',
    luckyColor: 'ડાર્ક બ્લુ / મરૂન',
    remedy: 'શનિદેવના મંદિરે તેલનું દાન કરો.',
    celebrities: 'ડિમ્પલ કાપડિયા, શિલ્પા શેટ્ટી, પ્રધાનમંત્રી કાર્યાલય નરેન્દ્ર મોદી.',
  },
  9: {
    number: 9,
    dates: '(જેમનો જન્મ 9, 18, 27 તારીખે થયો છે.)',
    prediction: 'ઉર્જા અને ઉત્સાહથી ભરેલો દિવસ રહેશે. સાહસિક કાર્યોમાં વિજય થશે. ગુસ્સા પર નિયંત્રણ રાખવું.',
    career: 'ડિફેન્સ, સ્પોર્ટ્સ અને એન્જિનિયરિંગમાં પ્રગતિ થશે.',
    love: 'પાર્ટનર પ્રત્યે સમર્પણ ભાવ વધશે.',
    luckyNum: '3-6-9',
    luckyColor: 'લાલ / કેસરી',
    remedy: 'હનુમાનજીને ચમેલીનું તેલ અર્પિત કરો.',
    celebrities: 'સલમાન ખાન, અક્ષય કુમાર, પ્રિયંકા ચોપરા.',
  },
};

export const ZODIAC_DETAILED_PREDICTIONS: Record<string, {
  nameGu: string;
  nameEn: string;
  lettersGu: string;
  moonSign: {
    positive: string;
    negative: string;
    business: string;
    love: string;
    health: string;
    luckyColor: string;
    luckyNumber: string;
  };
  tarot: {
    cardName: string;
    description: string;
    career: string;
    love: string;
    health: string;
    luckyColor: string;
    luckyNumber: string;
  };
}> = {
  aries: {
    nameGu: 'મેષ',
    nameEn: 'Aries',
    lettersGu: '(જેનું નામ અ, લ, ઈ થી શરૂ થાય છે)',
    moonSign: {
      positive: 'આજે કેટલીક નવી યોજનાઓ મનમાં આવશે. નજીકના સંબંધોની મદદથી તે યોજનાઓને અમલમાં મૂકવામાં સફળતા પણ મળશે. મહિલાઓ અન્ય પ્રવૃત્તિઓની સાથે-સાથે પોતાના અંગત કામ માટે પણ સમય કાઢી શકશે.',
      negative: 'આ સમયે ઉધાર સંબંધિત લેવડ-દેવડ બિલકુલ ન કરો. નહિતર તેના કારણે તમારું બજેટ ખોરવાઈ જશે. કોઈપણ નકારાત્મક સ્થિતિ ઊભી થાય તો પરેશાન થવાને બદલે તેનો ઉકેલ શોધવાનો પ્રયાસ કરો.',
      business: 'કાર્યસ્થળ પર તમારી હાજરી ફરજિયાત રાખો, સાથે જ તમારી કાર્યપ્રણાલીમાં પણ થોડો બદલાવ લાવવો જરૂરી છે. પ્રભાવશાળી લોકો સાથે સંબંધોને મધુર બનાવી રાખો. તેમના સહયોગથી વ્યવસાયની સ્થિતિમાં સુધારો આવશે.',
      love: 'ઘરમાં પરિવારના સભ્યો વચ્ચે સુખ-શાંતિ અને સુમેળભર્યો વ્યવહાર રહેશે. પ્રેમ સંબંધોમાં પણ મધુરતા રહેશે.',
      health: 'તમારા મનોભાવોને વિચલિત ન થવા દો. શારીરિક અને માનસિક રીતે સકારાત્મક રહેવા માટે યોગ અને મેડિટેશન ચોક્કસ કરો.',
      luckyColor: 'જાંબલી',
      luckyNumber: '4',
    },
    tarot: {
      cardName: 'Ace of Swords',
      description: 'પારિવારિક યોજના પર ફરીથી વિચાર થઈ શકે છે. ઘરમાં નાના સભ્યોની સિદ્ધિથી પ્રસન્નતા મળશે. આર્થિક બાબતોમાં ખર્ચ અને બચતનું સંતુલન જાળવવું લાભદાયી રહેશે.',
      career: 'બૅંકિંગ, કોમર્સ અથવા એકાઉન્ટ્સ ક્ષેત્ર સાથે જોડાયેલા લોકોને બાકી રહેલા કાર્યો પૂરા કરવાની તક મળશે. નવી જવાબદારી મળવાથી વિશ્વસનીયતા વધશે.',
      love: 'પાર્ટનર તમારી ભાવનાઓને સમજવાનો પ્રયાસ કરશે. જૂના મતભેદો પર શાંતિપૂર્ણ વાતચીતથી ઉકેલ આવશે.',
      health: 'લાંબા સમય સુધી બેસી રહેવાથી કમર અને પગમાં અકડન થઈ શકે છે. પૂરતું પાણી પીઓ અને હળવી સ્ટ્રેચિંગ કરો.',
      luckyColor: 'મરૂન',
      luckyNumber: '3',
    },
  },
  taurus: {
    nameGu: 'વૃષભ',
    nameEn: 'Taurus',
    lettersGu: '(જેનું નામ બ, વ, ઉ થી શરૂ થાય છે)',
    moonSign: {
      positive: 'આર્થિક દ્રષ્ટિએ આજે ભાગ્ય સપોર્ટ કરશે. કાર્યક્ષેત્રે અટકેલું નાણું પરત મળવાથી રાહત થશે. જૂના મિત્ર સાથે મુલાકાત મનને ખુશ કરશે.',
      negative: 'ઉતાવળમાં લીધેલો નિર્ણય નુકસાન પહોંચાડી શકે છે. અહંકાર અને ગુસ્સા પર નિયંત્રણ રાખવું જરૂરી છે.',
      business: 'વ્યવસાયમાં નવી ભાગીદારી માટે અનુકૂળ સમય છે. ઓનલાઇન કાર્યોમાં મોટો ફાયદો મળી શકે છે.',
      love: 'પારિવારિક વાતાવરણ આનંદદાયક રહેશે. જીવનસાથીનો પૂરો સહયોગ મળશે.',
      health: 'પાચન સંબંધિત સમસ્યાઓથી બચવા માટે બહારના ખોરાકથી દૂર રહેવું.',
      luckyColor: 'સફેદ / ક્રીમ',
      luckyNumber: '6',
    },
    tarot: {
      cardName: 'The Empress',
      description: 'સુખ-સુવિધાઓ અને સમૃદ્ધિમાં વધારો થવાના સંકેત છે. રચનાત્મક કાર્યોમાં રુચિ વધશે.',
      career: 'કલા, ફેશન અને ડિઝાઇનિંગ સાથે જોડાયેલા લોકોને મોટો ઓર્ડર મળી શકે છે.',
      love: 'પ્રેમ જીવનમાં મધુરતા અને ગાઢતા વધશે.',
      health: 'સ્વાસ્થ્ય ઉત્તમ રહેશે, ઉર્જાનું સ્તર ઊંચું જળવાઈ રહેશે.',
      luckyColor: 'ગુલાબી',
      luckyNumber: '5',
    },
  },
  gemini: {
    nameGu: 'મિથુન',
    nameEn: 'Gemini',
    lettersGu: '(જેનું નામ ક, છ, ઘ થી શરૂ થાય છે)',
    moonSign: {
      positive: 'બૌદ્ધિક ક્ષમતાથી જટિલ કાર્યોનો સરસ ઉકેલ મળશે. મિત્રો સાથે પ્રવાસનું આયોજન શક્ય બને.',
      negative: 'અતિવિશ્વાસથી બચવું. બીજાના કામમાં વગર માગ્યે સલાહ આપવાથી વિવાદ થઈ શકે છે.',
      business: 'માર્કેટિંગ અને સંચાર ક્ષેત્રે કાર્યરત લોકોને નવી તકો મળશે.',
      love: 'પરસ્પર સમઝદારીથી પ્રેમ સંબંધો વધુ મજબૂત બનશે.',
      health: 'માનસિક થાક અનુભવાય. પૂરતી ઊંઘ લેવી.',
      luckyColor: 'લીલો',
      luckyNumber: '5',
    },
    tarot: {
      cardName: 'The Magician',
      description: 'તમારી પ્રતિભા અને કૌશલ્યનો યોગ્ય ઉપયોગ કરવાથી ઇચ્છિત સફળતા મળશે.',
      career: 'નવા આઇડિયા પર કામ શરૂ કરવા માટે સમય ઉત્તમ છે.',
      love: 'નવી મિત્રતા પ્રેમાળ સંબંધમાં બદલાઈ શકે છે.',
      health: 'પ્રાણાયામ અને યોગથી ઉર્જા જળવાઈ રહેશે.',
      luckyColor: 'પીળો',
      luckyNumber: '1',
    },
  },
  cancer: {
    nameGu: 'કર્ક',
    nameEn: 'Cancer',
    lettersGu: '(જેનું નામ ડ, હ થી શરૂ થાય છે)',
    moonSign: {
      positive: 'ભાવનાત્મક રીતે મજબૂતી અનુભવાશે. ઘરના વડીલોના આશીર્વાદથી અટકેલા કામો પૂર્ણ થશે.',
      negative: 'નાની નાની વાતો પર સંવેદનશીલ ન થવું. આર્થિક વ્યવહારોમાં સાવધાની રાખવી.',
      business: 'પ્રોપર્ટી કે રિયલ એસ્ટેટ ક્ષેત્રે મોટો લાભ થઈ શકે છે.',
      love: 'જીવનસાથી સાથે ભાવનાત્મક જોડાણ વધશે.',
      health: 'ઋતુગત બીમારીઓથી સાવચેત રહેવું.',
      luckyColor: 'સિલ્વર / દૂધિયા',
      luckyNumber: '2',
    },
    tarot: {
      cardName: 'The Chariot',
      description: 'લક્ષ્ય પ્રત્યે મક્કમ નિર્ધાર તમને સફળતા અપાવશે. મુસાફરી લાભદાયી રહેશે.',
      career: 'ટાર્ગેટ પૂરા કરવાથી કાર્યસ્થળે તમારી પ્રશંસા થશે.',
      love: 'પાર્ટનર સાથે ખુલીને વાત કરવાથી સંબંધો સુધરશે.',
      health: 'શારીરિક સહનશક્તિ વધારવા કસરત ચાલુ રાખવી.',
      luckyColor: 'ઓરેન્જ',
      luckyNumber: '7',
    },
  },
  leo: {
    nameGu: 'સિંહ',
    nameEn: 'Leo',
    lettersGu: '(જેનું નામ મ, ટ થી શરૂ થાય છે)',
    moonSign: {
      positive: 'નેતૃત્વ ક્ષમતા ખીલી ઉઠશે. સામાજિક પ્રતિષ્ઠામાં વધારો થશે. માન-સન્માન મળશે.',
      negative: 'વધુ પડતો ગુસ્સો સંબંધો બગાડી શકે છે. ખર્ચ પર કાબૂ રાખવો.',
      business: 'સરકારી ક્ષેત્રના અટકેલા કામોમાં સફળતા મળશે.',
      love: 'પ્રેમીજનો વચ્ચે વિશ્વાસ વધશે.',
      health: 'બીપી અને હૃદયના દર્દીઓએ કાળજી લેવી.',
      luckyColor: 'ગોલ્ડન / કેસરી',
      luckyNumber: '1',
    },
    tarot: {
      cardName: 'The Sun',
      description: 'ઉત્સાહ, સફળતા અને સકારાત્મક ઉર્જાથી ભરેલો દિવસ રહેશે.',
      career: 'પ્રમોશન અને નવી ઉચ્ચ જવાબદારીઓ મળવાના સંકેત.',
      love: 'પરિવારમાં ખુશીનો માહોલ રહેશે.',
      health: 'આરોગ્ય તંદુરસ્ત અને સ્ફૂર્તિલું રહેશે.',
      luckyColor: 'પીળો',
      luckyNumber: '9',
    },
  },
  virgo: {
    nameGu: 'કન્યા',
    nameEn: 'Virgo',
    lettersGu: '(જેનું નામ પ, ઠ, ણ થી શરૂ થાય છે)',
    moonSign: {
      positive: 'બારીકાઈથી કરેલા કામમાં મોટો લાભ થશે. શિસ્ત અને નિયમિતતા ફાયદાકારક રહેશે.',
      negative: 'ચિંતા અને ઓવરથિન્કિંગથી દૂર રહેવું.',
      business: 'એકાઉન્ટિંગ અને આઇટી ક્ષેત્રે પ્રગતિ થશે.',
      love: 'જીવનસાથી સાથે શાંતિપૂર્ણ સુમેળ રહેશે.',
      health: 'ત્વચા અને પેટ સંબંધી કાળજી લેવી.',
      luckyColor: 'આછો લીલો',
      luckyNumber: '5',
    },
    tarot: {
      cardName: 'The Hermit',
      description: 'આત્મમંથન અને યોગ્ય માર્ગદર્શનથી ભવિષ્યની યોજનાઓ સુધરશે.',
      career: 'અભ્યાસ અને સંશોધનમાં ઉત્તમ દેખાવ થશે.',
      love: 'એકાંતમાં વિચારોને સ્પષ્ટ કરવાનો સમય.',
      health: 'મેડિટેશનથી માનસિક શાંતિ મળશે.',
      luckyColor: 'ગ્રે',
      luckyNumber: '4',
    },
  },
  libra: {
    nameGu: 'તુલા',
    nameEn: 'Libra',
    lettersGu: '(જેનું નામ ર, ત થી શરૂ થાય છે)',
    moonSign: {
      positive: 'જીવનમાં સંતુલન અને શાંતિ રહેશે. કલાત્મક કાર્યોમાં પ્રશંસા મળશે.',
      negative: 'નિર્ણય લેવામાં વિલંબ ન કરવો.',
      business: 'ભાગીદારીના બિઝનેસમાં મોટો લાભ.',
      love: 'રોમેન્ટિક સંબંધો વધુ ગાઢ બનશે.',
      health: 'યોગ્ય આહારથી તંદુરસ્તી જળવાશે.',
      luckyColor: 'રોયલ બ્લુ',
      luckyNumber: '6',
    },
    tarot: {
      cardName: 'Justice',
      description: 'તટસ્થ નિર્ણય અને પ્રામાણિકતાથી દરેક ક્ષેત્રે સફળતા મળશે.',
      career: 'લીગલ અને કાયદાકીય બાબતોમાં વિજય થશે.',
      love: 'સંબંધોમાં ન્યાય અને સમાનતા જળવાશે.',
      health: 'પાણીનું પ્રમાણ પૂરતું રાખવું.',
      luckyColor: 'આકાશી',
      luckyNumber: '2',
    },
  },
  scorpio: {
    nameGu: 'વૃશ્ચિક',
    nameEn: 'Scorpio',
    lettersGu: '(જેનું નામ ન, ય થી શરૂ થાય છે)',
    moonSign: {
      positive: 'મક્કમ નિર્ણયશક્તિથી મુશ્કેલ સ્થિતિ પર વિજય મેળવશો.',
      negative: 'શંકાસ્પદ સ્વભાવથી બચવું.',
      business: 'ગુપ્ત યોજનાઓથી મોટો આર્થિક લાભ થશે.',
      love: 'ગાઢ પ્રેમ અને સમર્પણ અનુભવાશે.',
      health: 'નિયમિત યોગ કરવા.',
      luckyColor: 'લાલ',
      luckyNumber: '9',
    },
    tarot: {
      cardName: 'Death & Rebirth',
      description: 'જૂની નકામી વસ્તુઓનો અંત અને નવી સુંદર શરૂઆત થશે.',
      career: 'જૂની નોકરી કે પ્રોજેક્ટ બદલાઈને નવો સારો અવસર મળશે.',
      love: 'સંબંધોમાં નવસંચાર થશે.',
      health: 'બિનજરૂરી ચિંતા છોડી દેવી.',
      luckyColor: 'મરૂન',
      luckyNumber: '8',
    },
  },
  sagittarius: {
    nameGu: 'ધનુ',
    nameEn: 'Sagittarius',
    lettersGu: '(જેનું નામ ભ, ધ, ફ, ઢ થી શરૂ થાય છે)',
    moonSign: {
      positive: 'આશાવાદી દૃષ્ટિકોણ અને ઉચ્ચ વિચારસરણીથી સફળતા સાંપડશે.',
      negative: 'અવિચારી સાહસ ન કરવું.',
      business: 'વિદેશી વેપાર અને શિક્ષણ ક્ષેત્રે મોટો લાભ.',
      love: 'મિત્રો અને સ્વજનો સાથે આનંદી સમય.',
      health: 'કમર અને સ્નાયુઓની કાળજી લેવી.',
      luckyColor: 'પીળો',
      luckyNumber: '3',
    },
    tarot: {
      cardName: 'Temperance',
      description: 'ધીરજ અને સંયમથી જટિલ સમસ્યાઓનો ઉકેલ આવશે.',
      career: 'ટીમવર્ક અને સહયોગથી લક્ષ્ય પૂરું થશે.',
      love: 'સમજદારી અને શાંતિ જળવાઈ રહેશે.',
      health: 'સંતુલિત જીવનશૈલી અપનાવવી.',
      luckyColor: 'કેસરી',
      luckyNumber: '5',
    },
  },
  capricorn: {
    nameGu: 'મકર',
    nameEn: 'Capricorn',
    lettersGu: '(જેનું નામ ખ, જ થી શરૂ થાય છે)',
    moonSign: {
      positive: 'કઠિન પરિશ્રમનું ફળ મળશે. પદ અને પ્રતિષ્ઠા વધશે.',
      negative: 'વધારે પડતા કડક ન બનવું.',
      business: 'ઔદ્યોગિક અને નિર્માણ કાર્યોમાં સફળતા.',
      love: 'પરિવાર પ્રત્યે જવાબદારીઓ પૂરી થશે.',
      health: 'સાંધાના દુખાવાથી બચવું.',
      luckyColor: 'કાળો / ડાર્ક બ્લુ',
      luckyNumber: '8',
    },
    tarot: {
      cardName: 'The World',
      description: 'લાંબા સમયથી ચાલી રહેલા મોટો પ્રોજેક્ટ સફળતાપૂર્વક પૂર્ણ થશે.',
      career: 'આંતરરાષ્ટ્રીય સ્તરે ઓળખ અને સફળતા મળશે.',
      love: 'જીવનસાથી સાથે વિદેશ યાત્રાનો યોગ.',
      health: 'ઉત્કૃષ્ટ શારીરિક સ્વાસ્થ્ય.',
      luckyColor: 'ચોકલેટી',
      luckyNumber: '4',
    },
  },
  aquarius: {
    nameGu: 'કુંભ',
    nameEn: 'Aquarius',
    lettersGu: '(જેનું નામ ગ, સ, શ, ષ થી શરૂ થાય છે)',
    moonSign: {
      positive: 'નવીન આઇડિયા અને સર્જનાત્મકતાથી મોટો લાભ થશે.',
      negative: 'મિત્રોની ખોટી સંગતથી દૂર રહેવું.',
      business: 'સ્ટાર્ટઅપ અને આઈટીમાં પ્રગતિ.',
      love: 'પ્રેમ જીવન ઉત્સાહજનક રહેશે.',
      health: 'માનસિક તણાવથી બચવું.',
      luckyColor: 'વાયોલેટ',
      luckyNumber: '7',
    },
    tarot: {
      cardName: 'The Star',
      description: 'નવી આશા, પ્રેરણા અને ઉજ્જવળ ભવિષ્યની શરૂઆત.',
      career: 'તમારા ઈનોવેટિવ આઈડિયાને બિરદાવવામાં આવશે.',
      love: 'પ્રેમ સંબંધોમાં આત્મિયતા વધશે.',
      health: 'માનસિક શાંતિ અને તાજગી રહેશે.',
      luckyColor: 'આકાશી બ્લુ',
      luckyNumber: '6',
    },
  },
  pisces: {
    nameGu: 'મીન',
    nameEn: 'Pisces',
    lettersGu: '(જેનું નામ દ, ચ, ઝ, થ થી શરૂ થાય છે)',
    moonSign: {
      positive: 'ધ્યાન અને આધ્યાત્મિકતાથી આંતરિક શક્તિ મળશે.',
      negative: 'કાલ્પનિક દુનિયામાંથી બહાર આવી વાસ્તવિકતા સ્વીકારવી.',
      business: 'કલા, સંગીત અને મેડિકલ ક્ષેત્રે મોટો ફાયદો.',
      love: 'જીવનસાથી સાથે આત્મિક જોડાણ વધશે.',
      health: 'પૂરતી ઊંઘ અને હળવી કસરત જરૂરી.',
      luckyColor: 'પીળો / સી ગ્રીન',
      luckyNumber: '9',
    },
    tarot: {
      cardName: 'The High Priestess',
      description: 'તમારી આંતરપ્રજ્ઞા અને રહસ્યમય ક્ષમતાઓ સાચો માર્ગ બતાવશે.',
      career: 'સંશોધન અને કાઉન્સેલિંગમાં સફળતા.',
      love: 'મૌન અને ભાવનાત્મક સમઝદારીથી પ્રેમ વધશે.',
      health: 'માનસિક રીતે પ્રફુલ્લિત રહેશો.',
      luckyColor: 'સફેદ',
      luckyNumber: '2',
    },
  },
};

export default function ZodiacDetailModal({ sign, onClose, language }: ZodiacDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'daily' | 'yearly'>('daily');
  const [selectedNum, setSelectedNum] = useState<number>(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (sign) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.touchAction = '';
      setMounted(false);
    };
  }, [sign]);

  if (!sign || !mounted || typeof document === 'undefined') return null;

  const signKey = (sign.id || 'aries').toLowerCase();
  const staticDetail = ZODIAC_DETAILED_PREDICTIONS[signKey] || ZODIAC_DETAILED_PREDICTIONS.aries;
  // Parse dynamic detailsJson if provided by backend API
  let parsedDetails: any = null;
  if ((sign as any)?.detailsJson) {
    try {
      parsedDetails = typeof (sign as any).detailsJson === 'string'
        ? JSON.parse((sign as any).detailsJson)
        : (sign as any).detailsJson;
    } catch (e) {
      console.warn('Failed to parse detailsJson:', e);
    }
  } else if ((sign as any)?.details) {
    parsedDetails = (sign as any).details;
  }

  // Dynamically merge backend prediction data if available from database/API
  const detail = {
    ...staticDetail,
    nameGu: sign.nameGu || staticDetail.nameGu,
    nameEn: sign.name || staticDetail.nameEn,
    moonSign: {
      ...staticDetail.moonSign,
      ...(parsedDetails?.moonSign || {}),
      positive: parsedDetails?.moonSign?.positive || (language === 'gu' ? sign.predictionGu : sign.prediction) || staticDetail.moonSign.positive,
    },
    tarot: {
      ...staticDetail.tarot,
      ...(parsedDetails?.tarot || {}),
    },
  };

  const dynamicNumInfo = parsedDetails?.numerology?.[selectedNum] || NUMEROLOGY_DATA[selectedNum] || NUMEROLOGY_DATA[1];
  const numInfo = {
    ...(NUMEROLOGY_DATA[selectedNum] || NUMEROLOGY_DATA[1]),
    ...dynamicNumInfo,
  };

  const todayDateGu = 'બુધવાર, 5 ઓગસ્ટ 2026';
  const todayDateEn = 'Wednesday, 5 August 2026';

  return createPortal(
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Backdrop overlay */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card Box */}
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl bg-card border border-border/80 shadow-2xl z-10 overflow-hidden text-foreground">
        
        {/* Top Header Controls */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-card/95 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full text-xs md:text-sm font-extrabold bg-[#B3121B] text-white shadow-sm">
              {language === 'gu' ? 'આજનું રાશિફળ' : 'Daily Horoscope'}
            </span>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted-foreground/20 hover:text-foreground transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Main Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin">
          
          {/* Zodiac Header Block */}
          <div className="flex flex-col items-center text-center pb-4 border-b border-border/60">
            <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-[#FFF5E9] dark:bg-amber-950/40 border-2 border-[#FFC775] dark:border-amber-700/60 shadow-md mb-2 p-2">
              <ZodiacIcon id={signKey} className="h-16 w-16 sm:h-20 sm:w-20 object-contain m-auto" />
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-foreground">
              {detail.nameGu} | {detail.nameEn}
            </h2>

            <p className="text-xs sm:text-sm font-semibold text-muted-foreground mt-1">
              {detail.lettersGu}
            </p>

            <p className="text-xs font-extrabold text-[#B3121B] mt-1.5">
              {language === 'gu' ? todayDateGu : todayDateEn}
            </p>
          </div>

          {/* Section 1: ચંદ્રરાશિ પ્રમાણે (Moon Sign Prediction) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border/60 pb-2">
              <Sparkles className="h-4.5 w-4.5 text-[#B3121B]" />
              <h3 className="text-base sm:text-lg font-black text-foreground">
                {language === 'gu' ? 'ચંદ્રરાશિ પ્રમાણે' : 'According to Moon Sign'}
              </h3>
            </div>

            <div className="space-y-3 text-xs sm:text-sm leading-relaxed font-medium text-foreground/90">
              <p>
                <strong className="text-emerald-700 dark:text-emerald-400 font-extrabold">{language === 'gu' ? 'પોઝિટિવ-' : 'Positive-'} </strong>
                {detail.moonSign.positive}
              </p>

              <p>
                <strong className="text-rose-700 dark:text-rose-400 font-extrabold">{language === 'gu' ? 'નેગેટિવ-' : 'Negative-'} </strong>
                {detail.moonSign.negative}
              </p>

              <p>
                <strong className="text-amber-700 dark:text-amber-400 font-extrabold">{language === 'gu' ? 'વ્યવસાય-' : 'Business-'} </strong>
                {detail.moonSign.business}
              </p>

              <p>
                <strong className="text-purple-700 dark:text-purple-400 font-extrabold">{language === 'gu' ? 'લવ-' : 'Love-'} </strong>
                {detail.moonSign.love}
              </p>

              <p>
                <strong className="text-blue-700 dark:text-blue-400 font-extrabold">{language === 'gu' ? 'સ્વાસ્થ્ય-' : 'Health-'} </strong>
                {detail.moonSign.health}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs sm:text-sm font-bold">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300">
                  {language === 'gu' ? `લકી કલર- ${detail.moonSign.luckyColor}` : `Lucky Color: ${detail.moonSign.luckyColor}`}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300">
                  {language === 'gu' ? `લકી નંબર- ${detail.moonSign.luckyNumber}` : `Lucky Number: ${detail.moonSign.luckyNumber}`}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: ટેરો રાશિફળ (Tarot Horoscope) */}
          <div className="space-y-4 pt-4 border-t border-border/60">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4.5 w-4.5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-base sm:text-lg font-black text-foreground">
                  {language === 'gu' ? 'ટેરો રાશિફળ' : 'Tarot Horoscope'}
                </h3>
              </div>
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm leading-relaxed font-medium text-foreground/90">
              <h4 className="text-sm sm:text-base font-black text-purple-700 dark:text-purple-400">
                {language === 'gu' ? `કાર્ડ - ${detail.tarot.cardName}` : `Card - ${detail.tarot.cardName}`}
              </h4>

              <p>{detail.tarot.description}</p>

              <p>
                <strong className="text-amber-700 dark:text-amber-400 font-extrabold">{language === 'gu' ? 'કરિયર:' : 'Career:'} </strong>
                {detail.tarot.career}
              </p>

              <p>
                <strong className="text-rose-700 dark:text-rose-400 font-extrabold">{language === 'gu' ? 'લવ:' : 'Love:'} </strong>
                {detail.tarot.love}
              </p>

              <p>
                <strong className="text-blue-700 dark:text-blue-400 font-extrabold">{language === 'gu' ? 'સ્વાસ્થ્ય:' : 'Health:'} </strong>
                {detail.tarot.health}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs sm:text-sm font-bold">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300">
                  {language === 'gu' ? `નસીબદાર રંગ - ${detail.tarot.luckyColor}` : `Lucky Color: ${detail.tarot.luckyColor}`}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
                  {language === 'gu' ? `શુભ આંક - ${detail.tarot.luckyNumber}` : `Lucky Number: ${detail.tarot.luckyNumber}`}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: અંક ભવિષ્યફળ (Numerology Horoscope) */}
          <div className="space-y-4 pt-4 border-t border-border/60">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <div className="flex items-center gap-2">
                <Award className="h-4.5 w-4.5 text-amber-600 dark:text-amber-400" />
                <h3 className="text-base sm:text-lg font-black text-foreground">
                  {language === 'gu' ? 'અંક ભવિષ્યફળ' : 'Numerology Horoscope'}
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm font-extrabold text-center text-muted-foreground">
              {language === 'gu' ? 'તમારી જન્મ તારીખ મુજબ અંક પસંદ કરો' : 'Select number according to your date of birth'}
            </p>

            {/* Interactive Number Pills 1 to 9 */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
                const isSelected = selectedNum === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setSelectedNum(num)}
                    className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-xs sm:text-sm font-black transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 text-white shadow-md scale-110'
                        : 'border border-amber-500/50 bg-background text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>

            {/* Selected Number Details */}
            <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-800/40 space-y-3 text-xs sm:text-sm leading-relaxed font-medium">
              <div className="text-center pb-2 border-b border-amber-200/60 dark:border-amber-800/40">
                <h4 className="text-base font-black text-amber-800 dark:text-amber-300">
                  {language === 'gu' ? `અંક - ${numInfo.number}` : `Number - ${numInfo.number}`}
                </h4>
                <p className="text-xs text-muted-foreground font-semibold mt-0.5">
                  {numInfo.dates}
                </p>
              </div>

              <p>{numInfo.prediction}</p>

              <p>
                <strong className="text-amber-800 dark:text-amber-400 font-extrabold">{language === 'gu' ? 'કરિયર:' : 'Career:'} </strong>
                {numInfo.career}
              </p>

              <p>
                <strong className="text-rose-800 dark:text-rose-400 font-extrabold">{language === 'gu' ? 'લવ:' : 'Love:'} </strong>
                {numInfo.love}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-bold">
                <span className="text-amber-900 dark:text-amber-200">
                  {language === 'gu' ? `લકી નંબર: ${numInfo.luckyNum}` : `Lucky Numbers: ${numInfo.luckyNum}`}
                </span>
                <span>•</span>
                <span className="text-amber-900 dark:text-amber-200">
                  {language === 'gu' ? `લકી કલર: ${numInfo.luckyColor}` : `Lucky Color: ${numInfo.luckyColor}`}
                </span>
              </div>

              <p className="pt-1">
                <strong className="text-purple-800 dark:text-purple-300 font-extrabold">{language === 'gu' ? 'શું કરવું:' : 'Remedy:'} </strong>
                {numInfo.remedy}
              </p>

              <div className="pt-2 border-t border-amber-200/60 dark:border-amber-800/40">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground font-extrabold">{language === 'gu' ? 'આપના જન્માક્ષરવાળી હસ્તીઓ:' : 'Famous Personalities:'} </strong>
                  {numInfo.celebrities}
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>,
    document.body
  );
}
