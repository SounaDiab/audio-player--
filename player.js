let playylist = document.querySelector('.playlist');
function open_p() {
    playylist.classList.toggle('active');
}
window.addEventListener("DOMContentLoaded", () => {
  // (A) PLAYER INIT
  // (A1) PLAYLIST - CHANGE TO YOUR OWN!
  const playlist = [
    { src: "audio/دعاء الافتتاح.mp3", name: "دعاء الافتتاح", artist: "الحاج حسين غريب", cover: "pic/دعاء الافتتاح.jpeg" },
    { src: "audio/دعاء التوسل.mp3", name: "دعاء التوسل", artist: "الحاج حسين غريب", cover: "pic/دعاء التوسل.jpeg" },
    { src: "audio/دعاء الحزين.mp3", name: "دعاء الحزين", artist: "الحاج حسين غريب", cover: "pic/دعاء الحزين.jpg" },
    { src: "audio/دعاء الصباح.mp3", name: "دعاء الصباح", artist: "أباذر الحلواجي", cover: "pic/دعاء الصباح.jpeg" },
    { src: "audio/دعاء كميل.mp3", name: "دعاء كميل", artist: "الحاج حسين غريب", cover: "pic/دعاء كميل.jpg" },
  ];

  // (A2) AUDIO PLAYER & GET HTML CONTROLS
  const audio = new Audio(),
    aPlay = document.getElementById("aPlay"),
    aList = document.getElementById("aList"),
    image = document.getElementById("cover"),
    title = document.getElementById("title"),
    artist = document.getElementById("artist"),
    nextBtn = document.getElementById("next"),
    prevBtn = document.getElementById("previous");
    

  // (A3) BUILD PLAYLIST
  for (let i in playlist) {
    let row = document.createElement("div");
    let h3 = document.createElement("h3");
    row.className = "aRow";
    row.innerHTML = playlist[i]["name"];
    row.addEventListener("click", () => {audPlay(i);});
    playlist[i]["row"] = row;
    playlist[i]["h3"] = h3;
    aList.appendChild(row);
    row.appendChild(h3);
    h3.innerHTML = playlist[i]["artist"];
    title.innerHTML = playlist[i]["name"]; 
  }
  

  let isLoading = false;
  function loadSongs(song) {
    title.innerHTML = song.name;
    artist.innerHTML = song.artist;
    audio.src = song.src;
    changeCover(song.cover);
  }

  function changeCover(cover) {
    image.classList.remove("active3");
    setTimeout(function () {
      image.src = cover;
      image.classList.add("active3");
    }, 100);
    background.src = cover;
  }
  let songIndex = 0;

  function playSong() {
    isLoading = true;
    audio.play()
  }
  
  function prevSong() {
    songIndex--;
    if (songIndex < 0) {
      songIndex = playlist.length - 1;
    }
    loadSongs(playlist[songIndex]);
    playSong();
  }

  function nextSong() {
    songIndex++;
    if (songIndex > playlist.length - 1) {
      songIndex = 0;
    }
    loadSongs(playlist[songIndex]);
    playSong();
  }

  loadSongs(playlist[songIndex]);
  nextBtn.onclick = () => {
    playy.style.display = "none";
    pausee.style.display = "block";
  };
  
prevBtn.onclick = () => {
    playy.style.display = "none";
    pausee.style.display = "block";
  };
  

  // (B) PLAY MECHANISM
  // (B1) FLAGS
  let audNow = 0, // current song
    audStart = false; // auto start next song

  // (B2) PLAY SELECTED SONG
    let audPlay = (idx, nostart) => {
    audNow = idx;
    audStart = nostart ? false : true;
    audio.src = playlist[idx]["src"];
    image.src = playlist[idx]["cover"];
    title.innerHTML = playlist[idx]["name"];
    artist.innerHTML = playlist[idx]["artist"];
    for (let i in playlist) {
      if (i == idx) {
        playlist[i]["row"].classList.add("now");
        playlist[i]["h3"].classList.add("now");
      }
      else {
        playlist[i]["row"].classList.remove("now");
        playlist[i]["h3"].classList.remove("now");
      }
    }
  };

  // (B3) AUTO START WHEN SUFFICIENTLY BUFFERED
  audio.addEventListener("canplay", () => { if (audStart) {
    audio.play();
    audStart = false;
  }});

  // (B4) AUTOPLAY NEXT SONG IN THE PLAYLIST
  audio.addEventListener("ended", () => {
    audNow++;
    if (audNow >= playlist.length) { audNow = 0; }
    audPlay(audNow);
  });

  // (B5) INIT SET FIRST SONG
  audPlay(0, true);

  //(C) PLAY/PAUSE BUTTON
  //(C1) AUTO SET PLAY/PAUSE TEXT
  let playy = document.querySelector(".playy")
let pausee = document.querySelector(".pausee");
  audio.addEventListener("play", () => {
    playy.style.display = "none";
    pausee.style.display = "block";
  });
  audio.addEventListener("pause", () => {
    playy.style.display = "block";
    pausee.style.display = "none";
  });

  // (C2) CLICK TO PLAY/PAUSE
  aPlay.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
    }
    else {
      audio.pause();
    }
  });

  // (G) ENABLE/DISABLE CONTROLS
  audio.addEventListener("canplay", () => {
    aPlay.disabled = false;
  });
  audio.addEventListener("waiting", () => {
    aPlay.disabled = true;
  });

  const knob = document.querySelector(".knob");
  const percent = document.querySelector(".percent");
  const prog = document.querySelector(".progress1 > div");
  const bar = document.querySelector(".progress1");

