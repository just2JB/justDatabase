import { useState } from 'react'
import { useDiagramMotion } from '../../../shared/hooks/useDiagramMotion'
import StepControls from '../../../shared/components/StepControls'
import { sequentialValues, matchingText, matchingPattern, closestPoints } from '../data/searchExamples'

export default function BruteForceExamples({kind}:{kind:'sequential'|'matching'|'closest'}) {
  const [step,setStep]=useState(0)
  const [target,setTarget]=useState(42)
  const motion=useDiagramMotion(kind+target+step)
  const points=closestPoints
  const pairs=points.flatMap((_,i)=>points.slice(i+1).map((__,j)=>[i,i+j+1]))
  const found=sequentialValues.indexOf(target)
  const limit=kind==='sequential'?(found<0?sequentialValues.length-1:found):kind==='matching'?matchingText.indexOf(matchingPattern):pairs.length-1
  const [a,b]=pairs[Math.min(step,pairs.length-1)]
  const distance=(i:number,j:number)=>Math.hypot(points[i].x-points[j].x,points[i].y-points[j].y)
  const minimum=Math.min(...pairs.slice(0,step+1).map(([i,j])=>distance(i,j)))
  return <div ref={motion} className="algo-visual search-motion-visual"><h3>{kind==='sequential'?`12개 항목에서 ${target} 찾기`:kind==='matching'?'긴 텍스트에서 반복되는 패턴 비교':'8개 점의 모든 28쌍 비교'}</h3>
    {kind==='sequential'?<><div className="algo-controls">{[34,42,85,100].map(value=><button key={value} aria-pressed={target===value} onClick={()=>{setTarget(value);setStep(0)}}>{value} 찾기{value===100?' · 없음':''}</button>)}</div><div className="search-array">{sequentialValues.map((value,i)=><span className={i===step?'current':i<step?'compared':''} key={i}>{i===step?<i data-motion-id="search-cursor" className="search-cursor" aria-hidden="true">↓</i>:null}<b>{value}</b><small>[{i}]</small></span>)}</div><p role="status">비교 {step+1}회 · {sequentialValues[step]} {sequentialValues[step]===target?'=':'≠'} {target} · {step===limit?(found<0?'전체 확인 후 −1 반환':`인덱스 ${found} 반환`):'다음 항목으로 이동'}</p><p>같은 리스트에서 첫 항목·중간·마지막·탐색 실패를 비교해 보세요.</p></>:null}
    {kind==='matching'?<><div className="matching-example"><div>{matchingText.split('').map((c,i)=><span key={i}>{c}<small>{i}</small></span>)}</div><div data-motion-id="pattern" className="moving-pattern" style={{marginLeft:step*46}}>{matchingPattern.split('').map((c,i)=><span key={i} className={matchingText[step+i]===c?'match':'mismatch'}>{c}</span>)}</div></div><p role="status">시작 위치 {step} · {step===limit?`패턴 전체 일치 → 인덱스 ${limit} 반환`:'처음 불일치한 문자에서 비교를 멈추고 한 칸 이동합니다.'}</p><p>T의 길이 {matchingText.length}, P의 길이 {matchingPattern.length}. 색은 현재 위치의 문자 대응이며 실제 비교는 첫 불일치에서 끝납니다.</p></>:null}
    {kind==='closest'?<><svg className="closest-example-graph" viewBox="0 0 520 440" role="img" aria-label={`${points[a].name}와 ${points[b].name} 비교`}><path d="M35 20V400H505" fill="none" stroke="#bac8d7"/><line className="moving-pair" x1={points[a].x*48+35} y1={400-points[a].y*42} x2={points[b].x*48+35} y2={400-points[b].y*42} stroke="#2563eb" strokeWidth="3"/>{points.map(p=><g key={p.name}><circle cx={p.x*48+35} cy={400-p.y*42} r={p===points[a]||p===points[b]?10:7} fill={p===points[a]||p===points[b]?"#2563eb":"#28775c"}/><text x={p.x*48+44} y={400-p.y*42-10} fontSize="12">{p.name}({p.x},{p.y})</text></g>)}</svg><p role="status">{points[a].name}·{points[b].name} 거리 {distance(a,b).toFixed(3)} · 지금까지 최소 {minimum.toFixed(3)}</p><p>{step===limit?'전체 28쌍 확인 완료: 최근접 쌍 A·B, 거리 √2 ≈ 1.414':'서로 다른 점을 한 쌍씩 비교합니다. 총 8×7÷2=28쌍입니다.'}</p></>:null}
    <StepControls key={kind+target} step={step} count={limit+1} onChange={setStep}/>
  </div>
}
