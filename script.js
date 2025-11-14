/* ===========================
   script.js — YouTube Search + Play
   Replace your current script.js with this file.
   KEEP your index.html and style.css unchanged.
   ---------------------------
   After replacing, set YT_API_KEY below.
   =========================== */

/* ========== CONFIG ========== */
// Put your YouTube Data API v3 key here:
const YT_API_KEY = "YOUR_API_KEY_HERE";

// Base for converting YouTube video -> direct audio stream (third-party).
// If this service requires signup or rate-limits, replace with another extractor endpoint.
// Example pattern used below: `${AUDIO_EXTRACTOR_BASE}${videoId}`
const AUDIO_EXTRACTOR_BASE = "https://yt-api.io/api/v1/audio/"; 

/* ========== Local Music Library (fallback) ========== */
const musicLibrary = [
    { id: 1, title: "Shape of You", artist: "Ed Sheeran", audioUrl: "https://assets.codepen.io/4358586/ShapeOfYou.mp3",
      lyrics: ["The club isn't the best place to find a lover", "So the bar is where I go"] },

    { id: 2, title: "Blinding Lights", artist: "The Weeknd", audioUrl: "https://assets.codepen.io/4358586/BlindingLights.mp3",
      lyrics: ["I've been tryna call", "I've been on my own for long enough"] },

    { id: 3, title: "Dance Monkey", artist: "Tones and I", audioUrl: "https://assets.codepen.io/4358586/DanceMonkey.mp3",
      lyrics: ["They say oh my god I see the way you shine"] },

    { id: 4, title: "Lehanga", artist: "Jass Manak", audioUrl: "https://assets.codepen.io/4358586/Lehanga.mp3",
      lyrics: ["Lehanga lehanga tera lehanga"] },

    { id: 5, title: "Lut Gaye", artist: "Jubin Nautiyal", audioUrl: "https://assets.codepen.io/4358586/LutGaye.mp3",
      lyrics: ["Lut gaye lut gaye hum toh tere pyaar mein"] },

    { id: 6, title: "Mann Bharrya", artist: "B Praak", audioUrl: "https://assets.codepen.io/4358586/MannBharrya.mp3",
      lyrics: ["Mann bharrya ve mainu tu hi tu"] },
];

/* ========== DOM ========== */
const trendingSongsGrid = document.getElementById('trendingSongs');
const musicPlayer = document.getElementById('musicPlayer');
const nowPlayingTitle = document.getElementById('nowPlayingTitle');
const nowPlayingArtist = document.getElementById('nowPlayingArtist');
const playIcon = document.getElementById('playIcon');
const progress = document.getElementById('progress');
const currentTime = document.getElementById('currentTime');
const totalTime = document.getElementById('totalTime');
const lyricsContainer = document.getElementById('lyricsContainer');
const lyricsContent = document.getElementById('lyricsContent');
const audioPlayer = document.getElementById('audioPlayer');
const homePage = document.getElementById('homePage');
const profilePage = document.getElementById('profilePage');
const searchInput = document.getElementById('searchInput');

/* ========== State ========== */
let currentSong = null;
let isPlaying = false;
let currentSongIndex = 0;
let currentList = []; // Holds current list (search results or default musicLibrary)

/* ========== Init ========== */
function init() {
    createSparkles();
    currentList = [...musicLibrary];
    loadTrendingSongs(currentList);
    setupEventListeners();
}
document.addEventListener('DOMContentLoaded', init);

/* ========== Sparkles (unchanged) ========== */
function createSparkles() {
    const sparkleBg = document.getElementById('sparkleBg');
    if (!sparkleBg) return;
    for (let i = 0; i < 50; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animationDelay = Math.random() * 3 + 's';
        sparkleBg.appendChild(sparkle);
    }
}

/* ========== UI: load grid ========== */
function loadTrendingSongs(list) {
    trendingSongsGrid.innerHTML = '';
    list.forEach((item, idx) => {
        const card = createSongCard(item, idx);
        trendingSongsGrid.appendChild(card);
    });
}

/* ========== Create card (shows thumbnail if present) ========== */
function createSongCard(item, index) {
    const card = document.createElement('div');
    card.className = 'song-card';

    // Build image/thumbnail area: If item.thumbnail exists show <img>, else emoji
    const thumbHtml = item.thumbnail ? `<img src="${item.thumbnail}" alt="${escapeHtml(item.title)}" style="width:100%;height:100%;object-fit:cover;border-radius:4px;">`
                                      : '🎵';

    card.innerHTML = `
        <div class="song-image">${thumbHtml}</div>
        <div class="song-title">${escapeHtml(item.title)}</div>
        <div class="song-artist">${escapeHtml(item.artist || '')}</div>
    `;

    card.addEventListener('click', () => {
        playSongFromList(index);
    });
    return card;
}

/* ========== Play flow ========== */
function playSongFromList(index) {
    // get item from currentList
    const item = currentList[index];
    if (!item) return;

    currentSong = item;
    currentSongIndex = index;
    nowPlayingTitle.textContent = item.title;
    nowPlayingArtist.textContent = item.artist || 'Unknown';
    musicPlayer.classList.add('active');
    lyricsContainer.classList.add('active');

    // Try to get audio URL:
    if (item.videoId) {
        // If item came from YouTube search, build extractor URL
        const audioUrl = AUDIO_EXTRACTOR_BASE + item.videoId;
        setAndPlayAudio(audioUrl, item);
    } else if (item.audioUrl) {
        // local fallback
        setAndPlayAudio(item.audioUrl, item);
    } else {
        console.warn("No playable source for item", item);
    }
}

