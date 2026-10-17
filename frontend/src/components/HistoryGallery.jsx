import React, { useState, useEffect } from 'react';
import { History } from 'lucide-react';

const HistoryGallery = ({ token }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('http://localhost:8000/history', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        }
      } catch (err) {
        console.error("Failed to fetch history");
      }
      setLoading(false);
    };

    fetchHistory();
  }, [token]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}><div className="loader"></div></div>;
  }

  if (history.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
        <History size={48} style={{ color: 'var(--text-secondary)', opacity: 0.5, margin: '0 auto 1rem' }} />
        <h3 style={{ color: 'var(--text-secondary)' }}>No creations yet</h3>
        <p style={{ opacity: 0.5 }}>Head over to the Studio to generate your first cinematic portrait.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <History size={24} color="var(--accent)" />
        Your Gallery
      </h2>
      <div className="gallery-grid">
        {history.map((item) => (
          <div key={item.id} className="gallery-item glass-panel" style={{ padding: 0 }}>
            <img src={item.generated_image_url} alt={item.prompt} loading="lazy" />
            <div className="gallery-overlay">
              <p style={{ fontSize: '0.875rem', lineHeight: '1.4', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                {item.prompt}
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--accent)', marginTop: '0.5rem' }}>
                {new Date(item.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryGallery;
