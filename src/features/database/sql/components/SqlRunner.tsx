import { useRef, useState } from 'react'
import type { Database } from 'sql.js'
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url'
import { books, customers, orders, sampleTables } from '../data/sqlLessonData'
import type { SqlResult } from '../data/sqlLessonData'
import { SqlTable } from './SqlLessonParts'
import { missionTables, missions } from '../../workbench/missions'
import { answers } from '../../workbench/answers'
import './sql-practice.css'
import SqlSourceTrace, { buildSourceTrace } from './SqlSourceTrace'
import type { SourceTrace } from './SqlSourceTrace'
import { indentSql } from './sqlIndent'
import CreateTablePractice, { createExercises } from './CreateTablePractice'
import SubqueryWalkthrough from './SubqueryWalkthrough'
import { subqueryLessons } from '../data/subqueryLessons'
import { workshopSubqueryLessons } from '../data/workshopSubqueryLessons'

type Exercise = {
  group: string
  label: string
  comment?: string
  explanation?: string
  caution?: string
}

const exercises: Exercise[] = [
  { group: '자유 연습', label: '자유롭게 SQL 작성하기' },
  { group: 'JOIN 문제', label: '박지성의 총 구매액', comment: '-- 1.박지성의 총 구매액 을 검색하시오 ', explanation: 'Customer와 Orders를 custid로 연결한 뒤, 박지성의 주문 행만 남기고 saleprice를 합산합니다.', caution: '이름 조건만 쓰고 조인 조건 c.custid = o.custid를 빠뜨리면 모든 행이 서로 곱해져 합계가 크게 나옵니다.' },
  { group: 'JOIN 문제', label: '김연아의 구매 도서 수와 최고·최소금액 차이', comment: '-- 2.김연아가  구매한 도서의 수와 최고금액과 최소금액의 차이를 검색하시오.', explanation: 'Customer와 Orders를 연결하고 김연아의 주문을 대상으로 COUNT, MAX, MIN을 사용합니다. 금액 차이는 MAX(saleprice)-MIN(saleprice)입니다.', caution: '구매 도서 수는 주문 행 수이므로 COUNT(*)를 사용합니다. 서로 다른 책 수를 요구할 때만 COUNT(DISTINCT bookid)를 사용합니다.' },
  { group: 'JOIN 문제', label: '박지성이 구매한 도서의 출판사 수', comment: '-- 3. 박지성이 구매한 도서의 출판사 수를 검색하시오', explanation: 'Customer → Orders → Book 순서로 세 테이블을 연결하고 출판사를 셉니다.', caution: '같은 출판사의 책을 여러 권 샀을 수 있으므로 출판사 종류의 수라면 COUNT(DISTINCT publisher)가 필요합니다.' },
  { group: 'JOIN 문제', label: '박지성 구매 도서의 책정가와 판매금액 차이', comment: '-- 4. 박지성이 구매한 도서의 이름, 책정가 와 판매금액의  차이를 검색하시오', explanation: '세 테이블을 연결해 bookname, Book.price와 Book.price-Orders.saleprice를 출력합니다.', caution: 'price는 Book의 정가이고 saleprice는 Orders의 판매가격입니다. 두 열을 반대로 빼지 않도록 확인하세요.' },
  { group: 'JOIN 문제', label: '김연아가 구매한 도서명과 출판사명', comment: '-- 5. 김연아가  구매한 도서의 도서명과 출판사명을 검색하시오', explanation: 'Customer에서 김연아를 찾고 Orders를 거쳐 Book의 bookname과 publisher를 가져옵니다.', caution: 'Customer와 Book은 직접 연결할 공통키가 없습니다. 반드시 Orders를 중간에 두어야 합니다.' },
  { group: 'JOIN 문제', label: '고객 이름과 구매 도서 목록', comment: '-- 6.  고객의 이름과 고객이 구매한 도서 목록을 검색하시오', explanation: 'Customer.custid와 Orders.custid, Orders.bookid와 Book.bookid를 각각 연결합니다.', caution: 'bookid는 Book과 Orders 양쪽에 있으므로 조건에서는 b.bookid, o.bookid처럼 테이블 별칭을 붙이세요.' },
  { group: 'JOIN 문제', label: '고객명별 구매 평균과 합계', comment: '-- 7. 고객명별 도서를 구매한 평균과 합계를 검색하시오', explanation: '고객과 주문을 연결한 뒤 name으로 그룹화하고 AVG(saleprice), SUM(saleprice)를 계산합니다.', caution: '고객별 결과를 만들려면 GROUP BY name이 필요합니다. WHERE는 조인·행 조건이고 HAVING은 집계 결과 조건일 때 사용합니다.' },
  { group: 'JOIN 문제', label: '영국 거주 구매 고객의 이름과 주소', comment: '-- 8. 도서를 구매한 사람중 영국에 거주하는 고객의 이름과 주소를 검색하시오', explanation: 'Customer와 Orders를 먼저 연결하고 Customer.address가 영국인 행을 WHERE에서 제한합니다.', caution: '주소가 “영국”으로 시작한다고 단정하지 말고 데이터 형태에 맞춰 LIKE 조건을 정하세요. 한 고객이 여러 번 주문했다면 중복 제거 여부도 확인합니다.' },
  { group: 'JOIN 문제', label: '판매가격 10,000원 이상 도서와 고객', comment: '-- 9.도서의 판매가격이 10000원 이상인 도서를 주문을 고객의 이름과 도서이름을 검색하시오.', explanation: '세 테이블을 연결한 뒤 Orders.saleprice가 10000 이상인 주문만 선택합니다.', caution: '문제는 판매가격을 묻고 있으므로 Book.price가 아니라 Orders.saleprice에 조건을 붙여야 합니다.' },
  { group: 'JOIN 문제', label: '도서명별 판매금액 합계와 평균', comment: '-- 10. 도서명별로 판매된 금액의 합계와 평균을 검색하시오', explanation: 'Book과 Orders를 bookid로 연결하고 bookname으로 그룹화해 합계와 평균을 계산합니다.', caution: '동명의 책이 있을 가능성까지 고려하면 GROUP BY b.bookid, bookname이 더 안전합니다.' },
  { group: 'JOIN 문제', label: '고객과 주문 판매가격을 비싼 순으로 정렬', comment: '-- 11. 고객의 이름과 고객이 주문한 도서의 판매가격을 검색하되 고객별 금액이 비싼거별로 정렬하시오', explanation: 'Customer와 Orders를 연결하고 각 주문의 name, saleprice를 출력한 뒤 saleprice 내림차순으로 정렬합니다.', caution: '각 주문 가격을 출력하는 문제라면 GROUP BY나 SUM은 필요하지 않습니다. “고객별 총액”을 요구할 때만 집계합니다.' },
  { group: 'JOIN 문제', label: '고객명별 구매 합계를 높은 순으로 정렬', comment: '-- 12.고객명별로 책을 구입한 합계를 검색하되 합계가 높은 순으로 검색하시오', explanation: '고객별로 GROUP BY하고 SUM(saleprice)를 구한 뒤 그 합계를 DESC로 정렬합니다.', caution: 'ORDER BY saleprice가 아니라 ORDER BY SUM(saleprice) DESC로 정렬해야 고객별 총액 순서가 됩니다.' },
  { group: 'JOIN 문제', label: '박씨 고객의 구매 정보를 비싼 순으로 정렬', comment: '-- 13. 박씨 성을 가진 고객이 책을 구매한 고객명,책이름,책번호,출판사명,산가격을 검색하되  가격이 비싼 순으로 검색하시오.', explanation: '세 테이블을 연결하고 name LIKE \'박%\' 조건을 적용한 뒤 saleprice 내림차순으로 정렬합니다.', caution: '한국 성씨가 앞에 있으므로 박씨 조건은 “박으로 시작”하는 박%입니다. %박%는 이름 중간의 박도 포함합니다.' },
  { group: 'JOIN 문제', label: '출판사별 판매 합계와 평균을 평균순으로 정렬', comment: '-- 14. 출판사별로 책이 팔린 가격의 합계와 평균을 출력하되 평균이 높은 순으로 검색하시오', explanation: 'Book과 Orders를 연결하고 publisher로 그룹화해 SUM과 AVG를 계산한 뒤 AVG 내림차순으로 정렬합니다.', caution: '정가 평균이 아니라 실제 판매된 saleprice의 평균입니다. ORDER BY AVG(saleprice) DESC를 사용하세요.' },
  { group: '외부 조인 문제', label: '주문하지 않은 고객도 포함한 판매가격', comment: '-- 15. 모든 고객의 이름과 판매가격을 검색하되 주문하지 않은 고객도 포함하시오', explanation: '모든 고객을 남겨야 하므로 Customer를 왼쪽에 두고 Orders를 LEFT JOIN합니다. 주문이 없는 고객의 판매가격은 NULL입니다.', caution: 'INNER JOIN을 사용하면 주문하지 않은 고객이 사라집니다. 전부 남길 Customer를 LEFT JOIN 앞에 두세요.' },
  { group: '외부 조인 문제', label: '주문하지 않은 고객 찾기', comment: '-- 16. 도서를 한 번도 주문하지 않은 고객의 이름을 검색하시오', explanation: 'Customer를 LEFT JOIN으로 보존한 뒤, 연결되지 않아 오른쪽 Orders의 기본키가 NULL인 행만 선택합니다.', caution: 'NULL은 = NULL로 비교하지 않고 IS NULL을 사용합니다. o.orderid처럼 오른쪽 테이블의 NULL이 될 수 없는 기본키를 확인하는 것이 안전합니다.' },
  { group: '외부 조인 문제', label: '모든 고객의 구매 합계', comment: '-- 17. 모든 고객의 이름과 구매 합계를 검색하되 주문이 없는 고객은 0으로 출력하시오', explanation: 'Customer를 LEFT JOIN으로 보존하고 고객별로 그룹화합니다. SUM 결과가 NULL인 고객은 COALESCE를 이용해 0으로 바꿉니다.', caution: 'GROUP BY에 고객번호와 이름을 함께 쓰면 동명이인을 구분할 수 있습니다. COUNT가 아니라 판매가격의 SUM을 구해야 합니다.' },
  { group: '부속질의 문제', label: '가장 비싼 책의 정보', comment: '-- 18. 도서테이블에서 가장비싼 책의 도서명과 출판사명과 책 가격 검색', explanation: '안쪽 질의에서 MAX(price)를 구하고, 바깥 질의에서 price가 그 값과 같은 책의 정보를 출력합니다.', caution: 'MAX(price)와 bookname을 집계 없이 한 SELECT에 함께 쓰면 도서명이 최고가 책과 정확히 대응한다고 보장할 수 없습니다.' },
  { group: '부속질의 문제', label: '대한민국 고객에게 판매한 총 판매액', comment: '-- 19. 대한민국에 거주하는 고객에 판매한 도서의 총 판매액', explanation: '부속질의에서 대한민국 고객의 custid 목록을 찾고, 바깥 Orders에서 해당 custid의 saleprice를 합산합니다.', caution: 'Customer와 Orders를 함께 FROM에 쓰는 방식이라면 조인 조건을 반드시 써야 합니다. 부속질의에서는 IN 뒤에 여러 custid가 올 수 있습니다.' },
  { group: '부속질의 문제', label: '전체 평균보다 비싸게 팔린 도서', comment: '-- 20. 주문테이블에서 팔린도서의 전체평균보다 더 비싼 책들의 책 이름 책 번호 팔린 가격 검색', explanation: '부속질의로 Orders 전체의 AVG(saleprice)를 구해 각 주문 가격과 비교하고, Book을 연결해 책 이름을 가져옵니다.', caution: 'bookid는 두 테이블에 모두 있으므로 b.bookid처럼 구분합니다. “더 비싼”은 >이며, >=를 쓰면 평균과 같은 값도 포함됩니다.' },
  { group: '부속질의 문제', label: '출판사 평균보다 비싼 도서', comment: '-- 21. 출판사별로 출판사의 평균 도서가격보다 비싼 도서제목을 검색', explanation: '바깥 질의가 도서 한 권씩을 확인하고, 안쪽 질의가 그 도서와 같은 출판사의 평균 가격을 구해 비교하는 상관 부속질의입니다.', caution: '같은 Book 테이블을 바깥과 안쪽에서 사용하므로 b1과 b2로 구분하는 것이 좋습니다. b1.publisher = b2.publisher 조건이 빠지면 출판사별 평균이 아니라 전체 평균과 비교합니다.' },
  ...subqueryLessons.map(lesson => ({ group: '중첩 부속질의 연습', label: lesson.title, comment: `-- ${lesson.question}`, explanation: lesson.hint, caution: lesson.caution })),
]

