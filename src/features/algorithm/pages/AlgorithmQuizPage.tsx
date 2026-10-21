import { lazy, Suspense, useEffect, useState } from 'react'
import PracticeTabs from '../../../shared/components/PracticeTabs'
import ChoiceOptions from '../../../shared/components/ChoiceOptions'
import QuizFilterBar from '../../../shared/components/QuizFilterBar'
import PythonRunner from '../components/PythonRunner'
import QuickSortPractice from '../components/QuickSortPractice'
import ExamPractice from '../components/ExamPractice'
import ExamSession from '../../../shared/components/ExamSession'
import { algorithmMockKinds, algorithmMockSets } from '../data/algorithmMockSets'
import { questions } from '../data/algorithmQuestions'
import { algorithmLessons } from '../data/algorithmLessons'
import { recordMistake, progressChangeEvent } from '../../../shared/quiz/mistakeStorage'
import { pushLocation, scrollToTarget } from '../../../shared/navigation'

const AlgorithmMistakes = lazy(() => import('../components/AlgorithmMistakes'))

const conceptStorageKey = 'justStudy.algorithm.conceptQuiz.v1'
type QuizView = 'quiz' | 'python' | 'rounds' | 'exam' | 'wrong' | 'mock1' | 'mock2' | 'mock3'
const viewHashes: Record<QuizView, string> = { quiz: 'concept-practice', python: 'python-practice', rounds: 'quick-round-practice', exam: 'exam-practice', wrong: 'wrong-review', mock1: 'mock-exam-1', mock2: 'mock-exam-2', mock3: 'mock-exam-3' }
function viewFromHash(): QuizView {
  const found = (Object.keys(viewHashes) as QuizView[]).find(view => location.hash === `#${viewHashes[view]}`)
  return found ?? 'quiz'
}
// Only the kinds a set uses, so the filter bar has no empty buttons.
const usedKinds = (items: { kind: string }[]) => Object.fromEntries(Object.entries(algorithmMockKinds).filter(([kind]) => items.some(item => item.kind === kind)))
type SavedConceptProgress = { topic: string; kind: string; answers: Record<number, number> }
function readConceptProgress(): SavedConceptProgress {
  const fallback = { topic: 'all', kind: 'all', answers: {} }
  try {
    const value: unknown = JSON.parse(localStorage.getItem(conceptStorageKey) ?? '{}')
    if (!value || typeof value !== 'object' || Array.isArray(value)) return fallback
    const saved = value as Partial<SavedConceptProgress>
    const topic = typeof saved.topic === 'string' && (saved.topic === 'all' || algorithmLessons.some(lesson => lesson.id === saved.topic)) ? saved.topic : 'all'
    const kind = typeof saved.kind === 'string' && (saved.kind === 'choice' || saved.kind === 'ox') ? saved.kind : 'all'
    const answers = saved.answers && typeof saved.answers === 'object' && !Array.isArray(saved.answers)
      ? Object.fromEntries(Object.entries(saved.answers).filter(([id, answer]) => { const question = questions[Number(id)]; return question && typeof answer === 'number' && Number.isInteger(answer) && answer >= 0 && answer < question.options.length }).map(([id, answer]) => [Number(id), Number(answer)]))
      : {}
    return { topic, kind, answers }
  } catch { return fallback }
}

