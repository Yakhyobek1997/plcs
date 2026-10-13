function hdrS() {
  const c = CU[S.ci],
    u = cmax(c);
  $("#hs").innerHTML =
    `${badge(cst(c))}<span>최대 Igr <b>${f(u.igr)} mA</b></span><span>전력 <b>${f(ckw(c), 1)} kW</b></span><span>AI 위험도 <b>${crisk(c)}</b></span>`;
}
function upd() {
  if (!S.user) return;
  if (S.page == "list") uList();
  else {
    hdrS();
    TB[S.tab].u();
  }
  const k = $("#ck");
  k && (k.textContent = now());
}
const cc = () => CU[S.ci],
  pf = (u) => f(u.pf, 3);
// ---- tabs
const TB = [];
