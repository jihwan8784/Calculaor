// 전월세 전환 계산
// 전월세 전환율 = 월세 × 12 ÷ (전세금 − 월세보증금)

// 전세 → 월세: 전세금 일부를 월세로 바꿀 때 내야 할 월세
function jeonseToMonthly({ jeonse, deposit, rate }) {
  const diff = Math.max(jeonse - deposit, 0);
  return (diff * (rate / 100)) / 12;
}

// 월세 → 전세: 월세를 전부 없앨 때 필요한 전세금
function monthlyToJeonse({ deposit, monthly, rate }) {
  if (!rate) return 0;
  return deposit + (monthly * 12) / (rate / 100);
}

// 전환율 구하기: 지금 조건이 몇 %로 계산된 건지
function conversionRate({ jeonse, deposit, monthly }) {
  const diff = jeonse - deposit;
  if (diff <= 0) return 0;
  return ((monthly * 12) / diff) * 100;
}

if (typeof module !== "undefined") module.exports = { jeonseToMonthly, monthlyToJeonse, conversionRate };
