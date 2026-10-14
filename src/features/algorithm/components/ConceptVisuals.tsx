import { useState } from 'react'
import { ArrayDiagram, ContainerDiagram, CallDiagram } from './AlgorithmDiagrams'

type Frame = { values: (number | string)[]; focus?: number[]; fixed?: number; move?: [number, number]; held?: number; range?: [number, number]; text: string }
function Timeline({ frames, label, calls = false }: { frames: Frame[]; label: string; calls?: boolean }) {
  const [step, setStep] = useState(0)
  const frame = frames[Math.min(step, frames.length - 1)]
  return <div className="algo-visual"><h3>{label}</h3>{calls ? <CallDiagram values={frame.values} returning={step >= 4} /> : <ArrayDiagram values={frame.values} focus={frame.focus} fixed={frame.fixed} move={frame.move} held={frame.held} range={frame.range} />}<p aria-live="polite">{frame.text}</p><div className="algo-controls"><button disabled={step === 0} onClick={() => setStep(step - 1)}>← 이전</button><span>{step + 1} / {frames.length}</span><button disabled={step === frames.length - 1} onClick={() => setStep(step + 1)}>다음 →</button><button onClick={() => setStep(0)}>처음</button></div></div>
}
export function StructureVisual() {
  const [mode, setMode] = useState('stack')
  const [items, setItems] = useState<number[]>([])
  const [next, setNext] = useState(1)
  const [message, setMessage] = useState('숫자를 넣고 꺼내며 순서를 확인하세요.')
  return <div className="algo-visual"><h3>스택과 큐에 넣고 꺼내기</h3><div className="algo-controls">{[['stack', '스택 · LIFO'], ['queue', '큐 · FIFO']].map(([id, title]) => <button key={id} aria-pressed={mode === id} onClick={() => { setMode(id); setItems([]); setNext(1); setMessage('새 자료구조로 시작합니다.') }}>{title}</button>)}</div><ContainerDiagram items={items} stack={mode === 'stack'} /><div className="algo-controls"><button disabled={items.length >= 8} onClick={() => { setItems([...items, next]); setNext(next + 1); setMessage(`${next}을 ${mode === 'stack' ? '스택 위' : '큐 뒤'}에 넣었습니다.`) }}>넣기</button><button disabled={!items.length} onClick={() => { const n = mode === 'stack' ? items[items.length - 1] : items[0]; setItems(mode === 'stack' ? items.slice(0, -1) : items.slice(1)); setMessage(`${n}을 ${mode === 'stack' ? '스택 위' : '큐 앞'}에서 꺼냈습니다.`) }}>꺼내기</button><button onClick={() => { setItems([]); setNext(1); setMessage('초기화했습니다.') }}>초기화</button></div><p aria-live="polite">{message}</p></div>
}
export function GrowthVisual() {
  const [n, setN] = useState(8)
  const values = [['1', 1], ['log₂n', Math.log2(n)], ['n', n], ['n log₂n', n * Math.log2(n)], ['n²', n * n], ['2ⁿ', 2 ** n]] as const
  return <div className="algo-visual"><h3>입력 크기와 성장률</h3><label>n = {n}<input type="range" min="2" max="16" value={n} onChange={e => setN(Number(e.target.value))} /></label><div className="algo-growth">{values.map(([label, value]) => <div key={label}><span>{label}</span><meter min={0} max={2 ** n} value={value} /><strong>{value.toLocaleString('ko-KR', { maximumFractionDigits: 1 })}</strong></div>)}</div><p>동일한 n에서 함수값을 비교합니다. 막대는 선형 눈금이므로 지수값이 크면 다른 막대가 작게 보입니다. 실제 실행시간이나 정확한 연산 횟수는 아닙니다.</p></div>
}
export function RecursionVisual() {
  return <Timeline calls label="factorial(4): 호출하고 돌아오기" frames={[
    { values: ['f(4)'], text: '4 × f(3)의 답을 기다린다.' },
    { values: ['f(4)', 'f(3)'], text: 'f(3)도 3 × f(2)를 기다린다.' },
    { values: ['f(4)', 'f(3)', 'f(2)'], text: 'f(2)는 2 × f(1)을 기다린다.' },
    { values: ['f(4)', 'f(3)', 'f(2)', 'f(1)=1'], focus: [3], text: '종료 조건: f(1)=1. 여기부터 반환한다.' },
    { values: ['f(4)', 'f(3)', 'f(2)=2'], focus: [2], text: 'f(2)=2×1=2를 반환한다.' },
    { values: ['f(4)', 'f(3)=6'], focus: [1], text: 'f(3)=3×2=6을 반환한다.' },
    { values: ['f(4)=24'], focus: [0], text: 'f(4)=4×6=24. 호출이 끝났다.' },
  ]} />
}
function sortFrames(insertion: boolean): Frame[] {
  const a = [5, 3, 8, 4, 9, 1, 6, 2, 7]
  const frames: Frame[] = [{ values: [...a], text: '초기 배열. 초록은 확정 또는 정렬된 구간, 파랑은 비교·이동 대상이다.', fixed: insertion ? 1 : 0 }]
  if (insertion) {
    for (let i = 1; i < a.length; i++) {
      const key = a[i]; let j = i - 1
      frames.push({ values: [...a], focus: [i], fixed: i, held: key, text: `key=${key}를 꺼내 왼쪽 정렬 구간에 삽입한다.` })
      while (j >= 0 && a[j] > key) { a[j + 1] = a[j]; frames.push({ values: [...a], focus: [j, j + 1], move: [j, j + 1], held: key, text: `${a[j]}을 오른쪽으로 복사한다. key=${key}는 따로 보관 중이므로 중간 배열에 중복이 보인다.` }); j-- }
      a[j + 1] = key; frames.push({ values: [...a], focus: [j + 1], fixed: i + 1, text: `${key}를 인덱스 ${j + 1}에 넣었다. 앞 ${i + 1}개가 정렬됐다.` })
    }
  } else {
    for (let i = 0; i < a.length - 1; i++) {
      let least = i
      for (let j = i + 1; j < a.length; j++) { frames.push({ values: [...a], focus: [least, j], fixed: i, text: `${a[least]}와 ${a[j]} 비교. 작은 값의 위치를 기억한다.` }); if (a[j] < a[least]) least = j }
      ;[a[i], a[least]] = [a[least], a[i]]
      frames.push({ values: [...a], focus: [i, least], move: i === least ? undefined : [least, i], fixed: i + 1, text: `${i + 1}회전: 최솟값 ${a[i]}을 인덱스 ${i}에 확정했다.` })
    }
    frames.push({ values: [...a], fixed: a.length, text: '정렬 완료. 최솟값을 찾는 비교는 총 36회다.' })
  }
  return frames
}
const selectionFrames = sortFrames(false)
const insertionFrames = sortFrames(true)
export function SortVisual({ insertion = false }: { insertion?: boolean }) { return <Timeline label={insertion ? '삽입 정렬: 밀고 끼워 넣기' : '선택 정렬: 비교하고 최솟값 교환하기'} frames={insertion ? insertionFrames : selectionFrames} /> }
export function BinaryVisual() {
  const [key, setKey] = useState(23)
  const a = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
  const frames: Frame[] = []; let low = 0; let high = a.length - 1; let found = false
  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    frames.push({ values: [...a], range: [low, high], focus: [mid], text: `범위 [${low}, ${high}], mid=${mid}, 값=${a[mid]}. ${a[mid] === key ? '목표와 같아 탐색 성공!' : key < a[mid] ? '목표가 작으므로 왼쪽 절반으로.' : '목표가 크므로 오른쪽 절반으로.'}` })
    if (a[mid] === key) { found = true; break }
    if (key < a[mid]) high = mid - 1; else low = mid + 1
  }
  if (!found) frames.push({ values: [...a], range: [low, high], text: `low=${low} > high=${high}. 빈 범위이므로 -1 반환.` })
  return <><div className="algo-controls">{[23, 50, 2, 91].map(n => <button key={n} aria-pressed={key === n} onClick={() => setKey(n)}>목표 {n}</button>)}</div><Timeline key={key} label="이진 탐색: 절반씩 제외하기" frames={frames} /></>
}
const graph: Record<string, string[]> = { A: ['B', 'C'], B: ['A', 'D'], C: ['A', 'E'], D: ['B'], E: ['C'] }
const positions: Record<string, [number, number]> = { A: [180, 35], B: [90, 110], C: [270, 110], D: [90, 185], E: [270, 185] }
type GraphFrame = { visited: string[]; pending: string[]; text: string }
function graphFrames(bfs: boolean) {
  const frames: GraphFrame[] = [{ visited: [], pending: ['A'], text: 'A에서 시작한다. 이웃은 알파벳순으로 확인한다.' }]
  const visited: string[] = []
  if (bfs) {
    const queue = ['A']; const seen = new Set(['A'])
    while (queue.length) { const v = queue.shift()!; visited.push(v); for (const u of graph[v]) if (!seen.has(u)) { seen.add(u); queue.push(u) }; frames.push({ visited: [...visited], pending: [...queue], text: `${v}를 꺼내 처리하고, 미발견 이웃을 큐에 넣는다.` }) }
  } else {
    const stack: string[] = []
    function dfs(v: string) { visited.push(v); stack.push(v); frames.push({ visited: [...visited], pending: [...stack], text: `${v} 호출: 방문 표시 후 이웃으로 내려간다.` }); for (const u of graph[v]) if (!visited.includes(u)) dfs(u); stack.pop(); frames.push({ visited: [...visited], pending: [...stack], text: `${v}의 탐색 완료. 호출에서 돌아온다.` }) }
    dfs('A')
  }
  return frames
}
export function GraphVisual() {
  const [bfs, setBfs] = useState(false); const [step, setStep] = useState(0)
  const frames = graphFrames(bfs); const frame = frames[step]
  return <div className="algo-visual"><h3>그래프와 {bfs ? '큐' : '호출 스택'} 함께 보기</h3><div className="algo-controls">{[false, true].map(value => <button key={String(value)} aria-pressed={bfs === value} onClick={() => { setBfs(value); setStep(0) }}>{value ? 'BFS' : 'DFS'}</button>)}</div><svg className="algo-graph" viewBox="0 0 360 225" role="img" aria-label={`A-B, A-C, B-D, C-E 그래프. 방문 ${frame.visited.join(', ') || '없음'}`}>{[['A','B'],['A','C'],['B','D'],['C','E']].map(([a,b]) => <line key={a+b} x1={positions[a][0]} y1={positions[a][1]} x2={positions[b][0]} y2={positions[b][1]} stroke="#becbd7" strokeWidth="2" />)}{Object.entries(positions).map(([name,[x,y]]) => <g key={name}><circle cx={x} cy={y} r="20" fill={frame.visited.includes(name) ? '#28775c' : '#edf2f8'} /><text x={x} y={y+5} textAnchor="middle" fill={frame.visited.includes(name) ? 'white' : '#334155'}>{name}</text></g>)}</svg><p>방문: {frame.visited.join(' → ') || '없음'}</p><ContainerDiagram items={frame.pending} stack={!bfs} /><p aria-live="polite">{frame.text}</p><div className="algo-controls"><button disabled={step === 0} onClick={() => setStep(step-1)}>← 이전</button><span>{step+1} / {frames.length}</span><button disabled={step === frames.length-1} onClick={() => setStep(step+1)}>다음 →</button><button onClick={() => setStep(0)}>처음</button></div></div>
}
