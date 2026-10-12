// 페이지별 학습 내용과 검색 항목을 관리합니다.
export const sections = [
  { id: 'data', title: '데이터와 정보' },
  { id: 'database', title: '데이터베이스' },
  { id: 'classification', title: '데이터의 분류' },
  { id: 'everyday', title: '일상 속 데이터베이스' },
]
export const features = [
  ['실시간 접근성', '사용자의 데이터 요구에 실시간으로 응답한다.'],
  ['계속 변화', '계속적인 삽입, 삭제, 수정을 통해 현재의 정확한 데이터를 유지한다.'],
  ['내용 기반 참조', '저장된 주소나 위치가 아닌 내용으로 참조한다. 예: 재고량이 1,000개 이상인 제품의 이름 검색.'],
  ['동시 공유', '서로 다른 데이터뿐 아니라 같은 데이터의 동시 사용도 지원한다.'],
]
export const shapes = [
  { name: '정형 데이터', english: 'Structured data', description: '미리 정해진 구조에 따라 저장된 데이터', detail: '구조에 대한 설명과 데이터 내용은 별도로 유지된다.', examples: '스프레드시트, 관계 데이터베이스 테이블' },
  { name: '반정형 데이터', english: 'Semi-structured data', description: '데이터 내용 안에 구조에 대한 설명이 함께 존재하는 데이터', detail: '구조를 파악하는 파싱 과정이 필요하며, 보통 파일 형태로 저장된다.', examples: 'HTML, XML, JSON 문서, 웹로그, 센서 데이터' },
  { name: '비정형 데이터', english: 'Unstructured data', description: '정해진 구조 없이 저장된 데이터', detail: '텍스트, 영상, 이미지 등 멀티미디어 데이터를 포함한다.', examples: '소셜 데이터의 텍스트, 영상, 이미지, 워드·PDF 문서' },
]
export const types = [
  { group: '범주형', name: '명목형', description: '서열 없는 값을 가진 데이터', examples: '성별, 혈액형, 학과명, 거주 지역' },
  { group: '범주형', name: '순서형', description: '서열이 있는 값을 가진 데이터', examples: '학년, 학점, 회원등급, 만족도' },
  { group: '수치형', name: '이산형', description: '이산적인 값을 가진 데이터 · 소수점으로 표현 불가', examples: '출산 횟수, 불량품 수, 사고 건수' },
  { group: '수치형', name: '연속형', description: '연속적인 값을 가진 데이터 · 소수점 표현 가능, 측정 가능', examples: '신장, 체중, 길이' },
]
export const uses = [
  { field: '생활과 문화', items: ['기상정보 — 날씨 관련 정보', '교통정보 — 교통상황 관련 정보', '문화예술정보 — 공연이나 인물에 관한 정보'] },
  { field: '비즈니스', items: ['금융정보 — 금융, 증권, 신용에 관한 정보', '취업정보 — 노동부와 기업의 채용 관련 정보', '부동산정보 — 공공기관이나 민간의 토지, 매물, 세금 정보'] },
  { field: '학술정보', items: ['연구학술정보 — 논문, 서적, 저작물에 관한 정보', '특허정보 — 특허청의 정보를 기업과 연구자에게 제공', '법률정보 — 법제처와 대법원의 법률에 관한 정보', '통계정보 — 국가기관의 통계에 관한 정보'] },
]

export type PageId = 'basics' | 'dbms' | 'dbs' | 'relation' | 'quiz' | 'sql4' | 'sql5'
export type SearchEntry = { title: string; text: string; section: string; shape?: number; model?: number; language?: number; sqlQuery?: number; target?: string; page?: PageId }
export const searchEntries: SearchEntry[] = [
  ...sections.map(section => ({ title: section.title, text: '', section: section.id })),
  { title: '데이터와 정보', text: 'Data Information 1차적 자료 현실세계 관측 사실 값 관련성 목적성 의미 부여', section: 'data' },
  { title: '정보의 적시성', text: '정보는 필요한 시간에 제공되어야 한다. 필요한 시점에 제공되지 않으면 가치가 없다.', section: 'data' },
  { title: '정보의 독점성', text: '공개 시 가치 하락 비공개 정보 경쟁심 활용 경제성', section: 'data' },
  { title: '빅데이터의 3V', text: '정보화 사회 Volume 크기 Velocity 생성 속도 Variety 다양성 학생 데이터 학사 데이터베이스', section: 'data' },
  { title: '데이터베이스의 정의', text: 'Database 특정 조직의 여러 사용자가 공유하여 사용할 수 있도록 통합해서 저장한 운영 데이터의 집합', section: 'database' },
  ...features.map(([title, text]) => ({ title, text, section: 'database' })),
  ...shapes.map((item, shape) => ({ title: item.name, text: `${item.english} ${item.description} ${item.detail} ${item.examples}`, section: 'classification', shape })),
  ...types.map(item => ({ title: `${item.group} 데이터 · ${item.name}`, text: `${item.description} ${item.examples}`, section: 'classification' })),
  { title: '범주형 데이터', text: '종류를 나타내는 값 크기 비교와 산술적 연산 불가 명목형 순서형', section: 'classification' },
  ...uses.map(item => ({ title: item.field, text: item.items.join(' '), section: 'everyday' })),
  { title: '검색과 변경', text: '데이터베이스 시스템 검색 삽입 삭제 수정 시간에 따라 변하는 데이터 값을 반영', section: 'everyday' },
]
