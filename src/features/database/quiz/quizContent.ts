export type QuizTopic = 'basics' | 'dbms' | 'dbs' | 'relation'
export type QuizQuestion = { id: string; topic: QuizTopic; type: 'choice' | 'ox'; prompt: string; options: string[]; answer: number; explanation: string; target: string }
export const topicNames: Record<QuizTopic, string> = { basics: '데이터베이스, 정보', dbms: 'DBMS', dbs: 'DBS', relation: '관계 데이터 모델' }
const choice = (id: string, topic: QuizTopic, prompt: string, options: string[], answer: number, explanation: string, target: string): QuizQuestion => ({ id, topic, type: 'choice', prompt, options, answer, explanation, target })
const ox = (id: string, topic: QuizTopic, prompt: string, answer: boolean, explanation: string, target: string): QuizQuestion => ({ id, topic, type: 'ox', prompt, options: ['O · 맞다', 'X · 틀리다'], answer: answer ? 0 : 1, explanation, target })

export const quizQuestions: QuizQuestion[] = [
  choice('b1', 'basics', '데이터베이스의 정의에 포함되는 네 가지 핵심 단어는?', ['검색·삭제·수정·삽입', '정형·반정형·비정형·수치형', '통합·저장·공유·운영', '정의·조작·제어·회복'], 2, '특정 조직의 여러 사용자가 공유하여 사용할 수 있도록 통합해서 저장한 운영 데이터의 집합이다.', 'database-definition'),
  choice('b2', 'basics', '데이터와 정보의 관계를 가장 잘 설명한 것은?', ['데이터에 의미를 부여하면 정보가 된다.', '정보는 목적이나 관련성과 무관하다.', '모든 숫자는 언제나 정보이다.', '데이터는 반드시 테이블에 저장되어야 한다.'], 0, '데이터는 관측한 사실이나 값이고, 정보는 관련성과 목적성을 갖춘 데이터이다.', 'data-comparison'),
  choice('b3', 'basics', '내용 안에 구조에 대한 설명이 함께 존재하는 데이터는?', ['비정형 데이터', '반정형 데이터', '연속형 데이터', '명목형 데이터'], 1, '반정형 데이터에는 내용과 함께 구조 설명이 들어 있다. JSON·XML 등이 예시이다.', 'data-shapes'),
  choice('b4', 'basics', '빅데이터의 3V 중 생성 속도를 나타내는 것은?', ['Variety', 'Volume', 'Value', 'Velocity'], 3, 'Volume은 크기, Velocity는 생성 속도, Variety는 다양성이다.', 'big-data'),
  ox('b5', 'basics', '정보는 필요한 시점에 제공되어야 가치가 있다.', true, '정보의 적시성에 대한 설명이다.', 'information-values'),
  ox('b6', 'basics', '데이터베이스는 저장 주소나 위치만으로 데이터를 참조한다.', false, '내용 기반 참조를 지원한다. 재고량이 1,000개 이상인 제품 이름 검색이 예시이다.', 'database-features'),
  ox('b7', 'basics', '혈액형은 서열이 없는 명목형 데이터의 예이다.', true, '명목형은 서열 없이 종류를 구분하는 값이다.', 'data-types'),
  ox('b8', 'basics', '이미지와 영상은 미리 정해진 테이블 구조를 가지므로 정형 데이터이다.', false, '해당 수업 분류에서 이미지·영상은 비정형 데이터의 예이다.', 'data-shapes'),
  choice('m1', 'dbms', '파일 시스템의 데이터 중복성에 해당하는 상황은?', ['하나의 데이터가 여러 파일에 중복 저장된다.', '스키마가 하나만 존재한다.', '파일이 저장 장치에 존재한다.', '사용자가 데이터를 검색한다.'], 0, '응용 프로그램별 별도 파일 관리로 같은 데이터가 여러 파일에 중복될 수 있다.', 'file-problems'),
  choice('m2', 'dbms', 'DBMS가 데이터베이스 구조를 정의하거나 수정하는 기능은?', ['제어 기능', '공유 기능', '정의 기능', '조작 기능'], 2, '정의 기능은 데이터베이스 구조 정의·수정을 담당한다.', 'dbms-functions'),
  choice('m3', 'dbms', '트리 구조와 상하관계를 기반으로 하는 데이터베이스는?', ['관계형', '계층형', '네트워크형', '객체관계형'], 1, '계층형 데이터베이스는 트리 구조와 상하관계 링크를 이용한다.', 'dbms-models'),
  choice('m4', 'dbms', 'DBMS의 단점으로 정리된 것은?', ['데이터 중복 통제', '데이터 독립성 확보', '장애 발생 시 회복', '백업과 회복 방법의 복잡성'], 3, '비용, 복잡한 백업·회복, 중앙 집중 관리의 취약점이 단점이다.', 'dbms-tradeoffs'),
  ox('m5', 'dbms', '파일 시스템에서는 응용 프로그램이 데이터 파일에 종속적일 수 있다.', true, '데이터 종속성은 파일 시스템의 한계 중 하나이다.', 'file-problems'),
  ox('m6', 'dbms', '데이터 삽입·삭제·수정·검색은 DBMS의 제어 기능에 해당한다.', false, '이 연산들은 조작 기능이며, 제어 기능은 정확성과 안전성을 유지한다.', 'dbms-functions'),
  ox('m7', 'dbms', '관계형 데이터베이스는 개체를 테이블로 표현하고 공통 속성으로 연결한다.', true, '관계형 데이터 모델에 대한 설명이다.', 'dbms-models'),
  ox('m8', 'dbms', '객체관계 DBMS는 객체지향 DBMS와 관계 DBMS를 결합한 것이다.', true, '객체관계 DBMS는 관계형 구조와 객체지향 기능을 결합한다.', 'generation-1'),
  choice('s1', 'dbs', '학생(학생번호, 학년)이라는 구조에 현재 (101, 1), (102, 2)가 저장되어 있다. 이 시점에 저장된 두 투플의 집합을 무엇이라 하는가?', ['릴레이션 인스턴스', '릴레이션 스키마', '외부/개념 사상', '데이터 디렉터리'], 0, '스키마는 속성·자료형·제약조건 같은 구조의 정의이다. 릴레이션 인스턴스는 그 스키마에 따라 특정 시점에 저장된 투플들의 집합이다. 이 문제에서는 {(101, 1), (102, 2)}가 인스턴스이며, 데이터를 추가·수정·삭제하면 인스턴스가 달라진다.', 'schema-instance'),
  choice('s2', 'dbs', '개별 사용자 관점에서 필요한 논리적 구조를 정의하는 단계는?', ['내부 단계', '개념 단계', '외부 단계', '물리 단계'], 2, '외부 스키마는 사용자마다 다를 수 있고 여러 개 존재할 수 있다.', 'dbs-levels'),
  choice('s3', 'dbs', '내부 스키마 변경이 개념 스키마에 영향을 주지 않는 특성은?', ['투플의 유일성', '물리적 데이터 독립성', '논리적 데이터 독립성', '정보의 적시성'], 1, '물리적 독립성은 내부 스키마 변경 시 개념 스키마를 유지하는 특성이다. 관련 개념/내부 사상을 수정한다.', 'physical-independence'),
  choice('s4', 'dbs', '어떤 데이터를 원하는지만 설명하는 조작어는?', ['절차적 DML', 'DDL', 'DCL', '비절차적 DML'], 3, '비절차적 DML은 What만 설명하고, 절차적 DML은 What과 How를 설명한다.', 'dml-comparison'),
  ox('s5', 'dbs', '하나의 데이터베이스에는 개념 스키마가 여러 개 존재한다.', false, '3단계 구조에서 개념 스키마는 하나이며 외부 스키마는 여러 개 존재할 수 있다.', 'dbs-levels'),
  ox('s6', 'dbs', '데이터 사전은 스키마·사상·제약조건 같은 메타데이터를 유지한다.', true, '메타데이터는 데이터에 대한 데이터이고, DBMS가 데이터 사전을 생성·유지한다.', 'dbs-catalog'),
  ox('s7', 'dbs', 'DDL은 저장된 데이터 값의 검색만을 담당한다.', false, 'DDL은 스키마 정의·수정·삭제를 담당하며, 데이터 검색은 DML의 역할이다.', 'dbs-languages'),
  ox('s8', 'dbs', '개념 스키마가 바뀌어도 외부 스키마가 영향을 받지 않는 것은 논리적 데이터 독립성이다.', true, '관련 외부/개념 사상을 정확하게 수정해 상위 외부 구조를 유지한다.', 'logical-independence'),
  choice('r1', 'relation', '속성이 4개이고 투플이 3개인 릴레이션의 차수와 카디널리티는?', ['차수 3, 카디널리티 4', '차수 7, 카디널리티 12', '차수 4, 카디널리티 3', '차수 12, 카디널리티 7'], 2, '차수는 속성 수, 카디널리티는 투플 수이다.', 'relation-explorer'),
  choice('r2', 'relation', '다음 중 유일성과 최소성을 모두 요구하는 키의 종류는?', ['슈퍼키', '후보키', '외래키', '도메인'], 1, '후보키는 유일성과 최소성을 모두 만족한다. 슈퍼키는 유일성만 요구하며, 도메인은 속성이 가질 수 있는 값의 집합이다.', 'key-explorer'),
  choice('r3', 'relation', '주문 테이블의 주문고객은 고객 테이블의 고객아이디를 참조하는 외래키다. 고객아이디가 apple과 banana인 고객만 있을 때, 주문고객이 cherry인 주문을 추가하면 어떤 제약을 위반하는가? 주문번호 등 다른 값은 모든 조건을 만족한다.', ['참조 무결성 위반', '기본키의 NULL 금지 조건 위반', '투플 표시 순서 위반', '어떤 제약도 위반하지 않는다.'], 0, '주문이 참조하는 고객 cherry가 고객 테이블에 없다. 따라서 참조 무결성을 위반한다.', 'customer-reference-example'),
  choice('r4', 'relation', '기본키로 선택되지 않은 후보키를 무엇이라 하는가?', ['외래키', '도메인', '투플', '대체키'], 3, '기본키는 선택한 후보키이고, 나머지 후보키는 대체키이다.', 'key-kinds'),
  ox('r5', 'relation', '이론적인 관계 데이터 모델의 릴레이션에는 동일한 투플이 존재할 수 없다.', true, '릴레이션은 투플의 집합이므로 동일한 투플이 중복되지 않는다. 실제 SQL 테이블은 제약조건을 설정하지 않으면 중복 행을 허용할 수 있으므로 구별해야 한다.', 'relation-properties'),
  ox('r6', 'relation', '기본키를 구성하는 속성 중 일부는 NULL이어도 된다.', false, '개체 무결성에 따라 기본키의 모든 구성 속성은 NULL일 수 없다.', 'entity-integrity'),
  ox('r7', 'relation', '학생 테이블의 학과번호는 학과 테이블을 참조하는 외래키이며 UNIQUE 제약은 없다. 학과번호 10인 학과가 존재하고 다른 제약도 모두 만족한다면, 서로 다른 두 학생의 학과번호를 모두 10으로 저장할 수 있다.', true, '두 학생이 같은 학과에 소속될 수 있다. 학생을 구별하는 기본키와 달리, 학과를 참조하는 외래키에는 별도의 UNIQUE 제약이 없는 한 중복 값을 저장할 수 있다.', 'foreign-key'),
  ox('r8', 'relation', '투플과 속성의 표시 순서를 바꾸면 릴레이션의 의미가 반드시 달라진다.', false, '릴레이션에서 투플과 속성 사이의 순서는 무의미하다.', 'relation-properties'),
]

