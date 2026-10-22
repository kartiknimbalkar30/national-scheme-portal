import React from 'react';
import { useLanguage } from '../context/LanguageContext';

function LanguageSelector() {
  const { lang, setLang } = useLanguage ? useLanguage() : { lang: 'en', setLang: () => {} };

  return (
    <div className="language-selector" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      <button
        onClick={() => setLang && setLang('en')}
        style={{
          padding: '4px 10px',
          borderRadius: '16px',
          fontSize: '0.75rem',
          fontWeight: '700',
          border: '1px solid #E2E8F0',
          background: lang === 'en' ? '#0B2545' : '#FFFFFF',
          color: lang === 'en' ? '#FFFFFF' : '#475569',
          cursor: 'pointer'
        }}
      >
        EN
      </button>
      <button
        onClick={() => setLang && setLang('mr')}
        style={{
          padding: '4px 10px',
          borderRadius: '16px',
          fontSize: '0.75rem',
          fontWeight: '700',
          border: '1px solid #E2E8F0',
          background: lang === 'mr' ? '#0B2545' : '#FFFFFF',
          color: lang === 'mr' ? '#FFFFFF' : '#475569',
          cursor: 'pointer'
        }}
      >
        मराठी
      </button>
    </div>
  );
}

export default LanguageSelector;