const exerciseGroups: Exercise['group'][] = ['자유 연습', 'JOIN 문제', '외부 조인 문제', '부속질의 문제', '중첩 부속질의 연습']

const modelAnswers = [
  '',
  `select sum(saleprice)
from customer c, orders o
where c.custid = o.custid
  and name = '박지성';`,
  `select count(*), max(saleprice) - min(saleprice)
from customer c, orders o
where c.custid = o.custid
  and name = '김연아';`,
  `select count(distinct publisher)
from customer c, orders o, book b
where c.custid = o.custid
  and o.bookid = b.bookid
  and name = '박지성';`,
  `select bookname, price, saleprice, price - saleprice
from customer c, orders o, book b
where c.custid = o.custid
  and o.bookid = b.bookid
  and name = '박지성';`,
  `select bookname, publisher
from customer c, orders o, book b
where c.custid = o.custid
  and o.bookid = b.bookid
  and name = '김연아';`,
  `select name, bookname
from customer c, orders o, book b
where c.custid = o.custid
  and o.bookid = b.bookid;`,
  `select name, avg(saleprice), sum(saleprice)
from customer c, orders o
where c.custid = o.custid
group by name;`,
  `select distinct name, address
from customer c, orders o
where c.custid = o.custid
  and address like '%영국%';`,
  `select name, bookname
from customer c, orders o, book b
where c.custid = o.custid
  and o.bookid = b.bookid
  and saleprice >= 10000;`,
  `select bookname, sum(saleprice), avg(saleprice)
from book b, orders o
where b.bookid = o.bookid
group by bookname;`,
  `select name, saleprice
from customer c, orders o
where c.custid = o.custid
order by saleprice desc;`,
  `select name, sum(saleprice)
from customer c, orders o
where c.custid = o.custid
group by name
order by sum(saleprice) desc;`,
  `select name, bookname, b.bookid, publisher, saleprice
from customer c, orders o, book b
where c.custid = o.custid
  and o.bookid = b.bookid
  and name like '박%'
order by saleprice desc;`,
  `select publisher, sum(saleprice), avg(saleprice)
from book b, orders o
where b.bookid = o.bookid
group by publisher
order by avg(saleprice) desc;`,
  `select c.name, o.saleprice
from customer c
left join orders o
  on c.custid = o.custid
order by c.custid;`,
  `select c.name
from customer c
left join orders o
  on c.custid = o.custid
where o.orderid is null;`,
  `select c.name, coalesce(sum(o.saleprice), 0) as total
from customer c
left join orders o
  on c.custid = o.custid
group by c.custid, c.name
order by c.custid;`,
  `select bookname, publisher, price
from book
where price = (select max(price) from book);`,
  `select sum(saleprice)
from orders
where custid in (
  select custid
  from customer
  where address like '%대한민국%'
);`,
  `select bookname, b.bookid, saleprice
from book b, orders o
where b.bookid = o.bookid
  and saleprice > (select avg(saleprice) from orders);`,
  `select bookname
from book b1
where b1.price > (
  select avg(b2.price)
  from book b2
  where b1.publisher = b2.publisher
);`,
]

