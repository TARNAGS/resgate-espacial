// Monta um arquivo MP4 (H.264 + AAC) a partir dos pedaços que o VideoEncoder e o AudioEncoder do
// navegador devolvem. Sem dependências: escreve as caixas do formato (ISO/IEC 14496-12 e 14496-14) uma a uma.
// O índice (moov) vai antes dos dados (mdat), para o vídeo começar a tocar antes de baixar inteiro.
//
//   muxMp4({ video: { width, height, timescale, avcC, samples }, audio: { sampleRate, channels, asc, bitrate, samples } })
//   samples: [{ data: Uint8Array, duration (na escala da trilha), key (só vídeo) }]

const text = new TextEncoder();
const u16 = (n) => [(n >>> 8) & 255, n & 255];
const u32 = (n) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255];
const chars = (s) => [...text.encode(s)];

function concat(parts) {
  const list = parts.map((p) => (p instanceof Uint8Array ? p : Uint8Array.from(p)));
  const out = new Uint8Array(list.reduce((n, p) => n + p.length, 0));
  let at = 0;
  for (const p of list) { out.set(p, at); at += p.length; }
  return out;
}

const box = (type, ...parts) => {
  const body = concat(parts);
  return concat([u32(8 + body.length), chars(type), body]);
};
const full = (type, version, flags, ...parts) => box(type, [version, (flags >>> 16) & 255, (flags >>> 8) & 255, flags & 255], ...parts);

const MATRIX = [...u32(0x00010000), ...u32(0), ...u32(0), ...u32(0), ...u32(0x00010000), ...u32(0), ...u32(0), ...u32(0), ...u32(0x40000000)];

// Durações iguais em sequência viram uma entrada só
function runs(values) {
  const out = [];
  for (const v of values) {
    const last = out[out.length - 1];
    if (last && last[1] === v) last[0] += 1; else out.push([1, v]);
  }
  return out;
}

// Descritor do MPEG-4 (tag + tamanho em um byte; os nossos são todos pequenos)
const desc = (tag, bytes) => [tag, bytes.length, ...bytes];

function videoEntry(v) {
  const name = chars('Resgate Espacial').slice(0, 31);
  return box('avc1',
    [0, 0, 0, 0, 0, 0], u16(1),
    u16(0), u16(0), u32(0), u32(0), u32(0),
    u16(v.width), u16(v.height),
    u32(0x00480000), u32(0x00480000), u32(0), u16(1),
    [name.length, ...name, ...new Array(31 - name.length).fill(0)],
    u16(0x0018), u16(0xffff),
    box('avcC', v.avcC),
    box('pasp', u32(1), u32(1)),
  );
}

function audioEntry(a) {
  const config = desc(0x04, [0x40, 0x15, 0, 0, 0, ...u32(a.bitrate), ...u32(a.bitrate), ...desc(0x05, [...a.asc])]);
  const es = desc(0x03, [...u16(2), 0, ...config, ...desc(0x06, [0x02])]);
  return box('mp4a',
    [0, 0, 0, 0, 0, 0], u16(1),
    u32(0), u32(0),
    u16(a.channels), u16(16), u16(0), u16(0),
    u32(a.sampleRate * 65536),
    full('esds', 0, 0, es),
  );
}

