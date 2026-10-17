import { ddlExamples } from './sqlLessonData'

export type SchemaExercise = { id: string; group: string; title: string; task: string; source: string; setup: string; answer: string; starter: string; tip: string }
const newBook = 'CREATE TABLE NewBook (bookid INTEGER, bookname VARCHAR(20), publisher VARCHAR(20), price INTEGER);'
const newCustomer = ddlExamples[1].code
const member = 'CREATE TABLE member (num INT AUTO_INCREMENT PRIMARY KEY, id VARCHAR(20) NOT NULL, pwd VARCHAR(20) NOT NULL, name CHAR(20), phone CHAR(20), age INT);'
const ddlSetup: Record<number, string> = {
  34: '', 35: '', 36: newCustomer, 37: newBook, 38: `${newBook}\nALTER TABLE NewBook ADD isbn VARCHAR(13);`,
  39: `${newBook}\nALTER TABLE NewBook ADD isbn VARCHAR(13);`, 40: newBook, 41: newBook, 42: newBook,
  43: `${newCustomer}\n${ddlExamples[2].code}`,
}
const tasks: Record<number, string> = {
  34: 'NewBook을 생성하세요. bookid는 INTEGER, bookname과 publisher는 VARCHAR(20), price는 INTEGER입니다. 기본키는 bookid로 지정하세요.',
  35: 'NewCustomer를 생성하세요. custid는 INTEGER 기본키, name과 address는 VARCHAR(40), phone은 VARCHAR(30)입니다.',
  36: 'NewOrders를 생성하세요. orderid는 INTEGER 기본키, custid와 bookid는 INTEGER NOT NULL, saleprice는 INTEGER, orderdate는 DATE입니다. custid는 NewCustomer(custid)를 참조하고 부모 삭제 시 연쇄 삭제합니다. NewCustomer는 준비되어 있습니다.',
  37: '준비된 NewBook에 isbn VARCHAR(13) 열을 추가하세요.',
  38: '준비된 NewBook의 isbn 열을 INTEGER로 바꾸세요. 기존 isbn 값은 없어 자료형 변환이 가능합니다.',
  39: '준비된 NewBook에서 isbn 열을 삭제하세요.',
  40: '준비된 NewBook의 bookid를 INTEGER NOT NULL로 바꾸세요.',
  41: '기본키가 없는 NewBook에서 bookid를 기본키로 지정하세요. bookid에 중복 값이나 NULL은 없습니다.',
  42: '준비된 NewBook 테이블을 구조와 함께 삭제하세요.',
  43: 'NewCustomer를 삭제해 보세요. NewOrders가 참조하므로 처음에는 거절됩니다. 원인을 확인하고 자식 테이블부터 삭제한 뒤 부모를 삭제하세요.',
}
export const schemaExercises: SchemaExercise[] = [
  { id: 'free', group: '자유 실습', title: '자유롭게 생성·변경·조회하기', task: '실습용 madang에는 Book·Customer·Orders의 복사본이 있습니다. 새 테이블을 만들거나 실습 DB를 생성해 여러 명령을 이어서 실행하세요.', source: '자료 범위 자유 실습', setup: '', answer: '', starter: 'SHOW TABLES;', tip: '한 번 실행한 변경은 이 실습을 떠나거나 DB를 초기화하기 전까지 유지됩니다. 예제 선택 시에는 필요한 선행 테이블을 갖춘 새 실습으로 바뀝니다.' },
  { id: 'database', group: '정의어 · DB 준비', title: 'CREATE DATABASE · USE', task: 'exDB 데이터베이스를 생성한 뒤 USE로 선택하세요. SHOW DATABASES와 SHOW TABLES로 상태를 확인할 수 있습니다.', source: 'SQL 기초 24장', setup: '', answer: 'CREATE DATABASE exDB;\nUSE exDB;\nSHOW TABLES;', starter: '-- exDB를 만들고 선택하세요.\n', tip: 'CREATE DATABASE는 DB를 만들고, USE는 이후 명령을 실행할 DB를 선택합니다. 이름은 대소문자를 구분하지 않는 실습 공간으로 관리합니다.' },
  ...ddlExamples.map(item => ({ id: `ddl-${item.number}`, group: item.number <= 36 ? '정의어 · 테이블 생성' : item.number <= 41 ? '정의어 · 구조 변경' : '정의어 · 테이블 삭제', title: `3-${item.number} · ${item.title}`, task: tasks[item.number], source: `SQL 기초 ${item.number === 34 ? '17' : item.number === 35 ? '19' : item.number === 36 ? '20' : item.number <= 41 ? '22' : '23'}장`, setup: ddlSetup[item.number], answer: item.code, starter: `-- ${tasks[item.number]}\n`, tip: item.note })),
  { id: 'compound', group: '정의어 · 테이블 생성', title: '복합키·UNIQUE·DEFAULT·CHECK', task: 'NewBook을 bookname VARCHAR(20) NOT NULL, publisher VARCHAR(20) UNIQUE, price INTEGER로 만드세요. (bookname, publisher)를 복합 기본키로 지정하고 가격 기본값은 10000, 최소 가격은 1000 이상으로 설정하세요.', source: 'SQL 기초 18장', setup: '', answer: 'CREATE TABLE NewBook (\n bookname VARCHAR(20) NOT NULL,\n publisher VARCHAR(20) UNIQUE,\n price INTEGER DEFAULT 10000 CHECK (price >= 1000),\n PRIMARY KEY (bookname, publisher)\n);', starter: '-- 열 정의와 네 종류의 제약조건을 작성하세요.\n', tip: '슬라이드의 “1,000원 이상”에 맞춰 >= 1000으로 정리했습니다. publisher UNIQUE는 복합 기본키와 별개의 제약입니다.' },
  { id: 'member-create', group: '정의어 · member 실습', title: 'member · AUTO_INCREMENT', task: 'member를 생성하세요. num은 INT AUTO_INCREMENT 기본키, id와 pwd는 VARCHAR(20) NOT NULL, name과 phone은 CHAR(20), age는 INT입니다.', source: 'SQL 기초 25~26장', setup: '', answer: member, starter: '-- member 테이블을 만드세요.\n', tip: 'num을 생략한 INSERT를 실행하면 번호가 생성됩니다. DESC member;로 구조를 확인하세요. VARCHAR의 길이 제한 등은 실제 MySQL과 차이가 있습니다.' },
  { id: 'member-add', group: '정의어 · member 실습', title: 'member · 주소 열 추가', task: '준비된 member에 addr CHAR(30) 열을 추가하세요.', source: 'SQL 기초 28장', setup: member, answer: 'ALTER TABLE member ADD COLUMN addr CHAR(30);', starter: '-- addr 열을 추가하세요.\n', tip: '기존 열과 값은 유지하며 addr 열을 끝에 추가합니다.' },
  { id: 'member-drop', group: '정의어 · member 실습', title: 'member · 주소 열 삭제', task: '준비된 member에서 addr 열을 삭제하세요.', source: 'SQL 기초 29장', setup: `${member}\nALTER TABLE member ADD COLUMN addr CHAR(30);`, answer: 'ALTER TABLE member DROP COLUMN addr;', starter: '-- addr 열을 삭제하세요.\n', tip: '열을 삭제하면 해당 열에 저장된 값도 사라집니다.' },
  { id: 'member-change', group: '정의어 · member 실습', title: 'member · 열 이름 변경', task: 'member의 phone을 tel로 바꾸고 자료형을 VARCHAR(30)으로 지정하세요.', source: 'SQL 기초 30장', setup: member, answer: 'ALTER TABLE member CHANGE COLUMN phone tel VARCHAR(30);', starter: '-- phone → tel, VARCHAR(30)\n', tip: 'CHANGE는 기존 이름·새 이름·열 정의를 함께 씁니다.' },
  { id: 'member-modify', group: '정의어 · member 실습', title: 'member · 열 자료형 변경', task: 'member의 tel 열을 INT로 바꾸세요. 실습 시작 시 행은 없어 문자 값 변환 문제는 없습니다.', source: 'SQL 기초 31장', setup: `${member}\nALTER TABLE member CHANGE COLUMN phone tel VARCHAR(30);`, answer: 'ALTER TABLE member MODIFY COLUMN tel INT;', starter: '-- tel의 자료형만 바꾸세요.\n', tip: '숫자로 바꿀 수 없는 전화번호가 저장되어 있다면 먼저 데이터를 정리해야 합니다. 실제 전화번호 저장에는 문자형이 적합하며 이 문제는 문법 연습입니다.' },
  { id: 'member-rename', group: '정의어 · member 실습', title: 'member · 테이블 이름 변경', task: '준비된 member 테이블의 이름을 mem으로 바꾸세요.', source: 'SQL 기초 32장', setup: member, answer: 'RENAME TABLE member TO mem;', starter: '-- 테이블 이름을 바꾸세요.\n', tip: 'SHOW TABLES;와 DESC mem;으로 변경을 확인하세요.' },
  { id: 'member-insert', group: '데이터 변경 · INSERT', title: 'member · 값 넣고 자동 번호 확인', task: 'member에 id=hong, pwd=1111, name=홍성희, phone=010-2222-1234, age=22인 행을 넣으세요. num은 생략하세요.', source: 'SQL 기초 27장 · 생성문과 맞춰 테이블·열 이름 통일', setup: member, answer: "INSERT INTO member (id,pwd,name,phone,age)\nVALUES ('hong','1111','홍성희','010-2222-1234',22);\nSELECT * FROM member;", starter: '-- num은 입력하지 않습니다.\n', tip: '슬라이드의 member/mem, phone/tel 혼용을 피하려고 이 독립 예제에서는 생성문의 member와 phone을 사용합니다.' },
  { id: 'insert-priced', group: '데이터 변경 · INSERT', title: '3-44 · 가격이 있는 도서 추가', task: 'Book에 bookid=11, 도서명=스포츠 의학, 출판사=한솔의학서적, 가격=90000인 행을 추가하세요.', source: '부질의 외 24장', setup: '', answer: "INSERT INTO Book (bookid,bookname,publisher,price)\nVALUES (11,'스포츠 의학','한솔의학서적',90000);", starter: '-- 새 도서 행을 추가하세요.\n', tip: '이 실습에서의 bookid 11은 중복되지 않습니다.' },
  { id: 'insert-null', group: '데이터 변경 · INSERT', title: '3-45 · 가격이 미정인 도서 추가', task: 'Book에 bookid=11인 스포츠 의학을 추가하되 가격은 미정(NULL)으로 저장하세요. 출판사는 한솔의학서적입니다.', source: '부질의 외 25장', setup: '', answer: "INSERT INTO Book (bookid,bookname,publisher,price)\nVALUES (11,'스포츠 의학','한솔의학서적',NULL);", starter: '-- 가격은 문자열이 아닌 NULL입니다.\n', tip: "'NULL'은 문자열입니다. SQL의 NULL은 따옴표 없이 씁니다." },
  { id: 'update-address', group: '데이터 변경 · UPDATE', title: '3-47 · 고객 주소 수정', task: '고객번호 5인 고객의 주소만 대한민국 부산으로 변경하세요.', source: '부질의 외 28장', setup: '', answer: "UPDATE Customer SET address='대한민국 부산' WHERE custid=5;", starter: '-- custid=5인 행만 변경하세요.\n', tip: 'WHERE를 빼면 모든 고객이 변경됩니다.' },
  { id: 'delete-customer', group: '데이터 변경 · DELETE', title: '3-49 · 주문이 없는 고객 삭제', task: 'Customer에서 고객번호 5인 고객을 삭제하세요.', source: '부질의 외 30장', setup: '', answer: 'DELETE FROM Customer WHERE custid=5;', starter: '-- 고객번호 5인 행을 삭제하세요.\n', tip: '기본 데이터에서 5번 고객은 주문이 없어 삭제할 수 있습니다.' },
  { id: 'delete-all', group: '데이터 변경 · DELETE', title: '3-50 · 전체 고객 삭제와 외래키', task: 'DELETE FROM Customer;를 시도하고 외래키 오류를 확인하세요. 이어서 Orders 행을 먼저 삭제한 뒤 전체 Customer 행을 삭제하세요.', source: '부질의 외 30장', setup: '', answer: 'DELETE FROM Orders;\nDELETE FROM Customer;', starter: 'DELETE FROM Customer;', tip: 'Orders가 고객을 참조하고 있습니다. 데이터 전체 삭제와 테이블 DROP은 다릅니다.' },
]
