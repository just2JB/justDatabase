import { useState } from 'react'
import { useDiagramMotion } from '../../../shared/hooks/useDiagramMotion'
import './independence.css'

const students = [
  { id: 101, family: '김', given: '하늘', grade: 1 },
  { id: 102, family: '이', given: '서준', grade: 2 },
  { id: 103, family: '박', given: '민서', grade: 3 },
  { id: 104, family: '정', given: '다은', grade: 2 },
]
const stages = ['원래 상태', '하위 구조 변경', '사상 조정 후 확인']

function StudentTable({ split = false }: { split?: boolean }) {
  return <div className="table-wrap"><table className="ind-table"><caption className="sr-only">{split ? '성을 last_name, 이름을 first_name으로 나눈 학생 데이터' : '학생번호, 이름, 학년 데이터'}</caption><thead><tr><th>student_id</th>{split ? <><th className="ind-new-column">last_name</th><th className="ind-new-column">first_name</th></> : <th>name</th>}<th>grade</th></tr></thead><tbody>{students.map(student => <tr key={student.id}><td>{student.id}</td>{split ? <><td className="ind-new-column">{student.family}</td><td className="ind-new-column">{student.given}</td></> : <td>{student.family}{student.given}</td>}<td>{student.grade}</td></tr>)}</tbody></table></div>
}

function StoredPages({ moved }: { moved: boolean }) {
  const pages = moved ? [{ page: 12, ids: [103, 101] }, { page: 30, ids: [104, 102] }] : [{ page: 7, ids: [101, 102] }, { page: 8, ids: [103, 104] }]
  const motion = useDiagramMotion(Number(moved))
  return <div className="ind-storage" ref={motion}>{pages.map((page, index) => <div className="ind-storage-page" key={index}><span>저장 페이지 {page.page}</span>{page.ids.map((id, slot) => <div data-motion-id={`record-${id}`} data-motion-arc="true" key={id} className="ind-record"><small>슬롯 {slot + 1}</small><strong>{id}</strong><span>{students.find(student => student.id === id)!.family}{students.find(student => student.id === id)!.given}</span></div>)}</div>)}</div>
}

