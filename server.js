const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

const JIOSAAVN_API = "https://saavn.me";

// Search Songs
app.get('/api/search', async (req, res) => {
    try {
        const query = req.query.q;
        
        const response = await fetch(`${JIOSAAVN_API}/search/songs?query=${query}&page=1&limit=15`);
        const data = await response.json();
        
        if (data.data && data.data.results) {
            const songs = data.data.results.map(song => ({
                id: { videoId: song.id },
                snippet: {
                    title: song.name,
                    channelTitle: song.primaryArtists || "Unknown Artist",
                    thumbnails: {
                        medium: { url: song.image[2].link || song.image[1].link }
                    }
                }
            }));
            res.json(songs);
        } else {
            res.json([]);
        }
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: "Server error" });
    }
});

// Trending Songs
app.get('/api/trending', async (req, res) => {
    try {
        const response = await fetch(`${JIOSAAVN_API}/search/songs?query=trending&page=1&limit=15`);
        const data = await response.json();
        
        if (data.data && data.data.results) {
            const songs = data.data.results.map(song => ({
                id: { videoId: song.id },
                snippet: {
                    title: song.name,
                    channelTitle: song.primaryArtists || "Unknown Artist",
                    thumbnails: {
                        medium: { url: song.image[2].link || song.image[1].link }
                    }
                }
            }));
            res.json(songs);
        } else {
            res.json([]);
        }
    } catch (error) {
        console.error('Trending error:', error);
        res.status(500).json({ error: "Server error" });
    }
});

// Health Check
app.get('/', (req, res) => {
    res.json({ message: 'APNA MUSIC Backend with JioSaavn API!' });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🎵 APNA MUSIC Backend running on port ${PORT}`);
});
