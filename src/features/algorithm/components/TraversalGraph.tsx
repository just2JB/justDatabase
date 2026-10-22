import { traversalGraphs } from '../data/traversalGraphs'
import type { TraversalGraphKind } from '../data/traversalGraphs'

export function Graph({kind,selected=[],disabled=false,onSelect}:{kind:TraversalGraphKind;selected?:string[];disabled?:boolean;onSelect?:(node:string)=>void}) {
  const { edges, start, order, positions } = traversalGraphs[kind]
  const graphPositions = positions as Record<string, [number, number]>
  const names = [...new Set(edges.flat())].sort()
  return <><p>무방향 그래프 · {start}에서 시작 · 이웃은 {order === 'number' ? '번호 오름차순' : '알파벳순'}. DFS는 재귀 호출하며, BFS는 큐에 넣을 때 방문 처리합니다.</p><svg className="exam-graph" viewBox="0 0 500 300" role={onSelect?'group':'img'} aria-label={`${start}에서 시작하는 무방향 그래프. 간선: ${edges.map(pair=>pair.join('와 ')).join(', ')}`}>{edges.map(([a,b])=><line key={a+b} x1={graphPositions[a][0]} y1={graphPositions[a][1]} x2={graphPositions[b][0]} y2={graphPositions[b][1]} stroke="#adbdce" strokeWidth="2"/>)}{names.map(name=>{
    const selectedIndex=selected.indexOf(name)
    const unavailable=disabled||selectedIndex>=0
    return <g key={name} className={onSelect?'traversal-node':undefined} role={onSelect?'button':undefined} tabIndex={onSelect&&!unavailable?0:undefined} aria-label={onSelect?`${name} 노드${selectedIndex>=0?`, ${selectedIndex+1}번째 선택됨`:' 선택'}`:undefined} aria-disabled={onSelect?unavailable:undefined} onClick={onSelect?()=>{if(!unavailable)onSelect(name)}:undefined} onKeyDown={onSelect?event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();if(!unavailable)onSelect(name)}}:undefined}>
      <circle cx={graphPositions[name][0]} cy={graphPositions[name][1]} r="20" fill={selectedIndex>=0?'#0757ff':name===start?'#dceee2':'#edf4ff'} stroke={name===start?'#28775c':'#6c91c4'}/>
      <text x={graphPositions[name][0]} y={graphPositions[name][1]+5} textAnchor="middle" fill={selectedIndex>=0?'#fff':undefined}>{name}</text>
      {selectedIndex>=0?<g aria-hidden="true"><circle cx={graphPositions[name][0]+17} cy={graphPositions[name][1]-17} r="10" fill="#174e9c"/><text x={graphPositions[name][0]+17} y={graphPositions[name][1]-13} textAnchor="middle" fill="#fff" fontSize="11">{selectedIndex+1}</text></g>:null}
    </g>
  })}</svg><details><summary>연결 관계를 글로 확인</summary><p>{edges.map(pair=>pair.join('–')).join(' · ')}</p></details></>
}
