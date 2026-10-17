import React, { useState } from 'react';
import { Wand2, Download } from 'lucide-react';

const ImageWorkspace = ({ token }) => {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setCurrentImage(null);

    try {
      const res = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ prompt })
      });

      if (res.ok) {
        const data = await res.json();
        // Since Pollinations creates the image on request, we can just set the URL and let the browser load it
        setCurrentImage(data.generated_image_url);
      } else {
        const errData = await res.json();
        alert("Failed to generate image: " + (errData.detail || "Unknown error"));
      }
    } catch (err) {
      alert("Network error: " + err.message);
    }
    
    setGenerating(false);
  };

  return (
    <div className="workspace-grid">
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Wand2 size={20} color="var(--accent)" />
          Creation Studio
        </h3>
        
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Cinematic Prompt</label>
          <textarea 
            className="input-field" 
            rows="5"
            placeholder="E.g., A cyberpunk hacker in a neon lit Tokyo alleyway, rain droplets, volumetric fog, dramatic lighting..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            style={{ resize: 'vertical' }}
          ></textarea>
        </div>

        <button 
          className="cinematic-btn" 
          style={{ width: '100%', marginTop: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
          onClick={handleGenerate}
          disabled={generating || !prompt.trim()}
        >
          {generating ? (
            <>
              <div className="loader"></div> Generating...
            </>
          ) : (
            'Generate Masterpiece'
          )}
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Preview</h3>
        <div className="image-preview" style={{ flex: 1 }}>
          {generating && (
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div className="loader" style={{ width: '40px', height: '40px' }}></div>
              <p style={{ color: 'var(--accent)' }}>Synthesizing pixels...</p>
            </div>
          )}
          
          {currentImage && (
            <>
              <img src={currentImage} alt="Generated cinematic portrait" />
              <a 
                href={currentImage} 
                target="_blank"
                rel="noreferrer"
                style={{ position: 'absolute', bottom: '1rem', right: '1rem', background: 'rgba(0,0,0,0.7)', padding: '0.5rem', borderRadius: '50%', color: 'white' }}
              >
                <Download size={20} />
              </a>
            </>
          )}

          {!generating && !currentImage && (
            <p style={{ color: 'var(--text-secondary)', opacity: 0.5 }}>Awaiting inspiration...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageWorkspace;
