import { useRef, useState } from 'react'
import type { Database } from 'sql.js'
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url'
import { books, customers, orders } from '../data/sqlLessonData'
import type { SqlResult } from '../data/sqlLessonData'
import { SqlTable } from './SqlLessonParts'
import SchemaWorkbench from './SchemaWorkbench'

type Exercise = {
  group: '자유 연습' | 'JOIN 문제' | '부속질의 문제'
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
  { group: '부속질의 문제', label: '가장 비싼 책의 정보', comment: '-- 15. 도서테이블에서 가장비싼 책의 도서명과 출판사명과 책 가격 검색', explanation: '안쪽 질의에서 MAX(price)를 구하고, 바깥 질의에서 price가 그 값과 같은 책의 정보를 출력합니다.', caution: 'MAX(price)와 bookname을 집계 없이 한 SELECT에 함께 쓰면 도서명이 최고가 책과 정확히 대응한다고 보장할 수 없습니다.' },
  { group: '부속질의 문제', label: '대한민국 고객에게 판매한 총 판매액', comment: '-- 16. 대한민국에 거주하는 고객에 판매한 도서의 총 판매액', explanation: '부속질의에서 대한민국 고객의 custid 목록을 찾고, 바깥 Orders에서 해당 custid의 saleprice를 합산합니다.', caution: 'Customer와 Orders를 함께 FROM에 쓰는 방식이라면 조인 조건을 반드시 써야 합니다. 부속질의에서는 IN 뒤에 여러 custid가 올 수 있습니다.' },
  { group: '부속질의 문제', label: '전체 평균보다 비싸게 팔린 도서', comment: '-- 17. 주문테이블에서 팔린도서의 전체평균보다 더 비싼 책들의 책 이름 책 번호 팔린 가격 검색', explanation: '부속질의로 Orders 전체의 AVG(saleprice)를 구해 각 주문 가격과 비교하고, Book을 연결해 책 이름을 가져옵니다.', caution: 'bookid는 두 테이블에 모두 있으므로 b.bookid처럼 구분합니다. “더 비싼”은 >이며, >=를 쓰면 평균과 같은 값도 포함됩니다.' },
  { group: '부속질의 문제', label: '출판사 평균보다 비싼 도서', comment: '-- 18. 출판사별로 출판사의 평균 도서가격보다 비싼 도서제목을 검색', explanation: '바깥 질의가 도서 한 권씩을 확인하고, 안쪽 질의가 그 도서와 같은 출판사의 평균 가격을 구해 비교하는 상관 부속질의입니다.', caution: '같은 Book 테이블을 바깥과 안쪽에서 사용하므로 b1과 b2로 구분하는 것이 좋습니다. b1.publisher = b2.publisher 조건이 빠지면 출판사별 평균이 아니라 전체 평균과 비교합니다.' },
]

const exerciseGroups: Exercise['group'][] = ['자유 연습', 'JOIN 문제', '부속질의 문제']

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

const starterSql = (index: number) => index === 0
  ? 'select *\nfrom book;'
  : `${exercises[index].comment}\n\nselect `

export default function SqlRunner(props: { onOpenTables?: () => void; initialSql?: string }) {
  const [mode, setMode] = useState<'schema' | 'query'>('schema')
  if (props.initialSql !== undefined) return <QueryRunner {...props}/>
  return <>
    <div className="sql-workspace-filter">
      <label htmlFor="sql-workspace-mode">실습 범위</label>
      <select id="sql-workspace-mode" value={mode} aria-describedby="sql-workspace-description" onChange={event => setMode(event.target.value === 'query' ? 'query' : 'schema')}>
        <option value="schema">정의어·데이터 변경</option>
        <option value="query">조회·JOIN·부속질의</option>
      </select>
      <p id="sql-workspace-description">{mode === 'schema' ? 'CREATE · ALTER · DROP · INSERT · UPDATE · DELETE' : '마당서점 데이터로 자유 연습 · 18개 문제'}</p>
    </div>
    <div className="content-enter" key={mode}>{mode === 'schema' ? <SchemaWorkbench/> : <QueryRunner {...props}/>}</div>
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

function QueryRunner({ onOpenTables, initialSql }: { onOpenTables?: () => void; initialSql?: string }) {
  const databaseRef = useRef<Database | null>(null)
  const [exercise, setExercise] = useState(0)
  const [sql, setSql] = useState(() => initialSql ?? starterSql(0))
  const [result, setResult] = useState<SqlResult | null>(null)
  const [error, setError] = useState('')
  const [running, setRunning] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [answerConfirmOpen, setAnswerConfirmOpen] = useState(false)

  async function getDatabase() {
    if (databaseRef.current) return databaseRef.current
    const { default: initSqlJs } = await import('sql.js')
    const SQL = await initSqlJs({ locateFile: () => sqlWasmUrl })
    const database = new SQL.Database()
    seedDatabase(database)
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
      setResult(output ? {
        columns: output.columns,
        rows: output.values.map(row => row.map(value => value instanceof Uint8Array ? `[BLOB ${value.byteLength} bytes]` : value)),
      } : { columns: [], rows: [] })
    } catch (caught) {
      setResult(null)
      setError(caught instanceof Error ? caught.message : 'SQL을 실행하지 못했습니다.')
    } finally {
      setRunning(false)
    }
  }

  function chooseExercise(index: number) {
    setExercise(index)
    setSql(index === 0 && initialSql ? initialSql : starterSql(index))
    setResult(null)
    setError('')
    setShowAnswer(false)
    setAnswerConfirmOpen(false)
  }

  return <div className="sql-runner">
    <div className="sql-runner-header">
      <div><h3>SQL 직접 실행</h3><p>JOIN·부속질의 18문제와 자유 SQL을 마당서점 데이터에 직접 실행합니다.</p></div>
      <div className="sql-runner-tools"><span>브라우저 SQL 엔진</span>{onOpenTables ? <button type="button" onClick={onOpenTables}>원본 테이블 보기</button> : null}</div>
    </div>
    {!initialSql ? <label className="sql-runner-label">연습 문제
      <select value={exercise} onChange={event => chooseExercise(Number(event.target.value))}>
        {exerciseGroups.map(group => <optgroup key={group} label={group}>
          {exercises.map((item, index) => item.group === group
            ? <option key={item.label} value={index}>{index === 0 ? item.label : `${index}. ${item.label}`}</option>
            : null)}
        </optgroup>)}
      </select>
    </label> : null}
    <label className="sql-runner-label" htmlFor="sql-runner-input">SQL 입력</label>
    <textarea
      id="sql-runner-input"
      className="sql-runner-input"
      value={sql}
      spellCheck={false}
      onChange={event => setSql(event.target.value)}
      onKeyDown={event => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
          event.preventDefault()
          void runSql()
        }
      }}
    />
    <div className="sql-runner-actions">
      <button type="button" className="quiz-primary" disabled={running} onClick={() => void runSql()}>{running ? '실행 중…' : 'SQL 실행'}</button>
      <button type="button" className="visual-button" onClick={() => chooseExercise(exercise)}>입력 초기화</button>
      {exercise > 0 ? <button type="button" className="visual-button sql-answer-button" aria-expanded={showAnswer} onClick={() => showAnswer ? setShowAnswer(false) : setAnswerConfirmOpen(true)}>{showAnswer ? '모범답안 숨기기' : '모범답안 보기'}</button> : null}
      <span>Ctrl + Enter로 실행</span>
    </div>
    {error ? <div className="sql-runner-error" role="alert"><strong>실행 오류</strong><p>{error}</p></div> : null}
    {result ? result.columns.length
      ? <SqlTable data={result} caption="SQL 실행 결과" />
      : <p className="sql-runner-empty">조회 결과가 없습니다.</p>
      : <p className="sql-runner-empty">SQL을 작성하고 실행하면 여기에 결과가 표시됩니다.</p>}
    {exercise > 0 && (result || error) ? <div className="sql-after-run-guide" role="note"><div className="sql-exercise-guide"><div><strong>풀이 방향</strong><p>{exercises[exercise].explanation}</p></div></div><div className="sql-exercise-caution"><strong>주의할 점</strong><p>{exercises[exercise].caution}</p></div></div> : null}
    {exercise > 0 && showAnswer ? <div className="sql-model-answer"><div className="content-enter"><strong>모범답안</strong><pre><code>{modelAnswers[exercise]}</code></pre><p>표현 방식은 여러 가지가 있을 수 있습니다. 실행 결과와 조인 조건이 같다면 다른 SQL도 정답이 될 수 있습니다.</p></div></div> : null}
    <p className="visual-caption">Book 10행 · Customer 5행 · Orders 10행이 들어 있는 격리된 SQLite 엔진입니다. SELECT와 기본 JOIN·집계·부속질의 연습에 적합하며, MySQL 전용 함수와 엄격한 GROUP BY 동작은 실제 MySQL과 다를 수 있습니다.</p>
    {answerConfirmOpen ? <div className="sql-answer-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setAnswerConfirmOpen(false) }}><div className="sql-answer-modal" role="dialog" aria-modal="true" aria-labelledby="sql-answer-modal-title"><span>답안을 보기 전에</span><h4 id="sql-answer-modal-title">모범답안을 확인할까요?</h4><p>답안을 보면 SQL을 스스로 완성하는 연습 효과가 줄어들 수 있습니다. 직접 풀어보고 싶다면 취소한 뒤 먼저 작성해 보세요.</p><div><button type="button" className="visual-button" onClick={() => setAnswerConfirmOpen(false)}>계속 풀기</button><button type="button" className="quiz-primary" autoFocus onClick={() => { setShowAnswer(true); setAnswerConfirmOpen(false) }}>답안 확인하기</button></div></div></div> : null}
  </div>
}
