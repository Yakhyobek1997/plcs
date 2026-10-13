// Detail sahifasi: load
TB[2] = {
  s: () =>
    `<div id="k3" style="display:contents"></div><div class="g3" style="flex:none;grid-template-columns:minmax(0,3fr) minmax(0,2fr)"><div class="c"><div class="ch"><b>시간대별 전력 사용량</b><span>금일 vs 전일 · kWh</span></div>${lgd(
      [
        ["전일", "#8392a8"],
        ["금일", "#5b8def"],
      ],
    )}<div class="cv" id="cv" style="min-height:260px"></div></div><div class="c"><div class="ch"><b>유닛별 부하율</b><span>정격 용량 대비 · 80% 이상 주의</span></div><div id="ld" style="padding:10px 14px"></div></div></div><div class="c" style="flex:none"><div class="ch"><b>유닛별 전력 및 부하</b></div><div class="sc" id="ut"></div></div>`,
  u: () => {
    const c = cc(),
      h = new Date().getHours(),
      tot = ckw(c),
      cv = (i) =>
        0.55 + 0.45 * Math.sin(((i - 6) / 24) * 2 * Math.PI * 1.0) * 0.9,
      r = rg(S.ci + 7),
      y = [...Array(24)].map((_, i) =>
        Math.round(tot * cv(i) * (1 + (r() - 0.5) * 0.1)),
      ),
      t = y
        .slice(0, h + 1)
        .map((v, i) =>
          i == h ? Math.round(tot) : Math.round(v * (1 + (r() - 0.5) * 0.08)),
        ),
      cum = t.reduce((a, b) => a + b, 0);
    $("#k3").outerHTML = kp([
      [
        "현재 유효전력",
        f(tot, 1) + "<u>kW</u>",
        "피상 " +
          f(
            c.u.reduce((a, u) => a + u.kv, 0),
            1,
          ) +
          " kVA",
      ],
      [
        "금일 누적 사용량",
        cum.toLocaleString() + "<u>kWh</u>",
        "전일 동시간 " + Math.round(cum * 1.03).toLocaleString() + " kWh",
      ],
      [
        "금일 최대 수요",
        f(Math.max(...t, tot) * 1.9, 1) + "<u>kW</u>",
        "계약 대비 여유 확인",
      ],
      [
        "평균 부하율",
        f((c.u.reduce((a, u) => a + u.ld, 0) / c.u.length) * 100, 1) +
          "<u>%</u>",
        "설비 정격 " + c.u.reduce((a, u) => a + u.kva, 0) + " kVA",
      ],
    ]).replace('<div class="k">', '<div class="k" id="k3">');
    ch($("#cv"), {
      n: 24,
      max: Math.ceil((Math.max(...y) * 1.2) / 100) * 100,
      bars: t,
      cx: 1,
      series: [{ d: y, c: "#8392a8", dash: 1 }],
      lb: [0, 3, 6, 9, 12, 15, 18, 21].map((i) => [i, i + "시"]),
    });
    $("#ld").innerHTML = c.u
      .map(
        (u) =>
          `<div class="m" style="border:0;grid-template-columns:70px 1fr 50px;padding:7px 0"><b class="mono">${u.n}</b><div class="bar"><i class="bg${u.ld > 0.8 ? 1 : 0}" style="background:${u.ld > 0.8 ? "" : "var(--a)"};width:${u.ld * 100}%"></i></div><span class="mono">${f(u.ld * 100, 0)}%</span></div>`,
      )
      .join("");
    $("#ut").innerHTML = tb(
      [
        "유닛",
        "위치",
        "정격 (kVA)",
        "유효전력 (kW)",
        "피상전력 (kVA)",
        "부하율",
        "역률",
        "여유 용량 (kVA)",
      ],
      c.u.map((u) => ({
        c: [
          `<b class="mono">${u.n}</b>`,
          u.loc,
          u.kva,
          f(u.kw, 1),
          f(u.kv, 1),
          f(u.ld * 100, 1) + "%",
          pf(u),
          f(u.kva - u.kv, 1),
        ],
      })),
      2,
    );
  },
};
