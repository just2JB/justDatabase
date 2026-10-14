# justDatabase

데이터베이스 수업 내용을 정리하고 시각화하는 React + TypeScript 프로젝트입니다. 첫 페이지는 노션의 「데이터베이스, 정보」 본문을 기준으로 구성했습니다.

## 실행

```sh
npm install
npm run dev
```

## 코드를 읽는 순서

1. `src/main.tsx`: 앱을 화면에 올리고 공통 스타일을 불러오는 시작점.
2. `src/app/App.tsx`: 주소에 따라 홈·알고리즘·데이터베이스를 선택.
3. `src/features/home/CourseHome.tsx`: 홈의 과목 카드와 과목 선택 메뉴.
4. `src/features/algorithm/pages/AlgorithmPage.tsx`: 알고리즘 과목 안내와 주제 목록.
5. `src/features/database/DatabaseApp.tsx`: 데이터베이스 단원 전환과 기본 개념 화면.

## 파일 구조

```text
src/
├─ main.tsx                     # 실행 시작점
├─ app/
│  └─ App.tsx                   # 과목별 화면 선택
├─ features/
│  ├─ home/
│  │  └─ CourseHome.tsx         # 홈 화면
│  ├─ algorithm/
│  │  └─ pages/                # 알고리즘 화면
│  └─ database/
│     ├─ DatabaseApp.tsx        # 데이터베이스 과목 전체 화면
│     ├─ pages/                # DBMS·DBS·관계 모델 화면
│     ├─ data/                 # 개념 설명·목차·검색 데이터
│     ├─ components/           # 목차·검색·릴레이션 시각화
│     ├─ sql/
│     │  ├─ pages/             # SQL 단원 화면
│     │  ├─ data/              # 서점 데이터·질의·예상 결과
│     │  └─ components/        # SQL 코드·표·실행기
│     └─ quiz/                 # 문제 화면·문항·진행도 저장
├─ shared/
│  └─ components/
│     └─ StudyComponents.tsx   # 공통 아이콘·학습 섹션 제목
└─ styles/
   └─ global.css               # 기존 전체 스타일
```

화면을 바꾸려면 `pages`의 `.tsx`, 설명·예시를 바꾸려면 `data`의 `.ts`를 먼저 보면 됩니다. 문제는 `quiz/quizContent.ts`, 저장 방식은 `quiz/quizStorage.ts`에서 수정합니다. SQL 실행기는 `sql/components/SqlRunner.tsx`입니다.

기존 스타일의 적용 순서를 유지하기 위해 CSS는 우선 하나의 파일로 두었습니다. `public/`에는 로고 같은 정적 파일, `docs/`에는 자료 검토 기록을 보관합니다. 파일 이동은 기존 주소와 로컬스토리지 키를 바꾸지 않습니다.

## 주요 기능

- 알고리즘 문제 풀이는 `?course=algorithm&topic=quiz`의 별도 페이지로 제공. 주제·객관식/OX 필터, 진행도·정답 수·해설 표시. 문항은 `data/algorithmQuestions.ts`, 화면은 `pages/AlgorithmQuizPage.tsx`에서 관리합니다(`src/features/algorithm/` 기준).

- 알고리즘 단원마다 시험 대비 확인 문제 제공(객관식·OX 총 20개). 효율성 분석에서는 O/Ω/Θ 정의, c·n₀, 타이트한 상한, 반복 횟수 그림, 관계식 표를 보강. `src/features/algorithm/components/ExamReview.tsx`에서 관리합니다.

- 알고리즘 그림은 `AlgorithmDiagrams.tsx`의 SVG 배열·막대·컨테이너·호출 그림으로 구성하며 `HanoiVisual.tsx`는 원판 이동을 표시합니다. 두 파일은 `src/features/algorithm/components/`에 있습니다.

- 알고리즘도 데이터베이스와 같은 왼쪽 목차·상단 검색·본문 구성. 주제 주소는 `?course=algorithm&topic=foundations`, Python 실습은 `?course=algorithm&topic=practice`입니다.
- 알고리즘 목차는 `src/features/algorithm/components/AlgorithmSidebar.tsx`, 검색은 `AlgorithmSearch.tsx`, 화면 전환은 `pages/AlgorithmPage.tsx`에서 관리합니다. 모바일은 플로팅 목차를 사용합니다.

