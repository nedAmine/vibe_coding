🎵 Deezer Music Player
A responsive, modern music player web application that simulates Deezer's functionality with a clean UI and smooth interactions.

https://img.shields.io/badge/Status-Ready-green
https://img.shields.io/badge/Tech-HTML%252FCSS%252FJS-blue

✨ Features
🎵 Music Playback: Play, pause, skip tracks with smooth controls

📱 Responsive Design: Fully responsive layout using Tailwind CSS

🎨 Modern UI: Clean, dark-themed interface with hover effects

🔍 Search Functionality: Real-time song search and filtering

📊 Progress Tracking: Interactive progress bar with seeking capability

🎛️ Volume Control: Adjustable volume slider

🔄 Auto-play: Automatically plays next song when current ends

🎯 Visual Feedback: Highlighted current track and rotating album art

🚀 Quick Start
Clone or Download the project files:

text
- index.html
- styles.css  
- script.js
Open index.html in your web browser

Start Playing - Click any song to begin!

🛠️ Technology Stack
Frontend: HTML5, CSS3, JavaScript (ES6+)

Styling: Tailwind CSS + Custom CSS

Icons: Font Awesome 6

Audio: Web Audio API for generated tones

📁 Project Structure
text
music-player/
├── index.html          # Main application file
├── styles.css          # Custom styles and animations
├── script.js           # Music player logic and functionality
└── README.md          # Project documentation
🎮 How to Use
Basic Controls
Click any song in the list to start playing

Play/Pause - Toggle playback with the center button

Next/Previous - Navigate through the playlist

Progress Bar - Click to seek to specific position

Volume - Adjust with the slider at the bottom

Search
Type in the search box to filter songs by title or artist name in real-time.

Responsive Behavior
Desktop: Side-by-side layout with player and song list

Mobile: Stacked layout with player on top

🎵 Audio Samples
The app uses generated musical tones (sine waves at different frequencies) to demonstrate playback functionality:

Each track plays a unique tone for 5 seconds

Tones range from C4 to B4 notes on the musical scale

Audio is generated locally using Web Audio API

🔧 Customization
Adding New Songs
Modify the tracks array in script.js:

javascript
{
    id: 6,
    title: "Your Song Title",
    artist: { name: "Artist Name" },
    album: { 
        cover_medium: "image-url-250x250",
        cover_big: "image-url-500x500"
    },
    preview: this.generateAudioData(440.00, 5), // Frequency, Duration
    duration: 5,
    audioType: 'base64'
}
Styling
Modify styles.css for custom animations and effects

Update Tailwind classes in index.html for layout changes

Color scheme uses purple accents (#8B5CF6) - easily customizable

🌐 Browser Compatibility
✅ Chrome 60+

✅ Firefox 55+

✅ Safari 11+

✅ Edge 79+

🐛 Known Issues
Audio generation may have a slight delay on first load

Mobile browsers may require user interaction before audio playback

📄 License
This project is for educational purposes. Audio generation code may be reused with attribution.

🤝 Contributing
Feel free to fork and enhance with features like:

Playlist management

Favorite songs

Equalizer settings

Lyrics display

Social sharing

Enjoy the music! 🎧