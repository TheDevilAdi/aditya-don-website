// YouTube API Configuration - For song search and thumbnails
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
let currentAudio = null;

// Legal Music Library with real audio streams
const legalMusicLibrary = [
    {
        id: 1,
        youtubeId: "dummy1",
        title: "Chill Lofi Study Beat",
        artist: "Lofi Records",
        thumbnail: "https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg",
        audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_d5bcfeb541.mp3?filename=lofi-study-112191.mp3",
        duration: "2:45"
    },
    {
        id: 2,
        youtubeId: "dummy2", 
        title: "Hip Hop Background",
        artist: "Hip Hop Beats",
        thumbnail: "https://i.ytimg.com/vi/5qap5aO4i9A/hqdefault.jpg",
        audioUrl: "https://cdn.pixabay.com/download/audio/2022/10/13/audio_34592cb5f0.mp3?filename=hip-hop-116821.mp3",
        duration: "3:15"
    },
    {
        id: 3,
        youtubeId: "dummy3",
        title: "Electronic Dance Music",
        artist: "EDM Network",
        thumbnail: "https://i.ytimg.com/vi/MVPTGNGiI-4/hqdefault.jpg",
        audioUrl: "https://cdn.pixabay.com/download/audio/2023/04/13/audio_1c38cbf401.mp3?filename=electronic-rock-king-around-here-15045.mp3",
        duration: "2:30"
    },
    {
        id: 4,
        youtubeId: "dummy4",
        title: "Relaxing Piano",
        artist: "Piano Masters",
        thumbnail: "https://i.ytimg.com/vi/7maJOI3QMu0/hqdefault.jpg",
        audioUrl: "https://cdn.pixabay.com/download/audio/2022/11/29/audio_6b8f2f5c3a.mp3?filename=relaxing-piano-131657.mp3",
        duration: "3:00"
    },
    {
        id: 5,
        youtubeId: "dummy5",
        title: "Synthwave 80s",
        artist: "Retro Waves",
        thumbnail: "https://i.ytimg.com/vi/4xDzrJKXOOY/hqdefault.jpg",
        audioUrl: "https://cdn.pixabay.com/download/audio/2023/03/13/audio_5c7c0f5d3d.mp3?filename=synthwave-142093.mp3",
        duration: "2:50"
    },
    {
        id: 6,
        youtubeId: "dummy6",
        title: "Trap Beat Instrumental",
        artist: "Trap Nation",
        thumbnail: "https://i.ytimg.com/vi/vYhohYqgA2w/hqdefault.jpg",
        audioUrl: "https://cdn.pixabay.com/download/audio/2022/11/16/audio_9b38e0e9d7.mp3?filename=trap-future-bass-15017.mp3",
        duration: "3:20"
    }
];

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

// Initialize the app
function init() {
    createSparkles();
    loadTrendingSongs();
    setupEventListeners();
}

// Load trending songs
function loadTrendingSongs() {
    trendingSongsGrid.innerHTML = '';
    legalMusicLibrary.forEach((song, index) => {
        const songCard = createSongCard(song, index);
        trendingSongsGrid.appendChild(songCard);
    });
}

// Create song card
function createSongCard(song, index) {
    const card = document.createElement('div');
    card.className = 'song-card';
    card.innerHTML = `
        <div class="song-image">
            <img src="${song.thumbnail}" alt="${song.title}" style="width: 100%; height: 100%; border-radius: 4px; object-fit: cover;">
        </div>
        <div class="song-title">${song.title}</div>
        <div class="song-artist">${song.artist}</div>
        <div class="song-duration" style="color: var(--text-secondary); font-size: 12px; margin-top: 5px;">${song.duration}</div>
    `;
    card.addEventListener('click', () => playRealSong(song, index));
    return card;
}

// Play real song with audio
function playRealSong(song, index) {
    // Stop previous audio
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    
    currentSongIndex = index;
    
    // Add glow effect to music player
    musicPlayer.style.background = 'linear-gradient(90deg, #8B5CF6, #EC4899)';
    musicPlayer.style.boxShadow = '0 0 30px rgba(139, 92, 246, 0.7)';
    
    // Update UI
    nowPlayingTitle.textContent = song.title;
    nowPlayingArtist.textContent = song.artist;
    musicPlayer.classList.add('active');
    lyricsContainer.classList.add('active');
    
    // Show loading message
    lyricsContent.innerHTML = `<div style="text-align: center; color: var(--primary); font-size: 18px;">
        <i class="fas fa-music"></i><br>
        Loading: ${song.title}<br>
        <small>Real audio streaming...</small>
    </div>`;
    
    // Play real audio
    playRealAudio(song);
}

