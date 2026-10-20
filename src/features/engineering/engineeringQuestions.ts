import { engineeringLessons } from './lessons'
import { mockSets } from './engineeringMockSets'
import type { ReviewQuestion, ReviewSource } from '../../shared/quiz/mistakeStorage'

export const engineeringKinds = { choice: '객관식', blank: '단답형', written: '서술형' }
export const confirmationKey = 'justStudy.engineering.confirmation.v1'
export const mockKey = 'justStudy.engineering.mockExam.v1'

// 기존 강의 정리의 범위에서 재구성한 학습용 문제이며 실제 기출문제가 아닙니다.
const choices = [
  { prompt: 'SDD에서 요구가 변경되었을 때 먼저 할 일은?', options: ['코드만 수정한다', '명세에 변경을 반영한다', '검증을 생략한다', '기존 요구를 지운다'], correct: 1, explanation: 'SDD는 명세 → 계획 → 태스크 → 구현 → 검증을 따르며, 요구 변경도 명세에 먼저 반영합니다.' },
  { prompt: '에이전트의 컨텍스트와 권한을 올바르게 구분한 것은?', options: ['컨텍스트는 수정 권한, 권한은 참고 문서다', '둘 다 입력 토큰 수다', '컨텍스트는 볼 수 있는 정보, 권한은 할 수 있는 행동이다', '권한이 있으면 근거는 필요 없다'], correct: 2, explanation: '코드·문서·실행 결과는 컨텍스트이며 파일 수정·명령 실행의 허용 범위는 권한입니다.' },
  { prompt: '사용자의 실제 문제를 확인하기에 가장 적절한 인터뷰 질문은?', options: ['이런 앱이 있으면 쓰실래요?', '최근 언제 불편했고 어떻게 해결했나요?', 'AI를 넣으면 좋겠죠?', '모든 학생도 똑같이 생각하죠?'], correct: 1, explanation: '미래의 사용 의향을 유도하기보다 실제 경험·해결 방법·빈도를 확인합니다.' },
  { prompt: 'EARS에서 상태가 유지되는 동안의 동작을 표현하는 키워드는?', options: ['WHEN', 'IF … THEN', 'WHERE', 'WHILE'], correct: 3, explanation: 'WHILE은 상태 기반, WHEN은 사건 기반, IF … THEN은 예외, WHERE는 선택 기능 패턴입니다.' },
  { prompt: 'MoSCoW에서 이번 범위에 포함하지 않을 기능은?', options: ['Must', 'Should', 'Could', 'Won’t'], correct: 3, explanation: 'Won’t는 이번 범위에서 하지 않기로 합의한 항목입니다. 단순히 우선순위가 낮은 Could와 다릅니다.' },
  { prompt: 'Git의 스테이징 영역은 무엇을 위한 공간인가?', options: ['다음 커밋에 넣을 변경을 모으는 공간', '원격 서버의 백업 폴더', '병합된 브랜치 목록', '실행 중인 프로그램 목록'], correct: 0, explanation: 'git add로 변경을 스테이징하고, git commit으로 선택된 변경의 스냅샷을 기록합니다.' },
  { prompt: '유지보수하기 좋은 모듈 설계의 방향은?', options: ['높은 결합도·낮은 응집도', '높은 결합도·높은 응집도', '낮은 결합도·높은 응집도', '낮은 결합도·낮은 응집도'], correct: 2, explanation: '모듈 사이 의존은 낮추고, 모듈 내부 요소는 하나의 목적에 모이도록 응집도를 높입니다.' },
]

