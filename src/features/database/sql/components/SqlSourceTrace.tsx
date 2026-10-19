import { useState } from 'react'
import type { Database } from 'sql.js'
import type { SqlResult } from '../data/sqlLessonData'
import { tokenizeSql } from '../data/sqlTokens'
import { SqlTable } from './SqlLessonParts'
import './sql-subquery-trace.css'
import './sql-source-layout.css'

type Source = { name: string; data: SqlResult }
export type SourceTrace = { sql: string; refs: { name: string; alias: string; columns: string[] }[]; links: (string | number | null)[][]; grouped: boolean; limited: boolean; note?: string; subqueries?: { trace: SourceTrace; result?: SqlResult; note?: string }[] }

function maskedSql(sql: string) {
  return tokenizeSql(sql).map(token => token.kind === 'string' || token.kind === 'comment' ? token.text.replace(/[^\n]/g, ' ') : token.text).join('')
}

// 닫는 괄호를 만나는 순서대로 모아 가장 안쪽 SELECT부터 설명합니다.
function subqueryRanges(sql: string) {
  const masked = maskedSql(sql)
  const stack: number[] = [], ranges: { start: number; end: number }[] = []
  for (let index = 0; index < masked.length; index++) {
    if (masked[index] === '(') stack.push(index)
    if (masked[index] === ')') {
      const start = stack.pop()
      if (start !== undefined && /^\s*select\b/i.test(masked.slice(start + 1, index))) ranges.push({ start, end: index + 1 })
    }
  }
  return ranges
}

// 문자열·괄호 내부를 가려 바깥 SELECT문의 절만 찾습니다.
function outerSql(sql: string) {
  let depth = 0
  return maskedSql(sql).split('').map(char => {
    if (char === '(') { depth++; return ' ' }
    if (char === ')') { depth--; return ' ' }
    return depth ? ' ' : char
  }).join('')
}

