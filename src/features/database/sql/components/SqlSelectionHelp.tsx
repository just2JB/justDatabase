import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { CSSProperties, ReactNode, SyntheticEvent } from 'react'
import { findSqlKeywordHelp } from '../data/sqlKeywordHelp'
import { tokenizeSql } from '../data/sqlTokens'
import './sql-selection-help.css'
import './sql-selection-bubble.css'
import './sql-editor.css'

type Anchor = { left: number; right: number; top: number; bottom: number }

// textarea에선 Range를 쓸 수 없어 동일한 글꼴·줄바꿈의 숨긴 복제본에서 선택 위치를 구합니다.
function textareaSelectionRect(area: HTMLTextAreaElement): Anchor {
  const bounds = area.getBoundingClientRect()
  const computed = getComputedStyle(area)
  const mirror = document.createElement('div')
  const properties = ['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'lineHeight', 'letterSpacing', 'wordSpacing', 'textIndent', 'textTransform', 'textAlign', 'tabSize', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth'] as const
  for (const property of properties) mirror.style[property] = computed[property]
  Object.assign(mirror.style, { position: 'fixed', left: `${bounds.left}px`, top: `${bounds.top}px`, width: `${bounds.width}px`, height: `${bounds.height}px`, boxSizing: 'border-box', borderStyle: 'solid', overflow: 'hidden', visibility: 'hidden', whiteSpace: area.wrap === 'off' ? 'pre' : 'pre-wrap', overflowWrap: 'break-word' })
  mirror.textContent = area.value.slice(0, area.selectionStart)
  const marked = document.createElement('span')
  marked.textContent = area.value.slice(area.selectionStart, area.selectionEnd)
  mirror.append(marked, document.createTextNode(area.value.slice(area.selectionEnd)))
  document.body.append(mirror)
  try {
    mirror.scrollTop = area.scrollTop
    mirror.scrollLeft = area.scrollLeft
    const rect = [...marked.getClientRects()].find(item => item.bottom > bounds.top && item.top < bounds.bottom) ?? marked.getBoundingClientRect()
    const top = Math.max(bounds.top, Math.min(rect.top, bounds.bottom))
    return { left: Math.max(bounds.left, Math.min(rect.left, bounds.right)), right: Math.max(bounds.left, Math.min(rect.right, bounds.right)), top, bottom: Math.max(top, Math.min(rect.bottom, bounds.bottom)) }
  } finally { mirror.remove() }
}

