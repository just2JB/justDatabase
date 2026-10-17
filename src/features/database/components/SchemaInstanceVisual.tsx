import { useState } from 'react'

export default function SchemaInstanceVisual() {
  const [added, setAdded] = useState(false)
  const rows = added ? [[101,1],[102,2],[103,2],[104,3]] : [[101,1],[102,2],[103,2]]
  return <div id="schema-instance" className="visual-block">
    <div className="visual-header"><h3>스키마는 구조, 인스턴스는 지금 저장된 값</h3><button type="button" className="visual-button" aria-pressed={added} onClick={()=>setAdded(value=>!value)}>{added?'추가한 학생 되돌리기':'학생 104 추가'}</button></div>
    <div className="dbs-pair schema-instance-pair">
      <article className="schema-instance-card"><h4>스키마 <small>Schema</small></h4><p>어떤 열과 규칙으로 저장할까?</p><div className="schema-fixed"><div className="schema-example"><div><strong>학생번호 · 정수</strong><strong>학년 · 정수</strong></div></div><p className="dbs-mini">기본키: 학생번호<br/>행마다 학생번호가 다르고 NULL일 수 없습니다.</p><div className="schema-counts"><span>속성 2개 · 그대로</span></div></div><span className="dbs-status">학생을 추가해도 열과 제약조건은 그대로입니다.</span></article>
      <article className="schema-instance-card"><h4>인스턴스 <small>Instance</small></h4><p>이 구조에 지금 어떤 값이 저장되어 있을까?</p><div className="table-wrap"><table><caption className="sr-only">특정 시점에 저장된 학생 투플 집합</caption><thead><tr><th>학생번호</th><th>학년</th></tr></thead><tbody>{rows.map(row=><tr key={row[0]} className={row[0]===104?'dbs-new-row':''}><td>{row[0]}</td><td>{row[1]}</td></tr>)}</tbody></table></div><div className="schema-counts" aria-live="polite"><span>투플 {rows.length}개{added?' · 3 → 4로 변경':''}</span></div></article>
    </div>
    <p className="learning-result" role="status">{added?<><strong>바뀐 것: 인스턴스</strong> · (104, 3)이 추가되었습니다. <strong>유지된 것: 스키마</strong> · 속성은 여전히 2개입니다.</>:<>표의 <strong>모든 행을 모은 집합</strong>이 현재 인스턴스입니다. 학생을 추가해서 구조와 값의 차이를 비교해 보세요.</>}</p>
  </div>
}