function setAndPlayAudio(url, itemMeta) {
    // Set audio src and attempt play
    audioPlayer.src = url;
    audioPlayer.crossOrigin = "anonymous";
    audioPlayer.load();

    audioPlayer.play().then(() => {
        isPlaying = true;
        playIcon.className = 'fas fa-pause';
    }).catch((err) => {
        // Autoplay blocked or extractor blocked — show play icon to ask user to tap
        console.warn('Play failed (autoplay or CORS):', err);
        isPlaying = false;
        playIcon.className = 'fas fa-play';
    });

    // Update lyrics if available
    if (itemMeta.lyrics) displayLyrics(itemMeta.lyrics);
    else displayLyrics([]);
}

/* ========== Toggle play/pause button ========== */
function togglePlay() {
    if (!currentSong) return;
    if (isPlaying) {
        audioPlayer.pause();
        playIcon.className = 'fas fa-play';
    } else {
        audioPlayer.play().then(() => {
            playIcon.className = 'fas fa-pause';
        }).catch(e => {
            console.warn('Play blocked, user interaction required.', e);
        });
    }
    isPlaying = !isPlaying;
}

/* ========== Audio progress & ended handlers ========== */
audioPlayer.addEventListener('timeupdate', () => {
    if (!audioPlayer.duration) return;
    const pct = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progress.style.width = pct + '%';
    currentTime.textContent = formatTime(audioPlayer.currentTime);
    totalTime.textContent = formatTime(audioPlayer.duration);
});

audioPlayer.addEventListener('ended', () => {
    nextSong();
});

/* ========== Next / Previous ========== */
function nextSong() {
    if (!currentList || currentList.length === 0) return;
    currentSongIndex = (currentSongIndex + 1) % currentList.length;
    playSongFromList(currentSongIndex);
}
function previousSong() {
    if (!currentList || currentList.length === 0) return;
    currentSongIndex = (currentSongIndex - 1 + currentList.length) % currentList.length;
    playSongFromList(currentSongIndex);
}

/* ========== Seek ========== */
function seekSong(event) {
    if (!audioPlayer.duration) return;
    const pct = event.offsetX / event.currentTarget.offsetWidth;
    audioPlayer.currentTime = pct * audioPlayer.duration;
}

/* ========== Lyrics ========== */
function displayLyrics(lines) {
    if (!lyricsContent) return;
    if (!lines || lines.length === 0) {
        lyricsContent.innerHTML = `<div style="color:var(--text-secondary)">No lyrics</div>`;
        return;
    }
    lyricsContent.innerHTML = lines.map(l => `<div class="lyrics-line">${escapeHtml(l)}</div>`).join('');
}

/* ========== Search: uses YouTube Data API (if API key provided) ==========
   If API key missing or API fails, falls back to local library search.
=================================== */
async function doYoutubeSearch(query) {
    if (!YT_API_KEY || YT_API_KEY === "YOUR_API_KEY_HERE") {
        // No API key: fallback to local search
        return localSearch(query);
    }

    const q = encodeURIComponent(query);
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=12&q=${q}&key=${YT_API_KEY}`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('YT API HTTP ' + res.status);
        const data = await res.json();

        // Map to our item structure
        const items = data.items.map(it => ({
            title: it.snippet.title,
            artist: it.snippet.channelTitle,
            thumbnail: it.snippet.thumbnails?.high?.url || it.snippet.thumbnails?.default?.url || '',
            videoId: it.id.videoId,
            lyrics: [] // optional: we don't have lyrics from YT
        }));

        // Set currentList and render
        currentList = items;
        loadTrendingSongs(currentList);
        return items;
    } catch (err) {
        console.warn('YouTube search failed:', err);
        // fallback
        return localSearch(query);
    }
}

function localSearch(q) {
    const ql = (q || '').toLowerCase().trim();
    const results = musicLibrary.filter(s => s.title.toLowerCase().includes(ql) || s.artist.toLowerCase().includes(ql));
    // Map to keep consistency
    const mapped = results.map(r => ({ ...r }));
    currentList = mapped;
    loadTrendingSongs(currentList);
    return mapped;
}

/* ========== Setup UI listeners ========== */
function setupEventListeners() {
    // Search input with debounce
    let timer = null;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(timer);
        const q = e.target.value.trim();
        timer = setTimeout(() => {
            if (!q) {
                // If empty, show default (local library)
                currentList = [...musicLibrary];
                loadTrendingSongs(currentList);
                return;
            }
            // Try YouTube search (or fallback)
            doYoutubeSearch(q);
        }, 350);
    });

    // Enter key blur
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') e.target.blur();
    });

    // Player control buttons (these are inline in HTML but ensure functions exist)
    // play button uses togglePlay() via inline onclick, ok.
}

/* ========== Utilities ========== */
function formatTime(secs) {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function(m) {
        return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m];
    });
}

/* ========== End of script.js ========== */
