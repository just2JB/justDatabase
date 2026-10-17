import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export default function FloatingContents({ links, onJump }: { links: { title: string; target: string }[]; onJump: (target: string) => void }) {
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
    if (!open) return
    const overflow = document.body.style.overflow
    if (!wide) document.body.style.overflow = 'hidden'
    panel.current?.querySelector<HTMLButtonElement>('button')?.focus()
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
      if (event.key !== 'Tab' || wide) return
      const items = Array.from(panel.current?.querySelectorAll<HTMLElement>('a[href], button') ?? [])
      const first = items[0], last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
    document.addEventListener('keydown', handleKey)
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', handleKey); trigger.current?.focus() }
  }, [open, wide])
  return createPortal(<><button type="button" ref={trigger} className="lesson-contents-trigger" aria-expanded={open} aria-controls="lesson-contents-panel" onClick={() => setOpen(!open)}>세부 목차</button>{open && !wide ? <button className="lesson-contents-backdrop" aria-label="세부 목차 닫기" tabIndex={-1} onClick={() => setOpen(false)} /> : null}{open ? <aside ref={panel} id="lesson-contents-panel" className={`lesson-contents floating-contents ${open ? 'is-open' : ''}`} role={wide ? 'complementary' : 'dialog'} aria-modal={wide ? undefined : true} aria-label="이 단원의 세부 목차"><header><strong>이 단원 바로가기</strong><button type="button" aria-label="세부 목차 닫기" onClick={() => setOpen(false)}>×</button></header><nav aria-label="세부 항목">{links.map(link => <a key={link.target} href={`#${link.target}`} onClick={event => { event.preventDefault(); setOpen(false); onJump(link.target) }}>{link.title}<span aria-hidden="true">↓</span></a>)}</nav></aside> : null}</>, document.body)
}
