import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import ChoiceOptions from './ChoiceOptions'
import StructuredAnswer from './StructuredAnswer'
import { structuredAnswerReady } from '../quiz/structuredAnswers'
import type { StructuredQuestion } from '../quiz/structuredAnswers'
import { gradeResponse, recordMistake } from '../quiz/mistakeStorage'
import type { CourseId } from '../quiz/mistakeStorage'
export type PracticeQuestion=StructuredQuestion & {id:string;kind:string;prompt:string;answer:string;explanation:string;code?:string;options?:string[];correct?:number;accepted?:string[];graph?:string;sortVisual?:{method:'selection'|'insertion'|'quick'|'merge';values:number[]}}
export type AnswerInputProps={value:string;disabled:boolean;onChange:(value:string)=>void}

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
export default function ExamSession({questions,kinds,storageKey,renderQuestion,renderAnswer,reviewCourse,onOpenMistakes,title='시험 대비 · 힌트 없이 풀기',guide}:{title?:string;guide?:ReactNode;questions:PracticeQuestion[];kinds:Record<string,string>;storageKey:string;reviewCourse?:CourseId;onOpenMistakes?:()=>void;renderQuestion?:(question:PracticeQuestion)=>ReactNode;renderAnswer?:(question:PracticeQuestion,props:AnswerInputProps)=>ReactNode}) {
  const [progress,setProgress]=useState(()=>read(storageKey,questions,kinds))
  const [failed,setFailed]=useState(false)
  const [mistakeFailed,setMistakeFailed]=useState<string>()
  const items=questions.filter(q=>progress.kind==='all'||q.kind===progress.kind)
  const index=Math.min(progress.index,Math.max(0,items.length-1)),question=items[index]
  const response=progress.responses[question?.id]??{text:'',submitted:false}
  const completed=items.filter(q=>progress.responses[q.id]?.submitted).length
  useEffect(()=>{try{localStorage.setItem(storageKey,JSON.stringify(progress));setFailed(false)}catch{setFailed(true)}},[progress,storageKey])
  function update(change:Partial<Response>){
    if(!question)return
    if(reviewCourse&&(change.submitted===true||change.review!==undefined)){
      const next={...response,...change}
      const saved=recordMistake(storageKey,reviewCourse,question.id,next,gradeResponse(question,next))
      setMistakeFailed(saved?undefined:question.id)
    }
    setProgress(p=>({...p,responses:{...p.responses,[question.id]:{...(p.responses[question.id]??{text:'',submitted:false}),...change}}}))
  }
  function move(next:number){setProgress(p=>({...p,index:next}));requestAnimationFrame(()=>{const current=document.getElementById('exam-current-question');current?.focus({preventScroll:true});current?.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})})}
  const inputProps={value:response.text,disabled:response.submitted,onChange:(text:string)=>update({text})}
  const answerInput=question?(question.answerTable||question.answerFields?<StructuredAnswer question={question} {...inputProps}/>:renderAnswer?.(question,inputProps)):undefined
  const auto=question?.options!==undefined||question?.accepted!==undefined
  const correct=question?.options?response.choice===question.correct:question?.accepted?.some(answer=>normalize(answer)===normalize(response.text))
  return <section className="exam-session" id="exam-practice"><h2>{title}</h2><details className="exam-guide"><summary>풀이 안내</summary>{guide}<p>답안을 제출한 뒤 정답과 풀이를 확인하세요. 답안·제출 상태·현재 위치는 이 브라우저에 자동 저장됩니다.</p>{reviewCourse?<p>객관식·자동 채점 빈칸 문제는 틀리면 오답 모음에 자동 저장됩니다. 서술형은 모범 답안과 비교한 뒤 직접 추가하세요.</p>:null}<p>학습용 연습 문제입니다. 서술형은 모범 답안과 풀이 기준으로 직접 비교합니다.</p></details>{failed?<p className="python-note" role="alert">저장을 사용할 수 없어 현재 화면에서만 풀이가 유지됩니다.</p>:null}<div className="quiz-filter-options exam-kind-filter" aria-label="문제 유형"><button aria-pressed={progress.kind==='all'} onClick={()=>setProgress(p=>({...p,kind:'all',index:0}))}>전체 {questions.length}문제</button>{Object.entries(kinds).map(([kind,label])=><button key={kind} aria-pressed={progress.kind===kind} onClick={()=>setProgress(p=>({...p,kind,index:0}))}>{label} · {questions.filter(q=>q.kind===kind).length}</button>)}</div><div className="exam-progress"><span>제출 {completed} / {items.length}</span><progress value={completed} max={items.length||1} aria-label="제출 진행도"/></div><div className="exam-number-nav" aria-label="문제 바로가기">{items.map((q,i)=><button key={q.id} aria-current={i===index?'step':undefined} aria-label={`${i+1}번${progress.responses[q.id]?.submitted?', 제출 완료':''}`} onClick={()=>move(i)}>{i+1}{progress.responses[q.id]?.review==='again'?' ↻':progress.responses[q.id]?.submitted?' ✓':''}</button>)}</div>{question?<><article className="exam-question content-enter" id="exam-current-question" tabIndex={-1} aria-label={`${index+1}번 문제`} key={question.id}><span className="course-tag">{kinds[question.kind]} · {index+1} / {items.length}</span><h3>{question.prompt}</h3>{renderQuestion?.(question)}{question.code?<pre className="python-output exam-code"><code>{question.code}</code></pre>:null}{answerInput ?? (question.options?<ChoiceOptions options={question.options} value={response.choice} disabled={response.submitted} correctIndex={question.correct} revealed={response.submitted} onChange={choice=>update({choice})}/>:<label className="exam-written-label">{question.kind==='traversal'?'방문한 노드를 순서대로 작성하세요. (예: A B C)':(question.kind==='analysis'||question.kind==='substitution')?'풀이 과정과 시간 복잡도를 작성하세요.':question.kind==='blank'?(question.accepted?'빈칸에 들어갈 답을 작성하세요.':'빈칸 번호 순서대로 답을 작성하세요.'):'답안과 판단 근거를 작성하세요.'}{question.accepted?<input autoComplete="off" autoCapitalize="none" spellCheck={false} aria-invalid={response.submitted&&!correct?true:undefined} className="exam-short-answer" value={response.text} disabled={response.submitted} onChange={e=>update({text:e.target.value})}/>:<textarea className="exam-written-answer" rows={(question.kind==='analysis'||question.kind==='substitution')?8:5} value={response.text} disabled={response.submitted} onChange={e=>update({text:e.target.value})}/>}</label>)}{!response.submitted?<button className="quiz-primary" disabled={question.options?response.choice===undefined:!structuredAnswerReady(question,response.text)} onClick={()=>update({submitted:true})}>제출하고 답안 확인</button>:<div className="exam-feedback" data-result={auto?(correct?'correct':'incorrect'):response.review==='again'?'incorrect':response.review==='correct'?'correct':undefined} role="status"><strong>{auto?(correct?'정답입니다.':'정답을 확인해 보세요.'):'모범 답안 · 풀이를 비교해 보세요.'}</strong>{question.answerTable?<StructuredAnswer question={question} value={question.accepted?.[0]??''} disabled onChange={()=>{}} solution/>:<p style={{whiteSpace:'pre-wrap'}}>{question.answer}</p>}<p style={{whiteSpace:'pre-wrap'}}>풀이·채점 기준: {question.explanation}</p>{!auto?<div className="algo-controls"><button aria-pressed={response.review==='correct'} onClick={()=>update({review:'correct'})}>이해했어요</button><button aria-pressed={response.review==='again'} disabled={response.review==='again'&&mistakeFailed!==question.id} onClick={()=>update({review:'again'})}>{reviewCourse?(response.review==='again'&&mistakeFailed!==question.id?'오답 모음에 추가됨':'오답 모음에 추가'):'다시 풀기 표시'}</button></div>:null}{reviewCourse&&(auto&&!correct||response.review==='again')?<div className="exam-review-link"><p className="python-note">{mistakeFailed===question.id?'오답 기록을 저장하지 못했습니다. 브라우저 저장 공간을 확인한 뒤 다시 시도하세요.':'오답 모음에서 이 문제를 다시 풀 수 있어요.'}</p>{mistakeFailed===question.id?<button onClick={()=>update(auto?{submitted:true}:{review:'again'})}>오답 저장 다시 시도</button>:null}{onOpenMistakes?<button className="quiz-learn-link" onClick={onOpenMistakes}>오답 모음 보기 →</button>:null}</div>:null}<button className="quiz-learn-link" onClick={()=>update({submitted:false,review:undefined})}>답안 수정하기</button></div>}</article><div className="exam-pager"><button disabled={index===0} onClick={()=>move(index-1)}>← 이전 문제</button><span>{index+1} / {items.length}</span><button disabled={index===items.length-1} onClick={()=>move(index+1)}>다음 문제 →</button></div></>:<p>이 유형의 문제가 없습니다.</p>}</section>
}
