import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaLandmark,
  FaHome,
  FaThLarge,
  FaBookmark,
  FaUserShield,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaCheckCircle
} from 'react-icons/fa';

import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = () => {
      try {
        const stored = localStorage.getItem('user');
        setUser(stored ? JSON.parse(stored) : null);
      } catch (e) {
        setUser(null);
      }
    };
    loadUser();

    window.addEventListener('profileUpdated', loadUser);
    window.addEventListener('storage', loadUser);
    return () => {
      window.removeEventListener('profileUpdated', loadUser);
      window.removeEventListener('storage', loadUser);
    };
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const closeMenu = () => setMenuOpen(false);
  const isActive = (path) => (location.pathname === path ? 'active' : '');

  const profilePhoto = user?.photo || user?.profile_photo || null;

  return (
    <header className="gov-navbar">
      {/* Top Tricolor / Sovereign Accent Line */}
      <div className="gov-tricolor-bar">
        <span className="tricolor-saffron"></span>
        <span className="tricolor-white"></span>
        <span className="tricolor-green"></span>
      </div>

      <div className="gov-navbar-inner">
        {/* BRAND LOGO */}
        <Link to="/" className="gov-brand" onClick={closeMenu}>
          <div className="gov-emblem-badge">
            <FaLandmark className="gov-emblem-icon" />
          </div>
          <div className="gov-brand-meta">
            <span className="gov-brand-title">National Scheme Portal</span>
           <span className="gov-brand-subtitle">Your Gateway to Government Schemes</span>
          </div>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <nav className="gov-nav-links" aria-label="Main Navigation">
          <Link to="/" className={`gov-nav-item ${isActive('/')}`}>
            <FaHome className="gov-nav-icon" />
            <span>Home</span>
          </Link>

          <Link to="/dashboard" className={`gov-nav-item ${isActive('/dashboard')}`}>
            <FaThLarge className="gov-nav-icon" />
            <span>Dashboard</span>
          </Link>

          <Link to="/saved" className={`gov-nav-item ${isActive('/saved')}`}>
            <FaBookmark className="gov-nav-icon" />
            <span>Saved</span>
          </Link>

          <Link to="/admin" className={`gov-nav-item ${isActive('/admin')}`}>
            <FaUserShield className="gov-nav-icon" />
            <span>Admin</span>
          </Link>

          <Link to="/profile" className={`gov-nav-item ${isActive('/profile')}`}>
            <FaUser className="gov-nav-icon" />
            <span>Profile</span>
          </Link>
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="gov-nav-actions">
          {user ? (
            <div className="gov-user-pill">
              <Link to="/profile" className="gov-user-link" title="Manage Citizen Profile">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="User Avatar" className="gov-avatar-img" />
                ) : (
                  <div className="gov-avatar-initial">
                    {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <div className="gov-user-info">
                  <span className="gov-user-name">
                    {user.full_name?.split(' ')[0] || 'Citizen'}
                  </span>
                  <span className="gov-user-status">
                    <FaCheckCircle /> Verified
                  </span>
                </div>
              </Link>

              <button
                className="gov-logout-btn"
                onClick={handleLogout}
                title="Sign out of your account"
                aria-label="Sign out"
              >
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            <div className="gov-auth-group">
              <Link to="/login" className="gov-btn-login">
                Citizen Login
              </Link>
              <Link to="/register" className="gov-btn-register">
                Register
              </Link>
            </div>
          )}

          {/* MOBILE TOGGLE */}
          <button
            className="gov-mobile-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {menuOpen && (
        <div className="gov-mobile-drawer">
          <div className="gov-mobile-links">
            <Link to="/" className={`gov-mob-item ${isActive('/')}`} onClick={closeMenu}>
              <FaHome /> Home
            </Link>
            <Link to="/dashboard" className={`gov-mob-item ${isActive('/dashboard')}`} onClick={closeMenu}>
              <FaThLarge /> Dashboard
            </Link>
            <Link to="/saved" className={`gov-mob-item ${isActive('/saved')}`} onClick={closeMenu}>
              <FaBookmark /> Saved Schemes
            </Link>
            <Link to="/admin" className={`gov-mob-item ${isActive('/admin')}`} onClick={closeMenu}>
              <FaUserShield /> Admin Panel
            </Link>
            <Link to="/profile" className={`gov-mob-item ${isActive('/profile')}`} onClick={closeMenu}>
              <FaUser /> Profile & Settings
            </Link>
          </div>

          <div className="gov-mobile-footer">
            {user ? (
              <button
                className="gov-mob-logout"
                onClick={() => {
                  closeMenu();
                  handleLogout();
                }}
              >
                <FaSignOutAlt /> Sign Out ({user.full_name?.split(' ')[0] || 'User'})
              </button>
            ) : (
              <div className="gov-mob-auth">
                <Link to="/login" className="gov-btn-login" onClick={closeMenu}>
                  Citizen Login
                </Link>
                <Link to="/register" className="gov-btn-register" onClick={closeMenu}>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;