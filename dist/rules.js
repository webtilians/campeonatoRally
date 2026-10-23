export function parseTime(raw){
  const value=String(raw).trim().replace(',','.');
  if(!/^(?:\d+:)?\d+(?:\.\d{1,3})?$/.test(value))return null;
  const parts=value.split(':');
  if(parts.length===2&&Number(parts[1])>=60)return null;
  const ms=Math.round((parts.length===2?Number(parts[0])*60+Number(parts[1]):Number(parts[0]))*1000);
  return Number.isSafeInteger(ms)&&ms>0&&ms<=86400000?ms:null;
}
export function formatTime(ms){if(ms===null||ms===undefined)return '—';return `${Math.floor(ms/60000)}:${String(Math.floor(ms/1000)%60).padStart(2,'0')}.${String(ms%1000).padStart(3,'0')}`;}
export function rallyResults(c,r){
  const rows=c.drivers.map(d=>{const times=Array.from({length:r.stages},(_,i)=>r.times[d.id]?.[i]??null);return {...d,times,completed:times.filter(t=>t!==null).length,total:times.every(t=>t!==null)?times.reduce((a,b)=>a+b,0):null};});
  const compare=(a,b)=>{if(a.total===null||b.total===null)return a.total===b.total?0:a.total===null?1:-1;if(a.total!==b.total)return a.total-b.total;for(let i=r.stages-1;i>=0;i--)if(a.times[i]!==b.times[i])return a.times[i]-b.times[i];return 0;};
  rows.sort(compare);let rank=0;return rows.map((row,i)=>{if(i===0||compare(row,rows[i-1])!==0)rank=i+1;return {...row,rank:row.total===null?null:rank,points:r.closed&&row.total!==null?([5,3,1][rank-1]||0):0};});
}
export function standings(c){const scores=c.drivers.map(d=>({...d,points:0,wins:0,podiums:0}));for(const r of c.rallies.filter(r=>r.closed))for(const result of rallyResults(c,r)){const d=scores.find(d=>d.id===result.id);d.points+=result.points;d.wins+=result.rank===1?1:0;d.podiums+=result.rank<=3&&result.rank!==null?1:0;}scores.sort((a,b)=>b.points-a.points);let rank=0;return scores.map((d,i)=>{if(i===0||d.points!==scores[i-1].points)rank=i+1;return {...d,rank};});}
export function validateData(data){
 if(!data||data.version!==1||!Array.isArray(data.championships)||data.championships.length>100)throw Error('El archivo no es una copia válida de Rally Club.');
 const ids=new Set();
 for(const c of data.championships){if(!c||typeof c.id!=='string'||ids.has(c.id)||typeof c.name!=='string'||!c.name.trim()||c.name.length>80||!Array.isArray(c.drivers)||c.drivers.length<2||c.drivers.length>30||!Array.isArray(c.rallies)||!c.rallies.length||c.rallies.length>30)throw Error('Campeonato no válido.');ids.add(c.id);const ds=new Set();for(const d of c.drivers){if(!d||typeof d.id!=='string'||ds.has(d.id)||typeof d.name!=='string'||!d.name.trim()||d.name.length>40)throw Error('Pilotos no válidos.');ds.add(d.id);}const rs=new Set();for(const r of c.rallies){if(!r||typeof r.id!=='string'||rs.has(r.id)||typeof r.name!=='string'||!r.name.trim()||r.name.length>80||!Number.isInteger(r.stages)||r.stages<1||r.stages>30||typeof r.closed!=='boolean'||!r.times||typeof r.times!=='object'||Array.isArray(r.times))throw Error('Rally no válido.');rs.add(r.id);for(const [id,times] of Object.entries(r.times)){if(!ds.has(id)||!Array.isArray(times)||times.length>r.stages||times.some(t=>t!==null&&(!Number.isSafeInteger(t)||t<=0||t>86400000)))throw Error('Tiempos no válidos.');}if(r.closed&&rallyResults(c,r).some(d=>d.total===null))throw Error('Un rally cerrado tiene tiempos pendientes.');}}
 return data;
}
