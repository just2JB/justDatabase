import { useDiagramMotion } from '../../../shared/hooks/useDiagramMotion'
import type { Column, Student, TableState } from './languageLab'

export function LanguageTable({ title, state, highlight = [], selected = [], version = 0 }: { title: string; state: TableState; highlight?: number[]; selected?: (keyof Student)[]; version?: number }) {
  const motion = useDiagramMotion(`${version}:${state.rows.map(row => `${row.student_id}-${row.grade}`).join(',')}:${state.columns.length}`)
  return <div className="language-table-card" ref={motion}>
    <header><strong>{title}</strong><span>{state.exists ? `${state.columns.length}열 · ${state.rows.length}행` : '테이블 없음'}</span></header>
    {!state.exists ? <div className="language-empty"><span aria-hidden="true">▱</span><strong>Student가 없습니다</strong><p>테이블 정의와 데이터가 없는 상태입니다.</p></div> : <>
      <div className="language-schema" aria-label="Student 열 구조">{state.columns.map(column => <div className={selected.includes(column.key) ? 'is-selected' : ''} key={column.key}><strong>{column.key}{column.constraint?.includes('PRIMARY KEY') ? ' 🔑' : ''}</strong><span>{column.type}</span><small>{column.constraint || (column.key === 'email' ? 'NULL 허용' : '')}</small></div>)}</div>
      <div className="table-wrap"><table><caption className="sr-only">{title} Student 릴레이션</caption><thead><tr>{state.columns.map(column => <th scope="col" key={column.key} className={selected.includes(column.key) ? 'language-selected-column' : ''}>{column.key}</th>)}</tr></thead><tbody>{state.rows.map(row => <tr key={row.student_id} data-motion-id={`student-${row.student_id}`} className={highlight.includes(row.student_id) ? 'language-highlight' : ''}>{state.columns.map(column => <td key={column.key} className={selected.includes(column.key) ? 'language-selected-column' : ''}>{row[column.key] == null ? <em>NULL</em> : row[column.key]}</td>)}</tr>)}{!state.rows.length ? <tr><td colSpan={state.columns.length} className="language-no-rows">구조는 있지만 저장된 행은 없습니다.</td></tr> : null}</tbody></table></div>
    </>}
  </div>
}

export function CommandPicker<T extends string>({ commands, value, onChange, label }: { commands: readonly T[]; value: T; onChange: (command: T) => void; label: string }) {
  return <div className="language-command-picker" role="group" aria-label={label}>{commands.map(command => <button type="button" key={command} aria-pressed={value === command} onClick={() => onChange(command)}>{command}</button>)}</div>
}

export function Grammar({ syntax, sql }: { syntax: string; sql: string }) {
  return <div className="language-grammar"><details><summary>문법 틀 보기</summary><pre><code>{syntax}</code></pre></details><span className="language-code-label">선택한 조건으로 만든 SQL</span><pre className="sql-code"><code>{sql}</code></pre></div>
}

export function tableState(rows: Student[], tableColumns: Column[]): TableState { return { exists: true, columns: tableColumns, rows } }
