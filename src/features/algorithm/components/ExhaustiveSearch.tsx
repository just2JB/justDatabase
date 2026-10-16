import { useState } from 'react'

function permutations(values: number[]): number[][] {
  return values.length ? values.flatMap((value, i) => permutations(values.filter((_, j) => j !== i)).map(tail => [value, ...tail])) : [[]]
}
const orders = permutations([0, 1, 2])
const distances = [[0,10,15,20],[10,0,40,25],[15,40,0,30],[20,25,30,0]]
const routes = permutations([1,2,3]).map(order => { const path = [0,...order,0]; return { path, cost: path.slice(1).reduce((sum,v,i) => sum + distances[path[i]][v],0) } })
const costs = [[9,2,7],[6,4,3],[5,8,1]]
const assignments = orders.map(order => ({ order, cost: order.reduce((sum,job,worker) => sum + costs[worker][job],0) }))
const goods = [{name:'책',weight:2,value:3},{name:'카메라',weight:3,value:4},{name:'노트북',weight:4,value:5},{name:'텐트',weight:5,value:8}]
const subsets = Array.from({length:16},(_,mask) => { const items = goods.filter((_,i)=>Boolean(mask & (1<<i))); return { mask, weight:items.reduce((s,v)=>s+v.weight,0), value:items.reduce((s,v)=>s+v.value,0) } })
const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
function outcome(board: string[]) { for(const [a,b,c] of lines) if(board[a] && board[a]===board[b] && board[a]===board[c]) return board[a]; return board.every(Boolean) ? '무승부' : '' }
function minimax(board: string[], turn: string): number {
  const result = outcome(board)
  if(result) return result === 'X' ? 1 : result === 'O' ? -1 : 0
  const scores = board.flatMap((cell,i)=> { if(cell) return []; const next=[...board]; next[i]=turn; return [minimax(next,turn==='X'?'O':'X')] })
  return turn==='X' ? Math.max(...scores) : Math.min(...scores)
}
const initialBoard = ['X','O','X','O','X','','','O','']
const descriptions = {
  tic: ['틱택토와 상태 공간 트리','현재 보드에서 X 차례다. 가능한 선택과 이후 승리·패배·무승부를 살펴 최선의 수를 고른다.','빈칸마다 다음 보드를 만들고 승부가 결정될 때까지 확장한다. 미니맥스는 X가 높은 점수, O가 낮은 점수를 선택한다고 가정한다.','남은 빈칸 k개에서 전개 순서 수는 O(k!) 상한이다. 아래 예시는 이해를 위해 빈칸 3개부터 시작한다.'],
  tsp: ['외판원 문제 · TSP','모든 도시를 한 번씩 방문한 뒤 출발 도시 A로 돌아오는 최소 비용 경로를 찾아라.','출발 도시를 고정하고 나머지 도시의 모든 순열을 나열해 경로 비용을 비교한다.','(n−1)!개 후보 × 경로당 O(n) 평가 → O(n!). 역방향도 별도 후보로 센다.'],
  bag: ['0/1 배낭 문제','각 물건은 한 번만 선택할 수 있고 자를 수 없다. 무게 합이 용량 W=7 이내인 선택 중 가치 합을 최대화하라.','물건마다 넣기·빼기를 선택해 2ⁿ개 부분집합을 조사한다. 용량 초과는 제외하고 최대 가치를 갱신한다.','후보마다 무게·가치를 새로 합산하면 O(n2ⁿ). 재귀에서 합을 누적하면 O(2ⁿ)이다.'],
  jobs: ['일 배정 문제','3명의 근로자에게 서로 다른 일을 하나씩 배정해 전체 비용을 최소화하라.','근로자 순서를 고정하고 일의 모든 순열을 조사한다. 각 행과 열에서 하나씩 선택한다.','n!개 배정 × 배정당 O(n) 비용 계산 → O(n·n!).'],
}
const python = {
  tsp: `from itertools import permutations
dist = [[0,10,15,20], [10,0,40,25], [15,40,0,30], [20,25,30,0]]
best_cost = float('inf')
best_route = None
for order in permutations(range(1, 4)):
    route = (0,) + order + (0,)
    cost = sum(dist[route[i]][route[i+1]] for i in range(4))
    if cost < best_cost:
        best_cost, best_route = cost, route
print(best_route, best_cost)  # (0, 1, 3, 2, 0), 80`,
  bag: `items = [(2,3), (3,4), (4,5), (5,8)]  # (무게, 가치)
W = 7
best = 0
for mask in range(1 << len(items)):
    weight = value = 0
    for i, (wt, val) in enumerate(items):
        if mask & (1 << i):
            weight += wt
            value += val
    if weight <= W:
        best = max(best, value)
print(best)  # 11`,
  jobs: `from itertools import permutations
costs = [[9,2,7], [6,4,3], [5,8,1]]
best_cost = float('inf')
best_order = None
for order in permutations(range(3)):
    total = sum(costs[i][order[i]] for i in range(3))
    if total < best_cost:
        best_cost, best_order = total, order
print(best_order, best_cost)  # (1, 0, 2), 9`,
  tic: `lines = [(0,1,2),(3,4,5),(6,7,8),(0,3,6),(1,4,7),(2,5,8),(0,4,8),(2,4,6)]
def minimax(board, turn):
    for a, b, c in lines:
        if board[a] and board[a] == board[b] == board[c]:
            return 1 if board[a] == 'X' else -1
    if all(board):
        return 0
    scores = []
    for i in range(9):
        if not board[i]:
            board[i] = turn
            scores.append(minimax(board, 'O' if turn == 'X' else 'X'))
            board[i] = ''  # 다음 후보를 위해 복원
    return max(scores) if turn == 'X' else min(scores)

board = ['X','O','X','O','X','','','O','']
for i in range(9):
    if not board[i]:
        board[i] = 'X'
        print(i + 1, minimax(board, 'O'))  # 칸 번호, X 기준 점수
        board[i] = ''`,
}

