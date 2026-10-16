import { lessonSections } from '../data/algorithmSections'
import { useEffect, useRef, useState } from 'react'

export default function LessonContents({ topic, onJump }: { topic: string; onJump: (target: string) => void }) {
  const [open, setOpen] = useState(false)
  const [wide, setWide] = useState(() => matchMedia('(min-width: 1400px)').matches)
  const trigger = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLElement>(null)
  useEffect(() => {
    const media = matchMedia('(min-width: 1400px)')
    const update = () => { setWide(media.matches); setOpen(false) }
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    if (!open || wide) return
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panel.current?.querySelector<HTMLButtonElement>('button')?.focus()
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
      if (event.key !== 'Tab') return
      const items = Array.from(panel.current?.querySelectorAll<HTMLElement>('a[href], button') ?? [])
      const first = items[0], last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
    document.addEventListener('keydown', handleKey)
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', handleKey); trigger.current?.focus() }
  }, [open, wide])
  const links = lessonSections(topic).map(section => ({ title: section.title, target: topic === 'brute-force' && section.id !== 'brute-force-strategy' ? `brute-force-${section.indices[0]}` : section.id }))
  if (topic === 'brute-force') links.push({ title: '완전 탐색 · 틱택토·TSP·배낭·일 배정', target: 'exhaustive-search' })
  if (['analysis', 'recursion', 'decrease'].includes(topic)) links.push({ title: '단계별 시각화', target: `visual-${topic}` })
  if (topic === 'analysis') links.push({ title: '시험 대비 · 핵심 정리', target: 'exam-analysis' })
  return <><button type="button" ref={trigger} className="lesson-contents-trigger" aria-expanded={open} aria-controls="lesson-contents-panel" onClick={() => setOpen(!open)}>세부 목차</button>{open && !wide ? <button className="lesson-contents-backdrop" aria-label="세부 목차 닫기" tabIndex={-1} onClick={() => setOpen(false)} /> : null}{open ? <aside ref={panel} id="lesson-contents-panel" className={`lesson-contents floating-contents ${open ? 'is-open' : ''}`} role={wide ? 'complementary' : 'dialog'} aria-modal={wide ? undefined : true} aria-label="이 단원의 세부 목차"><header><strong>이 단원 바로가기</strong><button type="button" aria-label="세부 목차 닫기" onClick={() => setOpen(false)}>×</button></header><nav aria-label="세부 항목">{links.map(link => <a key={link.target} href={`#${link.target}`} onClick={event => { event.preventDefault(); setOpen(false); onJump(link.target) }}>{link.title}<span aria-hidden="true">↓</span></a>)}</nav></aside> : null}</>
}
