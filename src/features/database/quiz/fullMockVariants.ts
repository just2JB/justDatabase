import type { DataSet, FullMockQuestion } from './fullMockExams'
import type { ExamTable } from './relationMockExams'
import type { SqlRow } from '../sql/data/sqlLessonData'

// Later papers assess different decisions, not substitutions into round one's templates.
export function revisedQuestions(data: DataSet, round: 1 | 2): FullMockQuestion[] {
  const id = (n: number) => `full-${round + 1}-v2-${String(n).padStart(2, '0')}`
  const tables: ExamTable[] = [
    { caption: `${data.title} · Item`, data: { columns: ['item_id', 'name', 'category', 'price'], rows: data.items } },
    { caption: `${data.title} · Member`, data: { columns: ['member_id', 'name', 'city', 'phone'], rows: data.members } },
    { caption: `${data.title} · Purchase`, data: { columns: ['purchase_id', 'member_id', 'item_id', 'qty', 'paid'], rows: data.purchases } },
  ]
  const result: FullMockQuestion[] = []
  function c(n: number, unit: string, prompt: string, options: string[], correct: number, explanation: string) {
    result.push({ id: id(n), unit, kind: 'choice', prompt, options, correct, answer: options[correct], explanation })
  }
  function b(n: number, unit: string, prompt: string, answer: string, accepted: string[], explanation: string, code?: string) {
    result.push({ id: id(n), unit, kind: 'blank', prompt, answer, accepted, explanation, code })
  }
  function w(n: number, unit: string, prompt: string, answer: string, explanation: string, code?: string) {
    result.push({ id: id(n), unit, kind: 'written', prompt, answer, explanation, code })
  }
  function sql(n: number, unit: string, prompt: string, query: string, rows: SqlRow[], explanation: string) {
    result.push({ id: id(n), unit, kind: 'written', prompt, answer: query, explanation, tables, sqlCheck: { sql: query, rows } })
  }
  const firstCategory = data.items[0][2]
  const memberIds = new Set(data.purchases.map(p => p[1]))
  const boughtIds = new Set(data.purchases.map(p => p[2]))
  if (round === 1) {
    c(13, '관계 모델', 'Membership(member_id, club_id)의 기본키가 두 열의 조합이다. (1,10)이 있을 때 키 제약만으로 허용되는 추가 행은?', ['(1,10)', '(1,20)', '(NULL,20)', '(2,NULL)'], 1, '복합 기본키는 조합 전체가 유일해야 하며 구성 열 모두 NULL을 허용하지 않습니다. member_id 하나의 반복은 가능합니다.')
    w(14, '관계 모델', '이메일은 회원마다 유일하지만 NULL을 허용한다. 이메일을 곧바로 기본키로 정할 수 없는 이유와 대안을 쓰세요.', '기본키는 NULL을 허용하지 않으므로 이메일을 그대로 기본키로 쓸 수 없다. NULL이 없고 유일한 member_id를 기본키로 지정하고 이메일에는 필요한 별도 제약을 둔다.', '유일성만으로 기본키 조건을 모두 만족하는 것은 아닙니다. 이메일 중복 가능 여부와 NULL 허용 여부를 구분하세요.')
    c(15, '관계 모델', '구매가 3건인 회원번호가 Purchase에 3번 나타난다. member_id는 외래키다. 이 사실만으로 참조 무결성 위반인가?', ['외래키는 항상 유일해야 하므로 위반', '외래키는 반드시 NULL이어야 하므로 위반', '참조하는 회원이 존재하면 반복 자체는 위반이 아니다', '외래키는 기본키와 자료형이 달라야 하므로 위반'], 2, '일대다 관계에서 여러 자식 행이 같은 부모 키를 참조할 수 있습니다.')
    w(16, '관계 모델', 'Member에 없는 member_id=99를 Purchase의 외래키에 넣으려 한다. 제약을 유지하면서 올바르게 처리하는 두 가지 방향을 쓰세요.', '실제 존재하는 회원번호로 잘못된 값을 수정하거나, 정당한 신규 회원이라면 Member에 해당 회원을 먼저 등록한 뒤 구매를 넣는다.', '부모가 없는데 외래키 검사만 끄는 것은 무결성을 유지하는 해결책이 아닙니다.')
    c(17, '관계 모델', '회원 이름이 바뀌어도 구매 관계를 유지하려 한다. 연결 기준으로 가장 적절한 것은?', ['이름의 글자 수', '화면의 행 번호', '안정적인 회원 기본키', '주소의 일부 문자열'], 2, '이름은 중복·변경될 수 있습니다. 식별 키를 통해 관계를 연결합니다.')
    b(18, '관계 모델', '기본키에는 NULL이 없어야 한다는 제약을 ___ 무결성이라고 한다.', '개체', ['개체', '개체 무결성'], '개체 무결성과 외래키의 참조 무결성을 구분하세요.')
    w(19, '관계 모델', '한 칸에 전화번호 두 개를 쉼표로 묶어 저장했다. 관계 모델의 원자성과 연결해 문제점을 설명하세요.', '한 속성 값은 도메인에서 하나의 원자 값으로 다뤄져야 한다. 여러 전화번호를 하나의 목록으로 넣으면 개별 번호 검색·수정이 어려우므로 별도 행 등으로 구분해 표현한다.', '단순히 문자열에 쉼표가 있다는 이유가 아니라, 관리하려는 값이 여러 개라는 점을 설명해야 합니다.')
    c(20, '관계 모델', '구매 행 하나를 삭제했으나 열 정의는 바뀌지 않았다. 올바른 변화는?', ['차수 1 감소', '스키마의 열 이름 변경', '카디널리티 1 감소', '모든 도메인 변경'], 2, '행 삭제는 투플 수를 줄이지만 속성 수나 스키마를 바꾸지 않습니다.')
    w(21, 'SQL 정의어', 'Member를 참조하는 Favorite를 생성하세요. member_id와 item_id의 조합이 기본키이며 member_id는 Member(member_id)의 외래키입니다. 두 열은 INTEGER입니다.', 'CREATE TABLE Favorite (\n  member_id INTEGER,\n  item_id INTEGER,\n  PRIMARY KEY (member_id, item_id),\n  FOREIGN KEY (member_id) REFERENCES Member(member_id)\n);', '복합 기본키는 테이블 수준에서 두 열을 함께 지정합니다. 문제에서 요구한 외래키는 member_id입니다.')
    b(22, 'SQL 정의어', '태그명 중복을 금지한다. 빈칸의 제약조건은?', 'UNIQUE', ['UNIQUE'], 'UNIQUE는 중복을 제한합니다. NULL까지 금지하려면 NOT NULL을 별도로 지정합니다.', 'CREATE TABLE Tag (id INTEGER PRIMARY KEY, name VARCHAR(30) ___);')
    w(23, 'SQL 정의어', 'qty는 1 이상이어야 하고 값 생략·NULL도 허용하지 않는다. 정수형 열 정의 한 줄을 쓰세요.', 'qty INTEGER NOT NULL CHECK (qty >= 1)', 'CHECK와 NOT NULL이 둘 다 필요합니다. 기본값이 없으므로 값 생략도 허용되지 않는 조건입니다.')
    b(24, 'SQL 정의어', 'Member에서 더 이상 사용하지 않는 phone 열을 제거한다. 빈칸은?', 'DROP', ['DROP'], '열 하나의 제거는 ALTER TABLE ... DROP COLUMN이며 테이블 전체 제거와 다릅니다.', 'ALTER TABLE Member ___ COLUMN phone;')
    w(25, 'SQL 정의어', '자식 Purchase의 외래키가 ON DELETE SET NULL이고 해당 열은 NULL 허용이다. 부모 회원 행을 삭제하면 자식 구매 행은 어떻게 되는가?', '자식 구매 행은 남고 해당 member_id 값이 NULL로 바뀐다. 자식 행 자체를 지우는 CASCADE와 다르다.', '행 보존 여부와 외래키 값의 변화를 모두 설명하세요. 실제 정산 정책과는 별개로 제약의 동작을 묻는 문제입니다.')
    w(26, 'SQL 조작어', 'Item의 기존 1번 품목을 복사해 item_id=9, name은 원래 이름으로, category도 그대로, price는 1000 더한 새 행을 삽입하는 INSERT ... SELECT를 쓰세요. 9번은 없다고 가정합니다.', 'INSERT INTO Item (item_id, name, category, price)\nSELECT 9, name, category, price + 1000\nFROM Item WHERE item_id = 1;', 'VALUES 대신 SELECT 결과를 삽입합니다. 열 목록과 SELECT 값의 개수·순서가 같아야 합니다.')
    w(27, 'SQL 조작어', '연락처가 NULL인 회원만 phone을 미등록으로 수정하는 SQL을 쓰세요.', "UPDATE Member\nSET phone = '미등록'\nWHERE phone IS NULL;", 'IS NULL로 조건을 검사합니다. WHERE를 빼면 등록된 연락처까지 모두 변경됩니다.')
    w(28, 'SQL 조작어', 'Purchase에서 qty가 1이면서 paid가 10000 미만인 행만 삭제하는 SQL을 쓰세요.', 'DELETE FROM Purchase\nWHERE qty = 1 AND paid < 10000;', '두 조건을 모두 만족해야 하므로 AND입니다. 행 삭제는 테이블 구조를 제거하지 않습니다.')
    sql(29, 'SQL 검색', '분류가 첫 품목의 분류와 같은 품목을 제외하고 item_id, price를 조회하세요. item_id 오름차순입니다.', `SELECT item_id, price FROM Item\nWHERE category <> '${firstCategory}'\nORDER BY item_id;`, data.items.filter(i => i[2] !== firstCategory).map(i => [i[0], i[3]]), '제외 조건과 출력할 열을 구분합니다. 이 데이터의 category는 모두 NULL이 아닙니다.')
    b(30, 'SQL 검색', '이름의 두 번째 글자가 언더스코어 와일드카드 한 글자에 대응하도록 패턴을 쓴다. LIKE에서 정확히 한 글자를 뜻하는 문자는?', '_', ['_'], '%는 0글자 이상, _는 정확히 한 글자에 대응합니다.')
    sql(31, 'SQL 검색', '분류별 품목 수를 category, item_count로 조회하세요. category 오름차순입니다.', 'SELECT category, COUNT(*) AS item_count\nFROM Item\nGROUP BY category\nORDER BY category;', [...new Set(data.items.map(i => i[2]))].sort().map(category => [category, data.items.filter(i => i[2] === category).length]), '품목 행을 분류로 묶습니다. COUNT(*)는 각 분류에 속한 품목 행 수입니다.')
    sql(32, 'SQL 검색', '회원번호 1 또는 3의 구매만 골라 member_id, SUM(qty)를 조회하세요. member_id 오름차순입니다.', 'SELECT member_id, SUM(qty)\nFROM Purchase\nWHERE member_id IN (1, 3)\nGROUP BY member_id\nORDER BY member_id;', [1, 3].filter(mid => memberIds.has(mid)).map(mid => [mid, data.purchases.filter(p => p[1] === mid).reduce((sum, p) => sum + p[3], 0)]), 'WHERE에서 개별 구매를 거른 뒤 GROUP BY로 수량을 합산합니다. paid 합계가 아닙니다.')
    w(33, 'SQL 검색', 'AVG(phone)이 아니라 COUNT(phone)을 쓰는 이유를 자료형·NULL 관점에서 설명하고 COUNT(*)와 차이를 쓰세요.', '연락처는 수치 평균을 구할 측정값이 아니다. COUNT(phone)은 NULL 아닌 연락처 값의 개수를 세고 COUNT(*)는 연락처 유무와 관계없이 회원 행 전체를 센다.', '문자열을 숫자로 자동 변환해 평균을 내는 것과 연락처 등록 여부를 세는 것은 의미가 다릅니다.')
    sql(34, 'SQL 검색', '회원별 총 구매 수량이 3 이상인 회원의 member_id와 총 수량을 검색하세요. member_id 오름차순입니다.', 'SELECT member_id, SUM(qty) AS total_qty\nFROM Purchase\nGROUP BY member_id\nHAVING SUM(qty) >= 3\nORDER BY member_id;', [...memberIds].sort((a,b) => a-b).map(mid => [mid, data.purchases.filter(p => p[1] === mid).reduce((sum,p) => sum+p[3],0)]).filter(row => row[1] >= 3), '구매 건수 COUNT와 수량 합계 SUM(qty)는 다릅니다. 집계한 총 수량의 조건입니다.')
    w(35, 'SQL 검색', 'AND가 OR보다 먼저 평가된다. city가 부산 또는 서울이면서 연락처도 있는 회원만 고르도록 아래 조건을 고치세요.', "WHERE (city = '부산' OR city = '서울')\n  AND phone IS NOT NULL", '괄호가 없으면 부산 회원은 연락처가 없어도 통과합니다.', "WHERE city = '부산' OR city = '서울' AND phone IS NOT NULL")
    sql(36, 'JOIN', '회원 이름과 품목 이름을 구매 건별로 조회하세요. purchase_id도 출력하고 그 번호 오름차순으로 정렬하세요. 별칭 m,p,i를 사용하세요.', 'SELECT p.purchase_id, m.name, i.name\nFROM Member m, Purchase p, Item i\nWHERE m.member_id = p.member_id\n  AND p.item_id = i.item_id\nORDER BY p.purchase_id;', data.purchases.map(p => [p[0], data.members.find(m => m[0] === p[1])![1], data.items.find(i => i[0] === p[2])![1]]), '세 테이블에는 두 연결 조건이 필요합니다. 이름 열이 두 테이블에 있어 별칭을 붙여 구분합니다.')
    sql(37, 'JOIN', '모든 품목의 item_id와 구매 건수를 조회하세요. 한 번도 안 팔린 품목도 0건으로 포함하고 item_id 오름차순으로 정렬하세요.', 'SELECT i.item_id, COUNT(p.purchase_id) AS purchase_count\nFROM Item i LEFT JOIN Purchase p ON i.item_id = p.item_id\nGROUP BY i.item_id\nORDER BY i.item_id;', data.items.map(i => [i[0], data.purchases.filter(p => p[2] === i[0]).length]), 'COUNT(*)를 쓰면 미판매 품목의 보존 행까지 1건으로 셉니다. NULL인 오른쪽 키는 COUNT(p.purchase_id)에 포함되지 않습니다.')
    sql(38, '부속질의', '한 건의 결제액이 전체 평균 결제액보다 작은 구매의 purchase_id, paid를 부속질의로 조회하세요. 번호 오름차순입니다.', 'SELECT purchase_id, paid FROM Purchase\nWHERE paid < (SELECT AVG(paid) FROM Purchase)\nORDER BY purchase_id;', data.purchases.filter(p => p[4] < data.purchases.reduce((s,p) => s+p[4],0)/data.purchases.length).map(p => [p[0],p[4]]), '품목 정가 평균이 아니라 구매 건별 결제액 평균과 비교합니다.')
    w(39, '부속질의', '여러 품목이 조회될 수 있는 아래 부속질의에서 =가 문제인 이유와 MySQL용 수정 SQL을 쓰세요.', `SELECT purchase_id FROM Purchase\nWHERE item_id IN (SELECT item_id FROM Item WHERE category = '${firstCategory}');`, '스칼라 비교는 내부 결과가 여러 행이면 오류입니다. 여러 값 중 포함 여부를 검사할 때 IN을 사용합니다.', `SELECT purchase_id FROM Purchase\nWHERE item_id = (SELECT item_id FROM Item WHERE category = '${firstCategory}');`)
    sql(40, '부속질의', '구매 이력이 있는 품목의 분류에 속하는 모든 품목의 item_id, name을 중첩 IN 부속질의로 조회하세요. 직접 팔리지 않은 품목도 포함하며 번호 오름차순입니다.', 'SELECT item_id, name FROM Item\nWHERE category IN (\n  SELECT category FROM Item\n  WHERE item_id IN (SELECT item_id FROM Purchase)\n)\nORDER BY item_id;', data.items.filter(i => data.items.some(j => boughtIds.has(j[0]) && j[2] === i[2])).map(i => [i[0], i[1]]), '팔린 품목번호 → 그 품목의 분류 → 같은 분류의 모든 품목 순서입니다. 마지막 조건은 item_id가 아니라 category입니다.')
  } else {
    w(13, '관계 모델', 'OrderLine(order_id, item_id, qty)에서 한 주문에 같은 품목은 한 번만 나타난다. 서로 다른 주문에는 같은 품목이 등장한다. 적절한 기본키와 그 이유를 쓰세요.', '(order_id, item_id)를 복합 기본키로 정한다. order_id 하나로는 여러 품목을 구분할 수 없고 item_id 하나로는 서로 다른 주문을 구분할 수 없으나 두 값의 조합은 행을 식별한다.', '조합의 유일성과 각 열을 제거하면 식별할 수 없다는 최소성을 설명하세요.')
    c(14, '관계 모델', 'Item(item_id PK, sku UNIQUE NOT NULL, name)의 후보키는 item_id와 sku뿐이다. 기본키로 item_id를 택했을 때 sku는?', ['외래키', '대체키', '무조건 복합키', '투플'], 1, '후보키 중 기본키로 선택되지 않은 키는 대체키입니다.')
    w(15, '관계 모델', '회원번호·이름이 모두 같은 두 행을 관계의 서로 다른 투플로 보아도 되는가? 집합으로서의 릴레이션과 SQL 결과를 구분해 답하세요.', '관계 모델의 릴레이션은 투플의 집합이므로 완전히 같은 투플을 중복 원소로 두지 않는다. SQL의 SELECT 결과에는 기본적으로 중복 행이 나올 수 있어 필요하면 DISTINCT를 사용한다.', '수학적 관계의 중복 불허와 SQL 조회 결과의 중복 허용을 구별하세요.')
    c(16, '관계 모델', '외래키 열에 NOT NULL 제약이 없다. 부모 키가 없을 때와 NULL일 때의 설명으로 옳은 것은?', ['둘 다 항상 허용', '부모에 없는 비NULL 값은 거절될 수 있고 NULL은 허용된다', 'NULL은 반드시 0으로 변환', '외래키는 중복되면 항상 거절'], 1, '참조 무결성은 비NULL 외래키 값의 부모 존재를 요구합니다. NULL 금지는 별도의 NOT NULL 제약입니다.')
    b(17, '관계 모델', '후보키를 판단할 때 유일성과 함께, 불필요한 속성을 포함하지 않아야 한다는 성질은?', '최소성', ['최소성'], '더 작은 부분집합으로도 행을 식별할 수 있다면 해당 속성 집합은 후보키가 아닙니다.')
    w(18, '관계 모델', 'price의 도메인을 0 이상의 정수로 정했다. 문자열 무료와 정수 -100을 거절하는 이유를 각각 설명하세요.', '무료는 허용한 자료형인 정수가 아니고, -100은 정수지만 허용한 값 범위인 0 이상을 벗어난다.', '자료형과 허용 범위가 모두 도메인의 조건임을 설명하세요.')
    c(19, '관계 모델', '한 학생의 수강 강좌가 여러 개이고 한 강좌에도 여러 학생이 있다. 연결 테이블 수강의 두 외래키가 하는 역할은?', ['학생과 강좌의 관계를 각 키로 참조', '두 외래키 모두 반드시 개별 유일', '외래키를 만들면 학생 테이블 불필요', '이름의 표시 순서를 고정'], 0, '다대다 관계의 연결 행에서 각 외래키가 해당 학생과 강좌를 참조합니다.')
    w(20, '관계 모델', '같은 테이블의 행 표시 순서와 열 표시 순서가 바뀌었다. 관계 모델에서 데이터의 의미가 자동으로 바뀌지 않는 이유를 쓰세요.', '투플과 속성의 순서는 릴레이션의 본질적인 의미가 아니다. 열은 속성 이름으로 구별하고 투플은 값과 키로 식별한다. 출력 순서가 필요하면 SQL에서 ORDER BY를 지정한다.', '저장된 행의 물리 위치를 회원 식별자로 사용하면 안 되는 이유와 연결하세요.')
    w(21, 'SQL 정의어', 'Member(member_id)를 참조하는 Notice를 생성하세요. notice_id는 정수 기본키, member_id는 정수 NOT NULL 외래키, message는 VARCHAR(100) NOT NULL입니다.', 'CREATE TABLE Notice (\n notice_id INTEGER PRIMARY KEY,\n member_id INTEGER NOT NULL,\n message VARCHAR(100) NOT NULL,\n FOREIGN KEY (member_id) REFERENCES Member(member_id)\n);', '외래키 선언만으로 NULL이 금지되는 것은 아닙니다. 명시된 두 열에 NOT NULL이 있어야 합니다.')
    w(22, 'SQL 정의어', 'MySQL에서 Member 테이블 이름을 Buyer로 바꾸는 RENAME TABLE 문을 쓰세요. 열 이름 변경과 구분하세요.', 'RENAME TABLE Member TO Buyer;', '테이블 이름을 바꾸는 작업입니다. 행을 복사하거나 테이블을 새로 만드는 명령이 아닙니다.')
    b(23, 'SQL 정의어', '아래 선언에서 purchase_id와 달리 member_id가 연결하는 부모 열을 명시하는 키워드는?', 'REFERENCES', ['REFERENCES'], 'REFERENCES 뒤에 부모 테이블과 참조할 키 열을 씁니다.', 'FOREIGN KEY (member_id) ___ Member(member_id)')
    w(24, 'SQL 정의어', '기존 Member에 nickname VARCHAR(30) 열을 NULL 허용으로 추가하는 SQL을 쓰세요. 기존 name은 유지합니다.', 'ALTER TABLE Member ADD COLUMN nickname VARCHAR(30);', '열 추가와 기존 열 이름 변경은 다른 작업입니다. NOT NULL 조건을 임의로 추가하지 않습니다.')
    c(25, 'SQL 정의어', '기본키 중복·외래키 위반을 막는 제약을 정의했다. 가장 올바른 설명은?', ['입력 화면에서만 검사하면 DB 제약은 필요 없다', '제약은 DB가 데이터의 일관성 조건을 검사하도록 돕는다', '제약은 조회 결과를 언제나 정렬한다', '제약을 만들면 백업이 불필요하다'], 1, '무결성 제약은 허용되는 데이터 상태를 제한합니다. 정렬이나 백업 기능과는 다릅니다.')
    w(26, 'SQL 조작어', '빈 연락처를 NULL로 저장하며 신규 회원을 넣는 SQL을 쓰세요. member_id=9, name=홍길동, city=서울이며 9번은 아직 없습니다.', "INSERT INTO Member (member_id, name, city, phone)\nVALUES (9, '홍길동', '서울', NULL);", 'NULL에는 따옴표를 붙이지 않습니다. 문자열 NULL이나 빈 문자열과 구별합니다.')
    w(27, 'SQL 조작어', 'qty가 2 이상인 구매의 paid를 1000 낮추는 UPDATE를 쓰세요. 조건은 변경 전 qty를 기준으로 합니다.', 'UPDATE Purchase\nSET paid = paid - 1000\nWHERE qty >= 2;', '원래 paid를 사용하는 산술 수정이며 qty를 줄이는 문제가 아닙니다. 다른 문항은 원본에서 독립적으로 시작합니다.')
    w(28, 'SQL 조작어', 'ON DELETE RESTRICT인 외래키로 연결된 Member와 Purchase에서 특정 회원과 그 구매를 모두 제거하려 한다. 삭제 순서와 필요한 WHERE 조건을 설명하세요.', '먼저 Purchase에서 해당 member_id의 구매만 삭제하고, 그다음 Member에서 같은 member_id의 회원 행을 삭제한다. 양쪽 DELETE 모두 해당 회원번호의 WHERE 조건이 필요하다.', '참조 중인 부모를 먼저 지우면 제약 위반이 날 수 있습니다. 다른 회원 데이터까지 삭제하지 않도록 범위를 제한하세요.')
    sql(29, 'SQL 검색', '각 구매의 purchase_id와 품목 수량당 평균 결제금액 paid / qty를 unit_paid로 검색하세요. 번호 오름차순입니다. qty는 1 이상입니다.', 'SELECT purchase_id, paid * 1.0 / qty AS unit_paid\nFROM Purchase\nORDER BY purchase_id;', data.purchases.map(p => [p[0],p[4]/p[3]]), 'paid는 이미 수량 전체의 결제액이므로 수량당 금액은 나눗셈입니다. 정수 나눗셈을 피하는 동등한 표현도 가능합니다.')
    sql(30, 'SQL 검색', '한 번 이상 구매한 회원번호를 중복 없이 오름차순으로 출력하세요. 이 문제에서는 부속질의와 GROUP BY를 사용하지 마세요.', 'SELECT DISTINCT member_id\nFROM Purchase\nORDER BY member_id;', [...memberIds].sort((a,b) => a-b).map(mid => [mid]), '구매 행 수와 구매 고객 수는 다릅니다. DISTINCT로 같은 회원번호의 반복을 제거합니다.')
    sql(31, 'SQL 검색', 'phone이 등록된 회원 중 city가 첫 회원의 도시와 같은 회원의 member_id, name을 조회하세요. 번호 오름차순입니다.', `SELECT member_id, name FROM Member\nWHERE phone IS NOT NULL AND city = '${data.members[0][2]}'\nORDER BY member_id;`, data.members.filter(m => m[3] !== null && m[2] === data.members[0][2]).map(m => [m[0],m[1]]), 'NULL 검사와 일반 값 비교 조건을 AND로 결합합니다.')
    sql(32, 'SQL 검색', '품목별 최대 결제액과 최소 결제액의 차이를 item_id, gap으로 조회하세요. 번호 오름차순이며 구매가 있는 품목만 출력합니다.', 'SELECT item_id, MAX(paid) - MIN(paid) AS gap\nFROM Purchase\nGROUP BY item_id\nORDER BY item_id;', [...boughtIds].sort((a,b) => a-b).map(iid => { const values=data.purchases.filter(p => p[2]===iid).map(p=>p[4]); return [iid, Math.max(...values)-Math.min(...values)] }), '한 건만 팔린 품목은 최댓값과 최솟값이 같아 차이가 0입니다. 품목 정가의 차이가 아닙니다.')
    w(33, 'SQL 검색', '회원 이름만 GROUP BY하면 동명이인의 구매액이 섞일 수 있다. 회원별 총액 조회를 위해 사용할 그룹 키를 설명하세요.', '각 회원을 구분하는 member_id로 묶어야 한다. 이름도 출력한다면 GROUP BY m.member_id, m.name처럼 지정하면 동명이인을 분리할 수 있다.', '문자열 이름의 중복 여부가 아니라 같은 사람을 식별하는 키를 기준으로 그룹화합니다.')
    w(34, 'SQL 검색', '아래 질의가 SQL의 그룹 조건 위치에 맞지 않는 이유와 수정 SQL을 쓰세요.', 'SELECT item_id, COUNT(*)\nFROM Purchase\nGROUP BY item_id\nHAVING COUNT(*) >= 2;', 'WHERE는 개별 행을 거르는 위치입니다. 그룹별 건수 조건은 GROUP BY 이후 HAVING에 둡니다.', 'SELECT item_id, COUNT(*) FROM Purchase\nWHERE COUNT(*) >= 2\nGROUP BY item_id;')
    w(35, 'SQL 검색', 'LIMIT 없이 가격 오름차순, 같은 가격이면 이름 내림차순으로 품목을 정렬하는 ORDER BY 절을 쓰세요.', 'ORDER BY price ASC, name DESC', '각 정렬 기준의 방향을 별도로 지정합니다. name은 가격이 같은 행끼리의 두 번째 기준입니다.')
    sql(36, 'JOIN', '모든 구매 행의 purchase_id와 회원 이름을 보존하는 RIGHT JOIN을 쓰세요. 왼쪽은 Member, 오른쪽은 Purchase이며 번호 오름차순입니다.', 'SELECT p.purchase_id, m.name\nFROM Member m RIGHT JOIN Purchase p\nON m.member_id = p.member_id\nORDER BY p.purchase_id;', data.purchases.map(p => [p[0],data.members.find(m => m[0]===p[1])?.[1]??null]), 'RIGHT JOIN은 오른쪽 Purchase를 보존합니다. 현재 데이터는 모든 구매가 회원을 참조하므로 매칭되지 않는 구매는 없습니다.')
    w(37, 'JOIN', '구매가 없는 회원도 남기면서 qty>=2인 구매만 연결하려 한다. 아래 LEFT JOIN에서 조건을 옮겨 올바른 SQL을 쓰세요.', 'SELECT m.member_id, p.purchase_id\nFROM Member m LEFT JOIN Purchase p\n  ON m.member_id = p.member_id AND p.qty >= 2;', 'WHERE p.qty>=2는 NULL 보존 행까지 제거합니다. 매칭 대상의 제한 조건을 ON에 두면 모든 왼쪽 회원이 남습니다.', 'SELECT m.member_id, p.purchase_id\nFROM Member m LEFT JOIN Purchase p ON m.member_id = p.member_id\nWHERE p.qty >= 2;')
    sql(38, '부속질의', '구매가 한 건도 없는 회원의 member_id, name을 상관 NOT EXISTS로 조회하세요. 번호 오름차순입니다.', 'SELECT m.member_id, m.name FROM Member m\nWHERE NOT EXISTS (\n SELECT 1 FROM Purchase p WHERE p.member_id = m.member_id\n)\nORDER BY m.member_id;', data.members.filter(m => !memberIds.has(m[0])).map(m => [m[0],m[1]]), '외부 회원마다 구매 행의 존재를 확인합니다. 연결 조건이 없으면 테이블 전체 구매 유무만 검사하게 됩니다.')
    sql(39, '부속질의', '회원번호 1이 산 품목 중 하나 이상을 산 다른 회원의 member_id, name을 중첩 IN으로 조회하세요. 1번은 제외하고 번호 오름차순입니다.', 'SELECT member_id, name FROM Member\nWHERE member_id <> 1 AND member_id IN (\n SELECT member_id FROM Purchase\n WHERE item_id IN (SELECT item_id FROM Purchase WHERE member_id = 1)\n)\nORDER BY member_id;', data.members.filter(m => m[0]!==1 && data.purchases.some(p => p[1]===m[0] && data.purchases.some(q => q[1]===1&&q[2]===p[2]))).map(m => [m[0],m[1]]), '1번의 구매 품목 목록을 이용해 그 품목을 산 고객 목록을 다시 만듭니다. 동일한 모든 품목을 사야 한다는 뜻은 아닙니다.')
    w(40, '부속질의', 'Member에 동명이인이 있을 수 있다. IN 부속질의 조회와 조인 조회에서 이름 중복이 달라지는 이유, DISTINCT name만으로 회원별 결과를 보장할 수 없는 이유를 설명하세요.', 'IN은 회원번호가 구매 고객 목록에 포함되는지만 검사하므로 외부 회원 행을 구매 횟수만큼 늘리지 않는다. 조인은 같은 회원의 구매 건마다 행이 생긴다. DISTINCT name은 다른 회원의 같은 이름도 합치므로 회원별 결과를 원하면 member_id까지 구분해야 한다.', '회원의 정체성, 출력 이름의 값 중복, 구매 건수에 의한 행 증식을 구별하세요.')
  }
  return result
}
