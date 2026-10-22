import React from 'react';
import { FaShieldAlt, FaArrowLeft, FaLock, FaDatabase, FaUserShield, FaEnvelope } from 'react-icons/fa';

function PrivacyPolicy() {
  const sections = [
    {
      icon: <FaDatabase />,
      title: 'Information We Collect',
      body: 'When you register on the National Scheme Portal, we collect information you provide directly — such as your name, phone number, email address, age, gender, state, district, income, occupation, and other eligibility-related details. This information is used solely to match you with relevant Central and State Government schemes.'
    },
    {
      icon: <FaLock />,
      title: 'How We Use Your Information',
      body: 'Your data is used to determine your eligibility for government schemes, personalize your dashboard, and improve the accuracy of scheme recommendations. We do not sell or rent your personal information to third parties for marketing purposes.'
    },
    {
      icon: <FaUserShield />,
      title: 'Data Security',
      body: 'We use industry-standard measures — including encrypted connections and secure authentication (including passkey/biometric login where supported) — to protect your data. Passwords are never stored in plain text.'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Your Rights',
      body: 'You may update or delete your profile information at any time from your account settings. You can also request a copy of the data we hold about you by contacting our support team.'
    },
    {
      icon: <FaEnvelope />,
      title: 'Contact Us',
      body: 'If you have questions about this Privacy Policy or how your data is handled, please reach out through the Help Centre.'
    }
  ];

  return (
    <div className="legal-page">
      <style>{`
        .legal-page {
          min-height: 100vh;
          background: #F5F7FB;
          font-family: 'Inter', 'Segoe UI', sans-serif;
          padding: 40px 20px 60px;
        }
        .legal-shell { max-width: 760px; margin: 0 auto; }
        .legal-back {
          display: inline-flex; align-items: center; gap: 8px;
          color: #0B2545; font-weight: 700; font-size: 0.88rem;
          text-decoration: none; margin-bottom: 24px; transition: gap 0.2s ease;
        }
        .legal-back:hover { gap: 12px; color: #EF6C00; }
        .legal-header {
          background: linear-gradient(135deg, #0B2545, #153E75);
          color: white; border-radius: 20px; padding: 34px 32px; margin-bottom: 24px;
          box-shadow: 0 12px 32px rgba(11,37,69,0.2);
        }
        .legal-header-icon {
          width: 52px; height: 52px; border-radius: 14px;
          background: rgba(255,255,255,0.12); display: flex; align-items: center; justify-content: center;
          font-size: 1.4rem; margin-bottom: 14px;
        }
        .legal-header h1 { font-size: 1.6rem; font-weight: 800; margin: 0 0 6px; }
        .legal-header p { opacity: 0.8; font-size: 0.88rem; margin: 0; }
        .legal-card {
          background: white; border: 1px solid #E6EAF2; border-radius: 16px;
          padding: 24px 26px; margin-bottom: 16px; box-shadow: 0 3px 12px rgba(11,37,69,0.06);
          transition: box-shadow 0.25s ease, transform 0.25s ease;
        }
        .legal-card:hover { box-shadow: 0 10px 26px rgba(11,37,69,0.1); transform: translateY(-2px); }
        .legal-card-title { display: flex; align-items: center; gap: 10px; font-size: 1.05rem; font-weight: 800; color: #0B2545; margin: 0 0 10px; }
        .legal-card-title svg { color: #EF6C00; }
        .legal-card p { color: #3D5A80; font-size: 0.92rem; line-height: 1.7; margin: 0; }
        .legal-updated { text-align: center; font-size: 0.78rem; color: #6B7A99; margin-top: 24px; }
      `}</style>

      <div className="legal-shell">
        <a href="/login" className="legal-back"><FaArrowLeft /> Back to Login</a>

        <div className="legal-header">
          <div className="legal-header-icon"><FaShieldAlt /></div>
          <h1>Privacy Policy</h1>
          <p>National Scheme Portal &middot; Government of India</p>
        </div>

        {sections.map((s, i) => (
          <div className="legal-card" key={i}>
            <h3 className="legal-card-title">{s.icon} {s.title}</h3>
            <p>{s.body}</p>
          </div>
        ))}

        <p className="legal-updated">Last updated: January 2026</p>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
