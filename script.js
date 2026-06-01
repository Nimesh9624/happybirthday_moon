/* =====================
   script.js — Happy Birthday Moon ❤️
   ===================== */

'use strict';

/* ---- GLOBAL STATE ---- */
let currentDay = 1;
const TOTAL_DAYS = 15;
let fireworksTimer = null;
let audioPlaying = false;
let canvasAnimFrames = {};

/* ---- CALENDAR DATA ---- */
const dayMessages = [
  { day: 1,  msg: "A special day is getting closer...\nSomething magical is on its way! 🌟" },
  { day: 2,  msg: "Someone amazing is waiting for their special day.\nCan you feel the excitement? 💫" },
  { day: 3,  msg: "Every second brings us closer\nto celebrating the most wonderful person! 🌸" },
  { day: 4,  msg: "Days like this remind me\nhow lucky I am to have you in my life. ❤️" },
  { day: 5,  msg: "Your smile lights up every room,\nyour laugh is my favorite melody. 🎵" },
  { day: 6,  msg: "Just 9 more days...\nThe countdown is real and so is my love! 💖" },
  { day: 7,  msg: "One week to go!\nGetting closer to the most special day. 🎉" },
  { day: 8,  msg: "Every day I spend thinking of you\nmakes this countdown sweeter. 🍰" },
  { day: 9,  msg: "You deserve every bit of happiness\nthis world has to offer, Moon. 🌙" },
  { day: 10, msg: "Only 5 more days!\nMy heart is doing a happy dance already! 💃" },
  { day: 11, msg: "Getting so close now...\nI hope this day brings you a million smiles! 😊" },
  { day: 12, msg: "Three days to go!\nPreparing something truly special for you. ✨" },
  { day: 13, msg: "Almost there!\nYou are the reason stars shine brighter. 🌟" },
  { day: 14, msg: "Just one more day!\nTomorrow is YOUR day, Moon! 🎂" },
  { day: 15, msg: "🎉 TODAY IS YOUR BIRTHDAY! 🎉\nHappy Birthday, Moon — the day is finally here!" },
];

const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const june2026StartDay = 1; // June 1, 2026 is a Monday (index 1)

/* ---- PAGE NAVIGATION ---- */
function goToPage(pageId) {
  const allPages = document.querySelectorAll('.page');
  const target = document.getElementById(pageId);
  if (!target) return;

  // Fade out current
  allPages.forEach(p => {
    if (p.classList.contains('active')) {
      p.style.opacity = '0';
      p.style.pointerEvents = 'none';
      setTimeout(() => p.classList.remove('active'), 650);
    }
  });

  // Fade in target
  setTimeout(() => {
    target.classList.add('active');
    target.style.opacity = '0';
    target.style.pointerEvents = 'all';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        target.style.transition = 'opacity 0.7s ease';
        target.style.opacity = '1';
      });
    });
    onPageEnter(pageId);
  }, 350);
}

function onPageEnter(pageId) {
  switch (pageId) {
    case 'page-welcome':  initWelcomeCanvas(); initBalloons(); initGlobalHearts(); break;
    case 'page-calendar': initCalendarCanvas(); buildCalendarCards(); break;
    case 'page-cake':     initCakeCanvas(); tryAutoPlay(); break;
    case 'page-cakecut':  initCakecutCanvas(); break;
    case 'page-gallery':  initGalleryCanvas(); break;
    case 'page-message':  initMessageCanvas(); startTypingEffect(); initFlowers(); break;
  }
}

/* ============================================================
   PAGE 1 — WELCOME CANVAS (Stars + Hearts + Particles)
   ============================================================ */
