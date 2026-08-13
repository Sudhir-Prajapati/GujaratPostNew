/**
 * Automated Public Astrology & Rashifal Service
 * Automatically provides fresh daily Vedic horoscope predictions for all 12 Zodiac signs.
 * Updates dynamically every day without requiring manual admin input.
 */

export interface AstrologySignData {
  id: string;
  slug: string;
  name: string;
  nameGu: string;
  nameHi: string;
  lettersGu: string;
  image: string;
  prediction: string;
  predictionGu: string;
  predictionHi: string;
  horoscope?: string;
  horoscopeGu?: string;
  horoscopeHi?: string;
  period?: string;
  apiDate?: string;
  luckyNumber: number;
  luckyColor: string;
  luckyColorGu: string;
  rating: number;
  date: string;
  dateGu: string;
  detailsJson: {
    moonSign: {
      positive: string;
      negative: string;
      business: string;
      love: string;
      health: string;
      luckyColor: string;
      luckyNumber: string;
    };
    tarot?: {
      cardName: string;
      prediction: string;
      luckyColor: string;
      luckyNumber: string;
    };
  };
}

const ZODIAC_METADATA = [
  {
    id: 'aries',
    slug: 'aries',
    name: 'Aries',
    nameGu: 'મેષ',
    nameHi: 'मेष',
    lettersGu: 'અ, લ, ઈ',
    element: 'Fire',
    ruler: 'Mars (મંગળ)',
  },
  {
    id: 'taurus',
    slug: 'taurus',
    name: 'Taurus',
    nameGu: 'વૃષભ',
    nameHi: 'वृषभ',
    lettersGu: 'બ, વ, ઉ',
    element: 'Earth',
    ruler: 'Venus (શુક્ર)',
  },
  {
    id: 'gemini',
    slug: 'gemini',
    name: 'Gemini',
    nameGu: 'મિથુન',
    nameHi: 'मिथुन',
    lettersGu: 'ક, છ, ઘ',
    element: 'Air',
    ruler: 'Mercury (બુધ)',
  },
  {
    id: 'cancer',
    slug: 'cancer',
    name: 'Cancer',
    nameGu: 'કર્ક',
    nameHi: 'कर्क',
    lettersGu: 'ડ, હ',
    element: 'Water',
    ruler: 'Moon (ચંદ્ર)',
  },
  {
    id: 'leo',
    slug: 'leo',
    name: 'Leo',
    nameGu: 'સિંહ',
    nameHi: 'सिंह',
    lettersGu: 'મ, ટ',
    element: 'Fire',
    ruler: 'Sun (સૂર્ય)',
  },
  {
    id: 'virgo',
    slug: 'virgo',
    name: 'Virgo',
    nameGu: 'કન્યા',
    nameHi: 'कन्या',
    lettersGu: 'પ, ઠ, ણ',
    element: 'Earth',
    ruler: 'Mercury (બુધ)',
  },
  {
    id: 'libra',
    slug: 'libra',
    name: 'Libra',
    nameGu: 'તુલા',
    nameHi: 'तुला',
    lettersGu: 'ર, ત',
    element: 'Air',
    ruler: 'Venus (શુક્ર)',
  },
  {
    id: 'scorpio',
    slug: 'scorpio',
    name: 'Scorpio',
    nameGu: 'વૃશ્ચિક',
    nameHi: 'वृश्चिक',
    lettersGu: 'ન, ય',
    element: 'Water',
    ruler: 'Mars (મંગળ)',
  },
  {
    id: 'sagittarius',
    slug: 'sagittarius',
    name: 'Sagittarius',
    nameGu: 'ધન',
    nameHi: 'धनु',
    lettersGu: 'ભ, ધ, ફ, ઢ',
    element: 'Fire',
    ruler: 'Jupiter (ગુરુ)',
  },
  {
    id: 'capricorn',
    slug: 'capricorn',
    name: 'Capricorn',
    nameGu: 'મકર',
    nameHi: 'मकर',
    lettersGu: 'ખ, જ',
    element: 'Earth',
    ruler: 'Saturn (શનિ)',
  },
  {
    id: 'aquarius',
    slug: 'aquarius',
    name: 'Aquarius',
    nameGu: 'કુંભ',
    nameHi: 'कुंभ',
    lettersGu: 'ગ, સ, શ, ષ',
    element: 'Air',
    ruler: 'Saturn (શનિ)',
  },
  {
    id: 'pisces',
    slug: 'pisces',
    name: 'Pisces',
    nameGu: 'મીન',
    nameHi: 'मीन',
    lettersGu: 'દ, ચ, ઝ, થ',
    element: 'Water',
    ruler: 'Jupiter (ગુરુ)',
  },
];

