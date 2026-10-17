import type { ReactNode } from 'react'

export function Icon({ kind = 'document' }: { kind?: 'database' | 'document' | 'external' | 'arrow' | 'puzzle' | 'person' }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === 'puzzle' ? <path d="M9 3H4a1 1 0 0 0-1 1v5h2a3 3 0 1 1 0 6H3v5a1 1 0 0 0 1 1h5v-2a3 3 0 1 1 6 0v2h5a1 1 0 0 0 1-1v-5h-2a3 3 0 1 1 0-6h2V4a1 1 0 0 0-1-1h-5v2a3 3 0 1 1-6 0V3Z" /> : kind === 'person' ? <><circle cx="12" cy="4" r="2" /><path d="M4 9h16M12 6v8m0 0-5 7m5-7 5 7" /></> : kind === 'database' ? <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0" /></> : kind === 'external' ? <><path d="M14 3h7v7M21 3l-11 11M10 3H4v17h17v-6" /></> : kind === 'arrow' ? <path d="M3 12h18m-5-5 5 5-5 5" /> : <><path d="M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h5" /></>}
  </svg>
}

// 섹션 제목과 번호를 일관된 형태로 표시합니다.
export function StudySection({ id, number, title, children }: { id: string; number: string; title: string; children: ReactNode }) {
  return <section id={id} className="study-section" aria-labelledby={`${id}-title`}><div className="section-heading"><span>{number}</span><h2 id={`${id}-title`}>{title}</h2><div /></div>{children}</section>
}
