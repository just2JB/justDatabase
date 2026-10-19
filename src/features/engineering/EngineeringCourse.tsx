import { lazy, Suspense, useEffect, useLayoutEffect, useState } from 'react'
import type { MouseEvent } from 'react'
import { engineeringLessons } from './lessons'
import EngineeringSidebar from './EngineeringSidebar'
import type { EngineeringView } from './EngineeringPractice'
import FloatingContents from '../../shared/components/FloatingContents'
import './engineering.css'

const EngineeringPractice = lazy(() => import('./EngineeringPractice'))

function readEngineeringView(): EngineeringView {
  const view = new URLSearchParams(location.search).get('view')
  return view === 'exam' || view === 'wrong' ? view : 'check'
}

const loop = ['실패 테스트와 실제 필터 코드를 읽는다.', '맵기 비교 조건이 반대로 되어 있는지 판단한다.', '비교 조건을 고치고 테스트를 실행한다.', '테스트 결과를 관찰한다. 실패하면 다시 반복한다.']
const tasks = [
  { title: '데이터 형식 합의', needs: [] },
  { title: '맵기 필터 구현', needs: [0] },
  { title: '추천 화면 틀', needs: [0] },
  { title: '실제 결과 연결', needs: [1, 2] },
] as const

function Experience({ week }: { week: number }) {
  const [speed, setSpeed] = useState(10)
  const [step, setStep] = useState(0)
  const [ears, setEars] = useState(false)
  const [done, setDone] = useState<number[]>([])
  const [water, setWater] = useState('')
  const [layer, setLayer] = useState(0)
  const [fact, setFact] = useState<number | null>(null)
  if (week === 0) return <>
    <h3>구현만 빨라지면 전체는?</h3><p>전체 작업 중 구현이 60%인 경우입니다. 나머지 40%의 시간은 그대로라고 가정합니다.</p>
    <label className="eng-range" htmlFor="implementation-speed">구현 속도 <strong>{speed}배</strong><input id="implementation-speed" type="range" min="1" max="100" value={speed} onChange={e => setSpeed(Number(e.target.value))} /></label>
    <output className="eng-result" aria-live="polite">전체 속도는 약 {(1 / (0.4 + 0.6 / speed)).toFixed(2)}배 · 아무리 빨라져도 상한은 2.5배</output><code>S = 1 / (0.4 + 0.6 / {speed})</code>
  </>
  if (week === 1) return <><h3>라면 필터를 고치는 Agent Loop</h3><div className="eng-flow">{['관찰', '판단', '행동', '결과 관찰'].map((s, i) => <span key={s} className={step === i ? 'selected' : ''}>{i + 1}. {s}</span>)}</div><p className="eng-result" aria-live="polite">{loop[step]}</p><button onClick={() => setStep((step + 1) % 4)}>다음 단계 보기 →</button><p className="eng-small">종료 조건 예: 맵기 1 이하만 반환하고 관련 테스트를 통과한다.</p></>
  if (week === 2) return <><h3>이 문장은 가정일까, 사실일까?</h3><p>“야간 자습생은 모두 매운 라면을 싫어할 것이다.”</p><div className="eng-actions">{['가정', '확인한 사실'].map((s, i) => <button key={s} aria-pressed={fact === i} onClick={() => setFact(i)}>{s}</button>)}</div>{fact !== null ? <p className="eng-result" role="status">{fact === 0 ? '맞아요. 확인 없이 사용자의 선호를 추측한 가정입니다.' : '아직 근거가 없습니다. 실제 경험과 선호를 확인해야 합니다.'}</p> : null}</>
  if (week === 3) return <><h3>주문서에 실패 경로도 넣어보기</h3><div className="eng-actions"><button aria-pressed={!ears} onClick={() => setEars(false)}>정상 경로 · WHEN</button><button aria-pressed={ears} onClick={() => setEars(true)}>실패 경로 · IF</button></div><p className="eng-result" aria-live="polite">{ears ? 'IF 조건에 맞는 라면이 없으면 THEN THE 시스템 SHALL “조건에 맞는 라면이 없습니다”와 필터 초기화 버튼을 표시한다.' : 'WHEN 사용자가 추천 버튼을 누르면 THE 시스템 SHALL 맵기 1 이하의 라면 3개를 3초 이내에 표시한다.'}</p><p className="eng-small">숫자와 동작은 이해를 위한 예시 기준입니다.</p></>
  if (week === 4) return <><h3>지금 시작할 수 있는 태스크는?</h3><p>데이터 형식 합의 → 필터와 화면을 병행 → 실제 결과 연결</p><div className="eng-tasks">{tasks.map((t, i) => { const complete = done.includes(i); const ready = t.needs.every(n => done.includes(n)); return <button key={t.title} disabled={complete || !ready} onClick={() => setDone([...done, i])}><span>{complete ? '✓ 완료' : ready ? '착수 가능' : '선행 작업 대기'}</span>{t.title}</button> })}</div><p className="eng-result" role="status">{done.length === 4 ? '전체 흐름 연결 완료! 의존성을 지키는 작업 순서를 만들었어요.' : `${done.length}/4 완료 · 선행 조건이 없는 태스크부터 선택해 보세요.`}</p><button onClick={() => setDone([])}>다시 해보기</button></>
  if (week === 5) return <><h3>Git은 라면 취향을 고르지 않아요</h3><div className="eng-split"><p><strong>feature/spicy</strong><br />물: 450mL</p><p><strong>feature/mild</strong><br />물: 550mL</p></div><p>같은 줄을 다르게 수정했습니다. 두 변경을 합칠 때 남길 최종 내용을 선택해 보세요.</p><div className="eng-actions">{['450mL', '550mL', '제품별 권장량 표시'].map(s => <button key={s} aria-pressed={water === s} onClick={() => setWater(s)}>{s}</button>)}</div>{water ? <p className="eng-result" role="status">최종 내용: {water}. 사람이 요구를 확인해 결정하고, 충돌 표시 제거 → 저장 → git add → git commit으로 해결을 기록합니다.</p> : null}</>
  const layers = [ ['표현', '맵기 선택 버튼과 추천 카드', '화면과 입력을 바꿉니다. DB 종류나 필터 계산은 직접 다루지 않습니다.'], ['로직', '맵기 필터와 추천 점수 계산', '추천 규칙을 바꿉니다. 화면이 웹인지 앱인지 몰라도 됩니다.'], ['데이터', '라면 목록 조회와 외부 API', '목록을 가져오는 방법을 바꿉니다. 추천 점수는 결정하지 않습니다.'] ]
  return <><h3>어느 계층의 책임일까요?</h3><div className="eng-layers">{layers.map((l, i) => <button key={l[0]} aria-pressed={layer === i} onClick={() => setLayer(i)}><strong>{l[0]} 계층</strong><span>{l[1]}</span></button>)}</div><p className="eng-result" aria-live="polite">{layers[layer][2]}</p><p className="eng-small">호출 방향: 표현 → 로직 → 데이터 / 결과는 반대 방향으로 전달됩니다.</p></>
}

