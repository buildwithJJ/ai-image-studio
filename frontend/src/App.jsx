import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './components/Login';
import ImageWorkspace from './components/ImageWorkspace';
import HistoryGallery from './components/HistoryGallery';
import { Camera, LogOut } from 'lucide-react';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <Router>
      <div className="app-container">
        <header className="nav-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Camera size={32} color="var(--accent)" />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.5px' }}>
              Cinematic<span style={{ color: 'var(--accent)' }}>Studio</span>
            </h1>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <nav className="nav-links">
              <Link to="/">Studio</Link>
              <Link to="/history">Gallery</Link>
            </nav>
            <button 
              onClick={handleLogout}
              style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<ImageWorkspace token={token} />} />
            <Route path="/history" element={<HistoryGallery token={token} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
