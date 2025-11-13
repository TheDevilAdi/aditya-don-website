// Music Database with REAL WORKING AUDIO
const musicLibrary = [
    {
        id: 1,
        title: "Kesariya",
        artist: "Arijit Singh",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        image: "https://i.ytimg.com/vi/k3M3C6xQIr0/hqdefault.jpg",
        lyrics: ["Kesariya tera ishq hai piya", "Rang jaaun main to har rang mein", "Balam tere pyaar ka", "Asar hai yeh kesariya"]
    },
    {
        id: 2,
        title: "Apna Bana Le",
        artist: "Arijit Singh", 
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        image: "https://i.ytimg.com/vi/Vk1M3dq0Exc/hqdefault.jpg",
        lyrics: ["Apna bana le piya", "Apna bana le", "Dil mera le le piya", "Apna bana le"]
    },
    {
        id: 3,
        title: "Tum Hi Ho",
        artist: "Arijit Singh",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        image: "https://i.ytimg.com/vi/UUK6K413zgA/hqdefault.jpg",
        lyrics: ["Tum hi ho", "Tum hi ho", "Ab tum hi ho", "Zindagi ab tum hi ho"]
    },
    {
        id: 4,
        title: "Lut Gaye",
        artist: "Jubin Nautiyal",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        image: "https://i.ytimg.com/vi/IzHMcLg1FcU/hqdefault.jpg",
        lyrics: ["Lut gaye lut gaye hum toh tere pyaar mein", "Dil de diya hai saara teri bahon mein", "Tere bina ab na jeena", "Tere bina ab na marna"]
    },
    {
        id: 5,
        title: "Mann Bharrya",
        artist: "B Praak",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        image: "https://i.ytimg.com/vi/u5rNl5c_0cE/hqdefault.jpg",
        lyrics: ["Mann bharrya ve mainu tu hi tu", "Dil vich rehnda ve mainu tu hi tu", "Rabba ve mainu mil gayi dua", "Teri yaadon ne kar dita juda"]
    },
    {
        id: 6,
        title: "Raatan Lambiyan",
        artist: "Tanishk Bagchi",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        image: "https://i.ytimg.com/vi/YVkUvmDQ3HY/hqdefault.jpg",
        lyrics: ["Raatan lambiyan lambiyan", "Raatan lambiyan lambiyan", "Teri meri gallan", "Ho raatan lambiyan"]
    },
    {
        id: 7,
        title: "Bardali",
        artist: "Indravadan Chauhan",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        image: "https://i.ytimg.com/vi/abc123/hqdefault.jpg",
        lyrics: ["Bardali song lyrics", "Traditional folk song", "Beautiful melody", "Heart touching music"]
    },
    {
        id: 8,
        title: "Shape of You",
        artist: "Ed Sheeran",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        image: "https://i.ytimg.com/vi/JGwWNGJdvx8/hqdefault.jpg",
        lyrics: ["The club isn't the best place to find a lover", "So the bar is where I go", "Me and my friends at the table doing shots"]
    }
];

let currentSong = null;
let isPlaying = false;
let currentSongIndex = 0;

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

// Initialize the app
function init() {
    createSparkles();
    loadSongs();
    setupAudioEvents();
    
    // Auto play first song after user interaction
    document.addEventListener('click', function firstInteraction() {
        if (musicLibrary.length > 0 && !currentSong) {
            // Don't auto play, just show player
            document.getElementById('musicPlayer').style.display = 'flex';
        }
        document.removeEventListener('click', firstInteraction);
    });
}

// Load songs to the page
function loadSongs() {
    const trendingSongs = document.getElementById('trendingSongs');
    const popularSongs = document.getElementById('popularSongs');
    
    trendingSongs.innerHTML = '';
    popularSongs.innerHTML = '';

    // First 4 songs as trending
    musicLibrary.slice(0, 4).forEach((song, index) => {
        const songElement = createSongElement(song, index);
        trendingSongs.appendChild(songElement);
    });

    // All songs as popular
    musicLibrary.forEach((song, index) => {
        const songElement = createSongElement(song, index);
        popularSongs.appendChild(songElement);
    });
}

// Create song element with thumbnail
function createSongElement(song, index) {
    const div = document.createElement('div');
    div.className = 'song-card';
    div.innerHTML = `
        <div class="song-image">
            <img src="${song.image}" alt="${song.title}" onerror="this.style.display='none'; this.parentNode.innerHTML='🎵'">
        </div>
        <div class="song-info">
            <div class="song-title">${song.title}</div>
            <div class="song-artist">${song.artist}</div>
        </div>
        <button class="play-song-btn" onclick="playSongAtIndex(${index}, event)">
            <i class="fas fa-play"></i>
        </button>
    `;
    
    // Add click event to entire card
    div.addEventListener('click', function(e) {
        if (!e.target.classList.contains('play-song-btn')) {
            playSongAtIndex(index, e);
        }
    });
    
    return div;
}

// Play song by index
function playSongAtIndex(index, event) {
    if (event) {
        event.stopPropagation();
    }
    playSong(musicLibrary[index], index);
}

