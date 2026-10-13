// Detail sahifasi: ai-prediction
TB[5] = {
  s: () =>
    `<div id="k6" style="display:contents"></div><div class="g3"><div class="c"><div class="ch"><b id="at"></b><span>14일 실측 + 7일 예측 · 음영 90% 신뢰구간</span></div>${lgd(
      [
        ["실측", "var(--t)"],
        ["예측", "#5b8def"],
        ["경고 4.0", "#ef5b4f"],
        ["감쇄 한계 5.0", "var(--m)"],
      ],
    )}<div class="cv" id="cv"></div></div><div class="c"><div class="ch"><b>유닛별 위험 순위</b><span>누르면 예측 그래프 전환</span></div><div class="sc" id="rk"></div></div></div><div class="c" style="flex:none"><div class="ch"><b>권장 조치</b><span>예측 결과 기반 자동 제안</span></div><div class="tx" id="rc"></div><div class="tx" style="border-top:1px solid var(--b);color:var(--m);font-size:11.5px;padding:10px 14px">예측 모델 입력값: 저항성·용량성 누설전류 추세, 부하율, 전류 고조파, 운전 시간대, 외기 온습도. 시뮬레이션 데이터로 계산한 예시 결과이며 실제 서비스에서는 현장 계측 이력으로 학습합니다.</div></div>`,
  u: () => {
    const c = cc(),
      us = c.u
        .map((u, i) => {
          const r = rg(S.ci * 50 + i),
            b = u.tg,
            up = b > 3,
            h = [...Array(14)].map((_, k) =>
              cl(b - (up ? (13 - k) * 0.045 : 0) + (r() - 0.5) * 0.14, 0.2, 6),
            ),
            n = 14,
            mx = (n * (n - 1)) / 2,
            my = h.reduce((a, x) => a + x) / n,
            sl =
              h.reduce((a, x, k) => a + (k - (n - 1) / 2) * (x - my), 0) /
              ((n * (n * n - 1)) / 12),
            last = my + (sl * (n - 1)) / 2;
          return { u, i, h, sl, last, r: risk(u) };
        })
        .sort((a, b) => b.r - a.r);
    if (S.ai == null) S.ai = us[0].i;
    const s = us.find((x) => x.i == S.ai),
      erf = (x) => {
        const t = 1 / (1 + 0.3275911 * Math.abs(x)),
          y =
            1 -
            ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t -
              0.284496736) *
              t +
              0.254829592) *
              t *
              Math.exp(-x * x);
        return x < 0 ? -y : y;
      },
      pr = (x) =>
        Math.round(50 * (1 + erf((x.last + x.sl * 7 - 4) / 0.32 / Math.SQRT2))),
      top = us[0];
    $("#k6").outerHTML = kp([
      [
        "사이트 누전 위험지수",
        `${top.r}<u>/ 100</u>`,
        "높음 · 최고 위험 " + top.u.n,
        "cl2",
      ],
      [
        "7일 내 경고 기준 도달 확률",
        pr(top) + "<u>%</u>",
        "최고 위험 유닛 · 4.0 mA 기준",
        "cl1",
      ],
      [
        "주의 대상 유닛",
        `${us.filter((x) => x.r >= 35).length}<u>/ ${c.u.length}대</u>`,
        "위험지수 35 이상",
      ],
      [
        "예측 갱신",
        ((new Date().getHours() + 1) % 24) + ":00",
        "1시간 주기 · 학습 90일",
      ],
    ]).replace('<div class="k">', '<div class="k" id="k6">');
    $("#at").textContent = `${s.u.n} ${s.u.loc} 일 최대 Igr 예측`;
    const fc = [...Array(7)].map((_, k) => s.last + s.sl * (k + 1)),
      sd = (k) => 0.12 + 0.07 * (k + 1);
    ch($("#cv"), {
      n: 21,
      max: 5.5,
      series: [
        { d: s.h, c: "var(--t)", dots: 1 },
        {
          d: [...Array(13).fill(null), s.h[13], ...fc],
          c: "#5b8def",
          dash: 1,
          dots: 1,
        },
      ],
      band: {
        s: 14,
        lo: fc.map((v, k) => v - sd(k) * 1.64),
        hi: fc.map((v, k) => v + sd(k) * 1.64),
      },
      lines: [
        { v: 4, c: "#ef5b4f" },
        { v: 5, c: "var(--m)" },
      ],
      lb: [0, 4, 8, 12, 16, 20].map((i) => {
        const d = new Date(Date.now() + (i - 13) * 864e5);
        return [i, d.getMonth() + 1 + "/" + d.getDate()];
      }),
    });
    $("#rk").innerHTML = us
      .map((x) => {
        const t =
            x.sl * 7 > 0.2
              ? `<span class="b b2">Igr 상승 추세 +${f(x.sl * 7)} mA/주</span> `
              : "",
          h = x.u.thdi > 8 ? '<span class="b b1">전류 고조파 높음</span> ' : "",
          l =
            x.u.ld > 0.4
              ? '<span class="b b0" style="background:var(--sg);color:var(--m)">고부하 운전</span>'
              : "",
          z =
            t + h + l ||
            '<span class="b" style="background:var(--gr);color:var(--m)">변동 요인 없음</span>';
        return `<div class="ev" style="border-left:0;cursor:pointer;${x.i == S.ai ? "background:var(--hv)" : ""}" onclick="S.ai=${x.i};upd()"><div style="display:flex;justify-content:space-between"><span><b class="mono">${x.u.n}</b> ${x.u.loc}</span><b class="mono cl${x.r >= 60 ? 2 : x.r >= 30 ? 1 : 0}">${x.r}</b></div><div style="margin-top:4px">${z}</div></div>`;
      })
      .join("");
    $("#rc").innerHTML =
      "<ol>" +
      us
        .slice(0, 3)
        .map(
          (x, i) =>
            `<li><b class="mono">${x.u.n} ${x.u.loc}</b>: 7일 내 4.0 mA 도달 확률 ${pr(x)}%. ${x.sl * 7 > 0.2 ? `누설전류가 매주 ${f(x.sl * 7)} mA씩 증가하고 있어 부하측 케이블 피복과 접속부 습기 유입 여부를 점검하세요.` : "기저 누설전류가 높아 해당 회로에 연결된 노후 기기의 절연저항 측정을 권장합니다."}</li>`,
        )
        .join("") +
      "</ol>";
  },
};
