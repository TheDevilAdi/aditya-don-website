// YouTube API Setup
let youtubePlayer;
let currentSong = null;
let isPlaying = false;
let currentSongIndex = 0;
let lyricsInterval;

// Popular Hindi Songs (YouTube Video IDs)
const popularSongs = [
    { id: 'k3M3C6xQIr0', title: 'Kesariya', artist: 'Arijit Singh' },
    { id: 'Vk1M3dq0Exc', title: 'Apna Bana Le', artist: 'Arijit Singh' },
    { id: 'UUK6K413zgA', title: 'Tum Hi Ho', artist: 'Arijit Singh' },
    { id: 'IzHMcLg1FcU', title: 'Lut Gaye', artist: 'Jubin Nautiyal' },
    { id: 'u5rNl5c_0cE', title: 'Mann Bharrya', artist: 'B Praak' },
    { id: 'YVkUvmDQ3HY', title: 'Raatan Lambiyan', artist: 'Tanishk Bagchi' }
];

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

// Initialize YouTube Player
function onYouTubeIframeAPIReady() {
    youtubePlayer = new YT.Player('youtubePlayer', {
        height: '0',
        width: '0',
        videoId: '',
        playerVars: {
            'playsinline': 1,
            'controls': 0,
            'disablekb': 1,
            'modestbranding': 1,
            'fs': 0
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    console.log('YouTube Player Ready');
    loadPopularSongs();
}

function onPlayerStateChange(event) {
    const progress = document.getElementById('progress');
    const currentTime = document.getElementById('currentTime');
    const totalTime = document.getElementById('totalTime');
    
    if (event.data == YT.PlayerState.PLAYING) {
        isPlaying = true;
        document.getElementById('playIcon').className = 'fas fa-pause';
        startProgressUpdate();
    } else if (event.data == YT.PlayerState.PAUSED) {
        isPlaying = false;
        document.getElementById('playIcon').className = 'fas fa-play';
    } else if (event.data == YT.PlayerState.ENDED) {
        isPlaying = false;
        document.getElementById('playIcon').className = 'fas fa-play';
        progress.style.width = '0%';
        nextSong();
    }
}

function startProgressUpdate() {
    const updateInterval = setInterval(() => {
        if (isPlaying && youtubePlayer && youtubePlayer.getCurrentTime) {
            const current = youtubePlayer.getCurrentTime();
            const duration = youtubePlayer.getDuration();
            
            if (duration && !isNaN(duration)) {
                const progressPercent = (current / duration) * 100;
                document.getElementById('progress').style.width = `${progressPercent}%`;
                
                document.getElementById('currentTime').textContent = formatTime(current);
                document.getElementById('totalTime').textContent = formatTime(duration);
            }
        } else if (!isPlaying) {
            clearInterval(updateInterval);
        }
    }, 1000);
}

// Load popular songs on home page
function loadPopularSongs() {
    const trendingSongs = document.getElementById('trendingSongs');
    const popularSongsGrid = document.getElementById('popularSongs');
    
    trendingSongs.innerHTML = '';
    popularSongsGrid.innerHTML = '';

    // Load first 3 as trending
    popularSongs.slice(0, 3).forEach((song, index) => {
        const songElement = createSongElement(song, index);
        trendingSongs.appendChild(songElement);
    });

    // Load all as popular
    popularSongs.forEach((song, index) => {
        const songElement = createSongElement(song, index);
        popularSongsGrid.appendChild(songElement);
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
    playSong(popularSongs[index], index);
}

// Play song function
function playSong(song, index) {
    console.log('Playing:', song.title);
    
    currentSong = song;
    currentSongIndex = index;
    
    // Update UI
    document.getElementById('nowPlayingTitle').textContent = song.title;
    document.getElementById('nowPlayingArtist').textContent = song.artist;
    document.getElementById('musicPlayer').style.display = 'flex';
    document.getElementById('lyricsContainer').classList.add('active');
    
    // Load and play YouTube video
    if (youtubePlayer) {
        youtubePlayer.loadVideoById(song.id);
        youtubePlayer.playVideo();
    }
    
    // Display sample lyrics
    displayLyrics([`Now playing: ${song.title}`, `by ${song.artist}`, "Enjoy the music!", "Real YouTube audio streaming"]);
}

// Toggle play/pause
function togglePlay() {
    if (!currentSong) {
        playSong(popularSongs[0], 0);
        return;
    }
    
    if (isPlaying) {
        youtubePlayer.pauseVideo();
    } else {
        youtubePlayer.playVideo();
    }
}

// Next song
function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % popularSongs.length;
    playSong(popularSongs[currentSongIndex], currentSongIndex);
}

// Previous song
function previousSong() {
    currentSongIndex = (currentSongIndex - 1 + popularSongs.length) % popularSongs.length;
    playSong(popularSongs[currentSongIndex], currentSongIndex);
}

// Seek song
function seekSong(event) {
    if (!currentSong || !youtubePlayer) return;
    
    const progressBar = event.currentTarget;
    const clickPosition = event.offsetX;
    const progressBarWidth = progressBar.clientWidth;
    const duration = youtubePlayer.getDuration();
    const seekTime = (clickPosition / progressBarWidth) * duration;
    
    youtubePlayer.seekTo(seekTime, true);
}

// Format time
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// Display lyrics
function displayLyrics(lyrics) {
    const lyricsContent = document.getElementById('lyricsContent');
    lyricsContent.innerHTML = '';
    lyrics.forEach(line => {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'lyrics-line';
        lineDiv.textContent = line;
        lyricsContent.appendChild(lineDiv);
    });
}

// Search songs using YouTube API (simulated)
function searchSongs() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    const searchResults = document.getElementById('searchResults');
    
    // Show search page
    showPage('search');
    
    if (!query) {
        searchResults.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">Type something to search songs</p>';
        return;
    }
    
    // Filter from popular songs (simulated search)
    const filteredSongs = popularSongs.filter(song => 
        song.title.toLowerCase().includes(query) || 
        song.artist.toLowerCase().includes(query)
    );
    
    searchResults.innerHTML = '';
    
    if (filteredSongs.length === 0) {
        searchResults.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary)">
                <i class="fas fa-search" style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;"></i>
                <h3>No songs found for "${query}"</h3>
                <p>Try searching with different keywords</p>
            </div>
        `;
    } else {
        // Create songs grid for search results
        const grid = document.createElement('div');
        grid.className = 'songs-grid';
        
        filteredSongs.forEach((song, index) => {
            const originalIndex = popularSongs.findIndex(s => s.id === song.id);
            const songElement = createSongElement(song, originalIndex);
            grid.appendChild(songElement);
        });
        
        searchResults.appendChild(grid);
        
        // Add result count
        const resultInfo = document.createElement('div');
        resultInfo.style.marginBottom = '20px';
        resultInfo.style.color = 'var(--text-secondary)';
        resultInfo.innerHTML = `Found ${filteredSongs.length} song${filteredSongs.length > 1 ? 's' : ''} for "${query}"`;
        searchResults.insertBefore(resultInfo, grid);
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
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
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

// Initialize when page loads
window.onload = function() {
    createSparkles();
    
    // Setup search input event
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', searchSongs);
    }
};
