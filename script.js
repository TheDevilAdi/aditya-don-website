// Enhanced Shooting Stars
function createGalaxy() {
    const galaxy = document.getElementById('galaxy');
    for (let i = 0; i < 25; i++) {
        createShootingStar(galaxy);
    }
}

function createShootingStar(container) {
    const star = document.createElement('div');
    star.className = 'shooting-star';
    
    const left = Math.random() * 20;
    const top = Math.random() * 20;
    const delay = Math.random() * 10;
    const duration = Math.random() * 2 + 1;
    
    star.style.left = `${left}%`;
    star.style.top = `${top}%`;
    star.style.animationDelay = `${delay}s`;
    star.style.animationDuration = `${duration}s`;
    
    container.appendChild(star);
}

// Songs Database
const songs = [
    { title: "Tum Hi Ho", artist: "Arijit Singh", album: "Aashiqui 2" },
    { title: "Kesariya", artist: "Arijit Singh", album: "Brahmastra" },
    { title: "Apna Bana Le", artist: "Arijit Singh", album: "Bhediya" },
    { title: "Tere Vaaste", artist: "Sachin-Jigar", album: "Zara Hatke Zara Bachke" },
    { title: "Chaleya", artist: "Arijit Singh, Shilpa Rao", album: "Jawan" },
    { title: "Heeriye", artist: "Arijit Singh", album: "Heeriye" },
    { title: "Satranga", artist: "Arijit Singh", album: "Animal" },
    { title: "Arjan Vailly", artist: "Bhupinder Babbal", album: "Animal" },
    { title: "Pehle Bhi Main", artist: "Vishal Mishra", album: "Animal" }
];

// DOM Elements
const megaSearch = document.getElementById('megaSearch');
const homePage = document.getElementById('homePage');
const resultsPage = document.getElementById('resultsPage');
const songsContainer = document.getElementById('songsContainer');
const nowPlayingBanner = document.getElementById('nowPlayingBanner');
const visualizer = document.getElementById('visualizer');
const songsCount = document.getElementById('songsCount');
const miniModeBtn = document.getElementById('miniModeBtn');
const backBtn = document.getElementById('backBtn');
const loginBtn = document.getElementById('loginBtn');
const premiumBtn = document.getElementById('premiumBtn');
const profileBtn = document.getElementById('profileBtn');

let typingCount = 0;

// Smart Search Logic
megaSearch.addEventListener('input', function(e) {
    const query = e.target.value.trim();
    
    if (query.length > 0) {
        typingCount++;
        
        // Show results page after 3 characters
        if (typingCount >= 3 && query.length >= 3) {
            setTimeout(() => {
                showResultsPage();
                searchSongs(query);
            }, 500);
        }
    }
});

// Show Results Page
function showResultsPage() {
    homePage.style.display = 'none';
    resultsPage.classList.add('active');
}

// Search Songs
function searchSongs(query) {
    const filteredSongs = songs.filter(song => 
        song.title.toLowerCase().includes(query.toLowerCase()) ||
        song.artist.toLowerCase().includes(query.toLowerCase())
    );
    
    displayFilteredSongs(filteredSongs);
}

// Display Filtered Songs
function displayFilteredSongs(songsList) {
    songsContainer.innerHTML = '';
    songsCount.textContent = songsList.length;
    
    if (songsList.length === 0) {
        songsContainer.innerHTML = '<div class="song-card">No songs found. Try different keywords.</div>';
        return;
    }
    
    songsList.forEach((song, index) => {
        const songCard = document.createElement('div');
        songCard.className = 'song-card';
        songCard.innerHTML = `
            <strong>${song.title}</strong>
            <div style="opacity: 0.8; font-size: 0.9rem;">
                ${song.artist} • ${song.album}
            </div>
        `;
        songCard.onclick = () => playSelectedSong(song, songCard);
        songsContainer.appendChild(songCard);
    });
}

// Play Selected Song
function playSelectedSong(song, element) {
    // Remove playing class from all cards
    document.querySelectorAll('.song-card').forEach(card => {
        card.classList.remove('playing');
    });
    
    // Add playing class to current card
    element.classList.add('playing');
    
    // Update now playing banner
    nowPlayingBanner.innerHTML = 
        `🎵 Now Playing: ${song.title} - ${song.artist}`;
    
    // Show visualizer
    visualizer.style.display = 'flex';
    
    // Simulate audio play
    simulateAudioPlay(song.title);
}

// Simulate Audio Play
function simulateAudioPlay(songTitle) {
    console.log(`Playing: ${songTitle}`);
    // Add actual audio player here in real app
    alert(`🎶 "${songTitle}" is now playing!\n\n(Audio simulation - actual audio will play in real app)`);
}

// Toggle Mini Mode
function toggleMiniMode() {
    homePage.classList.toggle('mini-mode');
}

// Go Back Home
function goBackHome() {
    resultsPage.classList.remove('active');
    homePage.style.display = 'block';
    homePage.classList.remove('mini-mode');
    megaSearch.value = '';
    typingCount = 0;
    visualizer.style.display = 'none';
    nowPlayingBanner.innerHTML = '🎧 Select any song to play...';
}

// Simulate Login
function simulateLogin() {
    alert('🚀 Login feature ready!\n\n(Actual login integration will be added in real app)');
}

// Event Listeners
miniModeBtn.addEventListener('click', toggleMiniMode);
backBtn.addEventListener('click', goBackHome);
loginBtn.addEventListener('click', simulateLogin);
premiumBtn.addEventListener('click', () => alert('Premium features activated!'));
profileBtn.addEventListener('click', () => alert('Profile page loading...'));

// Initialize
createGalaxy();

// Auto-create shooting stars every few seconds
setInterval(() => {
    createShootingStar(document.getElementById('galaxy'));
}, 3000);
