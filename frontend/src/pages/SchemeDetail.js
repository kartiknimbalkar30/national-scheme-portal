import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FaArrowLeft,
  FaLandmark,
  FaBuilding,
  FaInfoCircle,
  FaCheckCircle,
  FaUserCheck,
  FaBirthdayCake,
  FaRupeeSign,
  FaVenusMars,
  FaMapMarkerAlt,
  FaUsers,
  FaBriefcase,
  FaFileAlt,
  FaListOl,
  FaPhoneAlt,
  FaGlobe,
  FaStar,
  FaBookmark,
  FaExternalLinkAlt,
  FaVolumeUp,
  FaPause,
  FaStop,
  FaPrint,
  FaCheck
} from 'react-icons/fa';
import './SchemeDetail.css';

function SchemeDetail() {
  const { id } = useParams();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');

  const [avgRating, setAvgRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [myRating, setMyRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // INTERACTIVE DOCUMENT CHECKLIST STATE
  const [checkedDocs, setCheckedDocs] = useState({});

  // TEXT-TO-SPEECH (SPEECH SYNTHESIS) STATE
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    fetchSchemeDetail();
    fetchAvgRating();
    if (userData?.id) {
      fetchMyRating(userData.id);
    }

    // Cleanup speech on unmount
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchSchemeDetail = async () => {
    try {
      const response = await fetch(`https://national-scheme-portal.onrender.com/api/schemes/${id}`);
      if (response.status === 404) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      const data = await response.json();
      setScheme(data);
      setLoading(false);
    } catch (error) {
      console.error('Fetch scheme detail error:', error);
      setNotFound(true);
      setLoading(false);
    }
  };

  const fetchAvgRating = async () => {
    try {
      const response = await fetch(`https://national-scheme-portal.onrender.com/api/schemes/${id}/rating`);
      const data = await response.json();
      setAvgRating(data.avgRating || 0);
      setTotalRatings(data.totalRatings || 0);
    } catch (error) {
      console.error('Fetch avg rating error:', error);
    }
  };

  const fetchMyRating = async (userId) => {
    try {
      const response = await fetch(`https://national-scheme-portal.onrender.com/api/schemes/${id}/my-rating?user_id=${userId}`);
      const data = await response.json();
      setMyRating(data.rating || 0);
    } catch (error) {
      console.error('Fetch my rating error:', error);
    }
  };

  const submitRating = async (ratingValue) => {
    if (!user) {
      setMessage('Please log in to rate this scheme.');
      return;
    }
    try {
      const response = await fetch(`https://national-scheme-portal.onrender.com/api/schemes/${id}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, rating: ratingValue })
      });
      if (response.ok) {
        setMyRating(ratingValue);
        setMessage('Thank you for rating this scheme!');
        fetchAvgRating();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Rating error:', error);
    }
  };

  const saveScheme = async () => {
    if (!user) {
      setMessage('Please log in to save this scheme.');
      return;
    }
    try {
      const response = await fetch(`https://national-scheme-portal.onrender.com/api/saved/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id })
      });
      const data = await response.json();
      setMessage(data.message || 'Scheme saved to your profile!');
      setTimeout(() => setMessage(''), 3500);
    } catch (error) {
      setMessage('Failed to save scheme.');
    }
  };

  // TEXT-TO-SPEECH CONTROLS
  const handleToggleSpeak = () => {
    if (!('speechSynthesis' in window) || !scheme) return;

    if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      return;
    }

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      return;
    }

    window.speechSynthesis.cancel();

    const speechText = `
      Scheme name: ${scheme.name}.
      Ministry: ${scheme.ministry || 'Government of India'}.
      About this scheme: ${scheme.description || ''}.
      Key benefits: ${scheme.benefits || ''}.
      Age requirement: ${scheme.min_age || 0} to ${scheme.max_age || 'no limit'} years.
      Target gender: ${scheme.gender || 'All citizens'}.
    `;

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Pick Indian English/Hindi voice if available
    const voices = window.speechSynthesis.getVoices();
    const indianVoice = voices.find(v => v.lang.includes('IN') || v.lang.includes('hi') || v.name.includes('India'));
    if (indianVoice) {
      utterance.voice = indianVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  // DOCUMENT CHECKLIST TOGGLE
  const toggleDoc = (index) => {
    setCheckedDocs(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (loading) {
    return (
      <div className="sd-loading">
        <div className="sd-spinner"></div>
        <p>Loading scheme dossier...</p>
      </div>
    );
  }

  if (notFound || !scheme) {
    return (
      <div className="sd-not-found">
        <h2>Scheme Dossier Not Found</h2>
        <p>The requested government scheme could not be located in our records.</p>
        <Link to="/dashboard" className="sd-btn-primary">
          <FaArrowLeft /> Back to Dashboard
        </Link>
      </div>
    );
  }

  // Parse documents and steps
  const rawDocs = scheme.documents_required || scheme.documents || '';
  const documentsList = typeof rawDocs === 'string'
    ? rawDocs.split(/[\n,;•]+/).map(d => d.trim()).filter(Boolean)
    : Array.isArray(rawDocs) ? rawDocs : [];

  const rawSteps = scheme.application_steps || scheme.apply_steps || '';
  const stepsList = typeof rawSteps === 'string'
    ? rawSteps
        .split(/(?:\r?\n|;|\s*•\s*|(?=Step\s*\d+:?))/i)
        .map(s => s.replace(/^Step\s*\d+:\s*/i, '').trim())
        .filter(Boolean)
    : Array.isArray(rawSteps) ? rawSteps : [];

  const checkedCount = Object.values(checkedDocs).filter(Boolean).length;
  const docPercent = documentsList.length > 0 ? Math.round((checkedCount / documentsList.length) * 100) : 100;

  return (
    <div className="sd-page">
      <div className="sd-container">
        
        {/* TOP BAR / NAVIGATION / UTILITIES */}
        <div className="sd-top-bar no-print">
          <Link to="/dashboard" className="sd-back-link">
            <FaArrowLeft /> Back to Dashboard
          </Link>

          <div className="sd-utility-buttons">
            {/* TEXT TO SPEECH READER */}
            <button
              onClick={handleToggleSpeak}
              className={`sd-tool-btn ${isSpeaking ? 'active-audio' : ''}`}
              title="Listen to scheme details in audio"
            >
              {isSpeaking && !isPaused ? (
                <>
                  <FaPause /> Pause Audio
                  <span className="sd-audio-equalizer">
                    <span></span><span></span><span></span>
                  </span>
                </>
              ) : isPaused ? (
                <>
                  <FaVolumeUp /> Resume Audio
                </>
              ) : (
                <>
                  <FaVolumeUp /> 🔊 Listen Scheme
                </>
              )}
            </button>

            {isSpeaking && (
              <button onClick={handleStopSpeak} className="sd-tool-btn sd-stop-btn" title="Stop Audio">
                <FaStop /> Stop
              </button>
            )}

            {/* 1-CLICK OFFICIAL DOSSIER PRINT */}
            <button
              onClick={() => window.print()}
              className="sd-tool-btn sd-print-btn"
              title="Print or Save PDF Dossier"
            >
              <FaPrint /> Print / Save PDF
            </button>
          </div>
        </div>

        {/* HEADER HERO */}
        <div className="sd-header">
          <div className="sd-header-badge-row">
            <span className="sd-category-badge">{scheme.category || 'General'}</span>
            <span className="sd-verified-tag"><FaCheckCircle /> Govt. Verified</span>
          </div>

          <h1 className="sd-title">
            <FaLandmark className="sd-title-icon" /> {scheme.name}
          </h1>

          {scheme.ministry && (
            <p className="sd-ministry">
              <FaBuilding /> {scheme.ministry}
            </p>
          )}

          <div className="sd-rating-badge no-print">
            <div className="sd-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  style={{
                    color: star <= Math.round(avgRating) ? '#F59E0B' : 'rgba(255,255,255,0.3)',
                    marginRight: '2px'
                  }}
                />
              ))}
            </div>
            <span className="sd-rating-text">
              {avgRating > 0 ? `${avgRating} (${totalRatings} review${totalRatings !== 1 ? 's' : ''})` : 'No reviews yet'}
            </span>
          </div>
        </div>

        {/* STATUS MESSAGE */}
        {message && (
          <div className={`sd-message ${message.includes('Thank') || message.includes('saved') ? 'success' : 'error'} no-print`}>
            <FaInfoCircle /> {message}
          </div>
        )}

        {/* ABOUT SCHEME */}
        <div className="sd-section">
          <h3><FaInfoCircle className="sd-sec-icon" /> About This Scheme</h3>
          <p>{scheme.description || 'Comprehensive government initiative for citizen welfare.'}</p>
        </div>

        {/* BENEFITS */}
        {scheme.benefits && (
          <div className="sd-section sd-benefits-section">
            <h3><FaCheckCircle className="sd-sec-icon sd-emerald" /> Key Benefits & Entitlements</h3>
            <p>{scheme.benefits}</p>
          </div>
        )}

        {/* ELIGIBILITY CRITERIA */}
        <div className="sd-section">
          <h3><FaUserCheck className="sd-sec-icon sd-blue" /> Eligibility Requirements</h3>
          <div className="sd-elig-grid">
            <div className="sd-elig-card">
              <span className="sd-elig-label">AGE RANGE</span>
              <p className="sd-elig-value">
                <FaBirthdayCake className="sd-pill-icon" /> {scheme.min_age || 0} - {scheme.max_age || 'No limit'} years
              </p>
            </div>

            <div className="sd-elig-card">
              <span className="sd-elig-label">INCOME CEILING</span>
              <p className="sd-elig-value">
                <FaRupeeSign className="sd-pill-icon" /> {scheme.max_income ? `₹${Number(scheme.max_income).toLocaleString()}` : 'No limit'}
              </p>
            </div>

            <div className="sd-elig-card">
              <span className="sd-elig-label">TARGET GENDER</span>
              <p className="sd-elig-value">
                <FaVenusMars className="sd-pill-icon" /> {scheme.gender || 'All'}
              </p>
            </div>

            <div className="sd-elig-card">
              <span className="sd-elig-label">LOCATION / STATE</span>
              <p className="sd-elig-value">
                <FaMapMarkerAlt className="sd-pill-icon" /> {scheme.state || 'All India'}
              </p>
            </div>

            {scheme.caste && (
              <div className="sd-elig-card">
                <span className="sd-elig-label">CASTE CATEGORY</span>
                <p className="sd-elig-value">
                  <FaUsers className="sd-pill-icon" /> {scheme.caste}
                </p>
              </div>
            )}

            {scheme.occupation && (
              <div className="sd-elig-card">
                <span className="sd-elig-label">OCCUPATION</span>
                <p className="sd-elig-value">
                  <FaBriefcase className="sd-pill-icon" /> {scheme.occupation}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* INTERACTIVE DOCUMENTS CHECKLIST WITH READINESS PROGRESS */}
        {documentsList.length > 0 && (
          <div className="sd-section">
            <div className="sd-section-header-flex">
              <h3><FaFileAlt className="sd-sec-icon" /> Documents Required & Readiness Checklist</h3>
              <span className="sd-check-hint no-print">Click items to track your document readiness</span>
            </div>

            {/* READINESS PROGRESS BAR */}
            <div className="sd-readiness-box no-print">
              <div className="sd-readiness-header">
                <span>Document Readiness: <strong>{checkedCount} of {documentsList.length} Ready</strong></span>
                <span className={`sd-readiness-percent ${docPercent === 100 ? 'ready-100' : ''}`}>
                  {docPercent === 100 ? '✓ 100% Ready to Apply!' : `${docPercent}% Ready`}
                </span>
              </div>
              <div className="sd-progress-track">
                <div
                  className={`sd-progress-fill ${docPercent === 100 ? 'fill-complete' : ''}`}
                  style={{ width: `${docPercent}%` }}
                />
              </div>
            </div>

            <div className="sd-list">
              {documentsList.map((doc, i) => {
                const isChecked = !!checkedDocs[i];
                return (
                  <div
                    key={i}
                    onClick={() => toggleDoc(i)}
                    className={`sd-doc-item sd-doc-interactive ${isChecked ? 'doc-checked' : ''}`}
                  >
                    <div className={`sd-checkbox ${isChecked ? 'checked' : ''}`}>
                      {isChecked ? <FaCheck /> : null}
                    </div>
                    <span className={isChecked ? 'doc-text-ready' : ''}>{doc}</span>
                    {isChecked && <span className="sd-ready-tag no-print">Ready</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* GLOWING STEP-BY-STEP APPLICATION GUIDE */}
        {stepsList.length > 0 && (
          <div className="sd-section">
            <h3><FaListOl className="sd-sec-icon" /> Step-by-Step Application Guide</h3>
            <div className="sd-stepper-timeline">
              {stepsList.map((step, i) => (
                <div key={i} className="sd-step-node">
                  <div className="sd-step-indicator">
                    <span className="sd-step-num">{i + 1}</span>
                    {i < stepsList.length - 1 && <div className="sd-step-line" />}
                  </div>
                  <div className="sd-step-body">
                    <strong>Step {i + 1}</strong>
                    <p>{step.replace(/^\d+\.\s*/, '')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HELPLINE & OFFICIAL LINKS */}
        {(scheme.helpline_number || scheme.official_website) && (
          <div className="sd-section">
            <h3><FaPhoneAlt className="sd-sec-icon" /> Official Helpline & Assistance</h3>
            <div className="sd-helpline-wrap">
              {scheme.helpline_number && (
                <div className="sd-helpline-chip">
                  <FaPhoneAlt /> Helpline: <strong>{scheme.helpline_number}</strong>
                </div>
              )}
              {scheme.official_website && (
                <a
                  href={scheme.official_website}
                  target="_blank"
                  rel="noreferrer"
                  className="sd-helpline-chip sd-website-link"
                >
                  <FaGlobe /> Official Portal <FaExternalLinkAlt style={{ fontSize: '0.75rem' }} />
                </a>
              )}
            </div>
          </div>
        )}

        {/* CITIZEN RATING */}
        <div className="sd-section no-print">
          <h3><FaStar className="sd-sec-icon" style={{ color: '#F59E0B' }} /> Citizen Feedback & Rating</h3>
          <div className="sd-stars-container">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => submitRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="sd-star-btn"
                aria-label={`Rate ${star} star`}
              >
                <FaStar
                  style={{
                    color: (hoverRating || myRating) >= star ? '#F59E0B' : '#CBD5E1',
                    fontSize: '1.75rem',
                    transition: 'color 0.15s ease'
                  }}
                />
              </button>
            ))}
          </div>
          {myRating > 0 && (
            <p className="sd-my-rating">You have rated this scheme {myRating} / 5 stars</p>
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div className="sd-actions no-print">
          <button onClick={saveScheme} className="sd-action-btn sd-save-btn">
            <FaBookmark /> Save to My Profile
          </button>
          {scheme.apply_link && (
            <a
              href={scheme.apply_link}
              target="_blank"
              rel="noreferrer"
              className="sd-action-btn sd-apply-btn"
            >
              <FaExternalLinkAlt /> Apply on Official Portal
            </a>
          )}
        </div>

      </div>
    </div>
  );
}

export default SchemeDetail;
