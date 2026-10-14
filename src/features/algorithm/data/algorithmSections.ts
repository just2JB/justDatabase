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
  return [{ id: `concept-${id}`, title: '핵심 개념', indices: lesson.concepts.map((_,i) => i), visual: 'none' }]
}
