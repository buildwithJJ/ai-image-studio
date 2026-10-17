import React, { useState } from 'react';
import { Camera } from 'lucide-react';

const Login = ({ setToken }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login Request
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const res = await fetch('http://localhost:8000/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData
        });
        
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem('token', data.access_token);
          setToken(data.access_token);
        } else {
          setError(data.detail || 'Login failed');
        }
      } else {
        // Register Request
        const res = await fetch('http://localhost:8000/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        
        if (res.ok) {
          setIsLogin(true);
          setError('Registration successful! Please login.');
        } else {
          const data = await res.json();
          setError(data.detail || 'Registration failed');
        }
      }
    } catch (err) {
      setError('Network error. Is the backend running?');
    }
    setLoading(false);
  };

  return (
    <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <Camera size={48} style={{ color: 'var(--accent)', marginBottom: '1rem' }} />
        <h2 style={{ marginBottom: '2rem' }}>AI Cinematic Studio</h2>
        
        {error && <div style={{ color: '#ef4444', marginBottom: '1rem', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Username" 
            className="input-field" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="input-field" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="cinematic-btn" disabled={loading} style={{ marginTop: '1rem' }}>
            {loading ? <div className="loader"></div> : (isLogin ? 'Enter Studio' : 'Create Account')}
          </button>
        </form>

        <p style={{ marginTop: '2rem', color: 'var(--text-secondary)', cursor: 'pointer' }} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Need an account? Register" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

export default Login;
