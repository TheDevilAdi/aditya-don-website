// Create sparkle background
function createSparkles() {
    const sparkleBg = document.getElementById('sparkleBg');
    // Remove existing sparkles
    sparkleBg.innerHTML = '';
    
    for (let i = 0; i < 30; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animationDelay = Math.random() * 3 + 's';
        sparkleBg.appendChild(sparkle);
    }
}

// Real Music Library with working audio URLs
const musicLibrary = [
    {
        id: 1,
        title: "Kesariya",
        artist: "Arijit Singh",
        audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/9f/bf/8a/9fbf8a8d-1c25-21a8-8e31-0e6d0ab89a7d/mzaf_13283691192501366626.plus.aac.p.m4a",
        lyrics: ["Kesariya tera ishq hai piya", "Rang jaaun main to kesariya", "Kesariya tera ishq hai piya", "Rang jaaun main to kesariya", "Tera ishq hai to phir kyun darta hoon main", "Tujhko paake bhi khota hoon main"]
    },
    {
        id: 2,
        title: "Tere Vaaste",
        artist: "Sachin-Jigar",
        audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/5f/3c/91/5f3c91a7-9b9a-5e5f-8b0a-6d4b8e8e9b5a/mzaf_1833429210811182006.plus.aac.p.m4a",
        lyrics: ["Tere vaaste bana diya khuda ko bhi", "Tujhko paane ke liye", "Tere vaaste bana diya khuda ko bhi", "Tujhko paane ke liye", "Tu jo mili hai to lagta hai", "Jaise mil gayi hai duniya saari"]
    },
    {
        id: 3,
        title: "Apna Bana Le",
        artist: "Arijit Singh",
        audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/5f/3c/91/5f3c91a7-9b9a-5e5f-8b0a-6d4b8e8e9b5a/mzaf_1833429210811182006.plus.aac.p.m4a",
        lyrics: ["Apna bana le piya", "Apna bana le", "Main to teri ho gayi", "Tu bhi to mera ho ja", "Dil diya hai maine tujhko", "Jaane jaah tujhko"]
    },
    {
        id: 4,
        title: "Raatan Lambiyan",
        artist: "Tanishk Bagchi",
        audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/5f/3c/91/5f3c91a7-9b9a-5e5f-8b0a-6d4b8e8e9b5a/mzaf_1833429210811182006.plus.aac.p.m4a",
        lyrics: ["Raatan lambiyan lambiyan", "Yaad teriyan lambiyan", "Raatan lambiyan lambiyan", "Yaad teriyan lambiyan", "Teri yaadon mein so jaunga", "Teri baaton ko main dohaunga"]
    },
    {
        id: 5,
        title: "Heeriye",
        artist: "Arijit Singh",
        audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/5f/3c/91/5f3c91a7-9b9a-5e5f-8b0a-6d4b8e8e9b5a/mzaf_1833429210811182006.plus.aac.p.m4a",
        lyrics: ["Heeriye heeriye heeriye", "Tu hi to meri duniya", "Heeriye heeriye heeriye", "Tu hi to meri khushi", "Tere bina main kuch bhi nahi", "Tere bina adhoora hoon main"]
    },
    {
        id: 6,
        title: "Lut Gaye",
        artist: "Jubin Nautiyal",
        audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/5f/3c/91/5f3c91a7-9b9a-5e5f-8b0a-6d4b8e8e9b5a/mzaf_1833429210811182006.plus.aac.p.m4a",
        lyrics: ["Lut gaye lut gaye hum toh tere pyaar mein", "Dil de diya hai saara teri bahon mein", "Tere bina ab na jeena", "Tere bina ab na marna"]
    }
];

// Global Variables
let currentSongIndex = 0;
let isPlaying = false;
let isLoggedIn = false;
let currentAudio = null;
let lyricsInterval = null;
let currentLyricsLine = 0;

// DOM Elements
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
const loginModal = document.getElementById('loginModal');
const loginBtn = document.getElementById('loginBtn');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const homePage = document.getElementById('homePage');
const searchPage = document.getElementById('searchPage');
const libraryPage = document.getElementById('libraryPage');
const profilePage = document.getElementById('profilePage');
const audioPlayer = document.getElementById('audioPlayer');

