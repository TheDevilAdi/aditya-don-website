const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

// API Keys - YAHAN APNI KEYS DALDO
const API_KEYS = [
    "AIzaSyB2uQcXxBMyTmEw_ePWdV4cl7VFVo6ib3M",  // Naya key
    "AIzaSyAn0lm3Wy1YCMCLrS7iAr2N5eam3h9vStc"   // Purana key
];

let currentApiKeyIndex = 0;

// Search API
app.get('/api/search', async (req, res) => {
    try {
        const query = req.query.q;
        const apiKey = API_KEYS[currentApiKeyIndex];
        
        console.log('Searching for:', query);
        console.log('Using API key:', currentApiKeyIndex);
        
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(query)}+song&type=video&videoCategoryId=10&key=${apiKey}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.error) {
            // Switch to next API key if current fails
            currentApiKeyIndex = (currentApiKeyIndex + 1) % API_KEYS.length;
            return res.status(400).json({ error: "API key issue" });
        }
        
        res.json(data.items || []);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: "Server error" });
    }
});

// Trending Songs API
app.get('/api/trending', async (req, res) => {
    try {
        const apiKey = API_KEYS[currentApiKeyIndex];
        
        console.log('Loading trending songs');
        console.log('Using API key:', currentApiKeyIndex);
        
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=bollywood+trending+songs+2024&type=video&videoCategoryId=10&key=${apiKey}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.error) {
            currentApiKeyIndex = (currentApiKeyIndex + 1) % API_KEYS.length;
            return res.status(400).json({ error: "API key issue" });
        }
        
        res.json(data.items || []);
    } catch (error) {
        console.error('Trending songs error:', error);
        res.status(500).json({ error: "Server error" });
    }
});

// Health Check
app.get('/', (req, res) => {
    res.json({ message: 'APNA MUSIC Backend is running!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🎵 APNA MUSIC Backend running on port ${PORT}`);
    console.log(`🔑 Using API key: ${currentApiKeyIndex}`);
});
