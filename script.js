// New Functions for fixes
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
}

function handleSearch(query) {
    const searchText = document.getElementById('searchText');
    
    if (query.trim() === '') {
        searchText.classList.remove('show');
        showPage('home');
        return;
    }
    
    // Show what user is typing
    searchText.textContent = `Searching: "${query}"`;
    searchText.classList.add('show');
    
    // Show search page
    showPage('search');
    
    // Simulate YouTube-like search (in real app, this would call API)
    simulateYouTubeSearch(query);
}

function simulateYouTubeSearch(query) {
    const searchResults = document.getElementById('searchResults');
    
    // Clear previous results
    searchResults.innerHTML = '';
    
    // Simulate search results
    const mockResults = [
        {
            title: `${query} - Official Video`,
            artist: "Various Artists",
            videoId: "demo"
        },
        {
            title: `${query} - Full Song`,
            artist: "Popular Artist", 
            videoId: "demo"
        },
        {
            title: `${query} - Lyrics Video`,
            artist: "Music Label",
            videoId: "demo"
        }
    ];
    
    // Add mock results
    mockResults.forEach((song, index) => {
        const songCard = createSongCard(song, index);
        searchResults.appendChild(songCard);
    });
}

// Modified showPage function
function showPage(page) {
    // Hide all pages
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('searchPage').style.display = 'none';
    document.getElementById('profilePage').style.display = 'none';
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to clicked nav item
    event.target.classList.add('active');
    
    // Show selected page
    if (page === 'home') {
        document.getElementById('homePage').style.display = 'block';
    } else if (page === 'search') {
        document.getElementById('searchPage').style.display = 'block';
        document.getElementById('searchPage').classList.add('active');
    } else if (page === 'profile') {
        document.getElementById('profilePage').style.display = 'block';
        document.getElementById('profilePage').classList.add('active');
    }
}

// YouTube-like music playback function
function playYouTubeLike(song) {
    // In real app, this would use YouTube API
    // For now, we'll use our existing audio files
    
    currentSong = song;
    
    // Update UI
    nowPlayingTitle.textContent = song.title;
    nowPlayingArtist.textContent = song.artist;
    musicPlayer.classList.add('active');
    lyricsContainer.classList.add('active');
    
    // Try to play from our library first
    const librarySong = musicLibrary.find(s => 
        s.title.toLowerCase().includes(song.title.toLowerCase()) || 
        song.title.toLowerCase().includes(s.title.toLowerCase())
    );
    
    if (librarySong) {
        audioPlayer.src = librarySong.audioUrl;
        displayLyrics(librarySong.lyrics);
    } else {
        // Fallback to sample audio
        audioPlayer.src = "https://assets.codepen.io/4358586/ShapeOfYou.mp3";
        displayLyrics(["Song is playing...", "Enjoy the music!", "Lyrics loading..."]);
    }
    
    // Play the audio
    playAudio();
}

// Update the playSong function to use YouTube-like
function playSong(song, index) {
    playYouTubeLike(song);
    currentSongIndex = index;
}
