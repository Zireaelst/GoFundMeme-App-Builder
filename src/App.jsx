import { useState } from 'react'
import './App.css'
import pepeDanceGif from './assets/pepe-dance.gif'
import pepeLogo from './assets/pepe.png'

function App() {
  const [memeUrl, setMemeUrl] = useState('');
  const [message, setMessage] = useState('');
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(false);

  const isValidGofundmemeUrl = (url) => {
    // Validate that the URL is from gofundmeme.io with the expected format
    const regex = /^https:\/\/www\.gofundmeme\.io\/campaigns\/[A-Za-z0-9]{43,44}$/;
    return regex.test(url);
  };

  const handleMemeUpload = async () => {
    if (!memeUrl.trim()) {
      setMessage('Please enter a meme URL.');
      return;
    }

    if (!isValidGofundmemeUrl(memeUrl)) {
      setMessage('Please enter a valid GoFundMeme URL. Example format: https://www.gofundmeme.io/campaigns/qK9GAW3nVzrqmsyY6gC6NL9LXZvcPPG5oXmvCXr9GFM');
      return;
    }

    setLoading(true);
    setMessage(''); // Clear any previous messages
    // Sending meme URL to serverless function
    try {
      const response = await fetch('/.netlify/functions/mintToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memeUrl })
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if(result.success) {
        setMessage('Meme uploaded and token minted successfully!');
        // Add new meme to the list
        setMemes([...memes, { 
          url: memeUrl, 
          likes: 0, 
          timestamp: new Date().toISOString(),
          tokenId: result.data?.tokenId || 'unknown'
        }]);
        // Clear input
        setMemeUrl('');
      } else {
        setMessage('Error: ' + (result.error || 'Unknown error occurred'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('Upload failed: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (index) => {
    const updatedMemes = [...memes];
    updatedMemes[index].likes += 1;
    setMemes(updatedMemes);
  };

  return (
    <div className="container">
      <header className="app-header">
        <img src={pepeDanceGif} alt="Pepe Logo" className="pepe-logo" />
        <h1>Meme Vault</h1>
        <p className="tagline">Share memes, earn tokens!</p>
      </header>

      <div className="upload-section">
        <input 
          type="text" 
          placeholder="Enter GoFundMeme URL (https://www.gofundmeme.io/campaigns/...)" 
          value={memeUrl}
          onChange={(e) => setMemeUrl(e.target.value)} 
          className="url-input"
          disabled={loading}
        />
        <button 
          onClick={handleMemeUpload}
          className="upload-button"
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload Meme'}
        </button>
      </div>

      {message && <div className="message">{message}</div>}

      <div className="memes-grid">
        {memes.map((meme, index) => (
          <div key={index} className="meme-card">
            <img src={meme.url} alt="Meme" className="meme-image" />
            <div className="meme-info">
              <button 
                className="like-button" 
                onClick={() => handleLike(index)}
              >
                👍 <span className="like-count">{meme.likes}</span> Likes
              </button>
              <div className="token-info">
                Token ID: {meme.tokenId.substring(0, 8)}...
              </div>
            </div>
          </div>
        ))}
      </div>

      {memes.length === 0 && (
        <div className="no-memes">
          <img src={pepeLogo} alt="Pepe" />
          <p>No memes uploaded yet. Be the first to share a meme!</p>
        </div>
      )}
    </div>
  )
}

export default App
