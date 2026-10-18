import '../workbench/workbench.css'
import { lazy, Suspense, useEffect, useState } from 'react'
import PracticeTabs from '../../../shared/components/PracticeTabs'
import ChoiceOptions from '../../../shared/components/ChoiceOptions'
import { pushLocation, scrollToTarget } from '../../../shared/navigation'
import { emptyProgress, isQuizProgress, useSavedProgress, progressPrefix } from './quizStorage'
import { recordMistake } from '../../../shared/quiz/mistakeStorage'
import type { SearchEntry } from '../data/content'
import { practiceQuestions, quizQuestions, topicNames } from './quizContent'
import type { PracticeQuestion, QuizQuestion, QuizTopic } from './quizContent'
import SqlRunner from '../sql/components/SqlRunner'
import SqlTablesPage from '../sql/pages/SqlTablesPage'
import QuizFilterBar from '../../../shared/components/QuizFilterBar'

const DatabaseExamPractice = lazy(() => import('./DatabaseExamPractice'))
const DatabaseMistakes = lazy(() => import('./DatabaseMistakes'))

type PracticeProgress = { index: number; selected: number[]; submitted: boolean; results: Record<string, boolean> }
function isPracticeProgress(value: unknown): value is PracticeProgress {
  if (!value || typeof value !== 'object') return false
  const data = value as PracticeProgress
  if (!Number.isInteger(data.index) || !practiceQuestions[data.index] || !Array.isArray(data.selected) || typeof data.submitted !== 'boolean' || !data.results || typeof data.results !== 'object' || Array.isArray(data.results)) return false
  const question = practiceQuestions[data.index]
  const limit = question.mode === 'rows' ? question.rows.length : question.columns.length
  return new Set(data.selected).size === data.selected.length && data.selected.every(item => Number.isInteger(item) && item >= 0 && item < limit) && Object.entries(data.results).every(([id, correct]) => practiceQuestions.some(item => item.id === id) && typeof correct === 'boolean')
}
function RelationPractice() {
  const [progress, setProgress, failed] = useSavedProgress<PracticeProgress>('practice', { index: 0, selected: [], submitted: false, results: {} }, isPracticeProgress)
  const { index, selected, submitted, results } = progress
  const question: PracticeQuestion = practiceQuestions[index]
  const correct = selected.length === question.correct.length && selected.every(value => question.correct.includes(value))
  function toggle(value: number) { if (!submitted) setProgress(previous => ({ ...previous, selected: previous.selected.includes(value) ? previous.selected.filter(item => item !== value) : [...previous.selected, value] })) }
  function changeQuestion(next: number) { setProgress(previous => ({ ...previous, index: next, selected: [], submitted: false })) }
  return <section id="relation-practice" className="relation-practice"><h2>릴레이션 직접 만들기</h2><p className="quiz-save-status" role="status">{failed ? '저장을 사용할 수 없습니다. 현재 화면에서만 풀이가 유지됩니다.' : '진행도와 선택한 답은 이 브라우저에 자동 저장됩니다.'}</p><p className="dbs-section-intro">열이나 행을 선택하고 조건에 맞는 릴레이션을 구성해 보세요. 총 {practiceQuestions.length}문제입니다.</p><div className="practice-navigation">{practiceQuestions.map((item, itemIndex) => <button type="button" key={item.id} aria-pressed={index === itemIndex} onClick={() => changeQuestion(itemIndex)}>{itemIndex + 1}. {item.title}{results[item.id] !== undefined ? <span>{results[item.id] ? '정답' : '다시 풀기'}</span> : null}</button>)}</div><div key={question?.id} className="quiz-question-panel content-enter"><span className="quiz-meta">직접 선택 · {index + 1} / {practiceQuestions.length}</span><h3>{question.title}</h3><p>{question.prompt}</p><div className="practice-context">{question.context}</div><p className="dbs-mini">{question.mode === 'columns' ? '표의 열 제목을 눌러 선택하세요.' : '행 앞의 체크박스를 눌러 선택하세요.'} 여러 개를 선택할 수 있습니다.</p><div className="table-wrap"><table className="practice-table"><caption className="sr-only">{question.title}의 선택 가능한 릴레이션 예시</caption><thead><tr>{question.mode === 'rows' ? <th scope="col">선택</th> : null}{question.columns.map((column, columnIndex) => <th scope="col" key={column}>{question.mode === 'columns' ? <button type="button" disabled={submitted} aria-pressed={selected.includes(columnIndex)} className={selected.includes(columnIndex) ? 'practice-selected' : ''} onClick={() => toggle(columnIndex)}>{selected.includes(columnIndex) ? '✓ ' : ''}{column}</button> : column}</th>)}</tr></thead><tbody>{question.rows.map((row, rowIndex) => <tr key={rowIndex} className={question.mode === 'rows' && selected.includes(rowIndex) ? 'practice-selected' : ''}>{question.mode === 'rows' ? <td><input type="checkbox" aria-label={`${rowIndex + 1}번째 투플 선택`} disabled={submitted} checked={selected.includes(rowIndex)} onChange={() => toggle(rowIndex)} /></td> : null}{row.map((cell, columnIndex) => <td key={columnIndex} className={question.mode === 'columns' && selected.includes(columnIndex) ? 'practice-selected' : ''}>{cell}</td>)}</tr>)}</tbody></table></div>
    {question.mode === 'rows' && selected.length ? <div className="constructed-relation"><h4>선택한 투플로 구성한 릴레이션</h4><div className="table-wrap"><table><thead><tr>{question.columns.map(column => <th key={column}>{column}</th>)}</tr></thead><tbody>{selected.slice().sort((a, b) => a - b).map(row => <tr key={row}>{question.rows[row].map((cell, column) => <td key={column}>{cell}</td>)}</tr>)}</tbody></table></div></div> : null}
    {!submitted ? <button type="button" className="quiz-primary" disabled={!selected.length} onClick={() => { recordMistake(progressPrefix+'practice','database',question.id,{text:'',selections:selected,submitted:true},correct); setProgress(previous => ({ ...previous, submitted: true, results: { ...previous.results, [question.id]: correct } })) }}>선택한 답 확인</button> : <div className={`quiz-feedback ${correct ? 'correct' : 'incorrect'}`} role="status"><strong>{correct ? '정답입니다.' : '조건을 다시 살펴보세요.'}</strong><p>{question.explanation}</p><p>정답: {question.correct.map(value => question.mode === 'columns' ? question.columns[value] : `${value + 1}번째 투플`).join(', ')}</p><div className="quiz-actions"><button type="button" className="visual-button" onClick={() => { setProgress(previous => ({ ...previous, selected: [], submitted: false })) }}>다시 풀기</button>{index < practiceQuestions.length - 1 ? <button type="button" className="quiz-primary" onClick={() => changeQuestion(index + 1)}>다음 문제</button> : null}</div></div>}</div></section>
}

