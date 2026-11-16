// 평 ↔ ㎡ 변환
// 1평 = 400/121 ㎡ ≈ 3.3058㎡

const SQM_PER_PYEONG = 400 / 121;

function pyeongToSqm(p) { return p * SQM_PER_PYEONG; }
function sqmToPyeong(m) { return m / SQM_PER_PYEONG; }

// 소수점 n자리에서 반올림하고 뒤의 0 정리
function round(n, digits = 2) {
  const f = Math.pow(10, digits);
  return String(Math.round(n * f) / f);
}

if (typeof module !== "undefined") module.exports = { pyeongToSqm, sqmToPyeong, round };
