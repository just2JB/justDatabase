import type { SearchEntry } from '../../data/content'

export type SqlRow = (string | number | null)[]
export type SqlResult = { columns: string[]; rows: SqlRow[] }
export const books = [
  { bookid: 1, bookname: '축구의 역사', publisher: '굿스포츠', price: 7000 }, { bookid: 2, bookname: '축구아는 여자', publisher: '나무수', price: 13000 },
  { bookid: 3, bookname: '축구의 이해', publisher: '대한미디어', price: 22000 }, { bookid: 4, bookname: '골프 바이블', publisher: '대한미디어', price: 35000 },
  { bookid: 5, bookname: '피겨 교본', publisher: '굿스포츠', price: 8000 }, { bookid: 6, bookname: '역도 단계별기술', publisher: '굿스포츠', price: 6000 },
  { bookid: 7, bookname: '야구의 추억', publisher: '이상미디어', price: 20000 }, { bookid: 8, bookname: '야구를 부탁해', publisher: '이상미디어', price: 13000 },
  { bookid: 9, bookname: '올림픽 이야기', publisher: '삼성당', price: 7500 }, { bookid: 10, bookname: 'Olympic Champions', publisher: 'Pearson', price: 13000 },
]
export const customers = [
  { custid: 1, name: '박지성', address: '영국 맨체스타', phone: '000-5000-0001' }, { custid: 2, name: '김연아', address: '대한민국 서울', phone: '000-6000-0001' },
  { custid: 3, name: '장미란', address: '대한민국 강원도', phone: '000-7000-0001' }, { custid: 4, name: '추신수', address: '미국 클리블랜드', phone: '000-8000-0001' },
  { custid: 5, name: '박세리', address: '대한민국 대전', phone: null },
]
export const orders = [
  { orderid: 1, custid: 1, bookid: 1, saleprice: 6000, orderdate: '2014-07-01' }, { orderid: 2, custid: 1, bookid: 3, saleprice: 21000, orderdate: '2014-07-03' },
  { orderid: 3, custid: 2, bookid: 5, saleprice: 8000, orderdate: '2014-07-03' }, { orderid: 4, custid: 3, bookid: 6, saleprice: 6000, orderdate: '2014-07-04' },
  { orderid: 5, custid: 4, bookid: 7, saleprice: 20000, orderdate: '2014-07-05' }, { orderid: 6, custid: 1, bookid: 2, saleprice: 12000, orderdate: '2014-07-07' },
  { orderid: 7, custid: 4, bookid: 8, saleprice: 13000, orderdate: '2014-07-07' }, { orderid: 8, custid: 3, bookid: 10, saleprice: 12000, orderdate: '2014-07-08' },
  { orderid: 9, custid: 2, bookid: 10, saleprice: 7000, orderdate: '2014-07-09' }, { orderid: 10, custid: 3, bookid: 8, saleprice: 13000, orderdate: '2014-07-10' },
]
export const sampleTables: { name: string; result: SqlResult }[] = [
  { name: 'Book', result: { columns: ['bookid', 'bookname', 'publisher', 'price'], rows: books.map(b => [b.bookid, b.bookname, b.publisher, b.price]) } },
  { name: 'Customer', result: { columns: ['custid', 'name', 'address', 'phone'], rows: customers.map(c => [c.custid, c.name, c.address, c.phone]) } },
  { name: 'Orders', result: { columns: ['orderid', 'custid', 'bookid', 'saleprice', 'orderdate'], rows: orders.map(o => [o.orderid, o.custid, o.bookid, o.saleprice, o.orderdate]) } },
]
const result = (columns: string[], rows: SqlRow[]): SqlResult => ({ columns, rows })
const allBooks = (rows = books) => result(['bookid', 'bookname', 'publisher', 'price'], rows.map(b => [b.bookid, b.bookname, b.publisher, b.price]))
const sum = (rows = orders) => rows.reduce((total, order) => total + order.saleprice, 0)
const purchased = (id: number) => orders.some(o => o.custid === id)
export type SqlQueryExample = { number: number; group: string; title: string; code: string; explanation: string; result: () => SqlResult }
const example = (number: number, group: string, title: string, code: string, explanation: string, output: () => SqlResult): SqlQueryExample => ({ number, group, title, code, explanation, result: output })
export const queryExamples: SqlQueryExample[] = [
  example(1, '검색', '모든 도서의 이름과 가격', 'SELECT bookname, price\nFROM Book;', 'SELECT는 결과에 보여줄 열을 정한다. 열 순서를 price, bookname으로 바꿀 수도 있다.', () => result(['bookname', 'price'], books.map(b => [b.bookname, b.price]))),
  example(2, '검색', '모든 열 조회', 'SELECT *\nFROM Book;', '*는 테이블의 모든 열을 선택한다.', () => allBooks()),
  example(3, '검색', '중복 출판사 제거', 'SELECT DISTINCT publisher\nFROM Book;', 'DISTINCT는 선택한 결과 열의 중복을 제거한다. SELECT publisher와 비교하면 10행에서 6행이 된다.', () => result(['publisher'], [...new Set(books.map(b => b.publisher))].map(p => [p]))),
  example(4, '조건', '20,000원 미만 도서', 'SELECT * FROM Book\nWHERE price < 20000;', 'WHERE는 조건을 만족하는 행을 고른다.', () => allBooks(books.filter(b => b.price < 20000))),
  example(5, '조건', '10,000~20,000원 범위', 'SELECT * FROM Book\nWHERE price BETWEEN 10000 AND 20000;', 'BETWEEN은 양 끝값을 포함한다. price >= 10000 AND price <= 20000과 같다.', () => allBooks(books.filter(b => b.price >= 10000 && b.price <= 20000))),
  example(6, '조건', '출판사 목록에 포함', "SELECT * FROM Book\nWHERE publisher IN ('굿스포츠', '대한미디어');", 'IN은 목록에 포함되는 값, NOT IN은 포함되지 않는 값이다.', () => allBooks(books.filter(b => ['굿스포츠', '대한미디어'].includes(b.publisher)))),
  example(7, '조건', '정확한 제목 패턴', "SELECT bookname, publisher FROM Book\nWHERE bookname LIKE '축구의 역사';", '와일드카드가 없으면 지정한 문자열 패턴과 일치하는 제목을 찾는다.', () => result(['bookname', 'publisher'], books.filter(b => b.bookname === '축구의 역사').map(b => [b.bookname, b.publisher]))),
  example(8, '조건', '축구가 포함된 제목', "SELECT bookname, publisher FROM Book\nWHERE bookname LIKE '%축구%';", '%는 0개 이상의 문자를 의미하므로 앞뒤에 다른 문자가 있어도 찾는다.', () => result(['bookname', 'publisher'], books.filter(b => b.bookname.includes('축구')).map(b => [b.bookname, b.publisher]))),
  example(9, '조건', '두 번째 문자가 구', "SELECT * FROM Book\nWHERE bookname LIKE '_구%';", '_는 정확히 한 문자이다. 첫 문자는 무엇이든 되고 두 번째 문자는 구이다.', () => allBooks(books.filter(b => [...b.bookname][1] === '구'))),
  example(10, '조건', '축구 + 20,000원 이상', "SELECT * FROM Book\nWHERE bookname LIKE '%축구%' AND price >= 20000;", 'AND는 두 조건을 모두 만족해야 한다.', () => allBooks(books.filter(b => b.bookname.includes('축구') && b.price >= 20000))),
  example(11, '조건', '두 출판사 중 하나', "SELECT * FROM Book\nWHERE publisher = '굿스포츠' OR publisher = '대한미디어';", 'OR는 하나 이상의 조건을 만족하면 된다. 질의 6의 IN과 같은 결과이다.', () => allBooks(books.filter(b => ['굿스포츠', '대한미디어'].includes(b.publisher)))),
  example(12, '정렬', '도서 이름순', 'SELECT * FROM Book\nORDER BY bookname ASC;', 'ASC는 오름차순이며 생략 가능하다. 문자열의 실제 정렬 순서는 DB의 문자 집합·콜레이션에 따른다. 미리보기는 한국어 비교 순서를 사용한다.', () => allBooks([...books].sort((a, b) => a.bookname.localeCompare(b.bookname, 'ko')))),
  example(13, '정렬', '가격 → 이름 순서', 'SELECT * FROM Book\nORDER BY price ASC, bookname ASC;', '첫 기준이 같으면 두 번째 기준으로 정렬한다.', () => allBooks([...books].sort((a, b) => a.price - b.price || a.bookname.localeCompare(b.bookname, 'ko')))),
  example(14, '정렬', '가격 내림차순·출판사 오름차순', 'SELECT * FROM Book\nORDER BY price DESC, publisher ASC;', 'DESC는 내림차순이다. 가격이 같은 행끼리는 출판사를 비교한다.', () => allBooks([...books].sort((a, b) => b.price - a.price || a.publisher.localeCompare(b.publisher, 'ko')))),
  example(15, '집계', '전체 판매액', 'SELECT SUM(saleprice) AS 총매출\nFROM Orders;', 'SUM은 합계를 구하고 AS는 결과 열의 별칭을 정한다.', () => result(['총매출'], [[sum()]])),
  example(16, '집계', '2번 고객의 판매액', 'SELECT SUM(saleprice) AS 총매출\nFROM Orders WHERE custid = 2;', '먼저 고객번호가 2인 주문만 고른 뒤 집계한다.', () => result(['총매출'], [[sum(orders.filter(o => o.custid === 2))]])),
  example(17, '집계', '합계·평균·최저·최고', 'SELECT SUM(saleprice) AS Total, AVG(saleprice) AS Average,\n       MIN(saleprice) AS Minimum, MAX(saleprice) AS Maximum\nFROM Orders;', '각 집계 함수는 판매가격 값을 요약한다.', () => result(['Total', 'Average', 'Minimum', 'Maximum'], [[sum(), sum() / orders.length, Math.min(...orders.map(o => o.saleprice)), Math.max(...orders.map(o => o.saleprice))]])),
  example(18, '집계', '판매 건수', 'SELECT COUNT(*) AS 판매건수\nFROM Orders;', 'COUNT(*)는 행 수를 센다. 이 표는 한 주문 행이 한 도서 판매를 나타내므로 10건이다.', () => result(['판매건수'], [[orders.length]])),
  example(19, '그룹', '고객별 건수와 총액', 'SELECT custid, COUNT(*) AS 주문건수, SUM(saleprice) AS 총액\nFROM Orders GROUP BY custid;', '고객번호별로 묶어 각 그룹을 집계한다. 수량 열이 없는 표에서 COUNT(*)는 주문 행의 수이다.', () => result(['custid', '주문건수', '총액'], customers.filter(c => purchased(c.custid)).map(c => { const rows = orders.filter(o => o.custid === c.custid); return [c.custid, rows.length, sum(rows)] }))),
  example(20, '그룹', '행 조건과 그룹 조건', 'SELECT custid, COUNT(*) AS 주문건수\nFROM Orders WHERE saleprice >= 8000\nGROUP BY custid HAVING COUNT(*) >= 2;', 'WHERE로 8,000원 이상인 주문 행을 고르고, 고객별로 묶은 뒤 HAVING으로 2건 이상인 그룹을 남긴다.', () => result(['custid', '주문건수'], customers.map(c => [c.custid, orders.filter(o => o.custid === c.custid && o.saleprice >= 8000).length]).filter(row => row[1] >= 2))),
  example(21, '조인', '고객과 주문 연결', 'SELECT Customer.*, Orders.*\nFROM Customer JOIN Orders\nON Customer.custid = Orders.custid;', '고객번호가 같은 행끼리 연결한다. 중복 열 이름은 미리보기에서 테이블 이름으로 구별한다.', () => result(['Customer.custid', 'name', 'address', 'phone', 'orderid', 'Orders.custid', 'bookid', 'saleprice', 'orderdate'], orders.map(o => { const c = customers.find(c => c.custid === o.custid)!; return [c.custid, c.name, c.address, c.phone, o.orderid, o.custid, o.bookid, o.saleprice, o.orderdate] }))),
  example(22, '조인', '연결 결과 고객번호순', 'SELECT Customer.*, Orders.* FROM Customer JOIN Orders\nON Customer.custid = Orders.custid\nORDER BY Customer.custid;', '연결된 결과를 고객번호로 정렬한다.', () => result(['Customer.custid', 'name', 'address', 'phone', 'orderid', 'Orders.custid', 'bookid', 'saleprice', 'orderdate'], [...orders].sort((a, b) => a.custid - b.custid).map(o => { const c = customers.find(c => c.custid === o.custid)!; return [c.custid, c.name, c.address, c.phone, o.orderid, o.custid, o.bookid, o.saleprice, o.orderdate] }))),
  example(23, '조인', '고객 이름과 판매가격', 'SELECT c.name, o.saleprice FROM Customer c\nJOIN Orders o ON c.custid = o.custid;', '별칭 c와 o로 열이 속한 테이블을 구분한다.', () => result(['name', 'saleprice'], orders.map(o => [customers.find(c => c.custid === o.custid)!.name, o.saleprice]))),
  example(24, '조인', '고객별 총 판매액', 'SELECT c.name, SUM(o.saleprice) AS 총판매액\nFROM Customer c JOIN Orders o ON c.custid = o.custid\nGROUP BY c.custid, c.name ORDER BY c.name;', '동명이인을 합치지 않도록 고객번호와 이름으로 그룹을 구분한다.', () => result(['name', '총판매액'], customers.filter(c => purchased(c.custid)).sort((a, b) => a.name.localeCompare(b.name, 'ko')).map(c => [c.name, sum(orders.filter(o => o.custid === c.custid))]))),
  example(25, '조인', '고객 이름과 주문 도서', 'SELECT c.name, b.bookname FROM Customer c\nJOIN Orders o ON c.custid = o.custid\nJOIN Book b ON o.bookid = b.bookid;', 'Customer → Orders → Book을 고객번호와 도서번호로 연결한다.', () => result(['name', 'bookname'], orders.map(o => [customers.find(c => c.custid === o.custid)!.name, books.find(b => b.bookid === o.bookid)!.bookname]))),
  example(26, '조인', '정가 20,000원인 도서 구매', 'SELECT c.name, b.bookname FROM Customer c\nJOIN Orders o ON c.custid = o.custid\nJOIN Book b ON o.bookid = b.bookid WHERE b.price = 20000;', 'Book.price는 정가, Orders.saleprice는 실제 판매가격이다.', () => result(['name', 'bookname'], orders.filter(o => books.find(b => b.bookid === o.bookid)!.price === 20000).map(o => [customers.find(c => c.custid === o.custid)!.name, books.find(b => b.bookid === o.bookid)!.bookname]))),
  example(27, '조인', '구매하지 않은 고객도 포함', 'SELECT c.name, o.saleprice FROM Customer c\nLEFT JOIN Orders o ON c.custid = o.custid;', 'LEFT JOIN은 왼쪽의 모든 고객을 보존한다. 주문이 없는 박세리는 판매가격이 NULL이다.', () => result(['name', 'saleprice'], customers.flatMap<SqlRow>(c => { const rows = orders.filter(o => o.custid === c.custid); return rows.length ? rows.map(o => [c.name, o.saleprice]) : [[c.name, null]] }))),
  example(28, '부속질의', '가장 비싼 도서', 'SELECT bookname FROM Book\nWHERE price = (SELECT MAX(price) FROM Book);', '내부 질의에서 최고 가격을 구한 뒤 같은 가격의 도서를 고른다. 최고가가 같으면 여러 행이 나올 수 있다.', () => result(['bookname'], books.filter(b => b.price === Math.max(...books.map(b => b.price))).map(b => [b.bookname]))),
  example(29, '부속질의', '구매한 적 있는 고객', 'SELECT name FROM Customer\nWHERE custid IN (SELECT custid FROM Orders);', '주문 테이블의 고객번호 집합에 포함되는 고객을 찾는다.', () => result(['name'], customers.filter(c => purchased(c.custid)).map(c => [c.name]))),
  example(30, '부속질의', '대한미디어 도서를 산 고객', "SELECT name FROM Customer WHERE custid IN (\n  SELECT custid FROM Orders WHERE bookid IN (\n    SELECT bookid FROM Book WHERE publisher = '대한미디어'\n  )\n);", '도서번호 → 주문 고객번호 → 고객 이름으로 조건을 연결한다.', () => result(['name'], customers.filter(c => orders.some(o => o.custid === c.custid && books.find(b => b.bookid === o.bookid)!.publisher === '대한미디어')).map(c => [c.name]))),
  example(31, '부속질의', '출판사 평균보다 비싼 도서', 'SELECT b1.bookname FROM Book b1\nWHERE b1.price > (SELECT AVG(b2.price) FROM Book b2\n                 WHERE b2.publisher = b1.publisher);', '상관 부속질의는 외부 행의 출판사를 이용해 그 출판사의 평균을 구한다.', () => result(['bookname'], books.filter(b => { const group = books.filter(other => other.publisher === b.publisher); return b.price > group.reduce((total, other) => total + other.price, 0) / group.length }).map(b => [b.bookname]))),
  example(32, '집합·존재', '국내 거주 또는 구매 고객', "SELECT name FROM Customer WHERE address LIKE '대한민국%'\nUNION\nSELECT name FROM Customer WHERE custid IN (SELECT custid FROM Orders);", 'UNION은 두 결과를 합치고 중복을 제거한다. UNION ALL은 중복을 유지한다.', () => result(['name'], [...new Set(customers.filter(c => c.address.startsWith('대한민국') || purchased(c.custid)).map(c => c.name))].map(name => [name]))),
  example(33, '집합·존재', '주문이 존재하는 고객', 'SELECT c.name, c.address FROM Customer c\nWHERE EXISTS (SELECT 1 FROM Orders o WHERE o.custid = c.custid);', 'EXISTS는 내부 질의가 한 행 이상 반환하면 참이다. NOT EXISTS는 반환 행이 없으면 참이다.', () => result(['name', 'address'], customers.filter(c => purchased(c.custid)).map(c => [c.name, c.address]))),
]