modelAnswers.push(...subqueryLessons.map(lesson => lesson.sql))

const otherMissions = missions.filter(item => item.id >= 12 && item.id <= 26 && item.id !== 15)
const otherExercises: Exercise[] = [{ group: '자유 연습', label: '자유롭게 SQL 작성하기' }, ...otherMissions.map((item, index) => ({
  group: item.phase, label: item.title,
  comment: `-- ${index + 1}. ${item.task}\n${item.conditions.map(condition => `-- ${condition}`).join('\n')}`,
  explanation: answers[item.id].explanation,
  caution: item.check,
}))]
otherExercises.push(
  { group: '외부 조인', label: '예약하지 않은 회원 찾기', comment: '-- 15. LEFT JOIN을 사용해 예약이 없는 회원의 learner_id와 name을 검색하시오.', explanation: 'Learner를 왼쪽에 두고 Booking을 연결한 뒤 b.booking_id IS NULL로 예약 없는 회원을 찾습니다.', caution: 'NULL은 =가 아닌 IS NULL로 비교합니다. 회원번호로 정렬하세요.' },
  { group: '외부 조인', label: '예약이 없는 회원도 결제 합계에 포함', comment: '-- 16. 모든 회원의 learner_id, name, 결제 합계를 검색하시오. 예약이 없는 회원의 합계는 0으로 표시하고 회원번호순으로 정렬하시오.', explanation: 'LEFT JOIN 후 회원번호와 이름으로 그룹화하고 COALESCE(SUM(b.paid_fee), 0)를 사용합니다.', caution: 'INNER JOIN을 쓰면 예약이 없는 회원이 제외됩니다. 정가 fee가 아니라 실제 결제액 paid_fee를 합산합니다.' },
  { group: '외부 조인', label: 'RIGHT JOIN으로 모든 회원 보존', comment: '-- 17. Booking RIGHT JOIN Learner를 사용해 모든 회원의 learner_id, name, booking_id를 검색하시오. 회원번호와 예약번호순으로 정렬하시오.', explanation: '오른쪽 Learner의 회원을 모두 보존합니다. Learner LEFT JOIN Booking과 같은 결과를 얻습니다.', caution: 'RIGHT JOIN 뒤에 전부 남길 Learner를 배치합니다. 예약하지 않은 윤도현의 booking_id는 NULL입니다.' },
)
const otherAnswers = ['', ...otherMissions.map(item => answers[item.id].sql),
  'select l.learner_id, l.name\nfrom Learner l left join Booking b on l.learner_id = b.learner_id\nwhere b.booking_id is null\norder by l.learner_id;',
  'select l.learner_id, l.name, coalesce(sum(b.paid_fee), 0) as total_paid\nfrom Learner l left join Booking b on l.learner_id = b.learner_id\ngroup by l.learner_id, l.name\norder by l.learner_id;',
  'select l.learner_id, l.name, b.booking_id\nfrom Booking b right join Learner l on b.learner_id = l.learner_id\norder by l.learner_id, b.booking_id;',
]
otherExercises.push(...workshopSubqueryLessons.map(lesson => ({ group: '중첩 부속질의 연습', label: lesson.title, comment: `-- ${lesson.question}`, explanation: lesson.hint, caution: lesson.caution })))
otherAnswers.push(...workshopSubqueryLessons.map(lesson => lesson.sql))
const starterSql = (item: Exercise) => item.comment ? `${item.comment}\n\n` : ''

