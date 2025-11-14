// script.js

// Audio element and player variables
const audioPlayer = document.getElementById('audioPlayer');
const musicPlayer = document.getElementById('musicPlayer');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const nowPlayingTitle = document.getElementById('nowPlayingTitle');
const nowPlayingArtist = document.getElementById('nowPlayingArtist');
const lyricsContent = document.getElementById('lyricsContent');
const lyricsContainer = document.getElementById('lyricsContainer');

let currentSongIndex = 0;
let isPlaying = false;
let updateTimeInterval;

// Songs data with real audio URLs
const songs = [
    {
        title: "Raanjhan",
        artist: "T-Series",
        views: "450 MILLION VIEWS",
        audioUrl: "https://www.soundjay.com/music/soundjay-music-previews.mp3",
        lyrics: "Raanjhan mera, main to teri... Duniya badi, par dil mera tera\nYe dooriyan kaise miten, ye raat din kaise biten\nTere bin jeena mushkil hai, tere bin marna aasaan"
    },
    {
        title: "Bollywood New Hits", 
        artist: "Tips Official",
        views: "320 MILLION VIEWS",
        audioUrl: "https://www.soundjay.com/music/indian-advertisement-music.mp3",
        lyrics: "Tere bin nahi lagda dil mera... Ho gaiyaan main to tere piche\nDil diyaan gallan, ho hassdi aan, teri yaadan ne mahi\nRabb vekhe sohniye, main taan tere utte marna"
    },
    {
        title: "Pardesiya",
        artist: "Universal Music India", 
        views: "280 MILLION VIEWS",
        audioUrl: "https://www.soundjay.com/music/baby-lullaby-music.mp3", 
        lyrics: "Pardesiya ye sach hai piya... Dooriyan hai kaisi khuda jaane\nTu jo mil jaaye to lag jaaye jeena\nBin tere adhoori hai saari raatein"
    },
    {
        title: "Mere Mehboob",
        artist: "T-Series",
        views: "380 MILLION VIEWS", 
        audioUrl: "https://www.soundjay.com/music/cinematic-background-music.mp3",
        lyrics: "Mere mehboob kayamat hogi... Aaj ruswa teri galiyon mein mohabbat hogi\nTujhko bhi taqdeer ki kasam, main chhod kar nahi jaunga\nTere dar pe sar jhukake, main duaon mein mangunga"
    }
];

// Initialize the app
function init() {
    loadSongs();
    createSparkles();
    setupEventListeners();
}

// Load songs into the grid
function loadSongs() {
    const trendingSongs = document.getElementById('trendingSongs');
    
    songs.forEach((song, index) => {
        const songCard = document.createElement('div');
        songCard.className = 'song-card';
        songCard.onclick = () => playSong(index);
        
        songCard.innerHTML = `
            <div class="song-image">🎵</div>
            <div class="song-title">${song.title}</div>
            <div class="song-artist">${song.artist}</div>
            <div class="song-views" style="color: var(--text-secondary); font-size: 12px; margin-top: 5px;">${song.views}</div>
        `;
        
        trendingSongs.appendChild(songCard);
    });
}

// Sparkle background effect
function createSparkles() {
    const sparkleBg = document.getElementById('sparkleBg');
    for (let i = 0; i < 50; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * 100 + 'vw';
        sparkle.style.top = Math.random() * 100 + 'vh';
        sparkle.style.animationDelay = Math.random() * 3 + 's';
        sparkleBg.appendChild(sparkle);
    }
}

// Setup event listeners
function setupEventListeners() {
    audioPlayer.addEventListener('loadedmetadata', updateTotalTime);
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', nextSong);
}

// Play song function
function playSong(index) {
    currentSongIndex = index;
    const song = songs[index];
    
    // Update audio source
    audioPlayer.src = song.audioUrl;
    
    // Update UI
    nowPlayingTitle.textContent = song.title;
    nowPlayingArtist.textContent = song.artist;
    lyricsContent.textContent = song.lyrics;
    
    // Show player and lyrics
    musicPlayer.classList.add('active');
    lyricsContainer.classList.add('active');
    
    // Play the audio
    audioPlayer.play().then(() => {
        isPlaying = true;
        playIcon.className = 'fas fa-pause';
    }).catch(error => {
        console.log('Audio play failed:', error);
    });
    
    // Start updating time
    startTimeUpdate();
}

// Toggle play/pause
function togglePlay() {
    if (!audioPlayer.src) {
        playSong(0);
        return;
    }
    
    if (isPlaying) {
        audioPlayer.pause();
        playIcon.className = 'fas fa-play';
    } else {
        audioPlayer.play();
        playIcon.className = 'fas fa-pause';
    }
    isPlaying = !isPlaying;
}

// Update progress bar
function updateProgress() {
    if (audioPlayer.duration) {
        const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progress.style.width = progressPercent + '%';
        
        // Update current time
        currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    }
}

// Update total time
function updateTotalTime() {
    totalTimeEl.textContent = formatTime(audioPlayer.duration);
}

// Format time (seconds to mm:ss)
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Seek song
function seekSong(event) {
    if (!audioPlayer.duration) return;
    
    const progressBar = event.currentTarget;
    const clickPosition = event.offsetX;
    const progressBarWidth = progressBar.clientWidth;
    const seekTime = (clickPosition / progressBarWidth) * audioPlayer.duration;
    
    audioPlayer.currentTime = seekTime;
}

// Next song
function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    playSong(currentSongIndex);
}

// Previous song
function previousSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    playSong(currentSongIndex);
}

// Start time update interval
function startTimeUpdate() {
    if (updateTimeInterval) {
        clearInterval(updateTimeInterval);
    }
    
    updateTimeInterval = setInterval(() => {
        updateProgress();
    }, 1000);
}

// Page navigation functions
function showPage(page) {
    // Hide all pages
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('profilePage').style.display = 'none';
    
    // Show selected page
    if (page === 'home') {
        document.getElementById('homePage').style.display = 'block';
    } else if (page === 'profile') {
        document.getElementById('profilePage').style.display = 'block';
    }
    
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
}

function showPremium() {
    alert('🎵 Premium Features Coming Soon! Stay tuned for exclusive content.');
}

function showLogin() {
    alert('🔐 Login feature will be available soon!');
}

function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const themeIcon = document.getElementById('themeIcon');
    if (document.body.classList.contains('light-theme')) {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
}

// Search functionality
document.getElementById('searchInput').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const songCards = document.querySelectorAll('.song-card');
    
    songCards.forEach(card => {
        const title = card.querySelector('.song-title').textContent.toLowerCase();
        const artist = card.querySelector('.song-artist').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || artist.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

// Initialize the app when page loads
window.onload = init;
