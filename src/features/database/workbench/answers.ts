import { bookingRows, learnerRows, workshopRows } from './missions'

export type MissionAnswer = { sql: string; explanation: string; expected: string; rejected?: string[] }
const values = (rows: (string | number | null)[][]) => rows.map(row => `(${row.map(value => value === null ? 'NULL' : typeof value === 'number' ? value : `'${value.replaceAll("'", "''")}'`).join(', ')})`).join(',\n')

export const answers: Record<number, MissionAnswer> = {
  1: { sql: 'CREATE DATABASE craft_mission CHARACTER SET utf8mb4;\nUSE craft_mission;\nSELECT DATABASE();', explanation: '먼저 전용 데이터베이스를 선택합니다. 이미 존재한다면 기존 작업을 확인한 후 USE만 실행할 수 있습니다.', expected: 'DATABASE(): craft_mission' },
  2: { sql: `CREATE TABLE Workshop (
  workshop_id INTEGER PRIMARY KEY,
  title VARCHAR(40) NOT NULL,
  category VARCHAR(20) NOT NULL,
  fee INTEGER DEFAULT 15000 CHECK (fee >= 5000)
);
SHOW CREATE TABLE Workshop;`, explanation: '기본키는 중복과 NULL을 허용하지 않습니다. fee는 NULL을 허용하므로 CHECK의 비교 결과가 UNKNOWN인 NULL은 거절되지 않습니다.', expected: 'workshop_id, title, category, fee의 4열. fee 기본값 15000.' },
  3: { sql: `CREATE TABLE LearnerDraft (
  learner_id INTEGER AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL,
  city VARCHAR(20) NOT NULL,
  phone VARCHAR(30) UNIQUE
);
DESC LearnerDraft;`, explanation: 'AUTO_INCREMENT는 번호를 생략한 새 행에 번호를 부여합니다. MySQL의 UNIQUE 열은 NULL을 여러 행에서 허용합니다.', expected: 'learner_id: 기본키·auto_increment, phone: UNIQUE·NULL 허용.' },
  4: { sql: `CREATE TABLE Booking (
  booking_id INTEGER PRIMARY KEY,
  learner_id INTEGER NOT NULL,
  workshop_id INTEGER NOT NULL,
  paid_fee INTEGER NOT NULL CHECK (paid_fee >= 0),
  booked_on DATE NOT NULL,
  FOREIGN KEY (learner_id) REFERENCES LearnerDraft(learner_id)
    ON DELETE CASCADE,
  FOREIGN KEY (workshop_id) REFERENCES Workshop(workshop_id)
    ON DELETE RESTRICT
);
SHOW CREATE TABLE Booking;`, explanation: '회원 삭제는 예약으로 전파합니다. 프로그램 삭제는 연결된 예약이 있으면 거절합니다. 부모 테이블을 먼저 만들어야 합니다.', expected: '회원과 프로그램에 대한 외래키 2개. 날짜·결제액·외래키 열은 NULL 불가.' },
  5: { sql: `CREATE TABLE WorkshopTag (
  workshop_id INTEGER NOT NULL,
  tag VARCHAR(20) NOT NULL,
  PRIMARY KEY (workshop_id, tag),
  FOREIGN KEY (workshop_id) REFERENCES Workshop(workshop_id)
    ON DELETE CASCADE
);
SHOW CREATE TABLE WorkshopTag;`, explanation: '복합 기본키는 두 값의 조합을 유일하게 만듭니다. 서로 다른 프로그램에 같은 태그를 붙이는 것은 가능합니다.', expected: '기본키 (workshop_id, tag), 프로그램 삭제 시 태그 연쇄 삭제.' },
  6: { sql: 'ALTER TABLE Workshop ADD COLUMN duration VARCHAR(10);\nDESC Workshop;', explanation: 'ADD COLUMN은 새로운 열을 추가합니다.', expected: 'duration: VARCHAR(10), NULL 허용.' },
  7: { sql: 'ALTER TABLE Workshop MODIFY COLUMN duration INTEGER NOT NULL DEFAULT 90;\nDESC Workshop;', explanation: 'MODIFY COLUMN으로 자료형과 열 속성을 다시 지정합니다.', expected: 'duration: INTEGER, NULL 불가, 기본값 90.' },
  8: { sql: 'ALTER TABLE LearnerDraft CHANGE COLUMN phone contact VARCHAR(30);\nSHOW CREATE TABLE LearnerDraft;', explanation: 'CHANGE는 이전 이름·새 이름·자료형을 씁니다. 기존 UNIQUE 인덱스는 유지됩니다. 인덱스 이름은 phone으로 남을 수 있지만 대상 열은 contact입니다.', expected: 'contact 열에 UNIQUE. phone이라는 열은 없음.' },
  9: { sql: 'RENAME TABLE LearnerDraft TO Learner;\nSHOW TABLES;\nSHOW CREATE TABLE Booking;', explanation: 'MySQL은 테이블 이름을 바꾸면 이를 참조하는 외래키의 참조 대상도 갱신합니다.', expected: 'Workshop, Learner, Booking, WorkshopTag. Booking은 Learner를 참조.' },
  10: { sql: `INSERT INTO Workshop (workshop_id, title, category, fee, duration) VALUES
${values(workshopRows)};

INSERT INTO Learner (learner_id, name, city, contact) VALUES
${values(learnerRows)};

INSERT INTO Booking (booking_id, learner_id, workshop_id, paid_fee, booked_on) VALUES
${values(bookingRows)};

SELECT COUNT(*) AS workshop_count FROM Workshop;
SELECT COUNT(*) AS learner_count FROM Learner;
SELECT COUNT(*) AS booking_count FROM Booking;`, explanation: '외래키의 부모인 프로그램·회원을 먼저 입력합니다. NULL에는 따옴표를 붙이지 않습니다. 다시 실행하면 기본키 중복 오류가 발생하므로 한 번만 입력하세요.', expected: 'Workshop 8행 / Learner 6행 / Booking 12행.' },
  11: { sql: 'SELECT COUNT(*) AS workshop_count FROM Workshop;\nSELECT COUNT(*) AS booking_count FROM Booking;', rejected: [
    "INSERT INTO Workshop VALUES (1, '중복 체험', '생활', 10000, 60);",
    "INSERT INTO Workshop VALUES (99, NULL, '생활', 10000, 60);",
    "INSERT INTO Workshop VALUES (99, '테스트 체험', '생활', 4999, 60);",
    "INSERT INTO Booking VALUES (99, 999, 1, 10000, '2026-10-11');",
  ], explanation: '각 실패 문장을 따로 실행합니다. 순서대로 기본키 중복, NOT NULL 위반, CHECK 위반, 존재하지 않는 회원을 참조하는 외래키 위반입니다.', expected: '네 입력 모두 실패. Workshop 8행, Booking 12행 유지.' },
  12: { sql: 'SELECT title, fee\nFROM Workshop\nORDER BY workshop_id;', explanation: 'SELECT 목록으로 열을 고릅니다. 정렬에 쓰는 열은 이 질의에서 출력하지 않아도 됩니다.', expected: '기준 데이터의 프로그램 순서대로 8행.' },
  13: { sql: 'SELECT workshop_id, title, fee, duration\nFROM Workshop\nWHERE fee BETWEEN 20000 AND 40000\n  AND duration <= 90\nORDER BY workshop_id;', explanation: 'BETWEEN은 양 끝값을 포함합니다. AND는 두 조건이 모두 참인 행만 남깁니다.', expected: '1 도자기 머그 / 3 가죽 카드지갑 / 7 향수 블렌딩 / 8 비누 만들기 (4행).' },
  14: { sql: "SELECT workshop_id, title\nFROM Workshop\nWHERE title LIKE '가죽%'\nORDER BY workshop_id;", explanation: '%는 0개 이상의 문자를 뜻합니다. 앞에 %가 없으므로 가죽으로 시작하는 제목만 찾습니다.', expected: '3 가죽 카드지갑 / 4 가죽 키링.' },
  15: { sql: 'SELECT DISTINCT city FROM Learner ORDER BY city;\n\nSELECT learner_id, name, contact\nFROM Learner\nWHERE contact IS NULL\nORDER BY learner_id;', explanation: 'DISTINCT는 중복 행을 제거합니다. NULL 여부는 IS NULL로 검사합니다.', expected: '도시: 서울, 수원, 인천 (한글 정렬 기준). 연락처 없음: 6 윤도현 NULL.' },
  16: { sql: 'SELECT title, duration, fee\nFROM Workshop\nORDER BY duration DESC, fee ASC, workshop_id ASC;', explanation: '왼쪽 정렬 기준부터 적용하고, 같은 값끼리 다음 기준을 적용합니다.', expected: '프로그램 번호 기준 순서: 2 → 6 → 5 → 1 → 3 → 4 → 8 → 7.' },
  17: { sql: `SELECT COUNT(*) AS booking_count,
       SUM(paid_fee) AS total_paid,
       AVG(paid_fee) AS avg_paid,
       MIN(paid_fee) AS min_paid,
       MAX(paid_fee) AS max_paid
FROM Booking;`, explanation: '전체 예약을 하나의 그룹으로 집계합니다. 실제 결제액 paid_fee를 사용합니다.', expected: '12 / 387000 / 32250 / 18000 / 55000. 평균의 소수 자릿수 표시는 환경에 따라 다를 수 있습니다.' },
  18: { sql: `SELECT learner_id, COUNT(*) AS booking_count,
       SUM(paid_fee) AS total_paid
FROM Booking
GROUP BY learner_id
ORDER BY learner_id;`, explanation: '회원번호별로 예약을 모은 후 건수와 금액을 계산합니다.', expected: '(회원, 건수, 합계): (1,3,106000), (2,3,105000), (3,2,56000), (4,2,45000), (5,2,75000).' },
  19: { sql: `SELECT learner_id, COUNT(*) AS booking_count,
       SUM(paid_fee) AS total_paid
FROM Booking
WHERE paid_fee >= 25000
GROUP BY learner_id
HAVING COUNT(*) >= 2
ORDER BY learner_id;`, explanation: 'WHERE로 개별 예약을 먼저 고릅니다. 그 결과를 회원별로 묶고 HAVING으로 예약 2건 이상인 그룹을 남깁니다.', expected: '(1,2,83000), (2,3,105000), (5,2,75000).' },
  20: { sql: `SELECT b.booking_id, l.name, w.title, w.fee, b.paid_fee
FROM Booking b
INNER JOIN Learner l ON b.learner_id = l.learner_id
INNER JOIN Workshop w ON b.workshop_id = w.workshop_id
ORDER BY b.booking_id;`, explanation: '예약의 외래키를 각 부모 테이블의 기본키와 연결합니다. 정가와 결제액이 다를 수 있습니다.', expected: '12행. 첫 행: 1, 김하늘, 도자기 머그, 30000, 28000.' },
  21: { sql: `SELECT l.learner_id, l.name, b.booking_id
FROM Learner l
LEFT JOIN Booking b ON l.learner_id = b.learner_id
ORDER BY l.learner_id, b.booking_id;`, explanation: '왼쪽 회원 테이블의 모든 행을 보존합니다. 예약이 여러 건이면 같은 회원이 여러 행에 나옵니다.', expected: '13행. 마지막 행: 6, 윤도현, NULL.' },
  22: { sql: `SELECT workshop_id, title, fee
FROM Workshop
WHERE fee = (SELECT MAX(fee) FROM Workshop)
ORDER BY workshop_id;`, explanation: '내부 질의의 최고가와 같은 모든 프로그램을 찾으므로 공동 최고가도 포함합니다.', expected: '5, 실버 반지, 60000.' },
  23: { sql: `SELECT SUM(paid_fee) AS total_paid
FROM Booking
WHERE learner_id IN (
  SELECT learner_id FROM Learner WHERE city = '서울'
);`, explanation: '서울 회원번호 집합에 속하는 예약의 금액만 합산합니다.', expected: 'total_paid: 162000.' },
  24: { sql: `SELECT l.learner_id, l.name
FROM Learner l
WHERE EXISTS (
  SELECT 1 FROM Booking b
  JOIN Workshop w ON b.workshop_id = w.workshop_id
  WHERE b.learner_id = l.learner_id AND w.category = '도예'
)
ORDER BY l.learner_id;`, explanation: 'EXISTS는 일치하는 예약이 존재하는지만 검사합니다. 외부의 회원 행을 중복시키지 않습니다.', expected: '1 김하늘 / 2 이서준 / 3 박민서.' },
  25: { sql: `SELECT w.workshop_id, w.title, w.category, w.fee
FROM Workshop w
WHERE w.fee > (
  SELECT AVG(w2.fee) FROM Workshop w2
  WHERE w2.category = w.category
)
ORDER BY w.workshop_id;`, explanation: '외부 행의 category와 같은 분류만 내부에서 집계합니다. 같은 분류가 한 행뿐이면 자신의 평균과 같아 제외됩니다.', expected: '2 도자기 접시 도예 40000 / 3 가죽 카드지갑 가죽 35000 / 7 향수 블렌딩 생활 25000.' },
  26: { sql: `SELECT l.learner_id, l.name, totals.total_paid
FROM Learner l
JOIN (
  SELECT learner_id, SUM(paid_fee) AS total_paid
  FROM Booking GROUP BY learner_id
) AS totals ON l.learner_id = totals.learner_id
WHERE totals.total_paid >= 80000
ORDER BY totals.total_paid DESC, l.learner_id;`, explanation: '파생 테이블에서 회원별 합계를 만들고 회원 정보와 연결합니다. MySQL에서는 파생 테이블의 별칭이 필요합니다.', expected: '1 김하늘 106000 / 2 이서준 105000.' },
  27: { sql: `INSERT INTO Workshop (workshop_id, title, category)
VALUES (9, '라탄 바구니', '목공');
INSERT INTO Workshop (workshop_id, title, category, fee)
VALUES (10, '캔들 만들기', '생활', NULL);
SELECT workshop_id, title, fee, duration
FROM Workshop WHERE workshop_id IN (9, 10)
ORDER BY workshop_id;`, explanation: '생략한 열은 기본값을 사용합니다. NULL을 명시하면 기본값 15000으로 바꾸지 않고 NULL을 저장합니다.', expected: '9 라탄 바구니 15000 90 / 10 캔들 만들기 NULL 90.' },
  28: { sql: "UPDATE Learner SET city = '부산' WHERE learner_id = 6;\nSELECT learner_id, name, city FROM Learner WHERE learner_id = 6;", explanation: '기본키를 WHERE 조건으로 지정하여 한 회원만 수정합니다.', expected: '6 윤도현 부산.' },
  29: { sql: `SELECT COUNT(*) AS booking_count FROM Booking WHERE learner_id = 5;
DELETE FROM Learner WHERE learner_id = 5;
SELECT COUNT(*) AS booking_count FROM Booking WHERE learner_id = 5;
SELECT COUNT(*) AS learner_count FROM Learner;
SELECT COUNT(*) AS remaining_bookings FROM Booking;`, explanation: '예약을 직접 삭제하지 않아도 회원 외래키의 CASCADE에 의해 회원 5의 예약 8번·11번이 삭제됩니다.', expected: '삭제 전 예약 2건 → 삭제 후 0건. 남은 회원 5명, 전체 예약 10건.' },
  30: { sql: 'DROP TABLE Booking;\nDROP TABLE WorkshopTag;\nDROP TABLE Learner;\nDROP TABLE Workshop;\nSHOW TABLES;', rejected: ['DROP TABLE Workshop;'], explanation: '먼저 실패 문장을 단독 실행합니다. 외래키가 참조 중인 부모 테이블은 바로 DROP할 수 없습니다. 자식 테이블부터 제거하면 참조 관계를 끊고 부모를 삭제할 수 있습니다. DROP TABLE은 DELETE와 다르며 ON DELETE CASCADE로 자식 테이블을 없애지 않습니다.', expected: 'SHOW TABLES 결과 0행. craft_mission 데이터베이스 자체는 유지.' },
}
