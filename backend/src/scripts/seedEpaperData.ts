import dotenv from 'dotenv';
dotenv.config();
import { prisma } from '../config/prisma.js';
import { ensureEPaperTablesExist } from '../controllers/epaper.controller.js';

interface SeedArticleDef {
  slug: string;
  title: string;
  titleGu: string;
  excerptGu: string;
  contentGu: string;
  printHeadline: string;
  printSubheadline?: string;
  printSummary: string;
  photoCredit: string;
  byline: string;
  location: string;
  categorySlug: string;
  categoryName: string;
  categoryNameGu: string;
  primarySection: string;
  featuredImage: string;
  ePaperPosition: 'lead' | 'secondary' | 'standard' | 'brief';
}

const SEED_ARTICLES: SeedArticleDef[] = [
  // 1. FRONT PAGE (Page 1)
  {
    slug: 'gujarat-vibrant-development-mission-2026',
    title: 'Gujarat Launches Mega Development Projects for Cities and Rural Areas',
    titleGu: 'ગુજરાત સરકાર દ્વારા શહેરી અને ગ્રામીણ વિકાસ માટે ₹૨૫,૦૦૦ કરોડના મેગા પ્રોજેક્ટ્સની જાહેરાત',
    excerptGu: 'રાજ્યના તમામ મહાનગરો અને જિલ્લાઓમાં માળખાકીય સુવિધાઓ, રસ્તા અને જળ વ્યવસ્થાપન માટે ઐતિહાસિક ફાળવણી.',
    contentGu: 'ગુજરાતના સર્વાંગી વિકાસને નવી ઊંચાઈએ પહોંચાડવા માટે કેબિનેટ બેઠકમાં ઐતિહાસિક નિર્ણયો લેવાયા છે. રાજ્યના ૩૩ જિલ્લાઓમાં તબક્કાવાર નવા રસ્તા, ઓવરબ્રિજ, આધુનિક બસ સ્ટેશનો અને પીવાના શુદ્ધ પાણીના પ્રોજેક્ટ્સ શરૂ કરવામાં આવશે. મુખ્યમંત્રીએ અધિકારીઓને ગુણવત્તા સાથે સમયમર્યાદામાં કામગીરી પૂર્ણ કરવા કડક સૂચના આપી છે.',
    printHeadline: 'ગુજરાત વિકાસ પથ પર: ₹૨૫,૦૦૦ કરોડના મેગા પ્રોજેક્ટ્સને લીલીઝંડી',
    printSubheadline: 'તમામ ૩૩ જિલ્લાઓમાં આધુનિક માળખાકીય સુવિધાઓ અને જળ વ્યવસ્થાપન પ્રોજેક્ટ્સ',
    printSummary: 'રાજ્ય કેબિનેટ દ્વારા ગુજરાતના શહેરી અને ગ્રામીણ વિસ્તારોના સર્વાંગી વિકાસ માટે ₹૨૫,૦૦૦ કરોડની માતબર રકમના પ્રોજેક્ટ્સ મંજૂર કરવામાં આવ્યા છે. માર્ગ-મકાન અને જળ વ્યવસ્થાપન પર વિશેષ ભાર મૂકવામાં આવ્યો છે.',
    photoCredit: 'તસવીર: માહિતી વિભાગ, ગાંધીનગર - ગુજરાત પોસ્ટ',
    byline: 'વિશેષ સંવાદદાતા • ગાંધીનગર',
    location: 'ગાંધીનગર',
    categorySlug: 'breaking-news',
    categoryName: 'Breaking News',
    categoryNameGu: 'મુખ્ય સમાચાર',
    primarySection: 'front_page',
    featuredImage: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=900&auto=format&fit=crop&q=80',
    ePaperPosition: 'lead',
  },

  // 2. LOCAL CITY (Page 2)
  {
    slug: 'ahmedabad-smart-city-metro-expansion-phase-3',
    title: 'Ahmedabad Metro Phase 3 and New Riverfront Extension Approved',
    titleGu: 'અમદાવાદ મેટ્રો ફેઝ-૩ અને રિવરફ્રન્ટ વિસ્તરણ યોજનાને મનપા અને સરકારની મંજૂરી',
    excerptGu: 'પૂર્વ અને પશ્ચિમ અમદાવાદને જોડતા નવા રૂટથી રોજના લાખો મુસાફરોને મળશે ઝડપી મુસાફરીની સુવિધા.',
    contentGu: 'અમદાવાદ મહાનગરપાલિકા (AMC) અને ગુજરાત મેટ્રો રેલ કોર્પોરેશન દ્વારા શહેરના પૂર્વ અને પશ્ચિમ વિસ્તારોને જોડતા ફેઝ-૩ પ્રોજેક્ટની રૂપરેખા તૈયાર કરાઈ છે. સાબરમતી રિવરફ્રન્ટના ફેઝ-૩ અંતર્ગત નવા ગ્રીન બેલ્ટ અને સાયકલ ટ્રેક વિકસાવવામાં આવશે.',
    printHeadline: 'અમદાવાદ મેટ્રો ફેઝ-૩: પૂર્વ-પશ્ચિમ વિસ્તારને જોડતો નવો રૂટ મંજૂર',
    printSummary: 'અમદાવાદના નાગરિકો માટે ટ્રાફિક મુક્ત મુસાફરી સુનિશ્ચિત કરવા મેટ્રો ફેઝ-૩ અને રિવરફ્રન્ટ વિસ્તરણની કામગીરી પુરજોશમાં શરૂ કરવામાં આવી છે.',
    photoCredit: 'તસવીર: અમદાવાદ બ્યુરો - ગુજરાત પોસ્ટ',
    byline: 'સિટી સ્ટાફ રિપોર્ટર',
    location: 'અમદાવાદ',
    categorySlug: 'ahmedabad',
    categoryName: 'Ahmedabad',
    categoryNameGu: 'અમદાવાદ',
    primarySection: 'local_city',
    featuredImage: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&auto=format&fit=crop&q=80',
    ePaperPosition: 'lead',
  },

  // 3. GUJARAT STATE (Page 3)
  {
    slug: 'saurashtra-sauni-yojana-dams-overflow',
    title: 'Sauni Yojana Fills 115 Dams in Saurashtra Ensuring Water Security',
    titleGu: 'સૌની યોજનાથી સૌરાષ્ટ્રના ૧૧૫ જળાશયો છલકાયા: ખેડૂતોમાં ભારે હર્ષોલ્લાસ',
    excerptGu: 'નર્મદાના નીરથી સૌરાષ્ટ્ર અને કચ્છના ખેડૂતોને સિંચાઈ અને પીવાના પાણીની કાયમી રાહત.',
    contentGu: 'રાજ્ય સરકારની મહત્ત્વાકાંક્ષી સૌની યોજના થકી સૌરાષ્ટ્રના રાજકોટ, જામનગર, ભાવનગર અને જૂનાગઢ જિલ્લાના ૧૧૫ મુખ્ય ડેમોમાં નર્મદાના પૂરતા પાણી પહોંચાડાયા છે. ખરીફ અને રવિ પાક માટે ખેડૂતોને પૂરતું સિંચાઈનું પાણી મળશે.',
    printHeadline: 'સૌરાષ્ટ્રમાં જળક્રાંતિ: સૌની યોજનાથી ૧૧૫ ડેમ છલકાયા',
    printSummary: 'સૌરાષ્ટ્રના ખેડૂતો માટે ખુશીના સમાચાર. નર્મદાના નીરથી તમામ મુખ્ય જળાશયો ભરાતા સિંચાઈ અને પીવાના પાણીની સમસ્યાનું કાયમી નિરાકરણ આવ્યું છે.',
    photoCredit: 'તસવીર: રાજકોટ બ્યુરો - ગુજરાત પોસ્ટ',
    byline: 'રાજ્ય સંવાદદાતા • રાજકોટ',
    location: 'રાજકોટ',
    categorySlug: 'gujarat',
    categoryName: 'Gujarat',
    categoryNameGu: 'ગુજરાત સમાચાર',
    primarySection: 'state_gujarat',
    featuredImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
    ePaperPosition: 'lead',
  },

  // 4. NATIONAL (Page 4)
  {
    slug: 'india-economic-growth-infrastructure-boost-2026',
    title: 'India GDP Growth Hits 7.8% Driven by Infrastructure and Manufacturing',
    titleGu: 'ભારતનો જીડીપી વૃદ્ધિદર ૭.૮% નોંધાયો: ઈન્ફ્રાસ્ટ્રક્ચર અને મેન્યુફેક્ચરિંગમાં ભારે ઉછાળો',
    excerptGu: 'વિશ્વની સૌથી ઝડપથી વિકસતી મોટી અર્થવ્યવસ્થા તરીકે ભારતે પોતાની સ્થિતિ વધુ મજબૂત બનાવી.',
    contentGu: 'કેન્દ્રીય આંકડાકીય કચેરી દ્વારા જાહેર કરાયેલા તાજા ત્રિમાસિક આંકડા અનુસાર ભારતનો જીડીપી ગ્રોથ રેટ ૭.૮% પર પહોંચ્યો છે. હાઈવે, રેલવે, સેમિકન્ડક્ટર અને સંરક્ષણ ઉત્પાદન ક્ષેત્રે થયેલા જંગી રોકાણના કારણે અર્થતંત્રને મોટું બળ મળ્યું છે.',
    printHeadline: 'ભારતીય અર્થતંત્રની હરણફાળ: જીડીપી ગ્રોથ ૭.૮% ની નવી ઊંચાઈએ',
    printSummary: 'વૈશ્વિક મંદી વચ્ચે ભારતીય અર્થતંત્રે ઉત્કૃષ્ટ દેખાવ જાળવી રાખ્યો છે. ઉત્પાદન અને સેવા ક્ષેત્રે નવી રોજગારી અને તેજી જોવા મળી છે.',
    photoCredit: 'તસવીર: પીટીઆઈ, નવી દિલ્હી',
    byline: 'વિશેષ બ્યુરો • નવી દિલ્હી',
    location: 'નવી દિલ્હી',
    categorySlug: 'national',
    categoryName: 'National',
    categoryNameGu: 'રાષ્ટ્રીય સમાચાર',
    primarySection: 'national_india',
    featuredImage: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=800&auto=format&fit=crop&q=80',
    ePaperPosition: 'lead',
  },

  // 5. WORLD (Page 5)
  {
    slug: 'global-climate-and-clean-energy-summit-accord',
    title: 'Historic Clean Energy Accord Signed at Global Climate Summit',
    titleGu: 'ગ્લોબલ ક્લાઈમેટ સમિટમાં સ્વચ્છ ઊર્જા અને ગ્રીન હાઈડ્રોજન અંગે ઐતિહાસિક કરાર',
    excerptGu: 'વિશ્વના ૧૨૦ દેશોએ કાર્બન ઉત્સર્જન ઘટાડવા અને સૌર-પવન ઊર્જા વધારવા સહમતિ દર્શાવી.',
    contentGu: 'વોશિંગ્ટન અને જીનીવા ખાતે મળેલી આંતરરાષ્ટ્રીય ઊર્જા પરિષદમાં ગ્રીન હાઈડ્રોજન અને રિન્યુએબલ એનર્જીના ઉપયોગને વેગ આપવા સંયુક્ત ઘોષણાપત્ર બહાર પાડવામાં આવ્યું છે. ભારતના સૌર ઊર્જા મિશનની વૈશ્વિક નેતાઓ દ્વારા સરાહના કરાઈ.',
    printHeadline: 'ગ્લોબલ ક્લાઇમેટ સમિટ: સ્વચ્છ ઊર્જા માટે ૧૨૦ દેશોનો ઐતિહાસિક કરાર',
    printSummary: 'વિશ્વભરમાં પ્રદૂષણ મુક્ત ઊર્જાના ઉત્પાદન માટે સંયુક્ત ફંડ અને તકનીકી આદાનપ્રદાન માટે મોટી સહમતિ સધાઈ છે.',
    photoCredit: 'તસવીર: રોઇટર્સ / એપી',
    byline: 'ગ્લોબલ ડેસ્ક',
    location: 'વોશિંગ્ટન',
    categorySlug: 'world',
    categoryName: 'World',
    categoryNameGu: 'વિશ્વ સમાચાર',
    primarySection: 'world_international',
    featuredImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    ePaperPosition: 'lead',
  },

  // 6. BUSINESS (Page 6)
  {
    slug: 'sensex-nifty-record-high-bull-run',
    title: 'Sensex Crosses 81,700 and Nifty Touches 25,000 in Historic Bull Run',
    titleGu: 'શેરબજારમાં વિક્રમી તેજી: સેન્સેક્સ ૮૧,૭૦૦ અને નિફ્ટી ૨૫,૦૦૦ની સર્વોચ્ચ સપાટીએ',
    excerptGu: 'સ્થાનિક રોકાણકારો અને એફઆઈઆઈની જોરદાર લેવાલીથી માર્કેટ કેપિટલાઇઝેશનમાં ₹૪ લાખ કરોડનો વધારો.',
    contentGu: 'ભારતીય શેરબજારમાં રોકાણકારોનો ઉત્સાહ ચરમસીમાએ પહોંચ્યો છે. આઈટી, બેન્કિંગ, ઓટોમોબાઈલ અને રિન્યુએબલ એનર્જી શેરોમાં થયેલી ખરીદીના જોરે સેન્સેક્સ ૮૧,૭૩૫ પોઈન્ટે બંધ રહ્યો. નિફ્ટી ૨૫,૦૦૦ ના મનોવૈજ્ઞાનિક સ્તરને પાર કરી ગયો.',
    printHeadline: 'દલાલ સ્ટ્રીટમાં જશ્ન: સેન્સેક્સ અને નિફ્ટી ઓલ-ટાઈમ હાઈ સપાટીએ',
    printSummary: 'ભારતીય કંપનીઓના મજબૂત ત્રિમાસિક પરિણામો અને આર્થિક સ્થિરતાના જોરે બજારમાં અવિરત તેજીનો માહોલ યથાવત રહ્યો છે.',
    photoCredit: 'તસવીર: માર્કેટ બ્યુરો, મુંબઈ',
    byline: 'બિઝનેસ ડેસ્ક • મુંબઈ',
    location: 'મુંબઈ',
    categorySlug: 'business',
    categoryName: 'Business',
    categoryNameGu: 'બિઝનેસ & માર્કેટ',
    primarySection: 'business_market',
    featuredImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    ePaperPosition: 'lead',
  },

  // 7. SPORTS (Page 7)
  {
    slug: 'team-india-historic-cricket-series-victory',
    title: 'Team India Clinches Thrilling Cricket Series in Final Over Nail-Biter',
    titleGu: 'અંતિમ ઓવરના રોમાંચક મુકાબલામાં ટીમ ઈન્ડિયાનો શાનદાર વિજય: શ્રેણી કબજે કરી',
    excerptGu: 'ઓલરાઉન્ડ પ્રદર્શનના જોરે ભારતીય ક્રિકેટ ટીમે પ્રશંસનીય રમત રજૂ કરી ટ્રોફી પોતાને નામ કરી.',
    contentGu: 'સ્ટેડિયમમાં ઉપસ્થિત ૫૦,૦૦૦થી વધુ દર્શકોની ઉત્સાહભરી હાજરી વચ્ચે ભારતીય ટીમે પ્રતિસ્પર્ધી ટીમને ૨૪ રને હરાવી શ્રેણી જીતી લીધી. બેટ્સમેનોની આક્રમક ભાગીદારી અને ડેથ ઓવર્સમાં બોલરોની ચુસ્ત બોલિંગ વિજયનું મુખ્ય કારણ બની.',
    printHeadline: 'ટીમ ઈન્ડિયાનો ભવ્ય વિજય: રોમાંચક મેચમાં શ્રેણી પોતાના નામે કરી',
    printSummary: 'અંતિમ દડો ફેંકાયો ત્યાં સુધી ચાલેલા હાઈ-વોલ્ટેજ ડ્રામામાં ભારતીય ટીમે સંયમપૂર્વક રમીને શાનદાર ટ્રોફી જીતી લીધી.',
    photoCredit: 'તસવીર: ગુજરાત પોસ્ટ સ્પોર્ટ્સ ડેસ્ક',
    byline: 'સ્પોર્ટ્સ બ્યુરો',
    location: 'અમદાવાદ',
    categorySlug: 'sports',
    categoryName: 'Sports',
    categoryNameGu: 'રમતગમત',
    primarySection: 'sports',
    featuredImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80',
    ePaperPosition: 'lead',
  },

  // 8. TECHNOLOGY (Page 8)
  {
    slug: 'india-semiconductor-ai-revolution-breakthrough',
    title: 'India Makes Giant Leaps in AI and Semiconductor Manufacturing',
    titleGu: 'આર્ટિફિશિયલ ઈન્ટેલિજન્સ અને સેમિકન્ડક્ટરમાં ભારતની વૈશ્વિક હરણફાળ',
    excerptGu: 'ગુજરાતના સાણંદ અને ધોલેરા ખાતે નવી સેમિકન્ડક્ટર ફેબ્રિકેશન સુવિધાઓ તૈયાર.',
    contentGu: 'ભારતના ટેકનોલોજી સેક્ટરમાં નવો ઈતિહાસ રચાઈ રહ્યો છે. સ્વદેશી એઆઈ મોડેલ્સ અને સેમિકન્ડક્ટર ચિપ્સના સ્થાનિક ઉત્પાદનથી ભારત હવે હાર્ડવેર અને સોફ્ટવેર બંનેમાં સ્વનિર્ભરતા તરફ આગળ વધી રહ્યું છે.',
    printHeadline: 'ટેક ક્રાંતિ: ભારતમાં સ્વદેશી એઆઈ અને ચિપ નિર્માણનો પ્રારંભ',
    printSummary: 'ધોલેરા અને સાણંદ સ્થિત નવા હાઈટેક સેમિકન્ડક્ટર પ્લાન્ટ્સથી દેશમાં હજારો ઉચ્ચ કૌશલ્યવાળી આઈટી જોબ્સ સર્જાશે.',
    photoCredit: 'તસવીર: ટેક લેબ રિપોર્ટ',
    byline: 'ટેકનોલોજી સંવાદદાતા',
    location: 'ગાંધીનગર',
    categorySlug: 'technology',
    categoryName: 'Technology',
    categoryNameGu: 'ટેક & વિજ્ઞાન',
    primarySection: 'technology',
    featuredImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    ePaperPosition: 'lead',
  },

  // 9. ENTERTAINMENT (Page 9)
  {
    slug: 'gujarati-cinema-new-wave-box-office-records',
    title: 'Gujarati Cinema Sets New Box Office Milestones with Powerful Storytelling',
    titleGu: 'ગુજરાતી સિનેમામાં નવો સુવર્ણ યુગ: અનોખી વાર્તાઓ સાથે બોક્સ ઓફિસ પર ધમાકો',
    excerptGu: 'આધુનિક વિષયો અને ઉત્કૃષ્ટ અભિનય સાથે ઢોલીવુડ ફિલ્મોને વૈશ્વિક દર્શકોનો પ્રેમ.',
    contentGu: 'ગુજરાતી ફિલ્મ ઉદ્યોગમાં કન્ટેન્ટ આધારિત સિનેમાનો મોટો પ્રભાવ જોવા મળી રહ્યો છે. પારિવારિક અને રહસ્યમય કથાવસ્તુ ધરાવતી ફિલ્મોએ બોક્સ ઓફિસ પર વિક્રમી કમાણી કરી છે. જાણીતા કલાકારોના અભિનયની ખૂબ પ્રશંસા થઈ રહી છે.',
    printHeadline: 'ગુજરાતી સિનેમાની નવી ઊંચાઈ: બોક્સ ઓફિસ પર દર્શકોનો અભૂતપૂર્વ પ્રતિસાદ',
    printSummary: 'સશક્ત સંવાદો અને અદભૂત સિનેમેટોગ્રાફીથી સજ્જ ગુજરાતી ફિલ્મોએ સિનેમાઘરોમાં હાઉસફુલ બોર્ડ લગાવી દીધા છે.',
    photoCredit: 'તસવીર: ગુજરાત પોસ્ટ એન્ટરટેઈનમેન્ટ',
    byline: 'સિનેમા ડેસ્ક',
    location: 'અમદાવાદ',
    categorySlug: 'entertainment',
    categoryName: 'Entertainment',
    categoryNameGu: 'મનોરંજન & સિનેમા',
    primarySection: 'entertainment',
    featuredImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
    ePaperPosition: 'lead',
  },

  // 10. LIFESTYLE (Page 10)
  {
    slug: 'ayurveda-yoga-and-holistic-wellness-living',
    title: 'Embracing Holistic Health: Ancient Ayurveda Meets Modern Daily Lifestyle',
    titleGu: 'સ્વસ્થ દીર્ઘાયુષ્ય માટે આયુર્વેદ, યોગ અને સાત્વિક આહારનો સુમેળભર્યો સમન્વય',
    excerptGu: 'માનસિક શાંતિ અને શારીરિક સ્વાસ્થ્ય માટે દિનચર્યામાં કુદરતી ઉપચારનું મહત્વ.',
    contentGu: 'આધુનિક જીવનશૈલીમાં વધી રહેલા તણાવ અને થાક સામે લડવા માટે લોકો ફરીથી પરંપરાગત આયુર્વેદિક ઉપચાર, ધ્યાન અને ઋતુચર્યા તરફ વળી રહ્યા છે. યોગ્ય ઊંઘ, પૂરતું પાણી અને સાત્વિક ઘરનો ખોરાક રોગપ્રતિકારક શક્તિ વધારે છે.',
    printHeadline: 'સુખી જીવનનું રહસ્ય: આયુર્વેદ અને સંતુલિત દિનચર્યાથી આરોગ્યની સુરક્ષા',
    printSummary: 'દૈનિક જીવનમાં સરળ ફેરફારો કરીને શરીરને રોગમુક્ત અને મનને પ્રફુલ્લિત રાખી શકાય છે.',
    photoCredit: 'તસવીર: વેલનેસ કેર',
    byline: 'આરોગ્ય માર્ગદર્શક',
    location: 'અમદાવાદ',
    categorySlug: 'lifestyle',
    categoryName: 'Lifestyle',
    categoryNameGu: 'લાઇફસ્ટાઇલ & આરોગ્ય',
    primarySection: 'lifestyle',
    featuredImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80',
    ePaperPosition: 'lead',
  },

  // 11. EDUCATION (Page 11)
  {
    slug: 'gujarat-board-university-new-education-curriculum',
    title: 'Gujarat Education Board Introduces Practical Skill-Based Learning',
    titleGu: 'ગુજરાત શિક્ષણ બોર્ડ દ્વારા શાળાઓ અને કોલેજોમાં પ્રાયોગિક સ્કીલ શિક્ષણનો પ્રારંભ',
    excerptGu: 'વિદ્યાર્થીઓમાં ક્રિએટિવિટી અને પ્રેક્ટિકલ નોલેજ વધારવા માટે નવા મોડ્યુલ્સ અમલી.',
    contentGu: 'શિક્ષણ વિભાગ દ્વારા ધોરણ ૯ થી ૧૨ સુધીના અભ્યાસક્રમમાં વોકેશનલ ટ્રેનિંગ અને કોમ્પ્યુટર કોડિંગનો સમાવેશ કરવામાં આવ્યો છે. વિદ્યાર્થીઓને ભવિષ્યની કારકિર્દી માટે સક્ષમ બનાવવાનો આ નિર્ણય અત્યંત આવકાર્ય બન્યો છે.',
    printHeadline: 'શિક્ષણમાં મોટો સુધારો: બોર્ડની શાળાઓમાં સ્કીલ-બેઝ્ડ અભ્યાસક્રમ શરૂ',
    printSummary: 'ગોખણપટ્ટી મુક્ત શિક્ષણ અને પ્રેક્ટિકલ લર્નિંગ પર ભાર મૂકીને વિદ્યાર્થીઓની પ્રતિભા ખીલવવાનો નવતર પ્રયાસ.',
    photoCredit: 'તસવીર: શિક્ષણ વિભાગ ગાંધીનગર',
    byline: 'શિક્ષણ વિશેષ સંવાદદાતા',
    location: 'ગાંધીનગર',
    categorySlug: 'education',
    categoryName: 'Education',
    categoryNameGu: 'શિક્ષણ વિશેષ',
    primarySection: 'education',
    featuredImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    ePaperPosition: 'lead',
  },

  // 12. JOBS & CAREERS (Page 12)
  {
    slug: 'gpsc-upsc-gujarat-mega-recruitment-calendar',
    title: 'Gujarat Government Announces Mega Recruitment Calendar for 15,000 Posts',
    titleGu: 'ગુજરાત સરકાર દ્વારા વિવિધ સરકારી વિભાગોમાં ૧૫,૦૦૦ જગ્યાઓ માટે ભરતી કેલેન્ડર જાહેર',
    excerptGu: 'GPSC, પંચાયત સેવા અને પોલીસ દળમાં પારદર્શક પરીક્ષાઓનું ચોક્કસ સમયપત્રક.',
    contentGu: 'સ્પર્ધાત્મક પરીક્ષાઓની તૈયારી કરતા યુવાનો માટે મોટી ખુશખબર. સામાન્ય વહીવટ વિભાગ દ્વારા આગામી વર્ષ માટે ૧૫,૦૦૦થી વધુ વર્ગ-૧, ૨ અને ૩ ની ખાલી જગ્યાઓ ભરવા માટે વિગતવાર કેલેન્ડર જાહેર કરવામાં આવ્યું છે.',
    printHeadline: 'યુવાનો માટે સુવર્ણ તક: ૧૫,૦૦૦ નવી સરકારી જગ્યાઓનું ભરતી કેલેન્ડર',
    printSummary: 'પંચાયત, મહેસૂલ અને વહીવટી તંત્રમાં ખાલી પડેલી જગ્યાઓ માટે તબક્કાવાર પરીક્ષાઓ યોજાશે.',
    photoCredit: 'તસવીર: કારકિર્દી ડેસ્ક',
    byline: 'જોબ્સ & કરિયર એક્સપર્ટ',
    location: 'ગાંધીનગર',
    categorySlug: 'jobs',
    categoryName: 'Jobs',
    categoryNameGu: 'નોકરી & કારકિર્દી',
    primarySection: 'jobs_career',
    featuredImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    ePaperPosition: 'lead',
  },

  // 13. EDITORIAL (Page 13)
  {
    slug: 'editorial-democratic-values-good-governance',
    title: 'Editorial: Strengthening Citizen Participation and Good Governance in Democracy',
    titleGu: 'તંત્રીલેખ: સુશાસન, પારદર્શિતા અને લોકશાહીમાં નાગરિકોની સક્રિય ભાગીદારી',
    excerptGu: 'વિકાસના ફળો છેવાડાના માનવી સુધી પહોંચાડવા માટે સંવેદનશીલ વહીવટી તંત્ર અનિવાર્ય.',
    contentGu: 'કોઈપણ રાષ્ટ્રની પ્રગતિનો સાચો માપદંડ તેના સામાન્ય નાગરિકના જીવનધોરણમાં થતો સુધારો છે. જ્યારે શાસન વ્યવસ્થામાં પારદર્શિતા અને નાગરિકોમાં સભાનતા જોડાય છે ત્યારે સર્વાંગી વિકાસની સાચી શરૂઆત થાય છે. શિક્ષણ, આરોગ્ય અને સમાન તકો દ્વારા જ મજબૂત સમાજનું નિર્માણ શક્ય છે.',
    printHeadline: 'તંત્રીલેખ: લોકશાહીના પાયામાં સુશાસન અને લોકભાગીદારી',
    printSummary: 'નાગરિક જાગૃતિ અને પ્રશાસકીય જવાબદેહી થકી જ વિકાસના સાર્થક પરિણામો પ્રાપ્ત થઈ શકે છે.',
    photoCredit: 'ગુજરાત પોસ્ટ સંપાદકીય બોર્ડ',
    byline: 'મુખ્ય તંત્રી, ગુજરાત પોસ્ટ',
    location: 'અમદાવાદ',
    categorySlug: 'editorial',
    categoryName: 'Editorial',
    categoryNameGu: 'અભિપ્રાય & તંત્રીલેખ',
    primarySection: 'editorial_opinion',
    featuredImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80',
    ePaperPosition: 'lead',
  },

  // 14. PHOTO SPECIAL (Page 14)
  {
    slug: 'photo-special-majestic-gujarat-heritage-and-wildlife',
    title: 'Photo Showcase: Majestic Heritage, Landscapes, and Wildlife of Gujarat',
    titleGu: 'તસવીરી ઝલક: ગુજરાતના રમણીય લેન્ડસ્કેપ્સ, ગીર સિંહ અને પ્રાચીન ઐતિહાસિક સ્થાપત્યો',
    excerptGu: 'કેમેરાના લેન્સમાંથી કેદ થયેલી ગુજરાતના કુદરતી સૌંદર્ય અને વિરાસતની અદભૂત ક્ષણો.',
    contentGu: 'સાબરમતી રિવરફ્રન્ટ પર સૂર્યોદય વેળાની શાંતિથી લઈને ગીરના ગાઢ જંગલમાં સિંહ પરિવારની મુક્ત વિહારની ક્ષણો—ગુજરાત પોસ્ટની ફોટોગ્રાફી ટીમે રજૂ કર્યો છે રાજ્યના વારસા અને પ્રકૃતિનો અનોખો સંગમ.',
    printHeadline: 'ફોટો ઓફ ધ ડે: કેમેરાની આંખે ઝિલાયેલું ગુજરાતનું અદભૂત સૌંદર્ય',
    printSummary: 'પ્રકૃતિ, સંસ્કૃતિ અને લોકજીવનની જીવંત ક્ષણોને દર્શાવતી ખાસ તસવીરી શ્રેણી.',
    photoCredit: 'તસવીર: ગુજરાત પોસ્ટ ફોટો જર્નાલિઝમ ટીમ',
    byline: 'ચીફ ફોટોગ્રાફર',
    location: 'અમદાવાદ',
    categorySlug: 'photo-special',
    categoryName: 'Photo Special',
    categoryNameGu: 'આજના ખાસ ફોટા',
    primarySection: 'photo_special',
    featuredImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&auto=format&fit=crop&q=80',
    ePaperPosition: 'lead',
  },
];

