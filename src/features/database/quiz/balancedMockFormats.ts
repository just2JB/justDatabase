import type { FullMockQuestion } from './fullMockExams'

type Change = { prompt: string; options?: string[]; correct?: number; answer?: string; accepted?: string[] }

// Keep a small hand-written core; changed IDs prevent old written drafts being graded as choices.
export function balanceMockFormats(questions: FullMockQuestion[], round: 1 | 2): FullMockQuestion[] {
  const changes = new Map<number, Change>()
  const c = (n: number, prompt: string, options: string[], correct = 0) => changes.set(n, { prompt, options, correct })
  const b = (n: number, prompt: string, answer: string, accepted = [answer]) => changes.set(n, { prompt, answer, accepted })
  if (round === 1) {
    b(5, '[용어 판별] 파일 구조를 바꾸자 이를 읽는 응용 프로그램도 고쳐야 했다. 이 한계를 나타내는 용어는?', '데이터 종속성', ['데이터 종속성', '종속성'])
    c(7, '[옳지 않은 설명] DBMS 도입 효과에 관한 주장 중 틀린 것은?', ['중복 통제는 모든 중복의 완전 제거를 보장하며 백업·회복 관리도 필요 없어진다.', '데이터 공유와 중복 통제에 도움을 줄 수 있다.', '도입·운영 비용과 관리 복잡성을 고려해야 한다.', '데이터 독립성은 도입의 장점 중 하나다.'])
    b(9, '[경계 판별] 저장 장치와 파일 배치를 바꿨지만 개념 스키마는 유지됐다. 확인된 데이터 독립성의 종류는?', '물리적 데이터 독립성', ['물리적 데이터 독립성', '물리적 독립성', '물리적'])
    c(12, '[분류 고르기] CREATE·UPDATE·GRANT를 순서대로 분류한 것은?', ['DML·DDL·DCL', 'DDL·DML·DCL', 'DDL·DCL·DML', 'DCL·DML·DDL'], 1)
    c(14, '이메일이 유일하지만 NULL을 허용한다. 기본키로 바로 지정하기 곤란한 이유는?', ['후보가 되는 열은 반드시 문자열이어야 한다.', '기본키는 여러 열로 구성할 수 없다.', '기본키는 NULL을 허용하지 않기 때문이다.', 'UNIQUE는 기본키와 항상 같은 의미이기 때문이다.'], 2)
    c(16, 'Purchase에 존재하지 않는 부모 회원번호 99를 넣으려 한다. 무결성을 유지하는 해결은?', ['외래키 검사만 끄고 그대로 저장한다.', '정당한 신규 회원이라면 Member에 99번 회원을 먼저 등록한다.', '기존의 모든 회원번호를 99로 수정한다.', '자식 행의 기본키만 유일하면 부모는 없어도 된다.'], 1)
    b(23, 'qty INTEGER CHECK(qty >= 1)에서 NULL까지 거절하려면 추가할 두 단어의 제약조건은?', 'NOT NULL')
    c(25, 'NULL 허용 외래키의 ON DELETE SET NULL이 동작하면 자식 행은?', ['행 전체가 삭제된다.', '해당 외래키 값이 0이 된다.', '부모와 자식 테이블이 함께 제거된다.', '행은 남고 해당 외래키 값이 NULL이 된다.'], 3)
    c(27, '연락처가 NULL인 회원만 미등록으로 수정하는 문장으로 옳은 것은?', ["UPDATE Member SET phone = '미등록' WHERE phone IS NULL;", "UPDATE Member SET phone = '미등록' WHERE phone = NULL;", "UPDATE Member SET phone = '미등록';", "ALTER TABLE Member SET phone = '미등록';"])
    c(28, 'qty가 1이고 paid가 10000 미만인 구매만 삭제하려 한다. 올바른 조건은?', ['WHERE qty = 1 OR paid < 10000', 'WHERE qty = 1 AND paid <= 10000', 'WHERE qty = 1 AND paid < 10000', 'HAVING qty = 1 AND paid < 10000'], 2)
    c(29, '특정 category에 속하지 않는 품목을 item_id 오름차순으로 찾는 절의 조합은? category에는 NULL이 없다.', ['WHERE category <> 지정값 / ORDER BY item_id ASC', 'WHERE category = 지정값 / ORDER BY item_id ASC', 'WHERE category <> 지정값 / ORDER BY item_id DESC', 'HAVING category <> 지정값 / GROUP BY item_id'])
    c(31, '분류별 품목 수를 조회하는 SQL에서 그룹 기준과 집계식을 올바르게 연결한 것은?', ['GROUP BY item_id / SUM(price)', 'GROUP BY category / COUNT(*)', 'ORDER BY category / COUNT(*)만 사용하면 자동 그룹화', 'GROUP BY price / COUNT(category)'], 1)
    c(32, '회원 1 또는 3의 총 구매 수량을 조회한다. WHERE member_id IN (1,3) 다음에 사용할 집계와 그룹 기준은?', ['COUNT(*) / GROUP BY item_id', 'SUM(paid) / GROUP BY member_id', 'SUM(qty) / GROUP BY member_id', 'SUM(qty) / GROUP BY purchase_id'], 2)
    c(33, '회원의 연락처 등록 건수를 세려 한다. COUNT(phone)과 COUNT(*)의 차이는?', ['둘 다 NULL을 제외하므로 언제나 같다.', 'COUNT(phone)은 연락처의 문자 수를 센다.', 'COUNT(*)는 중복 도시를 제거한 수다.', 'COUNT(phone)은 NULL 아닌 연락처 수, COUNT(*)는 전체 회원 행 수다.'], 3)
    c(34, '회원별 총 구매 수량이 3 이상이라는 조건을 쓰는 올바른 위치와 식은?', ['WHERE COUNT(*) >= 3', 'HAVING SUM(qty) >= 3', 'WHERE SUM(qty) >= 3', 'HAVING SUM(paid) >= 3'], 1)
    c(35, '부산 또는 서울에 거주하면서 연락처도 있는 회원만 고르는 조건은?', ["WHERE (city = '부산' OR city = '서울') AND phone IS NOT NULL", "WHERE city = '부산' OR city = '서울' AND phone IS NOT NULL", "WHERE (city = '부산' AND city = '서울') AND phone IS NOT NULL", "WHERE (city = '부산' OR city = '서울') AND phone = NULL"])
    c(39, 'item_id를 반환하는 부속질의가 여러 행이다. 한 값 비교의 =를 어떻게 바꾸는 것이 적절한가?', ['IN으로 바꾸어 목록에 포함되는지 검사한다.', 'LIKE로 바꾸면 여러 행을 자동 비교한다.', '==로 바꾸면 여러 행이 허용된다.', '서브쿼리에 ORDER BY만 붙이면 한 행이 된다.'])
  } else {
    c(1, 'A 보고서는 정확하지만 결정 다음 날 도착했고, B는 제때 왔지만 계산이 틀렸다. 부족한 특성의 연결은?', ['A=정확성 / B=적시성', 'A=다양성 / B=관련성', 'A=적시성 / B=정확성', 'A와 B 모두 적시성만 부족'], 2)
    c(3, '회원 테이블, 태그로 구조를 나타낸 XML, 구조 설명 없는 음성 녹음의 분류는?', ['정형·비정형·반정형', '반정형·정형·비정형', '정형·반정형·비정형', '정형·정형·반정형'], 2)
    c(7, '전화번호 값 수정·열 자료형 변경·조회 권한 회수를 DBMS 기능에 순서대로 대응시키면?', ['조작·정의·제어', '정의·조작·제어', '조작·제어·정의', '제어·정의·조작'])
    b(8, '관리 소프트웨어 DBMS와 구분하여, 데이터베이스 운영·관리를 담당하는 관리자의 영문 약자는?', 'DBA')
    c(15, '관계 모델의 릴레이션과 SQL SELECT 결과의 중복에 관한 설명으로 옳은 것은?', ['둘 다 항상 완전히 같은 행을 중복으로 저장한다.', '릴레이션은 투플의 집합이지만 SQL 조회 결과에는 중복 행이 나올 수 있다.', 'SQL 조회는 자동으로 모든 이름 중복을 제거한다.', 'DISTINCT는 같은 이름의 서로 다른 고객을 구분해 준다.'], 1)
    b(18, 'price의 도메인이 0 이상의 정수다. -100은 자료형은 맞지만 허용된 값의 ___를 벗어난다.', '범위', ['범위', '값 범위'])
    c(20, '행의 현재 표시 순서와 무관하게 SQL 결과의 정렬을 명시하는 절은?', ['GROUP BY', 'HAVING', 'ORDER BY', 'WHERE'], 2)
    b(22, 'MySQL에서 테이블 이름을 바꾼다. 빈칸은? RENAME TABLE Member ___ Buyer;', 'TO')
    c(24, '기존 name을 유지하면서 NULL 허용 nickname 열을 추가하는 MySQL 문장은?', ['ALTER TABLE Member ADD COLUMN nickname VARCHAR(30);', 'ALTER TABLE Member CHANGE name nickname VARCHAR(30);', 'UPDATE Member SET nickname = NULL;', 'RENAME TABLE Member TO nickname;'])
    c(26, '연락처를 NULL로 저장하는 INSERT의 값 목록에서 올바른 표현은?', ["'NULL'", "''", 'NULL', '0'], 2)
    c(28, 'ON DELETE RESTRICT로 연결된 회원과 그 구매를 모두 삭제한다. 올바른 순서는?', ['Member 전체 삭제 → Purchase 전체 삭제', '해당 회원의 Purchase 행 삭제 → 해당 Member 행 삭제', 'Member의 키만 NULL로 수정 → Purchase 유지', '해당 Member 행 삭제 → 외래키가 자동으로 자식 삭제'], 1)
    c(29, 'paid가 한 구매 건 전체의 결제액이고 qty가 1 이상일 때 수량당 평균 결제액은?', ['paid * qty', 'qty / paid', 'SUM(qty)', 'paid / qty'], 3)
    c(30, 'Purchase에서 구매 회원번호만 중복 없이 조회하는 SQL은?', ['SELECT DISTINCT member_id FROM Purchase;', 'SELECT member_id FROM Purchase;', 'SELECT COUNT(member_id) FROM Purchase;', 'SELECT DISTINCT purchase_id, member_id FROM Purchase;'])
    c(31, '연락처가 등록되어 있고 지정 도시에 사는 회원만 남기는 조건으로 옳은 것은?', ['phone = NULL AND city = 지정도시', 'phone IS NOT NULL OR city = 지정도시', 'phone IS NOT NULL AND city = 지정도시', 'phone <> NULL AND city = 지정도시'], 2)
    c(32, '품목별 결제액의 최대·최소 차이를 구한다. 품목이 딱 한 건 팔렸다면 gap 값은?', ['NULL', '그 건의 paid', '구매 건수 1', '0'], 3)
    c(33, '동명이인의 구매 총액이 섞이지 않도록 이름과 회원별 합계를 출력할 때 적절한 그룹 기준은?', ['GROUP BY m.name', 'GROUP BY m.member_id, m.name', 'GROUP BY p.paid', 'GROUP BY m.city'], 1)
    c(34, 'WHERE COUNT(*) >= 2가 잘못된 이유와 수정 방향은?', ['집계함수는 SQL에서 사용할 수 없다.', '그룹 집계 조건이므로 GROUP BY 뒤 HAVING에 둔다.', 'WHERE를 ON으로 이름만 바꾸면 된다.', 'GROUP BY를 제거하면 회원별 건수를 구할 수 있다.'], 1)
    c(35, '가격 오름차순, 같은 가격이면 이름 내림차순으로 정렬하는 절은?', ['ORDER BY price DESC, name ASC', 'GROUP BY price ASC, name DESC', 'ORDER BY price ASC, name DESC', 'ORDER BY name DESC, price ASC'], 2)
    c(40, 'IN 조회·조인·동명이인의 관계를 설명한 것 중 옳지 않은 것은?', ['IN은 포함 여부만 검사하므로 주문 수만큼 외부 고객 행을 복제하지 않는다.', '조인은 같은 고객의 주문 건마다 결과 행을 만들 수 있다.', 'DISTINCT name이면 항상 고객별 한 행이 보장되고 동명이인도 구분된다.', '고객을 구분하려면 이름뿐 아니라 고객번호도 고려해야 한다.'], 2)
  }
  return questions.map(question => {
    const change = changes.get(Number(question.id.split('-').at(-1)))
    if (!change) return question
    // Previous long-form rubrics can mention the old task; replace them with a concise criterion.
    if (change.options) {
      const shift = Number(question.id.split('-').at(-1)) % change.options.length
      const options = [...change.options.slice(shift), ...change.options.slice(0, shift)]
      const correct = (change.correct! - shift + options.length) % options.length
      const answer = options[correct]
      return { id: `${question.id}-compact`, unit: question.unit, kind: 'choice', prompt: change.prompt, options, correct, answer, explanation: `판단 기준: ${answer}\n${question.explanation}` }
    }
    return { id: `${question.id}-compact`, unit: question.unit, kind: 'blank', prompt: change.prompt, answer: change.answer!, accepted: change.accepted, explanation: `핵심 답: ${change.answer}\n${question.explanation}` }
  })
}
