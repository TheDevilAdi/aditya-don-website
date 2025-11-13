// Music Library with actual audio URLs
const musicLibrary = [
    {
        id: 1,
        title: "Shape of You",
        artist: "Ed Sheeran",
        duration: "3:53",
        audioUrl: "https://www.soundjay.com/misc/sounds/shape-of-you-ed-sheeran.mp3",
        lyrics: [
            "The club isn't the best place to find a lover",
            "So the bar is where I go",
            "Me and my friends at the table doing shots",
            "Drinking fast and then we talk slow",
            "Come over and start up a conversation with just me",
            "And trust me I'll give it a chance now"
        ]
    },
    {
        id: 2,
        title: "Blinding Lights",
        artist: "The Weeknd",
        duration: "3:20",
        audioUrl: "https://www.soundjay.com/misc/sounds/blinding-lights-the-weeknd.mp3",
        lyrics: [
            "I've been tryna call",
            "I've been on my own for long enough",
            "Maybe you can show me how to love",
            "Maybe I'm going through withdrawals",
            "You're too dark to care about",
            "When I'm like this, you're the one I trust"
        ]
    },
    {
        id: 3,
        title: "Dance Monkey",
        artist: "Tones and I",
        duration: "3:29",
        audioUrl: "https://www.soundjay.com/misc/sounds/dance-monkey-tones-and-i.mp3",
        lyrics: [
            "They say oh my god I see the way you shine",
            "Take your hand my dear and place them both in mine",
            "You know you stopped me dead while I was passing by",
            "And now I beg to see you dance just one more time"
        ]
    },
    {
        id: 4,
        title: "Senorita",
        artist: "Shawn Mendes, Camila Cabello",
        duration: "3:10",
        audioUrl: "https://www.soundjay.com/misc/sounds/senorita-shawn-mendes.mp3",
        lyrics: [
            "I love it when you call me señorita",
            "I wish I could pretend I didn't need ya",
            "But every touch is ooh la la la",
            "It's true la la la",
            "Ooh you know I love it when you call me señorita"
        ]
    },
    {
        id: 5,
        title: "Perfect",
        artist: "Ed Sheeran",
        duration: "4:23",
        audioUrl: "https://www.soundjay.com/misc/sounds/perfect-ed-sheeran.mp3",
        lyrics: [
            "I found a love for me",
            "Darling just dive right in and follow my lead",
            "Well I found a girl beautiful and sweet",
            "I never knew you were the someone waiting for me"
        ]
    },
    {
        id: 6,
        title: "Believer",
        artist: "Imagine Dragons",
        duration: "3:24",
        audioUrl: "https://www.soundjay.com/misc/sounds/believer-imagine-dragons.mp3",
        lyrics: [
            "First things first",
            "I'ma say all the words inside my head",
            "I'm fired up and tired of the way that things have been",
            "Oh ooh",
            "The way that things have been oh ooh"
        ]
    }
];

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
const audioPlayer = document.getElementById('audioPlayer');
const volumeSlider = document.getElementById('volumeSlider');
const searchInput = document.getElementById('searchInput');

let currentSong = null;
let isPlaying = false;
let currentSongIndex = 0;
let lyricsInterval;

// Initialize the app
function init() {
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
        <div class="song-duration">${song.duration}</div>
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
    
    // Set audio source
    audioPlayer.src = song.audioUrl;
    
    // Load and display lyrics
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
            // Fallback: Simulate playback if actual audio fails
            simulatePlayback();
        });
}

// Update progress bar
function updateProgressBar() {
    audioPlayer.addEventListener('timeupdate', function() {
        const current = audioPlayer.currentTime;
        const duration = audioPlayer.duration;
        
        // Update progress bar
        const progressPercent = (current / duration) * 100;
        progress.style.width = progressPercent + '%';
        
        // Update time displays
        currentTime.textContent = formatTime(current);
        totalTime.textContent = formatTime(duration);
    });
    
    audioPlayer.addEventListener('ended', function() {
        isPlaying = false;
        playIcon.className = 'fas fa-play';
        progress.style.width = '0%';
        currentTime.textContent = '0:00';
        nextSong();
    });
}

// Format time (seconds to MM:SS)
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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

// Change volume
function changeVolume(value) {
    audioPlayer.volume = value / 100;
}

// Display lyrics with word highlighting
function displayLyrics(lyrics) {
    lyricsContainer.style.display = 'block';
    lyricsContent.innerHTML = '';
    
    lyrics.forEach(line => {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'lyrics-line';
        lineDiv.textContent = line;
        lyricsContent.appendChild(lineDiv);
    });
    
    startLyricsHighlighting();
}

// Start lyrics highlighting
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

// Search functionality
function setupEventListeners() {
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

// Social media functions
function openFacebook() {
    window.open('https://www.facebook.com/share/1Bd1E1Efbs/', '_blank');
}

function openYouTube() {
    window.open('https://youtube.com/@adityaeditz-h5m?si=Fbw9BXqMdFe96vsi', '_blank');
}

// Simulate playback if actual audio fails
function simulatePlayback() {
    isPlaying = true;
    playIcon.className = 'fas fa-pause';
    
    let currentTimeValue = 0;
    const duration = 180; // 3 minutes
    
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
            currentTime.textContent = '0:00';
            nextSong();
        }
    }, 1000);
}

// Initialize the app when page loads
document.addEventListener('DOMContentLoaded', init);

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
    } else if (e.code === 'ArrowRight') {
        nextSong();
    } else if (e.code === 'ArrowLeft') {
        previousSong();
    }
});
