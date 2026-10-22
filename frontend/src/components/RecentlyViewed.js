import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function RecentlyViewed({ userId }) {
  const [recentSchemes, setRecentSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  const govTheme = {
    primaryBlue: '#003366',
    accentOrange: '#E65100',
    textGray: '#5F6368',
    bgLight: '#F0F4F9'
  };

  useEffect(() => {
    if (userId) {
      fetchRecentlyViewed();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchRecentlyViewed = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/recently-viewed/${userId}`);
      const data = await response.json();
      setRecentSchemes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log('Error fetching recently viewed:', err);
      setRecentSchemes([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading || recentSchemes.length === 0) {
    return null;
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '30px auto', padding: '0 20px' }}>
      <style>{`
        .recent-card { transition: all 0.3s ease; }
        .recent-card:hover { transform: translateY(-6px); box-shadow: 0 12px 28px rgba(0,0,0,0.12) !important; }
      `}</style>

      <h3 style={{
        color: govTheme.primaryBlue,
        fontSize: '1.3rem',
        fontWeight: '700',
        marginBottom: '18px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        🕐 Recently Viewed
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px'
      }}>
        {recentSchemes.map((scheme) => (
          <Link
            key={scheme.id}
            to={`/scheme/${scheme.id}`}
            className="recent-card"
            style={{
              display: 'block',
              backgroundColor: 'white',
              borderRadius: '14px',
              padding: '18px',
              textDecoration: 'none',
              boxShadow: '0 3px 12px rgba(0,0,0,0.06)',
              borderLeft: `4px solid ${govTheme.accentOrange}`
            }}
          >
            <span style={{
              display: 'inline-block',
              backgroundColor: '#E3F2FD',
              color: govTheme.primaryBlue,
              padding: '3px 10px',
              borderRadius: '12px',
              fontSize: '0.7rem',
              fontWeight: '700',
              marginBottom: '8px'
            }}>
              {scheme.category}
            </span>
            <h4 style={{
              color: govTheme.primaryBlue,
              fontSize: '0.95rem',
              fontWeight: '700',
              marginBottom: '6px',
              lineHeight: '1.4'
            }}>
              {scheme.name}
            </h4>
            <p style={{ color: govTheme.textGray, fontSize: '0.78rem' }}>
              {scheme.ministry}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default RecentlyViewed;
