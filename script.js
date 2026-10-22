// Song list (update with your actual files and metadata)
const songs = [
  {
    title: "Song One",
    artist: "Artist A",
    src: "songs/song1.mp3"
  },
  {
    title: "Song Two",
    artist: "Artist B",
    src: "songs/song2.mp3"
  },
  {
    title: "Song Three",
    artist: "Artist C",
    src: "songs/song3.mp3"
  }
];

let currentSongIndex = 0;
let isPlaying = false;
let autoplay = true;

const audio = document.getElementById("audio");
const titleEl = document.getElementById("title");
const artistEl = document.getElementById("artist");
const playPauseBtn = document.getElementById("play-pause");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progressContainer = document.getElementById("progress-container");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const volumeSlider = document.getElementById("volume");
const playlistEl = document.getElementById("playlist");

function loadSong(index) {
  const song = songs[index];
  titleEl.textContent = song.title;
  artistEl.textContent = song.artist;
  audio.src = song.src;
  updatePlaylistHighlight();
}

function playSong() {
  isPlaying = true;
  playPauseBtn.textContent = "⏸";
  audio.play();
}

function pauseSong() {
  isPlaying = false;
  playPauseBtn.textContent = "▶";
  audio.pause();
}

function togglePlay() {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
}

function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(currentSongIndex);
  if (isPlaying || autoplay) playSong();
}

function nextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
  if (isPlaying || autoplay) playSong();
}

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

function updateProgress() {
  const { currentTime, duration } = audio;
  if (!duration) return;

  const percent = (currentTime / duration) * 100;
  progress.style.width = `${percent}%`;

  currentTimeEl.textContent = formatTime(currentTime);
  durationEl.textContent = formatTime(duration);
}

function setProgress(e) {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  if (!duration) return;

  audio.currentTime = (clickX / width) * duration;
}

function updatePlaylist() {
  playlistEl.innerHTML = "";
  songs.forEach((song, index) => {
    const div = document.createElement("div");
    div.classList.add("playlist-item");
    if (index === currentSongIndex) div.classList.add("active");
    div.textContent = `${index + 1}. ${song.title} – ${song.artist}`;
    div.addEventListener("click", () => {
      currentSongIndex = index;
      loadSong(currentSongIndex);
      playSong();
    });
    playlistEl.appendChild(div);
  });
}

function updatePlaylistHighlight() {
  const items = playlistEl.querySelectorAll(".playlist-item");
  items.forEach((item, index) => {
    if (index === currentSongIndex) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

// Event listeners
playPauseBtn.addEventListener("click", togglePlay);
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);

audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("ended", () => {
  if (autoplay) nextSong();
});

progressContainer.addEventListener("click", setProgress);

volumeSlider.addEventListener("input", (e) => {
  audio.volume = e.target.value;
});

// Initialize
updatePlaylist();
loadSong(currentSongIndex);
audio.volume = volumeSlider.value;