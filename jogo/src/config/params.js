// Parâmetros de ajuste (Regras do jogo, seção 13; PRD, RNF-12; #36).
// São os números que definem a sensação do jogo. Mudar um valor aqui e recarregar muda o jogo,
// sem mexer em nenhuma outra parte do código. O painel de ajuste (#42) muda os mesmos valores na hora.

export const DEFAULT_PARAMS = Object.freeze({
  gravity: 55,              // puxa a nave para baixo (unidades/s²)
  thrust: 125,              // força do propulsor (~2,3 vezes a gravidade)
  keyRotationSpeed: 210,    // giro no teclado (graus/s)
  touchRotationSpeed: 420,  // giro até a direção do dedo (graus/s); era 480, rápido demais no celular (#50)
  maxSpeed: 260,            // velocidade máxima (unidades/s)
  landingMaxVy: 65,         // descida máxima para pousar (unidades/s)
  landingMaxVx: 45,         // deslize lateral máximo para pousar
  landingMaxAngle: 20,      // inclinação máxima no pouso (graus)
  padMargin: 8,             // folga além da borda da plataforma que ainda conta como pouso (#50)
  refuelPerSecond: 0.6,     // fração do tanque abastecida por segundo
  boardingSeconds: 2,       // duração do embarque
  lowFuel: 0.2,             // abaixo disso, aviso de combustível baixo (amarelo, rápido e sutil, #94)
  criticalFuel: 0.1,        // abaixo disso, aviso vermelho piscando (#94)
  noFuelLandedSeconds: 2,   // pousada sem combustível onde não abastece: avisa NO FUEL e explode depois disso (#94)
  lives: 3,
  // Elogios para manobras difíceis (#81)
  praiseNear: 6,            // "fininho": distância máxima de uma pedra ou do terreno (unidades)
  praiseMinSpeed: 70,       // velocidade mínima para o fininho contar
  praiseSaveSpeed: 130,     // "freada no limite": velocidade mínima indo para uma batida
  praiseSaveHorizon: 0.45,  // a batida estava a menos destes segundos
  praiseCooldown: 2.5,      // intervalo mínimo entre elogios (s)
  // Direcional virtual (D-006). As variantes existem para o teste do M1 (#43 e #44) comparar.
  // Esquema do toque (#44): no celular, como apontar e acelerar se combinam
  //   'twin' (A, o padrão, D-022): dois polegares; o esquerdo aponta sem acelerar e o direito aciona o
  //               propulsor; a câmera mantém a nave longe dos polegares
  //   'hold' (B, opção): tocar acelera e arrastar aponta, com um polegar só
  // O B (arrasto curto só aponta) foi testado e descartado pelo Fernando: o propulsor demorava a responder.
  touchScheme: 'twin',
  joystickMode: 'follow',   // 'follow': aparece onde o polegar tocar (#39); 'fixed': fixo no canto
  joystickArea: 1,          // fração da largura da tela, a partir da esquerda, que aceita o direcional;
                            // 1 = a tela inteira, como no protótipo testado (#50); a #39 propunha 0.5
  joystickRadius: 56,       // raio do direcional (px de tela)
  joystickDeadzone: 10,     // abaixo disso, o arrasto não muda a direção
  // Câmera (D-037; as regras do zoom ficam em render/view.js). O zoom muda quanto se vê à frente, e isso muda a
  // dificuldade: por isso o automático é igual para todos, e o jogador só pode aproximar.
  cameraZoomFixed: 0,       // 0: automático, que se adapta à tela (1,15 nos celulares de tela comprida, até 1 nos mais
                            // quadrados). De 1 a 1,6: valor fixo de teste (painel ou ?zoom=), que tira a corrida do ranking.
                            // Até 07/10/2026 se chamava cameraZoom: valores antigos salvos no aparelho são ignorados
  cameraNear: 0,            // escolha do jogador nas configurações: 0 AUTO, 1 CLOSE, 2 CLOSER; só aproxima, nunca afasta
  cameraMode: 'thumbs',     // 'thumbs' (o padrão, #44 e #50): a câmera mantém a nave longe dos polegares e pode
                            // passar das pontas da fase, deixando uma área ao lado para os controles no início e no
                            // fim; 'stage' (#96, opção): para nas pontas, com os controles por cima da fase. O Fernando
                            // testou o 'stage' com zoom e os controles ficavam sobre a nave e a plataforma (04/10/2026)
});

// Parâmetros que só mudam a imagem, não a dificuldade
// O zoom fixo de teste (cameraZoomFixed) não está aqui: ver mais da fase muda a dificuldade (D-037)
export const VIEW_ONLY = ['touchScheme', 'cameraNear', 'cameraMode'];