export const ddlExamples = [
  { number: 34, title: 'NewBook 만들기', code: 'CREATE TABLE NewBook (\n  bookid INTEGER PRIMARY KEY,\n  bookname VARCHAR(20),\n  publisher VARCHAR(20),\n  price INTEGER\n);', note: '기본키는 열 옆에 쓰거나 PRIMARY KEY (bookid)로 따로 지정할 수 있다.' },
  { number: 35, title: '고객 테이블 만들기', code: 'CREATE TABLE NewCustomer (\n  custid INTEGER PRIMARY KEY,\n  name VARCHAR(40), address VARCHAR(40), phone VARCHAR(30)\n);', note: '참조 대상인 고객 테이블을 주문 테이블보다 먼저 만든다.' },
  { number: 36, title: '외래키·연쇄 삭제', code: 'CREATE TABLE NewOrders (\n  orderid INTEGER PRIMARY KEY,\n  custid INTEGER NOT NULL, bookid INTEGER NOT NULL,\n  saleprice INTEGER, orderdate DATE,\n  FOREIGN KEY (custid) REFERENCES NewCustomer(custid)\n    ON DELETE CASCADE\n);', note: '고객을 삭제하면 그 고객을 참조하는 주문도 삭제된다. 이 예제의 bookid에는 외래키가 선언되지 않았다.' },
  { number: 37, title: '열 추가', code: 'ALTER TABLE NewBook ADD isbn VARCHAR(13);', note: '새 속성을 추가한다.' },
  { number: 38, title: '자료형 변경', code: 'ALTER TABLE NewBook MODIFY isbn INTEGER;', note: 'MODIFY는 자료형·열 정의를 변경한다. 실제 ISBN은 문자로 다루는 것이 적절하며 이 문장은 변경 문법 연습이다.' },
  { number: 39, title: '열 삭제', code: 'ALTER TABLE NewBook DROP COLUMN isbn;', note: '해당 열의 구조와 값이 제거된다.' },
  { number: 40, title: 'NOT NULL 지정', code: 'ALTER TABLE NewBook MODIFY bookid INTEGER NOT NULL;', note: '이미 NULL이 들어 있다면 먼저 해결해야 한다.' },
  { number: 41, title: '기본키 추가', code: 'ALTER TABLE NewBook ADD PRIMARY KEY (bookid);', note: '기본키가 없는 테이블을 전제로 한다. 질의 34에서 이미 기본키를 지정했다면 그대로 추가할 수 없다.' },
  { number: 42, title: '도서 테이블 삭제', code: 'DROP TABLE NewBook;', note: '테이블 구조와 데이터가 모두 삭제된다. DELETE는 행을 삭제하며 구조를 유지한다.' },
  { number: 43, title: '참조 관계와 삭제 순서', code: 'DROP TABLE NewOrders;\nDROP TABLE NewCustomer;', note: '참조하는 자식 테이블을 먼저 제거한다. 참조되는 부모를 먼저 DROP하면 외래키 검사로 거절될 수 있다.' },
]

