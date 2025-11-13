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

// Sample music library
const musicLibrary = [
    {
        id: 1,
        title: "Shape of You",
        artist: "Ed Sheeran",
        audioUrl: "https://assets.codepen.io/4358586/ShapeOfYou.mp3",
        lyrics: ["The club isn't the best place to find a lover", "So the bar is where I go", "Me and my friends at the table doing shots", "Drinking fast and then we talk slow", "Come over and start up a conversation with just me", "And trust me I'll give it a chance now"]
    },
    {
        id: 2,
        title: "Blinding Lights",
        artist: "The Weeknd", 
        audioUrl: "https://assets.codepen.io/4358586/BlindingLights.mp3",
        lyrics: ["I've been tryna call", "I've been on my own for long enough", "Maybe you can show me how to love", "Maybe I'm going through withdrawals", "You're too dark to care about", "When I'm like this, you're the one I trust"]
    },
    {
        id: 3,
        title: "Dance Monkey",
        artist: "Tones and I",
        audioUrl: "https://assets.codepen.io/4358586/DanceMonkey.mp3",
        lyrics: ["They say oh my god I see the way you shine", "Take your hand my dear and place them both in mine", "You know you stopped me dead while I was passing by", "And now I beg to see you dance just one more time", "Ooh I see you see you every time", "And oh my I I like your style"]
    },
    {
        id: 4,
        title: "Lehanga",
        artist: "Jass Manak",
        audioUrl: "https://assets.codepen.io/4358586/Lehanga.mp3",
        lyrics: ["Lehanga lehanga tera lehanga", "Sadiyon se hai dekhne ko tarasta", "Aaja banke tu meri jaan", "Ho lehanga lehanga tera lehanga", "Tere bina mera kuch nahi lagta", "Tu hi to hai meri duniya"]
    },
    {
        id: 5,
        title: "Lut Gaye",
        artist: "Jubin Nautiyal",
        audioUrl: "https://assets.codepen.io/4358586/LutGaye.mp3",
        lyrics: ["Lut gaye lut gaye hum toh tere pyaar mein", "Dil de diya hai saara teri bahon mein", "Tere bina ab na jeena", "Tere bina ab na marna", "Yun hi kat jayega zamana"]
    },
    {
        id: 6,
        title: "Mann Bharrya",
        artist: "B Praak",
        audioUrl: "https://assets.codepen.io/4358586/MannBharrya.mp3",
        lyrics: ["Mann bharrya ve mainu tu hi tu", "Dil vich rehnda ve mainu tu hi tu", "Rabba ve mainu mil gayi dua", "Teri yaadon ne kar dita juda"]
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
const audioPlayer = document.getElementById('audioPlayer');
const homePage = document.getElementById('homePage');
const profilePage = document.getElementById('profilePage');
const themeIcon = document.getElementById('themeIcon');
const searchInput = document.getElementById('searchInput');

let currentSong = null;
let isPlaying = false;
let currentSongIndex = 0;
let lyricsInterval;

// Initialize the app
function init() {
    createSparkles();
    loadTrendingSongs();
    setupEventListeners();
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
        <div class="song-image">🎵</div>
        <div class="song-title">${song.title}</div>
        <div class="song-artist">${song.artist}</div>
    `;
    card.addEventListener('click', () => playSong(song, index));
    return card;
}

// Play song function
function playSong(song, index) {
    currentSong = song;
    currentSongIndex = index;
    
    // Update UI
    nowPlayingTitle.textContent = song.title;
    nowPlayingArtist.textContent = song.artist;
    musicPlayer.classList.add('active');
    lyricsContainer.classList.add('active');
    
    // Set audio source
    audioPlayer.src = song.audioUrl;
    
    // Display lyrics
    displayLyrics(song.lyrics);
    
    // Play the audio
    playAudio();
}

// Play audio
function playAudio() {
    audioPlayer.play()
        .then(() => {
            isPlaying = true;
            playIcon.className = 'fas fa-pause';
            updateProgressBar();
        })
        .catch(error => {
            console.log('Audio play failed:', error);
            simulatePlayback();
        });
}

// Update progress bar
function updateProgressBar() {
    audioPlayer.addEventListener('timeupdate', function() {
        const current = audioPlayer.currentTime;
        const duration = audioPlayer.duration;
        
        if (duration) {
            const progressPercent = (current / duration) * 100;
            progress.style.width = progressPercent + '%';
            
            currentTime.textContent = formatTime(current);
            totalTime.textContent = formatTime(duration);
        }
    });
    
    audioPlayer.addEventListener('ended', function() {
        isPlaying = false;
        playIcon.className = 'fas fa-play';
        progress.style.width = '0%';
        nextSong();
    });
}

// Display lyrics with word highlighting
function displayLyrics(lyrics) {
    lyricsContent.innerHTML = '';
    lyrics.forEach(line => {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'lyrics-line';
        lineDiv.textContent = line;
        lyricsContent.appendChild(lineDiv);
    });
    
    startLyricsHighlighting();
}

// Word-by-word highlighting
function startLyricsHighlighting() {
    if (lyricsInterval) {
        clearInterval(lyricsInterval);
    }
    
    const lines = lyricsContent.querySelectorAll('.lyrics-line');
    let currentLineIndex = 0;
    let currentWordIndex = 0;

    lyricsInterval = setInterval(() => {
        if (currentLineIndex >= lines.length) {
            currentLineIndex = 0;
            currentWordIndex = 0;
        }

        const line = lines[currentLineIndex];
        const words = line.textContent.split(' ');
        
        let highlightedLine = '';
        words.forEach((word, index) => {
            if (index === currentWordIndex) {
                highlightedLine += `<span class="current-word">${word}</span> `;
            } else {
                highlightedLine += `${word} `;
            }
        });
        
        line.innerHTML = highlightedLine.trim();
        
        currentWordIndex++;
        if (currentWordIndex >= words.length) {
            currentWordIndex = 0;
            currentLineIndex++;
        }
    }, 800);
}

// Toggle play/pause
function togglePlay() {
    if (!currentSong) return;
    
    if (isPlaying) {
        audioPlayer.pause();
        playIcon.className = 'fas fa-play';
    } else {
        audioPlayer.play();
        playIcon.className = 'fas fa-pause';
    }
    isPlaying = !isPlaying;
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
    if (!currentSong || !audioPlayer.duration) return;
    
    const progressBar = event.currentTarget;
    const clickPosition = event.offsetX;
    const progressBarWidth = progressBar.offsetWidth;
    const percentage = clickPosition / progressBarWidth;
    
    audioPlayer.currentTime = percentage * audioPlayer.duration;
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
    event.target.classList.add('active');
    
    if (page === 'home') {
        homePage.style.display = 'block';
    } else if (page === 'profile') {
        profilePage.style.display = 'block';
        profilePage.classList.add('active');
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
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase().trim();
        
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
                    No songs found for "${query}"
                </div>
            `;
        } else {
            filteredSongs.forEach((song, index) => {
                const songCard = createSongCard(song, index);
                trendingSongsGrid.appendChild(songCard);
            });
        }
    });

    // Enter key for search
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            this.blur();
        }
    });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);