function buildSourceTraceCore(db: Database, sql: string, sources: Source[]): SourceTrace {
  const empty: SourceTrace = { sql, refs: [], links: [], grouped: false, limited: false }
  try {
    const outer = outerSql(sql)
    if (!/^select\b/i.test(outer.trim()) || /\b(union|intersect|except)\b/i.test(outer)) return { ...empty, note: '이 구문의 원본 행 연결은 아직 지원하지 않습니다. 실행 결과는 위에서 확인하세요.' }
    const from = /\bfrom\b/i.exec(outer)
    if (!from) return { ...empty, note: '원본 테이블을 사용하지 않는 조회입니다.' }
    const tail = outer.slice(from.index)
    const end = /\b(where|group\s+by|having|order\s+by|limit)\b/i.exec(tail)
    const tablePart = tail.slice(0, end?.index ?? tail.length)
    const refs: SourceTrace['refs'] = []
    const pattern = /(?:\bfrom\b|\bjoin\b|,)\s*([a-z_]\w*)(?:\s+(?:as\s+)?([a-z_]\w*))?/gi
    const reserved = /^(?:left|right|inner|outer|cross|full|join|on|using|natural)$/i
    for (const match of tablePart.matchAll(pattern)) {
      const source = sources.find(item => item.name.toLowerCase() === match[1].toLowerCase())
      if (!source) return { ...empty, note: '파생 테이블 등 복잡한 FROM 구문은 아직 행 연결을 표시하지 않습니다.' }
      refs.push({ name: source.name, alias: match[2] && !reserved.test(match[2]) ? match[2] : match[1], columns: [] })
    }
    if (!refs.length || /\b(natural|using)\b/i.test(tablePart) || /\bfrom\s*\(/i.test(sql.slice(from.index))) return { ...empty, note: '이 조인 구문은 아직 행 연결을 표시하지 않습니다.' }
    let projection = sql.slice(0, from.index)
    for (const range of subqueryRanges(projection).sort((a, b) => b.start - a.start)) projection = projection.slice(0, range.start) + ' '.repeat(range.end - range.start) + projection.slice(range.end)
    projection = projection.replace(/'([^']|'')*'/g, '').replace(/\bcount\s*\(\s*\*\s*\)/gi, 'count()').replace(/\bas\s+[a-z_]\w*/gi, '')
    for (const ref of refs) {
      const source = sources.find(item => item.name === ref.name)!
      const tokens = projection.match(/[a-z_]\w*(?:\.[a-z_]\w*|\.\*)?|\*/gi) ?? []
      ref.columns = source.data.columns.filter(column => tokens.some(token => token === '*' || token.toLowerCase() === `${ref.alias}.${column}`.toLowerCase() || token.toLowerCase() === `${ref.alias}.*`.toLowerCase() || (token.toLowerCase() === column.toLowerCase() && refs.filter(other => sources.find(item => item.name === other.name)!.data.columns.includes(column)).length === 1)))
    }
    const stop = /\b(group\s+by|having|order\s+by|limit)\b/i.exec(tail)
    const clause = sql.slice(from.index, stop ? from.index + stop.index : undefined)
    const keys = refs.map(ref => `${ref.alias}.${sources.find(item => item.name === ref.name)!.data.columns[0]}`)
    const output = db.exec(`select ${keys.join(', ')} ${clause} limit 501`)[0]
    const links = (output?.values ?? []).map(row => row.map(value => typeof value === 'string' || typeof value === 'number' ? value : null))
    return { sql, refs, links: links.slice(0, 500), grouped: /\b(group\s+by|having|sum|avg|count|min|max)\s*\(?/i.test(outer + ' ' + projection), limited: links.length > 500, note: /\blimit\b/i.test(outer) ? '원본 강조는 LIMIT 적용 전 조건에 참여한 행을 표시합니다.' : undefined }
  } catch {
    return { ...empty, note: '실행은 완료됐지만 이 SQL의 원본 연결은 자동으로 해석할 수 없습니다.' }
  }
}

export function buildSourceTrace(db: Database, sql: string, sources: Source[]): SourceTrace {
  const trace = buildSourceTraceCore(db, sql, sources)
  trace.subqueries = subqueryRanges(sql).map(range => {
    const inner = sql.slice(range.start + 1, range.end - 1).trim()
    const innerTrace = buildSourceTraceCore(db, inner, sources)
    try {
      const output = db.exec(`select * from (${inner}) limit 101`)[0]
      const result: SqlResult = { columns: output?.columns ?? [], rows: (output?.values.slice(0, 100) ?? []).map(row => row.map(value => typeof value === 'string' || typeof value === 'number' ? value : null)) }
      return { trace: innerTrace, result, note: (output?.values.length ?? 0) > 100 ? '중간 결과는 처음 100행까지만 표시합니다.' : undefined }
    } catch {
      return { trace: innerTrace, note: '외부 행을 참조하는 상관 부속질의 등은 안쪽 SQL만 단독 실행할 수 없습니다. 이 단계의 보라색 행은 표시하지 않으며 바깥 질의의 참여 행만 확인할 수 있습니다.' }
    }
  })
  return trace
}

export default function SqlSourceTrace({ sources, trace }: { sources: Source[]; trace: SourceTrace | null }) {
  const [chosen, setChosen] = useState<number | null>(null)
  const [innerIndex, setInnerIndex] = useState(0)
  const [allColumns, setAllColumns] = useState(false)
  const selected = chosen !== null ? trace?.links[chosen] : undefined
  const inner = trace?.subqueries?.[innerIndex]
  return <div className="sql-source-trace">
    <div className="sql-source-toolbar"><div className="sql-trace-legend"><span className="sql-legend-outer">바깥 참여 행</span><span className="sql-legend-inner">안쪽 참여 행</span><span className="sql-legend-column">SELECT 열</span></div><button type="button" aria-pressed={allColumns} onClick={() => setAllColumns(value => !value)}>{allColumns ? '핵심 열만 보기' : '전체 열 보기'}</button></div>
    {trace ? <div className="sql-trace-summary sql-trace-summary-compact">
      <details><summary>실행한 SQL · 분석 안내</summary><pre>{trace.sql}</pre><p>마지막 실행 기준입니다. {trace.grouped ? '강조는 집계 전 참여 행으로, GROUP BY·HAVING 결과와 일대일 대응하지 않습니다.' : '연결을 선택하면 해당 조합의 원본 행을 강조합니다.'} {trace.limited ? '연결은 처음 500개까지만 표시합니다.' : ''}</p></details>
      {trace.note ? <p>{trace.note}</p> : null}
      {trace.refs.length ? <div className="sql-trace-connection-picker"><label>연결<select value={chosen ?? 'all'} onChange={event => setChosen(event.target.value === 'all' ? null : Number(event.target.value))}><option value="all">참여 행 전체 · {trace.links.length}개 연결</option>{trace.links.map((link, index) => <option key={index} value={index}>{link.map((key, i) => `${trace.refs[i].alias} #${key ?? 'NULL'}`).join(' ↔ ')}</option>)}</select></label>{!trace.links.length ? <span>조건에 맞는 행 없음</span> : null}</div> : null}
    </div> : <p className="visual-caption">실행하면 참여 행과 SELECT 열을 강조합니다. 기본은 핵심 열이며 나머지는 ‘전체 열 보기’에서 확인하세요.</p>}
    {trace?.subqueries?.length ? <section className="sql-inner-trace" aria-label="부속질의의 중간 결과표">
      <header className="sql-inner-heading"><strong>부속질의 결과 따라가기</strong><small>안쪽부터 바깥으로 · 단계 선택 시 원본 강조</small></header>
      <div className="sql-inner-result-grid">{trace.subqueries.map((stage, index) => <article className="sql-inner-result-card" key={index} data-selected={innerIndex === index}>
        <header><div><span>단계 {index + 1}</span><h4>{stage.trace.refs.length ? [...new Set(stage.trace.refs.map(ref => ref.name))].join(' · ') : '부속질의'}</h4></div><button type="button" aria-pressed={innerIndex === index} onClick={() => setInnerIndex(index)}>{innerIndex === index ? '강조 중' : '원본 강조'}</button></header>
        {stage.result ? <SqlTable data={stage.result} caption={`단계 ${index + 1}이 바깥으로 넘기는 결과`}/> : <p className="sql-inner-unavailable">외부 행에 따라 달라지는 등 단독 결과를 계산할 수 없는 단계입니다.</p>}
        {stage.note ? <p>{stage.note}</p> : null}
        <details><summary>이 표를 만든 SQL</summary><pre className="sql-code">{stage.trace.sql}</pre></details>
      </article>)}</div>
      {inner?.trace.note ? <p>{inner.trace.note}</p> : null}
      {inner?.trace.grouped ? <p>보라색은 선택한 단계의 집계 전 원본 행이며, 결과표는 계산 후 값입니다.</p> : null}
      <details className="sql-inner-explanation"><summary>색상과 결과표 읽는 법</summary><p>보라색은 선택한 단계, 파란색은 바깥 질의의 참여 행입니다. 양쪽 참여 시 두 색과 ‘바깥·안쪽’ 표시가 나옵니다. 단계별 결과는 조회 결과이며 새 테이블로 저장되지 않습니다. 안쪽부터 나열한 설명 순서는 DBMS의 물리적 실행 순서를 뜻하지 않습니다.</p></details>
    </section> : null}
    <div className="sql-original-grid">{sources.map(source => {
      const refs = trace?.refs.map((ref, index) => ({ ...ref, index })).filter(ref => ref.name === source.name) ?? []
      const columns = new Set(refs.flatMap(ref => ref.columns))
      const ids = new Set<string | number | null>(refs.flatMap(ref => selected ? [selected[ref.index]] : trace?.links.map(link => link[ref.index]) ?? []).filter(id => id !== null))
      const innerRefs = inner?.result ? inner.trace.refs.map((ref, index) => ({ ...ref, index })).filter(ref => ref.name === source.name) : []
      const innerIds = new Set<string | number | null>((innerRefs ?? []).flatMap(ref => inner!.trace.links.map(link => link[ref.index])).filter(id => id !== null))
      const innerColumns = new Set((innerRefs ?? []).flatMap(ref => ref.columns))
      const core = new Set(['name', 'bookname', 'title', 'publisher', 'category', 'price', 'saleprice', 'fee', 'paid_fee', 'address', 'city'])
      const visible = source.data.columns.flatMap((column, index) => allColumns || index === 0 || /id$/i.test(column) || core.has(column) || columns.has(column) || innerColumns.has(column) ? [index] : [])
      return <article className="sql-source-table" key={source.name}><header className="sql-original-heading"><h4>{source.name}</h4><span>{source.data.rows.length}행 · {visible.length}/{source.data.columns.length}열</span></header><div className="table-wrap" tabIndex={0} role="region" aria-label={`${source.name} 원본 데이터 · 표 안에서 스크롤`}><table className="sql-result-table"><caption className="sr-only">{source.name} 원본 · {source.data.rows.length}행</caption><thead><tr>{visible.map(col => { const column = source.data.columns[col]; return <th key={column} scope="col" className={columns.has(column) ? 'sql-trace-column' : undefined}>{column}{columns.has(column) ? <small>바깥 SELECT</small> : null}{innerColumns.has(column) ? <small className="sql-inner-column-label">안쪽 SELECT</small> : null}</th> })}</tr></thead><tbody>{source.data.rows.map((row, index) => <tr key={index} className={`${ids.has(row[0]) ? 'sql-trace-row' : ''} ${innerIds.has(row[0]) ? 'sql-trace-inner-row' : ''}`}>{visible.map(col => <td key={col} className={columns.has(source.data.columns[col]) ? 'sql-trace-column' : undefined}>{row[col] ?? 'NULL'}{col === 0 && innerIds.has(row[0]) ? <small className="sql-inner-row-label">{ids.has(row[0]) ? '바깥·안쪽' : '안쪽'}</small> : null}</td>)}</tr>)}</tbody></table></div></article>
    })}</div>
  </div>
}
