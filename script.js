// Default songs
const defaultSongs = [
    {
        id: 1,
        title: "Shape of You",
        artist: "Ed Sheeran",
        videoId: "JGwWNGJdvx8"
    },
    {
        id: 2,
        title: "Blinding Lights",
        artist: "The Weeknd",
        videoId: "4NRXx6U8ABQ"
    },
    {
        id: 3,
        title: "Dance Monkey",
        artist: "Tones and I",
        videoId: "q0hyYWKXF0Q"
    },
    {
        id: 4,
        title: "Lehanga",
        artist: "Jass Manak",
        videoId: "u1-VlA-5QB0"
    },
    {
        id: 5,
        title: "Lut Gaye",
        artist: "Jubin Nautiyal",
        videoId: "m5qWCfpslIU"
    },
    {
        id: 6,
        title: "Mann Bharrya",
        artist: "B Praak",
        videoId: "VQ6z5m3h-Tk"
    }
];

// DOM elements
const trendingSongsGrid = document.getElementById('trendingSongs');
const searchResultsGrid = document.getElementById('searchResultsGrid');
const trendingSection = document.getElementById('trendingSection');
const searchResults = document.getElementById('searchResults');
const musicPlayer = document.getElementById('musicPlayer');
const nowPlayingTitle = document.getElementById('nowPlayingTitle');
const nowPlayingArtist = document.getElementById('nowPlayingArtist');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const progress = document.getElementById('progress');
const currentTime = document.getElementById('currentTime');
const totalTime = document.getElementById('totalTime');
const searchInput = document.getElementById('searchInput');

let youtubePlayer;
let currentSong = null;
let isPlaying = false;

// Initialize YouTube API
function loadYouTubeAPI() {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// YouTube API ready callback
window.onYouTubeIframeAPIReady = function() {
    youtubePlayer = new YT.Player('youtubePlayer', {
        height: '0',
        width: '0',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
};

function onPlayerReady(event) {
    console.log('YouTube Player Ready');
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        isPlaying = true;
        playIcon.className = 'fas fa-pause';
        updateProgressBar();
    } else if (event.data == YT.PlayerState.PAUSED) {
        isPlaying = false;
        playIcon.className = 'fas fa-play';
    } else if (event.data == YT.PlayerState.ENDED) {
        isPlaying = false;
        playIcon.className = 'fas fa-play';
        progress.style.width = '0%';
    }
}

// Load default songs
function loadDefaultSongs() {
    trendingSongsGrid.innerHTML = '';
    defaultSongs.forEach(song => {
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

// Play song
function playSong(song) {
    currentSong = song;
    
    // Update UI
    nowPlayingTitle.textContent = song.title;
    nowPlayingArtist.textContent = song.artist;
    musicPlayer.classList.add('active');
    
    // Play with YouTube
    if (youtubePlayer) {
        youtubePlayer.loadVideoById(song.videoId);
        youtubePlayer.playVideo();
    }
}

// Search YouTube
async function searchYouTube() {
    const query = searchInput.value.trim();
    
    if (!query) {
        showTrending();
        return;
    }

    showLoading();
    
    try {
        // Using YouTube Data API (you'll need to get an API key)
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}+song&type=video&maxResults=10&key=YOUR_API_KEY`);
        const data = await response.json();
        
        displaySearchResults(data.items);
    } catch (error) {
        console.error('Search failed:', error);
        // Fallback: Show default songs matching query
        fallbackSearch(query);
    }
}

// Fallback search
function fallbackSearch(query) {
    const filteredSongs = defaultSongs.filter(song => 
        song.title.toLowerCase().includes(query.toLowerCase()) || 
        song.artist.toLowerCase().includes(query.toLowerCase())
    );
    
    searchResultsGrid.innerHTML = '';
    
    if (filteredSongs.length === 0) {
        searchResultsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary)">
                No songs found for "${query}"
            </div>
        `;
    } else {
        filteredSongs.forEach(song => {
            const songCard = createSongCard(song);
            searchResultsGrid.appendChild(songCard);
        });
    }
    
    showSearchResults();
}

// Display search results
function displaySearchResults(videos) {
    searchResultsGrid.innerHTML = '';
    
    videos.forEach(video => {
        const song = {
            title: video.snippet.title.replace(/\([^)]*\)|\[[^\]]*\]/g, '').trim(),
            artist: video.snippet.channelTitle,
            videoId: video.id.videoId
        };
        
        const songCard = createSongCard(song);
        searchResultsGrid.appendChild(songCard);
    });
    
    showSearchResults();
}

// Show search results
function showSearchResults() {
    trendingSection.style.display = 'none';
    searchResults.style.display = 'block';
    hideLoading();
}

// Show trending
function showTrending() {
    searchResults.style.display = 'none';
    trendingSection.style.display = 'block';
    searchInput.value = '';
}

// Show loading
function showLoading() {
    // You can add loading indicator here
}

function hideLoading() {
    // Hide loading indicator
}

// Player controls
function togglePlay() {
    if (!currentSong) return;
    
    if (isPlaying) {
        youtubePlayer.pauseVideo();
    } else {
        youtubePlayer.playVideo();
    }
}

function previousSong() {
    // Implement previous song logic
}

function nextSong() {
    // Implement next song logic
}

function seekSong(event) {
    if (!currentSong || !youtubePlayer) return;
    
    const progressBar = event.currentTarget;
    const clickPosition = event.offsetX;
    const progressBarWidth = progressBar.offsetWidth;
    const percentage = clickPosition / progressBarWidth;
    
    const duration = youtubePlayer.getDuration();
    youtubePlayer.seekTo(duration * percentage);
}

// Update progress bar
function updateProgressBar() {
    setInterval(() => {
        if (youtubePlayer && isPlaying) {
            const currentTime = youtubePlayer.getCurrentTime();
            const duration = youtubePlayer.getDuration();
            
            if (duration > 0) {
                const progressPercent = (currentTime / duration) * 100;
                progress.style.width = progressPercent + '%';
                
                // Update time displays
                document.getElementById('currentTime').textContent = formatTime(currentTime);
                document.getElementById('totalTime').textContent = formatTime(duration);
            }
        }
    }, 1000);
}

// Format time
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Search on Enter key
searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchYouTube();
    }
});

// Initialize app
function init() {
    loadDefaultSongs();
    loadYouTubeAPI();
}

// Start the app
init();
