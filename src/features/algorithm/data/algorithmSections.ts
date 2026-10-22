import { algorithmLessons } from './algorithmLessons'

export function lessonSections(id: string) {
  const lesson = algorithmLessons.find(item => item.id === id) ?? algorithmLessons[0]
  if (id === 'foundations') return [
    { id: 'foundations-overview', title: '알고리즘의 이해', indices: [0], visual: 'none' },
    { id: 'foundations-conditions', title: '알고리즘의 5가지 조건', indices: [1, 2, 3, 4, 5], visual: 'conditions' },
    { id: 'foundations-notation', title: '알고리즘 표기법', indices: [6, 7, 8, 9], visual: 'notation' },
    { id: 'foundations-structures', title: '기본 자료구조', indices: [10, 11, 12, 13], visual: 'structures' },
  ]
  if (id === 'analysis') return [
    { id: 'analysis-efficiency', title: '좋은 알고리즘과 효율성', indices: [0, 1], visual: 'none' },
    { id: 'analysis-measurement', title: '입력 크기와 연산 측정', indices: [2, 3, 4], visual: 'none' },
    { id: 'analysis-cases', title: '입력에 따른 성능 차이', indices: [5], visual: 'none' },
    { id: 'analysis-asymptotic', title: '점근적 분석과 표기', indices: [6, 7, 8], visual: 'none' },
  ]
  if (id === 'divide') return [
    { id: 'divide-strategy', title: '분할 정복과 리스트 합', indices: [0, 1], visual: 'divide-sum' },
    { id: 'divide-recurrence', title: '순환 관계식과 연속 대치법', indices: [2, 3], visual: 'divide-recurrence' },
    { id: 'divide-master', title: '마스터 정리 · 공식과 단계별 풀이', indices: [], visual: 'divide-master' },
    { id: 'divide-merge', title: '병합 정렬 · 8개 원소 전체 과정', indices: [6, 7, 8], visual: 'divide-merge' },
    { id: 'divide-quick', title: '퀵 정렬 · 피벗으로 나누기', indices: [9, 10, 11], visual: 'divide-quick' },
  ]
  if (id === 'graphs') return [
    { id: 'graphs-dfs', title: 'DFS · 깊이 우선 탐색', indices: [1, 4], visual: 'dfs' },
    { id: 'graphs-bfs', title: 'BFS · 너비 우선 탐색', indices: [2, 5], visual: 'bfs' },
  ]
  if (id === 'decrease') return [
    { id: 'decrease-insertion', title: '삽입 정렬', indices: [0], visual: 'decrease-insertion' },
    { id: 'decrease-binary', title: '이진 탐색', indices: [1], visual: 'decrease-binary' },
    { id: 'decrease-topological', title: '위상 정렬 · 진입차수로 순서 정하기', indices: [2], visual: 'decrease-topological' },
    { id: 'decrease-power', title: '빠른 거듭제곱 · 지수를 절반으로 줄이기', indices: [3], visual: 'decrease-power' },
  ]
  if (id === 'recursion') return [
    { id: 'recursion-definition', title: '순환과 재귀적 정의', indices: [4, 5], visual: 'none' },
    { id: 'recursion-calls', title: '팩토리얼 계산과 호출 흐름', indices: [0, 3], visual: 'none' },
    { id: 'recursion-substitution', title: '순환 관계식과 연속 대치법', indices: [6, 7, 8], visual: 'none' },
    { id: 'recursion-examples', title: '대표 순환 알고리즘', indices: [1, 2], visual: 'none' },
  ]
  if (id === 'brute-force') return [
    { id: 'brute-force-strategy', title: '억지 기법의 개념과 활용', indices: [0, 1, 2], visual: 'none' },
    { id: 'brute-force-sorting', title: '선택 정렬 · 문제와 기본 전략', indices: [3, 4, 5], visual: 'none' },
    { id: 'brute-force-in-place', title: '선택 정렬 · 제자리 정렬과 예시', indices: [6, 7, 8], visual: 'selection' },
    { id: 'brute-force-sequential', title: '순차 탐색', indices: [9, 10], visual: 'sequential' },
    { id: 'brute-force-matching', title: '문자열 탐색', indices: [11, 12], visual: 'matching' },
    { id: 'brute-force-closest', title: '최근접 쌍의 거리', indices: [13, 14], visual: 'closest' },
  ]
  return [{ id: `concept-${id}`, title: '핵심 개념', indices: lesson.concepts.map((_,i) => i), visual: 'none' }]
}
