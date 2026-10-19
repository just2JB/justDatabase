import { useEffect, useRef, useState } from 'react'
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url'
import { SqlTable } from './SqlLessonParts'
import type { SqlResult } from '../data/sqlLessonData'
import { indentSql } from './sqlIndent'
import { MysqlPractice } from '../engine/mysqlPractice'
import { schemaExercises } from '../data/schemaExercises'
import { SqlHelpCode } from './SqlSelectionHelp'
import SqlEditor from './SqlEditor'

export const createExercises = [
  { title: '3-34 · NewBook 생성', source: '4주차 PPT 17장', task: 'NewBook을 생성하시오. bookid와 price는 INTEGER, bookname과 publisher는 VARCHAR(20)으로 정의하시오. PPT의 기본키 지정 예제처럼 bookid를 기본키로 지정하시오.', hint: 'bookid INTEGER PRIMARY KEY처럼 열에 지정하거나, 마지막에 PRIMARY KEY (bookid)를 따로 작성할 수 있습니다.', setup: '', answer: 'create table NewBook (\n  bookid integer,\n  bookname varchar(20),\n  publisher varchar(20),\n  price integer,\n  primary key (bookid)\n);' },
  { title: 'NewBook · 복합키와 제약조건', source: '4주차 PPT 18장', task: 'bookid 없이 NewBook을 생성하시오. bookname은 VARCHAR(20) NOT NULL, publisher는 VARCHAR(20) UNIQUE, price는 INTEGER로 정의하시오. (bookname, publisher)를 복합 기본키로 지정하고 price 기본값은 10000으로 하시오. 가격 조건은 PPT 코드처럼 price > 1000으로 작성하시오.', hint: 'NOT NULL·UNIQUE·DEFAULT·CHECK와 복합 PRIMARY KEY를 함께 사용합니다. PPT 본문은 “1,000원 이상”이라고 쓰지만 코드는 CHECK(price > 1000)입니다. 이 문제는 코드 기준으로 1,000원을 초과하도록 작성합니다. “이상” 조건이라면 >= 1000입니다.', setup: '', answer: 'create table NewBook (\n  bookname varchar(20) not null,\n  publisher varchar(20) unique,\n  price integer default 10000 check (price > 1000),\n  primary key (bookname, publisher)\n);' },
  { title: '3-35 · NewCustomer 생성', source: '4주차 PPT 19장', task: 'NewCustomer를 생성하시오. custid는 INTEGER 기본키, name과 address는 VARCHAR(40), phone은 VARCHAR(30)으로 정의하시오.', hint: '고객번호 custid만 기본키입니다. PPT에 없는 NOT NULL이나 UNIQUE 조건을 다른 열에 추가할 필요는 없습니다.', setup: '', answer: 'create table NewCustomer (\n  custid integer primary key,\n  name varchar(40),\n  address varchar(40),\n  phone varchar(30)\n);' },
  { title: '3-36 · NewOrders와 연쇄 삭제', source: '4주차 PPT 20장', task: 'NewOrders를 생성하시오. orderid는 INTEGER 기본키, custid와 bookid는 INTEGER NOT NULL, saleprice는 INTEGER, orderdate는 DATE로 정의하시오. custid는 NewCustomer(custid)를 참조하며 ON DELETE CASCADE를 지정하시오. 부모 NewCustomer는 미리 준비됩니다.', hint: '부모 NewCustomer가 먼저 존재해야 합니다. FOREIGN KEY (custid) REFERENCES NewCustomer(custid) ON DELETE CASCADE를 작성합니다. PPT의 이 예제는 bookid에 외래키를 지정하지 않습니다.', setup: 'create table NewCustomer (custid integer primary key, name varchar(40), address varchar(40), phone varchar(30));', answer: 'create table NewOrders (\n  orderid integer,\n  custid integer not null,\n  bookid integer not null,\n  saleprice integer,\n  orderdate date,\n  primary key (orderid),\n  foreign key (custid) references NewCustomer(custid) on delete cascade\n);' },
  ...schemaExercises.filter(item => /^ddl-(37|38|39|40|41|42|43)$/.test(item.id)).map(item => ({ title: item.title, source: `4주차 PPT ${Number(item.id.slice(4)) <= 41 ? '22' : '23'}장`, task: item.task, hint: item.tip, setup: item.setup, answer: item.answer })),
  ...schemaExercises.filter(item => ['member-insert', 'member-rename'].includes(item.id)).map(item => ({ title: item.title, source: `4주차 PPT ${item.id === 'member-insert' ? '27' : '32'}장`, task: item.task, hint: item.tip, setup: item.setup, answer: item.answer })),
]

