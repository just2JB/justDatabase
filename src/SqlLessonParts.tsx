import { useState } from 'react'
import { books, customers, orders, queryExamples, sampleTables } from './sqlLessonData'
import type { SqlResult } from './sqlLessonData'

export function SqlCode({ children }: { children: string }) { return <pre className="sql-code"><code>{children}</code></pre> }
export function SqlTable({ data, caption }: { data: SqlResult; caption: string }) {
  return <div className="table-wrap"><table className="sql-result-table"><caption>{caption} · {data.rows.length}행</caption><thead><tr>{data.columns.map((column, index) => <th scope="col" key={index}>{column}</th>)}</tr></thead><tbody>{data.rows.map((row, index) => <tr key={index}>{row.map((cell, column) => <td key={column}>{cell === null ? <span className="null-value">NULL</span> : cell}</td>)}</tr>)}</tbody></table>{!data.rows.length ? <p className="dbs-mini">조건에 맞는 행이 없습니다.</p> : null}</div>
}
export function SampleData() {
  const [table, setTable] = useState(0)
  return <div className="visual-block"><div className="shape-tabs" role="tablist" aria-label="서점 테이블">{sampleTables.map((item, index) => <button type="button" role="tab" id={`sample-tab-${index}`} aria-controls="sample-data-panel" aria-selected={table === index} key={item.name} onClick={() => setTable(index)}>{item.name} · {item.result.rows.length}행</button>)}</div><div id="sample-data-panel" role="tabpanel" aria-labelledby={`sample-tab-${table}`} key={table} className="content-enter"><SqlTable data={sampleTables[table].result} caption={sampleTables[table].name} /></div><p className="visual-caption">Book.bookid ← Orders.bookid · Customer.custid ← Orders.custid</p></div>
}
export function QueryLibrary({ initialQuery = 1 }: { initialQuery?: number }) {
  const [number, setNumber] = useState(initialQuery)
  const query = queryExamples.find(item => item.number === number) ?? queryExamples[0]
  return <div className="visual-block"><label className="relation-select">질의 선택<select className="sql-query-select" value={number} onChange={event => setNumber(Number(event.target.value))}>{queryExamples.map(item => <option key={item.number} value={item.number}>3-{item.number} · {item.group} · {item.title}</option>)}</select></label><div key={number} className="content-enter"><h3>{query.title}</h3><SqlCode>{query.code}</SqlCode><p className="sql-explanation">{query.explanation}</p><SqlTable data={query.result()} caption={`질의 3-${number} 결과 미리보기`} /></div><p className="visual-caption">제공된 서점 데이터를 바탕으로 화면에서 계산하는 예제 미리보기입니다. 실제 MySQL 실행 결과를 캡처한 것이 아닙니다. ORDER BY 없는 결과의 표시 순서는 보장되지 않습니다.</p></div>
}
export function FilterPlayground() {
  const [kind, setKind] = useState('compare')
  const variants = [
    { id: 'compare', title: '비교 <', code: 'price < 20000', rows: books.filter(b => b.price < 20000) },
    { id: 'between', title: 'BETWEEN', code: 'price BETWEEN 10000 AND 20000', rows: books.filter(b => b.price >= 10000 && b.price <= 20000) },
    { id: 'in', title: 'IN', code: "publisher IN ('굿스포츠', '대한미디어')", rows: books.filter(b => ['굿스포츠', '대한미디어'].includes(b.publisher)) },
    { id: 'not-in', title: 'NOT IN', code: "publisher NOT IN ('굿스포츠', '대한미디어')", rows: books.filter(b => !['굿스포츠', '대한미디어'].includes(b.publisher)) },
    { id: 'like', title: 'LIKE %', code: "bookname LIKE '%축구%'", rows: books.filter(b => b.bookname.includes('축구')) },
    { id: 'underscore', title: 'LIKE _', code: "bookname LIKE '_구%'", rows: books.filter(b => [...b.bookname][1] === '구') },
    { id: 'and', title: 'AND', code: "bookname LIKE '%축구%' AND price >= 20000", rows: books.filter(b => b.bookname.includes('축구') && b.price >= 20000) },
  ]
  const selected = variants.find(item => item.id === kind)!
  return <div className="visual-block"><h3>조건에 따라 남는 행 비교하기</h3><div className="sql-option-buttons">{variants.map(item => <button type="button" key={item.id} aria-pressed={kind === item.id} onClick={() => setKind(item.id)}>{item.title}</button>)}</div><div key={kind} className="content-enter"><SqlCode>{`SELECT * FROM Book\nWHERE ${selected.code};`}</SqlCode><SqlTable caption="조건을 만족하는 Book" data={{ columns: ['bookid', 'bookname', 'publisher', 'price'], rows: selected.rows.map(b => [b.bookid, b.bookname, b.publisher, b.price]) }} /></div></div>
}
export function GroupPipeline() {
  const [stage, setStage] = useState(0)
  const filtered = orders.filter(o => o.saleprice >= 8000)
  const groups = customers.filter(c => filtered.some(o => o.custid === c.custid)).map(c => [c.custid, filtered.filter(o => o.custid === c.custid).length])
  const data: SqlResult = stage < 2 ? { columns: ['orderid', 'custid', 'saleprice'], rows: (stage === 0 ? orders : filtered).map(o => [o.orderid, o.custid, o.saleprice]) } : { columns: ['custid', '주문건수'], rows: stage === 2 ? groups : groups.filter(row => row[1] >= 2) }
  const steps = ['원본 10행', 'WHERE · 행 조건', 'GROUP BY · 고객별 집계', 'HAVING · 그룹 조건']
  return <div className="visual-block"><h3>행을 고르고, 묶고, 그룹을 고르기</h3><div className="sql-option-buttons">{steps.map((label, index) => <button type="button" key={label} aria-pressed={stage === index} onClick={() => setStage(index)}>{index + 1}. {label}</button>)}</div><SqlCode>{queryExamples[19].code}</SqlCode><div key={stage} className="content-enter"><SqlTable data={data} caption={steps[stage]} /></div><p className="sql-explanation">WHERE는 집계 전 개별 주문 행을 거릅니다. GROUP BY는 고객별 그룹을 만들고, HAVING은 집계 후 2건 이상인 고객을 고릅니다.</p></div>
}
export function JoinPlayground() {
  const [mode, setMode] = useState('inner')
  const data: SqlResult = mode === 'cross' ? { columns: ['고객', '주문번호', '주문의 고객번호'], rows: customers.flatMap(c => orders.map(o => [c.name, o.orderid, o.custid])) } : mode === 'left' ? queryExamples[26].result() : queryExamples[22].result()
  return <div className="visual-block"><h3>연결 조건이 결과를 어떻게 바꾸는가</h3><div className="sql-option-buttons">{[['cross', '조건 없음 · 50행'], ['inner', 'INNER JOIN · 10행'], ['left', 'LEFT JOIN · 11행']].map(([value, label]) => <button type="button" key={value} aria-pressed={mode === value} onClick={() => setMode(value)}>{label}</button>)}</div><SqlCode>{mode === 'cross' ? 'SELECT c.name, o.orderid, o.custid\nFROM Customer c CROSS JOIN Orders o;' : mode === 'left' ? queryExamples[26].code : queryExamples[22].code}</SqlCode><p className="sql-explanation">{mode === 'cross' ? '모든 고객과 모든 주문의 조합: 5 × 10 = 50. 실제 주문자가 아닌 고객과도 연결된다.' : mode === 'left' ? '왼쪽 Customer를 모두 보존한다. 구매하지 않은 박세리의 주문 값은 NULL이다.' : '고객번호가 같은 행끼리만 연결한다. 같은 고객이 여러 주문을 하면 고객 정보가 여러 행에 나온다.'}</p><div key={mode} className="content-enter"><SqlTable caption="연결 결과 미리보기" data={data} /></div></div>
}
export function SetPlayground() {
  const [mode, setMode] = useState('union')
  const domestic = customers.filter(c => c.address.startsWith('대한민국'))
  const purchased = customers.filter(c => orders.some(o => o.custid === c.custid))
  const selected = mode === 'union' ? customers.filter(c => domestic.includes(c) || purchased.includes(c)) : mode === 'intersect' ? domestic.filter(c => purchased.includes(c)) : domestic.filter(c => !purchased.includes(c))
  return <div className="visual-block"><h3>국내 거주 고객과 구매 고객의 집합</h3><div className="set-inputs"><p><strong>A · 국내 거주</strong>{domestic.map(c => c.name).join(' · ')}</p><p><strong>B · 구매 이력</strong>{purchased.map(c => c.name).join(' · ')}</p></div><div className="sql-option-buttons">{[['union', 'A ∪ B · 합집합'], ['intersect', 'A ∩ B · 교집합'], ['except', 'A − B · 차집합']].map(([value, label]) => <button type="button" key={value} aria-pressed={mode === value} onClick={() => setMode(value)}>{label}</button>)}</div><div key={mode} className="content-enter"><SqlTable data={{ columns: ['custid', 'name'], rows: selected.map(c => [c.custid, c.name]) }} caption="고객 집합 결과" /></div><p className="visual-caption">고객번호로 구별한 이해용 집합 예시. UNION 질의는 예제 목록의 3-32에서 볼 수 있습니다.</p></div>
}
