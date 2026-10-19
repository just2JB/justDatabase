import { useState } from 'react'
import { books, customers, orders, queryExamples, sampleTables } from '../data/sqlLessonData'
import type { SqlResult } from '../data/sqlLessonData'

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
  const filtered = orders.filter(order => order.saleprice >= 8000)
  const groups = customers.filter(customer => filtered.some(order => order.custid === customer.custid)).map(customer => ({ id: customer.custid, orders: filtered.filter(order => order.custid === customer.custid) }))
  const qualified = groups.filter(group => group.orders.length >= 2)
  const data: SqlResult = stage < 2
    ? { columns: ['orderid', 'custid', 'saleprice'], rows: (stage === 0 ? orders : filtered).map(order => [order.orderid, order.custid, order.saleprice]) }
    : { columns: ['custid', '주문건수'], rows: (stage === 2 ? groups : qualified).map(group => [group.id, group.orders.length]) }
  const steps = ['원본 행', 'WHERE · 행 선택', 'GROUP BY · 묶기', 'HAVING · 그룹 선택']
  const summaries = [`주문 ${orders.length}행에서 시작합니다.`, `8000원 이상인 주문 ${filtered.length}행을 남깁니다. 주문 건수로 판단하는 단계가 아닙니다.`, `${filtered.length}행을 고객번호로 묶어 ${groups.length}개 그룹을 만듭니다. COUNT(*)는 그룹 안의 주문 수입니다.`, `주문이 2건 이상인 ${qualified.length}개 그룹만 남깁니다. 고객 2는 조건에 맞는 주문이 1건이므로 제외됩니다.`]
  const code = stage < 2
    ? `SELECT orderid, custid, saleprice\nFROM Orders${stage === 1 ? '\nWHERE saleprice >= 8000' : ''}\nORDER BY orderid;`
    : `SELECT custid, COUNT(*) AS 주문건수\nFROM Orders\nWHERE saleprice >= 8000\nGROUP BY custid${stage === 3 ? '\nHAVING COUNT(*) >= 2' : ''}\nORDER BY custid;`
  return <div className="visual-block" id="group-pipeline"><h3>WHERE는 행을, HAVING은 그룹을 고른다</h3>
    <div className="sql-learning-step" role="group" aria-label="그룹 질의 처리 단계">{steps.map((label,index)=><button type="button" key={label} aria-pressed={stage===index} onClick={()=>setStage(index)}><span>{index+1}</span>{label}</button>)}</div>
    <p className="sql-stage-summary" role="status"><strong>{steps[stage]}</strong>{summaries[stage]}</p>
    {stage>=2?<div className="sql-group-buckets">{groups.map(group=><div key={group.id} className={stage===3&&group.orders.length<2?'excluded-group':''}><strong>고객 {group.id}</strong><div>{group.orders.map(order=><span key={order.orderid}>주문 {order.orderid} · {order.saleprice.toLocaleString()}원</span>)}</div><b>COUNT(*) = {group.orders.length}</b>{stage===3&&group.orders.length<2?<small>HAVING에서 제외</small>:null}</div>)}</div>:null}
    <div key={stage} className="content-enter"><SqlCode>{code}</SqlCode><SqlTable data={data} caption={`${steps[stage]} 결과`} /></div>
    <p className="visual-caption">각 단계에서 보게 되는 값을 SQL과 함께 표시했습니다. 최종 결과는 원본 10행 → 조건에 맞는 7행 → 고객별 4그룹 → 조건에 맞는 3그룹입니다.</p>
  </div>
}
export function JoinPlayground() {
  const [mode, setMode] = useState('inner')
  const [customerId, setCustomerId] = useState('1')
  const selectedCustomers = customerId === 'all' ? customers : customers.filter(customer=>customer.custid===Number(customerId))
  const data: SqlResult = { columns: ['custid', 'name', 'orderid', 'saleprice'], rows: selectedCustomers.flatMap<SqlResult['rows'][number]>(customer => {
    const matches = mode==='cross' ? orders : orders.filter(order=>order.custid===customer.custid)
    return matches.length ? matches.map(order=>[customer.custid,customer.name,order.orderid,order.saleprice]) : mode==='left' ? [[customer.custid,customer.name,null,null]] : []
  }) }
  const code = `SELECT c.custid, c.name, o.orderid, o.saleprice\nFROM Customer c ${mode==='cross'?'CROSS JOIN':mode==='left'?'LEFT JOIN':'INNER JOIN'} Orders o${mode==='cross'?'':'\n  ON c.custid = o.custid'}${customerId==='all'?'':`\nWHERE c.custid = ${customerId}`}\nORDER BY c.custid, o.orderid;`
  const activeCustomer = customers.find(customer=>String(customer.custid)===customerId)
  const matchingCount = activeCustomer ? orders.filter(order=>order.custid===activeCustomer.custid).length : orders.length
  const outerJoinExample: SqlResult = { columns: ['name', 'saleprice'], rows: customers.flatMap<SqlResult['rows'][number]>(customer => {
    const matches = orders.filter(order=>order.custid===customer.custid)
    return matches.length ? matches.map(order=>[customer.name,order.saleprice]) : [[customer.name,null]]
  }) }
  return <div className="visual-block" id="join-playground"><h3>같은 입력으로 INNER·LEFT·조건 없는 연결 비교하기</h3>
    <label className="relation-select">관찰할 고객<select value={customerId} onChange={event=>setCustomerId(event.target.value)}>{customers.map(customer=><option key={customer.custid} value={customer.custid}>{customer.custid} · {customer.name}{orders.some(order=>order.custid===customer.custid)?'':' · 주문 없음'}</option>)}<option value="all">전체 고객</option></select></label>
    <div className="sql-option-buttons" role="group" aria-label="조인 방식">{[['inner','INNER JOIN'],['left','LEFT JOIN'],['cross','조건 없음 · CROSS JOIN']].map(([value,label])=><button type="button" key={value} aria-pressed={mode===value} onClick={()=>setMode(value)}>{label}</button>)}</div>
    <p className="sql-stage-summary" role="status"><strong>{data.rows.length}행 출력</strong>{mode==='cross'?`${selectedCustomers.length}명 × 주문 10행의 모든 조합입니다. 실제 주문자와 다르게 연결되는 행도 생깁니다.`:mode==='left'?`선택한 고객을 보존합니다. 주문이 없으면 오른쪽 orderid·saleprice가 NULL인 행을 남깁니다.`:`고객번호가 같은 주문만 연결합니다.${activeCustomer?` ${activeCustomer.name}의 실제 주문은 ${matchingCount}건입니다.`:''}`}</p>
    <details className="sql-live-source"><summary>연결하는 원본 두 표 확인하기</summary><div className="sql-comparison-inputs"><div><h4>왼쪽 · Customer</h4><SqlTable caption="관찰하는 고객" data={{columns:['custid','name'],rows:selectedCustomers.map(customer=>[customer.custid,customer.name])}}/></div><div><h4>오른쪽 · Orders</h4><SqlTable caption="원본 주문 전체" data={{columns:['orderid','custid','saleprice'],rows:orders.map(order=>[order.orderid,order.custid,order.saleprice])}}/></div></div></details>
    <div key={`${mode}-${customerId}`} className="content-enter"><SqlCode>{code}</SqlCode><SqlTable data={data} caption="같은 출력 열로 비교한 조인 결과"/></div>
    <p className="visual-caption">관찰할 고객을 ‘5 · 박세리 · 주문 없음’으로 바꾼 뒤 INNER와 LEFT를 비교하면, 사라지는 행과 보존되는 행의 차이를 확인할 수 있습니다.</p>
    <div className="sql-topic" id="sql5-outer-join"><h3>외부 조인 예제 · 주문하지 않은 고객도 포함</h3><SqlCode>{`SELECT c.name, o.saleprice
FROM Customer c
LEFT JOIN Orders o
  ON c.custid = o.custid
ORDER BY c.custid;`}</SqlCode><p className="sql-explanation">왼쪽 Customer의 모든 고객을 먼저 보존하고, 고객번호가 같은 주문을 오른쪽에 붙입니다. 주문이 없는 박세리도 결과에 남으며 Orders의 판매가격은 NULL로 표시됩니다.</p><SqlTable data={outerJoinExample} caption="LEFT JOIN으로 모든 고객을 보존한 결과"/><p className="dbs-mini">RIGHT JOIN은 반대로 오른쪽 테이블을 모두 보존합니다. 실무에서는 테이블 순서를 바꿔 LEFT JOIN으로 표현하는 경우가 많습니다.</p></div>
  </div>
}
export function SetPlayground() {
  const [mode, setMode] = useState('union')
  const domestic = customers.filter(c => c.address.startsWith('대한민국'))
  const purchased = customers.filter(c => orders.some(o => o.custid === c.custid))
  const selected = mode === 'union' ? customers.filter(c => domestic.includes(c) || purchased.includes(c)) : mode === 'intersect' ? domestic.filter(c => purchased.includes(c)) : domestic.filter(c => !purchased.includes(c))
  return <div className="visual-block"><h3>국내 거주 고객과 구매 고객의 집합</h3><div className="set-inputs"><p><strong>A · 국내 거주</strong>{domestic.map(c => c.name).join(' · ')}</p><p><strong>B · 구매 이력</strong>{purchased.map(c => c.name).join(' · ')}</p></div><div className="sql-option-buttons">{[['union', 'A ∪ B · 합집합'], ['intersect', 'A ∩ B · 교집합'], ['except', 'A − B · 차집합']].map(([value, label]) => <button type="button" key={value} aria-pressed={mode === value} onClick={() => setMode(value)}>{label}</button>)}</div><div key={mode} className="content-enter"><SqlTable data={{ columns: ['custid', 'name'], rows: selected.map(c => [c.custid, c.name]) }} caption="고객 집합 결과" /></div><p className="visual-caption">고객번호로 구별한 이해용 집합 예시. UNION 질의는 예제 목록의 3-32에서 볼 수 있습니다.</p></div>
}
