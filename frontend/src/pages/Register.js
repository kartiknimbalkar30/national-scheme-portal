import React, { useState, useRef, useEffect } from 'react';
import statesData from '../statesData';
import { useToast } from '../components/Toast';
import {
  FaUser, FaPhone, FaEnvelope, FaLock, FaBirthdayCake, FaVenusMars,
  FaMapMarkedAlt, FaMapPin, FaCity, FaHome, FaUsers, FaChild,
  FaRupeeSign, FaPrayingHands, FaGraduationCap, FaBriefcase,
  FaShieldAlt, FaCheckCircle, FaPaperPlane, FaArrowRight,
  FaBuilding, FaFlag, FaLandmark, FaEye, FaEyeSlash, FaExclamationTriangle
} from 'react-icons/fa';
import './Register.css';

const OTP_LENGTH = 6;

// NEW: isolated timer component — this ticks every second on its OWN,
// without re-rendering the whole Register form (that full-form re-render every
// second was what caused the OTP boxes to blink while typing).
function OtpCountdown({ seconds, onExpire }) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (remaining <= 0) {
      if (onExpire) onExpire();
      return;
    }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining, onExpire]);

  if (remaining <= 0) return null;
  return (
    <span className="rp-otp-timer">
      Resend OTP in 00:{remaining.toString().padStart(2, '0')}
    </span>
  );
}

// NEW: Field is now a top-level component (stable across renders) instead of being
// defined inside Register. Defining a component inside another component's body means
// React treats it as a brand-new component type on every re-render — which was
// destroying and recreating every input on each keystroke, killing focus after 1 letter.
function Field({ icon: Icon, label, name, required = true, fieldRefs, shakeField, children }) {
  const childArray = React.Children.toArray(children);
  const [firstChild, ...restChildren] = childArray;
  const enhancedFirst = name
    ? React.cloneElement(firstChild, {
        'aria-label': label,
        ref: (el) => { fieldRefs.current[name] = el; }
      })
    : React.cloneElement(firstChild, { 'aria-label': label });
  return (
    <div className={`rp-field-v2 ${shakeField === name ? 'rp-shake' : ''}`}>
      <label className="rp-label-v2">
        <Icon className="rp-label-icon" /> {label}
        {required && <span className="rp-required-star">*</span>}
      </label>
      {enhancedFirst}
      {restChildren}
    </div>
  );
}

