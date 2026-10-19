import type { SchemaExercise } from './schemaExercises'

const student = `CREATE TABLE StudyStudent (
  studentid INT PRIMARY KEY,
  name VARCHAR(20) NOT NULL,
  age INT,
  department VARCHAR(30)
);`
const students = `${student}
INSERT INTO StudyStudent VALUES
  (1,'김민수',20,'컴퓨터공학과'),
  (2,'이서연',22,'경영학과'),
  (3,'박지호',21,'컴퓨터공학과'),
  (4,'최유진',23,'디자인학과'),
  (5,'정하늘',20,'경영학과'),
  (6,'한도윤',24,'컴퓨터공학과');`
const book = `CREATE TABLE StudyBook (
  bookid INT PRIMARY KEY,
  bookname VARCHAR(40) NOT NULL,
  price INT DEFAULT 10000
);`
const books = `${book}
INSERT INTO StudyBook VALUES
  (101,'SQL 첫걸음',10000),
  (102,'파이썬 입문',18000),
  (103,'알고리즘 기초',24000),
  (104,'웹 디자인',15000),
  (105,'자료구조 연습',22000),
  (106,'컴퓨터 개론',9000);`
const loan = `CREATE TABLE StudyLoan (
  loanid INT PRIMARY KEY,
  studentid INT NOT NULL,
  FOREIGN KEY (studentid) REFERENCES StudyStudent(studentid) ON DELETE CASCADE
);`
const loans = `${students}\n${loan}
INSERT INTO StudyLoan VALUES (201,1),(202,1),(203,3),(204,5);`

function exercise(command: string, number: number, title: string, task: string, setup: string, answer: string, tip: string): SchemaExercise {
  return { id: `command-${command.toLowerCase()}-${number}`, group: `추가 문제 · ${command}`, title: `${command} ${number} · ${title}`, task, setup, answer, tip, source: '자료 범위 응용 · 추가 연습 문제', starter: '-- 문제의 조건에 맞는 SQL을 작성하세요.\n' }
}

