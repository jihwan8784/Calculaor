// 부가세(10%) 계산. 원 미만은 버림.

// 공급가액을 알 때: 공급가액 + 부가세 = 합계
function fromSupply(supply) {
  const vat = Math.floor(supply * 0.1);
  return { supply, vat, total: supply + vat };
}

// 합계(부가세 포함 금액)를 알 때: 공급가액과 부가세로 나누기
function fromTotal(total) {
  const vat = Math.floor(total / 11);
  return { supply: total - vat, vat, total };
}

if (typeof module !== "undefined") module.exports = { fromSupply, fromTotal };
