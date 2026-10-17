import { lazy, Suspense, useEffect, useState } from 'react'
import { scrollToTarget } from '../../../shared/navigation'
import { SqlTable } from '../sql/components/SqlLessonParts'
import { missionPhases, missions, missionTables } from './missions'
import './workbench.css'

const MissionSolution = lazy(() => import('./MissionSolution'))
const storageKey = 'justStudy.database.workbench.v1'
type Progress = { current: number; done: number[]; notes: Record<string, string> }
function readProgress(): Progress {
  try {
    const value = JSON.parse(localStorage.getItem(storageKey) ?? 'null')
    return {
      current: Number.isInteger(value?.current) && value.current >= 1 && value.current <= missions.length ? value.current : 1,
      done: Array.isArray(value?.done) ? value.done.filter((id: unknown) => typeof id === 'number' && Number.isInteger(id) && id >= 1 && id <= missions.length) : [],
      notes: value?.notes && typeof value.notes === 'object' && !Array.isArray(value.notes) ? Object.fromEntries(Object.entries(value.notes).filter(([key, note]) => /^\d+$/.test(key) && typeof note === 'string')) as Record<string, string> : {},
    }
  } catch { return { current: 1, done: [], notes: {} } }
}
function destinationId(target: string) {
  const id = Number(/^workbench-mission-(\d+)$/.exec(target)?.[1])
  return Number.isInteger(id) && id >= 1 && id <= missions.length ? id : undefined
}

