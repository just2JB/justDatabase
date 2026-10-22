import { Graph } from './TraversalGraph'
import { traversalGraphs } from '../data/traversalGraphs'
import type { TraversalGraphKind } from '../data/traversalGraphs'
import './traversal-practice.css'

export default function TraversalAnswer({ kind, value, disabled, onChange }: {
  kind: TraversalGraphKind
  value: string
  disabled: boolean
  onChange: (value: string) => void
}) {
  const graph = traversalGraphs[kind]
  const nodes = [...new Set(graph.edges.flat())].sort((a, b) =>
    graph.order === 'number' ? Number(a) - Number(b) : a.localeCompare(b))
  const selected = [...new Set((value.toUpperCase().match(/[A-Z]|\d+/g) ?? []).filter(node => nodes.includes(node)))]

  function select(node: string) {
    if (!disabled && !selected.includes(node)) onChange([...selected, node].join(' '))
  }

  return <div className="traversal-answer">
    <p className="traversal-instruction">그래프의 노드 또는 아래 버튼을 방문할 순서대로 클릭하세요.</p>
    <Graph kind={kind} selected={selected} disabled={disabled} onSelect={select} />
    <div className="traversal-node-picker" role="group" aria-label="방문할 노드 선택">
      {nodes.map(node => <button type="button" key={node} disabled={disabled || selected.includes(node)} onClick={() => select(node)} aria-label={`${node} 노드 선택`}>{node}</button>)}
    </div>
    <div className="traversal-sequence" role="status" aria-label="선택한 방문 순서" aria-live="polite">
      <span>선택한 순서 · {selected.length}/{nodes.length}</span>
      {selected.length ? <ol>{selected.map((node, index) => <li key={node}><small>{index + 1}</small><strong>{node}</strong></li>)}</ol> : <p>아직 선택한 노드가 없습니다.</p>}
    </div>
    <div className="traversal-edit-actions">
      <button type="button" disabled={disabled || !selected.length} onClick={() => onChange(selected.slice(0, -1).join(' '))}>마지막 선택 취소</button>
      <button type="button" disabled={disabled || !selected.length} onClick={() => onChange('')}>선택 초기화</button>
    </div>
  </div>
}
