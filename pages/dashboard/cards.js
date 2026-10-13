// Asosiy mijozlar paneli
function dashboardPage() {
  return (() =>
    `<div class="ttl"><div><small>알에프디바이스(주) 통합 관제센터</small><h1>전체 고객 현황</h1></div><div class="fl"><input id="q" placeholder="고객사·지역 검색" value="${S.q}" oninput="S.q=this.value;uList()"><select id="ind" onchange="S.ind=this.value;uList()"><option value="">전체 업종</option>${[...new Set(CU.map((c) => c[1]))].map((x) => `<option ${S.ind == x ? "selected" : ""}>${x}</option>`).join("")}</select></div></div><div class="top"><div class="c"><div class="ch"><b>전사 최대 누설전류 추이</b><span>2초 간격 · 최근 3분</span></div><div class="hn" id="hn"></div><div class="cv" id="tr" style="min-height:6rem"></div></div><div class="c"><div class="ch"><b>유닛 상태 분포</b><span>실시간</span></div><div class="dn" id="dn"></div></div><div class="c"><div class="ch"><b>운영 요약</b><span>전사</span></div><div class="sm" id="kp"></div></div></div><div class="g2"><div class="sc cg" id="tb"></div><div class="c"><div class="ch"><b>최근 이벤트</b><span>전체 고객</span></div><div class="sc" id="ev"></div></div></div>`)();
}
const bar = (v, mx, s) =>
    `<div class="bar"><i class="bg${s}" style="width:${cl((v / mx) * 100, 3, 100)}%"></i></div>`,
  COL = ["var(--ok)", "var(--w)", "var(--d)"],
  spk = (a, c) => {
    const mn = Math.min(...a),
      r = Math.max(...a) - mn || 1;
    return `<svg viewBox="0 0 80 24" preserveAspectRatio="none" style="display:block;width:100%;height:1.9rem"><polyline fill="none" style="stroke:${c}" stroke-width="1.6" vector-effect="non-scaling-stroke" points="${a.map((v, i) => ((i / (a.length - 1)) * 80).toFixed(1) + "," + (22 - ((v - mn) / r) * 20).toFixed(1)).join(" ")}"/></svg>`;
  },
  ring = (v, s, z) => {
    const C = 251.3,
      p = cl(v / 5, 0.02, 1);
    return `<svg viewBox="0 0 100 100" style="width:${z};height:${z}"><circle cx="50" cy="50" r="40" fill="none" style="stroke:var(--gr)" stroke-width="9"/><circle cx="50" cy="50" r="40" fill="none" style="stroke:${COL[s]}" stroke-width="9" stroke-linecap="round" stroke-dasharray="${p * C} ${C}" transform="rotate(-90 50 50)"/></svg>`;
  },
  card = (c, i) => {
    const u = cmax(c),
      s = st(u.igr),
      r = crisk(c),
      ld = c.u.reduce((x, y) => x + y.ld, 0) / c.u.length;
    return `<div class="cc s${s}" onclick="open_(${i})"><div class="h"><div><b>${c[0]}</b><small>${c[1]} · ${c[2]}</small></div>${badge(s)}</div><div class="rg"><div class="rw">${ring(u.igr, s, "7.4rem")}<div class="rv"><b class="mono cl${s}">${f(u.igr)}</b><small>mA</small></div></div><div class="ri"><small>최대 누설전류</small><b>${u.n}</b><small>${u.loc}</small>${spk(u.h.slice(-45), COL[s])}</div></div><div class="ms"><div><small>PLCS</small><b class="mono">${c[3]}대</b></div><div><small>전력</small><b class="mono">${Math.round(ckw(c))}kW</b></div><div><small>부하율</small><b class="mono">${Math.round(ld * 100)}%</b></div><div><small>AI 위험도</small><b class="mono cl${r >= 60 ? 2 : r >= 30 ? 1 : 0}">${r}</b></div></div></div>`;
  };
function uList() {
  if (S.v) return LV[S.v].u();
  const q = S.q.trim(),
    a = CU.map((c, i) => [c, i])
      .filter(
        ([c]) =>
          (!S.ind || c[1] == S.ind) && (!q || (c[0] + c[2] + c[1]).includes(q)),
      )
      .sort((x, y) => crisk(y[0]) - crisk(x[0]));
  const all = CU.flatMap((c) => c.u),
    mx = all.reduce((a, u) => (u.igr > a.igr ? u : a)),
    mc = CU.find((c) => c.u.includes(mx)),
    tk = CU.reduce((s, c) => s + ckw(c), 0),
    n = [0, 0, 0];
  all.forEach((u) => n[st(u.igr)]++);
  $("#hn").innerHTML =
    `<b class="mono cl${st(mx.igr)}">${f(mx.igr)}</b><small>mA</small><span>${mc[0]} · ${mx.n} ${mx.loc}</span>`;
  const C = 238.76;
  let off = 0;
  const sg = n
    .map((v, k) => {
      const l = (v / all.length) * C,
        e = `<circle cx="50" cy="50" r="38" fill="none" style="stroke:${COL[k]}" stroke-width="12" stroke-dasharray="${Math.max(l - 1.5, 0)} ${C}" stroke-dashoffset="${-off}" transform="rotate(-90 50 50)"/>`;
      off += l;
      return e;
    })
    .join("");
  $("#dn").innerHTML =
    `<div class="rw"><svg viewBox="0 0 100 100" style="width:9.5rem;height:9.5rem"><circle cx="50" cy="50" r="38" fill="none" style="stroke:var(--gr)" stroke-width="12"/>${sg}</svg><div class="rv"><b class="mono" style="font-size:1.9rem">${all.length}</b><small>PLCS</small></div></div><div class="lgx">${["정상", "주의", "경고"].map((t, k) => `<div><i class="bg${k}"></i>${t}<b class="mono">${n[k]}</b></div>`).join("")}</div>`;
  $("#kp").innerHTML = [
    ["관리 고객", CU.length, "곳"],
    ["총 유효전력", Math.round(tk).toLocaleString(), "kW"],
    [
      "평균 부하율",
      Math.round((all.reduce((s, u) => s + u.ld, 0) / all.length) * 100),
      "%",
    ],
    ["금일 경보", ev.filter((e) => e.l).length, "건"],
  ]
    .map(
      (x) =>
        `<div><small>${x[0]}</small><b class="mono">${x[1]}<u>${x[2]}</u></b></div>`,
    )
    .join("");
  $("#tb").innerHTML =
    a.map(([c, i]) => card(c, i)).join("") ||
    '<div class="tx">검색 결과 없음</div>';
  $("#ev").innerHTML = evh(ev.slice(0, 30));
  ch($("#tr"), {
    n: 90,
    max: 6,
    series: [
      {
        d: [...Array(90)].map((_, k) => Math.max(...all.map((u) => u.h[k]))),
        c: "#5b8def",
        fill: 1,
      },
    ],
    lines: [
      { v: 3, c: "#f0a92e" },
      { v: 4, c: "#ef5b4f" },
    ],
  });
}
