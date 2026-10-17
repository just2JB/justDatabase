import { useMemo, useState } from 'react'
import { quickSortTrace, quickPartitionCode } from '../data/quickSortTrace'
import { motionValueId, useDiagramMotion } from '../../../shared/hooks/useDiagramMotion'
import StepControls from '../../../shared/components/StepControls'

const initial = [347,182,591,264,438,125,763,306]
export default function QuickSortVisual({ initialValues }: { initialValues?: number[]; practice?: boolean }) {
  const [values,setValues]=useState(initialValues ?? initial)
  const [step,setStep]=useState(0)
  const motion=useDiagramMotion(values.join(',')+':'+step)
  const frames=useMemo(()=>quickSortTrace(values),[values]), frame=frames[step]
  const max=Math.max(...values)
  const split=[...frame.splits].reverse().find(item=>item.low===frame.low && item.high===frame.high)
  return <><div className="algo-visual quick-sort-visual"><h3>{values.length}개 원소 · 양방향 포인터로 분할</h3>
    <StepControls step={step} count={frames.length} onChange={setStep}/>
    <div className="algo-controls"><button onClick={()=>{setValues(Array.from({length:8},()=>100+Math.floor(Math.random()*900)));setStep(0)}}>새 랜덤 숫자</button></div>
    <div className="merge-status" role="status"><strong>{frame.pivot>=0?`피벗 ${frame.values[frame.pivot]} · 처리 구간 [${frame.low}, ${frame.high}]`:'위치 확정'}</strong><p>{frame.text}{frame.scanLow !== undefined ? ` · low=${frame.scanLow}, high=${frame.scanHigh}` : ""}</p></div>
    <div ref={motion} className="diagram-motion-stage"><svg className="quick-sort-chart" viewBox={`0 0 ${values.length*78+16} 310`} role="img" aria-label={`현재 리스트 ${frame.values.join(', ')}. ${frame.text}`}>
      <rect className="motion-range" x={frame.low*78+9} y="24" width={(frame.high-frame.low+1)*78-10} height="204" rx="9" fill="#eff5ff" stroke="#7398d2" strokeDasharray="5 4"/>
      {split ? <><line x1={split.at*78+12} y1="24" x2={split.at*78+12} y2="228" stroke="#8b5cc7" strokeWidth="3"/><line x1={(split.at+1)*78+12} y1="24" x2={(split.at+1)*78+12} y2="228" stroke="#8b5cc7" strokeWidth="3"/></> : null}
      <line x1="10" y1="225" x2={values.length*78+6} y2="225" stroke="#bdcbd7"/>
      {frame.values.map((value,i)=>{
        const height=value/max*155
        const fill=i===frame.pivot?'#8b5cc7':frame.swapped?.includes(i)?'#dc8b34':frame.fixed.includes(i)?'#28775c':i===frame.compare?'#dc8b34':'#6c96d4'
        const id=motionValueId(frame.values,i)
        return <g key={id} data-motion-id={id} data-motion-arc="true" className="motion-value" opacity={(i < frame.low || i > frame.high) ? 0.35 : 1}><rect x={i*78+19} y={225-height} width="48" height={height} fill={fill} rx="5"/><text x={i*78+43} y={215-height} textAnchor="middle" fontSize="15">{value}</text></g>
      })}
      {frame.values.map((_,i)=><text key={i} x={i*78+43} y="246" textAnchor="middle" fontSize="12" fill="#718096">{i}</text>)}
      {frame.pivot>=0?<g data-motion-id="pivot-label"><text x={frame.pivot*78+43} y="265" textAnchor="middle" fontSize="11" fill="#7541ad">피벗</text></g>:null}
      {frame.scanLow!==undefined&&frame.scanLow<values.length?<g data-motion-id="low-pointer"><path d={`M${frame.scanLow*78+37} 273l6 -7 6 7`} fill="#b5671b"/><text x={frame.scanLow*78+43} y="288" textAnchor="middle" fontSize="12" fill="#b5671b">low</text></g>:null}
      {frame.scanHigh!==undefined?<g data-motion-id="high-pointer"><text x={frame.scanHigh*78+43} y={frame.scanHigh===frame.scanLow?304:288} textAnchor="middle" fontSize="12" fill="#a55396">high</text></g>:null}
    </svg></div>
    <div className="quick-partition"><strong>현재 구간의 분할</strong>{split ? <div className="quick-split-row"><span>왼쪽 ≤ {split.value}<b>[{split.left.join(', ') || '비어 있음'}]</b></span><span className="quick-pivot">확정<b>{split.value}</b></span><span>오른쪽 ≥ {split.value}<b>[{split.right.join(', ') || '비어 있음'}]</b></span></div> : <p>구간 [{frame.low}, {frame.high}]을 분할 중입니다. 피벗 확정 후 양쪽 구간을 표시합니다.</p>}</div>
    <div className="quick-split-history"><strong>분할 기록 · 들여쓰기는 재귀 깊이</strong>{frame.splits.length ? frame.splits.map((item,i)=><div key={i} style={{paddingLeft:12+item.depth*14}} className={item===split?'active motion-reveal':'motion-reveal'}><small>구간 [{item.low}, {item.high}]</small><span>[{item.left.join(', ') || '비어 있음'}] ← <b>{item.value} 확정</b> → [{item.right.join(', ') || '비어 있음'}]</span></div>) : <p>첫 피벗이 확정되면 분할 기록이 나타납니다.</p>}</div>
    <p className="merge-key">보라: 피벗 · 주황: 비교/교환 · 초록: 확정 · 흐림: 현재 구간 밖</p><p>교환하는 막대가 자리를 옮깁니다. 자동 재생 속도를 바꾸거나 한 단계씩 살펴보세요.</p>
  </div><h3>Python 코드 · 고정 예시 입력</h3><pre className="python-output"><code>{quickPartitionCode + "\n\nA = [" + values.join(", ") + "]\nquick_sort(A, 0, len(A) - 1)\nprint(A)"}</code></pre></>
}