- Vite + React + TypeScript
- 학습 홈(`/`)에서 데이터베이스(`?course=database`)와 컴퓨터 알고리즘(`?course=algorithm`) 선택
- 기존 데이터베이스의 `?page=...` 주소는 유지하며, 알고리즘은 주제별 과목 안내와 Python 연습실 제공
- Python 연습실: `src/features/algorithm/components/PythonRunner.tsx`, 과제 데이터: `src/features/algorithm/data/pythonExercises.ts`, 실행 작업: `public/python-worker.js`
- 알고리즘 개념: `src/features/algorithm/data/algorithmLessons.ts`, 화면: `components/AlgorithmConcepts.tsx`, 시각화: `components/ConceptVisuals.tsx` (모두 `src/features/algorithm/` 기준). 6개 주제와 키워드 검색, 스택·큐·성장률·재귀·선택/삽입 정렬·그래프·이진 탐색 상호작용.
- Python은 Pyodide 0.27.7을 CDN에서 불러와 별도 Web Worker에서 실행. Python 실행에는 10초, 초기 준비에는 90초 제한 적용. 출력은 50,000자로 제한하고 중지 시 Worker 종료.
- 입력값은 줄 단위 표준 입력으로 공급하며 코드·입력은 `justStudy.algorithm.python.v1`에 문제별 저장. 예시 출력 비교는 전체 정답 판정이 아님.
- 목차 이동, 형태별 데이터 분류 탭, 항상 표시되는 빅데이터 3V 비교 시각화
- 키워드 검색: 공백·대소문자를 구분하지 않고 개념명, 설명, 예시를 검색하며 관련 섹션과 분류 탭으로 이동
- 상호작용 시각화: 데이터에 의미 부여하기, 데이터베이스 공유 관계, 데이터 형태별 예시
- 모바일 반응형 화면
- DBMS 학습 페이지: 파일 시스템의 한계, 주요 기능, 장단점, 데이터베이스 모델, 세대별 발전 과정
- DBS 학습 페이지: 스키마·인스턴스, 3단계 구조·사상, 데이터 독립성, 메타데이터, 사용자와 데이터 언어
- 관계 데이터 모델: 릴레이션 기본 용어, 특성, 키의 종류와 조건, 개체·참조 무결성
- 문제 풀기: 객관식 16문제, OX 16문제, 릴레이션 선택·구성 실습 6문제
- SQL 기초 · 테이블 정의: SQL 분류, 실행 준비, CREATE/ALTER/DROP, 제약조건, 구조 변경 예시
- SQL 검색 · 데이터 질의: 조건·정렬·집계·조인·부속질의·집합·EXISTS 및 질의 3-1~3-33 결과 미리보기
- 부속질의 (`?page=subqueries`): 위치별 분류, 스칼라·IN·EXISTS, 상관 질의 시각화, 연습문제 9개와 해설
- 데이터 삽입·수정·삭제 (`?page=changes`): INSERT/UPDATE/DELETE, 변경 전후 체험, NULL·기본값·외래키 설명
- 학습 페이지를 주제별 목차에서 전환하고 통합 검색으로 원하는 개념에 이동
- 내용: `src/features/database/data/content.ts`, 화면: `src/app/App.tsx`, 공통 요소: `src/shared/components/StudyComponents.tsx`

## 자료 기준

https://app.notion.com/p/3f6491693a368004a3c0cc7ee06b735e

DBMS: https://app.notion.com/p/3f6491693a368025af38d229be5e5171

DBS: https://app.notion.com/p/3f6491693a36806ab1f7d2f6e9f9efb7

관계 데이터 모델: https://app.notion.com/p/3f6491693a3680cf8a43c20a418f8a5f

관계 모델은 `?page=relation`로 접근합니다. `src/features/database/pages/RelationPage.tsx`에 화면과 이해용 시뮬레이션, `src/features/database/data/relationContent.ts`에 목차·학습 내용·검색 항목이 있습니다. 도메인과 유일성은 예시에서 정한 조건으로 설명합니다. 무결성 예시는 실제 DB에 연결하지 않습니다.

