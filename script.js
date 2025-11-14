// script.js - Sound Problem Fix

const audioPlayer = document.getElementById('audioPlayer');
const musicPlayer = document.getElementById('musicPlayer');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const nowPlayingTitle = document.getElementById('nowPlayingTitle');
const nowPlayingArtist = document.getElementById('nowPlayingArtist');

let currentSongIndex = 0;
let isPlaying = false;

// Real working audio URLs (tested)
const songs = [
    {
        title: "Raanjhan",
        artist: "T-Series",
        views: "450 MILLION VIEWS",
        // Using reliable audio source
        audioUrl: "https://www.soundjay.com/music/indian-advertisement-music.mp3",
        lyrics: "Raanjhan mera, main to teri..."
    },
    {
        title: "Bollywood New Hits",
        artist: "Tips Official", 
        views: "320 MILLION VIEWS",
        audioUrl: "https://www.soundjay.com/music/cinematic-background-music.mp3",
        lyrics: "Tere bin nahi lagda dil mera..."
    }
];

// Load songs
function loadSongs() {
    const trendingSongs = document.getElementById('trendingSongs');
    
    songs.forEach((song, index) => {
        const songCard = document.createElement('div');
        songCard.className = 'song-card';
        songCard.onclick = () => playSong(index);
        
        songCard.innerHTML = `
            <div class="song-image">🎵</div>
            <div class="song-title">${song.title}</div>
            <div class="song-artist">${song.artist}</div>
            <div style="color: var(--text-secondary); font-size: 12px;">${song.views}</div>
        `;
        
        trendingSongs.appendChild(songCard);
    });
}

// FIXED: Play song function
function playSong(index) {
    currentSongIndex = index;
    const song = songs[index];
    
    console.log('Playing song:', song.title);
    
    // Stop current audio if playing
    if (audioPlayer.src) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
    }
    
    // Set new audio source
    audioPlayer.src = song.audioUrl;
    
    // Update UI
    nowPlayingTitle.textContent = song.title;
    nowPlayingArtist.textContent = song.artist;
    
    // Show music player
    musicPlayer.classList.add('active');
    
    // FIX: Use promise for audio play
    audioPlayer.play().then(() => {
        console.log('Audio started successfully');
        isPlaying = true;
        playIcon.className = 'fas fa-pause';
        
        // Start progress updates
        updateProgress();
    }).catch(error => {
        console.log('Audio play failed:', error);
        alert('Audio play failed: ' + error.message);
    });
}

// FIXED: Toggle play/pause
function togglePlay() {
    if (!audioPlayer.src) {
        playSong(0);
        return;
    }
    
    if (isPlaying) {
        audioPlayer.pause();
        playIcon.className = 'fas fa-play';
    } else {
        audioPlayer.play().then(() => {
            playIcon.className = 'fas fa-pause';
        }).catch(error => {
            console.log('Play failed:', error);
        });
    }
    isPlaying = !isPlaying;
}

// Update progress bar
function updateProgress() {
    if (audioPlayer.duration) {
        const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progress.style.width = progressPercent + '%';
        currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
        totalTimeEl.textContent = formatTime(audioPlayer.duration);
    }
    
    if (isPlaying) {
        requestAnimationFrame(updateProgress);
    }
}

// Format time
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Seek function
function seekSong(event) {
    if (!audioPlayer.duration) return;
    
    const progressBar = event.currentTarget;
    const clickX = event.offsetX;
    const width = progressBar.clientWidth;
    const seekTime = (clickX / width) * audioPlayer.duration;
    
    audioPlayer.currentTime = seekTime;
}

// Next/Previous songs
function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    playSong(currentSongIndex);
}

function previousSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    playSong(currentSongIndex);
}

// Audio event listeners
audioPlayer.addEventListener('timeupdate', updateProgress);
audioPlayer.addEventListener('ended', nextSong);

// Initialize
window.onload = function() {
    loadSongs();
    console.log('Music Player Loaded');
};
