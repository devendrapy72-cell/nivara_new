'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'EN' | 'HI'
type ThemeMode = 'light' | 'dark'

interface AppContextType {
    lang: Language
    setLang: (lang: Language) => void
    isDark: boolean
    toggleTheme: () => void
    theme: any // The actual color object
    t: (key: string) => string
    history: any[]
    addToHistory: (record: any) => void
    tracker: any[]
    addToTracker: (item: any) => void
    updateTrackerItem: (id: string | number, updates: any) => void
    communityPosts: any[]
    addPost: (post: any) => void
    products: any[]
    cart: number[]
    addToCart: (id: number) => void
    removeFromCart: (index: number) => void
    clearCart: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const translations = {
    EN: {
        // Home
        tagline: "Rooted in Nature • Driven by Insight",
        scanBtn: "Scan a Plant",
        library: "Library",
        libDesc: "Common plant threats.",
        tracker: "Recovery Tracker",
        trackerDesc: "Log your plant's progress.",
        history: "Scan History",
        hisDesc: "Archive of previous results.",
        community: "Community",
        comDesc: "Ask botanical experts.",
        shop: "Cure Shop",
        shopDesc: "Buy organic treatments.",
        contact: "Contact",
        feedback: "Feedback",
        potd: "Plant of the Day",
        aloeName: "Aloe Vera",
        aloeSciName: "Aloe barbadensis miller",
        aloeDesc: "A succulent plant species of the genus Aloe. An evergreen perennial, it originates from the Arabian Peninsula, but grows wild in tropical, semi-tropical, and arid climates around the world.",
        aloeOrigin: "Arabian Peninsula",
        aloeDifficulty: "Easy",
        aloeWater: "Low",
        aloeLight: "Bright Indirect",
        aloeBenefits: ["Air Purification", "Medicinal Gel", "Drought Tolerant", "Sleep Aid"], // Array for parsing
        aloeFunFact: "Cleopatra used it as part of her daily beauty regimen.",
        weatherMsg: "Click for 7-day botanical outlook",
        forecastTitle: "7-Day Botanical Outlook",
        proTip: "Fungal spores thrive in current humidity. Keep leaves dry during watering.",
        viewProfile: "View Profile",
        smartTip: "Smart Tip",
        fieldChecks: "Field Checks",
        localConditions: "Local Conditions",
        humidity: "Humidity",
        forecastLabel: "7-Day Forecast",

        // Scan Page
        backHome: "Back to Home",
        aiAnalysis: "AI-Powered Analysis",
        scanTitle: "Plant Disease Scanner",
        scanSubtitle: "Upload a clear image of your plant for AI-powered disease detection",
        clickUpload: "Click to upload or drag and drop",
        imageReady: "Image ready for analysis",
        scanCamera: "Scan Now with Camera",
        analyzeImage: "Analyze Image",
        analyzing: "Analyzing Plant...",
        tipsTitle: "Tips for Best Results",
        tip1: "Use clear, well-lit photos",
        tip2: "Focus on the affected area of the plant",
        tip3: "Ensure the image is in focus",
        tip4: "Include multiple angles if possible",
        chooseFile: "Choose File",

        // Result Page
        finalizing: "Finalizing Report...",
        noResultTitle: "No Result Found",
        noResultDesc: "It seems no analysis data is present. Please try scanning again.",
        scanAgain: "Scan Another Plant",
        reportTitle: "Diagnosis Report",
        confidence: "Confidence Score",
        treatmentTitle: "Treatment",
        preventionTitle: "Prevention",
        careTitle: "Plant Care",
        care1: "Monitor water levels regularly",
        care2: "Ensure adequate sunlight",
        care3: "Check leaves for early signs",
        care4: "Keep soil well-drained",

        // Tracker Page
        trackerTitle: "Recovery Tracker",
        trackerSubtitle: "Progress & Adherence",
        doseCompleted: "DOSE COMPLETED",
        markDose: "MARK DOSE AS DONE",
        undoDose: "UNDO / RESET FOR NEXT DOSE",
        howToCure: "How to Cure",
        whenToTreat: "When to Treat",
        issueLabel: "Issue:",
        back: "BACK",

        // Community Page
        forumTitle: "Expert Forum",
        forumSubtitle: "Share your findings and learn from botanical experts worldwide.",
        newPost: "New Post",
        backHomeFull: "Back to Home",
        diagnosisTag: "Diagnosis Needed",
        expertTipTag: "Expert Tip",
        communityFooter: "Nivara Botanical Community",

        // Shop Page
        shopTitle: "Organic Cure Shop",
        basketTitle: "Your Basket",
        basketEmpty: "Your basket is currently empty.",
        totalAmount: "Total Amount",
        checkoutBtn: "Proceed to Checkout",
        addToBasket: "Add to Basket",
        shopFooter: "Nivara Botanical Shop Terminal",

        // Contact Page
        contactTitle: "Contact Us",
        emailLabel: "Email",
        locationLabel: "Location",
        addressLine1: "Botanical Research Center,",
        addressLine2: "Digital Valley",
        contactFooter: "Nivara Botanical Systems • Support",

        // Feedback Page
        feedbackTitle: "Feedback",
        feedbackSubtitle: "Help us refine the Nivara experience.",
        rateLabel: "Rate your experience",
        commentsLabel: "Your Comments",
        commentsPlaceholder: "What can we do better?",
        sendFeedbackBtn: "Send Feedback",
        feedbackReceivedTitle: "Feedback Received",
        feedbackReceivedDesc: "Thank you for helping us grow. Your insights are being reviewed by our botanical team.",
        returnHome: "Return Home Now",
        feedbackFooter: "NIVARA USER INSIGHT TERMINAL",

        // Checkout Page
        checkoutTitle: "Checkout",
        paymentDetails: "Payment Details",
        cardName: "Cardholder Name",
        cardNumber: "Card Number",
        expiry: "Expiry",
        cvv: "CVV",
        verifying: "Verifying...",
        paySecurely: "Pay Securely",
        secureTransaction: "Secure Transaction",
        dataProtection: "Data Protection",
        dataProtectionDesc: "Your payment info is encrypted and never stored on our servers.",
        secureGateway: "Secure Gateway",
        secureGatewayDesc: "Processed through international industry-standard security protocols.",
        checkoutFooter: "SECURE CHECKOUT TERMINAL",
        returnShop: "Return to Shop",

        // History Page
        historyTitle: "Diagnosis Archive",
        historySubtitle: "A complete record of your previous botanical scans.",
        noHistory: "No results archived yet.",
        viewReport: "View Full Report",
        historyFooter: "NIVARA SCAN TERMINAL",

        // Library Page
        libTitle: "Botanical Library",
        libSubtitle: "Search any plant or disease in the world.",
        searchPlaceholder: "Type a plant name or disease (e.g., 'Tomato Blight')...",
        searchBtn: "Search",
        commonDiseases: "Common Crop Diseases",
        resultLabel: "Diagnosis Result",
        symptomsLabel: "Symptoms",
        preventionLabel: "Prevention",
        treatmentLabel: "Treatment",
        noInfoFound: "Could not find relevant botanical information.",
        aiError: "An error occurred while communicating with the AI.",

        // Order Success
        orderConfirmed: "Order Confirmed",
        orderDesc: "Your botanical essentials are being prepared for shipment.",
        backToHome: "Back to Home",
    },
    HI: {
        // Home
        tagline: "प्रकृति में निहित • अंतर्दृष्टि द्वारा संचालित",
        scanBtn: "पौधे को स्कैन करें",
        library: "पुस्तकालय",
        libDesc: "पौधों के सामान्य खतरे।",
        tracker: "रिकवरी ट्रैकर",
        trackerDesc: "अपने पौधों की प्रगति दर्ज करें।",
        history: "स्कैन इतिहास",
        hisDesc: "पिछले परिणामों का संग्रह।",
        community: "समुदाय",
        comDesc: "विशेषज्ञों से पूछें।",
        shop: "दुकान",
        shopDesc: "जैविक उपचार खरीदें।",
        contact: "संपर्क",
        feedback: "प्रतिक्रिया",
        potd: "आज का पौधा",
        aloeName: "एलोवेरा",
        aloeSciName: "एलो बारबाडेंसिस मिलर",
        aloeDesc: "जीनस एलो की एक रसीला पौधे की प्रजाति। एक सदाबहार बारहमासी, यह अरब प्रायद्वीप से उत्पन्न होता है, लेकिन दुनिया भर में उष्णकटिबंधीय, अर्ध-उष्णकटिबंधीय और शुष्क जलवायु में जंगली रूप से बढ़ता है।",
        aloeOrigin: "अरब प्रायद्वीप",
        aloeDifficulty: "आसान",
        aloeWater: "कम",
        aloeLight: "उज्ज्वल अप्रत्यक्ष",
        aloeBenefits: ["वायु शोधन", "औषधीय जेल", "सूखा सहिष्णु", "नींद सहायता"],
        aloeFunFact: "क्लियोपेट्रा ने इसका इस्तेमाल अपने दैनिक सौंदर्य आहार के हिस्से के रूप में किया था।",
        weatherMsg: "7-दिवसीय दृष्टिकोण के लिए क्लिक करें",
        forecastTitle: "7-दिवसीय वानस्पतिक दृष्टिकोण",
        proTip: "नमी में फंगल रोग पनपते हैं। सिंचाई के दौरान पत्तों को सूखा रखें।",
        viewProfile: "प्रोफ़ाइल देखें",
        smartTip: "स्मार्ट सुझाव",
        fieldChecks: "खेत की जाँच",
        localConditions: "स्थानीय स्थितियाँ",
        humidity: "नमी",
        forecastLabel: "7-दिवसीय पूर्वानुमान",

        // Scan Page
        backHome: "घर वापस जाएं",
        aiAnalysis: "एआई-संचालित विश्लेषण",
        scanTitle: "पादप रोग स्कैनर",
        scanSubtitle: "एआई-संचालित रोग पहचान के लिए अपने पौधे की स्पष्ट छवि अपलोड करें",
        clickUpload: "अपलोड करने के लिए क्लिक करें या यहाँ छोड़ें",
        imageReady: "छवि विश्लेषण के लिए तैयार है",
        scanCamera: "कैमरे से स्कैन करें",
        analyzeImage: "छवि का विश्लेषण करें",
        analyzing: "पौधे का विश्लेषण हो रहा है...",
        tipsTitle: "सर्वोत्तम परिणामों के लिए सुझाव",
        tip1: "स्पष्ट, अच्छी रोशनी वाली तस्वीरों का उपयोग करें",
        tip2: "पौधे के प्रभावित क्षेत्र पर ध्यान दें",
        tip3: "सुनिश्चित करें कि छवि फोकस में है",
        tip4: "यदि संभव हो तो कई कोण शामिल करें",
        chooseFile: "फ़ाइल चुनें",

        // Result Page
        finalizing: "रिपोर्ट तैयार हो रही है...",
        noResultTitle: "कोई परिणाम नहीं मिला",
        noResultDesc: "ऐसा लगता है कि कोई विश्लेषण डेटा मौजूद नहीं है। कृपया फिर से स्कैन करने का प्रयास करें।",
        scanAgain: "एक और पौधा स्कैन करें",
        reportTitle: "निदान रिपोर्ट",
        confidence: "विश्वास स्कोर",
        treatmentTitle: "उपचार",
        preventionTitle: "रोकथाम",
        careTitle: "पौधे की देखभाल",
        care1: "नियमित रूप से जल स्तर की निगरानी करें",
        care2: "पर्याप्त धूप सुनिश्चित करें",
        care3: "शुरुआती संकेतों के लिए पत्तियों की जाँच करें",
        care4: "मिट्टी को अच्छी तरह से सूखा रखें",

        // Tracker Page
        trackerTitle: "रिकवरी ट्रैकर",
        trackerSubtitle: "प्रगति और पालन",
        doseCompleted: "खुराक पूरी हुई",
        markDose: "खुराक को पूर्ण चिह्नित करें",
        undoDose: "पूर्ववत करें / अगली खुराक के लिए रीसेट करें",
        howToCure: "इलाज कैसे करें",
        whenToTreat: "कब इलाज करें",
        issueLabel: "समस्या:",
        back: "वापस",

        // Community Page
        forumTitle: "विशेषज्ञ मंच",
        forumSubtitle: "अपने निष्कर्ष साझा करें और दुनिया भर के वनस्पति विशेषज्ञों से सीखें।",
        newPost: "नई पोस्ट",
        backHomeFull: "घर वापस जाएं",
        diagnosisTag: "निदान आवश्यक",
        expertTipTag: "विशेषज्ञ सुझाव",
        communityFooter: "निवार वनस्पति समुदाय",

        // Shop Page
        shopTitle: "जैविक उपचार की दुकान",
        basketTitle: "आपकी टोकरी",
        basketEmpty: "आपकी टोकरी अभी खाली है।",
        totalAmount: "कुल राशि",
        checkoutBtn: "चेकआउट के लिए आगे बढ़ें",
        addToBasket: "टोकरी में जोड़ें",
        shopFooter: "निवार वनस्पति दुकान टर्मिनल",

        // Contact Page
        contactTitle: "संपर्क करें",
        emailLabel: "ईमेल",
        locationLabel: "स्थान",
        addressLine1: "वानस्पतिक अनुसंधान केंद्र,",
        addressLine2: "डिजिटल वैली",
        contactFooter: "निवार वनस्पति प्रणाली • सहायता",

        // Feedback Page
        feedbackTitle: "प्रतिक्रिया",
        feedbackSubtitle: "निवार अनुभव को बेहतर बनाने में हमारी मदद करें।",
        rateLabel: "अपने अनुभव को रेट करें",
        commentsLabel: "आपकी टिप्पणियां",
        commentsPlaceholder: "हम क्या बेहतर कर सकते हैं?",
        sendFeedbackBtn: "प्रतिक्रिया भेजें",
        feedbackReceivedTitle: "प्रतिक्रिया प्राप्त हुई",
        feedbackReceivedDesc: "हमें आगे बढ़ने में मदद करने के लिए धन्यवाद। हमारी वनस्पति टीम आपकी अंतर्दृष्टि की समीक्षा कर रही है।",
        returnHome: "अभी घर लौटें",
        feedbackFooter: "निवार उपयोगकर्ता अंतर्दृष्टि टर्मिनल",

        // Checkout Page
        checkoutTitle: "चेकआउट",
        paymentDetails: "भुगतान विवरण",
        cardName: "कार्डधारक का नाम",
        cardNumber: "कार्ड नंबर",
        expiry: "समाप्ति",
        cvv: "सीवीवी",
        verifying: "सत्यापित किया जा रहा है...",
        paySecurely: "सुरक्षित भुगतान करें",
        secureTransaction: "सुरक्षित लेनदेन",
        dataProtection: "डेटा सुरक्षा",
        dataProtectionDesc: "आपकी भुगतान जानकारी एन्क्रिप्टेड है और हमारे सर्वर पर कभी संग्रहीत नहीं होती है।",
        secureGateway: "सुरक्षित गेटवे",
        secureGatewayDesc: "अंतरराष्ट्रीय उद्योग-मानक सुरक्षा प्रोटोकॉल के माध्यम से संसाधित।",
        checkoutFooter: "सुरक्षित चेकआउट टर्मिनल",
        returnShop: "दुकान पर लौटें",

        // History Page
        historyTitle: "निदान संग्रह",
        historySubtitle: "आपके पिछले वानस्पतिक स्कैन का पूरा रिकॉर्ड।",
        noHistory: "अभी तक कोई परिणाम संग्रहीत नहीं किया गया है।",
        viewReport: "पूर्ण रिपोर्ट देखें",
        historyFooter: "निवार स्कैन टर्मिनल",

        // Library Page
        libTitle: "वानस्पतिक पुस्तकालय",
        libSubtitle: "दुनिया में किसी भी पौधे या बीमारी को खोजें।",
        searchPlaceholder: "पौधे का नाम या बीमारी लिखें (जैसे, 'टमाटर झुलसा')...",
        searchBtn: "खोजें",
        commonDiseases: "सामान्य फसल रोग",
        resultLabel: "निदान परिणाम",
        symptomsLabel: "लक्षण",
        preventionLabel: "रोकथाम",
        treatmentLabel: "उपचार",
        noInfoFound: "प्रासंगिक वानस्पतिक जानकारी नहीं मिल सकी।",
        aiError: "एआई के साथ संचार करते समय एक त्रुटि हुई।",

        // Order Success
        orderConfirmed: "आर्डर संपुष्ट हुआ",
        orderDesc: "आपके वानस्पतिक आवश्यक सामान शिपमेंट के लिए तैयार किए जा रहे हैं।",
        backToHome: "घर वापस जाएं",
    }
}

// --- SHOP STATE ---
const PRODUCTS_DATA = [
    { id: 1, name: "Neem Oil Extract", price: 450, category: "Organic Pest Control", image: "/neem-oil.jpg" },
    { id: 2, name: "Copper Fungicide", price: 420, category: "Disease Control", image: "/copper-fungicide.png" },
    { id: 3, name: "Premium Potting Mix", price: 650, category: "Soil Health", image: "/potting-mix.png" },
    { id: 4, name: "Bypass Pruning Shears", price: 1250, category: "Tools", image: "/pruning-shears.png" },
    { id: 5, name: "Digital Soil pH Meter", price: 890, category: "Diagnostics", image: "/soil-ph-meter.png" },
    { id: 6, name: "Rooting Hormone Gel", price: 340, category: "Propagation", image: "/rooting-gel.jpg" },
    { id: 7, name: "Leaf Shine Polish", price: 250, category: "Aesthetic", image: "https://images.unsplash.com/photo-1598512752271-33f913a5af13?auto=format&fit=crop&q=80&w=600" },
    { id: 8, name: "Ceramic Watering Can", price: 1450, category: "Accessories", image: "/watering-can.png" }
]

export function AppProvider({ children }: { children: ReactNode }) {
    const [lang, setLang] = useState<Language>('EN')
    const [isDark, setIsDark] = useState(false) // Default to Light Mode
    const [history, setHistory] = useState<any[]>([])

    // ... (rest of the component)

    // Load history from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('nivara_history')
        if (saved) {
            setHistory(JSON.parse(saved))
        } else {
            // Seed with mock data if empty
            const mocks = [
                {
                    id: '1',
                    date: 'Oct 24, 2025',
                    plant: 'Tomato',
                    diagnosis: 'Early Blight',
                    confidence: 94,
                    image: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?q=80&w=600&auto=format&fit=crop',
                    description: 'Early blight is a common fungal disease that affects tomatoes, causing dark spots with concentric rings on leaves.',
                    symptoms: ['Dark brown spots on older leaves', 'Yellowing of surrounding tissue', 'Concentric ring patterns'],
                    treatment: ['Apply copper-based fungicide', 'Remove infected lower leaves', 'Improve air circulation'],
                    prevention: ['Crop rotation', 'Avoid overhead watering', 'Mulching soil']
                }
            ]
            setHistory(mocks)
            localStorage.setItem('nivara_history', JSON.stringify(mocks))
        }
    }, [])

    const addToHistory = (record: any) => {
        const newRecord = {
            ...record,
            id: Date.now().toString(),
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        }
        const updated = [newRecord, ...history]
        setHistory(updated)
        localStorage.setItem('nivara_history', JSON.stringify(updated))
    }

    const [tracker, setTracker] = useState<any[]>([])

    useEffect(() => {
        const savedTracker = localStorage.getItem('nivara_tracker')
        if (savedTracker) {
            setTracker(JSON.parse(savedTracker))
        } else {
            // Seed Tracker
            const trackerMocks = [
                {
                    id: 1,
                    plant: "Monarda (Bee Balm)",
                    issue: "Leaf Rust",
                    progress: 65,
                    severity: "Moderate",
                    cure: "Apply Copper Fungicide. Prune infected lower leaves to stop fungal spores. Ensure good air circulation.",
                    schedule: "Apply every 7 days; next dose: Tomorrow Morning.",
                    isDone: false,
                },
                {
                    id: 2,
                    plant: "Tomato Crop",
                    issue: "Early Blight",
                    progress: 15,
                    severity: "High",
                    cure: "Remove 2 inches of soil surface to remove spores. Use Neem oil spray. Avoid overhead watering.",
                    schedule: "Apply at sunset to avoid leaf burn; next dose: In 4 hours.",
                    isDone: false,
                },
                {
                    id: 3,
                    plant: "Aloe Vera",
                    issue: "Root Rot",
                    progress: 100,
                    severity: "Solved",
                    cure: "Repotted in well-draining soil. Reduced watering frequency.",
                    schedule: "Maintenance: Check soil moisture weekly.",
                    isDone: true,
                }
            ]
            setTracker(trackerMocks)
            localStorage.setItem('nivara_tracker', JSON.stringify(trackerMocks))
        }
    }, [])

    const addToTracker = (item: any) => {
        const newItem = {
            ...item,
            id: Date.now(),
        }
        const updated = [newItem, ...tracker]
        setTracker(updated)
        localStorage.setItem('nivara_tracker', JSON.stringify(updated))
    }

    const updateTrackerItem = (id: string | number, updates: any) => {
        const updated = tracker.map(item => item.id === id ? { ...item, ...updates } : item)
        setTracker(updated)
        localStorage.setItem('nivara_tracker', JSON.stringify(updated))
    }

    // --- COMMUNITY STATE ---
    const [communityPosts, setCommunityPosts] = useState<any[]>([])

    useEffect(() => {
        const savedPosts = localStorage.getItem('nivara_community')
        if (savedPosts) {
            setCommunityPosts(JSON.parse(savedPosts))
        } else {
            // Seed Community
            const communityMocks = [
                {
                    id: 1,
                    author: "Aarav Sharma",
                    role: "User",
                    time: "2h ago",
                    title: "Sudden yellow spots on Mango leaves?",
                    content: "I've noticed these small yellow spots spreading on my young mango saplings. Is this a nutrient deficiency or something worse?",
                    likes: 24,
                    replies: 5,
                    tag: "Diagnosis Needed",
                    expertReply: {
                        author: "Dr. Elena Moss",
                        role: "Botanist",
                        content: "This looks like early signs of Anthracnose. Ensure better air circulation and apply a copper-based fungicide immediately."
                    }
                },
                {
                    id: 2,
                    author: "Dr. Elena Moss",
                    role: "Botanist",
                    time: "5h ago",
                    title: "Tips for preventing Root Rot in the Monsoon",
                    content: "With the rains coming, ensure your pots have clear drainage holes. I recommend adding a layer of perlite to your soil mix now.",
                    likes: 89,
                    replies: 12,
                    tag: "Expert Tip",
                    expertReply: null
                },
                {
                    id: 3,
                    author: "Sarah Jenkins",
                    role: "User",
                    time: "1d ago",
                    title: "My Aloe Vera is turning brown/mushy!",
                    content: "I watered it everyday because it's hot, but now the base is mushy. Can I save it?",
                    likes: 15,
                    replies: 3,
                    tag: "Urgent",
                    expertReply: {
                        author: "Nivara AI",
                        role: "System",
                        content: "This is classic root rot from overwatering. Stop watering immediately! Unpot, trim mushy roots, and let it dry for 3 days before repotting in dry soil."
                    }
                },
                {
                    id: 4,
                    author: "Rajiv Patel",
                    role: "Farmer",
                    time: "2d ago",
                    title: "Best organic pesticide for Aphids?",
                    content: "Looking for a chemical-free solution for my vegetable garden.",
                    likes: 45,
                    replies: 8,
                    tag: "Question",
                    expertReply: {
                        author: "Dr. K. Singh",
                        role: "Agri-Expert",
                        content: "Neem Oil is your best bet. Mix 5ml Neem Oil + 2ml liquid soap in 1L water. Spray at sunset."
                    }
                },
                {
                    id: 5,
                    author: "Emily Chen",
                    role: "User",
                    time: "3d ago",
                    title: "Succcess! Tomato Blight Cured",
                    content: "Just wanted to thank the community. The copper fungicide treatment recommended here saved my entire crop!",
                    likes: 156,
                    replies: 20,
                    tag: "Success Story",
                    expertReply: null
                }
            ]
            setCommunityPosts(communityMocks)
            localStorage.setItem('nivara_community', JSON.stringify(communityMocks))
        }
    }, [])

    const addPost = (post: any) => {
        const newPost = {
            ...post,
            id: Date.now(),
            time: "Just now",
            likes: 0,
            replies: 0,
            expertReply: null
        }
        const updated = [newPost, ...communityPosts]
        setCommunityPosts(updated)
        localStorage.setItem('nivara_community', JSON.stringify(updated))
    }



    const [cart, setCart] = useState<number[]>([])

    const addToCart = (id: number) => {
        const updated = [...cart, id]
        setCart(updated)
        localStorage.setItem('nivara_cart', JSON.stringify(updated))
    }

    const removeFromCart = (indexToRemove: number) => {
        const updated = cart.filter((_, index) => index !== indexToRemove)
        setCart(updated)
        localStorage.setItem('nivara_cart', JSON.stringify(updated))
    }

    const clearCart = () => {
        setCart([])
        localStorage.removeItem('nivara_cart')
    }

    const toggleTheme = () => setIsDark(prev => !prev)

    // Memoize the theme object to prevent deep re-renders
    const themeColors = React.useMemo(() => ({
        bg: isDark ? '#0a0c0a' : '#FDFCFB',
        card: isDark ? '#141614' : '#FFFFFF',
        text: isDark ? '#FDFCFB' : '#1A1C19',
        subtext: isDark ? '#8A9388' : '#7A8278',
        border: isDark ? '#252525' : '#E8E8E8',
        accent: '#4A6741',
        widget: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F3F7E9',
        success: '#2D4A23',
        error: '#E74C3C',
        warning: '#E67E22',
        navParams: isDark ? 'rgba(10, 12, 10, 0.8)' : 'rgba(255, 255, 255, 0.8)'
    }), [isDark]);

    const t = React.useCallback((key: string) => {
        // @ts-ignore
        return translations[lang][key] || key
    }, [lang]);

    // Validate cart on load
    useEffect(() => {
        const savedCart = localStorage.getItem('nivara_cart')
        if (savedCart) {
            try {
                const parsed = JSON.parse(savedCart);
                if (Array.isArray(parsed)) {
                    // Filter out any IDs that don't exist in products to prevent crashes
                    const validIds = parsed.filter(id => PRODUCTS_DATA.some(p => p.id === id));
                    setCart(validIds);
                }
            } catch (e) {
                console.error("Failed to parse cart", e);
                setCart([]);
            }
        }
    }, [])

    const contextValue = React.useMemo(() => ({
        lang, setLang,
        isDark, toggleTheme,
        theme: themeColors,
        t,
        history, addToHistory,
        tracker, addToTracker, updateTrackerItem,
        communityPosts, addPost,
        products: PRODUCTS_DATA,
        cart, addToCart, removeFromCart, clearCart
    }), [lang, isDark, themeColors, t, history, tracker, communityPosts, cart]);

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    )
}

export function useApp() {
    const context = useContext(AppContext)
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider')
    }
    return context
}
