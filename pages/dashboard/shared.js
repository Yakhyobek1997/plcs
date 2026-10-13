const FL=()=>CU.map((c,i)=>[c,i]).filter(([c])=>(!S.ind||c[1]==S.ind)&&(!S.q.trim()||(c[0]+c[2]+c[1]).includes(S.q.trim()))).sort((x,y)=>crisk(y[0])-crisk(x[0])),
TT=t=>`<div class="ttl"><div><small>알에프디바이스(주) 통합 관제센터</small><h1>${t}</h1></div><div class="fl"><input id="q" placeholder="고객사·지역 검색" value="${S.q}" oninput="S.q=this.value;uList()"><select id="ind" onchange="S.ind=this.value;uList()"><option value="">전체 업종</option>${[...new Set(CU.map(c=>c[1]))].map(x=>`<option ${S.ind==x?'selected':''}>${x}</option>`).join('')}</select></div></div>`,
EVC='<div class="c"><div class="ch"><b>최근 이벤트</b><span>전체 고객</span></div><div class="sc" id="ev"></div></div>',AL=()=>CU.flatMap(c=>c.u),ldc=c=>c.u.reduce((x,y)=>x+y.ld,0)/c.u.length,rsk=r=>r>=60?2:r>=30?1:0;
const LV = [null];
