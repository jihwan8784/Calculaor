// 퇴직금 계산 (근로자퇴직급여 보장법 기준)
// 퇴직금 = 1일 평균임금 × 30일 × (재직일수 ÷ 365)

const DAY = 24 * 60 * 60 * 1000;

function toUTC(str) {
  const [y, m, d] = String(str).split("-").map(Number);
  if (!y || !m || !d) return null;
  return Date.UTC(y, m - 1, d);
}

// 퇴직일 기준 3개월 전 날짜 (31일 → 해당 월 말일로 맞춤)
function threeMonthsBefore(t) {
  const d = new Date(t);
  const y = d.getUTCFullYear(), m = d.getUTCMonth() - 3, day = d.getUTCDate();
  const last = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  return Date.UTC(y, m, Math.min(day, last));
}

/**
 * @param {object} p
 * @param {string} p.start       입사일 (YYYY-MM-DD)
 * @param {string} p.lastDay     마지막 근무일 (YYYY-MM-DD)
 * @param {number} p.monthlyPay  최근 3개월 월평균 급여 (세전, 기본급+수당)
 * @param {number} p.bonus       최근 1년 상여금 총액
 * @param {number} p.leavePay    최근 1년 연차수당 총액
 */
function calcSeverance({ start, lastDay, monthlyPay = 0, bonus = 0, leavePay = 0 }) {
  const s = toUTC(start), l = toUTC(lastDay);
  if (s === null || l === null || l < s) return { valid: false };

  const retire = l + DAY;                       // 퇴직일 = 마지막 근무일 다음 날
  const workDays = Math.round((retire - s) / DAY);
  const periodDays = Math.round((retire - threeMonthsBefore(retire)) / DAY);

  const wage3 = monthlyPay * 3 + (bonus * 3) / 12 + (leavePay * 3) / 12;
  const avgDaily = periodDays ? wage3 / periodDays : 0;
  const severance = avgDaily * 30 * (workDays / 365);

  // 재직기간을 "N년 N개월 N일"로
  const sd = new Date(s), rd = new Date(retire);
  let y = rd.getUTCFullYear() - sd.getUTCFullYear();
  let m = rd.getUTCMonth() - sd.getUTCMonth();
  let d = rd.getUTCDate() - sd.getUTCDate();
  if (d < 0) { m -= 1; d += new Date(Date.UTC(rd.getUTCFullYear(), rd.getUTCMonth(), 0)).getUTCDate(); }
  if (m < 0) { y -= 1; m += 12; }

  return {
    valid: true,
    eligible: workDays >= 365,
    workDays, periodDays, wage3, avgDaily,
    severance: Math.floor(severance),
    period: { y, m, d },
  };
}

if (typeof module !== "undefined") module.exports = { calcSeverance };
