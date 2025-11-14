// YouTube API Configuration
const YOUTUBE_API_KEY = 'AIzaSyBe358vzxK0I5xUcAYGYMAjWH9CyGIv2sk';

// Create sparkle background
function createSparkles() {
    const sparkleBg = document.getElementById('sparkleBg');
    for (let i = 0; i < 50; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animationDelay = Math.random() * 3 + 's';
        sparkleBg.appendChild(sparkle);
    }
}

// Global Variables
let currentSongIndex = 0;
let currentYouTubeResults = [];
let player = null;
let userInteracted = false;

// DOM elements
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

// Initialize the app
function init() {
    createSparkles();
    loadTrendingSongs();
    setupEventListeners();

    // Detect first user interaction for autoplay
    document.addEventListener('click', () => {
        userInteracted = true;
    }, { once: true });
}

// Load trending songs from YouTube
async function loadTrendingSongs() {
    try {
        trendingSongsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary)">Loading trending songs...</div>';
        
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=trending%20songs%202024%20bollywood&type=video&key=${YOUTUBE_API_KEY}`);
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            currentYouTubeResults = data.items;
            displayYouTubeSongs(data.items);
        } else {
            trendingSongsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary)">No trending songs found</div>';
        }
    } catch (error) {
        console.error('Error loading trending songs:', error);
        trendingSongsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary)">Failed to load songs</div>';
    }
}

// Display YouTube songs
function displayYouTubeSongs(videos) {
    trendingSongsGrid.innerHTML = '';
    videos.forEach((video, index) => {
        const songCard = createYouTubeSongCard(video, index);
        trendingSongsGrid.appendChild(songCard);
    });
}

// Create YouTube song card
function createYouTubeSongCard(video, index) {
    const card = document.createElement('div');
    card.className = 'song-card';
    card.innerHTML = `
        <div class="song-image">
            <img src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title}" style="width: 100%; height: 100%; border-radius: 4px; object-fit: cover;">
        </div>
        <div class="song-title">${video.snippet.title}</div>
        <div class="song-artist">${video.snippet.channelTitle}</div>
    `;
    card.addEventListener('click', () => playYouTubeSong(video, index));
    return card;
}

// Play YouTube song using IFrame API
function playYouTubeSong(video, index) {
    currentSongIndex = index;

    // Add glow effect
    musicPlayer.style.background = 'linear-gradient(90deg, #8B5CF6, #EC4899)';
    musicPlayer.style.boxShadow = '0 0 30px rgba(139, 92, 246, 0.7)';

    // Update UI
    nowPlayingTitle.textContent = video.snippet.title;
    nowPlayingArtist.textContent = video.snippet.channelTitle;
    musicPlayer.classList.add('active');
    lyricsContainer.classList.add('active');

    lyricsContent.innerHTML = `<div style="text-align: center; color: var(--primary); font-size: 18px;">
        <i class="fas fa-music"></i><br>
        Now Playing: ${video.snippet.title}<br>
        <small>Click play button to start</small>
    </div>`;

    // Initialize or load video in player
    if (!player) {
        player = new YT.Player('audioPlayer', {
            height: '0',
            width: '0',
            videoId: video.id.videoId,
            events: {
                'onReady': (event) => { if(userInteracted) event.target.playVideo(); },
                'onStateChange': onPlayerStateChange
            }
        });
    } else {
        player.loadVideoById(video.id.videoId);
        if(userInteracted) player.playVideo();
    }

    playIcon.className = 'fas fa-pause';
}

// Handle player state change
function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        nextSong();
    }
}

// Search YouTube music
async function searchYouTubeMusic(query) {
    try {
        trendingSongsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary)">Searching...</div>';
        
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(query + ' song official music')}&type=video&key=${YOUTUBE_API_KEY}`);
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            currentYouTubeResults = data.items;
            displayYouTubeSongs(data.items);
        } else {
            trendingSongsGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary)">No songs found for "${query}"</div>`;
        }
    } catch (error) {
        console.error('Search error:', error);
        trendingSongsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: red;">Search failed. Try again.</div>';
    }
}

// Play/Pause toggle
function togglePlay() {
    if (!player) return;
    const state = player.getPlayerState();
    if (state === YT.PlayerState.PLAYING) {
        player.pauseVideo();
        playIcon.className = 'fas fa-play';
    } else {
        player.playVideo();
        playIcon.className = 'fas fa-pause';
    }
}

// Next song
function nextSong() {
    if (!currentYouTubeResults.length) return;
    currentSongIndex = (currentSongIndex + 1) % currentYouTubeResults.length;
    playYouTubeSong(currentYouTubeResults[currentSongIndex], currentSongIndex);
}

// Previous song
function previousSong() {
    if (!currentYouTubeResults.length) return;
    currentSongIndex = (currentSongIndex - 1 + currentYouTubeResults.length) % currentYouTubeResults.length;
    playYouTubeSong(currentYouTubeResults[currentSongIndex], currentSongIndex);
}

// Show page
function showPage(page) {
    homePage.style.display = 'none';
    profilePage.style.display = 'none';
    
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    if (page === 'home') {
        homePage.style.display = 'block';
        loadTrendingSongs();
    } else if (page === 'profile') {
        profilePage.style.display = 'block';
        profilePage.classList.add('active');
    } else if (page === 'search') {
        homePage.style.display = 'block';
    } else if (page === 'library') {
        homePage.style.display = 'block';
        loadTrendingSongs();
    }
}

// Toggle theme
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    themeIcon.className = document.body.classList.contains('light-theme') ? 'fas fa-sun' : 'fas fa-moon';
}

// Setup event listeners
function setupEventListeners() {
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.trim();
        if (query === '') loadTrendingSongs();
        else searchYouTubeMusic(query);
    });

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchYouTubeMusic(searchInput.value.trim());
            this.blur();
        }
    });

    playBtn.addEventListener('click', togglePlay);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);
