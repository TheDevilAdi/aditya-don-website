// Music Player Class
class MusicPlayer {
    constructor() {
        this.currentSong = null;
        this.isPlaying = false;
        this.currentSongIndex = 0;
        this.audio = document.getElementById('audioPlayer');
        this.songs = [];
        this.init();
    }

    init() {
        // Event listeners
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('ended', () => this.nextSong());
        
        // Load demo songs initially
        this.loadDemoSongs();
        
        // Enter key for search
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchMusic();
            }
        });
    }

    // Load demo songs
    loadDemoSongs() {
        this.songs = [
            {
                title: "Blinding Lights",
                artist: "The Weeknd",
                preview: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d16713f9c5.mp3?filename=blinding-lights-15036.mp3",
                image: "https://i.ytimg.com/vi/4NRXx6U8ABQ/maxresdefault.jpg"
            },
            {
                title: "Shape of You",
                artist: "Ed Sheeran",
                preview: "https://cdn.pixabay.com/download/audio/2021/10/31/audio_1d7c6e8c82.mp3?filename=shape-of-you-15036.mp3",
                image: "https://i.ytimg.com/vi/JGwWNGJdvx8/maxresdefault.jpg"
            },
            {
                title: "Dance Monkey",
                artist: "Tones and I",
                preview: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_526e11ffc9.mp3?filename=dance-monkey-15036.mp3",
                image: "https://i.ytimg.com/vi/q0hyYWKXF0Q/maxresdefault.jpg"
            }
        ];
        this.displaySongs();
    }

    // Search Music
    async searchMusic() {
        const query = document.getElementById('searchInput').value.trim();
        if (!query) return;

        // Show loading
        const container = document.getElementById('songContainer');
        container.innerHTML = '<div class="loading">🔍 Searching...</div>';

        try {
            // Using iTunes API for demo (in real project, use proper music API)
            const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=20`);
            const data = await response.json();
            
            this.songs = data.results.map(track => ({
                title: track.trackName,
                artist: track.artistName,
                preview: track.previewUrl,
                image: track.artworkUrl100.replace('100x100', '300x300')
            })).filter(song => song.preview); // Only songs with preview

            this.displaySongs();
            
            if (this.songs.length === 0) {
                container.innerHTML = '<p>No songs found. Try different keywords.</p>';
            }
        } catch (error) {
            console.error('Search error:', error);
            container.innerHTML = '<p>Search failed. Using demo songs.</p>';
            this.loadDemoSongs();
        }
    }

    // Display Songs
    displaySongs() {
        const container = document.getElementById('songContainer');
        container.innerHTML = '';

        this.songs.forEach((song, index) => {
            const songCard = document.createElement('div');
            songCard.className = 'song-card';
            songCard.innerHTML = `
                <img src="${song.image}" alt="${song.title}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 10px; margin-bottom: 10px;">
                <h4>${song.title}</h4>
                <p>🎤 ${song.artist}</p>
                <button onclick="player.playSong(${index})">▶ Play Now</button>
            `;
            container.appendChild(songCard);
        });
    }

    // Play Song
    playSong(index) {
        this.currentSongIndex = index;
        this.currentSong = this.songs[index];
        
        if (!this.currentSong.preview) {
            alert('No preview available for this song');
            return;
        }

        this.audio.src = this.currentSong.preview;
        
        // Update UI
        document.getElementById('songTitle').textContent = this.currentSong.title;
        document.getElementById('artistName').textContent = this.currentSong.artist;
        document.getElementById('albumImage').src = this.currentSong.image;
        
        this.togglePlay();
        this.fetchLyrics(this.currentSong.title, this.currentSong.artist);
    }

    // Toggle Play/Pause
    togglePlay() {
        if (this.isPlaying) {
            this.audio.pause();
            document.getElementById('playBtn').textContent = '▶️';
            document.body.classList.remove('playing');
        } else {
            this.audio.play().then(() => {
                document.getElementById('playBtn').textContent = '⏸️';
                document.body.classList.add('playing');
                this.isPlaying = true;
            }).catch(error => {
                console.log('Play failed:', error);
                alert('Cannot play this song preview');
            });
        }
    }

    // Next Song
    nextSong() {
        this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length;
        this.playSong(this.currentSongIndex);
    }

    // Previous Song
    previousSong() {
        this.currentSongIndex = (this.currentSongIndex - 1 + this.songs.length) % this.songs.length;
        this.playSong(this.currentSongIndex);
    }

    // Update Progress Bar
    updateProgress() {
        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        document.getElementById('progress').style.width = `${progress}%`;
        
        // Update time display
        document.getElementById('currentTime').textContent = this.formatTime(this.audio.currentTime);
    }

    // Update Duration
    updateDuration() {
        document.getElementById('duration').textContent = this.formatTime(this.audio.duration);
    }

    // Format Time (seconds to MM:SS)
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Set Volume
    setVolume(volume) {
        this.audio.volume = volume;
    }

    // Fetch Lyrics (Demo - in real project use proper lyrics API)
    async fetchLyrics(title, artist) {
        const lyricsContainer = document.getElementById('lyrics');
        lyricsContainer.innerHTML = '<div class="loading">🎤 Loading lyrics...</div>';

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Demo lyrics data
            const demoLyrics = {
                "Blinding Lights": `[Verse 1]
I been tryna call
I been on my own for long enough
Maybe you can show me how to love, maybe

[Chorus]
I'm blinded by the lights
No, I can't sleep until I feel your touch
I said, ooh, I'm drowning in the night
Oh, when I'm like this, you're the one I trust`,

                "Shape of You": `[Verse 1]
The club isn't the best place to find a lover
So the bar is where I go
Me and my friends at the table doing shots
Drinking fast and then we talk slow

[Chorus]
I'm in love with the shape of you
We push and pull like a magnet do
Although my heart is falling too
I'm in love with your body`,

                "Dance Monkey": `[Verse 1]
They say, oh my god, I see the way you shine
Take your hand, my dear, and place them both in mine
You know you stopped me dead while I was passing by
And now I beg to see you dance just one more time

[Chorus]
So I say
Dance for me, dance for me, dance for me, oh-oh-oh
I've never seen anybody do the things you do before`
            };

            const lyrics = demoLyrics[title] || `Lyrics for "${title}" by ${artist} not available in demo.\n\nThis is a demo version. In a real application, you would integrate with a lyrics API like Genius or Lyrics.ovh to get actual song lyrics.`;
            
            this.displayLyrics(lyrics);
        } catch (error) {
            lyricsContainer.innerHTML = '<p>❌ Failed to load lyrics</p>';
        }
    }

    // Display Lyrics with Animation
    displayLyrics(lyrics) {
        const lyricsContainer = document.getElementById('lyrics');
        lyricsContainer.innerHTML = '';
        
        const lines = lyrics.split('\n');
        
        lines.forEach((line, index) => {
            setTimeout(() => {
                const p = document.createElement('p');
                p.className = 'lyrics-line';
                p.textContent = line;
                lyricsContainer.appendChild(p);
                
                // Auto scroll to latest line
                lyricsContainer.scrollTop = lyricsContainer.scrollHeight;
            }, index * 100);
        });
    }
}

