import { useEffect, useState } from 'react'
import { Icon } from './components'
import type { PageId, SearchEntry } from './content'
import { dbmsGroups } from './dbmsContent'
import { dbsGroups } from './dbsContent'
import { relationGroups } from './relationContent'

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
  const [expanded, setExpanded] = useState({ basics: page === 'basics', dbms: page === 'dbms', dbs: page === 'dbs', relation: page === 'relation', quiz: page === 'quiz' })

  useEffect(() => {
    setExpanded(previous => ({ ...previous, [page]: true }))
  }, [page])

  function togglePage(target: PageId) {
    setExpanded(previous => ({ ...previous, [target]: !previous[target] }))
    if (page !== target && !expanded[target]) onSelect({ title: '', text: '', section: 'main', page: target })
  }

  return <aside className="sidebar">
    <a className="brand" href="#main"><Icon kind="database" /><span>justDatabase</span></a>
    <p className="nav-label">개념 정리</p>
    <nav className="compact-toc" aria-label="학습 목차">
      <details className={`toc-page ${page === 'basics' ? 'current' : ''}`} open={expanded.basics}><summary onClick={event => { event.preventDefault(); togglePage('basics') }}><Icon /><span>데이터베이스, 정보</span><Chevron /></summary>
        <div className="toc-groups">{groups.map(group => <details className={`toc-group ${active === group.section ? 'selected' : ''}`} key={group.section}>
          <summary><Chevron /><span>{group.title}</span></summary>
          <ul>{group.keywords.map(keyword => <li key={keyword.title}><a href={`#${keyword.target}`} onClick={event => { event.preventDefault(); onSelect({ ...keyword, text: '', section: group.section }) }}>{keyword.title}</a></li>)}</ul>
        </details>)}</div>
      </details>
      <details className={`toc-page ${page === 'dbms' ? 'current' : ''}`} open={expanded.dbms}><summary onClick={event => { event.preventDefault(); togglePage('dbms') }}><Icon kind="database" /><span>데이터베이스 관리 시스템</span><Chevron /></summary>
        <div className="toc-groups">{dbmsGroups.map(group => <details className={`toc-group ${active === group.section ? 'selected' : ''}`} key={group.section}><summary><Chevron /><span>{group.title}</span></summary><ul>{group.keywords.map(keyword => <li key={keyword.title}><a href={`#${keyword.target}`} onClick={event => { event.preventDefault(); onSelect({ ...keyword, text: '', section: group.section, page: 'dbms' }) }}>{keyword.title}</a></li>)}</ul></details>)}</div>
      </details>
      <details className={`toc-page ${page === 'dbs' ? 'current' : ''}`} open={expanded.dbs}><summary onClick={event => { event.preventDefault(); togglePage('dbs') }}><Icon kind="database" /><span>데이터베이스 시스템</span><Chevron /></summary>
        <div className="toc-groups">{dbsGroups.map(group => <details className={`toc-group ${active === group.section ? 'selected' : ''}`} key={group.section}><summary><Chevron /><span>{group.title}</span></summary><ul>{group.keywords.map(keyword => <li key={keyword.title}><a href={`#${keyword.target}`} onClick={event => { event.preventDefault(); onSelect({ ...keyword, text: '', section: group.section, page: 'dbs' }) }}>{keyword.title}</a></li>)}</ul></details>)}</div>
      </details>
      <details className={`toc-page ${page === 'relation' ? 'current' : ''}`} open={expanded.relation}><summary onClick={event => { event.preventDefault(); togglePage('relation') }}><Icon /><span>관계 데이터 모델</span><Chevron /></summary>
        <div className="toc-groups">{relationGroups.map(group => <details className={`toc-group ${active === group.section ? 'selected' : ''}`} key={group.section}><summary><Chevron /><span>{group.title}</span></summary><ul>{group.keywords.map(keyword => <li key={keyword.title}><a href={`#${keyword.target}`} onClick={event => { event.preventDefault(); onSelect({ ...keyword, text: '', section: group.section, page: 'relation' }) }}>{keyword.title}</a></li>)}</ul></details>)}</div>
      </details>
    </nav>
    <div className="sidebar-bottom"><button type="button" className="sidebar-quiz-button" aria-current={page === 'quiz' ? 'page' : undefined} onClick={() => onSelect({ title: '', text: '', section: 'main', page: 'quiz' })}><Icon /><span>문제 풀기</span><Icon kind="arrow" /></button><div className="sidebar-footer">수업 내용을 차근차근,<br />개념에서 이해까지.</div></div>
  </aside>
}

function Chevron() {
  return <svg className="toc-chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 4 4 4-4 4" /></svg>
}
