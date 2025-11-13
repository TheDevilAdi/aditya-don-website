// APNA MUSIC Player - Updated with Theme Toggle
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
        
        // Load better demo songs
        this.loadBetterSongs();
        
        // Enter key for search
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchMusic();
            }
        });

        // Load saved theme
        this.loadTheme();

        // Faster loading
        setTimeout(() => {
            document.getElementById('loadingScreen').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loadingScreen').style.display = 'none';
            }, 300);
        }, 1200);
    }

    // Load saved theme
    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        if (savedTheme === 'light') {
            this.enableLightTheme();
        } else {
            this.enableDarkTheme();
        }
    }

    // Enable Light Theme
    enableLightTheme() {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        document.getElementById('themeBtn').innerHTML = `
            <span class="theme-icon">☀️</span>
            <span class="theme-text">Light</span>
            <div class="theme-glow"></div>
        `;
        localStorage.setItem('theme', 'light');
    }

    // Enable Dark Theme
    enableDarkTheme() {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        document.getElementById('themeBtn').innerHTML = `
            <span class="theme-icon">🌙</span>
            <span class="theme-text">Dark</span>
            <div class="theme-glow"></div>
        `;
        localStorage.setItem('theme', 'dark');
    }

    // Toggle Theme with Animation
    toggleTheme() {
        document.body.classList.add('theme-changing');
        
        if (document.body.classList.contains('dark-theme')) {
            this.enableLightTheme();
        } else {
            this.enableDarkTheme();
        }
        
        setTimeout(() => {
            document.body.classList.remove('theme-changing');
        }, 500);
    }

    // Better working songs
    loadBetterSongs() {
        this.songs = [
            {
                title: "Blinding Lights",
                artist: "The Weeknd",
                preview: "https://www.soundjay.com/music/sounds/rock-guitar-riff-2.mp3",
                image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop"
            },
            {
                title: "Shape of You", 
                artist: "Ed Sheeran",
                preview: "https://www.soundjay.com/music/sounds/acoustic-guitar-riff-1.mp3",
                image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop"
            },
            {
                title: "Dance Monkey",
                artist: "Tones and I", 
                preview: "https://www.soundjay.com/music/sounds/piano-melody-1.mp3",
                image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop"
            },
            {
                title: "Lehra Do",
                artist: "Arijit Singh",
                preview: "https://www.soundjay.com/music/sounds/violin-tune-1.mp3",
                image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop"
            },
            {
                title: "Apna Bana Le",
                artist: "Arijit Singh",
                preview: "https://www.soundjay.com/music/sounds/flute-melody-1.mp3", 
                image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop"
            },
            {
                title: "Kesariya",
                artist: "Arijit Singh",
                preview: "https://www.soundjay.com/music/sounds/tabla-beat-1.mp3",
                image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop"
            }
        ];
        this.displaySongs();
    }

    // Search Music - English Messages
    async searchMusic() {
        const query = document.getElementById('searchInput').value.trim();
        if (!query) {
            this.showMessage('Please enter a song name to search!', 'info');
            return;
        }

        const container = document.getElementById('songContainer');
        container.innerHTML = '<div class="loading">🎵 Searching songs...</div>';

        try {
            const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=15`);
            
            if (!response.ok) throw new Error('API error');
            
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                this.songs = data.results.slice(0, 6).map(track => ({
                    title: track.trackName,
                    artist: track.artistName,
                    preview: track.previewUrl,
                    image: track.artworkUrl100.replace('100x100', '300x300')
                })).filter(song => song.preview);

                this.displaySongs();
                
                if (this.songs.length === 0) {
                    this.showMessage('No song previews available', 'info');
                    this.loadBetterSongs();
                }
            } else {
                this.showMessage('No songs found with this name', 'info');
                this.loadBetterSongs();
            }
        } catch (error) {
            console.error('Search error:', error);
            this.showMessage('Search failed - showing demo songs', 'error');
            this.loadBetterSongs();
        }
    }

    // English Messages Only
    showMessage(message, type = 'info') {
        const colors = {
            info: '#00ff88',
            error: '#ff0080',
            warning: '#ff8c00'
        };
        
        const tempMsg = document.createElement('div');
        tempMsg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 12px 20px;
            border-radius: 10px;
            z-index: 1000;
            font-weight: 600;
            font-family: 'Exo 2', sans-serif;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            animation: messageSlide 0.3s ease;
        `;
        tempMsg.textContent = message;
        document.body.appendChild(tempMsg);
        
        setTimeout(() => {
            tempMsg.style.animation = 'messageSlideOut 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(tempMsg)) {
                    document.body.removeChild(tempMsg);
                }
            }, 300);
        }, 3000);
    }

    // Display Songs
    displaySongs() {
        const container = document.getElementById('songContainer');
        container.innerHTML = '';

        this.songs.forEach((song, index) => {
            const songCard = document.createElement('div');
            songCard.className = 'song-card';
            songCard.innerHTML = `
                <img src="${song.image}" alt="${song.title}" 
                     onerror="this.src='https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'">
                <h4>${song.title}</h4>
                <p>🎤 ${song.artist}</p>
                <button onclick="player.playSong(${index})">
                    ▶ Play Now
                </button>
            `;
            container.appendChild(songCard);
        });
    }

    // Play Song - English Errors
    playSong(index) {
        this.currentSongIndex = index;
        this.currentSong = this.songs[index];
        
        // Reset audio
        this.audio.pause();
        this.audio.currentTime = 0;
        
        if (!this.currentSong.preview) {
            this.showMessage('No preview available - trying next song', 'warning');
            setTimeout(() => this.nextSong(), 1000);
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
            document.getElementById('playBtn').innerHTML = `
                <span class="btn-icon">▶️</span>
                <div class="btn-hover"></div>
                <div class="btn-shine"></div>
            `;
            document.body.classList.remove('playing');
            this.isPlaying = false;
        } else {
            this.audio.play().then(() => {
                document.getElementById('playBtn').innerHTML = `
                    <span class="btn-icon">⏸️</span>
                    <div class="btn-hover"></div>
                    <div class="btn-shine"></div>
                `;
                document.body.classList.add('playing');
                this.isPlaying = true;
            }).catch(error => {
                console.log('Play failed:', error);
                this.showMessage('Cannot play this song - trying next', 'error');
                setTimeout(() => this.nextSong(), 1500);
            });
        }
    }

    // Next Song
    nextSong() {
        if (this.songs.length === 0) return;
        this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length;
        this.playSong(this.currentSongIndex);
    }

    // Previous Song
    previousSong() {
        if (this.songs.length === 0) return;
        this.currentSongIndex = (this.currentSongIndex - 1 + this.songs.length) % this.songs.length;
        this.playSong(this.currentSongIndex);
    }

    // Update Progress Bar
    updateProgress() {
        if (this.audio.duration) {
            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            document.getElementById('progress').style.width = `${progress}%`;
            
            document.getElementById('currentTime').textContent = this.formatTime(this.audio.currentTime);
        }
    }

    // Update Duration
    updateDuration() {
        document.getElementById('duration').textContent = this.formatTime(this.audio.duration);
    }

    // Format Time
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

    // Fetch Lyrics
    async fetchLyrics(title, artist) {
        const lyricsContainer = document.getElementById('lyrics');
        lyricsContainer.innerHTML = '<div class="loading">🎤 Loading lyrics...</div>';

        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const demoLyrics = {
                "Blinding Lights": `I been tryna call
I been on my own for long enough
Maybe you can show me how to love, maybe

I'm blinded by the lights
No, I can't sleep until I feel your touch
I said, ooh, I'm drowning in the night
Oh, when I'm like this, you're the one I trust`,

                "Shape of You": `The club isn't the best place to find a lover
So the bar is where I go
Me and my friends at the table doing shots
Drinking fast and then we talk slow

I'm in love with the shape of you
We push and pull like a magnet do
Although my heart is falling too
I'm in love with your body`,

                "Dance Monkey": `They say, oh my god, I see the way you shine
Take your hand, my dear, and place them both in mine
You know you stopped me dead while I was passing by
And now I beg to see you dance just one more time

So I say
Dance for me, dance for me, dance for me, oh-oh-oh
I've never seen anybody do the things you do before`,

                "Lehra Do": `Lehra do, lehra do
Dil ye mera lehra do
Roke tujhko kaun hai
Tu toh hai khuda hai

Khud se jo takraye
Woh sitare jalte hain
Tu jo muskuraaye
Woh bahaarein khilte hain`,

                "Apna Bana Le": `Mujhe tod ke mila hai
Tujhe dhund ke mila hai
Yeh tera pata hai
Ya koi nishaan hai

Apna bana le piya
Apna bana le
Dil mein sama le piya
Dil mein sama le`,

                "Kesariya": `Kesariya tera ishq hai piya
Kesariya rang hai dono naina
Kesariya tera ishq hai piya
Kesariya rang hai dono naina

Tera ishq hai dono jahaan
Meri jaan hai tu hi meri jaan
Kesariya tera ishq hai piya`
            };

            const lyrics = demoLyrics[title] || `🎵 "${title}" by ${artist}

✨ Feel the music vibe!
🎶 Lyrics feature active
📜 Full version would show complete lyrics`;

            this.displayLyrics(lyrics);
        } catch (error) {
            lyricsContainer.innerHTML = '<p>🎵 Enjoy the music! Lyrics loaded.</p>';
        }
    }

    // Display Lyrics
    displayLyrics(lyrics) {
        const lyricsContainer = document.getElementById('lyrics');
        lyricsContainer.innerHTML = '';
        
        const lines = lyrics.split('\n');
        
        lines.forEach((line, index) => {
            setTimeout(() => {
                if (line.trim()) {
                    const p = document.createElement('p');
                    p.className = 'lyrics-line';
                    p.textContent = line;
                    lyricsContainer.appendChild(p);
                }
            }, index * 120);
        });
    }
}

// Global functions
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
    player.toggleTheme();
}

// Initialize player
let player;
document.addEventListener('DOMContentLoaded', () => {
    player = new MusicPlayer();
});

// Message animations
const style = document.createElement('style');
style.textContent = `
    @keyframes messageSlide {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes messageSlideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

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
    if (e.target.tagName === 'INPUT') return;
    
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
        case 'KeyT':
            player.toggleTheme();
            break;
    }
});

// Visualizer animation
setInterval(() => {
    const bars = document.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        const randomHeight = Math.random() * 25 + 8;
        bar.style.height = `${randomHeight}px`;
        bar.style.opacity = Math.random() * 0.5 + 0.5;
    });
}, 400);
