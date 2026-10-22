import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaArrowLeft, FaUniversalAccess, FaEye, FaKeyboard, FaFont,
  FaTextHeight, FaClosedCaptioning, FaMousePointer,
  FaAccessibleIcon, FaCheckCircle, FaEnvelope, FaPhone,
  FaAdjust
} from 'react-icons/fa';
import './Accessibility.css';

const Accessibility = () => {
  return (
    <div className="accessibility-page">
      <div className="accessibility-container">
        
        <div className="accessibility-header">
          <Link to="/" className="accessibility-back-btn">
            <FaArrowLeft /> Back to Home
          </Link>
          <div className="accessibility-header-content">
            <FaUniversalAccess className="accessibility-header-icon" />
            <h1>Accessibility Statement</h1>
            <p>Last Updated: Oct 2026</p>
          </div>
        </div>

        <div className="accessibility-content">
          
          <section className="accessibility-section">
            <h2>1. Our Commitment</h2>
            <p>
              The National Scheme Portal is committed to ensuring digital accessibility for all people, 
              regardless of ability or disability. We strive to provide an inclusive experience that 
              allows all citizens to access government schemes and services.
            </p>
          </section>

          <section className="accessibility-section">
            <h2>2. Standards Compliance</h2>
            <p>
              We aim to comply with the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA 
              standards. These guidelines are internationally recognized.
            </p>
            <div className="accessibility-standards">
              <div className="standard-item">
                <FaCheckCircle className="standard-icon" />
                <div>
                  <strong>Perceivable</strong>
                  <p>Content is presented in ways that all users can perceive.</p>
                </div>
              </div>
              <div className="standard-item">
                <FaCheckCircle className="standard-icon" />
                <div>
                  <strong>Operable</strong>
                  <p>Interface components are operable by all users.</p>
                </div>
              </div>
              <div className="standard-item">
                <FaCheckCircle className="standard-icon" />
                <div>
                  <strong>Understandable</strong>
                  <p>Content and interface are understandable to all users.</p>
                </div>
              </div>
              <div className="standard-item">
                <FaCheckCircle className="standard-icon" />
                <div>
                  <strong>Robust</strong>
                  <p>Content is robust enough to work with various assistive technologies.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="accessibility-section">
            <h2>3. Accessibility Features</h2>
            <div className="features-grid">
              <div className="feature-card">
                <FaEye className="feature-icon" />
                <h4>Screen Reader Support</h4>
                <p>Compatible with JAWS, NVDA, and VoiceOver.</p>
              </div>
              <div className="feature-card">
                <FaKeyboard className="feature-icon" />
                <h4>Keyboard Navigation</h4>
                <p>Full keyboard accessibility.</p>
              </div>
              <div className="feature-card">
                <FaFont className="feature-icon" />
                <h4>Readable Fonts</h4>
                <p>Clean, readable fonts with good contrast.</p>
              </div>
              <div className="feature-card">
                <FaTextHeight className="feature-icon" />
                <h4>Text Resizing</h4>
                <p>Content scales up to 200%.</p>
              </div>
              <div className="feature-card">
                <FaAdjust className="feature-icon" />
                <h4>High Contrast Mode</h4>
                <p>Sufficient color contrast.</p>
              </div>
              <div className="feature-card">
                <FaClosedCaptioning className="feature-icon" />
                <h4>Alternative Text</h4>
                <p>Descriptive alt text for images.</p>
              </div>
            </div>
          </section>

          <section className="accessibility-section">
            <h2>4. Assistive Technologies Supported</h2>
            <ul>
              <li><FaAccessibleIcon /> Screen readers (JAWS, NVDA, VoiceOver, TalkBack)</li>
              <li><FaMousePointer /> Screen magnification software</li>
              <li><FaKeyboard /> Speech recognition software</li>
              <li><FaKeyboard /> Braille display devices</li>
            </ul>
          </section>

          <section className="accessibility-section">
            <h2>5. Accessibility Tips</h2>
            <div className="tips-grid">
              <div className="tip-item">
                <div className="tip-number">1</div>
                <div>
                  <h4>Use Keyboard Shortcuts</h4>
                  <p>Press <kbd>Tab</kbd> to navigate, <kbd>Enter</kbd> to select.</p>
                </div>
              </div>
              <div className="tip-item">
                <div className="tip-number">2</div>
                <div>
                  <h4>Adjust Text Size</h4>
                  <p>Use <kbd>Ctrl</kbd> + <kbd>+</kbd> or <kbd>Ctrl</kbd> + <kbd>-</kbd>.</p>
                </div>
              </div>
              <div className="tip-item">
                <div className="tip-number">3</div>
                <div>
                  <h4>Use High Contrast</h4>
                  <p>Enable high contrast mode in your OS.</p>
                </div>
              </div>
              <div className="tip-item">
                <div className="tip-number">4</div>
                <div>
                  <h4>Voice Commands</h4>
                  <p>Use voice dictation tools.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="accessibility-section">
            <h2>6. Feedback and Assistance</h2>
            <p>
              We welcome your feedback on accessibility. If you encounter any barriers, please contact us.
            </p>
            <div className="accessibility-contact">
              <div className="contact-item">
                <FaEnvelope /> <span>schemesportal@gmail.com</span>
              </div>
              <div className="contact-item">
                <FaPhone /> <span>8879060527</span>
              </div>
            </div>
          </section>

          <section className="accessibility-section">
            <h2>7. Our Accessibility Pledge</h2>
            <div className="accessibility-pledge">
              <FaUniversalAccess className="pledge-icon" />
              <p>
                We are dedicated to continuously improving our platform to ensure that all citizens, 
                regardless of ability, can easily access and benefit from government schemes.
              </p>
            </div>
          </section>

          <div className="accessibility-footer">
            <p>© 2026 National Scheme Portal. All rights reserved.</p>
            <div className="accessibility-footer-links">
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

export default Accessibility;