import { useState } from 'react'
import StepControls from '../../../shared/components/StepControls'
import { SqlCode, SqlTable } from '../sql/components/SqlLessonParts'
import { books, customers, orders } from '../sql/data/sqlLessonData'
import ControlLab from './ControlLab'
import { dictionaryTrace } from './sqlDictionary'
import type { DictionaryEntry } from './sqlDictionary'
import SqlRunner from '../sql/components/SqlRunner'

export default function DictionaryDetail({ entry }: { entry: DictionaryEntry }) {
  const [step, setStep] = useState(0)
  const [outer, setOuter] = useState(0)
  const [runOpen, setRunOpen] = useState(false)
  const frames = entry.control ? [] : dictionaryTrace(entry, outer)
  const frame = frames[step] ?? frames[0]
  const outerRows = entry.query === 31 ? books.map(b => `${b.bookid} · ${b.bookname} · ${b.publisher}`) : entry.advanced === 4 ? customers.map(c => `${c.custid} · ${c.name}`) : orders.map(o => `${o.orderid}번 주문 · 고객 ${o.custid} · ${o.saleprice.toLocaleString()}원`)
  return <article className="dictionary-detail" id={`sql-ref-${entry.id}`} aria-labelledby="dictionary-entry-title">
    <header><span className="course-tag">{entry.group}</span><h2 id="dictionary-entry-title">{entry.keyword}</h2><h3>{entry.title}</h3><p>{entry.explanation}</p></header>
    <details className="dictionary-syntax"><summary>기본 문법</summary><SqlCode>{entry.syntax}</SqlCode></details>
    <div className="dictionary-example"><span className="language-code-label">마당서점 예제 SQL · MySQL 문법 기준</span><SqlCode>{entry.sql}</SqlCode></div>
    {entry.control ? <ControlLab initialCommand={entry.control}/> : <>
      <h3 className="dictionary-flow-title">동작 과정 따라가기</h3>
      {entry.correlated ? <label className="dictionary-outer-select">비교할 외부 행<select value={outer} onChange={event => { setOuter(Number(event.target.value)); setStep(0) }}>{outerRows.map((label, index) => <option key={index} value={index}>{label}</option>)}</select></label> : null}
      <div className="dictionary-pipeline" role="group" aria-label="SQL 동작 단계">{frames.map((item, index) => <button type="button" key={index} aria-pressed={step === index} onClick={() => setStep(index)}><span>{index + 1}</span><strong>{item.title}</strong>{index < frames.length - 1 ? <i aria-hidden="true">→</i> : null}</button>)}</div>
      <StepControls step={step} count={frames.length} onChange={setStep}/>
      <section className="dictionary-frame" aria-label="현재 동작 단계"><div className="dictionary-stage-copy" role="status"><strong>{step + 1}. {frame.title}</strong><p>{frame.detail}</p></div><div className="dictionary-tables content-enter" key={`${step}-${outer}`}>
        {frame.schema ? <SqlTable data={frame.schema} caption="테이블 구조 · 자료형과 제약조건"/> : null}
        {frame.tables.map(table => <SqlTable key={table.name} data={table.data} caption={table.name}/>)}
        {!frame.schema && !frame.tables.length ? <div className="language-empty"><strong>아직 테이블이 없거나 삭제된 상태입니다.</strong><p>행이 0개인 빈 테이블과 구분하세요.</p></div> : null}
      </div></section>
      <p className="dictionary-note">이해를 위한 논리적 처리 순서와 데이터 미리보기입니다. 실제 MySQL은 최적화에 따라 다른 실행 계획을 사용할 수 있습니다. ORDER BY가 없으면 결과 행 순서는 보장되지 않습니다.</p>
      {!entry.ddl && !entry.mutation ? <div className="dictionary-run"><button type="button" className="visual-button" aria-expanded={runOpen} onClick={() => setRunOpen(!runOpen)}>{runOpen ? 'SQL 실행 도구 접기' : '이 예제 SQL을 수정해서 실행해 보기'}</button>{runOpen ? <SqlRunner initialSql={entry.sql}/> : null}</div> : null}
    </>}
  </article>
}
