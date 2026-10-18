import MistakeReview from '../../../shared/components/MistakeReview'
import type { ReviewSource } from '../../../shared/quiz/mistakeStorage'
import { questions } from '../data/algorithmQuestions'
import { examPractice } from '../data/examPractice'
import { Graph } from './ExamPractice'
import { quickPracticeProblems, quickPracticeRounds, quickPracticeStorageKey } from '../data/quickSortPracticeData'
import { quickPartitionCode } from '../data/quickSortTrace'

export const algorithmReviewSources: ReviewSource[] = [
  { key: 'justStudy.algorithm.conceptQuiz.v1', label: '개념 문제', course: 'algorithm', format: 'concept', initial: { topic: 'all', kind: 'all', answers: {} }, questions: questions.map((question, index) => ({ id: String(index), kind: question.text.includes('OX') ? 'ox' : 'choice', prompt: question.text, code: question.code, options: question.options, correct: question.answer, answer: question.options[question.answer], explanation: question.explanation })) },
  { key: 'justStudy.algorithm.examPractice.v1', label: '시험 대비', course: 'algorithm', format: 'exam', questions: examPractice },
  { key: quickPracticeStorageKey, label: '퀵 정렬 회전', course: 'algorithm', format: 'quick', questions: quickPracticeProblems.flatMap((input, problemIndex) => quickPracticeRounds(input).map((round, roundIndex) => ({ id: `${problemIndex}-${roundIndex}`, kind: 'reading', prompt: `퀵 정렬 문제 ${problemIndex + 1} · ${roundIndex + 1}회전 직후의 전체 리스트를 쓰세요. 입력: [${input.join(', ')}]`, numericSequence: round.values, answer: round.values.join(', '), explanation: '첫 원소 피벗·양방향 분할을 사용하고 왼쪽 구간부터 재귀 처리합니다. 해당 분할에서 피벗 위치가 확정된 직후 전체 리스트를 비교하세요.', code: quickPartitionCode }))) },
]

export default function AlgorithmMistakes({ onStart }: { onStart: () => void }) {
  return <MistakeReview course="algorithm" sources={algorithmReviewSources} onStart={onStart} renderQuestion={(_, question) => question.graph === 'one' || question.graph === 'two' ? <Graph kind={question.graph}/> : null}/>
}
