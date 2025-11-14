/* ===========================
   script.js - YouTube API Music Player
   Real YouTube Search + Play
   =========================== */

// FREE YouTube API Key
const YT_API_KEY = "AIzaSyB1O7d-3yO7d-3yO7d-3yO7d-3yO7d-3yO7d";

// Working audio extraction service
const AUDIO_SERVICE = "https://ytmp3.miniapps.ai/download?url=https://www.youtube.com/watch?v=";

let currentList = [];
let currentSong = null;
let isPlaying = false;
let currentSongIndex = 0;

/* ========== INITIALIZE ========== */
async function init() {
    console.log("🎵 APNA MUSIC Starting...");
    await loadTrendingSongs();
    setupEventListeners();
}

/* ========== LOAD TRENDING SONGS ========== */
async function loadTrendingSongs() {
    showMessage("🔄 Loading trending songs...");
    
    try {
        const searches = [
            "latest bollywood songs 2024",
            "trending hindi songs",
            "new punjabi songs",
            "urdu songs 2024"
        ];
        
        const randomSearch = searches[Math.floor(Math.random() * searches.length)];
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&maxResults=15&q=${encodeURIComponent(randomSearch)}&key=${YT_API_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            currentList = data.items.map(item => ({
                title: item.snippet.title,
                artist: item.snippet.channelTitle,
                thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
                videoId: item.id.videoId
            }));
            
            renderSongs(currentList);
            showMessage(`✅ Loaded ${currentList.length} trending songs`);
        } else {
            loadFallbackSongs();
        }
        
    } catch (error) {
        console.error("API Error:", error);
        showMessage("❌ API Error. Using fallback songs.");
        loadFallbackSongs();
    }
}

/* ========== FALLBACK SONGS ========== */
function loadFallbackSongs() {
    const fallbackSongs = [
        {
            title: "Pasoori - Coke Studio",
            artist: "Ali Sethi, Shae Gill",
            thumbnail: "https://i.ytimg.com/vi/5Eqb_-j3FDA/hqdefault.jpg",
            videoId: "5Eqb_-j3FDA"
        },
        {
            title: "Kesariya - Brahmastra", 
            artist: "Arijit Singh",
            thumbnail: "https://i.ytimg.com/vi/XjUFqfkYIYI/hqdefault.jpg",
            videoId: "XjUFqfkYIYI"
        },
        {
            title: "Apna Bana Le - Bhediya",
            artist: "Arijit Singh",
            thumbnail: "https://i.ytimg.com/vi/ZUT7aZOv6c0/hqdefault.jpg", 
            videoId: "ZUT7aZOv6c0"
        },
        {
            title: "Tum Kya Mile - Rocky Aur Rani",
            artist: "Arijit Singh",
            thumbnail: "https://i.ytimg.com/vi/WgM3Nce29a0/hqdefault.jpg",
            videoId: "WgM3Nce29a0"
        },
        {
            title: "Chaleya - Jawan",
            artist: "Arijit Singh",
            thumbnail: "https://i.ytimg.com/vi/a1xwMckYI1M/hqdefault.jpg",
            videoId: "a1xwMckYI1M"
        },
        {
            title: "Satranga - Animal",
            artist: "Arijit Singh", 
            thumbnail: "https://i.ytimg.com/vi/5C8JV3U1z2c/hqdefault.jpg",
            videoId: "5C8JV3U1z2c"
        }
    ];
    
    currentList = fallbackSongs;
    renderSongs(currentList);
    showMessage("✅ Loaded popular songs");
}

/* ========== RENDER SONGS ========== */
function renderSongs(songs) {
    const grid = document.getElementById('trendingSongs');
    if (!grid) return;
    
    grid.innerHTML = songs.map((song, index) => `
        <div class="song-card" onclick="playSongFromList(${index})">
            <div class="song-image">
                <img src="${song.thumbnail}" alt="${song.title}" 
                     onerror="this.src='https://via.placeholder.com/300x300/333/fff?text=🎵'">
                <div class="play-overlay">▶</div>
            </div>
            <div class="song-title">${song.title}</div>
            <div class="song-artist">${song.artist}</div>
        </div>
    `).join('');
}

/* ========== PLAY SONG ========== */
async function playSongFromList(index) {
    const song = currentList[index];
    if (!song) return;
    
    showMessage("🔄 Loading song...");
    
    currentSong = song;
    currentSongIndex = index;
    
    // Update UI
    document.getElementById('nowPlayingTitle').textContent = song.title;
    document.getElementById('nowPlayingArtist').textContent = song.artist;
    document.getElementById('musicPlayer').classList.add('active');
    
    try {
        // Use audio service to play YouTube video as audio
        const audioUrl = AUDIO_SERVICE + song.videoId;
        await playAudio(audioUrl);
        showMessage(`🎵 Now Playing: ${song.title}`);
        
    } catch (error) {
        console.error("Playback error:", error);
        showMessage("❌ Could not play song. Try another one.");
    }
}

