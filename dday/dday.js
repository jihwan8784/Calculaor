// D-day 계산

const DAY_MS = 24 * 60 * 60 * 1000;

// 두 날짜 사이 (from, to: "YYYY-MM-DD")
function diffDays(from, to) {
  const a = dateToUTC(from), b = dateToUTC(to);
  if (a === null || b === null) return null;
  const diff = Math.round((b - a) / DAY_MS);
  return {
    diff,
    label: diff > 0 ? `D-${diff}` : diff < 0 ? `D+${-diff}` : "D-Day",
    countFromStart: Math.abs(diff) + 1,   // 시작일을 1일로 셀 때 (기념일 방식)
    weeks: Math.floor(Math.abs(diff) / 7),
    restDays: Math.abs(diff) % 7,
  };
}

// 날짜 + N일
// countStartAsDay1이 true면 시작일을 1일째로 센다 (예: 사귄 지 100일)
function addDays(from, n, countStartAsDay1 = false) {
  const a = dateToUTC(from);
  if (a === null) return null;
  return a + (n - (countStartAsDay1 ? 1 : 0)) * DAY_MS;
}

if (typeof module !== "undefined") module.exports = { diffDays, addDays };
