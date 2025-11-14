// Your Personal YouTube API Key
const YOUTUBE_API_KEY = 'AIzaSyBe358vzxK0I5xUcAYGYMAjWH9CyGIv2sk';

// Search Music Function
function searchMusic() {
    const songName = document.getElementById('musicSearchInput').value.trim();
    const resultsDiv = document.getElementById('musicResultsContainer');
    
    if (!songName) {
        alert('Koi song ka naam likho!');
        return;
    }
    
    // Show loading
    resultsDiv.innerHTML = '<div style="color: white; text-align: center; padding: 20px; font-size: 18px;">🎵 Songs dhoond raha hoon...</div>';
    
    // YouTube API call
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${encodeURIComponent(songName + ' song official music')}&type=video&key=${YOUTUBE_API_KEY}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.items && data.items.length > 0) {
                showMusicResults(data.items);
            } else {
                resultsDiv.innerHTML = '<div style="color: white; text-align: center; padding: 20px;">Koi song nahi mila 😢</div>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            resultsDiv.innerHTML = '<div style="color: red; text-align: center; padding: 20px;">Search fail ho gaya. Phir try karo.</div>';
        });
}

// Show Music Results
function showMusicResults(videos) {
    const resultsDiv = document.getElementById('musicResultsContainer');
    let html = '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; margin-top: 20px;">';
    
    videos.forEach(video => {
        const videoId = video.id.videoId;
        const title = video.snippet.title;
        const channel = video.snippet.channelTitle;
        const thumbnail = video.snippet.thumbnails.medium.url;
        
        html += `
            <div class="song-card" onclick="playMusic('${videoId}')" style="background: #1a1a1a; border-radius: 10px; overflow: hidden; cursor: pointer; transition: transform 0.3s;">
                <div style="position: relative;">
                    <img src="${thumbnail}" alt="${title}" style="width: 100%; height: 150px; object-fit: cover;">
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(255,0,0,0.8); border-radius: 50%; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; font-size: 20px; opacity: 0; transition: opacity 0.3s;">▶</div>
                </div>
                <div style="padding: 15px;">
                    <h3 style="color: white; font-size: 14px; margin: 0 0 8px 0; line-height: 1.4;">${title.substring(0, 50)}${title.length > 50 ? '...' : ''}</h3>
                    <p style="color: #aaa; font-size: 12px; margin: 0;">${channel}</p>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    resultsDiv.innerHTML = html;
    
    // Add hover effects
    const cards = document.querySelectorAll('.song-card');
    cards.forEach(card => {
        card.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.05)';
            this.querySelector('div').style.opacity = '1';
        });
        card.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1)';
            this.querySelector('div').style.opacity = '0';
        });
    });
}

// Play Music Function
function playMusic(videoId) {
    // YouTube pe video kholo
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
}

// Enter key se search
document.getElementById('musicSearchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchMusic();
    }
});
