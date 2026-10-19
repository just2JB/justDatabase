import { useEffect, useState } from 'react'
import { pushLocation, scrollToTarget } from '../../shared/navigation'
import { Icon, StudySection } from '../../shared/components/StudyComponents'
import { features, shapes, types, uses } from './data/content'
import type { PageId, SearchEntry } from './data/content'
import Search from './components/Search'
import Sidebar from './components/Sidebar'
import DbmsPage from './pages/DbmsPage'
import DbsPage from './pages/DbsPage'
import DataLanguagePage from './language/DataLanguagePage'
import RelationPage from './pages/RelationPage'
import QuizPage from './quiz/QuizPage'
import SqlBasicsPage from './sql/pages/SqlBasicsPage'
import SqlQueriesPage from './sql/pages/SqlQueriesPage'
import SqlSubqueriesPage from './sql/pages/SqlSubqueriesPage'
import SqlChangesPage from './sql/pages/SqlChangesPage'
import { BigDataVisual, DatabaseVisual, MeaningVisual, ShapeVisual } from './components/Visuals'
import './database-study.css'


function readPage():PageId {
  const value=new URLSearchParams(location.search).get('page')
  return value==='dbms'||value==='dbs'||value==='languages'||value==='relation'||value==='quiz'||value==='sql4'||value==='sql5'||value==='subqueries'||value==='changes'||value==='workbench'||value==='workbench-answers'?value:'basics'
}
function readDestination():SearchEntry {
  const params=new URLSearchParams(location.search)
  const result:SearchEntry={title:'',text:'',section:location.hash.slice(1)||'main',page:readPage()}
  for(const name of ['shape','model','language','sqlQuery'] as const){const value=params.get(name);if(value!==null&&Number.isInteger(Number(value))&&Number(value)>=0)result[name]=Number(value)}
  return result
}
export default function DatabaseApp() {
  const [active, setActive] = useState('data')
  const [shape, setShape] = useState(()=>Math.min(readDestination().shape??0,shapes.length-1))
  const [page, setPage] = useState<PageId>(readPage)
  const [destination, setDestination] = useState<SearchEntry>(readDestination)
  const selected = shapes[shape]
  const pageTitle = page === 'workbench' ? 'Workbench 실습 미션' : page === 'workbench-answers' ? 'Workbench 미션 답안' : page === 'languages' ? 'SQL 문법 사전' : page === 'subqueries' ? '부속질의' : page === 'changes' ? '데이터 삽입·수정·삭제' : page === 'sql4' ? 'SQL 기초 · 테이블 정의' : page === 'sql5' ? 'SQL 검색 · 데이터 질의' : page === 'quiz' ? '문제 풀기' : page === 'relation' ? '관계 데이터 모델' : page === 'dbs' ? '데이터베이스 시스템' : page === 'dbms' ? '데이터베이스 관리 시스템' : '데이터베이스, 정보'

  useEffect(() => {
    document.title = `${pageTitle} · justDatabase`
  }, [pageTitle])

  useEffect(() => {
    const initialPage = readPage()
    const url = new URL(window.location.href)
    url.searchParams.set('course', 'database')
    if (initialPage !== 'basics') url.searchParams.set('page', initialPage)
    else url.searchParams.delete('page')
    if (initialPage !== 'quiz') url.searchParams.delete('view')
    window.history.replaceState(null, '', url)
  }, [])

  useEffect(() => {
    if (!destination) return
    scrollToTarget(destination.target ?? destination.section)
  }, [destination])

  useEffect(()=>{
    const restore=()=>{const entry=readDestination();setPage(readPage());setActive(entry.section);setDestination(entry);setShape(Math.min(entry.shape??0,shapes.length-1))}
    window.addEventListener('popstate',restore)
    return()=>window.removeEventListener('popstate',restore)
  },[])

  function selectSearchResult(entry: SearchEntry) {
    const url=new URL(location.href)
    url.searchParams.set('course','database')
    url.searchParams.delete('topic')
    const next=entry.page??'basics'
    if(next==='basics')url.searchParams.delete('page');else url.searchParams.set('page',next)
    if(next==='quiz'&&entry.section==='relation-practice')url.searchParams.set('view','practice');else url.searchParams.delete('view')
    for(const name of ['shape','model','language','sqlQuery'] as const){if(entry[name]!==undefined)url.searchParams.set(name,String(entry[name]));else url.searchParams.delete(name)}
    const target=entry.target??entry.section
    url.hash=target==='main'?'':target
    pushLocation(url)
    if(next==='quiz'&&page==='quiz')window.dispatchEvent(new PopStateEvent('popstate'))
    setActive(entry.section)
    setPage(entry.page ?? 'basics')
    if (entry.shape !== undefined) setShape(entry.shape)
    setDestination(entry)
  }

  return <div className="app-shell database-study-shell">
    <a className="skip-link" href="#main">본문으로 이동</a>
    <Sidebar active={active} page={page} onSelect={selectSearchResult} />
    <main id="main">
      <header className="topbar"><span>개념 정리 <span className="slash">/</span> {pageTitle}</span><Search onSelect={selectSearchResult} /></header>
      <div className="document page-enter" key={page}>
        {page === 'workbench' || page === 'workbench-answers' ? <QuizPage onLearn={selectSearchResult} /> : page === 'languages' ? <DataLanguagePage target={destination.target ?? destination.section} onJump={target => selectSearchResult({title:'',text:'',page:'languages',section:target,target})}/> : page === 'subqueries' ? <SqlSubqueriesPage /> : page === 'changes' ? <SqlChangesPage /> : page === 'sql4' ? <SqlBasicsPage /> : page === 'sql5' ? <SqlQueriesPage key={destination?.sqlQuery ?? 1} initialQuery={destination?.sqlQuery ?? 1} /> : page === 'quiz' ? <QuizPage onLearn={selectSearchResult} /> : page === 'relation' ? <RelationPage /> : page === 'dbs' ? <DbsPage key={destination?.language ?? 0} initialLanguage={destination?.language ?? 0} onOpenLanguageLab={() => selectSearchResult({title:'',text:'',page:'languages',section:'main'})} /> : page === 'dbms' ? <DbmsPage key={destination?.model ?? 0} initialModel={destination?.model ?? 0} /> : <>
        <div className="page-heading"><h1>데이터베이스, 정보</h1><p>관측한 데이터가 의미 있는 정보가 되기까지.</p></div>
        <StudySection id="data" number="01" title="데이터와 정보">
          <div id="data-comparison" className="comparison"><article><div className="round-icon"><Icon /></div><div><h3>데이터 <small>Data</small></h3><p>1차적 자료, 현실세계에서 단순히 관측한 사실이나 값</p></div></article><article><div className="round-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 20V12M12 20V4M18 20V8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg></div><div><h3>정보 <small>Information</small></h3><p>관련성과 목적성을 갖춘 데이터</p></div></article></div>
          <div className="meaning-flow" aria-label="데이터에 의미를 부여하면 정보가 된다"><strong>데이터</strong><div><span>의미 부여</span><Icon kind="arrow" /></div><strong>정보</strong></div>
          <MeaningVisual />
          <div id="information-values" className="two-columns"><article><h3>적시성</h3><p>정보는 필요한 시간에 제공되어야 한다.<br />필요한 시점에 제공되지 않으면 가치가 없다.</p></article><article><h3>독점성</h3><p>중요한 내용도 공개되면 가치가 급격히 하락한다. 비공개 정보는 가치가 높아 경쟁심이 높지만, 활용이 힘들어 경제성이 떨어진다.</p></article></div>
          <BigDataVisual />
        </StudySection>
        <StudySection id="database" number="02" title="데이터베이스">
          <div id="database-definition" className="definition"><div className="round-icon"><Icon kind="database" /></div><p>특정 조직의 여러 사용자가 <strong>공유</strong>하여 사용할 수 있도록 <strong>통합</strong>해서 <strong>저장</strong>한 <strong>운영</strong> 데이터의 집합</p></div>
          <div className="keywords">{['통합 데이터', '저장 데이터', '공유 데이터', '운영 데이터'].map(word => <strong key={word}>{word}</strong>)}</div>
          <DatabaseVisual />
          <h3 className="subheading">데이터베이스의 특징</h3><dl id="database-features" className="feature-list">{features.map(([title, description], index) => <div key={title}><dt><span>{String(index + 1).padStart(2, '0')}</span>{title}</dt><dd>{description}</dd></div>)}</dl>
        </StudySection>
        <StudySection id="classification" number="03" title="데이터의 분류">
          <>
          <h3 id="data-shapes" className="subheading">형태에 따른 분류</h3><div className="shape-tabs" role="tablist" aria-label="데이터 형태">{shapes.map((item, index) => <button key={item.name} type="button" role="tab" id={`shape-tab-${index}`} aria-selected={shape === index} aria-controls="shape-panel" onClick={() => setShape(index)}>{item.name}</button>)}</div>
          <article key={shape} className="shape-panel content-enter" role="tabpanel" id="shape-panel" aria-labelledby={`shape-tab-${shape}`}><div className="shape-copy"><span className="english">{selected.english}</span><h4>{selected.description}</h4><p>{selected.detail}</p><div className="example"><span>예시</span>{selected.examples}</div></div><ShapeVisual shape={shape} /></article>
          </>
          <h3 id="data-types" className="subheading type-heading">특성에 따른 분류</h3><div className="type-intro"><p><strong>범주형 데이터</strong>종류를 나타내는 값을 가진 데이터<br />크기 비교와 산술적 연산 불가</p><p><strong>수치형 데이터</strong>이산형과 연속형으로 이루어진 자료</p></div>
          <div className="table-wrap"><table><caption className="sr-only">특성에 따른 데이터 분류 비교</caption><thead><tr><th scope="col">구분</th><th scope="col">유형</th><th scope="col">특징</th><th scope="col">예시</th></tr></thead><tbody>{types.map(type => <tr key={type.name}><td>{type.group}</td><th scope="row">{type.name}</th><td>{type.description}</td><td>{type.examples}</td></tr>)}</tbody></table></div>
        </StudySection>
        <StudySection id="everyday" number="04" title="일상 속 데이터베이스">
          <div className="use-list">{uses.map((use, index) => <article id={`use-${index}`} key={use.field}><h3>{use.field}</h3><ul>{use.items.map(item => <li key={item}>{item}</li>)}</ul></article>)}</div>
          <div id="database-operations" className="closing-note"><h3>데이터베이스 시스템이 하는 일</h3><p>데이터의 <strong>검색</strong>과 <strong>변경</strong> 작업을 주로 수행한다.</p><div className="operations"><span>검색</span><span>삽입</span><span>삭제</span><span>수정</span></div><p className="muted">변경은 시간에 따라 변하는 데이터 값을 데이터베이스에 반영하는 삽입, 삭제, 수정 등의 작업이다.</p></div>
        </StudySection>
        </>}
        <footer className="document-footer"><span>justDatabase</span><a href="#main">맨 위로</a></footer>
      </div>
    </main>
  </div>
}
