import { relationMockExams } from './relationMockExams'
import type { ExamTable, MockQuestion } from './relationMockExams'
import type { SqlRow } from '../sql/data/sqlLessonData'

export type FullMockQuestion = MockQuestion & { unit: string; sqlCheck?: { sql: string; rows: SqlRow[] } }
export const fullMockUnits = ['데이터·정보', 'DBMS', 'DBS', '관계 모델', 'SQL 정의어', 'SQL 조작어', 'SQL 검색', 'JOIN', '부속질의']
type DataSet = { title: string; items: [number, string, string, number][]; members: [number, string, string, string | null][]; purchases: [number, number, number, number, number][]; threshold: number; prefix: string }
export const fullMockData: DataSet[] = [
  { title: '문구점', items: [[1,'노트 A','종이',3000],[2,'노트 B','종이',5000],[3,'펜 A','필기',2000],[4,'펜 B','필기',4000],[5,'파일','정리',6000]], members: [[1,'김하늘','서울','010-1111'],[2,'이서준','수원','010-2222'],[3,'박민서','서울',null],[4,'정다은','인천','010-4444']], purchases: [[1,1,1,2,5000],[2,2,3,3,6000],[3,1,2,1,5000],[4,3,4,2,7000],[5,2,1,1,3000],[6,1,3,2,4000]], threshold: 4000, prefix: '노트' },
  { title: '체험용품점', items: [[1,'도예 흙','도예',8000],[2,'도예 도구','도예',12000],[3,'가죽 원단','가죽',10000],[4,'가죽 도구','가죽',16000],[5,'실버 재료','금속',24000]], members: [[1,'오유진','부산','010-5555'],[2,'윤도현','서울',null],[3,'최지우','부산','010-7777'],[4,'한서연','대전','010-8888']], purchases: [[1,2,1,1,7000],[2,1,3,2,18000],[3,3,2,1,12000],[4,2,4,1,15000],[5,1,1,2,14000],[6,2,3,1,9000]], threshold: 12000, prefix: '가죽' },
  { title: '온라인서점', items: [[1,'SQL 입문','DB',18000],[2,'SQL 활용','DB',26000],[3,'파이썬 입문','코딩',22000],[4,'파이썬 활용','코딩',30000],[5,'컴퓨터 역사','교양',14000]], members: [[1,'강지안','수원',null],[2,'임수빈','인천','010-1212'],[3,'서도윤','수원','010-3434'],[4,'문예린','서울','010-5656']], purchases: [[1,3,1,1,17000],[2,1,3,1,21000],[3,2,2,2,50000],[4,3,4,1,28000],[5,1,1,2,34000],[6,3,3,1,20000]], threshold: 22000, prefix: 'SQL' },
]

