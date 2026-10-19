import { books, customers, orders } from './sqlLessonData'
import type { SqlResult } from './sqlLessonData'

type Step = { title: string; table: string; sql: string; result: SqlResult; explanation: string; next: string }
export type SubqueryLesson = { title: string; question: string; nesting: number; sql: string; hint: string; caution: string; steps: Step[] }
const maxPrice = Math.max(...books.map(book => book.price))
const publisherBooks = books.filter(book => book.publisher === '대한미디어')
const publisherOrders = orders.filter(order => publisherBooks.some(book => book.bookid === order.bookid))
const publisherCustomers = customers.filter(customer => publisherOrders.some(order => order.custid === customer.custid))
const parkCustomers = customers.filter(customer => customer.name === '박지성')
const parkOrders = orders.filter(order => parkCustomers.some(customer => customer.custid === order.custid))
const parkBooks = books.filter(book => parkOrders.some(order => order.bookid === book.bookid))
const parkPublishers = [...new Set(parkBooks.map(book => book.publisher))]
const relatedBooks = books.filter(book => parkPublishers.includes(book.publisher))

export const subqueryLessons: SubqueryLesson[] = [
  {
    title: '한 값 · 가장 비싼 도서', question: '도서 중 가장 비싼 책의 제목을 부속질의로 검색하시오.', nesting: 1,
    sql: 'select bookname\nfrom book\nwhere price = (\n  select max(price)\n  from book\n);',
    hint: '안쪽은 최고 가격 한 값, 바깥은 그 가격과 같은 책의 이름입니다. MAX(price)와 bookname을 한 SELECT에 나열하는 것과 구별하세요.',
    caution: 'MAX(price)는 한 값을 반환하므로 =로 비교합니다. 최고가 도서가 여러 권이면 바깥 결과는 여러 행일 수 있습니다.',
    steps: [
      { title: '최고 가격 구하기', table: 'Book → 가격 한 값', sql: 'select max(price)\nfrom book;', result: { columns: ['max(price)'], rows: [[maxPrice]] }, explanation: '안쪽 SELECT는 도서명이 아니라 최고 가격 35000만 반환합니다.', next: '이 한 값을 바깥 price = (...)에 넣습니다.' },
      { title: '가격으로 도서명 찾기', table: 'Book → bookname', sql: `select bookname\nfrom book\nwhere price = ${maxPrice};`, result: { columns: ['bookname'], rows: books.filter(book => book.price === maxPrice).map(book => [book.bookname]) }, explanation: '책 가격이 35000인 행을 고르고, 가장 바깥 SELECT가 요청한 bookname만 출력합니다.', next: '35000을 직접 쓰는 대신 최고 가격을 구하는 SELECT로 바꾸면 전체 SQL이 됩니다.' },
    ],
  },
  {
    title: '중첩 IN · 출판사에서 고객까지', question: '대한미디어에서 출판한 도서를 구매한 고객의 이름을 부속질의로 검색하시오.', nesting: 2,
    sql: "select name\nfrom customer\nwhere custid in (\n  select custid\n  from orders\n  where bookid in (\n    select bookid\n    from book\n    where publisher = '대한미디어'\n  )\n);",
    hint: '출판사는 Book, 구매 사실은 Orders, 이름은 Customer에 있습니다. Book에서 bookid → Orders에서 custid → Customer에서 name 순서로 전달합니다.',
    caution: 'Orders의 bookid IN (...) 안쪽은 bookid, Customer의 custid IN (...) 안쪽은 custid를 반환해야 합니다. 여러 값이 나올 수 있으므로 = 대신 IN을 사용합니다.',
    steps: [
      { title: '출판사의 도서번호 찾기', table: 'Book → bookid', sql: "select bookid\nfrom book\nwhere publisher = '대한미디어';", result: { columns: ['bookid'], rows: publisherBooks.map(book => [book.bookid]) }, explanation: '대한미디어가 낸 책은 3번과 4번입니다. 다음 단계에는 책 제목이 아니라 도서번호를 넘깁니다.', next: 'Orders의 bookid in (3, 4)로 사용합니다.' },
      { title: '그 도서를 산 고객번호 찾기', table: 'Orders → custid', sql: 'select custid\nfrom orders\nwhere bookid in (3, 4);', result: { columns: ['custid'], rows: publisherOrders.map(order => [order.custid]) }, explanation: '3번 또는 4번 책의 주문을 찾습니다. 현재 데이터에는 3번 책을 산 고객번호 1이 있습니다. 4번 책은 주문이 없습니다.', next: 'Customer의 custid in (1)로 사용합니다.' },
      { title: '고객번호로 이름 찾기', table: 'Customer → name', sql: 'select name\nfrom customer\nwhere custid in (1);', result: { columns: ['name'], rows: publisherCustomers.map(customer => [customer.name]) }, explanation: '고객번호 1인 박지성이 최종 결과입니다. 부속질의에 주문이 여러 개 있어도 IN은 포함 여부를 검사하므로 Customer 행을 주문 수만큼 복제하지 않습니다.', next: '숫자 목록 자리에 앞 단계 SELECT를 넣어 아래 전체 SQL로 합칩니다.' },
    ],
  },
  {
    title: '3중 부속질의 · 고객에서 출판사까지', question: '박지성이 구매한 책의 출판사들이 출판한 모든 도서의 도서명을 부속질의로 검색하시오. 박지성이 직접 구매하지 않은 책도 포함하시오.', nesting: 3,
    sql: "select bookname\nfrom book\nwhere publisher in (\n  select publisher\n  from book\n  where bookid in (\n    select bookid\n    from orders\n    where custid in (\n      select custid\n      from customer\n      where name = '박지성'\n    )\n  )\n);",
    hint: '박지성 고객번호 → 구매 도서번호 → 해당 도서의 출판사 → 그 출판사의 모든 도서명입니다. 가장 바깥은 Book이고, 안쪽 SELECT는 각각 publisher, bookid, custid를 반환합니다.',
    caution: '이 예제는 주질의 1개와 내부 부속질의 3개로 SELECT가 총 4개입니다. “3중”이 SELECT 총 3개를 뜻하는지 내부 3개를 뜻하는지는 문제의 실제 조건을 보고 판단하세요. 마지막 조건은 bookid가 아니라 publisher입니다.',
    steps: [
      { title: '박지성의 고객번호', table: 'Customer → custid', sql: "select custid\nfrom customer\nwhere name = '박지성';", result: { columns: ['custid'], rows: parkCustomers.map(customer => [customer.custid]) }, explanation: '이름은 Customer에 있습니다. 먼저 박지성의 고객번호 1을 구합니다.', next: 'Orders의 custid in (1)에 전달합니다.' },
      { title: '박지성이 산 도서번호', table: 'Orders → bookid', sql: 'select bookid\nfrom orders\nwhere custid in (1);', result: { columns: ['bookid'], rows: parkOrders.map(order => [order.bookid]) }, explanation: '고객번호 1인 주문에서 도서번호 1, 3, 2를 가져옵니다. 다음 단계에서 Book과 비교하므로 bookid를 SELECT합니다.', next: 'Book의 bookid in (1, 3, 2)에 전달합니다.' },
      { title: '구매 도서의 출판사', table: 'Book → publisher', sql: 'select publisher\nfrom book\nwhere bookid in (1, 3, 2);', result: { columns: ['publisher'], rows: parkBooks.map(book => [book.publisher]) }, explanation: '구매한 책의 출판사는 굿스포츠·나무수·대한미디어입니다. 다음 단계에는 도서번호가 아니라 출판사를 넘깁니다.', next: "Book의 publisher in ('굿스포츠', '나무수', '대한미디어')에 전달합니다." },
      { title: '그 출판사들의 모든 도서명', table: 'Book → bookname', sql: "select bookname\nfrom book\nwhere publisher in ('굿스포츠', '나무수', '대한미디어');", result: { columns: ['bookname'], rows: relatedBooks.map(book => [book.bookname]) }, explanation: '출판사가 일치하는 책은 총 6권입니다. 박지성이 사지 않은 골프 바이블·피겨 교본·역도 단계별기술도 포함됩니다. “박지성이 산 책”만 묻는 문제와 다릅니다.', next: '출판사 목록과 번호 목록을 각 SELECT로 대체하면 전체 SQL이 완성됩니다.' },
    ],
  },
]
