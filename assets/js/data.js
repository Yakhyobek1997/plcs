// ---- data
const LOC=['수전실','1도크 전원반','UPS실 A','현장사무소','MCC-1','MCC-2','정류기실','컨베이어 MCC'],L0=['수전실','1도크 전원반','2도크 전원반','의장안벽 분전반','용접장 분전반','도장공장','크레인 급전반'],KV=[150,200,100,75,300,150,150,200];
const CU=[['대양조선 거제 야드','조선·해양','경남 거제',7,1,3.43],['누리텔레콤 안양국사','통신·IDC','경기 안양',4,2,3.40],['청솔건설 송도 현장','건설','인천 연수',5,2,3.67],['서해 해군기지 전력소','국방','충남 당진',6,1,3.39],['미래물류센터 이천','물류','경기 이천',4,2,1.88],['한빛데이터센터 판교','통신·IDC','경기 성남',8,6,1.54],['하늘병원 분당','의료','경기 성남',5,3,1.15],['공군 비행단 정비고','국방','충북 청주',3,1,1.31]];
let T=0;const ev=[];
const st=x=>x>=4?2:x>=3?1:0,SN=['정상','주의','경고'],now=()=>new Date().toTimeString().slice(0,8);
CU.forEach((c,ci)=>{c.u=[];for(let i=0;i<c[3];i++){const pk=i==c[4],tg=pk?c[5]:.8+R()*1.1;c.u.push({n:'PLCS-0'+(i+1),loc:ci?LOC[i%8]:L0[i],kva:KV[i%8],tg,igr:tg,igc:KV[i%8]/30+R(),ld:.15+R()*.3,pf:.9+R()*.07,thdv:2+R(),thdi:ci==0&&i==1?8.8:ci==0&&i==6?8.1:4+R()*3.5,vh:[[],[],[]],h:[],gh:[],st:0})}});
function step(u,c,ci,silent){T++;u.igr=cl(u.igr+(u.tg-u.igr)*.2+(R()-.5)*.16,.2,6);u.igc=cl(u.igc+(R()-.5)*.2,.5,u.kva/20);u.ld=cl(u.ld+(R()-.5)*.01,.1,.7);
u.v=[0,1,2].map(k=>220+Math.sin(T*.9+k*2.1)*1.6+(R()-.5)*1.4);u.v.forEach((x,k)=>{u.vh[k].push(x);u.vh[k].length>90&&u.vh[k].shift()});
u.f=60+(R()-.5)*.06;u.kv=u.kva*u.ld;u.kw=u.kv*u.pf;u.unb=(Math.max(...u.v)-Math.min(...u.v))/220*100;u.h.push(u.igr);u.gh.push(u.igc);u.h.length>90&&(u.h.shift(),u.gh.shift());
const s=st(u.igr);if(!silent){if(s>u.st)ev.unshift({t:now(),c:ci,u:u.n,m:`저항성 누설전류 ${f(u.igr)} mA, ${s>1?'경고 기준 4.0':'주의 기준 3.0'} mA 초과`,l:s});if(R()<.002)ev.unshift({t:now(),c:ci,u:u.n,m:`순간 전압강하 감지 (R상 ${80+(R()*12|0)}%, ${60+(R()*120|0)} ms)`,l:0})}u.st=s}
for(let k=0;k<90;k++)CU.forEach((c,ci)=>c.u.forEach(u=>step(u,c,ci,1)));
[[0,1,'18:57:06',1],[1,2,'18:48:03',1],[2,2,'18:08:07',1],[3,1,'17:58:05',2],[0,1,'15:15:08',1],[0,0,'08:59:33',0]].forEach(([c,i,t,l])=>{const u=CU[c].u[i];ev.push({t,c,u:u.n,m:l?`저항성 누설전류 ${l>1?'4.21':'3.57'} mA, ${l>1?'경고 기준 4.0':'주의 기준 3.0'} mA 초과`:'순간 전압강하 감지 (R상 90%, 70 ms)',l})});
const risk=u=>cl(Math.round(u.igr*22+(u.thdi>8?8:0)),5,99),cmax=c=>c.u.reduce((a,u)=>u.igr>a.igr?u:a,c.u[0]),crisk=c=>risk(cmax(c)),ckw=c=>c.u.reduce((a,u)=>a+u.kw,0),cst=c=>st(cmax(c).igr);
const badge=s=>`<span class="b b${s}">${s?'● ':'● '}${SN[s]}</span>`;
