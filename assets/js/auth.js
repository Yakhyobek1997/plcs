// ---- state / auth
const S={v:+(()=>{try{return localStorage.getItem('plcsv')||0}catch(e){return 0}})()||0,user:null,ci:0,page:'list',tab:0,sel:0,q:'',ind:'',mm:'igr',rg:0,su:0,rp:'m',ai:null,qs:0};
const ACC={admin:['demo1234','a','알에프디바이스 관리자'],customer:['demo1234','c','설치 고객']};
try{const s=sessionStorage.getItem('plcs');if(s&&ACC[s])S.user=s}catch(e){}
function login(){const i=$('#id').value.trim(),p=$('#pw').value,a=ACC[i];if(!a||a[0]!==p){$('#er').textContent='아이디 또는 비밀번호가 올바르지 않습니다.';return}S.user=i;try{sessionStorage.setItem('plcs',i)}catch(e){}S.ci=0;S.page=a[1]=='a'?'list':'det';S.tab=0;boot()}
function logout(){S.user=null;try{sessionStorage.removeItem('plcs')}catch(e){}boot()}
function boot(){if(!S.user){$('#hd').style.display='none';$('#pg').innerHTML=loginPage();return}
$('#hd').style.display='flex';$('#hd').innerHTML=`<img src="${LOGO}"><div><b>PLCS Monitor</b><div style="color:var(--m);font-size:11px">알에프디바이스(주)</div></div><div class="sp"></div><span class="dash">${ACC[S.user][2]}</span><span class="live mono" id="ck"></span><span class="dash">샘플 데이터</span>${adm()?`<select class="vs" onchange="S.v=+this.value;try{localStorage.setItem('plcsv',S.v)}catch(e){};S.page='list';render()">${['① 카드 월','② 엔터프라이즈 테이블','③ NOC 히트맵','④ 지도 관제','⑤ 포커스 보드'].map((t,i)=>`<option value="${i}" ${i==S.v?'selected':''}>${t}</option>`).join('')}</select>`:''}<button class="lo thb" onclick="tgl()"></button><button class="lo" onclick="logout()">${ic('o')}로그아웃</button>`;render()}
const fill=u=>{$('#id').value=u;$('#pw').value='demo1234'};
const adm=()=>ACC[S.user][1]=='a';
