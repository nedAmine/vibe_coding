// Music Player with generated audio fallback
class MusicPlayer {
    constructor() {
        this.audioPlayer = document.getElementById('audioPlayer');
        this.songList = document.getElementById('songList');
        this.searchInput = document.getElementById('searchInput');
        this.songTitle = document.getElementById('songTitle');
        this.artistName = document.getElementById('artistName');
        this.albumArt = document.getElementById('albumArt');
        this.progressBar = document.getElementById('progressBar');
        this.currentTime = document.getElementById('currentTime');
        this.duration = document.getElementById('duration');
        this.playBtn = document.getElementById('playBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.volumeControl = document.getElementById('volumeControl');
        
        this.tracks = [];
        this.currentTrackIndex = 0;
        this.isPlaying = false;
        this.audioContext = null;
        
        this.init();
    }
    
    async init() {
        // Load tracks with audio data
        await this.loadTracks();
        
        // Set up event listeners
        this.setupEventListeners();
    }
    
    async loadTracks() {
        try {
            // Show loading state
            this.showLoadingState();
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Tracks with base64 audio data for guaranteed playback
            this.tracks = [
                {
                    id: 1,
                    title: "Sunset Dreams",
                    artist: { name: "Lofi Chill" },
                    album: { 
                        cover_medium: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=250&h=250&fit=crop",
                        cover_big: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&h=500&fit=crop"
                    },
                    preview: this.generateAudioData(261.63, 5), // C4 note for 5 seconds
                    duration: 5,
                    audioType: 'base64'
                },
                {
                    id: 2,
                    title: "Morning Coffee",
                    artist: { name: "Jazz Vibes" },
                    album: { 
                        cover_medium: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&h=250&fit=crop",
                        cover_big: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop"
                    },
                    preview: this.generateAudioData(329.63, 5), // E4 note for 5 seconds
                    duration: 5,
                    audioType: 'base64'
                },
                {
                    id: 3,
                    title: "Urban Night",
                    artist: { name: "City Beats" },
                    album: { 
                        cover_medium: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=250&h=250&fit=crop",
                        cover_big: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop"
                    },
                    preview: this.generateAudioData(392.00, 5), // G4 note for 5 seconds
                    duration: 5,
                    audioType: 'base64'
                },
                {
                    id: 4,
                    title: "Ocean Waves",
                    artist: { name: "Nature Sounds" },
                    album: { 
                        cover_medium: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=250&h=250&fit=crop",
                        cover_big: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=500&h=500&fit=crop"
                    },
                    preview: this.generateAudioData(440.00, 5), // A4 note for 5 seconds
                    duration: 5,
                    audioType: 'base64'
                },
                {
                    id: 5,
                    title: "Mountain High",
                    artist: { name: "Adventure Mix" },
                    album: { 
                        cover_medium: "https://i.pinimg.com/736x/3c/ee/6d/3cee6d295160f53a72efa01ecf94dac0.jpg",
                        cover_big: "https://i.pinimg.com/736x/3c/ee/6d/3cee6d295160f53a72efa01ecf94dac0.jpg"
                    },
                    preview: this.generateAudioData(493.88, 5), // B4 note for 5 seconds
                    duration: 5,
                    audioType: 'base64'
                }
            ];
            
            this.renderSongList();
            
        } catch (error) {
            console.error('Error loading tracks:', error);
            this.showErrorState();
        }
    }
    
    // Generate simple sine wave audio as base64 data
    generateAudioData(frequency = 440, duration = 5) {
        // Create offline audio context
        const sampleRate = 44100;
        const offlineCtx = new OfflineAudioContext(1, sampleRate * duration, sampleRate);
        
        // Create oscillator
        const oscillator = offlineCtx.createOscillator();
        const gainNode = offlineCtx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        
        // Create fade in/out to avoid clicks
        gainNode.gain.setValueAtTime(0, 0);
        gainNode.gain.linearRampToValueAtTime(0.3, 0.1);
        gainNode.gain.linearRampToValueAtTime(0.3, duration - 0.1);
        gainNode.gain.linearRampToValueAtTime(0, duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(offlineCtx.destination);
        
        oscillator.start(0);
        oscillator.stop(duration);
        
        // Render to buffer and convert to base64
        return offlineCtx.startRendering().then(audioBuffer => {
            return this.audioBufferToWav(audioBuffer);
        });
    }
    
    // Convert AudioBuffer to WAV base64 string
    audioBufferToWav(audioBuffer) {
        const numChannels = audioBuffer.numberOfChannels;
        const sampleRate = audioBuffer.sampleRate;
        const length = audioBuffer.length;
        const bitsPerSample = 16;
        const bytesPerSample = bitsPerSample / 8;
        const blockAlign = numChannels * bytesPerSample;
        const byteRate = sampleRate * blockAlign;
        const dataSize = length * blockAlign;
        
        const buffer = new ArrayBuffer(44 + dataSize);
        const view = new DataView(buffer);
        
        // Write WAV header
        const writeString = (offset, string) => {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };
        
        writeString(0, 'RIFF');
        view.setUint32(4, 36 + dataSize, true);
        writeString(8, 'WAVE');
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, numChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, byteRate, true);
        view.setUint16(32, blockAlign, true);
        view.setUint16(34, bitsPerSample, true);
        writeString(36, 'data');
        view.setUint32(40, dataSize, true);
        
        // Write audio data
        const channelData = audioBuffer.getChannelData(0);
        let offset = 44;
        for (let i = 0; i < length; i++) {
            const sample = Math.max(-1, Math.min(1, channelData[i]));
            view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
            offset += 2;
        }
        
        // Convert to base64
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return 'data:audio/wav;base64,' + btoa(binary);
    }
    
    showLoadingState() {
        this.songList.innerHTML = `
            <div class="text-center py-8">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                <p class="mt-4 text-gray-400">Loading songs...</p>
            </div>
        `;
    }
    
    showErrorState() {
        this.songList.innerHTML = `
            <div class="text-center py-8">
                <i class="fas fa-exclamation-triangle text-yellow-500 text-4xl mb-4"></i>
                <p class="text-gray-400 mb-4">Failed to load songs</p>
                <button id="retryButton" class="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg transition">
                    Retry
                </button>
            </div>
        `;
        
        document.getElementById('retryButton').addEventListener('click', () => {
            this.loadTracks();
        });
    }
    
    renderSongList() {
        this.songList.innerHTML = '';
        
        if (this.tracks.length === 0) {
            this.songList.innerHTML = `
                <div class="text-center py-8">
                    <p class="text-gray-400">No songs available</p>
                </div>
            `;
            return;
        }
        
        this.tracks.forEach((track, index) => {
            const songItem = document.createElement('div');
            songItem.className = 'song-item bg-gray-700 p-4 rounded-lg flex items-center cursor-pointer hover:bg-gray-600 transition';
            songItem.innerHTML = `
                <div class="w-12 h-12 bg-gray-600 rounded-md flex items-center justify-center mr-4 overflow-hidden">
                    ${track.album.cover_medium ? 
                        `<img src="${track.album.cover_medium}" alt="${track.title}" class="w-full h-full object-cover">` : 
                        `<i class="fas fa-music text-gray-400"></i>`
                    }
                </div>
                <div class="flex-1">
                    <h3 class="font-semibold truncate">${track.title}</h3>
                    <p class="text-gray-400 text-sm truncate">${track.artist.name}</p>
                </div>
                <div class="text-gray-400 text-sm">
                    ${this.formatTime(track.duration)}
                </div>
            `;
            
            songItem.addEventListener('click', async () => {
                await this.playTrack(index);
            });
            
            this.songList.appendChild(songItem);
        });
    }
    
    async playTrack(index) {
        this.currentTrackIndex = index;
        const track = this.tracks[index];
        
        console.log('Playing track:', track.title);
        
        // Update UI
        this.songTitle.textContent = track.title;
        this.artistName.textContent = track.artist.name;
        
        // Set album art with fallback
        if (track.album.cover_big) {
            this.albumArt.style.backgroundImage = `url(${track.album.cover_big})`;
            this.albumArt.style.backgroundSize = 'cover';
            this.albumArt.style.backgroundPosition = 'center';
            this.albumArt.innerHTML = '';
        } else {
            this.albumArt.style.backgroundImage = '';
            this.albumArt.innerHTML = '<i class="fas fa-music text-5xl text-gray-500"></i>';
        }
        
        try {
            // Reset and set audio source
            this.audioPlayer.pause();
            
            if (track.audioType === 'base64' && track.preview instanceof Promise) {
                // Wait for the audio data to be generated
                const audioData = await track.preview;
                this.audioPlayer.src = audioData;
            } else {
                this.audioPlayer.src = track.preview;
            }
            
            this.audioPlayer.load();
            
            // Play the track
            await this.playAudio();
            
            // Highlight current track in the list
            this.highlightCurrentTrack();
            
        } catch (error) {
            console.error('Error setting up track:', error);
            this.showAudioError('Failed to load audio');
        }
    }
    
    async playAudio() {
        try {
            await this.audioPlayer.play();
            this.isPlaying = true;
            this.updatePlayButton();
            this.albumArt.parentElement.classList.add('playing');
            console.log('Audio started successfully');
        } catch (error) {
            console.error('Error playing audio:', error);
            this.showAudioError('Click to play');
        }
    }
    
    showAudioError(message) {
        this.songTitle.textContent = message;
        this.artistName.textContent = "Audio ready - click play button";
        this.isPlaying = false;
        this.updatePlayButton();
    }
    
    pauseAudio() {
        this.audioPlayer.pause();
        this.isPlaying = false;
        this.updatePlayButton();
        this.albumArt.parentElement.classList.remove('playing');
    }
    
    updatePlayButton() {
        const playIcon = this.playBtn.querySelector('i');
        if (this.isPlaying) {
            playIcon.classList.remove('fa-play');
            playIcon.classList.add('fa-pause');
            this.playBtn.classList.add('pulse');
        } else {
            playIcon.classList.remove('fa-pause');
            playIcon.classList.add('fa-play');
            this.playBtn.classList.remove('pulse');
        }
    }
    
    async playNext() {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
        await this.playTrack(this.currentTrackIndex);
    }
    
    async playPrev() {
        this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
        await this.playTrack(this.currentTrackIndex);
    }
    
    highlightCurrentTrack() {
        const songItems = this.songList.querySelectorAll('.song-item');
        songItems.forEach((item, index) => {
            if (index === this.currentTrackIndex) {
                item.classList.add('bg-purple-900', 'bg-opacity-30', 'border-l-4', 'border-purple-500');
                item.classList.remove('bg-gray-700', 'hover:bg-gray-600');
            } else {
                item.classList.remove('bg-purple-900', 'bg-opacity-30', 'border-l-4', 'border-purple-500');
                item.classList.add('bg-gray-700', 'hover:bg-gray-600');
            }
        });
    }
    
    formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
    setupEventListeners() {
        // Play/Pause button
        this.playBtn.addEventListener('click', async () => {
            if (this.audioPlayer.src && this.audioPlayer.src !== '') {
                if (this.isPlaying) {
                    this.pauseAudio();
                } else {
                    await this.playAudio();
                }
            } else if (this.tracks.length > 0) {
                await this.playTrack(0);
            }
        });
        
        // Next button
        this.nextBtn.addEventListener('click', async () => {
            await this.playNext();
        });
        
        // Previous button
        this.prevBtn.addEventListener('click', async () => {
            await this.playPrev();
        });
        
        // Volume control
        this.volumeControl.addEventListener('input', () => {
            this.audioPlayer.volume = this.volumeControl.value / 100;
        });
        
        // Progress bar update
        this.audioPlayer.addEventListener('timeupdate', () => {
            const current = this.audioPlayer.currentTime;
            const total = this.audioPlayer.duration || 0;
            
            if (!isNaN(total)) {
                // Update progress bar
                const progressPercent = (current / total) * 100;
                this.progressBar.style.width = `${progressPercent}%`;
                
                // Update time displays
                this.currentTime.textContent = this.formatTime(current);
                this.duration.textContent = this.formatTime(total);
            }
        });
        
        // Click on progress bar to seek
        this.progressBar.parentElement.addEventListener('click', (e) => {
            if (this.audioPlayer.duration) {
                const rect = this.progressBar.parentElement.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                this.audioPlayer.currentTime = percent * this.audioPlayer.duration;
            }
        });
        
        // When song ends, play next
        this.audioPlayer.addEventListener('ended', async () => {
            await this.playNext();
        });
        
        // Search functionality
        this.searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const songItems = this.songList.querySelectorAll('.song-item');
            
            songItems.forEach((item, index) => {
                const title = this.tracks[index].title.toLowerCase();
                const artist = this.tracks[index].artist.name.toLowerCase();
                
                if (title.includes(searchTerm) || artist.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
        
        // Handle audio errors
        this.audioPlayer.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            this.showAudioError('Audio error - try another song');
        });
    }
}

// Initialize the music player when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MusicPlayer();
});