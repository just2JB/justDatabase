import { useState } from 'react'
import { questions } from '../data/algorithmQuestions'
import { algorithmLessons } from '../data/algorithmLessons'

export default function AlgorithmQuizPage() {
  const [topic,setTopic] = useState('all')
  const [kind,setKind] = useState('all')
  const [answers,setAnswers] = useState<Record<number,number>>({})
  const items = questions.map((q,id) => ({...q,id})).filter(q => (topic==='all' || q.topic===topic) && (kind==='all' || (q.text.includes('OX') ? 'ox' : 'choice')===kind))
  const answered = items.filter(q => answers[q.id] !== undefined)
  const correct = answered.filter(q => answers[q.id]===q.answer).length
  return <><div className="page-heading"><h1>알고리즘 문제 풀기</h1><p>객관식과 OX로 개념을 확인하고 해설을 읽어보세요.</p></div><div className="algo-controls"><label>주제 <select value={topic} onChange={e => setTopic(e.target.value)}><option value="all">전체 주제</option>{algorithmLessons.map(l => <option value={l.id} key={l.id}>{l.title}</option>)}</select></label><label>유형 <select value={kind} onChange={e => setKind(e.target.value)}><option value="all">전체</option><option value="choice">객관식</option><option value="ox">OX</option></select></label></div><p role="status">진행 {answered.length} / {items.length} · 정답 {correct}개</p><progress max={items.length || 1} value={answered.length} aria-label="풀이 진행도" /><p className="algo-source-note">수업 자료 유형을 참고한 연습 문제입니다. 실제 출제를 보장하지 않습니다. 답안은 현재 페이지에서 유지됩니다.</p><div className="exam-questions">{items.map((q,i) => <article className="exam-question" key={q.id}><span className="course-tag">{q.text.includes('OX') ? 'OX' : '객관식'} · {algorithmLessons.find(l => l.id===q.topic)?.title}</span><h3>{i+1}. {q.text}</h3>{q.code ? <pre className="sql-code"><code>{q.code}</code></pre> : null}<div className="algo-controls">{q.options.map((option,index) => <button key={option} aria-pressed={answers[q.id]===index} onClick={() => setAnswers(previous => ({...previous,[q.id]:index}))}>{option}</button>)}</div>{answers[q.id] !== undefined ? <p className="exam-feedback" role="status"><strong>{answers[q.id]===q.answer ? '정답' : '다시 확인해 보세요'}</strong> · {q.explanation}</p> : null}</article>)}</div>{!items.length ? <p>이 조건에 해당하는 문제가 없습니다.</p> : null}<button className="algo-practice-link" onClick={() => setAnswers(previous => Object.fromEntries(Object.entries(previous).filter(([id]) => !items.some(q => q.id===Number(id)))))}>현재 목록 답안 초기화</button></>
}
