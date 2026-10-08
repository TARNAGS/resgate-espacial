// Roteiro do vídeo de apresentação: cenas, tempos e textos. Para mudar o vídeo, mude aqui e grave de novo
// (node jogo/ferramentas/video/gravar.mjs). As partidas são de verdade: o piloto automático joga a fase
// com o código do jogo, então o vídeo acompanha qualquer mudança nas fases, na nave ou no desenho.
//
// A trilha é a música da abertura (content/songs.js, INTRO_SONG): 6 compassos de 2 segundos.
//   0 a 4 s    mistério        → a tripulação presa (a primeira tela da abertura) e a decolagem
//   4 a 8 s    aventura        → as pedras e o pouso no SOS, com a tripulação embarcando
//   8 a 10 s   subida          → cortes rápidos: uma batida e a volta para a base
//   10 a 14 s  acorde final    → o nome do jogo
// Os cortes caem nas batidas da música.

export const ROTEIRO = {
  fps: 60,
  width: 960, height: 540, dpr: 2,     // 1920 x 1080
  duration: 14,
  zoom: 1.4,                           // câmera mais perto que o automático, para ler no celular (cada cena pode ter o seu)
  fadeOut: [13.2, 14],                 // a imagem e o som escurecem juntos no fim

  // kind: 'stranded' (tela 1 da abertura), 'play' (partida do piloto), 'title' (nome do jogo)
  // play: level, plan ('expert' sem abastecer, 'going' abastece na ida, 'back' na volta), at (segundo da partida
  // em que o trecho começa), zoom, speed (1 = tempo real) e crashAt (a partir daí a nave mira na pedra mais próxima)
  scenes: [
    { from: 0, to: 2, kind: 'stranded' },
    { from: 2, to: 4, kind: 'play', level: 'practice', plan: 'expert', at: 0, zoom: 1.6 },          // decolagem
    { from: 4, to: 6, kind: 'play', level: 'practice', plan: 'expert', at: 10.4 },                  // pedras e CLOSE CALL
    { from: 6, to: 8, kind: 'play', level: 'practice', plan: 'expert', at: 23.3, zoom: 1.8 },       // pouso no SOS e embarque
    { from: 8, to: 9, kind: 'play', level: 'w1-3', plan: 'expert', at: 16.9, crashAt: 16.75, zoom: 1.5 },   // batida numa pedra
    { from: 9, to: 10, kind: 'play', level: 'practice', plan: 'going', at: 52.95, zoom: 1.6 },      // volta à base: PERFECT RUN
    { from: 10, to: 14, kind: 'title' },
  ],

  // Legendas: aparecem por cima, abaixo do painel do jogo. Textos curtos, de 3 a 7 palavras.
  captions: {
    en: [
      [0.25, 1.95, 'A CREW IS STRANDED FAR FROM HOME'],
      [2.2, 3.95, 'GO BRING THEM BACK'],
      [4.2, 5.95, 'DODGE THE ROCKS'],
      [6.2, 7.95, 'LAND SOFTLY'],
      [8.1, 8.95, 'TOUCH ANYTHING: BOOM'],
      [9.05, 9.95, 'RACE THE CLOCK'],
    ],
    pt: [
      [0.25, 1.95, 'UMA TRIPULAÇÃO FICOU PRESA LONGE DE CASA'],
      [2.2, 3.95, 'TRAGA TODOS DE VOLTA'],
      [4.2, 5.95, 'DESVIE DAS PEDRAS'],
      [6.2, 7.95, 'POUSE DE LEVE'],
      [8.1, 8.95, 'ENCOSTOU, EXPLODIU'],
      [9.05, 9.95, 'CORRA CONTRA O RELÓGIO'],
    ],
  },

  // Tela final: o nome (codinome até a P-003), o mote e o gancho do ranking
  title: {
    name: ['RESGATE', 'ESPACIAL'],
    en: ['FLY. LAND. RESCUE.', 'Same layout for everyone. Race your friends’ times.'],
    pt: ['VOE. POUSE. RESGATE.', 'A mesma fase para todos. Dispute o tempo com os amigos.'],
  },

  // Volume da mistura: música e efeitos do jogo (propulsor, pouso, embarque, batida, elogios)
  mix: { music: 1, effects: 0.75 },
};
