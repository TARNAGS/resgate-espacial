// Skin "hitbox" (#124): desenha exatamente as formas que batem. Prova que a troca de skin funciona e serve ao
// level design: mostra o casco da nave, as pedras como o contato as vê e só a linha do terreno que conta.

const LINE = '#ff3df0';
const FILL = 'rgba(255,61,240,0.14)';

export const hitbox = {
  key: 'hitbox',
  label: 'Hitbox · collision shapes',

  // Sem o brilho do terreno: só a linha da colisão aparece
  theme: (theme) => ({ ...theme, terrainGlow: 'rgba(0,0,0,0)', rock: LINE, rockFill: FILL }),

  // O casco, que é o que bate; verde quando o pouso está garantido, como na classic
  ship(ctx, ship, landingSafe) {
    ctx.beginPath();
    ship.hull.forEach((v, i) => (i ? ctx.lineTo(v.x, v.y) : ctx.moveTo(v.x, v.y)));
    ctx.closePath();
    ctx.fillStyle = landingSafe ? 'rgba(125,255,176,0.5)' : FILL;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = landingSafe ? '#7dffb0' : LINE;
    ctx.stroke();
  },

  // A chama não bate: só um traço fino, sem sorteio, para saber que o propulsor está aceso
  flame(ctx, n) {
    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, n.y);
    ctx.lineTo(0, n.y + n.flame);
    ctx.stroke();
  },

  obstacles: {
    // A pedra bate pelo polígono dela (content/obstacles/rock.js, hits)
    rock(ctx, o) {
      ctx.lineWidth = 1;
      ctx.beginPath();
      o.pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.closePath();
      ctx.fillStyle = FILL;
      ctx.fill();
      ctx.strokeStyle = LINE;
      ctx.stroke();
    },
  },
};
