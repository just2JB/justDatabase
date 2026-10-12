import { useEffect, useRef, useState } from 'react'
import { Icon } from './components'
import type { PageId, SearchEntry } from './content'
import { dbmsGroups } from './dbmsContent'
import { dbsGroups } from './dbsContent'
import { relationGroups } from './relationContent'
import { sql4Groups, sql5Groups } from './sqlLessonData'

const groups = [
  { section: 'data', title: '데이터와 정보', keywords: [
    { title: '데이터 · 정보', target: 'data-comparison' },
    { title: '적시성 · 독점성', target: 'information-values' },
    { title: '빅데이터의 3V', target: 'big-data' },
  ] },
  { section: 'database', title: '데이터베이스', keywords: [
    { title: '통합 · 저장 · 공유 · 운영', target: 'database-definition' },
    { title: '실시간 접근성 · 계속 변화', target: 'database-features' },
    { title: '내용 기반 참조 · 동시 공유', target: 'database-features' },
  ] },
  { section: 'classification', title: '데이터의 분류', keywords: [
    { title: '정형', target: 'data-shapes', shape: 0 },
    { title: '반정형', target: 'data-shapes', shape: 1 },
    { title: '비정형', target: 'data-shapes', shape: 2 },
    { title: '명목형 · 순서형', target: 'data-types' },
    { title: '이산형 · 연속형', target: 'data-types' },
  ] },
  { section: 'everyday', title: '일상 속 데이터베이스', keywords: [
    { title: '생활과 문화', target: 'use-0' },
    { title: '비즈니스', target: 'use-1' },
    { title: '학술정보', target: 'use-2' },
    { title: '검색 · 삽입 · 삭제 · 수정', target: 'database-operations' },
  ] },
]