function Register() {
  const { showToast, ToastComponent } = useToast();

  // otp is kept as a plain string (same as before) for backend compatibility
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    state: '',
    district: '',
    taluka: '',
    village_city: '',
    pin_code: '',
    caste: '',
    religion: '',
    occupation: '',
    yearly_income: '',
    education: '',
    family_members: '',
    number_of_children: '',
    house_type: ''
  });

  const otpBoxRefs = useRef([]);

  // ---- NEW: state for the additional features requested (does not touch formData/backend) ----
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [otpTimerActive, setOtpTimerActive] = useState(false);
  const [otpSentCount, setOtpSentCount] = useState(0);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [shakeField, setShakeField] = useState(null);
  const [successOverlay, setSuccessOverlay] = useState(false);
  const [successCountdown, setSuccessCountdown] = useState(3);
  const [ripples, setRipples] = useState([]);
  const fieldRefs = useRef({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStateChange = (e) => {
    setFormData({ ...formData, state: e.target.value, district: '' });
  };

  const sendEmailOtp = async () => {
    if (!formData.email) {
      showToast('Please enter your email address first!', 'warning');
      return;
    }
    setSendingOtp(true); // NEW: turns the button color/spinner on immediately on click
    try {
      const response = await fetch('http://localhost:5000/api/auth/send-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      const data = await response.json();
      if (response.ok) {
        showToast(data.message || 'OTP sent to your email!', 'success');
        setOtpSent(true);
        setOtp('');
        setOtpTimerActive(true); // NEW: start the resend countdown (isolated component, no full-form re-render)
        setOtpSentCount((c) => c + 1);
        setTimeout(() => {
          const first = otpBoxRefs.current[0];
          if (first) first.focus();
        }, 50);
      } else {
        showToast(data.message || 'Failed to send OTP!', 'error');
      }
    } catch (error) {
      showToast('Something went wrong! Please check your connection.', 'error');
    } finally {
      setSendingOtp(false); // NEW
    }
  };

  const verifyEmailOtp = async () => {
    if (otp.length < OTP_LENGTH) {
      showToast('Please enter the complete 6-digit OTP!', 'warning');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp })
      });
      const data = await response.json();
      if (response.ok) {
        showToast(data.message || 'Email verified successfully!', 'success');
        setOtpVerified(true);
      } else {
        showToast(data.message || 'Invalid OTP!', 'error');
      }
    } catch (error) {
      showToast('Something went wrong! Please try again.', 'error');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    // ---- NEW: pre-submit validation (required fields + password match) — added before existing logic, nothing below is changed ----
    if (!validateAndFocusFirstInvalid()) return;
    if (!passwordsMatch) {
      showToast('Passwords do not match!', 'warning');
      const el = fieldRefs.current['confirmPassword'];
      if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.focus(); }
      setShakeField('confirmPassword');
      setTimeout(() => setShakeField(null), 600);
      return;
    }
    if (!otpVerified) {
      showToast('Please verify your email OTP first!', 'warning');
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        showToast('Registration Successful! Redirecting to login... 🎉', 'success');
        setSuccessOverlay(true); // NEW: show success card with countdown instead of instant redirect
      } else {
        showToast(data.message || 'Registration failed!', 'error');
        setSubmitting(false);
      }
    } catch (error) {
      showToast('Something went wrong! Please try again.', 'error');
      setSubmitting(false);
    }
  };

  // ---- OTP boxes: clean array-based digit handling for reliable auto-advance ----
  const otpDigits = Array.from({ length: OTP_LENGTH }, (_, i) => otp[i] || '');

  const setOtpFromDigits = (digitsArray) => {
    setOtp(digitsArray.join('').replace(/\s+$/, ''));
  };

  const handleOtpBoxChange = (index, rawValue) => {
    const digit = rawValue.replace(/[^0-9]/g, '').slice(-1);
    const digitsArray = [...otpDigits];
    digitsArray[index] = digit;
    setOtpFromDigits(digitsArray);

    if (digit) {
      const nextIndex = index + 1;
      if (nextIndex < OTP_LENGTH) {
        requestAnimationFrame(() => {
          const next = otpBoxRefs.current[nextIndex];
          if (next) next.focus();
        });
      }
    }
  };

  const handleOtpBoxKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const digitsArray = [...otpDigits];
      if (digitsArray[index]) {
        digitsArray[index] = '';
        setOtpFromDigits(digitsArray);
      } else if (index > 0) {
        digitsArray[index - 1] = '';
        setOtpFromDigits(digitsArray);
        const prev = otpBoxRefs.current[index - 1];
        if (prev) prev.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      const prev = otpBoxRefs.current[index - 1];
      if (prev) prev.focus();
    } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      const next = otpBoxRefs.current[index + 1];
      if (next) next.focus();
    } else if (e.key === 'Delete') {
      // NEW: Delete clears only the current box, cursor stays put
      e.preventDefault();
      const digitsArray = [...otpDigits];
      digitsArray[index] = '';
      setOtpFromDigits(digitsArray);
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, OTP_LENGTH);
    if (pasted) {
      setOtp(pasted);
      const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
      requestAnimationFrame(() => {
        const target = otpBoxRefs.current[focusIndex];
        if (target) target.focus();
      });
    }
  };

  // ---- FIX: OTP resend timer is now handled by an isolated <OtpCountdown> component below,
  // so it no longer re-renders the entire form (and OTP boxes) every second — that was
  // causing the blinking you saw while typing the OTP.

  // ---- NEW: change email (resets OTP state only, UI-side) ----
  const resetEmail = () => {
    setFormData((prev) => ({ ...prev, email: '' }));
    setOtp('');
    setOtpSent(false);
    setOtpVerified(false);
    setOtpTimerActive(false);
    setTimeout(() => {
      const el = fieldRefs.current['email'];
      if (el) el.focus();
    }, 50);
  };

  // ---- NEW: password strength meter (frontend-only, doesn't affect validation rules) ----
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { label: '', pct: 0, color: '#E5EAF3' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (pwd.length >= 12) score++;
    if (score <= 2) return { label: 'Weak', pct: 25, color: '#e53935' };
    if (score === 3) return { label: 'Medium', pct: 50, color: '#fb8c00' };
    if (score <= 4) return { label: 'Strong', pct: 75, color: '#1e88e5' };
    return { label: 'Very Strong', pct: 100, color: '#2e7d32' };
  };
  const passwordStrength = getPasswordStrength(formData.password);

  // ---- NEW: confirm password match check (frontend-only) ----
  const passwordsMatch = !!(formData.password && confirmPassword && formData.password === confirmPassword);
  const passwordsMismatch = !!(confirmPassword && formData.password !== confirmPassword);

  // ---- NEW: caps lock detection ----
  const handleCapsLockCheck = (e) => {
    if (e.getModifierState) setCapsLockOn(e.getModifierState('CapsLock'));
  };

  // ---- NEW: required-field validation with auto-scroll + shake ----
  const REQUIRED_KEYS = Object.keys(formData);
  const validateAndFocusFirstInvalid = () => {
    for (const key of REQUIRED_KEYS) {
      if (!formData[key] || String(formData[key]).trim() === '') {
        const el = fieldRefs.current[key];
        if (el && el.scrollIntoView) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.focus();
        }
        setShakeField(key);
        setTimeout(() => setShakeField(null), 600);
        showToast('Please fill all required fields!', 'warning');
        return false;
      }
    }
    return true;
  };

  // ---- NEW: success overlay countdown -> navigate ----
  useEffect(() => {
    if (!successOverlay) return;
    setSuccessCountdown(3);
  }, [successOverlay]);

  useEffect(() => {
    if (!successOverlay) return;
    if (successCountdown <= 0) {
      window.location.href = '/login';
      return;
    }
    const id = setTimeout(() => setSuccessCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [successOverlay, successCountdown]);

  // ---- NEW: button ripple effect ----
  const addRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now() + Math.random();
    setRipples((r) => [...r, { x, y, id }]);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 650);
  };

  // ---- Purely visual/derived progress indicator ----
  const personalDone = !!(formData.full_name && formData.phone && otpVerified && formData.password && formData.age && formData.gender);
  const locationDone = !!(formData.state && formData.district && formData.village_city && formData.pin_code);
  const currentStepNum = !personalDone ? 1 : !locationDone ? 2 : 3;

  const districtList = statesData[formData.state] || [];

  return (
    <div className="rp-outer-v2">
      {ToastComponent}

      <style>{`
        * { box-sizing: border-box; }

        .rp-outer-v2 {
          min-height: 100vh;
          background: #F5F8FC;
          position: relative;
          overflow: hidden;
          padding: 30px 20px;
          font-family: 'Segoe UI', Roboto, sans-serif;
        }

        .rp-blur-circle {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.35;
          z-index: 0;
        }
        .rp-blur-1 { width: 380px; height: 380px; background: #1565C0; top: -120px; left: -120px; }
        .rp-blur-2 { width: 320px; height: 320px; background: #EF6C00; bottom: -100px; right: -80px; opacity: 0.2; }
        .rp-blur-3 { width: 260px; height: 260px; background: #2E7D32; top: 40%; right: 10%; opacity: 0.12; }

        @keyframes rpFadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes rpFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes rpFloatSlow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes rpCheckPop {
          0% { transform: scale(0.6); opacity: 0; }
          60% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes rpSpin { to { transform: rotate(360deg); } }
        @keyframes rpShake {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-4px); }
          40%, 60% { transform: translateX(4px); }
        }
        @keyframes rpConfetti {
          0% { transform: translate(0,0) rotate(0deg); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) rotate(360deg); opacity: 0; }
        }
        @keyframes rpRippleAnim {
          from { width: 0; height: 0; opacity: 0.55; }
          to { width: 320px; height: 320px; opacity: 0; }
        }

        .rp-shell-v2 {
          position: relative;
          z-index: 1;
          max-width: 1180px;
          margin: 0 auto;
          display: flex;
          gap: 30px;
          align-items: stretch;
          animation: rpFadeInUp 0.55s cubic-bezier(0.16,1,0.3,1);
        }

        .rp-left-v2 {
          flex: 0 0 35%;
          background: linear-gradient(160deg, #0B2545 0%, #123a73 55%, #0B2545 100%);
          border-radius: 24px;
          padding: 40px 32px;
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(11,37,69,0.35);
        }
        .rp-left-v2::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 220px; height: 220px;
          border-radius: 50%;
          background: rgba(239,108,0,0.15);
        }
        .rp-tricolor-strip {
          height: 4px;
          width: 60px;
          border-radius: 4px;
          background: linear-gradient(90deg, #FF9933 33%, #FFFFFF 33% 66%, #138808 66%);
          margin-bottom: 20px;
        }
        .rp-left-heading { font-size: 1.9rem; font-weight: 800; margin: 0 0 10px 0; line-height: 1.25; }
        .rp-left-sub { font-size: 0.92rem; opacity: 0.85; line-height: 1.6; margin-bottom: 28px; }
        .rp-feature-card {
          display: flex; align-items: center; gap: 12px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 14px; padding: 13px 16px; margin-bottom: 12px;
          transition: all 0.25s ease;
          animation: rpFloatSlow 4s ease-in-out infinite;
          backdrop-filter: blur(4px);
        }
        .rp-feature-card:nth-child(2) { animation-delay: 0.3s; }
        .rp-feature-card:nth-child(3) { animation-delay: 0.6s; }
        .rp-feature-card:nth-child(4) { animation-delay: 0.9s; }
        .rp-feature-card:hover { background: rgba(255,255,255,0.16); transform: translateX(4px); }
        .rp-feature-icon {
          width: 38px; height: 38px; border-radius: 10px;
          background: linear-gradient(135deg, #EF6C00, #FF9800);
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem; flex-shrink: 0;
        }
        .rp-feature-text { font-size: 0.85rem; font-weight: 600; }
        .rp-skyline { margin-top: 24px; display: flex; align-items: flex-end; gap: 4px; height: 60px; opacity: 0.5; }
        .rp-skyline div { background: rgba(255,255,255,0.5); border-radius: 2px 2px 0 0; }

        .rp-right-v2 {
          flex: 1;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          box-shadow: 0 20px 50px rgba(11,37,69,0.1), 0 2px 8px rgba(0,0,0,0.04);
          border: 1px solid #E5EAF3;
          padding: 34px 40px 30px 40px;
          animation: rpFadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s both;
        }

        .rp-title-v2 {
          font-size: 1.55rem; font-weight: 800;
          background: linear-gradient(90deg, #0B2545, #1565C0);
          -webkit-background-clip: text; background-clip: text; color: transparent;
          margin: 0 0 4px 0;
        }
        .rp-subtitle-v2 { color: #64748b; font-size: 0.85rem; margin: 0 0 22px 0; }

        .rp-stepper { display: flex; align-items: center; margin-bottom: 28px; }
        .rp-step-circle {
          width: 34px; height: 34px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.85rem; font-weight: 700;
          transition: all 0.35s ease; flex-shrink: 0;
          border: 2px solid #E5EAF3; background: white; color: #94a3b8;
        }
        .rp-step-circle.rp-step-current {
          background: #1565C0; border-color: #1565C0; color: white;
          box-shadow: 0 0 0 5px rgba(21,101,192,0.15);
        }
        .rp-step-circle.rp-step-done { background: #2E7D32; border-color: #2E7D32; color: white; }
        .rp-step-label { font-size: 0.78rem; font-weight: 700; margin-left: 8px; color: #64748b; white-space: nowrap; }
        .rp-step-label.rp-step-label-active { color: #0B2545; }
        .rp-step-line {
          flex: 1; height: 3px; background: #E5EAF3; margin: 0 10px;
          border-radius: 3px; position: relative; overflow: hidden;
        }
        .rp-step-line-fill {
          position: absolute; top: 0; left: 0; height: 100%;
          background: linear-gradient(90deg, #2E7D32, #43a047);
          transition: width 0.5s ease; border-radius: 3px;
        }

        .rp-section-card-v2 {
          background: white; border: 1px solid #E5EAF3; border-radius: 18px;
          padding: 22px 22px 8px 22px; margin-bottom: 20px;
          animation: rpFadeIn 0.5s ease;
          transition: box-shadow 0.3s ease, transform 0.3s ease;
        }
        .rp-section-card-v2:hover { box-shadow: 0 10px 26px rgba(11,37,69,0.08); transform: translateY(-2px); }
        .rp-section-header-v2 { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; }
        .rp-section-icon-badge {
          width: 42px; height: 42px; border-radius: 12px;
          background: linear-gradient(135deg, #0B2545, #1565C0);
          display: flex; align-items: center; justify-content: center;
          color: white; font-size: 1.05rem; flex-shrink: 0;
          transition: transform 0.25s ease;
        }
        .rp-section-card-v2:hover .rp-section-icon-badge { transform: rotate(-6deg) scale(1.08); }
        .rp-section-title-v2 { font-size: 1rem; font-weight: 800; color: #0B2545; margin: 0; }
        .rp-section-subtitle-v2 { font-size: 0.78rem; color: #94a3b8; margin: 2px 0 0 0; }

        .rp-grid-2-v2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px; }

        .rp-field-v2 { margin-bottom: 16px; position: relative; }
        .rp-label-v2 {
          display: flex; align-items: center; gap: 6px;
          font-size: 0.76rem; font-weight: 700; color: #33475b;
          margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.03em;
          transition: color 0.2s ease;
        }
        .rp-label-icon { color: #1565C0; font-size: 0.8rem; }
        .rp-field-v2:focus-within .rp-label-v2 { color: #1565C0; }
        .rp-required-star { color: #EF6C00; margin-left: 2px; }

        .rp-shake { animation: rpShake 0.5s ease; }
        .rp-shake .rp-input-v2, .rp-shake .rp-select-v2 { border-color: #e53935 !important; }

        .rp-input-v2, .rp-select-v2 {
          width: 100%; height: 50px; padding: 0 16px; border-radius: 14px;
          border: 1.5px solid #E5EAF3; font-size: 0.92rem; background: #FBFCFE;
          color: #1a2332; outline: none; transition: all 0.25s ease; font-family: inherit;
        }
        .rp-input-v2:hover, .rp-select-v2:hover { border-color: #b7c8e6; transform: translateY(-1px); }
        .rp-input-v2:focus, .rp-select-v2:focus {
          border-color: #1565C0; background: white;
          box-shadow: 0 0 0 4px rgba(21,101,192,0.12); transform: translateY(-1px);
        }
        .rp-input-v2:disabled { background: #eef1f5; color: #94a3b8; cursor: not-allowed; }

        .rp-pass-wrap { position: relative; }
        .rp-pass-toggle {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: #64748b;
          font-size: 1rem; transition: color 0.2s ease; padding: 4px; z-index: 2;
        }
        .rp-pass-toggle:hover { color: #1565C0; }

        .rp-confirm-icon {
          position: absolute; right: 44px; top: 50%; transform: translateY(-50%); font-size: 1rem;
        }
        .rp-confirm-match { color: #2E7D32; }
        .rp-confirm-mismatch { color: #e53935; }

        .rp-capslock-warning {
          display: flex; align-items: center; gap: 6px; color: #EF6C00;
          font-size: 0.76rem; font-weight: 700; margin-top: 6px; animation: rpFadeIn 0.3s ease;
        }

        .rp-strength-wrap { margin-top: 8px; }
        .rp-strength-bar-track { height: 6px; border-radius: 4px; background: #E5EAF3; overflow: hidden; }
        .rp-strength-bar-fill { height: 100%; border-radius: 4px; transition: width 0.4s ease, background-color 0.4s ease; }
        .rp-strength-label { font-size: 0.74rem; font-weight: 700; margin-top: 4px; transition: color 0.3s ease; }

        .rp-otp-card {
          background: linear-gradient(135deg, #eef4ff, #f7fbff);
          border: 1.5px solid #bcd4f7; border-radius: 16px; padding: 18px;
          margin-top: 6px; animation: rpFadeIn 0.4s ease;
        }
        .rp-otp-sent-text { color: #33475b; font-size: 0.82rem; margin: 0 0 12px 0; }
        .rp-otp-digit-v2 {
          width: 44px; height: 50px; text-align: center; font-size: 1.15rem; font-weight: 800;
          border-radius: 10px; border: 1.5px solid #cbd5e0; color: #0B2545;
          background: white; outline: none; transition: all 0.2s ease;
        }
        .rp-otp-digit-v2:hover { border-color: #1565C0; }
        .rp-otp-digit-v2:focus {
          border-color: #EF6C00; box-shadow: 0 0 0 4px rgba(239,108,0,0.15);
          transform: translateY(-3px) scale(1.06);
        }
        .rp-verified-badge-wrap { display: flex; align-items: center; gap: 14px; position: relative; margin-top: 10px; }
        .rp-verified-badge {
          display: inline-flex; align-items: center; gap: 6px;
          color: #2E7D32; font-weight: 700; font-size: 0.85rem;
          animation: rpCheckPop 0.4s ease; position: relative;
        }
        .rp-change-email-link { color: #1565C0; font-size: 0.78rem; cursor: pointer; font-weight: 700; }
        .rp-change-email-link:hover { text-decoration: underline; color: #EF6C00; }
        .rp-confetti-dot {
          position: absolute; width: 6px; height: 6px; border-radius: 50%;
          left: 0; top: 50%; animation: rpConfetti 0.8s ease forwards; pointer-events: none;
        }

        .rp-otp-timer { color: #64748b; font-size: 0.78rem; margin-top: 10px; display: inline-block; }
        .rp-resend-active { color: #EF6C00; cursor: pointer; font-weight: 700; }
        .rp-resend-active:hover { text-decoration: underline; }

        .rp-btn-otp {
          height: 50px; padding: 0 20px;
          background: linear-gradient(135deg, #0B2545, #163d7a);
          color: white; border: none; border-radius: 14px; cursor: pointer;
          font-weight: 700; font-size: 0.85rem; white-space: nowrap;
          display: flex; align-items: center; gap: 8px; transition: all 0.25s ease;
        }
        .rp-btn-otp:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 18px rgba(11,37,69,0.3); }
        .rp-btn-otp:disabled { background: #94a3b8; cursor: default; }
        .rp-btn-otp-sending { background: linear-gradient(135deg, #EF6C00, #FF9800) !important; }

        .rp-btn-verify {
          height: 50px; padding: 0 22px;
          background: linear-gradient(135deg, #EF6C00, #FF9800);
          color: white; border: none; border-radius: 14px;
          cursor: pointer; font-weight: 700; font-size: 0.85rem; transition: all 0.25s ease;
        }
        .rp-btn-verify:hover { transform: translateY(-2px); box-shadow: 0 8px 18px rgba(239,108,0,0.35); }

        .rp-btn-submit {
          width: 100%; height: 56px;
          background: linear-gradient(135deg, #EF6C00, #FF9800 60%, #EF6C00);
          background-size: 200% 100%;
          color: white; border: none; border-radius: 16px;
          font-size: 1rem; font-weight: 800; cursor: pointer; margin-top: 6px;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          letter-spacing: 0.02em; transition: all 0.3s ease; position: relative; overflow: hidden;
        }
        .rp-btn-submit:hover:not(:disabled) {
          background-position: 100% 0; transform: translateY(-3px);
          box-shadow: 0 12px 26px rgba(239,108,0,0.4);
        }
        .rp-btn-submit:active:not(:disabled) { transform: translateY(-1px) scale(0.99); }
        .rp-btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }

        .rp-ripple {
          position: absolute; border-radius: 50%; background: rgba(255,255,255,0.5);
          transform: translate(-50%,-50%); pointer-events: none;
          animation: rpRippleAnim 0.6s ease-out forwards;
        }

        .rp-spinner-v2 {
          width: 16px; height: 16px; border: 2.5px solid rgba(255,255,255,0.4);
          border-top-color: white; border-radius: 50%; animation: rpSpin 0.7s linear infinite;
        }

        .rp-login-link-v2 { color: #0B2545; font-weight: 700; text-decoration: none; transition: color 0.2s ease; }
        .rp-login-link-v2:hover { color: #EF6C00; text-decoration: underline; }

        .rp-success-overlay {
          position: fixed; inset: 0; background: rgba(11,37,69,0.55);
          display: flex; align-items: center; justify-content: center; z-index: 1000;
          animation: rpFadeIn 0.3s ease;
        }
        .rp-success-card {
          background: white; border-radius: 24px; padding: 44px 50px; text-align: center;
          box-shadow: 0 30px 80px rgba(0,0,0,0.35); animation: rpCheckPop 0.4s ease;
          max-width: 380px;
        }
        .rp-success-icon {
          width: 76px; height: 76px; border-radius: 50%; background: linear-gradient(135deg,#2E7D32,#43a047);
          display: flex; align-items: center; justify-content: center; color: white; font-size: 2.2rem;
          margin: 0 auto 18px auto; animation: rpCheckPop 0.5s ease;
        }
        .rp-success-title { font-size: 1.3rem; font-weight: 800; color: #0B2545; margin: 0 0 8px 0; }
        .rp-success-sub { color: #64748b; font-size: 0.9rem; margin: 0 0 18px 0; }
        .rp-success-countdown { font-size: 2.4rem; font-weight: 800; color: #EF6C00; }

        @media (max-width: 900px) {
          .rp-shell-v2 { flex-direction: column; }
          .rp-left-v2 { flex: none; }
        }
        @media (max-width: 640px) {
          .rp-grid-2-v2 { grid-template-columns: 1fr; }
          .rp-right-v2 { padding: 26px 20px; }
          .rp-otp-digit-v2 { width: 38px; height: 46px; }
        }
      `}</style>

      <div className="rp-blur-circle rp-blur-1"></div>
      <div className="rp-blur-circle rp-blur-2"></div>
      <div className="rp-blur-circle rp-blur-3"></div>

      <div className="rp-shell-v2">

        <div className="rp-left-v2">
          <div>
            <div className="rp-tricolor-strip"></div>
            <h1 className="rp-left-heading">Register Today</h1>
            <p className="rp-left-sub">
              Create your account and discover Government Schemes instantly.
            </p>

            <div className="rp-feature-card">
              <div className="rp-feature-icon"><FaShieldAlt /></div>
              <span className="rp-feature-text">Secure Registration</span>
            </div>
            <div className="rp-feature-card">
              <div className="rp-feature-icon"><FaLandmark /></div>
              <span className="rp-feature-text">200+ Government Schemes</span>
            </div>
            <div className="rp-feature-card">
              <div className="rp-feature-icon"><FaArrowRight /></div>
              <span className="rp-feature-text">Instant Eligibility Check</span>
            </div>
            <div className="rp-feature-card">
              <div className="rp-feature-icon"><FaFlag /></div>
              <span className="rp-feature-text">Government Verified Portal</span>
            </div>
          </div>

          <div className="rp-skyline">
            {[22,34,18,40,26,32,20,44,28,16,36,24].map((h, i) => (
              <div key={i} style={{ width: '7px', height: `${h}px` }}></div>
            ))}
          </div>
        </div>

        <div className="rp-right-v2">
          <h2 className="rp-title-v2">Citizen Registration Form</h2>
          <p className="rp-subtitle-v2">Fields marked required must be filled to complete registration.</p>

          <div className="rp-stepper">
            <div className={`rp-step-circle ${personalDone ? 'rp-step-done' : currentStepNum === 1 ? 'rp-step-current' : ''}`}>
              {personalDone ? <FaCheckCircle /> : '1'}
            </div>
            <span className={`rp-step-label ${currentStepNum === 1 ? 'rp-step-label-active' : ''}`}>Personal</span>
            <div className="rp-step-line">
              <div className="rp-step-line-fill" style={{ width: personalDone ? '100%' : '0%' }}></div>
            </div>

            <div className={`rp-step-circle ${locationDone ? 'rp-step-done' : currentStepNum === 2 ? 'rp-step-current' : ''}`}>
              {locationDone ? <FaCheckCircle /> : '2'}
            </div>
            <span className={`rp-step-label ${currentStepNum === 2 ? 'rp-step-label-active' : ''}`}>Location</span>
            <div className="rp-step-line">
              <div className="rp-step-line-fill" style={{ width: locationDone ? '100%' : '0%' }}></div>
            </div>

            <div className={`rp-step-circle ${currentStepNum === 3 ? 'rp-step-current' : ''}`}>3</div>
            <span className={`rp-step-label ${currentStepNum === 3 ? 'rp-step-label-active' : ''}`}>Family</span>
          </div>

          <form onSubmit={handleRegister} autoComplete="off" noValidate>

            <div className="rp-section-card-v2">
              <div className="rp-section-header-v2">
                <div className="rp-section-icon-badge"><FaUser /></div>
                <div>
                  <h3 className="rp-section-title-v2">Personal Information</h3>
                  <p className="rp-section-subtitle-v2">Complete your basic details</p>
                </div>
              </div>

              <div className="rp-grid-2-v2">
                <Field icon={FaUser} label="Full Name" name="full_name" fieldRefs={fieldRefs} shakeField={shakeField}>
                  <input className="rp-input-v2" type="text" name="full_name" placeholder="As per ID proof"
                    value={formData.full_name} onChange={handleChange} autoComplete="off" />
                </Field>
                <Field icon={FaPhone} label="Phone Number" name="phone" fieldRefs={fieldRefs} shakeField={shakeField}>
                  <input className="rp-input-v2" type="text" name="phone" placeholder="10-digit mobile number"
                    value={formData.phone} onChange={handleChange} autoComplete="off" />
                </Field>
              </div>

              <Field icon={FaEnvelope} label="Email Address" fieldRefs={fieldRefs} shakeField={shakeField}>
                <div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      ref={(el) => (fieldRefs.current['email'] = el)}
                      className="rp-input-v2"
                      type="email" name="email" placeholder="you@example.com"
                      value={formData.email} onChange={handleChange} autoComplete="off"
                      disabled={otpVerified}
                      aria-label="Email Address"
                      style={{ flex: 1, borderColor: otpVerified ? '#2E7D32' : undefined }}
                    />
                    <button
                      type="button"
                      className={`rp-btn-otp ${sendingOtp ? 'rp-btn-otp-sending' : ''}`}
                      onClick={sendEmailOtp}
                      disabled={otpVerified || otpTimerActive || sendingOtp}
                    >
                      {sendingOtp
                        ? <><span className="rp-spinner-v2"></span> Sending...</>
                        : otpVerified
                          ? <><FaCheckCircle /> Verified</>
                          : <><FaPaperPlane /> Send OTP</>}
                    </button>
                  </div>

                  {otpSent && !otpVerified && (
                    <div className="rp-otp-card" onPaste={handleOtpPaste}>
                      <p className="rp-otp-sent-text">OTP sent to <strong>{formData.email}</strong></p>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                        {otpDigits.map((digit, i) => (
                          <input
                            key={i}
                            ref={(el) => (otpBoxRefs.current[i] = el)}
                            className="rp-otp-digit-v2"
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpBoxChange(i, e.target.value)}
                            onKeyDown={(e) => handleOtpBoxKeyDown(i, e)}
                            aria-label={`OTP digit ${i + 1}`}
                          />
                        ))}
                        <button type="button" className="rp-btn-verify" onClick={verifyEmailOtp}>
                          Verify
                        </button>
                      </div>

                      {otpTimerActive ? (
                        <OtpCountdown
                          key={otpSentCount}
                          seconds={60}
                          onExpire={() => setOtpTimerActive(false)}
                        />
                      ) : (
                        <span className="rp-otp-timer rp-resend-active" onClick={sendEmailOtp}>Resend OTP</span>
                      )}
                    </div>
                  )}

                  {otpVerified && (
                    <div className="rp-verified-badge-wrap">
                      <div className="rp-verified-badge">
                        <FaCheckCircle /> Email verified successfully
                        {['#EF6C00', '#1565C0', '#2E7D32', '#FF9800'].map((c, i) => (
                          <span key={i} className="rp-confetti-dot"
                            style={{ backgroundColor: c, '--tx': `${(i - 1.5) * 18}px`, '--ty': `${-14 - i * 4}px` }}></span>
                        ))}
                      </div>
                      <span className="rp-change-email-link" onClick={resetEmail}>Change Email</span>
                    </div>
                  )}
                </div>
              </Field>

              <div className="rp-grid-2-v2">
                <Field icon={FaLock} label="Password" name="password" fieldRefs={fieldRefs} shakeField={shakeField}>
                  <div className="rp-pass-wrap">
                    <input
                      className="rp-input-v2"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      onKeyUp={handleCapsLockCheck}
                      onKeyDown={handleCapsLockCheck}
                      autoComplete="off"
                      style={{ paddingRight: '44px' }}
                    />
                    <button type="button" className="rp-pass-toggle" onClick={() => setShowPassword((s) => !s)} aria-label="Toggle password visibility">
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {capsLockOn && (
                    <div className="rp-capslock-warning"><FaExclamationTriangle /> Caps Lock is ON</div>
                  )}
                  {formData.password && (
                    <div className="rp-strength-wrap">
                      <div className="rp-strength-bar-track">
                        <div className="rp-strength-bar-fill" style={{ width: `${passwordStrength.pct}%`, backgroundColor: passwordStrength.color }}></div>
                      </div>
                      <div className="rp-strength-label" style={{ color: passwordStrength.color }}>{passwordStrength.label}</div>
                    </div>
                  )}
                </Field>
                <Field icon={FaBirthdayCake} label="Age" name="age" fieldRefs={fieldRefs} shakeField={shakeField}>
                  <input className="rp-input-v2" type="number" name="age" placeholder="In years"
                    value={formData.age} onChange={handleChange} autoComplete="off" />
                </Field>
              </div>

              <Field icon={FaLock} label="Confirm Password" fieldRefs={fieldRefs} shakeField={shakeField}>
                <div className="rp-pass-wrap">
                  <input
                    ref={(el) => (fieldRefs.current['confirmPassword'] = el)}
                    className={`rp-input-v2 ${shakeField === 'confirmPassword' ? 'rp-shake' : ''}`}
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyUp={handleCapsLockCheck}
                    onKeyDown={handleCapsLockCheck}
                    autoComplete="off"
                    aria-label="Confirm Password"
                    style={{
                      paddingRight: '72px',
                      borderColor: passwordsMismatch ? '#e53935' : passwordsMatch ? '#2E7D32' : undefined
                    }}
                  />
                  {confirmPassword && (
                    <span className={`rp-confirm-icon ${passwordsMatch ? 'rp-confirm-match' : 'rp-confirm-mismatch'}`}>
                      {passwordsMatch ? <FaCheckCircle /> : <FaExclamationTriangle />}
                    </span>
                  )}
                  <button type="button" className="rp-pass-toggle" onClick={() => setShowConfirmPassword((s) => !s)} aria-label="Toggle confirm password visibility">
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </Field>

              <Field icon={FaVenusMars} label="Gender" name="gender" fieldRefs={fieldRefs} shakeField={shakeField}>
                <select className="rp-select-v2" name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </Field>
            </div>

            <div className="rp-section-card-v2">
              <div className="rp-section-header-v2">
                <div className="rp-section-icon-badge"><FaMapMarkedAlt /></div>
                <div>
                  <h3 className="rp-section-title-v2">Location Details</h3>
                  <p className="rp-section-subtitle-v2">Tell us where you live</p>
                </div>
              </div>

              <div className="rp-grid-2-v2">
                <Field icon={FaMapMarkedAlt} label="State" name="state" fieldRefs={fieldRefs} shakeField={shakeField}>
                  <select className="rp-select-v2" name="state" value={formData.state} onChange={handleStateChange}>
                    <option value="">Select State</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                    <option value="Assam">Assam</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Chhattisgarh">Chhattisgarh</option>
                    <option value="Goa">Goa</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                    <option value="Jharkhand">Jharkhand</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Manipur">Manipur</option>
                    <option value="Meghalaya">Meghalaya</option>
                    <option value="Mizoram">Mizoram</option>
                    <option value="Nagaland">Nagaland</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Sikkim">Sikkim</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Tripura">Tripura</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Uttarakhand">Uttarakhand</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                    <option value="Ladakh">Ladakh</option>
                    <option value="Puducherry">Puducherry</option>
                  </select>
                </Field>

                <Field icon={FaCity} label="District" name="district" fieldRefs={fieldRefs} shakeField={shakeField}>
                  {districtList.length > 0 ? (
                    <select className="rp-select-v2" name="district" value={formData.district} onChange={handleChange}>
                      <option value="">Select District</option>
                      {districtList.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  ) : (
                    <input className="rp-input-v2" type="text" name="district" placeholder="District"
                      value={formData.district} onChange={handleChange} autoComplete="off" />
                  )}
                </Field>
              </div>

              <div className="rp-grid-2-v2">
                <Field icon={FaBuilding} label="Taluka" name="taluka" fieldRefs={fieldRefs} shakeField={shakeField}>
                  <input className="rp-input-v2" type="text" name="taluka" placeholder="Taluka"
                    value={formData.taluka} onChange={handleChange} autoComplete="off" />
                </Field>
                <Field icon={FaHome} label="Village / City" name="village_city" fieldRefs={fieldRefs} shakeField={shakeField}>
                  <input className="rp-input-v2" type="text" name="village_city" placeholder="Village / City"
                    value={formData.village_city} onChange={handleChange} autoComplete="off" />
                </Field>
              </div>

              <Field icon={FaMapPin} label="PIN Code" name="pin_code" fieldRefs={fieldRefs} shakeField={shakeField}>
                <input className="rp-input-v2" type="text" name="pin_code" placeholder="6-digit PIN code"
                  value={formData.pin_code} onChange={handleChange} autoComplete="off" />
              </Field>
            </div>

            <div className="rp-section-card-v2">
              <div className="rp-section-header-v2">
                <div className="rp-section-icon-badge"><FaUsers /></div>
                <div>
                  <h3 className="rp-section-title-v2">Family &amp; Economic Details</h3>
                  <p className="rp-section-subtitle-v2">Household &amp; income information</p>
                </div>
              </div>

              <div className="rp-grid-2-v2">
                <Field icon={FaUsers} label="Total Family Members" name="family_members" fieldRefs={fieldRefs} shakeField={shakeField}>
                  <input className="rp-input-v2" type="number" name="family_members" placeholder="Number of members"
                    value={formData.family_members} onChange={handleChange} autoComplete="off" />
                </Field>
                <Field icon={FaChild} label="Number of Children" name="number_of_children" fieldRefs={fieldRefs} shakeField={shakeField}>
                  <input className="rp-input-v2" type="number" name="number_of_children" placeholder="Number of children"
                    value={formData.number_of_children} onChange={handleChange} autoComplete="off" />
                </Field>
              </div>

              <Field icon={FaRupeeSign} label="Yearly Income (₹)" name="yearly_income" fieldRefs={fieldRefs} shakeField={shakeField}>
                <input className="rp-input-v2" type="number" name="yearly_income" placeholder="Annual household income"
                  value={formData.yearly_income} onChange={handleChange} autoComplete="off" />
              </Field>

              <div className="rp-grid-2-v2">
                <Field icon={FaPrayingHands} label="Religion" name="religion" fieldRefs={fieldRefs} shakeField={shakeField}>
                  <select className="rp-select-v2" name="religion" value={formData.religion} onChange={handleChange}>
                    <option value="">Select Religion</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Muslim">Muslim</option>
                    <option value="Christian">Christian</option>
                    <option value="Sikh">Sikh</option>
                    <option value="Buddhist">Buddhist</option>
                    <option value="Jain">Jain</option>
                    <option value="Other">Other</option>
                  </select>
                </Field>
                <Field icon={FaShieldAlt} label="Caste Category" name="caste" fieldRefs={fieldRefs} shakeField={shakeField}>
                  <select className="rp-select-v2" name="caste" value={formData.caste} onChange={handleChange}>
                    <option value="">Select Caste</option>
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="NT-B">NT-B (Nomadic Tribe B)</option>
                    <option value="NT-C">NT-C (Nomadic Tribe C)</option>
                    <option value="NT-D">NT-D (Nomadic Tribe D)</option>
                    <option value="VJNT">VJNT (Vimukta Jati)</option>
                    <option value="SBC">SBC (Special Backward Class)</option>
                    <option value="EWS">EWS (Economically Weaker Section)</option>
                  </select>
                </Field>
              </div>

              <div className="rp-grid-2-v2">
                <Field icon={FaGraduationCap} label="Education" name="education" fieldRefs={fieldRefs} shakeField={shakeField}>
                  <select className="rp-select-v2" name="education" value={formData.education} onChange={handleChange}>
                    <option value="">Select Education</option>
                    <option value="Illiterate">Illiterate</option>
                    <option value="Primary">Primary (1st-7th)</option>
                    <option value="Secondary">Secondary (8th-10th)</option>
                    <option value="Higher Secondary">Higher Secondary (11th-12th)</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Post Graduate">Post Graduate</option>
                  </select>
                </Field>
                <Field icon={FaHome} label="House Type" name="house_type" fieldRefs={fieldRefs} shakeField={shakeField}>
                  <select className="rp-select-v2" name="house_type" value={formData.house_type} onChange={handleChange}>
                    <option value="">House Type</option>
                    <option value="Own">Own House</option>
                    <option value="Rented">Rented</option>
                    <option value="Pucca">Pucca</option>
                    <option value="Kachha">Kachha</option>
                  </select>
                </Field>
              </div>

              <Field icon={FaBriefcase} label="Occupation" name="occupation" fieldRefs={fieldRefs} shakeField={shakeField}>
                <select className="rp-select-v2" name="occupation" value={formData.occupation} onChange={handleChange}>
                  <option value="">Select Occupation</option>
                  <option value="Farmer">Farmer</option>
                  <option value="Student">Student</option>
                  <option value="Government Employee">Government Employee</option>
                  <option value="Private Employee">Private Employee</option>
                  <option value="Self Employed">Self Employed</option>
                  <option value="Daily Wage Worker">Daily Wage Worker</option>
                  <option value="Unemployed">Unemployed</option>
                </select>
              </Field>
            </div>

            <button className="rp-btn-submit" type="submit" disabled={submitting} onMouseDown={addRipple}>
              {submitting ? (<><span className="rp-spinner-v2"></span> Submitting...</>) : (<><FaPaperPlane /> Submit Registration</>)}
              {ripples.map((r) => (
                <span key={r.id} className="rp-ripple" style={{ left: r.x, top: r.y }}></span>
              ))}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '18px', marginBottom: 0, color: '#64748b', fontSize: '0.85rem' }}>
            Already have an account? <a href="/login" className="rp-login-link-v2">Login here</a>
          </p>
        </div>
      </div>

      {successOverlay && (
        <div className="rp-success-overlay">
          <div className="rp-success-card">
            <div className="rp-success-icon"><FaCheckCircle /></div>
            <h3 className="rp-success-title">Registration Successful!</h3>
            <p className="rp-success-sub">Redirecting you to the login page...</p>
            <div className="rp-success-countdown">{successCountdown}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;