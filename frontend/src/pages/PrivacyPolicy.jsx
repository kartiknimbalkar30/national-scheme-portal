import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaArrowLeft, FaShieldAlt, FaLock, FaUserSecret, FaDatabase,
  FaCookie, FaEnvelope, FaPhone, FaMapMarkerAlt
} from 'react-icons/fa';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-page">
      <div className="privacy-container">
        
        <div className="privacy-header">
          <Link to="/" className="privacy-back-btn">
            <FaArrowLeft /> Back to Home
          </Link>
          <div className="privacy-header-content">
            <FaShieldAlt className="privacy-header-icon" />
            <h1>Privacy Policy</h1>
            <p>Last Updated: January 2026</p>
          </div>
        </div>

        <div className="privacy-content">
          
          <section className="privacy-section">
            <h2>1. Introduction</h2>
            <p>
              Welcome to the National Scheme Portal. We are committed to protecting your privacy 
              and ensuring the security of your personal information. This Privacy Policy explains 
              how we collect, use, disclose, and safeguard your information.
            </p>
          </section>

          <section className="privacy-section">
            <h2>2. Information We Collect</h2>
            <h3>2.1 Personal Information</h3>
            <ul>
              <li><strong>Registration Information:</strong> Full name, email, phone, age, gender, religion, caste, occupation.</li>
              <li><strong>Location Information:</strong> State, district, taluka, village/city, PIN code.</li>
              <li><strong>Financial Information:</strong> Yearly income, family members, number of children.</li>
            </ul>
            <h3>2.2 Automatically Collected Information</h3>
            <ul>
              <li><strong>Device Information:</strong> IP address, browser type, operating system.</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent, search queries.</li>
              <li><strong>Cookies:</strong> We use cookies to enhance your experience.</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>3. How We Use Your Information</h2>
            <ul>
              <li><strong>Scheme Matching:</strong> To match you with relevant government schemes.</li>
              <li><strong>Application Processing:</strong> To process your scheme applications.</li>
              <li><strong>Communication:</strong> To send you updates and important information.</li>
              <li><strong>Improvement:</strong> To analyze usage and improve our services.</li>
              <li><strong>Security:</strong> To detect and prevent technical issues.</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>4. Data Security</h2>
            <ul>
              <li><FaLock /> <strong>Encryption:</strong> All data is encrypted during transmission.</li>
              <li><FaUserSecret /> <strong>Access Control:</strong> Strict access controls to your data.</li>
              <li><FaDatabase /> <strong>Secure Storage:</strong> Data stored in secure databases.</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>5. Data Sharing</h2>
            <p>
              We do not sell or rent your personal information. We may share with:
            </p>
            <ul>
              <li><strong>Government Agencies:</strong> For scheme verification and processing.</li>
              <li><strong>Service Providers:</strong> Third-party vendors who assist in operating our platform.</li>
              <li><strong>Legal Requirements:</strong> When required by law.</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>6. Your Rights</h2>
            <ul>
              <li><strong>Access:</strong> Request a copy of your personal data.</li>
              <li><strong>Correction:</strong> Request correction of inaccurate data.</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data.</li>
              <li><strong>Withdraw Consent:</strong> Withdraw your consent at any time.</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>7. Cookies Policy</h2>
            <ul>
              <li><FaCookie /> <strong>Essential Cookies:</strong> Required for basic functionality.</li>
              <li><FaCookie /> <strong>Analytics Cookies:</strong> Help us understand usage.</li>
              <li><FaCookie /> <strong>Preference Cookies:</strong> Remember your settings.</li>
            </ul>
            <p>You can control cookies through your browser settings.</p>
          </section>

          <section className="privacy-section">
            <h2>8. Children's Privacy</h2>
            <p>
              Our services are intended for individuals who are at least 18 years old. We do not 
              knowingly collect personal information from children under 13.
            </p>
          </section>

          <section className="privacy-section">
            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. The "Last Updated" date will reflect changes.
            </p>
          </section>

          <section className="privacy-section">
            <h2>10. Contact Us</h2>
            <div className="privacy-contact">
              <div className="contact-item">
                <FaEnvelope /> <span>schemesportal@gmail.com</span>
              </div>
              <div className="contact-item">
                <FaPhone /> <span>8879060527</span>
              </div>
              <div className="contact-item">
                <FaMapMarkerAlt /> <span>New Delhi, India</span>
              </div>
            </div>
          </section>

          <div className="privacy-footer">
            <p>© 2026 National Scheme Portal. All rights reserved.</p>
            <div className="privacy-footer-links">
              <Link to="/privacy">Privacy Policy</Link>
              <span>|</span>
              <Link to="/terms">Terms & Conditions</Link>
              <span>|</span>
              <Link to="/accessibility">Accessibility</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;