// Rich daily Vedic predictions pool in Gujarati, Hindi, English
const PREDICTION_TEMPLATES: Record<string, Array<{
  generalGu: string;
  generalHi: string;
  generalEn: string;
  positiveGu: string;
  negativeGu: string;
  businessGu: string;
  loveGu: string;
  healthGu: string;
  luckyColorGu: string;
  luckyColorEn: string;
  luckyNum: number;
}>> = {
  aries: [
    {
      generalGu: 'આજનો દિવસ તમારા માટે ઉર્જાવાન અને ઉત્સાહવર્ધક રહેશે. કાર્યક્ષેત્રમાં નવી તકો પ્રાપ્ત થશે.',
      generalHi: 'आज का दिन आपके लिए ऊर्जावान और उत्साहवर्धक रहेगा। कार्यक्षेत्र में नए अवसर प्राप्त होंगे।',
      generalEn: 'Your energy levels are high today. New opportunities await in your professional field.',
      positiveGu: 'આજે તમારી આંતરિક ક્ષમતા અને નેતૃત્વ ગુણ ખીલી ઉઠશે. સામાજિક પ્રતિષ્ઠામાં વધારો થશે.',
      negativeGu: 'ઉતાવળે મહત્વના નિર્ણયો લેવાનું ટાળો. ક્રોધ પર નિયંત્રણ રાખવું આવશ્યક છે.',
      businessGu: 'વેપાર-ધંધામાં નવું રોકાણ લાભદાયી સાબિત થઈ શકે છે. ભાગીદારીમાં પારદર્શિતા જાળવો.',
      loveGu: 'જીવનસાથી સાથે સારો તાલમેલ રહેશે. સાંજે કોઈ સુખદ સમાચાર મળી શકે છે.',
      healthGu: 'સ્વાસ્થ્ય ઉત્તમ રહેશે. મોસમી બીમારીઓથી સાવચેત રહેવું.',
      luckyColorGu: 'લાલ / કેસરી',
      luckyColorEn: 'Red / Saffron',
      luckyNum: 9,
    },
    {
      generalGu: 'લાંબા સમયથી અટકેલા સરકારી કામોમાં આજે સફળતા મળશે. આર્થિક સ્થિતિ મજબૂત બનશે.',
      generalHi: 'लंबे समय से रुके हुए कार्यों में आज सफलता मिलेगी। आर्थिक स्थिति मजबूत होगी।',
      generalEn: 'Pending tasks will see progress today. Financial stability improves.',
      positiveGu: 'મિત્રો અને વડીલોનો સહયોગ મળશે. આધ્યાત્મિક કાર્યોમાં રુચિ વધશે.',
      negativeGu: 'બિનજરૂરી ખર્ચાઓ પર અંકુશ રાખવો જરૂરી છે.',
      businessGu: 'નવા પ્રોજેક્ટ શરૂ કરવા માટે સારો દિવસ છે. ગ્રાહકો સાથે સારો સંબંધ રહેશે.',
      loveGu: 'પ્રેમ સંબંધોમાં મધુરતા આવશે. પરિવાર સાથે સુખદ સમય વિતાવી શકશો.',
      healthGu: 'માનસિક શાંતિ માટે ધ્યાન અને યોગાભ્યાસ કરવો હિતાવહ છે.',
      luckyColorGu: 'પીળો / ગુલાબી',
      luckyColorEn: 'Yellow / Pink',
      luckyNum: 1,
    },
  ],
  taurus: [
    {
      generalGu: 'નાણાકીય આયોજન પર ધ્યાન કેન્દ્રિત કરો. વાણી પર સંયમ રાખવાથી પારિવારિક વિવાદો ટળશે.',
      generalHi: 'वित्तीय योजना पर ध्यान दें। वाणी पर संयम रखने से पारिवारिक विवाद टलेंगे।',
      generalEn: 'Focus on financial planning today. Patience in speech helps maintain harmony.',
      positiveGu: 'ધૈર્ય અને કુશળતાથી પડકારોનો સામનો કરશો. કલાત્મક કાર્યોમાં સફળતા મળશે.',
      negativeGu: 'જિદ્દી વલણ ટાળો. બીજાના દ્રષ્ટિકોણને પણ સમજવાનો પ્રયત્ન કરો.',
      businessGu: 'વેપારમાં સ્થિરતા જળવાઈ રહેશે. નાણાકીય લેવડ-દેવડમાં સાવધાની રાખવી.',
      loveGu: 'દાંપત્યજીવનમાં પરસ્પર વિશ્વાસ વધશે. જૂની ગેરસમજ દૂર થશે.',
      healthGu: 'ગળા અને આંખ સંબંધિત નાની સમસ્યા થઈ શકે છે. આરામ કરવો.',
      luckyColorGu: 'સફેદ / ચાંદી',
      luckyColorEn: 'White / Silver',
      luckyNum: 6,
    },
    {
      generalGu: 'આજે અચાનક ધનલાભ થવાના યોગ બની રહ્યા છે. પ્રોપર્ટી સંબંધિત નિર્ણયો ફાયદાકારક રહેશે.',
      generalHi: 'आज अचानक धन लाभ के योग बन रहे हैं। प्रॉपर्टी संबंधित निर्णय फायदेमंद रहेंगे।',
      generalEn: 'Favorable planetary transit brings financial gains and growth.',
      positiveGu: 'પરિવારનું વાતાવરણ આનંદદાયક રહેશે. નવી વસ્તુઓની ખરીદી થઈ શકે છે.',
      negativeGu: 'આળસનો ત્યાગ કરો અને સમયસર કામ પૂર્ણ કરો.',
      businessGu: 'નવા વેપારી સંપર્કો બનશે જે ભવિષ્યમાં ખૂબ ફાયદો કરાવશે.',
      loveGu: 'પાર્ટનર સાથે રોમેન્ટિક ડિનર કે આઉટિંગનું આયોજન થઈ શકે છે.',
      healthGu: 'ખાનપાનમાં પૌષ્ટિક આહાર લેવો. વજન નિયંત્રણમાં રાખવું.',
      luckyColorGu: 'ગુલાબી / ક્રીમ',
      luckyColorEn: 'Pink / Cream',
      luckyNum: 2,
    },
  ],
  gemini: [
    {
      generalGu: 'બૌદ્ધિક ક્ષમતા અને સંચાર કૌશલ્યથી દરેક ક્ષેત્રમાં પ્રભાવ જમાવી શકશો. નવી મુસાફરીના યોગ છે.',
      generalHi: 'बौद्धिक क्षमता और संचार कौशल से सफलता प्राप्त होगी। यात्रा के योग हैं।',
      generalEn: 'Intellect and communication skills shine today. Good time for short travels.',
      positiveGu: 'વિદ્યાર્થીઓ અને સંશોધકો માટે ઉત્તમ દિવસ છે. સામાજિક વર્તુળ વધશે.',
      negativeGu: 'એકસાથે ઘણા બધા કાર્યો હાથમાં ન લેવા. ધ્યાન કેન્દ્રિત કરો.',
      businessGu: 'માર્કેટિંગ અને ટેકનોલોજી આધારિત વેપારમાં વિશેષ નફો થશે.',
      loveGu: 'મિત્રતા પ્રેમમાં પરિવર્તિત થઈ શકે છે. સંબંધોમાં તાજગી આવશે.',
      healthGu: 'શ્વસનતંત્ર અને ઊંઘનું ધ્યાન રાખવું. હળવી કસરત કરવી.',
      luckyColorGu: 'લીલો / પોપટી',
      luckyColorEn: 'Green / Light Green',
      luckyNum: 5,
    },
  ],
  cancer: [
    {
      generalGu: 'આજે તમારી આંતરપ્રજ્ઞા પર વિશ્વાસ રાખો. પરિવાર સાથે શાંતિપૂર્ણ સમય વિતાવવો લાભદાયી રહેશે.',
      generalHi: 'आज अपनी अंतरात्मा की आवाज सुनें। परिवार के साथ सुखद समय व्यतीत होगा।',
      generalEn: 'Trust your intuition today. Family bonding brings happiness and peace.',
      positiveGu: 'ભાવનાત્મક મજબૂતી મળશે. જરૂરિયાતમંદોને મદદ કરવાની ભાવના વધશે.',
      negativeGu: 'અતિસંવેદનશીલતાથી બચો. નાની નાની વાતોને દિલ પર ન લેવી.',
      businessGu: 'મકાન, વાહન કે જમીન સંબંધિત કાર્યોમાં પ્રગતિ જોવા મળશે.',
      loveGu: 'જીવનસાથી સાથે ભાવનાત્મક નિકટતા વધશે. પરસ્પર સ્નેહ રહેશે.',
      healthGu: 'પાચનતંત્રનું ધ્યાન રાખવું અને પૂરતું પાણી પીવું.',
      luckyColorGu: 'દૂધિયું સફેદ / મોતી',
      luckyColorEn: 'Milky White / Pearl',
      luckyNum: 2,
    },
  ],
  leo: [
    {
      generalGu: 'આજે નેતૃત્વ ગુણો ખીલી ઉઠશે. કાર્યક્ષેત્રમાં માન-સન્માન અને પદ-પ્રતિષ્ઠામાં વૃદ્ધિ થશે.',
      generalHi: 'आज नेतृत्व गुण निखरेंगे। कार्यक्षेत्र में मान-सम्मान और प्रतिष्ठा बढ़ेगी।',
      generalEn: 'Leadership qualities take center stage. Career recognition and respect grow.',
      positiveGu: 'આત્મવિશ્વાસ વધશે. મુશ્કેલ કાર્યો પણ સરળતાથી પૂર્ણ કરી શકશો.',
      negativeGu: 'અહંકારથી દૂર રહો. સાથી કર્મચારીઓનો સહયોગ લેવો જરૂરી છે.',
      businessGu: 'મોટા સોદાઓ સફળ થવાની શક્યતા છે. સરકારી યોજનાઓથી લાભ થશે.',
      loveGu: 'પ્રેમ જીવનમાં ઉત્સાહ અને આનંદ રહેશે. સાથી તરફથી સરપ્રાઈઝ મળી શકે છે.',
      healthGu: 'હૃદય અને બ્લડ પ્રેશરની તપાસ કરાવવી. વધારે તડકામાં ન ફરવું.',
      luckyColorGu: 'સુવર્ણ / નારંગી',
      luckyColorEn: 'Gold / Orange',
      luckyNum: 1,
    },
  ],
  virgo: [
    {
      generalGu: 'કામની બારીકીઓ પર ધ્યાન આપવાથી યશ મળશે. આયોજનબદ્ધ રીતે આગળ વધવું ફાયદાકારક રહેશે.',
      generalHi: 'काम की बारीकियों पर ध्यान देने से यश मिलेगा। व्यवस्थित योजना सफल होगी।',
      generalEn: 'Attention to detail brings success. Systematic planning yields great results.',
      positiveGu: 'વિશ્લેષણાત્મક વિચારસરણીથી જટિલ સમસ્યાઓનો સરળ ઉકેલ મળશે.',
      negativeGu: 'અતિ ટીકાત્મક વલણ ટાળવું. અન્યની ભૂલોને માફ કરતા શીખો.',
      businessGu: 'નાણાકીય હિસાબ-કિતાબમાં ચોકસાઈ રાખવી. રોકાણ માટે સારો સમય છે.',
      loveGu: 'જીવનસાથી સાથે ખુલ્લા મને વાતચીત કરો. ગેરસમજણો દૂર થશે.',
      healthGu: 'પેટની તકલીફથી સાચવવું. તાજો અને સાત્વિક આહાર લેવો.',
      luckyColorGu: 'પીરોજી / ઘાટો લીલો',
      luckyColorEn: 'Turquoise / Dark Green',
      luckyNum: 5,
    },
  ],
  libra: [
    {
      generalGu: 'જીવનમાં સંતુલન જાળવી રાખવું જરૂરી છે. વેપારમાં ભાગીદારીથી આર્થિક ફાયદો થઈ શકે છે.',
      generalHi: 'जीवन में संतुलन बनाए रखना जरूरी है। साझेदारी के व्यापार में लाभ होगा।',
      generalEn: 'Harmony and balance are key today. Partnership ventures flourish.',
      positiveGu: 'કૂટનીતિક વ્યવહારથી વિવાદો શાંત થશે. ન્યાયપ્રિય નિર્ણય લેવાશે.',
      negativeGu: 'નિર્ણય લેવામાં અનિશ્ચિતતા ટાળો. સમયસર પગલાં ભરો.',
      businessGu: 'કલા, ફેશન, આર્કિટેક્ચર અને લીગલ ફિલ્ડમાં બમ્પર નફો થશે.',
      loveGu: 'દાંપત્યજીવનમાં રોમાન્સ અને સમજણ વધશે. સંબંધો ગાઢ બનશે.',
      healthGu: 'કિડની અને સ્કિનની કાળજી લેવી. યોગાસન કરવા.',
      luckyColorGu: 'આકાશી વાદળી / સફેદ',
      luckyColorEn: 'Sky Blue / White',
      luckyNum: 6,
    },
  ],
  scorpio: [
    {
      generalGu: 'મક્કમ નિર્ણય શક્તિ તમને મુશ્કેલીઓમાંથી બહાર લાવશે. ગહન અભ્યાસમાં રુચિ વધશે.',
      generalHi: 'दृढ़ इच्छाशक्ति से समस्याओं का समाधान होगा। गुप्त विद्याओं में रुचि बढ़ेगी।',
      generalEn: 'Determination and inner strength help overcome obstacles with ease.',
      positiveGu: 'રિસર્ચ અને તપાસ સંબંધિત કાર્યોમાં મોટી સફળતા પ્રાપ્ત થશે.',
      negativeGu: 'શંકાસ્પદ સ્વભાવ ટાળવો. અંગત બાબતો ગુપ્ત રાખવી.',
      businessGu: 'જોખમી રોકાણોથી દૂર રહેવું. જૂના દેવા ચૂકવવામાં રાહત મળશે.',
      loveGu: 'પ્રેમી સાથે ગાઢ સ્નેહ અનુભવાશે. એકબીજા પ્રત્યે વફાદારી વધશે.',
      healthGu: 'થાક અને નબળાઈ અનુભવાય તો પૂરતો આરામ લેવો.',
      luckyColorGu: 'મરૂન / કથ્થઈ',
      luckyColorEn: 'Maroon / Brown',
      luckyNum: 9,
    },
  ],
  sagittarius: [
    {
      generalGu: 'આશાવાદી વલણ તમારા કાર્યોને સફળ બનાવશે. આધ્યાત્મિકતા તરફ રસ વધવાથી માનસિક શાંતિ મળશે.',
      generalHi: 'सकारात्मक दृष्टिकोण कार्यों को सफल बनाएगा। आध्यात्मिक शांति मिलेगी।',
      generalEn: 'Optimism guides your steps. Spiritual activities bring peace of mind.',
      positiveGu: 'ઉચ્ચ શિક્ષણ અને વિદેશ સંબંધિત કાર્યોમાં પ્રગતિના ઉત્તમ સંકેત છે.',
      negativeGu: 'અતિ ઉત્સાહમાં આવીને વચનો ન આપવા. વ્યવહારુ રહેવું.',
      businessGu: 'ટ્રાવેલ, એજ્યુકેશન અને કન્સલ્ટિંગ ક્ષેત્રે મોટો નફો થશે.',
      loveGu: 'જીવનસાથી સાથે ધાર્મિક યાત્રાનું આયોજન થઈ શકે છે.',
      healthGu: 'લીવર અને જાંઘના દુખાવાથી સાવચેત રહેવું. નિયમિત ચાલવું.',
      luckyColorGu: 'પીળો / સોનેરી',
      luckyColorEn: 'Yellow / Golden',
      luckyNum: 3,
    },
  ],
  capricorn: [
    {
      generalGu: 'મહેનતનું ફળ મળવાની શરૂઆત થશે. શિસ્તબદ્ધ રહીને લાંબા ગાળાના આયોજન પર ધ્યાન કેન્દ્રિત કરો.',
      generalHi: 'कड़ी मेहनत का फल मिलेगा। अनुशासन और दीर्घकालिक योजना पर ध्यान दें।',
      generalEn: 'Hard work bears sweet fruit. Disciplined focus leads to long-term success.',
      positiveGu: 'કાર્યક્ષેત્રે વરિષ્ઠ અધિકારીઓની પ્રશંસા મળશે. સ્થાવર મિલકત વધશે.',
      negativeGu: 'વધુ પડતો કામનો બોજ ન લેવો. પરિવાર માટે પણ સમય ફાળવો.',
      businessGu: 'કન્સ્ટ્રક્શન, માઈનિંગ અને મેન્યુફેક્ચરિંગમાં સારો વિકાસ થશે.',
      loveGu: 'પરિવારના વડીલોના આશીર્વાદ મળશે. સંબંધોમાં ગંભીરતા રહેશે.',
      healthGu: 'હાડકાં અને સાંધાના દુખાવાની કાળજી લેવી. કેલ્શિયમયુક્ત આહાર લેવો.',
      luckyColorGu: 'બ્લુ / ગ્રે',
      luckyColorEn: 'Blue / Slate Gray',
      luckyNum: 8,
    },
  ],
  aquarius: [
    {
      generalGu: 'સંપર્કોની નવી શ્રેણી ખુલશે. વેપારના વિસ્તરણ માટે બૌદ્ધિક ક્ષમતાનો ઉપયોગ કરવો હિતાવહ છે.',
      generalHi: 'नए संपर्कों का विस्तार होगा। नवप्रवर्तन और नवाचार से लाभ होगा।',
      generalEn: 'New networks open up. Innovation and social intellect bring great wins.',
      positiveGu: 'સમાજસેવા અને જનહિતના કાર્યોથી યશ-કીર્તિમાં વધારો થશે.',
      negativeGu: 'વિચારોની અસ્થિરતા ટાળવી. એક લક્ષ્ય પર અડગ રહેવું.',
      businessGu: 'આઈટી, સોશિયલ મીડિયા અને સ્ટાર્ટઅપ બિઝનેસમાં બમ્પર ગ્રોથ મળશે.',
      loveGu: 'મિત્રવર્તુળ સાથે મનોરંજક પળો વિતાવશો. સાથી સાથે મૈત્રીપૂર્ણ સંબંધ રહેશે.',
      healthGu: 'પગની ઘૂંટી અને નર્વસ સિસ્ટમનું ધ્યાન રાખવું. યોગ કરવો.',
      luckyColorGu: 'જાંબલી / નેવી બ્લુ',
      luckyColorEn: 'Purple / Navy Blue',
      luckyNum: 4,
    },
  ],
  pisces: [
    {
      generalGu: 'માનસિક અને ભાવનાત્મક ક્ષેત્રે રાહત અનુભવાશે. કલ્પનાશક્તિ અને સર્જનાત્મકતામાં વધારો થશે.',
      generalHi: 'मानसिक और भावनात्मक शांति मिलेगी। रचनात्मकता में वृद्धि होगी।',
      generalEn: 'Emotional healing and creative clarity flourish today. Favorable day.',
      positiveGu: 'દાન-પુણ્ય અને પરોપકારના કાર્યોમાં આનંદ મળશે. આર્થિક મુશ્કેલીઓ હળવી થશે.',
      negativeGu: 'કાલ્પનિક દુનિયામાંથી બહાર આવી વાસ્તવિકતાનો સ્વીકાર કરવો.',
      businessGu: 'વિદેશી વેપાર અને જળ સંબંધિત પ્રોડક્ટ્સમાં મોટો ફાયદો થશે.',
      loveGu: 'પ્રેમ સંબંધોમાં નિઃસ્વાર્થ લાગણી વધશે. સાથીદારનો પૂર્ણ સહકાર મળશે.',
      healthGu: 'ઊંઘ પૂરતી લેવી. મેડિટેશન કરવાથી માનસિક તાજગી મળશે.',
      luckyColorGu: 'કેસરિયો / પીળો',
      luckyColorEn: 'Saffron / Light Yellow',
      luckyNum: 7,
    },
  ],
};

