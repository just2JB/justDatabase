import { useState } from 'react'
import CustomerReferenceExample from './CustomerReferenceExample'

export default function IntegrityRelations({ reference = false }: { reference?: boolean }) {
  const [value, setValue] = useState(reference ? '10' : '101')
  const [notNull, setNotNull] = useState(false)
  const duplicate = !reference && value === '102'
  const valid = reference ? value === 'NULL' ? !notNull : ['10', '20'].includes(value) : value === '101'
  return <article id={reference ? 'reference-integrity' : 'entity-integrity'} className="independence-demo integrity-relations">
    <h3>{reference ? '참조 무결성' : '개체 무결성'}</h3>
    <p>{reference ? '외래키는 참조할 수 없는 값을 가질 수 없다.' : '기본키를 구성하는 모든 속성은 NULL을 가질 수 없다.'}</p>
    <label className="relation-select">{reference ? '학생 A의 학과번호(FK) 바꾸기' : '학생 A의 학생번호(PK) 바꾸기'}<select value={value} onChange={event => setValue(event.target.value)}>{(reference ? ['10', '20', '99', 'NULL'] : ['101', '102', 'NULL']).map(item => <option key={item}>{item}</option>)}</select></label>
    {reference ? <label className="integrity-null-control"><input type="checkbox" checked={notNull} onChange={event=>setNotNull(event.target.checked)}/>학과번호에 NOT NULL 제약 추가</label> : <p className="dbs-mini">101 · 유효 / 102 · 다른 학생과 기본키 중복 / NULL · 기본키 값 없음</p>}
    <div className={reference ? 'integrity-table-pair' : 'integrity-single-table'}>
      {reference ? <div className="example-relation"><div className="example-relation-heading"><h4>학과 릴레이션 · 참조 대상</h4></div><div className="table-wrap"><table><caption>학과(학과번호, 학과명)</caption><thead><tr><th scope="col">학과번호<small className="relation-key-label">PK</small></th><th scope="col">학과명</th></tr></thead><tbody>{[['10', '컴퓨터학과'], ['20', '경영학과']].map(([id, name]) => <tr key={id}><td className={value === id ? 'integrity-cell-match' : ''}>{id}</td><td>{name}</td></tr>)}</tbody></table></div><p className="example-relation-note">참조 가능한 학과번호는 10과 20입니다.</p></div> : null}
      <div className="example-relation"><div className="example-relation-heading"><h4>학생 릴레이션 · 입력 예시</h4></div><div className="table-wrap"><table><caption>{reference ? '학생(학생번호, 이름, 학과번호)' : '학생(학생번호, 이름, 학년)'}</caption><thead><tr><th scope="col">학생번호<small className="relation-key-label">PK</small></th><th scope="col">이름</th><th scope="col">{reference ? <>학과번호<small className="relation-key-label foreign">FK</small></> : '학년'}</th></tr></thead><tbody><tr className={!valid ? 'integrity-row-invalid' : ''}><td className={!reference ? valid ? 'integrity-cell-match' : 'integrity-cell-invalid' : ''}>{reference ? '101' : value === 'NULL' ? <span className="null-value">NULL</span> : value}</td><td>학생 A</td><td className={reference ? !valid ? 'integrity-cell-invalid' : value !== 'NULL' ? 'integrity-cell-match' : '' : ''}>{reference ? value === 'NULL' ? <span className="null-value">NULL</span> : value : '1'}</td></tr><tr><td className={duplicate ? "integrity-cell-invalid" : undefined}>102</td><td>학생 B</td><td>{reference ? '20' : '2'}</td></tr><tr><td>103</td><td>학생 C</td><td>{reference ? '10' : '3'}</td></tr></tbody></table></div><p className="example-relation-note">{reference ? '첫 번째 투플의 학과번호가 학과 릴레이션의 기본키를 참조합니다.' : '첫 번째 투플의 학생번호를 바꿔 기본키의 NULL 금지와 값의 유일성을 함께 비교합니다.'}</p></div>
    </div>
    <p className={`validation-result ${valid ? 'valid' : 'invalid'}`} role="status">{reference ? value === 'NULL' ? notNull ? '외래키의 참조 규칙과 별개로, 추가한 NOT NULL 제약 때문에 NULL을 저장할 수 없습니다.' : 'NOT NULL 제약이 없는 이 예시는 외래키에 NULL을 허용합니다. 참조 대상이 지정되지 않은 상태입니다.' : valid ? `학생 A의 학과번호 ${value}이 학과 릴레이션에 존재하므로 참조할 수 있습니다.` : '학생 A의 학과번호 99가 학과 릴레이션에 없습니다. 이 투플은 참조 무결성을 위반하여 저장할 수 없습니다.' : valid ? '학생번호 101은 NULL이 아니며 다른 학생번호와 겹치지 않아 기본키 조건을 만족합니다.' : duplicate ? '학생번호 102는 이미 학생 B가 사용합니다. 기본키의 유일성을 위반하므로 이 입력은 저장할 수 없습니다.' : '학생 A의 기본키가 NULL입니다. 개체 무결성을 위반하여 저장할 수 없습니다.'}</p>
    <p className="visual-caption">이해용 예시 · 붉은 행은 저장할 수 없는 입력을 보여 주며, 실제 데이터베이스를 변경하지 않습니다.</p>
    {reference ? <CustomerReferenceExample /> : null}
  </article>
}
