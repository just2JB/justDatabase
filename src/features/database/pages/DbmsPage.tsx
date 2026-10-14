import { useState } from 'react'
import { Icon, StudySection } from '../../../shared/components/StudyComponents'
import { advantages, dbmsFunctions, disadvantages, generations, models } from '../data/dbmsContent'

function FileComparison() {
  const [managed, setManaged] = useState(false)
  return <div className="visual-block"><div className="visual-header"><h3>같은 데이터를 어디에서 관리할까?</h3><button type="button" className="visual-button" aria-pressed={managed} onClick={() => setManaged(value => !value)}>{managed ? '파일 시스템 보기' : 'DBMS로 모으기'}</button></div>
    <div className={`file-comparison ${managed ? 'managed' : ''}`} role="group" aria-label={managed ? '학사·도서관·장학 프로그램이 하나의 DBMS에 연결되는 구조' : '프로그램마다 별도 파일을 관리하는 구조'}>
      <div className="program-rows">{['학사 프로그램', '도서관 프로그램', '장학 프로그램'].map(label => <div className="program-row" key={label}><span>{label}</span>{managed ? null : <><Icon kind="arrow" /><div className="file-record"><Icon /><span>학생 A · 1학년</span></div></>}</div>)}</div>
      {managed ? <><div className="dbms-connections" aria-hidden="true"><svg viewBox="0 0 160 150" preserveAspectRatio="none"><g className="dbms-connection-lines"><path d="M0 21H60Q72 21 72 33V63Q72 75 84 75H158" /><path d="M0 75H158" /><path d="M0 129H60Q72 129 72 117V87Q72 75 84 75H158" /></g><path className="dbms-connection-arrow" d="m149 68 9 7-9 7" /></svg><span>공통 데이터에 접근</span></div><div className="managed-store"><strong>DBMS</strong><Icon kind="database" /><span>학생 A · 1학년</span><small>통합된 데이터베이스</small></div></> : null}
    </div>
    <p className="concept-description" aria-live="polite">{managed ? 'DBMS가 데이터를 통합하여 저장·관리하고, 여러 응용 프로그램이 함께 사용합니다.' : '응용 프로그램마다 별도의 파일을 관리하면 같은 학생 데이터가 여러 곳에 중복 저장됩니다.'}</p><p className="visual-caption">개념 이해를 위한 예시</p>
  </div>
}