export default function SqlRunner(props: { onOpenTables?: () => void; initialSql?: string }) {
  const [mode, setMode] = useState<'madang' | 'other' | 'create'>('madang')
  if (props.initialSql !== undefined) return <QueryRunner {...props}/>
  return <>
    <div className="sql-dataset-picker" role="group" aria-label="SQL 연습 예제 선택">
      {([{ id: 'madang', title: '마당서점', detail: '고객 · 도서 · 주문', count: exercises.length - 1, icon: 'DB' }, { id: 'other', title: '공방 예약', detail: '회원 · 체험 · 예약', count: otherExercises.length - 1, icon: 'DB' }, { id: 'create', title: '테이블 정의·데이터 추가', detail: '4주차 PPT · CREATE · ALTER · DROP · INSERT · RENAME', count: createExercises.length, icon: 'SQL' }] as const).map(item => <button key={item.id} type="button" aria-pressed={mode === item.id} onClick={() => setMode(item.id)}><span className="sql-dataset-icon">{item.icon}</span><span className="sql-dataset-copy"><strong>{item.title}</strong><small>{item.detail}</small></span><span className="sql-dataset-count">{item.count}문제<span>{mode === item.id ? '선택됨 ✓' : '선택하기 →'}</span></span></button>)}
    </div>
    {(['madang', 'other'] as const).map(dataset => <div key={dataset} hidden={mode !== dataset}><QueryRunner {...props} dataset={dataset}/></div>)}
    {mode === 'create' ? <CreateTablePractice/> : null}
  </>
}

