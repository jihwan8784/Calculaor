// 만 나이 계산

const ZODIAC = ["원숭이", "닭", "개", "돼지", "쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양"];
const DAY_MS = 24 * 60 * 60 * 1000;

// birth, base: "YYYY-MM-DD"
function calcAge(birth, base) {
  const b = dateToUTC(birth), t = dateToUTC(base);
  if (b === null || t === null || t < b) return { valid: false };
  const bd = new Date(b), td = new Date(t);
  const by = bd.getUTCFullYear(), bm = bd.getUTCMonth(), bday = bd.getUTCDate();
  const ty = td.getUTCFullYear(), tm = td.getUTCMonth(), tday = td.getUTCDate();

  const hadBirthday = tm > bm || (tm === bm && tday >= bday);
  const manAge = ty - by - (hadBirthday ? 0 : 1);

  // 다음 생일 (2월 29일생은 평년에 2월 28일로)
  const birthdayIn = (y) => {
    const last = new Date(Date.UTC(y, bm + 1, 0)).getUTCDate();
    return Date.UTC(y, bm, Math.min(bday, last));
  };
  let next = birthdayIn(ty);
  if (next < t) next = birthdayIn(ty + 1);

  return {
    valid: true,
    manAge,
    yearAge: ty - by,          // 연 나이 (병역법·청소년보호법 등)
    koreanAge: ty - by + 1,    // 세는 나이
    zodiac: ZODIAC[by % 12],
    daysLived: Math.round((t - b) / DAY_MS),
    nextBirthday: next,
    daysToBirthday: Math.round((next - t) / DAY_MS),
    isBirthday: next === t,
  };
}

if (typeof module !== "undefined") module.exports = { calcAge };
