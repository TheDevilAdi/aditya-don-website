// Sample music data
const musicLibrary = [
    {
        id: 1,
        title: "Shape of You",
        artist: "Ed Sheeran",
        duration: "3:53",
        source: "sample"
    },
    {
        id: 2,
        title: "Blinding Lights",
        artist: "The Weeknd",
        duration: "3:20",
        source: "sample"
    },
    {
        id: 3,
        title: "Dance Monkey",
        artist: "Tones and I",
        duration: "3:29",
        source: "sample"
    },
    {
        id: 4,
        title: "Senorita",
        artist: "Shawn Mendes, Camila Cabello",
        duration: "3:10",
        source: "sample"
    },
    {
        id: 5,
        title: "Perfect",
        artist: "Ed Sheeran",
        duration: "4:23",
        source: "sample"
    },
    {
        id: 6,
        title: "Believer",
        artist: "Imagine Dragons",
        duration: "3:24",
        source: "sample"
    }
];

// DOM Elements
const trendingSongsGrid = document.getElementById('trendingSongs');
const searchResultsGrid = document.getElementById('searchResultsGrid');
const musicPlayer = document.getElementById('musicPlayer');
const nowPlayingTitle = document.getElementById('nowPlayingTitle');
const nowPlayingArtist = document.getElementById('nowPlayingArtist');
const playBtn = document.getElementById('playBtn');
const progress = document.getElementById('progress');
const loading = document.getElementById('loading');
const trendingSection = document.getElementById('trendingSection');
const searchResults = document.getElementById('searchResults');

// Trending songs load karega
function loadTrendingSongs() {
    trendingSongsGrid.innerHTML = '';
    musicLibrary.forEach(song => {
        const songCard = createSongCard(song);
        trendingSongsGrid.appendChild(songCard);
    });
}

// Song card banayega
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

// Song play karega
function playSong(song) {
    nowPlayingTitle.textContent = song.title;
    nowPlayingArtist.textContent = song.artist;
    musicPlayer.classList.add('player-active');
    playBtn.innerHTML = '⏸';
    
    // Progress bar simulate karega
    simulatePlayback();
}

// Progress bar simulation
function simulatePlayback() {
    let progressValue = 0;
    const interval = setInterval(() => {
        if (progressValue >= 100) {
            clearInterval(interval);
            musicPlayer.classList.remove('player-active');
            playBtn.innerHTML = '▶';
        } else {
            progressValue += 0.5;
            progress.style.width = progressValue + '%';
        }
    }, 1000);
}

// Search functionality
function searchSongs() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (query === '') return;

    loading.style.display = 'block';
    trendingSection.style.display = 'none';
    searchResults.style.display = 'block';

    setTimeout(() => {
        const filteredSongs = musicLibrary.filter(song => 
            song.title.toLowerCase().includes(query) || 
            song.artist.toLowerCase().includes(query)
        );

        searchResultsGrid.innerHTML = '';
        
        if (filteredSongs.length === 0) {
            searchResultsGrid.innerHTML = '<div class="loading">No songs found</div>';
        } else {
            filteredSongs.forEach(song => {
                const songCard = createSongCard(song);
                searchResultsGrid.appendChild(songCard);
            });
        }
        
        loading.style.display = 'none';
    }, 1000);
}

// Trending section show karega
function showTrending() {
    searchResults.style.display = 'none';
    trendingSection.style.display = 'block';
    document.getElementById('searchInput').value = '';
}

// Play/Pause button
playBtn.addEventListener('click', function() {
    if (this.innerHTML === '▶') {
        this.innerHTML = '⏸';
    } else {
        this.innerHTML = '▶';
    }
});

// Enter key for search
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchSongs();
    }
});

// App initialize karega
loadTrendingSongs();
