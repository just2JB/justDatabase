import { useState } from 'react'
import { relationScenarios } from '../data/relationExampleData'
import type { ExampleRelation } from '../data/relationExampleData'

type Reference = { table: string; column: string; value: string | number }

function ExampleTable({ relation, selected, onSelect }: { relation: ExampleRelation; selected: Reference | null; onSelect: (value: Reference | null) => void }) {
  return <article className="example-relation" id={`example-${relation.id}`}><div className="example-relation-heading"><h4>{relation.name} 릴레이션</h4><span>차수 {relation.columns.length} · 카디널리티 {relation.rows.length}</span></div><div className="table-wrap"><table><caption>{relation.name}({relation.columns.map(column => column.name).join(', ')})</caption><thead><tr>{relation.columns.map(column => <th scope="col" key={column.name}>{column.name}{column.key ? <small className={`relation-key-label ${column.references ? 'foreign' : ''}`}>{column.key}</small> : null}</th>)}</tr></thead><tbody>{relation.rows.map((row, index) => <tr key={index}>{row.map((value, columnIndex) => {
    const column = relation.columns[columnIndex]
    const target = value !== null && column.references ? { ...column.references, value } : null
    const isMatch = selected && value === selected.value && ((relation.id === selected.table && column.name === selected.column) || (column.references?.table === selected.table && column.references.column === selected.column))
    return <td key={column.name} className={isMatch ? 'reference-match' : ''}>{target ? <button type="button" className="reference-value" aria-label={`${column.name} ${value}, 참조하는 기본키 강조`} aria-pressed={Boolean(isMatch)} onClick={() => onSelect(isMatch ? null : target)}>{value}</button> : value === null ? <span className="null-value">NULL</span> : value}</td>
  })}</tr>)}</tbody></table></div><p className="example-relation-note">{relation.note}</p></article>
}

export default function RelationExamples() {
  const [selected, setSelected] = useState<Reference | null>(null)
  const targetName = relationScenarios.flatMap(scenario => scenario.relations).find(relation => relation.id === selected?.table)?.name
  return <div id="relation-examples" className="relation-examples"><h3>여러 릴레이션으로 이해하기</h3><p className="dbs-section-intro">학교·쇼핑·도서관의 10개 표를 비교해 보세요. 각 예시의 기본키와 외래키는 이해를 위해 정한 조건입니다.</p><div className="example-legend"><span><strong>PK</strong> 기본키</span><span><strong>FK</strong> 외래키</span><span><strong>PK·FK</strong> 기본키의 구성 속성이면서 외래키</span></div><div className="reference-help" role="status">{selected ? <><strong>{targetName}.{selected.column} = {selected.value}</strong>에 연결되는 칸을 강조했습니다.<button type="button" onClick={() => setSelected(null)}>강조 해제</button></> : '파란 외래키 값을 누르면 참조하는 표의 기본키와 연결된 값이 함께 강조됩니다.'}</div>{relationScenarios.map(scenario => <section key={scenario.id} id={`examples-${scenario.id}`} className="relation-scenario" aria-labelledby={`scenario-title-${scenario.id}`}><h4 id={`scenario-title-${scenario.id}`}>{scenario.title}</h4><p>{scenario.description}</p><div className="example-relations">{scenario.relations.map(relation => <ExampleTable key={relation.id} relation={relation} selected={selected} onSelect={setSelected} />)}</div></section>)}</div>
}
