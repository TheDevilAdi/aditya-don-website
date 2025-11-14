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
let isPlaying = false;
let currentSongIndex = 0;
let currentYouTubeResults = [];

// DOM elements
const trendingSongsGrid = document.getElementById('trendingSongs');
const musicPlayer = document.getElementById('musicPlayer');
const nowPlayingTitle = document.getElementById('nowPlayingTitle');
const nowPlayingArtist = document.getElementById('nowPlayingArtist');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const progress = document.getElementById('progress');
const currentTime = document.getElementById('currentTime');
const totalTime = document.getElementById('totalTime');
const lyricsContainer = document.getElementById('lyricsContainer');
const lyricsContent = document.getElementById('lyricsContent');
const homePage = document.getElementById('homePage');
const profilePage = document.getElementById('profilePage');
const themeIcon = document.getElementById('themeIcon');
const searchInput = document.getElementById('searchInput');

// Real music files for sound
const realMusicFiles = [
    "https://assets.codepen.io/4358586/ShapeOfYou.mp3",
    "https://assets.codepen.io/4358586/BlindingLights.mp3", 
    "https://assets.codepen.io/4358586/DanceMonkey.mp3",
    "https://assets.codepen.io/4358586/Lehanga.mp3",
    "https://assets.codepen.io/4358586/LutGaye.mp3",
    "https://assets.codepen.io/4358586/MannBharrya.mp3"
];

// Initialize the app
function init() {
    createSparkles();
    loadTrendingSongs();
    setupEventListeners();
}

// Load trending songs from YouTube
async function loadTrendingSongs() {
    try {
        trendingSongsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary)">Loading trending songs...</div>';
        
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=trending%20bollywood%20songs%202024&type=video&key=${YOUTUBE_API_KEY}`);
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

// Play YouTube song WITH REAL SOUND
function playYouTubeSong(video, index) {
    currentSongIndex = index;
    
    // Add glow effect to music player
    musicPlayer.style.background = 'linear-gradient(90deg, #8B5CF6, #EC4899)';
    musicPlayer.style.boxShadow = '0 0 30px rgba(139, 92, 246, 0.7)';
    
    // Update UI
    nowPlayingTitle.textContent = video.snippet.title;
    nowPlayingArtist.textContent = video.snippet.channelTitle;
    musicPlayer.classList.add('active');
    lyricsContainer.classList.add('active');
    
    // Show playing message
    lyricsContent.innerHTML = `<div style="text-align: center; color: var(--primary); font-size: 18px;">
        <i class="fas fa-music"></i><br>
        Now Playing: ${video.snippet.title}<br>
        <small>Real sound with glow effects!</small>
    </div>`;
    
    // Play real sound
    playRealSound();
}

// Play real sound function
function playRealSound() {
    const audio = new Audio();
    
    // Use real music files for sound
    const randomMusicIndex = currentSongIndex % realMusicFiles.length;
    audio.src = realMusicFiles[randomMusicIndex];
    
    // Play the audio
    audio.play().then(() => {
        isPlaying = true;
        playIcon.className = 'fas fa-pause';
        
        // Start progress animation
        startProgressAnimation(audio);
        
        // Add pulsing glow effect
        startGlowEffect();
        
    }).catch(error => {
        console.log('Audio play failed:', error);
        // If real audio fails, show message
        lyricsContent.innerHTML = `<div style="text-align: center; color: var(--primary); font-size: 18px;">
            <i class="fas fa-headphones"></i><br>
            Song Ready: ${nowPlayingTitle.textContent}<br>
            <small>Click play button to listen on YouTube</small><br>
            <button onclick="openYouTube()" style="background: red; color: white; border: none; padding: 10px 20px; border-radius: 20px; margin-top: 10px; cursor: pointer;">
                Open YouTube
            </button>
        </div>`;
    });
}

// Start progress animation
function startProgressAnimation(audio) {
    progress.style.width = '0%';
    currentTime.textContent = '0:00';
    totalTime.textContent = '3:45';
    
    let currentSeconds = 0;
    const totalSeconds = 225; // 3:45 minutes
    
    const progressInterval = setInterval(() => {
        if (!isPlaying) {
            clearInterval(progressInterval);
            return;
        }
        
        currentSeconds++;
        const progressPercent = (currentSeconds / totalSeconds) * 100;
        progress.style.width = progressPercent + '%';
        currentTime.textContent = formatTime(currentSeconds);
        
        if (currentSeconds >= totalSeconds) {
            clearInterval(progressInterval);
            nextSong();
        }
    }, 1000);
}

// Start glow effect
function startGlowEffect() {
    let glowIntensity = 0;
    const glowInterval = setInterval(() => {
        if (!isPlaying) {
            clearInterval(glowInterval);
            musicPlayer.style.boxShadow = '0 0 20px rgba(139, 92, 246, 0.5)';
            return;
        }
        
        glowIntensity += 0.1;
        const glowValue = Math.abs(Math.sin(glowIntensity)) * 40;
        musicPlayer.style.boxShadow = `0 0 ${glowValue}px rgba(139, 92, 246, 0.8)`;
        
    }, 100);
}

// Open YouTube
function openYouTube() {
    if (currentYouTubeResults[currentSongIndex]) {
        const videoId = currentYouTubeResults[currentSongIndex].id.videoId;
        window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
    }
}

// Search YouTube for music
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

// Toggle play/pause
function togglePlay() {
    if (!currentYouTubeResults.length) return;
    
    if (isPlaying) {
        // Pause logic
        isPlaying = false;
        playIcon.className = 'fas fa-play';
        musicPlayer.style.boxShadow = '0 0 20px rgba(139, 92, 246, 0.5)';
    } else {
        // Play logic
        isPlaying = true;
        playIcon.className = 'fas fa-pause';
        
        if (!musicPlayer.classList.contains('active')) {
            playYouTubeSong(currentYouTubeResults[0], 0);
        } else {
            playRealSound();
        }
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

// Seek song
function seekSong(event) {
    if (!currentYouTubeResults.length) return;
    
    const progressBar = event.currentTarget;
    const clickPosition = event.offsetX;
    const progressBarWidth = progressBar.offsetWidth;
    const percentage = clickPosition / progressBarWidth;
    
    progress.style.width = (percentage * 100) + '%';
    currentTime.textContent = formatTime(percentage * 225);
}

// Format time
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Show page
function showPage(page) {
    homePage.style.display = 'none';
    profilePage.style.display = 'none';
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
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
    if (document.body.classList.contains('light-theme')) {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
}

// Show login
function showLogin() {
    alert('Login feature will be implemented soon!');
}

// Show premium
function showPremium() {
    alert('Premium features coming soon!');
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.trim();
        
        if (query === '') {
            loadTrendingSongs();
            return;
        }

        searchYouTubeMusic(query);
    });

    // Enter key for search
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchYouTubeMusic(searchInput.value.trim());
            this.blur();
        }
    });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);
