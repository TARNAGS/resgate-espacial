// Skin "classic" (#124): o visual de sempre do jogo. É a skin padrão e completa as outras: o que uma skin
// não desenhar, a classic desenha.

export const classic = {
  key: 'classic',
  label: 'Classic',

  // Cores do mundo: a classic usa as do próprio mundo (content/worlds/)
  theme: (theme) => theme,

  // Nave, em coordenadas da nave (o desenho já vem girado e no lugar). Desenha o contorno da nave, que fica
  // dentro do casco. landingSafe: verde só descendo para uma plataforma, com velocidade e inclinação que garantem o pouso
  ship(ctx, ship, landingSafe) {
    ctx.beginPath();
    ship.outline.forEach((v, i) => (i ? ctx.lineTo(v.x, v.y) : ctx.moveTo(v.x, v.y)));
    ctx.closePath();
    ctx.fillStyle = landingSafe ? '#7dffb0' : '#eef6ff';
    ctx.fill();
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = '#0b0f17';
    ctx.stroke();
  },

  // Chama do propulsor aceso (#33), saindo do bocal da nave
  flame(ctx, n) {
    ctx.fillStyle = Math.random() > 0.5 ? '#ffd166' : '#ff9f43';
    ctx.beginPath();
    ctx.moveTo(-n.half, n.y);
    ctx.lineTo(n.half, n.y);
    ctx.lineTo(0, n.y + n.flame + Math.random() * n.flicker);
    ctx.closePath();
    ctx.fill();
  },

  // Um desenho por tipo de obstáculo do catálogo (content/obstacles/); só desenham, nunca mudam o obstáculo (#113)
  obstacles: {
    rock(ctx, o, theme) {
      ctx.lineWidth = 2;
      ctx.beginPath();
      o.pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.closePath();
      ctx.fillStyle = theme.rockFill;
      ctx.fill();
      ctx.strokeStyle = theme.rock;
      ctx.stroke();
    },
  },
};
