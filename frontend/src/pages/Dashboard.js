import RecentlyViewed from '../components/RecentlyViewed';
import React, { useState, useEffect, useRef } from 'react';

import {
  FaSearch,
  FaMicrophone,
  FaTimes,
  FaBookmark,
  FaThLarge,
  FaList,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaVenusMars,
  FaBirthdayCake,
  FaFire,
  FaBalanceScale,
  FaEye,
  FaTractor,
  FaGraduationCap,
  FaHeartbeat,
  FaFemale,
  FaHome,
  FaBriefcase,
  FaHandshake,
  FaRunning,
  FaTrophy,
  FaLayerGroup,
  FaShieldAlt,
  FaWhatsapp,
  FaClock,
  FaExternalLinkAlt,
  FaFilter,
  FaCalendarAlt,
  FaRupeeSign,
  FaBuilding
} from 'react-icons/fa';

import './Dashboard.css';

function Dashboard() {
  // =========================================================
  // STATE
  // =========================================================

  const [schemes, setSchemes] = useState([]);
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  const [trendingSchemes, setTrendingSchemes] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [compareList, setCompareList] = useState([]);
  const [previewScheme, setPreviewScheme] = useState(null);

  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);

  const [isListening, setIsListening] = useState(false);

  const [showFilters, setShowFilters] = useState(false);

  const [filterState, setFilterState] = useState({
    minIncome: '',
    maxIncome: '',
    minAge: '',
    maxAge: ''
  });

  const [currentTime, setCurrentTime] = useState('');
  const [greeting, setGreeting] = useState('Good Morning');

  const searchInputRef = useRef(null);

  // =========================================================
  // TIME & GREETING
  // =========================================================

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const hours = now.getHours();
      const mins = now.getMinutes().toString().padStart(2, '0');

      setCurrentTime(
        `${hours % 12 || 12}:${mins} ${hours >= 12 ? 'PM' : 'AM'}`
      );

      if (hours < 12) {
        setGreeting('Good Morning 🌅');
      } else if (hours < 17) {
        setGreeting('Good Afternoon ☀️');
      } else if (hours < 21) {
        setGreeting('Good Evening 🌆');
      } else {
        setGreeting('Good Night 🌙');
      }
    };

    updateTime();

    const timer = setInterval(updateTime, 30000);

    return () => clearInterval(timer);
  }, []);

  // =========================================================
  // LOAD USER + DASHBOARD DATA
  // =========================================================

  useEffect(() => {
    const loadDashboard = async () => {
      let userData = null;

      try {
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
          userData = JSON.parse(storedUser);
        }
      } catch (error) {
        console.error('User data parse error:', error);
      }

      // No user -> login
      if (!userData) {
        setLoading(false);
        window.location.href = '/login';
        return;
      }

      setUser(userData);

      // Restore saved schemes if available
      try {
        const storedSaved = JSON.parse(
          localStorage.getItem('savedSchemeIds') || '[]'
        );

        if (Array.isArray(storedSaved)) {
          setSavedIds(storedSaved);
        }
      } catch (error) {
        console.error('Saved schemes parse error:', error);
      }

      // Recent searches
      try {
        const storedRecent = JSON.parse(
          localStorage.getItem('recentSearches') || '[]'
        );

        if (Array.isArray(storedRecent)) {
          setRecentSearches(storedRecent);
        }
      } catch (error) {
        setRecentSearches([]);
      }

      await Promise.allSettled([
        fetchMatchedSchemes(userData),
        fetchTrendingSchemes()
      ]);

      setLoading(false);
    };

    loadDashboard();

    // Keyboard shortcuts
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }

      if (e.key === 'Escape') {
        setShowRecentSearches(false);
        setPreviewScheme(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // =========================================================
  // CATEGORIES
  // =========================================================

  const categories = [
    'All',
    ...new Set(
      schemes
        .map((scheme) => scheme.category)
        .filter(Boolean)
    )
  ];

  // =========================================================
  // CATEGORY ICON
  // =========================================================

  const categoryIcon = (cat) => {
    const c = String(cat || '').toLowerCase();

    if (c.includes('agri') || c.includes('farm')) {
      return <FaTractor />;
    }

    if (c.includes('edu') || c.includes('scholar')) {
      return <FaGraduationCap />;
    }

    if (c.includes('health')) {
      return <FaHeartbeat />;
    }

    if (c.includes('women') || c.includes('girl')) {
      return <FaFemale />;
    }

    if (c.includes('hous')) {
      return <FaHome />;
    }

    if (
      c.includes('employ') ||
      c.includes('skill') ||
      c.includes('career')
    ) {
      return <FaBriefcase />;
    }

    if (
      c.includes('business') ||
      c.includes('startup') ||
      c.includes('loan')
    ) {
      return <FaHandshake />;
    }

    if (c.includes('sport')) {
      return <FaRunning />;
    }

    if (
      c.includes('senior') ||
      c.includes('pension')
    ) {
      return <FaTrophy />;
    }

    return <FaLayerGroup />;
  };

  // =========================================================
  // MATCH PERCENTAGE
  // =========================================================

  const computeMatchPercentage = (scheme) => {
    if (!scheme || !user) {
      return 0;
    }

    let checks = 0;
    let passed = 0;

    // Age
    if (
      scheme.min_age != null &&
      scheme.max_age != null &&
      user.age != null
    ) {
      checks++;

      const age = Number(user.age);
      const minAge = Number(scheme.min_age);
      const maxAge = Number(scheme.max_age);

      if (age >= minAge && age <= maxAge) {
        passed++;
      }
    }

    // Income
    if (
      scheme.max_income != null &&
      user.yearly_income != null
    ) {
      checks++;

      const income = Number(user.yearly_income);
      const maxIncome = Number(scheme.max_income);

      if (income <= maxIncome) {
        passed++;
      }
    }

    // Gender
    if (
      scheme.gender &&
      scheme.gender !== 'All' &&
      user.gender
    ) {
      checks++;

      if (
        String(scheme.gender).toLowerCase() ===
        String(user.gender).toLowerCase()
      ) {
        passed++;
      }
    }

    // State
    if (
      scheme.state &&
      scheme.state !== 'All' &&
      user.state
    ) {
      checks++;

      if (
        String(scheme.state).toLowerCase() ===
        String(user.state).toLowerCase()
      ) {
        passed++;
      }
    }

    if (checks === 0) {
      return 92;
    }

    return Math.round(
      60 + (passed / checks) * 40
    );
  };

  // =========================================================
  // FILTER + SEARCH
  // =========================================================

  const filteredSchemes = schemes
    .filter((scheme) => {
      const search = searchTerm.trim().toLowerCase();

      const searchableText = [
        scheme.name,
        scheme.category,
        scheme.description,
        scheme.benefits,
        scheme.ministry
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesSearch =
        !search ||
        searchableText.includes(search);

      const matchesCategory =
        selectedCategory === 'All' ||
        scheme.category === selectedCategory;

      // Income filter
      const schemeIncome =
        scheme.max_income != null
          ? Number(scheme.max_income)
          : Infinity;

      const minIncome =
        filterState.minIncome
          ? Number(filterState.minIncome)
          : 0;

      const maxIncome =
        filterState.maxIncome
          ? Number(filterState.maxIncome)
          : Infinity;

      const matchesIncome =
        schemeIncome >= minIncome &&
        schemeIncome <= maxIncome;

      // Age filter
      const schemeMinAge =
        scheme.min_age != null
          ? Number(scheme.min_age)
          : 0;

      const schemeMaxAge =
        scheme.max_age != null
          ? Number(scheme.max_age)
          : 100;

      const selectedMinAge =
        filterState.minAge
          ? Number(filterState.minAge)
          : 0;

      const selectedMaxAge =
        filterState.maxAge
          ? Number(filterState.maxAge)
          : 100;

      const matchesAge =
        schemeMaxAge >= selectedMinAge &&
        schemeMinAge <= selectedMaxAge;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesIncome &&
        matchesAge
      );
    })
    .sort((a, b) => {
      if (sortBy === 'income_high') {
        return (
          Number(b.max_income || 0) -
          Number(a.max_income || 0)
        );
      }

      if (sortBy === 'income_low') {
        return (
          Number(a.max_income || 0) -
          Number(b.max_income || 0)
        );
      }

      if (sortBy === 'category') {
        return String(a.category || '').localeCompare(
          String(b.category || '')
        );
      }

      if (sortBy === 'name') {
        return String(a.name || '').localeCompare(
          String(b.name || '')
        );
      }

      if (sortBy === 'match') {
        return (
          computeMatchPercentage(b) -
          computeMatchPercentage(a)
        );
      }

      return 0;
    });

  // =========================================================
  // FETCH MATCHED SCHEMES
  // =========================================================

  const fetchMatchedSchemes = async (userData) => {
    try {
      if (!userData) {
        setSchemes([]);
        return;
      }

      const requestBody = {
        age: userData.age ?? null,
        gender: userData.gender ?? null,
        caste: userData.caste ?? null,
        occupation: userData.occupation ?? null,
        state: userData.state ?? null,
        yearly_income:
          userData.yearly_income ??
          userData.income ??
          null
      };

      console.log(
        'Dashboard user:',
        userData
      );

      console.log(
        'Matching request:',
        requestBody
      );

      const response = await fetch(
        'http://localhost:5000/api/schemes/match',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        }
      );

      const rawText = await response.text();

      let data = null;

      try {
        data = rawText
          ? JSON.parse(rawText)
          : null;
      } catch (error) {
        console.error(
          'Invalid JSON from match API:',
          rawText
        );
      }

      if (!response.ok) {
        console.error(
          'Match API error:',
          response.status,
          data
        );

        throw new Error(
          data?.message ||
          `Server returned ${response.status}`
        );
      }

      // Backend can return:
      // []
      // { schemes: [] }
      // { data: [] }
      let result = [];

      if (Array.isArray(data)) {
        result = data;
      } else if (Array.isArray(data?.schemes)) {
        result = data.schemes;
      } else if (Array.isArray(data?.data)) {
        result = data.data;
      } else if (Array.isArray(data?.results)) {
        result = data.results;
      }

      // Remove invalid records
      result = result.filter(
        (scheme) =>
          scheme &&
          (scheme.id != null || scheme.name)
      );

      console.log(
        `Matched schemes received: ${result.length}`
      );

      setSchemes(result);
    } catch (error) {
      console.error(
        'fetchMatchedSchemes error:',
        error
      );

      setSchemes([]);
    }
  };

  // =========================================================
  // TRENDING SCHEMES
  // =========================================================

  const fetchTrendingSchemes = async () => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/schemes/trending/top'
      );

      if (!response.ok) {
        throw new Error(
          `Trending API returned ${response.status}`
        );
      }

      const data = await response.json();

      let result = [];

      if (Array.isArray(data)) {
        result = data;
      } else if (Array.isArray(data?.schemes)) {
        result = data.schemes;
      } else if (Array.isArray(data?.data)) {
        result = data.data;
      }

      setTrendingSchemes(result);
    } catch (error) {
      console.warn(
        'Trending schemes unavailable:',
        error
      );

      // Trending is optional.
      // Do not disturb the dashboard if it fails.
      setTrendingSchemes([]);
    }
  };

  // =========================================================
  // SAVE SCHEME
  // =========================================================

  const saveScheme = async (schemeId) => {
    if (!user?.id) {
      alert('Please login again.');
      return;
    }

    if (savedIds.includes(schemeId)) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/saved/${schemeId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_id: user.id
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || 'Unable to save scheme'
        );
      }

      const updated = [
        ...savedIds,
        schemeId
      ];

      setSavedIds(updated);

      localStorage.setItem(
        'savedSchemeIds',
        JSON.stringify(updated)
      );

      alert(
        data?.message ||
        'Scheme saved successfully!'
      );
    } catch (error) {
      console.error(
        'Save scheme error:',
        error
      );

      alert(
        error.message ||
        'Something went wrong!'
      );
    }
  };

  const unsaveScheme = async (schemeId) => {
    if (!user?.id) return;
    try {
      const response = await fetch(`http://localhost:5000/api/saved/${schemeId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id })
      });
      if (response.ok) {
        const updated = savedIds.filter(id => id !== schemeId);
        setSavedIds(updated);
        localStorage.setItem('savedSchemeIds', JSON.stringify(updated));
      }
    } catch (error) {
      console.error('Unsave error:', error);
    }
  };

  // =========================================================
  // WHATSAPP SHARE
  // =========================================================

  const shareOnWhatsApp = (scheme) => {
    const link =
      `${window.location.origin}/scheme/${scheme.id}`;

    const text =
      `🏛️ *${scheme.name}*\n\n` +
      `${scheme.description || ''}\n\n` +
      `💰 Benefits: ${scheme.benefits || 'Check details'}\n\n` +
      `View full details: ${link}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      '_blank'
    );
  };

  // =========================================================
  // SEARCH & VOICE SEARCH
  // =========================================================

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      const next = [
        searchTerm.trim(),
        ...recentSearches.filter(
          (s) => s.toLowerCase() !== searchTerm.trim().toLowerCase()
        )
      ].slice(0, 5);

      setRecentSearches(next);
      localStorage.setItem('recentSearches', JSON.stringify(next));
      setShowRecentSearches(false);
    }
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice search is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript;
      if (transcript) {
        setSearchTerm(transcript);
      }
    };

    recognition.start();
  };

  // =========================================================
  // COMPARE
  // =========================================================

  const toggleCompare = (id) => {
    setCompareList((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= 3) {
        alert('You can compare up to 3 schemes at a time.');
        return prev;
      }
      return [...prev, id];
    });
  };

  // =========================================================
  // SAVED CHECK
  // =========================================================

  const isSavedFiltered = (id) =>
    savedIds.includes(id);

  // =========================================================
  // LOADING SCREEN
  // =========================================================

  if (loading) {
    return (
      <div className="dash-page">
        <div style={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #E2E8F0',
            borderTopColor: '#0E2A4D',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <h2 style={{ fontSize: '1.25rem', color: '#0F172A' }}>
            Loading Eligible Schemes...
          </h2>
          <p style={{ color: '#64748B', margin: 0 }}>
            Analyzing welfare criteria for your citizen profile
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN DASHBOARD
  // =========================================================

  return (
    <div className="dash-page">

      {/* =====================================================
          1. EXECUTIVE CITIZEN HERO BANNER
      ===================================================== */}
      <section className="dash-hero-banner">
        <div className="dash-hero-inner">
          <div className="dash-citizen-profile">
            <div className="dash-citizen-avatar">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'C'}
            </div>
            <div className="dash-citizen-meta">
              <span className="dash-greeting-time">
                <FaClock /> {greeting} &bull; {currentTime}
              </span>
              <h1 className="dash-citizen-name">
                Namaste, <span>{user?.full_name?.split(' ')[0] || 'Citizen'}</span>
              </h1>
              <div className="dash-eligibility-summary">
                <span className="dash-eligibility-pill">
                  <FaShieldAlt /> Profile Verified
                </span>
                <span>{schemes.length} schemes matched to your criteria</span>
              </div>
            </div>
          </div>

          <div className="dash-metrics-group">
            <div className="dash-metric-card dash-metric-matched">
              <div className="dash-metric-icon">
                <FaCheckCircle />
              </div>
              <div className="dash-metric-data">
                <span className="dash-metric-number">{schemes.length}</span>
                <span className="dash-metric-label">Eligible Schemes</span>
              </div>
            </div>

            <div className="dash-metric-card dash-metric-saved">
              <div className="dash-metric-icon">
                <FaBookmark />
              </div>
              <div className="dash-metric-data">
                <span className="dash-metric-number">{savedIds.length}</span>
                <span className="dash-metric-label">Saved Schemes</span>
              </div>
            </div>

            <div className="dash-metric-card">
              <div className="dash-metric-icon" style={{ background: 'rgba(234, 88, 12, 0.25)', color: '#FDBA74' }}>
                <FaFire />
              </div>
              <div className="dash-metric-data">
                <span className="dash-metric-number">{trendingSchemes.length}</span>
                <span className="dash-metric-label">Trending Now</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          2. COMMAND BAR (SEARCH, MIC, SORT, CONTROLS)
      ===================================================== */}
      <div className="dash-command-dock">
        <div className="dash-command-bar">
          <div className="dash-search-container">
            <FaSearch className="dash-search-icon-lens" />
            <input
              ref={searchInputRef}
              type="text"
              className="dash-search-input-field"
              placeholder="Search welfare schemes by name, ministry, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowRecentSearches(true)}
              onBlur={() => setTimeout(() => setShowRecentSearches(false), 150)}
              onKeyDown={handleSearchSubmit}
            />
            {searchTerm && (
              <button
                className="dash-search-clear-btn"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search text"
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
              >
                <FaTimes />
              </button>
            )}
            <button
              className={`dash-search-mic-btn ${isListening ? 'listening' : ''}`}
              onClick={handleVoiceSearch}
              aria-label="Voice search"
              type="button"
              title="Voice search in Hindi or English"
            >
              <FaMicrophone />
            </button>
            <span className="dash-keyboard-hint">Ctrl K</span>

            {/* RECENT SEARCHES */}
            {showRecentSearches && recentSearches.length > 0 && (
              <div className="dash-search-dropdown">
                <div className="dash-dropdown-section-title">Recent Searches</div>
                {recentSearches.map((term, i) => (
                  <div
                    key={i}
                    className="dash-dropdown-query-item"
                    onMouseDown={() => setSearchTerm(term)}
                  >
                    <FaSearch style={{ fontSize: '0.8rem', color: '#94A3B8' }} />
                    {term}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="dash-control-actions">
            <select
              className="dash-sort-selector"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort schemes"
            >
              <option value="default">Sort: Default</option>
              <option value="match">Highest Match %</option>
              <option value="name">Name (A-Z)</option>
              <option value="category">Category</option>
              <option value="income_high">Max Income &darr;</option>
            </select>

            <div className="dash-view-mode-group">
              <button
                className={`dash-view-btn-toggle ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid view"
                aria-label="Grid view"
              >
                <FaThLarge />
              </button>
              <button
                className={`dash-view-btn-toggle ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List view"
                aria-label="List view"
              >
                <FaList />
              </button>
            </div>

            <button
              className={`dash-filter-toggle-btn ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters((prev) => !prev)}
              aria-label="Toggle filter drawer"
            >
              <FaFilter />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          3. ADVANCED FILTER DRAWER
      ===================================================== */}
      {showFilters && (
        <div className="dash-filter-drawer-box">
          <div className="dash-filter-drawer-grid">
            <div className="dash-filter-cell">
              <label><FaRupeeSign /> Min Income (₹)</label>
              <input
                type="number"
                placeholder="e.g. 0"
                value={filterState.minIncome}
                onChange={(e) => setFilterState({ ...filterState, minIncome: e.target.value })}
              />
            </div>
            <div className="dash-filter-cell">
              <label><FaRupeeSign /> Max Income (₹)</label>
              <input
                type="number"
                placeholder="e.g. 250000"
                value={filterState.maxIncome}
                onChange={(e) => setFilterState({ ...filterState, maxIncome: e.target.value })}
              />
            </div>
            <div className="dash-filter-cell">
              <label><FaCalendarAlt /> Min Age (Years)</label>
              <input
                type="number"
                placeholder="e.g. 18"
                value={filterState.minAge}
                onChange={(e) => setFilterState({ ...filterState, minAge: e.target.value })}
              />
            </div>
            <div className="dash-filter-cell">
              <label><FaCalendarAlt /> Max Age (Years)</label>
              <input
                type="number"
                placeholder="e.g. 60"
                value={filterState.maxAge}
                onChange={(e) => setFilterState({ ...filterState, maxAge: e.target.value })}
              />
            </div>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              onClick={() => setFilterState({ minIncome: '', maxIncome: '', minAge: '', maxAge: '' })}
              style={{ padding: '8px 16px', borderRadius: '8px', background: '#F1F5F9', border: '1px solid #CBD5E1', fontWeight: '700', fontSize: '0.8125rem' }}
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* =====================================================
          4. CATEGORY CHIP STRIP
      ===================================================== */}
      <div className="dash-category-strip">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`dash-cat-chip ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            <span className="dash-cat-icon">
              {cat === 'All' ? <FaLayerGroup /> : categoryIcon(cat)}
            </span>
            <span>{cat}</span>
          </button>
        ))}
      </div>

      {/* RECENTLY VIEWED */}
      <div className="dash-content-wrap" style={{ marginBottom: '24px' }}>
        <RecentlyViewed userId={user?.id} />
      </div>

      {/* =====================================================
          5. SCHEMES DOSSIER GRID / LIST
      ===================================================== */}
      <div className="dash-content-wrap">
        {filteredSchemes.length === 0 ? (
          <div className="dash-empty-dossier">
            <div className="dash-empty-dossier-icon">
              <FaSearch />
            </div>
            <h3>No matching welfare schemes found</h3>
            <p>
              {schemes.length === 0
                ? 'We could not find government schemes matching your current demographic profile.'
                : 'No schemes match your active search query or filter thresholds.'}
            </p>
            <a href="/profile" className="dash-btn-clear-filters">
              Update Profile Details
            </a>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'dash-schemes-grid-view' : 'dash-schemes-list-view'}>
            {filteredSchemes.map((scheme, index) => {
              const isSaved = isSavedFiltered(scheme.id);
              const matchPct = computeMatchPercentage(scheme);
              const isComparing = compareList.includes(scheme.id);

              return (
                <div
                  key={scheme.id}
                  className="dash-scheme-dossier-card"
                  style={{ animationDelay: `${Math.min(index, 6) * 0.05}s` }}
                >
                  <div>
                    <div className="dash-card-top-row">
                      <span className="dash-category-badge-chip">
                        {categoryIcon(scheme.category)} {scheme.category || 'General'}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className={`dash-match-meter-pill ${matchPct >= 80 ? 'match-high' : matchPct >= 50 ? 'match-mid' : 'match-low'}`}>
                          {matchPct}% Match
                        </span>
                        <button
                          className={`dash-bookmark-btn ${isSaved ? 'saved' : ''}`}
                          onClick={() => isSaved ? unsaveScheme(scheme.id) : saveScheme(scheme.id)}
                          title={isSaved ? 'Remove from saved' : 'Save scheme'}
                          aria-label="Bookmark scheme"
                        >
                          <FaBookmark />
                        </button>
                      </div>
                    </div>

                    <h3 className="dash-scheme-title-text">{scheme.name}</h3>

                    {scheme.ministry && (
                      <div className="dash-ministry-tag">
                        <FaBuilding style={{ color: '#94A3B8' }} />
                        <span>{scheme.ministry}</span>
                      </div>
                    )}

                    {scheme.benefits && (
                      <div className="dash-benefit-banner">
                        <strong>Key Benefit:</strong> {scheme.benefits}
                      </div>
                    )}

                    <div className="dash-eligibility-criteria-chips">
                      <span className="dash-criteria-pill">
                        <FaBirthdayCake style={{ color: '#F59E0B' }} />
                        {scheme.min_age || 0} - {scheme.max_age || '∞'} yrs
                      </span>
                      <span className="dash-criteria-pill">
                        <FaRupeeSign style={{ color: '#10B981' }} />
                        Max {scheme.max_income ? `₹${Number(scheme.max_income).toLocaleString()}` : 'No Limit'}
                      </span>
                      <span className="dash-criteria-pill">
                        <FaVenusMars style={{ color: '#6366F1' }} />
                        {scheme.gender || 'All'}
                      </span>
                      <span className="dash-criteria-pill">
                        <FaMapMarkerAlt style={{ color: '#EF4444' }} />
                        {scheme.state || 'All India'}
                      </span>
                    </div>
                  </div>

                  <div className="dash-card-bottom-actions">
                    <a
                      href={`/scheme/${scheme.id}`}
                      className="dash-primary-details-btn"
                    >
                      <FaExternalLinkAlt style={{ fontSize: '0.78rem' }} /> View Details & Apply
                    </a>

                    <button
                      className="dash-secondary-icon-btn"
                      onClick={() => shareOnWhatsApp(scheme)}
                      title="Share via WhatsApp"
                      aria-label="Share scheme"
                    >
                      <FaWhatsapp style={{ color: '#25D366' }} />
                    </button>

                    <button
                      className="dash-secondary-icon-btn"
                      onClick={() => setPreviewScheme(scheme)}
                      title="Quick Preview"
                      aria-label="Quick Preview"
                    >
                      <FaEye />
                    </button>

                    <button
                      className={`dash-secondary-icon-btn ${isComparing ? 'active' : ''}`}
                      onClick={() => toggleCompare(scheme.id)}
                      title={isComparing ? 'Remove from compare' : 'Add to compare'}
                      aria-label="Compare scheme"
                    >
                      <FaBalanceScale />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =====================================================
          6. QUICK PREVIEW MODAL
      ===================================================== */}
      {previewScheme && (
        <div
          className="dash-modal-overlay"
          onClick={() => setPreviewScheme(null)}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(4, 16, 30, 0.65)', backdropFilter: 'blur(6px)',
            zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF', borderRadius: '20px', padding: '32px',
              maxWidth: '680px', width: '100%', maxHeight: '90vh', overflowY: 'auto',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)', position: 'relative'
            }}
          >
            <button
              onClick={() => setPreviewScheme(null)}
              style={{
                position: 'absolute', top: '20px', right: '20px',
                width: '36px', height: '36px', borderRadius: '50%',
                background: '#F1F5F9', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <FaTimes />
            </button>

            <span className="gov-badge gov-badge-navy" style={{ marginBottom: '12px' }}>
              {previewScheme.category}
            </span>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', color: '#0F172A' }}>{previewScheme.name}</h2>
            <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '16px' }}>{previewScheme.ministry}</p>
            
            <p style={{ color: '#334155', lineHeight: '1.6', marginBottom: '20px' }}>
              {previewScheme.description}
            </p>

            {previewScheme.benefits && (
              <div style={{ background: '#FFF7ED', borderLeft: '4px solid #EA580C', padding: '14px', borderRadius: '8px', marginBottom: '20px' }}>
                <strong style={{ color: '#9A3412', display: 'block', marginBottom: '4px' }}>Benefits:</strong>
                <span style={{ color: '#7C2D12', fontSize: '0.9rem' }}>{previewScheme.benefits}</span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <a
                href={`/scheme/${previewScheme.id}`}
                className="dash-primary-details-btn"
                style={{ flex: 1, padding: '12px', textAlign: 'center' }}
              >
                Full Scheme Dossier
              </a>
              {previewScheme.apply_link && (
                <a
                  href={previewScheme.apply_link}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: '12px 20px', borderRadius: '10px',
                    background: '#EA580C', color: '#FFFFFF', fontWeight: '700',
                    textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px'
                  }}
                >
                  Apply <FaExternalLinkAlt style={{ fontSize: '0.75rem' }} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          7. COMPARE FLOATING DOCK
      ===================================================== */}
      {compareList.length > 0 && (
        <div
          style={{
            position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
            background: '#0A1E36', color: '#FFFFFF', padding: '14px 24px',
            borderRadius: '50px', boxShadow: '0 12px 36px rgba(0,0,0,0.3)',
            display: 'flex', alignItems: 'center', gap: '16px', zIndex: 1000,
            border: '1px solid rgba(255,255,255,0.15)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', fontWeight: '700' }}>
            <FaBalanceScale style={{ color: '#F59E0B' }} />
            <span>Comparing {compareList.length} Schemes</span>
          </div>
          <button
            onClick={() => setCompareList([])}
            style={{ background: 'rgba(255,255,255,0.15)', color: '#FFFFFF', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' }}
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;