import { useState } from 'react'
import type { AnswerInputProps } from './ExamSession'
import { answerCellCount, readAnswerCells, checkAnswerRow } from '../quiz/structuredAnswers'
import type { StructuredQuestion } from '../quiz/structuredAnswers'
import './structured-answer.css'

export default function StructuredAnswer({ question, value, disabled, onChange, solution = false }: AnswerInputProps & { question: StructuredQuestion & { accepted?: string[] }; solution?: boolean }) {
  const [checked, setChecked] = useState<Record<number, boolean>>({})
  const cells = readAnswerCells(value, answerCellCount(question))
  function change(index: number, text: string) {
    const next = [...cells]
    next[index] = text
    if (question.answerTable) {
      const row = Math.floor(index / question.answerTable.columns.length)
      setChecked(previous => ({ ...previous, [row]: false }))
    }
    onChange(JSON.stringify(next))
  }
  const table = question.answerTable
  if (table) return <div className="structured-answer">
    {!solution ? <p>각 칸에 숫자를 하나씩 적으세요. 열의 [번호]는 전체 배열의 인덱스입니다. 표가 넓으면 가로로 스크롤하세요.</p> : null}
    <div className="structured-table-scroll" role="region" aria-label={solution ? '정렬 모범 답안 표' : '정렬 회전 답안 표'} tabIndex={0}>
      <table className="structured-answer-table">
        <caption>{solution ? '모범 답안 · 회전별 결과' : '회전별 답안 입력'}{table.initial ? ` · 입력 [${table.initial.join(', ')}]` : ''}</caption>
        <thead><tr><th scope="col">회전</th>{table.columns.map(column => <th scope="col" key={column}>{column}</th>)}</tr></thead>
        <tbody>{table.rows.map((row, rowIndex) => {
          const result = checkAnswerRow(table, value, question.accepted?.[0] ?? '', rowIndex)
          return <tr key={row}><th scope="row">{row}{table.checkRows && !solution && !disabled ? <div className="structured-row-check"><button type="button" aria-label={`${row} 정답 확인`} disabled={!result.ready} onClick={()=>setChecked(previous=>({...previous,[rowIndex]:true}))}>정답 확인</button>{checked[rowIndex] ? <span role="status">{result.correct}/{result.total} 정답</span> : null}</div> : null}</th>{table.columns.map((column, columnIndex) => {
          const index = rowIndex * table.columns.length + columnIndex
          const cellResult = checked[rowIndex] ? result.results[columnIndex] : undefined
          return <td key={column} data-cell-result={!solution && cellResult ? cellResult.correct ? 'correct' : 'incorrect' : undefined}>{solution ? cells[index] : <><input aria-label={`${row} ${column}`} inputMode="numeric" autoComplete="off" value={cells[index]} disabled={disabled} onChange={event => change(index, event.target.value.replace(/[^0-9-]/g, ''))}/>{cellResult ? <small className="structured-cell-answer">{cellResult.correct ? '정답' : `정답 ${cellResult.answer}`}</small> : null}</>}</td>
        })}</tr>})}</tbody>
      </table>
    </div>
  </div>
  return <div className="structured-answer structured-fields">{question.answerFields?.map((label, index) => <label key={label}><span>{label}</span>{solution ? <code>{cells[index]}</code> : <input autoComplete="off" autoCapitalize="none" spellCheck={false} value={cells[index]} disabled={disabled} onChange={event => change(index, event.target.value)}/>}</label>)}</div>
}
