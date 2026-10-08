import { lerp } from '../core/math.js';
import { FONT } from './style.js';

// Desenhos da abertura (#76), num quadro de 800 x 450: céu, chão de planeta, tripulação, base, nave e as três telas.

const STAR_SEED = Array.from({ length: 90 }, (_, i) => ({ u: (i * 0.6180339) % 1, v: (i * 0.7548776) % 1, ph: i * 1.7 }));

export function stars(c, W, H, t) {
  for (const s of STAR_SEED) {
    const a = 0.25 + 0.5 * (0.5 + 0.5 * Math.sin(t * 1.5 + s.ph));
    c.fillStyle = `rgba(220,235,255,${a.toFixed(2)})`;
    c.fillRect(s.u * W, s.v * H * 0.75, 1.5, 1.5);
  }
}

// Chão de planeta com contorno verde-água, como o terreno do jogo. Vai além do quadro de 800,
// para cobrir telas mais largas. Devolve a altura do chão em x e a função que desenha.
function terrain(y0, seed) {
  const y = (x) => y0 + 14 * Math.sin(x * 0.013 + seed) + 7 * Math.sin(x * 0.041 + seed * 2);
  const draw = (c) => {
    const pts = [];
    for (let x = -600; x <= 1400; x += 20) pts.push([x, y(x)]);
    c.fillStyle = '#121a29';
    c.beginPath();
    c.moveTo(-600, 900);
    pts.forEach(([x, yy]) => c.lineTo(x, yy));
    c.lineTo(1400, 900);
    c.closePath();
    c.fill();
    c.lineWidth = 2.5;
    c.strokeStyle = '#46e0c8';
    c.beginPath();
    pts.forEach(([x, yy], i) => (i ? c.lineTo(x, yy) : c.moveTo(x, yy)));
    c.stroke();
  };
  return { y, draw };
}

// Tripulante de traços. pose: 'wave' (acenando), 'sit' (sentado, mão na cabeça), 'pace' (andando)
function crewman(c, x, y, pose, t, s = 2.2) {
  c.save();
  c.translate(x, y);
  c.scale(s, s);
  c.strokeStyle = '#ffe0b8';
  c.lineWidth = 1.6;
  c.lineCap = 'round';
  c.beginPath();
  if (pose === 'sit') {
    c.arc(0, -9, 2.2, 0, Math.PI * 2);
    c.moveTo(0, -6.5); c.lineTo(0, -1);
    c.moveTo(0, -1); c.lineTo(4, -1); c.lineTo(5, 3);
    c.moveTo(0, -1); c.lineTo(-3, 0); c.lineTo(-3, 3);
    c.moveTo(0, -5); c.lineTo(2, -8.5);                 // mão na cabeça
    c.moveTo(0, -5); c.lineTo(3.5, -3);
  } else {
    const leg = pose === 'pace' ? Math.sin(t * 9) * 2.5 : 2;
    c.arc(0, -12, 2.2, 0, Math.PI * 2);
    c.moveTo(0, -9.5); c.lineTo(0, -4);
    c.moveTo(0, -4); c.lineTo(-leg, 0);
    c.moveTo(0, -4); c.lineTo(leg, 0);
    if (pose === 'wave') {
      const w = Math.sin(t * 8) * 2;
      c.moveTo(0, -8); c.lineTo(-3 + w, -14);
      c.moveTo(0, -8); c.lineTo(3 - w, -14);
    } else {
      c.moveTo(0, -8); c.lineTo(-3, -5);
      c.moveTo(0, -8); c.lineTo(3, -5);
    }
  }
  c.stroke();
  c.restore();
}

function smokePuffs(c, it, x, y, t) {
  if (Math.random() < 0.25) it.smoke.push({ x: x + (Math.random() - 0.5) * 10, y, r: 4, life: 0 });
  for (const p of it.smoke) {
    p.life += 1 / 60;
    p.y -= 0.6;
    p.x += 0.25 + Math.sin(t + p.life * 3) * 0.2;
    p.r += 0.12;
  }
  it.smoke = it.smoke.filter((p) => p.life < 3.2);
  for (const p of it.smoke) {
    c.fillStyle = `rgba(120,130,150,${(0.35 * (1 - p.life / 3.2)).toFixed(3)})`;
    c.beginPath();
    c.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    c.fill();
  }
}

