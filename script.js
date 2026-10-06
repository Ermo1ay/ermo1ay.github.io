const tracks=[
{title:"Midnight City",artist:"M83",duration:"3:44",cover:"cover-a"},
{title:"Afterglow",artist:"RÜFÜS DU SOL",duration:"4:12",cover:"cover-b"},
{title:"The Less I Know",artist:"Tame Impala",duration:"3:36",cover:"cover-c"},
{title:"Innerbloom",artist:"RÜFÜS DU SOL",duration:"9:38",cover:"cover-d"},
{title:"Sunset Lover",artist:"Petit Biscuit",duration:"3:58",cover:"cover-b"},
{title:"Ocean Drive",artist:"Duke Dumont",duration:"3:26",cover:"cover-a"},
{title:"Electric Feel",artist:"MGMT",duration:"3:49",cover:"cover-c"},
{title:"Intro",artist:"The xx",duration:"2:07",cover:"cover-d"}];
const artists=[["M83","Electronic","M"],["RÜFÜS DU SOL","Electronic","R"],["Tame Impala","Indie","T"],["The Weeknd","R&B","W"],["Dua Lipa","Pop","D"],["Fred again..","Dance","F"]];
const $=id=>document.getElementById(id); const trackGrid=$("trackGrid"), favoriteGrid=$("favoriteGrid"), artistRow=$("artistRow"), searchInput=$("searchInput"), toast=$("toast");
let currentIndex=0,playing=false,elapsed=0,timer=null,shuffle=false,repeat=false;
let favorites=JSON.parse(localStorage.getItem("swFavorites")||"[]"), history=JSON.parse(localStorage.getItem("swHistory")||"[]"), customPlaylists=JSON.parse(localStorage.getItem("swPlaylists")||"[]");

function showToast(m){toast.textContent=m;toast.classList.add("show");clearTimeout(showToast.t);showToast.t=setTimeout(()=>toast.classList.remove("show"),1800)}
function renderTracks(list=tracks){trackGrid.innerHTML=list.length?list.map(t=>{let i=tracks.indexOf(t),liked=favorites.includes(i);return `<article class="track-card"><div class="cover ${t.cover}"><button class="card-play" data-index="${i}">▶</button></div><div class="track-info"><div class="track-copy"><strong>${t.title}</strong><span>${t.artist}</span></div><button class="heart ${liked?"liked":""}" data-like="${i}">${liked?"♥":"♡"}</button></div></article>`}).join(""):`<div style="color:#888;padding:25px">Ничего не найдено.</div>`}
function renderFavorites(){let list=favorites.map(i=>tracks[i]).filter(Boolean);favoriteGrid.innerHTML=list.length?list.map(t=>{let i=tracks.indexOf(t);return `<article class="track-card"><div class="cover ${t.cover}"><button class="card-play" data-index="${i}">▶</button></div><div class="track-info"><div class="track-copy"><strong>${t.title}</strong><span>${t.artist}</span></div><button class="heart liked" data-like="${i}">♥</button></div></article>`}).join(""):`<div style="color:#888;padding:25px;grid-column:1/-1">Здесь пока пусто. Нажми ♡ у любимого трека.</div>`}
function renderArtists(){artistRow.innerHTML=artists.map(([n,g,l])=>`<div class="artist" data-artist="${n}"><div class="artist-img">${l}</div><strong>${n}</strong><span>${g}</span></div>`).join("")}
function renderHistory(){let box=$("historyList");box.innerHTML=history.length?history.slice(0,6).map(i=>{let t=tracks[i];return `<div class="history-item"><div class="history-cover ${t.cover}">${t.title[0]}</div><div><strong>${t.title}</strong><small>${t.artist}</small></div><button class="card-play" data-index="${i}" style="position:static;margin-left:auto">▶</button></div>`}).join(""):`<div style="color:#777">Здесь появятся недавно прослушанные треки.</div>`}
function renderCustomPlaylists(){const list=$("playlistList");customPlaylists.forEach(name=>{if([...list.children].some(x=>x.dataset.playlist===name))return;let b=document.createElement("button");b.className="playlist-link";b.dataset.playlist=name;b.textContent="♡ "+name;list.appendChild(b)})}
function parseDuration(s){let [m,sec]=s.split(":").map(Number);return m*60+sec}
function fmt(s){return `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}`}
function setTrack(i,auto=true){currentIndex=(i+tracks.length)%tracks.length;let t=tracks[currentIndex];$("playerTitle").textContent=t.title;$("playerArtist").textContent=t.artist;$("duration").textContent=t.duration;$("miniCover").textContent=t.title[0];$("miniCover").className=`mini-cover ${t.cover}`;$("heroTrack").textContent=t.title;$("heroArtist").textContent=t.artist;elapsed=0;$("progress").value=0;$("currentTime").textContent="0:00";if(!history.includes(currentIndex)){history.unshift(currentIndex);history=history.slice(0,10);localStorage.setItem("swHistory",JSON.stringify(history));renderHistory()}if(auto){playing=true;updatePlay();startTimer()}}
function updatePlay(){$("playBtn").textContent=playing?"Ⅱ":"▶"}
function startTimer(){clearInterval(timer);timer=setInterval(()=>{if(!playing)return;let d=parseDuration(tracks[currentIndex].duration);elapsed++;if(elapsed>=d){if(repeat){elapsed=0}else{nextTrack();return}}$("progress").value=elapsed/d*100;$("currentTime").textContent=fmt(elapsed)},1000)}
function toggleFavorite(i){if(favorites.includes(i))favorites=favorites.filter(x=>x!==i);else favorites.push(i);localStorage.setItem("swFavorites",JSON.stringify(favorites));renderTracks();renderFavorites();let liked=favorites.includes(i);if(i===currentIndex){$("heartBtn").textContent=liked?"♥":"♡";$("heartBtn").classList.toggle("liked",liked)}showToast(liked?"Добавлено в избранное":"Удалено из избранного")}
function nextTrack(){let n;if(shuffle)n=Math.floor(Math.random()*tracks.length);else n=currentIndex+1;setTrack(n,true)}
function renderQueue(){let q=$("queueList");q.innerHTML=tracks.map((t,i)=>`<div class="queue-item" data-index="${i}"><div class="history-cover ${t.cover}">${t.title[0]}</div><div><strong>${t.title}</strong><small>${t.artist} · ${t.duration}</small></div></div>`).join("")}
document.addEventListener("click",e=>{let p=e.target.closest(".card-play");if(p){setTrack(+p.dataset.index,true);showToast("▶ "+tracks[currentIndex].title)}
let l=e.target.closest("[data-like]");if(l){toggleFavorite(+l.dataset.like)}
let pl=e.target.closest("[data-playlist]");if(pl&&!e.target.closest("[data-like]"))showToast("Плейлист «"+pl.dataset.playlist+"» выбран")
let a=e.target.closest(".artist");if(a)showToast("Артист: "+a.dataset.artist)
let qi=e.target.closest(".queue-item");if(qi){setTrack(+qi.dataset.index,true);$("queuePanel").classList.remove("open")}});