export { SEED_ARTICLES, seedEpaperData };

export async function seedEpaperArticlesData() {
  console.log('🚀 Starting GujaratPost 14-Section E-Paper Seed...');
  await ensureEPaperTablesExist();

  // 1. Ensure an author exists
  let author = await prisma.author.findFirst();
  if (!author) {
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'editor@gujaratpost.com',
          passwordHash: '$2b$10$epaperseedhashdummyforadmin12345678',
          role: 'SUPER_ADMIN',
          status: 'ACTIVE',
        },
      });
    }
    author = await prisma.author.create({
      data: {
        userId: user.id,
        name: 'Gujarat Post Editor',
        nameGu: 'ગુજરાત પોસ્ટ સંપાદક',
        nameHi: 'गुजरात पोस्ट संपादक',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        designation: 'Chief Editor',
        designationGu: 'મુખ્ય સંપાદક',
        designationHi: 'मुख्य संपादक',
        bio: 'Chief editorial desk at GujaratPost',
        bioGu: 'ગુજરાત પોસ્ટ મુખ્ય સંપાદકીય ડેસ્ક',
        bioHi: 'गुजरात पोस्ट मुख्य संपादकीय डेस्क',
      },
    });
  }

  let createdCount = 0;
  let updatedCount = 0;

  for (const item of SEED_ARTICLES) {
    // 2. Ensure Category exists
    let category = await prisma.category.findUnique({
      where: { slug: item.categorySlug },
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: item.categoryName,
          nameGu: item.categoryNameGu,
          nameHi: item.categoryName,
          slug: item.categorySlug,
          description: `${item.categoryName} category for GujaratPost`,
          descriptionGu: `${item.categoryNameGu} શ્રેણી`,
          descriptionHi: `${item.categoryName} श्रेणी`,
        },
      });
    }

    // 3. Upsert Article
    const existingPost = await prisma.post.findUnique({
      where: { slug: item.slug },
    });

    const postData: any = {
      title: item.title,
      titleGu: item.titleGu,
      titleHi: item.title,
      slug: item.slug,
      excerpt: item.excerptGu,
      excerptGu: item.excerptGu,
      excerptHi: item.excerptGu,
      content: item.contentGu,
      contentGu: item.contentGu,
      contentHi: item.contentGu,
      status: 'PUBLISHED',
      featuredImage: item.featuredImage,
      location: item.location,
      readingTime: 3,
      priority: 85,
      isFeatured: true,
      isBreaking: item.categorySlug === 'breaking-news',
      authorId: author.id,
      categoryId: category.id,
    };

    let postId = '';
    if (existingPost) {
      await prisma.post.update({
        where: { id: existingPost.id },
        data: postData,
      });
      postId = existingPost.id;
      updatedCount++;
    } else {
      const created = await prisma.post.create({
        data: postData,
      });
      postId = created.id;
      createdCount++;
    }

    // 4. Update post print fields and upsert epaper_articles
    try {
      await prisma.$executeRawUnsafe(
        `UPDATE \`posts\` SET \`printHeadline\`=?, \`printSubheadline\`=?, \`printSummary\`=?, \`photoCredit\`=?, \`byline\`=?, \`primarySection\`=?, \`ePaperEligible\`=1, \`targetEdition\`='All', \`allowDuplicate\`=0 WHERE \`id\`=?`,
        item.printHeadline, item.printSubheadline || null, item.printSummary, item.photoCredit, item.byline, item.primarySection, postId
      );
    } catch (_) {}

    try {
      await prisma.$executeRawUnsafe(
        `INSERT INTO \`epaper_articles\` (\`id\`, \`postId\`, \`printHeadline\`, \`printSubheadline\`, \`printSummary\`, \`printImage\`, \`photoCredit\`, \`printByline\`, \`primarySection\`, \`ePaperEligible\`, \`targetEdition\`, \`allowDuplicate\`, \`createdAt\`, \`updatedAt\`)
         VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, 1, 'All', 0, NOW(), NOW())
         ON DUPLICATE KEY UPDATE \`printHeadline\`=?, \`printSubheadline\`=?, \`printSummary\`=?, \`photoCredit\`=?, \`printByline\`=?, \`primarySection\`=?, \`updatedAt\`=NOW()`,
        postId, item.printHeadline, item.printSubheadline || null, item.printSummary, item.featuredImage, item.photoCredit, item.byline, item.primarySection,
        item.printHeadline, item.printSubheadline || null, item.printSummary, item.photoCredit, item.byline, item.primarySection
      );
    } catch (_) {}
  }

  console.log(`✅ Seed Complete! Created: ${createdCount} articles, Updated: ${updatedCount} articles across all 14 categories.`);
  return { createdCount, updatedCount, total: SEED_ARTICLES.length };
}

async function seedEpaperData() {
  await seedEpaperArticlesData();
}

if (process.argv[1] && process.argv[1].includes('seedEpaperData')) {
  seedEpaperData()
    .catch((err) => {
      console.error('❌ Error during E-Paper seed:', err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

