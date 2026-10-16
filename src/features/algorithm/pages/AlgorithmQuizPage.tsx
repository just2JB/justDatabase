import { useEffect, useState } from 'react'
import QuizFilterBar from '../../../shared/components/QuizFilterBar'
import PythonRunner from '../components/PythonRunner'
import QuickSortPractice from '../components/QuickSortPractice'
import { questions } from '../data/algorithmQuestions'
import { algorithmLessons } from '../data/algorithmLessons'

const conceptStorageKey = 'justStudy.algorithm.conceptQuiz.v1'
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
  const [view, setView] = useState<'quiz' | 'python' | 'rounds'>(() => location.hash === '#quick-round-practice' ? 'rounds' : location.hash === '#python-practice' ? 'python' : 'quiz')
  const [topic, setTopic] = useState(initialProgress.topic)
  const [kind, setKind] = useState(initialProgress.kind)
  const [answers, setAnswers] = useState<Record<number, number>>(initialProgress.answers)
  const [saveError, setSaveError] = useState(false)
  const items = questions.map((q, id) => ({ ...q, id })).filter(q => (topic === 'all' || q.topic === topic) && (kind === 'all' || (q.text.includes('OX') ? 'ox' : 'choice') === kind))
  const answered = items.filter(q => answers[q.id] !== undefined)
  const correct = answered.filter(q => answers[q.id] === q.answer).length
  useEffect(() => { try { localStorage.setItem(conceptStorageKey, JSON.stringify({ topic, kind, answers })); setSaveError(false) } catch { setSaveError(true) } }, [topic, kind, answers])
  function changeView(next: 'quiz' | 'python' | 'rounds') {
    setView(next)
    const url = new URL(location.href)
    url.hash = next === 'rounds' ? 'quick-round-practice' : next === 'python' ? 'python-practice' : 'concept-practice'
    history.replaceState(null, '', url)
  }
  return <>
    <div className="page-heading"><h1>알고리즘 문제 풀기</h1><p>개념 문제와 Python 코딩 실습을 한 페이지에서 선택해 학습하세요.</p></div>
    <div className="practice-view-tabs" role="tablist" aria-label="문제 유형 선택">
      <button role="tab" aria-selected={view === 'quiz'} onClick={() => changeView('quiz')}><strong>개념 문제 풀이</strong><span>개념과 점근적 표기 확인</span></button>
      <button role="tab" aria-selected={view === 'python'} onClick={() => changeView('python')}><strong>Python 실습</strong><span>코드 작성·실행·모범 답안</span></button>
      <button role="tab" aria-selected={view === 'rounds'} onClick={() => changeView('rounds')}><strong>정렬 과정 쓰기</strong><span>퀵 정렬 회전별 표 · 7문제</span></button>
    </div>
    {view === 'quiz' ? <section id="concept-practice" className="content-enter" role="tabpanel">
      <QuizFilterBar topic={topic} type={kind} topics={[{ value: 'all', label: '전체' }, ...algorithmLessons.map(lesson => ({ value: lesson.id, label: lesson.title }))]} types={[{ value: 'all', label: '전체' }, { value: 'choice', label: '객관식' }, { value: 'ox', label: 'OX' }]} onTopicChange={setTopic} onTypeChange={setKind} count={items.length} />
      <p role="status">진행 {answered.length} / {items.length} · 정답 {correct}개</p><progress max={items.length || 1} value={answered.length} aria-label="풀이 진행도" />
      <p className="algo-source-note" role="status">{saveError ? '저장 공간을 사용할 수 없어 현재 화면에서만 답안이 유지됩니다.' : '선택한 조건과 답안은 이 브라우저에 자동 저장됩니다.'}</p>
      <div className="exam-questions">{items.map((q, i) => <article className="exam-question" key={q.id}><span className="course-tag">{q.text.includes('OX') ? 'OX' : '객관식'} · {algorithmLessons.find(l => l.id === q.topic)?.title}</span><h3>{i + 1}. {q.text}</h3>{q.code ? <pre className="sql-code"><code>{q.code}</code></pre> : null}<div className="algo-controls">{q.options.map((option, index) => <button key={option} aria-pressed={answers[q.id] === index} onClick={() => setAnswers(previous => ({ ...previous, [q.id]: index }))}>{option}</button>)}</div>{answers[q.id] !== undefined ? <p className="exam-feedback" role="status"><strong>{answers[q.id] === q.answer ? '정답' : '다시 확인해 보세요'}</strong> · {q.explanation}</p> : null}</article>)}</div>
      {!items.length ? <p>이 조건에 해당하는 문제가 없습니다.</p> : null}
      <button className="algo-practice-link" onClick={() => setAnswers(previous => Object.fromEntries(Object.entries(previous).filter(([id]) => !items.some(q => q.id === Number(id)))))}>현재 목록 답안 초기화</button>
    </section> : <div className="content-enter" role="tabpanel">{view === 'rounds' ? <QuickSortPractice /> : <PythonRunner />}</div>}
  </>
}
