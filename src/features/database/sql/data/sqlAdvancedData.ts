import type { SearchEntry } from '../../data/content'
import { books, customers, orders } from './sqlLessonData'
import type { SqlResult } from './sqlLessonData'

const total = orders.reduce((n, o) => n + o.saleprice, 0)
export const advancedExamples: { title: string; code: string; explanation: string; result: SqlResult }[] = [
  { title: '전체 평균 이하의 주문 · 4-12', code: 'SELECT orderid, saleprice\nFROM Orders\nWHERE saleprice <= (SELECT AVG(saleprice) FROM Orders);', explanation: '전체 평균 11,800원이라는 한 값을 외부 주문의 판매가격과 비교한다.', result: { columns: ['orderid', 'saleprice'], rows: orders.filter(o => o.saleprice <= total / orders.length).map(o => [o.orderid, o.saleprice]) } },
  { title: '자신의 고객 평균보다 큰 주문 · 4-13', code: 'SELECT o.orderid, o.custid, o.saleprice\nFROM Orders o\nWHERE o.saleprice > (SELECT AVG(i.saleprice)\n                     FROM Orders i WHERE i.custid = o.custid);', explanation: '외부 행의 고객번호가 내부 조건에 들어간다. 전체 평균이 아니라 해당 고객의 평균과 비교한다.', result: { columns: ['orderid', 'custid', 'saleprice'], rows: orders.filter(o => { const own = orders.filter(i => i.custid === o.custid); return o.saleprice > own.reduce((n, i) => n + i.saleprice, 0) / own.length }).map(o => [o.orderid, o.custid, o.saleprice]) } },
  { title: '대한민국 거주 고객의 판매 합계 · IN · 4-14', code: "SELECT SUM(saleprice) AS total\nFROM Orders\nWHERE custid IN (SELECT custid FROM Customer\n                 WHERE address LIKE '대한민국%');", explanation: '국내 고객번호 2·3·5 중 주문에 존재하는 고객의 판매가격을 합산한다.', result: { columns: ['total'], rows: [[46000]] } },
  { title: '같은 판매 합계 · EXISTS · 4-16', code: "SELECT SUM(o.saleprice) AS total\nFROM Orders o\nWHERE EXISTS (SELECT 1 FROM Customer c\n              WHERE c.custid = o.custid\n                AND c.address LIKE '대한민국%');", explanation: '각 주문에 대응하는 국내 고객 행이 있는지 판단한다. 위 IN 예제와 같은 46,000원이 나온다.', result: { columns: ['total'], rows: [[46000]] } },
  { title: 'SELECT 안의 스칼라 부속질의', code: 'SELECT c.name,\n       (SELECT SUM(o.saleprice) FROM Orders o\n        WHERE o.custid = c.custid) AS total\nFROM Customer c;', explanation: '고객별 합계 한 값을 결과 열에 넣는다. 주문이 없는 박세리는 SUM 결과가 NULL이다. 0으로 표시하려면 COALESCE(..., 0)를 사용한다.', result: { columns: ['name', 'total'], rows: customers.map(c => { const own = orders.filter(o => o.custid === c.custid); return [c.name, own.length ? own.reduce((n, o) => n + o.saleprice, 0) : null] }) } },
  { title: 'FROM 안의 인라인 뷰', code: 'SELECT c.name, t.total\nFROM Customer c\nJOIN (SELECT custid, SUM(saleprice) AS total\n      FROM Orders GROUP BY custid) AS t\n  ON c.custid = t.custid;', explanation: '고객별 합계를 표처럼 만들고 고객과 연결한다. INNER JOIN이므로 구매하지 않은 고객은 제외된다. MySQL에서는 파생 테이블 별칭 t가 필요하다.', result: { columns: ['name', 'total'], rows: customers.filter(c => orders.some(o => o.custid === c.custid)).map(c => [c.name, orders.filter(o => o.custid === c.custid).reduce((n, o) => n + o.saleprice, 0)]) } },
]

