/* ---------- particle connecting background ---------- */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let w, h, particles;

function resize(){
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const COLORS = ['255,214,10', '168,85,247']; // yellow, purple in rgb

function makeParticles(){
  const count = Math.min(90, Math.floor((w*h)/16000));
  particles = Array.from({length:count}, () => ({
    x: Math.random()*w,
    y: Math.random()*h,
    vx: (Math.random()-0.5)*0.4,
    vy: (Math.random()-0.5)*0.4,
    color: COLORS[Math.floor(Math.random()*COLORS.length)]
  }));
}
makeParticles();
window.addEventListener('resize', makeParticles);

function step(){
  ctx.clearRect(0,0,w,h);

  for(const p of particles){
    p.x += p.vx;
    p.y += p.vy;
    if(p.x < 0 || p.x > w) p.vx *= -1;
    if(p.y < 0 || p.y > h) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI*2);
    ctx.fillStyle = `rgba(${p.color},0.7)`;
    ctx.fill();
  }

  const maxDist = 130;
  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      const a = particles[i], b = particles[j];
      const dx = a.x-b.x, dy = a.y-b.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if(dist < maxDist){
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(180,150,220,${0.12 * (1 - dist/maxDist)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(step);
}
step();

/* ---------- game data ----------
   These are placeholder entries pointing at itch.io's free HTML5 browse page
   and a few well-known itch.io creator pages. VERIFY each url still resolves
   and swap in your own picks before deploying — itch.io listings change. */
const GAMES = [
  { title:"A Dark Room", desc:"Minimalist text-driven survival/strategy game that unfolds into something much bigger.", tag:"puzzle", emoji:"🔥", url:"https://itch.io/games/free/html5/tag-text" },
  { title:"Celeste Classic", desc:"The free pixel-art precursor to Celeste — tight platforming, brutal precision.", tag:"platformer", emoji:"🍓", url:"https://itch.io/games/free/html5/tag-platformer" },
  { title:"Vector Runner", desc:"Fast-paced endless arcade dodger with a neon vector look.", tag:"arcade", emoji:"⚡", url:"https://itch.io/games/free/html5/tag-arcade" },
  { title:"Block Logic", desc:"Bite-sized logic puzzles, one new mechanic per level.", tag:"puzzle", emoji:"🧩", url:"https://itch.io/games/free/html5/tag-puzzle" },
  { title:"Roguelite Dash", desc:"Procedural dungeon crawler, permadeath, browser-playable.", tag:"action", emoji:"🗡️", url:"https://itch.io/games/free/html5/tag-roguelike" },
  { title:"Skybound", desc:"Physics-based flying game — glide, boost, chase the horizon.", tag:"arcade", emoji:"🪁", url:"https://itch.io/games/free/html5/tag-flying" },
  { title:"Tower Climb", desc:"Procedurally generated vertical platformer, one hit and you're back to floor one.", tag:"platformer", emoji:"🏗️", url:"https://itch.io/games/free/html5/tag-difficult" },
  { title:"Pixel Brawl", desc:"Top-down arena brawler with local co-op support.", tag:"action", emoji:"🥊", url:"https://itch.io/games/free/html5/tag-action" },
  { title:"Tile Merge", desc:"2048-style merging puzzle with a fresh twist on combos.", tag:"puzzle", emoji:"🔢", url:"https://itch.io/games/free/html5/tag-2d" },
];

/* ---------- render ---------- */
const grid = document.getElementById('game-grid');
const search = document.getElementById('search');
const navLinks = document.querySelectorAll('.nav-link');
let activeFilter = 'all';

function render(){
  const q = search.value.trim().toLowerCase();
  grid.innerHTML = '';

  const filtered = GAMES.filter(g => {
    const matchesFilter = activeFilter === 'all' || activeFilter === 'favorites' || g.tag === activeFilter;
    const matchesSearch = g.title.toLowerCase().includes(q) || g.desc.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  if(filtered.length === 0){
    grid.innerHTML = `<p style="color:var(--muted); font-size:14px;">no games match — try another search or category.</p>`;
    return;
  }

  for(const g of filtered){
    const card = document.createElement('a');
    card.className = 'card';
    card.href = g.url;
    card.target = '_blank';
    card.rel = 'noopener';

    const tagClass = g.tag === 'puzzle' || g.tag === 'platformer' ? 'tag-y' : '';
    const thumbBg = (g.tag === 'puzzle' || g.tag === 'platformer')
      ? 'linear-gradient(135deg, rgba(255,214,10,0.15), rgba(255,214,10,0.02))'
      : 'linear-gradient(135deg, rgba(168,85,247,0.18), rgba(168,85,247,0.02))';

    card.innerHTML = `
      <div class="card-thumb" style="background:${thumbBg}">${g.emoji}</div>
      <div class="card-body">
        <span class="card-tag ${tagClass}">${g.tag}</span>
        <span class="card-title">${g.title}</span>
        <span class="card-desc">${g.desc}</span>
      </div>
    `;
    grid.appendChild(card);
  }
}

search.addEventListener('input', render);

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    activeFilter = link.dataset.filter;
    render();
  });
});

render();
