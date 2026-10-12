import { useState } from 'react'
import KeyRelations, { ForeignKeyRelations } from './KeyRelations'
import IntegrityRelations from './IntegrityRelations'
import { Icon, StudySection } from './components'
import { keyKinds, relationProperties, relationTerms } from './relationContent'
import RelationExamples from './RelationExampleGallery'

const students = [
  { id: 101, name: '학생 A', grade: 1, email: 'a@example.com' },
  { id: 102, name: '학생 B', grade: 2, email: 'b@example.com' },
  { id: 103, name: '학생 A', grade: 1, email: 'c@example.com' },
]

function RelationExplorer() {
  const [focus, setFocus] = useState<'attribute' | 'tuple'>('attribute')
  const [added, setAdded] = useState(false)
  const [reversed, setReversed] = useState(false)
  const rows = added ? [...students, { id: 104, name: '학생 C', grade: 3, email: 'd@example.com' }] : students
  const displayed = reversed ? [...rows].reverse() : rows
  return <div id="relation-explorer" className="visual-block"><div className="visual-header"><h3>학생 릴레이션을 살펴보기</h3><div className="relation-actions"><button type="button" className="visual-button" onClick={() => setAdded(value => !value)}>{added ? '추가 행 되돌리기' : '투플 추가'}</button><button type="button" className="visual-button" onClick={() => setReversed(value => !value)}>행 순서 바꾸기</button></div></div><div className="relation-metrics"><span><strong>차수 3</strong>속성의 개수</span><span><strong>카디널리티 {rows.length}</strong>투플의 개수</span></div><div className="concept-controls"><button type="button" aria-pressed={focus === 'attribute'} onClick={() => setFocus('attribute')}>속성 = 열</button><button type="button" aria-pressed={focus === 'tuple'} onClick={() => setFocus('tuple')}>투플 = 행</button></div><div className="table-wrap"><table className={`relation-table focus-${focus}`}><caption>학생번호 · 이름 · 학년으로 구성된 릴레이션</caption><thead><tr><th>학생번호</th><th>이름</th><th>학년</th></tr></thead><tbody>{displayed.map((student, index) => <tr key={student.id} className={index === 0 ? 'first-tuple' : ''}><td>{student.id}</td><td>{student.name}</td><td>{student.grade}</td></tr>)}</tbody></table></div><p className="dbs-mini" aria-live="polite">{focus === 'attribute' ? '학생번호 열을 강조했습니다. 하나의 속성이며, 파일 시스템에서는 필드에 대응합니다.' : '첫 번째로 표시된 행을 강조했습니다. 하나의 투플이며, 파일 시스템에서는 레코드에 대응합니다.'} {reversed ? '표시 순서가 달라져도 릴레이션의 의미는 같습니다.' : ''}</p><p className="visual-caption">이해용 예시 · 투플을 추가하면 카디널리티가 변하지만 차수는 그대로입니다.</p></div>
}

function DomainExample() {
  const [value, setValue] = useState('2')
  const valid = ['1', '2', '3', '4'].includes(value)
  return <div id="relation-domain" className="dbs-pair"><article><h3>도메인: 가능한 값의 집합</h3><p>하나의 속성이 가질 수 있는 모든 값의 집합이며, 입력·수정할 값의 적합성을 판단하는 기준이다. 일반적으로 속성의 특성을 고려한 자료형으로 정리한다.</p><label className="relation-select">예시 · 학년의 도메인을 {'{1, 2, 3, 4}'}로 정한 경우<select value={value} onChange={event => setValue(event.target.value)}>{['1', '2', '3', '4', '5', '문자'].map(item => <option key={item}>{item}</option>)}</select></label><p className={`validation-result ${valid ? 'valid' : 'invalid'}`} role="status">{valid ? '도메인에 포함되는 값입니다.' : '정한 도메인에 없는 값이므로 적합하지 않습니다.'}</p></article><article><h3>NULL: 아직 모르는 값</h3><p>속성 값을 아직 모르거나, 해당되는 값이 없음을 나타낸다.</p><div className="null-example"><span>학생번호 <strong>101</strong></span><span>연락처 <strong>NULL</strong></span></div><p className="dbs-mini">이해용 예시 · 학생은 등록했지만 연락처는 아직 모르는 상황. NULL은 숫자 0이나 빈 문자열을 뜻하지 않습니다.</p></article></div>
}

