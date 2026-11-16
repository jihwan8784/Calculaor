// 연봉 실수령액 계산 (2026년 기준)
// 요율이 바뀌면 RATES만 고치면 된다.

const RATES = {
  year: 2026,
  pension: 0.0475,          // 국민연금 근로자 부담 (총 9.5%의 절반)
  pensionMin: 400000,       // 국민연금 기준소득월액 하한
  pensionMax: 6370000,      // 국민연금 기준소득월액 상한 (2025.7~2026.6)
  health: 0.03595,          // 건강보험 근로자 부담 (총 7.19%의 절반)
  care: 0.1314,             // 장기요양보험 = 건강보험료 × 13.14%
  employment: 0.009,        // 고용보험 근로자 부담
};

// 근로소득공제 (연간 총급여 기준)
function earnedIncomeDeduction(pay) {
  let d;
  if (pay <= 5000000) d = pay * 0.7;
  else if (pay <= 15000000) d = 3500000 + (pay - 5000000) * 0.4;
  else if (pay <= 45000000) d = 7500000 + (pay - 15000000) * 0.15;
  else if (pay <= 100000000) d = 12000000 + (pay - 45000000) * 0.05;
  else d = 14750000 + (pay - 100000000) * 0.02;
  return Math.min(d, 20000000);
}

// 종합소득세 기본세율
function basicTax(base) {
  const brackets = [
    [14000000, 0.06, 0],
    [50000000, 0.15, 1260000],
    [88000000, 0.24, 5760000],
    [150000000, 0.35, 15440000],
    [300000000, 0.38, 19940000],
    [500000000, 0.40, 25940000],
    [1000000000, 0.42, 35940000],
    [Infinity, 0.45, 65940000],
  ];
  if (base <= 0) return 0;
  for (const [limit, rate, minus] of brackets) {
    if (base <= limit) return base * rate - minus;
  }
}

// 근로소득세액공제 (한도 포함)
function earnedIncomeTaxCredit(tax, pay) {
  let credit = tax <= 1300000 ? tax * 0.55 : 715000 + (tax - 1300000) * 0.3;
  let limit;
  if (pay <= 33000000) limit = 740000;
  else if (pay <= 70000000) limit = Math.max(740000 - (pay - 33000000) * 0.008, 660000);
  else if (pay <= 120000000) limit = Math.max(660000 - (pay - 70000000) * 0.5, 500000);
  else limit = Math.max(500000 - (pay - 120000000) * 0.5, 200000);
  return Math.min(credit, limit);
}

// 자녀세액공제 (8세 이상 20세 이하 자녀)
function childTaxCredit(children) {
  if (children <= 0) return 0;
  if (children === 1) return 250000;
  return 550000 + (children - 2) * 400000;
}

/**
 * @param {object} p
 * @param {number} p.annual    연봉 (원)
 * @param {number} p.nonTax    월 비과세액 (식대 등, 원)
 * @param {number} p.family    부양가족 수 (본인 포함)
 * @param {number} p.children  8~20세 자녀 수
 * @param {boolean} p.withSeverance 연봉에 퇴직금 포함 여부
 */
function calcSalary({ annual, nonTax = 200000, family = 1, children = 0, withSeverance = false }) {
  const monthly = annual / (withSeverance ? 13 : 12);
  const taxableMonthly = Math.max(monthly - nonTax, 0);

  // 4대보험 (월)
  const pensionBase = Math.min(Math.max(taxableMonthly, RATES.pensionMin), RATES.pensionMax);
  const pension = taxableMonthly > 0 ? floor10(pensionBase * RATES.pension) : 0;
  const health = floor10(taxableMonthly * RATES.health);
  const care = floor10(health * RATES.care);
  const employment = floor10(taxableMonthly * RATES.employment);

  // 소득세 (연간으로 계산한 뒤 12로 나눔)
  const yearPay = taxableMonthly * 12;
  const earnedIncome = yearPay - earnedIncomeDeduction(yearPay);
  const personal = 1500000 * Math.max(family, 1);
  const insuranceDeduction = (pension + health + care + employment) * 12;
  const taxBase = Math.max(earnedIncome - personal - insuranceDeduction, 0);
  const tax = basicTax(taxBase);
  const yearTax = Math.max(tax - earnedIncomeTaxCredit(tax, yearPay) - childTaxCredit(children), 0);

  const incomeTax = floor10(yearTax / 12);
  const localTax = floor10(incomeTax * 0.1);

  const totalDeduction = pension + health + care + employment + incomeTax + localTax;
  const net = monthly - totalDeduction;

  return {
    monthly, taxableMonthly,
    pension, health, care, employment, incomeTax, localTax,
    totalDeduction, net,
    netAnnual: net * 12,
  };
}

if (typeof module !== "undefined") {
  global.floor10 = global.floor10 || ((n) => Math.floor(n / 10) * 10);
  module.exports = { calcSalary, RATES };
}