function choice(id: string, unit: string, prompt: string, options: string[], correct: number, explanation: string, tables?: ExamTable[], code?: string): FullMockQuestion {
  // Stable rotation changes answer positions without changing saved question identities.
  const shift = [...id].reduce((sum, letter) => sum + letter.charCodeAt(0), 0) % options.length
  const rotated = [...options.slice(shift), ...options.slice(0, shift)]
  return { id, unit, kind: 'choice', prompt, options: rotated, correct: (correct - shift + options.length) % options.length, answer: options[correct], explanation, tables, code }
}
function blank(id: string, unit: string, prompt: string, answer: string, accepted: string[], explanation: string, code?: string): FullMockQuestion { return { id, unit, kind: 'blank', prompt, answer, accepted, explanation, code } }
function written(id: string, unit: string, prompt: string, answer: string, explanation: string, tables?: ExamTable[], code?: string): FullMockQuestion { return { id, unit, kind: 'written', prompt, answer, explanation, tables, code } }
type Variant = [string, string[], number, string]
const foundations: Variant[][] = [
  [
    ['관측값 18·21·24를 날짜와 연결해 주간 온도 추세로 해석했다. 데이터와 정보의 관계로 옳은 것은?', ['값에 목적과 의미를 부여하여 정보로 만들었다.','숫자는 어떤 맥락에서든 완성된 정보다.','정보는 관련성과 무관하다.','정보는 반드시 영상이어야 한다.'],0,'관측한 사실이나 값이 데이터이며 목적과 관련성을 갖추면 정보가 됩니다.'],
    ['JSON 문서처럼 내용 안에 구조 설명이 함께 들어 있는 데이터는?', ['정형 데이터','반정형 데이터','연속형 데이터','명목형 데이터'],1,'반정형 데이터는 내용과 구조 설명이 함께 있으며 파싱하여 구조를 파악합니다.'],
    ['빅데이터의 3V에서 생성·처리 속도를 가리키는 것은?', ['Volume','Variety','Velocity','View'],2,'Volume은 크기, Variety는 다양성, Velocity는 속도입니다.'],
    ['학사 파일과 장학 파일의 같은 학생 주소를 한쪽만 수정해 서로 달라졌다. 가장 직접적인 문제는?', ['데이터 독립성 확보','공유로 인한 표준화','중복 데이터의 불일치','개체의 원자성'],2,'같은 데이터를 별도 파일에 중복 저장하면 갱신 시 불일치가 발생할 수 있습니다.'],
    ['DBMS가 데이터의 삽입·수정·삭제·검색 요청을 처리하는 것은 어떤 기능인가?', ['정의','조작','제어','컴파일'],1,'구조의 정의는 정의 기능, 실제 데이터 처리는 조작 기능, 정확성과 안전성 유지는 제어 기능입니다.'],
    ['트리의 상하관계 링크로 데이터를 조직하는 데이터베이스 모델은?', ['관계형','네트워크형','객체관계형','계층형'],3,'계층형은 트리 구조, 네트워크형은 그래프 구조, 관계형은 테이블과 공통 속성을 사용합니다.'],
    ['학생(학번, 학년)의 구조는 그대로 두고 (101, 1) 행을 (101, 2)로 수정했다. 바뀐 것은?', ['릴레이션 인스턴스','속성의 개수','릴레이션 스키마','속성의 자료형'],0,'현재 저장된 값이 달라졌으므로 인스턴스가 변경됩니다. 구조 정의는 그대로입니다.'],
    ['조직 전체의 논리 구조와 제약조건을 통합하여 정의하는 스키마는?', ['내부','외부','개념','사용자 인스턴스'],2,'개념 스키마는 전체 조직 관점의 논리 구조를 정의합니다. 외부는 개별 관점, 내부는 물리적 저장 관점입니다.'],
    ['인덱스와 저장 파일 구조를 바꾸어도 개념 스키마를 유지하는 성질은?', ['논리적 데이터 독립성','물리적 데이터 독립성','키 최소성','속성 원자성'],1,'내부 스키마 변경의 영향을 개념 스키마에서 분리하는 물리적 독립성입니다.'],
    ['원하는 데이터가 무엇인지만 기술하고 구체적인 접근 순서는 DBMS가 결정하도록 하는 언어는?', ['절차적 DML','비절차적 DML','데이터 디렉터리','내부 스키마'],1,'비절차적 DML은 What을 기술합니다. 절차적 DML은 What과 How를 기술합니다.'],
  ],
  [
    ['늦게 도착한 교통 안내가 이미 끝난 이동에는 도움이 되지 않았다. 어떤 정보 특성이 가장 직접적인가?', ['독점성','적시성','자료형','도메인'],1,'정보는 필요한 시점에 제공되어야 가치가 있다는 적시성의 사례입니다.'],
    ['혈액형처럼 서열 없이 종류를 구분하는 값은?', ['순서형','연속형','이산형','명목형'],3,'명목형은 종류만 구별하고 순서를 부여하지 않습니다.'],
    ['제품의 저장 주소 대신 재고량이 100개 미만인 제품을 검색한다. 데이터베이스의 어떤 특징인가?', ['내용 기반 참조','오직 물리 주소 참조','투플의 순서성','중복 저장의 보장'],0,'내용을 조건으로 데이터를 찾는 내용 기반 참조입니다.'],
    ['파일 레코드의 구조를 바꾸자 이를 읽는 응용 프로그램도 수정해야 했다. 파일 시스템의 한계는?', ['원자성','참조 무결성','데이터 종속성','카디널리티'],2,'응용 프로그램이 파일의 구조와 저장 방식에 종속되는 문제입니다.'],
    ['DBMS의 기능 중 허가받지 않은 접근을 막고 데이터를 정확하고 안전하게 유지하는 기능은?', ['제어','조작','정의','시각화'],0,'제어 기능은 보안·무결성 등 데이터의 정확성과 안전성을 유지합니다.'],
    ['DBMS 도입에 관한 설명 중 옳은 것은?', ['백업과 회복은 언제나 단순해진다.','도입 비용과 복잡한 백업·회복이 부담이 될 수 있다.','데이터 독립성을 원천적으로 포기한다.','동시 공유를 할 수 없다.'],1,'DBMS에는 중복 통제와 공유 같은 장점뿐 아니라 비용과 관리 복잡성 같은 단점도 있습니다.'],
    ['테이블의 이름·열·자료형·제약조건을 기술한 정의는 무엇인가?', ['인스턴스','도메인의 현재 값','스키마','투플 한 개'],2,'스키마는 구조와 제약의 정의이고 인스턴스는 특정 시점에 저장된 실제 값입니다.'],
    ['학생·교수·행정 담당자에게 필요한 서로 다른 데이터 관점을 정의하는 것은?', ['외부 스키마','내부 스키마','레코드의 물리 주소','하나의 투플'],0,'외부 스키마는 사용자별 논리 관점이며 여러 개 존재할 수 있습니다.'],
    ['개념 스키마를 확장했지만 기존 외부 스키마와 응용 프로그램을 유지했다. 해당 성질은?', ['물리적 데이터 독립성','파일의 종속성','키의 유일성','논리적 데이터 독립성'],3,'개념 스키마 변경의 영향을 외부 관점에서 분리하는 논리적 독립성입니다.'],
    ['조회 권한을 사용자에게 부여하거나 회수하는 작업의 데이터 언어 분류는?', ['DDL','DCL','DML','도메인'],1,'GRANT·REVOKE 같은 접근 권한 제어는 DCL에 해당합니다.'],
  ],
  [
    ['소수의 관측값에 과목·날짜·평균 비교라는 맥락을 붙여 학습 추세를 판단했다. 올바른 설명은?', ['모든 관측값은 목적과 무관하게 정보다.','정보는 데이터와 아무 관계가 없다.','데이터에 관련성과 목적성을 부여해 정보로 활용했다.','숫자는 데이터가 될 수 없다.'],2,'데이터 자체와 그것을 목적에 맞게 해석한 정보를 구별합니다.'],
    ['미리 정의한 열 구조에 따라 저장하고 구조 설명과 내용을 별도로 관리하는 데이터는?', ['정형 데이터','반정형 데이터','비정형 데이터','서열 없는 명목형만'],0,'관계 데이터베이스 테이블과 스프레드시트가 정형 데이터의 대표적인 예입니다.'],
    ['여러 사용자가 같은 데이터를 동시에 이용하는 것은 데이터베이스의 어떤 특징인가?', ['물리 주소 참조만 허용','동시 공유','한 사용자 전용 저장','정해진 행 순서 보장'],1,'동시 공유는 서로 다른 데이터뿐 아니라 같은 데이터의 동시 사용도 포함합니다.'],
    ['응용 프로그램마다 동일한 고객 정보를 별도 파일로 저장한다. 가장 직접적으로 예상되는 문제는?', ['중복과 갱신 불일치','최소성 자동 보장','메타데이터 소멸의 필연성','중복 통제의 완성'],0,'중복 저장한 고객 정보를 모두 일관되게 갱신하지 못하면 불일치가 생깁니다.'],
    ['새 테이블의 열과 제약조건을 만들거나 바꾸는 DBMS 기능은?', ['조작','제어','표시','정의'],3,'DB 구조의 정의·수정은 정의 기능입니다. 데이터 값의 변경은 조작 기능입니다.'],
    ['개체를 테이블로 표현하고 공통 속성으로 연결하는 모델은?', ['계층형','관계형','순수 파일 모델','네트워크형의 트리 전용 형태'],1,'관계형 모델은 릴레이션과 키로 데이터 및 관계를 표현합니다.'],
    ['테이블 구조는 그대로이고 오늘의 회원 목록에 새 회원 한 명이 추가되었다. 무엇이 바뀌는가?', ['속성 수만 증가','열의 자료형','인스턴스','스키마의 기본키 정의'],2,'행의 추가는 현재 데이터 상태인 인스턴스를 바꿉니다. 스키마를 바꾸는 작업은 아닙니다.'],
    ['레코드 배치·파일 구조·접근 경로를 기술하는 스키마는?', ['외부','개념','응용 화면','내부'],3,'내부 스키마는 저장 장치 관점의 물리적 구조입니다.'],
    ['A: 내부 변경에도 개념 유지. B: 개념 변경에도 외부 유지. 올바른 대응은?', ['A=물리적 독립성 / B=논리적 독립성','A=논리적 독립성 / B=물리적 독립성','A와 B 모두 속성의 원자성','A와 B 모두 논리적 독립성'],0,'물리적은 내부→개념, 논리적은 개념→외부 단계 사이의 변경 영향을 분리합니다.'],
    ['절차적 DML을 비절차적 DML과 구분한 설명으로 옳은 것은?', ['원하는 데이터만 말하며 방법은 기술하지 않는다.','스키마를 삭제하는 명령만 포함한다.','What뿐 아니라 How도 기술한다.','권한을 부여하는 언어만 뜻한다.'],2,'절차적 DML은 무엇을 원하는지와 그것을 처리하는 방법을 기술합니다.'],
  ],
]

