// All songs database
const allSongs = [
    { name: "Kesariya", artist: "Arijit Singh", file: "https://www.soundjay.com/button/beep-07.wav" },
    { name: "Apna Bana Le", artist: "Arijit Singh", file: "https://www.soundjay.com/button/beep-07.wav" },
    { name: "Tum Hi Ho", artist: "Arijit Singh", file: "https://www.soundjay.com/button/beep-07.wav" },
    { name: "Channa Mereya", artist: "Arijit Singh", file: "https://www.soundjay.com/button/beep-07.wav" },
    { name: "Shape of You", artist: "Ed Sheeran", file: "https://www.soundjay.com/button/beep-07.wav" },
    { name: "Blinding Lights", artist: "The Weeknd", file: "https://www.soundjay.com/button/beep-07.wav" },
    { name: "Dilbar", artist: "Neha Kakkar", file: "https://www.soundjay.com/button/beep-07.wav" },
    { name: "Senorita", artist: "Shawn Mendes", file: "https://www.soundjay.com/button/beep-07.wav" }
];

// Load songs on page load
window.onload = function() {
    displaySongs(allSongs);
};

// Search function
function searchSongs() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const filteredSongs = allSongs.filter(song => 
        song.name.toLowerCase().includes(searchText) || 
        song.artist.toLowerCase().includes(searchText)
    );
    displaySongs(filteredSongs);
}

// Display songs
function displaySongs(songs) {
    const songList = document.getElementById('songList');
    songList.innerHTML = '';
    
    songs.forEach(song => {
        const songElement = document.createElement('div');
        songElement.className = 'song';
        songElement.innerHTML = `
            <span class="song-name">${song.name}</span>
            <span class="artist">${song.artist}</span>
        `;
        songElement.onclick = () => playSong(song.name, song.artist, song.file);
        songList.appendChild(songElement);
    });
}

// Play song function
function playSong(name, artist, file) {
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.src = file;
    audioPlayer.play();
    
    // Show playing notification
    alert(`Now Playing: ${name} - ${artist}`);
}
