// Sample music library with thumbnails and lyrics
const musicLibrary = [
    {
        id: 1,
        title: "Shape of You",
        artist: "Ed Sheeran",
        duration: 233,
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        lyrics: [
            "The club isn't the best place to find a lover",
            "So the bar is where I go",
            "Me and my friends at the table doing shots",
            "Drinking fast and then we talk slow",
            "Come over and start up a conversation with just me",
            "And trust me I'll give it a chance now",
            "Take my hand, stop, put Van the Man on the jukebox",
            "And then we start to dance, and now I'm singing like"
        ]
    },
    {
        id: 2,
        title: "Blinding Lights",
        artist: "The Weeknd",
        duration: 200,
        image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop",
        lyrics: [
            "I've been tryna call",
            "I've been on my own for long enough",
            "Maybe you can show me how to love, maybe",
            "I'm going through withdrawals",
            "You don't even have to do too much",
            "You can turn me on with just a touch, baby"
        ]
    },
    {
        id: 3,
        title: "Dance Monkey",
        artist: "Tones and I",
        duration: 209,
        image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop",
        lyrics: [
            "They say oh my god I see the way you shine",
            "Take your hand, my dear, and place them both in mine",
            "You know you stopped me dead while I was passing by",
            "And now I beg to see you dance just one more time",
            "Ooh I see you, see you, every time",
            "And oh my I, I like your style"
        ]
    },
    {
        id: 4,
        title: "Lehanga",
        artist: "Jass Manak",
        duration: 180,
        image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop",
        lyrics: [
            "Lehanga lehanga tera lehanga",
            "Sadiyon se hai dekhne ko tarasta",
            "Aaja banke tu meri jaan",
            "Ho lehanga lehanga tera lehanga",
            "Tere bina adhoori hai har kahani",
            "Tu hi to hai meri yeh zindagani"
        ]
    },
    {
        id: 5,
        title: "Lut Gaye",
        artist: "Jubin Nautiyal",
        duration: 220,
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop",
        lyrics: [
            "Lut gaye lut gaye hum toh tere pyaar mein",
            "Dil de diya hai saara teri bahon mein",
            "Tere bina ab na jeena",
            "Tere bina ab na marna",
            "Tu hi to hai meri duniya",
            "Tu hi to hai mera sab kuch"
        ]
    },
    {
        id: 6,
        title: "Senorita",
        artist: "Shawn Mendes, Camila Cabello",
        duration: 190,
        image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=400&fit=crop",
        lyrics: [
            "I love it when you call me señorita",
            "I wish I could pretend I didn't need ya",
            "But every touch is ooh la la la",
            "It's true, la la la",
            "Ooh, you know I love it when you call me señorita",
            "I wish it wasn't so damn hard to leave ya"
        ]
    }
];

// DOM Elements
const songsGrid = document.getElementById('songsGrid');
const musicPlayer = document.getElementById('musicPlayer');
const nowPlayingTitle = document.getElementById('nowPlayingTitle');
const nowPlayingArtist = document.getElementById('nowPlayingArtist');
const playBtn = document.getElementById('playBtn');
const progress = document.getElementById('progress');
const currentTime = document.getElementById('currentTime');
const totalTime = document.getElementById('totalTime');
const lyricsContent = document.getElementById('lyricsContent');
const currentSongImage = document.getElementById('currentSongImage');
const miniSongImage = document.getElementById('miniSongImage');
const searchInput = document.getElementById('searchInput');

let currentSong = null;
let isPlaying = false;
let progressInterval;
let lyricsInterval;

// Initialize the app
function init() {
    loadSongs();
    setupEventListeners();
}

// Load songs to grid
function loadSongs(songs = musicLibrary) {
    songsGrid.innerHTML = '';
    songs.forEach(song => {
        const songCard = createSongCard(song);
        songsGrid.appendChild(songCard);
    });
}

// Create song card
function createSongCard(song) {
    const card = document.createElement('div');
    card.className = 'song-card';
    card.innerHTML = `
        <div class="song-image">
            <img src="${song.image}" alt="${song.title}">
            <div class="play-overlay">
                <i class="fas fa-play"></i>
            </div>
        </div>
        <div class="song-title">${song.title}</div>
        <div class="song-artist">${song.artist}</div>
    `;
    card.addEventListener('click', () => playSong(song));
    return card;
}

// Play song function
function playSong(song) {
    currentSong = song;
    
    // Update player info
    nowPlayingTitle.textContent = song.title;
    nowPlayingArtist.textContent = song.artist;
    currentSongImage.src = song.image;
    miniSongImage.src = song.image;
    
    // Show player page
    showPage('player');
    
    // Display lyrics
    displayLyrics(song.lyrics);
    
    // Start playback if not already playing
    if (!isPlaying) {
        startPlayback();
    }
    
    // Show music player
    musicPlayer.style.display = 'block';
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
    
    // Start word-by-word highlighting
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

    function highlightNextWord() {
        if (currentLineIndex >= lines.length) {
            currentLineIndex = 0;
            currentWordIndex = 0;
            return;
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
    }

    lyricsInterval = setInterval(highlightNextWord, 800);
}

// Simulate music playback
function startPlayback() {
    isPlaying = true;
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    
    const duration = currentSong.duration;
    totalTime.textContent = formatTime(duration);
    
    let currentTimeValue = 0;
    progressInterval = setInterval(() => {
        if (currentTimeValue >= duration) {
            stopPlayback();
            return;
        }
        
        currentTimeValue++;
        currentTime.textContent = formatTime(currentTimeValue);
        progress.style.width = (currentTimeValue / duration) * 100 + '%';
    }, 1000);
}

// Stop playback
function stopPlayback() {
    isPlaying = false;
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    
    if (progressInterval) {
        clearInterval(progressInterval);
    }
    
    if (lyricsInterval) {
        clearInterval(lyricsInterval);
    }
    
    progress.style.width = '0%';
    currentTime.textContent = '0:00';
}

// Format time (seconds to MM:SS)
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Page navigation
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(pageId).classList.add('active');
    
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-page="${pageId}"]`).classList.add('active');
    
    // Stop playback if going to non-player page
    if (pageId !== 'player' && isPlaying) {
        stopPlayback();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.getAttribute('data-page');
            showPage(page);
        });
    });

    // Play/Pause button
    playBtn.addEventListener('click', function() {
        if (!currentSong) return;
        
        if (isPlaying) {
            stopPlayback();
        } else {
            startPlayback();
        }
    });

    // Search functionality
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase().trim();
        
        if (query === '') {
            loadSongs();
            return;
        }

        const filteredSongs = musicLibrary.filter(song => 
            song.title.toLowerCase().includes(query) || 
            song.artist.toLowerCase().includes(query)
        );

        loadSongs(filteredSongs);
    });

    // Progress bar click to seek
    document.querySelector('.progress-bar').addEventListener('click', function(e) {
        if (!currentSong) return;
        
        const progressBar = this;
        const clickPosition = e.offsetX;
        const progressBarWidth = progressBar.offsetWidth;
        const percentage = (clickPosition / progressBarWidth) * 100;
        
        progress.style.width = percentage + '%';
        
        const newTime = Math.floor((percentage / 100) * currentSong.duration);
        currentTime.textContent = formatTime(newTime);
    });

    // Keyboard controls
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space') {
            e.preventDefault();
            if (currentSong) {
                if (isPlaying) {
                    stopPlayback();
                } else {
                    startPlayback();
                }
            }
        }
    });
}

// Initialize the app
init();