export default function Sidebar({ active, page, onSelect }: { active: string; page: PageId; onSelect: (entry: SearchEntry) => void }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 760px)').matches)
  const panel = useRef<HTMLElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const [expanded, setExpanded] = useState({ basics: page === 'basics', dbms: page === 'dbms', dbs: page === 'dbs', relation: page === 'relation', quiz: page === 'quiz', sql4: page === 'sql4', sql5: page === 'sql5' })

  useEffect(() => {
    const query = window.matchMedia('(max-width: 760px)')
    function resize() { setMobile(query.matches); if (!query.matches) setMobileOpen(false) }
    query.addEventListener('change', resize)
    return () => query.removeEventListener('change', resize)
  }, [])

  useEffect(() => {
    if (!mobile || !mobileOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panel.current?.querySelector<HTMLButtonElement>('.mobile-toc-close')?.focus()
    function keydown(event: KeyboardEvent) {
      if (event.key === 'Escape') { setMobileOpen(false); return }
      if (event.key !== 'Tab') return
      const items = Array.from(panel.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), summary') ?? []).filter(element => element.getClientRects().length > 0)
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
    document.addEventListener('keydown', keydown)
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', keydown); trigger.current?.focus() }
  }, [mobile, mobileOpen])

  function selectItem(entry: SearchEntry) { setMobileOpen(false); onSelect(entry) }

  useEffect(() => {
    setExpanded(previous => ({ ...previous, [page]: true }))
  }, [page])

  function togglePage(target: PageId) {
    setExpanded(previous => ({ ...previous, [target]: !previous[target] }))
    if (page !== target && !expanded[target]) onSelect({ title: '', text: '', section: 'main', page: target })
  }

  return <><button type="button" ref={trigger} className="mobile-toc-trigger" aria-label="학습 목차 열기" aria-controls="study-sidebar" aria-expanded={mobileOpen} onClick={() => setMobileOpen(true)}><Icon /><span>목차</span></button>{mobile && mobileOpen ? <button type="button" className="mobile-toc-backdrop" aria-label="목차 닫기" tabIndex={-1} onClick={() => setMobileOpen(false)} /> : null}<aside id="study-sidebar" ref={panel} className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`} role={mobile && mobileOpen ? 'dialog' : 'complementary'} aria-modal={mobile && mobileOpen ? true : undefined} aria-label="학습 목차">
    <div className="sidebar-heading"><a className="brand" href="#main" onClick={() => setMobileOpen(false)}><Icon kind="database" /><span>justDatabase</span></a><button type="button" className="mobile-toc-close" aria-label="목차 닫기" onClick={() => setMobileOpen(false)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button></div>
    <p className="nav-label">개념 정리</p>
    <nav className="compact-toc" aria-label="학습 목차">
      <details className={`toc-page ${page === 'basics' ? 'current' : ''}`} open={expanded.basics}><summary onClick={event => { event.preventDefault(); togglePage('basics') }}><Icon /><span>데이터베이스, 정보</span><Chevron /></summary>
        <div className="toc-groups">{groups.map(group => <details className={`toc-group ${active === group.section ? 'selected' : ''}`} key={group.section}>
          <summary><Chevron /><span>{group.title}</span></summary>
          <ul>{group.keywords.map(keyword => <li key={keyword.title}><a href={`#${keyword.target}`} onClick={event => { event.preventDefault(); selectItem({ ...keyword, text: '', section: group.section }) }}>{keyword.title}</a></li>)}</ul>
        </details>)}</div>
      </details>
      <details className={`toc-page ${page === 'dbms' ? 'current' : ''}`} open={expanded.dbms}><summary onClick={event => { event.preventDefault(); togglePage('dbms') }}><Icon kind="database" /><span>데이터베이스 관리 시스템</span><Chevron /></summary>
        <div className="toc-groups">{dbmsGroups.map(group => <details className={`toc-group ${active === group.section ? 'selected' : ''}`} key={group.section}><summary><Chevron /><span>{group.title}</span></summary><ul>{group.keywords.map(keyword => <li key={keyword.title}><a href={`#${keyword.target}`} onClick={event => { event.preventDefault(); selectItem({ ...keyword, text: '', section: group.section, page: 'dbms' }) }}>{keyword.title}</a></li>)}</ul></details>)}</div>
      </details>
      <details className={`toc-page ${page === 'dbs' ? 'current' : ''}`} open={expanded.dbs}><summary onClick={event => { event.preventDefault(); togglePage('dbs') }}><Icon kind="database" /><span>데이터베이스 시스템</span><Chevron /></summary>
        <div className="toc-groups">{dbsGroups.map(group => <details className={`toc-group ${active === group.section ? 'selected' : ''}`} key={group.section}><summary><Chevron /><span>{group.title}</span></summary><ul>{group.keywords.map(keyword => <li key={keyword.title}><a href={`#${keyword.target}`} onClick={event => { event.preventDefault(); selectItem({ ...keyword, text: '', section: group.section, page: 'dbs' }) }}>{keyword.title}</a></li>)}</ul></details>)}</div>
      </details>
      <details className={`toc-page ${page === 'relation' ? 'current' : ''}`} open={expanded.relation}><summary onClick={event => { event.preventDefault(); togglePage('relation') }}><Icon /><span>관계 데이터 모델</span><Chevron /></summary>
        <div className="toc-groups">{relationGroups.map(group => <details className={`toc-group ${active === group.section ? 'selected' : ''}`} key={group.section}><summary><Chevron /><span>{group.title}</span></summary><ul>{group.keywords.map(keyword => <li key={keyword.title}><a href={`#${keyword.target}`} onClick={event => { event.preventDefault(); selectItem({ ...keyword, text: '', section: group.section, page: 'relation' }) }}>{keyword.title}</a></li>)}</ul></details>)}</div>
      </details>
      {([{ id: 'sql4', title: 'SQL 기초 · 테이블 정의', groups: sql4Groups }, { id: 'sql5', title: 'SQL 검색 · 데이터 질의', groups: sql5Groups }] as const).map(lesson => <details key={lesson.id} className={`toc-page ${page === lesson.id ? 'current' : ''}`} open={expanded[lesson.id]}><summary onClick={event => { event.preventDefault(); togglePage(lesson.id) }}><Icon /><span>{lesson.title}</span><Chevron /></summary><div className="toc-groups">{lesson.groups.map(group => <details className={`toc-group ${active === group.section ? 'selected' : ''}`} key={group.section}><summary><Chevron /><span>{group.title}</span></summary><ul>{group.keywords.map(keyword => <li key={keyword.title}><a href={`#${keyword.target}`} onClick={event => { event.preventDefault(); selectItem({ ...keyword, text: '', section: group.section, page: lesson.id }) }}>{keyword.title}</a></li>)}</ul></details>)}</div></details>)}
    </nav>
    <div className="sidebar-bottom"><button type="button" className="sidebar-quiz-button" aria-current={page === 'quiz' ? 'page' : undefined} onClick={() => selectItem({ title: '', text: '', section: 'main', page: 'quiz' })}><Icon /><span>문제 풀기</span><Icon kind="arrow" /></button><div className="sidebar-footer">수업 내용을 차근차근,<br />개념에서 이해까지.</div></div>
  </aside></>
}

function Chevron() {
  return <svg className="toc-chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 4 4 4-4 4" /></svg>
}
