import { PrismaClient, Role, AccountStatus, PostStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ----------------------------------------------------
// 1. Authors Mock Data
// ----------------------------------------------------
const AUTHORS_DATA = [
  {
    id: "a1",
    email: "rajesh.patel@gujaratpost.com",
    name: "Rajesh Patel",
    nameGu: "રાજેશ પટેલ",
    nameHi: "રાજેશ પટેલ",
    image: "https://i.pravatar.cc/100?img=11",
    designation: "Senior Editor",
    designationGu: "વરિષ્ઠ સંપાદક",
    designationHi: "वरिष्ठ संपादक",
    bio: "Senior journalist covering Gujarat politics and civic affairs for 15 years.",
    bioGu: "ગુજરાતની રાજનીતિ અને નાગરિક મુદ્દાઓ પર 15 વર્ષથી રિપોર્ટિંગ કરતા વરિષ્ઠ પત્રકાર.",
    bioHi: "गुजरात की राजनीति और नागरिक मुद्दों पर 15 वर्षों से रिपोर्टिंग करने वाले वरिष्ठ पत्रकार.",
  },
  {
    id: "a2",
    email: "priya.shah@gujaratpost.com",
    name: "Priya Shah",
    nameGu: "પ્રિયા શાહ",
    nameHi: "પ્રિયા શાહ",
    image: "https://i.pravatar.cc/100?img=32",
    designation: "Crime Reporter",
    designationGu: "ક્રાઇમ રિપોર્ટર",
    designationHi: "ક્રાઇમ રિપોર્ટર",
    bio: "Investigative reporter focused on policing, courts and public safety.",
    bioGu: "પોલીસ, કોર્ટ અને જાહેર સુરક્ષા પર કેન્દ્રિત તપાસ પત્રકાર.",
    bioHi: "पुलिस, अदालत और सार्वजनिक सुरक्षा पर केंद्रित खोजी पत्रकार.",
  },
  {
    id: "a3",
    email: "amit.desai@gujaratpost.com",
    name: "Amit Desai",
    nameGu: "અમિત દેસાઈ",
    nameHi: "અમિત દેસાઈ",
    image: "https://i.pravatar.cc/100?img=12",
    designation: "Business Correspondent",
    designationGu: "બિઝનેસ સંવાદદાતા",
    designationHi: "बिजनेस संवाददाता",
    bio: "Tracks Gujarat industry, startups, markets and infrastructure.",
    bioGu: "ગુજરાતના ઉદ્યોગ, સ્ટાર્ટઅપ, બજાર અને ઈન્ફ્રાસ્ટ્રક્ચર પર નજર રાખે છે.",
    bioHi: "गुजरात के उद्योग, स्टार्टअप, बाजार और इन्फ्रास्ट्रक्चर पर नजर रखते हैं.",
  },
  {
    id: "a4",
    email: "meera.joshi@gujaratpost.com",
    name: "Meera Joshi",
    nameGu: "મીરા જોશી",
    nameHi: "મીરા જોશી",
    image: "https://i.pravatar.cc/100?img=47",
    designation: "Sports Reporter",
    designationGu: "સ્પોર્ટ્સ રિપોર્ટર",
    designationHi: "સ્પોર્ટ્સ રિપોર્ટર",
    bio: "Covers cricket, kabaddi and emerging sports talent from Gujarat.",
    bioGu: "ગુજરાતના ક્રિકેટ, કબડ્ડી અને ઊભરતી રમત પ્રતિભાઓને આવરી લે છે.",
    bioHi: "गुजरात के क्रिकेट, कबड्डी और उभरती खेल प्रतिभाओं को कवर करती हैं.",
  },
  {
    id: "a5",
    email: "suresh.trivedi@gujaratpost.com",
    name: "Suresh Trivedi",
    nameGu: "સુરેશ ત્રિવેદી",
    nameHi: "સુરેશ ત્રિવેદી",
    image: "https://i.pravatar.cc/100?img=52",
    designation: "Political Editor",
    designationGu: "રાજકીય સંપાદક",
    designationHi: "રાજકીય સંપાદક",
    bio: "Political analyst with deep coverage of Gujarat elections and policy.",
    bioGu: "ગુજરાત ચૂંટણી અને નીતિ વિષયક ઊંડાણપૂર્વકનું કવરેજ ધરાવતા રાજકીય વિશ્લેષક.",
    bioHi: "गुजरात चुनाव और नीति पर गहरी पकड़ रखने वाले राजनीतिक विश्लेषक.",
  },
];

// ----------------------------------------------------
// 2. Category Metadata
// ----------------------------------------------------
const CATEGORIES_DATA = [
  { slug: "gujarat", name: "Gujarat", nameGu: "ગુજરાત", nameHi: "गुजरात" },
  { slug: "national", name: "National", nameGu: "ભારત", nameHi: "भारत" },
  { slug: "world", name: "World", nameGu: "વિશ્વ", nameHi: "विश्व" },
  { slug: "politics", name: "Politics", nameGu: "રાજનીતિ", nameHi: "राजनीति" },
  { slug: "crime", name: "Crime", nameGu: "ક્રાઇમ", nameHi: "क्राइम" },
  { slug: "health", name: "Health", nameGu: "હેલ્થ", nameHi: "स्वास्थ्य" },
  { slug: "entertainment", name: "Entertainment", nameGu: "મનોરંજન", nameHi: "मनोरंजन" },
  { slug: "technology", name: "Technology", nameGu: "ટેકનોલોજી", nameHi: "टेक्नोलॉजी" },
  { slug: "photos", name: "Photo Gallery", nameGu: "ફોટો ગેલેરી", nameHi: "फोटो गैलरी" },
  { slug: "fact-check", name: "Fact Check", nameGu: "ફેક્ટ ચેક", nameHi: "फैक्त चेक" },
  { slug: "trending", name: "Trending", nameGu: "ટ્રેન્ડિંગ", nameHi: "ट्रेंडिंग" },
  { slug: "election-2027", name: "Gujarat Election 2027", nameGu: "ચૂંટણી 2027", nameHi: "चुनाव 2027" },
  { slug: "business", name: "Business", nameGu: "બિઝનેસ", nameHi: "बिजनेस" },
  { slug: "sports", name: "Sports", nameGu: "સ્પોર્ટ્સ", nameHi: "खेल" },
  { slug: "lifestyle", name: "Lifestyle", nameGu: "લાઇફસ્ટાઇલ", nameHi: "लाइफस्टाइल" },
  { slug: "education", name: "Education", nameGu: "શિક્ષણ", nameHi: "शिक्षा" },
  { slug: "gandhinagar", name: "Gandhinagar", nameGu: "ગાંધીનગર", nameHi: "गांधीनगर" },
  { slug: "ahmedabad", name: "Ahmedabad", nameGu: "અમદાવાદ", nameHi: "अहमदाबाद" },
  { slug: "surat", name: "Surat", nameGu: "સુરત", nameHi: "सूरत" },
  { slug: "vadodara", name: "Vadodara", nameGu: "વડોદરા", nameHi: "वडोदरा" },
  { slug: "rajkot", name: "Rajkot", nameGu: "રાજકોટ", nameHi: "राजकोट" },
  { slug: "videos", name: "Videos", nameGu: "વીડિયો", nameHi: "वीडियो" },
  { slug: "shorts", name: "Shorts", nameGu: "શોર્ટ્સ", nameHi: "शॉर्ट्स" },
  { slug: "podcasts", name: "Podcasts", nameGu: "પોડકાસ્ટ", nameHi: "पॉडकास्ट" },
  { slug: "instagram", name: "Instagram", nameGu: "ઇન્સ્ટાગ્રામ", nameHi: "इन्स्टाग्राम" },
  { slug: "webstory", name: "Web Stories", nameGu: "વેબસ્ટોરી", nameHi: "वेब स्टोरीज" },
  { slug: "weather", name: "Weather", nameGu: "હવામાન", nameHi: "मौसम" },
  { slug: "gold-silver", name: "Gold - Silver", nameGu: "ગોલ્ડ - સિલ્વર", nameHi: "गोल्ड - सिल्वर" },
];

// ----------------------------------------------------
// 3. Tags Data
// ----------------------------------------------------
const TAGS_DATA = [
  { slug: "gujarat", name: "Gujarat", nameGu: "ગુજરાત", nameHi: "गुजरात" },
  { slug: "ahmedabad", name: "Ahmedabad", nameGu: "અમદાવાદ", nameHi: "अहमदाबाद" },
  { slug: "politics", name: "Politics", nameGu: "રાજકારણ", nameHi: "राजनीति" },
  { slug: "business", name: "Business", nameGu: "બિઝનેસ", nameHi: "बिजनेस" },
  { slug: "crime", name: "Crime", nameGu: "ક્રાઇમ", nameHi: "क्राइम" },
  { slug: "sports", name: "Sports", nameGu: "રમતગમત", nameHi: "खेल" },
  { slug: "breaking", name: "Breaking", nameGu: "બ્રેકિંગ", nameHi: "ब्रेકિંગ" },
  { slug: "update", name: "Update", nameGu: "અપડેટ", nameHi: "अपडेट" },
  { slug: "health", name: "Health", nameGu: "હેલ્થ", nameHi: "स्वास्थ्य" },
  { slug: "election2027", name: "Election 2027", nameGu: "ચૂંટણી 2027", nameHi: "चुनाव 2027" },
];

// ----------------------------------------------------
// 4. Articles Data Generator
// ----------------------------------------------------
const baseStories = [
  ["sports", "Huge clash today at Narendra Modi Stadium, rush for tickets among fans", "નરેન્દ્ર મોદી સ્ટેડિયમમાં આજે મહામુકાબલો, ટિકિટ માટે પડાપડી", "नरेंद्र मोदी स्टेडियम में आज महामुकाबला, टिकटों के लिए मची मारामारी"],
  ["health", "New health guidelines released: how to stay fit in summer", "આરોગ્ય માટે નવી માર્ગદર્શિકા: ઉનાળામાં ફિટ રહેવા માટે શું કરવું", "स्वास्थ्य के लिए नए दिशा-निर्देश: गर्मियों में फिट रहने के लिए क्या करें"],
  ["gandhinagar", "Gift City Gandhinagar sets record in fintech investments", "ગિફ્ટ સિટી ગાંધીનગરે ફિનટેક રોકાણમાં રેકોર્ડ બનાવ્યો", "गिफ्ट सिटी गांधीनगर ने फिनटेक निवेश में रिकॉर्ड बनाया"],
  ["instagram", "Social media influencers share local stories from Gujarat", "સોશિયલ મીડિયા ઇન્ફ્લુએન્સર્સે ગુજરાતની કથાઓ શેર કરી", "सोशल मीडिया इन्फ्लुएंसर्स ने गुजरात की कहानियां साझा की"],
  ["webstory", "Explore the top tourist destinations in Gujarat this winter", "આ શિયાળામાં ગુજરાતના પ્રવાસન સ્થળોનું અન્વેષણ કરો", "इस सर्दियों में गुजरात के पर्यटन स्थलों का अन्वेषण करें"],
  ["weather", "Monsoon update: Gujarat weather forecast for next week", "ચોમાસું અપડેટ: ગુજરાતમાં આગામી સપ્તાહનું હવામાન", "मानसून अपडेट: गुजरात में अगले सप्ताह का मौसम"],
  ["gold-silver", "Gold and silver rates fluctuate: Check latest prices in Gujarat", "સોના-ચાંદીના ભાવમાં ઉતાર-ચઢાવ: ગુજરાતમાં આજના ભાવ", "सोने-चांदी की कीमतों में उतार-चढ़ाव: गुजरात में आज के भाव"],
  ["state", "Big gift for Gujarat: New semiconductor policy announced, thousands of jobs to be created", "ગુજરાતને મોટી ભેટ! નવી સેમિકન્ડક્ટર પોલિસી જાહેર, હજારો નોકરીઓ મળશે", "गुजरात को बड़ी सौगात! नई सेमीकंडक्टर नीति घोषित, हजारों नौकरियां मिलेंगी"],
  ["state", "New traffic rules implemented in Ahmedabad from today, details of penalty and locations", "અમદાવાદમાં આજથી નવા ટ્રાફિક નિયમ લાગુ! ક્યાં લાગશે દંડ, જાણો પૂરી વિગત", "अहमदाबाद में आज से नए ट्रैफिक नियम लागू! कहां लगेगा जुर्माना, जानें पूरी जानकारी"],
  ["state", "Major change in Darshan timings at Dwarka Temple, important update for devotees", "દ્વારકા મંદિરના દર્શન સમયમાં મોટો ફેરફાર, શ્રદ્ધાળુઓ જરૂર વાંચે", "द्वारका मंदिर के दर्शन समय में बड़ा बदलाव, श्रद्धालु जरूर पढ़ें"],
  ["national", "Parliament Monsoon Session begins today: clash expected over key bills", "સંસદનું ચોમાસુ સત્ર આજથી: આ મોટા ખરડા પર થશે ઘમાસાણ", "संसद का मानसून सत्र आज से: इन बड़े विधेयकों पर होगा हंगामा"],
  ["state", "Warning! Heavy rain alert in Gujarat for next three days", "સાવધાન! ગુજરાતમાં આગામી ત્રણ દિવસ ધોધમાર વરસાદની આગાહી", "सावधान! गुजरात में अगले तीन दिनों तक भारी बारिश की चेतावनी"],
  ["business", "Strong boom in Surat textile market, wave of joy among traders", "સુરત ટેક્સટાઇલ માર્કેટમાં જોરદાર તેજી, વેપારીઓમાં ખુશીની લહેર", "सूरत कपड़ा बाजार में जोरदार तेजी, व्यापारियों में खुशी की लहर"],
  ["sports", "Team India blast! Spectacular win to clinch series 2-0", "ટીમ ઈન્ડિયાનો ધમાકો! શાનદાર જીત સાથે શ્રેણી 2-0થી કબજે", "टीम इंडिया का धमाका! शानदार जीत के साथ सीरीज 2-0 से कब्जा"],
  ["state", "Tourists flock to Girnar Ropeway: Huge increase in numbers", "ગિરનાર રોપ-વે પર ઉમટ્યા પ્રવાસીઓ! સંખ્યામાં જોરદાર વધારો", "गिरनार रोपवे पर उमड़े पर्यटक: संख्या में भारी बढ़ोतरी"],
  ["world", "New trade agreement signed in Europe, India to benefit too", "યુરોપમાં નવી વ્યાપાર સંધિ પર હસ્તાક્ષર, ભારતને પણ ફાયદો", "यूरोप में नए व्यापार समझौते पर हस्ताक्षर, भारत को भी फायदा"],
  ["business", "Sharp rise in gold and silver prices! Know today's latest rates", "સોના-ચાંદીના ભાવમાં જોરદાર ઉછાળો! જાણો આજના લેટેસ્ટ રેટ", "सोने-चांदी की कीमतों में भारी उछाल! जानें आज के ताजा भाव"],
  ["business", "Stock market rally: Gujarat-based stocks outperform index", "શેરબજાર રેલી: ગુજરાત આધારિત શેરો ઇન્ડેક્સ કરતા આગળ", "शेयर बाजार रैली: गुजरात आधारित शेयर सूचकांक से आगे"],
  ["politics", "Gujarat Election 2027 preparations intensify across districts", "ગુજરાત ચૂંટણી 2027 માટે જિલ્લાઓમાં તૈયારીઓ તેજ", "गुजरात चुनाव 2027 की तैयारियां जिलों में तेज"],
  ["politics", "CM holds review meeting for development projects", "CM એ વિકાસ પ્રોજેક્ટ માટે સમીક્ષા બેઠક યોજી", "CM ने विकास परियोजनाओं के लिए समीक्षा बैठक की"],
  ["politics", "Congress announces campaign strategy for Gujarat 2027", "કોંગ્રેસે ગુજરાત 2027 ચૂંટણી ઝુંબેશ વ્યૂહ જાહેર કર્યો", "कांग्रेस ने गुजरात 2027 चुनाव अभियान रणनीति घोषित की"],
  ["politics", "AAP expands grassroot network in Gujarat rural areas", "AAPએ ગ્રામ્ય ગુજરાતમાં ભૂ-સ્તરીય નેટવર્ક વિસ્તાર્યું", "AAP ने ग्रामीण गुजरात में जमीनी नेटवर्क का विस्तार किया"],
  ["politics", "New cabinet reshuffle expected in Gujarat government", "ગુજરાત સરકારમાં નવો કેબિનેટ ફેરફાર અપેક્ષિત", "गुजरात सरकार में नया कैबिनेट फेरबदल अपेक्षित"],
  ["politics", "Panchayat elections dates finalised for three districts", "ત્રણ જિલ્લાઓ માટે પંચાયત ચૂંટણીની તારીખ નક્કી", "तीन जिलों के लिए पंचायत चुनाव की तारीखें तय"],
  ["national", "Parliament passes historic bill on digital privacy", "સંસદે ડિજિટલ પ્રાઇવસી પર ઐતિહાસિક બિલ પાસ કર્યું", "संसद ने डिजिटल गोपनीयता पर ऐतिहासिक विधेयक पारित किया"],
  ["national", "New national highway expansion projects approved by center", "કેન્દ્ર દ્વારા નવા રાષ્ટ્રીય ધોરીમાર્ગ વિસ્તરણ પ્રોજેક્ટ્સને મંજૂરી", "केंद्र द्वारा नए राष्ट्रीय राजमार्ग विस्तार परियोजनाओं को मंजूरी"],
  ["national", "ISRO announces next lunar exploration mission timeline", "ISRO એ આગામી ચંદ્ર સંશોધન મિશનની સમયરેખા જાહેર કરી", "इसरो ने अगले चंद्र अन्वेषण मिशन की समय-सीमा की घोषणा की"],
  ["national", "Monsoon covers entire country ahead of schedule, says IMD", "ચોમાસું સમય પહેલાં સમગ્ર દેશને આવરી લે છે, IMD", "मानसून समय से पहले पूरे देश में पहुंचा, आईएमडी ने कहा"],
  ["crime", "Cyber cell busts fake investment app network in Ahmedabad", "અમદાવાદમાં ફેક ઇન્વેસ્ટમેન્ટ એપ નેટવર્કનો પર્દાફાશ", "अहमदाबाद में फेक निवेश ऐप नेटवर्क का खुलासा"],
  ["crime", "Surat police seize contraband worth crores in joint raid", "સુરત પોલીસની સંયુક્ત રેડમાં કરોડોની કિંમતનો મુદ્દામાલ જપ્ત", "सूरत पुलिस की संयुक्त छापेमारी में करोड़ों का माल जब्त"],
  ["crime", "Kidnapping racket busted in Rajkot; five arrested", "રાજકોટમાં અપહરણ ગેંગ ઉઘાડી; પાંચ ધરપકડ", "राजकोट में अपहरण गिरोह का भंडाफोड़; पांच गिरफ्तार"],
  ["crime", "ATM skimming gang caught after months of investigation", "ATM સ્કીમિંગ ગેંગ મહિનાઓ ની તપાસ બાદ ઝડપાઈ", "ATM स्किमिंग गैंग महीनों की जांच के बाद पकड़ी गई"],
  ["crime", "Land fraud case: Senior official arrested in Vadodara", "જમીન ફ્રોડ કેસ: વડોદરામાં વરિષ્ઠ અધિકારી ધરપકડ", "भूमि धोखाधड़ी मामला: वडोदरा में वरिष्ठ अधिकारी गिरफ्तार"],
  ["crime", "Drug trafficking route from Pakistan via Gujarat busted", "પાકિસ્તાનથી ગુજરાત થઈ ડ્રગ ટ્રાફિકિંગ રૂટ ઝડપ્યો", "पाकिस्तान से गुजरात के रास्ते ड्रग तस्करी रूट का भंडाफोड़"],
  ["sports", "Gujarat Titans begin pre-season camp in Ahmedabad", "ગુજરાત ટાઇટન્સે અમદાવાદમાં પ્રી-સીઝન કેમ્પ શરૂ કર્યો", "गुजरात टाइटन्स ने अहमदाबाद में प्री-સીજન કેમ્પ શરૂ કરાયો"],
  ["sports", "Hardik Pandya trains with Gujarat U-19 academy squad", "હાર્દિક પંડ્યાએ ગુજરાત U-19 એકેડેમી સ્ક્વૉડ સાથે પ્રેક્ટિસ કરી", "हार्दिक पंड्या ने गुजरात U-19 अकादमी दल के साथ अभ्यास किया"],
];
const storyPool = baseStories;

const slugify = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// ----------------------------------------------------
// 5. Videos Data
// ----------------------------------------------------
const VIDEOS_DATA = [
  { youtubeId: "sA6BrUmBXiA", title: "Sabarkantha District Cooperative purchase and Sales Union scam", titleGu: "ધી સાબરકાંઠા જિલ્લા સહકારી સંઘમાં ગોટાળો — મંત્રી જીતુ વાઘાણી ક્યારે કરાવશે તપાસ?", titleHi: "साबरकांठा जिला सहकारी संघ में घोटाला - मंत्री जीतू वाघाणी कब कराएंगे जांच?", type: "video", duration: "45:23", views: 82000, thumbnail: "https://i.ytimg.com/vi/sA6BrUmBXiA/hqdefault.jpg" },
  { youtubeId: "rQHoqCTiQvI", title: "Kapadvanj TDO office corruption - poor looting scheme", titleGu: "કપડવંજ TDO કચેરીમાં ભ્રષ્ટાચારનો સડો — ગરીબોને લૂંટવાની સ્કીમ", titleHi: "कपड़वंज टीडीओ कार्यालय में भ्रष्टाचार का कीड़ा - गरीबों को लूटने की योजना", type: "video", duration: "12:05", views: 98000, thumbnail: "https://i.ytimg.com/vi/rQHoqCTiQvI/hqdefault.jpg" },
  { youtubeId: "WF2Kuec5HV0", title: "AAP leader's 'sin' - four years of exploitation", titleGu: "AAP ના નેતાનું \"પાપ\" — ચાર વર્ષ સુધી મહિલા સાથે દુષ્કર્મ", titleHi: "आप नेता का 'पाप' - चार साल तक महिला के साथ दुष्कर्म", type: "video", duration: "18:45", views: 62000, thumbnail: "https://i.ytimg.com/vi/WF2Kuec5HV0/hqdefault.jpg" },
  { youtubeId: "LDDtOMwdJ_0", title: "IPS poured petrol on journalist? Why senior journalist failed", titleGu: "IPS એ પત્રકારની \"ગુદામાં\" પેટ્રોલ નાખ્યું? સિનિયર પત્રકાર કેમ નિષ્ફળ", titleHi: "आईपीएस ने पत्रकार के प्राइवेट पार्ट में पेट्रोल डाला? सीनियर पत्रकार क्यों विफल", type: "video", duration: "22:10", views: 54000, thumbnail: "https://i.ytimg.com/vi/LDDtOMwdJ_0/hqdefault.jpg" },
  { youtubeId: "-iXZuFoHqiw", title: "SPG convention or BJP? Nitin Patel forced or strong?", titleGu: "સમેલન SPG નું કે ભાજપનું? નીતિન પટેલ મજબૂર કે મજબૂત?", titleHi: "सम्मेलन एसपीजी का या बीजेपी का? नितिन पटेल मजबूर या मजबूत?", type: "video", duration: "15:40", views: 72000, thumbnail: "https://i.ytimg.com/vi/-iXZuFoHqiw/hqdefault.jpg" },
  { youtubeId: "uJalvs-jgFc", title: "BJP Government challenged: Shankersinh Vaghela fumes", titleGu: "ભાજપ સરકારના ભુક્કા કાઢી નાખ્યાં, સાણંદ દારુ પાર્ટી મુદ્દે શંકરસિંહ વાઘેલા", titleHi: "बीजेपी सरकार को चुनौती: शंकरसिंह वाघेला का गुस्सा फूटा", type: "video", duration: "20:15", views: 68000, thumbnail: "https://i.ytimg.com/vi/uJalvs-jgFc/hqdefault.jpg" },
  { youtubeId: "sA6BrUmBXiA", title: "Rain alert in 60 seconds", titleGu: "60 સેકન્ડમાં વરસાદ એલર્ટ", titleHi: "60 सेकंड में बारिश अलर्ट", type: "short", duration: "0:58", views: 185000, thumbnail: "https://i.ytimg.com/vi/sA6BrUmBXiA/hqdefault.jpg" },
  { youtubeId: "rQHoqCTiQvI", title: "Gujarat Titans training moment", titleGu: "ગુજરાત ટાઇટન્સ ટ્રેનિંગ મોમેન્ટ", titleHi: "गुजरात टाइटन्स ट्रेनिंग मोमेंट", type: "short", duration: "0:45", views: 210000, thumbnail: "https://i.ytimg.com/vi/rQHoqCTiQvI/hqdefault.jpg" },
  { youtubeId: "WF2Kuec5HV0", title: "Navratri safety checklist", titleGu: "નવરાત્રી સેફ્ટી ચેકલિસ્ટ", titleHi: "नवरात्रि सेफ्टी checklist", type: "short", duration: "0:59", views: 146000, thumbnail: "https://i.ytimg.com/vi/WF2Kuec5HV0/hqdefault.jpg" },
  { youtubeId: "LDDtOMwdJ_0", title: "Podcast: Gujarat economy next decade", titleGu: "પોડકાસ્ટ: ગુજરાત અર્થતંત્રનો આગામી દાયક", titleHi: "पॉडकास्ट: गुजरात अर्थव्यवस्था का अगला दशक", type: "podcast", duration: "55:00", views: 36000, thumbnail: "https://i.ytimg.com/vi/LDDtOMwdJ_0/hqdefault.jpg" },
  { youtubeId: "-iXZuFoHqiw", title: "Exclusive interview with civic commissioner", titleGu: "મ્યુનિસિપલ કમિશનર સાથે ખાસ મુલાકાત", titleHi: "नगर आयुक्त से खास बातचीत", type: "interview", duration: "32:15", views: 59000, thumbnail: "https://i.ytimg.com/vi/-iXZuFoHqiw/hqdefault.jpg" }
];

// ----------------------------------------------------
// 6. Photo Gallery Data
// ----------------------------------------------------
const GALLERY_DATA = [
  { src: "https://images.unsplash.com/photo-1599930113854-d6d7fd521f10?w=800&q=80", alt: "Ahmedabad Riverfront", caption: "Sabarmati Riverfront development continues in Ahmedabad", captionGu: "અમદાવાદમાં સાબરમતી રિવરફ્રન્ટ વિકાસ કાર્ય ચાલુ છે", captionHi: "अहमदाबाद में साबरमती रिवरफ्रंट विकास कार्य जारी है", photographer: "Rajesh Patel", copyright: "Gujarat Post" },
  { src: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&q=80", alt: "Cricket Practice", caption: "Gujarat domestic cricket squad trains for the upcoming tournament", captionGu: "ગુજરાત ડોમેસ્ટિક ક્રિકેટ ટીમ આગામી ટૂર્નામેન્ટ માટે પ્રેક્ટિસ કરી રહી છે", captionHi: "गुजरात घरेलू क्रिकेट टीम आगामी टूर्नामेंट के लिए अभ्यास कर रही है", photographer: "Meera Joshi", copyright: "Gujarat Post" },
  { src: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&q=80", alt: "Political Rally", caption: "Massive political rally organized ahead of local elections", captionGu: "સ્થાનિક ચૂંટણીઓ પહેલાં આયોજિત વિશાળ રાજકીય સભા", captionHi: "स्थानीय चुनावों से पहले आयोजित विशाल राजनीतिक रैली", photographer: "Suresh Trivedi", copyright: "Gujarat Post" },
  { src: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80", alt: "Garba Dance", caption: "Vibrant Navratri garba night celebrations across cities", captionGu: "શહેરોમાં વાઇબ્રન્ટ નવરાત્રી ગરબા નાઇટની ઉજવણી", captionHi: "शहरों में जीवंत नवरात्रि गरबा नाइट का जश्न", photographer: "Priya Shah", copyright: "Gujarat Post" },
  { src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80", alt: "GIFT City Skyline", caption: "GIFT City emerging as a major global financial hub", captionGu: "GIFT સિટી વૈશ્વિક નાણાકીય હબ તરીકે ઉભરી રહ્યું છે", captionHi: "गिफ्ट सिटी वैश्विक वित्तीय हब के रूप में उभर रहा है", photographer: "Amit Desai", copyright: "Gujarat Post" },
  { src: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80", alt: "Digital Classroom", caption: "Smart digital classrooms introduced in primary schools", captionGu: "પ્રાથમિક શાળાઓમાં સ્માર્ટ ડિજિટલ ક્લાસરૂમ શરૂ કરાયા", captionHi: "प्राथमिक स्कूलों में स्मार्ट डिजिटल क्लासरूम शुरू किए गए", photographer: "Rajesh Patel", copyright: "Gujarat Post" },
];

// ----------------------------------------------------
// 7. Instagram Stories Data
// ----------------------------------------------------
const INSTAGRAM_STORIES_DATA = [
  {
    name: "Future Tech",
    nameGu: "ભવિષ્ય ટેકનોલોજી",
    nameHi: "भविष्य टेक्नोलॉजी",
    avatar: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=150&h=150&fit=crop&q=80",
    slides: [
      {
        mediaType: "image",
        mediaUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
        captionEn: "How AI and augmented reality are transforming modern architecture.",
        captionGu: "AI અને ઓગમેન્ટેડ રિયાલિટી કેવી રીતે આધુનિક આર્કિટેક્ચરને બદલી રહ્યા છે.",
        captionHi: "एआई और ऑगमेंटेड रियलिटी कैसे आधुनिक वास्तुकला को बदल रहे हैं।",
        timestampGu: "2 કલાક પહેલાં"
      }
    ]
  },
  {
    name: "Healthy Bites",
    nameGu: "ફૂડ ડાયરી",
    nameHi: "फूड डायरी",
    avatar: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=150&h=150&fit=crop&q=80",
    slides: [
      {
        mediaType: "image",
        mediaUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80",
        captionEn: "Nutritionist-approved quick meals to boost your energy throughout the day.",
        captionGu: "આખો દિવસ તમારી એનર્જી વધારવા માટે ઝડપી પૌષ્ટિક આહાર રેસિપી.",
        captionHi: "दिन भर आपकी ऊर्जा बढ़ाने के लिए पोषण विशेषज्ञ द्वारा स्वीकृत त्वरित भोजन।",
        timestampGu: "3 કલાક પહેલાં"
      }
    ]
  },
  {
    name: "Ayurvedic Wellness",
    nameGu: "આયુર્વેદિક ઉપચાર",
    nameHi: "आयुर्वेदिक कल्याण",
    avatar: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=150&h=150&fit=crop&q=80",
    slides: [
      {
        mediaType: "image",
        mediaUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80",
        captionEn: "Ancient Ayurvedic herbs for modern healthy living and daily wellness.",
        captionGu: "આધુનિક તંદુરસ્ત જીવન અને દૈનિક સુખાકારી માટે પ્રાચીન આયુર્વેદિક જડીબુટ્ટીઓ.",
        captionHi: "आधुनिक स्वस्थ जीवन और दैनिक कल्याण के लिए प्राचीन आयुर्वेदिक जड़ी-बूटियाँ।",
        timestampGu: "4 કલાક પહેલાં"
      }
    ]
  }
];

// ----------------------------------------------------
// 8. Web Stories Data
// ----------------------------------------------------
const WEB_STORIES_DATA = [
  { title: "Future Tech", titleGu: "ભવિષ્ય ટેકનોલોજી", titleHi: "भविष्य टेक्नोलॉजी", coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80", slidesCount: 5, category: "Technology" },
  { title: "Healthy Bites", titleGu: "ફૂડ ડાયરી", titleHi: "फूड डायरी", coverImage: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80", slidesCount: 6, category: "Lifestyle" },
  { title: "Ayurvedic Wellness", titleGu: "આયુર્વેદિક ઉપચાર", titleHi: "आयुर्वेदिक कल्याण", coverImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80", slidesCount: 4, category: "Health" },
  { title: "Celebrity Diary", titleGu: "સ્ટાર ડાયરી", titleHi: "स्टार डायरी", coverImage: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80", slidesCount: 5, category: "Entertainment" }
];

// ----------------------------------------------------
// 9. Breaking Ticker Items Data
// ----------------------------------------------------
const BREAKING_TICKER_DATA = [
  { en: "BREAKING: Heavy rain alert in Ahmedabad, riverfront gates opened", gu: "અમદાવાદમાં ભારે વરસાદનું એલર્ટ, રિવરફ્રન્ટના ગેટ ખોલાયા", hi: "अहमदाबाद में भारी बारिश का अलर्ट, रिवरफ्रंट के गेट खुले", slug: "ahmedabad-receives-heavy-rain-alert-as-riverfront-gates-opened-1" },
  { en: "GUJARAT ELECTION 2027: District preparations intensify", gu: "ગુજરાત ચૂંટણી 2027 અપડેટ: મુખ્ય પક્ષોની બેઠક", hi: "गुजरात चुनाव 2027: जिलों में तैयारियां तेज", slug: "gujarat-election-2027-preparations-intensify-across-districts-5" },
  { en: "CRIME ALERT: Cyber cell busts fake investment app network", gu: "ક્રાઇમ બ્રેકિંગ: સાયબર સેલનો મોટો પર્દાફાશ", hi: "क्राइम ब्रेकिंग: साइबर सेल का बड़ा खुलासा", slug: "cyber-cell-busts-fake-investment-app-network-in-ahmedabad-6" },
  { en: "GIFT CITY: Fintech hub attracts five global firms", gu: "GIFT સિટીમાં ફિનટેક કંપનીઓનું રોકાણ", hi: "गिफ्ट सिटी: फिनटेक हब ने पांच वैश्विक कंपनियों को आकर्षित किया", slug: "gift-city-fintech-hub-attracts-five-global-firms-8" }
];

async function main() {
  console.log('🚀 Starting Full Database Seeding (Articles, Categories, Videos, Photos, Instagram Stories, Web Stories, Ticker)...');

  // 1. Seed Super Admin User
  const adminEmail = 'admin@gujaratpost.com';
  const defaultPassword = 'Admin@12345';
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash(defaultPassword, salt);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash: adminPasswordHash,
      role: Role.SUPER_ADMIN,
      status: AccountStatus.ACTIVE,
    },
    create: {
      email: adminEmail,
      passwordHash: adminPasswordHash,
      role: Role.SUPER_ADMIN,
      status: AccountStatus.ACTIVE,
      isFirstLogin: false,
    },
  });
  console.log(`✅ Super Admin ready: ${admin.email}`);

  // 2. Seed Authors & Reporter Users
  const authorRecords: string[] = [];
  for (const authorData of AUTHORS_DATA) {
    const userPasswordHash = await bcrypt.hash('Reporter@12345', salt);
    const user = await prisma.user.upsert({
      where: { email: authorData.email },
      update: {},
      create: {
        email: authorData.email,
        passwordHash: userPasswordHash,
        role: Role.REPORTER,
        status: AccountStatus.ACTIVE,
        isFirstLogin: false,
      },
    });

    const author = await prisma.author.upsert({
      where: { userId: user.id },
      update: {
        name: authorData.name,
        nameGu: authorData.nameGu,
        nameHi: authorData.nameHi,
        image: authorData.image,
        designation: authorData.designation,
        designationGu: authorData.designationGu,
        designationHi: authorData.designationHi,
        bio: authorData.bio,
        bioGu: authorData.bioGu,
        bioHi: authorData.bioHi,
      },
      create: {
        userId: user.id,
        name: authorData.name,
        nameGu: authorData.nameGu,
        nameHi: authorData.nameHi,
        image: authorData.image,
        designation: authorData.designation,
        designationGu: authorData.designationGu,
        designationHi: authorData.designationHi,
        bio: authorData.bio,
        bioGu: authorData.bioGu,
        bioHi: authorData.bioHi,
      },
    });
    authorRecords.push(author.id);
  }
  console.log(`✅ ${authorRecords.length} Authors & Users seeded.`);

  // 3. Seed Categories
  const categoryMap: Record<string, string> = {};
  for (const cat of CATEGORIES_DATA) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        nameGu: cat.nameGu,
        nameHi: cat.nameHi,
        description: (cat as any).description || `Latest ${cat.name} news and updates from Gujarat Post.`,
        descriptionGu: (cat as any).descriptionGu || `ગુજરાત પોસ્ટ પર ${cat.nameGu}ના તાજા સમાચાર અને અપડેટ્સ.`,
        descriptionHi: (cat as any).descriptionHi || `गुजरात पोस्ट पर ${cat.nameHi} के ताजा समाचार और अपडेट।`,
        icon: (cat as any).icon || 'newspaper',
        color: (cat as any).color || '#dc2626',
      },
      create: {
        slug: cat.slug,
        name: cat.name,
        nameGu: cat.nameGu,
        nameHi: cat.nameHi,
        description: (cat as any).description || `Latest ${cat.name} news and updates from Gujarat Post.`,
        descriptionGu: (cat as any).descriptionGu || `ગુજરાત પોસ્ટ પર ${cat.nameGu}ના તાજા સમાચાર અને અપડેટ્સ.`,
        descriptionHi: (cat as any).descriptionHi || `गुजरात पोस्ट पर ${cat.nameHi} के ताजा समाचार और अपडेट।`,
        icon: (cat as any).icon || 'newspaper',
        color: (cat as any).color || '#dc2626',
      },
    });
    categoryMap[cat.slug] = category.id;
  }
  console.log(`✅ ${Object.keys(categoryMap).length} Categories seeded.`);

  // 4. Seed Tags
  for (const tagData of TAGS_DATA) {
    await prisma.tag.upsert({
      where: { slug: tagData.slug },
      update: { name: tagData.name, nameGu: tagData.nameGu, nameHi: tagData.nameHi },
      create: { slug: tagData.slug, name: tagData.name, nameGu: tagData.nameGu, nameHi: tagData.nameHi },
    });
  }
  console.log(`✅ ${TAGS_DATA.length} Tags seeded.`);

  // 5. Seed 120 Articles / Posts
  const demoImages = [
    "https://images.unsplash.com/photo-1599930113854-d6d7fd521f10?w=800&q=80",
    "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&q=80",
    "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&q=80",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80",
    "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&q=80",
  ];

  let postCount = 0;
  for (let i = 0; i < 120; i++) {
    const story = storyPool[i % storyPool.length];
    const catSlug = story[0];
    const categoryId = categoryMap[catSlug] || categoryMap['state'] || Object.values(categoryMap)[0];
    const authorId = authorRecords[i % authorRecords.length];

    const slug = slugify(`${story[1]} ${i + 1}`);
    const title = `${story[1]} - Full Ground Coverage`;
    const titleGu = story[2];
    const titleHi = story[3];

    const excerpt = "A Gujarat Post special report explains how the development could affect residents, businesses and public administration.";
    const excerptGu = "ગુજરાત પોસ્ટની ખાસ રિપોર્ટ પ્રમાણે આ નિર્ણયથી સ્થાનિક લોકો, વેપાર અને વહીવટી વ્યવસ્થામાં સીધી અસર પડશે.";
    const excerptHi = "गुजरात पोस्ट की विशेष रिपोर्ट के अनुसार इस फैसले से स्थानीय लोगों, कारोबार और प्रशासन पर सीधा असर पड़ेगा.";

    const content = "Officials said detailed planning began soon after the latest decision. Dedicated teams are working to ensure timely public updates and smooth coordination between departments.";
    const contentGu = "સ્થાનિક અધિકારીઓએ જણાવ્યું કે તાજેતરના નિર્ણય બાદ વિસ્તૃત આયોજન શરૂ કરી દેવામાં આવ્યું છે. લોકો સુધી જરૂરી માહિતી ઝડપથી પહોંચે તે માટે અલગ ટીમો કાર્યરત છે.";
    const contentHi = "स्थानीय अधिकारियों ने बताया कि ताजा फैसले के बाद विस्तृत योजना पर काम शुरू कर दिया गया है. लोगों तक जरूरी जानकारी तेजी से पहुंचाने के लिए अलग टीमें सक्रिय हैं.";

    const featuredImage = demoImages[i % demoImages.length];

    await prisma.post.upsert({
      where: { slug },
      update: {
        title,
        titleGu,
        titleHi,
        excerpt,
        excerptGu,
        excerptHi,
        content,
        contentGu,
        contentHi,
        featuredImage,
        status: PostStatus.PUBLISHED,
        readingTime: 3 + (i % 5),
        priority: 120 - i,
        isTrending: i < 10 || i % 7 === 0,
        isBreaking: i % 9 === 0,
        isFeatured: i < 24,
        views: 82000 + i * 3150,
        categoryId,
        authorId,
      },
      create: {
        slug,
        title,
        titleGu,
        titleHi,
        excerpt,
        excerptGu,
        excerptHi,
        content,
        contentGu,
        contentHi,
        featuredImage,
        status: PostStatus.PUBLISHED,
        readingTime: 3 + (i % 5),
        priority: 120 - i,
        isTrending: i < 10 || i % 7 === 0,
        isBreaking: i % 9 === 0,
        isFeatured: i < 24,
        views: 82000 + i * 3150,
        categoryId,
        authorId,
      },
    });
    postCount++;
  }
  console.log(`✅ ${postCount} Articles / Posts seeded successfully.`);

  // 6. Seed Videos
  await prisma.video.deleteMany({});
  for (let idx = 0; idx < VIDEOS_DATA.length; idx++) {
    const v = VIDEOS_DATA[idx];
    await prisma.video.create({
      data: {
        title: v.title,
        titleGu: v.titleGu,
        titleHi: v.titleHi,
        thumbnail: v.thumbnail,
        youtubeId: v.youtubeId,
        embedUrl: `https://www.youtube.com/embed/${v.youtubeId}`,
        duration: v.duration,
        type: v.type,
        isFeatured: idx < 3,
        views: v.views,
      },
    });
  }
  console.log(`✅ ${VIDEOS_DATA.length} Videos seeded.`);

  // 7. Seed Photo Gallery
  await prisma.galleryPhoto.deleteMany({});
  for (const p of GALLERY_DATA) {
    await prisma.galleryPhoto.create({
      data: {
        src: p.src,
        alt: p.alt,
        caption: p.caption,
        captionGu: p.captionGu,
        captionHi: p.captionHi,
        photographer: p.photographer,
        copyright: p.copyright,
      },
    });
  }
  console.log(`✅ ${GALLERY_DATA.length} Photo Gallery items seeded.`);

  // 8. Seed Instagram Stories
  await prisma.instagramStory.deleteMany({});
  for (const s of INSTAGRAM_STORIES_DATA) {
    await prisma.instagramStory.create({
      data: {
        name: s.name,
        nameGu: s.nameGu,
        nameHi: s.nameHi,
        avatar: s.avatar,
        slides: {
          create: s.slides.map((sl) => ({
            mediaType: sl.mediaType,
            mediaUrl: sl.mediaUrl,
            captionEn: sl.captionEn,
            captionGu: sl.captionGu,
            captionHi: sl.captionHi,
            timestampGu: sl.timestampGu,
          })),
        },
      },
    });
  }
  console.log(`✅ ${INSTAGRAM_STORIES_DATA.length} Instagram Stories seeded.`);

  // 9. Seed Web Stories
  await prisma.webStory.deleteMany({});
  const WEB_STORY_SEED = [
    {
      heading: 'Future of Technology',
      headingGu: 'ભવિષ્ય ટેકનોલોજી',
      headingHi: 'भविष्य टेक्नोलॉजी',
      image1: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
      image2: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80',
      image3: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
    },
    {
      heading: 'Gujarat Tourism',
      headingGu: 'ગુજરાત પ્રવાસ',
      headingHi: 'गुजरात पर्यटन',
      image1: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80',
      image2: 'https://images.unsplash.com/photo-1519677584237-752f8853252e?w=800&q=80',
      image3: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800&q=80',
    },
    {
      heading: 'Gujarati Culture & Festivals',
      headingGu: 'ગુજરાતી સંસ્કૃતિ',
      headingHi: 'गुजराती संस्कृति',
      image1: 'https://images.unsplash.com/photo-1598520106830-8c45c2035460?w=800&q=80',
      image2: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80',
      image3: 'https://images.unsplash.com/photo-1547358881-25e19bcc29a4?w=800&q=80',
    },
    {
      heading: 'Sports Update',
      headingGu: 'રમતગમત અપડેટ',
      headingHi: 'खेल अपडेट',
      image1: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
      image2: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80',
    },
    {
      heading: 'Business & Economy',
      headingGu: 'વ્યવસાય અને અર્થ',
      headingHi: 'व्यापार और अर्थव्यवस्था',
      image1: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
      image2: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80',
    },
  ];
  for (const ws of WEB_STORY_SEED) {
    await prisma.webStory.create({ data: ws });
  }
  console.log(`✅ ${WEB_STORY_SEED.length} Web Stories seeded.`);

  // 10. Seed Breaking Ticker Items
  await prisma.breakingTickerItem.deleteMany({});
  for (const bt of BREAKING_TICKER_DATA) {
    await prisma.breakingTickerItem.create({
      data: {
        en: bt.en,
        gu: bt.gu,
        hi: bt.hi,
        slug: bt.slug,
      },
    });
  }
  console.log(`✅ ${BREAKING_TICKER_DATA.length} Breaking Ticker Items seeded.`);

  // 11. Seed Astrology Signs
  await prisma.astrologySign.deleteMany({});
  const ASTROLOGY_SIGNS_DATA = [
    { slug: 'aries', name: 'Aries', nameGu: 'મેષ', nameHi: 'મેષ', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=200&h=200&fit=crop&q=80', prediction: 'Your energy levels will be high today. Great opportunities await in your professional career.', predictionGu: 'આજનો દિવસ તમારા માટે ઉર્જાવાન રહેશે. કાર્યક્ષેત્રમાં નવી તકો પ્રાપ્ત થવાની પ્રબળ સંભાવના છે.' },
    { slug: 'taurus', name: 'Taurus', nameGu: 'વૃષભ', nameHi: 'વૃષભ', image: 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?w=200&h=200&fit=crop&q=80', prediction: 'Focus on financial planning today. Patience in communication will resolve personal issues.', predictionGu: 'નાણાકીય બાબતોમાં સાવધાની રાખવી. વાણી પર સંયમ રાખવાથી પારિવારિક વિવાદો ટળી શકે છે.' },
    { slug: 'gemini', name: 'Gemini', nameGu: 'મિથુન', nameHi: 'મિથુન', image: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=200&h=200&fit=crop&q=80', prediction: 'A creative solution to a long-standing task brings joy. Travel plans are favored.', predictionGu: 'લાંબા સમયથી અટકેલા કામો પૂર્ણ થતાં મન પ્રસન્ન રહેશે. નવી મુસાફરીના યોગ બની રહ્યા છે.' },
    { slug: 'cancer', name: 'Cancer', nameGu: 'કર્ક', nameHi: 'કર્ક', image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=200&h=200&fit=crop&q=80', prediction: 'Trust your intuition today. Spend time with family members to strengthen emotional bonds.', predictionGu: 'આજે તમારી આંતરપ્રજ્ઞા પર વિશ્વાસ રાખો. પરિવાર સાથે શાંતિપૂર્ણ સમય વિતાવવો લાભદાયી રહેશે.' },
    { slug: 'leo', name: 'Leo', nameGu: 'સિંહ', nameHi: 'સિંહ', image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=200&h=200&fit=crop&q=80', prediction: 'Leadership roles will suit you today. Keep a check on your health and eat fresh.', predictionGu: 'આજે નેતૃત્વ ગુણો ખીલી ઉઠશે. સ્વાસ્થ્ય પ્રત્યે થોડી કાળજી રાખવાની જરૂરિયાત છે.' },
    { slug: 'virgo', name: 'Virgo', nameGu: 'કન્યા', nameHi: 'કન્યા', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=200&fit=crop&q=80', prediction: 'Attention to detail will earn you praise at work. A good day for romantic matters.', predictionGu: 'કામની બારીકીઓ પર ધ્યાન આપવાથી યશ મળશે. દાંપત્યજીવનમાં મધુરતા વધવાના સંકેત છે.' },
    { slug: 'libra', name: 'Libra', nameGu: 'તુલા', nameHi: 'તુલા', image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200&h=200&fit=crop&q=80', prediction: 'Balance is key today. Partnerships in business will prove to be highly profitable.', predictionGu: 'જીવનમાં સંતુલન જાળવી રાખવું જરૂરી છે. વેપારમાં ભાગીદારીથી આર્થિક ફાયદો થઈ શકે છે.' },
    { slug: 'scorpio', name: 'Scorpio', nameGu: 'વૃશ્ચિક', nameHi: 'વૃશ્ચિક', image: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=200&h=200&fit=crop&q=80', prediction: 'Determination will help you overcome any hurdles. Keep secrets to yourself.', predictionGu: 'મક્કમ નિર્ણય શક્તિ તમને મુશ્કેલીઓમાંથી બહાર લાવશે. ગુપ્ત બાબતો કોઈની સાથે શેર ન કરવી.' },
    { slug: 'sagittarius', name: 'Sagittarius', nameGu: 'ધન', nameHi: 'ધનુ', image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=200&h=200&fit=crop&q=80', prediction: 'Optimism guide your actions today. Spiritual pursuits provide inner peace and clarity.', predictionGu: 'આશાવાદી વલણ તમારા કાર્યોને સફળ બનાવશે. આધ્યાત્મિકતા તરફ રસ વધવાથી માનસિક શાંતિ મળશે.' },
    { slug: 'capricorn', name: 'Capricorn', nameGu: 'મકર', nameHi: 'મકર', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200&h=200&fit=crop&q=80', prediction: 'Hard work pays off today. Recognition from seniors at work will boost your confidence.', predictionGu: 'આકરો પરિશ્રમ આજે ફળ આપશે. વરિષ્ઠ અધિકારીઓ તરફથી પ્રશંસા મળવાથી આત્મવિશ્વાસ વધશે.' },
    { slug: 'aquarius', name: 'Aquarius', nameGu: 'કુંભ', nameHi: 'કુંભ', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=200&fit=crop&q=80', prediction: 'Innovative ideas will emerge. Collaboration with friends leads to exciting new ventures.', predictionGu: 'નવા વિચારો મનમાં આવશે. મિત્રો સાથે મળીને નવી યોજનાઓ અમલમાં મૂકવાની ઉત્તમ તક છે.' },
    { slug: 'pisces', name: 'Pisces', nameGu: 'મીન', nameHi: 'મીન', image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=200&h=200&fit=crop&q=80', prediction: 'Empathy will resolve misunderstandings. Focus on self-care and meditation in the evening.', predictionGu: 'લાગણીશીલ સ્વભાવ સંબંધોને વધુ મજબૂત બનાવશે. સાંજે ધ્યાન કે યોગ કરવાથી શાંતિ અનુભવાશે.' }
  ];
  for (const ast of ASTROLOGY_SIGNS_DATA) {
    await prisma.astrologySign.create({
      data: {
        slug: ast.slug,
        name: ast.name,
        nameGu: ast.nameGu,
        nameHi: ast.nameHi,
        image: ast.image,
        prediction: ast.prediction,
        predictionGu: ast.predictionGu,
      },
    });
  }
  console.log(`✅ ${ASTROLOGY_SIGNS_DATA.length} Astrology Signs seeded.`);

  console.log('--------------------------------------------------');
  console.log('🎉 Complete Database Seeding Finished Successfully!');
  console.log('--------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