/**
 * Get daily date seed (changes precisely at midnight IST)
 */
function getDailySeed(date = new Date()): number {
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(date.getTime() + istOffset);
  const year = istDate.getUTCFullYear();
  const startOfYear = new Date(Date.UTC(year, 0, 1));
  const dayOfYear = Math.floor((istDate.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  return year * 366 + dayOfYear;
}

/**
 * Get formatted Gujarati date
 */
function getFormattedGujaratiDate(date = new Date()): { en: string; gu: string; hi: string } {
  const daysGu = ['રવિવાર', 'સોમવાર', 'મંગળવાર', 'બુધવાર', 'ગુરુવાર', 'શુક્રવાર', 'શનિવાર'];
  const daysHi = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
  const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const monthsGu = ['જાન્યુઆરી', 'ફેબ્રુઆરી', 'માર્ચ', 'એપ્રિલ', 'મે', 'જૂન', 'જુલાઈ', 'ઓગસ્ટ', 'સપ્ટેમ્બર', 'ઓક્ટોબર', 'નવેમ્બર', 'ડિસેમ્બર'];
  const monthsHi = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
  const monthsEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const dayOfWeek = date.getDay();
  const dayNum = date.getDate();
  const monthNum = date.getMonth();
  const year = date.getFullYear();

  return {
    gu: `${daysGu[dayOfWeek]}, ${dayNum} ${monthsGu[monthNum]} ${year}`,
    hi: `${daysHi[dayOfWeek]}, ${dayNum} ${monthsHi[monthNum]} ${year}`,
    en: `${daysEn[dayOfWeek]}, ${dayNum} ${monthsEn[monthNum]} ${year}`,
  };
}

/**
 * Generate complete daily astrology predictions for all 12 Zodiac signs.
 */
export function getDailyAstrologySigns(): AstrologySignData[] {
  const now = new Date();
  const seed = getDailySeed(now);
  const dateFormatted = getFormattedGujaratiDate(now);

  return ZODIAC_METADATA.map((meta, index) => {
    const templates = PREDICTION_TEMPLATES[meta.id] || PREDICTION_TEMPLATES.aries;
    const templateIndex = (seed + index) % templates.length;
    const t = templates[templateIndex];

    // Dynamic lucky numbers rotation based on seed
    const luckyNum = ((t.luckyNum + (seed % 9)) % 9) || 9;
    const rating = Math.min(5, Math.max(3.5, 4 + ((seed + index) % 3) * 0.5));

    return {
      id: meta.id,
      slug: meta.slug,
      name: meta.name,
      nameGu: meta.nameGu,
      nameHi: meta.nameHi,
      lettersGu: meta.lettersGu,
      image: `/assets/zodiac/${meta.id}.svg`,
      prediction: t.generalEn,
      predictionGu: t.generalGu,
      predictionHi: t.generalHi,
      luckyNumber: luckyNum,
      luckyColor: t.luckyColorEn,
      luckyColorGu: t.luckyColorGu,
      rating,
      date: dateFormatted.en,
      dateGu: dateFormatted.gu,
      dateHi: dateFormatted.hi,
      detailsJson: {
        moonSign: {
          positive: t.positiveGu,
          negative: t.negativeGu,
          business: t.businessGu,
          love: t.loveGu,
          health: t.healthGu,
          luckyColor: t.luckyColorGu,
          luckyNumber: `${luckyNum}, ${((luckyNum + 3) % 9) || 9}`,
        },
        tarot: {
          cardName: 'The Wheel of Fortune (ભાગ્ય ચક્ર)',
          prediction: t.generalGu,
          luckyColor: t.luckyColorGu,
          luckyNumber: `${luckyNum}`,
        },
      },
    };
  });
}

// In-memory cache for live public external horoscope data (1-hour TTL)
let cachedLiveSigns: AstrologySignData[] | null = null;
let lastCacheDate: string = '';
let lastFetchTimestamp: number = 0;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 Hour

/**
 * Translate English text to target language using free Google Translate API.
 * Falls back to original text on error or timeout.
 */
async function translateText(text: string, targetLang: 'gu' | 'hi'): Promise<string> {
  try {
    const encoded = encodeURIComponent(text);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encoded}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) return text;
    const data = (await response.json()) as any;
    // Google Translate returns nested arrays: data[0] = [[translatedChunk, originalChunk, ...], ...]
    const translated = (data[0] as any[])
      .map((chunk: any) => (chunk[0] as string) || '')
      .join('')
      .trim();
    return translated || text;
  } catch {
    return text;
  }
}

