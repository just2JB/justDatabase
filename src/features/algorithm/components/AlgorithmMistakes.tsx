import MistakeReview from '../../../shared/components/MistakeReview'
import type { ReviewSource } from '../../../shared/quiz/mistakeStorage'
import { questions } from '../data/algorithmQuestions'
import { examPractice } from '../data/examPractice'
import { Graph } from './ExamPractice'
import { quickPracticeProblems, quickPracticeRounds, quickPracticeStorageKey, quickRoundAnswerValues } from '../data/quickSortPracticeData'
import { quickPartitionCode } from '../data/quickSortTrace'
import { algorithmMockSets } from '../data/algorithmMockSets'

export const algorithmReviewSources: ReviewSource[] = [
  { key: 'justStudy.algorithm.conceptQuiz.v1', label: '개념 문제', course: 'algorithm', format: 'concept', initial: { topic: 'all', kind: 'all', answers: {} }, questions: questions.map((question, index) => ({ id: String(index), kind: question.text.includes('OX') ? 'ox' : 'choice', prompt: question.text, code: question.code, options: question.options, correct: question.answer, answer: question.options[question.answer], explanation: question.explanation })) },
  { key: 'justStudy.algorithm.examPractice.v1', label: '시험 대비', course: 'algorithm', format: 'exam', questions: examPractice },
  { key: quickPracticeStorageKey, label: '퀵 정렬 회전', course: 'algorithm', format: 'quick', questions: quickPracticeProblems.flatMap((input, problemIndex) => quickPracticeRounds(input).map((round, roundIndex) => ({ id: `${problemIndex}-${roundIndex}`, kind: 'reading', prompt: `퀵 정렬 문제 ${problemIndex + 1} · ${roundIndex + 1}회전의 선택 피벗, 피벗 최종 위치(전체 리스트의 0부터 시작하는 인덱스), 분할 직후의 전체 리스트를 쓰세요. 입력: [${input.join(', ')}]`, numericSequence: quickRoundAnswerValues(round), numericSequenceLabel: '선택 피벗, 피벗 최종 인덱스, 전체 리스트 순서로 숫자를 쉼표 또는 공백으로 구분해 작성하세요.', answer: `선택 피벗: ${round.pivot} · 최종 위치: [${round.at}] · 전체 리스트: [${round.values.join(', ')}]`, explanation: '첫 원소 피벗·양방향 분할을 사용하고 왼쪽 구간부터 재귀 처리합니다. 선택 피벗·최종 인덱스·전체 리스트를 모두 확인합니다.', code: quickPartitionCode }))) },
  ...algorithmMockSets.map((set): ReviewSource => ({ key: set.storageKey, label: set.title, course: 'algorithm', format: 'exam', questions: set.questions })),
]

export default function AlgorithmMistakes({ onStart }: { onStart: () => void }) {
  return <MistakeReview course="algorithm" sources={algorithmReviewSources} onStart={onStart} renderQuestion={(_, question) => question.graph === 'one' || question.graph === 'two' ? <Graph kind={question.graph}/> : null}/>
}
