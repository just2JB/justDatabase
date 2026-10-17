import { useEffect, useLayoutEffect, useRef } from 'react'

export const motionValueId = (values: (number | string)[], index: number) =>
  `${values[index]}:${values.slice(0, index).filter(value => value === values[index]).length}`

// Match values across frames, including values moved between separate SVG groups.
// Read the final layout once, then animate transforms without changing that layout.
export function useDiagramMotion(frame: string | number) {
  const root = useRef<HTMLDivElement>(null)
  const previous = useRef(new Map<string, DOMRect>())
  const animations = useRef<Animation[]>([])

  useLayoutEffect(() => {
    animations.current.forEach(animation => animation.cancel())
    animations.current = []
    const nodes = Array.from(root.current?.querySelectorAll<HTMLElement | SVGGraphicsElement>('[data-motion-id]') ?? [])
    const origin = root.current?.getBoundingClientRect()
    const measured = nodes.map(node => {
      const rect = node.getBoundingClientRect()
      const box = new DOMRect(rect.left - (origin?.left ?? 0), rect.top - (origin?.top ?? 0), rect.width, rect.height)
      return { node, id: node.dataset.motionId!, box }
    })
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches

    if (previous.current.size && !reduced) {
      for (const { node, id, box } of measured) {
        const old = previous.current.get(id)
        const matrix = node instanceof SVGGraphicsElement ? node.getScreenCTM() : null
        const scaleX = matrix ? Math.hypot(matrix.a, matrix.b) : 1
        const scaleY = matrix ? Math.hypot(matrix.c, matrix.d) : 1
        const dx = old ? (old.left - box.left) / (scaleX || 1) : 0
        const dy = old ? (old.top - box.top) / (scaleY || 1) : -14
        if (old && Math.abs(dx) < .5 && Math.abs(dy) < .5) continue
        const arc = node.dataset.motionArc === 'true' && Math.abs(dx) > 5
        const lift = Number(node.dataset.motionLift) || 0
        const middleY = lift ? Math.min(dy / 2, -lift) : arc ? dy / 2 + (dx > 0 ? -28 : 28) : dy / 2
        animations.current.push(node.animate([
          { transform: `translate(${dx}px, ${dy}px)`, opacity: old ? 1 : 0 },
          { transform: `translate(${dx / 2}px, ${middleY}px)`, opacity: 1, offset: .5 },
          { transform: 'translate(0px, 0px)', opacity: 1 },
        ], { duration: 620, easing: 'cubic-bezier(.22,.68,.2,1)' }))
      }
    }
    previous.current = new Map(measured.map(({ id, box }) => [id, box]))
  }, [frame])

  useEffect(() => () => animations.current.forEach(animation => animation.cancel()), [])
  return root
}