$("playBtn").onclick=()=>{playing=!playing;updatePlay();if(playing)startTimer()};
$("heroPlay").onclick=()=>{setTrack(0,true);$("browse").scrollIntoView({behavior:"smooth"})};
$("exploreBtn").onclick=()=>$("browse").scrollIntoView({behavior:"smooth"});
$("nextBtn").onclick=nextTrack;
$("prevBtn").onclick=()=>setTrack(currentIndex-1,true);
$("heartBtn").onclick=()=>toggleFavorite(currentIndex);
$("shuffleBtn").onclick=()=>{shuffle=!shuffle;$("shuffleBtn").style.color=shuffle?"#a36cff":"";showToast(shuffle?"Перемешивание включено":"Перемешивание выключено")};
$("repeatBtn").onclick=()=>{repeat=!repeat;$("repeatBtn").style.color=repeat?"#a36cff":"";showToast(repeat?"Повтор включён":"Повтор выключен")};
$("progress").oninput=e=>{let d=parseDuration(tracks[currentIndex].duration);elapsed=Math.floor(+e.target.value/100*d);$("currentTime").textContent=fmt(elapsed)};
$("volume").oninput=e=>showToast("Громкость: "+e.target.value+"%");
$("queueBtn").onclick=()=>{$("queuePanel").classList.toggle("open");renderQueue()};
$("closeQueue").onclick=()=>$("queuePanel").classList.remove("open");
$("showAll").onclick=()=>{renderTracks();showToast("Показаны все треки")};
searchInput.oninput=e=>{let q=e.target.value.toLowerCase().trim();renderTracks(tracks.filter(t=>(t.title+" "+t.artist).toLowerCase().includes(q)))};
$("addPlaylist").onclick=()=>{let n=prompt("Название нового плейлиста:");if(n&&n.trim()){n=n.trim();customPlaylists.push(n);localStorage.setItem("swPlaylists",JSON.stringify(customPlaylists));renderCustomPlaylists();showToast("Плейлист «"+n+"» создан")}};
$("mobileMenu").onclick=()=>$("sidebar").classList.toggle("open");
$("themeBtn").onclick=()=>{document.body.classList.toggle("light");let light=document.body.classList.contains("light");localStorage.setItem("swTheme",light?"light":"dark");$("themeBtn").textContent=light?"☀":"☾"};
$("notifications").onclick=()=>showToast("Новых уведомлений нет");
$("profileBtn").onclick=()=>showToast("Профиль Алекс");
document.addEventListener("keydown",e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();searchInput.focus()}if(e.code==="Space"&&document.activeElement!==searchInput){e.preventDefault();$("playBtn").click()}});
if(localStorage.getItem("swTheme")==="light"){document.body.classList.add("light");$("themeBtn").textContent="☀"}
renderTracks();renderFavorites();renderArtists();renderHistory();renderCustomPlaylists();setTrack(0,false);$("heartBtn").classList.toggle("liked",favorites.includes(0));$("heartBtn").textContent=favorites.includes(0)?"♥":"♡";