type QuizView = 'setup' | 'practice' | 'sql' | 'tables' | 'exam' | 'wrong'
function currentView(): QuizView {
  const value = new URLSearchParams(location.search).get('view')
  return value === 'wrong' || value === 'exam' || value === 'practice' || value === 'sql' || value === 'tables' ? value : 'setup'
}
export default function QuizPage({ onLearn }: { onLearn: (entry: SearchEntry) => void }) {
  const [progress, setProgress, failed] = useSavedProgress('concept', emptyProgress, isQuizProgress)
  const [view, setView] = useState<QuizView>(currentView)
  const { topic, type, answers } = progress
  const items = quizQuestions.filter(question => (topic === 'all' || topic === question.topic) && (type === 'all' || type === question.type))
  const completed = items.filter(question => answers[question.id] !== undefined)
  const correct = completed.filter(question => answers[question.id] === question.answer).length
  useEffect(() => {
    const readView = () => setView(currentView())
    window.addEventListener('popstate', readView)
    return () => window.removeEventListener('popstate', readView)
  }, [])
  function navigate(next: QuizView) {
    const url = new URL(location.href)
    url.searchParams.set('page', 'quiz')
    if (next === 'setup') url.searchParams.delete('view')
    else url.searchParams.set('view', next)
    url.hash = ''
    pushLocation(url)
    setView(next)
    scrollToTarget('practice-tabs')
  }
  function answer(id: string, choice: number) {
    const question = quizQuestions.find(item=>item.id===id)!
    recordMistake(progressPrefix+'concept','database',id,{text:'',choice,submitted:true},choice===question.answer)
    setProgress(previous => ({...previous, ids:quizQuestions.map(q=>q.id), index:0, selection:null, finished:false, answers:{...previous.answers,[id]:choice}}))
  }
  function learn(item: QuizQuestion) { onLearn({ title: '', text: '', page: item.topic, section: item.target, target: item.target, ...(item.topic === 'dbs' && ['dbs-languages', 'dml-comparison'].includes(item.target) ? { language: item.target === 'dml-comparison' ? 1 : 0 } : {}) }) }
  return <>
    <div className="page-heading"><h1>데이터베이스 문제 풀기</h1><p>개념 문제와 릴레이션·SQL 실습을 한 페이지에서 선택해 학습하세요.</p></div>
    <PracticeTabs value={view==='tables'?'sql':view} onChange={navigate} tabs={[{id:'exam',title:'시험 대비',description:'전 범위 모의고사 1~3회 · 총 120문제'},{id:'wrong',title:'오답 모음',description:'틀린 문제 모으기 · 다시 풀기'},{id:'setup',title:'개념 문제 풀이',description:'데이터베이스 개념과 관계 모델 확인'},{id:'practice',title:'릴레이션 실습',description:'키·무결성·릴레이션 구성'},{id:'sql',title:'SQL 실습',description:'질의 작성·실행·원본 테이블'}]}/>
    {view==='setup' ? <section id="concept-quiz" className="content-enter" role="tabpanel">
      <QuizFilterBar topic={topic} type={type} topics={[{value:'all' as const,label:'전체'},...Object.entries(topicNames).map(([value,label])=>({value:value as QuizTopic,label}))]} types={[{value:'all' as const,label:'전체'},{value:'choice' as const,label:'객관식'},{value:'ox' as const,label:'OX'}]} onTopicChange={value=>setProgress(p=>({...p,topic:value}))} onTypeChange={value=>setProgress(p=>({...p,type:value}))} count={items.length}/>
      <p role="status">진행 {completed.length} / {items.length} · 정답 {correct}개</p><progress max={items.length || 1} value={completed.length} aria-label="풀이 진행도"/>
      <p className="algo-source-note" role="status">{failed?'저장 공간을 사용할 수 없어 현재 화면에서만 답안이 유지됩니다.':'선택한 조건과 답안은 이 브라우저에 자동 저장됩니다.'}</p>
      <div className="exam-questions">{items.map((question,i)=><article className="exam-question" key={question.id} data-result={answers[question.id]===undefined?undefined:answers[question.id]===question.answer?'correct':'incorrect'}><span className="course-tag">{question.type==='ox'?'OX':'객관식'} · {topicNames[question.topic]}</span><h3>{i+1}. {question.prompt}</h3><ChoiceOptions options={question.options} value={answers[question.id]} correctIndex={question.answer} revealed={answers[question.id]!==undefined} onChange={index=>answer(question.id,index)}/>{answers[question.id]!==undefined ? <div className="exam-feedback" data-result={answers[question.id]===question.answer?'correct':'incorrect'} role="status"><strong>{answers[question.id]===question.answer?'✓ 정답':'✕ 오답'}</strong><p>정답: {question.options[question.answer]}</p><p>{question.explanation}</p><button className="quiz-learn-link" onClick={()=>learn(question)}>관련 개념 보기</button></div>:null}</article>)}</div>
      {!items.length?<p>이 조건에 해당하는 문제가 없습니다.</p>:null}
      <button className="algo-practice-link" onClick={()=>setProgress(previous=>({...previous,finished:false,selection:null,answers:Object.fromEntries(Object.entries(previous.answers).filter(([id])=>!items.some(q=>q.id===id)))}))}>현재 목록 답안 초기화</button>
    </section> : <div role="tabpanel" className="content-enter">{view==='exam'?<Suspense fallback={<p role="status">시험 문제를 불러오는 중…</p>}><DatabaseExamPractice/></Suspense>:view==='wrong'?<Suspense fallback={<p role="status">오답 기록을 불러오는 중…</p>}><DatabaseMistakes onStart={()=>navigate('setup')}/></Suspense>:view==='practice'?<RelationPractice/>:view==='tables'?<><button className="quiz-back-link" onClick={()=>navigate('sql')}>SQL 실습으로 돌아가기</button><SqlTablesPage/></>:<section id="sql-practice"><div className="wb-entry"><div><strong>Workbench에서 처음부터 만들어 보기</strong><p>공방 예약 DB · 테이블 생성부터 부속질의까지 30개 미션</p></div><button type="button" onClick={()=>onLearn({title:"",text:"",page:"workbench",section:"main"})}>별도 미션 페이지 →</button></div><SqlRunner onOpenTables={()=>navigate('tables')}/></section>}</div>}
  </>
}