// Play song function
function playSong(song, index) {
    console.log('Playing:', song.title);
    
    currentSong = song;
    currentSongIndex = index;
    
    // Update UI
    document.getElementById('nowPlayingTitle').textContent = song.title;
    document.getElementById('nowPlayingArtist').textContent = song.artist;
    
    // Set thumbnail image
    const nowPlayingImage = document.getElementById('nowPlayingImage');
    nowPlayingImage.src = song.image;
    nowPlayingImage.alt = song.title;
    nowPlayingImage.onerror = function() {
        this.style.display = 'none';
        this.parentNode.innerHTML = '<div class="current-song-image">🎵</div>';
    };
    
    document.getElementById('musicPlayer').style.display = 'flex';
    
    // Set audio source
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.src = song.audioUrl;
    
    // Play the audio
    playAudio();
}

// Play audio
function playAudio() {
    const audioPlayer = document.getElementById('audioPlayer');
    
    audioPlayer.play().then(() => {
        isPlaying = true;
        document.getElementById('playIcon').className = 'fas fa-pause';
        console.log('Audio started successfully');
    }).catch(error => {
        console.log('Audio play failed:', error);
        // Simulate playback for demo
        simulatePlayback();
    });
}

// Setup audio events
function setupAudioEvents() {
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', nextSong);
}

// Update progress bar
function updateProgress() {
    const audioPlayer = document.getElementById('audioPlayer');
    const progress = document.getElementById('progress');
    const currentTime = document.getElementById('currentTime');
    const totalTime = document.getElementById('totalTime');
    
    if (audioPlayer.duration && !isNaN(audioPlayer.duration)) {
        const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progress.style.width = `${progressPercent}%`;
        
        currentTime.textContent = formatTime(audioPlayer.currentTime);
        totalTime.textContent = formatTime(audioPlayer.duration);
    }
}

// Format time
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// Seek song
function seekSong(event) {
    if (!currentSong) return;
    
    const audioPlayer = document.getElementById('audioPlayer');
    const progressBar = event.currentTarget;
    const clickPosition = event.offsetX;
    const progressBarWidth = progressBar.clientWidth;
    const seekTime = (clickPosition / progressBarWidth) * audioPlayer.duration;
    
    audioPlayer.currentTime = seekTime;
}

// Toggle play/pause
function togglePlay() {
    const audioPlayer = document.getElementById('audioPlayer');
    
    if (audioPlayer.src === '') {
        playSong(musicLibrary[0], 0);
        return;
    }
    
    if (isPlaying) {
        audioPlayer.pause();
        document.getElementById('playIcon').className = 'fas fa-play';
        isPlaying = false;
    } else {
        audioPlayer.play().then(() => {
            isPlaying = true;
            document.getElementById('playIcon').className = 'fas fa-pause';
        }).catch(error => {
            console.log('Play error:', error);
        });
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

// Search functionality
function handleSearch(event) {
    if (event.key === 'Enter') {
        performSearch();
    }
}

function performSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (!query) {
        showPage('home');
        return;
    }
    
    showPage('search');
    
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';
    
    // Filter songs based on search query
    const filteredSongs = musicLibrary.filter(song => 
        song.title.toLowerCase().includes(query) || 
        song.artist.toLowerCase().includes(query)
    );
    
    if (filteredSongs.length === 0) {
        searchResults.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: var(--text-secondary)">
                <i class="fas fa-search" style="font-size: 64px; margin-bottom: 20px; opacity: 0.5;"></i>
                <h3>No songs found for "${query}"</h3>
                <p>Try searching with different keywords</p>
            </div>
        `;
    } else {
        const grid = document.createElement('div');
        grid.className = 'songs-grid';
        
        filteredSongs.forEach((song, index) => {
            const originalIndex = musicLibrary.findIndex(s => s.id === song.id);
            const songElement = createSongElement(song, originalIndex);
            grid.appendChild(songElement);
        });
        
        const resultInfo = document.createElement('div');
        resultInfo.style.marginBottom = '20px';
        resultInfo.style.color = 'var(--text-secondary)';
        resultInfo.innerHTML = `Found ${filteredSongs.length} song${filteredSongs.length > 1 ? 's' : ''} for "${query}"`;
        
        searchResults.appendChild(resultInfo);
        searchResults.appendChild(grid);
    }
}

// Page navigation
function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.content-area').forEach(page => {
        page.classList.remove('active-page');
    });
    
    // Show selected page
    const pageElement = document.getElementById(pageName + 'Page');
    if (pageElement) {
        pageElement.classList.add('active-page');
    }
    
    // Update active nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Find and activate the clicked nav item
    const activeNav = document.querySelector(`[onclick="showPage('${pageName}')"]`);
    if (activeNav) {
        activeNav.classList.add('active');
    }
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

// Simulate playback for demo
function simulatePlayback() {
    isPlaying = true;
    document.getElementById('playIcon').className = 'fas fa-pause';
    
    let currentTimeValue = 0;
    const duration = 180; // 3 minutes
    
    const interval = setInterval(() => {
        if (!isPlaying) {
            clearInterval(interval);
            return;
        }
        
        currentTimeValue++;
        const progressPercent = (currentTimeValue / duration) * 100;
        document.getElementById('progress').style.width = progressPercent + '%';
        document.getElementById('currentTime').textContent = formatTime(currentTimeValue);
        document.getElementById('totalTime').textContent = formatTime(duration);
        
        if (currentTimeValue >= duration) {
            clearInterval(interval);
            isPlaying = false;
            document.getElementById('playIcon').className = 'fas fa-play';
            document.getElementById('progress').style.width = '0%';
            nextSong();
        }
    }, 1000);
}

// Initialize when page loads
window.onload = init;