문제 선택은 `?page=quiz`, 개념 풀이 전용 페이지는 `?page=quiz&view=solve`, 릴레이션 실습 전용 페이지는 `?page=quiz&view=practice`입니다. `src/features/database/quiz/quizContent.ts`에 학습용 문제·정답·해설, `src/features/database/quiz/QuizPage.tsx`에 화면을 구현했습니다. 각 단원에 객관식 4문제와 OX 4문제가 있습니다. 실습은 열·행을 선택해 후보키, 복합키, 참조·개체 무결성, 원자성을 비교합니다.

`src/features/database/quiz/quizStorage.ts`는 문제 순서·답안·현재 위치·결과·실습 진행도를 `justDatabase.quiz.v2.*` 로컬스토리지 키로 저장하고 검증해 복원합니다. 저장은 같은 브라우저와 같은 사이트 주소에서 유지됩니다. 저장을 사용할 수 없는 환경에서는 화면에 안내하고 현재 세션의 풀이를 계속할 수 있습니다. 문항 개념 검토 내역과 근거는 `docs/question-review.md`에 기록했습니다.

DBS는 `?page=dbs`로 접근합니다. 화면과 시각화는 `src/features/database/pages/DbsPage.tsx`, 학습 내용·목차·검색 항목은 `src/features/database/data/dbsContent.ts`에 있습니다. 예시와 개념도는 본문 내용을 이해하기 위한 자료로 구성했으며, SQL 예시는 실행하지 않습니다.

DBMS 화면은 `src/features/database/pages/DbmsPage.tsx`, 학습 내용과 검색 항목은 `src/features/database/data/dbmsContent.ts`에 있습니다. `?page=dbms`로 바로 접근할 수 있습니다. 파일 시스템과 데이터베이스 구조 도식은 본문 개념을 설명하기 위해 새로 구성한 예시이며 원문의 첨부 이미지를 복제한 것이 아닙니다.

노션 본문만 반영했습니다. 영어 용어 및 명백한 표현상 오타를 다듬었으며, 정보 시스템 이미지는 원문으로 연결했습니다. PPT는 이번 페이지에서 검토하지 않았습니다. SQL 실행 및 실제 데이터베이스 연결은 후속 요청 시 구현합니다.

## Vercel 배포

SQL 학습은 `?page=sql4`와 `?page=sql5`로 접근합니다. `src/features/database/sql/data/sqlLessonData.ts`에 원본 서점 데이터와 질의 예제가 있고, `src/features/database/sql/pages/SqlBasicsPage.tsx`, `src/features/database/sql/pages/SqlQueriesPage.tsx`, `src/features/database/sql/components/SqlLessonParts.tsx`에 학습 화면을 구현했습니다. 내용 매핑과 MySQL 문법 보정 근거는 `docs/sql-slide-review.md`에 있습니다.

Vite 프로젝트로 가져오면 됩니다. 빌드 명령은 `npm run build`, 출력 폴더는 `dist`입니다. 아직 배포하지 않았습니다.

사용자 요청에 따라 테스트, 빌드 및 브라우저 검증은 수행하지 않았습니다.

## 이후 페이지의 구성 원칙

1. 제공된 자료를 정확하게 정리하고, 원문의 오타와 모호한 표현은 의미를 보존하여 다듬습니다.
2. 정보를 읽기 쉽게 나누고 핵심 관계를 명확히 보여 줍니다.
3. 예시나 시각화가 필요한 개념에는 이해용 자료를 추가하고 예시임을 표시합니다.
4. 개념마다 비교표, 구조도, 상태 변화 등 이해에 적합한 표현 방식을 선택합니다.
5. 필요하면 외부 도구 활용을 제안하고, 외부 자료를 사용한 경우 근거를 확인합니다.

- 화면에는 노션 참조 주석이나 출처 안내를 표시하지 않습니다.
- 제공된 자료를 기준으로 개념을 정리하며, 이해에 도움이 되는 부분에 시각화를 배치합니다.
- 개념에 자연스럽게 맞는 상호작용을 추가합니다. 이해용 예시는 예시임을 표시합니다.
- 학습 내용은 키워드 검색 항목에도 등록합니다.
- 여러 하위 개념은 버튼 또는 탭으로 선택해 봅니다. 스크롤에 따른 자동 전환이나 화면 고정을 사용하지 않습니다.
- 시각화 공통 요소는 `src/features/database/components/Visuals.tsx`, 검색 요소는 `src/features/database/components/Search.tsx`에 분리합니다.
