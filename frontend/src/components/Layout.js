import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaShieldAlt, FaSun, FaMoon, FaBell, FaUserCircle, 
  FaChevronDown, FaSignOutAlt
} from 'react-icons/fa';
import './Layout.css';

function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const getProfilePhoto = (profile) => 
    profile?.profile_photo || profile?.profilePhoto || profile?.photo || null;

  const profilePhoto = getProfilePhoto(user);

  return (
    <div className={`layout-root ${darkMode ? 'dark' : ''}`}>
      
      {/* ============ PROFESSIONAL HEADER ============ */}
      <header className="layout-header">
        <div className="layout-header-inner">
          
          <Link to="/" className="layout-logo">
            <FaShieldAlt className="layout-logo-icon" />
            <div className="layout-logo-text">
              <span className="layout-logo-title">National Scheme Portal</span>
              <span className="layout-logo-sub">GOVERNMENT OF INDIA</span>
            </div>
          </Link>

          <nav className="layout-nav">
            <Link to="/" className={`layout-nav-item ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
            <Link to="/dashboard" className={`layout-nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>Dashboard</Link>
            <Link to="/saved" className={`layout-nav-item ${location.pathname === '/saved' ? 'active' : ''}`}>Saved</Link>
            <Link to="/admin" className={`layout-nav-item ${location.pathname === '/admin' ? 'active' : ''}`}>Admin</Link>
            <Link to="/profile" className={`layout-nav-item ${location.pathname === '/profile' ? 'active' : ''}`}>Profile</Link>
          </nav>

          <div className="layout-actions">
            <button className="layout-icon-btn" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>

            <button className="layout-icon-btn">
              <FaBell />
            </button>

            {user ? (
              <div className="layout-profile-wrap">
                <button className="layout-profile-btn" onClick={() => setShowProfileMenu(!showProfileMenu)}>
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Profile" className="layout-profile-avatar" />
                  ) : (
                    <FaUserCircle className="layout-profile-avatar-fallback" />
                  )}
                  <span className="layout-profile-name">{user?.full_name?.split(' ')[0] || 'User'}</span>
                  <FaChevronDown className={`layout-chevron ${showProfileMenu ? 'rotated' : ''}`} />
                </button>

                {showProfileMenu && (
                  <div className="layout-dropdown">
                    <div className="layout-dropdown-header">
                      {profilePhoto ? (
                        <img src={profilePhoto} alt="Profile" className="layout-dropdown-avatar" />
                      ) : (
                        <FaUserCircle className="layout-dropdown-avatar-fallback" />
                      )}
                      <div>
                        <div className="layout-dropdown-name">{user?.full_name}</div>
                        <div className="layout-dropdown-email">{user?.email}</div>
                      </div>
                    </div>
                    <div className="layout-dropdown-divider"></div>
                    <button className="layout-dropdown-item" onClick={handleLogout}>
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="layout-btn-login">Login</Link>
            )}
          </div>
        </div>
      </header>

      {/* ============ MAIN CONTENT ============ */}
      <main className="layout-main">
        <div className="layout-container">
          {children}
        </div>
      </main>
    </div>
  );
}

export default Layout;
