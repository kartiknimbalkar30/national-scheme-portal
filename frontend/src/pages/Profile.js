import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { startRegistration, browserSupportsWebAuthn } from "@simplewebauthn/browser";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaVenusMars,
  FaMapMarkerAlt,
  FaHome,
  FaUsers,
  FaChild,
  FaRupeeSign,
  FaBriefcase,
  FaGraduationCap,
  FaShieldAlt,
  FaSignOutAlt,
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationCircle,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaSave,
  FaEdit,
  FaFingerprint
} from 'react-icons/fa';

import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();

  // =========================================================
  // BASIC STATES
  // =========================================================

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // =========================================================
  // PROFILE FORM STATE
  // =========================================================

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    age: '',
    gender: '',
    religion: '',
    caste: '',
    state: '',
    district: '',
    taluka: '',
    village_city: '',
    pin_code: '',
    house_type: '',
    family_members: '',
    number_of_children: '',
    yearly_income: '',
    occupation: '',
    education: ''
  });

  // =========================================================
  // PASSWORD STATE
  // =========================================================

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  // =========================================================
  // FILL FORM DATA
  // =========================================================

  const fillFormData = (userData) => {
    setFormData({
      full_name: userData?.full_name || '',
      phone: userData?.phone || '',
      age: userData?.age || '',
      gender: userData?.gender || '',
      religion: userData?.religion || '',
      caste: userData?.caste || '',
      state: userData?.state || '',
      district: userData?.district || '',
      taluka: userData?.taluka || '',
      village_city: userData?.village_city || '',
      pin_code: userData?.pin_code || '',
      house_type: userData?.house_type || '',
      family_members: userData?.family_members || '',
      number_of_children: userData?.number_of_children || '',
      yearly_income: userData?.yearly_income || '',
      occupation: userData?.occupation || '',
      education: userData?.education || ''
    });
  };

  // =========================================================
  // LOAD USER
  // =========================================================

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const storedUser = JSON.parse(
        localStorage.getItem('user') || '{}'
      );

      if (storedUser && storedUser.id) {
        setUser(storedUser);
        fillFormData(storedUser);
        setLoading(false);
      } else {
        fetchUserProfile(token);
      }
    } catch (err) {
      console.error('User data error:', err);
      fetchUserProfile(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  // =========================================================
  // FETCH USER PROFILE
  // =========================================================

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get(
        'https://national-scheme-portal.onrender.com/api/auth/profile',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const userData = response.data.user;

      setUser(userData);
      fillFormData(userData);

      localStorage.setItem(
        'user',
        JSON.stringify(userData)
      );

      setLoading(false);
    } catch (err) {
      console.error(
        'Error fetching profile:',
        err
      );

      setError('Failed to load profile');
      setLoading(false);
    }
  };

  // =========================================================
  // PROFILE UPDATE
  // =========================================================

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');

      if (!user?.id) {
        setError('User information not found.');
        setIsLoading(false);
        return;
      }

      const updateData = {
        full_name: formData.full_name || '',
        phone: formData.phone || '',
        age: formData.age || '',
        gender: formData.gender || '',
        religion: formData.religion || '',
        caste: formData.caste || '',
        state: formData.state || '',
        district: formData.district || '',
        taluka: formData.taluka || '',
        village_city: formData.village_city || '',
        pin_code: formData.pin_code || '',
        house_type: formData.house_type || '',
        family_members: formData.family_members || '',
        number_of_children:
          formData.number_of_children || '',
        yearly_income:
          formData.yearly_income || '',
        occupation:
          formData.occupation || '',
        education:
          formData.education || ''
      };

      const response = await axios.put(
        `https://national-scheme-portal.onrender.com/api/auth/update/${user.id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        const updatedUser = {
          ...user,
          ...updateData
        };

        setUser(updatedUser);

        localStorage.setItem(
          'user',
          JSON.stringify(updatedUser)
        );

        // Notify other components
        window.dispatchEvent(
          new Event('profileUpdated')
        );

        setSuccess(
          response.data.message ||
            'Profile updated successfully!'
        );

        setIsEditing(false);

        setTimeout(() => {
          setSuccess('');
        }, 4000);
      }
    } catch (err) {
      console.error(
        'Update error:',
        err
      );

      const errorMsg =
        err.response?.data?.message ||
        'Failed to update profile. Please try again.';

      setError(errorMsg);

      setTimeout(() => {
        setError('');
      }, 4000);
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // CHANGE PASSWORD
  // =========================================================

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (
      passwordData.new_password !==
      passwordData.confirm_password
    ) {
      setError(
        'New passwords do not match!'
      );

      setTimeout(() => {
        setError('');
      }, 4000);

      return;
    }

    if (
      passwordData.new_password.length < 6
    ) {
      setError(
        'Password must be at least 6 characters!'
      );

      setTimeout(() => {
        setError('');
      }, 4000);

      return;
    }

    try {
      const token = localStorage.getItem('token');

      const response = await axios.put(
        `https://national-scheme-portal.onrender.com/api/auth/change-password/${user.id}`,
        {
          current_password:
            passwordData.current_password,

          new_password:
            passwordData.new_password
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSuccess(
        response.data.message ||
          'Password changed successfully!'
      );

      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });

      setTimeout(() => {
        setSuccess('');
      }, 4000);
    } catch (err) {
      console.error(
        'Password change error:',
        err
      );

      setError(
        err.response?.data?.message ||
          'Failed to change password'
      );

      setTimeout(() => {
        setError('');
      }, 4000);
    }
  };

  // =========================================================
  // PASSKEY BIOMETRIC REGISTRATION
  // =========================================================

  const handlePasskeyRegister = async () => {
    setError('');
    setSuccess('');

    if (!browserSupportsWebAuthn()) {
      setError('WebAuthn / Passkeys are not supported on this browser or device.');
      return;
    }

    if (!user?.email) {
      setError('Citizen email not found.');
      return;
    }

    try {
      const optionsRes = await fetch('https://national-scheme-portal.onrender.com/api/auth/passkey/register/options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      });

      const optionsData = await optionsRes.json();

      if (!optionsRes.ok) {
        setError(optionsData.message || 'Failed to start passkey registration.');
        return;
      }

      const regResponse = await startRegistration(optionsData);

      const verifyRes = await fetch('https://national-scheme-portal.onrender.com/api/auth/passkey/register/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          registrationResponse: regResponse,
          response: regResponse
        })
      });

      const verifyData = await verifyRes.json();

      if (verifyRes.ok && verifyData.verified) {
        setSuccess('Passkey / Biometric registered successfully! You can now sign in with Passkey.');
      } else {
        setError(verifyData.message || 'Passkey registration verification failed.');
      }
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setError('Passkey registration was cancelled.');
      } else {
        setError(err.message || 'Passkey registration failed.');
      }
    }
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    if (
      window.confirm(
        'Are you sure you want to logout?'
      )
    ) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      navigate('/login');
    }
  };

  // =========================================================
  // INITIALS
  // =========================================================

  const getInitials = (name) => {
    if (!name) {
      return '?';
    }

    return name
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // =========================================================
  // LOADING SCREEN
  // =========================================================

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="profile-loader"></div>

        <p>
          Loading your profile...
        </p>
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="profile-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="profile-header">

        <div className="profile-header-content">

          <button
            className="profile-back-btn"
            onClick={() =>
              navigate('/dashboard')
            }
          >
            <FaArrowLeft />
            Dashboard
          </button>

          <div className="profile-header-right">

            <button
              className="profile-logout-btn"
              onClick={handleLogout}
            >
              <FaSignOutAlt />
              Logout
            </button>

          </div>

        </div>

      </div>

      {/* =====================================================
          HERO
      ===================================================== */}

      <div className="profile-hero">

        <div className="profile-hero-content">

          {/* =================================================
              AVATAR
          ================================================= */}

          <div className="profile-avatar-container">

            <div className="profile-avatar">

              <span className="profile-avatar-text">
                {getInitials(
                  user?.full_name
                )}
              </span>

            </div>

          </div>

          {/* =================================================
              USER INFORMATION
          ================================================= */}

          <div className="profile-hero-info">

            <h1>
              {user?.full_name ||
                'User'}
            </h1>

            <p className="profile-hero-email">
              <FaEnvelope />
              {user?.email ||
                'Email not available'}
            </p>

            <p className="profile-hero-phone">
              <FaPhone />
              {user?.phone ||
                'Phone not added'}
            </p>

            <div className="profile-hero-badges">

              <span className="profile-badge">
                <FaCheckCircle />
                Verified Account
              </span>

              <span className="profile-badge">
                <FaShieldAlt />
                Secure
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          MESSAGES
      ===================================================== */}

      {error && (
        <div className="profile-message error">

          <FaExclamationCircle />

          {error}

        </div>
      )}

      {success && (
        <div className="profile-message success">

          <FaCheckCircle />

          {success}

        </div>
      )}

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="profile-content">

        {/* ===================================================
            PERSONAL INFORMATION
        =================================================== */}

        <div className="profile-card">

          <div className="profile-card-header">

            <h2>
              <FaUser />
              Personal Information
            </h2>

            <div className="profile-card-actions">

              {!isEditing ? (

                <button
                  className="profile-edit-btn"
                  onClick={() =>
                    setIsEditing(true)
                  }
                >
                  <FaEdit />
                  Edit Profile
                </button>

              ) : (

                <button
                  className="profile-cancel-btn"
                  onClick={() => {
                    setIsEditing(false);
                    fillFormData(user);
                  }}
                >
                  Cancel
                </button>

              )}

            </div>

          </div>

          <form
            onSubmit={
              handleProfileUpdate
            }
            className="profile-form"
          >

            <div className="profile-form-grid">

              {/* Full Name */}

              <div className="profile-form-group full-width">

                <label>
                  <FaUser />
                  Full Name
                </label>

                <input
                  type="text"
                  value={
                    formData.full_name
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      full_name:
                        e.target.value
                    })
                  }
                  disabled={!isEditing}
                  placeholder="Enter your full name"
                  required
                />

              </div>

              {/* Phone */}

              <div className="profile-form-group full-width">

                <label>
                  <FaPhone />
                  Phone Number
                </label>

                <input
                  type="tel"
                  value={
                    formData.phone
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone:
                        e.target.value
                    })
                  }
                  disabled={!isEditing}
                  placeholder="Enter 10-digit phone number"
                />

              </div>

              {/* Age */}

              <div className="profile-form-group">

                <label>
                  <FaCalendarAlt />
                  Age
                </label>

                <input
                  type="number"
                  value={
                    formData.age
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      age:
                        e.target.value
                    })
                  }
                  disabled={!isEditing}
                  placeholder="Age"
                />

              </div>

              {/* Gender */}

              <div className="profile-form-group">

                <label>
                  <FaVenusMars />
                  Gender
                </label>

                <select
                  value={
                    formData.gender
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gender:
                        e.target.value
                    })
                  }
                  disabled={!isEditing}
                >
                  <option value="">
                    Select Gender
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>

              </div>

              {/* Religion */}

              <div className="profile-form-group">

                <label>
                  <FaShieldAlt />
                  Religion
                </label>

                <input
                  type="text"
                  value={
                    formData.religion
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      religion:
                        e.target.value
                    })
                  }
                  disabled={!isEditing}
                  placeholder="Religion"
                />

              </div>

              {/* Caste */}

              <div className="profile-form-group">

                <label>
                  <FaShieldAlt />
                  Caste
                </label>

                <input
                  type="text"
                  value={
                    formData.caste
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      caste:
                        e.target.value
                    })
                  }
                  disabled={!isEditing}
                  placeholder="Caste"
                />

              </div>

              {/* State */}

              <div className="profile-form-group">

                <label>
                  <FaMapMarkerAlt />
                  State
                </label>

                <input
                  type="text"
                  value={
                    formData.state
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      state:
                        e.target.value
                    })
                  }
                  disabled={!isEditing}
                  placeholder="State"
                />

              </div>

              {/* District */}

              <div className="profile-form-group">

                <label>
                  <FaMapMarkerAlt />
                  District
                </label>

                <input
                  type="text"
                  value={
                    formData.district
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      district:
                        e.target.value
                    })
                  }
                  disabled={!isEditing}
                  placeholder="District"
                />

              </div>

              {/* Taluka */}

              <div className="profile-form-group">

                <label>
                  <FaMapMarkerAlt />
                  Taluka
                </label>

                <input
                  type="text"
                  value={
                    formData.taluka
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      taluka:
                        e.target.value
                    })
                  }
                  disabled={!isEditing}
                  placeholder="Taluka"
                />

              </div>

              {/* Village / City */}

              <div className="profile-form-group">

                <label>
                  <FaHome />
                  Village/City
                </label>

                <input
                  type="text"
                  value={
                    formData.village_city
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      village_city:
                        e.target.value
                    })
                  }
                  disabled={!isEditing}
                  placeholder="Village/City"
                />

              </div>

              {/* PIN */}

              <div className="profile-form-group">

                <label>
                  <FaMapMarkerAlt />
                  PIN Code
                </label>

                <input
                  type="text"
                  value={
                    formData.pin_code
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pin_code:
                        e.target.value
                    })
                  }
                  disabled={!isEditing}
                  placeholder="PIN Code"
                />

              </div>

              {/* House Type */}

              <div className="profile-form-group">

                <label>
                  <FaHome />
                  House Type
                </label>

                <input
                  type="text"
                  value={
                    formData.house_type
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      house_type:
                        e.target.value
                    })
                  }
                  disabled={!isEditing}
                  placeholder="House Type"
                />

              </div>

              {/* Family Members */}

              <div className="profile-form-group">

                <label>
                  <FaUsers />
                  Family Members
                </label>

                <input
                  type="number"
                  value={
                    formData.family_members
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      family_members:
                        e.target.value
                    })
                  }
                  disabled={!isEditing}
                  placeholder="Number of family members"
                />

              </div>

              {/* Children */}

              <div className="profile-form-group">

                <label>
                  <FaChild />
                  Number of Children
                </label>

                <input
                  type="number"
                  value={
                    formData.number_of_children
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      number_of_children:
                        e.target.value
                    })
                  }
                  disabled={!isEditing}
                  placeholder="Number of children"
                />

              </div>

              {/* Income */}

              <div className="profile-form-group">

                <label>
                  <FaRupeeSign />
                  Yearly Income
                </label>

                <input
                  type="number"
                  value={
                    formData.yearly_income
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      yearly_income:
                        e.target.value
                    })
                  }
                  disabled={!isEditing}
                  placeholder="Yearly income"
                />

              </div>

              {/* Occupation */}

              <div className="profile-form-group">

                <label>
                  <FaBriefcase />
                  Occupation
                </label>

                <input
                  type="text"
                  value={
                    formData.occupation
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      occupation:
                        e.target.value
                    })
                  }
                  disabled={!isEditing}
                  placeholder="Occupation"
                />

              </div>

              {/* Education */}

              <div className="profile-form-group">

                <label>
                  <FaGraduationCap />
                  Education
                </label>

                <input
                  type="text"
                  value={
                    formData.education
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      education:
                        e.target.value
                    })
                  }
                  disabled={!isEditing}
                  placeholder="Education"
                />

              </div>

            </div>

            {/* SAVE BUTTON */}

            {isEditing && (
              <div className="profile-form-actions">

                <button
                  type="submit"
                  className="profile-save-btn"
                  disabled={isLoading}
                >
                  <FaSave />

                  {isLoading
                    ? 'Saving...'
                    : 'Save Changes'}
                </button>

              </div>
            )}

          </form>

        </div>

        {/* ===================================================
            CHANGE PASSWORD
        =================================================== */}

        <div className="profile-card">

          <div className="profile-card-header">

            <h2>
              <FaLock />
              Change Password
            </h2>

          </div>

          <form
            onSubmit={
              handlePasswordChange
            }
            className="profile-form"
          >

            <div className="profile-form-grid">

              {/* Current Password */}

              <div className="profile-form-group full-width">

                <label>
                  <FaLock />
                  Current Password
                </label>

                <div className="profile-password-input">

                  <input
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    value={
                      passwordData.current_password
                    }
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        current_password:
                          e.target.value
                      })
                    }
                    placeholder="Enter current password"
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="profile-password-toggle"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                  >
                    {showPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>

                </div>

              </div>

              {/* New Password */}

              <div className="profile-form-group full-width">

                <label>
                  <FaLock />
                  New Password
                </label>

                <div className="profile-password-input">

                  <input
                    type={
                      showConfirmPassword
                        ? 'text'
                        : 'password'
                    }
                    value={
                      passwordData.new_password
                    }
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        new_password:
                          e.target.value
                      })
                    }
                    placeholder="Enter new password (min 6 characters)"
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    className="profile-password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>

                </div>

              </div>

              {/* Confirm Password */}

              <div className="profile-form-group full-width">

                <label>
                  <FaLock />
                  Confirm New Password
                </label>

                <input
                  type={
                    showConfirmPassword
                      ? 'text'
                      : 'password'
                  }
                  value={
                    passwordData.confirm_password
                  }
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirm_password:
                        e.target.value
                    })
                  }
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  required
                />

              </div>

            </div>

            {/* PASSWORD BUTTON */}

            <div className="profile-form-actions">

              <button
                type="submit"
                className="profile-password-btn"
              >
                <FaLock />
                Change Password
              </button>

            </div>

          </form>

        </div>

        {/* ===================================================
            BIOMETRIC / PASSKEY SECURITY
        =================================================== */}

        <div className="profile-card">

          <div className="profile-card-header">

            <h2>
              <FaFingerprint />
              Biometric & Passkey Security
            </h2>

          </div>

          <div style={{ padding: '0 20px 24px' }}>
            <p style={{ color: '#64748B', fontSize: '0.9375rem', lineHeight: '1.6', marginBottom: '18px' }}>
              Register this device with your biometric sensor (Fingerprint / Face ID / Windows Hello) or security key. You will be able to sign in instantly without typing a password.
            </p>

            <button
              type="button"
              onClick={handlePasskeyRegister}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #0A1E36, #1E5699)',
                color: '#FFFFFF',
                borderRadius: '10px',
                border: 'none',
                fontWeight: '700',
                fontSize: '0.9375rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(10, 30, 54, 0.22)'
              }}
            >
              <FaFingerprint />
              Register Passkey on this Device
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Profile;