/**
 * Fetches live daily astrology data from free public external API (horoscope-app-api)
 * with automatic translation to Gujarati & Hindi and fallback to local Vedic engine.
 */
export async function fetchLiveDailyAstrologySigns(): Promise<AstrologySignData[]> {
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  const isCacheValid =
    cachedLiveSigns &&
    lastCacheDate === todayStr &&
    Date.now() - lastFetchTimestamp < CACHE_TTL_MS;

  if (isCacheValid && cachedLiveSigns) {
    return cachedLiveSigns;
  }

  // Base fallback signs from local calculation
  const fallbackSigns = getDailyAstrologySigns();

  try {
    // Fetch live horoscope data for all 12 signs in parallel from free public API
    const fetchPromises = ZODIAC_METADATA.map(async (meta, index) => {
      const fallback = fallbackSigns[index];
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout

        const response = await fetch(
          `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${meta.id}&day=TODAY`,
          { signal: controller.signal }
        );
        clearTimeout(timeoutId);

        if (!response.ok) return fallback;
        const result = (await response.json()) as any;

        if (result?.data?.horoscope) {
          const liveText = result.data.horoscope.trim();

          // Translate same live English text to Gujarati & Hindi in parallel
          const [horoscopeGu, horoscopeHi] = await Promise.all([
            translateText(liveText, 'gu'),
            translateText(liveText, 'hi'),
          ]);

          return {
            ...fallback,
            prediction: liveText,
            predictionGu: horoscopeGu,
            predictionHi: horoscopeHi,
            horoscope: liveText,
            horoscopeGu,
            horoscopeHi,
            period: result.data.period || 'daily',
            apiDate: result.data.date || now.toISOString().split('T')[0],
          };
        }
      } catch {
        // Fallback gracefully on timeout or network error
      }
      return fallback;
    });

    const liveSigns = await Promise.all(fetchPromises);
    cachedLiveSigns = liveSigns;
    lastCacheDate = todayStr;
    lastFetchTimestamp = Date.now();
    return liveSigns;
  } catch (error) {
    console.warn('External public horoscope fetch encountered error, using Vedic fallback:', error);
    return fallbackSigns;
  }
}