export const commandExercises: SchemaExercise[] = [
  exercise('CREATE', 1, '학생 테이블 만들기', 'StudyStudent를 만드세요. studentid는 INT 기본키, name은 VARCHAR(20) NOT NULL, age는 INT, department는 VARCHAR(30)입니다.', '', student, 'CREATE TABLE은 열 이름·자료형·제약조건을 정의합니다. 실행 후 구조에서 기본키와 NULL 허용 여부를 확인하세요.'),
  exercise('CREATE', 2, '자동 증가 회원 번호', 'StudyMember를 만드세요. num은 INT AUTO_INCREMENT 기본키, id와 pwd는 VARCHAR(20) NOT NULL, name은 VARCHAR(20)입니다.', '', 'CREATE TABLE StudyMember (\n  num INT AUTO_INCREMENT PRIMARY KEY,\n  id VARCHAR(20) NOT NULL,\n  pwd VARCHAR(20) NOT NULL,\n  name VARCHAR(20)\n);', 'AUTO_INCREMENT는 MySQL의 자동 번호 생성 문법입니다. INCR로 줄여 쓸 수 없습니다.'),
  exercise('CREATE', 3, '가격 기본값 지정하기', 'StudyBook을 만드세요. bookid는 INT 기본키, bookname은 VARCHAR(40) NOT NULL, price는 INT이고 값을 생략했을 때 기본값은 10000입니다.', '', book, 'DEFAULT 10000은 INSERT에서 price를 생략했을 때 적용됩니다. NULL을 직접 입력하는 것과 구별하세요.'),
  exercise('CREATE', 4, '연쇄 삭제 외래키', '준비된 StudyStudent를 참조하는 StudyLoan을 만드세요. loanid는 INT 기본키, studentid는 INT NOT NULL입니다. StudyLoan.studentid가 StudyStudent.studentid를 참조하며 학생 삭제 시 해당 학생의 대출 행도 자동 삭제되도록 하세요.', students, loan, 'FOREIGN KEY의 studentid는 StudyLoan의 열이고 REFERENCES 뒤의 studentid는 StudyStudent의 열입니다.'),

  exercise('ALTER', 1, '전화번호 열 추가', '준비된 StudyStudent에 phone VARCHAR(20) 열을 추가하세요. 기존 학생 행은 유지하세요.', students, 'ALTER TABLE StudyStudent ADD COLUMN phone VARCHAR(20);', 'ADD COLUMN은 열을 추가합니다. 새 phone 값은 기본값이 없으므로 기존 행에서 NULL로 표시됩니다.'),
  exercise('ALTER', 2, '자료형과 NOT NULL 유지', 'StudyStudent의 name을 VARCHAR(40)으로 바꾸세요. 기존 NOT NULL 조건을 유지하고 다른 열과 값은 바꾸지 마세요.', students, 'ALTER TABLE StudyStudent MODIFY COLUMN name VARCHAR(40) NOT NULL;', 'MODIFY에는 자료형을 함께 적습니다. 유지할 NOT NULL 같은 열 속성도 명시하세요.'),
  exercise('ALTER', 3, '열 이름과 자료형 변경', 'StudyStudent의 department 열 이름을 major로 바꾸면서 자료형도 VARCHAR(40)으로 변경하세요. 저장된 학과명은 유지하세요.', students, 'ALTER TABLE StudyStudent CHANGE COLUMN department major VARCHAR(40);', 'CHANGE는 기존 열 이름, 새 열 이름, 자료형 순서입니다. MODIFY는 열 이름을 변경하지 않습니다.'),
  exercise('ALTER', 4, '기존 열에 기본키 추가', 'StudyCode(code INT, label VARCHAR(20))가 준비되어 있고 아직 기본키는 없습니다. 기존 code 열을 기본키로 지정하세요. code의 값은 NULL 없이 모두 다릅니다.', "CREATE TABLE StudyCode (code INT, label VARCHAR(20));\nINSERT INTO StudyCode VALUES (10,'입문'),(20,'기초'),(30,'응용');", 'ALTER TABLE StudyCode ADD PRIMARY KEY (code);', 'ADD PRIMARY KEY는 기존 열에 기본키 제약조건을 추가합니다. 새 code 열을 만드는 명령이 아닙니다.'),

  exercise('DROP', 1, '열만 삭제하기', 'StudyStudent에서 phone 열만 삭제하세요. 학생 테이블과 나머지 열·행은 남겨야 합니다.', `${students}\nALTER TABLE StudyStudent ADD COLUMN phone VARCHAR(20);`, 'ALTER TABLE StudyStudent DROP COLUMN phone;', 'DROP COLUMN은 열 자체를 삭제합니다. DELETE는 행을 삭제하는 명령입니다.'),
  exercise('DROP', 2, '데이터가 있는 테이블 삭제', '도서 6행이 저장된 StudyBook을 구조와 데이터까지 모두 삭제하세요. 기본 실습의 Book 테이블은 삭제하지 마세요.', books, 'DROP TABLE StudyBook;', 'DROP TABLE은 테이블 정의와 행을 함께 없앱니다. 실행 후 테이블 목록에서 StudyBook이 사라집니다.'),
  exercise('DROP', 3, '자식 테이블부터 삭제하기', 'StudyLoan이 StudyStudent를 참조하고 있습니다. 두 테이블을 모두 삭제하세요. 외래키 때문에 실패하지 않도록 자식 테이블부터 삭제하세요.', loans, 'DROP TABLE StudyLoan;\nDROP TABLE StudyStudent;', 'ON DELETE CASCADE는 부모 행을 DELETE할 때의 규칙입니다. 이 실습에서는 참조 중인 부모 테이블의 DROP을 거절하므로 자식 테이블부터 삭제합니다.'),
  exercise('DROP', 4, '여러 테이블 구조 정리', '독립적으로 준비된 StudyStudent와 StudyBook 두 테이블을 모두 삭제하세요. 기본 실습 테이블 Book·Customer·Orders는 그대로 두세요.', `${students}\n${books}`, 'DROP TABLE StudyStudent;\nDROP TABLE StudyBook;', '이 문제의 두 테이블 사이에는 외래키가 없어 삭제 순서는 상관없습니다. 두 DROP TABLE 문을 각각 작성하세요.'),

  exercise('INSERT', 1, '학생 한 명 추가', 'StudyStudent에 studentid=7, name=오지우, age=21, department=디자인학과인 학생을 추가하세요. 기존 6행은 유지하세요.', students, "INSERT INTO StudyStudent (studentid,name,age,department)\nVALUES (7,'오지우',21,'디자인학과');", '열 목록과 VALUES의 값은 같은 순서로 대응합니다. 실행 후 7행인지 확인하세요.'),
  exercise('INSERT', 2, '여러 행 한 번에 추가', 'StudyBook에 (107, 데이터베이스 실습, 16000), (108, 운영체제 입문, 20000)을 INSERT 한 문장으로 추가하세요. 값은 bookid·bookname·price 순서입니다.', books, "INSERT INTO StudyBook (bookid,bookname,price)\nVALUES (107,'데이터베이스 실습',16000),\n       (108,'운영체제 입문',20000);", 'VALUES 뒤에 괄호로 묶은 행들을 쉼표로 연결합니다. 기존 6행에 2행이 추가됩니다.'),
  exercise('INSERT', 3, '자동 번호와 기본값 사용', 'StudyAccount에 loginid=apple인 회원을 추가하세요. accountid는 AUTO_INCREMENT, points는 DEFAULT 100으로 정의되어 있습니다. 두 열을 INSERT 열 목록에서 생략해 자동 번호와 기본값을 사용하세요.', 'CREATE TABLE StudyAccount (accountid INT AUTO_INCREMENT PRIMARY KEY, loginid VARCHAR(20) NOT NULL, points INT DEFAULT 100);', "INSERT INTO StudyAccount (loginid) VALUES ('apple');", '첫 행의 accountid는 1, points는 100입니다. AUTO_INCREMENT와 DEFAULT는 서로 다른 기능입니다.'),
  exercise('INSERT', 4, '미정인 값은 NULL', 'StudyBook에 bookid=107, bookname=네트워크 기초를 추가하세요. 가격은 기본값이 아니라 미정(NULL)으로 명시해야 합니다.', books, "INSERT INTO StudyBook (bookid,bookname,price)\nVALUES (107,'네트워크 기초',NULL);", "NULL에는 따옴표를 붙이지 않습니다. price를 생략하면 10000이 들어가므로 이 문제의 조건과 다릅니다."),

  exercise('UPDATE', 1, '학생 한 명의 나이 수정', 'StudyStudent에서 studentid=1인 학생의 나이만 21로 바꾸세요. 다른 학생과 학과명은 바꾸지 마세요.', students, 'UPDATE StudyStudent SET age=21 WHERE studentid=1;', '이름 대신 기본키로 한 행을 지정합니다. WHERE를 빼면 모든 학생의 나이가 21로 바뀝니다.'),
  exercise('UPDATE', 2, '여러 열을 함께 수정', 'StudyStudent에서 studentid=2인 학생의 age를 23, department를 컴퓨터공학과로 한 문장에서 변경하세요.', students, "UPDATE StudyStudent\nSET age=23, department='컴퓨터공학과'\nWHERE studentid=2;", 'SET 안의 열 대입은 쉼표로 구분합니다. AND는 이 문장의 열 대입 구분자가 아닙니다.'),
  exercise('UPDATE', 3, '기존 가격에 더하기', 'StudyBook에서 현재 가격이 15000 이상인 도서만 각각 2000원 인상하세요. 15000원인 도서도 포함하세요.', books, 'UPDATE StudyBook SET price=price+2000 WHERE price>=15000;', '조건을 만족하는 도서는 102·103·104·105번입니다. price=2000으로 쓰면 인상이 아니라 일괄 2000원으로 변경됩니다.'),
  exercise('UPDATE', 4, '조건을 조합해 수정', 'StudyStudent에서 컴퓨터공학과이면서 나이가 21 이상인 학생의 학과만 소프트웨어학과로 변경하세요.', students, "UPDATE StudyStudent\nSET department='소프트웨어학과'\nWHERE department='컴퓨터공학과' AND age>=21;", '두 조건을 모두 만족하는 3번·6번 학생만 변경됩니다. OR로 연결하면 대상이 달라집니다.'),

  exercise('DELETE', 1, '기본키로 한 행 삭제', 'StudyStudent에서 studentid=4인 학생 행만 삭제하세요. 테이블 구조와 다른 학생은 남겨야 합니다.', students, 'DELETE FROM StudyStudent WHERE studentid=4;', 'DELETE FROM 뒤에는 테이블 이름을 씁니다. 열 이름을 지정하는 DELETE COLUMN 문법은 없습니다.'),
  exercise('DELETE', 2, '조건에 맞는 여러 행 삭제', 'StudyBook에서 가격이 15000 미만인 도서 행을 모두 삭제하세요. 15000원인 도서는 남겨야 합니다.', books, 'DELETE FROM StudyBook WHERE price<15000;', '101번·106번 도서만 삭제됩니다. 미만은 <, 이하는 <=입니다.'),
  exercise('DELETE', 3, '구조를 남기고 전체 행 삭제', 'StudyBook의 모든 도서 행을 삭제하세요. 이후 새 도서를 넣을 수 있도록 테이블과 열·기본키·기본값은 유지하세요.', books, 'DELETE FROM StudyBook;', 'WHERE가 없으면 모든 행을 삭제합니다. 실행 후 StudyBook은 남고 데이터 행 수만 0이 됩니다.'),
  exercise('DELETE', 4, '연쇄 삭제 결과 확인', 'StudyStudent에서 studentid=1인 학생을 삭제하세요. StudyLoan.studentid에는 ON DELETE CASCADE가 설정되어 있습니다. 대출 행을 직접 DELETE하지 말고 학생 DELETE 한 문장만 작성하세요.', loans, 'DELETE FROM StudyStudent WHERE studentid=1;', '학생 1번의 대출 201·202번도 자동 삭제됩니다. 대출 203·204번과 다른 학생은 남습니다. 아래 테이블 선택에서 StudyLoan을 골라 확인하세요.'),
]
