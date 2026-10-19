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
const averagePrice = books.reduce((sum, book) => sum + book.price, 0) / books.length
const purchasedBookIds = orders.map(order => order.bookid)
const domesticCustomers = customers.filter(customer => customer.address.includes('대한민국'))
const domesticOrders = orders.filter(order => domesticCustomers.some(customer => customer.custid === order.custid))
const kimCustomers = customers.filter(customer => customer.name === '김연아')
const kimOrders = orders.filter(order => kimCustomers.some(customer => customer.custid === order.custid))
const sharedOrders = orders.filter(order => kimOrders.some(kim => kim.bookid === order.bookid))

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
  {
    title: '평균 비교 · 평균 정가보다 비싼 도서', question: '전체 도서의 평균 정가보다 비싼 도서의 도서명과 정가를 부속질의로 검색하시오.', nesting: 1,
    sql: 'select bookname, price\nfrom book\nwhere price > (\n  select avg(price)\n  from book\n);',
    hint: 'Book에서 AVG(price) 한 값을 먼저 구하고, 바깥에서 각 도서의 price와 비교합니다.',
    caution: '도서 정가는 Book.price입니다. Orders.saleprice의 평균이나 출판사별 평균과 혼동하지 마세요. “보다 비싼”은 >=가 아니라 >입니다.',
    steps: [
      { title: '전체 평균 정가', table: 'Book → 평균 한 값', sql: 'select avg(price)\nfrom book;', result: { columns: ['avg(price)'], rows: [[averagePrice]] }, explanation: '전체 10권의 정가 평균은 14450원입니다. 집계 결과 한 값이므로 비교 연산자를 사용할 수 있습니다.', next: '바깥 price > (...)의 비교 기준으로 전달합니다.' },
      { title: '평균보다 비싼 도서', table: 'Book → bookname, price', sql: `select bookname, price\nfrom book\nwhere price > ${averagePrice};`, result: { columns: ['bookname', 'price'], rows: books.filter(book => book.price > averagePrice).map(book => [book.bookname, book.price]) }, explanation: '평균보다 비싼 축구의 이해·골프 바이블·야구의 추억이 나옵니다.', next: '직접 쓴 평균값을 AVG 부속질의로 바꿉니다.' },
    ],
  },
  {
    title: 'NOT IN · 한 번도 팔리지 않은 도서', question: '주문 내역이 한 번도 없는 도서의 도서명과 출판사를 부속질의로 검색하시오.', nesting: 1,
    sql: 'select bookname, publisher\nfrom book\nwhere bookid not in (\n  select bookid\n  from orders\n  where bookid is not null\n);',
    hint: 'Orders에서 팔린 bookid 목록을 만들고 Book에서 그 목록에 없는 도서를 고릅니다.',
    caution: 'NOT IN의 내부 결과에 NULL이 섞이면 예상한 미판매 도서가 나오지 않을 수 있어 IS NOT NULL을 넣었습니다. 특정 고객이 안 산 책과 아무도 사지 않은 책은 다릅니다.',
    steps: [
      { title: '팔린 도서번호 목록', table: 'Orders → bookid', sql: 'select bookid\nfrom orders\nwhere bookid is not null;', result: { columns: ['bookid'], rows: orders.map(order => [order.bookid]) }, explanation: '주문 건마다 도서번호가 나와 중복될 수 있지만, NOT IN은 목록에 포함되는지만 검사합니다.', next: '이 목록에 없는 Book 행을 찾습니다.' },
      { title: '목록에 없는 도서', table: 'Book → bookname, publisher', sql: `select bookname, publisher\nfrom book\nwhere bookid not in (${purchasedBookIds.join(', ')});`, result: { columns: ['bookname', 'publisher'], rows: books.filter(book => !purchasedBookIds.includes(book.bookid)).map(book => [book.bookname, book.publisher]) }, explanation: '골프 바이블과 올림픽 이야기는 주문이 한 번도 없습니다.', next: '번호 목록을 주문의 bookid 부속질의로 바꿉니다.' },
    ],
  },
  {
    title: '중첩 IN · 대한민국 고객이 구매한 도서', question: '대한민국에 거주하는 고객이 구매한 도서의 도서명을 부속질의로 검색하시오. 같은 도서는 한 번만 출력하시오.', nesting: 2,
    sql: "select bookname\nfrom book\nwhere bookid in (\n  select bookid\n  from orders\n  where custid in (\n    select custid\n    from customer\n    where address like '%대한민국%'\n  )\n);",
    hint: 'Customer의 주소 → 해당 고객의 custid → Orders의 bookid → Book의 bookname 순서입니다.',
    caution: '주소에는 도시명도 포함되어 있으므로 LIKE와 %를 사용합니다. 가장 바깥을 Book으로 두면 같은 책의 주문이 여러 건이어도 도서 행은 한 번만 출력됩니다.',
    steps: [
      { title: '대한민국 고객번호', table: 'Customer → custid', sql: "select custid\nfrom customer\nwhere address like '%대한민국%';", result: { columns: ['custid'], rows: domesticCustomers.map(customer => [customer.custid]) }, explanation: '고객번호 2, 3, 5를 찾습니다. 주문이 없는 박세리도 이 단계에는 포함됩니다.', next: 'Orders에서 이 고객들의 주문을 찾습니다.' },
      { title: '해당 고객의 구매 도서번호', table: 'Orders → bookid', sql: `select bookid\nfrom orders\nwhere custid in (${domesticCustomers.map(customer => customer.custid).join(', ')});`, result: { columns: ['bookid'], rows: domesticOrders.map(order => [order.bookid]) }, explanation: '도서번호 5, 6, 10, 10, 8이 나옵니다. 박세리는 주문이 없으므로 구매 도서번호를 만들지 않습니다.', next: '중복된 번호를 그대로 IN에 전달해도 됩니다.' },
      { title: '도서명 출력', table: 'Book → bookname', sql: `select bookname\nfrom book\nwhere bookid in (${domesticOrders.map(order => order.bookid).join(', ')});`, result: { columns: ['bookname'], rows: books.filter(book => domesticOrders.some(order => order.bookid === book.bookid)).map(book => [book.bookname]) }, explanation: 'Book의 5, 6, 8, 10번 도서가 각각 한 번씩 출력됩니다. 정렬 조건이 없으면 출력 순서는 보장되지 않습니다.', next: '고객번호와 도서번호 목록을 각각 SELECT로 바꿉니다.' },
    ],
  },
  {
    title: '3중 IN · 김연아와 같은 책을 산 고객', question: '김연아가 구매한 도서 중 한 권 이상을 구매한 다른 고객의 이름을 부속질의로 검색하시오. 김연아라는 이름의 고객은 제외하시오.', nesting: 3,
    sql: "select name\nfrom customer\nwhere name <> '김연아'\n  and custid in (\n    select custid\n    from orders\n    where bookid in (\n      select bookid\n      from orders\n      where custid in (\n        select custid\n        from customer\n        where name = '김연아'\n      )\n    )\n  );",
    hint: '김연아의 고객번호 → 김연아의 구매 도서번호 → 그 책을 산 모든 고객번호 → 김연아를 제외한 고객 이름입니다.',
    caution: 'Orders를 두 번 조회하지만 역할이 다릅니다. 안쪽은 김연아가 산 책을 찾고, 바깥쪽 Orders는 그 책을 산 다른 사람까지 찾습니다. 각 목록은 여러 행일 수 있어 IN을 사용합니다.',
    steps: [
      { title: '김연아의 고객번호', table: 'Customer → custid', sql: "select custid\nfrom customer\nwhere name = '김연아';", result: { columns: ['custid'], rows: kimCustomers.map(customer => [customer.custid]) }, explanation: '김연아의 고객번호는 2입니다.', next: '김연아의 주문을 찾습니다.' },
      { title: '김연아가 구매한 책', table: 'Orders → bookid', sql: `select bookid\nfrom orders\nwhere custid in (${kimCustomers.map(customer => customer.custid).join(', ')});`, result: { columns: ['bookid'], rows: kimOrders.map(order => [order.bookid]) }, explanation: '5번 피겨 교본과 10번 Olympic Champions를 샀습니다.', next: '이제 고객 조건을 버리고 책 번호로 모든 주문을 찾습니다.' },
      { title: '그 책을 산 모든 고객', table: 'Orders → custid', sql: `select custid\nfrom orders\nwhere bookid in (${kimOrders.map(order => order.bookid).join(', ')});`, result: { columns: ['custid'], rows: sharedOrders.map(order => [order.custid]) }, explanation: '고객번호 2와 3이 포함됩니다. 김연아 본인도 아직 포함되어 있습니다.', next: 'Customer에서 이름을 찾으면서 김연아를 제외합니다.' },
      { title: '다른 고객 이름', table: 'Customer → name', sql: `select name\nfrom customer\nwhere name <> '김연아'\n  and custid in (${sharedOrders.map(order => order.custid).join(', ')});`, result: { columns: ['name'], rows: customers.filter(customer => customer.name !== '김연아' && sharedOrders.some(order => order.custid === customer.custid)).map(customer => [customer.name]) }, explanation: '10번 책을 함께 구매한 장미란이 나옵니다. 모든 책을 똑같이 산 고객이 아니라 한 권 이상 겹치는 고객입니다.', next: '각 번호 목록을 앞 단계의 부속질의로 연결합니다.' },
    ],
  },
  {
    title: 'IN + NOT IN · 같은 출판사의 아직 안 산 책', question: '박지성이 구매한 책의 출판사들이 출판한 도서 중 박지성이 직접 구매하지 않은 도서의 도서명을 부속질의로 검색하시오.', nesting: 3,
    sql: "select bookname\nfrom book\nwhere publisher in (\n  select publisher\n  from book\n  where bookid in (\n    select bookid\n    from orders\n    where custid in (\n      select custid\n      from customer\n      where name = '박지성'\n    )\n  )\n)\nand bookid not in (\n  select bookid\n  from orders\n  where bookid is not null\n    and custid in (\n      select custid\n      from customer\n      where name = '박지성'\n    )\n);",
    hint: '앞서 푼 “구매한 책의 출판사 전체 도서” 조건에 AND로 “박지성의 구매 도서번호에 없는 책” 조건을 추가합니다.',
    caution: 'NOT IN에는 전체 주문이 아닌 박지성의 주문만 넣어야 합니다. 다른 고객이 구매한 책이어도 박지성이 구매하지 않았다면 결과에 포함됩니다. 중첩 깊이는 전체 SELECT 수와 다릅니다.',
    steps: [
      { title: '박지성이 구매한 도서번호', table: 'Orders → bookid', sql: "select bookid\nfrom orders\nwhere custid in (select custid from customer where name = '박지성');", result: { columns: ['bookid'], rows: parkOrders.map(order => [order.bookid]) }, explanation: '1, 3, 2번 책입니다. 이 목록을 출판사 검색과 구매 제외 조건 양쪽에서 사용합니다.', next: '책 번호를 출판사 목록으로 바꿉니다.' },
      { title: '구매한 책의 출판사', table: 'Book → publisher', sql: `select publisher\nfrom book\nwhere bookid in (${parkOrders.map(order => order.bookid).join(', ')});`, result: { columns: ['publisher'], rows: parkBooks.map(book => [book.publisher]) }, explanation: '굿스포츠·나무수·대한미디어가 후보 출판사입니다.', next: '같은 출판사라는 조건과 구매하지 않았다는 조건을 함께 적용합니다.' },
      { title: '후보 도서 중 구매한 책 제외', table: 'Book → bookname', sql: `select bookname\nfrom book\nwhere publisher in (${parkPublishers.map(publisher => `'${publisher}'`).join(', ')})\n  and bookid not in (${parkOrders.map(order => order.bookid).join(', ')});`, result: { columns: ['bookname'], rows: relatedBooks.filter(book => !parkOrders.some(order => order.bookid === book.bookid)).map(book => [book.bookname]) }, explanation: '골프 바이블·피겨 교본·역도 단계별기술이 나옵니다. 피겨 교본과 역도 단계별기술은 다른 고객이 샀지만 박지성은 사지 않았습니다.', next: '각 목록을 부속질의로 바꾸면 출판사 조건과 미구매 조건을 함께 만족하는 질의가 됩니다.' },
    ],
  },
]
