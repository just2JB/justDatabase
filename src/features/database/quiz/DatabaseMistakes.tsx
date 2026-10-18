import MistakeReview from '../../../shared/components/MistakeReview'
import type { ReviewSource } from '../../../shared/quiz/mistakeStorage'
import { quizQuestions, practiceQuestions } from './quizContent'
import { emptyProgress, progressPrefix } from './quizStorage'
import { fullMockExams } from './fullMockExams'
import { databaseExam } from './databaseExam'
import { relationMockExams } from './relationMockExams'
import { SqlTable } from '../sql/components/SqlLessonParts'
import './database-exam.css'

export const databaseReviewSources: ReviewSource[] = [
  { key: `${progressPrefix}concept`, label: '개념 문제', course: 'database', format: 'concept', initial: { ...emptyProgress, ids: quizQuestions.map(question => question.id) }, questions: quizQuestions.map(question => ({ id: question.id, kind: question.type, prompt: question.prompt, options: question.options, correct: question.answer, answer: question.options[question.answer], explanation: question.explanation })) },
  ...fullMockExams.map(paper => ({ key: `justStudy.database.fullMockExam.${paper.id}.v1`, label: paper.title, course: 'database' as const, format: 'exam' as const, questions: paper.questions })),
  { key: `${progressPrefix}practice`, label: '릴레이션 실습', course: 'database', format: 'relation', questions: practiceQuestions.map((question, index) => {
    const labels = question.mode === 'columns' ? question.columns : question.rows.map((row, rowIndex) => `${rowIndex + 1}번째 투플 · ${row.join(' / ')}`)
    return { id: question.id, kind: 'multiple', prompt: `${question.title} · ${question.prompt}`, multiOptions: labels, correctSelections: question.correct, sourceIndex: index, answer: question.correct.map(value => labels[value]).join(' · '), explanation: question.explanation }
  }) },
  { key: 'justStudy.database.examPractice.v1', label: '이전 종합 연습', course: 'database', format: 'exam', questions: databaseExam },
  ...relationMockExams.map(paper => ({ key: `justStudy.database.mockExam.${paper.id}.v1`, label: `이전 관계 모델 ${paper.title}`, course: 'database' as const, format: 'exam' as const, questions: paper.questions })),
]

export default function DatabaseMistakes({ onStart }: { onStart: () => void }) {
  return <MistakeReview course="database" sources={databaseReviewSources} onStart={onStart} renderQuestion={(source, question) => {
    const mock = fullMockExams.flatMap(paper => paper.questions).find(item => item.id === question.id) ?? relationMockExams.flatMap(paper => paper.questions).find(item => item.id === question.id)
    const practice = source.format === 'relation' ? practiceQuestions.find(item => item.id === question.id) : undefined
    return <>{mock?.tables?.map(table => <div className="database-exam-table" key={table.caption}><SqlTable data={table.data} caption={table.caption}/></div>)}{practice ? <><p>{practice.context}</p><SqlTable caption="문제의 기준 릴레이션" data={{ columns: practice.columns, rows: practice.rows }}/></> : null}</>
  }}/>
}
