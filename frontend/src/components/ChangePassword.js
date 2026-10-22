import React, { useState } from 'react';

function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');

  const govTheme = { primaryBlue: '#003366', accentOrange: '#E65100', textGray: '#5F6368' };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');

    if (form.newPassword !== form.confirmPassword) {
      setMsgType('error');
      setMsg('New passwords do not match!');
      return;
    }
    if (form.newPassword.length < 6) {
      setMsgType('error');
      setMsg('New password must be at least 6 characters!');
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');

      if (!user?.id || !token) {
        setMsgType('error');
        setMsg('⚠️ Please log in first!');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/auth/change-password/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: form.currentPassword,
          new_password: form.newPassword,
          currentPassword: form.currentPassword,
          newPassword: form.newPassword
        })
      });
      const data = await response.json();

      if (response.ok) {
        setMsgType('success');
        setMsg('✅ ' + data.message);
        setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setMsgType('error');
        setMsg('⚠️ ' + data.message);
      }
    } catch (err) {
      setMsgType('error');
      setMsg('⚠️ Something went wrong!');
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '28px',
      maxWidth: '450px',
      margin: '20px auto',
      boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
    }}>
      <h3 style={{ color: govTheme.primaryBlue, fontSize: '1.2rem', fontWeight: '700', marginBottom: '18px' }}>
        🔒 Change Password
      </h3>

      {msg && (
        <div style={{
          backgroundColor: msgType === 'success' ? '#E8F5E9' : '#FFF3E0',
          color: msgType === 'success' ? '#2E7D32' : '#E65100',
          padding: '10px 14px',
          borderRadius: '8px',
          marginBottom: '14px',
          fontWeight: '600',
          fontSize: '0.85rem'
        }}>
          {msg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          name="currentPassword"
          placeholder="Current Password"
          value={form.currentPassword}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
        />
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={form.newPassword}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm New Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '12px', marginBottom: '18px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
        />
        <button type="submit" style={{
          width: '100%',
          padding: '12px',
          backgroundColor: govTheme.accentOrange,
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontWeight: '700',
          cursor: 'pointer'
        }}>
          Update Password
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;
