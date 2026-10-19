import { useState } from 'react'
import type { Database } from 'sql.js'
import type { SqlResult } from '../data/sqlLessonData'

type Source = { name: string; data: SqlResult }
export type SourceTrace = { sql: string; refs: { name: string; alias: string; columns: string[] }[]; links: (string | number | null)[][]; grouped: boolean; limited: boolean; note?: string }

// 문자열·괄호 내부를 가려 바깥 SELECT문의 절만 찾습니다.
function outerSql(sql: string) {
  let depth = 0, quote = ''
  return [...sql].map(char => {
    if (quote) { if (char === quote) quote = ''; return ' ' }
    if (char === "'" || char === '"') { quote = char; return ' ' }
    if (char === '(') { depth++; return ' ' }
    if (char === ')') { depth--; return ' ' }
    return depth ? ' ' : char
  }).join('')
}

export function buildSourceTrace(db: Database, sql: string, sources: Source[]): SourceTrace {
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
    const projection = sql.slice(0, from.index).replace(/'([^']|'')*'/g, '').replace(/\bcount\s*\(\s*\*\s*\)/gi, 'count()').replace(/\bas\s+[a-z_]\w*/gi, '')
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

export default function SqlSourceTrace({ sources, trace }: { sources: Source[]; trace: SourceTrace | null }) {
  const [chosen, setChosen] = useState<number | null>(null)
  const selected = chosen !== null ? trace?.links[chosen] : undefined
  return <div className="sql-source-trace">
    {trace ? <div className="sql-trace-summary"><strong>실행한 SQL의 원본 연결</strong><pre>{trace.sql}</pre>{trace.note ? <p>{trace.note}</p> : null}{trace.refs.length ? <><p>파란 행: 조건에 참여한 원본 행 · 초록 열: SELECT에서 사용한 속성. 실행 후 입력을 수정해도 이 표시는 마지막 실행 기준입니다.</p><p>{trace.grouped ? '집계 전 원본 행을 표시합니다. GROUP BY·HAVING·DISTINCT 결과의 각 행과 일대일 대응하지 않습니다.' : '연결 묶음을 선택하면 함께 연결된 원본 행만 강조합니다.'} {trace.limited ? '연결은 처음 500개까지만 표시합니다.' : ''}</p><div className="sql-trace-links"><button type="button" aria-pressed={chosen === null} onClick={() => setChosen(null)}>참여 행 전체</button>{trace.links.map((link, index) => <button type="button" key={index} aria-pressed={chosen === index} onClick={() => setChosen(index)}>연결 {index + 1}: {link.map((key, i) => `${trace.refs[i].alias} #${key ?? 'NULL'}`).join(' ↔ ')}</button>)}</div>{!trace.links.length ? <p>조건에 참여한 원본 행이 없습니다.</p> : null}</> : null}</div> : <p className="visual-caption">SQL을 실행하면 연결된 원본 행과 SELECT에 사용한 열을 여기에 표시합니다.</p>}
    {sources.map(source => {
      const refs = trace?.refs.map((ref, index) => ({ ...ref, index })).filter(ref => ref.name === source.name) ?? []
      const columns = new Set(refs.flatMap(ref => ref.columns))
      const ids = new Set<string | number | null>(refs.flatMap(ref => selected ? [selected[ref.index]] : trace?.links.map(link => link[ref.index]) ?? []).filter(id => id !== null))
      return <article className="sql-source-table" key={source.name}><h4>{source.name}</h4><div className="table-wrap"><table className="sql-result-table"><caption>{source.name} 원본 · {source.data.rows.length}행</caption><thead><tr>{source.data.columns.map(column => <th key={column} scope="col" className={columns.has(column) ? 'sql-trace-column' : undefined}>{column}{columns.has(column) ? <small>SELECT</small> : null}</th>)}</tr></thead><tbody>{source.data.rows.map((row, index) => <tr key={index} className={ids.has(row[0]) ? 'sql-trace-row' : undefined}>{row.map((cell, col) => <td key={col} className={columns.has(source.data.columns[col]) ? 'sql-trace-column' : undefined}>{cell ?? 'NULL'}</td>)}</tr>)}</tbody></table></div></article>
    })}
  </div>
}
