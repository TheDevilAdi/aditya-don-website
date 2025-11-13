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

// Music Library with YouTube Integration
const musicLibrary = [
    {
        id: 1,
        title: "Tere Vaaste",
        artist: "Sachin-Jigar, Varun Jain, Shadab Faridi",
        youtubeId: "T1v4RGS5o_k",
        thumbnail: "https://i.ytimg.com/vi/T1v4RGS5o_k/hqdefault.jpg",
        lyrics: ["Tere vaaste bana diya khuda ko bhi", "Tujhko paane ke liye", "Tere vaaste bana diya khuda ko bhi", "Tujhko paane ke liye", "Tu jo mili hai to lagta hai", "Jaise mil gayi hai duniya saari", "Tere bina ab na rahunga", "Tere sang hi bitaunga saari umariyaan"]
    },
    {
        id: 2,
        title: "Kesariya",
        artist: "Arijit Singh",
        youtubeId: "v5bK6DL2MkI",
        thumbnail: "https://i.ytimg.com/vi/v5bK6DL2MkI/hqdefault.jpg",
        lyrics: ["Kesariya tera ishq hai piya", "Rang jaaun main to kesariya", "Kesariya tera ishq hai piya", "Rang jaaun main to kesariya", "Tera ishq hai to phir kyun darta hoon main", "Tujhko paake bhi khota hoon main"]
    },
    {
        id: 3,
        title: "Apna Bana Le",
        artist: "Arijit Singh",
        youtubeId: "v5bK6DL2MkI",
        thumbnail: "https://i.ytimg.com/vi/v5bK6DL2MkI/hqdefault.jpg",
        lyrics: ["Apna bana le piya", "Apna bana le", "Main to teri ho gayi", "Tu bhi to mera ho ja", "Dil diya hai maine tujhko", "Jaane jaah tujhko", "Ab to raat din bas tera hi khayal aata hai"]
    },
    {
        id: 4,
        title: "Raatan Lambiyan",
        artist: "Tanishk Bagchi",
        youtubeId: "v5bK6DL2MkI",
        thumbnail: "https://i.ytimg.com/vi/v5bK6DL2MkI/hqdefault.jpg",
        lyrics: ["Raatan lambiyan lambiyan", "Yaad teriyan lambiyan", "Raatan lambiyan lambiyan", "Yaad teriyan lambiyan", "Teri yaadon mein so jaunga", "Teri baaton ko main dohaunga", "Raat din bitaunga tujhko yaad karke"]
    },
    {
        id: 5,
        title: "Heeriye",
        artist: "Arijit Singh",
        youtubeId: "v5bK6DL2MkI",
        thumbnail: "https://i.ytimg.com/vi/v5bK6DL2MkI/hqdefault.jpg",
        lyrics: ["Heeriye heeriye heeriye", "Tu hi to meri duniya", "Heeriye heeriye heeriye", "Tu hi to meri khushi", "Tere bina main kuch bhi nahi", "Tere bina adhoora hoon main", "Tu hi to hai meri jaan", "Tu hi to hai meri shaan"]
    },
    {
        id: 6,
        title: "Lut Gaye",
        artist: "Jubin Nautiyal",
        youtubeId: "v5bK6DL2MkI",
        thumbnail: "https://i.ytimg.com/vi/v5bK6DL2MkI/hqdefault.jpg",
        lyrics: ["Lut gaye lut gaye hum toh tere pyaar mein", "Dil de diya hai saara teri bahon mein", "Tere bina ab na jeena", "Tere bina ab na marna", "Yun hi kat jayega zamana"]
    }
];

// Global Variables
let currentSongIndex = 0;
let isPlaying = false;
let isLoggedIn = false;
let youtubePlayer = null;
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

// Initialize the app
function init() {
    createSparkles();
    loadTrendingSongs();
    setupEventListeners();
    loadYouTubeAPI();
}

// Load YouTube API
function loadYouTubeAPI() {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// YouTube Player API
window.onYouTubeIframeAPIReady = function() {
    youtubePlayer = new YT.Player('youtubePlayer', {
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
    if (event.data == YT.PlayerState.PLAYING) {
        isPlaying = true;
        playIcon.className = 'fas fa-pause';
        startLyricsAnimation();
    } else if (event.data == YT.PlayerState.PAUSED) {
        isPlaying = false;
        playIcon.className = 'fas fa-play';
        stopLyricsAnimation();
    } else if (event.data == YT.PlayerState.ENDED) {
        nextSong();
    }
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
    currentSong = song;
    
    // Update UI
    nowPlayingTitle.textContent = song.title;
    nowPlayingArtist.textContent = song.artist;
    musicPlayer.classList.add('active');
    lyricsContainer.classList.add('active');
    
    // Load YouTube video
    if (youtubePlayer) {
        youtubePlayer.loadVideoById(song.youtubeId);
    }
    
    // Display lyrics
    displayLyrics(song.lyrics);
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
    }, 3000); // Change line every 3 seconds
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
    if (!currentSong) return;
    
    if (isPlaying) {
        youtubePlayer.pauseVideo();
        playIcon.className = 'fas fa-play';
        isPlaying = false;
        stopLyricsAnimation();
    } else {
        youtubePlayer.playVideo();
        playIcon.className = 'fas fa-pause';
        isPlaying = true;
        startLyricsAnimation();
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

// Seek song (simulated for YouTube)
function seekSong(event) {
    if (!currentSong || !youtubePlayer) return;
    
    const progressBar = event.currentTarget;
    const clickPosition = event.offsetX;
    const progressBarWidth = progressBar.offsetWidth;
    const percentage = clickPosition / progressBarWidth;
    
    // YouTube doesn't allow direct seeking due to autoplay restrictions
    // This is just for UI demonstration
    progress.style.width = (percentage * 100) + '%';
}

// Show page function
function showPage(page) {
    // Hide all pages
    homePage.style.display = 'none';
    searchPage.style.display = 'none';
    libraryPage.style.display = 'none';
    profilePage.style.display = 'none';
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to clicked nav item
    event.target.classList.add('active');
    
    // Show selected page
    if (page === 'home') {
        homePage.style.display = 'block';
    } else if (page === 'search') {
        searchPage.style.display = 'block';
        loadSearchPage();
    } else if (page === 'library') {
        libraryPage.style.display = 'block';
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
    const formData = new FormData(event.target);
    const email = formData.get('email') || event.target.querySelector('input[type="email"]').value;
    const password = event.target.querySelector('input[type="password"]').value;
    
    // Simple login validation
    if (email && password) {
        isLoggedIn = true;
        loginBtn.textContent = 'Logout';
        document.body.classList.add('user-logged-in');
        closeLogin();
        alert('Login successful! Welcome to APNA MUSIC 🎵');
    } else {
        alert('Please enter both email and password');
    }
}

// Logout functionality
function handleLogout() {
    isLoggedIn = false;
    loginBtn.textContent = 'Login';
    document.body.classList.remove('user-logged-in');
    if (youtubePlayer) {
        youtubePlayer.stopVideo();
    }
    musicPlayer.classList.remove('active');
    lyricsContainer.classList.remove('active');
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
        if (event.code === 'Space' && currentSong) {
            event.preventDefault();
            togglePlay();
        } else if (event.code === 'ArrowRight' && currentSong) {
            nextSong();
        } else if (event.code === 'ArrowLeft' && currentSong) {
            previousSong();
        } else if (event.code === 'Escape') {
            closeLogin();
        }
    });
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
