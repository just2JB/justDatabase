import type { SearchEntry } from './content'

export const dbmsFunctions = [
  { title: '정의', text: '데이터베이스 구조를 정의하고 수정한다.', example: '구조', action: '구조 보기' },
  { title: '조작', text: '데이터를 삽입, 삭제, 수정, 검색한다.', example: '데이터', action: '데이터 보기' },
  { title: '제어', text: '데이터를 항상 정확하고 안전하게 유지한다.', example: '정확성 · 안전성', action: '제어 보기' },
]
export const advantages = ['데이터 중복 통제', '데이터 독립성 확보', '데이터 동시 공유', '데이터 보안 향상', '데이터 무결성 유지', '표준화', '장애 발생 시 회복', '응용 프로그램 개발 비용 감소']
export const disadvantages = ['높은 비용', '복잡한 백업과 회복 방법', '중앙 집중 관리로 인한 취약점']
export const models = [
  { title: '계층형', text: '트리 구조를 기반으로 데이터를 상하관계의 링크로 구성한다.', note: '관계 변경·추가·삭제 시 기존 구조를 변경하기 어렵다.' },
  { title: '네트워크형', text: '그래프 구조를 기반으로 개체와 개체의 관계를 연결한다.', note: '구조가 복잡하다.' },
  { title: '관계형', text: '개체를 테이블로 표현하고 공통 속성을 이용해 연결한다.', note: '독립된 형태의 데이터 모델로, 안정적이고 효율적인 데이터베이스이다.' },
]
export const generations = [
  { generation: '2세대', title: '관계 DBMS', items: [
    { title: '관계 DBMS', description: '데이터베이스를 테이블 형태로 구성한다.', details: [], examples: 'Oracle, MS SQL Server, Access, Informix, MySQL, MariaDB' },
  ] },
  { generation: '3세대', title: '객체지향 · 객체관계 DBMS', items: [
    { title: '객체지향 DBMS', description: '객체를 이용해 데이터베이스를 구성한다.', details: [], examples: 'O2, ONTOS, GemStone' },
    { title: '객체관계 DBMS', description: '객체지향 DBMS와 관계 DBMS를 결합한다.', details: ['관계 DBMS 제품이 객체지향 기능을 지원하면서 객체관계 DBMS로 분류되기도 한다.'], examples: 'Oracle' },
  ] },
  { generation: '4세대', title: 'NoSQL · NewSQL DBMS', items: [
    { title: 'NoSQL DBMS', description: '비정형 데이터 처리에 적합하며 확장성이 뛰어나다.', details: ['안정성과 일관성 유지를 위한 복잡한 기능을 줄이는 방향으로 발전했다.', '데이터 구조를 미리 정해 두지 않는 유연성을 가진다.', '여러 컴퓨터에 데이터를 분산하여 저장·처리하는 환경에서 주로 사용한다.'], examples: 'MongoDB, HBase, Cassandra, Redis, Neo4j, OrientDB' },
    { title: 'NewSQL DBMS', description: '관계 DBMS의 장점에 NoSQL의 확장성과 유연성을 결합한다.', details: ['정형·비정형 데이터를 안정적이고 빠르게 처리할 수 있다.'], examples: 'Google Spanner, VoltDB, NuoDB' },
  ] },
]
export const dbmsGroups = [
  { section: 'dbms-intro', title: 'DBMS와 등장 배경', keywords: [{ title: 'DBMS 정의', target: 'dbms-intro' }, { title: '파일 시스템', target: 'file-system' }, { title: '중복성 · 종속성', target: 'file-problems' }] },
  { section: 'dbms-management', title: '데이터 관리', keywords: [{ title: '정의 · 조작 · 제어', target: 'dbms-functions' }, { title: '장점 · 단점', target: 'dbms-tradeoffs' }] },
  { section: 'dbms-models', title: '데이터베이스 종류', keywords: [{ title: '계층형 · 네트워크형 · 관계형', target: 'dbms-models' }, { title: '객체지향형 · 객체관계형', target: 'object-models' }] },
  { section: 'dbms-evolution', title: 'DBMS 발전 과정', keywords: [{ title: '2세대 · 관계 DBMS', target: 'generation-0' }, { title: '3세대 · 객체지향 · 객체관계', target: 'generation-1' }, { title: '4세대 · NoSQL · NewSQL', target: 'generation-2' }] },
]
export const dbmsSearchEntries: SearchEntry[] = [
  { title: 'DBMS 데이터베이스 관리 시스템', text: 'Database Management System 조직에 필요한 데이터를 통합 저장 관리', section: 'dbms-intro', page: 'dbms' },
  { title: '파일 시스템', text: 'file system 파일 생성 삭제 수정 검색 응용 프로그램별 별도 파일 관리', section: 'dbms-intro', target: 'file-system', page: 'dbms' },
  { title: '파일 시스템의 문제점', text: '데이터 중복성 종속성 동시 공유 보안 회복 부족 응용 프로그램 개발 어려움', section: 'dbms-intro', target: 'file-problems', page: 'dbms' },
  ...dbmsFunctions.map(item => ({ title: `${item.title} 기능`, text: item.text, section: 'dbms-management', target: 'dbms-functions', page: 'dbms' as const })),
  { title: 'DBMS의 장점', text: advantages.join(' '), section: 'dbms-management', target: 'dbms-tradeoffs', page: 'dbms' },
  { title: 'DBMS의 단점', text: disadvantages.join(' '), section: 'dbms-management', target: 'dbms-tradeoffs', page: 'dbms' },
  ...models.map((item, model) => ({ title: `${item.title} 데이터베이스`, text: `${item.text} ${item.note}`, section: 'dbms-models', model, page: 'dbms' as const })),
  ...generations.flatMap((generation, index) => generation.items.map(item => ({ title: `${generation.generation} · ${item.title}`, text: `${item.description} ${item.details.join(' ')} ${item.examples}`, section: 'dbms-evolution', target: `generation-${index}`, page: 'dbms' as const }))),
]