export default function AlgorithmQuizPage() {
  const [initialProgress] = useState(readConceptProgress)
  const [view, setView] = useState<QuizView>(viewFromHash)
  const mockSet = algorithmMockSets.find(set => set.view === view)
  const [topic, setTopic] = useState(initialProgress.topic)
  const [kind, setKind] = useState(initialProgress.kind)
  const [answers, setAnswers] = useState<Record<number, number>>(initialProgress.answers)
  const [saveError, setSaveError] = useState(false)
  const items = questions.map((q, id) => ({ ...q, id })).filter(q => (topic === 'all' || q.topic === topic) && (kind === 'all' || (q.text.includes('OX') ? 'ox' : 'choice') === kind))
  const answered = items.filter(q => answers[q.id] !== undefined)
  const correct = answered.filter(q => answers[q.id] === q.answer).length
  useEffect(() => { try { localStorage.setItem(conceptStorageKey, JSON.stringify({ topic, kind, answers })); setSaveError(false) } catch { setSaveError(true) } }, [topic, kind, answers])
  useEffect(()=>{
    const restore=()=>setView(viewFromHash())
    window.addEventListener('popstate',restore)
    return()=>window.removeEventListener('popstate',restore)
  },[])
  useEffect(()=>{
    const restore=(event:Event)=>{if((event as CustomEvent<{key:string}>).detail?.key!==conceptStorageKey)return;const saved=readConceptProgress();setTopic(saved.topic);setKind(saved.kind);setAnswers(saved.answers)}
    window.addEventListener(progressChangeEvent,restore)
    return()=>window.removeEventListener(progressChangeEvent,restore)
  },[])
  function changeView(next: QuizView) {
    setView(next)
    const url = new URL(location.href)
    url.hash = viewHashes[next]
    pushLocation(url)
    scrollToTarget('practice-tabs')
  }
  return <>
    <div className="page-heading"><h1>알고리즘 문제 풀기</h1><p>개념 문제와 Python 코딩 실습을 한 페이지에서 선택해 학습하세요.</p></div>
    <PracticeTabs value={view} onChange={changeView} tabs={[{id:'exam',title:'시험 대비',description:'힌트 없이 · 코드 해석·서술 · 36문제'},...algorithmMockSets.map(set=>({id:set.view as QuizView,title:`모의고사 ${set.short}`,description:`${set.questions.length}문제 · ${set.guide}`})),{id:'wrong',title:'오답 모음',description:'틀린 문제 모으기 · 다시 풀기'},{id:'quiz',title:'개념 문제 풀이',description:'개념과 점근적 표기 확인'},{id:'python',title:'Python 실습',description:'코드 작성·실행·모범 답안'},{id:'rounds',title:'정렬 과정 쓰기',description:'퀵 정렬 회전별 표 · 7문제'}]}/>
    {view === 'quiz' ? <section id="concept-practice" className="content-enter" role="tabpanel">
      <QuizFilterBar topic={topic} type={kind} topics={[{ value: 'all', label: '전체' }, ...algorithmLessons.map(lesson => ({ value: lesson.id, label: lesson.title }))]} types={[{ value: 'all', label: '전체' }, { value: 'choice', label: '객관식' }, { value: 'ox', label: 'OX' }]} onTopicChange={setTopic} onTypeChange={setKind} count={items.length} />
      <p role="status">진행 {answered.length} / {items.length} · 정답 {correct}개</p><progress max={items.length || 1} value={answered.length} aria-label="풀이 진행도" />
      <p className="algo-source-note" role="status">{saveError ? '저장 공간을 사용할 수 없어 현재 화면에서만 답안이 유지됩니다.' : '선택한 조건과 답안은 이 브라우저에 자동 저장됩니다.'}</p>
      <div className="exam-questions">{items.map((q, i) => <article className="exam-question" key={q.id} data-result={answers[q.id]===undefined?undefined:answers[q.id]===q.answer?'correct':'incorrect'}><span className="course-tag">{q.text.includes('OX') ? 'OX' : '객관식'} · {algorithmLessons.find(l => l.id === q.topic)?.title}</span><h3>{i + 1}. {q.text}</h3>{q.code ? <pre className="sql-code"><code>{q.code}</code></pre> : null}<ChoiceOptions options={q.options} value={answers[q.id]} correctIndex={q.answer} revealed={answers[q.id]!==undefined} onChange={index=>{recordMistake(conceptStorageKey,'algorithm',String(q.id),{text:'',choice:index,submitted:true},index===q.answer);setAnswers(previous=>({...previous,[q.id]:index}))}}/>{answers[q.id] !== undefined ? <p className="exam-feedback" data-result={answers[q.id]===q.answer?'correct':'incorrect'} role="status"><strong>{answers[q.id] === q.answer ? '✓ 정답' : '✕ 오답'}</strong> · {q.explanation}</p> : null}</article>)}</div>
      {!items.length ? <p>이 조건에 해당하는 문제가 없습니다.</p> : null}
      <button className="algo-practice-link" onClick={() => setAnswers(previous => Object.fromEntries(Object.entries(previous).filter(([id]) => !items.some(q => q.id === Number(id)))))}>현재 목록 답안 초기화</button>
    </section> : <div className="content-enter" role="tabpanel">{view === 'wrong' ? <Suspense fallback={<p role="status">오답 기록을 불러오는 중…</p>}><AlgorithmMistakes onStart={()=>changeView('quiz')}/></Suspense> : view === 'exam' ? <ExamPractice onOpenMistakes={()=>changeView('wrong')} /> : mockSet ? <section id={viewHashes[view]}><ExamSession key={view} title={`${mockSet.title} · 힌트 없이 풀기`} guide={<p><strong>{mockSet.title}</strong> · 실제 기출이 아닌 예상 문제입니다. 시험 안내(분석·점화식 풀이·재귀 코드 읽기·정렬 회전·탐색·그래프·분할 정복)에 맞췄고, 정답은 실제 알고리즘을 실행해 계산했습니다. 정렬은 값이 바뀌지 않아도 1회전, 퀵 정렬은 원소 1개 구간을 회전으로 세지 않습니다. 서술형·과정 쓰기는 제출 후 모범 답안과 비교해 직접 채점하세요.</p>} questions={mockSet.questions} kinds={usedKinds(mockSet.questions)} storageKey={mockSet.storageKey} reviewCourse="algorithm" onOpenMistakes={()=>changeView('wrong')}/></section> : view === 'rounds' ? <QuickSortPractice /> : <PythonRunner />}</div>}
  </>
}
