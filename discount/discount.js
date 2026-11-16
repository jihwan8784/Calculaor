// 할인 계산

// 정가와 할인율(최대 2번)로 최종 가격 구하기
function applyDiscount({ price, rate1 = 0, rate2 = 0 }) {
  const after1 = price * (1 - rate1 / 100);
  const final = after1 * (1 - rate2 / 100);
  const saved = price - final;
  return {
    after1, final, saved,
    totalRate: price ? (saved / price) * 100 : 0,   // 실제 총 할인율
  };
}

// 정가와 판매가로 할인율 구하기
function findRate({ price, sale }) {
  if (!price) return { rate: 0, saved: 0 };
  const saved = price - sale;
  return { rate: (saved / price) * 100, saved };
}

if (typeof module !== "undefined") module.exports = { applyDiscount, findRate };
