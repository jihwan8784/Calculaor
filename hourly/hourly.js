// 시급 → 월급 계산 (주휴수당 포함)

const MIN_WAGE = { year: 2026, hourly: 10320 };   // 2026년 최저시급
const WEEKS_PER_MONTH = 365 / 7 / 12;             // 한 달 평균 약 4.345주

/**
 * @param {number} wage      시급
 * @param {number} hours     하루 근무시간
 * @param {number} days      주 근무일수
 */
function calcHourly({ wage, hours, days }) {
  const weekly = hours * days;
  const holidayEligible = weekly >= 15;                        // 주 15시간 이상이면 주휴수당
  const holidayHours = holidayEligible ? (Math.min(weekly, 40) / 40) * 8 : 0;
  const monthHours = Math.round((weekly + holidayHours) * WEEKS_PER_MONTH);
  const monthly = monthHours * wage;
  const weeklyPay = (weekly + holidayHours) * wage;

  return {
    weekly, holidayEligible, holidayHours, monthHours,
    weeklyPay,
    holidayPay: holidayHours * wage,
    monthly,
    yearly: monthly * 12,
    afterTax33: monthly - Math.floor(monthly * 0.033 / 10) * 10,  // 3.3% 원천징수 후
    belowMin: wage > 0 && wage < MIN_WAGE.hourly,
  };
}

if (typeof module !== "undefined") module.exports = { calcHourly, MIN_WAGE };