function trak({ id, kind, track, chunks, movieMs }) {
  const durations = track.samples.map((s) => s.duration);
  const mediaDuration = durations.reduce((a, b) => a + b, 0);
  const isVideo = kind === 'video';
  const stscRuns = [];
  chunks.forEach((c, i) => {
    const last = stscRuns[stscRuns.length - 1];
    if (!last || last[1] !== c.count) stscRuns.push([i + 1, c.count]);
  });
  const keys = isVideo ? track.samples.map((s, i) => (s.key ? i + 1 : 0)).filter(Boolean) : null;
  const stbl = box('stbl',
    full('stsd', 0, 0, u32(1), isVideo ? videoEntry(track) : audioEntry(track)),
    full('stts', 0, 0, u32(runs(durations).length), runs(durations).flatMap(([n, d]) => [...u32(n), ...u32(d)])),
    ...(keys ? [full('stss', 0, 0, u32(keys.length), keys.flatMap(u32))] : []),
    full('stsc', 0, 0, u32(stscRuns.length), stscRuns.flatMap(([first, n]) => [...u32(first), ...u32(n), ...u32(1)])),
    full('stsz', 0, 0, u32(0), u32(track.samples.length), track.samples.flatMap((s) => u32(s.data.length))),
    full('stco', 0, 0, u32(chunks.length), chunks.flatMap((c) => u32(c.offset))),
  );
  const handler = isVideo ? 'vide' : 'soun';
  const minf = box('minf',
    isVideo ? full('vmhd', 0, 1, u16(0), u16(0), u16(0), u16(0)) : full('smhd', 0, 0, u16(0), u16(0)),
    box('dinf', full('dref', 0, 0, u32(1), full('url ', 0, 1))),
    stbl,
  );
  const trackMs = Math.round((mediaDuration / track.timescale) * 1000);
  return box('trak',
    full('tkhd', 0, 3, u32(0), u32(0), u32(id), u32(0), u32(trackMs), u32(0), u32(0),
      u16(0), u16(0), u16(isVideo ? 0 : 0x0100), u16(0), MATRIX,
      u32((isVideo ? track.width : 0) * 65536), u32((isVideo ? track.height : 0) * 65536)),
    box('mdia',
      full('mdhd', 0, 0, u32(0), u32(0), u32(track.timescale), u32(mediaDuration), u16(0x55c4), u16(0)),
      full('hdlr', 0, 0, u32(0), chars(handler), u32(0), u32(0), u32(0), chars(isVideo ? 'VideoHandler' : 'SoundHandler'), [0]),
      minf,
    ),
  );
}

export function muxMp4({ video, audio }) {
  const tracks = [['video', { ...video }], ...(audio ? [['audio', { ...audio, timescale: audio.sampleRate }]] : [])];
  // Intercala as trilhas em blocos de meio segundo, para o player ler vídeo e som juntos
  const plan = tracks.map(() => []);
  const cursor = tracks.map(() => ({ i: 0, time: 0 }));
  const order = [];
  for (let end = 0.5; cursor.some((c, k) => c.i < tracks[k][1].samples.length); end += 0.5) {
    tracks.forEach(([, track], k) => {
      const c = cursor[k];
      const first = c.i;
      while (c.i < track.samples.length && c.time / track.timescale < end) { c.time += track.samples[c.i].duration; c.i += 1; }
      if (c.i > first) { const chunk = { first, count: c.i - first, offset: 0 }; plan[k].push(chunk); order.push([k, chunk]); }
    });
  }
  const movieMs = Math.max(...tracks.map(([, t]) => Math.round((t.samples.reduce((a, s) => a + s.duration, 0) / t.timescale) * 1000)));
  const ftyp = box('ftyp', chars('isom'), u32(0x200), chars('isom'), chars('iso2'), chars('avc1'), chars('mp41'));
  const moov = () => box('moov',
    full('mvhd', 0, 0, u32(0), u32(0), u32(1000), u32(movieMs), u32(0x00010000), u16(0x0100), u16(0), u32(0), u32(0), MATRIX,
      new Array(24).fill(0), u32(tracks.length + 1)),
    ...tracks.map(([kind, track], k) => trak({ id: k + 1, kind, track, chunks: plan[k], movieMs })),
  );
  // O tamanho do índice não depende dos valores dos endereços: monta uma vez para medir e outra com os endereços certos
  let at = ftyp.length + moov().length + 8;
  for (const [k, chunk] of order) {
    chunk.offset = at;
    const samples = tracks[k][1].samples;
    for (let i = chunk.first; i < chunk.first + chunk.count; i++) at += samples[i].data.length;
  }
  const data = [];
  for (const [k, chunk] of order) {
    const samples = tracks[k][1].samples;
    for (let i = chunk.first; i < chunk.first + chunk.count; i++) data.push(samples[i].data);
  }
  const mdatSize = data.reduce((n, d) => n + d.length, 0) + 8;
  return concat([ftyp, moov(), u32(mdatSize), chars('mdat'), ...data]);
}
