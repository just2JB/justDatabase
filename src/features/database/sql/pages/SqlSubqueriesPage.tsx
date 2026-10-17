import { useState } from 'react'
import { StudySection } from '../../../../shared/components/StudyComponents'
import { books, queryExamples } from '../data/sqlLessonData'
import { SqlCode, SqlTable } from '../components/SqlLessonParts'
import { advancedExamples, highestBook, subqueryExercises } from '../data/sqlAdvancedData'

function SubqueryFlow() {
  const [step, setStep] = useState(0)
  const maximum = Math.max(...books.map(book=>book.price))
  const steps = ['최고가 한 값 계산', '그 값으로 행 선택', '한 SQL로 표현']
  const codes = ['SELECT MAX(price) FROM Book;', `SELECT bookname, price FROM Book\nWHERE price = ${maximum};`, queryExamples[27].code]
  const data = step===0 ? {columns:['MAX(price)'],rows:[[maximum]]} : step===1 ? {columns:['bookname','price'],rows:highestBook.map(book=>[book.bookname,book.price])} : queryExamples[27].result()
  return <div className="visual-block" id="subquery-flow-demo"><h3>가장 비싼 도서 · 내부 결과가 외부 조건이 되는 과정</h3>
    <div className="sql-learning-step" role="group" aria-label="부속질의 처리 단계">{steps.map((label,index)=><button type="button" key={label} aria-pressed={step===index} onClick={()=>setStep(index)}><span>{index+1}</span>{label}</button>)}</div>
    <p className="sql-stage-summary" role="status"><strong>{steps[step]}</strong>{[
      '모든 도서의 가격에서 MAX가 35000이라는 한 값을 구합니다. 도서 이름은 이 내부 결과에 포함되지 않습니다.',
      '내부에서 구한 35000을 외부의 price와 비교해 같은 가격인 행을 찾습니다. 확인을 위해 이름과 가격을 함께 표시합니다.',
      '35000을 직접 적는 대신 내부 SELECT를 넣었습니다. 최종 SELECT가 bookname만 요청하므로 결과에도 도서 이름 한 열만 나옵니다.',
    ][step]}</p>
    <div key={step} className="content-enter"><SqlCode>{codes[step]}</SqlCode><SqlTable caption={['내부 결과 · 한 열의 한 값','조건으로 고른 행 · 확인용 두 열','최종 질의의 결과 · 이름 한 열'][step]} data={data}/></div>
    <p className="visual-caption">개념을 이해하는 논리적 순서입니다. 실제 DBMS의 실행 방식은 실행 계획에 따라 달라질 수 있습니다.</p>
  </div>
}
function CorrelatedFlow() {
  const [id, setId] = useState(1)
  const book = books.find(b => b.bookid === id) ?? books[0]
  const peers = books.filter(b => b.publisher === book.publisher)
  const average = peers.reduce((n, b) => n + b.price, 0) / peers.length
  return <div className="visual-block"><label className="relation-select">비교할 외부 도서<select value={id} onChange={e => setId(Number(e.target.value))}>{books.map(b => <option key={b.bookid} value={b.bookid}>{b.bookname}</option>)}</select></label><div key={id} className="content-enter"><div className="sql-clause-flow"><span>{book.bookname} · {book.price.toLocaleString()}원</span><span>→ {book.publisher} 평균</span><span>{average.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}원</span></div><p className="sql-stage-summary"><strong>이 출판사의 평균만 계산</strong>{peers.map(peer=>peer.price.toLocaleString()).join(" + ")} = {peers.reduce((sum,peer)=>sum+peer.price,0).toLocaleString()}원 · {peers.length}권으로 나눕니다.</p><SqlTable caption="내부 질의가 평균을 구하는 도서" data={{ columns: ['bookname', 'publisher', 'price'], rows: peers.map(b => [b.bookname, b.publisher, b.price]) }} /><p className="sql-explanation"><strong>{book.price > average ? '결과에 포함' : '결과에서 제외'}</strong> · {book.price.toLocaleString()} {book.price > average ? '>' : '≤'} {average.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}. 평균과 같으면 ‘초과’ 조건을 만족하지 않는다.</p></div></div>
}
export default function SqlSubqueriesPage() {
  const [selected, setSelected] = useState(0)
  const example = advancedExamples[selected]
  return <><div className="page-heading"><h1>부속질의</h1><p>질의 안의 질의로 값·집합·존재 여부를 구하기</p></div>
    <StudySection id="subquery-types" number="01" title="부속질의가 들어가는 세 위치"><p className="sql-explanation">부속질의(부질의)는 다른 SQL 문 안에 포함된 SELECT이다. 외부의 주질의가 내부 결과를 사용한다. 위치에 따른 분류와 외부 행을 참조하는지에 따른 분류는 서로 다른 기준이다.</p><div className="dbs-pair">{[['WHERE · 중첩질의', '검색 조건에 사용할 값이나 집합을 만든다.'], ['SELECT · 스칼라 부속질의', '한 값을 결과 열로 표시한다.'], ['FROM · 인라인 뷰', '내부 결과를 테이블처럼 사용한다.']].map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div><p className="dbs-mini">조인은 테이블을 연결하고, 부속질의는 내부 결과를 활용한다. 어느 쪽이 항상 더 빠르다고 단정할 수 없다. 데이터·인덱스·실행 계획에 따라 달라진다.</p></StudySection>
    <StudySection id="subquery-flow" number="02" title="단일 값 · 여러 값 · 행의 존재"><SubqueryFlow /><div className="table-wrap"><table><thead><tr><th>사용 형태</th><th>내부 결과</th><th>판단 기준</th></tr></thead><tbody><tr><th>price = (SELECT …)</th><td>스칼라 · 한 열, 최대 한 행</td><td>0행이면 NULL, 2행 이상이면 오류</td></tr><tr><th>custid IN (SELECT …)</th><td>한 열의 여러 값 가능</td><td>일치하는 값이 있는가</td></tr><tr><th>EXISTS (SELECT …)</th><td>반환 행</td><td>1행 이상이면 참, 0행이면 거짓</td></tr><tr><th>NOT EXISTS (SELECT …)</th><td>반환 행</td><td>0행이면 참</td></tr></tbody></table></div><p className="dbs-mini">NOT IN의 내부 결과에 NULL이 있으면 일치하지 않는 값도 UNKNOWN이 되어 WHERE에서 제외될 수 있다. 미구매 여부는 고객번호를 연결한 NOT EXISTS로 표현하면 이해하기 쉽다. EXISTS의 SELECT 1은 값 1을 비교하는 것이 아니다.</p><SqlCode>{queryExamples[29].code}</SqlCode><div className="sql-clause-flow"><span>대한미디어 도서번호</span><span>→ 주문 고객번호</span><span>→ 고객 이름</span></div><SqlTable caption="대한미디어 도서 구매 고객" data={queryExamples[29].result()} /></StudySection>
    <StudySection id="subquery-correlated" number="03" title="상관 부속질의: 외부 행을 내부 조건에 전달"><SqlCode>{queryExamples[30].code}</SqlCode><p className="sql-explanation">b2.publisher = b1.publisher에서 b1은 외부 도서, b2는 내부 도서이다. 현재 도서와 같은 출판사의 평균을 구해 현재 도서의 가격과 비교한다.</p><CorrelatedFlow /><SqlTable caption="출판사 평균보다 비싼 도서 전체" data={queryExamples[30].result()} /></StudySection>
    <StudySection id="subquery-library" number="04" title="질의를 바꿔 결과 비교하기"><div className="visual-block"><label className="relation-select">질의 선택<select value={selected} onChange={e => setSelected(Number(e.target.value))}>{advancedExamples.map((e, i) => <option key={e.title} value={i}>{e.title}</option>)}</select></label><div key={selected} className="content-enter"><SqlCode>{example.code}</SqlCode><p className="sql-explanation">{example.explanation}</p><SqlTable caption="결과 미리보기" data={example.result} /></div><p className="visual-caption">기존 마당서점 데이터로 계산한 미리보기. PPT의 amount는 이 사이트 데이터의 saleprice로 통일했다. SELECT·FROM 위치의 두 예제는 분류 이해를 위한 보충 예제이다.</p></div></StudySection>
    <StudySection id="subquery-exercises" number="05" title="구매 데이터 연습문제"><p className="sql-explanation">먼저 질의를 생각한 뒤 해설을 펼쳐 보자. 결과의 순서는 ORDER BY가 없으면 보장되지 않는다.</p>{subqueryExercises.map(([title, code, answer], i) => <details className="sql-exercise" key={title}><summary>{i + 5}. {title}</summary><div><SqlCode>{code}</SqlCode><p className="sql-explanation">{answer}</p></div></details>)}</StudySection>
  </>
}
