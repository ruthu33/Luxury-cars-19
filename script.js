document.addEventListener('DOMContentLoaded', function() {
    // Get video and control elements
    const video = document.querySelector('video');
    const playBtn = document.querySelector('.play-pause-btn');
    const currentTimeEl = document.querySelector('.current-time');
    const durationEl = document.querySelector('.duration');
    const progressBar = document.querySelector('.progress-bar');
    const volumeBtn = document.querySelector('.volume-btn');
    const volumeLevel = document.querySelector('.volume-level');
    const progressContainer = document.querySelector('.progress-container');
    const volumeSlider = document.querySelector('.volume-slider');
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    const videoContainer = document.querySelector('.bmw-intro-video-container');
    const unmuteOverlay = document.querySelector('.unmute-overlay');

    // Format time (seconds to MM:SS)
    function formatTime(seconds) {
        if (isNaN(seconds) || seconds === Infinity) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Update time display and progress bar
    function updateTime() {
        if (!video) return;
        
        currentTimeEl.textContent = formatTime(video.currentTime);
        
        if (video.duration && !isNaN(video.duration)) {
            durationEl.textContent = formatTime(video.duration);
            
            // Update progress bar
            const progress = (video.currentTime / video.duration) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }

    // Toggle play/pause
    function togglePlay() {
        if (!video) return;
        
        if (video.paused) {
            video.play();
            playBtn.textContent = '⏸';
        } else {
            video.pause();
            playBtn.textContent = '▶';
        }
    }

    // Seek video when clicking progress bar
    function seekVideo(event) {
        if (!video || !video.duration) return;
        
        const clickX = event.offsetX;
        const containerWidth = progressContainer.clientWidth;
        const percentage = clickX / containerWidth;
        
        if (video.duration && !isNaN(video.duration)) {
            video.currentTime = percentage * video.duration;
        }
    }

    // Toggle mute
    function toggleMute() {
        if (!video) return;
        
        video.muted = !video.muted;
        video.volume = video.muted ? 0 : 1;
        volumeBtn.textContent = video.muted ? '🔇' : '🔊';
        
        // Update volume level display
        volumeLevel.style.width = video.muted ? '0%' : '100%';
        
        // Update video container class
        if (!video.muted) {
            videoContainer.classList.add('video-unmuted');
        }
    }

    // Set volume when clicking volume slider
    function setVolume(event) {
        if (!video) return;
        
        const clickX = event.offsetX;
        const containerWidth = volumeSlider.clientWidth;
        const volume = Math.min(Math.max(clickX / containerWidth, 0), 1);
        
        video.volume = volume;
        video.muted = false;
        
        volumeBtn.textContent = '🔊';
        volumeLevel.style.width = `${volume * 100}%`;
        videoContainer.classList.add('video-unmuted');
    }

    // Toggle fullscreen
    function toggleFullscreen() {
        if (!videoContainer) return;
        
        if (!document.fullscreenElement) {
            if (videoContainer.requestFullscreen) {
                videoContainer.requestFullscreen();
            } else if (videoContainer.webkitRequestFullscreen) {
                videoContainer.webkitRequestFullscreen();
            } else if (videoContainer.msRequestFullscreen) {
                videoContainer.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }

    // Unmute video function (called from HTML onclick)
    window.unmuteVideo = function() {
        if (!video) return;
        
        video.muted = false;
        video.volume = 1;
        videoContainer.classList.add('video-unmuted');
        
        // Update volume button
        if (volumeBtn) {
            volumeBtn.textContent = '🔊';
        }
        
        // Update volume level
        if (volumeLevel) {
            volumeLevel.style.width = '100%';
        }
        
        // Try to play if paused
        if (video.paused) {
            video.play().catch(e => console.log("Play failed:", e));
        }
        
        // Hide unmute overlay
        if (unmuteOverlay) {
            unmuteOverlay.style.opacity = '0';
            setTimeout(() => {
                unmuteOverlay.style.display = 'none';
            }, 300);
        }
    };

    // Event Listeners
    if (video) {
        video.addEventListener('timeupdate', updateTime);
        video.addEventListener('loadedmetadata', () => {
            if (video.duration && !isNaN(video.duration)) {
                durationEl.textContent = formatTime(video.duration);
            }
            updateTime();
        });
        video.addEventListener('ended', () => {
            if (playBtn) playBtn.textContent = '▶';
        });
        
        // Ensure video autoplays
        video.muted = true;
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Autoplay prevented:", error);
            });
        }
    }
    
    // Control button event listeners
    if (playBtn) playBtn.addEventListener('click', togglePlay);
    if (progressContainer) progressContainer.addEventListener('click', seekVideo);
    if (volumeBtn) volumeBtn.addEventListener('click', toggleMute);
    if (volumeSlider) volumeSlider.addEventListener('click', setVolume);
    if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);
    
    // Initialize volume display
    if (video && volumeLevel) {
        volumeLevel.style.width = `${video.volume * 100}%`;
    }
    
    // Hide browser controls
    if (video) video.controls = false;
});