// ---------- script.js (FINAL) ----------

// ====== IMPORTANT ======
// Replace the placeholder below with your NEW API key LOCALLY.
// Do NOT commit the actual key to GitHub or share it publicly.
// Delete the old leaked key from Google Cloud Console immediately.
const YOUTUBE_API_KEY = 'YOUR_API_KEY_HERE';

// Create sparkle background
function createSparkles() {
    const sparkleBg = document.getElementById('sparkleBg');
    if (!sparkleBg) return;
    sparkleBg.innerHTML = '';
    for (let i = 0; i < 50; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animationDelay = Math.random() * 3 + 's';
        sparkleBg.appendChild(sparkle);
    }
}

// Fallback sample songs (shown when API fails)
const fallbackSongs = [
    {
        id: { videoId: 'kJQP7kiw5Fk' },
        snippet: { title: 'Sample Song 1 (Demo)', channelTitle: 'Demo Channel', thumbnails: { medium: { url: 'https://via.placeholder.com/320x180?text=Demo+1' } } }
    },
    {
        id: { videoId: '3JZ4pnNtyxQ' },
        snippet: { title: 'Sample Song 2 (Demo)', channelTitle: 'Demo Channel', thumbnails: { medium: { url: 'https://via.placeholder.com/320x180?text=Demo+2' } } }
    },
    {
        id: { videoId: 'fRh_vgS2dFE' },
        snippet: { title: 'Sample Song 3 (Demo)', channelTitle: 'Demo Channel', thumbnails: { medium: { url: 'https://via.placeholder.com/320x180?text=Demo+3' } } }
    }
];

// Globals
let currentSongIndex = 0;
let currentYouTubeResults = [];
let player = null;
let userInteracted = false;

// Safe DOM grabs
const trendingSongsGrid = document.getElementById('trendingSongs');
const musicPlayer = document.getElementById('musicPlayer');
const nowPlayingTitle = document.getElementById('nowPlayingTitle');
const nowPlayingArtist = document.getElementById('nowPlayingArtist');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const searchInput = document.getElementById('searchInput');
const lyricsContainer = document.getElementById('lyricsContainer');
const lyricsContent = document.getElementById('lyricsContent');
const homePage = document.getElementById('homePage');
const profilePage = document.getElementById('profilePage');
const themeIcon = document.getElementById('themeIcon');

// Init
function init() {
    createSparkles();
    setupEventListeners();

    // For autoplay policy: detect first real user interaction
    document.addEventListener('click', () => { userInteracted = true; }, { once: true });

    loadTrendingSongs();
}

// Load trending songs with robust error handling
async function loadTrendingSongs() {
    if (!trendingSongsGrid) return;
    trendingSongsGrid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;">Loading trending songs...</div>';

    try {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=trending%20songs%202024%20bollywood&type=video&key=${YOUTUBE_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.error) {
            // Show friendly message and fallback
            alert('YouTube API error: ' + (data.error.message || JSON.stringify(data.error)));
            console.error('YouTube API error:', data);
            currentYouTubeResults = fallbackSongs;
            displayYouTubeSongs(currentYouTubeResults, true);
            return;
        }

        if (data.items && data.items.length) {
            currentYouTubeResults = data.items;
            displayYouTubeSongs(data.items);
        } else {
            // No items -> fallback
            trendingSongsGrid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;">No songs from API. Showing demo songs.</div>';
            currentYouTubeResults = fallbackSongs;
            displayYouTubeSongs(currentYouTubeResults, true);
        }
    } catch (err) {
        console.error('Fetch error:', err);
        alert('Network/API fetch failed. Showing demo songs.');
        currentYouTubeResults = fallbackSongs;
        displayYouTubeSongs(currentYouTubeResults, true);
    }
}

// Display songs grid
function displayYouTubeSongs(videos, isFallback = false) {
    if (!trendingSongsGrid) return;
    trendingSongsGrid.innerHTML = '';
    videos.forEach((video, index) => {
        const card = createYouTubeSongCard(video, index);
        trendingSongsGrid.appendChild(card);
    });
}

// Create a song card
function createYouTubeSongCard(video, index) {
    const card = document.createElement('div');
    card.className = 'song-card';
    const thumb = (video.snippet && video.snippet.thumbnails && video.snippet.thumbnails.medium && video.snippet.thumbnails.medium.url) || 'https://via.placeholder.com/320x180?text=No+Image';
    const title = (video.snippet && video.snippet.title) || 'Unknown Title';
    const channel = (video.snippet && video.snippet.channelTitle) || 'Unknown Artist';
    card.innerHTML = `
        <div class="song-image">
            <img src="${thumb}" alt="${title}" style="width:100%;height:100%;border-radius:4px;object-fit:cover;">
        </div>
        <div class="song-title">${title}</div>
        <div class="song-artist">${channel}</div>
    `;
    card.addEventListener('click', () => playYouTubeSong(video, index));
    return card;
}

