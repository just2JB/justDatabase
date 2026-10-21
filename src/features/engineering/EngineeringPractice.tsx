import PracticeTabs from '../../shared/components/PracticeTabs'
import ExamSession from '../../shared/components/ExamSession'
import MistakeReview from '../../shared/components/MistakeReview'
import { confirmationKey, engineeringConfirmation, engineeringKinds, engineeringMock, engineeringReviewSources, mockKey } from './engineeringQuestions'
import { mockSetKinds, mockSets } from './engineeringMockSets'
import { engineeringOXKey, engineeringOXQuestions } from './engineeringOXQuestions'
import type { MockSetView } from './engineeringMockSets'

export type EngineeringView = 'check' | 'ox' | 'exam' | 'wrong' | MockSetView

// Only the kinds a set actually uses, so the filter bar shows no empty buttons.
const usedKinds = (questions: readonly { kind: string }[]) =>
  Object.fromEntries(Object.entries(mockSetKinds).filter(([kind]) => questions.some(q => q.kind === kind)))
const kindSummary = (questions: readonly { kind: string }[]) =>
  Object.entries(usedKinds(questions))
    .map(([kind, label]) => `${label} ${questions.filter(q => q.kind === kind).length}`)
    .join(' · ')

export default function EngineeringPractice({ view, onNavigate }: { view: EngineeringView; onNavigate: (view: EngineeringView) => void }) {
  const mockSet = mockSets.find(set => set.view === view)
  const questions = mockSet ? mockSet.questions : view === 'ox' ? engineeringOXQuestions : view === 'exam' ? engineeringMock : engineeringConfirmation
  const isExam = view === 'exam' || mockSet !== undefined
  return <section className="eng-practice">
    <header><span className="course-eyebrow">PRACTICE · 공학융합프로젝트</span><h1>문제 풀기</h1><p>1–7주차 개념을 확인하고, 모의고사와 오답 복습으로 이어가세요.</p></header>
    <PracticeTabs value={view} onChange={onNavigate} tabs={[
      { id: 'check', title: '확인 문제', description: `${engineeringConfirmation.length}문제 · 핵심 개념 확인` },
      { id: 'ox', title: 'OX 100문제', description: `${engineeringOXQuestions.length}문제 · 1–7주차 · 정답과 해설` },
      { id: 'exam', title: '시험 대비 모의고사', description: `${engineeringMock.length}문제 · 객관식 / 단답형 / 서술형` },
      ...mockSets.map(set => ({ id: set.view, title: `모의고사 ${set.short}`, description: `${set.questions.length}문제 · ${set.guide}` })),
      { id: 'wrong', title: '틀린 문제 확인하기', description: '오답 다시 풀기 · 해결한 문제 확인' },
    ]}/>
    {view === 'wrong' ? <MistakeReview course="engineering-project" sources={engineeringReviewSources} onStart={() => onNavigate('check')}/> : <>
      <ExamSession
        key={view}
        guide={<div className="eng-practice-guide"><strong>{mockSet ? `${mockSet.title} · 1–7주차` : view === 'ox' ? 'OX 개념 점검 · 1–7주차 100문제' : view === 'exam' ? '전 범위 모의고사 · 1–7주차' : '강의 핵심 확인 · 1–7주차'}</strong>
        <p>제공된 강의 개념을 바탕으로 재구성한 학습용 예상 문제이며 실제 기출문제는 아닙니다. 과제·팀 활동·윤리 내용은 제외했습니다.</p>
        {mockSet ? <p>{kindSummary(mockSet.questions)}. 계산 문제는 숫자만 입력하면 자동 채점되고, 서술형은 제출 후 모범 답안과 비교해 직접 채점하세요.</p>
          : view === 'exam' ? <p>객관식 7문제 · 단답형 7문제 · 서술형 7문제. 서술형은 제출 후 모범 답안과 비교해 직접 채점하세요.</p> : view === 'ox' ? <p>문장이 맞으면 O, 틀리면 X를 선택하세요. 제출 후 해설과 강의 페이지를 확인할 수 있고, 틀린 문제는 오답 모음에 자동 저장됩니다.</p> : null}</div>}
        title={mockSet ? `${mockSet.title} · 힌트 없이 풀기` : view === 'ox' ? 'OX 100문제 · 핵심 개념 점검' : view === 'exam' ? '시험 대비 · 힌트 없이 풀기' : '확인 문제 · 핵심 개념 점검'}
        questions={[...questions]}
        kinds={mockSet ? usedKinds(mockSet.questions) : view === 'ox' ? { ox: 'OX' } : isExam ? engineeringKinds : { choice: '객관식' }}
        storageKey={mockSet ? mockSet.storageKey : view === 'ox' ? engineeringOXKey : view === 'exam' ? mockKey : confirmationKey}
        reviewCourse="engineering-project"
        onOpenMistakes={() => onNavigate('wrong')}
        renderQuestion={question => <p className="course-tag">{questions.find(item => item.id === question.id)?.unit}</p>}
      />
    </>}
  </section>
}
