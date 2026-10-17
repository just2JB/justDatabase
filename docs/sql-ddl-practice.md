# 정의어부터 시작하는 SQL 실습

## 자료와 범위

이번에 첨부한 파일을 다시 읽었다.

- `데이터베이스_4주차_SQL 기초.pptx`: 55장. 14~23장의 정의어·제약조건, 24~32장의 이미지에 담긴 DB/member 명령을 확인했다.
- `데이터베이스_5주차_조작어.pptx`: 42장. 기존 마당서점 조회·JOIN 실습의 데이터와 범위를 유지했다.
- `데이터베이스_7주차_부질의외-1 (1).pptx`: 30장. 24~30장의 INSERT·UPDATE·DELETE 예제 중 원본 데이터로 재현할 수 있는 일부를 추가했다.

문제 풀이 → SQL 실습에서 ‘정의어부터 실습’이 먼저 열린다. 기존 18개 조회·JOIN·부속질의 문제는 옆 탭에 있다. SQL 사전에서 조회문을 열면 기존 조회 실행기를 그대로 사용한다.

## 추가한 실습

24개 안내 예제와 자유 실습 1개다. 각 안내 예제는 필요한 선행 테이블을 독립적으로 준비한다. 같은 문제 안에서는 변경을 누적하며, 문제를 바꾸거나 새로고침하면 새 상태에서 시작한다.

- CREATE DATABASE / USE / SHOW TABLES
- NewBook·NewCustomer·NewOrders 생성, 외래키와 ON DELETE CASCADE
- ADD, MODIFY, DROP COLUMN, NOT NULL 지정, ADD PRIMARY KEY, DROP TABLE
- 복합 기본키, UNIQUE, DEFAULT, CHECK
- member의 AUTO_INCREMENT, 열 추가·삭제, CHANGE COLUMN, MODIFY COLUMN, RENAME TABLE
- member INSERT, 도서 INSERT/NULL, 고객 주소 UPDATE, 고객 DELETE와 외래키 오류

슬라이드의 CHECK 예제는 ‘1,000원 이상’이라는 설명에 맞게 `>= 1000`으로 정리했다. member/mem과 phone/tel이 섞여 있는 삽입 예제는 해당 독립 문제의 생성문에 맞췄다. 실제 전화번호를 INT로 바꾸는 것이 좋은 설계라는 뜻은 아니며 문법 연습임을 표시했다. Imported_book 원본 행은 없어 임의로 만들어 넣지 않았다.

## 실행 방식

실제 MySQL 서버가 아닌 sql.js(SQLite)에 자료 범위의 MySQL 호환 처리를 추가했다. MODIFY·CHANGE·ADD PRIMARY KEY는 새 정의로 테이블을 재구성한 뒤 기존 데이터를 복사한다. 실패하면 해당 구조 변경을 롤백한다. AUTO_INCREMENT의 다음 번호를 보존하고 외래키 연결을 다시 검사한다.

기본키의 NULL 금지와 중복 검사, NOT NULL·UNIQUE·CHECK, 외래키와 연쇄 삭제를 실행 엔진에서 검사한다. 부모를 참조하는 자식 테이블이 있으면 부모 DROP을 거절한다. 여러 문장은 앞에서부터 실행하며 오류 이후 문장은 실행하지 않는다. 따라서 앞에서 성공한 문장은 유지된다.

VARCHAR 길이·날짜형·콜레이션·엄격한 자료형 검사·암시적 변환·자동 커밋 등은 실제 MySQL과 완전히 같지 않다. 서버 권한 명령, 임의 인덱스·뷰·트리거, 복잡한 ALTER 제약 변경은 지원하지 않는다. DROP/ALTER와 세미콜론 구분은 자료 범위의 단순 테이블 문법을 대상으로 한다.

참고:

- [MySQL CREATE TABLE](https://dev.mysql.com/doc/refman/8.4/en/create-table.html)
- [MySQL ALTER TABLE](https://dev.mysql.com/doc/refman/8.4/en/alter-table.html)
- [SQLite의 테이블 재구성 절차](https://www.sqlite.org/lang_altertable.html)

## 검증

- 24개 모범답안을 각 문제의 선행 상태에서 실행했다.
- NULL 기본키·중복키·UNIQUE·CHECK·외래키 위반과 부모 DROP 거절을 확인했다.
- 연쇄 삭제, 부모 테이블 ALTER 중 자식 행 보존, 실패한 MODIFY/기본키 추가의 롤백을 확인했다.
- 자동 번호 생성과 ALTER 후 번호 보존, DB 생성·전환, 주석·문자열 안의 세미콜론 처리, 중간 오류 이후 실행 중단을 확인했다.
- TypeScript 및 Vite 빌드 통과. 이번 변경의 브라우저·실제 모바일 화면 검증은 하지 않았다.
