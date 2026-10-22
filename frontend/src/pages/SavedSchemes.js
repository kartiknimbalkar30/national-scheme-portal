import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBookmark, FaArrowLeft, FaTrashAlt, FaExternalLinkAlt, FaFolderOpen, FaBuilding } from 'react-icons/fa';

function SavedSchemes() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    fetchSavedSchemes();
  }, []);

  const fetchSavedSchemes = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        window.location.href = '/login';
        return;
      }
      const response = await fetch(`http://localhost:5000/api/saved/${user.id}`);
      const data = await response.json();
      setSchemes(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const removeScheme = async (schemeId) => {
    if (!window.confirm('Are you sure you want to remove this scheme from saved list?')) {
      return;
    }
    setRemovingId(schemeId);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(`http://localhost:5000/api/saved/${schemeId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id })
      });
      const data = await response.json();
      if (response.ok) {
        setSchemes(schemes.filter(s => s.id !== schemeId));
      } else {
        alert(data.message || 'Failed to remove scheme');
      }
    } catch (error) {
      alert('Something went wrong!');
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px'
      }}>
        <div style={{
          width: '48px', height: '48px',
          border: '4px solid #E2E8F0',
          borderTopColor: '#EA580C',
          borderRadius: '50%',
          animation: 'savedSpin 0.8s linear infinite'
        }} />
        <style>{`@keyframes savedSpin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: '#64748B', fontWeight: '600', fontSize: '0.95rem' }}>Loading saved schemes...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', padding: '36px 20px 80px', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <style>{`
        .saved-grid-item {
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          animation: savedFadeIn 0.3s ease-out;
        }
        .saved-grid-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(11, 37, 69, 0.12) !important;
          border-color: #BFDBFE !important;
        }
        .btn-view-scheme:hover {
          background: #2563EB !important;
          transform: translateY(-1px);
        }
        .btn-remove-scheme:hover {
          background: #FEE2E2 !important;
          border-color: #FECACA !important;
        }
        @keyframes savedFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* EXECUTIVE HEADER */}
        <div style={{
          background: 'linear-gradient(135deg, #0B2545 0%, #153E75 100%)',
          borderRadius: '20px',
          padding: '32px 36px',
          color: '#FFFFFF',
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: '0 10px 30px rgba(11, 37, 69, 0.18)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(234, 88, 12, 0.9)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800', marginBottom: '10px' }}>
              <FaBookmark /> CITIZEN BOOKMARKS
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: '800', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
              Saved Schemes
            </h1>
            <p style={{ margin: 0, color: '#CBD5E1', fontSize: '0.9375rem' }}>
              You have bookmarked <strong>{schemes.length}</strong> government welfare scheme{schemes.length !== 1 ? 's' : ''}
            </p>
          </div>

          <Link to="/dashboard" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#FFFFFF',
            color: '#0B2545',
            padding: '11px 22px',
            borderRadius: '10px',
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '0.875rem',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease'
          }}>
            <FaArrowLeft /> Back to Dashboard
          </Link>
        </div>

        {/* CONTENT */}
        {schemes.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '70px 30px',
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1.5px dashed #CBD5E1',
            boxShadow: '0 4px 16px rgba(11, 37, 69, 0.04)'
          }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: '#EFF6FF', color: '#2563EB',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', margin: '0 auto 18px'
            }}>
              <FaFolderOpen />
            </div>
            <h2 style={{ color: '#0B2545', fontSize: '1.35rem', fontWeight: '800', margin: '0 0 8px' }}>
              No Saved Schemes Yet
            </h2>
            <p style={{ color: '#64748B', maxWidth: '440px', margin: '0 auto 24px', lineHeight: '1.6', fontSize: '0.92rem' }}>
              Explore eligible schemes on your citizen dashboard and click the bookmark icon to save them here for quick access.
            </p>
            <Link to="/dashboard" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #EA580C, #D97706)',
              color: '#FFFFFF',
              padding: '12px 28px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: '700',
              fontSize: '0.95rem',
              boxShadow: '0 4px 16px rgba(234, 88, 12, 0.3)'
            }}>
              Explore Matched Schemes
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '24px'
          }}>
            {schemes.map((scheme) => (
              <div key={scheme.id} className="saved-grid-item" style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '24px',
                border: '1.5px solid #E2E8F0',
                boxShadow: '0 2px 8px rgba(11, 37, 69, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <span style={{
                    display: 'inline-block',
                    backgroundColor: '#EFF6FF',
                    color: '#2563EB',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    marginBottom: '12px'
                  }}>
                    {scheme.category}
                  </span>

                  <h3 style={{
                    color: '#0B2545',
                    fontSize: '1.15rem',
                    fontWeight: '800',
                    margin: '0 0 8px',
                    lineHeight: '1.4'
                  }}>
                    {scheme.name}
                  </h3>

                  {scheme.ministry && (
                    <p style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#64748B',
                      fontSize: '0.8125rem',
                      margin: '0 0 12px',
                      fontWeight: '500'
                    }}>
                      <FaBuilding style={{ color: '#94A3B8' }} /> {scheme.ministry}
                    </p>
                  )}

                  <p style={{
                    color: '#475569',
                    fontSize: '0.875rem',
                    lineHeight: '1.6',
                    margin: '0 0 20px'
                  }}>
                    {scheme.description ? `${scheme.description.substring(0, 110)}...` : ''}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px', paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
                  <Link
                    to={`/scheme/${scheme.id}`}
                    className="btn-view-scheme"
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      backgroundColor: '#0B2545',
                      color: '#FFFFFF',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <FaExternalLinkAlt style={{ fontSize: '0.75rem' }} /> Details
                  </Link>

                  <button
                    onClick={() => removeScheme(scheme.id)}
                    disabled={removingId === scheme.id}
                    className="btn-remove-scheme"
                    style={{
                      backgroundColor: '#FFFFFF',
                      color: '#DC2626',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #FEE2E2',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      cursor: removingId === scheme.id ? 'not-allowed' : 'pointer',
                      opacity: removingId === scheme.id ? 0.6 : 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <FaTrashAlt style={{ fontSize: '0.8rem' }} />
                    {removingId === scheme.id ? '...' : 'Remove'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SavedSchemes;