const blanks = [
  { prompt: 'AI가 생성한 코드를 확인하는 검증 비용을 뜻하는 용어는 (    )이다.', answer: 'Verification Tax', accepted: ['Verification Tax', '검증 비용', '검증 세금'], explanation: '구현 시간이 줄어도 생성 코드의 확인·검증 비용이 새로운 병목이 될 수 있습니다.' },
  { prompt: 'PEAS에서 E는 (    )를 뜻한다. 영문 또는 한글로 쓰시오.', answer: 'Environment · 환경', accepted: ['Environment', '환경'], explanation: 'PEAS는 Performance measure, Environment, Actuators, Sensors입니다.' },
  { prompt: '합의된 범위 밖의 요구가 통제 없이 추가되어 일정과 비용이 무너지는 현상은?', answer: 'Scope Creep', accepted: ['Scope Creep', '스코프 크리프', '범위 크리프'], explanation: '합의된 요구와 기준선을 바탕으로 변경 이력과 범위를 관리해야 합니다.' },
  { prompt: 'EARS의 사건 기반(Event-driven) 요구를 시작하는 키워드는?', answer: 'WHEN', accepted: ['WHEN'], explanation: 'WHEN 사건이 발생하면 THE 시스템 SHALL 동작·결과 형식으로 작성합니다.' },
  { prompt: '태스크의 선후 관계를 표현하는 방향 비순환 그래프의 영문 약자는?', answer: 'DAG', accepted: ['DAG'], explanation: 'DAG의 위상정렬로 선행 관계를 지키는 작업 순서를 구할 수 있습니다.' },
  { prompt: '다음 커밋에 포함할 파일 변경을 스테이징하는 Git 명령은? (파일명 제외)', answer: 'git add', accepted: ['git add', 'add'], explanation: 'add는 스테이징, commit은 변경 기록, push는 원격 전송입니다.' },
  { prompt: '변경 가능성이 있는 설계 결정을 모듈 내부에 감추는 원칙은?', answer: 'Information Hiding · 정보 은닉', accepted: ['Information Hiding', '정보 은닉'], explanation: '바뀔 수 있는 결정을 감추면 해당 변경이 다른 모듈로 전파되는 것을 줄일 수 있습니다.' },
]

