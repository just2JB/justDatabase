import { useState } from 'react'
import { Icon } from '../../../shared/components/StudyComponents'

export function BigDataVisual() {
  return <div id="big-data" className="big-data-section">
    <h3>빅데이터의 특징, 3V</h3>
    <div className="big-data-grid">
      <article><div className="v-visual volume-visual" aria-hidden="true">{Array.from({ length: 36 }, (_, index) => <i key={index} />)}</div><h4>Volume</h4><strong>크기</strong><p>데이터의 크기</p></article>
      <article><div className="v-visual velocity-visual" aria-hidden="true"><span /><span /><span /><Icon kind="arrow" /></div><h4>Velocity</h4><strong>생성 속도</strong><p>데이터가 생성되는 속도</p></article>
      <article><div className="v-visual variety-visual" aria-hidden="true"><span>Aa</span><span>{'{ }'}</span><Icon /><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="16" cy="9" r="2" /><path d="m3 18 6-7 5 5 3-3 4 5" /></svg></div><h4>Variety</h4><strong>다양성</strong><p>데이터의 다양한 형태</p></article>
    </div>
    <p className="big-data-example">우리 생활에서도 다양하게 활용됩니다. <span>학생 데이터 <Icon kind="arrow" /> 학사 데이터베이스</span></p>
  </div>
}

// 같은 예시를 두 관점으로 보여 주어 데이터와 정보의 관계를 설명합니다.
export function MeaningVisual() {
  const [meaning, setMeaning] = useState(false)
  return <div className="visual-block meaning-visual">
    <div className="visual-header"><h3>데이터에 의미를 부여하면?</h3></div>
    <div className={`meaning-example ${meaning ? 'has-meaning' : ''}`}>
      <div className="observed-values" aria-live="polite">
        <span>{meaning ? '학년이라는 의미가 붙은 값' : '관측한 값'}</span>
        <div className="value-tokens">{[1, 2, 3].map(value => <div className="value-token" key={value}><strong>{value}</strong><span className="value-unit" aria-hidden={!meaning}>학년</span></div>)}</div>
      </div>
      <div className="meaning-action"><button type="button" className="visual-button" aria-pressed={meaning} onClick={() => setMeaning(value => !value)}>{meaning ? '의미 부여 되돌리기' : '의미 부여하기'}</button><Icon kind="arrow" /></div>
      <div className={meaning ? 'meaning-result revealed' : 'meaning-result'} aria-live="polite"><span>{meaning ? '관련성과 목적성이 있는 정보' : '의미를 부여하기 전'}</span><strong>{meaning ? '학생의 학년을 나타내는 값' : '무엇을 나타내는 값일까?'}</strong></div>
    </div>
    <p className="visual-caption">개념 이해를 위한 예시 · 같은 값도 의미가 부여되면 정보가 됩니다.</p>
  </div>
}

const dbSteps = [
  { title: '통합', text: '여러 사용자가 사용할 데이터를 하나의 데이터베이스에 모읍니다.' },
  { title: '저장', text: '모은 데이터를 데이터베이스에 저장합니다.' },
  { title: '공유', text: '여러 사용자가 같은 데이터베이스를 함께 사용합니다.' },
  { title: '운영', text: '조직에 필요한 데이터를 사용하고, 변하는 값을 삽입·삭제·수정합니다.' },
]
export function DatabaseVisual() {
  const [step, setStep] = useState(0)
  return <><div className="visual-block"><div className="visual-header"><h3>하나의 데이터베이스, 여러 사용자</h3></div><div className={`database-map step-${step}`} aria-label="여러 사용자가 하나의 데이터베이스에 연결되는 개념도"><div className="user-nodes">{['사용자 A', '사용자 B', '사용자 C'].map(user => <div key={user}><Icon /><span>{user}</span></div>)}</div><div className="map-connectors" aria-hidden="true"><svg viewBox="0 0 150 150" preserveAspectRatio="none"><path d="M0 25H60V75H150M0 75H150M0 125H60V75" /></svg></div><div className="database-node"><Icon kind="database" /><strong>데이터베이스</strong><span>조직의 운영 데이터</span></div></div><div className="concept-controls" aria-label="데이터베이스 핵심 개념">{dbSteps.map((item, index) => <button type="button" key={item.title} aria-pressed={step === index} onClick={() => setStep(index)}>{item.title}</button>)}</div><p key={step} className="concept-description content-enter" aria-live="polite"><strong>{dbSteps[step].title}</strong>{dbSteps[step].text}</p><p className="visual-caption">정의의 네 가지 핵심 단어를 눌러 관계를 살펴보세요.</p></div></>
}

export function ShapeVisual({ shape }: { shape: number }) {
  return <div className="shape-visual"><span className="visual-caption">형태를 비교하는 예시</span>{shape === 0 ? <table><thead><tr><th>학생</th><th>학년</th></tr></thead><tbody><tr><td>학생 A</td><td>1</td></tr><tr><td>학생 B</td><td>2</td></tr></tbody></table> : shape === 1 ? <pre>{'{\n  "학생": "학생 A",\n  "학년": 1\n}'}</pre> : <div className="unstructured"><div><svg viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="2" y="2" width="36" height="26" rx="3" /><circle cx="29" cy="9" r="3" /><path d="m2 25 12-12 9 9 6-6 9 9" /></svg><span>이미지</span></div><div><span className="text-sample">오늘의 기록…</span><span>텍스트</span></div><div><svg viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="2" y="2" width="36" height="26" rx="3" /><path d="m16 9 10 6-10 6z" /></svg><span>영상</span></div></div>}</div>
}