const categories = [
  { command: 'CREATE', label: '테이블 생성' },
  { command: 'ALTER', label: '구조 변경' },
  { command: 'DROP', label: '테이블 삭제' },
  { command: 'INSERT', label: '데이터 추가 · DML' },
  { command: 'RENAME', label: '테이블 이름 변경' },
]

export default function CreateTablePractice() {
  const [index, setIndex] = useState(0)
  const [sql, setSql] = useState('')
  const [hint, setHint] = useState(false)
  const [answer, setAnswer] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [structures, setStructures] = useState<{ name: string; definition: string; columns: SqlResult; foreignKeys: SqlResult; rows: SqlResult }[]>([])
  const db = useRef<MysqlPractice | null>(null)
  const releaseTab = useRef(false)
  const task = createExercises[index]
  const category = task.answer.split(/\s+/)[0].toUpperCase()
  const categoryIndexes = createExercises.flatMap((item, i) => item.answer.split(/\s+/)[0].toUpperCase() === category ? [i] : [])
  const position = categoryIndexes.indexOf(index)
  const title = (value: string) => value.replace(/^3-\d+\s*·\s*/, '')
  useEffect(() => () => { db.current?.close() }, [])
  function choose(next: number) {
    if (busy || next < 0 || next >= createExercises.length) return
    db.current?.close(); db.current = null
    setIndex(next); setSql(''); setHint(false); setAnswer(false); setConfirm(false); setMessage(''); setStructures([])
  }
  async function execute() {
    setBusy(true); setMessage('')
    try {
      const statement = sql.replace(/--.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').trim()
      if (!/^(?:(create|alter|drop|rename)\s+table\b|insert\s+into\b)/i.test(statement)) throw new Error('CREATE TABLE, ALTER TABLE, DROP TABLE, INSERT INTO 또는 RENAME TABLE문을 작성해 주세요.')
      if (!db.current) {
        const { default: init } = await import('sql.js')
        const runtime = await init({ locateFile: () => sqlWasmUrl })
        db.current = new MysqlPractice(runtime)
        const prepared = db.current.run(`CREATE DATABASE ddl_practice; USE ddl_practice; ${task.setup}`)
        if (prepared.error) throw new Error(prepared.error)
      }
      const run = db.current.run(statement)
      setStructures(db.current.tables().map(name => {
        const state = db.current!.inspect(name)
        const quoted = `'${name.replaceAll("'", "''")}'`
        const definition = db.current!.db.exec(`select sql from sqlite_master where name=${quoted}`)[0]?.values[0][0]
        const fields = db.current!.db.exec(`pragma table_info(${quoted})`)[0]
        return { name, definition: String(definition ?? ''), columns: { columns: fields.columns, rows: fields.values as SqlResult['rows'] }, foreignKeys: state.foreignKeys, rows: state.rows }
      }))
      setMessage(run.error ? `${run.error}${run.executions.length ? `（앞의 ${run.executions.length}개 문장은 실행됨）` : ''}` : `실행 완료 · 현재 ${db.current.tables().length}개 테이블이 있습니다.${db.current.tables().length === 0 ? ' 테이블 구조와 데이터가 모두 삭제되었습니다.' : ' 변경된 구조와 제약조건을 확인하세요.'} 정답 자동 채점은 아닙니다.`)
    } catch (error) { setMessage(error instanceof Error ? error.message : '실행하지 못했습니다.') }
    finally { setBusy(false) }
  }
  return <section className="sql-runner sql-practice-runner"><div className="sql-runner-header"><div><h3>테이블 정의·데이터 추가</h3><p>4주차 PPT · {categories.map(({ command }) => `${command} ${createExercises.filter(item => item.answer.toUpperCase().startsWith(command)).length}문제`).join(' · ')}</p></div></div>
    <div className="sql-option-buttons" role="group" aria-label="SQL 문법 카테고리">{categories.map(({ command, label }) => <button key={command} type="button" disabled={busy} aria-pressed={category === command} onClick={() => choose(createExercises.findIndex(item => item.answer.toUpperCase().startsWith(command)))}>{command} · {label}</button>)}</div>
    <label className="sql-runner-label">{category} 연습 문제<select value={index} disabled={busy} onChange={event => choose(Number(event.target.value))}>{categoryIndexes.map(i => <option key={createExercises[i].title} value={i}>{title(createExercises[i].title)}</option>)}</select></label>
    <div className="sql-question-overview"><div className="sql-question-meta"><span>{category} · {task.source}</span></div><h4>{title(task.title)}</h4><p>{task.task}</p><div className="sql-question-pagination"><button disabled={busy || position === 0} onClick={() => choose(categoryIndexes[position - 1])}>← 이전 문제</button><span>문제를 바꾸면 실습 DB가 새로 준비됩니다.</span><button disabled={busy || position === categoryIndexes.length - 1} onClick={() => choose(categoryIndexes[position + 1])}>다음 문제 →</button></div></div>
    <div className="sql-editor-result-layout"><div className="sql-editor-pane"><label className="sql-runner-label" htmlFor="create-table-sql">SQL 입력</label><SqlEditor id="create-table-sql" className="sql-runner-input" spellCheck={false} value={sql} disabled={busy} aria-describedby="create-keyboard-help" onChange={event => setSql(event.target.value)} onKeyDown={event => {
      if (event.key === 'Escape') { releaseTab.current = true; return }
      if (event.key === 'Tab') { if (releaseTab.current) { releaseTab.current = false; return } event.preventDefault(); const input = event.currentTarget; const next = indentSql(sql, input.selectionStart, input.selectionEnd, event.shiftKey); setSql(next.value); requestAnimationFrame(() => input.setSelectionRange(next.start, next.end)); return }
      releaseTab.current = false
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); void execute() }
    }}/><p className="sql-keyboard-help" id="create-keyboard-help">구문 더블클릭 또는 Alt+Enter: 설명 → 문법 · Tab: 들여쓰기 · Shift+Tab: 해제 · Esc 후 Tab: 입력창 나가기</p><div className="sql-runner-actions"><button className="quiz-primary" disabled={busy} onClick={() => void execute()}>{busy ? '실행 중…' : 'SQL 실행'}</button><button className="visual-button" disabled={busy} onClick={() => setSql('')}>입력 초기화</button><button className="visual-button" onClick={() => setHint(value => !value)} aria-expanded={hint}>{hint ? '힌트 숨기기' : '힌트 보기'}</button><button className="visual-button" onClick={() => answer ? setAnswer(false) : setConfirm(true)} aria-expanded={answer}>{answer ? '모범답안 숨기기' : '모범답안 보기'}</button><button className="visual-button" disabled={busy} onClick={() => choose(index)}>실습 DB 초기화</button></div></div><div className="sql-result-pane"><h4>실행 결과</h4><p className="visual-caption" role="status">{message || '실행하면 생성된 테이블의 구조가 표시됩니다.'}</p>{structures.map(table => <article key={table.name}><h4>{table.name}</h4><SqlTable caption="열 구조 · name: 열, type: 자료형, notnull: NULL 불가, dflt_value: 기본값, pk: 기본키 순서" data={table.columns}/><details><summary>생성문과 제약조건 확인</summary><SqlHelpCode sql={table.definition}/>{table.foreignKeys.rows.length ? <SqlTable caption="외래키 · table: 부모, from: 참조 열, to: 부모 열" data={table.foreignKeys}/> : null}</details></article>)}</div></div>
    {hint ? <div className="sql-exercise-caution"><strong>힌트</strong><p>{task.hint}</p></div> : null}{answer ? <div className="sql-model-answer"><div><strong>모범답안</strong><p>색이 있는 구문을 더블클릭하면 설명과 문법을 확인할 수 있습니다.</p><SqlHelpCode sql={task.answer}/></div></div> : null}
    {structures.length ? <section className="sql-practice-sources" aria-label="실행 후 저장된 데이터"><h3>실행 후 저장된 데이터</h3>{structures.map(table => <article className="sql-source-table" key={table.name}><h4>{table.name}</h4><SqlTable data={table.rows} caption={`${table.name} 데이터 · 최대 100행`}/></article>)}</section> : null}
    <p className="visual-caption">INSERT는 데이터를 추가하는 조작어(DML)이며 RENAME은 테이블 이름을 변경하는 정의어(DDL)입니다. 세미콜론으로 여러 문장을 실행할 수 있습니다. MySQL의 MODIFY·ADD PRIMARY KEY 등은 SQLite 위에서 호환 처리합니다. 같은 문제에서는 변경 사항이 유지되며 문제를 바꾸면 필요한 테이블을 준비한 새 DB로 시작합니다.</p>
    {confirm ? <div className="sql-answer-modal-backdrop"><div className="sql-answer-modal" role="dialog" aria-modal="true" aria-labelledby="create-answer-title"><h4 id="create-answer-title">모범답안을 확인할까요?</h4><p>직접 작성한 SQL과 비교해 보세요.</p><div><button className="visual-button" onClick={() => setConfirm(false)}>계속 풀기</button><button className="quiz-primary" onClick={() => { setAnswer(true); setConfirm(false) }}>답안 확인하기</button></div></div></div> : null}
  </section>
}