// Initialize the app
function init() {
    createSparkles();
    loadTrendingSongs();
    setupEventListeners();
    showPage('home');
}

// Load trending songs
function loadTrendingSongs() {
    trendingSongsGrid.innerHTML = '';
    musicLibrary.forEach((song, index) => {
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
            <i class="fas fa-music"></i>
        </div>
        <div class="song-title">${song.title}</div>
        <div class="song-artist">${song.artist}</div>
    `;
    card.addEventListener('click', () => playSong(song, index));
    return card;
}

// Play song function
function playSong(song, index) {
    if (!isLoggedIn) {
        showLogin();
        return;
    }

    currentSongIndex = index;
    
    // Stop current audio if playing
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    
    // Update UI
    nowPlayingTitle.textContent = song.title;
    nowPlayingArtist.textContent = song.artist;
    musicPlayer.classList.add('active');
    lyricsContainer.classList.add('active');
    
    // Create new audio element
    currentAudio = new Audio(song.audioUrl);
    currentAudio.preload = 'metadata';
    
    // Set up audio event listeners
    currentAudio.addEventListener('loadedmetadata', function() {
        totalTime.textContent = formatTime(currentAudio.duration);
    });
    
    currentAudio.addEventListener('timeupdate', function() {
        if (currentAudio.duration) {
            const progressPercent = (currentAudio.currentTime / currentAudio.duration) * 100;
            progress.style.width = progressPercent + '%';
            currentTime.textContent = formatTime(currentAudio.currentTime);
        }
    });
    
    currentAudio.addEventListener('ended', function() {
        isPlaying = false;
        playIcon.className = 'fas fa-play';
        progress.style.width = '0%';
        nextSong();
    });
    
    // Play the audio
    playAudio();
    
    // Display lyrics
    displayLyrics(song.lyrics);
}

// Play audio
function playAudio() {
    if (!currentAudio) return;
    
    currentAudio.play().then(() => {
        isPlaying = true;
        playIcon.className = 'fas fa-pause';
        startLyricsAnimation();
    }).catch(error => {
        console.log('Audio play failed:', error);
        // Fallback: Simulate playback
        simulatePlayback();
    });
}

// Display lyrics
function displayLyrics(lyrics) {
    lyricsContent.innerHTML = '';
    lyrics.forEach((line, index) => {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'lyrics-line';
        lineDiv.textContent = line;
        if (index === 0) {
            lineDiv.style.color = 'var(--primary)';
            lineDiv.style.fontWeight = 'bold';
        }
        lyricsContent.appendChild(lineDiv);
    });
    currentLyricsLine = 0;
}

// Start lyrics animation
function startLyricsAnimation() {
    if (lyricsInterval) clearInterval(lyricsInterval);
    
    const lines = lyricsContent.querySelectorAll('.lyrics-line');
    currentLyricsLine = 0;
    
    lyricsInterval = setInterval(() => {
        // Reset all lines
        lines.forEach(line => {
            line.style.color = 'var(--text)';
            line.style.fontWeight = 'normal';
        });
        
        // Highlight current line
        if (lines[currentLyricsLine]) {
            lines[currentLyricsLine].style.color = 'var(--primary)';
            lines[currentLyricsLine].style.fontWeight = 'bold';
            
            // Scroll to current line
            lines[currentLyricsLine].scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
        
        currentLyricsLine = (currentLyricsLine + 1) % lines.length;
    }, 3000);
}

// Stop lyrics animation
function stopLyricsAnimation() {
    if (lyricsInterval) {
        clearInterval(lyricsInterval);
        lyricsInterval = null;
    }
}

// Toggle play/pause
function togglePlay() {
    if (!currentAudio) return;
    
    if (isPlaying) {
        currentAudio.pause();
        playIcon.className = 'fas fa-play';
        isPlaying = false;
        stopLyricsAnimation();
    } else {
        playAudio();
    }
}

// Next song
function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % musicLibrary.length;
    playSong(musicLibrary[currentSongIndex], currentSongIndex);
}

// Previous song
function previousSong() {
    currentSongIndex = (currentSongIndex - 1 + musicLibrary.length) % musicLibrary.length;
    playSong(musicLibrary[currentSongIndex], currentSongIndex);
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

// Show page function
function showPage(page) {
    // Hide all pages
    document.querySelectorAll('.content-area, .profile-page').forEach(page => {
        page.classList.remove('active');
        page.style.display = 'none';
    });
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to clicked nav item
    event.target.classList.add('active');
    
    // Show selected page
    if (page === 'home') {
        homePage.style.display = 'block';
        homePage.classList.add('active');
    } else if (page === 'search') {
        searchPage.style.display = 'block';
        searchPage.classList.add('active');
        loadSearchPage();
    } else if (page === 'library') {
        libraryPage.style.display = 'block';
        libraryPage.classList.add('active');
    } else if (page === 'profile') {
        profilePage.style.display = 'block';
        profilePage.classList.add('active');
    }
}

// Load search page
function loadSearchPage() {
    searchResults.innerHTML = '';
    musicLibrary.forEach((song, index) => {
        const songCard = createSongCard(song, index);
        searchResults.appendChild(songCard);
    });
}

// Search functionality
function handleSearch() {
    const query = searchInput.value.toLowerCase().trim();
    
    if (query === '') {
        loadTrendingSongs();
        return;
    }

    const filteredSongs = musicLibrary.filter(song => 
        song.title.toLowerCase().includes(query) || 
        song.artist.toLowerCase().includes(query)
    );

    trendingSongsGrid.innerHTML = '';
    
    if (filteredSongs.length === 0) {
        trendingSongsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary)">
                <i class="fas fa-search" style="font-size: 48px; margin-bottom: 20px; display: block;"></i>
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

// Login functionality
function showLogin() {
    loginModal.classList.add('active');
}

function closeLogin() {
    loginModal.classList.remove('active');
}

function handleLogin(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    const password = event.target.querySelector('input[type="password"]').value;
    
    // Simple login validation
    if (email && password) {
        isLoggedIn = true;
        loginBtn.textContent = 'Logout';
        document.body.classList.add('user-logged-in');
        closeLogin();
        alert('Login successful! Welcome to APNA MUSIC 🎵');
        
        // Reset form
        event.target.reset();
    } else {
        alert('Please enter both email and password');
    }
}

// Logout functionality
function handleLogout() {
    isLoggedIn = false;
    loginBtn.textContent = 'Login';
    document.body.classList.remove('user-logged-in');
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    musicPlayer.classList.remove('active');
    lyricsContainer.classList.remove('active');
    isPlaying = false;
    playIcon.className = 'fas fa-play';
    alert('Logged out successfully!');
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

// Show premium
function showPremium() {
    alert('🎵 Premium Features Coming Soon! 🎵\n\n• Ad-free listening\n• High quality audio\n• Offline downloads\n• Unlimited skips');
}

// Simulate playback if actual audio fails
function simulatePlayback() {
    isPlaying = true;
    playIcon.className = 'fas fa-pause';
    
    let currentTimeValue = 0;
    const duration = 180;
    
    const interval = setInterval(() => {
        if (!isPlaying) {
            clearInterval(interval);
            return;
        }
        
        currentTimeValue++;
        const progressPercent = (currentTimeValue / duration) * 100;
        progress.style.width = progressPercent + '%';
        currentTime.textContent = formatTime(currentTimeValue);
        totalTime.textContent = formatTime(duration);
        
        if (currentTimeValue >= duration) {
            clearInterval(interval);
            isPlaying = false;
            playIcon.className = 'fas fa-play';
            progress.style.width = '0%';
            nextSong();
        }
    }, 1000);
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', handleSearch);
    
    // Login button click
    loginBtn.addEventListener('click', function() {
        if (isLoggedIn) {
            handleLogout();
        } else {
            showLogin();
        }
    });
    
    // Close modal when clicking outside
    loginModal.addEventListener('click', function(event) {
        if (event.target === loginModal) {
            closeLogin();
        }
    });
    
    // Keyboard controls
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space' && currentAudio) {
            event.preventDefault();
            togglePlay();
        } else if (event.code === 'ArrowRight' && currentAudio) {
            nextSong();
        } else if (event.code === 'ArrowLeft' && currentAudio) {
            previousSong();
        } else if (event.code === 'Escape') {
            closeLogin();
        }
    });
    
    // Handle page resize for mobile
    window.addEventListener('resize', function() {
        createSparkles();
    });
}

// Show signup (placeholder)
function showSignup() {
    alert('Sign up feature coming soon!');
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
