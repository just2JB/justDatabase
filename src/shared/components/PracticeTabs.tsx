import { useLayoutEffect, useRef } from 'react'
type Tab<T extends string> = { id:T; title:string; description:string }
export default function PracticeTabs<T extends string>({ value, tabs, onChange }: { value:T; tabs:Tab<T>[]; onChange:(id:T)=>void }) {
  const nav = useRef<HTMLElement>(null)
  // On a phone the tabs scroll sideways; keep the selected one in view without moving the page vertically.
  useLayoutEffect(() => {
    const strip = nav.current, selected = strip?.querySelector<HTMLElement>('.selected')
    if (!strip || !selected || strip.scrollWidth <= strip.clientWidth) return
    const left = selected.getBoundingClientRect().left - strip.getBoundingClientRect().left + strip.scrollLeft, right = left + selected.offsetWidth
    if (left < strip.scrollLeft || right > strip.scrollLeft + strip.clientWidth) strip.scrollLeft = Math.max(0, left - 16)
  }, [value])
  return <nav ref={nav} id="practice-tabs" className="practice-view-tabs" aria-label="문제 유형 선택">{tabs.map(tab=><button type="button" key={tab.id} aria-pressed={value===tab.id} className={value===tab.id?'selected':''} onClick={()=>onChange(tab.id)}><strong>{tab.title}</strong><span>{tab.description}</span></button>)}</nav>
}
