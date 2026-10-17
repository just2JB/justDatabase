import { useEffect, useRef, useState } from 'react'
import { Icon } from '../../shared/components/StudyComponents'
import { engineeringLessons } from './lessons'

export default function EngineeringSidebar({ page, onNavigate }: { page: string; onNavigate: (page: string, target?: string) => void }) {
  const [open, setOpen] = useState(false)
  const [mobile, setMobile] = useState(() => matchMedia('(max-width: 760px)').matches)
  const panel = useRef<HTMLElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  useEffect(() => { const media = matchMedia('(max-width: 760px)'); const resize = () => { setMobile(media.matches); if (!media.matches) setOpen(false) }; media.addEventListener('change', resize); return () => media.removeEventListener('change', resize) }, [])
  useEffect(() => {
    if (!mobile || !open) return
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panel.current?.querySelector<HTMLButtonElement>('.mobile-toc-close')?.focus()
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
      if (event.key !== 'Tab') return
      const items = Array.from(panel.current?.querySelectorAll<HTMLElement>('a[href], button, summary') ?? []).filter(item => item.getClientRects().length)
      const first = items[0], last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
    document.addEventListener('keydown', keydown)
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', keydown); trigger.current?.focus() }
  }, [mobile, open])
  function navigate(id: string, target?: string) { setOpen(false); onNavigate(id, target) }
  return <><button ref={trigger} className="mobile-toc-trigger" aria-controls="engineering-sidebar" aria-expanded={open} onClick={() => setOpen(true)}><Icon /><span>목차</span></button>{mobile && open ? <button className="mobile-toc-backdrop" aria-label="목차 닫기" tabIndex={-1} onClick={() => setOpen(false)} /> : null}<aside id="engineering-sidebar" ref={panel} className={`sidebar ${open ? 'mobile-open' : ''}`} role={mobile && open ? 'dialog' : 'complementary'} aria-modal={mobile && open ? true : undefined} aria-label="공학융합프로젝트 학습 목차"><div className="sidebar-heading"><a className="brand" href="/"><img src="/justdatabase-logo.svg" alt="" /><span>justStudy</span></a><button className="mobile-toc-close" aria-label="목차 닫기" onClick={() => setOpen(false)}>×</button></div><div className="sidebar-course-links"><a href="/">← 학습 홈</a><a href="?course=database">데이터베이스</a></div><p className="nav-label">공학융합프로젝트 · 개념 정리</p><nav className="compact-toc" aria-label="주제별 목차">{engineeringLessons.map((lesson, index) => <button type="button" key={String(index + 1)} className={`major-topic-link ${page === String(index + 1) ? 'current' : ''}`} aria-current={page === String(index + 1) ? 'page' : undefined} onClick={() => navigate(String(index + 1))}><Icon /><span>{lesson.title}</span><Icon kind="arrow" /></button>)}</nav><div className="sidebar-bottom"><button className="sidebar-quiz-button" onClick={() => navigate(page, 'eng-check-title')}><span>이 단원 확인 문제</span><Icon kind="arrow" /></button><div className="sidebar-footer">개념을 읽고, 직접 실행해 보세요.</div></div></aside></>
}
