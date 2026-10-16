import { useState } from 'react'

const initial = [4, 2, 5, 1, 3]
export default function SelectionStrategyVisual() {
  const [step, setStep] = useState(0)
  const remaining = [...initial]
  const result: number[] = []
  const inPlace = [...initial]
  for (let i = 0; i < step; i++) {
    const smallest = remaining.indexOf(Math.min(...remaining))
    result.push(remaining.splice(smallest, 1)[0])
    let least = i
    for (let j = i + 1; j < inPlace.length; j++) if (inPlace[j] < inPlace[least]) least = j
    ;[inPlace[i], inPlace[least]] = [inPlace[least], inPlace[i]]
  }
  const cells = (values: number[], fixed = 0) => <div className="selection-bars" role="img" aria-label={values.length ? `왼쪽부터 ${values.join(', ')}. 앞 ${fixed}개 정렬 완료` : '빈 리스트'}>{values.length ? values.map((value, i) => <div key={i} className={`selection-bar-column ${i < fixed ? 'fixed' : ''}`}><span className="selection-bar" style={{ height: `${value * 24}px` }}><b>{value}</b></span><small>{i}</small></div>) : <span className="selection-bars-empty">비어 있음</span>}</div>
  return <div className="algo-visual"><h3>최솟값을 옮길까, 제자리에서 교환할까?</h3><div className="algo-concept-grid"><article><h3>별도 리스트에 저장</h3><p>입력 리스트</p>{cells(remaining)}<p>↓ 최솟값을 꺼내 결과 뒤에 저장</p>{cells(result, result.length)}<p>결과를 담을 추가 공간: O(n)</p></article><article><h3>원래 리스트에서 교환</h3><p>초록은 정렬이 끝난 구간</p>{cells(inPlace, step)}<p>최솟값을 아직 정렬되지 않은 구간의 첫 항목과 교환합니다.</p><p>교환을 위한 추가 공간: O(1)</p></article></div><p aria-live="polite">{step === 0 ? '같은 입력에서 시작합니다.' : `${step}개 항목의 자리가 확정되었습니다.`}</p><div className="algo-controls"><button disabled={step === 0} onClick={() => setStep(step - 1)}>← 이전</button><span>{step} / {initial.length}</span><button disabled={step === initial.length} onClick={() => setStep(step + 1)}>다음 →</button><button onClick={() => setStep(0)}>처음</button></div></div>
}
