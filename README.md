# 계산해줘

연봉, 퇴직금, 대출 이자처럼 자주 찾는 생활 계산을 무료로 바로 할 수 있는 계산기 모음 사이트입니다.

- 사이트: https://gyesan-haejwo.vercel.app
- 계획서: [PLAN.md](PLAN.md)

## 계산기 (10개)

| 계산기 | 폴더 |
|---|---|
| 연봉 실수령액 | `salary/` |
| 퇴직금 | `severance/` |
| 대출 이자 | `loan/` |
| 전월세 전환 | `rent/` |
| 평수 변환 | `area/` |
| 시급 → 월급 | `hourly/` |
| 부가세 | `vat/` |
| 만 나이 | `age/` |
| D-day | `dday/` |
| 할인율 | `discount/` |

각 폴더에는 화면(`index.html`)과 계산 로직(`*.js`)이 들어 있습니다. 공통 디자인과 기능은 `assets/`에 있습니다.

## 구조

- 서버나 데이터베이스 없이 HTML·CSS·JavaScript만으로 동작합니다.
- Vercel에 정적 사이트로 배포합니다.
- 페이지를 추가하거나 도메인을 바꾸면 사이트맵을 다시 만듭니다: `sh make-sitemap.sh https://주소`
- `google00e73c5a1e6c6d86.html`은 구글 서치 콘솔 소유권 확인 파일이라 지우면 안 됩니다.
