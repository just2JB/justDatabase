import { useId, useState } from 'react'
import StepControls from '../../../shared/components/StepControls'
import { powerExamples, powerFrames, topologicalExample, topologicalState } from '../data/decreaseExamples'
import { pythonSolutions } from '../data/pythonSolutions'
import './decrease-examples.css'

const positions: Record<string, [number, number]> = {
  A: [100, 65], B: [350, 65], C: [65, 200], D: [230, 230], E: [410, 225], F: [230, 375],
}

export function TopologicalExample() {
  const [order, setOrder] = useState<string[]>([])
  const marker = `topological-arrow-${useId().replace(/:/g, '')}`
  const { degrees, ready, removed } = topologicalState(order)
  const nodes = Object.keys(topologicalExample)
  const done = order.length === nodes.length

  function select(node: string) {
    if (ready.includes(node)) setOrder(previous => [...previous, node])
  }

  return <div className="algo-visual decrease-example">
    <h3>진입차수 0인 정점부터 선택하기</h3>
    <p>방향 그래프의 선행 조건을 지키며 A~F를 나열합니다. 선택 가능한 정점이 여러 개면 어느 것을 골라도 됩니다.</p>
    <svg className="topological-example-graph" viewBox="0 0 480 430" role="img" aria-label="방향 그래프: A에서 C와 D, B에서 D와 E, C에서 D와 F, D와 E에서 F로 연결">
      <defs><marker id={marker} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#6984a3" /></marker></defs>
      {Object.entries(topologicalExample).flatMap(([from, neighbors]) => neighbors.map(to => {
        const [x1, y1] = positions[from], [x2, y2] = positions[to]
        const length = Math.hypot(x2 - x1, y2 - y1)
        return <path key={from + to} d={`M${x1 + (x2 - x1) * 30 / length} ${y1 + (y2 - y1) * 30 / length} L${x2 - (x2 - x1) * 35 / length} ${y2 - (y2 - y1) * 35 / length}`} fill="none" stroke="#6984a3" strokeWidth="2.5" markerEnd={`url(#${marker})`} opacity={removed.has(from) ? .15 : 1} />
      }))}
      {nodes.map(node => <g key={node}><circle cx={positions[node][0]} cy={positions[node][1]} r="29" fill={removed.has(node) ? '#dceee2' : ready.includes(node) ? '#dbeafe' : '#fff'} stroke={ready.includes(node) ? '#0757ff' : '#8ca5be'} strokeWidth="2" /><text x={positions[node][0]} y={positions[node][1] + 8} textAnchor="middle" fontSize="24" fontWeight="600">{node}</text></g>)}
    </svg>
    <p className="decrease-legend">파란색: 지금 선택 가능 · 초록색: 처리 완료 · 흐린 간선: 제거됨</p>
    <div className="topological-node-buttons" role="group" aria-label="진입차수 0인 정점 선택">
      {nodes.map(node => <button type="button" key={node} disabled={!ready.includes(node)} onClick={() => select(node)}><strong>{node}</strong><span>{removed.has(node) ? '완료' : `진입차수 ${degrees[node]}`}</span></button>)}
    </div>
    <p className="decrease-step-status" role="status">{done ? '모든 정점을 처리했습니다. 아래 순서는 선행 관계를 만족하는 위상 정렬입니다.' : `지금 선택 가능: ${ready.join(', ')}. 선택한 정점의 나가는 간선을 제거하고 도착 정점의 진입차수를 1씩 줄입니다.`}</p>
    <div className="decrease-order"><strong>선택한 순서</strong><span>{order.length ? order.join(' → ') : '정점을 선택해 보세요.'}</span></div>
    <div className="algo-controls"><button type="button" disabled={!order.length} onClick={() => setOrder(previous => previous.slice(0, -1))}>← 이전 단계</button><button type="button" disabled={!order.length} onClick={() => setOrder([])}>처음부터</button></div>
    <section className="decrease-code-example" aria-label="위상 정렬 Python 코드"><h4>Python 코드와 결과 예시</h4><pre className="python-output"><code>{pythonSolutions.topological}</code></pre><p>코드에서는 ready.pop()을 사용하므로 B E A C D F를 출력합니다. 직접 선택한 순서가 달라도 모든 간선의 출발점이 도착점보다 앞에 있으면 정답입니다.</p></section>
    <p>시간 복잡도 O(V+E). 이 예제는 DAG입니다. 남은 정점이 있는데 진입차수 0인 정점이 없다면 사이클 때문에 전체 위상 정렬을 완성할 수 없습니다.</p>
  </div>
}

const powerTraces = powerExamples.map(example => powerFrames(example.x, example.n))

export function FastPowerExample() {
  const [exampleIndex, setExampleIndex] = useState(0)
  const [step, setStep] = useState(0)
  const example = powerExamples[exampleIndex]
  const frames = powerTraces[exampleIndex]
  const frame = frames[step]
  const final = frames[frames.length - 1]
  const code = pythonSolutions.power.replaceAll('(2, 10)', `(${example.x}, ${example.n})`)

  return <div className="algo-visual decrease-example">
    <h3>지수를 절반으로 줄여 계산하기</h3>
    <p>짝수면 xⁿ = (xⁿᐟ²)², 홀수면 xⁿ = x × (x⌊ⁿᐟ²⌋)²입니다. 절반 지수의 결과 half를 한 번만 구해 재사용합니다.</p>
    <div className="algo-controls" role="group" aria-label="거듭제곱 예제 선택">{powerExamples.map((item, index) => <button type="button" key={item.label} aria-pressed={index === exampleIndex} onClick={() => { setExampleIndex(index); setStep(0) }}>{item.label}</button>)}</div>
    <div className="decrease-step-status" role="status"><strong>{frame.phase === 'call' ? '호출' : '반환'} · n = {frame.n}</strong><p>{frame.expression}</p></div>
    <div className="power-call-stack" aria-label="현재 재귀 호출 스택">{frame.stack.map((n, index) => <span key={index} data-active={index === frame.stack.length - 1}>power({example.x}, {n})</span>)}</div>
    <StepControls key={exampleIndex} step={step} count={frames.length} onChange={setStep} />
    <div className="table-wrap"><table className="power-trace-table"><caption>현재 단계까지의 호출과 반환</caption><thead><tr><th>단계</th><th>지수 n</th><th>계산 과정</th><th>누적 곱셈</th></tr></thead><tbody>{frames.slice(0, step + 1).map((item, index) => <tr key={index} data-current={index === step}><td>{item.phase === 'call' ? '호출' : '반환'}</td><td>{item.n}</td><td>{item.expression}</td><td>{item.multiplications}회</td></tr>)}</tbody></table></div>
    <p>이 구현의 곱셈 횟수: 현재 {frame.multiplications}회 / 최종 {final.multiplications}회. 반복 방식 slow_power는 {example.n}회 곱합니다.</p>
    {step === frames.length - 1 ? <p className="decrease-final">결과: {example.x}^{example.n} = {final.result}</p> : null}
    <section className="decrease-code-example" aria-label="빠른 거듭제곱 Python 코드"><h4>Python 코드</h4><pre className="python-output"><code>{code}</code></pre></section>
    <p>n = 0이면 1을 반환합니다. 시간 복잡도 O(log n), 재귀 호출 스택 O(log n)이며 n=0은 상수 시간입니다. 위 횟수는 실제 곱셈식 기준으로, 홀수 단계에서 2회 곱합니다.</p>
  </div>
}
