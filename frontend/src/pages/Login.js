import { startAuthentication, browserSupportsWebAuthn } from "@simplewebauthn/browser";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../Firebase";
import { Link, useNavigate } from 'react-router-dom';
import {
  FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight,
  FaLandmark, FaFingerprint, FaGoogle
} from 'react-icons/fa';
import { useToast } from '../components/Toast';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);
  const [shake, setShake] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
      passwordRef.current?.focus();
    } else {
      emailRef.current?.focus();
    }
  }, []);

  const handleAuthSuccess = useCallback((token, user, message = 'Login Successful! 🎉') => {
    if (!token) {
      showToast('Invalid token received from server.', 'error');
      return;
    }

    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email.trim().toLowerCase());
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    showToast(message, 'success');
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    setTimeout(() => {
      navigate('/dashboard');
    }, 600);
  }, [rememberMe, email, showToast, navigate]);

  // ===== STANDARD EMAIL LOGIN =====
  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLoading || socialLoading) return;

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      showToast('Please enter both email address and password!', 'warning');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      if (!normalizedEmail) emailRef.current?.focus();
      else if (!password) passwordRef.current?.focus();
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://national-scheme-portal.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, password })
      });

      const data = await response.json();

      if (response.ok && data.token) {
        handleAuthSuccess(data.token, data.user, 'Login Successful! Redirecting...');
      } else {
        showToast(data.message || 'Invalid credentials. Please verify your email and password.', 'error');
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } catch (error) {
      showToast('Unable to connect to authentication server. Please check your network.', 'error');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  // ===== GOOGLE LOGIN =====
  const handleGoogleLogin = async () => {
    if (socialLoading || isLoading) return;
    setSocialLoading('google');

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      let idToken = '';
      try {
        idToken = await user.getIdToken();
      } catch (tokenErr) {
        console.warn('Could not get idToken:', tokenErr);
      }

      const response = await fetch('https://national-scheme-portal.onrender.com/api/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idToken,
          email: user.email,
          full_name: user.displayName,
          photo: user.photoURL
        })
      });

      const data = await response.json();

      if (response.ok && data.token) {
        handleAuthSuccess(data.token, data.user, 'Google Authentication Successful! 🎉');
      } else {
        showToast(data.message || 'Google authentication failed on server.', 'error');
      }
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        showToast('Google login popup was closed.', 'warning');
      } else {
        showToast('Google login failed. Please try again.', 'error');
      }
    } finally {
      setSocialLoading(null);
    }
  };

  // ===== PASSKEY BIOMETRIC LOGIN =====
  const handlePasskeyLogin = async () => {
    if (socialLoading || isLoading) return;

    const normalizedEmail = email.trim().toLowerCase();

    if (!browserSupportsWebAuthn()) {
      showToast('Passkeys / WebAuthn biometric login is not supported on this browser/device.', 'error');
      return;
    }

    if (!normalizedEmail) {
      showToast('Please enter your citizen email address above to use Passkey login.', 'warning');
      emailRef.current?.focus();
      return;
    }

    setSocialLoading('passkey');

    try {
      const optionsRes = await fetch('https://national-scheme-portal.onrender.com/api/auth/passkey/login/options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail })
      });

      if (!optionsRes.ok) {
        const errData = await optionsRes.json().catch(() => ({}));
        showToast(errData.message || 'No passkey found for this account. Please login with password first.', 'warning');
        setSocialLoading(null);
        return;
      }

      const optionsData = await optionsRes.json();
      let authenticationResponse;

      try {
        authenticationResponse = await startAuthentication(optionsData);
      } catch (webauthnError) {
        if (webauthnError.name === 'NotAllowedError') {
          showToast('Passkey verification was cancelled or timed out.', 'warning');
        } else {
          showToast(webauthnError.message || 'Biometric authentication failed.', 'error');
        }
        setSocialLoading(null);
        return;
      }

      const verifyRes = await fetch('https://national-scheme-portal.onrender.com/api/auth/passkey/login/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          email: normalizedEmail,
          authResponse: authenticationResponse,
          authenticationResponse: authenticationResponse
        })
      });

      const verifyData = await verifyRes.json();

      if (verifyRes.ok && (verifyData.verified || verifyData.token)) {
        handleAuthSuccess(verifyData.token, verifyData.user, 'Passkey Verification Successful! 🛡️');
      } else {
        showToast(verifyData.message || 'Passkey verification failed.', 'error');
      }
    } catch (error) {
      showToast('Passkey authentication error. Please try again or use password.', 'error');
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="gov-auth-page">
      <ToastComponent />

      <div className={`gov-auth-card ${shake ? 'gov-shake' : ''}`}>
        {/* BRAND EMBLEM HEADER */}
        <div className="gov-auth-header">
          <div className="gov-auth-emblem">
            <FaLandmark />
          </div>
          <h2>Citizen Sign In</h2>
          <p>National Scheme Portal &bull; Government of India</p>
        </div>

        {/* SOCIAL AUTH / PASSKEY */}
        <div className="gov-oauth-section">
          <button
            type="button"
            className="gov-oauth-btn gov-oauth-google"
            onClick={handleGoogleLogin}
            disabled={socialLoading === 'google'}
          >
            <FaGoogle className="gov-oauth-icon" />
            <span>{socialLoading === 'google' ? 'Connecting to Google...' : 'Continue with Google'}</span>
          </button>

          <button
            type="button"
            className="gov-oauth-btn gov-oauth-passkey"
            onClick={handlePasskeyLogin}
            disabled={socialLoading === 'passkey'}
          >
            <FaFingerprint className="gov-oauth-icon" />
            <span>{socialLoading === 'passkey' ? 'Verifying Biometric...' : 'Sign in with Passkey'}</span>
          </button>
        </div>

        <div className="gov-auth-divider">
          <span>OR SIGN IN WITH EMAIL</span>
        </div>

        {/* EMAIL & PASSWORD FORM */}
        <form onSubmit={handleLogin} className="gov-auth-form" noValidate>
          <div className="gov-input-group">
            <label htmlFor="email">
              <FaEnvelope className="gov-input-label-icon" /> Official Email Address
            </label>
            <input
              id="email"
              ref={emailRef}
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="gov-input-group">
            <div className="gov-label-row">
              <label htmlFor="password">
                <FaLock className="gov-input-label-icon" /> Password
              </label>
              <Link to="/forgot-password" className="gov-forgot-link">
                Forgot password?
              </Link>
            </div>
            <div className="gov-password-wrapper">
              <input
                id="password"
                ref={passwordRef}
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="gov-pwd-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="gov-remember-row">
            <label className="gov-checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember my email on this device</span>
            </label>
          </div>

          <button
            type="submit"
            className="gov-submit-btn"
            disabled={isLoading || socialLoading}
          >
            {isLoading ? (
              <span>Verifying Credentials...</span>
            ) : (
              <>
                <span>Sign In to Citizen Account</span>
                <FaArrowRight />
              </>
            )}
          </button>
        </form>

        <div className="gov-auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="gov-register-link">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
