// Detail sahifasi: leakage
TB[0] = {
  s: () =>
    `<div id="k1" style="display:contents"></div><div class="c" style="flex:none"><div class="ch"><b>유닛별 저항성 누설전류 (Igr)</b><span>3.0 mA 주의 · 4.0 mA 경고 · 5.0 mA PLCS 감쇄 한계</span></div><div class="uc" id="uc"></div></div><div class="g3"><div class="c"><div class="ch"><b id="lt"></b><span>2초 간격 · 최근 3분</span></div>${lgd(
      [
        ["Igr 저항성", "var(--t)"],
        ["Igc 용량성", "#5b8def"],
      ],
    )}<div class="cv" id="cv"></div></div><div class="c"><div class="ch"><b>누전 이벤트 로그</b><span>금일</span></div><div class="sc" id="el"></div></div></div>`,
  u: () => {
    const c = cc(),
      u = c.u[S.sel],
      m = cmax(c),
      s = [0, 0, 0];
    c.u.forEach((x) => s[st(x.igr)]++);
    $("#k1").outerHTML = kp([
      [
        "최대 Igr",
        f(m.igr) + "<u>mA</u>",
        m.n + " · " + m.loc,
        "cl" + st(m.igr),
      ],
      [
        "평균 Igr",
        f(c.u.reduce((a, x) => a + x.igr, 0) / c.u.length) + "<u>mA</u>",
        "감쇄 한계 대비 " +
          Math.round(
            (c.u.reduce((a, x) => a + x.igr, 0) / c.u.length / 5) * 100,
          ) +
          "%",
      ],
      ["유닛 상태", s.join(" · "), "정상 · 주의 · 경고"],
      [
        "금일 누전 경보",
        ev.filter((e) => e.c == S.ci && e.l).length + "<u>건</u>",
        "정전 없이 PLCS 감쇄 운전",
      ],
    ]).replace('<div class="k">', '<div class="k" id="k1">');
    $("#uc").innerHTML = c.u
      .map(
        (x, i) =>
          `<div class="u ${i == S.sel ? "on" : ""}" onclick="S.sel=${i};upd()"><div class="h"><span><b class="mono">${x.n}</b> ${x.loc}</span>${badge(st(x.igr))}</div><div class="big">${f(x.igr)}<small style="font-size:12px;color:var(--m)"> mA</small></div><div class="bar"><i class="bg${st(x.igr)}" style="width:${(x.igr / 5) * 100}%"></i></div><div class="f"><span>Igc ${f(x.igc, 1)}</span><span>${x.kva} kVA</span></div></div>`,
      )
      .join("");
    $("#lt").textContent = `${u.n} ${u.loc} 실시간 추이`;
    ch($("#cv"), {
      n: 90,
      max: 6,
      series: [
        { d: u.h, c: "var(--t)" },
        { d: u.gh, c: "#5b8def", fill: 1 },
      ],
      lines: [
        { v: 3, c: "#f0a92e" },
        { v: 4, c: "#ef5b4f" },
      ],
    });
    $("#el").innerHTML = evh(ev.filter((e) => e.c == S.ci));
  },
};