function TicTacToe() {
  const [history,setHistory]=useState<string[][]>([initialBoard])
  const board=history[history.length-1], turn=(history.length-1)%2===0?'X':'O', result=outcome(board)
  function play(i:number) { if(board[i] || result) return; const next=[...board]; next[i]=turn; setHistory([...history,next]) }
  const branches=board.flatMap((cell,i)=>{if(cell || result)return []; const next=[...board];next[i]=turn;return [{i,next,score:minimax(next,turn==='X'?'O':'X')}]})
  return <><p role="status">{result ? `종료: ${result}` : `${turn} 차례 · 빈칸을 눌러 다음 상태로 이동하세요.`}</p><div className="tic-board">{board.map((cell,i)=><button key={i} disabled={!!cell || !!result} onClick={()=>play(i)} aria-label={`${i+1}번 칸 ${cell || '비어 있음'}`}>{cell || <small>{i+1}</small>}</button>)}</div><div className="state-tree"><strong>현재 상태 · {turn} 선택</strong><span>↓ 가능한 다음 상태</span><div>{branches.map(branch=><button key={branch.i} onClick={()=>play(branch.i)}><b>{branch.i+1}번 칸에 {turn}</b><span className="mini-board">{branch.next.map((cell,i)=><span key={i}>{cell || '·'}</span>)}</span><span>{outcome(branch.next) ? `즉시 결과: ${outcome(branch.next)}` : '상대도 최선으로 대응하면'}</span><strong>X 기준 {branch.score===1?'승리 +1':branch.score===-1?'패배 −1':'무승부 0'}</strong></button>)}</div></div><p>가지를 누르면 그 보드가 새 부모 상태가 됩니다. 승부가 끝난 가지는 더 확장하지 않습니다.</p><div className="algo-controls"><button disabled={history.length===1} onClick={()=>setHistory(history.slice(0,-1))}>이전 상태</button><button onClick={()=>setHistory([initialBoard])}>처음 보드</button></div></>
}

