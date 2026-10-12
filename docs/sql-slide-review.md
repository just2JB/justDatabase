# 4·5주차 SQL 학습 페이지

## 읽은 자료

- 4주차 SQL 기초: 55장. 전체 슬라이드의 텍스트·표를 추출해 읽고, Workbench·명령창·구조 설명·SQL 실습이 이미지인 주요 슬라이드를 별도로 열람했습니다.
- 5주차 조작어: 42장. 전체 슬라이드의 텍스트와 표, 질의 3-1~3-33을 읽었습니다.
- PowerPoint 자체의 화면 렌더링이나 앱 실행 테스트는 수행하지 않았습니다.

## 내용 매핑

| 원자료 | 웹페이지 |
| --- | --- |
| 4주차 1–13장 | SQL 분류, Workbench/명령창, 데이터베이스 생성·선택, 테이블·데이터 개념 |
| 4주차 14–23장 | 자료형, CREATE/ALTER/DROP, 제약조건, 질의 3-34~3-43 |
| 4주차 24–32장 | member 실습의 열 추가·삭제·이름 변경, MODIFY, RENAME, INSERT 기본 예제 |
| 4주차 33–55장 | 검색·집계 기본 흐름. 5주차 페이지에서 상세 예제와 결과를 함께 제공 |
| 5주차 1–22장 | 세 원본 테이블, SELECT, DISTINCT, WHERE, LIKE, 정렬, 집계, GROUP BY/HAVING |
| 5주차 23–32장 | 조건 없는 조합, 동등/내부 조인, 3개 테이블 연결, 왼쪽 외부조인 |
| 5주차 33–42장 | 부속질의, 상관 부속질의, 집합 연산, EXISTS/NOT EXISTS |

4주차 목차에는 사용자 계정 만들기라는 항목이 있지만 실제 본문에는 CREATE USER의 상세 내용이 없습니다. 계정 설정 절차를 새로 지어 넣지 않았습니다. 5주차는 파일명과 달리 SELECT 검색 중심이며, 별도의 UPDATE/DELETE 상세 실습을 추가하지 않았습니다.

## 정확성을 위해 다듬은 부분

- 첫 test 예제: 생성한 이름과 INSERT 대상을 일치시키고 AUTO_INCREMENT 열에 기본키를 선언했습니다.
- DATE는 날짜, DATETIME은 날짜와 시간으로 구분했습니다.
- ‘1,000원 이상’의 CHECK를 `price >= 1000`으로 맞췄습니다. CHECK 검사는 MySQL 8.0.16 이상임을 표시했습니다.
- 복합 기본키의 최소성 예시와 출판사 단독 UNIQUE 조건을 구별했습니다.
- 기본키 추가는 이미 기본키를 선언한 CREATE 뒤에 무조건 실행할 수 없음을 설명했습니다.
- MySQL InnoDB의 NO ACTION은 참조하는 자식 행이 있으면 부모의 변경·삭제를 거절하는 동작입니다.
- MySQL LIKE에는 %와 _를 사용합니다. SQL Server의 +, [ ], [^] 표기를 그대로 복사하지 않았습니다.
- HAVING은 GROUP BY 없이도 사용 가능하며 집계 함수 조건에만 제한되지 않습니다. 입문 그룹 예제의 권장 문법 순서와 일반 규칙을 구별했습니다.
- MySQL의 GROUP BY는 함수적 종속성을 고려합니다. 입문 설명은 그룹 기준 열+집계 함수로 작성합니다.
- Orders에 수량 열이 없으므로 COUNT(*)는 주문 건수라고 표현했습니다.
- 고객별 그룹과 교집합·차집합 예시는 동명이인 혼동을 피하도록 고객번호를 사용했습니다.
- MySQL은 FULL OUTER JOIN 구문을 직접 지원하지 않습니다.
- MySQL 8.0.31 이상에서는 INTERSECT/EXCEPT가 지원됩니다. MINUS 이름은 지원하지 않습니다.
- NOT EXISTS는 부속질의가 반환하는 행이 없을 때 참이며, NOT IN의 NULL 가능성과 구별했습니다.

## 미리보기의 범위

원본 Book 10행·Customer 5행·Orders 10행으로 JavaScript에서 정해진 예제를 계산합니다. 자유 입력 SQL을 실행하는 엔진이나 MySQL 연결은 없습니다. 정렬하지 않은 결과의 순서는 보장하지 않으며, 문자열 정렬 미리보기는 한국어 비교를 사용해 DB 콜레이션과 차이가 날 수 있습니다. 실행·브라우저·빌드 검증은 사용자의 테스트 제외 요청에 따라 수행하지 않았습니다.

## MySQL 공식 확인 자료

- 자료형: https://dev.mysql.com/doc/refman/8.0/en/date-and-time-type-syntax.html
- 외래키 동작: https://dev.mysql.com/doc/refman/8.0/en/create-table-foreign-keys.html
- CHECK: https://dev.mysql.com/doc/refman/8.0/en/create-table-check-constraints.html
- LIKE: https://dev.mysql.com/doc/refman/8.0/en/string-comparison-functions.html
- GROUP BY: https://dev.mysql.com/doc/refman/8.0/en/group-by-handling.html
- SELECT/HAVING: https://dev.mysql.com/doc/refman/8.0/en/select.html
- 집합 연산: https://dev.mysql.com/doc/refman/8.0/en/set-operations.html
