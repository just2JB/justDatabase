import { useEffect, useState } from 'react'
import QuickSortVisual from './QuickSortVisual'
import { quickSortTrace, quickPartitionCode } from '../data/quickSortTrace'

const problems = [[5,3,8,4,9,1,6,2,7],[7,2,9,4,1,8,3,6,5],[4,8,2,7,1,6,3,5],[6,1,8,3,7,2,5,4],[347,182,591,264,438,125,763,306],[45,12,23,50,18,25,40,30,27,35],[29,10,14,37,13,18,30,28,20,25]]
function getRounds(input:number[]) {
  return quickSortTrace(input).filter(frame => frame.partitionDone).map(frame => ({pivot:frame.values[frame.pivot],low:frame.low,high:frame.high,at:frame.pivot,values:frame.values}))
}
const key='justStudy.algorithm.quickRounds.bidirectional.v2'
function readAnswers():Record<string,string> {
  try { const value:unknown=JSON.parse(localStorage.getItem(key)??'{}');return value && typeof value==='object' && !Array.isArray(value)?Object.fromEntries(Object.entries(value).filter(([,answer])=>typeof answer==='string')):{} }catch{return {}}
}
export default function QuickSortPractice() {
  const [selected,setSelected]=useState(0)
  const [answers,setAnswers]=useState(readAnswers)
  const [checked,setChecked]=useState(false)
  const [revealed,setRevealed]=useState(false)
  const [failed,setFailed]=useState(false)
  const [showVisual,setShowVisual]=useState(false)
  const input=problems[selected], rounds=getRounds(input)
  useEffect(()=>{try{localStorage.setItem(key,JSON.stringify(answers));setFailed(false)}catch{setFailed(true)}},[answers])
  function matches(answer:string,expected:number[]){const tokens=answer.replace(/[\[\]]/g,'').trim().split(/[\s,]+/);return tokens.length===expected.length && tokens.every((token,i)=>token!=='' && Number(token)===expected[i])}
  return <section id="quick-round-practice"><h2>퀵 정렬 · 회전별 리스트 쓰기</h2><p>각 회전에서 피벗의 위치가 확정된 직후, <strong>전체 리스트</strong>를 표에 적으세요.</p><div className="algo-controls">{problems.map((_,i)=><button key={i} aria-pressed={selected===i} onClick={()=>{setSelected(i);setChecked(false);setRevealed(false);setShowVisual(false)}}>문제 {i+1}</button>)}<a href="?course=algorithm&topic=divide#divide-quick">퀵 정렬 설명·시각화 바로가기 →</a></div><div className="algo-caution"><strong>풀이 규칙</strong><p>현재 구간의 첫 원소를 피벗으로 선택합니다. low=left+1, high=right로 시작합니다. low는 피벗 이상인 값에서, high는 피벗 이하인 값에서 멈춥니다. low&lt;high이면 교환 후 양쪽 포인터를 이동합니다. 만나거나 엇갈리면 반복을 끝내고 첫 원소와 A[high]를 교환합니다. 왼쪽 구간부터 재귀적으로 처리하며, 원소가 1개 이하인 구간은 회전에 포함하지 않습니다.</p><p>분할 방식에 따라 중간 결과가 달라지므로 아래 기준 코드를 사용하세요.</p><details><summary>기준 분할 코드 보기</summary><pre className="python-output"><code>{quickPartitionCode}</code></pre></details></div><p><strong>입력: [{input.join(', ')}]</strong> · 총 {rounds.length}회 분할</p><div className="algo-controls"><button type="button" aria-expanded={showVisual} aria-controls="question-quick-visual" onClick={()=>setShowVisual(!showVisual)}>{showVisual?"시각화 접기":"이 문제 시각화 보기"}</button></div>{showVisual?<div id="question-quick-visual" className="content-enter"><QuickSortVisual key={selected} initialValues={input} practice /></div>:null}<div className="table-wrap"><table className="quick-practice-table quick-cell-table"><caption>각 칸에 숫자 하나씩 입력하세요.</caption><thead><tr><th>회전</th>{input.map((_,j)=><th key={j}>[{j}]</th>)}<th>확인</th></tr></thead><tbody><tr><th>초기 상태</th>{input.map((v,j)=><td key={j}>{v}</td>)}<td>—</td></tr>{rounds.map((round,i)=>{const id=`${selected}-${i}`,answer=answers[id]??'',cells=answer.replace(/[\[\]]/g,'').trim().split(/[\s,]+/),correct=matches(answer,round.values);return <tr key={id}><th>{i+1}회전</th>{input.map((_,j)=><td key={j}><input inputMode="numeric" aria-label={`${i+1}회전 인덱스 ${j}`} value={cells[j]==='_'?'':cells[j]??''} onChange={event=>{const next=Array.from({length:input.length},(_,k)=>cells[k]||'_');next[j]=event.target.value.replace(/[^0-9-]/g,'')||'_';setAnswers(previous=>({...previous,[id]:next.join(', ')}));setChecked(false)}}/>{revealed?<span className="quick-cell-answer">{round.values[j]}</span>:null}</td>)}<td>{checked?(correct?'정답 ✓':answer.replace(/[_ ,]/g,'')?'다시 확인':'미작성'):'—'}</td></tr>})}</tbody></table></div><div className="algo-controls"><button onClick={()=>setChecked(true)}>답안 확인</button><button onClick={()=>setRevealed(!revealed)}>{revealed?'모범 답안 접기':'모범 답안 보기'}</button><button onClick={()=>{setAnswers(previous=>Object.fromEntries(Object.entries(previous).filter(([id])=>!id.startsWith(`${selected}-`))));setChecked(false);setRevealed(false)}}>이 문제 초기화</button></div>{checked?<p role="status">정답 {rounds.filter((round,i)=>matches(answers[`${selected}-${i}`]??'',round.values)).length} / {rounds.length}회전</p>:null}<p className="python-note" role="status">{failed?'저장 공간을 사용할 수 없어 현재 화면에서만 답안이 유지됩니다.':'작성한 답안은 이 브라우저에 문제별로 자동 저장됩니다.'}</p></section>
}
