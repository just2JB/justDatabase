import { useState } from 'react'
import ListSplitTree from './ListSplitTree'
import QuickSortVisual from './QuickSortVisual'

type MergeFrame = { groups: number[][]; left: number[]; right: number[]; output: number[]; text: string }
const input = [8,3,2,9,7,1,5,4]
const mergeFrames: MergeFrame[] = []
const empty = { left: [] as number[], right: [] as number[], output: [] as number[] }
for (let size=8; size>=1; size/=2) mergeFrames.push({ ...empty, groups:Array.from({length:8/size},(_,i)=>input.slice(i*size,(i+1)*size)), text:size===1?'각 리스트에 원소가 하나뿐이므로 이미 정렬된 상태입니다.':`크기 ${size}인 리스트 ${8/size}개. 다음에는 각각 절반으로 나눕니다.` })
let groups = input.map(value=>[value])
while(groups.length>1) {
  const next: number[][]=[]
  for(let pair=0;pair<groups.length;pair+=2) {
    const left=groups[pair], right=groups[pair+1], output:number[]=[]
    let i=0,j=0
    while(i<left.length || j<right.length) {
      const message=i===left.length?`왼쪽이 비어 오른쪽 ${right[j]}을 추가합니다.`:j===right.length?`오른쪽이 비어 왼쪽 ${left[i]}을 추가합니다.`:`${left[i]}과 ${right[j]} 비교 → ${Math.min(left[i],right[j])} 선택` 
      mergeFrames.push({groups:[...next,...groups.slice(pair)],left:left.slice(i),right:right.slice(j),output:[...output],text:message})
      if(j===right.length || (i<left.length && left[i]<=right[j])) output.push(left[i++]); else output.push(right[j++])
    }
    next.push(output)
    mergeFrames.push({groups:[...next,...groups.slice(pair+2)],...empty,output:[...output],text:`병합 완료: [${output.join(', ')}]`})
  }
  groups=next
}

const mergeCode = `def merge_sort(values):
    if len(values) <= 1:
        return values
    mid = len(values) // 2
    left = merge_sort(values[:mid])
    right = merge_sort(values[mid:])
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result

print(merge_sort([8,3,2,9,7,1,5,4]))
# [1, 2, 3, 4, 5, 7, 8, 9]`