// set volume to mute initially
audio.volume = 0.0;


// previous x,y values
let prevX = 0;
let prevY = 0;

// final calculation volume
let vol = 0;

// get the full bar width
const barW = bar.clientWidth;

function volumeKnob(e) {
    const w = knob.clientWidth / 2;
    const h = knob.clientHeight / 2;

    const x = e.clientX - knob.offsetLeft;
    const y = e.clientY - knob.offsetTop;

    const deltaX = w - x;
    const deltaY = h - y;

    const rad = Math.atan2(deltaY, deltaX);
    let deg = rad * (180 / Math.PI);

    // Top right corner
    if (y < h && x > w) {
        if (prevX <= x && prevY <= y) {
            vol++;
        } else if (prevX >= x && prevY >= y) {
            vol--;
        } 
    }
    // Bottom right corner
    else if (y > h && x > w) {
        if (prevX >= x && prevY <= y) {
            vol++;
        } else if (prevX <= x && prevY >= y) {
            vol--;
        } 
    }
    // Top left corner
    else if (y < h && x < w) {
        if (prevX <= x && prevY >= y) {
            vol++;
        } else if (prevX >= x && prevY <= y) {
            vol--;
        } 
    }
    // Bottom left corner
    else if (y > h && x < w) {
        if (prevX >= x && prevY >= y) {
            vol++;
        } else if (prevX <= x && prevY <= y) {
            vol--;
        } 
    }

    // Get percentage of progress width
    const percentage = Math.round((100 * vol) / barW);

    // Restrict progress going below zero
    if (vol < 0) {
        vol = 0;
    // Restrict progress going above 100%
    } else if (vol > barW) {
        vol = barW;
    } else {
        //Set progress width
        prog.style.width = vol + "px";
        //set audio volume
        audio.volume = percentage / 100;
        //Set the percent output
        percent.innerText = percentage + "%";
    }
    // Update values
    prevX = x;
    prevY = y;

    return deg;
}

// Rotation
function rotate(e) {
    // Final calculation for the mouse position
    const result = Math.floor(volumeKnob(e) - 80);
    // Rotate knob with the final calculation
    knob.style.transform = `rotate(${result}deg)`;
}

//Starr rotations
function startRotation() {
    window.addEventListener("mousemove", rotate);
    window.addEventListener("mouseup", endRotation);
}

//Emd rotations
function endRotation() {
    window.removeEventListener("mousemove", rotate);
}

// Add event listeners
  knob.addEventListener("mousedown", startRotation);


  // PROGRESS AND TIMER
  const progress = document.getElementById("progress");
  const progressContainer = document.getElementById("progress-container");
  const currentTimeEl = document.getElementById("current-time");
  const durationEl = document.getElementById("duration");
  function updateProgressBar(){
    if(isLoading){
      const duration = audio.duration;
      let currentTime = audio.currentTime;
      let progressPercent = (currentTime / duration) * 100;
      progress.style.width = progressPercent + "%";
      const durationMinutes = Math.floor(duration / 60);
      const durationSeconds = Math.floor(duration % 60);
      if(durationSeconds < 10){
        durationSeconds = "0" + durationSeconds;
      }
      if(durationSeconds){
        durationEl.innerHTML = durationMinutes + ":" + durationSeconds;
      }
      const currentMinutes = Math.floor(currentTime / 60);
      let currentSeconds = Math.floor(currentTime % 60);
      if(currentSeconds < 10){
        currentSeconds = "0" + currentSeconds;
      }
      currentTimeEl.innerHTML = currentMinutes + ":" + currentSeconds;
    }
  }

        function setProgressBar(e){
            const width = this.clientWidth;
            const clickX = e.offsetX;
            const duration = audio.duration;
            audio.currentTime = (clickX / width) * duration;
  }
  function pauseSong(){
            isLoading = false;
            audio.pause();
}
  function playToggle(){
            if(isLoading){
              pauseSong();
              //updateProgressBar();
            }else{
              playSong();
              //updateProgressBar();
            }
        }
  progressContainer.addEventListener("click", setProgressBar);
  audio.addEventListener("timeupdate", updateProgressBar);
  prevBtn.addEventListener("click",prevSong);
  nextBtn.addEventListener("click", nextSong);
  audio.addEventListener("ended",nextSong);
  aPlay.addEventListener("click", playToggle);
  aList.addEventListener("click", updateProgressBar);



  let arow = document.querySelector(".aRow");
  arow.addEventListener("click", updateProgressBar);
});