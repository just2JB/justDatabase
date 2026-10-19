import { useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, TextareaHTMLAttributes } from 'react'
import SqlSelectionHelp, { SqlHighlightedText } from './SqlSelectionHelp'
import './sql-editor.css'

export default function SqlEditor(props: TextareaHTMLAttributes<HTMLTextAreaElement> & { value: string }) {
  const area = useRef<HTMLTextAreaElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [metrics, setMetrics] = useState<CSSProperties>({})
  useLayoutEffect(() => {
    if (!area.current) return
    const input = area.current
    function sync() {
      const style = getComputedStyle(input)
      setMetrics({ fontFamily: style.fontFamily, fontSize: style.fontSize, fontWeight: style.fontWeight, fontStyle: style.fontStyle, lineHeight: style.lineHeight, letterSpacing: style.letterSpacing, tabSize: style.tabSize, padding: style.padding, borderWidth: style.borderWidth })
      setOffset({ x: input.scrollLeft, y: input.scrollTop })
    }
    sync()
    const observer = new ResizeObserver(sync)
    observer.observe(input)
    return () => observer.disconnect()
  }, [props.value])
  return <SqlSelectionHelp source={props.value}><div className="sql-code-editor"><pre aria-hidden="true" className="sql-editor-colors" style={metrics}><code style={{ transform: `translate(${-offset.x}px, ${-offset.y}px)` }}><SqlHighlightedText sql={props.value}/>{'\n'}</code></pre><textarea {...props} ref={area} wrap="off" className={`sql-runner-input ${props.className ?? ''}`} autoCapitalize="off" autoCorrect="off" onScroll={event => { setOffset({ x: event.currentTarget.scrollLeft, y: event.currentTarget.scrollTop }); props.onScroll?.(event) }}/></div></SqlSelectionHelp>
}