// Tela 1: a nave da tripulação caída, fumaça, e a tripulação em apuros
export function drawStranded(c, it, t) {
  // planeta grande ao fundo
  c.fillStyle = '#1b1430';
  c.beginPath(); c.arc(650, 120, 70, 0, Math.PI * 2); c.fill();
  c.strokeStyle = 'rgba(192,140,255,0.35)';
  c.lineWidth = 2;
  c.beginPath(); c.ellipse(650, 120, 110, 18, -0.3, 0, Math.PI * 2); c.stroke();
  const ground = terrain(285, 1.7);
  const gy = ground.y;
  // pedras flutuantes, como no jogo
  rock(c, 140, 120, 18, 0.4); rock(c, 540, 175, 12, 1.2);
  // nave caída: casco grande, torto, com o nariz cravado no chão (o chão é desenhado por cima)
  const wx = 385, wy = gy(385);
  c.save();
  c.translate(wx, wy - 22);
  c.rotate(2.55);
  c.beginPath();
  c.moveTo(0, -46); c.lineTo(30, 30); c.lineTo(0, 18); c.lineTo(-30, 30); c.closePath();
  c.fillStyle = '#c9d4e6'; c.fill();
  c.lineWidth = 2; c.strokeStyle = '#0b0f17'; c.stroke();
  c.strokeStyle = '#4a5568'; c.lineWidth = 1.5;       // rachaduras
  c.beginPath(); c.moveTo(-8, -10); c.lineTo(4, 2); c.lineTo(-2, 12); c.moveTo(10, 8); c.lineTo(18, 22); c.stroke();
  c.fillStyle = Math.sin(t * 6) > 0 ? '#ff5d5d' : '#5a2a2a';   // luz de alerta
  c.fillRect(-3, 4, 6, 6);
  c.restore();
  ground.draw(c);
  // faíscas de vez em quando
  if (Math.sin(t * 3.1) > 0.85) {
    c.strokeStyle = '#ffd166'; c.lineWidth = 1.5;
    for (let i = 0; i < 4; i++) {
      const a = t * 20 + i * 1.6;
      c.beginPath(); c.moveTo(wx - 18, wy - 44); c.lineTo(wx - 18 + Math.cos(a) * 12, wy - 44 + Math.sin(a) * 12); c.stroke();
    }
  }
  smokePuffs(c, it, wx - 22, wy - 52, t);
  // bandeira de SOS
  const fx = 520, fy = gy(fx);
  c.strokeStyle = '#ff9f43'; c.lineWidth = 2;
  c.beginPath(); c.moveTo(fx, fy); c.lineTo(fx, fy - 70); c.stroke();
  c.fillStyle = '#ff9f43';
  const wave = Math.sin(t * 5) * 3;
  c.beginPath(); c.moveTo(fx, fy - 70); c.lineTo(fx + 34, fy - 62 + wave); c.lineTo(fx, fy - 52); c.closePath(); c.fill();
  c.font = `700 9px ${FONT}`; c.fillStyle = '#2b1a0a'; c.textAlign = 'left'; c.fillText('SOS', fx + 4, fy - 61);
  // tripulação: um acena, um senta com a mão na cabeça, um anda de um lado para o outro
  crewman(c, 470, gy(470), 'wave', t);
  crewman(c, 300, gy(300), 'sit', t);
  const px = 250 + Math.sin(t * 0.9) * 30;
  crewman(c, px, gy(px), 'pace', t);
}

// Tela 2: a base, a nave do jogador e o sinal de socorro chegando
export function drawCall(c, it, t) {
  const ground = terrain(285, 4.1);
  ground.draw(c);
  const gy = ground.y;
  base(c, 300, gy(300), t);
  // nave do jogador pousada
  playerShip(c, 300, gy(300) - 26, 0, false, t);
  // ondas de rádio vindo da direita até a antena
  const ax = 238, ay = gy(300) - 96;
  for (let i = 0; i < 4; i++) {
    const p = ((t * 0.6 + i / 4) % 1);
    const r = lerp(500, 20, p);
    c.strokeStyle = `rgba(255,159,67,${(0.55 * p).toFixed(2)})`;
    c.lineWidth = 2;
    c.beginPath(); c.arc(ax, ay, r, -0.45, 0.45); c.stroke();
  }
  c.font = `700 14px ${FONT}`; c.textAlign = 'center'; c.fillStyle = 'rgba(255,159,67,0.85)';
  c.fillText('· · · — — — · · ·', 600, 120);
}

// Tela 3: a nave decola e a tela escurece
export function drawLaunch(c, it, t) {
  const ground = terrain(285, 4.1);
  ground.draw(c);
  const gy = ground.y;
  base(c, 300, gy(300), t);
  const lift = Math.pow(it.t, 2) * 45;   // sobe acelerando durante a subida da música
  playerShip(c, 300, gy(300) - 26 - lift, 0, true, t);
}

function base(c, x, y, t) {
  c.fillStyle = '#2a3348';
  c.fillRect(x - 70, y - 4, 140, 10);
  for (let i = 0; i < 12; i++) { c.fillStyle = i % 2 ? '#e8f1ff' : '#7cc4ff'; c.fillRect(x - 70 + i * 12, y - 10, 12, 6); }
  c.strokeStyle = '#7cc4ff'; c.lineWidth = 2;
  c.strokeRect(x - 110, y - 56, 34, 46);
  c.beginPath(); c.moveTo(x - 62, y - 56); c.lineTo(x - 62, y - 96); c.stroke();   // antena
  c.fillStyle = Math.sin(t * 4) > 0 ? '#ff5d5d' : '#5a2a2a';
  c.fillRect(x - 65, y - 100, 6, 6);
  c.font = `700 12px ${FONT}`; c.textAlign = 'center'; c.fillStyle = '#7cc4ff'; c.fillText('BASE', x, y - 64);
}

function playerShip(c, x, y, a, thrust, t) {
  c.save();
  c.translate(x, y);
  c.rotate(a);
  c.scale(2.2, 2.2);
  if (thrust) {
    c.fillStyle = Math.random() > 0.5 ? '#ffd166' : '#ff9f43';
    c.beginPath(); c.moveTo(-4, 7); c.lineTo(4, 7); c.lineTo(0, 16 + Math.random() * 10); c.closePath(); c.fill();
  }
  c.beginPath();
  c.moveTo(0, -11); c.lineTo(7, 8); c.lineTo(0, 4); c.lineTo(-7, 8); c.closePath();
  c.fillStyle = '#eef6ff'; c.fill();
  c.lineWidth = 1.2; c.strokeStyle = '#0b0f17'; c.stroke();
  c.restore();
}

function rock(c, x, y, r, seed) {
  c.beginPath();
  for (let j = 0; j < 7; j++) {
    const a = (j / 7) * Math.PI * 2 + Math.sin(seed + j) * 0.3;
    const rr = r * (0.8 + 0.25 * Math.sin(seed * 3 + j * 2));
    j ? c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : c.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  c.closePath();
  c.fillStyle = '#2a2140'; c.fill();
  c.lineWidth = 2; c.strokeStyle = '#c08cff'; c.stroke();
}