function initWelcomeCanvas() {
  const canvas = document.getElementById('welcome-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, stars = [], particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Stars
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.6 + 0.3,
      speed: Math.random() * 0.4 + 0.1,
      twinkle: Math.random() * Math.PI * 2
    });
  }
  // Particles
  for (let i = 0; i < 60; i++) {
    particles.push(makeParticle(W, H));
  }

  function makeParticle(W, H) {
    const colors = ['#ff6b9d','#c9184a','#f9ca24','#9b59b6','#ff99cc'];
    return {
      x: Math.random() * W,
      y: Math.random() * H + H,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -(Math.random() * 1.2 + 0.4),
      r: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: Math.random()
    };
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);

    // Stars
    stars.forEach(s => {
      s.twinkle += 0.04;
      const alpha = 0.4 + 0.6 * Math.abs(Math.sin(s.twinkle));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,230,245,${alpha})`;
      ctx.fill();
      s.y -= s.speed * 0.1;
      if (s.y < 0) { s.y = H; s.x = Math.random() * W; }
    });

    // Particles
    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life += 0.008;
      if (p.y < -20 || p.life > 1) {
        particles[i] = makeParticle(W, H);
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.floor((1 - p.life) * 220).toString(16).padStart(2,'0');
      ctx.fill();
    });

    canvasAnimFrames['welcome'] = requestAnimationFrame(draw);
  }
  cancelAnimationFrame(canvasAnimFrames['welcome']);
  draw(0);
}

/* ---- Balloons ---- */
function initBalloons() {
  const container = document.getElementById('balloons');
  container.innerHTML = '';
  const emojis = ['🎈','🎈','🎈','🎉','🎊','❤️','💖','🌸'];
  for (let i = 0; i < 12; i++) {
    const b = document.createElement('div');
    b.className = 'balloon';
    b.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    b.style.left   = Math.random() * 100 + 'vw';
    b.style.animationDuration = (10 + Math.random() * 12) + 's';
    b.style.animationDelay   = (Math.random() * 10) + 's';
    b.style.fontSize = (1.8 + Math.random() * 2) + 'rem';
    container.appendChild(b);
  }
}

/* ---- Global Hearts ---- */
function initGlobalHearts() {
  const container = document.getElementById('global-hearts');
  container.innerHTML = '';
  const hearts = ['❤️','💖','💕','💗','💓','💞'];
  for (let i = 0; i < 18; i++) {
    const h = document.createElement('div');
    h.className = 'g-heart';
    h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    h.style.left = Math.random() * 100 + 'vw';
    h.style.animationDuration = (8 + Math.random() * 14) + 's';
    h.style.animationDelay   = (Math.random() * 12) + 's';
    h.style.fontSize = (0.8 + Math.random() * 1.4) + 'rem';
    container.appendChild(h);
  }
}

/* ============================================================
   PAGE 2 — CALENDAR CANVAS + CARDS
   ============================================================ */
function initCalendarCanvas() {
  const canvas = document.getElementById('calendar-canvas');
  const ctx = canvas.getContext('2d');
  let W, H;
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const hearts = [];
  for (let i = 0; i < 30; i++) {
    hearts.push({
      x: Math.random() * W,
      y: H + Math.random() * H,
      vy: -(0.5 + Math.random() * 1.2),
      size: 14 + Math.random() * 18,
      opacity: 0.3 + Math.random() * 0.4
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // Stars bg
    ctx.fillStyle = 'rgba(255,200,230,0.6)';
    for (let i = 0; i < 80; i++) {
      ctx.beginPath();
      ctx.arc(
        ((i * 137 + 11) % W),
        ((i * 97 + 17) % H),
        Math.random() * 1.2 + 0.3, 0, Math.PI * 2
      );
      ctx.fill();
    }
    // Floating hearts
    hearts.forEach(h => {
      h.y += h.vy;
      if (h.y < -50) { h.y = H + 20; h.x = Math.random() * W; }
      ctx.font = `${h.size}px serif`;
      ctx.globalAlpha = h.opacity;
      ctx.fillText('❤', h.x, h.y);
      ctx.globalAlpha = 1;
    });
    canvasAnimFrames['calendar'] = requestAnimationFrame(draw);
  }
  cancelAnimationFrame(canvasAnimFrames['calendar']);
  draw();
}

function buildCalendarCards() {
  const stack = document.getElementById('calendar-stack');
  stack.innerHTML = '';
  currentDay = 1;

  dayMessages.forEach((d, i) => {
    const card = document.createElement('div');
    card.className = 'cal-card' + (i === 0 ? ' current' : '');
    card.id = `cal-card-${d.day}`;

    const dowIndex = (june2026StartDay + d.day - 1) % 7;
    const dayOfWeek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][dowIndex];

    card.innerHTML = `
      <div class="cal-card-bg"></div>
      <div class="cal-card-tear"></div>
      <div class="cal-month">JUNE 2026</div>
      <div class="cal-day-num">${d.day}</div>
      <div class="cal-day-name">${dayOfWeek}</div>
      <div class="cal-msg">${d.msg.replace(/\n/g,'<br/>')}</div>
      <div class="cal-hearts">💖</div>
    `;
    stack.appendChild(card);
  });
  updateCalNavButtons();
}

function updateCalNavButtons() {
  const prevBtn = document.getElementById('btn-prev-day');
  const nextBtn = document.getElementById('btn-next-day');
  if (prevBtn) prevBtn.style.display = currentDay > 1 ? 'inline-block' : 'none';
  if (nextBtn) nextBtn.textContent = currentDay < TOTAL_DAYS ? 'Next Day →' : '🎉 Reveal Birthday!';
}

function nextDay() {
  if (currentDay >= TOTAL_DAYS) {
    // Trigger birthday reveal
    triggerBirthdayReveal();
    return;
  }
  const currentCard = document.getElementById(`cal-card-${currentDay}`);
  if (!currentCard) return;

  // Flip animation
  currentCard.classList.add('flipping');
  currentCard.classList.remove('current');

  // Confetti burst
  confetti({ particleCount: 40, spread: 60, origin: { y: 0.5 }, colors: ['#ff6b9d','#f9ca24','#9b59b6'] });

  setTimeout(() => {
    currentCard.style.display = 'none';
    currentDay++;
    const nextCard = document.getElementById(`cal-card-${currentDay}`);
    if (nextCard) {
      nextCard.classList.add('current');
      nextCard.style.opacity = '0';
      requestAnimationFrame(() => {
        nextCard.style.transition = 'opacity 0.5s ease';
        nextCard.style.opacity = '1';
      });
    }
    updateCalNavButtons();
  }, 650);
}

function prevDay() {
  if (currentDay <= 1) return;
  const currentCard = document.getElementById(`cal-card-${currentDay}`);
  if (currentCard) {
    currentCard.classList.remove('current');
    currentCard.style.display = 'none';
  }
  currentDay--;
  const prevCard = document.getElementById(`cal-card-${currentDay}`);
  if (prevCard) {
    prevCard.classList.remove('flipping');
    prevCard.style.display = '';
    prevCard.style.opacity = '0';
    prevCard.classList.add('current');
    requestAnimationFrame(() => {
      prevCard.style.transition = 'opacity 0.4s ease';
      prevCard.style.opacity = '1';
    });
  }
  updateCalNavButtons();
}

/* ============================================================
   PAGE 3 — BIRTHDAY REVEAL
   ============================================================ */
function triggerBirthdayReveal() {
  const overlay = document.getElementById('page-reveal');
  overlay.style.display = 'flex';
  overlay.style.opacity = '0';
  setTimeout(() => {
    overlay.style.transition = 'opacity 0.6s ease';
    overlay.style.opacity = '1';
  }, 50);

  // Heart explosion sparkles
  const sp = document.getElementById('popup-sparkles');
  for (let i = 0; i < 24; i++) {
    const dot = document.createElement('div');
    dot.className = 'sparkle-dot';
    const angle = (i / 24) * Math.PI * 2;
    const dist  = 80 + Math.random() * 80;
    dot.style.cssText = `
      width:${6 + Math.random()*8}px;
      height:${6 + Math.random()*8}px;
      background:${['#ff6b9d','#f9ca24','#9b59b6','#ff99cc','#fff'][Math.floor(Math.random()*5)]};
      top:50%; left:50%;
      --tx:${Math.cos(angle)*dist}px;
      --ty:${Math.sin(angle)*dist}px;
      animation-delay:${Math.random()*0.4}s;
      animation-duration:${0.8+Math.random()*0.6}s;
    `;
    sp.appendChild(dot);
  }

  // Fireworks canvas
  startFireworks();

  // Confetti burst
  setTimeout(() => {
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.4 }, colors: ['#ff6b9d','#f9ca24','#9b59b6','#ff99cc'] });
    confetti({ particleCount: 80, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#ff6b9d','#ffd700'] });
    confetti({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#9b59b6','#ff6b9d'] });
  }, 400);
}

function startFireworks() {
  const canvas = document.getElementById('fireworks-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const rockets = [];
  function addRocket() {
    rockets.push({
      x: Math.random() * canvas.width,
      y: canvas.height,
      tx: 100 + Math.random() * (canvas.width - 200),
      ty: 80 + Math.random() * (canvas.height * 0.5),
      speed: 6 + Math.random() * 4,
      particles: [],
      exploded: false
    });
  }
  addRocket(); addRocket();

  const colors = ['#ff6b9d','#f9ca24','#9b59b6','#ff99cc','#ff4444','#44ffaa','#4488ff'];

  function explode(r) {
    r.exploded = true;
    for (let i = 0; i < 80; i++) {
      const angle = (i / 80) * Math.PI * 2;
      const speed = 1 + Math.random() * 4;
      r.particles.push({
        x: r.x, y: r.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1, decay: 0.015 + Math.random() * 0.02,
        size: 2 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  let frameId;
  function drawFW() {
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    rockets.forEach((r, ri) => {
      if (!r.exploded) {
        const dx = r.tx - r.x, dy = r.ty - r.y;
        const dist = Math.hypot(dx, dy);
        if (dist < r.speed) {
          r.x = r.tx; r.y = r.ty;
          explode(r);
        } else {
          r.x += (dx / dist) * r.speed;
          r.y += (dy / dist) * r.speed;
          ctx.beginPath();
          ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#fff';
          ctx.fill();
        }
      }
      r.particles = r.particles.filter(p => p.life > 0);
      r.particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.vy += 0.06;
        p.life -= p.decay;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.life * 255).toString(16).padStart(2,'0');
        ctx.fill();
      });

      if (r.exploded && r.particles.length === 0) {
        rockets.splice(ri, 1);
      }
    });

    if (rockets.length < 3 && Math.random() < 0.03) addRocket();
    frameId = requestAnimationFrame(drawFW);
  }
  cancelAnimationFrame(canvasAnimFrames['fireworks']);
  canvasAnimFrames['fireworks'] = frameId;
  drawFW();
}

function goToCakePage() {
  const overlay = document.getElementById('page-reveal');
  overlay.style.opacity = '0';
  setTimeout(() => { overlay.style.display = 'none'; }, 600);
  cancelAnimationFrame(canvasAnimFrames['fireworks']);
  goToPage('page-cake');
}


/* ============================================================
   PAGE 4 — CAKE CANVAS + MUSIC
   ============================================================ */
function initCakeCanvas() {
  const canvas = document.getElementById('cake-canvas');
  const ctx = canvas.getContext('2d');
  let W, H;
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();

  const stars = Array.from({ length: 120 }, () => ({
    x: Math.random(), y: Math.random(),
    r: Math.random() * 1.4 + 0.3,
    t: Math.random() * Math.PI * 2
  }));

  function draw() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
      s.t += 0.03;
      const alpha = 0.3 + 0.5 * Math.abs(Math.sin(s.t));
      ctx.beginPath();
      ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,220,240,${alpha})`;
      ctx.fill();
    });
    canvasAnimFrames['cake'] = requestAnimationFrame(draw);
  }
  cancelAnimationFrame(canvasAnimFrames['cake']);
  draw();
}

