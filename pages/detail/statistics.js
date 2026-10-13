// Detail sahifasi: statistics
TB[3] = {
  s: () =>
    `<div class="ctl"><div class="seg" id="sm"></div><div class="seg" id="sr"></div><select id="su" onchange="S.su=+this.value;upd()"></select></div><div class="c" style="flex:1;min-height:260px"><div class="ch"><b id="st"></b><span id="ss"></span></div><div class="cv" id="cv"></div></div><div class="c" style="flex:none"><div class="ch"><b>유닛별 통계</b><span id="sx"></span></div><div class="sc" id="ut"></div></div>`,
  u: () => {
    const c = cc(),
      M = [
        ["igr", "저항성 누설전류", "mA", (u) => u.tg, 0.1, [3, 4]],
        ["kw", "유효전력", "kW", (u) => u.kw, 0.04, 0],
        ["ld", "부하율", "%", (u) => u.ld * 100, 0.05, [80, 95]],
        ["thdv", "전압 THD", "%", (u) => u.thdv, 0.05, [5, 8]],
        ["pf", "역률", "", (u) => u.pf, 0.01, [0.9, 0.85, 1]],
      ],
      m = M.find((x) => x[0] == S.mm),
      R_ = [
        ["24시간", 96, "15분"],
        ["7일", 168, "1시간"],
        ["30일", 120, "6시간"],
      ][S.rg];
    $("#sm").innerHTML = M.map(
      (x) =>
        `<button class="${x[0] == S.mm ? "on" : ""}" onclick="S.mm='${x[0]}';upd()">${x[1]}</button>`,
    ).join("");
    $("#sr").innerHTML =
      R_ &&
      ["24시간", "7일", "30일"]
        .map(
          (x, i) =>
            `<button class="${i == S.rg ? "on" : ""}" onclick="S.rg=${i};upd()">${x}</button>`,
        )
        .join("");
    $("#su").innerHTML = c.u
      .map(
        (u, i) =>
          `<option value="${i}" ${i == S.su ? "selected" : ""}>${u.n} ${u.loc}</option>`,
      )
      .join("");
    const gen = (u, k) => {
        const r = rg(S.ci * 100 + k * 7 + M.indexOf(m) * 13 + S.rg),
          b = m[3](u);
        return [...Array(R_[1])].map((_, i) => {
          let v =
            b * (1 + (r() - 0.5) * m[4] * 2 + Math.sin(i / 9) * m[4] * 0.6);
          if (m[0] == "igr" && r() < 0.012) v += 1.2 * r();
          return v;
        });
      },
      D = c.u.map((u, i) => gen(u, i)),
      d = D[S.su];
    $("#st").textContent =
      `${c.u[S.su].n} ${c.u[S.su].loc} · ${m[1]}${m[2] ? " (" + m[2] + ")" : ""}`;
    $("#ss").textContent = `최근 ${["24시간", "7일", "30일"][S.rg]} · ${R_[2]}`;
    $("#sx").textContent = $("#ss").textContent;
    const mx = Math.max(...D.flat(), m[5] ? m[5][1] * 1.1 : 0) * 1.1,
      dg = m[0] == "pf" ? 3 : 2;
    ch($("#cv"), {
      n: d.length,
      min: m[0] == "pf" ? 0.8 : 0,
      max: m[0] == "pf" ? 1 : Math.ceil(mx),
      series: [{ d, c: "#5b8def", fill: 1 }],
      lines:
        m[5] && !m[5][2]
          ? [
              { v: m[5][0], c: "#f0a92e" },
              { v: m[5][1], c: "#ef5b4f" },
            ]
          : [],
    });
    $("#ut").innerHTML = tb(
      ["유닛", "위치", "평균", "최소", "최대", "P95", "주의 초과", "경고 초과"],
      c.u.map((u, i) => {
        const a = D[i],
          s = [...a].sort((x, y) => x - y),
          th = m[5],
          ex = (v) =>
            th
              ? th[2]
                ? a.filter((x) => x < v).length
                : a.filter((x) => x >= v).length
              : "-";
        return {
          on: i == S.su,
          o: `S.su=${i};upd()`,
          c: [
            `<b class="mono">${u.n}</b>`,
            u.loc,
            f(a.reduce((x, y) => x + y) / a.length, dg),
            f(s[0], dg),
            f(s[s.length - 1], dg),
            f(s[Math.floor(s.length * 0.95)], dg),
            ex(th && th[0]),
            ex(th && th[1]),
          ],
        };
      }),
      2,
    );
  },
};
