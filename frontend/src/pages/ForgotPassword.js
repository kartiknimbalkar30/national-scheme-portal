import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');
  const [loading, setLoading] = useState(false);

  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '1rem',
    boxSizing: 'border-box'
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      const response = await fetch('https://national-scheme-portal.onrender.com/api/auth/forgot-password/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (response.ok) {
        setMsgType('success');
        setMsg(data.message);
        setStep(2);
      } else {
        setMsgType('error');
        setMsg(data.message);
      }
    } catch (error) {
      setMsgType('error');
      setMsg('Something went wrong!');
    }
    setLoading(false);
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMsgType('error');
      setMsg('Passwords do not match!');
      return;
    }
    setLoading(true);
    setMsg('');
    try {
      const response = await fetch('https://national-scheme-portal.onrender.com/api/auth/forgot-password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, new_password: newPassword })
      });
      const data = await response.json();
      if (response.ok) {
        setMsgType('success');
        setMsg(data.message);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setMsgType('error');
        setMsg(data.message);
      }
    } catch (error) {
      setMsgType('error');
      setMsg('Something went wrong!');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '30px' }}>
      <div style={{
        maxWidth: '450px',
        margin: '40px auto',
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: '40px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #1a237e 0%, #1565c0 100%)',
          borderRadius: '10px',
          padding: '20px',
          color: 'white',
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '5px' }}>🔑 Forgot Password</h1>
          <p style={{ opacity: '0.9', fontSize: '0.9rem' }}>
            {step === 1 ? 'Enter your email to receive an OTP' : 'Enter OTP and set a new password'}
          </p>
        </div>

        {msg && (
          <div style={{
            backgroundColor: msgType === 'success' ? '#e8f5e9' : '#ffebee',
            color: msgType === 'success' ? '#2e7d32' : '#c62828',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            {msg}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={sendOtp}>
            <input
              type="email"
              placeholder="Registered Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
            <button type="submit" disabled={loading} style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#ff6f00',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={resetPassword}>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={inputStyle}
            />
            <button type="submit" disabled={loading} style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#1a237e',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <a href="/login" style={{ color: '#1a237e', textDecoration: 'none', fontWeight: 'bold' }}>
            ← Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
