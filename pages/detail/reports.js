// Detail sahifasi: reports
TB[4] = {
  s: () =>
    `<div class="ctl"><div class="seg" id="rs"></div><button class="seg" style="padding:7px 14px" onclick="cpy()" id="cb">요약 복사</button></div><div id="k5" style="display:contents"></div><div class="c" style="flex:1;min-height:260px"><div class="ch"><b id="rt"></b><span>막대 kWh · 선 일 최대 Igr (mA)</span></div>${lgd(
      [
        ["사용량 kWh", "#5b8def"],
        ["일 최대 Igr", "#ef5b4f"],
      ],
    )}<div class="cv" id="cv"></div></div><div class="c" style="flex:none"><div class="ch"><b>유닛별 운영 실적</b></div><div class="sc" id="ut"></div></div><div class="c" style="flex:none"><div class="ch"><b>종합 의견</b><span>자동 생성 · 담당자 검토 후 발송</span></div><div class="tx" id="op"></div></div>`,
  u: () => {
    const c = cc(),
      D = new Date(),
      mo = D.getMonth() + 1,
      n = S.rp == "m" ? D.getDate() : mo,
      sc = S.rp == "m" ? 1 : 30,
      r = rg(S.ci + 99),
      days = [...Array(n)].map((_, i) => ({
        k: c.u.map((u) => u.kw * 24 * sc * (0.85 + r() * 0.3)),
        g: c.u.map((u) => u.tg * (0.85 + r() * 0.3)),
      }));
    const kwh = c.u.map((_, j) => days.reduce((a, d) => a + d.k[j], 0)),
      mg = c.u.map((_, j) => Math.max(...days.map((d) => d.g[j]))),
      ag = c.u.map((u) => u.tg * 0.98),
      dk = days.map((d) => d.k.reduce((a, b) => a + b)),
      dg = days.map((d) => Math.max(...d.g)),
      tk = kwh.reduce((a, b) => a + b),
      jm = mg.indexOf(Math.max(...mg)),
      al = mg.filter((x) => x >= 3).length * (S.rp == "m" ? 1 : 3),
      tm =
        S.rp == "m" ? `${D.getFullYear()}년 ${mo}월` : `${D.getFullYear()}년`;
    window._sum = `${tm} ${c[0]} PLCS ${c[3]}대 전력 사용량 ${Math.round(tk).toLocaleString()} kWh, 최대 Igr ${f(mg[jm])} mA(${c.u[jm].n} ${c.u[jm].loc}), 누전 경보 ${al}건, 급전 가동률 99.97%.`;
    $("#rs").innerHTML = ["m", "y"]
      .map(
        (x) =>
          `<button class="${x == S.rp ? "on" : ""}" onclick="S.rp='${x}';upd()">${x == "m" ? "월간" : "연간"}</button>`,
      )
      .join("");
    $("#rt").textContent =
      `${tm} ${S.rp == "m" ? "일별" : "월별"} 사용량 및 최대 누설전류`;
    $("#k5").outerHTML = kp([
      ["전력 사용량", f(tk / 1000, 1) + "<u>MWh</u>", tm + " (진행 중)"],
      [
        "최대 수요",
        f((Math.max(...dk) / 24 / sc) * 1.9, 1) + "<u>kW</u>",
        "평균 역률 0.925",
      ],
      [
        "최대 Igr",
        f(mg[jm]) + "<u>mA</u>",
        c.u[jm].n + " " + c.u[jm].loc,
        "cl" + st(mg[jm]),
      ],
      ["누전 경보", al + "<u>건</u>", "주의·경고 합계"],
      ["급전 가동률", "99.97<u>%</u>", "누전에 의한 차단 0건"],
    ]).replace('<div class="k">', '<div class="k" id="k5">');
    ch($("#cv"), {
      n,
      max: Math.ceil((Math.max(...dk) * 1.15) / 1000) * 1000,
      y2: 5,
      bars: dk,
      series: [{ d: dg, c: "#ef5b4f", y2: 1, dots: 1 }],
      lb: days.map((_, i) => [i, i + 1 + (S.rp == "m" ? "일" : "월")]),
    });
    $("#ut").innerHTML = tb(
      [
        "유닛",
        "위치",
        "사용량 (kWh)",
        "평균 Igr (mA)",
        "최대 Igr (mA)",
        "누전 경보",
        "급전 가동률",
      ],
      c.u.map((u, j) => ({
        c: [
          `<b class="mono">${u.n}</b>`,
          u.loc,
          Math.round(kwh[j]).toLocaleString(),
          f(ag[j]),
          `<span class="cl${st(mg[j]) ? 1 : ""}">${f(mg[j])}</span>`,
          mg[j] >= 3 ? (S.rp == "m" ? 2 : 6) : 0,
          "99.97%",
        ],
      })),
      2,
    );
    $("#op").innerHTML =
      `${tm} ${c[0]}에 설치된 PLCS ${c[3]}대의 전력 사용량은 ${Math.round(tk).toLocaleString()} kWh, 최대 수요는 ${f((Math.max(...dk) / 24 / sc) * 1.9, 1)} kW입니다. 저항성 누설전류(Igr)는 최대 ${f(mg[jm])} mA(${c.u[jm].n} ${c.u[jm].loc})로 PLCS 감쇄 한계 5 mA 이내에서 관리되었고, 누전 경보 ${al}건이 발생했으나 누전에 의한 정전이나 차단은 없었습니다. ${mg[jm] >= 3 ? `${c.u[jm].n}(${c.u[jm].loc})은 누설전류가 주의 기준을 넘어 점검이 필요합니다.` : "전 유닛이 정상 범위에서 운전되었습니다."}`;
  },
};
