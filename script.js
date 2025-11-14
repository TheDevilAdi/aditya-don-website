// BACKEND URL - YAHAN APNA BACKEND URL DALDO
const BACKEND_URL = "https://apna-music-backend.onrender.com";

// UPDATED SEARCH FUNCTION
async function searchYouTube(query) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Search error:', error);
        throw error;
    }
}

// UPDATED TRENDING FUNCTION
async function loadTrendingSongs() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/trending`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Trending songs error:', error);
        throw error;
    }
}