export const fullMockExams = fullMockData.map((data, round) => {
  const id = (n: number) => `full-${round + 1}-${String(n).padStart(2, '0')}`
  const questions: FullMockQuestion[] = []
  const foundationNumbers = [1,3,4,5,6,7,8,9,10,12]
  const foundationUnits = ['데이터·정보','데이터·정보','데이터·정보','DBMS','DBMS','DBMS','DBS','DBS','DBS','DBS']
  foundations[round].forEach(([prompt, options, correct, explanation], index) => questions.push(choice(id(foundationNumbers[index]), foundationUnits[index], prompt, options, correct, explanation)))
  const definitionWords = ['통합', '저장', '운영']
  questions.push(blank(id(2), '데이터·정보', [
    'DB는 여러 사용자가 공유하도록 ___해서 저장한 운영 데이터의 집합이다.',
    'DB는 여러 사용자가 공유하도록 통합해서 ___한 운영 데이터의 집합이다.',
    'DB는 여러 사용자가 공유하도록 통합해서 저장한 ___ 데이터의 집합이다.',
  ][round], definitionWords[round], [definitionWords[round]], '데이터베이스 정의의 핵심은 통합·저장·공유·운영입니다.'))
  questions.push(blank(id(11), 'DBS', [
    '스키마·사상·제약조건 같은 메타데이터를 DBMS가 관리하는 저장소를 데이터 ___이라고 한다.',
    '스키마·자료형·제약조건처럼 데이터에 대한 데이터를 ___라고 한다.',
    'DB 전체의 운영·보안·백업·회복 등을 책임지는 데이터베이스 관리자의 영문 약자는?',
  ][round], ['사전','메타데이터','DBA'][round], [['사전'],['메타데이터','metadata'],['DBA']][round], ['데이터 사전(시스템 카탈로그)은 메타데이터를 관리합니다.','메타데이터는 실제 업무 데이터의 구조와 제약 등을 기술하는 데이터입니다.','DBA는 데이터베이스를 정의하고 운영·관리하는 관리자입니다.'][round]))
  const relationIndices = [0,1,9,11,16,19,21,22]
  relationIndices.forEach((source, index) => questions.push({ ...relationMockExams[round].questions[source], id: id(13 + index), unit: '관계 모델' }))

  const itemTable: ExamTable = { caption: `${data.title} · Item`, data: { columns: ['item_id','name','category','price'], rows: data.items } }
  const memberTable: ExamTable = { caption: `${data.title} · Member`, data: { columns: ['member_id','name','city','phone'], rows: data.members } }
  const purchaseTable: ExamTable = { caption: `${data.title} · Purchase`, data: { columns: ['purchase_id','member_id','item_id','qty','paid'], rows: data.purchases } }
  function qc(n: number, unit: string, prompt: string, sql: string, rows: SqlRow[], distractors: string[], explanation: string, tables: ExamTable[]) {
    const answer = rows.map(row => `(${row.map(value => value === null ? 'NULL' : value).join(', ')})`).join(' · ') || '0행'
    const options = [answer, ...distractors]
    if (new Set(options).size !== 4) throw new Error(`선택지 중복: ${id(n)}`)
    questions.push({ ...choice(id(n), unit, prompt, options, 0, explanation, tables, sql), sqlCheck: { sql, rows } })
  }
  questions.push(blank(id(21), 'SQL 정의어', '테이블을 생성하면서 item_id를 기본키로 지정한다. 빈칸에 두 단어로 된 제약조건을 쓰세요.', 'PRIMARY KEY', ['PRIMARY KEY'], '기본키는 유일하고 NULL이 없도록 하는 행 식별자입니다.', 'CREATE TABLE PracticeItem (\n  item_id INTEGER ___,\n  name VARCHAR(40) NOT NULL\n);'))
  questions.push(choice(id(22), 'SQL 정의어', '다음 테이블에 두 문장을 순서대로 실행한다. (1행의 fee, 2행의 fee)는? 각 INSERT는 성공한다고 가정한다.', ['(15000, NULL)','(NULL, 15000)','(15000, 15000)','(NULL, NULL)'],0,'열을 생략하면 DEFAULT를 사용합니다. NULL 허용 열에 NULL을 명시하면 기본값이 아니라 NULL을 저장합니다.', undefined, 'CREATE TABLE FeeTest (\n id INTEGER PRIMARY KEY,\n fee INTEGER DEFAULT 15000\n);\nINSERT INTO FeeTest (id) VALUES (1);\nINSERT INTO FeeTest (id, fee) VALUES (2, NULL);'))
  questions.push(choice(id(23), 'SQL 정의어', 'MySQL 8.0.16 이상에서 fee는 INTEGER CHECK(fee >= 1000)이며 NOT NULL은 없다. 기본키 등 다른 조건을 만족할 때 fee 입력으로 옳은 것은?', ['999와 NULL 모두 거절','999는 거절, NULL은 허용','999와 NULL 모두 허용','999는 허용, NULL은 거절'],1,'CHECK가 FALSE인 999는 거절합니다. NULL 비교는 UNKNOWN이고 이 조건에는 NOT NULL이 없으므로 NULL은 허용합니다.'))
  questions.push(blank(id(24), 'SQL 정의어', [
    '기존 테이블에 열을 추가한다. 빈칸에 들어갈 키워드는?',
    '기존 열의 자료형을 바꾼다. MySQL 구문의 빈칸을 쓰세요.',
    '기존 열 이름 phone을 contact로 바꾼다. MySQL 구문의 빈칸을 쓰세요.',
  ][round], ['ADD','MODIFY','CHANGE'][round], [['ADD'],['MODIFY'],['CHANGE']][round], 'ALTER TABLE은 기존 테이블 구조를 변경합니다. CHANGE에는 이전 이름·새 이름·자료형을 씁니다.', [
    'ALTER TABLE Member ___ COLUMN email VARCHAR(60);',
    'ALTER TABLE Item ___ COLUMN price INTEGER NOT NULL;',
    'ALTER TABLE Member ___ COLUMN phone contact VARCHAR(30);',
  ][round]))
  questions.push(written(id(25), 'SQL 정의어', 'DELETE FROM T;와 DROP TABLE T;가 성공했을 때 남는 것을 비교하세요. 또한 자식이 외래키로 참조하는 부모에 ON DELETE CASCADE가 있다고 해서 DROP TABLE이 자식 테이블까지 자동으로 삭제하는지도 설명하세요.', 'DELETE FROM T는 행을 삭제하되 테이블 구조를 남긴다. DROP TABLE T는 테이블 자체를 제거한다. ON DELETE CASCADE는 부모 행의 DELETE에 대한 자식 행 처리 규칙이며, DROP 시 자식 테이블을 자동 제거한다는 뜻이 아니다. 외래키로 참조 중인 부모의 DROP은 제약 때문에 거절될 수 있다.', '행 삭제와 구조 삭제를 구별하고, 연쇄 행 삭제와 테이블 제거를 동일시하지 않아야 합니다. 이 문항은 앞의 두 명령이 성공한 경우를 비교하고, 참조 중인 부모의 DROP은 별도로 판단합니다.'))
  questions.push(blank(id(26), 'SQL 조작어', '새 품목 행을 삽입한다. 빈칸의 SQL 키워드를 쓰세요. 이 문항은 기준 데이터와 독립된 테이블에서 실행한다.', 'VALUES', ['VALUES'], '열 목록과 VALUES 값 목록의 순서를 대응시킵니다.', `INSERT INTO NewItem (item_id, name, price)\n___ (9, '${data.items[0][1]} 추가판', ${data.threshold});`))
  const updatedPrice = data.items[0][3] + 1000
  questions.push(choice(id(27), 'SQL 조작어', '기준 데이터에서 아래 UPDATE만 실행했다. 변경되는 결과로 옳은 것은? 이 변경은 다른 문제에 이어지지 않는다.', [`item_id=1인 행의 price만 ${updatedPrice}가 된다.`, `모든 행의 price가 ${updatedPrice}가 된다.`, 'item_id=1인 행이 삭제된다.', 'price 열의 자료형이 바뀐다.'],0,'WHERE는 수정 대상을 제한합니다. 표현식은 해당 행의 기존 가격에 1000을 더합니다.', [itemTable], 'UPDATE Item\nSET price = price + 1000\nWHERE item_id = 1;'))
  questions.push(blank(id(28), 'SQL 조작어', '구매 기록 한 건만 삭제한다. 모든 행이 지워지지 않도록 빈칸의 절을 쓰세요. 기준 데이터는 다른 문제에서 그대로 유지한다.', 'WHERE', ['WHERE'], '조건 없는 DELETE는 테이블의 모든 행을 삭제합니다. 특정 기본키 행만 지우려면 WHERE로 제한합니다.', 'DELETE FROM Purchase\n___ purchase_id = 2;'))
  const filtered = data.items.filter(row => row[3] >= data.threshold && row[3] <= data.threshold * 2).map(row => [row[0]])
  qc(29,'SQL 검색','BETWEEN 조건을 적용한 item_id 결과를 실행 순서대로 고르세요.',`SELECT item_id FROM Item\nWHERE price BETWEEN ${data.threshold} AND ${data.threshold * 2}\nORDER BY item_id;`, filtered, ['(1) · (2) · (3) · (4) · (5)','0행',filtered.slice(0,1).map(row=>`(${row[0]})`).join('')], 'BETWEEN은 양 끝값을 포함합니다. 가격 조건으로 고른 뒤 item_id로 정렬합니다.', [itemTable])
  questions.push(blank(id(30), 'SQL 검색', `이름이 '${data.prefix}'로 시작하는 품목을 찾는다. 빈칸에 비교 연산자를 쓰세요.`, 'LIKE', ['LIKE'], '%는 길이가 0 이상인 문자열을 뜻합니다. 뒤에만 붙였으므로 지정 문자열로 시작하는 이름을 찾습니다.', `SELECT item_id, name FROM Item\nWHERE name ___ '${data.prefix}%';`))
  const missingPhone = data.members.filter(row=>row[3]===null).map(row=>[row[0]])
  qc(31,'SQL 검색','연락처가 없는 회원을 조회한 결과는?', 'SELECT member_id FROM Member\nWHERE phone IS NULL\nORDER BY member_id;', missingPhone, ['0행','(1) · (2) · (3) · (4)','(4)'], 'NULL 여부는 = NULL이 아니라 IS NULL로 검사합니다.', [memberTable])
  const cityCount = new Set(data.members.map(row=>row[2])).size
  qc(32,'SQL 검색','아래 집계 결과의 (all_count, phone_count, city_count)를 고르세요.', 'SELECT COUNT(*) AS all_count,\n       COUNT(phone) AS phone_count,\n       COUNT(DISTINCT city) AS city_count\nFROM Member;', [[data.members.length,data.members.filter(row=>row[3]!==null).length,cityCount]], ['(4, 4, 4)','(3, 3, 4)','(4, 4, 3)'], 'COUNT(*)는 모든 행, COUNT(phone)은 NULL이 아닌 값, COUNT(DISTINCT city)는 중복을 제거한 NULL 아닌 도시 수를 셉니다.', [memberTable])
  const total = data.purchases.reduce((sum,row)=>sum+row[4],0)
  qc(33,'SQL 검색','Purchase.paid는 수량 전체를 합친 결제액이다. 총 결제액과 최소 결제액은?', 'SELECT SUM(paid), MIN(paid)\nFROM Purchase;', [[total,Math.min(...data.purchases.map(row=>row[4]))]], [`(${total * 2}, ${Math.min(...data.purchases.map(row=>row[4]))})`,`(${data.purchases.length}, ${total})`,`(${total}, ${Math.max(...data.purchases.map(row=>row[4]))})`], 'paid는 이미 주문 한 건의 총액이므로 qty를 다시 곱하지 않습니다. SUM은 합계, MIN은 최솟값입니다.', [purchaseTable])
  questions.push(blank(id(34), 'SQL 검색', '회원별로 묶은 뒤 구매가 2건 이상인 그룹만 남긴다. 빈칸에 들어갈 절은?', 'HAVING', ['HAVING'], 'WHERE는 그룹화 전 개별 행의 조건이고 HAVING은 집계 후 그룹 조건입니다.', 'SELECT member_id, COUNT(*) AS cnt\nFROM Purchase\nGROUP BY member_id\n___ COUNT(*) >= 2;'))
  const sorted = [...data.items].sort((a,b)=>b[3]-a[3]||a[0]-b[0]).map(row=>[row[0]])
  qc(35,'SQL 검색','정렬 결과의 item_id 순서는?', 'SELECT item_id FROM Item\nORDER BY price DESC, item_id ASC;', sorted, ['(1) · (2) · (3) · (4) · (5)','(5) · (4) · (3) · (2) · (1)','(2) · (1) · (4) · (3) · (5)'], '첫 기준은 가격 내림차순이고, 가격이 같을 때만 item_id 오름차순을 적용합니다.', [itemTable])
  const wantedMember = round + 1
  const joined = data.purchases.filter(row=>row[1]===wantedMember).map(row=>[row[0],data.members.find(member=>member[0]===row[1])![1]])
  qc(36,'JOIN','회원과 구매를 연결했다. 출력되는 (purchase_id, name) 행을 고르세요.', `SELECT p.purchase_id, m.name\nFROM Member m JOIN Purchase p\n  ON m.member_id = p.member_id\nWHERE m.member_id = ${wantedMember}\nORDER BY p.purchase_id;`, joined, ['0행',`(${wantedMember}, ${data.members[wantedMember-1][1]})`, '(1, NULL) · (2, NULL) · (3, NULL)'], '연결 조건은 회원번호가 같은 행끼리입니다. 한 회원에게 구매가 여러 건이면 회원 이름도 여러 행에 나옵니다.', [memberTable,purchaseTable])
  qc(37,'JOIN','LEFT JOIN 뒤 오른쪽 기본키가 NULL인 행만 남겼다. 결과는?', 'SELECT m.member_id, p.purchase_id\nFROM Member m LEFT JOIN Purchase p\n  ON m.member_id = p.member_id\nWHERE p.purchase_id IS NULL\nORDER BY m.member_id;', [[4,null]], ['0행','(4, 0)','(1, NULL) · (2, NULL) · (3, NULL)'], '구매가 없는 4번 회원도 LEFT JOIN으로 보존되며 오른쪽 값은 NULL이 됩니다. NULL은 숫자 0이 아닙니다.', [memberTable,purchaseTable])
  questions.push(blank(id(38), '부속질의', '최고 정가의 품목을 모두 조회한다. 부속질의의 함수 이름을 쓰세요.', 'MAX', ['MAX'], '최고가 한 값을 구한 뒤 그 값과 같은 모든 품목을 찾습니다. 최고가가 같으면 여러 행이 나올 수 있습니다.', 'SELECT item_id, name FROM Item\nWHERE price = (SELECT ___(price) FROM Item);'))
  const wantedCity = data.members[0][2]
  const matchingMembers = data.members.filter(row=>row[2]===wantedCity).map(row=>row[0])
  const cityTotal = data.purchases.filter(row=>matchingMembers.includes(row[1])).reduce((sum,row)=>sum+row[4],0)
  const citySql = round === 1
    ? `SELECT SUM(p.paid) AS total_paid\nFROM Purchase p\nWHERE EXISTS (\n  SELECT 1 FROM Member m\n  WHERE m.member_id = p.member_id AND m.city = '${wantedCity}'\n);`
    : `SELECT SUM(paid) AS total_paid\nFROM Purchase\nWHERE member_id IN (\n  SELECT member_id FROM Member WHERE city = '${wantedCity}'\n);`
  questions.push({ ...written(id(39), '부속질의', `부속질의와 외부 질의의 역할을 설명하고 total_paid 결과를 계산하세요. ${wantedCity} 회원 중 구매가 없는 회원이 있다면 합계에 어떤 영향을 주는지도 설명하세요.`, `${round === 1 ? `EXISTS 부속질의는 각 구매의 회원이 ${wantedCity}에 거주하는 회원인지 존재 여부를 검사한다. 해당 회원번호는 ${matchingMembers.join(', ')}이다.` : `IN 부속질의는 ${wantedCity} 회원번호 ${matchingMembers.join(', ')}를 구한다.`} 외부 질의는 그 회원들의 구매 행을 골라 paid를 합산하므로 결과는 ${cityTotal}이다. 구매가 없는 회원은 더할 구매 행이 없으므로 합계에 금액을 보태지 않는다.`, '도시 조건은 Member에 적용하고 실제 결제액은 Purchase에서 합산해야 합니다. Item의 정가를 더하지 않습니다.', [memberTable,purchaseTable], citySql), sqlCheck: { sql: citySql, rows: [[cityTotal]] } })
  const aboveOwn = data.items.filter(item=>item[3]>data.items.filter(other=>other[2]===item[2]).reduce((sum,other)=>sum+other[3],0)/data.items.filter(other=>other[2]===item[2]).length).map(item=>[item[0]])
  const correlatedSql = 'SELECT i.item_id FROM Item i\nWHERE i.price > (\n  SELECT AVG(j.price) FROM Item j\n  WHERE j.category = i.category\n)\nORDER BY i.item_id;'
  if (round === 0) {
    questions.push({ ...written(id(40), '부속질의', '아래 상관 부속질의의 결과 item_id를 순서대로 쓰고, 내부의 j.category = i.category가 필요한 이유를 설명하세요. 이 조건을 없애면 어떤 평균과 비교하는지도 쓰세요.', `결과는 ${aboveOwn.map(row=>row[0]).join(', ')}이다. 외부 품목과 같은 category의 평균을 계산하려고 조건이 필요하다. 조건을 없애면 같은 분류가 아닌 전체 품목의 평균과 비교한다. 분류에 품목이 하나뿐이면 자신과 평균이 같아 엄격한 > 조건에서는 제외된다.`, '각 분류의 평균과 품목별 가격을 비교하세요. 상관 조건이 외부 행의 값을 내부 질의에 연결한다는 점이 핵심입니다.', [itemTable], correlatedSql), sqlCheck: { sql: correlatedSql, rows: aboveOwn } })
  } else if (round === 1) {
    const totals = data.members.map(member => [member[0], data.purchases.filter(purchase => purchase[1] === member[0]).reduce((sum,purchase) => sum + purchase[4],0)]).filter(row => row[1] >= 30000)
    const derivedSql = 'SELECT t.member_id, t.total_paid\nFROM (\n  SELECT member_id, SUM(paid) AS total_paid\n  FROM Purchase GROUP BY member_id\n) AS t\nWHERE t.total_paid >= 30000\nORDER BY t.member_id;'
    questions.push({ ...written(id(40), '부속질의', 'FROM 안의 부속질의로 만든 파생 테이블 t의 의미와 바깥 WHERE의 역할을 설명하고, 최종 (member_id, total_paid)를 쓰세요.', `t는 회원별 구매 총액을 계산한 파생 테이블이다. 바깥 WHERE는 총액이 30000 이상인 회원만 남긴다. 결과는 ${totals.map(row=>`(${row.join(', ')})`).join(', ')}이다. MySQL에서는 이 파생 테이블에 t와 같은 별칭을 붙여야 한다.`, '개별 구매액이 아니라 회원별로 집계한 합계에 조건을 적용한다는 점과 정확한 결과를 설명하세요.', [purchaseTable], derivedSql), sqlCheck: { sql: derivedSql, rows: totals } })
  } else {
    const noPurchase = data.items.filter(item => !data.purchases.some(purchase => purchase[2] === item[0])).map(item => [item[0]])
    const existsSql = 'SELECT i.item_id FROM Item i\nWHERE NOT EXISTS (\n  SELECT 1 FROM Purchase p\n  WHERE p.item_id = i.item_id\n)\nORDER BY i.item_id;'
    questions.push({ ...written(id(40), '부속질의', 'NOT EXISTS가 검사하는 대상을 설명하고 결과 item_id를 쓰세요. 내부의 p.item_id = i.item_id 조건을 제거하면 왜 결과가 달라지는지도 설명하세요.', `해당 품목을 구매한 행이 한 건도 없는 품목을 찾으므로 결과는 ${noPurchase.map(row=>row[0]).join(', ')}이다. 내부 연결 조건이 없으면 외부 품목과 무관하게 Purchase에 한 행이라도 있는지만 검사한다. 제시한 데이터에는 구매가 존재하므로 NOT EXISTS가 모든 품목에 대해 FALSE가 되어 0행이 나온다.`, '외부의 각 품목별 존재 검사가 상관 조건 없이 전체 구매 테이블의 존재 검사로 바뀐다는 점을 설명하세요.', [itemTable,purchaseTable], existsSql), sqlCheck: { sql: existsSql, rows: noPurchase } })
  }
  questions.sort((a,b)=>a.id.localeCompare(b.id))
  return { id: `full-${round + 1}`, title: `${round + 1}회 · 전 범위 종합 모의고사`, description: '데이터·정보 → DBMS → DBS → 관계 모델 → SQL 정의·조작·검색 → JOIN·부속질의', context: data.title, questions }
})
