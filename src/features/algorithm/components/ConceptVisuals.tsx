import { useMemo, useState } from 'react'
import StepControls from '../../../shared/components/StepControls'
import { ArrayDiagram, ContainerDiagram, CallDiagram } from './AlgorithmDiagrams'

type Frame = { values: (number | string)[]; focus?: number[]; fixed?: number; move?: [number, number]; held?: number; range?: [number, number]; text: string }
function Timeline({ frames, label, calls = false }: { frames: Frame[]; label: string; calls?: boolean }) {
  const [step, setStep] = useState(0)
  const frame = frames[Math.min(step, frames.length - 1)]
  return <div className="algo-visual"><h3>{label}</h3>{calls ? <CallDiagram values={frame.values} returning={step >= 4} /> : <ArrayDiagram values={frame.values} focus={frame.focus} fixed={frame.fixed} move={frame.move} held={frame.held} range={frame.range} />}<p aria-live="polite">{frame.text}</p><StepControls step={step} count={frames.length} onChange={setStep}/></div>
}
export function StructureVisual() {
  const [kind, setKind] = useState<'linear' | 'graph' | 'tree' | 'set'>('linear')
  const [mode, setMode] = useState('stack')
  const [items, setItems] = useState<number[]>([])
  const [next, setNext] = useState(1)
  const [message, setMessage] = useState('숫자를 넣고 꺼내며 순서를 확인하세요.')
  const descriptions = {
    linear: '원소가 한 줄의 순서를 이룹니다. 어느 쪽에서 넣고 꺼내는지에 따라 스택과 큐의 동작이 달라집니다.',
    graph: '정점은 여러 정점과 자유롭게 연결될 수 있습니다. 아래 그림에는 A에서 B·C로 이어지는 여러 경로가 있습니다.',
    tree: '하나의 루트에서 자식 노드가 아래로 갈라집니다. 각 자식은 부모 하나를 가지며 계층을 이룹니다.',
    set: '같은 원소를 여러 번 넣어도 한 번만 남습니다. 포함 여부와 합집합·교집합 같은 연산에 알맞습니다.',
  }
  return <div className="algo-visual structure-visual"><h3>네 가지 기본 자료구조 비교하기</h3><div className="algo-controls" role="tablist" aria-label="자료구조 종류">{([['linear', '선형 자료구조'], ['graph', '그래프'], ['tree', '트리'], ['set', '집합']] as const).map(([id, title]) => <button role="tab" aria-selected={kind === id} aria-pressed={kind === id} key={id} onClick={() => setKind(id)}>{title}</button>)}</div><div key={kind} className="structure-picture content-enter" role="tabpanel">
    {kind === 'linear' ? <div className="linear-structure" aria-label="1, 2, 3, 4가 순서대로 이어진 선형 자료구조"><span>1</span><i>→</i><span>2</span><i>→</i><span>3</span><i>→</i><span>4</span></div> : null}
    {kind === 'graph' ? <svg viewBox="0 0 360 180" role="img" aria-label="A, B, C, D가 여러 간선으로 연결된 그래프"><g className="structure-lines"><line x1="180" y1="35" x2="75" y2="100"/><line x1="180" y1="35" x2="285" y2="100"/><line x1="75" y1="100" x2="180" y2="145"/><line x1="285" y1="100" x2="180" y2="145"/><line x1="75" y1="100" x2="285" y2="100"/></g>{[['A',180,35],['B',75,100],['C',285,100],['D',180,145]].map(([name,x,y]) => <g key={name}><circle cx={x} cy={y} r="22"/><text x={x} y={Number(y)+5}>{name}</text></g>)}</svg> : null}
    {kind === 'tree' ? <svg viewBox="0 0 360 190" role="img" aria-label="루트 A 아래 B와 C, 그 아래 D, E, F가 있는 트리"><g className="structure-lines"><line x1="180" y1="30" x2="105" y2="90"/><line x1="180" y1="30" x2="255" y2="90"/><line x1="105" y1="90" x2="60" y2="155"/><line x1="105" y1="90" x2="150" y2="155"/><line x1="255" y1="90" x2="255" y2="155"/></g>{[['A',180,30],['B',105,90],['C',255,90],['D',60,155],['E',150,155],['F',255,155]].map(([name,x,y]) => <g key={name}><circle cx={x} cy={y} r="20"/><text x={x} y={Number(y)+5}>{name}</text></g>)}</svg> : null}
    {kind === 'set' ? <div className="set-structure" aria-label="중복된 2를 한 번만 저장하는 집합"><span className="set-input">입력: 1, 2, 2, 3</span><i>→</i><span className="set-values"><b>1</b><b>2</b><b>3</b></span></div> : null}
    <p>{descriptions[kind]}</p>
  </div>{kind === 'linear' ? <div className="content-enter"><h4>스택과 큐에 직접 넣고 꺼내기</h4><div className="algo-controls">{[['stack', '스택 · LIFO'], ['queue', '큐 · FIFO']].map(([id, title]) => <button key={id} aria-pressed={mode === id} onClick={() => { setMode(id); setItems([]); setNext(1); setMessage('새 자료구조로 시작합니다.') }}>{title}</button>)}</div><ContainerDiagram items={items} stack={mode === 'stack'} /><div className="algo-controls"><button disabled={items.length >= 8} onClick={() => { setItems([...items, next]); setNext(next + 1); setMessage(`${next}을 ${mode === 'stack' ? '스택 위' : '큐 뒤'}에 넣었습니다.`) }}>넣기</button><button disabled={!items.length} onClick={() => { const n = mode === 'stack' ? items[items.length - 1] : items[0]; setItems(mode === 'stack' ? items.slice(0, -1) : items.slice(1)); setMessage(`${n}을 ${mode === 'stack' ? '스택 위' : '큐 앞'}에서 꺼냈습니다.`) }}>꺼내기</button><button onClick={() => { setItems([]); setNext(1); setMessage('초기화했습니다.') }}>초기화</button></div><p aria-live="polite">{message}</p></div> : null}</div>
}
export function GrowthVisual() {
  const [view, setView] = useState<'complexity' | 'cases' | 'asymptotic' | 'notation'>('complexity')
  const [n, setN] = useState(10)
  const samples = Array.from({ length: 11 }, (_, i) => i)
  const point = (value: number, i: number) => `${42 + i * 28},${198 - value / 200 * 150}`
  const sortCases = [
    { id: 'best', title: '최선에 가까운 입력', values: [1, 2, 3, 5, 4] },
    { id: 'average', title: '일반적인 입력', values: [4, 1, 5, 2, 3] },
    { id: 'worst', title: '최악에 가까운 입력', values: [5, 4, 3, 2, 1] },
  ]
  const [sortCase, setSortCase] = useState(sortCases[0].id)
  const selected = sortCases.find(item => item.id === sortCase) ?? sortCases[0]
  const data = [...selected.values]; let comparisons = 0; let moves = 0
  for (let i = 1; i < data.length; i++) { const key = data[i]; let j = i - 1; while (j >= 0) { comparisons++; if (data[j] <= key) break; data[j + 1] = data[j]; moves++; j-- } data[j + 1] = key }
  return <div className="algo-visual efficiency-visual"><h3>효율성 분석을 직접 비교하기</h3><div className="algo-controls efficiency-tabs" role="tablist" aria-label="효율성 분석 시각화">{([['complexity','복잡도 함수'],['cases','최선·평균·최악'],['asymptotic','최고차항 비교'],['notation','O·Ω·Θ']] as const).map(([id,label]) => <button role="tab" aria-selected={view===id} aria-pressed={view===id} key={id} onClick={() => setView(id)}>{label}</button>)}</div>
    {view === 'complexity' ? <div className="efficiency-panel content-enter"><h4>T(n)=2, 2n, 2n²의 증가 속도</h4><svg className="complexity-chart" viewBox="0 0 360 230" role="img" aria-label="입력 크기 0부터 10까지 상수, 선형, 이차 복잡도 함수 비교 그래프"><line className="chart-axis" x1="42" y1="20" x2="42" y2="198"/><line className="chart-axis" x1="42" y1="198" x2="335" y2="198"/><polyline className="chart-constant" points={samples.map((_,i)=>point(2,i)).join(' ')}/><polyline className="chart-linear" points={samples.map((x,i)=>point(2*x,i)).join(' ')}/><polyline className="chart-quadratic" points={samples.map((x,i)=>point(2*x*x,i)).join(' ')}/>{[0,2,4,6,8,10].map(x=><text key={x} x={42+x*28} y="218" textAnchor="middle">{x}</text>)}</svg><div className="chart-legend"><span className="constant">T(n)=2</span><span className="linear">T(n)=2n</span><span className="quadratic">T(n)=2n²</span></div><label>입력 크기 n = {n}<input type="range" min="1" max="10" value={n} onChange={e=>setN(Number(e.target.value))}/></label><div className="complexity-values"><span><b>2</b>일정</span><span><b>{2*n}</b>n에 비례</span><span><b>{2*n*n}</b>n²에 비례</span></div></div> : null}
    {view === 'cases' ? <div className="efficiency-panel content-enter"><h4>같은 삽입 정렬, 다른 입력 구성</h4><div className="algo-controls">{sortCases.map(item=><button key={item.id} aria-pressed={sortCase===item.id} onClick={()=>setSortCase(item.id)}>{item.title}</button>)}</div><div className="case-array" aria-label={`입력 리스트 ${selected.values.join(', ')}`}>{selected.values.map((value,index)=><span key={index}>{value}</span>)}</div><div className="case-arrow">↓ 삽입 정렬</div><div className="case-array sorted">{data.map((value,index)=><span key={index}>{value}</span>)}</div><div className="case-stats"><span>비교 <strong>{comparisons}회</strong></span><span>이동 <strong>{moves}회</strong></span></div><p>입력 크기는 모두 5지만 배치에 따라 비교와 이동 횟수가 달라집니다.</p></div> : null}
    {view === 'asymptotic' ? <div className="efficiency-panel content-enter"><h4>T(n)=n²+n+1에서 낮은 차수 항의 영향</h4><div className="asymptotic-table" role="table" aria-label="정확한 복잡도와 최고차항 비교"><div role="row"><b>n</b><b>n²+n+1</b><b>n²</b><b>차이 비율</b></div>{[[1,3,1,'66.7%'],[10,111,100,'9.9%'],[100,10101,10000,'1.0%'],[1000,1001001,1000000,'0.1%']].map(row=><div role="row" key={row[0]}>{row.map((value,index)=><span role="cell" key={index}>{typeof value==='number'?value.toLocaleString('ko-KR'):value}</span>)}</div>)}</div><div className="asymptotic-bars"><span style={{width:'33%'}}>n=1 · 차이 큼</span><span style={{width:'99.9%'}}>n=1,000 · 거의 일치</span></div><p>n이 커질수록 n과 1의 비중이 작아져 두 함수의 증가 형태가 거의 같아집니다. 수업의 시간 복잡도 표기에 맞춰 O(n²)로 표현합니다.</p></div> : null}
    {view === 'notation' ? <div className="efficiency-panel content-enter"><h4>증가 속도를 나타내는 세 가지 경계</h4><div className="notation-bound"><article><strong>O(g(n))</strong><span>상한 · 과제 기본 표기</span><p>충분히 큰 n에서 이보다 빠르게 증가하지 않는다.</p></article><article><strong>Ω(g(n))</strong><span>하한</span><p>충분히 큰 n에서 적어도 이만큼 증가한다.</p></article><article><strong>Θ(g(n))</strong><span>동일 등급</span><p>상한과 하한이 같은 차수로 묶인다.</p></article></div><p className="growth-order">1 &lt; log n &lt; n &lt; n log n &lt; n² &lt; n³ &lt; 2ⁿ &lt; n!</p><p>과제 답안에서는 3n²-100n+10,000을 O(n²), 2n!+100을 O(n!)로 적습니다. Θ는 정확한 동일 등급을 설명할 때 사용합니다.</p></div> : null}
  </div>
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
const graph: Record<string, string[]> = { A: ['B', 'C'], B: ['A', 'D'], C: ['A', 'D', 'E'], D: ['B', 'C', 'F'], E: ['C', 'G', 'H'], F: ['D'], G: ['E', 'H'], H: ['E', 'G'] }
const positions: Record<string, [number, number]> = { A: [55, 175], B: [195, 65], C: [195, 260], D: [345, 65], E: [345, 260], F: [505, 65], G: [505, 205], H: [505, 315] }
const graphEdges = Object.entries(graph).flatMap(([a, neighbors]) => neighbors.filter(b => a < b).map(b => [a, b]))
type GraphFrame = { visited: string[]; pending: string[]; edges: [string,string][]; current?: string; text: string }
function graphFrames(bfs: boolean) {
  const frames: GraphFrame[] = [{ visited: [], pending: ['A'], edges: [], text: 'A에서 시작한다. 이웃은 알파벳순으로 확인한다.' }]
  const visited: string[] = [], edges: [string,string][] = []
  if (bfs) {
    const queue = ['A'], seen = new Set(['A'])
    while (queue.length) {
      const v = queue.shift()!
      visited.push(v)
      for (const u of graph[v]) if (!seen.has(u)) { seen.add(u); queue.push(u); edges.push([v,u]) }
      frames.push({ visited: [...visited], pending: [...queue], edges: [...edges], current: v, text: `${v}를 꺼내 처리하고, 미발견 이웃을 큐에 넣는다.` })
    }
  } else {
    const stack: string[] = []
    function dfs(v: string) {
      visited.push(v); stack.push(v)
      frames.push({ visited: [...visited], pending: [...stack], edges: [...edges], current: v, text: `${v} 호출: 방문 표시 후 이웃으로 내려간다.` })
      for (const u of graph[v]) if (!visited.includes(u)) { edges.push([v,u]); dfs(u) }
      stack.pop()
      frames.push({ visited: [...visited], pending: [...stack], edges: [...edges], current: stack[stack.length-1], text: `${v}의 탐색 완료. 호출에서 돌아온다.` })
    }
    dfs('A')
  }
  return frames
}
export function GraphVisual({ mode }: { mode?: 'dfs' | 'bfs' }) {
  const [bfs, setBfs] = useState(mode === 'bfs'); const [step, setStep] = useState(0)
  const frames = useMemo(()=>graphFrames(bfs),[bfs]); const frame = frames[step]
  return <div className="algo-visual graph-motion-visual"><h3>그래프와 {bfs ? '큐' : '호출 스택'} 함께 보기</h3><div className="algo-controls" hidden={mode !== undefined}>{[false, true].map(value => <button key={String(value)} aria-pressed={bfs === value} onClick={() => { setBfs(value); setStep(0) }}>{value ? 'BFS' : 'DFS'}</button>)}</div><p>8개 정점 · 9개 간선 · A에서 시작 · 이웃은 알파벳순. A–B–D–C–A와 E–G–H–E의 사이클에서 방문 기록이 중복 탐색을 막습니다.</p><svg className="algo-graph" viewBox="0 0 560 360" role="img" aria-label={`정점 8개와 간선 9개, 사이클 A-B-D-C-A 및 E-G-H-E가 있는 무방향 그래프. 방문 ${frame.visited.join(', ') || '없음'}`}>{graphEdges.map(([a,b]) => <line key={a+b} x1={positions[a][0]} y1={positions[a][1]} x2={positions[b][0]} y2={positions[b][1]} stroke="#becbd7" strokeWidth="2" />)}{frame.edges.map(([a,b])=><line key={a+b} className="motion-edge" pathLength="1" x1={positions[a][0]} y1={positions[a][1]} x2={positions[b][0]} y2={positions[b][1]} stroke="#28775c" strokeWidth="4"/>)}{Object.entries(positions).map(([name,[x,y]]) => <g key={name}>{frame.current===name?<circle key={step} className="graph-current-ring" cx={x} cy={y} r="29" fill="none" stroke="#dc8b34" strokeWidth="3"/>:null}<circle cx={x} cy={y} r="22" stroke={frame.pending.includes(name) ? '#2563eb' : '#c8d4df'} strokeWidth={frame.pending.includes(name) ? 3 : 1} fill={frame.visited.includes(name) ? '#28775c' : '#edf2f8'} /><text x={x} y={y+5} textAnchor="middle" fill={frame.visited.includes(name) ? 'white' : '#334155'}>{name}</text></g>)}</svg><p>초록 선: 처음 발견한 경로 · 주황 고리: 현재 처리 위치 · 파란 테두리: 스택/큐의 정점</p><p>방문: {frame.visited.join(' → ') || '없음'}</p><ContainerDiagram items={frame.pending} stack={!bfs} /><p aria-live="polite">{frame.text}</p><StepControls step={step} count={frames.length} onChange={setStep}/></div>
}