const written = [
  { prompt: 'AI로 구현이 빨라졌는데 전체 개발 일정은 비슷하다. 가능한 이유와 대응을 명세·검증 관점에서 설명하시오.', answer: '요구 분석·설계·검증 등 구현 외 작업은 그대로 남아 있고, 생성 코드의 검증 비용이 새 병목이 될 수 있다. 명세와 수용 기준을 먼저 명확히 하고 결과를 검증하여 재작업을 줄인다.', explanation: '① 구현 외 병목 또는 Verification Tax ② 명세·수용 기준 ③ 검증의 필요성을 연결하면 됩니다. AI 도입이 모든 단계를 같은 비율로 단축하지는 않습니다.' },
  { prompt: '에이전트가 존재하지 않는 API를 사용했다. 컨텍스트를 어떻게 보완하고 결과를 어떻게 확인할지 설명하시오.', answer: '실제 API 문서, 사용 중인 코드와 환경 정보를 제공한다. 제안된 API가 실제 존재하는지 문서·코드로 교차검증하고, 실행 및 테스트 결과로 동작을 확인한다.', explanation: '① 실제 근거 제공 ② 문서·코드 교차검증 ③ 실행 검증을 포함합니다. 지시를 더 자신 있게 쓰는 것만으로 해결되지 않습니다.' },
  { prompt: '“학생을 위한 AI 앱을 만든다”를 문제 정의로 보기 어려운 이유와 보완할 네 요소를 설명하시오.', answer: '해결책과 기술만 있고 누가 어떤 상황에서 무엇을 불편해하는지, 해결 여부를 어떻게 판단할지 불명확하다. Who(사용자), When/Where(상황), What(구체적 불편), Done(성공 기준)을 확인해야 한다.', explanation: '기술·해결책과 문제를 구분하고 네 요소를 제시합니다. 확인한 사실과 가정을 구분하며 실제 사용자 경험에 근거해야 합니다.' },
  { prompt: '“추천 결과를 빠르게 보여준다”를 검증 가능한 EARS 요구로 고치고 결과가 없는 예외 경로도 쓰시오. 수치와 동작은 직접 정하시오.', answer: 'WHEN 사용자가 추천 버튼을 누르면 THE 시스템 SHALL 조건에 맞는 항목 3개를 3초 이내에 표시한다.\nIF 조건에 맞는 항목이 없으면 THEN THE 시스템 SHALL “결과 없음” 안내와 조건 초기화 버튼을 표시한다.', explanation: '예시의 수치는 정답으로 고정되지 않습니다. ① 사건·주체·동작·결과 ② 개수·시간 등 검증 가능 기준 ③ 결과 없음에 대한 예외 동작이 명확한지 확인하세요.' },
  { prompt: '화면 구현과 데이터 구현이 서로를 기다리는 순환 의존을 어떻게 해소할 수 있는가? Atomic Task의 완료 기준도 설명하시오.', answer: '공통 선행 결정인 데이터 형식 합의를 별도 태스크로 분리한 뒤 화면과 데이터 구현을 병행한다. 각 태스크는 독립 검증 가능하고 완료 조건이 명확하며, 며칠 안에 끝낼 크기와 담당자가 있어야 한다.', explanation: '① 공통 선행 결정 분리 ② 순환 제거 후 병행 ③ 독립 검증과 명확한 완료 조건을 포함합니다. 단순히 동시에 시작하는 것은 의존성을 없애지 않습니다.' },
  { prompt: 'Fast-forward 병합과 3-way 병합의 차이를 설명하고 충돌 발생 시 누가 무엇을 결정해야 하는지 쓰시오.', answer: 'Fast-forward는 이력이 갈라지지 않아 브랜치 참조만 이동한다. 3-way는 공통 조상과 양쪽 변경을 비교해 병합한다. 자동 병합이 불가능하면 사람이 요구를 확인하여 최종 내용을 결정하고 충돌 해결을 기록한다.', explanation: '① 이력 분기 여부 ② 공통 조상을 포함한 비교 ③ 사람이 최종 내용 결정이라는 차이를 구분합니다.' },
  { prompt: '라면 추천 앱을 표현·로직·데이터 계층으로 나누고 외부 API 변경의 영향을 줄이는 이유를 설명하시오.', answer: '표현은 버튼·입력·카드, 로직은 맵기 필터·추천 점수, 데이터는 목록 조회·외부 API를 맡는다. API 세부 사항을 데이터 계층 안에 감추면 다른 계층의 수정을 줄일 수 있다.', explanation: '① 세 계층의 책임 ② 정보 은닉 ③ 변경 전파 감소를 설명합니다. 표현 계층이 DB 종류를, 데이터 계층이 추천 규칙을 직접 알 필요가 없도록 나눕니다.' },
]

const unit = (index: number) => `${index + 1}주차 · ${engineeringLessons[index].title}`
const extraChoices: ReviewQuestion[] = choices.map((q, i) => ({ ...q, id: `eng-choice-${i + 1}`, kind: 'choice', answer: q.options[q.correct], unit: unit(i) }))
export const engineeringConfirmation: ReviewQuestion[] = engineeringLessons.flatMap((lesson, i) => [
  { id: `eng-check-${i + 1}`, kind: 'choice', prompt: lesson.question, options: [...lesson.choices], correct: lesson.answer, answer: lesson.choices[lesson.answer], explanation: lesson.explanation, unit: unit(i) },
  extraChoices[i],
])
export const engineeringMock: ReviewQuestion[] = engineeringLessons.flatMap((_, i) => [
  { ...extraChoices[i], id: `eng-mock-choice-${i + 1}` },
  { ...blanks[i], id: `eng-mock-blank-${i + 1}`, kind: 'blank', unit: unit(i) },
  { ...written[i], id: `eng-mock-written-${i + 1}`, kind: 'written', unit: unit(i) },
])
export const engineeringReviewSources: ReviewSource[] = [
  { key: confirmationKey, label: '확인 문제', course: 'engineering-project', format: 'exam', questions: engineeringConfirmation },
  { key: mockKey, label: '시험 대비 모의고사', course: 'engineering-project', format: 'exam', questions: engineeringMock },
  ...mockSets.map((set): ReviewSource => ({ key: set.storageKey, label: set.title, course: 'engineering-project', format: 'exam', questions: set.questions })),
]
