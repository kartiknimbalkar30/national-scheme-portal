import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaArrowLeft, FaGavel, FaCheckCircle, FaExclamationTriangle,
  FaEnvelope, FaPhone, FaClock
} from 'react-icons/fa';
import './TermsConditions.css';

const TermsConditions = () => {
  return (
    <div className="terms-page">
      <div className="terms-container">
        
        <div className="terms-header">
          <Link to="/" className="terms-back-btn">
            <FaArrowLeft /> Back to Home
          </Link>
          <div className="terms-header-content">
            <FaGavel className="terms-header-icon" />
            <h1>Terms & Conditions</h1>
            <p>Last Updated: January 2026</p>
          </div>
        </div>

        <div className="terms-content">
          
          <section className="terms-section">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using the National Scheme Portal ("Platform"), you agree to be bound by 
              these Terms & Conditions. If you do not agree, you must not use our services.
            </p>
          </section>

          <section className="terms-section">
            <h2>2. User Accounts</h2>
            <h3>2.1 Account Creation</h3>
            <ul>
              <li>You must provide accurate and complete information during registration.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You must notify us immediately of any unauthorized use of your account.</li>
            </ul>
            <h3>2.2 Account Responsibilities</h3>
            <ul>
              <li>You are solely responsible for all activities under your account.</li>
              <li>You must not share your account credentials with any third party.</li>
              <li>You must keep your profile information up to date.</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>3. Use of Platform</h2>
            <h3>3.1 Permitted Use</h3>
            <ul>
              <li>Checking eligibility for government schemes.</li>
              <li>Applying for government schemes through the platform.</li>
              <li>Tracking application status and receiving updates.</li>
              <li>Accessing information about government schemes.</li>
            </ul>
            <h3>3.2 Prohibited Use</h3>
            <ul>
              <li><FaExclamationTriangle /> Providing false or misleading information.</li>
              <li><FaExclamationTriangle /> Attempting to gain unauthorized access.</li>
              <li><FaExclamationTriangle /> Using the platform for illegal purposes.</li>
              <li><FaExclamationTriangle /> Distributing malware or harmful content.</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>4. Eligibility for Schemes</h2>
            <ul>
              <li><strong>Accuracy:</strong> The platform provides eligibility estimates based on your information.</li>
              <li><strong>Verification:</strong> Final eligibility is determined by government authorities.</li>
              <li><strong>Disclosure:</strong> You must provide truthful and accurate information.</li>
              <li><strong>Changes:</strong> Scheme eligibility criteria may change over time.</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>5. Intellectual Property</h2>
            <ul>
              <li><strong>Ownership:</strong> All content, design, and code on the platform are owned by the National Scheme Portal.</li>
              <li><strong>Use:</strong> You may not copy, modify, or distribute any content without permission.</li>
              <li><strong>Trademarks:</strong> All trademarks and logos are property of their respective owners.</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>6. Disclaimers</h2>
            <ul>
              <li><strong>No Warranty:</strong> The platform is provided "as is" without warranties.</li>
              <li><strong>Accuracy:</strong> We do not guarantee the accuracy of scheme information.</li>
              <li><strong>Availability:</strong> We do not guarantee uninterrupted access.</li>
              <li><strong>Third-Party Links:</strong> We are not responsible for external content.</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>7. Limitation of Liability</h2>
            <p>
              The National Scheme Portal shall not be liable for any indirect, incidental, special, 
              consequential, or punitive damages arising from your use of the platform.
            </p>
          </section>

          <section className="terms-section">
            <h2>8. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your account for violations of these Terms.
            </p>
          </section>

          <section className="terms-section">
            <h2>9. Changes to Terms</h2>
            <p>
              We may update these Terms from time to time. Continued use constitutes acceptance.
            </p>
          </section>

          <section className="terms-section">
            <h2>10. Contact Information</h2>
            <div className="terms-contact">
              <div className="contact-item">
                <FaEnvelope /> <span>schemesportal@gmail.com</span>
              </div>
              <div className="contact-item">
                <FaPhone /> <span>8879060527</span>
              </div>
              <div className="contact-item">
                <FaClock /> <span>Mon-Fri: 9:00 AM - 6:00 PM</span>
              </div>
            </div>
          </section>

          <div className="terms-footer">
            <div className="terms-acceptance">
              <FaCheckCircle /> By using this platform, you accept these Terms & Conditions.
            </div>
            <p>© 2026 National Scheme Portal. All rights reserved.</p>
            <div className="terms-footer-links">
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

export default TermsConditions;