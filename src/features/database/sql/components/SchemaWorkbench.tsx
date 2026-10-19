import { useEffect, useRef, useState } from 'react'
import type { SqlJsStatic } from 'sql.js'
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url'
import { MysqlPractice } from '../engine/mysqlPractice'
import type { PracticeRun } from '../engine/mysqlPractice'
import { schemaExercises } from '../data/schemaExercises'
import { SqlTable } from './SqlLessonParts'
import './schema-workbench.css'

let sqlRuntime: Promise<SqlJsStatic> | undefined
function runtime() {
  if (!sqlRuntime) sqlRuntime = import('sql.js').then(module => module.default({ locateFile: () => sqlWasmUrl })).catch(error => { sqlRuntime = undefined; throw error })
  return sqlRuntime
}
type Inspection = ReturnType<MysqlPractice['inspect']>
const groups = [...new Set(schemaExercises.map(exercise => exercise.group))]

export default function SchemaWorkbench() {
  const engine = useRef<MysqlPractice | null>(null)
  const generation = useRef(0)
  const [exerciseId, setExerciseId] = useState('database')
  const [group, setGroup] = useState('all')
  const exercise = schemaExercises.find(item => item.id === exerciseId)!
  const visibleExercises = schemaExercises.filter(item => group === 'all' || item.group === group)
  const [sql, setSql] = useState(exercise.starter)
  const [busy, setBusy] = useState(true)
  const [run, setRun] = useState<PracticeRun | null>(null)
  const [dbName, setDbName] = useState('madang')
  const [databases, setDatabases] = useState<string[]>([])
  const [tables, setTables] = useState<string[]>([])
  const [table, setTable] = useState('')
  const [inspection, setInspection] = useState<Inspection | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [confirmAnswer, setConfirmAnswer] = useState(false)
  function refresh(instance: MysqlPractice, preferred = '') {
    const names = instance.tables(), target = names.includes(preferred) ? preferred : names[0] ?? ''
    setDatabases(instance.names()); setDbName(instance.current); setTables(names); setTable(target)
    setInspection(target ? instance.inspect(target) : null)
  }
  async function reset(id: string) {
    const token = ++generation.current
    engine.current?.close(); engine.current = null
    const task = schemaExercises.find(item => item.id === id)!
    setExerciseId(id); setSql(task.starter); setBusy(true); setRun(null); setInspection(null); setShowAnswer(false); setConfirmAnswer(false)
    try {
      const instance = new MysqlPractice(await runtime())
      if (token !== generation.current) { instance.close(); return }
      if (task.setup) { const prepared = instance.run(task.setup); if (prepared.error) { instance.close(); throw new Error(`선행 테이블 준비 실패: ${prepared.error}`) } }
      engine.current = instance; refresh(instance, task.setup.match(/(?:CREATE\s+TABLE|ALTER\s+TABLE)\s+([\w]+)/i)?.[1])
    } catch (error) { if (token === generation.current) setRun({ executions: [], error: error instanceof Error ? error.message : '실습 DB를 준비하지 못했습니다.' }) }
    finally { if (token === generation.current) setBusy(false) }
  }
  useEffect(() => { void reset('database'); return () => { generation.current++; engine.current?.close(); engine.current = null } }, [])
  function execute() {
    const instance = engine.current
    if (!instance || busy) return
    const oldTables = instance.tables(), result = instance.run(sql)
    setRun(result); setShowAnswer(false); setConfirmAnswer(false)
    const added = instance.tables().find(name => !oldTables.includes(name))
    refresh(instance, added ?? table)
  }
  function selectDatabase(name: string) {
    const instance = engine.current; if (!instance) return
    const result = instance.run(`USE ${name};`); setRun(result); refresh(instance)
  }
  return <div className="schema-workbench">
    <header><h3>정의어부터 직접 실행하기</h3><p>새 DB 준비부터 CREATE·ALTER·DROP, 데이터 삽입·수정·삭제까지 이어서 실습합니다.</p></header>
    <p className="schema-session-note">추가 연습 24문제 · CREATE·ALTER·DROP·INSERT·UPDATE·DELETE 각 4문제. 자료 예제와 함께 분류별로 선택할 수 있습니다.</p>
    <div className="schema-exercise-picker">
      <label className="sql-runner-label">문제 분류<select value={group} disabled={busy} onChange={event => { const next = event.target.value; setGroup(next); const first = schemaExercises.find(item => next === 'all' || item.group === next); if (first && (next !== 'all' && exercise.group !== next)) void reset(first.id) }}><option value="all">전체 · {schemaExercises.length}문제</option>{groups.map(item => <option key={item} value={item}>{item} · {schemaExercises.filter(exercise => exercise.group === item).length}문제</option>)}</select></label>
      <label className="sql-runner-label">실습 문제 선택<select value={exerciseId} disabled={busy} onChange={event => void reset(event.target.value)}>{groups.filter(item => group === 'all' || group === item).map(item => <optgroup label={item} key={item}>{visibleExercises.filter(exercise => exercise.group === item).map(exercise => <option key={exercise.id} value={exercise.id}>{exercise.title}</option>)}</optgroup>)}</select></label>
    </div>
    <div className="schema-task"><span>{exercise.source}</span><h4>{exercise.title}</h4><p>{exercise.task}</p>{!exercise.id.startsWith('command-') || run ? <small>{exercise.tip}</small> : null}</div>
    <p className="schema-session-note">문제를 바꾸면 선행 테이블을 준비한 새 실습 DB로 시작합니다. 같은 문제에서는 실행한 변경이 누적됩니다. 저장 내용은 새로고침하면 초기화됩니다.</p>
    <label className="sql-runner-label" htmlFor="schema-sql-input">SQL 입력 · 세미콜론으로 여러 문장 실행 가능</label><textarea id="schema-sql-input" className="sql-runner-input" value={sql} disabled={busy} spellCheck={false} onChange={event => setSql(event.target.value)} onKeyDown={event => { if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); execute() } }}/>
    <div className="sql-runner-actions"><button type="button" className="quiz-primary" disabled={busy || !engine.current} onClick={execute}>{busy ? '실습 DB 준비 중…' : 'SQL 실행'}</button><button type="button" className="visual-button" disabled={busy} onClick={() => { setSql(exercise.starter); setRun(null) }}>입력만 초기화</button><button type="button" className="visual-button" disabled={busy} onClick={() => void reset(exerciseId)}>이 문제 처음부터</button>{exercise.answer ? <button type="button" className="visual-button" aria-expanded={showAnswer} onClick={() => showAnswer ? setShowAnswer(false) : setConfirmAnswer(true)}>{showAnswer ? '모범답안 숨기기' : '모범답안 보기'}</button> : null}</div>
    {showAnswer ? <div className="sql-model-answer"><strong>모범답안 · 문제 조건에 맞춘 예시</strong><pre><code>{exercise.answer}</code></pre><button type="button" className="visual-button" onClick={() => { setSql(exercise.answer); setRun(null) }}>답안을 입력창에 넣기</button></div> : null}
    <div className="schema-run-results" aria-live="polite">{run?.executions.map((execution, index) => <div className="schema-execution" key={index}><strong>✓ {index + 1}. {execution.message}</strong><details><summary>실행한 문장</summary><pre><code>{execution.sql}</code></pre></details>{execution.data ? <SqlTable data={execution.data} caption={`실행 결과 ${index + 1}`}/> : null}</div>)}{run?.error ? <div className="sql-runner-error" role="alert"><strong>실행 오류</strong><p>{run.error}</p>{run.failedSql ? <pre><code>{run.failedSql}</code></pre> : null}{run.executions.length ? <p>앞의 {run.executions.length}개 문장은 실행되었습니다. 오류가 난 문장부터 뒤의 문장은 실행하지 않았습니다.</p> : null}</div> : null}</div>
    <section className="schema-inspector" aria-label="실습 DB 현재 상태"><header><h4>실행 후 DB 상태</h4><span>{dbName}</span></header><div className="schema-inspector-selects"><label>선택 DB<select value={dbName} disabled={busy} onChange={event => selectDatabase(event.target.value)}>{databases.map(name => <option key={name}>{name}</option>)}</select></label><label>테이블 · {tables.length}개<select value={table} disabled={busy || !tables.length} onChange={event => { setTable(event.target.value); setInspection(engine.current!.inspect(event.target.value)) }}>{tables.length ? tables.map(name => <option key={name}>{name}</option>) : <option value="">테이블 없음</option>}</select></label></div>{inspection ? <><SqlTable data={inspection.structure} caption={`${table} 구조 · DESC`}/><SqlTable data={inspection.rows} caption={`${table} 저장된 데이터 · 최대 100행`}/>{inspection.foreignKeys.rows.length ? <details><summary>외래키 연결과 삭제·수정 규칙 보기</summary><SqlTable data={inspection.foreignKeys} caption="외래키 · table=참조 테이블, from/to=연결 열"/></details> : null}</> : <p className="sql-runner-empty">{busy ? '실습 DB를 준비하고 있습니다.' : '이 DB에는 테이블이 없습니다. CREATE TABLE로 테이블을 만들어 보세요.'}</p>}</section>
    <details className="schema-engine-note"><summary>지원 문법과 MySQL과의 차이</summary><p>브라우저 안의 SQLite에 자료 범위의 MySQL 호환 처리를 추가했습니다. CREATE DATABASE·USE·SHOW·DESC·AUTO_INCREMENT·MODIFY·CHANGE·ADD PRIMARY KEY·RENAME을 연습할 수 있습니다. 실제 MySQL 서버에 연결되는 것은 아닙니다.</p><p>기본키·NOT NULL·UNIQUE·CHECK·외래키와 ON DELETE CASCADE는 실습 DB에서 검사합니다. VARCHAR 길이·날짜형·콜레이션·암시적 형 변환·자동 커밋 등은 MySQL과 완전히 같지 않습니다. 계정·권한, 임의 인덱스·뷰·트리거, 복잡한 ALTER 제약 변경은 지원하지 않습니다.</p><p>SQL 기초 14~32장의 정의어·member 예제와 부질의 외 24~30장의 일부 변경 예제를 추가했습니다. Imported_book 원본이 없는 대량 삽입 문제는 임의의 데이터를 만들지 않았습니다.</p></details>
    {confirmAnswer ? <div className="sql-answer-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setConfirmAnswer(false) }}><div className="sql-answer-modal" role="dialog" aria-modal="true" aria-labelledby="schema-answer-title"><h4 id="schema-answer-title">모범답안을 확인할까요?</h4><p>직접 작성해 본 뒤 문법과 결과를 비교해 보세요.</p><div><button type="button" className="visual-button" onClick={() => setConfirmAnswer(false)}>계속 풀기</button><button type="button" className="quiz-primary" autoFocus onClick={() => { setShowAnswer(true); setConfirmAnswer(false) }}>답안 확인하기</button></div></div></div> : null}
  </div>
}
