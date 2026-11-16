// 계산해줘 공통 기능

// 12345678 -> "12,345,678"
function formatNumber(n) {
  return Math.round(n).toLocaleString("ko-KR");
}

// 입력창 글자에서 숫자만 꺼내기 ("5,000" -> 5000)
function parseNumber(str) {
  const n = Number(String(str).replace(/[^0-9]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

// 입력하는 동안 자동으로 쉼표 넣기
function attachCommaInput(input, onChange) {
  input.addEventListener("input", () => {
    const n = parseNumber(input.value);
    input.value = n ? formatNumber(n) : "";
    onChange();
  });
}

// 10원 미만 버림 (급여 계산 관행)
function floor10(n) {
  return Math.floor(n / 10) * 10;
}

// 큰 금액을 "1억 2,345만 원"처럼 읽기 쉽게
function toKoreanWon(n) {
  n = Math.round(n);
  if (n <= 0) return "0원";
  const eok = Math.floor(n / 100000000);
  const man = Math.floor((n % 100000000) / 10000);
  const won = n % 10000;
  const parts = [];
  if (eok) parts.push(formatNumber(eok) + "억");
  if (man) parts.push(formatNumber(man) + "만");
  if (won && !eok) parts.push(formatNumber(won));
  return parts.join(" ") + "원";
}

// 소수점 입력창 (이자율, 면적 등)
function parseDecimal(str) {
  const n = parseFloat(String(str).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}
function attachDecimalInput(input, onChange) {
  input.addEventListener("input", () => {
    let v = input.value.replace(/[^0-9.]/g, "");
    const i = v.indexOf(".");
    if (i !== -1) v = v.slice(0, i + 1) + v.slice(i + 1).replace(/\./g, "");
    input.value = v;
    onChange();
  });
}

// 버튼 묶음(.seg)에서 하나 고르기
function bindSeg(el, onPick) {
  const sync = () => el.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x.classList.contains("on")));
  sync();
  el.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    el.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
    sync();
    onPick(b.dataset.v);
  });
}

// 빠른 입력 버튼(.quick[data-target])
function bindQuick(onChange) {
  document.querySelectorAll(".quick[data-target]").forEach((box) => {
    const input = document.getElementById(box.dataset.target);
    box.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      let n = parseNumber(input.value);
      if (b.dataset.add) n += Number(b.dataset.add);
      if (b.dataset.set !== undefined) n = Number(b.dataset.set);
      input.value = n ? formatNumber(n) : "";
      onChange();
    });
  });
}

// 계산기 목록 (메인·관련 계산기에서 사용)
const CALCS = [
  { key: "salary", ico: "💰", name: "연봉 실수령액", desc: "4대보험·세금 빼고 월급" },
  { key: "severance", ico: "💼", name: "퇴직금", desc: "근무기간으로 계산" },
  { key: "loan", ico: "🏦", name: "대출 이자", desc: "월 상환액 계산" },
  { key: "rent", ico: "🏠", name: "전월세 전환", desc: "보증금 ↔ 월세" },
  { key: "area", ico: "📐", name: "평수 변환", desc: "평 ↔ ㎡" },
  { key: "hourly", ico: "⏰", name: "시급 → 월급", desc: "주휴수당 포함" },
  { key: "vat", ico: "🧾", name: "부가세", desc: "공급가액·세액 나누기" },
  { key: "age", ico: "🎂", name: "만 나이", desc: "생년월일로 계산" },
  { key: "dday", ico: "📅", name: "D-day", desc: "남은 날짜 세기" },
  { key: "discount", ico: "🏷️", name: "할인율", desc: "할인가·할인율" },
];

// 하위 페이지 하단의 "다른 계산기" 채우기
function renderRelated(current) {
  const box = document.getElementById("related");
  if (!box) return;
  box.innerHTML = CALCS.filter((c) => c.key !== current)
    .map((c) => `<a class="tile" href="../${c.key}/"><div class="ico" aria-hidden="true">${c.ico}</div>` +
      `<div class="name">${c.name}</div><div class="desc">${c.desc}</div></a>`)
    .join("");
}

// 오늘 날짜 "YYYY-MM-DD" (내 기기 시간 기준)
function todayStr() {
  const t = new Date();
  return new Date(t.getTime() - t.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

// "YYYY-MM-DD" -> UTC 기준 밀리초 (날짜 계산용)
function dateToUTC(str) {
  const [y, m, d] = String(str).split("-").map(Number);
  if (!y || !m || !d) return null;
  return Date.UTC(y, m - 1, d);
}

// UTC 밀리초 -> "2026년 11월 1일 (일)"
function formatDateKo(t) {
  const d = new Date(t);
  const w = "일월화수목금토"[d.getUTCDay()];
  return `${d.getUTCFullYear()}년 ${d.getUTCMonth() + 1}월 ${d.getUTCDate()}일 (${w})`;
}
