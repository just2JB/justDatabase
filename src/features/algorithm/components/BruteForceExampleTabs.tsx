import { useState } from 'react'
import BruteForceExamples from './BruteForceExamples'
import SelectionStrategyVisual from './SelectionStrategyVisual'
import { bruteForceExampleCode, bruteForceExampleDescriptions } from '../data/bruteForceExampleCode'

const examples = [
  { id: 'selection', title: '선택 정렬', indices: [3, 4, 5, 6, 7, 8] },
  { id: 'sequential', title: '순차 탐색', indices: [9, 10] },
  { id: 'matching', title: '문자열 탐색', indices: [11, 12] },
  { id: 'closest', title: '최근접 쌍', indices: [13, 14] },
] as const

export default function BruteForceExampleTabs() {
  const [index, setIndex] = useState(() => {
    const concept = Number(location.hash.replace('#brute-force-', ''))
    const found = examples.findIndex(item => item.indices.some(value => value === concept) || location.hash.includes(item.id))
    return found < 0 ? 0 : found
  })
  const current = examples[index]
  return <div className="brute-example-tabs">
    <div className="algo-controls" role="tablist" aria-label="억지 기법 예시">{examples.map((item, i) => <button type="button" role="tab" id={`example-tab-${item.id}`} aria-controls="brute-example-panel" aria-selected={index === i} aria-pressed={index === i} key={item.id} onClick={() => setIndex(i)}>{item.title}</button>)}</div>
    <div id="brute-example-panel" role="tabpanel" aria-labelledby={`example-tab-${current.id}`} className="content-enter" key={current.id}><div className="brute-example-description">{bruteForceExampleDescriptions[current.id].map(([title, text], i) => <article key={title}><h3>{title}</h3>{current.indices.filter((_, position) => position % 3 === i).map(concept => <span id={`brute-force-${concept}`} key={concept} />)}<p>{text}</p></article>)}</div>{current.id === 'selection' ? <SelectionStrategyVisual /> : <BruteForceExamples kind={current.id} />}<section aria-label={`${current.title} Python 코드`}><h3>Python으로 표현하기</h3><pre className="python-output"><code>{bruteForceExampleCode[current.id]}</code></pre></section></div>
    <div className="algo-controls"><button type="button" disabled={index === 0} onClick={() => setIndex(index - 1)}>← 이전 예시</button><span aria-live="polite">{index + 1} / {examples.length} · {current.title}</span><button type="button" disabled={index === examples.length - 1} onClick={() => setIndex(index + 1)}>다음 예시 →</button></div>
  </div>
}
