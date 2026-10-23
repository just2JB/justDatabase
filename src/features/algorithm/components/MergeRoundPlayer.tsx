import { useMemo, useState } from 'react'
import StepControls from '../../../shared/components/StepControls'
import { ArrayDiagram } from './AlgorithmDiagrams'
import { mergePracticeTrace } from '../data/mergePracticeTrace'

export default function MergeRoundPlayer({ values }: { values: number[] }) {
  const frames=useMemo(()=>mergePracticeTrace(values),[values])
  const [step,setStep]=useState(0)
  const frame=frames[step]
  return <div className="algo-visual mock-sort-player">
    <h4>병합 정렬 · 왼쪽부터 분할하고 작은 값부터 합치기</h4>
    <StepControls step={step} count={frames.length} onChange={setStep}/>
    <div className="algo-controls mock-sort-rounds" role="group" aria-label="병합 결과 바로가기"><button type="button" aria-pressed={step===0} onClick={()=>setStep(0)}>입력 배열</button>{frames.map((item,index)=>item.done?<button type="button" key={index} aria-pressed={step===index} onClick={()=>setStep(index)}>{item.round}회 병합 결과</button>:null)}</div>
    <div className="merge-status" role="status" data-round={frame.round} data-completed={frame.done}><strong>{frame.round ? `${frame.round}회 병합 · ${frame.done?'표에 적을 결과':'진행 중'}` : '정렬 전'}</strong><p>{frame.text}</p></div>
    <ArrayDiagram values={frame.values} range={frame.range}/>
    <div className="merge-practice-parts"><p><strong>왼쪽 남은 값</strong>[{frame.left.join(', ')}]</p><p><strong>오른쪽 남은 값</strong>[{frame.right.join(', ')}]</p><p><strong>현재 병합 결과</strong>[{frame.merged.join(', ')}]</p></div>
    <p className="mock-sort-array">현재 전체 배열: <strong>[{frame.values.join(', ')}]</strong></p>
  </div>
}
