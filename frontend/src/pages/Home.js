import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  FaArrowRight,
  FaCheckCircle,
  FaChevronDown,
  FaGraduationCap,
  FaHeartbeat,
  FaHome,
  FaLeaf,
  FaBriefcase,
  FaUsers,
  FaLightbulb,
  FaUserTie,
  FaNewspaper,
  FaShieldAlt,
  FaSearch,
  FaFileAlt,
  FaPaperPlane,
  FaLandmark,
  FaCheck
} from 'react-icons/fa';

import SatyamevJayateEmblem from '../components/SatyamevJayateEmblem';
import './Home.css';

const translations = {
  en: {
    tag1: "Opportunities for Everyone",
    title1: "Empowering Every Citizen",
    subtitle1: "Digital transformation, innovation and inclusive growth for all.",
    tag2: "Smart Eligibility Matching",
    title2: "Find Schemes Made For You",
    subtitle2: "One nation, one platform — discover government schemes based on your profile.",
    tag3: "100% Free for Citizens",
    title3: "Simple. Transparent. Accessible.",
    subtitle3: "Know your eligibility in seconds — without confusion.",
    getStarted: "Get Started",
    login: "Login",
    schemesLabel: "Schemes",
    forEveryCitizen: "For every citizen",
    statsSchemes: "Government Schemes",
    statsStates: "States & UTs Covered",
    statsCategories: "Categories",
    statsFree: "Free to Use",
    browseCat: "Browse by category",
    exploreCat: "Explore Scheme Categories",
    exploreCatDesc: "Find government schemes designed for different needs and sections of society.",
    simpleProcess: "Simple Process",
    howItWorks: "How It Works",
    howItWorksDesc: "Discover suitable schemes in three simple steps.",
    step1Title: "Create Profile",
    step1Desc: "Register with basic details such as age, income and location.",
    step2Title: "Get Matched",
    step2Desc: "Our system matches schemes according to your eligibility.",
    step3Title: "Apply Easily",
    step3Desc: "View documents and application steps through official links.",
    popularNow: "Popular Now",
    featuredSchemes: "Featured Schemes",
    featuredDesc: "Explore some of the most popular government welfare schemes.",
    checkEligibility: "Check Eligibility",
    stayUpdated: "Stay Updated",
    latestNews: "Latest News & Updates",
    gotQuestions: "Got Questions?",
    faqTitle: "Frequently Asked Questions",
    valueOpinion: "We Value Your Opinion",
    shareFeedback: "Share Your Feedback",
    shareFeedbackDesc: "Help us improve the portal for every citizen.",
    yourName: "Your Name",
    yourEmail: "Your Email",
    rateExperience: "Rate your experience",
    feedbackPlaceholder: "Share your thoughts about the portal...",
    submitFeedback: "Submit Feedback",
    submittingFeedback: "Submitting...",
    submittedFeedback: "Feedback Submitted Successfully!",
    readyTitle: "Ready to Discover Your Schemes?",
    readyDesc: "Create your profile and find benefits that may be relevant to you.",
    registerNow: "Register Now",
    footer: "National Scheme Portal — Government of India Eligibility System"
  },

  hi: {
    tag1: "भारत सरकार की पहल",
    title1: "हर नागरिक को सशक्त बनाना",
    subtitle1: "डिजिटल परिवर्तन, नवाचार और सभी के लिए समावेशी विकास।",
    tag2: "स्मार्ट पात्रता मिलान",
    title2: "अपने लिए बनी योजनाएं खोजें",
    subtitle2: "एक राष्ट्र, एक मंच — अपनी प्रोफाइल के आधार पर योजनाएं खोजें।",
    tag3: "नागरिकों के लिए 100% मुफ्त",
    title3: "सरल। पारदर्शी। सुलभ।",
    subtitle3: "बिना किसी भ्रम के कुछ ही सेकंड में अपनी पात्रता जानें।",
    getStarted: "शुरू करें",
    login: "लॉगिन",
    schemesLabel: "योजनाएं",
    forEveryCitizen: "हर नागरिक के लिए",
    statsSchemes: "सरकारी योजनाएं",
    statsStates: "राज्य और केंद्र शासित प्रदेश",
    statsCategories: "श्रेणियां",
    statsFree: "मुफ्त उपयोग",
    browseCat: "श्रेणी के अनुसार",
    exploreCat: "योजना श्रेणियां देखें",
    exploreCatDesc: "समाज के विभिन्न वर्गों और जरूरतों के लिए योजनाएं खोजें।",
    simpleProcess: "सरल प्रक्रिया",
    howItWorks: "यह कैसे काम करता है",
    howItWorksDesc: "तीन आसान चरणों में उपयुक्त योजनाएं खोजें।",
    step1Title: "प्रोफाइल बनाएं",
    step1Desc: "आयु, आय और स्थान जैसे बुनियादी विवरण दर्ज करें।",
    step2Title: "मिलान प्राप्त करें",
    step2Desc: "हमारा सिस्टम आपकी पात्रता के अनुसार योजनाओं का मिलान करता है।",
    step3Title: "आसानी से आवेदन करें",
    step3Desc: "आधिकारिक लिंक से दस्तावेज और आवेदन प्रक्रिया देखें।",
    popularNow: "अभी लोकप्रिय",
    featuredSchemes: "विशेष योजनाएं",
    featuredDesc: "लोकप्रिय सरकारी कल्याणकारी योजनाओं के बारे में जानें।",
    checkEligibility: "पात्रता जांचें",
    stayUpdated: "अपडेट रहें",
    latestNews: "नवीनतम समाचार और अपडेट",
    gotQuestions: "प्रश्न हैं?",
    faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
    valueOpinion: "हम आपकी राय को महत्व देते हैं",
    shareFeedback: "अपनी प्रतिक्रिया साझा करें",
    shareFeedbackDesc: "हर नागरिक के लिए पोर्टल को बेहतर बनाने में मदद करें।",
    yourName: "आपका नाम",
    yourEmail: "आपका ईमेल",
    rateExperience: "अपने अनुभव को रेट करें",
    feedbackPlaceholder: "पोर्टल के बारे में अपने विचार साझा करें...",
    submitFeedback: "प्रतिक्रिया भेजें",
    submittingFeedback: "भेज रहे हैं...",
    submittedFeedback: "प्रतिक्रिया सफलतापूर्वक प्राप्त हुई!",
    readyTitle: "अपनी योजनाएं खोजने के लिए तैयार हैं?",
    readyDesc: "अपनी प्रोफाइल बनाएं और अपने लिए प्रासंगिक लाभ खोजें।",
    registerNow: "अभी पंजीकरण करें",
    footer: "राष्ट्रीय योजना पोर्टल — भारत सरकार पात्रता प्रणाली"
  },

  mr: {
    tag1: "भारत सरकारचा उपक्रम",
    title1: "प्रत्येक नागरिकाला सक्षम करणे",
    subtitle1: "डिजिटल परिवर्तन, नावीन्य आणि सर्वांसाठी सर्वसमावेशक विकास.",
    tag2: "स्मार्ट पात्रता जुळणी",
    title2: "तुमच्यासाठी बनवलेल्या योजना शोधा",
    subtitle2: "एक राष्ट्र, एक व्यासपीठ — तुमच्या प्रोफाइलनुसार सरकारी योजना शोधा.",
    tag3: "नागरिकांसाठी 100% मोफत",
    title3: "सोपे. पारदर्शक. सुलभ.",
    subtitle3: "कोणताही गोंधळ न करता काही सेकंदांत तुमची पात्रता जाणून घ्या.",
    getStarted: "सुरू करा",
    login: "लॉगिन",
    schemesLabel: "योजना",
    forEveryCitizen: "प्रत्येक नागरिकासाठी",
    statsSchemes: "सरकारी योजना",
    statsStates: "राज्ये आणि केंद्रशासित प्रदेश",
    statsCategories: "श्रेणी",
    statsFree: "वापरण्यासाठी मोफत",
    browseCat: "श्रेणीनुसार",
    exploreCat: "योजना श्रेणी एक्सप्लोर करा",
    exploreCatDesc: "समाजातील विविध घटक आणि गरजांसाठी योजना शोधा.",
    simpleProcess: "सोपी प्रक्रिया",
    howItWorks: "हे कसे कार्य करते",
    howItWorksDesc: "तीन सोप्या टप्प्यांत योग्य योजना शोधा.",
    step1Title: "प्रोफाइल तयार करा",
    step1Desc: "वय, उत्पन्न आणि स्थान यासारखे मूलभूत तपशील भरा.",
    step2Title: "जुळणी मिळवा",
    step2Desc: "आमची प्रणाली तुमच्या पात्रतेनुसार योजनांची जुळणी करते.",
    step3Title: "सहज अर्ज करा",
    step3Desc: "अधिकृत लिंकद्वारे कागदपत्रे आणि अर्ज प्रक्रिया पहा.",
    popularNow: "सध्या लोकप्रिय",
    featuredSchemes: "वैशिष्ट्यीकृत योजना",
    featuredDesc: "लोकप्रिय सरकारी कल्याणकारी योजनांबद्दल जाणून घ्या.",
    checkEligibility: "पात्रता तपासा",
    stayUpdated: "अपडेट रहा",
    latestNews: "ताज्या बातम्या आणि अपडेट्स",
    gotQuestions: "प्रश्न आहेत?",
    faqTitle: "वारंवार विचारले जाणारे प्रश्न",
    valueOpinion: "आम्ही तुमच्या मताला महत्त्व देतो",
    shareFeedback: "तुमचा अभिप्राय शेअर करा",
    shareFeedbackDesc: "प्रत्येक नागरिकासाठी पोर्टल सुधारण्यास मदत करा.",
    yourName: "तुमचे नाव",
    yourEmail: "तुमचा ईमेल",
    rateExperience: "तुमच्या अनुभवाला रेट करा",
    feedbackPlaceholder: "पोर्टलबद्दल तुमचे विचार शेअर करा...",
    submitFeedback: "अभिप्राय पाठवा",
    submittingFeedback: "पाठवत आहे...",
    submittedFeedback: "अभिप्राय यशस्वीरीत्या पाठवला!",
    readyTitle: "तुमच्या योजना शोधण्यासाठी तयार आहात?",
    readyDesc: "तुमचे प्रोफाइल तयार करा आणि तुमच्यासाठी उपयुक्त लाभ शोधा.",
    registerNow: "आता नोंदणी करा",
    footer: "राष्ट्रीय योजना पोर्टल — भारत सरकार पात्रता प्रणाली"
  }
};

