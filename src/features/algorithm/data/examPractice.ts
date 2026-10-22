import type { TraversalGraphKind } from './traversalGraphs'

export type ExamKind = 'concept'|'choice'|'blank'|'analysis'|'traversal'|'reading'
export const examKinds:Record<ExamKind,string>={concept:'개념 서술',choice:'객관식',blank:'코드 빈칸',analysis:'효율성 분석',traversal:'DFS·BFS 순서',reading:'코드 읽기·서술'}
export type ExamQuestion={id:string;kind:ExamKind;prompt:string;code?:string;answer:string;explanation:string;options?:string[];correct?:number;graph?:TraversalGraphKind;accepted?:string[]}
const q=(id:string,kind:ExamKind,prompt:string,answer:string,explanation:string,code?:string):ExamQuestion=>({id,kind,prompt,answer,explanation,code})
function traversalAnswers(answer: string): string[] {
  const nodes = answer.split(' ')
  return [answer, nodes.join(','), nodes.join('→'), nodes.join('->'), nodes.join('-'), `[${nodes.join(',')}]`]
}
export const traversalStorageKey = 'justStudy.algorithm.traversalPractice.v1'
export const examPractice:ExamQuestion[]=[
  q('c1','concept','알고리즘의 다섯 조건을 쓰고 유한성과 유효성을 구별하라.','입력·출력·명확성·유한성·유효성','입력은 0개 이상, 출력은 1개 이상이다. 유한성은 유한 단계 후 종료, 유효성은 실제 실행 가능한 명령이라는 뜻이다.'),
  q('c2','concept','억지 기법의 의미와 작은 입력에서 사용할 수 있는 이유를 설명하라.','문제 정의에 따른 직접적인 해결 전략. 작은 입력에서는 후보 수가 적고 준비 비용도 작다.','점근적으로 더 좋은 알고리즘보다 작은 입력에서 빠를 수도 있다. 큰 입력에서도 항상 효율적이라는 뜻은 아니다.'),
  q('c3','concept','분할 정복의 세 단계를 설명하고 병합 정렬에 대응시켜라.','분할: 절반으로 나눔 / 정복: 양쪽 재귀 정렬 / 병합: 정렬된 두 리스트 결합','원소 1개 이하에서 종료한다. 병합은 두 구간의 현재 원소를 비교해 작은 값부터 옮긴다.'),
  q('c4','concept','Big-O, Big-Ω, Big-Θ와 최선·최악의 관계를 설명하라.','O는 상한, Ω는 하한, Θ는 동일 증가 등급. 최선·최악은 입력 상황의 구분이다.','Big-O 자체가 최악의 경우를 뜻하지는 않는다.'),
  q('c5','concept','정렬의 안정성을 예로 설명하고 선택·삽입·병합·퀵 정렬의 일반적인 구현을 비교하라.','같은 키의 기존 순서 유지. 삽입·병합은 조건에 따라 안정적, 일반 교환식 선택·퀵 정렬은 불안정.','삽입은 큰 값만 이동하고, 병합은 같은 값이면 왼쪽을 먼저 고를 때 안정적이다.'),
  q('c6','concept','위상 정렬이 가능한 조건과 정답 순서가 여러 개일 수 있는 이유를 설명하라.','방향 비순환 그래프(DAG). 선행 관계가 없는 정점 사이 순서는 여러 가지 가능하다.','모든 간선 u→v에서 u가 v보다 앞서면 된다. 사이클이 있으면 전체 정렬이 불가능하다.'),
  ...[
    ['m1','n²+100n+7의 가장 타이트한 Big-O는?',['O(n)','O(n²)','O(n³)','O(1)'],1,'최고차항 n²이 지배한다.'],
    ['m2','표준 선택 정렬에서 원소 8개의 비교 횟수는?',['8','16','28','64'],2,'7+6+…+1=28이다.'],
    ['m3','삽입 정렬의 최선 입력은?',['오름차순','내림차순','항상 같다','원소가 큰 순서와 무관하다'],0,'오름차순이면 앞 원소를 이동할 필요 없이 각 key를 확인한다.'],
    ['m4','인접 리스트의 전체 BFS 시간 복잡도는?',['O(V²)','O(V+E)','O(E²)','O(log V)'],1,'정점 방문과 간선 확인을 합산한다.'],
    ['m5','T(n)=2T(n/2)+n의 시간 복잡도는?',['O(n)','O(n²)','O(n log n)','O(log n)'],2,'a=2,b=2,d=1. a=bᵈ이므로 O(n log n).'],
    ['m6','첫 원소 피벗 퀵 정렬에서 이미 오름차순인 서로 다른 값의 최악 복잡도는?',['O(n)','O(n log n)','O(log n)','O(n²)'],3,'피벗이 계속 최소값이 되어 구간이 0개와 n−1개로 치우친다.'],
  ].map(([id,prompt,options,correct,explanation])=>({id,kind:'choice',prompt,options,correct,answer:(options as string[])[correct as number],explanation} as ExamQuestion)),
  q('b1','blank','①·②에 들어갈 코드를 각각 쓰라.','① 1  ② n - 1','F(1)=1에서 종료하며 더 작은 문제로 이동한다.','def f(n):\n    if n == 1:\n        return ①\n    return n * f(②)'),
  q('b2','blank','①·②에 들어갈 코드를 각각 쓰라.','① i  ② least','현재 구간의 첫 위치로 초기화하고 최소값 위치와 교환한다.','for i in range(len(A)-1):\n    least = ①\n    for j in range(i+1, len(A)):\n        if A[j] < A[least]:\n            least = j\n    A[i], A[②] = A[②], A[i]'),
  q('b3','blank','①·②에 들어갈 코드를 각각 쓰라.','① j >= 0 and A[j] > key  ② j + 1','큰 값만 뒤로 이동한 다음 빈 위치에 key를 넣는다.','for i in range(1, len(A)):\n    key = A[i]\n    j = i - 1\n    while ①:\n        A[j+1] = A[j]\n        j -= 1\n    A[②] = key'),
  q('b4','blank','①·②에 들어갈 코드를 각각 쓰라.','① mid + 1  ② mid - 1','이미 비교한 mid를 제외해야 구간이 줄어든다.','if A[mid] == key:\n    return mid\nelif A[mid] < key:\n    low = ①\nelse:\n    high = ②'),
  q('b5','blank','교수님 양방향 분할 방식의 ①·②·③을 채워라.','① A[left]  ② <  ③ >','low는 피벗 이상, high는 피벗 이하인 원소에서 멈춘다.','pivot = ①\nlow, high = left+1, right\nwhile low <= high:\n    while low <= right and A[low] ② pivot:\n        low += 1\n    while high >= left+1 and A[high] ③ pivot:\n        high -= 1\n    if low < high:\n        A[low], A[high] = A[high], A[low]\n        low += 1\n        high -= 1\n    else:\n        break\nA[left], A[high] = A[high], A[left]'),
  q('b6','blank','①·②에 들어갈 큐 연산을 쓰라.','① popleft()  ② append(u)','BFS는 FIFO 큐를 쓰고 큐에 넣을 때 방문 처리한다.','q = deque([start])\nseen = {start}\nwhile q:\n    v = q.①\n    for u in sorted(graph[v]):\n        if u not in seen:\n            seen.add(u)\n            q.②'),
  q('a1','analysis','T(n)=T(n−1)+2, T(1)=1을 연속 대치로 풀고 복잡도를 쓰라.','T(n)=2n−1, O(n)','T(n)=T(n−k)+2k. n−k=1에서 k=n−1. T(n)=1+2(n−1).'),
  q('a2','analysis','T(n)=2T(n/2)+1, T(1)=1을 연속 대치로 풀어라. n은 2의 거듭제곱이다.','T(n)=2n−1, O(n)','2T(n/2)+1 → 4T(n/4)+3 → 2ᵏT(n/2ᵏ)+(2ᵏ−1). 2ᵏ=n을 대입한다.'),
  q('a3','analysis','T(n)=T(n/2)+1, T(1)=1을 연속 대치로 풀어라. n은 2의 거듭제곱이다.','T(n)=log₂n+1, O(log n)','T(n)=T(n/2ᵏ)+k. n/2ᵏ=1이면 k=log₂n이다.'),
  q('a4','analysis','T(n)=2T(n/2)+n, T(1)=1을 연속 대치로 풀어라. n은 2의 거듭제곱이다.','T(n)=n log₂n+n, O(n log n)','각 대치에서 n씩 누적: T(n)=2ᵏT(n/2ᵏ)+kn. 2ᵏ=n, k=log₂n을 적용한다.'),
  q('a5','analysis','count의 증가 횟수를 정확히 구하고 시간 복잡도를 쓰라.','n(n−1)/2회, O(n²)','(n−1)+(n−2)+…+1이다.','for i in range(n):\n    for j in range(i+1, n):\n        count += 1'),
  q('a6','analysis','n=16일 때 count 값과 일반적인 시간 복잡도를 쓰라.','64, O(n log n)','각 바깥 반복마다 16→8→4→2→1로 4회 증가. 총 16×4=64.','count = 0\nfor i in range(n):\n    k = n\n    while k > 1:\n        k //= 2\n        count += 1'),
  q('a7','analysis','T(n)=3T(n/2)+n의 a,b,d를 찾고 마스터 정리로 복잡도를 구하라.','a=3,b=2,d=1, O(n^(log₂3))','3>2¹이므로 재귀 부분의 증가가 지배한다.'),
  q('a8','analysis','T(n)=2T(n/2)+n²의 a,b,d를 찾고 마스터 정리로 복잡도를 구하라.','a=2,b=2,d=2, O(n²)','2<2²이므로 n² 비용이 지배한다.'),
  ...([
    ['g1','one','A에서 재귀 DFS를 수행할 때 처음 방문한 순서를 쓰라.','A B D C E G H F','A→B→D→C→E→G→H까지 내려간 뒤 돌아와 F를 방문한다.'],
    ['g2','one','A에서 BFS를 수행할 때 큐에서 꺼내 처리하는 순서를 쓰라.','A B C D E F G H','발견 즉시 방문 처리하고 이웃을 알파벳순으로 큐에 넣는다.'],
    ['g3','two','A에서 재귀 DFS를 수행할 때 처음 방문한 순서를 쓰라.','A B D E C F','A→B→D→E→C→F 순으로 미방문 이웃을 따라간다.'],
    ['g4','two','A에서 BFS를 수행할 때 큐에서 꺼내 처리하는 순서를 쓰라.','A B C D E F','A의 B,C 다음 B에서 D,E, C에서 F를 발견한다.'],
    ['g5','branch','A에서 재귀 DFS로 처음 방문하는 노드 순서를 쓰라.','A B D E C F G','A의 이웃 B를 먼저 선택한다. B에서 D와 E를 탐색한 뒤 A로 돌아와 C, F, G를 방문한다.'],
    ['g6','branch','A에서 BFS로 처리하는 노드 순서를 쓰라.','A B C D E F G','A에서 B와 C를 먼저 발견한다. B에서 D와 E, C에서 F와 G를 큐에 넣는다.'],
    ['g7','cycle','순환이 있는 그래프에서 A의 재귀 DFS 방문 순서를 쓰라.','A B D F E C G','A-B-D-F-E까지 깊이 들어간다. E의 미방문 이웃 C를 먼저 방문하고 돌아온 뒤 G를 방문한다. 이미 방문한 노드는 건너뛴다.'],
    ['g8','cycle','순환이 있는 그래프에서 A의 BFS 방문 순서를 쓰라.','A B C D E F G','A에서 B,C, B에서 D, C에서 E, D에서 F를 발견한다. E에서 F는 이미 발견했으므로 중복 삽입하지 않고 G만 넣는다.'],
    ['g9','number','1번 노드에서 재귀 DFS로 처음 방문하는 순서를 쓰라.','1 2 5 8 6 3 4 7','1-2-5-8-6까지 깊이 탐색한다. 6의 이웃은 모두 방문했으므로 1까지 돌아온 뒤 미방문 이웃 3, 4와 4의 이웃 7을 방문한다.'],
    ['g10','number','1번 노드에서 BFS로 처리하는 순서를 쓰라.','1 2 3 4 5 6 7 8','1에서 2,3,4를 발견한다. 2에서 5,6, 4에서 7, 5에서 8을 큐에 넣는다. 6에서 8을 다시 넣지 않는다.'],
    ['g11','restart','A가 아닌 C에서 시작할 때 재귀 DFS 방문 순서를 쓰라.','C A B D E F G','시작점 C를 먼저 적는다. C의 이웃 A,F,G 중 A에 들어가 B,D,E까지 탐색하고 C로 돌아와 F와 G를 방문한다.'],
    ['g12','restart','C에서 시작할 때 BFS 방문 순서를 쓰라.','C A F G B D E','C의 이웃 A,F,G를 알파벳순으로 큐에 넣는다. A에서 B를 발견하고, B에서 D와 E를 발견한다. 그림의 좌우 배치와 방문 순서는 다르다.'],
  ] as const).map(([id,graph,prompt,answer,explanation])=>({...q(id,'traversal',prompt,answer,explanation),graph,accepted:traversalAnswers(answer)})),
  q('r1','reading','아래 코드의 출력 결과를 줄바꿈까지 쓰고 이유를 설명하라.','1\n2\n3','재귀 호출이 먼저 실행되므로 가장 작은 호출부터 돌아오며 출력한다.','def f(n):\n    if n == 0:\n        return\n    f(n-1)\n    print(n)\nf(3)'),
  q('r2','reading','아래 코드의 출력 결과를 순서대로 쓰라.','3\n2\n1\n1\n2\n3','호출 전에는 3,2,1을 출력하고 복귀하면서 1,2,3을 출력한다.','def f(n):\n    if n == 0:\n        return\n    print(n)\n    f(n-1)\n    print(n)\nf(3)'),
  q('r3','reading','출력값과 최초 호출을 포함한 f의 전체 호출 횟수를 구하라.','출력 5, 호출 15회','F(5)=5. C(0)=C(1)=1, C(n)=1+C(n−1)+C(n−2)이므로 C(5)=15.','def f(n):\n    if n < 2:\n        return n\n    return f(n-1) + f(n-2)\nprint(f(5))'),
  q('r4','reading','함수 이름을 추측하지 말고 반환값과 탐색 범위가 변하는 과정을 설명하라.','인덱스 3','[0,4]에서 mid=2, 값8<12 → [3,4]. mid=3, 값12 일치.','def f(a, x):\n    l, r = 0, len(a)-1\n    while l <= r:\n        m = (l+r)//2\n        if a[m] == x:\n            return m\n        if a[m] < x:\n            l = m+1\n        else:\n            r = m-1\n    return -1\nprint(f([2,5,8,12,16], 12))'),
  q('r5','reading','실행 후 A를 쓰고, 전체 정렬이 완료되었는지 설명하라.','[2,3,5,1], 전체 정렬 미완료','key=2를 앞의 정렬 구간에 넣는 한 회전만 실행했다.','A = [3,5,2,1]\ni = 2\nkey = A[i]\nj = i-1\nwhile j >= 0 and A[j] > key:\n    A[j+1] = A[j]\n    j -= 1\nA[j+1] = key\nprint(A)'),
  q('r6','reading','출력값과 문자 비교 과정을 설명하라.','2','시작0: A,B,A 일치 후 B≠C. 시작1: B≠A. 시작2에서 ABAC 전체 일치.','def f(t,p):\n    for i in range(len(t)-len(p)+1):\n        j = 0\n        while j < len(p) and t[i+j] == p[j]:\n            j += 1\n        if j == len(p):\n            return i\n    return -1\nprint(f("ABABAC", "ABAC"))'),
]

export const traversalPractice = examPractice.filter(question => question.kind === 'traversal')
