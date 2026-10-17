import { useState } from 'react'
import { Icon } from '../../../shared/components/StudyComponents'

export default function FileComparisonVisual() {
  const [managed, setManaged] = useState(false)
  const [updated, setUpdated] = useState(false)
  return <div className="visual-block">
    <div className="visual-header"><h3>한 번 수정한 학년, 다른 업무에서도 같을까?</h3><button type="button" className="visual-button" aria-pressed={managed} onClick={()=>setManaged(value=>!value)}>{managed?'파일 시스템 보기':'DBMS로 모으기'}</button></div>
    <div className="file-update-action"><button type="button" className="visual-button" aria-pressed={updated} onClick={()=>setUpdated(value=>!value)}>{updated?'1학년으로 되돌리기':'학사 담당자가 2학년으로 수정'}</button><p>학생번호 101의 학년을 두 관리 방식에서 비교합니다.</p></div>
    <div className={`file-comparison ${managed?'managed':''}`} role="group" aria-label={managed?'세 프로그램이 DBMS를 통해 같은 학생 데이터에 접근':'세 프로그램이 각각 별도 학생 파일에 접근'}>
      <div className="program-rows">{['학사 프로그램','도서관 프로그램','장학 프로그램'].map((label,index)=><div className="program-row" key={label}><span>{label}{managed?<small style={{display:'block'}}>101 · {updated?2:1}학년 읽기</small>:null}</span>{!managed?<><Icon kind="arrow"/><div className={`file-record ${updated&&index>0?'is-stale':''}`}><span>101 · {updated&&index===0?2:1}학년{updated&&index>0?<small> · 갱신 안 됨</small>:null}</span></div></>:null}</div>)}</div>
      {managed?<><div className="dbms-connections" aria-hidden="true"><svg viewBox="0 0 160 150" preserveAspectRatio="none"><g className="dbms-connection-lines"><path d="M0 21H60Q72 21 72 33V63Q72 75 84 75H158"/><path d="M0 75H158"/><path d="M0 129H60Q72 129 72 117V87Q72 75 84 75H158"/></g><path className="dbms-connection-arrow" d="m149 68 9 7-9 7"/></svg><span>조회·변경 요청</span></div><div className="managed-store"><strong className="dbms-gateway">DBMS · 관리 소프트웨어</strong><span className="store-direction" aria-hidden="true">↓</span><Icon kind="database"/><strong className="store-label">학사 데이터베이스</strong><span className="store-grade">101 · {updated?2:1}학년</span></div></>:null}
    </div>
    <p className="concept-description" role="status"><strong>{managed?'DBMS를 통한 공통 데이터 관리':'프로그램마다 별도 파일 관리'}</strong>{managed?updated?'공통 데이터에서 학년을 2로 수정했습니다. 세 프로그램 모두 같은 2학년 값을 읽습니다.':'세 프로그램이 DBMS를 통해 하나의 공통 학생 데이터를 읽습니다.':updated?'학사 파일만 2학년으로 바뀌고 나머지는 1학년입니다. 중복 데이터의 갱신 불일치를 보여 줍니다.':'같은 학생 정보가 세 파일에 중복 저장되어 있습니다. 학년을 바꾸어 보세요.'}</p>
    <p className="visual-caption">DBMS는 관리하는 소프트웨어, 데이터베이스는 관리 대상인 데이터 집합입니다. 이 그림은 중복 통제와 공유를 비교하는 예시입니다.</p>
  </div>
}