function readWeek() {
  const value = Number(new URLSearchParams(location.search).get('week') ?? 1)
  return Number.isInteger(value) && value >= 1 && value <= 7 ? value - 1 : 0
}

export default function EngineeringCourse() {
  const [week, setWeek] = useState(readWeek)
  const [practice, setPractice] = useState(() => new URLSearchParams(location.search).get('page') === 'quiz')
  const [view, setView] = useState(readEngineeringView)
  const [destination, setDestination] = useState<{ target: string } | null>(null)
  const lesson = engineeringLessons[week]
  useEffect(() => {
    const restore = () => {
      setWeek(readWeek())
      setPractice(new URLSearchParams(location.search).get('page') === 'quiz')
      setView(readEngineeringView())
      setDestination({ target: location.hash.slice(1) || 'main' })
    }
    window.addEventListener('popstate', restore)
    return () => window.removeEventListener('popstate', restore)
  }, [])
  useEffect(() => {
    document.title = `${practice ? '문제 풀기' : lesson.title} · 공학융합프로젝트 · justStudy`
  }, [lesson.title, practice])
  useLayoutEffect(() => {
    if (destination) document.getElementById(destination.target)?.scrollIntoView({ behavior: 'instant', block: 'start' })
  }, [destination])
  const links = [...lesson.concepts.map(([title], i) => ({ title, target: `eng-concept-${i}` })), { title: '라면 앱 예제', target: 'eng-example' }, { title: '직접 체험', target: 'eng-experience' }, { title: '핵심 정리', target: 'eng-takeaway' }]
  function jump(target: string) {
    const url = new URL(location.href)
    url.hash = target
    history.replaceState(null, '', url)
    document.getElementById(target)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })
  }
  function navigate(page: string, target?: string) {
    if (page === 'quiz') { openPractice(view); return }
    const nextWeek = Number(page) - 1
    if (!Number.isInteger(nextWeek) || nextWeek < 0 || nextWeek >= engineeringLessons.length) return
    if (!practice && nextWeek === week) { jump(target ?? 'main'); return }
    const url = new URL(location.href)
    url.searchParams.set('course', 'engineering-project')
    url.searchParams.set('week', page)
    url.searchParams.delete('page')
    url.searchParams.delete('view')
    url.hash = target ?? ''
    history.pushState(null, '', url)
    setWeek(nextWeek)
    setPractice(false)
    setDestination({ target: target ?? 'main' })
  }
  function openPractice(next: EngineeringView) {
    const url = new URL(location.href)
    url.searchParams.set('page', 'quiz')
    url.searchParams.set('view', next)
    url.hash = ''
    if (url.href !== location.href) history.pushState(null, '', url)
    setPractice(true)
    setView(next)
    setDestination({ target: 'main' })
  }
  function followWeek(event: MouseEvent<HTMLAnchorElement>, page: number) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    navigate(String(page))
  }
  return <div className="app-shell engineering-study-shell"><a className="skip-link" href="#main">본문으로 이동</a><EngineeringSidebar page={practice ? 'quiz' : String(week + 1)} onNavigate={navigate} />{!practice ? <FloatingContents key={week} links={links} onJump={jump} /> : null}<main id="main"><header className="topbar"><span>공학융합프로젝트 <span className="slash">/</span> {practice ? '문제 풀기' : lesson.title}</span></header><div className="document eng-main page-enter">
    {practice ? <Suspense fallback={<p role="status">문제를 불러오고 있어요.</p>}><EngineeringPractice view={view} onNavigate={openPractice}/></Suspense> : <>
    <header className="eng-intro"><span className="course-eyebrow">ENGINEERING CONVERGENCE PROJECT</span><h1>공학융합프로젝트</h1><p>개념은 명확하게, 예제는 라면 한 그릇처럼 친근하게.</p><p className="eng-small">제공된 1–7주차 강의 자료 기반 · 과제·팀 활동·윤리 내용 제외</p></header>
    <article key={week} className="eng-lesson"><header className="eng-heading"><span className="course-eyebrow">WEEK {String(week + 1).padStart(2, '0')}</span><h2>{lesson.title}</h2><p>{lesson.subtitle}</p></header><p className="eng-summary">{lesson.summary}</p>
      <section aria-label="핵심 개념" className="eng-concepts">{lesson.concepts.map(([title, text], i) => <div id={`eng-concept-${i}`} key={title}><span>{String(i + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</section>
      <aside id="eng-example" className="eng-example"><span className="course-eyebrow">이해를 위한 추가 예제 · 밤샘 라면 추천 앱</span><h3>라면 앱에 적용하면?</h3><p>{lesson.example}</p></aside>
      <section id="eng-experience" className="eng-experience" aria-label="개념 직접 확인"><span className="course-eyebrow">TRY IT · 이해를 위한 체험</span><Experience key={week} week={week} /></section>
      <div id="eng-takeaway" className="eng-takeaway"><strong>기억할 한 문장</strong><p>{lesson.takeaway}</p></div>
      <footer className="eng-source"><p>강의 근거: {lesson.pages}</p><p>라면 앱 사례·체험은 이해를 위해 추가한 예시입니다.</p></footer>
      <nav className="eng-pagination" aria-label="이전 다음 주차">{week > 0 ? <a href={`?course=engineering-project&week=${week}`} onClick={event => followWeek(event, week)}>← {week}주차</a> : <a href="/">← 전체 과목</a>}{week < 6 ? <a href={`?course=engineering-project&week=${week + 2}`} onClick={event => followWeek(event, week + 2)}>{week + 2}주차 →</a> : <a href="?course=engineering-project&week=1" onClick={event => followWeek(event, 1)}>처음부터 다시 보기 →</a>}</nav>
    </article>
    </>}
  </div></main></div>
}