export default function WorkbenchPage({ target, showAnswers = false, onNavigate }: {
  target: string; showAnswers?: boolean; onNavigate: (answers: boolean, id: number) => void
}) {
  const [progress, setProgress] = useState(readProgress)
  const [storageError, setStorageError] = useState(false)
  const [table, setTable] = useState(0)
  const current = destinationId(target) ?? progress.current
  const mission = missions[current - 1]
  const complete = progress.done.includes(current)
  useEffect(() => { if (destinationId(target)) scrollToTarget(target) }, [target])
  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify({ ...progress, current })); setStorageError(false) }
    catch { setStorageError(true) }
  }, [progress, current])
  function go(id: number, answers = showAnswers) {
    setProgress(previous => ({ ...previous, current: id }))
    onNavigate(answers, id)
  }
  return <div className="workbench-page">
    <div className="page-heading"><h1>{showAnswers ? 'Workbench 미션 답안' : 'Workbench 실습 미션'}</h1><p>공방 체험 예약 DB · 정의어부터 부속질의까지, 직접 만드는 30개 미션</p></div>
    <div className="wb-intro"><p><strong>MySQL Workbench에서 직접 실행하는 실습입니다.</strong> 로컬 MySQL 서버에 연결한 뒤 새 SQL 탭에서 진행하세요. 이 페이지는 Workbench의 데이터베이스와 연결되지 않습니다.</p><p>MySQL 8.0.16 이상 · InnoDB 기준. 01번부터 순서대로 풀며, 12~26번은 10번에서 입력한 데이터를 유지합니다. 27번 이후에는 데이터가 변경되고 30번은 실습 테이블을 삭제합니다.</p></div>
    <div className="wb-progress"><label htmlFor="wb-progress">직접 완료한 미션 <strong>{progress.done.length} / {missions.length}</strong></label><progress id="wb-progress" value={progress.done.length} max={missions.length}/><small role="status">{storageError ? '브라우저 저장 공간을 사용할 수 없어 이번 변경은 저장되지 않았습니다.' : '완료 표시·작성 메모는 이 브라우저에 자동 저장됩니다.'}</small></div>
    <div className="wb-controls">
      <label>주제<select value={mission.phase} onChange={event => go(missions.find(item => item.phase === event.target.value)!.id)}>{missionPhases.map(phase => <option key={phase}>{phase}</option>)}</select></label>
      <label>미션<select value={current} onChange={event => go(Number(event.target.value))}>{missions.filter(item => item.phase === mission.phase).map(item => <option key={item.id} value={item.id}>{String(item.id).padStart(2, '0')} · {item.title}{progress.done.includes(item.id) ? ' ✓' : ''}</option>)}</select></label>
    </div>
    <article id={`workbench-mission-${current}`} className="wb-mission content-enter" key={current}>
      <div className="wb-mission-heading"><span className="wb-number">MISSION {String(current).padStart(2, '0')}</span><span>{mission.phase}</span></div>
      <h2>{mission.title}</h2><p className="wb-task">{mission.task}</p>
      <h3>요구 조건</h3><ul>{mission.conditions.map(condition => <li key={condition}>{condition}</li>)}</ul>
      <div className="wb-check"><strong>확인할 것</strong><p>{mission.check}</p></div>
      {showAnswers ? <Suspense fallback={<p role="status">답안을 불러오는 중…</p>}><MissionSolution id={current}/></Suspense> : <>
        <label className="wb-notes" htmlFor="wb-notes">내 SQL · 오류 원인 메모<textarea id="wb-notes" value={progress.notes[current] ?? ''} onChange={event => { const note = event.target.value; setProgress(previous => ({ ...previous, notes: { ...previous.notes, [current]: note } })) }} placeholder="Workbench에서 작성한 SQL이나 오류 원인을 기록하세요. 이 칸에서는 SQL을 실행하지 않습니다." spellCheck={false}/></label>
        <p className="muted">실행 결과를 확인한 뒤 아래에 완료 표시하세요. 자동 채점은 하지 않습니다.</p>
      </>}
      <div className="wb-actions"><label className="wb-complete"><input type="checkbox" checked={complete} onChange={() => setProgress(previous => ({ ...previous, done: complete ? previous.done.filter(id => id !== current) : [...previous.done, current] }))}/>결과 확인 · 완료</label><button type="button" onClick={() => go(current, !showAnswers)}>{showAnswers ? '내 미션·메모로 돌아가기' : '이 미션의 답안 페이지 →'}</button></div>
    </article>
    <nav className="wb-stepper" aria-label="실습 미션 이동"><button type="button" disabled={current === 1} onClick={() => go(current - 1)}>← 이전 미션</button><span>{current} / {missions.length}</span><button type="button" disabled={current === missions.length} onClick={() => go(current + 1)}>다음 미션 →</button></nav>
    <details className="wb-data" open={current === 10 ? true : undefined} key={current === 10 ? 'input' : 'reference'}><summary>기준 데이터 · 테이블 관계 보기</summary>
      <p>10번 미션에서 아래 데이터를 입력합니다. 12~26번의 기준이며, 구조 변경을 마친 뒤의 열 이름입니다.</p>
      <div className="wb-relations" aria-label="테이블 참조 관계"><div><strong>Learner</strong><span>learner_id · PK</span></div><b>←</b><div><strong>Booking</strong><span>learner_id · FK<br/>workshop_id · FK</span></div><b>→</b><div><strong>Workshop</strong><span>workshop_id · PK</span></div></div>
      <p className="muted">화살표: 외래키 → 참조하는 기본키. 회원 1명·체험 1개에 예약 여러 건이 연결됩니다. WorkshopTag도 Workshop을 참조하며 이번 실습에서는 빈 테이블로 둡니다.</p>
      <div className="shape-tabs" role="tablist" aria-label="미션 기준 데이터">{missionTables.map((item, index) => <button key={item.name} type="button" role="tab" id={`wb-table-${index}`} aria-selected={table === index} aria-controls="wb-table-panel" onClick={() => setTable(index)}>{item.name} · {item.data.rows.length}행</button>)}</div>
      <div id="wb-table-panel" role="tabpanel" aria-labelledby={`wb-table-${table}`}><SqlTable caption={missionTables[table].name} data={missionTables[table].data}/></div>
    </details>
  </div>
}