function seedDatabase(db: Database) {
  db.run(`
    CREATE TABLE Book (
      bookid INTEGER PRIMARY KEY,
      bookname TEXT,
      publisher TEXT,
      price INTEGER
    );
    CREATE TABLE Customer (
      custid INTEGER PRIMARY KEY,
      name TEXT,
      address TEXT,
      phone TEXT
    );
    CREATE TABLE Orders (
      orderid INTEGER PRIMARY KEY,
      custid INTEGER,
      bookid INTEGER,
      saleprice INTEGER,
      orderdate TEXT,
      FOREIGN KEY (custid) REFERENCES Customer(custid),
      FOREIGN KEY (bookid) REFERENCES Book(bookid)
    );
  `)

  const bookInsert = db.prepare('INSERT INTO Book VALUES (?, ?, ?, ?)')
  books.forEach(book => bookInsert.run([book.bookid, book.bookname, book.publisher, book.price]))
  bookInsert.free()

  const customerInsert = db.prepare('INSERT INTO Customer VALUES (?, ?, ?, ?)')
  customers.forEach(customer => customerInsert.run([customer.custid, customer.name, customer.address, customer.phone]))
  customerInsert.free()

  const orderInsert = db.prepare('INSERT INTO Orders VALUES (?, ?, ?, ?, ?)')
  orders.forEach(order => orderInsert.run([order.orderid, order.custid, order.bookid, order.saleprice, order.orderdate]))
  orderInsert.free()
  db.run('PRAGMA query_only = ON')
}