export default function IndependenceVisual({ physical = false }: { physical?: boolean }) {
  const [step, setStep] = useState(0)
  const changed = step > 0, mapped = step === 2, pending = step === 1
  const upper = physical ? '개념 스키마' : '외부 스키마'
  const lower = physical ? '내부 스키마' : '개념 스키마'
  const mapping = physical ? '개념 / 내부 사상' : '외부 / 개념 사상'
  const summary = physical
    ? ['학생번호 101의 레코드는 페이지 7, 슬롯 1에 있습니다.', '레코드를 다른 페이지로 재배치했습니다. 논리적 열과 값은 그대로지만, 저장 위치를 찾는 대응 관계는 갱신해야 합니다.', '학생번호 101을 새 위치인 페이지 12, 슬롯 2에서 찾습니다. 논리적 테이블과 응용 프로그램은 바꾸지 않습니다.'][step]
    : ['학생 화면은 Student의 name을 그대로 읽습니다.', '학교 전체 데이터의 name을 last_name과 first_name으로 나눴습니다. 기존 화면이 읽던 name에 대한 대응을 다시 정해야 합니다.', '성을 먼저, 이름을 뒤에 붙인 값을 name으로 제공합니다. 학생 화면의 열과 응용 프로그램은 그대로 유지합니다.'][step]
  return <article id={physical ? 'physical-independence' : 'logical-independence'} className="ind-visual">
    <header className="ind-heading"><div><span className="course-tag">{physical ? '저장 위치를 바꾸는 경우' : '논리적 구조를 바꾸는 경우'}</span><h3>{physical ? '물리적' : '논리적'} 데이터 독립성</h3></div><p><b>{lower}</b>를 바꾸어도, 사상을 조정해 <b>{upper}</b>를 유지합니다.</p></header>
    <div className="ind-stages" role="group" aria-label={`${physical ? '물리적' : '논리적'} 독립성 단계`}>{stages.map((label, index) => <button type="button" key={label} aria-pressed={step === index} onClick={() => setStep(index)}><span>{index + 1}</span>{label}</button>)}</div>
    <div className="ind-summary" role="status">{summary}</div>
    <div className="ind-diagram">
      <section className="ind-layer ind-upper" aria-label={`유지할 ${upper}`}><header><div><span className="ind-level">상위</span><h4>{upper}</h4><small>{physical ? '학교 전체의 논리적 학생 테이블' : '학생 프로그램이 사용하는 StudentView'}</small></div><strong className="ind-badge stable">유지할 부분</strong></header>
        <div className="ind-column-strip"><span>student_id</span><span>name</span><span>grade</span></div>
        {pending ? <div className="ind-waiting"><strong>상위 스키마의 정의는 그대로</strong><p>{physical ? '다만 새 저장 위치로 연결되도록 사상을 조정해야 합니다.' : '다만 새 열들로 기존 name을 제공하도록 사상을 조정해야 합니다.'}</p><span>아래의 ‘사상 조정 후 확인’을 눌러 결과를 확인하세요.</span></div> : <StudentTable/>}
        <p className="ind-layer-note">{mapped ? '✓ 변경 전과 같은 열, 같은 값입니다. 이 구조를 사용하는 응용 프로그램도 그대로 둡니다.' : physical ? '학생의 논리적 데이터입니다. 저장 페이지 번호는 이 테이블의 열이 아닙니다.' : '학생 화면은 이름이 내부에서 어떻게 나뉘어 있는지 알 필요가 없습니다.'}</p>
      </section>
      <div className={`ind-mapping ${pending ? 'pending' : mapped ? 'adjusted' : ''}`}>
        <span className="ind-connector" aria-hidden="true">↑</span><div><strong>{mapping}</strong><span>{pending ? '조정할 대응 관계' : mapped ? '대응 관계 조정 완료' : '현재 대응 관계'}</span>
          {physical ? <p><b>student_id = 101</b><span aria-hidden="true"> → </span>{mapped ? '페이지 12 · 슬롯 2' : '페이지 7 · 슬롯 1'}{pending ? ' (이전 위치)' : ''}</p> : <p><b>화면의 name</b><span aria-hidden="true"> ← </span>{mapped ? 'CONCAT(last_name, first_name)' : 'Student.name'}{pending ? ' (분리 전 열)' : ''}</p>}
          <small>{pending ? '하위 변경을 상위 정의에 그대로 노출하지 않도록 연결을 맞춥니다.' : mapped ? '하위의 변경을 이 대응 관계가 연결해 줍니다.' : '상위와 하위에서 같은 데이터를 어떻게 대응시킬지 정합니다.'}</small>
        </div><span className="ind-connector" aria-hidden="true">↑</span>
      </div>
      <section className={`ind-layer ind-lower ${changed ? 'changed' : ''}`} aria-label={`변경할 ${lower}`}><header><div><span className="ind-level">하위</span><h4>{lower}</h4><small>{physical ? '저장 장치에 배치된 레코드 · 이해용 그림' : '학교 전체에서 정의한 Student 테이블'}</small></div><strong className={`ind-badge ${changed ? 'changed' : ''}`}>{changed ? '변경된 부분' : '변경할 부분'}</strong></header>
        {physical ? <StoredPages moved={changed}/> : <StudentTable split={changed}/>}
        <p className="ind-layer-note">{physical ? changed ? '기존 레코드가 새 페이지로 이동했습니다. 논리적인 학생 정보는 바뀌지 않았습니다.' : '같은 페이지 안에 두 레코드가 저장되어 있습니다. 버튼을 눌러 위치를 바꿔 보세요.' : changed ? 'name 열을 성(last_name)과 이름(first_name) 두 열로 나눴습니다.' : '현재 name 한 열에 성과 이름을 함께 저장합니다.'}</p>
      </section>
    </div>
    <div className="ind-actions"><button type="button" className="visual-button" disabled={step === 0} onClick={() => setStep(step - 1)}>← 이전</button><span>{step + 1} / 3</span><button type="button" className="quiz-primary" disabled={step === 2} onClick={() => setStep(step + 1)}>{step === 0 ? physical ? '저장 위치 바꾸기 →' : '이름 열 나누기 →' : '사상 조정 후 확인 →'}</button><button type="button" className="visual-button" onClick={() => setStep(0)}>처음</button></div>
    <p className="ind-takeaway"><strong>{physical ? '물리적 독립성' : '논리적 독립성'}</strong>{physical ? '저장 위치는 바뀌었지만, 논리적 테이블은 같다.' : '전체 데이터 구조는 바뀌었지만, 기존 화면의 구조는 같다.'}</p>
    {!physical ? <details className="ind-mapping-code"><summary>이 예의 사상을 SQL 뷰로 표현하면</summary><pre><code>{`CREATE OR REPLACE VIEW StudentView AS\nSELECT student_id,\n       CONCAT(last_name, first_name) AS name,\n       grade\nFROM Student;`}</code></pre><p>StudentView를 사용하던 응용 프로그램은 같은 name 열을 계속 읽습니다. SQL 뷰는 이 대응 관계를 이해하기 위한 한 가지 예입니다.</p></details> : null}
    <p className="ind-footnote">사상의 역할을 구분해서 보는 이해용 단계입니다. 실제 DBMS에서 구조 변경과 사상 관리가 반드시 별도의 수동 작업으로 진행된다는 뜻은 아닙니다.</p>
  </article>
}
