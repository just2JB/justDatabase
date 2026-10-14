import { useState } from 'react'
import { algorithmLessons } from '../data/algorithmLessons'

export default function AlgorithmSearch({ onNavigate }: { onNavigate: (page: string, target?: string) => void }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const normalize = (s: string) => s.toLowerCase().replace(/\s/g, '')
  const results = query.trim() ? algorithmLessons.flatMap(lesson => lesson.concepts.map(([title, text], i) => ({ title, text, page: lesson.id, target: `${lesson.id}-${i}` }))).filter(item => normalize(item.title + item.text).includes(normalize(query))) : []
  function choose(item: typeof results[number]) { setOpen(false); onNavigate(item.page, item.target) }
  return <div className="search-container" onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false) }}><div className="search-input"><input aria-label="알고리즘 개념 검색" placeholder="키워드로 개념 찾기" value={query} onFocus={() => setOpen(true)} onChange={e => { setQuery(e.target.value); setOpen(true) }} onKeyDown={e => { if (e.key === 'Escape') setOpen(false); if (e.key === 'Enter' && results[0]) choose(results[0]) }} />{query ? <button onClick={() => setQuery('')} aria-label="검색어 지우기">지우기</button> : <span>검색</span>}</div>{open && query.trim() ? <div className="search-results"><p role="status">검색 결과 {results.length}개</p>{results.length ? <ul>{results.map(item => <li key={item.target}><button onClick={() => choose(item)}><strong>{item.title}</strong><span>{item.text}</span></button></li>)}</ul> : <div className="empty-search">일치하는 개념이 없습니다.</div>}</div> : null}</div>
}