function tryAutoPlay() {
  const audio = document.getElementById('birthday-audio');
  if (!audio) return;
  audio.volume = 0.5;
  const promise = audio.play();
  if (promise !== undefined) {
    promise.then(() => {
      audioPlaying = true;
      updateMusicUI();
    }).catch(() => {
      // Autoplay blocked, user must click
    });
  }
}

function toggleMusic() {
  const audio = document.getElementById('birthday-audio');
  if (!audio) return;
  if (audioPlaying) {
    audio.pause();
    audioPlaying = false;
  } else {
    audio.play();
    audioPlaying = true;
  }
  updateMusicUI();
}

function updateMusicUI() {
  const btn  = document.getElementById('btn-play');
  const wave = document.getElementById('music-wave');
  if (!btn || !wave) return;
  btn.textContent = audioPlaying ? '⏸ Pause' : '▶ Play';
  if (audioPlaying) wave.classList.remove('paused');
  else              wave.classList.add('paused');
}

function setVolume(val) {
  const audio = document.getElementById('birthday-audio');
  if (audio) audio.volume = parseFloat(val);
}


/* ============================================================
   PAGE 5 — CAKE CUTTING CANVAS
   ============================================================ */
function initCakecutCanvas() {
  const canvas = document.getElementById('cakecut-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();

  const sparkles = Array.from({ length: 60 }, () => ({
    x: Math.random(), y: Math.random(),
    r: Math.random() * 1.2 + 0.3,
    t: Math.random() * Math.PI * 2
  }));

  function draw() {
    ctx.clearRect(0, 0, W, H);
    sparkles.forEach(s => {
      s.t += 0.05;
      const alpha = 0.2 + 0.6 * Math.abs(Math.sin(s.t));
      ctx.beginPath();
      ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,180,220,${alpha})`;
      ctx.fill();
    });
    canvasAnimFrames['cakecut'] = requestAnimationFrame(draw);
  }
  cancelAnimationFrame(canvasAnimFrames['cakecut']);
  draw();
}

function cutTheCake() {
  const btn     = document.getElementById('btn-cut');
  const knife   = document.getElementById('knife');
  const cutLeft  = document.getElementById('cut-left');
  const cutRight = document.getElementById('cut-right');
  const glowText = document.getElementById('bday-glow-text');
  const nextBtn  = document.getElementById('btn-gallery');
  const heading  = document.getElementById('cakecut-heading');

  if (btn) btn.style.display = 'none';
  if (heading) heading.textContent = '✂️ Here we go...';

  // Show knife animation
  if (knife) {
    knife.style.opacity = '1';
    knife.classList.add('show');
  }

  setTimeout(() => {
    // Split the cake
    if (cutLeft)  cutLeft.classList.add('split');
    if (cutRight) cutRight.classList.add('split');

    // Confetti blast
    confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 }, colors: ['#ff6b9d','#f9ca24','#9b59b6','#fff'] });
    confetti({ particleCount: 100, angle: 60, spread: 70, origin: { x: 0 }, colors: ['#ff6b9d','#ffd700'] });
    confetti({ particleCount: 100, angle: 120, spread: 70, origin: { x: 1 }, colors: ['#9b59b6','#ff99cc'] });

    // Balloon rise via new elements
    launchBalloons();

    // Start fireworks
    startCakeCutFireworks();

    if (heading) heading.textContent = '🎉 Happy Birthday MOON! 🎉';

    setTimeout(() => {
      if (glowText) {
        glowText.style.display = 'block';
        glowText.style.animation = 'zoom-in 0.5s ease, glow-pulse 1.5s ease-in-out infinite';
      }
      setTimeout(() => {
        if (nextBtn) nextBtn.style.display = 'inline-block';
      }, 1200);
    }, 800);
  }, 900);
}

function launchBalloons() {
  const colors = ['🎈','🎊','🎉','❤️','💖'];
  const scene = document.getElementById('page-cakecut');
  for (let i = 0; i < 10; i++) {
    const b = document.createElement('div');
    b.textContent = colors[Math.floor(Math.random() * colors.length)];
    b.style.cssText = `
      position:absolute;
      bottom:-60px;
      left:${5 + Math.random() * 90}%;
      font-size:${2 + Math.random() * 1.5}rem;
      animation: balloon-rise ${5 + Math.random() * 5}s ease-in forwards;
      pointer-events:none;
      z-index:50;
    `;
    scene.appendChild(b);
    setTimeout(() => b.remove(), 12000);
  }
}

function startCakeCutFireworks() {
  const fw = document.getElementById('cakecut-canvas');
  if (!fw) return;
  const ctx = fw.getContext('2d');
  const W = fw.width, H = fw.height;

  for (let burst = 0; burst < 5; burst++) {
    setTimeout(() => {
      const x = 100 + Math.random() * (W - 200);
      const y = 80 + Math.random() * (H * 0.4);
      const colors = ['#ff6b9d','#f9ca24','#9b59b6','#fff','#ff4444'];
      const parts = [];
      for (let i = 0; i < 60; i++) {
        const angle = (i / 60) * Math.PI * 2;
        parts.push({
          x, y,
          vx: Math.cos(angle) * (2 + Math.random() * 4),
          vy: Math.sin(angle) * (2 + Math.random() * 4),
          life: 1,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
      const fwDraw = () => {
        parts.forEach(p => {
          p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.life -= 0.02;
          if (p.life > 0) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3 * p.life, 0, Math.PI * 2);
            ctx.fillStyle = p.color + Math.floor(p.life * 200).toString(16).padStart(2,'0');
            ctx.fill();
          }
        });
        if (parts.some(p => p.life > 0)) requestAnimationFrame(fwDraw);
      };
      fwDraw();
    }, burst * 400);
  }
}


/* ============================================================
   PAGE 6 — GALLERY CANVAS
   ============================================================ */
function initGalleryCanvas() {
  const canvas = document.getElementById('gallery-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();

  const dots = Array.from({ length: 40 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: Math.random() * 2 + 0.5,
    t: Math.random() * Math.PI * 2,
    color: ['#ff6b9d','#9b59b6','#f9ca24'][Math.floor(Math.random() * 3)]
  }));

  function draw() {
    ctx.clearRect(0, 0, W, H);
    dots.forEach(d => {
      d.t += 0.04; d.y -= 0.3;
      if (d.y < -10) { d.y = H + 10; d.x = Math.random() * W; }
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = d.color + Math.floor((0.3 + 0.4 * Math.abs(Math.sin(d.t))) * 255).toString(16).padStart(2,'0');
      ctx.fill();
    });
    canvasAnimFrames['gallery'] = requestAnimationFrame(draw);
  }
  cancelAnimationFrame(canvasAnimFrames['gallery']);
  draw();
}

function openLightbox(src) {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  img.src = src;
  lb.classList.add('open');
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
}


/* ============================================================
   PAGE 7 — TYPING EFFECT + MESSAGE CANVAS + FLOWERS
   ============================================================ */
const loveMessage = `Dear Moon,

Today is your special day.

Thank you for being such an amazing person.
Every moment with you is a memory I treasure deeply.

May every dream of yours come true,
and may happiness follow you forever.

You deserve all the love, joy, and magic
this world has to offer — and so much more.

Happy Birthday ❤️`;

function startTypingEffect() {
  const el = document.getElementById('typed-text');
  const sig = document.getElementById('message-signature');
  if (!el) return;
  el.innerHTML = '';
  let i = 0;
  const cursor = document.createElement('span');
  cursor.className = 'typed-cursor';
  el.appendChild(cursor);

  const interval = setInterval(() => {
    if (i < loveMessage.length) {
      const char = loveMessage[i];
      el.insertBefore(document.createTextNode(char), cursor);
      i++;
      // Auto-scroll
      el.scrollTop = el.scrollHeight;
    } else {
      clearInterval(interval);
      cursor.remove();
      // Show signature
      setTimeout(() => {
        if (sig) sig.classList.add('visible');
        // Confetti finale
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.5 }, colors: ['#ff6b9d','#f9ca24','#9b59b6'] });
      }, 500);
    }
  }, 55);
}

function initMessageCanvas() {
  const canvas = document.getElementById('message-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();

  const sparks = Array.from({ length: 80 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 1.5 + 0.3,
    t: Math.random() * Math.PI * 2,
    vy: -(0.3 + Math.random() * 0.7)
  }));

  function draw() {
    ctx.clearRect(0, 0, W, H);
    sparks.forEach(s => {
      s.t += 0.04; s.y += s.vy;
      if (s.y < -10) { s.y = H + 10; s.x = Math.random() * W; }
      const alpha = 0.25 + 0.55 * Math.abs(Math.sin(s.t));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,180,220,${alpha})`;
      ctx.fill();
    });
    canvasAnimFrames['message'] = requestAnimationFrame(draw);
  }
  cancelAnimationFrame(canvasAnimFrames['message']);
  draw();
}