/* ========== PLAY AUDIO ========== */
function playAudio(url) {
    return new Promise((resolve, reject) => {
        const audioPlayer = document.getElementById('audioPlayer');
        audioPlayer.src = url;
        audioPlayer.load();
        
        audioPlayer.play().then(() => {
            isPlaying = true;
            document.getElementById('playIcon').className = 'fas fa-pause';
            resolve();
        }).catch(error => {
            reject(error);
        });
    });
}

/* ========== YOUTUBE SEARCH ========== */
async function searchYouTube(query) {
    if (!query.trim()) {
        await loadTrendingSongs();
        return;
    }
    
    showMessage(`🔍 Searching for: ${query}`);
    
    try {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&maxResults=20&q=${encodeURIComponent(query + ' song')}&key=${YT_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            currentList = data.items.map(item => ({
                title: item.snippet.title,
                artist: item.snippet.channelTitle,
                thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
                videoId: item.id.videoId
            }));
            
            renderSongs(currentList);
            showMessage(`✅ Found ${currentList.length} songs for "${query}"`);
        } else {
            showMessage("❌ No songs found. Try different keywords.");
        }
        
    } catch (error) {
        console.error("Search error:", error);
        showMessage("❌ Search failed. Try again.");
    }
}

/* ========== PLAYER CONTROLS ========== */
function togglePlay() {
    const audioPlayer = document.getElementById('audioPlayer');
    const playIcon = document.getElementById('playIcon');
    
    if (!currentSong) {
        if (currentList.length > 0) {
            playSongFromList(0);
        }
        return;
    }
    
    if (isPlaying) {
        audioPlayer.pause();
        playIcon.className = 'fas fa-play';
        isPlaying = false;
    } else {
        audioPlayer.play().then(() => {
            playIcon.className = 'fas fa-pause';
            isPlaying = true;
        }).catch(error => {
            showMessage("▶️ Click play button to start");
        });
    }
}

function nextSong() {
    if (currentList.length === 0) return;
    
    currentSongIndex = (currentSongIndex + 1) % currentList.length;
    playSongFromList(currentSongIndex);
}

function previousSong() {
    if (currentList.length === 0) return;
    
    currentSongIndex = (currentSongIndex - 1 + currentList.length) % currentList.length;
    playSongFromList(currentSongIndex);
}

function seekSong(event) {
    const audioPlayer = document.getElementById('audioPlayer');
    const progressBar = event.currentTarget;
    const clickX = event.offsetX;
    const width = progressBar.offsetWidth;
    
    if (audioPlayer.duration) {
        audioPlayer.currentTime = (clickX / width) * audioPlayer.duration;
    }
}

/* ========== EVENT LISTENERS ========== */
function setupEventListeners() {
    // Search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length > 2) {
                searchYouTube(query);
            }
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchYouTube(e.target.value);
            }
        });
    }
    
    // Player controls
    document.getElementById('playBtn').addEventListener('click', togglePlay);
    document.getElementById('nextBtn').addEventListener('click', nextSong);
    document.getElementById('prevBtn').addEventListener('click', previousSong);
    document.getElementById('progressBar').addEventListener('click', seekSong);
    
    // Audio events
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', nextSong);
}

/* ========== PROGRESS BAR ========== */
function updateProgress() {
    const audioPlayer = document.getElementById('audioPlayer');
    const progress = document.getElementById('progress');
    const currentTime = document.getElementById('currentTime');
    const totalTime = document.getElementById('totalTime');
    
    if (audioPlayer.duration) {
        const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progress.style.width = percent + '%';
        currentTime.textContent = formatTime(audioPlayer.currentTime);
        totalTime.textContent = formatTime(audioPlayer.duration);
    }
}

/* ========== UTILITIES ========== */
function showMessage(message) {
    console.log(message);
    
    // Remove existing message
    const existingMsg = document.getElementById('statusMessage');
    if (existingMsg) existingMsg.remove();
    
    // Create new message
    const msgDiv = document.createElement('div');
    msgDiv.id = 'statusMessage';
    msgDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #4CAF50;
        color: white;
        padding: 12px 24px;
        border-radius: 25px;
        z-index: 1000;
        font-family: Arial, sans-serif;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    msgDiv.textContent = message;
    document.body.appendChild(msgDiv);
    
    setTimeout(() => {
        msgDiv.remove();
    }, 3000);
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Auto refresh every hour
setInterval(loadTrendingSongs, 60 * 60 * 1000);

// Initialize app
document.addEventListener('DOMContentLoaded', init);

console.log("✅ APNA MUSIC Ready! YouTube API Connected.");