// O que cada parâmetro muda (#120). Todo parâmetro novo precisa entrar aqui (um teste confere):
//   'jogo'    muda a dificuldade ou o tempo de uma corrida, e entra sozinho na chave do ranking (core/ranking.js)
//   'aviso'   só os avisos e os elogios
//   'imagem'  câmera e controles na tela
export const PARAM_KIND = {
  gravity: 'jogo', thrust: 'jogo', keyRotationSpeed: 'jogo', touchRotationSpeed: 'jogo', maxSpeed: 'jogo',
  landingMaxVy: 'jogo', landingMaxVx: 'jogo', landingMaxAngle: 'jogo', padMargin: 'jogo',
  refuelPerSecond: 'jogo', boardingSeconds: 'jogo', lives: 'jogo',   // abastecer e embarcar contam no cronômetro
  lowFuel: 'aviso', criticalFuel: 'aviso', noFuelLandedSeconds: 'aviso',
  praiseNear: 'aviso', praiseMinSpeed: 'aviso', praiseSaveSpeed: 'aviso', praiseSaveHorizon: 'aviso', praiseCooldown: 'aviso',
  touchScheme: 'imagem', joystickMode: 'imagem', joystickArea: 'imagem', joystickRadius: 'imagem', joystickDeadzone: 'imagem',
  cameraZoomFixed: 'imagem', cameraNear: 'imagem', cameraMode: 'imagem',
};

// Valores em uso. Começam iguais aos padrões e podem ser alterados pelo painel de ajuste.
export const PARAMS = { ...DEFAULT_PARAMS };

// O que o painel de ajuste mostra, com os limites de cada controle
export const TUNABLE = [
  { key: 'gravity', label: 'Gravity', min: 10, max: 150, step: 1 },
  { key: 'thrust', label: 'Thrust', min: 30, max: 300, step: 1 },
  { key: 'keyRotationSpeed', label: 'Turn (keys) °/s', min: 60, max: 600, step: 5 },
  { key: 'touchRotationSpeed', label: 'Turn (touch) °/s', min: 60, max: 1440, step: 10 },
  { key: 'maxSpeed', label: 'Max speed', min: 80, max: 500, step: 5 },
  { key: 'landingMaxVy', label: 'Landing max fall', min: 10, max: 200, step: 1 },
  { key: 'landingMaxVx', label: 'Landing max slide', min: 5, max: 150, step: 1 },
  { key: 'landingMaxAngle', label: 'Landing max tilt °', min: 2, max: 60, step: 1 },
  { key: 'padMargin', label: 'Pad edge margin', min: 0, max: 20, step: 1 },
  { key: 'praiseNear', label: 'Praise: close call gap', min: 2, max: 20, step: 1 },
  { key: 'praiseSaveSpeed', label: 'Praise: save speed', min: 60, max: 250, step: 5 },
  { key: 'joystickRadius', label: 'Joystick size', min: 30, max: 110, step: 1 },
  { key: 'joystickDeadzone', label: 'Joystick dead zone', min: 0, max: 40, step: 1 },
  { key: 'joystickArea', label: 'Joystick area', min: 0.25, max: 1, step: 0.05 },
  { key: 'touchScheme', label: 'Touch control', options: [['twin', 'A · two thumbs'], ['hold', 'B · one thumb']] },
  { key: 'joystickMode', label: 'Joystick', options: ['follow', 'fixed'] },
  { key: 'cameraZoomFixed', label: 'Camera zoom (0 = auto)', min: 0, max: 1.6, step: 0.05 },
  { key: 'cameraMode', label: 'Camera', options: [['thumbs', 'avoid thumbs'], ['stage', 'whole stage · controls on top']] },
];

// Ignora o que não existe mais (por exemplo, uma opção removida e ainda salva no aparelho)
export function setParams(overrides) {
  for (const [k, v] of Object.entries(overrides || {})) {
    if (!(k in DEFAULT_PARAMS) || typeof v !== typeof DEFAULT_PARAMS[k]) continue;
    const opts = TUNABLE.find((item) => item.key === k)?.options;
    if (opts && !opts.some((o) => (Array.isArray(o) ? o[0] : o) === v)) continue;
    PARAMS[k] = v;
  }
}

export function resetParams() {
  Object.assign(PARAMS, DEFAULT_PARAMS);
}

// Só o que difere do padrão: é o que o painel salva e copia
export function changedParams() {
  const out = {};
  for (const k of Object.keys(DEFAULT_PARAMS)) if (PARAMS[k] !== DEFAULT_PARAMS[k]) out[k] = PARAMS[k];
  return out;
}
