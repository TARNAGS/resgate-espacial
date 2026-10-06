// Lê os arquivos de fase do Crazy Gravity (LEVEL01.CGL a LEVEL18.CGL, formato CGL1).
// Os arquivos do jogo não ficam no repositório: baixe a versão shareware 2.0E no Internet Archive
// (https://archive.org/details/CrazyGravity_1020), copie os .CGL para esta pasta e rode
// 'node render.js saida' (mapas SVG e fases.json) e 'node chart.js' (gráfico). O formato está descrito
// no documento docs/benchmark/crazy-gravity.md, seção 10.
const fs=require('fs');
const TAGS=['SOIN','SOBS','VENT','MAGN','DIST','CANO','PIPE','ONEW','BARR','LPTS','LVIN'];
function load(n){ const b=fs.readFileSync(n); const W=b.readUInt32LE(8),H=b.readUInt32LE(12); const c={};
 const ps=TAGS.map(t=>[t,b.indexOf(t,16)]).concat([['END',b.length]]);
 for(let k=0;k<ps.length-1;k++) c[ps[k][0]]=b.slice(ps[k][1]+4,ps[k+1][1]);
 return {b,W,H,c}; }
function pieces(L){ const {W,H,c}=L; const out=[]; let p=0;
 for(let f=0;f<W*H;f++){ const v=c.SOIN[f]; const n=v&0x7f; for(let k=0;k<n;k++){ out.push({fx:f%W,fy:Math.floor(f/W),flag:v>>7,b:[...c.SOBS.slice(p,p+4)]}); p+=4; } }
 return {out,used:p,len:c.SOBS.length}; }
module.exports={load,pieces};
if (require.main===module){
 const files=fs.readdirSync('.').filter(f=>f.endsWith('.CGL')).sort();
 const all=[]; for(const f of files){ const L=load(f); const P=pieces(L); if(P.used+4!==P.len) console.log('MISMATCH',f,P.used,P.len); all.push(...P.out); }
 console.log('pieces',all.length);
 const tests={
  'b0=x<<4|y, b1=w<<4|h': p=>{const x=p.b[0]>>4,y=p.b[0]&15,w=p.b[1]>>4,h=p.b[1]&15; return x+w<=8&&y+h<=8&&w>0&&h>0;},
  'b0=y<<4|x, b1=h<<4|w': p=>{const y=p.b[0]>>4,x=p.b[0]&15,h=p.b[1]>>4,w=p.b[1]&15; return x+w<=8&&y+h<=8&&w>0&&h>0;},
  'b0=x<<4|y, b1=x2<<4|y2': p=>{const x=p.b[0]>>4,y=p.b[0]&15,x2=p.b[1]>>4,y2=p.b[1]&15; return x2>x&&y2>y&&x2<=8&&y2<=8;},
  'b0=y<<4|x, b1=y2<<4|x2': p=>{const y=p.b[0]>>4,x=p.b[0]&15,y2=p.b[1]>>4,x2=p.b[1]&15; return x2>x&&y2>y&&x2<=8&&y2<=8;},
 };
 for(const [k,fn] of Object.entries(tests)) console.log(k, all.filter(fn).length);
 const freq={}; all.forEach(p=>{const k=p.b[0].toString(16)+' '+p.b[1].toString(16); freq[k]=(freq[k]||0)+1}); console.log(Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,40));
 const f2={}; all.forEach(p=>{const k=p.b[2].toString(16)+' '+p.b[3].toString(16); f2[k]=(f2[k]||0)+1}); console.log(Object.entries(f2).sort((a,b)=>b[1]-a[1]).slice(0,30));
}
function platforms(L){ const d=L.c.LPTS; const n=d.readUInt32LE(0); const r=[];
 for(let i=0;i<n;i++){ const b=d.slice(4+i*52,4+(i+1)*52);
  const type=b[0]&15, hi=b[0]>>4, cnt=b[13];
  const items=[]; for(let k=0;k<cnt;k++) items.push({x:b[14+k],v:b[24+k],t:b[34+k]});
  r.push({type,hi,x:b.readUInt16LE(1),y:b.readUInt16LE(3),w:b[5],items,rect:[b.readUInt16LE(44),b.readUInt16LE(46),b.readUInt16LE(48),b.readUInt16LE(50)]}); }
 return r; }
function lvin(L){ const d=L.c.LVIN; const s=d.toString('latin1'); const pw=s.slice(4,12).replace(/\0.*/,''); const nx=s.slice(13).replace(/\0.*/s,''); return {bg:d.readUInt32LE(0),pw,next:nx,fuel:d.readUInt32LE(d.length-4)}; }
module.exports.platforms=platforms; module.exports.lvin=lvin;
