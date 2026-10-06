const tracks = [
  { title: "Midnight City", artist: "M83", duration: "3:44", cover: "cover-a" },
  { title: "Afterglow", artist: "RÜFÜS DU SOL", duration: "4:12", cover: "cover-b" },
  { title: "The Less I Know", artist: "Tame Impala", duration: "3:36", cover: "cover-c" },
  { title: "Innerbloom", artist: "RÜFÜS DU SOL", duration: "9:38", cover: "cover-d" },
  { title: "Sunset Lover", artist: "Petit Biscuit", duration: "3:58", cover: "cover-b" },
  { title: "Ocean Drive", artist: "Duke Dumont", duration: "3:26", cover: "cover-a" },
  { title: "Electric Feel", artist: "MGMT", duration: "3:49", cover: "cover-c" },
  { title: "Intro", artist: "The xx", duration: "2:07", cover: "cover-d" }
];

const artists = [
  ["M83", "Electronic", "M"],
  ["RÜFÜS DU SOL", "Electronic", "R"],
  ["Tame Impala", "Indie", "T"],
  ["The Weeknd", "R&B", "W"],
  ["Dua Lipa", "Pop", "D"],
  ["Fred again..", "Dance", "F"]
];

const trackGrid = document.getElementById("trackGrid");
const artistRow = document.getElementById("artistRow");
const searchInput = document.getElementById("searchInput");
const toast = document.getElementById("toast");

let currentIndex = 0;
let playing = false;
let elapsed = 0;
let timer = null;
let liked = false;

function renderTracks(list = tracks) {
  trackGrid.innerHTML = list.length ? list.map((track, index) => `
    <article class="track-card">
      <div class="cover ${track.cover}">
        <button class="card-play" data-index="${tracks.indexOf(track)}">▶</button>
      </div>
      <div class="track-info">
        <div class="track-copy">
          <strong>${track.title}</strong>
          <span>${track.artist}</span>
        </div>
        <span style="font-size:9px;color:#666673">${track.duration}</span>
      </div>
    </article>
  `).join("") : `<div style="color:#888;grid-column:1/-1;padding:25px">Ничего не найдено.</div>`;
}

function renderArtists() {
  artistRow.innerHTML = artists.map(([name, genre, letter]) => `
    <div class="artist" data-artist="${name}">
      <div class="artist-img">${letter}</div>
      <strong>${name}</strong>
      <span>${genre}</span>
    </div>
  `).join("");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function setTrack(index, autoPlay = true) {
  currentIndex = (index + tracks.length) % tracks.length;
  const track = tracks[currentIndex];

  document.getElementById("playerTitle").textContent = track.title;
  document.getElementById("playerArtist").textContent = track.artist;
  document.getElementById("duration").textContent = track.duration;
  document.getElementById("miniCover").textContent = track.title.charAt(0);
  document.getElementById("miniCover").className = `mini-cover ${track.cover}`;

  elapsed = 0;
  document.getElementById("progress").value = 0;
  document.getElementById("currentTime").textContent = "0:00";

  if (autoPlay) {
    playing = true;
    updatePlayButton();
    startTimer();
  }
}

function parseDuration(text) {
  const [min, sec] = text.split(":").map(Number);
  return min * 60 + sec;
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = String(Math.floor(seconds % 60)).padStart(2, "0");
  return `${m}:${s}`;
}

function updatePlayButton() {
  document.getElementById("playBtn").textContent = playing ? "Ⅱ" : "▶";
}

function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    if (!playing) return;
    const duration = parseDuration(tracks[currentIndex].duration);
    elapsed += 1;

    if (elapsed >= duration) {
      nextTrack();
      return;
    }

    document.getElementById("progress").value = (elapsed / duration) * 100;
    document.getElementById("currentTime").textContent = formatTime(elapsed);
  }, 1000);
}

document.addEventListener("click", (event) => {
  const play = event.target.closest(".card-play");
  if (play) {
    setTrack(Number(play.dataset.index), true);
    showToast(`▶ ${tracks[currentIndex].title}`);
  }

  const playlist = event.target.closest("[data-playlist]");
  if (playlist) {
    showToast(`Плейлист «${playlist.dataset.playlist}» выбран`);
  }

  const artist = event.target.closest(".artist");
  if (artist) {
    showToast(`Артист: ${artist.dataset.artist}`);
  }
});

document.getElementById("playBtn").addEventListener("click", () => {
  playing = !playing;
  updatePlayButton();
  if (playing) startTimer();
});

document.getElementById("heroPlay").addEventListener("click", () => {
  setTrack(0, true);
  document.getElementById("browse").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("exploreBtn").addEventListener("click", () => {
  document.getElementById("browse").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("nextBtn").addEventListener("click", () => {
  nextTrack();
});

document.getElementById("prevBtn").addEventListener("click", () => {
  setTrack(currentIndex - 1, true);
});

function nextTrack() {
  setTrack(currentIndex + 1, true);
}

document.getElementById("heartBtn").addEventListener("click", (event) => {
  liked = !liked;
  event.currentTarget.textContent = liked ? "♥" : "♡";
  event.currentTarget.classList.toggle("liked", liked);
  showToast(liked ? "Добавлено в любимое" : "Удалено из любимого");
});

document.getElementById("progress").addEventListener("input", (event) => {
  const duration = parseDuration(tracks[currentIndex].duration);
  elapsed = Math.floor((event.target.value / 100) * duration);
  document.getElementById("currentTime").textContent = formatTime(elapsed);
});

document.getElementById("volume").addEventListener("input", (event) => {
  showToast(`Громкость: ${event.target.value}%`);
});

document.getElementById("shuffleBtn").addEventListener("click", () => {
  const random = Math.floor(Math.random() * tracks.length);
  setTrack(random, true);
  showToast("Перемешивание включено");
});

document.getElementById("repeatBtn").addEventListener("click", () => {
  showToast("Повтор трека включён");
});

document.getElementById("showAll").addEventListener("click", () => {
  renderTracks(tracks);
  showToast("Показаны все треки");
});

searchInput.addEventListener("input", (event) => {
  const query = event.target.value.trim().toLowerCase();
  const filtered = tracks.filter(track =>
    `${track.title} ${track.artist}`.toLowerCase().includes(query)
  );
  renderTracks(filtered);
});

document.getElementById("addPlaylist").addEventListener("click", () => {
  const name = prompt("Название нового плейлиста:");
  if (name && name.trim()) showToast(`Плейлист «${name.trim()}» создан`);
});

document.getElementById("mobileMenu").addEventListener("click", () => {
  document.querySelector(".sidebar").classList.toggle("open");
});

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".nav-link").forEach(item => item.classList.remove("active"));
    link.classList.add("active");
    document.querySelector(".sidebar").classList.remove("open");
  });
});

renderTracks();
renderArtists();
setTrack(0, false);
