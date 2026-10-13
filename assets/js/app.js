function cpy(){const b=$('#cb');try{navigator.clipboard.writeText(window._sum||'').then(()=>b.textContent='복사됨 ✓',()=>b.textContent='복사 실패')}catch(e){b.textContent='복사 실패'}setTimeout(()=>b.textContent='요약 복사',1500)}
setInterval(()=>{if(!S.user)return;CU.forEach((c,ci)=>c.u.forEach(u=>step(u,c,ci)));ev.length=Math.min(ev.length,60);if(S.tab!=3&&S.tab!=4||S.page=='list')upd();else{hdrS();$('#ck').textContent=now()}},2000);
const fz=()=>document.documentElement.style.fontSize=cl(innerWidth/135,13,19)+'px';
function thUpd(){const l=document.documentElement.dataset.th=='light';document.querySelectorAll('.thb').forEach(b=>b.innerHTML=ic(l?'mn':'s')+(l?'다크':'라이트'))}
function tgl(){const t=document.documentElement.dataset.th=='light'?'dark':'light';document.documentElement.dataset.th=t;try{localStorage.setItem('plcsth',t)}catch(e){}thUpd();S.user&&upd()}
try{const t=localStorage.getItem('plcsth');if(t)document.documentElement.dataset.th=t}catch(e){}
const _b=boot;boot=function(){_b();thUpd()};
addEventListener('resize',()=>{fz();S.user&&upd()});fz();boot();
