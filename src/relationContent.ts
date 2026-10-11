import type { SearchEntry } from './content'
import { relationScenarios } from './relationExampleData'

export const relationTerms = [
  ['릴레이션', 'Relation', '하나의 개체에 관한 데이터를 2차원 테이블 구조로 저장한 것'],
  ['속성', 'Attribute', '테이블의 열에 해당하며, 파일 시스템의 필드에 대응'],
  ['투플', 'Tuple', '테이블의 행에 해당하며, 파일 시스템의 레코드에 대응'],
  ['도메인', 'Domain', '하나의 속성이 가질 수 있는 모든 값의 집합. 입력·수정 시 적합성 판단의 기준'],
  ['널', 'NULL', '속성 값을 아직 모르거나 해당되는 값이 없음'],
  ['차수', 'Degree', '하나의 릴레이션에서 속성의 전체 개수'],
  ['카디널리티', 'Cardinality', '하나의 릴레이션에서 투플의 전체 개수'],
]
export const relationProperties = [
  { title: '투플의 유일성', text: '하나의 릴레이션에는 동일한 투플이 존재할 수 없다.', example: '모든 속성 값이 같은 행을 중복해서 넣지 않는다.' },
  { title: '투플의 무순서', text: '투플 사이의 순서는 무의미하다.', example: '학생 행의 표시 순서를 바꿔도 같은 릴레이션이다.' },
  { title: '속성의 무순서', text: '속성 사이의 순서는 무의미하다.', example: '학생번호와 이름 열의 표시 순서를 바꿔도 같은 릴레이션이다.' },
  { title: '속성의 원자성', text: '속성 값으로 원자 값만 사용한다.', example: '한 칸에 여러 값을 함께 넣는 다중 값 속성은 관계 데이터 모델의 릴레이션에 적합하지 않다.' },
]
export const keyKinds = [
  ['슈퍼키', 'Super key', '유일성을 만족하는 속성 또는 속성들의 집합', '학생번호 / 학생번호 + 이름'],
  ['후보키', 'Candidate key', '유일성과 최소성을 모두 만족하는 속성 또는 속성들의 집합', '학생번호 / 이메일'],
  ['기본키', 'Primary key', '후보키 중 기본적으로 사용하기 위해 선택한 키', '기본키로 학생번호를 선택'],
  ['대체키', 'Alternate key', '기본키로 선택되지 않은 후보키', '이메일'],
  ['외래키', 'Foreign key', '다른 릴레이션의 기본키를 참조하는 속성 또는 속성들의 집합', '학생의 학과번호 → 학과의 학과번호'],
]
export const relationGroups = [
  { section: 'relation-intro', title: '관계 모델과 기본 용어', keywords: [{ title: '릴레이션 · 속성 · 투플', target: 'relation-explorer' }, { title: '차수 · 카디널리티', target: 'relation-explorer' }, { title: '도메인 · NULL', target: 'relation-domain' }] },
  { section: 'relation-structure', title: '구성과 특성', keywords: [{ title: '스키마 · 인스턴스', target: 'relation-structure' }, { title: '학교 릴레이션 예시', target: 'examples-school' }, { title: '쇼핑 릴레이션 예시', target: 'examples-shop' }, { title: '도서관 릴레이션 예시', target: 'examples-library' }, { title: '유일성 · 무순서 · 원자성', target: 'relation-properties' }] },
  { section: 'relation-keys', title: '키', keywords: [{ title: '유일성 · 최소성', target: 'key-explorer' }, { title: '슈퍼키 · 후보키 · 기본키 · 대체키', target: 'key-kinds' }, { title: '외래키', target: 'foreign-key' }] },
  { section: 'relation-integrity', title: '무결성 제약조건', keywords: [{ title: '개체 무결성', target: 'entity-integrity' }, { title: '참조 무결성', target: 'reference-integrity' }, { title: '고객·주문: 잘못된 참조 예시', target: 'customer-reference-example' }] },
]
export const relationSearchEntries: SearchEntry[] = [
  { title: '고객 주문 참조 무결성 위반 예시', text: 'cherry apple banana carrot orange 고객아이디 주문고객 기본키 외래키 존재하지 않는 고객 잘못된 참조', section: 'relation-integrity', target: 'customer-reference-example', page: 'relation' },
  ...relationScenarios.flatMap(scenario => scenario.relations.map(relation => ({ title: `${relation.name} 릴레이션 예시`, text: `${scenario.title} ${relation.columns.map(column => column.name).join(' ')} ${relation.note}`, section: 'relation-structure', target: `example-${relation.id}`, page: 'relation' as const }))),
  { title: '관계 데이터 모델', text: '개념적 구조를 논리적 구조로 표현 논리적 데이터 모델 하나의 개체 데이터를 하나의 릴레이션에 저장', section: 'relation-intro', page: 'relation' },
  ...relationTerms.map(([title, english, text]) => ({ title: `${title} ${english}`, text, section: 'relation-intro', target: title === '도메인' || title === '널' ? 'relation-domain' : 'relation-explorer', page: 'relation' as const })),
  ...relationProperties.map(item => ({ title: item.title, text: `${item.text} ${item.example}`, section: 'relation-structure', target: 'relation-properties', page: 'relation' as const })),
  { title: '데이터베이스 스키마 인스턴스', text: '릴레이션 스키마 모음 데이터베이스 전체 구조 릴레이션 인스턴스 모음', section: 'relation-structure', page: 'relation' },
  ...keyKinds.map(([title, english, text, example]) => ({ title: `${title} ${english}`, text: `${text} ${example}`, section: 'relation-keys', target: title === '외래키' ? 'foreign-key' : 'key-kinds', page: 'relation' as const })),
  { title: '유일성 최소성', text: 'uniqueness minimality 서로 다른 키 값 꼭 필요한 최소 속성', section: 'relation-keys', target: 'key-explorer', page: 'relation' },
  { title: '개체 무결성', text: '기본키 구성 모든 속성 널 NULL 불가', section: 'relation-integrity', target: 'entity-integrity', page: 'relation' },
  { title: '참조 무결성', text: '외래키 참조할 수 없는 값 불가 정확 유효 일관성', section: 'relation-integrity', target: 'reference-integrity', page: 'relation' },
]