// Play real audio function
function playRealAudio(song) {
    try {
        // Create new audio element
        currentAudio = new Audio();
        currentAudio.src = song.audioUrl;
        currentAudio.preload = "auto";
        
        // Set up audio event listeners
        currentAudio.addEventListener('loadeddata', function() {
            lyricsContent.innerHTML = `<div style="text-align: center; color: var(--primary); font-size: 18px;">
                <i class="fas fa-volume-up"></i><br>
                Ready: ${song.title}<br>
                <small style="color: #10B981;">✅ Audio loaded successfully!</small>
            </div>`;
        });
        
        currentAudio.addEventListener('canplaythrough', function() {
            // Auto play when ready
            currentAudio.play()
                .then(() => {
                    isPlaying = true;
                    playIcon.className = 'fas fa-pause';
                    startGlowEffect();
                    
                    // Show playing state
                    lyricsContent.innerHTML = `
                        <div style="text-align: center; color: var(--primary); font-size: 18px;">
                            <div class="music-visualizer" style="display: flex; justify-content: center; align-items: end; height: 40px; gap: 3px; margin: 15px 0;">
                                <div class="bar" style="width: 4px; background: #8B5CF6; animation: equalizer 0.5s infinite alternate;"></div>
                                <div class="bar" style="width: 4px; background: #EC4899; animation: equalizer 0.7s infinite alternate;"></div>
                                <div class="bar" style="width: 4px; background: #8B5CF6; animation: equalizer 0.6s infinite alternate;"></div>
                                <div class="bar" style="width: 4px; background: #EC4899; animation: equalizer 0.8s infinite alternate;"></div>
                                <div class="bar" style="width: 4px; background: #8B5CF6; animation: equalizer 0.5s infinite alternate;"></div>
                            </div>
                            <strong>🎵 ${song.title}</strong><br>
                            <small style="color: #10B981;">Real music playing!</small>
                            
                            <style>
                                @keyframes equalizer {
                                    0% { height: 5px; }
                                    100% { height: 30px; }
                                }
                                .bar:nth-child(1) { animation-delay: 0s; }
                                .bar:nth-child(2) { animation-delay: 0.1s; }
                                .bar:nth-child(3) { animation-delay: 0.2s; }
                                .bar:nth-child(4) { animation-delay: 0.3s; }
                                .bar:nth-child(5) { animation-delay: 0.4s; }
                            </style>
                        </div>
                    `;
                })
                .catch(error => {
                    console.log('Auto-play failed, need user interaction');
                    lyricsContent.innerHTML = `
                        <div style="text-align: center; color: var(--primary); font-size: 18px;">
                            <i class="fas fa-play-circle"></i><br>
                            ${song.title}<br>
                            <small style="color: #F59E0B;">Click play button to start</small>
                        </div>
                    `;
                });
        });
        
        currentAudio.addEventListener('timeupdate', function() {
            if (currentAudio.duration) {
                const progressPercent = (currentAudio.currentTime / currentAudio.duration) * 100;
                progress.style.width = progressPercent + '%';
                currentTime.textContent = formatTime(currentAudio.currentTime);
                totalTime.textContent = formatTime(currentAudio.duration);
            }
        });
        
        currentAudio.addEventListener('ended', function() {
            isPlaying = false;
            playIcon.className = 'fas fa-play';
            progress.style.width = '0%';
            nextSong();
        });
        
        // Preload the audio
        currentAudio.load();
        
    } catch (error) {
        console.log('Audio setup failed:', error);
        lyricsContent.innerHTML = `<div style="text-align: center; color: red; font-size: 18px;">
            <i class="fas fa-exclamation-triangle"></i><br>
            Audio Error<br>
            <small>Please try again</small>
        </div>`;
    }
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

// Search music
function searchMusic(query) {
    const filteredSongs = legalMusicLibrary.filter(song => 
        song.title.toLowerCase().includes(query.toLowerCase()) || 
        song.artist.toLowerCase().includes(query.toLowerCase())
    );

    trendingSongsGrid.innerHTML = '';
    
    if (filteredSongs.length === 0) {
        trendingSongsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary)">
                No songs found for "${query}"
            </div>
        `;
    } else {
        filteredSongs.forEach((song, index) => {
            const songCard = createSongCard(song, index);
            trendingSongsGrid.appendChild(songCard);
        });
    }
}

// Toggle play/pause
function togglePlay() {
    if (!currentAudio) return;
    
    if (isPlaying) {
        currentAudio.pause();
        playIcon.className = 'fas fa-play';
        isPlaying = false;
    } else {
        currentAudio.play()
            .then(() => {
                playIcon.className = 'fas fa-pause';
                isPlaying = true;
                startGlowEffect();
            })
            .catch(error => {
                console.log('Play failed:', error);
            });
    }
}

// Next song
function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % legalMusicLibrary.length;
    playRealSong(legalMusicLibrary[currentSongIndex], currentSongIndex);
}

// Previous song
function previousSong() {
    currentSongIndex = (currentSongIndex - 1 + legalMusicLibrary.length) % legalMusicLibrary.length;
    playRealSong(legalMusicLibrary[currentSongIndex], currentSongIndex);
}

// Seek song
function seekSong(event) {
    if (!currentAudio || !currentAudio.duration) return;
    
    const progressBar = event.currentTarget;
    const clickPosition = event.offsetX;
    const progressBarWidth = progressBar.offsetWidth;
    const percentage = clickPosition / progressBarWidth;
    
    currentAudio.currentTime = percentage * currentAudio.duration;
}

// Format time
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
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

        searchMusic(query);
    });

    // Enter key for search
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchMusic(searchInput.value.trim());
            this.blur();
        }
    });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);