export const sql4Groups = [
  { section: 'sql4-overview', title: 'SQL과 실행 준비', keywords: [{ title: 'DDL · DML · DCL', target: 'sql4-overview' }, { title: '데이터베이스 생성 · USE', target: 'sql4-setup' }] },
  { section: 'sql4-create', title: '테이블 생성과 제약', keywords: [{ title: '자료형 · CREATE', target: 'sql4-create' }, { title: '기본키 · 외래키 · CHECK', target: 'sql4-constraints' }] },
  { section: 'sql4-alter', title: '변경과 삭제', keywords: [{ title: 'ALTER · RENAME', target: 'sql4-alter' }, { title: 'DROP · DELETE 차이', target: 'sql4-drop' }] },
  { section: 'sql4-query', title: '검색과 집계 기초', keywords: [{ title: 'SELECT · WHERE · ORDER BY', target: 'sql4-query' }, { title: '집계 · GROUP BY · HAVING', target: 'sql4-summary' }] },
]
export const sql5Groups = [
  { section: 'sql5-data', title: '서점 데이터와 검색', keywords: [{ title: 'Book · Customer · Orders', target: 'sql5-data' }, { title: 'SELECT · DISTINCT', target: 'sql5-select' }] },
  { section: 'sql5-conditions', title: '검색 조건과 정렬', keywords: [{ title: 'WHERE · BETWEEN · IN · LIKE', target: 'sql5-conditions' }, { title: 'NULL · ORDER BY', target: 'sql5-order' }] },
  { section: 'sql5-aggregate', title: '집계와 그룹', keywords: [{ title: 'SUM · AVG · COUNT', target: 'sql5-aggregate' }, { title: 'GROUP BY · HAVING', target: 'sql5-group' }] },
  { section: 'sql5-join', title: '조인과 부속질의', keywords: [{ title: 'INNER · LEFT JOIN', target: 'sql5-join' }, { title: '외부 조인 예제', target: 'sql5-outer-join' }, { title: '부속질의 · 상관 부속질의', target: 'sql5-subqueries' }] },
  { section: 'sql5-sets', title: '집합과 존재', keywords: [{ title: 'UNION · 차집합 · 교집합', target: 'sql5-sets' }, { title: 'EXISTS · NOT EXISTS', target: 'sql5-exists' }] },
  { section: 'sql5-examples', title: '질의 예제', keywords: [{ title: '질의 3-1~3-33 결과 보기', target: 'sql5-examples' }] },
]
export const sqlSearchEntries: SearchEntry[] = [
  ...sql4Groups.map(group => ({ title: `SQL 기초 · ${group.title}`, text: group.keywords.map(k => k.title).join(' '), section: group.section, page: 'sql4' as const })),
  ...sql5Groups.map(group => ({ title: `SQL 검색 · ${group.title}`, text: group.keywords.map(k => k.title).join(' '), section: group.section, page: 'sql5' as const })),
  ...ddlExamples.map(item => ({ title: `질의 3-${item.number} · ${item.title}`, text: `${item.code} ${item.note}`, section: 'sql4-create', target: `ddl-example-${item.number}`, page: 'sql4' as const })),
  ...queryExamples.map(item => ({ title: `질의 3-${item.number} · ${item.title}`, text: `${item.code} ${item.explanation}`, section: 'sql5-examples', page: 'sql5' as const, sqlQuery: item.number })),
]
