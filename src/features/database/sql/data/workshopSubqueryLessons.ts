import { workshopRows, learnerRows, bookingRows } from '../../workbench/missions'
import type { SubqueryLesson } from './subqueryLessons'

const maxFee = Math.max(...workshopRows.map(row => Number(row[3])))
const pottery = workshopRows.filter(row => row[2] === '도예')
const potteryBookings = bookingRows.filter(row => pottery.some(workshop => workshop[0] === row[2]))
const potteryLearners = learnerRows.filter(row => potteryBookings.some(booking => booking[1] === row[0]))
const haneul = learnerRows.filter(row => row[1] === '김하늘')
const ownBookings = bookingRows.filter(row => haneul.some(learner => learner[0] === row[1]))
const ownWorkshops = workshopRows.filter(row => ownBookings.some(booking => booking[2] === row[0]))
const ownCategories = ownWorkshops.map(row => row[2])
const relatedWorkshops = workshopRows.filter(row => ownCategories.includes(row[2]))

export const workshopSubqueryLessons: SubqueryLesson[] = [
  {
    title: '한 값 · 가장 비싼 체험', question: '정가가 가장 높은 체험의 이름(title)을 부속질의로 검색하시오.', nesting: 1,
    sql: 'select title\nfrom Workshop\nwhere fee = (\n  select max(fee)\n  from Workshop\n);',
    hint: 'Workshop에서 최고 정가 MAX(fee) 한 값을 구하고, 바깥에서 fee가 그 값인 체험을 찾습니다.',
    caution: '정가는 Workshop.fee입니다. Booking.paid_fee는 실제 결제액이므로 구별하세요. 최고가가 같으면 여러 체험이 검색될 수 있습니다.',
    steps: [
      { title: '최고 정가 구하기', table: 'Workshop → fee 한 값', sql: 'select max(fee)\nfrom Workshop;', result: { columns: ['max(fee)'], rows: [[maxFee]] }, explanation: '전체 체험의 최고 정가는 60000입니다. 이 단계는 체험 이름을 반환하지 않습니다.', next: '바깥 Workshop의 fee = 60000에 사용합니다.' },
      { title: '최고가 체험의 이름 찾기', table: 'Workshop → title', sql: 'select title\nfrom Workshop\nwhere fee = 60000;', result: { columns: ['title'], rows: workshopRows.filter(row => row[3] === maxFee).map(row => [row[1]]) }, explanation: '정가가 60000인 실버 반지가 검색됩니다. 가장 바깥 SELECT에 title을 써서 이름만 표시합니다.', next: '60000 자리에 MAX(fee)를 구하는 SELECT를 넣습니다.' },
    ],
  },
  {
    title: '중첩 IN · 도예 예약 회원', question: '도예 분류의 체험을 예약한 회원의 이름을 중첩 IN 부속질의로 검색하시오.', nesting: 2,
    sql: "select name\nfrom Learner\nwhere learner_id in (\n  select learner_id\n  from Booking\n  where workshop_id in (\n    select workshop_id\n    from Workshop\n    where category = '도예'\n  )\n);",
    hint: 'Workshop의 도예 체험번호 → Booking의 회원번호 → Learner의 이름 순서로 연결합니다.',
    caution: 'workshop_id IN의 내부 SELECT는 workshop_id, learner_id IN의 내부 SELECT는 learner_id를 반환해야 합니다. 예약이 여러 건이어도 IN은 회원 행을 복제하지 않습니다.',
    steps: [
      { title: '도예 체험번호 찾기', table: 'Workshop → workshop_id', sql: "select workshop_id\nfrom Workshop\nwhere category = '도예';", result: { columns: ['workshop_id'], rows: pottery.map(row => [row[0]]) }, explanation: '도예에 속하는 체험은 1번 도자기 머그와 2번 도자기 접시입니다.', next: 'Booking의 workshop_id in (1, 2)에 전달합니다.' },
      { title: '예약한 회원번호 찾기', table: 'Booking → learner_id', sql: 'select learner_id\nfrom Booking\nwhere workshop_id in (1, 2);', result: { columns: ['learner_id'], rows: potteryBookings.map(row => [row[1]]) }, explanation: '도예 체험 예약에서 회원번호를 가져옵니다. 한 회원의 예약이 여러 건이면 같은 번호가 반복되어도 됩니다.', next: 'Learner의 learner_id IN (...)에 이 회원번호 목록을 넣습니다.' },
      { title: '회원 이름 찾기', table: 'Learner → name', sql: 'select name\nfrom Learner\nwhere learner_id in (1, 3, 2, 2);', result: { columns: ['name'], rows: potteryLearners.map(row => [row[1]]) }, explanation: '최종 결과는 김하늘·이서준·박민서입니다. 내부 목록의 2번 중복 때문에 이서준이 두 번 출력되지는 않습니다.', next: '숫자 목록을 각 단계 SELECT로 바꾸면 전체 SQL이 완성됩니다.' },
    ],
  },
  {
    title: '3중 부속질의 · 예약한 체험의 분류', question: '김하늘이 예약한 체험들과 같은 분류에 속하는 모든 체험의 이름을 검색하시오. 김하늘이 직접 예약하지 않은 체험도 포함하시오.', nesting: 3,
    sql: "select title\nfrom Workshop\nwhere category in (\n  select category\n  from Workshop\n  where workshop_id in (\n    select workshop_id\n    from Booking\n    where learner_id in (\n      select learner_id\n      from Learner\n      where name = '김하늘'\n    )\n  )\n);",
    hint: '김하늘의 회원번호 → 예약 체험번호 → 그 체험들의 분류 → 같은 분류에 속하는 모든 체험의 이름입니다.',
    caution: '주질의 1개와 내부 부속질의 3개로 SELECT는 총 4개입니다. 마지막 바깥 조건은 workshop_id가 아니라 category IN입니다. 직접 예약한 체험만 고르는 것과 다릅니다.',
    steps: [
      { title: '김하늘의 회원번호', table: 'Learner → learner_id', sql: "select learner_id\nfrom Learner\nwhere name = '김하늘';", result: { columns: ['learner_id'], rows: haneul.map(row => [row[0]]) }, explanation: '김하늘의 회원번호는 1입니다. 이름으로 예약을 직접 찾지 않고 회원번호를 넘깁니다.', next: 'Booking의 learner_id in (1)에 넣습니다.' },
      { title: '예약한 체험번호', table: 'Booking → workshop_id', sql: 'select workshop_id\nfrom Booking\nwhere learner_id in (1);', result: { columns: ['workshop_id'], rows: ownBookings.map(row => [row[2]]) }, explanation: '김하늘이 예약한 체험번호는 1·5·7입니다.', next: 'Workshop의 workshop_id in (1, 5, 7)에 넣습니다.' },
      { title: '예약 체험의 분류', table: 'Workshop → category', sql: 'select category\nfrom Workshop\nwhere workshop_id in (1, 5, 7);', result: { columns: ['category'], rows: ownWorkshops.map(row => [row[2]]) }, explanation: '해당 체험의 분류는 도예·금속·생활입니다. 이제 다음 단계에는 체험번호 대신 분류를 넘깁니다.', next: "Workshop의 category in ('도예', '금속', '생활')에 넣습니다." },
      { title: '같은 분류의 모든 체험', table: 'Workshop → title', sql: "select title\nfrom Workshop\nwhere category in ('도예', '금속', '생활');", result: { columns: ['title'], rows: relatedWorkshops.map(row => [row[1]]) }, explanation: '도자기 머그·도자기 접시·실버 반지·향수 블렌딩·비누 만들기의 5개입니다. 직접 예약하지 않은 도자기 접시와 비누 만들기도 포함합니다.', next: '목록을 내부 SELECT로 대체하고 괄호 세 쌍을 맞춥니다.' },
    ],
  },
]
