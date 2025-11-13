// Stars Creation
function createStars() {
    const starsContainer = document.getElementById('stars');
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random properties
        const size = Math.random() * 3 + 1;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const animationDuration = Math.random() * 3 + 2;
        const animationDelay = Math.random() * 5;
        
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${left}%`;
        star.style.top = `${top}%`;
        star.style.animationDuration = `${animationDuration}s`;
        star.style.animationDelay = `${animationDelay}s`;
        
        starsContainer.appendChild(star);
    }
}

// Sample Songs Data
const songs = [
    { title: "Tum Hi Ho - Aashiqui 2", artist: "Arijit Singh" },
    { title: "Kesariya - Brahmastra", artist: "Arijit Singh" },
    { title: "Apna Bana Le", artist: "Arijit Singh" },
    { title: "Tere Vaaste", artist: "Sachin-Jigar" },
    { title: "Chaleya", artist: "Arijit Singh, Shilpa Rao" },
    { title: "Heeriye", artist: "Arijit Singh" },
    { title: "Satranga", artist: "Arijit Singh" },
    { title: "Arjan Vailly", artist: "Animal" }
];

let searchCount = 0;
const searchBox = document.getElementById('searchBox');

// Search Functionality
searchBox.addEventListener('input', function(e) {
    if (e.target.value.length > 0) {
        searchCount++;
        
        // After 3 lines, show second page
        if (searchCount >= 3) {
            showSecondPage();
            displaySongs();
        }
    }
});

// Show Second Page
function showSecondPage() {
    document.getElementById('firstPage').style.display = 'none';
    document.getElementById('secondPage').style.display = 'block';
}

// Display Songs
function displaySongs() {
    const songList = document.getElementById('songList');
    songList.innerHTML = '';
    
    songs.forEach((song, index) => {
        const songItem = document.createElement('div');
        songItem.className = 'song-item';
        songItem.innerHTML = `
            <strong>${song.title}</strong>
            <br>
            <small>${song.artist}</small>
        `;
        songItem.onclick = () => playSong(song.title);
        songList.appendChild(songItem);
    });
}

// Play Song
function playSong(songTitle) {
    document.getElementById('nowPlaying').textContent = `Now Playing: ${songTitle}`;
    alert(`🎵 ${songTitle} is playing!`);
}

// Minimize First Page
function minimizeFirstPage() {
    const firstPage = document.getElementById('firstPage');
    firstPage.classList.toggle('minimized');
}

// Auto Back to First Page
function goBackToFirstPage() {
    document.getElementById('secondPage').style.display = 'none';
    document.getElementById('firstPage').style.display = 'block';
    searchBox.value = '';
    searchCount = 0;
}

// Initialize
createStars();
