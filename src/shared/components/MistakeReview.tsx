import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import ChoiceOptions from './ChoiceOptions'
import { collectMistakes, describeResponse, gradeResponse, importExistingMistakes, mistakeChangeEvent, saveReviewResponse } from '../quiz/mistakeStorage'
import type { CourseId, Mistake, ReviewQuestion, ReviewResponse, ReviewSource } from '../quiz/mistakeStorage'
import type { AnswerInputProps } from './ExamSession'
import './mistake-review.css'

type AnswerRenderer = (source: ReviewSource, question: ReviewQuestion, props: AnswerInputProps) => ReactNode
type Renderer = (source: ReviewSource, question: ReviewQuestion) => ReactNode
const isAuto = (question: ReviewQuestion) => Boolean(question.options || question.accepted || question.correctSelections || question.numericSequence)
function ReviewCard({ entry, source, question, active, onOpen, onClose, onSave, renderQuestion, renderAnswer }: {
  entry: Mistake; source: ReviewSource; question: ReviewQuestion; active: boolean; onOpen: () => void; onClose: () => void; onSave: (response: ReviewResponse) => boolean; renderQuestion?: Renderer; renderAnswer?: AnswerRenderer
}) {
  const [response, setResponse] = useState<ReviewResponse>({ text: '' })
  const [submitted, setSubmitted] = useState(false)
  const [history, setHistory] = useState(false)
  const auto = isAuto(question)
  const correct = gradeResponse(question, response)
  const answerInput = renderAnswer?.(source, question, { value: response.text, disabled: submitted, onChange: text => setResponse(previous => ({ ...previous, text })) })
  const ready = question.options ? response.choice !== undefined : question.multiOptions ? Boolean(response.selections?.length) : Boolean(response.text.trim())
  function start() { setResponse({ text: '' }); setSubmitted(false); setHistory(false); onOpen() }
  function submit() { const next = { ...response, submitted: true }; if (onSave(next)) { setSubmitted(true); setResponse(next) } }
  function mark(review: 'correct' | 'again') { const next = { ...response, review, submitted: true }; if (onSave(next)) setResponse(next) }
  return <article className="mistake-card" data-status={entry.status}>
    <div className="mistake-card-meta"><span>{source.label}{question.unit ? ` · ${question.unit}` : ''}</span><strong>{entry.status === 'resolved' ? '복습 완료' : '복습 필요'}</strong></div>
    <h3>{question.prompt}</h3><p className="mistake-history-note">{!entry.updatedAt ? '이전 풀이 기록에서 가져옴' : `최근 오답 ${new Date(entry.updatedAt).toLocaleDateString('ko-KR')}`} · 틀린 횟수 {entry.misses}{entry.imported ? '회 이상' : '회'}</p>
    <div className="mistake-card-actions"><button type="button" className="visual-button" aria-expanded={active} onClick={active ? onClose : start}>{active ? '풀이 접기' : '다시 풀기'}</button><button type="button" className="quiz-learn-link" aria-expanded={history} onClick={()=>setHistory(value=>!value)}>{history ? '이전 오답·해설 접기' : '이전 오답·해설 보기'}</button></div>
    {history ? <div className="mistake-history content-enter"><p><strong>이전에 틀린 답</strong>{describeResponse(question, entry.lastWrong)}</p><p><strong>정답·모범 답안</strong>{question.answer}</p><p><strong>해설</strong>{question.explanation}</p></div> : null}
    {active ? <div className="mistake-attempt content-enter">{renderQuestion?.(source, question)}{question.code ? <pre className="sql-code"><code>{question.code}</code></pre> : null}
      {answerInput ?? (question.options ? <ChoiceOptions options={question.options} value={response.choice} disabled={submitted} correctIndex={question.correct} revealed={submitted} onChange={choice=>setResponse(previous=>({...previous,choice}))}/> : question.multiOptions ? <fieldset className="mistake-multiple"><legend>조건을 만족하는 항목을 모두 선택하세요.</legend>{question.multiOptions.map((option,index)=><label key={index}><input type="checkbox" checked={response.selections?.includes(index) ?? false} disabled={submitted} onChange={()=>setResponse(previous=>({...previous,selections:previous.selections?.includes(index)?previous.selections.filter(value=>value!==index):[...(previous.selections??[]),index]}))}/><span>{option}</span></label>)}</fieldset> : <label className="exam-written-label">{question.numericSequence ? (question.numericSequenceLabel ?? '전체 리스트를 쉼표 또는 공백으로 구분해 작성하세요.') : question.accepted ? '빈칸의 답을 작성하세요.' : '답안과 판단 근거를 작성하세요.'}{question.accepted || question.numericSequence ? <input className="exam-short-answer" value={response.text} disabled={submitted} autoComplete="off" spellCheck={false} onChange={event=>setResponse(previous=>({...previous,text:event.target.value}))}/> : <textarea className="exam-written-answer" rows={6} value={response.text} disabled={submitted} onChange={event=>setResponse(previous=>({...previous,text:event.target.value}))}/>}</label>)}
      {!submitted ? <button type="button" className="quiz-primary" disabled={!ready} onClick={submit}>제출하고 확인</button> : <div className="exam-feedback" data-result={auto ? correct ? 'correct' : 'incorrect' : undefined} role="status"><strong>{auto ? correct ? '정답입니다. 해결한 오답으로 옮겼습니다.' : '아직 틀렸어요. 해설을 확인하고 다시 도전하세요.' : '모범 답안과 비교한 뒤 복습 결과를 표시하세요.'}</strong><p style={{whiteSpace:'pre-wrap'}}>{question.answer}</p><p style={{whiteSpace:'pre-wrap'}}>{question.explanation}</p>{!auto ? <div className="mistake-card-actions"><button type="button" className="visual-button" disabled={response.review==='correct'} onClick={()=>mark('correct')}>이해했어요 · 복습 완료</button><button type="button" className="visual-button" disabled={response.review==='again'} onClick={()=>mark('again')}>다시 풀기 표시</button></div> : null}<button type="button" className="quiz-learn-link" onClick={()=>{setSubmitted(false);setResponse({text:''})}}>한 번 더 풀기</button></div>}
    </div> : null}
  </article>
}

