import type { SearchEntry } from './content'

export const levels = [
  { title: '외부 단계', english: 'External schema', perspective: '개별 사용자 관점', count: '여러 개 존재 가능', description: '각 사용자에게 필요한 데이터베이스의 논리적 구조를 정의한다. 사용자마다 다를 수 있으며 서브 스키마라고도 한다.', example: '학생에게는 자신의 학년, 장학 담당자에게는 장학 업무에 필요한 정보가 보인다.' },
  { title: '개념 단계', english: 'Conceptual schema', perspective: '조직 전체 관점', count: '하나만 존재', description: '전체 데이터베이스의 논리적 구조를 정의한다. 저장할 데이터, 데이터 간 관계, 제약조건과 보안 정책·접근 권한을 포함한다.', example: '학교 전체에서 관리하는 학생·장학 데이터와 그 관계를 정의한다.' },
  { title: '내부 단계', english: 'Internal schema', perspective: '저장 장치 관점', count: '하나만 존재', description: '데이터가 저장 장치에 실제로 저장되는 방법을 정의한다. 레코드 구조, 필드 크기, 레코드 접근 경로 등 물리적 저장 구조를 다룬다.', example: '학생 레코드를 어떤 구조와 접근 경로로 저장할지 정의한다.' },
]
export const languageTypes = [
  { title: 'DDL', name: '데이터 정의어', english: 'Data Definition Language', description: '스키마를 정의하거나 수정 또는 삭제한다.', example: '학생 데이터를 저장할 구조를 정의한다.', code: 'CREATE TABLE student (\n  student_id INTEGER PRIMARY KEY,\n  grade INTEGER\n);' },
  { title: 'DML', name: '데이터 조작어', english: 'Data Manipulation Language', description: '데이터의 삽입, 삭제, 수정, 검색 등의 처리를 요구한다.', example: '저장된 학생의 학년을 검색한다.', code: 'SELECT student_id, grade\nFROM student;' },
  { title: 'DCL', name: '데이터 제어어', english: 'Data Control Language', description: '데이터를 정확하고 안전하게 유지하기 위해 필요한 규칙이나 기법을 정의한다.', example: '학생 데이터에 접근하는 권한을 관리한다.', code: '' },
]
export const dbsGroups = [
  { section: 'dbs-intro', title: 'DBS와 데이터 구조', keywords: [{ title: 'DBS 정의', target: 'dbs-intro' }, { title: '스키마 · 인스턴스', target: 'schema-instance' }] },
  { section: 'dbs-levels', title: '3단계 구조', keywords: [{ title: '외부 · 개념 · 내부 단계', target: 'dbs-levels' }, { title: '사상 · 매핑', target: 'dbs-mappings' }] },
  { section: 'dbs-independence', title: '데이터 독립성', keywords: [{ title: '논리적 독립성', target: 'logical-independence' }, { title: '물리적 독립성', target: 'physical-independence' }] },
  { section: 'dbs-catalog', title: '데이터 관리 정보', keywords: [{ title: '데이터 사전 · 메타데이터', target: 'dbs-catalog' }, { title: '디렉터리 · 사용자 DB', target: 'catalog-comparison' }] },
  { section: 'dbs-users', title: '사용자와 데이터 언어', keywords: [{ title: '관리자 · 사용자 · 프로그래머', target: 'dbs-users' }, { title: 'DDL · DML · DCL', target: 'dbs-languages' }, { title: 'DML: 절차적 · 비절차적', target: 'dml-comparison', language: 1 }] },
]
export const dbsSearchEntries: SearchEntry[] = [
  { title: 'DBS 데이터베이스 시스템', text: 'Database System 데이터 저장 관리 조직에 필요한 정보 생성', section: 'dbs-intro', page: 'dbs' },
  { title: '스키마 Schema', text: '데이터 구조 제약조건 정의 설계', section: 'dbs-intro', target: 'schema-instance', page: 'dbs' },
  { title: '인스턴스 Instance', text: '스키마에 따라 특정 시점에 실제로 저장된 데이터의 상태', section: 'dbs-intro', target: 'schema-instance', page: 'dbs' },
  ...levels.map(level => ({ title: `${level.title} · ${level.english}`, text: `${level.perspective} ${level.count} ${level.description} ${level.example}`, section: 'dbs-levels', page: 'dbs' as const })),
  { title: '사상 매핑 Mapping', text: '외부 개념 응용 인터페이스 개념 내부 저장 인터페이스 스키마 대응 관계 데이터 독립성', section: 'dbs-levels', target: 'dbs-mappings', page: 'dbs' },
  { title: '논리적 데이터 독립성', text: '개념 스키마 변경 외부 스키마 영향 없음 외부 개념 사상 수정', section: 'dbs-independence', target: 'logical-independence', page: 'dbs' },
  { title: '물리적 데이터 독립성', text: '내부 스키마 변경 개념 스키마 영향 없음 개념 내부 사상 수정', section: 'dbs-independence', target: 'physical-independence', page: 'dbs' },
  { title: '데이터 사전 시스템 카탈로그', text: 'system catalog metadata 메타데이터 데이터에 대한 데이터 스키마 사상 제약조건 DBMS 생성 유지 일반 사용자 검색', section: 'dbs-catalog', page: 'dbs' },
  { title: '데이터 디렉터리', text: 'data directory 실제 접근 위치 정보 일반 사용자 접근 허용되지 않음', section: 'dbs-catalog', target: 'catalog-comparison', page: 'dbs' },
  { title: '사용자 데이터베이스', text: 'user database 사용자가 실제 이용하는 데이터', section: 'dbs-catalog', target: 'catalog-comparison', page: 'dbs' },
  { title: '데이터베이스 사용자', text: '관리자 DBA 운영 관리 정의어 제어어 최종 사용자 조작어 응용 프로그래머 프로그램 작성', section: 'dbs-users', page: 'dbs' },
  ...languageTypes.map((language, index) => ({ title: `${language.title} · ${language.name}`, text: `${language.english} ${language.description} ${language.example}`, section: 'dbs-users', target: 'dbs-languages', language: index, page: 'dbs' as const })),
  { title: '절차적 비절차적 DML', text: 'what how 무엇 어떻게 선언적 언어 procedural nonprocedural declarative', section: 'dbs-users', target: 'dml-comparison', language: 1, page: 'dbs' },
]