function selectStatement(sql: string) {
  const withoutComments = sql
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/--.*$/gm, ' ')
    .trim()
  const statement = withoutComments.replace(/;+\s*$/, '').trim()
  if (!statement) throw new Error('실행할 SQL을 입력해주세요.')
  if (statement.includes(';')) throw new Error('한 번에 SELECT 문 하나만 실행할 수 있습니다.')
  if (!/^(select|with)\b/i.test(statement)) throw new Error('연습 데이터 보호를 위해 SELECT 조회문만 실행할 수 있습니다.')
  return statement
}

function QueryRunner({ initialSql, dataset = 'madang' }: { onOpenTables?: () => void; initialSql?: string; dataset?: 'madang' | 'other' }) {
  const activeExercises = dataset === 'madang' ? exercises : otherExercises
  const activeAnswers = dataset === 'madang' ? modelAnswers : otherAnswers
  const groups = dataset === 'madang' ? exerciseGroups : [...new Set(otherExercises.map(item => item.group))]
  const sourceTables = dataset === 'madang' ? sampleTables.map(item => ({ name: item.name, data: item.result })) : missionTables
  const databaseRef = useRef<Database | null>(null)
  const releaseTab = useRef(false)
  const [exercise, setExercise] = useState(initialSql === undefined ? 1 : 0)
  const [sql, setSql] = useState(() => initialSql ?? starterSql(activeExercises[1]))
  const drafts = useRef<Record<number, { sql: string; result: SqlResult | null; error: string; trace: SourceTrace | null }>>({})
  const [trace, setTrace] = useState<SourceTrace | null>(null)
  const [traceVersion, setTraceVersion] = useState(0)
  const [result, setResult] = useState<SqlResult | null>(null)
  const [error, setError] = useState('')
  const [running, setRunning] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [answerConfirmOpen, setAnswerConfirmOpen] = useState(false)
  const [showHint, setShowHint] = useState(false)

  async function getDatabase() {
    if (databaseRef.current) return databaseRef.current
    const { default: initSqlJs } = await import('sql.js')
    const SQL = await initSqlJs({ locateFile: () => sqlWasmUrl })
    const database = new SQL.Database()
    if (dataset === 'madang') seedDatabase(database)
    else {
      for (const table of missionTables) {
        database.run(`create table ${table.name} (${table.data.columns.map((column, index) => `${column} ${column.endsWith('_id') || ['fee', 'duration', 'paid_fee'].includes(column) ? 'integer' : 'text'}${index === 0 ? ' primary key' : ''}`).join(', ')});`)
        const insert = database.prepare(`insert into ${table.name} values (${table.data.columns.map(() => '?').join(', ')})`)
        for (const row of table.data.rows) insert.run(row)
        insert.free()
      }
      database.run('PRAGMA query_only = ON')
    }
    databaseRef.current = database
    return database
  }

  async function runSql() {
    setRunning(true)
    setError('')
    setShowAnswer(false)
    setAnswerConfirmOpen(false)
    try {
      const statement = selectStatement(sql)
      const database = await getDatabase()
      const output = database.exec(statement)[0]
      setTrace(buildSourceTrace(database, statement, sourceTables))
      setTraceVersion(value => value + 1)
      setResult(output ? {
        columns: output.columns,
        rows: output.values.map(row => row.map(value => value instanceof Uint8Array ? `[BLOB ${value.byteLength} bytes]` : value)),
      } : { columns: [], rows: [] })
    } catch (caught) {
      setTrace(null)
      setResult(null)
      setError(caught instanceof Error ? caught.message : 'SQL을 실행하지 못했습니다.')
    } finally {
      setRunning(false)
    }
  }

  function chooseExercise(index: number) {
    if (running || index < 0 || index >= activeExercises.length) return
    drafts.current[exercise] = { sql, result, error, trace }
    const draft = drafts.current[index]
    setExercise(index)
    setSql(draft?.sql ?? (index === 0 && initialSql ? initialSql : starterSql(activeExercises[index])))
    setResult(draft?.result ?? null)
    setError(draft?.error ?? '')
    setTrace(draft?.trace ?? null)
    setTraceVersion(value => value + 1)
    setShowAnswer(false)
    setAnswerConfirmOpen(false)
    setShowHint(false)
  }

  return <div className="sql-runner sql-practice-runner">
    <div className="sql-runner-header">
      <div><h3>직접 쿼리 작성하기</h3><p>문제를 읽고 SQL을 작성한 뒤 실행 결과를 확인하세요.</p></div>
      <div className="sql-runner-tools"><a href={`#sql-source-tables-${dataset}`}>원본 테이블 ↓</a></div>
    </div>
    {!initialSql ? <label className="sql-runner-label">연습 문제
      <select value={exercise} disabled={running} onChange={event => chooseExercise(Number(event.target.value))}>
        {groups.map(group => <optgroup key={group} label={group}>
          {activeExercises.map((item, index) => item.group === group
            ? <option key={item.label} value={index}>{index === 0 ? item.label : `${index}. ${item.label}`}</option>
            : null)}
        </optgroup>)}
      </select>
    </label> : null}
    {initialSql === undefined && /부속질의/.test(activeExercises[exercise].group) ? <details className="sql-subquery-help"><summary>서브쿼리가 어렵다면? {dataset === 'madang' ? '마당서점' : '공방 예약'} 기초부터 3중 중첩까지 따라가기</summary><SubqueryWalkthrough lessons={dataset === 'madang' ? subqueryLessons : workshopSubqueryLessons}/></details> : null}
    {initialSql === undefined ? <div className="sql-question-overview"><div className="sql-question-meta"><span>{activeExercises[exercise].group}</span><span aria-live="polite">{exercise === 0 ? '자유 연습' : `${String(exercise).padStart(2, '0')} / ${activeExercises.length - 1}`}</span></div><h4>{activeExercises[exercise].label}</h4><p>{activeExercises[exercise].comment?.replace(/^--\s*/gm, '') ?? '원본 테이블을 참고해 원하는 조회문을 작성해 보세요.'}</p><div className="sql-question-pagination" aria-label="문제 이동"><button type="button" disabled={running || exercise <= 1} onClick={() => chooseExercise(exercise - 1)}>← 이전 문제</button><span>이동해도 작성한 SQL은 유지됩니다.</span><button type="button" disabled={running || exercise >= activeExercises.length - 1} onClick={() => chooseExercise(exercise + 1)}>{exercise === 0 ? '첫 문제 풀기' : '다음 문제 →'}</button></div></div> : null}
    <div className="sql-editor-result-layout"><div className="sql-editor-pane">
    <label className="sql-runner-label" htmlFor={`sql-runner-input-${dataset}`}>SQL 입력</label>
    <textarea
      id={`sql-runner-input-${dataset}`}
      className="sql-runner-input"
      value={sql}
      spellCheck={false}
      aria-describedby={`sql-keyboard-help-${dataset}`}
      onChange={event => setSql(event.target.value)}
      onKeyDown={event => {
        if (event.key === 'Escape') { releaseTab.current = true; return }
        if (event.key === 'Tab') {
          if (releaseTab.current) { releaseTab.current = false; return }
          event.preventDefault()
          const input = event.currentTarget
          const next = indentSql(input.value, input.selectionStart, input.selectionEnd, event.shiftKey)
          setSql(next.value)
          requestAnimationFrame(() => { if (input.isConnected) input.setSelectionRange(next.start, next.end) })
          return
        }
        releaseTab.current = false
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
          event.preventDefault()
          void runSql()
        }
      }}
    />
    <p className="sql-keyboard-help" id={`sql-keyboard-help-${dataset}`}>Tab: 두 칸 들여쓰기 · Shift+Tab: 들여쓰기 해제 · Esc 후 Tab: 입력창 밖으로 이동</p>
    <div className="sql-runner-actions">
      <button type="button" className="quiz-primary" disabled={running} onClick={() => void runSql()}>{running ? '실행 중…' : 'SQL 실행'}</button>
      <button type="button" className="visual-button" disabled={running} onClick={() => { delete drafts.current[exercise]; setSql(initialSql ?? starterSql(activeExercises[exercise])); setResult(null); setTrace(null); setError(''); setShowHint(false); setShowAnswer(false); setAnswerConfirmOpen(false) }}>입력 초기화</button>
      {exercise > 0 ? <button type="button" className="visual-button" aria-expanded={showHint} onClick={() => setShowHint(value => !value)}>{showHint ? '힌트 숨기기' : '힌트 보기'}</button> : null}
      {exercise > 0 ? <button type="button" className="visual-button sql-answer-button" aria-expanded={showAnswer} onClick={() => showAnswer ? setShowAnswer(false) : setAnswerConfirmOpen(true)}>{showAnswer ? '모범답안 숨기기' : '모범답안 보기'}</button> : null}
      <span>Ctrl + Enter로 실행</span>
    </div>
    </div><section className="sql-result-pane" aria-label="SQL 실행 결과"><h4>실행 결과</h4>
    {error ? <div className="sql-runner-error" role="alert"><strong>실행 오류</strong><p>{error}</p></div> : null}
    {result ? result.columns.length
      ? <SqlTable data={result} caption="SQL 실행 결과" />
      : <p className="sql-runner-empty">조회 결과가 없습니다.</p>
      : <p className="sql-runner-empty">SQL을 작성하고 실행하면 여기에 결과가 표시됩니다.</p>}
    </section></div>
    {exercise > 0 && showHint ? <div className="sql-after-run-guide" role="note"><div className="sql-exercise-guide"><div><strong>풀이 방향</strong><p>{activeExercises[exercise].explanation}</p></div></div><div className="sql-exercise-caution"><strong>주의할 점</strong><p>{activeExercises[exercise].caution}</p></div></div> : null}
    {exercise > 0 && showAnswer ? <div className="sql-model-answer"><div className="content-enter"><strong>모범답안</strong><pre><code>{activeAnswers[exercise]}</code></pre><p>표현 방식은 여러 가지가 있을 수 있습니다. 실행 결과와 조인 조건이 같다면 다른 SQL도 정답이 될 수 있습니다.</p></div></div> : null}
    <p className="visual-caption">조회 전용 SQLite 실습입니다. MySQL 전용 함수와 엄격한 GROUP BY 동작은 실제 MySQL과 다를 수 있습니다.</p>
    <section id={`sql-source-tables-${dataset}`} className="sql-tables-page sql-practice-sources"><h3>원본 테이블 · {dataset === 'madang' ? '마당서점' : '공방 예약'}</h3><p className="visual-caption">{dataset === 'madang' ? 'Customer.custid ↔ Orders.custid · Orders.bookid ↔ Book.bookid / price: 정가, saleprice: 판매가격' : 'Learner.learner_id ↔ Booking.learner_id · Booking.workshop_id ↔ Workshop.workshop_id / fee: 정가, paid_fee: 결제액'}</p><SqlSourceTrace key={traceVersion} sources={sourceTables} trace={trace}/></section>
    {answerConfirmOpen ? <div className="sql-answer-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setAnswerConfirmOpen(false) }}><div className="sql-answer-modal" role="dialog" aria-modal="true" aria-labelledby="sql-answer-modal-title"><span>답안을 보기 전에</span><h4 id="sql-answer-modal-title">모범답안을 확인할까요?</h4><p>답안을 보면 SQL을 스스로 완성하는 연습 효과가 줄어들 수 있습니다. 직접 풀어보고 싶다면 취소한 뒤 먼저 작성해 보세요.</p><div><button type="button" className="visual-button" onClick={() => setAnswerConfirmOpen(false)}>계속 풀기</button><button type="button" className="quiz-primary" autoFocus onClick={() => { setShowAnswer(true); setAnswerConfirmOpen(false) }}>답안 확인하기</button></div></div></div> : null}
  </div>
}