export default function RelationPage() {
  const [property, setProperty] = useState(0)
  return <><div className="page-heading"><h1>관계 데이터 모델</h1><p>테이블로 표현하는 데이터, 데이터를 구별하고 지키는 규칙</p></div>
    <StudySection id="relation-intro" number="01" title="관계 모델과 기본 용어"><div className="definition"><div className="round-icon"><Icon kind="database" /></div><p>개념적 구조를 논리적 구조로 표현하는 <strong>논리적 데이터 모델</strong>. 하나의 개체에 관한 데이터를 하나의 <strong>릴레이션</strong>에 저장한다.</p></div><RelationExplorer /><div className="table-wrap"><table><caption className="sr-only">관계 데이터 모델 기본 용어</caption><thead><tr><th>용어</th><th>의미</th></tr></thead><tbody>{relationTerms.map(([title, english, description]) => <tr key={title}><th scope="row">{title}<small className="term-english">{english}</small></th><td>{description}</td></tr>)}</tbody></table></div><DomainExample /></StudySection>
    <StudySection id="relation-structure" number="02" title="데이터베이스 구성과 릴레이션 특성"><div className="dbs-pair"><article><h3>데이터베이스 스키마</h3><p>데이터베이스 전체 구조. 데이터베이스를 구성하는 릴레이션 스키마의 모음이다.</p><div className="relation-schema-set"><span>학생(학생번호, 이름, 학과번호)</span><span>학과(학과번호, 학과명)</span></div></article><article><h3>데이터베이스 인스턴스</h3><p>데이터베이스를 구성하는 릴레이션 인스턴스의 모음이다.</p><div className="relation-schema-set"><span>학생의 실제 값: 101, 학생 A, 10</span><span>학과의 실제 값: 10, 컴퓨터학과</span></div></article></div><p className="visual-caption">학생·학과를 이용한 이해용 예시</p><RelationExamples /><><div id="relation-properties" className="visual-block"><h3>릴레이션의 네 가지 특성</h3><div className="relation-property-buttons">{relationProperties.map((item, index) => <button type="button" key={item.title} aria-pressed={property === index} onClick={() => setProperty(index)}>{item.title}</button>)}</div><div key={property} className="level-description content-enter" aria-live="polite"><h4>{relationProperties[property].title}</h4><p>{relationProperties[property].text}</p><p className="dbs-mini">예시 · {relationProperties[property].example}</p></div>{property === 3 ? <div className="atomic-example"><span>다중 값 한 칸 <strong>전화 A, 전화 B</strong></span><Icon kind="arrow" /><span>분리된 원자 값 <strong>전화 A</strong><strong>전화 B</strong></span></div> : null}</div></></StudySection>
    <StudySection id="relation-keys" number="03" title="키: 투플을 유일하게 구별하기"><p className="dbs-section-intro">키는 투플들을 유일하게 구별하는 속성 또는 속성들의 집합이다. <strong>유일성</strong>은 모든 투플의 키 값이 서로 다른 것, <strong>최소성</strong>은 꼭 필요한 최소한의 속성만 사용하는 것이다.</p><KeyRelations /><div id="key-kinds" className="table-wrap"><table><caption className="sr-only">키의 종류 비교</caption><thead><tr><th>종류</th><th>조건·역할</th><th>이해용 예시</th></tr></thead><tbody>{keyKinds.map(([title, english, description, example]) => <tr key={title}><th scope="row">{title}<small className="term-english">{english}</small></th><td>{description}</td><td>{example}</td></tr>)}</tbody></table></div><div className="key-hierarchy"><span>슈퍼키 <small>유일성</small></span><Icon kind="arrow" /><span>후보키 <small>+ 최소성</small></span><Icon kind="arrow" /><div><span>기본키 <small>선택한 후보키</small></span><span>대체키 <small>나머지 후보키</small></span></div></div><div id="foreign-key" className="dbs-text-block"><h3>외래키: 다른 릴레이션을 참조하는 연결</h3><ForeignKeyRelations /><ul><li>외래키와 참조하는 기본키의 이름은 달라도 도메인은 같아야 한다.</li><li>하나의 릴레이션에 외래키가 여러 개 존재할 수 있다.</li><li>외래키를 기본키로 사용할 수 있으며, 같은 릴레이션의 기본키를 참조할 수도 있다.</li><li>외래키는 NULL을 가질 수 있다. 다만 기본키의 일부라면 개체 무결성에 따라 NULL을 가질 수 없다.</li></ul><p className="visual-caption">참조 예시 · 학생의 소속학과가 학과의 학과번호를 참조합니다.</p></div></StudySection>
    <StudySection id="relation-integrity" number="04" title="관계 데이터 모델의 제약"><p className="dbs-section-intro"><strong>무결성</strong>은 데이터에 결함이 없고 정확하고 유효하게 유지되는 상태다. 무결성 제약조건은 이를 보장하고 일관된 상태를 유지하기 위한 규칙이다.</p><IntegrityRelations /><IntegrityRelations reference /></StudySection>
  </>
}