export default function DivideVisuals({kind}:{kind:string}) {
  const [step,setStep]=useState(0)
  const [master,setMaster]=useState('merge')
  const frame=mergeFrames[step]
  const cases={merge:{a:2,b:2,d:1,label:'병합 정렬',answer:'a = bᵈ → O(n log n)'},sum:{a:2,b:2,d:0,label:'리스트 합',answer:'a > bᵈ → O(n)'},binary:{a:1,b:2,d:0,label:'이진 탐색',answer:'a = bᵈ → O(log n)'}}
  const selected=cases[master as keyof typeof cases]
  const bars=(values:number[]) => <div className="merge-bars">{values.map((value,i)=><span key={i} style={{height:18+value*9}}><b>{value}</b></span>)}</div>
  if(kind==='divide-quick')return <QuickSortVisual />
  if(kind==='divide-sum')return <div className="algo-visual"><h3>리스트 합 · 같은 위치에서 나누고 더하기</h3><div className="algo-controls"><button aria-pressed={step===0} onClick={()=>setStep(0)}>① 원래 리스트</button><button aria-pressed={step===1} onClick={()=>setStep(1)}>② 두 절반</button><button aria-pressed={step===2} onClick={()=>setStep(2)}>③ 원소 하나씩</button><button aria-pressed={step===3} onClick={()=>setStep(3)}>④ 부분 합 결합</button></div><ListSplitTree values={[3,1,4,2]} depth={Math.min(step,2)} sums={step===3}/><p role="status">{['원소 4개의 합을 구하려고 합니다. 다음 단계에서 가운데를 기준으로 나눕니다.','왼쪽 [3, 1]과 오른쪽 [4, 2]로 나눕니다. 각 절반에서도 똑같이 합을 구합니다.','[3], [1], [4], [2]는 원소가 하나이므로 그 값이 곧 부분 문제의 답입니다.','화살표를 위로 따라가세요. 3+1=4, 4+2=6, 마지막에 4+6=10이 됩니다.'][step]}</p><div className="algo-controls"><button disabled={step===0} onClick={()=>setStep(step-1)}>← 이전</button><span>{step+1} / 4</span><button disabled={step===3} onClick={()=>setStep(step+1)}>다음 →</button></div></div>
  if(kind==='divide-recurrence')return <div className="algo-visual"><h3>연속 대치: 앞 계수 ×2 · 분모 ×2 · 비용 누적</h3><div className="table-wrap"><table><thead><tr><th>대치</th><th>T 앞 계수</th><th>T 안의 크기</th><th>누적 비용</th></tr></thead><tbody>{[['1','2','n/2','1'],['2','4','n/4','3'],['3','8','n/8','7'],['k','2ᵏ','n/2ᵏ','2ᵏ−1']].map(row=><tr key={row[0]}>{row.map((v,i)=><td key={i}>{v}</td>)}</tr>)}</tbody></table></div><p className="recurrence-formula">T(n) = 2ᵏT(n/2ᵏ) + (2ᵏ − 1)</p><p>초기 조건 도달: n/2ᵏ = 1 → 2ᵏ = n → k = log₂n</p><p className="recurrence-formula">T(n) = n × T(1) + n − 1 = 2n − 1 → O(n)</p><p>트리 깊이만 세면 log n이지만 양쪽 부분 문제를 모두 풀어 전체 작업량은 O(n)입니다.</p></div>
  if(kind==='divide-master')return <div className="algo-visual"><h3>마스터 정리 · 수고비와 부분 문제의 증가 비교</h3><div className="recurrence-formula"><span>T(n) =</span><span className="master-cases"><b>c <small>n = 1</small></b><b>aT(n/b) + f(n) <small>n &gt; 1</small></b></span></div><p>a ≥ 1, b &gt; 1, c &gt; 0 · f(n)이 nᵈ에 비례할 때</p><div className="table-wrap"><table><thead><tr><th>조건</th><th>시간 복잡도</th></tr></thead><tbody><tr><td>a &gt; bᵈ</td><td>O(n^(log_b a))</td></tr><tr><td>a = bᵈ</td><td>O(nᵈ log n)</td></tr><tr><td>a &lt; bᵈ</td><td>O(nᵈ)</td></tr></tbody></table></div><div className="algo-controls">{Object.entries(cases).map(([id,v])=><button key={id} aria-pressed={master===id} onClick={()=>setMaster(id)}>{v.label}</button>)}</div><div className="pizza-example"><svg viewBox="0 0 180 180" role="img" aria-label={`피자를 절반으로 나눠 ${selected.a}조각 처리`}><circle cx="90" cy="90" r="75" fill="#fff0ca" stroke="#d7a545" strokeWidth="4"/><path d="M90 15 A75 75 0 0 0 90 165 Z" fill="#72ad8a"/>{selected.a===2?<path d="M90 15 A75 75 0 0 1 90 165 Z" fill="#a3cfb3"/>:null}<line x1="90" y1="15" x2="90" y2="165" stroke="#fff" strokeWidth="4"/></svg><div><p><strong>a = {selected.a}</strong> · 실제 처리하는 조각 수</p><p><strong>b = {selected.b}</strong> · 각 조각의 크기는 원래의 1/{selected.b}</p><p><strong>f(n) ∝ n^{selected.d}</strong> · 나누고 합치는 수고비, d = {selected.d}</p><p><strong>{selected.answer}</strong></p></div></div><p>같은 크기의 조각으로 나눈다는 비유입니다. a는 자른 조각 수와 항상 같지는 않습니다.</p></div>
  return <><div className="algo-visual merge-workbench"><h3>8개 원소의 병합 정렬</h3><div className="merge-toolbar"><button disabled={step===0} onClick={()=>setStep(step-1)}>← 이전</button><span>{step+1} / {mergeFrames.length}</span><button disabled={step===mergeFrames.length-1} onClick={()=>setStep(step+1)}>다음 →</button><button onClick={()=>setStep(0)}>처음</button><button onClick={()=>setStep(mergeFrames.length-1)}>최종 결과</button></div><div className="merge-status" role="status"><strong>{step<4?'① 절반으로 분할':step===mergeFrames.length-1?'③ 정렬 완료':'② 작은 값부터 병합'}</strong><p>{frame.text}</p></div><div className="merge-overview"><h4>전체 리스트 · 테두리 하나가 부분 리스트 하나</h4><svg viewBox="0 0 640 140" role="img" aria-label={frame.groups.map(g=>'['+g.join(', ')+']').join(' ')}>{frame.groups.map((group,groupIndex)=>{const before=frame.groups.slice(0,groupIndex).reduce((s,g)=>s+g.length,0);return <g key={groupIndex}><rect x={before*78+5} y="8" width={group.length*78-10} height="122" rx="8" fill="#fff" stroke="#adc8b7"/>{group.map((value,i)=><g key={i}><rect x={(before+i)*78+23} y={112-value*9} width="36" height={value*9} rx="4" fill={step<4?'#6c96d4':'#5c9b75'}/><text x={(before+i)*78+41} y={104-value*9} textAnchor="middle" fontSize="15" fill="#334155">{value}</text></g>)}</g>})}</svg></div><div className="merge-fixed-work"><div className="merge-pointers"><div><strong>왼쪽 부분 리스트</strong>{bars(frame.left)}<span>{step<4?'분할 중':frame.left.length?'첫 막대부터 비교':'비어 있음'}</span></div><div><strong>오른쪽 부분 리스트</strong>{bars(frame.right)}<span>{step<4?'분할 중':frame.right.length?'첫 막대부터 비교':'비어 있음'}</span></div></div><div className="merge-result-fixed"><strong>↓ 작은 값 선택 → 현재 병합 결과</strong>{bars(frame.output)}<span>{step<4?'분할이 끝나면 병합을 시작합니다.':frame.output.length?'선택한 값이 왼쪽부터 쌓입니다.':'아직 선택한 값이 없습니다.'}</span></div></div><p className="merge-key">파랑: 분할 중 · 초록: 병합 단계 · 주황: 양쪽에서 다음으로 비교할 값</p></div><details><summary>전체 분할 트리 펼쳐 보기</summary><ListSplitTree values={input} depth={3}/></details><h3>Python 코드</h3><pre className="python-output"><code>{mergeCode}</code></pre></>
}
