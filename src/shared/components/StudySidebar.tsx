import { useEffect, useRef, useState } from 'react'
import { Icon } from './StudyComponents'

export default function StudySidebar({ course, page, lessons, otherCourse, onNavigate, bottomLinks = [] }: { course:string; page:string; lessons:{id:string;title:string}[]; otherCourse:{href:string;title:string}; onNavigate:(id:string)=>void; bottomLinks?:{id:string;title:string}[] }) {
  const [open,setOpen]=useState(false)
  const [mobile,setMobile]=useState(()=>matchMedia('(max-width: 760px)').matches)
  const panel=useRef<HTMLElement>(null), trigger=useRef<HTMLButtonElement>(null)
  useEffect(()=>{const media=matchMedia('(max-width: 760px)');const update=()=>{setMobile(media.matches);setOpen(false)};media.addEventListener('change',update);return()=>media.removeEventListener('change',update)},[])
  useEffect(()=>{
    if(!open||!mobile)return
    const overflow=document.body.style.overflow;document.body.style.overflow='hidden'
    panel.current?.querySelector<HTMLButtonElement>('.mobile-toc-close')?.focus()
    const key=(event:KeyboardEvent)=>{
      if(event.key==='Escape')setOpen(false)
      if(event.key!=='Tab')return
      const items=Array.from(panel.current?.querySelectorAll<HTMLElement>('a[href],button:not([disabled])')??[])
      const first=items[0],last=items[items.length-1]
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()}
    }
    document.addEventListener('keydown',key)
    return()=>{document.body.style.overflow=overflow;document.removeEventListener('keydown',key);trigger.current?.focus()}
  },[open,mobile])
  function go(id:string){setOpen(false);onNavigate(id)}
  return <><button ref={trigger} type="button" className="mobile-toc-trigger" aria-controls="course-sidebar" aria-expanded={open} onClick={()=>setOpen(true)}><Icon/><span>단원 목차</span></button>{open&&mobile?<button type="button" className="mobile-toc-backdrop" aria-label="단원 목차 닫기" tabIndex={-1} onClick={()=>setOpen(false)}/>:null}<aside ref={panel} id="course-sidebar" className={`sidebar shared-study-sidebar ${open?'mobile-open':''}`} role={mobile&&open?'dialog':'complementary'} aria-modal={mobile&&open?true:undefined} aria-label={`${course} 목차`} inert={mobile&&!open?true:undefined}><div className="sidebar-heading"><a className="brand" href="/"><img src="/justdatabase-logo.svg" alt=""/><span>justStudy</span></a><button type="button" className="mobile-toc-close" aria-label="단원 목차 닫기" onClick={()=>setOpen(false)}>×</button></div><div className="sidebar-course-links"><a href="/">← 학습 홈</a><a href={otherCourse.href}>{otherCourse.title}</a></div><p className="nav-label">{course} · 개념 정리</p><nav className="compact-toc" aria-label="큰 단원 목차">{lessons.map(lesson=><button type="button" key={lesson.id} className={`major-topic-link ${page===lesson.id?'current':''}`} aria-current={page===lesson.id?'page':undefined} onClick={()=>go(lesson.id)}><Icon/><span>{lesson.title}</span><Icon kind="arrow"/></button>)}</nav><div className="sidebar-bottom">{bottomLinks.map(link=><button type="button" key={link.id} className={`major-topic-link sidebar-reference-link ${page===link.id?'current':''}`} aria-current={page===link.id?'page':undefined} onClick={()=>go(link.id)}><Icon/><span>{link.title}</span><Icon kind="arrow"/></button>)}<button type="button" className="sidebar-quiz-button" aria-current={page==='quiz'?'page':undefined} onClick={()=>go('quiz')}><span>문제 풀기</span><Icon kind="arrow"/></button><div className="sidebar-footer">개념을 읽고, 문제로 확인해 보세요.</div></div></aside></>
}