// Global functions for HTML onclick
function searchMusic() {
    player.searchMusic();
}

function togglePlay() {
    player.togglePlay();
}

function nextSong() {
    player.nextSong();
}

function previousSong() {
    player.previousSong();
}

function setVolume(value) {
    player.setVolume(value);
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    // Save theme preference
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Initialize player when page loads
let player;
document.addEventListener('DOMContentLoaded', () => {
    player = new MusicPlayer();
    
    // Load saved theme
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.remove('dark-theme');
    }
});

// Progress bar click to seek
document.querySelector('.progress-bar').addEventListener('click', (e) => {
    const progressBar = e.currentTarget;
    const clickPosition = e.offsetX;
    const progressBarWidth = progressBar.clientWidth;
    const percentage = clickPosition / progressBarWidth;
    
    if (player.audio.duration) {
        player.audio.currentTime = percentage * player.audio.duration;
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    switch(e.code) {
        case 'Space':
            e.preventDefault();
            player.togglePlay();
            break;
        case 'ArrowRight':
            player.nextSong();
            break;
        case 'ArrowLeft':
            player.previousSong();
            break;
        case 'ArrowUp':
            player.setVolume(Math.min(1, player.audio.volume + 0.1));
            break;
        case 'ArrowDown':
            player.setVolume(Math.max(0, player.audio.volume - 0.1));
            break;
    }
});
