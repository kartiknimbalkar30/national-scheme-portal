import React, { useState, useCallback, useEffect } from 'react';

export function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'error') => {
    setToast({ message, type, key: Date.now() });
  }, []);

  const closeToast = useCallback(() => setToast(null), []);

  const ToastComponent = useCallback(() => {
    if (!toast) return null;
    return <ToastPopup toast={toast} onClose={closeToast} />;
  }, [toast, closeToast]);

  return { showToast, ToastComponent };
}

function ToastPopup({ toast, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [toast.key, onClose]);

  const colors = {
    error: { bg: '#ffebee', border: '#e53935', text: '#c62828', icon: '❌' },
    success: { bg: '#e8f5e9', border: '#43a047', text: '#2e7d32', icon: '✅' },
    warning: { bg: '#fff8e1', border: '#ffb300', text: '#e65100', icon: '⚠️' },
    info: { bg: '#e3f2fd', border: '#1e88e5', text: '#1565c0', icon: 'ℹ️' },
  };
  const c = colors[toast.type] || colors.error;

  return (
    <>
      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateX(120%); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes toastShrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        .app-toast-close:hover { transform: scale(1.25); opacity: 1 !important; }
        .app-toast-box { animation: toastSlideIn 0.4s cubic-bezier(.17,.67,.34,1.01); }
      `}</style>
      <div className="app-toast-box" style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 99999,
        backgroundColor: c.bg,
        border: `1.5px solid ${c.border}`,
        borderLeft: `6px solid ${c.border}`,
        color: c.text,
        padding: '16px 20px',
        borderRadius: '10px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
        minWidth: '280px',
        maxWidth: '380px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        fontFamily: '"Segoe UI", Arial, sans-serif',
        overflow: 'hidden'
      }}>
        <span style={{ fontSize: '1.2rem' }}>{c.icon}</span>
        <span style={{ flex: 1, fontSize: '0.92rem', fontWeight: '600', lineHeight: '1.4' }}>
          {toast.message}
        </span>
        <span
          className="app-toast-close"
          onClick={onClose}
          style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', opacity: 0.6, transition: 'all 0.15s ease' }}
        >
          ✕
        </span>
        <div style={{
          position: 'absolute', bottom: 0, left: 0, height: '3px',
          backgroundColor: c.border, animation: 'toastShrink 3.5s linear forwards'
        }} />
      </div>
    </>
  );
}