const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

// Working Music API - No restrictions
const MUSIC_API = "https://itunes.apple.com";

app.get('/api/search', async (req, res) => {
    try {
        const query = req.query.q;
        const response = await fetch(`${MUSIC_API}/search?term=${encodeURIComponent(query)}&media=music&limit=15`);
        const data = await response.json();
        
        const songs = data.results.map(track => ({
            id: { videoId: track.trackId || track.collectionId },
            snippet: {
                title: track.trackName || track.collectionName,
                channelTitle: track.artistName,
                thumbnails: {
                    medium: { url: track.artworkUrl100 || track.artworkUrl60 }
                }
            }
        }));
        
        res.json(songs);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: "Server error" });
    }
});

app.get('/api/trending', async (req, res) => {
    try {
        const response = await fetch(`${MUSIC_API}/search?term=bollywood&media=music&limit=15`);
        const data = await response.json();
        
        const songs = data.results.map(track => ({
            id: { videoId: track.trackId || track.collectionId },
            snippet: {
                title: track.trackName || track.collectionName,
                channelTitle: track.artistName,
                thumbnails: {
                    medium: { url: track.artworkUrl100 || track.artworkUrl60 }
                }
            }
        }));
        
        res.json(songs);
    } catch (error) {
        console.error('Trending error:', error);
        res.status(500).json({ error: "Server error" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🎵 APNA MUSIC Backend running on port ${PORT}`);
});
