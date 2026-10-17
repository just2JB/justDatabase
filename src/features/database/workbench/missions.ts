import type { SqlResult } from '../sql/data/sqlLessonData'

export type WorkbenchMission = { id: number; phase: string; title: string; task: string; conditions: string[]; check: string }
export const workshopRows = [
  [1, '도자기 머그', '도예', 30000, 90], [2, '도자기 접시', '도예', 40000, 120],
  [3, '가죽 카드지갑', '가죽', 35000, 90], [4, '가죽 키링', '가죽', 18000, 60],
  [5, '실버 반지', '금속', 60000, 120], [6, '우드 트레이', '목공', 45000, 120],
  [7, '향수 블렌딩', '생활', 25000, 60], [8, '비누 만들기', '생활', 20000, 60],
]
export const learnerRows = [
  [1, '김하늘', '서울', '010-1000-1001'], [2, '이서준', '수원', '010-1000-1002'],
  [3, '박민서', '서울', '010-1000-1003'], [4, '정다은', '인천', '010-1000-1004'],
  [5, '최지우', '수원', '010-1000-1005'], [6, '윤도현', '서울', null],
]
export const bookingRows = [
  [1, 1, 1, 28000, '2026-10-01'], [2, 2, 3, 35000, '2026-10-02'],
  [3, 1, 5, 55000, '2026-10-03'], [4, 3, 2, 38000, '2026-10-03'],
  [5, 4, 7, 25000, '2026-10-04'], [6, 2, 1, 30000, '2026-10-05'],
  [7, 3, 4, 18000, '2026-10-05'], [8, 5, 6, 42000, '2026-10-06'],
  [9, 1, 7, 23000, '2026-10-07'], [10, 4, 8, 20000, '2026-10-08'],
  [11, 5, 3, 33000, '2026-10-09'], [12, 2, 2, 40000, '2026-10-10'],
]
export const missionTables: { name: string; data: SqlResult }[] = [
  { name: 'Workshop', data: { columns: ['workshop_id', 'title', 'category', 'fee', 'duration'], rows: workshopRows } },
  { name: 'Learner', data: { columns: ['learner_id', 'name', 'city', 'contact'], rows: learnerRows } },
  { name: 'Booking', data: { columns: ['booking_id', 'learner_id', 'workshop_id', 'paid_fee', 'booked_on'], rows: bookingRows } },
]
export const missions: WorkbenchMission[] = [
  { id: 1, phase: 'DB·테이블 생성', title: '공방 예약용 DB 준비', task: 'MySQL Workbench에서 새 SQL 탭을 열고 craft_mission 데이터베이스를 생성한 뒤 선택하세요.', conditions: ['MySQL 8.0.16 이상을 기준으로 합니다. 기존 DB와 다른 이름입니다.', '문제는 01번부터 순서대로 진행합니다. 웹페이지가 Workbench의 DB를 대신 생성하지 않습니다.', 'DB가 이미 존재하면 자동 삭제하지 말고 기존 실습 내용이 있는지 먼저 확인하세요.'], check: '선택된 DB 이름이 craft_mission인지 확인합니다.' },
  { id: 2, phase: 'DB·테이블 생성', title: '체험 프로그램 테이블 생성', task: 'Workshop 테이블을 만들고 다음 열과 제약조건을 정의하세요.', conditions: ['workshop_id: INTEGER 기본키.', 'title: VARCHAR(40), NOT NULL. category: VARCHAR(20), NOT NULL.', 'fee: INTEGER, 기본값 15000, 값이 있다면 5000 이상. NULL은 허용합니다.', '아직 duration 열은 만들지 않습니다. 이후 ALTER 미션에서 추가합니다.'], check: '4개의 열과 기본키·NOT NULL·DEFAULT·CHECK가 정의되었는지 확인합니다.' },
  { id: 3, phase: 'DB·테이블 생성', title: '회원 테이블과 자동 번호', task: '이름을 나중에 바꿀 회원 테이블 LearnerDraft를 생성하세요.', conditions: ['learner_id: INTEGER AUTO_INCREMENT 기본키.', 'name: VARCHAR(30) NOT NULL. city: VARCHAR(20) NOT NULL.', 'phone: VARCHAR(30) UNIQUE, NULL 허용.', '아직 데이터를 입력하지 않습니다.'], check: '회원 번호가 자동 생성될 수 있는지와 phone의 UNIQUE·NULL 허용 여부를 확인합니다.' },
  { id: 4, phase: 'DB·테이블 생성', title: '예약 테이블의 외래키', task: 'Booking 테이블을 만들고 회원·체험 프로그램을 연결하세요.', conditions: ['booking_id: INTEGER 기본키. learner_id와 workshop_id: INTEGER NOT NULL.', 'paid_fee: INTEGER NOT NULL, 0 이상. booked_on: DATE NOT NULL.', 'learner_id는 LearnerDraft(learner_id)를 참조하고, 회원 삭제 시 ON DELETE CASCADE.', 'workshop_id는 Workshop(workshop_id)를 참조하고, 예약이 있는 프로그램의 삭제는 거절합니다.'], check: '두 외래키와 서로 다른 삭제 규칙이 정의되었는지 확인합니다.' },
  { id: 5, phase: 'DB·테이블 생성', title: '태그의 복합 기본키', task: '하나의 체험에 여러 태그를 붙일 WorkshopTag 테이블을 만드세요.', conditions: ['workshop_id: INTEGER NOT NULL. tag: VARCHAR(20) NOT NULL.', '(workshop_id, tag)를 복합 기본키로 지정합니다.', 'workshop_id는 Workshop을 참조하며 프로그램 삭제 시 태그도 삭제합니다.', '태그 데이터는 이번 미션에서 입력하지 않습니다.'], check: '같은 프로그램에 같은 태그를 두 번 저장할 수 없는 구조인지 확인합니다.' },
  { id: 6, phase: '구조 변경', title: '소요 시간 열 추가', task: 'Workshop에 duration VARCHAR(10) 열을 추가하세요.', conditions: ['기존 열의 이름과 제약조건은 유지합니다.', '이 단계에는 저장된 행이 없습니다.'], check: 'Workshop에 duration 열이 추가되었는지 확인합니다.' },
  { id: 7, phase: '구조 변경', title: '자료형·기본값·NULL 조건 변경', task: 'Workshop.duration을 INTEGER NOT NULL로 바꾸고 기본값을 90으로 설정하세요.', conditions: ['열 이름은 그대로 둡니다.', '지금은 행이 없으므로 기존 문자열을 숫자로 변환하는 문제는 없습니다.', '자료형·NOT NULL·DEFAULT를 모두 명시합니다.'], check: 'duration이 정수형, NULL 불가, 기본값 90인지 확인합니다.' },
  { id: 8, phase: '구조 변경', title: '연락처 열 이름 변경', task: 'LearnerDraft의 phone을 contact로 바꾸세요.', conditions: ['자료형은 VARCHAR(30)으로 유지합니다.', '기존 연락처의 UNIQUE 제약도 유지되어야 합니다.', '이름과 자료형을 함께 지정하는 CHANGE COLUMN 구문을 사용합니다.'], check: 'phone이 사라지고 contact가 생겼는지 확인합니다.' },
  { id: 9, phase: '구조 변경', title: '회원 테이블 이름 변경', task: 'LearnerDraft를 Learner로 바꾸세요.', conditions: ['RENAME TABLE 구문을 사용합니다.', 'Booking의 회원 외래키가 변경된 부모 테이블을 참조하는지도 확인합니다.', '이후 미션에서는 Learner라는 이름을 사용합니다.'], check: 'Learner가 존재하고 LearnerDraft는 없으며 외래키가 유지되는지 확인합니다.' },
  { id: 10, phase: '데이터 입력·제약 확인', title: '기준 데이터 입력', task: '기준 데이터 탭의 Workshop 8행, Learner 6행, Booking 12행을 입력하세요.', conditions: ['부모 테이블 두 개를 입력한 뒤 Booking을 입력합니다.', '회원 번호도 표와 같도록 명시해서 넣습니다. contact가 없는 회원은 NULL을 넣습니다.', 'INSERT의 열 목록을 명시하고 표에 제시한 값을 그대로 사용합니다.', '각 행은 한 번만 입력합니다. 이후 조회 미션은 이 데이터가 기준입니다.'], check: 'Workshop 8행, Learner 6행, Booking 12행인지 확인합니다.' },
  { id: 11, phase: '데이터 입력·제약 확인', title: '거절되어야 하는 입력 네 가지', task: '다음 입력이 각각 왜 거절되는지 확인하고 오류 이유를 메모하세요.', conditions: ['Workshop: workshop_id=1로 다른 체험을 추가합니다. 나머지 값은 유효하게 정합니다.', 'Workshop: workshop_id=99, title=NULL, category=생활, fee=10000, duration=60.', 'Workshop: workshop_id=99, title=테스트 체험, category=생활, fee=4999, duration=60.', 'Booking: booking_id=99, learner_id=999, workshop_id=1, paid_fee=10000, booked_on=2026-10-11.', '실패할 문장은 한 개씩 실행합니다. 제약조건을 끄지 않습니다.'], check: '오류 후에도 기준 데이터의 행 수가 그대로인지 확인합니다.' },
  { id: 12, phase: '조건 검색·정렬', title: '필요한 열만 조회', task: '모든 체험 프로그램의 이름과 정가를 조회하세요.', conditions: ['출력 열: title, fee.', 'workshop_id 오름차순으로 표시합니다.', 'fee는 프로그램 정가, Booking.paid_fee는 실제 결제 금액입니다.'], check: '8개 프로그램의 이름과 정가가 표시되는지 확인합니다.' },
  { id: 13, phase: '조건 검색·정렬', title: '가격 범위와 시간 조건', task: '정가가 20000~40000원이고 소요 시간이 90분 이하인 체험을 조회하세요.', conditions: ['가격 양 끝값을 포함합니다.', '출력 열: workshop_id, title, fee, duration.', 'workshop_id 오름차순으로 표시합니다.'], check: '가격 조건과 소요 시간 조건을 모두 적용했는지 확인합니다.' },
  { id: 14, phase: '조건 검색·정렬', title: '제목 패턴 검색', task: '제목이 ‘가죽’으로 시작하는 체험을 조회하세요.', conditions: ['LIKE와 와일드카드를 사용합니다.', '출력 열: workshop_id, title.', 'workshop_id 오름차순으로 표시합니다.'], check: '제목 중간에 가죽이 있는 경우까지 찾는 조건과 구별합니다.' },
  { id: 15, phase: '조건 검색·정렬', title: '중복 제거와 NULL 판단', task: '서로 다른 회원 거주 도시 목록과, 연락처가 없는 회원을 각각 조회하세요.', conditions: ['첫 번째 결과: 중복 없는 city, city 오름차순.', '두 번째 결과: learner_id, name, contact. learner_id 오름차순.', 'NULL은 문자열이나 = 연산자로 비교하지 않습니다.'], check: '도시 목록의 중복이 없고 연락처가 없는 회원을 찾았는지 확인합니다.' },
  { id: 16, phase: '조건 검색·정렬', title: '두 가지 기준으로 정렬', task: '체험을 소요 시간 내림차순, 시간이 같으면 정가 오름차순으로 정렬하세요.', conditions: ['출력 열: title, duration, fee.', '시간과 정가도 같으면 workshop_id 오름차순으로 표시합니다.'], check: '첫 기준과 둘째 기준의 우선순위를 확인합니다.' },
  { id: 17, phase: '집계·그룹', title: '전체 예약 요약', task: '예약 건수, 총 결제액, 평균 결제액, 최저·최고 결제액을 한 행으로 조회하세요.', conditions: ['출력 별칭: booking_count, total_paid, avg_paid, min_paid, max_paid.', 'Booking의 paid_fee를 집계합니다. Workshop.fee와 혼동하지 않습니다.'], check: '모든 집계값이 한 행에 나오는지 확인합니다.' },
  { id: 18, phase: '집계·그룹', title: '회원별 예약 건수와 결제액', task: '예약한 회원별 예약 건수와 총 결제액을 조회하세요.', conditions: ['출력 열: learner_id, booking_count, total_paid.', 'learner_id 오름차순. 예약이 없는 회원을 포함할 필요는 없습니다.'], check: '회원별로 한 행씩 나오도록 그룹화했는지 확인합니다.' },
  { id: 19, phase: '집계·그룹', title: 'WHERE와 HAVING 함께 쓰기', task: '25000원 이상 결제한 예약만 고른 뒤, 그런 예약이 2건 이상인 회원을 조회하세요.', conditions: ['출력 열: learner_id, booking_count, total_paid.', '합계는 25000원 이상인 예약들만 대상으로 계산합니다.', 'learner_id 오름차순으로 표시합니다.'], check: '개별 예약의 조건과 집계 후 그룹의 조건을 구분합니다.' },
  { id: 20, phase: 'JOIN', title: '누가 어떤 체험을 예약했는가', task: '모든 예약에 대해 회원 이름·체험 이름·정가·실제 결제액을 조회하세요.', conditions: ['세 테이블을 INNER JOIN합니다.', '출력 열: booking_id, name, title, fee, paid_fee.', 'booking_id 오름차순으로 표시합니다.'], check: '회원번호와 프로그램번호의 연결 조건을 각각 작성했는지 확인합니다.' },
  { id: 21, phase: 'JOIN', title: '예약이 없는 회원도 포함', task: '모든 회원을 보존하면서 회원 이름과 예약번호를 조회하세요.', conditions: ['출력 열: learner_id, name, booking_id.', '예약이 없는 회원의 booking_id는 NULL로 표시합니다.', 'learner_id, booking_id 오름차순으로 표시합니다.'], check: '예약이 없는 회원 한 명도 결과에서 사라지지 않는지 확인합니다.' },
  { id: 22, phase: '부속질의', title: '가장 비싼 체험 찾기', task: '정가가 전체 체험 중 최고가인 체험을 부속질의로 찾으세요.', conditions: ['출력 열: workshop_id, title, fee.', '최고가가 같은 체험이 여러 개면 모두 포함하는 방식으로 작성합니다.', 'workshop_id 오름차순으로 표시합니다.'], check: 'MAX와 비교 조건으로 체험 이름이 가격에 올바르게 대응하는지 확인합니다.' },
  { id: 23, phase: '부속질의', title: '서울 회원의 예약 결제 총액', task: '서울 거주 회원이 예약한 건의 총 결제액을 조회하세요.', conditions: ['회원번호를 구하는 IN 부속질의를 사용합니다.', '출력 별칭: total_paid. 예약하지 않은 서울 회원은 합계에 더할 행이 없습니다.'], check: '회원의 city 조건과 예약의 paid_fee 집계를 연결합니다.' },
  { id: 24, phase: '부속질의', title: '도예 체험을 예약한 회원', task: '도예 분류의 체험을 한 번 이상 예약한 회원을 조회하세요.', conditions: ['EXISTS 부속질의를 사용합니다.', '출력 열: learner_id, name. 한 회원은 한 번만 출력합니다.', 'learner_id 오름차순으로 표시합니다.'], check: '각 외부 회원과 연결되는 예약이 존재하는지 검사합니다.' },
  { id: 25, phase: '부속질의', title: '같은 분류의 평균보다 비싼 체험', task: '같은 category에 속한 체험들의 평균 정가보다 비싼 체험을 찾으세요.', conditions: ['상관 부속질의를 사용합니다. 전체 평균과 비교하지 않습니다.', '출력 열: workshop_id, title, category, fee.', '평균과 같은 가격은 제외합니다. workshop_id 오름차순.'], check: '외부 체험의 category가 내부 질의의 조건에 연결되는지 확인합니다.' },
  { id: 26, phase: '부속질의', title: 'FROM의 파생 테이블 활용', task: '회원별 결제 총액을 파생 테이블로 만든 뒤 총액이 80000원 이상인 회원을 찾으세요.', conditions: ['출력 열: learner_id, name, total_paid.', 'FROM 안의 부속질의에 별칭을 붙이고 Learner와 연결합니다.', 'total_paid 내림차순, 같으면 learner_id 오름차순.'], check: '집계 결과를 테이블처럼 연결했는지 확인합니다.' },
  { id: 27, phase: '변경·정리', title: '기본값과 명시적 NULL 비교', task: '새 체험 두 개를 추가하고 fee·duration의 차이를 확인하세요.', conditions: ['9번: 라탄 바구니, category=목공. fee와 duration 열은 INSERT 목록에서 생략합니다.', '10번: 캔들 만들기, category=생활. fee는 명시적으로 NULL, duration은 생략합니다.', '추가 후 workshop_id 9와 10의 workshop_id, title, fee, duration을 조회합니다.', '이 미션부터는 기준 데이터가 달라집니다. 12~26번 결과와 비교하지 않습니다.'], check: '기본값을 사용하는 경우와 NULL을 직접 넣는 경우를 구분합니다.' },
  { id: 28, phase: '변경·정리', title: '한 회원의 거주 도시 수정', task: '회원번호 6의 거주 도시만 부산으로 바꾸세요.', conditions: ['다른 회원의 값은 그대로 유지합니다.', '변경 후 회원번호 6의 learner_id, name, city를 조회합니다.'], check: 'WHERE 조건으로 수정 대상을 한정했는지 확인합니다.' },
  { id: 29, phase: '변경·정리', title: '회원 삭제와 연쇄 삭제', task: '회원번호 5의 예약 건수를 확인한 뒤 그 회원을 삭제하고 연결된 예약도 삭제되었는지 확인하세요.', conditions: ['회원 삭제 전과 후 Booking에서 learner_id=5인 행 수를 각각 확인합니다.', 'ON DELETE CASCADE를 사용하므로 예약을 따로 DELETE하지 않습니다.', '나머지 회원과 예약은 유지합니다.'], check: '부모 회원을 삭제할 때 어떤 자식 예약이 영향을 받는지 확인합니다.' },
  { id: 30, phase: '변경·정리', title: '참조 관계에 맞춰 테이블 정리', task: '모든 조회가 끝난 뒤 실습 테이블을 삭제하세요.', conditions: ['Workshop부터 DROP을 한 번 시도하고 참조 때문에 거절되는 이유를 확인합니다.', 'Booking과 WorkshopTag를 먼저 삭제한 뒤 Learner와 Workshop을 삭제합니다.', 'craft_mission DB와 다른 DB는 삭제하지 않습니다.'], check: 'craft_mission의 테이블이 모두 없어졌는지 확인합니다.' },
]
export const missionPhases = [...new Set(missions.map(mission => mission.phase))]
