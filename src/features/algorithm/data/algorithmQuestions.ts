export type Question = { topic: string; text: string; code?: string; options: string[]; answer: number; explanation: string }
export const questions: Question[] = [
  { topic: 'analysis', text: '다음 기본연산의 가장 타이트한 시간 차수는?', code: 'for i in range(n):\n    for j in range(n):\n        count += 1', options: ['Θ(n)', 'Θ(n²)', 'Θ(log n)', 'Θ(1)'], answer: 1, explanation: '바깥 n번마다 안쪽 n번: n×n=n². 기본연산은 정확히 n²번이다.' },
  { topic: 'analysis', text: '안쪽 반복 범위가 줄어들면 시간 차수는?', code: 'for i in range(n):\n    for j in range(i+1, n):\n        count += 1', options: ['Θ(n)', 'Θ(log n)', 'Θ(n²)', 'Θ(n³)'], answer: 2, explanation: '(n-1)+(n-2)+…+1=n(n-1)/2. 절반 정도 줄어도 이차 차수다.' },
  { topic: 'analysis', text: '연속된 두 반복문은?', code: 'for i in range(n):\n    count += 1\nfor j in range(n):\n    count += 1', options: ['Θ(n²)', 'Θ(2ⁿ)', 'Θ(log n)', 'Θ(n)'], answer: 3, explanation: '중첩이 아니라 연속 실행이므로 n+n=2n → Θ(n). 곱하지 않는다.' },
  { topic: 'analysis', text: 'n=16일 때 while 본문 실행 횟수는?', code: 'k = n\nwhile k > 1:\n    k //= 2', options: ['3번', '4번', '5번', '16번'], answer: 1, explanation: '16→8→4→2→1: 갱신은 4번. 시작 상태를 세어 5번으로 답하지 않는다.' },
  { topic: 'analysis', text: '두 배 증가하는 반복문의 시간 차수는?', code: 'k = 1\nwhile k <= n:\n    k *= 2', options: ['Θ(n)', 'Θ(n²)', 'Θ(log n)', 'Θ(2ⁿ)'], answer: 2, explanation: 'k=1,2,4,…,2^t이며 2^t≤n. n≥1에서 본문은 floor(log₂n)+1번 실행한다.' },
  { topic: 'analysis', text: 'O(n²)인 함수는 O(n³)일 수 없다. OX', options: ['O · 맞다', 'X · 틀리다'], answer: 1, explanation: 'O는 상한이다. n²는 n³로도 상한을 잡을 수 있다. 가장 타이트한 차수를 묻는 문제라면 Θ(n²)를 선택한다.' },
  { topic: 'analysis', text: '2n²+3n+1 ≤ 5n²를 만족하는 정수 시작점으로 적절한 것은?', options: ['n₀=1', 'n₀=2', '어떤 n₀도 없다'], answer: 1, explanation: 'n=1에서는 6>5로 실패한다. n≥2에서 3n≤(3/2)n², 1≤(1/4)n²이므로 f(n)≤3.75n²≤5n². 따라서 c=5, n₀=2는 유효하다.' },
  { topic: 'analysis', text: 'T(n)=T(n-1)+3, T(1)=0의 정확한 식은?', options: ['3n', '3(n-1)', '3 log₂n', '3ⁿ'], answer: 1, explanation: 'n→1까지 n-1단계다. 매 단계 3을 더하므로 3(n-1). 초기 조건을 넣어 n=1에서 0인지 확인한다.' },
  { topic: 'analysis', text: 'n회 반복 안에서 n을 절반씩 줄이는 반복이 새로 시작된다면?', code: 'for i in range(n):\n    k = n\n    while k > 1:\n        k //= 2', options: ['Θ(n)', 'Θ(log n)', 'Θ(n log n)', 'Θ(n²)'], answer: 2, explanation: '바깥 n번 × 매번 Θ(log n). k=n이 바깥 반복의 매 회전에 다시 실행된다는 점을 확인한다.' },
  { topic: 'foundations', text: '({[}])가 괄호 검사에 실패하는 이유는?', options: ['괄호 수가 홀수다', '마지막 여는 괄호 [와 닫는 괄호 }가 맞지 않는다', '스택은 문자열을 저장할 수 없다'], answer: 1, explanation: '스택에는 (, {, [ 순서로 들어간다. }는 최상단 [와 짝이 아니므로 즉시 실패한다.' },
  { topic: 'foundations', text: '유클리드 알고리즘의 다음 상태: (60, 28) → ?', options: ['(28, 4)', '(4, 28)', '(60, 4)'], answer: 0, explanation: 'a,b=b,a%b. 60%28=4이므로 (28,4)이고 다음은 (4,0)이다.' },
  { topic: 'recursion', text: 'func(4)의 전체 호출 횟수는? 최초 호출도 포함한다.', code: 'def func(n):\n    if n == 1:\n        return\n    func(n-1)', options: ['3번', '4번', '7번'], answer: 1, explanation: 'func(4),func(3),func(2),func(1)의 4번. 재귀로 새로 호출한 횟수만 묻는다면 3번이다.' },
  { topic: 'recursion', text: '하노이탑 원판 4개의 최소 이동 횟수는?', options: ['8', '15', '16', '24'], answer: 1, explanation: '2ⁿ-1=2⁴-1=15. 호출 횟수가 아니라 원판 이동 횟수다.' },
  { topic: 'recursion', text: '팩토리얼 재귀와 반복의 추가 공간은? (기본연산 모델)', options: ['둘 다 O(1)', '재귀 Θ(n), 반복 O(1)', '재귀 O(1), 반복 Θ(n)'], answer: 1, explanation: '재귀는 n에 비례하는 호출 스택을 유지한다. 반복은 일정한 수의 변수만 유지한다.' },
  { topic: 'brute-force', text: '선택 정렬에서 n=9의 원소 비교 횟수는?', options: ['9', '18', '36', '81'], answer: 2, explanation: '8+7+…+1=9×8/2=36. 교환 횟수와 비교 횟수를 구별한다.' },
  { topic: 'brute-force', text: '4개 도시 TSP에서 출발 도시를 고정한 순열 수는? 역방향도 별도로 센다.', options: ['4!', '3! = 6', '4² = 16'], answer: 1, explanation: '남은 3도시를 순열로 나열하므로 6개다. 대칭 거리의 역방향 중복을 제거한다면 3개지만 여기서는 제거하지 않는다.' },
  { topic: 'graphs', text: '인접 리스트를 사용하는 전체 DFS·BFS의 시간 상한은?', options: ['O(V²)', 'O(E²)', 'O(V+E)'], answer: 2, explanation: '정점 방문과 간선 확인을 합산한다. 행렬 표현이라면 이웃 확인에 전체 행을 읽어 O(V²)이 될 수 있다.' },
  { topic: 'graphs', text: 'BFS는 간선 가중치가 서로 달라도 항상 최소 비용 경로를 구한다. OX', options: ['O · 맞다', 'X · 틀리다'], answer: 1, explanation: 'BFS는 간선 수 기준으로 층을 확장한다. 무가중치 또는 동일 비용일 때의 최단 경로 조건을 기억한다.' },
  { topic: 'decrease', text: '이미 오름차순인 배열에 대한 표준 삽입 정렬의 시간은?', options: ['Θ(1)', 'Θ(n)', 'Θ(n²)'], answer: 1, explanation: '큰 원소를 밀어낼 필요가 없어도 각 key를 한 번씩 확인한다. n-1번의 회전이 있으므로 Θ(n)이다.' },
  { topic: 'decrease', text: '위상 정렬이 전체 정점에 대해 가능한 조건은?', options: ['무방향 연결 그래프', '방향 비순환 그래프', '정점 번호가 정렬된 그래프'], answer: 1, explanation: 'DAG가 조건이다. 진입차수 0인 정점을 제거했는데 처리 정점 수가 V보다 작으면 사이클이 있다.' },
]

