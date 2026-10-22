import React, { useState } from 'react';
import { FaLifeRing, FaArrowLeft, FaSearch, FaChevronDown, FaEnvelope, FaPhoneAlt, FaComments } from 'react-icons/fa';

function HelpCentre() {
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'How do I check which schemes I am eligible for?',
      a: 'After registering and completing your profile (age, income, occupation, state, etc.), your Dashboard automatically shows schemes matched to your eligibility.'
    },
    {
      q: 'I forgot my password. What should I do?',
      a: 'Click "Forgot Password?" on the Login page and follow the instructions sent to your registered email address.'
    },
    {
      q: 'Why is my email OTP not arriving?',
      a: 'Check your spam/junk folder first. If it still does not arrive, wait for the resend timer to finish and tap "Resend OTP". Make sure the email address you entered is correct.'
    },
    {
      q: 'Can I update my profile after registering?',
      a: 'Yes, go to your Profile page from the dashboard menu to update your details. Your scheme matches will refresh automatically based on the new information.'
    },
    {
      q: 'Is my personal information safe on this portal?',
      a: 'Yes. We use encrypted connections and secure authentication. See our Privacy Policy for full details on how your data is handled.'
    },
    {
      q: 'How do I apply for a scheme once I find one I am eligible for?',
      a: 'Open the scheme\u2019s details page and click "Apply Now" — this takes you to the official government application portal for that scheme.'
    },
    {
      q: 'Can I save schemes to check later?',
      a: 'Yes, click the "Save" button on any scheme card. You can view all your saved schemes from your profile menu at any time.'
    }
  ];

  const filteredFaqs = faqs.filter(
    (f) => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="help-page">
      <style>{`
        .help-page {
          min-height: 100vh;
          background: #F5F7FB;
          font-family: 'Inter', 'Segoe UI', sans-serif;
          padding: 40px 20px 60px;
        }
        .help-shell { max-width: 760px; margin: 0 auto; }
        .help-back {
          display: inline-flex; align-items: center; gap: 8px;
          color: #0B2545; font-weight: 700; font-size: 0.88rem;
          text-decoration: none; margin-bottom: 24px; transition: gap 0.2s ease;
        }
        .help-back:hover { gap: 12px; color: #EF6C00; }
        .help-header {
          background: linear-gradient(135deg, #0B2545, #153E75);
          color: white; border-radius: 20px; padding: 34px 32px; margin-bottom: 20px;
          box-shadow: 0 12px 32px rgba(11,37,69,0.2);
        }
        .help-header-icon {
          width: 52px; height: 52px; border-radius: 14px;
          background: rgba(255,255,255,0.12); display: flex; align-items: center; justify-content: center;
          font-size: 1.4rem; margin-bottom: 14px;
        }
        .help-header h1 { font-size: 1.6rem; font-weight: 800; margin: 0 0 6px; }
        .help-header p { opacity: 0.8; font-size: 0.88rem; margin: 0; }

        .help-search {
          display: flex; align-items: center; gap: 10px;
          background: white; border: 1.5px solid #E6EAF2; border-radius: 14px;
          padding: 12px 16px; margin-bottom: 20px; box-shadow: 0 3px 12px rgba(11,37,69,0.06);
          transition: border-color 0.2s ease;
        }
        .help-search:focus-within { border-color: #1E4E8C; box-shadow: 0 0 0 4px rgba(30,78,140,0.1); }
        .help-search svg { color: #6B7A99; }
        .help-search input { flex: 1; border: none; outline: none; font-size: 0.92rem; color: #0B2545; }

        .faq-item {
          background: white; border: 1px solid #E6EAF2; border-radius: 14px;
          margin-bottom: 10px; overflow: hidden; transition: box-shadow 0.2s ease;
        }
        .faq-item:hover { box-shadow: 0 6px 18px rgba(11,37,69,0.08); }
        .faq-question {
          width: 100%; display: flex; align-items: center; justify-content: space-between;
          padding: 16px 18px; background: none; border: none; cursor: pointer;
          font-size: 0.92rem; font-weight: 700; color: #0B2545; text-align: left;
        }
        .faq-question svg { color: #EF6C00; transition: transform 0.25s ease; flex-shrink: 0; margin-left: 12px; }
        .faq-question.open svg { transform: rotate(180deg); }
        .faq-answer {
          max-height: 0; overflow: hidden; transition: max-height 0.3s ease, padding 0.3s ease;
          padding: 0 18px; color: #3D5A80; font-size: 0.88rem; line-height: 1.65;
        }
        .faq-answer.open { max-height: 240px; padding: 0 18px 18px; }

        .help-empty { text-align: center; color: #6B7A99; padding: 30px; font-size: 0.9rem; }

        .help-contact-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 24px; }
        .help-contact-card {
          background: white; border: 1px solid #E6EAF2; border-radius: 14px;
          padding: 18px; text-align: center; transition: all 0.25s ease;
        }
        .help-contact-card:hover { transform: translateY(-4px); box-shadow: 0 10px 24px rgba(11,37,69,0.1); border-color: #EF6C00; }
        .help-contact-icon {
          width: 40px; height: 40px; border-radius: 12px; margin: 0 auto 10px;
          background: linear-gradient(135deg, #0B2545, #1E4E8C); color: white;
          display: flex; align-items: center; justify-content: center; font-size: 1.05rem;
        }
        .help-contact-card h4 { font-size: 0.85rem; color: #0B2545; margin: 0 0 4px; }
        .help-contact-card p { font-size: 0.76rem; color: #6B7A99; margin: 0; }

        @media (max-width: 560px) {
          .help-contact-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="help-shell">
        <a href="/login" className="help-back"><FaArrowLeft /> Back to Login</a>

        <div className="help-header">
          <div className="help-header-icon"><FaLifeRing /></div>
          <h1>Help Centre</h1>
          <p>National Scheme Portal &middot; Government of India</p>
        </div>

        <div className="help-search">
          <FaSearch />
          <input
            type="text"
            placeholder="Search for help..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filteredFaqs.length === 0 ? (
          <div className="help-empty">No results found. Try a different search term.</div>
        ) : (
          filteredFaqs.map((f, i) => (
            <div className="faq-item" key={i}>
              <button
                className={`faq-question ${openIndex === i ? 'open' : ''}`}
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
              >
                {f.q}
                <FaChevronDown />
              </button>
              <div className={`faq-answer ${openIndex === i ? 'open' : ''}`}>{f.a}</div>
            </div>
          ))
        )}

        <div className="help-contact-grid">
          <div className="help-contact-card">
            <div className="help-contact-icon"><FaEnvelope /></div>
            <h4>Email Support</h4>
            <p>support@schemeportal.gov.in</p>
          </div>
          <div className="help-contact-card">
            <div className="help-contact-icon"><FaPhoneAlt /></div>
            <h4>Helpline</h4>
            <p>1800-XXX-XXXX (Toll Free)</p>
          </div>
          <div className="help-contact-card">
            <div className="help-contact-icon"><FaComments /></div>
            <h4>Live Chat</h4>
            <p>Available 9 AM - 6 PM IST</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpCentre;