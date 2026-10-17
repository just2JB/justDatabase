import { advancedExamples } from '../sql/data/sqlAdvancedData'
import { books, customers, ddlExamples, orders, queryExamples, sampleTables } from '../sql/data/sqlLessonData'
import type { SqlResult } from '../sql/data/sqlLessonData'

export type DictionaryGroup = '정의어' | '검색·조건' | '정렬·집계' | '조인·집합' | '부속질의' | '데이터 변경' | '제어어'
export type TraceTable = { name: string; data: SqlResult }
export type SqlTrace = { title: string; detail: string; tables: TraceTable[]; schema?: SqlResult }
export type DictionaryEntry = { id: string; keyword: string; title: string; group: DictionaryGroup; sql: string; syntax: string; explanation: string; query?: number; advanced?: number; ddl?: number; control?: 'GRANT' | 'REVOKE'; mutation?: 'INSERT' | 'UPDATE' | 'DELETE'; correlated?: boolean }
export const dictionaryGroups: DictionaryGroup[] = ['정의어', '검색·조건', '정렬·집계', '조인·집합', '부속질의', '데이터 변경', '제어어']
const keywords = ['SELECT', 'SELECT *', 'DISTINCT', 'WHERE', 'BETWEEN', 'IN', 'LIKE', 'LIKE %', 'LIKE _', 'AND', 'OR', 'ORDER BY ASC', 'ORDER BY', 'ORDER BY DESC', 'SUM · AS', 'WHERE · SUM', 'SUM · AVG · MIN · MAX', 'COUNT', 'GROUP BY', 'HAVING', 'INNER JOIN', 'JOIN · ORDER BY', 'JOIN · AS', 'JOIN · GROUP BY', '다중 JOIN', 'JOIN · WHERE', 'LEFT JOIN', '스칼라 부속질의', 'IN 부속질의', '중첩 부속질의', '상관 부속질의', 'UNION', 'EXISTS']
function queryGroup(group: string): DictionaryGroup { return group === '부속질의' ? '부속질의' : group === '조인' || group === '집합·존재' ? '조인·집합' : ['정렬', '집계', '그룹'].includes(group) ? '정렬·집계' : '검색·조건' }
const basicSyntax: Record<DictionaryGroup, string> = {
  '정의어': 'CREATE TABLE 테이블명 (열이름 자료형 [제약조건], ...);\nALTER TABLE 테이블명 변경내용;\nDROP TABLE 테이블명;',
  '검색·조건': 'SELECT [DISTINCT] 열목록\nFROM 테이블명\n[WHERE 조건];',
  '정렬·집계': 'SELECT 그룹열, 집계함수(열)\nFROM 테이블명\n[WHERE 행조건]\n[GROUP BY 그룹열]\n[HAVING 그룹조건]\n[ORDER BY 열 ASC | DESC];',
  '조인·집합': 'SELECT 열목록 FROM 테이블A a\n[INNER | LEFT] JOIN 테이블B b ON 연결조건;\n\nSELECT 열목록 FROM 테이블A\nUNION [ALL]\nSELECT 호환되는열목록 FROM 테이블B;',
  '부속질의': 'SELECT 열목록 FROM 외부테이블\nWHERE 열 비교연산자 (SELECT 단일값 FROM 내부테이블);\n-- 다중 행은 IN, 존재 여부는 EXISTS 등으로 비교',
  '데이터 변경': 'INSERT INTO 테이블명 (열목록) VALUES (값목록);\nUPDATE 테이블명 SET 열 = 값 WHERE 조건;\nDELETE FROM 테이블명 WHERE 조건;',
  '제어어': "GRANT 권한 ON DB명.테이블명 TO '사용자'@'호스트';\nREVOKE 권한 ON DB명.테이블명 FROM '사용자'@'호스트';",
}
function definitionSyntax(number: number) {
  if (number === 37) return 'ALTER TABLE 테이블명 ADD 열이름 자료형;'
  if (number === 38 || number === 40) return 'ALTER TABLE 테이블명 MODIFY 열이름 새자료형 [제약조건];'
  if (number === 39) return 'ALTER TABLE 테이블명 DROP COLUMN 열이름;'
  if (number === 41) return 'ALTER TABLE 테이블명 ADD PRIMARY KEY (열목록);'
  if (number >= 42) return 'DROP TABLE 테이블명;'
  return 'CREATE TABLE 테이블명 (\n  열이름 자료형 [제약조건],\n  [PRIMARY KEY (열목록)],\n  [FOREIGN KEY (열목록) REFERENCES 부모테이블(열목록)]\n);'
}
function querySyntax(number: number, fallback: DictionaryGroup) {
  const specific: Record<number, string> = {
    3: 'SELECT DISTINCT 열목록 FROM 테이블명;',
    5: 'SELECT 열목록 FROM 테이블명 WHERE 열 BETWEEN 하한 AND 상한;',
    6: 'SELECT 열목록 FROM 테이블명 WHERE 열 [NOT] IN (값1, 값2, ...);',
    7: "SELECT 열목록 FROM 테이블명 WHERE 열 LIKE '문자열패턴';",
    8: "SELECT 열목록 FROM 테이블명 WHERE 열 LIKE '%문자열%';\n-- %: 0개 이상의 문자",
    9: "SELECT 열목록 FROM 테이블명 WHERE 열 LIKE '_문자열%';\n-- _: 정확히 한 문자",
    10: 'SELECT 열목록 FROM 테이블명 WHERE 조건1 AND 조건2;',
    11: 'SELECT 열목록 FROM 테이블명 WHERE 조건1 OR 조건2;',
    12: 'SELECT 열목록 FROM 테이블명 ORDER BY 정렬열 ASC;',
    13: 'SELECT 열목록 FROM 테이블명 ORDER BY 첫기준 ASC, 둘째기준 ASC;',
    14: 'SELECT 열목록 FROM 테이블명 ORDER BY 첫기준 DESC, 둘째기준 ASC;',
    15: 'SELECT SUM(숫자열) AS 별칭 FROM 테이블명;',
    17: 'SELECT SUM(열), AVG(열), MIN(열), MAX(열) FROM 테이블명;',
    18: 'SELECT COUNT(*) FROM 테이블명;\n-- COUNT(*)는 행 수, COUNT(열)은 그 열이 NULL이 아닌 행 수',
    27: 'SELECT 열목록 FROM 왼쪽테이블 a\nLEFT JOIN 오른쪽테이블 b ON 연결조건;',
    33: 'SELECT 열목록 FROM 외부테이블 a\nWHERE EXISTS (SELECT 1 FROM 내부테이블 b WHERE 연결조건);',
  }
  return specific[number] ?? basicSyntax[fallback]
}
export const dictionaryEntries: DictionaryEntry[] = [
  ...ddlExamples.map(item => ({ id: `ddl-${item.number}`, keyword: item.code.startsWith('CREATE') ? 'CREATE TABLE' : item.code.startsWith('DROP') ? 'DROP TABLE' : item.code.includes('MODIFY') ? 'ALTER · MODIFY' : item.code.includes('PRIMARY KEY') ? 'ALTER · PRIMARY KEY' : item.code.includes('DROP COLUMN') ? 'ALTER · DROP COLUMN' : 'ALTER · ADD', title: item.title, group: '정의어' as const, sql: item.code, syntax: definitionSyntax(item.number), explanation: item.note, ddl: item.number })),
  { id: 'truncate', keyword: 'TRUNCATE', title: '테이블 구조를 남기고 전체 행 비우기', group: '정의어', sql: 'TRUNCATE TABLE NewBook;', syntax: 'TRUNCATE TABLE 테이블명;', explanation: 'WHERE 없이 전체 행을 제거합니다. DROP과 달리 테이블 구조는 남습니다.', ddl: 44 },
  ...queryExamples.map(item => ({ id: `query-${item.number}`, keyword: keywords[item.number - 1], title: item.title, group: queryGroup(item.group), sql: item.code, syntax: querySyntax(item.number, queryGroup(item.group)), explanation: item.explanation, query: item.number, correlated: item.number === 31 })),
  ...advancedExamples.map((item, index) => ({ id: `subquery-${index}`, keyword: ['스칼라 · AVG', '상관 부속질의', 'IN 부속질의', 'EXISTS 부속질의', 'SELECT 안의 부속질의', 'FROM · 인라인 뷰'][index], title: item.title, group: '부속질의' as const, sql: item.code, syntax: basicSyntax['부속질의'], explanation: item.explanation, advanced: index, correlated: index === 1 || index === 4 })),
  { id: 'null', keyword: 'IS NULL · IS NOT NULL', title: '연락처가 없는 고객 찾기', group: '검색·조건', sql: 'SELECT custid, name, phone FROM Customer\nWHERE phone IS NULL;', syntax: 'SELECT 열목록 FROM 테이블명 WHERE 열 IS [NOT] NULL;', explanation: 'NULL은 = NULL로 비교하지 않습니다. 박세리의 연락처가 NULL인 행을 찾습니다.' },
  { id: 'not-exists', keyword: 'NOT EXISTS', title: '주문하지 않은 고객', group: '부속질의', sql: 'SELECT c.name FROM Customer c\nWHERE NOT EXISTS (SELECT 1 FROM Orders o\n                  WHERE o.custid = c.custid);', syntax: 'SELECT 열목록 FROM 외부테이블 a\nWHERE NOT EXISTS (SELECT 1 FROM 내부테이블 b WHERE 연결조건);', explanation: '각 고객과 연결되는 주문이 한 행도 없으면 참입니다. 주문하지 않은 박세리를 찾습니다.' },
  { id: 'insert', keyword: 'INSERT', title: '새 도서 한 행 추가', group: '데이터 변경', sql: "INSERT INTO NewBook (bookid, bookname, publisher, price)\nVALUES (11, '데이터베이스 입문', '한빛', 18000);", syntax: basicSyntax['데이터 변경'], explanation: '열 순서에 맞춰 값을 넣습니다. bookid=11은 예시 원본에 없는 새 기본키입니다.', mutation: 'INSERT' },
  { id: 'update', keyword: 'UPDATE · SET', title: '대한미디어 도서의 가격 수정', group: '데이터 변경', sql: "UPDATE NewBook SET price = 25000\nWHERE publisher = '대한미디어';", syntax: basicSyntax['데이터 변경'], explanation: '조건에 맞는 도서번호 3·4의 가격만 바뀝니다. WHERE를 빼면 전체 행이 대상입니다.', mutation: 'UPDATE' },
  { id: 'delete', keyword: 'DELETE', title: '낮은 가격의 도서 행 삭제', group: '데이터 변경', sql: 'DELETE FROM NewBook\nWHERE price < 8000;', syntax: basicSyntax['데이터 변경'], explanation: '8,000원 미만인 1·6·9번 행을 삭제합니다. 테이블 구조는 유지됩니다.', mutation: 'DELETE' },
  ...(['GRANT', 'REVOKE'] as const).map(control => ({ id: control.toLowerCase(), keyword: control, title: control === 'GRANT' ? '조회 권한 부여' : '직접 부여한 조회 권한 회수', group: '제어어' as const, sql: `${control} SELECT ON madang.Book\n${control === 'GRANT' ? 'TO' : 'FROM'} 'analyst'@'localhost';`, syntax: basicSyntax['제어어'], explanation: 'MySQL의 사용자 계정은 사용자명과 호스트로 구분합니다. 대상 계정과 madang 데이터베이스가 이미 존재하는 예시입니다.', control })),
]
const result = (columns: string[], rows: SqlResult['rows']): SqlResult => ({ columns, rows })
const bookData = (items = books) => result(['bookid', 'bookname', 'publisher', 'price'], items.map(b => [b.bookid, b.bookname, b.publisher, b.price]))
const original = (sql: string): TraceTable[] => sampleTables.filter(table => new RegExp(`\\b${table.name}\\b`, 'i').test(sql)).map(table => ({ name: table.name, data: table.result }))
const trace = (title: string, detail: string, data: SqlResult, name = title): SqlTrace => ({ title, detail, tables: [{ name, data }] })

export function dictionaryTrace(entry: DictionaryEntry, outerIndex = 0): SqlTrace[] {
  if (entry.ddl) return definitionTrace(entry.ddl)
  if (entry.mutation) {
    const affected = entry.mutation === 'UPDATE' ? books.filter(b => b.publisher === '대한미디어') : entry.mutation === 'DELETE' ? books.filter(b => b.price < 8000) : [{ bookid: 11, bookname: '데이터베이스 입문', publisher: '한빛', price: 18000 }]
    const after = entry.mutation === 'INSERT' ? [...books, ...affected] : entry.mutation === 'UPDATE' ? books.map(b => b.publisher === '대한미디어' ? { ...b, price: 25000 } : b) : books.filter(b => b.price >= 8000)
    return [trace('실행 전', '변경 예제는 Book을 복사한 NewBook에서 각각 시작합니다. 원본 세 테이블에는 영향을 주지 않습니다.', bookData(), 'NewBook'), trace(entry.mutation === 'INSERT' ? '추가할 행' : 'WHERE 대상', `${affected.length}행이 이번 명령의 대상입니다.`, bookData(affected)), trace('실행 후', entry.explanation, bookData(after), 'NewBook')]
  }
  const output = entry.query ? queryExamples.find(q => q.number === entry.query)!.result() : entry.advanced !== undefined ? advancedExamples[entry.advanced].result : entry.id === 'not-exists' ? result(['name'], customers.filter(c => !orders.some(o => o.custid === c.custid)).map(c => [c.name])) : result(['custid', 'name', 'phone'], customers.filter(c => c.phone === null).map(c => [c.custid, c.name, c.phone]))
  const start: SqlTrace = { title: '원본 테이블', detail: '수업에서 사용한 마당서점 데이터입니다.', tables: original(entry.sql) }
  const finish = trace('최종 결과', entry.explanation, output)
  if (entry.query === 28) return [start, trace('내부 질의', 'SELECT MAX(price) FROM Book → 한 값 35,000을 구합니다.', result(['MAX(price)'], [[35000]])), trace('외부 조건', 'price = 35000인 행을 고릅니다.', bookData(books.filter(b => b.price === 35000))), finish]
  if (entry.query === 29) return [start, trace('내부 질의', '주문 행에서 custid를 얻습니다. IN에서는 같은 번호가 여러 번 나와도 포함 여부만 봅니다.', result(['custid'], orders.map(o => [o.custid]))), finish]
  if (entry.query === 30) {
    const ids = books.filter(b => b.publisher === '대한미디어').map(b => b.bookid)
    return [start, trace('가장 안쪽 질의', '대한미디어의 도서번호를 구합니다.', result(['bookid'], ids.map(id => [id]))), trace('중간 질의', '그 도서를 주문한 고객번호를 구합니다.', result(['custid'], orders.filter(o => ids.includes(o.bookid)).map(o => [o.custid]))), finish]
  }
  if (entry.query === 31) {
    const row = books[outerIndex % books.length], own = books.filter(b => b.publisher === row.publisher), avg = own.reduce((sum, b) => sum + b.price, 0) / own.length
    return [trace('외부 행 선택', `도서 ${row.bookid} · ${row.bookname}. 이 행의 publisher가 내부 질의에 전달됩니다.`, bookData([row])), trace('내부 조건 적용', `b2.publisher = '${row.publisher}'인 도서만 남깁니다.`, bookData(own)), trace('평균과 비교', `${row.price.toLocaleString()} > ${avg.toLocaleString()} → ${row.price > avg ? '참 · 결과에 포함' : '거짓 · 제외'}`, result(['외부 price', '같은 출판사 AVG', '조건'], [[row.price, avg, row.price > avg ? '참' : '거짓']])), finish]
  }
  if (entry.advanced === 0) return [start, trace('내부 집계', '전체 주문의 평균 판매가격은 11,800원입니다.', result(['AVG(saleprice)'], [[11800]])), finish]
  if (entry.advanced === 1) {
    const row = orders[outerIndex % orders.length], own = orders.filter(o => o.custid === row.custid), avg = own.reduce((sum, o) => sum + o.saleprice, 0) / own.length
    return [trace('외부 주문', `orderid=${row.orderid}의 custid=${row.custid}를 안쪽 질의에 전달합니다.`, result(['orderid', 'custid', 'saleprice'], [[row.orderid, row.custid, row.saleprice]])), trace('고객별 내부 질의', '같은 고객의 주문만 모읍니다.', result(['orderid', 'saleprice'], own.map(o => [o.orderid, o.saleprice]))), trace('평균과 비교', '각 외부 행마다 비교 기준이 달라질 수 있습니다.', result(['외부 saleprice', '고객 평균', '조건'], [[row.saleprice, avg, row.saleprice > avg ? '참' : '거짓']])), finish]
  }
  if (entry.advanced === 4) {
    const c = customers[outerIndex % customers.length], own = orders.filter(o => o.custid === c.custid), total = own.length ? own.reduce((sum, o) => sum + o.saleprice, 0) : null
    return [trace('외부 고객', `${c.name} · custid=${c.custid}`, result(['custid', 'name'], [[c.custid, c.name]])), trace('내부 집계 결과', '이 고객의 주문을 합산합니다. 주문이 없으면 SUM은 NULL입니다.', result(['SUM(saleprice)'], [[total]])), finish]
  }
  if (entry.advanced === 2 || entry.advanced === 3) {
    const domestic = customers.filter(c => c.address.startsWith('대한민국')), ids = domestic.map(c => c.custid), filtered = orders.filter(o => ids.includes(o.custid))
    return [start, trace(entry.advanced === 2 ? 'IN 내부 집합' : 'EXISTS 연결 조건', entry.advanced === 2 ? '국내 거주 고객번호 2·3·5를 구합니다.' : '각 주문의 고객번호와 일치하는 국내 고객 행이 있는지 검사합니다.', result(['custid', 'name'], domestic.map(c => [c.custid, c.name]))), trace('조건에 남은 주문', '고객번호 2 또는 3의 주문 5행입니다. 5번 고객은 주문이 없습니다.', result(['orderid', 'custid', 'saleprice'], filtered.map(o => [o.orderid, o.custid, o.saleprice]))), finish]
  }
  if (entry.advanced === 5) {
    const grouped = customers.flatMap(c => { const own = orders.filter(o => o.custid === c.custid); return own.length ? [[c.custid, own.reduce((sum, o) => sum + o.saleprice, 0)]] : [] })
    return [start, trace('FROM의 파생 테이블 t', '주문을 고객별로 묶어 임시 결과를 만듭니다. 별칭 t를 붙입니다.', result(['custid', 'total'], grouped)), finish]
  }
  if (entry.query === 20) {
    const filtered = orders.filter(o => o.saleprice >= 8000), grouped = customers.map(c => [c.custid, filtered.filter(o => o.custid === c.custid).length]).filter(row => row[1] > 0)
    return [start, trace('WHERE', 'saleprice >= 8000인 개별 행을 남깁니다.', result(['orderid', 'custid', 'saleprice'], filtered.map(o => [o.orderid, o.custid, o.saleprice]))), trace('GROUP BY', '고객별로 묶고 주문 건수를 셉니다.', result(['custid', '주문건수'], grouped)), trace('HAVING', '건수가 2 이상인 그룹만 결과에 남깁니다.', output)]
  }
  return [start, finish]
}

function definitionTrace(number: number): SqlTrace[] {
  const bookCols = [['bookid', 'INTEGER', 'PRIMARY KEY'], ['bookname', 'VARCHAR(20)', ''], ['publisher', 'VARCHAR(20)', ''], ['price', 'INTEGER', '']]
  const schema = (rows: string[][]) => result(['열', '자료형', '제약조건'], rows)
  const before = bookCols.map(row => [...row]), after = bookCols.map(row => [...row])
  let initialRows = bookData(), finalRows = bookData(), existsBefore = true, existsAfter = true
  if (number <= 36) {
    existsBefore = false; finalRows = { columns: number === 35 ? ['custid', 'name', 'address', 'phone'] : number === 36 ? ['orderid', 'custid', 'bookid', 'saleprice', 'orderdate'] : ['bookid', 'bookname', 'publisher', 'price'], rows: [] }
    if (number === 35) after.splice(0, after.length, ['custid', 'INTEGER', 'PRIMARY KEY'], ['name', 'VARCHAR(40)', ''], ['address', 'VARCHAR(40)', ''], ['phone', 'VARCHAR(30)', ''])
    if (number === 36) after.splice(0, after.length, ['orderid', 'INTEGER', 'PRIMARY KEY'], ['custid', 'INTEGER', 'NOT NULL · FK → NewCustomer · ON DELETE CASCADE'], ['bookid', 'INTEGER', 'NOT NULL'], ['saleprice', 'INTEGER', ''], ['orderdate', 'DATE', ''])
  }
  if ([37, 38, 39].includes(number)) {
    if (number !== 37) before.push(['isbn', 'VARCHAR(13)', ''])
    if (number !== 39) after.push(['isbn', number === 38 ? 'INTEGER' : 'VARCHAR(13)', ''])
    if (number !== 37) initialRows = { columns: [...initialRows.columns, 'isbn'], rows: initialRows.rows.map(row => [...row, null]) }
    if (number !== 39) finalRows = { columns: [...finalRows.columns, 'isbn'], rows: finalRows.rows.map(row => [...row, null]) }
  }
  if (number === 40) { before[0][2] = ''; after[0][2] = 'NOT NULL' }
  if (number === 41) before[0][2] = ''
  if (number === 42 || number === 43) existsAfter = false
  if (number === 44) finalRows = { ...finalRows, rows: [] }
  const name = number === 35 ? 'NewCustomer' : number === 36 ? 'NewOrders' : 'NewBook'
  if (number === 43) return [{ title: '실행 전', detail: 'NewOrders.custid가 NewCustomer.custid를 참조합니다.', tables: [], schema: schema([['NewOrders', '자식 테이블', 'FK → NewCustomer'], ['NewCustomer', '부모 테이블', '참조됨']]) }, { title: '실행 후', detail: '참조하는 NewOrders를 먼저 지우고 NewCustomer를 지웠습니다. 두 테이블이 모두 없어집니다.', tables: [] }]
  return [{ title: '실행 전', detail: existsBefore ? '각 문법의 전제에 맞춰 준비한 독립 예제입니다.' : `${name}이 아직 없습니다.`, schema: existsBefore ? schema(before) : undefined, tables: existsBefore ? [{ name, data: initialRows }] : [] }, { title: '실행 후', detail: existsAfter ? `${name}의 구조와 행을 비교하세요. CREATE는 빈 테이블, TRUNCATE는 구조를 남긴 빈 테이블입니다.` : `${name} 테이블 정의와 데이터가 함께 사라졌습니다.`, schema: existsAfter ? schema(after) : undefined, tables: existsAfter ? [{ name, data: finalRows }] : [] }]
}
