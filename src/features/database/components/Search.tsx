import { useState } from 'react'
import { searchEntries } from '../data/content'
import { dbmsSearchEntries } from '../data/dbmsContent'
import { dbsSearchEntries } from '../data/dbsContent'
import { relationSearchEntries } from '../data/relationContent'
import { advancedSearchEntries } from '../sql/data/sqlAdvancedData'
import { sqlSearchEntries } from '../sql/data/sqlLessonData'
import type { SearchEntry } from '../data/content'
import { dictionaryEntries } from '../language/sqlDictionary'

const normalize = (text: string) => text.toLocaleLowerCase().replace(/\s+/g, '')
const allEntries: SearchEntry[] = [...searchEntries, ...dbmsSearchEntries, ...dbsSearchEntries, ...relationSearchEntries, ...sqlSearchEntries, ...advancedSearchEntries,
  ...dictionaryEntries.map(entry => ({ title: `${entry.keyword} · ${entry.title}`, text: `${entry.group} SQL 문법 사전 ${entry.explanation} ${entry.sql}`, section: `sql-ref-${entry.id}`, page: 'languages' as const })),
  { title: '개념 문제 풀이', text: '퀴즈 객관식 OX 시험 연습 정답 해설 오답 다시 풀기', section: 'concept-quiz', page: 'quiz' },
  { title: '릴레이션 직접 만들기', text: '실습 후보키 복합키 투플 행 열 선택 무결성', section: 'relation-practice', page: 'quiz' },
]

export default function Search({ onSelect }: { onSelect: (entry: SearchEntry) => void }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const term = normalize(query)
  const results = term ? allEntries.filter(entry => normalize(`${entry.title} ${entry.text}`).includes(term)) : []

  function navigate(entry: SearchEntry) {
    onSelect(entry)
    setOpen(false)
  }

  return <div className="search-container" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false) }}>
    <div className="search-input"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg><input aria-label="개념 키워드 검색" placeholder="키워드로 개념 찾기" value={query} onFocus={() => setOpen(true)} onChange={event => { setQuery(event.target.value); setOpen(true) }} onKeyDown={event => { if (event.key === 'Escape') setOpen(false); if (event.key === 'Enter' && results[0]) navigate(results[0]) }} />{query ? <button type="button" aria-label="검색어 지우기" onClick={() => { setQuery(''); setOpen(true) }}>지우기</button> : <span>검색</span>}</div>
    {open && term ? <div className="search-results"><p role="status">검색 결과 {results.length}개</p>{results.length ? <ul>{results.map(entry => <li key={entry.title}><button type="button" onClick={() => navigate(entry)}><strong>{entry.title}</strong><span>{entry.text}</span></button></li>)}</ul> : <div className="empty-search">일치하는 개념이 없습니다.<br />다른 키워드로 검색해 보세요.</div>}</div> : null}
  </div>
}
