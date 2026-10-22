import { useId } from 'react'
import { traversalGraphs } from '../data/traversalGraphs'
import type { TraversalGraph, TraversalGraphKind } from '../data/traversalGraphs'

export function Graph({kind,selected=[],disabled=false,onSelect}:{kind:TraversalGraphKind;selected?:string[];disabled?:boolean;onSelect?:(node:string)=>void}) {
  const marker = useId().replace(/:/g, '')
  const { edges, start, order, positions, directed } = traversalGraphs[kind] as TraversalGraph
  const names = [...new Set(edges.flat())].sort()
  const description = directed ? '방향 그래프 · 화살표는 출발 → 도착입니다. 매번 진입 차수 0인 후보 중 알파벳이 가장 빠른 노드를 선택합니다.'
    : `무방향 그래프 · ${start}에서 시작 · 이웃은 ${order === 'number' ? '번호 오름차순' : '알파벳순'}. DFS는 재귀 호출하며, BFS는 큐에 넣을 때 방문 처리합니다.`
  return <><p>{description}</p><svg className="exam-graph" viewBox={kind.startsWith('mock') ? '0 0 610 310' : '0 0 500 300'} role={onSelect?'group':'img'} aria-label={`${directed ? '방향' : '무방향'} 그래프. 간선: ${edges.map(pair=>pair.join(directed?'에서 ':'와 ')).join(', ')}`}>
    {directed ? <defs><marker id={marker} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#657d99"/></marker></defs> : null}
    {edges.map(([a,b])=>{
      const [x1,y1]=positions[a], [x2,y2]=positions[b]
      const length=Math.hypot(x2-x1,y2-y1)
      const offset=directed?26:0
      return <line key={`${a}-${b}`} x1={x1+(x2-x1)*offset/length} y1={y1+(y2-y1)*offset/length} x2={x2-(x2-x1)*offset/length} y2={y2-(y2-y1)*offset/length} stroke="#8b9fb5" strokeWidth="2.5" markerEnd={directed?`url(#${marker})`:undefined}/>
    })}
    {names.map(name=>{
      const selectedIndex=selected.indexOf(name)
      const unavailable=disabled||selectedIndex>=0
      return <g key={name} className={onSelect?'traversal-node':undefined} role={onSelect?'button':undefined} tabIndex={onSelect&&!unavailable?0:undefined} aria-label={onSelect?`${name} 노드${selectedIndex>=0?`, ${selectedIndex+1}번째 선택됨`:' 선택'}`:undefined} aria-disabled={onSelect?unavailable:undefined} onClick={onSelect?()=>{if(!unavailable)onSelect(name)}:undefined} onKeyDown={onSelect?event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();if(!unavailable)onSelect(name)}}:undefined}>
        <circle cx={positions[name][0]} cy={positions[name][1]} r="23" fill={selectedIndex>=0?'#0757ff':name===start?'#dceee2':'#edf4ff'} stroke={name===start?'#28775c':'#6c91c4'}/>
        <text x={positions[name][0]} y={positions[name][1]+6} textAnchor="middle" fontSize="19" fill={selectedIndex>=0?'#fff':undefined}>{name}</text>
        {selectedIndex>=0?<g aria-hidden="true"><circle cx={positions[name][0]+20} cy={positions[name][1]-20} r="11" fill="#174e9c"/><text x={positions[name][0]+20} y={positions[name][1]-16} textAnchor="middle" fill="#fff" fontSize="11">{selectedIndex+1}</text></g>:null}
      </g>
    })}</svg><details><summary>연결 관계를 글로 확인</summary><p>{edges.map(pair=>pair.join(directed?' → ':'–')).join(' · ')}</p></details></>
}
