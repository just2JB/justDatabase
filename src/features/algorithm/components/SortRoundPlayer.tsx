import { useMemo, useState } from 'react'
import StepControls from '../../../shared/components/StepControls'
import { ArrayDiagram } from './AlgorithmDiagrams'
import QuickSortVisual from './QuickSortVisual'
import { sortPracticeTrace } from '../data/sortPracticeTrace'

export default function SortRoundPlayer({ method, values }: { method: 'selection'|'insertion'|'quick'; values: number[] }) {
  return method === 'quick' ? <QuickSortVisual initialValues={values} practice showCode={false}/> : <SimpleSortPlayer method={method} values={values}/>
}

function SimpleSortPlayer({ method, values }: { method: 'selection'|'insertion'; values: number[] }) {
  const frames = useMemo(() => sortPracticeTrace(values, method), [values, method])
  const [step, setStep] = useState(0)
  const frame = frames[step]
  return <div className="algo-visual mock-sort-player">
    <h4>{method === 'selection' ? '선택 정렬 · 최솟값을 찾아 교환' : '삽입 정렬 · key보다 큰 값을 밀고 삽입'}</h4>
    <StepControls step={step} count={frames.length} onChange={setStep}/>
    <div className="algo-controls mock-sort-rounds" role="group" aria-label="회전 결과 바로가기"><button type="button" aria-pressed={step===0} onClick={()=>setStep(0)}>입력 배열</button>{frames.map((item, index) => item.done ? <button type="button" key={index} aria-pressed={step===index} onClick={()=>setStep(index)}>{item.round}회전 결과</button> : null)}</div>
    <div className="merge-status" role="status" data-round={frame.round} data-completed={frame.done}><strong>{frame.round ? `${frame.round}회전 · ${frame.done ? '표에 적을 결과' : '진행 중'}` : '정렬 전'}</strong><p>{frame.text}</p></div>
    <ArrayDiagram values={frame.values} focus={frame.focus} fixed={frame.fixed} held={frame.held} move={frame.move}/>
    <p className="mock-sort-array">현재 전체 배열: <strong>[{frame.values.join(', ')}]</strong></p>
    <p>파랑: 비교·이동하는 원소 · 초록: 정렬을 마친 앞 구간 · 숫자 아래: 0부터 시작하는 인덱스</p>
  </div>
}
