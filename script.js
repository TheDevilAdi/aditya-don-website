// script.js - APNA MUSIC Player
const API_KEYS = [
    "AIzaSyAn0lm3Wy1YCMCLrS7iAr2N5eam3h9vStc",  // New API Key 2
    "YOUR_BACKUP_KEY_HERE"  // Backup key agar chahiye to
];

let currentApiKeyIndex = 0;
let player;
let currentSongIndex = 0;
let songs = [];
let isPlaying = false;
let currentTheme = 'dark';

// YouTube Player API
function onYouTubeIframeAPIReady() {
    player = new YT.Player('audioPlayer', {
        height: '0',
        width: '0',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    console.log('YouTube Player Ready');
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        nextSong();
    }
    if (event.data == YT.PlayerState.PLAYING) {
        updateProgressBar();
    }
}

// Theme Management
function toggleTheme() {
    const themeIcon = document.getElementById('themeIcon');
    if (currentTheme === 'dark') {
        document.documentElement.style.setProperty('--bg-primary', '#ffffff');
        document.documentElement.style.setProperty('--text-primary', '#000000');
        document.documentElement.style.setProperty('--bg-secondary', '#f8f9fa');
        themeIcon.className = 'fas fa-sun';
        currentTheme = 'light';
    } else {
        document.documentElement.style.setProperty('--bg-primary', '#0f0f0f');
        document.documentElement.style.setProperty('--text-primary', '#ffffff');
        document.documentElement.style.setProperty('--bg-secondary', '#1a1a1a');
        themeIcon.className = 'fas fa-moon';
        currentTheme = 'dark';
    }
}

// Navigation
function showPage(pageName) {
    document.querySelectorAll('.content-area').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageName + 'Page').classList.add('active');
}

// Login System
function showLogin() {
    document.getElementById('loginModal').style.display = 'flex';
}

function closeLogin() {
    document.getElementById('loginModal').style.display = 'none';
}

function handleLogin(event) {
    event.preventDefault();
    document.getElementById('loginBtn').textContent = 'Welcome!';
    closeLogin();
    showPage('home');
    loadTrendingSongs();
}

function showSignup() {
    alert('Signup feature coming soon!');
}

// Music Functions
async function loadTrendingSongs() {
    const trendingSongs = document.getElementById('trendingSongs');
    trendingSongs.innerHTML = '<div class="loading">Loading trending songs...</div>';
    
    try {
        const query = 'bollywood trending songs 2024';
        const results = await searchYouTube(query);
        
        if (results.length === 0) {
            trendingSongs.innerHTML = '<div class="no-songs">No trending songs found</div>';
            return;
        }
        
        songs = results;
        displaySongs(results, trendingSongs);
    } catch (error) {
        console.error('Error loading trending songs:', error);
        trendingSongs.innerHTML = '<div class="error">Failed to load songs. Please try again.</div>';
    }
}

async function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    if (!query) return;
    
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '<div class="loading">Searching...</div>';
    showPage('search');
    
    try {
        const results = await searchYouTube(query);
        songs = results;
        displaySongs(results, searchResults);
    } catch (error) {
        console.error('Search error:', error);
        searchResults.innerHTML = '<div class="error">Search failed. Please try again.</div>';
    }
}

async function searchYouTube(query) {
    const apiKey = API_KEYS[currentApiKeyIndex];
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(query)}+song&type=video&videoCategoryId=10&key=${apiKey}`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 403) {
                // Quota exceeded, try next API key
                switchToNextApiKey();
                return await searchYouTube(query);
            }
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error('YouTube API Error:', error);
        throw error;
    }
}

function switchToNextApiKey() {
    currentApiKeyIndex = (currentApiKeyIndex + 1) % API_KEYS.length;
    console.log('Switched to API key:', currentApiKeyIndex);
}

function displaySongs(songs, container) {
    if (songs.length === 0) {
        container.innerHTML = '<div class="no-songs">No songs found</div>';
        return;
    }
    
    container.innerHTML = songs.map((song, index) => `
        <div class="song-card" onclick="playSong('${song.id.videoId}', ${index})">
            <div class="song-image">
                <img src="${song.snippet.thumbnails.medium.url}" alt="${song.snippet.title}">
                <div class="play-overlay">
                    <i class="fas fa-play"></i>
                </div>
            </div>
            <div class="song-info">
                <h3 class="song-title">${song.snippet.title}</h3>
                <p class="song-artist">${song.snippet.channelTitle}</p>
            </div>
        </div>
    `).join('');
}

function playSong(videoId, index) {
    currentSongIndex = index;
    const song = songs[index];
    
    document.getElementById('nowPlayingTitle').textContent = song.snippet.title;
    document.getElementById('nowPlayingArtist').textContent = song.snippet.channelTitle;
    
    if (player) {
        player.loadVideoById(videoId);
        player.playVideo();
        isPlaying = true;
        document.getElementById('playIcon').className = 'fas fa-pause';
    }
    
    // Show lyrics container
    document.getElementById('lyricsContainer').style.display = 'block';
    document.getElementById('lyricsContent').innerHTML = `<p>Now playing: <strong>${song.snippet.title}</strong></p>`;
}

function togglePlay() {
    if (!player) return;
    
    if (isPlaying) {
        player.pauseVideo();
        document.getElementById('playIcon').className = 'fas fa-play';
    } else {
        player.playVideo();
        document.getElementById('playIcon').className = 'fas fa-pause';
    }
    isPlaying = !isPlaying;
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    playSong(songs[currentSongIndex].id.videoId, currentSongIndex);
}

function previousSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    playSong(songs[currentSongIndex].id.videoId, currentSongIndex);
}

function updateProgressBar() {
    if (player && isPlaying) {
        const duration = player.getDuration();
        const currentTime = player.getCurrentTime();
        
        document.getElementById('currentTime').textContent = formatTime(currentTime);
        document.getElementById('totalTime').textContent = formatTime(duration);
        
        const progress = (currentTime / duration) * 100;
        document.getElementById('progress').style.width = progress + '%';
        
        setTimeout(updateProgressBar, 1000);
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function seekSong(event) {
    if (!player) return;
    
    const progressBar = event.currentTarget;
    const clickPosition = event.offsetX;
    const progressBarWidth = progressBar.offsetWidth;
    const seekTime = (clickPosition / progressBarWidth) * player.getDuration();
    
    player.seekTo(seekTime, true);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Load trending songs on home page
    loadTrendingSongs();
    
    // Sparkle background effect
    createSparkles();
});

function createSparkles() {
    const sparkleBg = document.getElementById('sparkleBg');
    for (let i = 0; i < 20; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * 100 + 'vw';
        sparkle.style.animationDelay = Math.random() * 5 + 's';
        sparkleBg.appendChild(sparkle);
    }
}

function showPremium() {
    alert('Premium features coming soon! Stay tuned for ad-free listening and offline downloads.');
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('loginModal');
    if (event.target == modal) {
        closeLogin();
    }
}
