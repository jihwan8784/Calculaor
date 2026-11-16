// 대출 이자 계산
// type: "equal"(원리금균등) | "principal"(원금균등) | "bullet"(만기일시)

function calcLoan({ principal, rate, months, type = "equal" }) {
  const P = Math.max(principal, 0);
  const n = Math.max(Math.round(months), 0);
  const r = rate / 100 / 12;
  const rows = [];
  if (!P || !n) return { rows, totalInterest: 0, totalPay: 0, firstPay: 0, lastPay: 0 };

  let bal = P;
  const pmt = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

  for (let i = 1; i <= n; i++) {
    const interest = bal * r;
    let prin;
    if (type === "equal") prin = pmt - interest;
    else if (type === "principal") prin = P / n;
    else prin = i === n ? bal : 0;
    if (i === n) prin = bal; // 마지막 달 오차 정리
    bal -= prin;
    rows.push({ no: i, pay: prin + interest, prin, interest, bal: Math.max(bal, 0) });
  }

  const totalInterest = rows.reduce((s, x) => s + x.interest, 0);
  return {
    rows,
    totalInterest,
    totalPay: P + totalInterest,
    firstPay: rows[0].pay,
    lastPay: rows[n - 1].pay,
  };
}

if (typeof module !== "undefined") module.exports = { calcLoan };
