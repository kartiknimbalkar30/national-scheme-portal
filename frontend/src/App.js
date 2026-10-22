import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import Navbar from './components/Navbar';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SchemeDetail from './pages/SchemeDetail';
import SavedSchemes from './pages/SavedSchemes';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';

import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import Accessibility from './pages/Accessibility';

import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />

        <main className="main-content">
          <Routes>

            {/* Public Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/forgot-password"
              element={<ForgotPassword />}
            />

            {/* User Pages */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/scheme/:id" element={<SchemeDetail />} />
            <Route path="/saved" element={<SavedSchemes />} />
            <Route path="/profile" element={<Profile />} />

            {/* Admin */}
            <Route path="/admin" element={<Admin />} />

            {/* Legal Pages */}
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsConditions />} />
            <Route
              path="/accessibility"
              element={<Accessibility />}
            />

            {/* 404 */}
            <Route
              path="*"
              element={
                <div className="not-found">
                  <h1>404</h1>
                  <p>Page not found.</p>
                </div>
              }
            />

          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;