export const subqueryExercises = [
  ['박지성이 구매한 출판사 수', "SELECT COUNT(DISTINCT b.publisher) AS publishers\nFROM Book b JOIN Orders o ON b.bookid = o.bookid\nWHERE o.custid = (SELECT custid FROM Customer WHERE name = '박지성');", '굿스포츠·대한미디어·나무수 → 3개. 이름이 유일하다는 이 데이터의 가정이다. 일반적으로 고객번호로 지정한다.'],
  ['박지성의 구매 도서·정가·정가와 판매가 차이', 'SELECT b.bookname, b.price, b.price - o.saleprice AS difference\nFROM Book b JOIN Orders o ON b.bookid = o.bookid\nWHERE o.custid = 1;', '축구의 역사 7,000 / 1,000 · 축구의 이해 22,000 / 1,000 · 축구아는 여자 13,000 / 1,000.'],
  ['박지성이 구매하지 않은 도서', 'SELECT b.bookname FROM Book b\nWHERE NOT EXISTS (SELECT 1 FROM Orders o\n                  WHERE o.bookid = b.bookid AND o.custid = 1);', '도서번호 4~10의 7권. 다른 고객이 구매했는지는 이 조건과 무관하다.'],
  ['주문하지 않은 고객', 'SELECT c.name FROM Customer c\nWHERE NOT EXISTS (SELECT 1 FROM Orders o WHERE o.custid = c.custid);', '박세리. 주문이 없는지를 고객번호로 판단한다.'],
  ['주문의 합계와 평균', 'SELECT SUM(saleprice) AS total, AVG(saleprice) AS average FROM Orders;', '합계 118,000원 · 평균 11,800원.'],
  ['고객별 구매 총액', 'SELECT c.name, COALESCE(SUM(o.saleprice), 0) AS total\nFROM Customer c LEFT JOIN Orders o ON c.custid = o.custid\nGROUP BY c.custid, c.name;', '박지성 39,000 · 김연아 15,000 · 장미란 31,000 · 추신수 33,000 · 박세리 0.'],
  ['고객 이름과 구매 도서 목록', 'SELECT c.name, b.bookname\nFROM Customer c JOIN Orders o ON c.custid = o.custid\nJOIN Book b ON b.bookid = o.bookid;', '10개의 주문에 대응하는 10행. 구매하지 않은 고객도 포함하려면 두 연결을 LEFT JOIN으로 바꾼다.'],
  ['정가와 판매가 차이가 가장 큰 주문', 'SELECT o.orderid, b.bookname, b.price - o.saleprice AS difference\nFROM Orders o JOIN Book b ON b.bookid = o.bookid\nWHERE b.price - o.saleprice =\n (SELECT MAX(b2.price - o2.saleprice)\n  FROM Orders o2 JOIN Book b2 ON b2.bookid = o2.bookid);', '주문 9 · Olympic Champions · 6,000원. 최댓값과 같은 행을 모두 찾아 동률도 포함한다.'],
  ['전체 주문 평균보다 고객별 평균이 큰 고객', 'SELECT c.name, AVG(o.saleprice) AS average\nFROM Customer c JOIN Orders o ON c.custid = o.custid\nGROUP BY c.custid, c.name\nHAVING AVG(o.saleprice) > (SELECT AVG(saleprice) FROM Orders);', '박지성 13,000원 · 추신수 16,500원. 고객별 평균들의 평균이 아니라 모든 주문의 평균 11,800원과 비교한다.'],
]
export const subqueryGroups = [
  { section: 'subquery-nested', title: '서브쿼리 차근차근 이해하기', keywords: [{ title: '기초 · 중첩 IN · 3중 부속질의', target: 'subquery-nested' }] },
  { section: 'subquery-types', title: '부속질의의 구조', keywords: [{ title: 'WHERE · SELECT · FROM', target: 'subquery-types' }] },
  { section: 'subquery-flow', title: '단일 값 · 집합 · 존재', keywords: [{ title: '스칼라 · IN · EXISTS', target: 'subquery-flow' }] },
  { section: 'subquery-correlated', title: '상관 부속질의', keywords: [{ title: '출판사별 평균과 비교', target: 'subquery-correlated' }] },
  { section: 'subquery-library', title: '질의와 결과', keywords: [{ title: '4-12 · 4-13 · 4-14 · 4-16', target: 'subquery-library' }] },
  { section: 'subquery-exercises', title: '연습문제 해설', keywords: [{ title: '구매 · 미구매 · 합계 · 평균', target: 'subquery-exercises' }] },
]
export const changeGroups = [
  { section: 'changes-insert', title: 'INSERT · 삽입', keywords: [{ title: 'VALUES · NULL · INSERT SELECT', target: 'changes-insert' }] },
  { section: 'changes-update', title: 'UPDATE · 수정', keywords: [{ title: 'SET · WHERE · 다른 행 참조', target: 'changes-update' }] },
  { section: 'changes-delete', title: 'DELETE · 삭제', keywords: [{ title: '행 삭제 · 외래키', target: 'changes-delete' }] },
  { section: 'changes-play', title: '변경 전후 비교', keywords: [{ title: '삽입 · 수정 · 삭제 체험', target: 'changes-play' }] },
]
export const advancedSearchEntries: SearchEntry[] = [
  ...subqueryGroups.flatMap(g => g.keywords.map(k => ({ ...k, section: g.section, text: `${g.title} 부질의 부속질의 중첩질의 스칼라 인라인 뷰 상관질의 IN NOT IN EXISTS NOT EXISTS`, page: 'subqueries' as const }))),
  ...changeGroups.flatMap(g => g.keywords.map(k => ({ ...k, section: g.section, text: `${g.title} 데이터 조작어 DML INSERT UPDATE DELETE 삽입 수정 삭제`, page: 'changes' as const }))),
]
export const highestBook = books.filter(b => b.price === Math.max(...books.map(i => i.price)))