export default function MistakeReview({ course, sources, onStart, renderQuestion, renderAnswer }: { course: CourseId; sources: ReviewSource[]; onStart: () => void; renderQuestion?: Renderer; renderAnswer?: AnswerRenderer }) {
  const [entries, setEntries] = useState(()=>collectMistakes(sources))
  const [status, setStatus] = useState<'open' | 'resolved' | 'all'>('open')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [active, setActive] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)
  const registry = useMemo(()=>new Map(sources.map(source=>[source.key,{source,questions:new Map(source.questions.map(question=>[question.id,question]))}])),[sources])
  useEffect(()=>{
    setFailed(!importExistingMistakes(sources)); setEntries(collectMistakes(sources))
    const refresh=()=>setEntries(collectMistakes(sources))
    window.addEventListener(mistakeChangeEvent,refresh); window.addEventListener('storage',refresh); window.addEventListener('focus',refresh)
    return()=>{window.removeEventListener(mistakeChangeEvent,refresh);window.removeEventListener('storage',refresh);window.removeEventListener('focus',refresh)}
  },[sources])
  const known = entries.filter(entry=>entry.course===course&&registry.get(entry.source)?.questions.has(entry.questionId))
  const open = known.filter(entry=>entry.status==='open').length
  const term = search.trim().toLocaleLowerCase()
  const visible = known.filter(entry=>(status==='all'||entry.status===status||entry.id===active)&&(sourceFilter==='all'||entry.source===sourceFilter)&&(!term||registry.get(entry.source)!.questions.get(entry.questionId)!.prompt.toLocaleLowerCase().includes(term))).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)||a.id.localeCompare(b.id))
  function save(source: ReviewSource, question: ReviewQuestion, response: ReviewResponse) {
    const saved=saveReviewResponse(source,question,response);setFailed(!saved);setEntries(collectMistakes(sources));return saved
  }
  return <section className="mistake-review" id="wrong-review"><div className="mistake-heading"><h2>오답 모음</h2><p>틀린 문제를 다시 풀고, 해결한 문제도 따로 확인하세요.</p></div>
    <div className="mistake-summary"><div><strong>{open}</strong><span>복습할 오답</span></div><div><strong>{known.length-open}</strong><span>해결한 오답</span></div><div><strong>{known.length}</strong><span>모아 둔 문제</span></div></div>
    <div className="mistake-filters"><label>복습 상태<select aria-label="복습 상태" value={status} onChange={event=>{setStatus(event.target.value as typeof status);setActive(null)}}><option value="open">복습할 오답</option><option value="resolved">해결한 오답</option><option value="all">전체 오답 기록</option></select></label><label>문제 분류<select aria-label="문제 분류" value={sourceFilter} onChange={event=>{setSourceFilter(event.target.value);setActive(null)}}><option value="all">전체 분류</option>{sources.filter(source=>known.some(entry=>entry.source===source.key)).map(source=><option key={source.key} value={source.key}>{source.label}</option>)}</select></label><label>문제 검색<input aria-label="문제 검색" type="search" placeholder="문제의 키워드" value={search} onChange={event=>{setSearch(event.target.value);setActive(null)}}/></label></div>
    <p className="mistake-save-note" role="status">{failed ? '저장 공간을 사용할 수 없어 일부 복습 결과가 저장되지 않았습니다.' : '이 브라우저의 기존 풀이와 연결됩니다. 복습 결과는 원래 문제의 답안에도 반영됩니다.'}</p><p className="mistake-save-note">서술형은 직접 ‘다시 풀기’로 표시한 문제를 모읍니다. SQL·Python 실행 오류처럼 정오를 판정하지 않는 실습은 자동 수집하지 않습니다.</p>
    {!known.length ? <div className="mistake-empty"><h3>아직 모인 오답이 없습니다.</h3><p>개념 문제나 시험 대비 문제를 풀면 틀린 문제가 여기에 모입니다.</p><button type="button" className="quiz-primary" onClick={onStart}>개념 문제 풀러 가기 →</button></div> : !visible.length ? <div className="mistake-empty"><h3>{status==='open'&&!open?'모아 둔 오답을 모두 해결했어요.':'선택한 조건에 맞는 문제가 없습니다.'}</h3><p>복습 상태나 분류를 바꾸어 다른 기록을 확인할 수 있습니다.</p></div> : <><p className="mistake-list-count">{visible.length}문제</p><div className="mistake-list">{visible.map(entry=>{const record=registry.get(entry.source)!;return <ReviewCard key={entry.id} entry={entry} source={record.source} question={record.questions.get(entry.questionId)!} active={active===entry.id} onOpen={()=>setActive(entry.id)} onClose={()=>setActive(null)} onSave={response=>save(record.source,record.questions.get(entry.questionId)!,response)} renderQuestion={renderQuestion} renderAnswer={renderAnswer}/>})}</div></>}
  </section>
}
