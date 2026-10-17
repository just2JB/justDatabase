type Tab<T extends string> = { id:T; title:string; description:string }
export default function PracticeTabs<T extends string>({ value, tabs, onChange }: { value:T; tabs:Tab<T>[]; onChange:(id:T)=>void }) {
  return <nav id="practice-tabs" className="practice-view-tabs" aria-label="문제 유형 선택">{tabs.map(tab=><button type="button" key={tab.id} aria-pressed={value===tab.id} className={value===tab.id?'selected':''} onClick={()=>onChange(tab.id)}><strong>{tab.title}</strong><span>{tab.description}</span></button>)}</nav>
}