function FunctionVisual() {
  const [selected, setSelected] = useState(0)
  const item = dbmsFunctions[selected]
  return <><div id="dbms-functions" className="visual-block"><div className="visual-header"><h3>DBMS의 세 가지 주요 기능</h3></div><div className="function-selector">{dbmsFunctions.map((fn, index) => <button type="button" key={fn.title} aria-pressed={selected === index} onClick={() => setSelected(index)}><strong>{fn.title}</strong><span>{fn.example}</span></button>)}</div>
    <div key={selected} className="function-demo content-enter" aria-live="polite"><div className="function-demo-label"><Icon kind="database" /><strong>{item.title} 기능</strong><p>{item.text}</p></div><div className="function-example">{selected === 0 ? <div className="schema-example"><span>학생 데이터의 구조</span><div><strong>학생</strong><strong>학년</strong></div></div> : selected === 1 ? <div><span className="demo-label">저장된 데이터</span><div className="demo-record"><span>학생 A</span><strong>1학년</strong></div><div className="demo-operations">삽입 · 삭제 · 수정 · 검색</div></div> : <div className="control-example"><svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m20 4 13 5v10c0 8-7 13-13 17C14 32 7 27 7 19V9zM13 20l5 5 10-11" /></svg><strong>정확하고 안전한 데이터</strong></div>}</div></div><p className="visual-caption">기능을 눌러 구조·데이터·제어의 관점을 비교하세요. 표시된 학생 데이터는 이해를 위한 예시입니다.</p></div></>
}

function ModelDiagram({ model }: { model: number }) {
  if (model === 2) return <div className="relation-diagram" aria-label="공통 학생 속성으로 연결한 두 테이블"><div><strong>학생</strong><span>학생 A · 1학년</span></div><Icon kind="arrow" /><div><strong>대출</strong><span>학생 A · 책</span></div></div>
  return <svg className="model-diagram" viewBox="0 0 300 120" role="img" aria-label={model === 0 ? '부모에서 자식으로 이어지는 트리 구조 예시' : '여러 개체 사이를 연결하는 그래프 구조 예시'}><g fill="none" stroke="#a9c3ee" strokeWidth="2">{model === 0 ? <path d="M150 28V56H60V90M150 56H240V90M150 56V90" /> : <path d="M60 30H240L150 95 60 30M60 30l180 65M240 30 60 95M60 95h180" />}</g>{(model === 0 ? [[150, 25], [60, 92], [150, 92], [240, 92]] : [[60, 30], [240, 30], [60, 95], [150, 95], [240, 95]]).map(([x, y], index) => <g key={index}><rect x={x - 24} y={y - 14} width="48" height="28" rx="5" fill="#eef5ff" stroke="#abc7f5" /><text x={x} y={y + 4} textAnchor="middle" fill="#315b9d" fontSize="11">{String.fromCharCode(65 + index)}</text></g>)}</svg>
}

export default function DbmsPage({ initialModel = 0 }: { initialModel?: number }) {
  const [model, setModel] = useState(initialModel)
  return <><div className="page-heading"><h1>데이터베이스 관리 시스템</h1><p>DBMS · 데이터를 통합하여 저장하고 관리하는 소프트웨어</p></div>
    <StudySection id="dbms-intro" number="01" title="DBMS와 등장 배경"><div className="definition"><div className="round-icon"><Icon kind="database" /></div><p><strong>DBMS</strong> (Database Management System)는 조직에 필요한 데이터를 데이터베이스에 <strong>통합</strong>하여 <strong>저장</strong>하고 <strong>관리</strong>한다.</p></div>
      <div id="file-system" className="dbms-text"><h3>파일 시스템</h3><p>파일을 생성, 삭제, 수정, 검색하여 데이터를 파일로 관리하는 소프트웨어. 응용 프로그램별로 필요한 데이터를 별도의 파일로 관리한다.</p></div><FileComparison />
      <h3 id="file-problems" className="subheading">파일 시스템의 한계</h3><dl className="feature-list"><div><dt>데이터 중복성</dt><dd>같은 내용의 데이터가 여러 파일에 중복 저장된다.</dd></div><div><dt>데이터 종속성</dt><dd>응용 프로그램이 데이터 파일에 종속적이다.</dd></div><div><dt>관리 기능 부족</dt><dd>동시 공유, 보안, 회복 기능이 부족하다.</dd></div><div><dt>개발의 어려움</dt><dd>응용 프로그램을 개발하기 쉽지 않다.</dd></div></dl><p className="dbms-callout">파일 시스템의 한계를 해결하기 위해 제시된 소프트웨어가 <strong>DBMS</strong>이다.</p>
    </StudySection>
    <StudySection id="dbms-management" number="02" title="DBMS에서의 데이터 관리"><FunctionVisual /><div id="dbms-tradeoffs" className="dbms-tradeoffs"><article><h3>장점</h3><ul>{advantages.map(item => <li key={item}>{item}</li>)}</ul></article><article><h3>단점</h3><ul>{disadvantages.map(item => <li key={item}>{item}</li>)}</ul></article></div></StudySection>
    <StudySection id="dbms-models" number="03" title="데이터베이스의 종류"><><div className="shape-tabs" role="tablist" aria-label="데이터베이스 모델">{models.map((item, index) => <button type="button" role="tab" id={`model-tab-${index}`} aria-controls="model-panel" aria-selected={model === index} key={item.title} onClick={() => setModel(index)}>{item.title}</button>)}</div><div key={model} id="model-panel" role="tabpanel" aria-labelledby={`model-tab-${model}`} className="model-panel content-enter"><ModelDiagram model={model} /><h3>{models[model].title} 데이터베이스</h3><p>{models[model].text}</p><p className="model-note">{models[model].note}</p><span className="visual-caption">구조를 비교하는 개념도 · 예시</span></div></><div id="object-models" className="two-columns dbms-text"><article><h3>객체지향형</h3><p>객체를 이용해 데이터베이스를 구성한다.</p></article><article><h3>객체관계형</h3><p>객체지향 DBMS와 관계 DBMS를 결합한다.</p></article></div></StudySection>
    <StudySection id="dbms-evolution" number="04" title="DBMS의 발전 과정"><div className="generation-timeline">{generations.map((generation, index) => <article id={`generation-${index}`} key={generation.generation}><div className="generation-heading"><span>{generation.generation}</span><h3>{generation.title}</h3></div><div className="generation-items">{generation.items.map(item => <div key={item.title}><h4>{item.title}</h4><p>{item.description}</p>{item.details.length ? <ul>{item.details.map(detail => <li key={detail}>{detail}</li>)}</ul> : null}<p className="product-examples"><strong>예시</strong>{item.examples}</p></div>)}</div></article>)}</div></StudySection>
  </>
}