export type PracticeQuestion = { id: string; title: string; prompt: string; columns: string[]; rows: string[][]; mode: 'columns' | 'rows'; correct: number[]; explanation: string; context: string }
export const practiceQuestions: PracticeQuestion[] = [
  { id: 'p1', title: '후보키 만들기', prompt: '이름·학년은 중복될 수 있고 학생번호는 유일하다. 후보키가 되도록 최소한의 열을 선택하세요.', columns: ['학생번호', '이름', '학년'], rows: [['101', '학생 A', '1'], ['102', '학생 B', '2'], ['103', '학생 A', '1']], mode: 'columns', correct: [0], explanation: '학생번호만으로 모든 학생을 구별하므로 후보키이다. 이름·학년을 더하면 최소성을 만족하지 못한다.', context: '학생번호의 유일성을 조건으로 정한 예시입니다.' },
  { id: 'p2', title: '복합 기본키 만들기', prompt: '학생은 여러 과목을 듣고 과목에는 여러 학생이 있다. 같은 학생·과목 조합은 한 번만 저장한다. 기본키를 구성할 열을 선택하세요.', columns: ['학생번호', '과목번호', '성적'], rows: [['101', 'DB01', 'A'], ['101', 'AL01', 'B'], ['102', 'DB01', 'A']], mode: 'columns', correct: [0, 1], explanation: '학생번호와 과목번호 각각은 중복된다. 두 속성의 조합이 유일하고 최소인 복합 기본키이다.', context: '학생번호 + 과목번호의 유일성을 조건으로 정했습니다. 성적은 키가 아닙니다.' },
  { id: 'p3', title: '참조 가능한 주문 고르기', prompt: '고객 릴레이션의 기본키는 apple·banana·carrot이다. 주문고객은 NULL을 허용하지 않는다. 저장할 수 있는 주문 투플을 모두 선택하세요.', columns: ['주문번호 PK', '주문고객 FK', '수량'], rows: [['1001', 'cherry', '10'], ['1002', 'carrot', '5'], ['1003', 'banana', '11'], ['1004', 'apple', '2']], mode: 'rows', correct: [1, 2, 3], explanation: 'cherry는 고객 표에 없어 참조할 수 없다. 나머지 주문은 존재하는 고객을 참조한다.', context: '참조 대상 고객(고객아이디): apple / banana / carrot' },
  { id: 'p4', title: '개체 무결성을 지키는 행 고르기', prompt: '학생번호가 기본키이다. 제시된 행 중 기본키의 NULL 금지 조건을 만족하는 투플을 모두 선택하세요.', columns: ['학생번호 PK', '이름', '학년'], rows: [['101', '학생 A', '1'], ['NULL', '학생 B', '2'], ['103', '학생 C', '3']], mode: 'rows', correct: [0, 2], explanation: '기본키는 NULL을 가질 수 없다. 학생 B의 행은 개체 무결성을 위반한다.', context: '각 학생번호는 중복되지 않으며, 이 문제는 NULL 여부를 비교합니다.' },
  { id: 'p5', title: '원자성을 지키는 투플 고르기', prompt: '연락처 속성은 한 칸에 하나의 연락처만 저장한다. 원자성 조건에 맞는 투플을 모두 선택하세요.', columns: ['학생번호 PK', '이름', '연락처'], rows: [['101', '학생 A', '010-0000-1001'], ['102', '학생 B', '010-0000-1002, 010-0000-2002'], ['103', '학생 C', '010-0000-1003']], mode: 'rows', correct: [0, 2], explanation: '학생 B의 연락처 칸에는 두 값이 함께 들어 있다. 이 예시에서 정한 연락처 도메인의 원자 값이 아니다.', context: '연락처 도메인의 각 값은 하나의 전화번호로 정했습니다.' },
  { id: 'p6', title: '조건에 맞는 학생 릴레이션 구성하기', prompt: '학과 기본키는 10·20이다. 학생번호는 기본키, 소속학과는 외래키이며 NULL을 허용한다. 이름은 원자 값이다. 모든 조건을 만족하는 행을 선택하세요.', columns: ['학생번호 PK', '이름', '소속학과 FK'], rows: [['101', '학생 A', '10'], ['102', '학생 B', '20'], ['NULL', '학생 C', '10'], ['104', '학생 D', '99'], ['105', '학생 E', 'NULL']], mode: 'rows', correct: [0, 1, 4], explanation: '101·102는 존재하는 학과를 참조한다. 105는 외래키 NULL을 허용하므로 가능하다. NULL 기본키와 존재하지 않는 학과 99는 허용되지 않는다.', context: '학과(학과번호 PK): 10 / 20 · 선택한 행들로 저장 가능한 릴레이션을 만듭니다.' },
]
