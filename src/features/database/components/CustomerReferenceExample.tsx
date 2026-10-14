import { useState } from 'react'

const customers = [
  ['apple', '김현준', 20, 'gold', '학생', 1000],
  ['banana', '정소화', 25, 'vip', '간호사', 2500],
  ['carrot', '윤유선', 28, 'gold', '교사', 4500],
  ['orange', '정지영', 22, 'silver', '학생', 0],
] as const

export default function CustomerReferenceExample() {
  const [customer, setCustomer] = useState('cherry')
  const [addedCherry, setAddedCherry] = useState(false)
  const value = customer.trim()
  const valid = customers.some(row => row[0] === value) || (addedCherry && value === 'cherry')
  const orders = [[1001, value || '(입력 없음)', '진짜우동', 10, 2000, '2022-01-01'], [1002, 'carrot', '맛있는파이', 5, 500, '2022-01-10'], [1003, 'banana', '그대로만두', 11, 4500, '2022-01-11']]

  return <div id="customer-reference-example" className="customer-reference-example"><h4>고객·주문 릴레이션에서 잘못된 참조 만들기</h4><p className="dbs-mini">주문고객(FK)은 고객아이디(PK)를 참조합니다. 처음에는 주문 1001의 고객을 고객 표에 없는 cherry로 지정했습니다.</p><div className="customer-reference-controls"><label>주문 1001의 주문고객<input type="text" value={customer} onChange={event => setCustomer(event.target.value)} placeholder="예: cherry" /></label><div className="relation-actions"><button type="button" className="visual-button" onClick={() => { setCustomer('cherry'); setAddedCherry(false) }}>잘못된 예: cherry</button><button type="button" className="visual-button" onClick={() => setCustomer('apple')}>정상 예: apple</button><button type="button" className="visual-button" disabled={value !== 'cherry' || addedCherry} onClick={() => setAddedCherry(true)}>고객 표에 cherry 추가</button><button type="button" className="visual-button" onClick={() => { setCustomer('cherry'); setAddedCherry(false) }}>초기화</button></div></div>
    <div className="example-relation"><h4>고객 릴레이션</h4><div className="table-wrap"><table><caption>고객아이디가 기본키인 참조 대상</caption><thead><tr>{['고객아이디', '고객이름', '나이', '등급', '직업', '적립금'].map((column, index) => <th scope="col" key={column} className={index === 0 ? 'customer-pk-column' : ''}>{column}{index === 0 ? <small className="relation-key-label">PK</small> : null}</th>)}</tr></thead><tbody>{customers.map(row => <tr key={row[0]}>{row.map((cell, index) => <td key={index} className={index === 0 ? value === row[0] ? 'customer-pk-column reference-match' : 'customer-pk-column' : ''}>{cell}</td>)}</tr>)}{addedCherry ? <tr className="customer-added-row"><td className={value === 'cherry' ? 'customer-pk-column reference-match' : 'customer-pk-column'}>cherry</td><td>추가 고객</td><td><span className="null-value">NULL</span></td><td><span className="null-value">NULL</span></td><td><span className="null-value">NULL</span></td><td>0</td></tr> : null}</tbody></table></div></div>
    <div className={`customer-reference-arrow ${valid ? 'connected' : 'broken'}`}><svg viewBox="0 0 24 36" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 33V4m-6 7 6-7 6 7" /></svg><span>주문.주문고객 → 고객.고객아이디</span><strong>{valid ? `참조 대상 ${value} 존재` : `참조 대상 ${value || '(입력 없음)'} 없음`}</strong></div>
    <div className="example-relation"><h4>주문 릴레이션 · 입력 예시</h4><div className="table-wrap"><table><caption>첫 번째 투플의 주문고객을 바꾸어 참조 무결성 비교</caption><thead><tr>{['주문번호', '주문고객', '주문제품', '수량', '단가', '주문일자'].map((column, index) => <th scope="col" key={column}>{column}{index < 2 ? <small className={`relation-key-label ${index === 1 ? 'foreign' : ''}`}>{index === 0 ? 'PK' : 'FK'}</small> : null}</th>)}</tr></thead><tbody>{orders.map((row, rowIndex) => <tr key={String(row[0])} className={rowIndex === 0 && !valid ? 'customer-order-invalid' : ''}>{row.map((cell, columnIndex) => <td key={columnIndex} className={rowIndex === 0 && columnIndex === 1 ? valid ? 'reference-match' : 'customer-fk-invalid' : ''}>{cell}</td>)}</tr>)}</tbody></table></div></div>
    <p className={`validation-result ${valid ? 'valid' : 'invalid'}`} role="status">{valid ? `고객 표에 ${value}가 존재하므로 주문 1001의 외래키가 참조 무결성 조건을 만족합니다.` : `고객 표에 ${value || '입력한 고객아이디'}가 없습니다. 주문번호 1001이 유효해도 주문고객의 참조가 잘못되어 이 투플은 저장할 수 없습니다.`}</p><p className="visual-caption">첨부 이미지의 값을 재구성한 이해용 예시 · 다른 고객아이디도 입력할 수 있습니다. 고객 추가는 화면의 시뮬레이션이며, 추가 고객의 나이·등급·직업은 아직 모르는 값으로 표시했습니다.</p>
  </div>
}
