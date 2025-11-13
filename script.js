// Sample music library with lyrics
const musicLibrary = [
    {
        id: 1,
        title: "Shape of You",
        artist: "Ed Sheeran",
        duration: 233,
        lyrics: ["The club isn't the best place to find a lover", "So the bar is where I go", "Me and my friends at the table doing shots", "Drinking fast and then we talk slow", "And you come over and start up a conversation with just me", "And trust me I'll give it a chance now"]
    },
    {
        id: 2,
        title: "Blinding Lights",
        artist: "The Weeknd",
        duration: 200,
        lyrics: ["I've been tryna call", "I've been on my own for long enough", "Maybe you can show me how to love", "Maybe I'm going through withdrawals", "You're too dark to care about", "When I'm like this, you're the one I trust"]
    },
    {
        id: 3,
        title: "Dance Monkey",
        artist: "Tones and I",
        duration: 209,
        lyrics: ["They say oh my god I see the way you shine", "Take your hand my dear and place them both in mine", "You know you stopped me dead while I was passing by", "And now I beg to see you dance just one more time", "Ooh I see you see you every time", "And oh my I I like your style"]
    },
    {
        id: 4,
        title: "Senorita",
        artist: "Shawn Mendes, Camila Cabello",
        duration: 190,
        lyrics: ["I love it when you call me señorita", "I wish I could pretend I didn't need ya", "But every touch is ooh la la la", "It's true la la la", "Ooh you know I love it when you call me señorita", "I wish it wasn't so damn hard to leave ya"]
    },
    {
        id: 5,
        title: "Perfect",
        artist: "Ed Sheeran",
        duration: 263,
        lyrics: ["I found a love for me", "Darling just dive right in and follow my lead", "Well I found a girl beautiful and sweet", "I never knew you were the someone waiting for me", "Cause we were just kids when we fell in love", "Not knowing what it was"]
    },
    {
        id: 6,
        title: "Believer",
        artist: "Imagine Dragons",
        duration: 204,
        lyrics: ["First things first", "I'ma say all the words inside my head", "I'm fired up and tired of the way that things have been", "Oh ooh", "The way that things have been oh ooh", "Second things second", "Don't you tell me what you think that I can be"]
    },
    {
        id: 7,
        title: "Lehanga",
        artist: "Jass Manak",
        duration: 180,
        lyrics: ["Lehanga lehanga tera lehanga", "Sadiyon se hai dekhne ko tarasta", "Aaja banke tu meri jaan", "Ho lehanga lehanga tera lehanga"]
    },
    {
        id: 8,
        title: "Lut Gaye",
        artist: "Jubin Nautiyal",
        duration: 220,
        lyrics: ["Lut gaye lut gaye hum toh tere pyaar mein", "Dil de diya hai saara teri bahon mein", "Tere bina ab na jeena", "Tere bina ab na marna"]
    }
];

// DOM Elements
const trendingSongsGrid = document.getElementById('trendingSongs');
const musicPlayer = document.getElementById('musicPlayer');
const nowPlayingTitle = document.getElementById('nowPlayingTitle');
const nowPlayingArtist = document.getElementById('nowPlayingArtist');
const playBtn = document.getElementById('playBtn');
const progress = document.getElementById('progress');
const currentTime = document.getElementById('currentTime');
const totalTime = document.getElementById('totalTime');
const lyricsContainer = document.getElementById('lyricsContainer');
const lyricsContent = document.getElementById('lyricsContent');
const loading = document.getElementById('loading');
const searchInput = document.getElementById('searchInput');

let currentSong = null;
let isPlaying = false;
let progressInterval;
let lyricsInterval;

// Initialize trending songs
function loadTrendingSongs() {
    trendingSongsGrid.innerHTML = '';
    musicLibrary.forEach(song => {
        const songCard = createSongCard(song);
        trendingSongsGrid.appendChild(songCard);
    });
}

