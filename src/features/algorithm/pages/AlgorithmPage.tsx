import AlgorithmQuizPage from './AlgorithmQuizPage'
import { useEffect, useState } from 'react'
import AlgorithmConcepts from '../components/AlgorithmConcepts'
import AlgorithmSidebar from '../components/AlgorithmSidebar'
import AlgorithmSearch from '../components/AlgorithmSearch'
import { algorithmLessons } from '../data/algorithmLessons'
import { scrollToTarget, pushLocation } from '../../../shared/navigation'

function initialPage() { const topic = new URLSearchParams(location.search).get('topic'); return topic === 'practice' ? 'quiz' : topic === 'quiz' || algorithmLessons.some(l => l.id === topic) ? topic! : 'foundations' }
export default function AlgorithmPage() {
  const [page, setPage] = useState(initialPage)
  const [destination, setDestination] = useState<{ target: string }>(()=>({target:location.hash.slice(1)||'main'}))
  const title = page === 'quiz' ? '문제 풀기' : algorithmLessons.find(l => l.id === page)?.title ?? '컴퓨터 알고리즘'
  useEffect(() => { document.title = `${title} · 컴퓨터 알고리즘 · justStudy` }, [title])
  useEffect(() => { scrollToTarget(destination.target) }, [destination])
  useEffect(() => {
    const url = new URL(location.href); url.searchParams.set('course', 'algorithm'); url.searchParams.set('topic', page); url.searchParams.delete('page'); url.searchParams.delete('view'); history.replaceState(null, '', url)
    const pop = () => { setPage(initialPage()); setDestination({ target: location.hash.slice(1) || 'main' }) }
    window.addEventListener('popstate', pop)
    return () => window.removeEventListener('popstate', pop)
  }, [page])
  function navigate(topic: string, target = 'main') {
    const url = new URL(location.href); url.searchParams.set('topic', topic); url.hash = target === 'main' ? '' : target; pushLocation(url)
    setPage(topic); setDestination({ target })
  }
  return <div className="app-shell algorithm-study-shell"><a className="skip-link" href="#main">본문으로 이동</a><AlgorithmSidebar page={page} onNavigate={navigate} /><main id="main"><header className="topbar"><span>컴퓨터 알고리즘 <span className="slash">/</span> {title}</span><AlgorithmSearch onNavigate={navigate} /></header><div className="document page-enter" key={page}>{page === 'quiz' ? <AlgorithmQuizPage /> : <AlgorithmConcepts topic={page} onJump={target => navigate(page, target)} onPractice={() => navigate('quiz', 'python-practice')} />}</div></main></div>
}
