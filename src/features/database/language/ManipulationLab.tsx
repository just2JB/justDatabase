import { useState } from 'react'
import { CommandPicker, Grammar, LanguageTable, tableState } from './LanguageParts'
import { columns, manipulate, manipulationCommands, manipulationSql, matchingIds, students } from './languageLab'
import type { ManipulationCommand, ManipulationInput, Student } from './languageLab'

const initialInput: ManipulationInput = { command: 'SELECT', selectedColumns: ['student_id', 'name'], minGrade: 2, studentId: 107, name: '한유진', grade: 3, allRows: false }
const descriptions: Record<ManipulationCommand, [string, string]> = {
  SELECT: ['조건에 맞는 행과 필요한 열 조회', 'SELECT 열목록\nFROM 테이블명\nWHERE 조건;'],
  INSERT: ['새로운 행 추가', 'INSERT INTO 테이블명 (열목록)\nVALUES (값목록);'],
  UPDATE: ['조건에 맞는 행의 값 수정', 'UPDATE 테이블명\nSET 열이름 = 새값\nWHERE 조건;'],
  DELETE: ['조건에 맞는 행 삭제', 'DELETE FROM 테이블명\nWHERE 조건;'],
}
type Run = ReturnType<typeof manipulate> & { before: Student[]; input: ManipulationInput; serial: number }
export default function ManipulationLab() {
  const [rows, setRows] = useState<Student[]>(students)
  const [input, setInput] = useState(initialInput)
  const [run, setRun] = useState<Run | null>(null)
  const [serial, setSerial] = useState(0)
  const targetIds = input.command === 'INSERT' ? [] : matchingIds(rows, input)
  function change(patch: Partial<ManipulationInput>) { setInput(previous => ({ ...previous, ...patch })); setRun(null) }
  function execute() {
    const result = manipulate(rows, input)
    setRun({ ...result, before: rows, input, serial: serial + 1 })
    setRows(result.rows)
    setSerial(serial + 1)
  }
  const outputColumns = input.command === 'SELECT' ? columns.filter(column => input.selectedColumns.includes(column.key)).map(({ key, type }) => ({ key, type })) : columns
  return <div className="language-lab" data-testid="dml-lab">
    <CommandPicker commands={manipulationCommands} value={input.command} label="DML 명령 선택" onChange={command => change({ command, studentId: command === 'INSERT' ? 107 : 102 })}/>
    <div className="language-instruction"><h3>{input.command} · {descriptions[input.command][0]}</h3><p>6명의 학생으로 시작합니다. 실행 결과는 다음 명령에도 이어집니다. 파란 행은 현재 조건의 대상입니다.</p></div>
    <div className="language-fields">
      {input.command === 'SELECT' ? <>
        <label>학년 조건 · grade ≥<select value={input.minGrade} onChange={event => change({ minGrade: Number(event.target.value) })}>{[1, 2, 3, 4].map(grade => <option key={grade}>{grade}</option>)}</select></label>
        <fieldset className="language-columns"><legend>조회할 열</legend>{columns.map(column => <label key={column.key}><input type="checkbox" checked={input.selectedColumns.includes(column.key)} disabled={input.selectedColumns.length === 1 && input.selectedColumns.includes(column.key)} onChange={() => change({ selectedColumns: input.selectedColumns.includes(column.key) ? input.selectedColumns.filter(key => key !== column.key) : [...input.selectedColumns, column.key] })}/>{column.key}</label>)}</fieldset>
      </> : <>
        <label>{input.command === 'INSERT' ? '새 학생 학번' : '조건 학번 · student_id ='}<input type="number" min="1" step="1" value={Number.isNaN(input.studentId) ? '' : input.studentId} disabled={input.command !== 'INSERT' && input.allRows} onChange={event => change({ studentId: event.target.value === '' ? NaN : Number(event.target.value) })}/></label>
        {input.command === 'INSERT' ? <label>이름<input value={input.name} maxLength={30} onChange={event => change({ name: event.target.value })}/></label> : <label className="language-check"><input type="checkbox" checked={input.allRows} onChange={event => change({ allRows: event.target.checked })}/>WHERE 조건 없이 전체 행 대상</label>}
        {input.command !== 'DELETE' ? <label>{input.command === 'UPDATE' ? '바꿀 학년' : '학년'}<select value={input.grade} onChange={event => change({ grade: Number(event.target.value) })}>{[1, 2, 3, 4].map(grade => <option key={grade}>{grade}</option>)}</select></label> : null}
      </>}
    </div>
    {input.allRows && ['UPDATE', 'DELETE'].includes(input.command) ? <p className="language-notice">WHERE가 없습니다. 현재 저장된 {rows.length}행 전체가 대상입니다.</p> : null}
    <Grammar syntax={descriptions[input.command][1]} sql={manipulationSql(input)}/>
    <div className="language-actions"><button type="button" className="quiz-primary" onClick={execute}>데이터 동작 실행</button><button type="button" className="visual-button" onClick={() => { setRows(students); setInput(initialInput); setRun(null); setSerial(0) }}>학생 6명으로 초기화</button></div>
    <p className={`language-status ${run?.error ? 'is-error' : ''}`} role="status">{run ? `${run.error ? run.error + ' ' : ''}${run.message}` : input.command === 'INSERT' ? '새 학번과 이름을 정하고 실행해 보세요. 기존 학번을 넣으면 기본키 중복도 확인할 수 있습니다.' : `현재 조건에 맞는 행: ${targetIds.length}개. 실행하면 오른쪽에서 결과를 확인할 수 있습니다.`}</p>
    <div className="language-comparison">
      <LanguageTable title={run ? '실행 전 · 원본 Student' : '현재 Student · 대상 미리 보기'} state={tableState(run?.before ?? rows, columns)} highlight={run?.ids ?? targetIds} selected={input.command === 'SELECT' ? input.selectedColumns : []}/>
      {run ? <div className="language-after" key={run.serial}><LanguageTable title={input.command === 'SELECT' ? '조회 결과 · 원본은 그대로' : '실행 후 · Student'} state={tableState(input.command === 'SELECT' ? run.result : run.rows, outputColumns)} highlight={run.ids} version={run.serial}/></div> : <div className="language-result-placeholder"><span aria-hidden="true">→</span><strong>실행하면 결과가 여기에 나타납니다</strong><p>{input.command === 'SELECT' ? '필요한 행과 열만 결과로 보여줍니다.' : '실행 전과 후의 행을 비교해 보세요.'}</p></div>}
    </div>
  </div>
}