function initFlowers() {
  const container = document.getElementById('floating-flowers');
  if (!container) return;
  container.innerHTML = '';
  const flowers = ['🌸','🌺','🌼','🌹','💐','🌷'];
  for (let i = 0; i < 16; i++) {
    const f = document.createElement('div');
    f.className = 'flower';
    f.textContent = flowers[Math.floor(Math.random() * flowers.length)];
    f.style.left = Math.random() * 100 + 'vw';
    f.style.animationDuration = (8 + Math.random() * 10) + 's';
    f.style.animationDelay   = (Math.random() * 8) + 's';
    f.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
    container.appendChild(f);
  }
}


/* ============================================================
   INIT ON LOAD
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Make sure only welcome page is active initially
  document.querySelectorAll('.page').forEach(p => {
    if (!p.classList.contains('active')) {
      p.style.opacity = '0';
    }
  });

  // Init welcome page
  initWelcomeCanvas();
  initBalloons();
  initGlobalHearts();

  // Add keyboard shortcut: Escape to close lightbox
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });

  // Resume music on user interaction if audio was loaded
  document.body.addEventListener('click', () => {
    const audio = document.getElementById('birthday-audio');
    if (audio && !audioPlaying && document.getElementById('page-cake').classList.contains('active')) {
      // Don't auto-trigger — let user use player
    }
  }, { once: true });
});