function Candidates({kind}:{kind:'tsp'|'bag'|'jobs'}) {
  const [step,setStep]=useState(0)
  const [all,setAll]=useState(false)
  const count=kind==='bag'?16:6
  const seen=all?count:step+1
  const positions=[[60,50],[300,50],[300,220],[60,220]]
  const route=routes[step], assignment=assignments[step], bag=subsets[step]
  const best=kind==='tsp'?Math.min(...routes.slice(0,seen).map(v=>v.cost)):kind==='jobs'?Math.min(...assignments.slice(0,seen).map(v=>v.cost)):Math.max(...subsets.slice(0,seen).filter(v=>v.weight<=7).map(v=>v.value))
  return <><p role="status">후보 {step+1} / {count} · {all?'전체 후보 비교 완료':'현재 후보까지 비교'}</p>
    {kind==='tsp'?<><svg className="algo-diagram" viewBox="0 0 360 270" role="img" aria-label={`경로 ${route.path.map(i=>'ABCD'[i]).join(' → ')} 비용 ${route.cost}`}>{positions.flatMap(([x,y],i)=>positions.slice(i+1).map(([xx,yy],j)=><g key={`${i}-${j}`}><line x1={x} y1={y} x2={xx} y2={yy} stroke="#d7e0e9"/><text x={(x+xx)/2+(i===0&&j===1?-15:8)} y={(y+yy)/2-8} fontSize="12">{distances[i][i+j+1]}</text></g>))}<polyline points={route.path.map(i=>positions[i].join(',')).join(' ')} fill="none" stroke="#28775c" strokeWidth="4"/>{positions.map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="20" fill="#e3f1e8" stroke="#28775c"/><text x={x} y={y+5} textAnchor="middle">{'ABCD'[i]}</text></g>)}</svg><p>{route.path.map(i=>'ABCD'[i]).join(' → ')} · {route.path.slice(1).map((v,i)=>distances[route.path[i]][v]).join(' + ')} = <strong>{route.cost}</strong></p></>:null}
    {kind==='bag'?<><div className="bag-goods">{goods.map((item,i)=><button key={item.name} aria-pressed={!!(bag.mask&(1<<i))} onClick={()=>{setStep(bag.mask^(1<<i));setAll(false)}}><strong>{item.name}</strong><span>무게 {item.weight} · 가치 {item.value}</span><b>{bag.mask&(1<<i)?'넣기 ✓':'빼기'}</b></button>)}</div><p className={bag.weight>7?'bag-overweight':''}>배낭 무게 <strong>{bag.weight} / 7</strong> · 총가치 <strong>{bag.value}</strong> · {bag.weight>7?'용량 초과: 후보 제외':'용량 조건 만족'}</p><meter min="0" max="7" value={Math.min(bag.weight,7)} aria-label="배낭 무게" style={{width:'100%'}}/><p>4개 물건 각각 넣기·빼기 → 2×2×2×2 = 16개 부분집합. 물건 버튼으로 직접 선택할 수도 있습니다.</p></>:null}
    {kind==='jobs'?<div className="table-wrap"><table><caption>근로자 × 일 비용표 · 강조된 칸이 현재 배정</caption><thead><tr><th>근로자</th>{[1,2,3].map(v=><th key={v}>일 {v}</th>)}</tr></thead><tbody>{costs.map((row,i)=><tr key={i}><th>근로자 {i+1}</th>{row.map((value,j)=><td key={j} style={assignment.order[i]===j?{background:'#dcefe2',color:'#245743',fontWeight:700}:undefined}>{assignment.order[i]===j?'✓ ':''}{value}</td>)}</tr>)}</tbody></table><p>{assignment.order.map((job,i)=>`근로자 ${i+1} → 일 ${job+1}`).join(' · ')}<br/>비용: {assignment.order.map((job,i)=>costs[i][job]).join(' + ')} = <strong>{assignment.cost}</strong></p></div>:null}
    <p className="exhaustive-best">{all?'전체 최적값':'지금까지 최적값'}: <strong>{best}</strong>{kind==='bag'?' · 가치 최대화':' · 비용 최소화'}</p>
    {all?<div className="table-wrap"><table><caption>전체 후보 비교</caption><thead><tr><th>후보</th><th>{kind==='bag'?'무게 / 가치':'비용'}</th><th>판정</th></tr></thead><tbody>{Array.from({length:count},(_,i)=>{const valid=kind!=='bag'||subsets[i].weight<=7;const value=kind==='bag'?subsets[i].value:kind==='tsp'?routes[i].cost:assignments[i].cost;return <tr key={i}><td><button onClick={()=>setStep(i)}>{kind==='bag'?goods.filter((_,j)=>subsets[i].mask&(1<<j)).map(v=>v.name).join(' + ')||'빈 배낭':kind==='tsp'?routes[i].path.map(v=>'ABCD'[v]).join('→'):assignments[i].order.map(v=>v+1).join(' → ')}</button></td><td>{kind==='bag'?`${subsets[i].weight} / `:''}{value}</td><td>{!valid?'용량 초과':value===best?'최적 ✓':'가능'}</td></tr>})}</tbody></table></div>:null}
    <div className="algo-controls"><button disabled={step===0} onClick={()=>{setStep(step-1);setAll(false)}}>← 이전 후보</button><button disabled={step===count-1} onClick={()=>{setStep(step+1);setAll(false)}}>다음 후보 →</button><button onClick={()=>setAll(!all)}>{all?'전체 비교 접기':'전체 후보와 최적해 확인'}</button><button onClick={()=>{setStep(0);setAll(false)}}>처음</button></div>
  </>
}

export default function ExhaustiveSearch() {
  const [kind,setKind]=useState<keyof typeof descriptions>('tic')
  const [title,problem,strategy,complexity]=descriptions[kind]
  return <div><p>최적화 문제는 조건을 만족하는 해 중 비용·길이를 최소화하거나 가치를 최대화하는 문제입니다. 완전 탐색은 가능한 후보를 모두 만들고 조건을 확인한 뒤 가장 좋은 해를 선택합니다.</p><div className="algo-controls">{Object.entries(descriptions).map(([id,description])=><button key={id} aria-pressed={kind===id} onClick={()=>setKind(id as keyof typeof descriptions)}>{description[0]}</button>)}</div><div key={kind} className="content-enter"><h3>{title}</h3><div className="brute-example-description">{[['문제 설명',problem],['완전 탐색 전략',strategy],['복잡도',complexity]].map(([heading,text])=><article key={heading}><h3>{heading}</h3><p>{text}</p></article>)}</div><div className="algo-visual">{kind==='tic'?<TicTacToe/>:<Candidates kind={kind}/>}</div><h3>Python으로 표현하기</h3><pre className="python-output"><code>{python[kind]}</code></pre></div></div>
}
