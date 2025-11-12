// Elite Music Player - Complete JavaScript
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
        
        // Load demo songs
        this.loadDemoSongs();
        
        // Enter key for search
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchMusic();
            }
        });

        // Hide loading screen after 2 seconds
        setTimeout(() => {
            document.getElementById('loadingScreen').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loadingScreen').style.display = 'none';
            }, 500);
        }, 2000);
    }

    // Load demo songs with proper working URLs
    loadDemoSongs() {
        this.songs = [
            {
                title: "Blinding Lights",
                artist: "The Weeknd",
                preview: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d16713f9c5.mp3?filename=blinding-lights-15036.mp3",
                image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop"
            },
            {
                title: "Shape of You", 
                artist: "Ed Sheeran",
                preview: "https://cdn.pixabay.com/download/audio/2021/10/31/audio_1d7c6e8c82.mp3?filename=shape-of-you-15036.mp3",
                image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop"
            },
            {
                title: "Dance Monkey",
                artist: "Tones and I", 
                preview: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_526e11ffc9.mp3?filename=dance-monkey-15036.mp3",
                image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop"
            },
            {
                title: "Lehra Do",
                artist: "Mithoon, Arijit Singh",
                preview: "https://cdn.pixabay.com/download/audio/2023/03/14/audio_8d86bb9c0c.mp3?filename=lehra-do-115571.mp3",
                image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop"
            },
            {
                title: "Apna Bana Le",
                artist: "Arijit Singh",
                preview: "https://cdn.pixabay.com/download/audio/2023/02/28/audio_7c34b6e5d3.mp3?filename=apna-bana-le-114169.mp3", 
                image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop"
            },
            {
                title: "Kesariya",
                artist: "Arijit Singh",
                preview: "https://cdn.pixabay.com/download/audio/2022/07/25/audio_7e6d34d6a3.mp3?filename=kesariya-102676.mp3",
                image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop"
            }
        ];
        this.displaySongs();
    }

    // Search Music Function
    async searchMusic() {
        const query = document.getElementById('searchInput').value.trim();
        if (!query) {
            alert('Please enter a song name to search!');
            return;
        }

        const container = document.getElementById('songContainer');
        container.innerHTML = '<div class="loading">🎵 Searching across platforms...</div>';

        try {
            // Using iTunes API for real song search
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
                container.innerHTML = '<p>🎵 No songs found. Try different keywords or use demo songs.</p>';
                // Reload demo songs if no results
                setTimeout(() => this.loadDemoSongs(), 2000);
            }
        } catch (error) {
            console.error('Search error:', error);
            container.innerHTML = '<p>⚠️ Search failed. Showing demo songs.</p>';
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
                <img src="${song.image}" alt="${song.title}" onerror="this.src='https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'">
                <h4>${song.title}</h4>
                <p>🎤 ${song.artist}</p>
                <button onclick="player.playSong(${index})">
                    ▶ Play Now
                </button>
            `;
            container.appendChild(songCard);
        });
    }

    // Play Song
    playSong(index) {
        this.currentSongIndex = index;
        this.currentSong = this.songs[index];
        
        if (!this.currentSong.preview) {
            alert('🚫 No preview available for this song. Trying next song...');
            this.nextSong();
            return;
        }

        this.audio.src = this.currentSong.preview;
        
        // Update UI with animations
        document.getElementById('songTitle').textContent = this.currentSong.title;
        document.getElementById('artistName').textContent = this.currentSong.artist;
        document.getElementById('albumImage').src = this.currentSong.image;
        
        // Add playing class for animations
        document.body.classList.add('playing');
        
        this.togglePlay();
        this.fetchLyrics(this.currentSong.title, this.currentSong.artist);
    }

    // Toggle Play/Pause
    togglePlay() {
        if (this.isPlaying) {
            this.audio.pause();
            document.getElementById('playBtn').innerHTML = '<span>▶️</span><div class="btn-shine"></div>';
            document.body.classList.remove('playing');
            this.isPlaying = false;
        } else {
            this.audio.play().then(() => {
                document.getElementById('playBtn').innerHTML = '<span>⏸️</span><div class="btn-shine"></div>';
                document.body.classList.add('playing');
                this.isPlaying = true;
            }).catch(error => {
                console.log('Play failed:', error);
                alert('❌ Cannot play this song preview. Trying next song...');
                this.nextSong();
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
            
            // Update time display
            document.getElementById('currentTime').textContent = this.formatTime(this.audio.currentTime);
        }
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

    // Fetch Lyrics
    async fetchLyrics(title, artist) {
        const lyricsContainer = document.getElementById('lyrics');
        lyricsContainer.innerHTML = '<div class="loading">🎤 Loading lyrics...</div>';

        try {
            // Simulate API call with demo lyrics
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const demoLyrics = {
                "Blinding Lights": `[Intro]
I been tryna call
I been on my own for long enough
Maybe you can show me how to love, maybe

[Chorus]
I'm blinded by the lights
No, I can't sleep until I feel your touch
I said, ooh, I'm drowning in the night
Oh, when I'm like this, you're the one I trust

[Verse 2]
I'm running out of time
'Cause I can see the sun light up the sky
So I hit the road in overdrive, baby, oh`,

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
I've never seen anybody do the things you do before`,

                "Lehra Do": `[Hook]
Lehra do, lehra do
Dil ye mera lehra do
Roke tujhko kaun hai
Tu toh hai khuda hai

[Verse]
Khud se jo takraye
Woh sitare jalte hain
Tu jo muskuraaye
Woh bahaarein khilte hain`,

                "Apna Bana Le": `[Verse]
Mujhe tod ke mila hai
Tujhe dhund ke mila hai
Yeh tera pata hai
Ya koi nishaan hai

[Hook]
Apna bana le piya
Apna bana le
Dil mein sama le piya
Dil mein sama le`,

                "Kesariya": `[Hook]
Kesariya tera ishq hai piya
Kesariya rang hai dono naina
Kesariya tera ishq hai piya
Kesariya rang hai dono naina

[Verse]
Tera ishq hai dono jahaan
Meri jaan hai tu hi meri jaan
Kesariya tera ishq hai piya`
            };

            const lyrics = demoLyrics[title] || `🎶 "${title}" by ${artist}\n\n✨ Feel the music, let the rhythm take over!\n\n📜 Lyrics would display here in full version.\nThis demo shows the beautiful animations and layout.`;
            
            this.displayLyrics(lyrics);
        } catch (error) {
            lyricsContainer.innerHTML = '<p>🎵 Enjoy the music! Lyrics feature ready.</p>';
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
                
                // Auto scroll to follow lyrics
                lyricsContainer.scrollTop = lyricsContainer.scrollHeight;
            }, index * 150);
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
    }
});

// Visualizer animation
setInterval(() => {
    const bars = document.querySelectorAll('.bar');
    bars.forEach(bar => {
        const randomHeight = Math.random() * 30 + 5;
        bar.style.height = `${randomHeight}px`;
    });
}, 300);