export default function SqlSelectionHelp({ source, children }: { source: string; children: ReactNode }) {
  const owner = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLElement>(null)
  const [selection, setSelection] = useState<{ source: string; text: string; anchor: Anchor } | null>(null)
  const [position, setPosition] = useState({ left: 0, top: 0, arrow: 24, above: true, maxHeight: 360, ready: false })
  const entries = selection?.source === source ? findSqlKeywordHelp(selection.text) : []
  const open = entries.length > 0
  useLayoutEffect(() => {
    if (!open || !selection || !panel.current) return
    const anchor = selection.anchor
    const width = panel.current.getBoundingClientRect().width
    const naturalHeight = panel.current.firstElementChild?.scrollHeight ?? 360
    const aboveRoom = Math.max(0, anchor.top - 24)
    const belowRoom = Math.max(0, window.innerHeight - anchor.bottom - 24)
    const above = aboveRoom >= Math.min(naturalHeight, 360) || aboveRoom >= belowRoom
    const maxHeight = Math.max(40, Math.min(360, above ? aboveRoom : belowRoom))
    const height = Math.min(naturalHeight, maxHeight)
    const center = (anchor.left + anchor.right) / 2
    const left = Math.max(12, Math.min(center - width / 2, window.innerWidth - width - 12))
    const top = above ? Math.max(12, anchor.top - 12 - height) : Math.min(window.innerHeight - 12 - height, anchor.bottom + 12)
    setPosition({ left, top, arrow: Math.max(18, Math.min(width - 18, center - left)), above, maxHeight, ready: true })
  }, [open, selection])
  useEffect(() => {
    if (!open) return
    function outside(event: Event) {
      const target = event.target as Node | null
      if (target && (panel.current?.contains(target) || owner.current?.contains(target))) return
      setSelection(null)
    }
    function dismiss() { setSelection(null) }
    function scroll(event: Event) { if (event.target instanceof Node && panel.current?.contains(event.target)) return; dismiss() }
    function key(event: KeyboardEvent) { if (event.key === 'Escape') dismiss() }
    document.addEventListener('pointerdown', outside, true)
    document.addEventListener('scroll', scroll, true)
    document.addEventListener('keydown', key)
    window.addEventListener('resize', dismiss)
    return () => { document.removeEventListener('pointerdown', outside, true); document.removeEventListener('scroll', scroll, true); document.removeEventListener('keydown', key); window.removeEventListener('resize', dismiss) }
  }, [open])
  function readSelection(event: SyntheticEvent<HTMLDivElement>) {
    const target = event.target
    if (!(target instanceof HTMLElement) || target.closest('[data-sql-help-panel]')) return
    const area = target instanceof HTMLTextAreaElement ? target : null
    if (area) {
      const token = tokenizeSql(area.value).find(item => item.keyword && item.start <= area.selectionStart && item.end > area.selectionStart)
      if (token) area.setSelectionRange(token.start, token.end)
      const text = token?.keyword ?? area.value.slice(area.selectionStart, area.selectionEnd)
      if (!findSqlKeywordHelp(text).length) { setSelection(null); return }
      setPosition(previous => ({ ...previous, ready: false }))
      setSelection({ source, text, anchor: textareaSelectionRect(area) })
      return
    }
    const marked = target.closest<HTMLElement>('[data-sql-keyword]')
    if (marked?.dataset.sqlKeyword && event.currentTarget.contains(marked)) {
      const rect = marked.getBoundingClientRect()
      setPosition(previous => ({ ...previous, ready: false }))
      setSelection({ source, text: marked.dataset.sqlKeyword, anchor: { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom } })
      return
    }
    const selected = window.getSelection()
    const owner = event.currentTarget
    if (!selected || !selected.anchorNode || !selected.focusNode || !owner.contains(selected.anchorNode) || !owner.contains(selected.focusNode)) return
    const text = selected.toString()
    if (!findSqlKeywordHelp(text).length || !selected.rangeCount) { setSelection(null); return }
    const rect = [...selected.getRangeAt(0).getClientRects()].find(item => item.bottom > 0 && item.top < window.innerHeight) ?? selected.getRangeAt(0).getBoundingClientRect()
    setPosition(previous => ({ ...previous, ready: false }))
    setSelection({ source, text, anchor: { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom } })
  }
  return <div ref={owner} className="sql-selection-help" onDoubleClick={readSelection} onKeyDown={event => { if (event.altKey && event.key === 'Enter') { event.preventDefault(); readSelection(event) } }} onClick={event => { if (event.detail === 1 && !(event.target as HTMLElement).closest('[data-sql-help-panel]')) setSelection(null) }}>
    {children}
    {open ? createPortal(<aside ref={panel} data-sql-help-panel="true" data-side={position.above ? 'above' : 'below'} className="sql-selection-panel sql-selection-bubble" aria-label="선택한 SQL 구문 설명" style={{ left: position.left, top: position.top, maxHeight: position.maxHeight, visibility: position.ready ? 'visible' : 'hidden', '--sql-arrow-left': `${position.arrow}px` } as CSSProperties}><div className="sql-bubble-content"><header><strong>선택한 구문 알아보기</strong><button type="button" aria-label="SQL 구문 설명 닫기" onClick={() => setSelection(null)}>닫기 ×</button></header>{entries.map(entry => <article key={entry.keyword}><h5>{entry.keyword}</h5><dl><div><dt>설명</dt><dd>{entry.explanation}</dd></div><div><dt>문법</dt><dd><pre><code>{entry.syntax}</code></pre></dd></div></dl></article>)}</div></aside>, document.body) : null}
  </div>
}

export function SqlHelpCode({ sql }: { sql: string }) {
  return <SqlSelectionHelp source={sql}><pre className="sql-code" tabIndex={0} aria-label="SQL 코드 · 구문 더블클릭 또는 선택 후 Alt+Enter로 설명 확인"><code><SqlHighlightedText sql={sql}/></code></pre></SqlSelectionHelp>
}

export function SqlHighlightedText({ sql }: { sql: string }) {
  return <>{tokenizeSql(sql).map(token => token.kind === 'text' ? token.text : <span key={token.start} className={`sql-syntax-${token.kind}`} data-sql-keyword={token.keyword}>{token.text}</span>)}</>
}