// Play a song via YouTube IFrame API
function playYouTubeSong(video, index) {
    currentSongIndex = index;

    if (musicPlayer) {
        musicPlayer.style.background = 'linear-gradient(90deg, #8B5CF6, #EC4899)';
        musicPlayer.style.boxShadow = '0 0 30px rgba(139,92,246,0.7)';
        musicPlayer.classList.add('active');
    }
    if (lyricsContainer) lyricsContainer.classList.add('active');

    const title = (video.snippet && video.snippet.title) || 'Unknown';
    const channel = (video.snippet && video.snippet.channelTitle) || '';
    if (nowPlayingTitle) nowPlayingTitle.textContent = title;
    if (nowPlayingArtist) nowPlayingArtist.textContent = channel;

    // normalize video id
    const vid = (video.id && video.id.videoId) || video.videoId || null;
    if (!vid) { alert('Cannot play this item (no videoId).'); return; }

    if (!player) {
        try {
            player = new YT.Player('audioPlayer', {
                height: '0',
                width: '0',
                videoId: vid,
                playerVars: { 'playsinline': 1 },
                events: {
                    'onReady': (e) => {
                        if (userInteracted) e.target.playVideo();
                        else if (lyricsContent) lyricsContent.innerHTML = '<div style="text-align:center;color:var(--primary);">Tap anywhere or press play to start audio.</div>';
                    },
                    'onStateChange': onPlayerStateChange
                }
            });
        } catch (e) {
            console.error('YT Player init error', e);
            alert('Player init failed. Refresh and try again.');
            return;
        }
    } else {
        try {
            player.loadVideoById(vid);
            if (userInteracted) player.playVideo();
        } catch (e) {
            console.error('player.loadVideoById failed', e);
            alert('Unable to play the video. Try again.');
        }
    }

    if (playIcon) playIcon.className = 'fas fa-pause';
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) nextSong();
}

// Search with same error handling
async function searchYouTubeMusic(query) {
    if (!trendingSongsGrid) return;
    trendingSongsGrid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;">Searching...</div>';
    try {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(query + ' song official music')}&type=video&key=${YOUTUBE_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.error) {
            alert('YouTube API error: ' + (data.error.message || JSON.stringify(data.error)));
            console.error('YouTube API error:', data);
            currentYouTubeResults = fallbackSongs;
            displayYouTubeSongs(currentYouTubeResults, true);
            return;
        }
        if (data.items && data.items.length) {
            currentYouTubeResults = data.items;
            displayYouTubeSongs(data.items);
        } else {
            trendingSongsGrid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;">No results. Showing demo songs.</div>';
            currentYouTubeResults = fallbackSongs;
            displayYouTubeSongs(currentYouTubeResults, true);
        }
    } catch (err) {
        console.error('Search fetch error', err);
        alert('Search failed (network). Showing demo songs.');
        currentYouTubeResults = fallbackSongs;
        displayYouTubeSongs(currentYouTubeResults, true);
    }
}

// Play/pause toggle
function togglePlay() {
    if (!player) return;
    const state = player.getPlayerState();
    if (state === YT.PlayerState.PLAYING) {
        player.pauseVideo();
        if (playIcon) playIcon.className = 'fas fa-play';
    } else {
        player.playVideo();
        if (playIcon) playIcon.className = 'fas fa-pause';
    }
}

function nextSong() {
    if (!currentYouTubeResults.length) return;
    currentSongIndex = (currentSongIndex + 1) % currentYouTubeResults.length;
    playYouTubeSong(currentYouTubeResults[currentSongIndex]);
}
function previousSong() {
    if (!currentYouTubeResults.length) return;
    currentSongIndex = (currentSongIndex - 1 + currentYouTubeResults.length) % currentYouTubeResults.length;
    playYouTubeSong(currentYouTubeResults[currentSongIndex]);
}

// Seek (UI) - uses player.seekTo if available
function seekSong(event) {
    if (!player) return;
    const progressBar = event.currentTarget;
    const clickPosition = event.offsetX;
    const progressBarWidth = progressBar.offsetWidth;
    const percentage = clickPosition / progressBarWidth;
    const duration = player.getDuration ? player.getDuration() : 0;
    if (duration > 0) {
        const sec = percentage * duration;
        player.seekTo(sec, true);
    }
}

// Navigation and theme
function showPage(page) {
    if (homePage) homePage.style.display = 'none';
    if (profilePage) profilePage.style.display = 'none';
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    try { event.currentTarget.classList.add('active'); } catch(e) {}
    if (page === 'home') { if (homePage) homePage.style.display = 'block'; loadTrendingSongs(); }
    else if (page === 'profile') { if (profilePage) profilePage.style.display = 'block'; }
    else if (page === 'search') { if (homePage) homePage.style.display = 'block'; }
    else if (page === 'library') { if (homePage) homePage.style.display = 'block'; loadTrendingSongs(); }
}
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    if (themeIcon) themeIcon.className = document.body.classList.contains('light-theme') ? 'fas fa-sun' : 'fas fa-moon';
}

// Event listeners
function setupEventListeners() {
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const q = e.target.value.trim();
            if (q === '') loadTrendingSongs();
            else searchYouTubeMusic(q);
        });
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchYouTubeMusic(searchInput.value.trim());
                this.blur();
            }
        });
    }
    if (playBtn) playBtn.addEventListener('click', togglePlay);
}

// DOM ready
document.addEventListener('DOMContentLoaded', init);