const categories = [
  { icon: <FaLeaf />, name: 'Agriculture', count: '15+ Schemes' },
  { icon: <FaGraduationCap />, name: 'Education', count: '18+ Schemes' },
  { icon: <FaHeartbeat />, name: 'Health', count: '12+ Schemes' },
  { icon: <FaHome />, name: 'Housing', count: '10+ Schemes' },
  { icon: <FaUsers />, name: 'Women Empowerment', count: '14+ Schemes' },
  { icon: <FaBriefcase />, name: 'Employment', count: '16+ Schemes' },
  { icon: <FaUserTie />, name: 'Senior Citizen', count: '8+ Schemes' },
  { icon: <FaLightbulb />, name: 'Startup & Business', count: '9+ Schemes' }
];

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lang, setLang] = useState('en');
  const [openFaq, setOpenFaq] = useState(0);
  const [feedback, setFeedback] = useState({
    name: '',
    email: '',
    message: '',
    rating: 5
  });
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [isFeedbackSuccess, setIsFeedbackSuccess] = useState(false);
  const [starBurstIndex, setStarBurstIndex] = useState(null);

  // INTRO ANIMATION STATES: 'center' | 'rotating' | 'flying' | 'settled'
  const [introState, setIntroState] = useState('center');
  const [flyStyles, setFlyStyles] = useState({});
  const heroEmblemRef = useRef(null);

  // COUNT-UP ANIMATION STATE
  const [counts, setCounts] = useState({ schemes: 0, states: 0, categories: 0, free: 0 });

  const t = translations[lang];

  const slides = [
    {
      tag: t.tag1,
      title: t.title1,
      subtitle: t.subtitle1
    },
    {
      tag: t.tag2,
      title: t.title2,
      subtitle: t.subtitle2
    },
    {
      tag: t.tag3,
      title: t.title3,
      subtitle: t.subtitle3
    }
  ];

  // COUNT-UP TRIGGER
  const startCountUp = useCallback(() => {
    const duration = 1600;
    const steps = 40;
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeProgress = 1 - Math.pow(1 - progress, 3); 

      setCounts({
        schemes: Math.round(113 * easeProgress),
        states: Math.round(36 * easeProgress),
        categories: Math.round(10 * easeProgress),
        free: Math.round(100 * easeProgress)
      });

      if (step >= steps) {
        clearInterval(timer);
      }
    }, intervalTime);
  }, []);

  
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIntroState('settled');
      startCountUp();
      return;
    }

    
    const rotateTimer = setTimeout(() => {
      setIntroState('rotating');
    }, 300);

    // Step 3: Unblur + Fly smoothly to hero target position (2700ms to 3750ms)
    const flyTimer = setTimeout(() => {
      if (heroEmblemRef.current) {
        const targetRect = heroEmblemRef.current.getBoundingClientRect();
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const targetX = targetRect.left + targetRect.width / 2;
        const targetY = targetRect.top + targetRect.height / 2;

        const deltaX = targetX - centerX;
        const deltaY = targetY - centerY;
        const targetSize = Math.min(targetRect.width, 280);
        const scale = targetSize / 390;

        setFlyStyles({
          transform: `translate(${deltaX}px, ${deltaY}px) scale(${scale})`,
          transition: 'transform 1.05s cubic-bezier(0.2, 0.95, 0.3, 1), opacity 1.05s ease'
        });
      }
      setIntroState('flying');
    }, 2700);

    // Step 4: Settle in hero area, unmount overlay (3750ms)
    const settleTimer = setTimeout(() => {
      setIntroState('settled');
      startCountUp();
    }, 3750);

    return () => {
      clearTimeout(rotateTimer);
      clearTimeout(flyTimer);
      clearTimeout(settleTimer);
    };
  }, [startCountUp]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [lang, slides.length]);

  const stats = [
    { number: `${counts.schemes}+`, label: t.statsSchemes },
    { number: `${counts.states}`, label: t.statsStates },
    { number: `${counts.categories}+`, label: t.statsCategories },
    { number: `${counts.free}%`, label: t.statsFree }
  ];

  const steps = [
    {
      number: '01',
      icon: <FaFileAlt />,
      title: t.step1Title,
      desc: t.step1Desc
    },
    {
      number: '02',
      icon: <FaSearch />,
      title: t.step2Title,
      desc: t.step2Desc
    },
    {
      number: '03',
      icon: <FaPaperPlane />,
      title: t.step3Title,
      desc: t.step3Desc
    }
  ];

  const featuredSchemes = [
    {
      title: 'PM Kisan Samman Nidhi',
      category: 'Agriculture',
      description: 'Financial support for eligible farmer families.',
      icon: <FaLeaf />
    },
    {
      title: 'Ayushman Bharat PM-JAY',
      category: 'Health',
      description: 'Health coverage support for eligible families.',
      icon: <FaHeartbeat />
    },
    {
      title: 'PM Awas Yojana',
      category: 'Housing',
      description: 'Housing assistance for eligible households.',
      icon: <FaHome />
    }
  ];

  const news = [
    {
      date: '01 Jul 2026',
      title: 'New government welfare updates added to the portal.'
    },
    {
      date: '25 Jun 2026',
      title: 'More scheme eligibility information is now available.'
    },
    {
      date: '18 Jun 2026',
      title: 'Citizen-focused scheme discovery features improved.'
    }
  ];

  const faqs = [
    {
      q: 'Is this portal free to use?',
      a: 'Yes. Citizens can use the portal to discover schemes and check eligibility without paying a portal usage fee.'
    },
    {
      q: 'How do I find schemes I am eligible for?',
      a: 'Create your profile with relevant details such as age, income, occupation and location. The system can then match your profile with available schemes.'
    },
    {
      q: 'Can I save schemes for later?',
      a: 'Yes. Logged-in users can save schemes and access them later from the Saved Schemes section.'
    },
    {
      q: 'Where do I apply for a scheme?',
      a: 'Scheme details provide application information and, where available, official application links.'
    }
  ];

  const handleFeedbackChange = (e) => {
    setFeedback({
      ...feedback,
      [e.target.name]: e.target.value
    });
  };

  const handleStarClick = (starVal) => {
    setStarBurstIndex(starVal);
    setFeedback({ ...feedback, rating: starVal });
    setTimeout(() => setStarBurstIndex(null), 600);
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    setFeedbackMsg('');
    setIsSubmittingFeedback(true);

    try {
      const response = await fetch(
        'https://national-scheme-portal.onrender.com/api/feedback',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(feedback)
        }
      );

      const data = await response.json();
      setIsSubmittingFeedback(false);
      setIsFeedbackSuccess(true);

      setFeedbackMsg(
        data.message || t.submittedFeedback
      );

      setFeedback({
        name: '',
        email: '',
        message: '',
        rating: 5
      });

      setTimeout(() => {
        setIsFeedbackSuccess(false);
      }, 4000);
    } catch (error) {
      setIsSubmittingFeedback(false);
      setFeedbackMsg(
        'Unable to submit feedback right now. Please try again.'
      );
    }
  };

  // 3D Card Tilt Handler
  const handleCardMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  };

  const handleCardMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  };

  return (
    <>
      {/* =====================================================
          PREMIUM GOVERNMENT INTRO ANIMATION OVERLAY
      ===================================================== */}
      {introState !== 'settled' && (
        <div
          className={`home-intro-overlay ${introState === 'flying' ? 'intro-overlay-fading' : ''}`}
          onClick={() => setIntroState('settled')}
          title="Click to skip intro"
        >
          <div
            className={`home-intro-stage ${
              introState === 'center' ? 'intro-stage-center' : ''
            } ${introState === 'rotating' ? 'intro-stage-rotating' : ''}`}
            style={introState === 'flying' ? flyStyles : {}}
          >
            <div className="home-intro-glow-aura" />
            <SatyamevJayateEmblem size={390} isRotating={introState === 'rotating'} />
            <div className={`home-intro-text-banner ${introState === 'flying' ? 'intro-text-fade' : ''}`}>
              <span className="home-intro-devanagari">Knowledge Is Power</span>
              <strong className="home-intro-portal-title">NATIONAL SCHEME PORTAL</strong>
              <span className="home-intro-motto">सत्यमेव जयते &bull; One Nation &bull; One Platform</span>
            </div>
          </div>
        </div>
      )}

      <div className={`home-page ${introState !== 'settled' && introState !== 'flying' ? 'home-blurred' : ''}`}>

        {/* LANGUAGE BAR */}
        <div className="language-bar">
          <div className="language-container">
            <span className="language-label">
              Choose Language
            </span>

            <div className="language-buttons">
              {[
                { code: 'en', label: 'English' },
                { code: 'hi', label: 'हिंदी' },
                { code: 'mr', label: 'मराठी' }
              ].map((item) => (
                <button
                  key={item.code}
                  className={`language-btn ${
                    lang === item.code ? 'active' : ''
                  }`}
                  onClick={() => {
                    setLang(item.code);
                    setCurrentSlide(0);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* HERO */}
        <section className="hero-section">

          <div className="hero-pattern"></div>

          <div className="hero-container">

            <div
              key={`${currentSlide}-${lang}`}
              className="hero-content lang-fade-in"
            >
              <div className="hero-badge">
                {slides[currentSlide].tag}
              </div>

              <h1 className="hero-title">
                {slides[currentSlide].title}
              </h1>

              <p className="hero-description">
                {slides[currentSlide].subtitle}
              </p>

              <div className="hero-actions">

                <Link
                  to="/register"
                  className="primary-btn shimmer-btn"
                >
                  {t.getStarted}
                  <FaArrowRight />
                </Link>

                <Link
                  to="/login"
                  className="secondary-btn"
                >
                  {t.login}
                </Link>

              </div>

              <div className="hero-trust">

                <span>
                  <FaCheckCircle />
                  Free for citizens
                </span>

                <span>
                  <FaShieldAlt />
                  Secure platform
                </span>

              </div>

              <div className="hero-dots">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    className={
                      index === currentSlide
                        ? 'hero-dot active'
                        : 'hero-dot'
                    }
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* HERO VISUAL — SATYAMEV JAYATE EMBLEM */}
            <div className="hero-visual" ref={heroEmblemRef}>

              <div className={`hero-emblem-card ${introState === 'settled' ? 'emblem-card-settled' : 'emblem-card-pending'}`}>
                <div className="hero-emblem-aura" />
                <SatyamevJayateEmblem size={280} interactive={true} />
                <div className="hero-emblem-caption">
                  <span className="hero-emblem-badge">GOVERNMENT OF INDIA</span>
                  <strong>National Eligibility System</strong>
                </div>
              </div>

              <div className="hero-floating-card">
                <div className="floating-icon">
                  <FaLandmark style={{ color: '#EA580C', fontSize: '1.4rem' }} />
                </div>

                <div>
                  <strong>113+ Schemes</strong>
                  <span>{t.forEveryCitizen}</span>
                </div>
              </div>

            </div>

          </div>

          <div className="india-stripe">
            <span></span>
            <span></span>
            <span></span>
          </div>

        </section>

        {/* STATS WITH LIVE COUNT-UP */}
        <section className="stats-section">

          <div className="stats-container">

            {stats.map((stat, index) => (
              <div
                className="stat-item count-up-item"
                key={index}
              >
                <strong className="stat-number-glow">{stat.number}</strong>
                <span>{stat.label}</span>
              </div>
            ))}

          </div>

        </section>

        {/* CATEGORIES WITH 3D TILT */}
        <section className="content-section categories-section">

          <div className="section-heading">

            <span className="section-kicker">
              {t.browseCat}
            </span>

            <h2>{t.exploreCat}</h2>

            <p>{t.exploreCatDesc}</p>

          </div>

          <div className="category-grid">

            {categories.map((category, index) => (
              <div
                className="category-card tilt-card"
                key={index}
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
              >
                <div className="category-icon">
                  {category.icon}
                </div>

                <div>
                  <h3>{category.name}</h3>
                  <p>{category.count}</p>
                </div>

                <FaArrowRight className="category-arrow" />
              </div>
            ))}

          </div>

        </section>

        {/* HOW IT WORKS */}
        <section className="process-section">

          <div className="process-container">

            <div className="section-heading light">

              <span className="section-kicker">
                {t.simpleProcess}
              </span>

              <h2>{t.howItWorks}</h2>

              <p>{t.howItWorksDesc}</p>

            </div>

            <div className="steps-grid">

              {steps.map((step, index) => (
                <div
                  className="step-card"
                  key={index}
                >

                  <div className="step-number">
                    {step.number}
                  </div>

                  <div className="step-icon">
                    {step.icon}
                  </div>

                  <h3>{step.title}</h3>

                  <p>{step.desc}</p>

                  {index < steps.length - 1 && (
                    <div className="step-connector">
                      <FaArrowRight />
                    </div>
                  )}

                </div>
              ))}

            </div>

          </div>

        </section>

        {/* FEATURED SCHEMES */}
        <section className="content-section featured-section">

          <div className="section-heading">

            <span className="section-kicker">
              {t.popularNow}
            </span>

            <h2>{t.featuredSchemes}</h2>

            <p>{t.featuredDesc}</p>

          </div>

          <div className="scheme-grid">

            {featuredSchemes.map((scheme, index) => (
              <div
                className="scheme-card"
                key={index}
              >

                <div className="scheme-card-top">

                  <div className="scheme-icon">
                    {scheme.icon}
                  </div>

                  <span className="scheme-tag">
                    {scheme.category}
                  </span>

                </div>

                <h3>{scheme.title}</h3>

                <p>{scheme.description}</p>

                <Link
                  to="/register"
                  className="scheme-link"
                >
                  {t.checkEligibility}
                  <FaArrowRight />
                </Link>

              </div>
            ))}

          </div>

        </section>

        {/* NEWS */}
        <section className="content-section news-section">

          <div className="section-heading">

            <span className="section-kicker">
              {t.stayUpdated}
            </span>

            <h2>{t.latestNews}</h2>

          </div>

          <div className="news-list">

            {news.map((item, index) => (
              <div
                className="news-card"
                key={index}
              >

                <div className="news-icon">
                  <FaNewspaper />
                </div>

                <div className="news-date">
                  {item.date}
                </div>

                <p>{item.title}</p>

                <FaArrowRight className="news-arrow" />

              </div>
            ))}

          </div>

        </section>

        {/* FAQ */}
        <section className="faq-section">

          <div className="content-section">

            <div className="section-heading">

              <span className="section-kicker">
                {t.gotQuestions}
              </span>

              <h2>{t.faqTitle}</h2>

            </div>

            <div className="faq-list">

              {faqs.map((faq, index) => (
                <div
                  className={`faq-item ${
                    openFaq === index ? 'open' : ''
                  }`}
                  key={index}
                >

                  <button
                    className="faq-question"
                    onClick={() =>
                      setOpenFaq(
                        openFaq === index ? -1 : index
                      )
                    }
                  >
                    <span>
                      {faq.q}
                    </span>

                    <FaChevronDown />
                  </button>

                  {openFaq === index && (
                    <div className="faq-answer">
                      {faq.a}
                    </div>
                  )}

                </div>
              ))}

            </div>

          </div>

        </section>

        {/* FEEDBACK WITH INTERACTIVE STAR BURST & ANIMATED SUBMIT */}
        <section className="feedback-section">

          <div className="feedback-container">

            <div className="feedback-intro">

              <span className="section-kicker">
                {t.valueOpinion}
              </span>

              <h2>{t.shareFeedback}</h2>

              <p>{t.shareFeedbackDesc}</p>

            </div>

            <div className="feedback-card">

              {feedbackMsg && (
                <div className={`feedback-message ${isFeedbackSuccess ? 'feedback-success-animate' : ''}`}>
                  <FaCheckCircle />
                  {feedbackMsg}
                </div>
              )}

              <form onSubmit={submitFeedback}>

                <div className="form-group">
                  <label>{t.yourName}</label>

                  <input
                    type="text"
                    name="name"
                    value={feedback.name}
                    onChange={handleFeedbackChange}
                    placeholder={t.yourName}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>{t.yourEmail}</label>

                  <input
                    type="email"
                    name="email"
                    value={feedback.email}
                    onChange={handleFeedbackChange}
                    placeholder={t.yourEmail}
                    required
                  />
                </div>

                <div className="rating-group">

                  <label>{t.rateExperience}</label>

                  <div className="rating-stars">

                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => handleStarClick(star)}
                        className={`star ${star <= feedback.rating ? 'active' : ''} ${
                          starBurstIndex === star ? 'star-burst' : ''
                        }`}
                        aria-label={`Rate ${star} star`}
                      >
                        ★
                      </button>
                    ))}

                  </div>

                </div>

                <div className="form-group">

                  <label>{t.feedbackPlaceholder}</label>

                  <textarea
                    name="message"
                    value={feedback.message}
                    onChange={handleFeedbackChange}
                    placeholder={t.feedbackPlaceholder}
                    required
                  />

                </div>

                <button
                  type="submit"
                  disabled={isSubmittingFeedback}
                  className={`feedback-submit ${isFeedbackSuccess ? 'feedback-btn-success' : ''}`}
                >
                  {isSubmittingFeedback ? (
                    <span>{t.submittingFeedback}</span>
                  ) : isFeedbackSuccess ? (
                    <>
                      <FaCheck /> {t.submittedFeedback}
                    </>
                  ) : (
                    <>
                      {t.submitFeedback}
                      <FaArrowRight />
                    </>
                  )}
                </button>

              </form>

            </div>

          </div>

        </section>

        {/* FINAL CTA */}
        <section className="final-cta">

          <div className="final-cta-content">

            <div className="final-cta-icon">
              <FaSearch />
            </div>

            <h2>{t.readyTitle}</h2>

            <p>{t.readyDesc}</p>

            <Link
              to="/register"
              className="primary-btn shimmer-btn"
            >
              {t.registerNow}
              <FaArrowRight />
            </Link>

          </div>

        </section>

        {/* FOOTER */}
        <footer className="home-footer">

          <div className="footer-content">

            <div className="footer-brand">

              <div className="footer-logo">
                <FaLandmark style={{ color: '#FF9933', fontSize: '1.4rem' }} />
              </div>

              <div>
                <strong>
                  National Scheme Portal
                </strong>

                <span>
                  Government of India Eligibility System
                </span>
              </div>

            </div>

            <p>
              {t.footer}
            </p>

            <div className="footer-links">
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
              <Link to="/accessibility">Accessibility</Link>
            </div>

          </div>

        </footer>

      </div>
    </>
  );
}

export default Home;