// Detail sahifasi: power-quality
TB[1] = {
  s: () =>
    `<div class="pl" id="pl"></div><div class="g3" style="flex:none"><div class="c"><div class="ch"><b id="vt"></b><span>2초 간격 · 최근 3분</span></div>${lgd(
      [
        ["R상", "#5b8def"],
        ["S상", "#9aa7b8"],
        ["T상", "#2fbf80"],
      ],
    )}<div class="cv" id="cv" style="min-height:260px"></div></div><div class="c"><div class="ch"><b>전력품질 지표</b><span>막대 끝 = 관리 기준</span></div><div id="mt"></div></div></div><div class="c" style="flex:none"><div class="ch"><b>유닛별 전력품질 요약</b><span>기준 이탈 항목은 색으로 표시</span></div><div class="sc" id="qt"></div></div>`,
  u: () => {
    const c = cc(),
      u = c.u[S.qs],
      o = (v, l) => (v > l ? ' style="color:var(--w)"' : "");
    $("#pl").innerHTML = c.u
      .map(
        (x, i) =>
          `<button class="${i == S.qs ? "on" : ""}" onclick="S.qs=${i};upd()">${x.n}${x.thdi > 8 ? ' <span class="cl1">●</span>' : ""}</button>`,
      )
      .join("");
    $("#vt").textContent = `${u.n} ${u.loc} 상전압`;
    ch($("#cv"), {
      n: 90,
      min: 214,
      max: 226,
      series: [
        { d: u.vh[0], c: "#5b8def" },
        { d: u.vh[1], c: "#9aa7b8" },
        { d: u.vh[2], c: "#2fbf80" },
      ],
    });
    const rows = [
      ["주파수", "60 ± 0.2 Hz", f(u.f) + " Hz", 50 + ((u.f - 60) / 0.2) * 40],
      ["역률", "0.90 이상", pf(u), u.pf * 100],
      ["전압 불평형", "2% 이하", f(u.unb) + "%", (u.unb / 2) * 85],
      ["전압 THD", "5% 이하", f(u.thdv) + "%", (u.thdv / 5) * 85],
      ["전류 THD", "8% 이하", f(u.thdi, 1) + "%", (u.thdi / 8) * 85],
    ];
    $("#mt").innerHTML =
      `<div class="ph">${["R", "S", "T"].map((p, k) => `<div><small>${p}상</small><div class="big">${f(u.v[k], 1)}<small> V</small></div><small>${f((u.kv / 3 / 0.22) * (0.95 + k * 0.05), 1)} A</small></div>`).join("")}</div>` +
      rows
        .map(
          (r) =>
            `<div class="m"><div>${r[0]}<small>${r[1]}</small></div><div class="bar"><i style="width:${cl(r[3], 2, 100)}%"></i></div><b class="mono" style="text-align:right">${r[2]}</b></div>`,
        )
        .join("");
    $("#qt").innerHTML = tb(
      [
        "유닛",
        "위치",
        "평균 전압 (V)",
        "주파수 (Hz)",
        "역률",
        "전압 불평형 (%)",
        "전압 THD (%)",
        "전류 THD (%)",
      ],
      c.u.map((x) => ({
        c: [
          `<b class="mono">${x.n}</b>`,
          x.loc,
          f((x.v[0] + x.v[1] + x.v[2]) / 3, 1),
          f(x.f),
          pf(x),
          f(x.unb),
          f(x.thdv),
          `<span${o(x.thdi, 8)}>${f(x.thdi, 1)}</span>`,
        ],
      })),
      2,
    );
  },
};
