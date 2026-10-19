import PracticeTabs from '../../shared/components/PracticeTabs'
import ExamSession from '../../shared/components/ExamSession'
import MistakeReview from '../../shared/components/MistakeReview'
import { confirmationKey, engineeringConfirmation, engineeringKinds, engineeringMock, engineeringReviewSources, mockKey } from './engineeringQuestions'

export type EngineeringView = 'check' | 'exam' | 'wrong'

export default function EngineeringPractice({ view, onNavigate }: { view: EngineeringView; onNavigate: (view: EngineeringView) => void }) {
  const questions = view === 'exam' ? engineeringMock : engineeringConfirmation
  return <section className="eng-practice">
    <header><span className="course-eyebrow">PRACTICE · 공학융합프로젝트</span><h1>문제 풀기</h1><p>1–7주차 개념을 확인하고, 모의고사와 오답 복습으로 이어가세요.</p></header>
    <PracticeTabs value={view} onChange={onNavigate} tabs={[
      { id: 'check', title: '확인 문제', description: `${engineeringConfirmation.length}문제 · 핵심 개념 확인` },
      { id: 'exam', title: '시험 대비 모의고사', description: `${engineeringMock.length}문제 · 객관식 / 단답형 / 서술형` },
      { id: 'wrong', title: '틀린 문제 확인하기', description: '오답 다시 풀기 · 해결한 문제 확인' },
    ]}/>
    {view === 'wrong' ? <MistakeReview course="engineering-project" sources={engineeringReviewSources} onStart={() => onNavigate('check')}/> : <>
      <aside className="eng-practice-guide"><strong>{view === 'exam' ? '전 범위 모의고사 · 1–7주차' : '강의 핵심 확인 · 1–7주차'}</strong><p>제공된 강의 개념을 바탕으로 재구성한 학습용 예상 문제이며 실제 기출문제는 아닙니다. 과제·팀 활동·윤리 내용은 제외했습니다.</p>{view === 'exam' ? <p>객관식 7문제 · 단답형 7문제 · 서술형 7문제. 서술형은 제출 후 모범 답안과 비교해 직접 채점하세요.</p> : null}</aside>
      <ExamSession key={view} title={view === 'exam' ? '시험 대비 · 힌트 없이 풀기' : '확인 문제 · 핵심 개념 점검'} questions={questions} kinds={view === 'exam' ? engineeringKinds : { choice: '객관식' }} storageKey={view === 'exam' ? mockKey : confirmationKey} reviewCourse="engineering-project" onOpenMistakes={() => onNavigate('wrong')} renderQuestion={question => <p className="course-tag">{questions.find(item => item.id === question.id)?.unit}</p>}/>
    </>}
  </section>
}
