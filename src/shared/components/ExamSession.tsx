import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import ChoiceOptions from './ChoiceOptions'
import { gradeResponse, recordMistake } from '../quiz/mistakeStorage'
import type { CourseId } from '../quiz/mistakeStorage'
export type PracticeQuestion={id:string;kind:string;prompt:string;answer:string;explanation:string;code?:string;options?:string[];correct?:number;accepted?:string[];graph?:string}
type Response={text:string;choice?:number;submitted:boolean;review?:'correct'|'again'}
type Progress={kind:string;index:number;responses:Record<string,Response>}
function read(key:string,questions:PracticeQuestion[],kinds:Record<string,string>):Progress {
  const fallback={kind:'all',index:0,responses:{}}
  try {
    const value=JSON.parse(localStorage.getItem(key)??'null') as Partial<Progress>|null
    if(!value||typeof value!=='object')return fallback
    const responses:Record<string,Response>={}
    if(value.responses&&typeof value.responses==='object')for(const [id,response] of Object.entries(value.responses)){
      const q=questions.find(item=>item.id===id)
      if(!q||!response||typeof response.text!=='string'||typeof response.submitted!=='boolean')continue
      const choice=typeof response.choice==='number'&&Number.isInteger(response.choice)&&response.choice>=0&&response.choice<(q.options?.length??0)?response.choice:undefined
      responses[id]={text:response.text,choice,submitted:response.submitted&&(!q.options||choice!==undefined),review:response.review==='correct'||response.review==='again'?response.review:undefined}
    }
    return {kind:typeof value.kind==='string'&&(value.kind==='all'||Object.hasOwn(kinds,value.kind))?value.kind:'all',index:typeof value.index==='number'&&Number.isInteger(value.index)&&value.index>=0?value.index:0,responses}
  }catch{return fallback}
}
const normalize=(text:string)=>text.trim().toLocaleLowerCase().replace(/\s+/g,'')
export default function ExamSession({questions,kinds,storageKey,renderQuestion,reviewCourse}:{questions:PracticeQuestion[];kinds:Record<string,string>;storageKey:string;reviewCourse?:CourseId;renderQuestion?:(question:PracticeQuestion)=>ReactNode}) {
  const [progress,setProgress]=useState(()=>read(storageKey,questions,kinds))
  const [failed,setFailed]=useState(false)
  const items=questions.filter(q=>progress.kind==='all'||q.kind===progress.kind)
  const index=Math.min(progress.index,Math.max(0,items.length-1)),question=items[index]
  const response=progress.responses[question?.id]??{text:'',submitted:false}
  const completed=items.filter(q=>progress.responses[q.id]?.submitted).length
  useEffect(()=>{try{localStorage.setItem(storageKey,JSON.stringify(progress));setFailed(false)}catch{setFailed(true)}},[progress,storageKey])
  function update(change:Partial<Response>){if(!question)return;if(reviewCourse&&(change.submitted===true||change.review!==undefined)){const next={...response,...change};recordMistake(storageKey,reviewCourse,question.id,next,gradeResponse(question,next))}setProgress(p=>({...p,responses:{...p.responses,[question.id]:{...(p.responses[question.id]??{text:'',submitted:false}),...change}}}))}
  function move(next:number){setProgress(p=>({...p,index:next}));requestAnimationFrame(()=>document.getElementById('exam-current-question')?.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}))}
  const auto=question?.options!==undefined||question?.accepted!==undefined
  const correct=question?.options?response.choice===question.correct:question?.accepted?.some(answer=>normalize(answer)===normalize(response.text))
  return <section className="exam-session" id="exam-practice"><h2>시험 대비 · 힌트 없이 풀기</h2><p>답안을 제출한 뒤 정답과 풀이를 확인하세요.</p><div className="quiz-filter-options exam-kind-filter" aria-label="문제 유형"><button aria-pressed={progress.kind==='all'} onClick={()=>setProgress(p=>({...p,kind:'all',index:0}))}>전체 {questions.length}문제</button>{Object.entries(kinds).map(([kind,label])=><button key={kind} aria-pressed={progress.kind===kind} onClick={()=>setProgress(p=>({...p,kind,index:0}))}>{label} · {questions.filter(q=>q.kind===kind).length}</button>)}</div><p className="python-note" role="status">{failed?'저장을 사용할 수 없어 현재 화면에서만 풀이가 유지됩니다.':'답안·제출 상태·현재 위치를 이 브라우저에 자동 저장합니다.'}</p><p>제출 {completed} / {items.length}</p><progress value={completed} max={items.length||1} aria-label="제출 진행도"/><div className="exam-number-nav" aria-label="문제 바로가기">{items.map((q,i)=><button key={q.id} aria-current={i===index?'step':undefined} aria-label={`${i+1}번${progress.responses[q.id]?.submitted?', 제출 완료':''}`} onClick={()=>move(i)}>{i+1}{progress.responses[q.id]?.review==='again'?' ↻':progress.responses[q.id]?.submitted?' ✓':''}</button>)}</div>{question?<><article className="exam-question content-enter" id="exam-current-question" key={question.id}><span className="course-tag">{kinds[question.kind]} · {index+1} / {items.length}</span><h3>{question.prompt}</h3>{renderQuestion?.(question)}{question.code?<pre className="python-output exam-code"><code>{question.code}</code></pre>:null}{question.options?<ChoiceOptions options={question.options} value={response.choice} disabled={response.submitted} correctIndex={question.correct} revealed={response.submitted} onChange={choice=>update({choice})}/>:<label className="exam-written-label">{question.kind==='analysis'?'풀이 과정과 시간 복잡도를 작성하세요.':question.kind==='blank'?(question.accepted?'빈칸에 들어갈 답을 작성하세요.':'빈칸 번호 순서대로 답을 작성하세요.'):'답안과 판단 근거를 작성하세요.'}{question.accepted?<input autoComplete="off" autoCapitalize="none" spellCheck={false} aria-invalid={response.submitted&&!correct?true:undefined} className="exam-short-answer" value={response.text} disabled={response.submitted} onChange={e=>update({text:e.target.value})}/>:<textarea className="exam-written-answer" rows={question.kind==='analysis'?8:5} value={response.text} disabled={response.submitted} onChange={e=>update({text:e.target.value})}/>}</label>}{!response.submitted?<button className="quiz-primary" disabled={question.options?response.choice===undefined:!response.text.trim()} onClick={()=>update({submitted:true})}>제출하고 답안 확인</button>:<div className="exam-feedback" data-result={auto?(correct?'correct':'incorrect'):undefined} role="status"><strong>{auto?(correct?'정답입니다.':'정답을 확인해 보세요.'):'모범 답안 · 풀이를 비교해 보세요.'}</strong><p style={{whiteSpace:'pre-wrap'}}>{question.answer}</p><p style={{whiteSpace:'pre-wrap'}}>풀이·채점 기준: {question.explanation}</p>{!auto?<div className="algo-controls"><button aria-pressed={response.review==='correct'} onClick={()=>update({review:'correct'})}>이해했어요</button><button aria-pressed={response.review==='again'} onClick={()=>update({review:'again'})}>다시 풀기 표시</button></div>:null}<button className="quiz-learn-link" onClick={()=>update({submitted:false,review:undefined})}>답안 수정하기</button></div>}</article><div className="exam-pager"><button disabled={index===0} onClick={()=>move(index-1)}>← 이전 문제</button><span>{index+1} / {items.length}</span><button disabled={index===items.length-1} onClick={()=>move(index+1)}>다음 문제 →</button></div></>:<p>이 유형의 문제가 없습니다.</p>}<p className="python-note">학습용 연습 문제입니다. 서술형은 모범 답안과 풀이 기준으로 직접 비교합니다.</p></section>
}