// Create song card
function createSongCard(song) {
    const card = document.createElement('div');
    card.className = 'song-card';
    card.innerHTML = `
        <div class="song-image">🎵</div>
        <div class="song-title">${song.title}</div>
        <div class="song-artist">${song.artist}</div>
    `;
    card.addEventListener('click', () => playSong(song));
    return card;
}

// Play song function
function playSong(song) {
    // Stop any currently playing song
    stopPlayback();
    
    currentSong = song;
    nowPlayingTitle.textContent = song.title;
    nowPlayingArtist.textContent = song.artist;
    musicPlayer.classList.add('player-active');
    lyricsContainer.classList.add('lyrics-active');
    
    // Display lyrics
    displayLyrics(song.lyrics);
    
    // Start playback simulation
    startPlayback();
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
    // Clear any existing interval
    if (lyricsInterval) {
        clearInterval(lyricsInterval);
    }
    
    const lines = lyricsContent.querySelectorAll('.lyrics-line');
    let currentLineIndex = 0;
    let currentWordIndex = 0;

    function highlightNextWord() {
        if (currentLineIndex >= lines.length) {
            // Reset when all lyrics are done
            currentLineIndex = 0;
            currentWordIndex = 0;
            return;
        }

        const line = lines[currentLineIndex];
        const words = line.textContent.split(' ');
        
        // Create highlighted text
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

    // Highlight words every 800ms
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
        loadTrendingSongs();
        return;
    }

    loading.style.display = 'block';
    
    setTimeout(() => {
        const filteredSongs = musicLibrary.filter(song => 
            song.title.toLowerCase().includes(query) || 
            song.artist.toLowerCase().includes(query)
        );

        trendingSongsGrid.innerHTML = '';
        
        if (filteredSongs.length === 0) {
            trendingSongsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary)">No songs found</div>';
        } else {
            filteredSongs.forEach(song => {
                const songCard = createSongCard(song);
                trendingSongsGrid.appendChild(songCard);
            });
        }
        
        loading.style.display = 'none';
    }, 500);
});

// Social media links
document.querySelector('.icon.facebook').addEventListener('click', function() {
    window.open('https://www.facebook.com/share/1Bd1E1Efbs/', '_blank');
});

document.querySelector('.icon.youtube').addEventListener('click', function() {
    window.open('https://youtube.com/@adityaeditz-h5m?si=Fbw9BXqMdFe96vsi', '_blank');
});

// Progress bar click to seek
document.querySelector('.progress-bar').addEventListener('click', function(e) {
    if (!currentSong) return;
    
    const progressBar = this;
    const clickPosition = e.offsetX;
    const progressBarWidth = progressBar.offsetWidth;
    const percentage = (clickPosition / progressBarWidth) * 100;
    
    progress.style.width = percentage + '%';
    
    // Update current time
    const newTime = Math.floor((percentage / 100) * currentSong.duration);
    currentTime.textContent = formatTime(newTime);
});

// Initialize the app
loadTrendingSongs();

// Add keyboard controls
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

// Make player draggable (basic implementation)
let isDragging = false;
const progressBarContainer = document.querySelector('.progress-bar');

progressBarContainer.addEventListener('mousedown', function(e) {
    isDragging = true;
    updateProgress(e);
});

document.addEventListener('mousemove', function(e) {
    if (isDragging) {
        updateProgress(e);
    }
});

document.addEventListener('mouseup', function() {
    isDragging = false;
});

function updateProgress(e) {
    if (!currentSong || !isDragging) return;
    
    const progressBar = document.querySelector('.progress-bar');
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const progressBarWidth = rect.width;
    let percentage = (clickPosition / progressBarWidth) * 100;
    
    // Keep percentage between 0 and 100
    percentage = Math.max(0, Math.min(100, percentage));
    
    progress.style.width = percentage + '%';
    
    // Update current time
    const newTime = Math.floor((percentage / 100) * currentSong.duration);
    currentTime.textContent = formatTime(newTime);
}
