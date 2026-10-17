import { useEffect, useState } from 'react'
import DictionaryDetail from './DictionaryDetail'
import { dictionaryEntries, dictionaryGroups } from './sqlDictionary'
import type { DictionaryGroup } from './sqlDictionary'
import './language.css'
import './dictionary.css'

const normalize = (value: string) => value.toLowerCase().replace(/\s+/g, '').replaceAll('부질의', '부속질의')
function entryFromTarget(target: string) {
  const id = target.replace('sql-ref-', '')
  return dictionaryEntries.find(entry => entry.id === id)?.id
}
export default function DataLanguagePage({ onJump, target = '' }: { onJump: (target: string) => void; target?: string }) {
  const [selected, setSelected] = useState(() => entryFromTarget(target) ?? 'query-1')
  const [search, setSearch] = useState('')
  const [group, setGroup] = useState<DictionaryGroup | '전체'>('전체')
  const entry = dictionaryEntries.find(item => item.id === selected) ?? dictionaryEntries[0]
  const term = normalize(search)
  const items = dictionaryEntries.filter(item => (group === '전체' || item.group === group) && (!term || normalize(`${item.keyword} ${item.title} ${item.group} ${item.sql} ${item.explanation}`).includes(term)))
  useEffect(() => {
    const id = entryFromTarget(target)
    if (id && id !== selected) { setSelected(id); setGroup('전체'); setSearch('') }
  }, [target])
  function choose(id: string) { setSelected(id); onJump(`sql-ref-${id}`) }
  return <div className="data-language-page sql-dictionary">
    <div className="page-heading"><h1>SQL 문법 사전</h1><p>수업에서 풀던 마당서점 예제를 한곳에. 명령이나 키워드를 골라 문법과 동작 과정을 확인하세요.</p></div>
    <div className="dictionary-layout">
      <aside className="dictionary-index" aria-label="SQL 사전 목록">
        <label className="dictionary-search">명령·키워드 찾기<input type="search" placeholder="예: JOIN, 부속질의, 평균, MODIFY" value={search} onChange={event => setSearch(event.target.value)}/></label>
        <label className="dictionary-category">분류<select value={group} onChange={event => setGroup(event.target.value as DictionaryGroup | '전체')}><option>전체</option>{dictionaryGroups.map(value => <option key={value}>{value}</option>)}</select></label>
        <p className="dictionary-count" role="status">{items.length} / {dictionaryEntries.length}개 항목</p>
        <nav aria-label="SQL 명령 목록" className="dictionary-list">{items.map(item => <button type="button" key={item.id} aria-current={entry.id === item.id ? 'page' : undefined} onClick={() => choose(item.id)}><span>{item.keyword}</span><small>{item.title}</small></button>)}</nav>
        {!items.length ? <div className="dictionary-no-match"><p>일치하는 항목이 없습니다.</p><button type="button" className="visual-button" onClick={() => { setGroup('전체'); setSearch('') }}>전체 항목 보기</button></div> : null}
      </aside>
      <div className="dictionary-workspace"><DictionaryDetail key={entry.id} entry={entry}/></div>
    </div>
    <details className="language-references"><summary>사전의 예제와 실행 환경</summary><p>기존 수업의 Book 10행·Customer 5행·Orders 10행과 질의 예제를 재사용했습니다. 정의어·변경 예제는 각 항목의 전제에 맞춘 독립된 NewBook 등에서 시작합니다. 권한 제어는 시뮬레이션입니다.</p><p>SQL 수정 실행은 기존 실습과 같은 브라우저 내 SQLite 엔진을 사용합니다. MySQL 전용 MODIFY·권한 구문은 이 엔진에서 실행하지 않으며, 사전의 단계별 미리보기로 확인합니다.</p><p><a href="https://dev.mysql.com/doc/refman/8.4/en/alter-table.html" target="_blank" rel="noreferrer">MySQL · ALTER TABLE</a> · <a href="https://dev.mysql.com/doc/refman/8.4/en/correlated-subqueries.html" target="_blank" rel="noreferrer">상관 부속질의</a> · <a href="https://dev.mysql.com/doc/refman/8.4/en/grant.html" target="_blank" rel="noreferrer">GRANT</a></p></details>
  </div>
}
