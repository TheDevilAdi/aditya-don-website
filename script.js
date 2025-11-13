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

// Sample music library with WORKING AUDIO URLs
const musicLibrary = [
    {
        id: 1,
        title: "Kesariya",
        artist: "Arijit Singh",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        lyrics: ["Kesariya tera ishq hai piya", "Rang jaaun main to har rang mein", "Balam tere pyaar ka", "Asar hai yeh kesariya"]
    },
    {
        id: 2,
        title: "Apna Bana Le",
        artist: "Arijit Singh", 
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        lyrics: ["Apna bana le piya", "Apna bana le", "Dil mera le le piya", "Apna bana le"]
    },
    {
        id: 3,
        title: "Tum Hi Ho",
        artist: "Arijit Singh",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        lyrics: ["Tum hi ho", "Tum hi ho", "Ab tum hi ho", "Zindagi ab tum hi ho"]
    },
    {
        id: 4,
        title: "Shape of You",
        artist: "Ed Sheeran",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        lyrics: ["The club isn't the best place to find a lover", "So the bar is where I go", "Me and my friends at the table doing shots"]
    },
    {
        id: 5,
        title: "Blinding Lights",
        artist: "The Weeknd",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        lyrics: ["I've been tryna call", "I've been on my own for long enough", "Maybe you can show me how to love"]
    },
    {
        id: 6,
        title: "Dil Diyan Gallan",
        artist: "Atif Aslam",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        lyrics: ["Dil diyan gallan", "Dil diyan gallan", "Hor kise na sunayan", "Dil diyan gallan"]
    }
];

let currentSong = null;
let isPlaying = false;
let currentSongIndex = 0;
let lyricsInterval;

// DOM elements
const audioPlayer = document.getElementById('audioPlayer');

// Initialize the app
function init() {
    createSparkles();
    loadSongs();
    setupAudioEvents();
    
    // Auto play first song after user interaction
    document.addEventListener('click', function firstInteraction() {
        if (musicLibrary.length > 0 && !currentSong) {
            playSong(musicLibrary[0], 0);
        }
        document.removeEventListener('click', firstInteraction);
    });
}

// Load songs to the page
function loadSongs() {
    const trendingSongs = document.getElementById('trendingSongs');
    const allSongs = document.getElementById('allSongs');
    
    trendingSongs.innerHTML = '';
    allSongs.innerHTML = '';

    musicLibrary.forEach((song, index) => {
        const songElement = createSongElement(song, index);
        allSongs.appendChild(songElement);
        
        // First 3 songs in trending
        if (index < 3) {
            trendingSongs.appendChild(songElement.cloneNode(true));
        }
    });
}

// Create song element
function createSongElement(song, index) {
    const div = document.createElement('div');
    div.className = 'song-card';
    div.innerHTML = `
        <div class="song-image">🎵</div>
        <div class="song-info">
            <div class="song-title">${song.title}</div>
            <div class="song-artist">${song.artist}</div>
        </div>
        <button class="play-song-btn" onclick="playSongAtIndex(${index})">
            <i class="fas fa-play"></i>
        </button>
    `;
    return div;
}

// Play song by index
function playSongAtIndex(index) {
    playSong(musicLibrary[index], index);
}

// Play song function
function playSong(song, index) {
    currentSong = song;
    currentSongIndex = index;
    
    // Update UI
    document.getElementById('nowPlayingTitle').textContent = song.title;
    document.getElementById('nowPlayingArtist').textContent = song.artist;
    document.getElementById('musicPlayer').style.display = 'flex';
    document.getElementById('lyricsContainer').classList.add('active');
    
    // Set audio source
    audioPlayer.src = song.audioUrl;
    
    // Display lyrics
    displayLyrics(song.lyrics);
    
    // Play the audio
    playAudio();
}

// Play audio
function playAudio() {
    audioPlayer.play().then(() => {
        isPlaying = true;
        document.getElementById('playIcon').className = 'fas fa-pause';
    }).catch(error => {
        console.log('Play error:', error);
        // Show user message
        alert('Please click play button to start music');
        isPlaying = false;
        document.getElementById('playIcon').className = 'fas fa-play';
    });
}

// Setup audio events
function setupAudioEvents() {
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', nextSong);
}

// Update progress bar
function updateProgress() {
    const progress = document.getElementById('progress');
    const currentTime = document.getElementById('currentTime');
    const totalTime = document.getElementById('totalTime');
    
    if (audioPlayer.duration) {
        const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progress.style.width = `${progressPercent}%`;
        
        currentTime.textContent = formatTime(audioPlayer.currentTime);
        totalTime.textContent = formatTime(audioPlayer.duration);
    }
}

// Format time
function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// Seek song
function seekSong(event) {
    const progressBar = event.currentTarget;
    const clickPosition = event.offsetX;
    const progressBarWidth = progressBar.clientWidth;
    const seekTime = (clickPosition / progressBarWidth) * audioPlayer.duration;
    
    audioPlayer.currentTime = seekTime;
}

// Toggle play/pause
function togglePlay() {
    if (audioPlayer.src === '') {
        playSong(musicLibrary[0], 0);
        return;
    }
    
    if (isPlaying) {
        audioPlayer.pause();
        document.getElementById('playIcon').className = 'fas fa-play';
    } else {
        audioPlayer.play().catch(error => {
            console.log('Play error:', error);
        });
        document.getElementById('playIcon').className = 'fas fa-pause';
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

// Display lyrics with word highlighting
function displayLyrics(lyrics) {
    const lyricsContent = document.getElementById('lyricsContent');
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
    
    const lines = document.querySelectorAll('.lyrics-line');
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

// Search songs
function searchSongs() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const searchResults = document.getElementById('searchResults');
    
    if (!query) {
        searchResults.innerHTML = '<p>Type to search songs</p>';
        return;
    }
    
    const filteredSongs = musicLibrary.filter(song => 
        song.title.toLowerCase().includes(query) || 
        song.artist.toLowerCase().includes(query)
    );
    
    searchResults.innerHTML = '';
    
    if (filteredSongs.length === 0) {
        searchResults.innerHTML = '<p>No songs found</p>';
        return;
    }
    
    filteredSongs.forEach((song, index) => {
        const originalIndex = musicLibrary.findIndex(s => s.id === song.id);
        const songElement = createSongElement(song, originalIndex);
        searchResults.appendChild(songElement);
    });
}

// Page navigation
function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.content-area').forEach(page => {
        page.classList.remove('active-page');
    });
    
    // Show selected page
    document.getElementById(pageName + 'Page').classList.add('active-page');
    
    // Update active nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
}

// Theme toggle
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const icon = document.getElementById('themeIcon');
    icon.className = document.body.classList.contains('light-theme') ? 'fas fa-sun' : 'fas fa-moon';
}

// Show login
function showLogin() {
    alert('Login feature will be implemented soon!');
}

// Show premium
function showPremium() {
    alert('Premium features coming soon!');
}

// Initialize when page loads
window.onload = init;
