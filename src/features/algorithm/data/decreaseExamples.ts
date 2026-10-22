export const topologicalExample: Record<string, string[]> = {
  A: ['C', 'D'], B: ['D', 'E'], C: ['D', 'F'], D: ['F'], E: ['F'], F: [],
}

export function topologicalState(order: string[]) {
  const removed = new Set(order)
  const degrees = Object.fromEntries(Object.keys(topologicalExample).map(node => [node, 0]))
  for (const [node, neighbors] of Object.entries(topologicalExample)) {
    if (!removed.has(node)) for (const neighbor of neighbors) degrees[neighbor]++
  }
  const ready = Object.keys(topologicalExample).filter(node => !removed.has(node) && degrees[node] === 0)
  return { degrees, ready, removed }
}

export const powerExamples = [
  { x: 2, n: 10, label: '2¹⁰ · 짝수 지수' },
  { x: 3, n: 5, label: '3⁵ · 홀수 지수' },
  { x: 7, n: 0, label: '7⁰ · 종료 조건' },
]

export type PowerFrame = {
  phase: 'call' | 'return'
  n: number
  stack: number[]
  expression: string
  result?: number
  multiplications: number
}

export function powerFrames(x: number, n: number): PowerFrame[] {
  const frames: PowerFrame[] = []
  const stack: number[] = []
  let multiplications = 0
  function visit(exponent: number): number {
    stack.push(exponent)
    frames.push({ phase: 'call', n: exponent, stack: [...stack], expression: `power(${x}, ${exponent}) 호출`, multiplications })
    if (exponent === 0) {
      frames.push({ phase: 'return', n: 0, stack: [...stack], expression: 'n = 0이므로 1 반환', result: 1, multiplications })
      stack.pop()
      return 1
    }
    const half = visit(Math.floor(exponent / 2))
    const even = exponent % 2 === 0
    const result = even ? half * half : x * half * half
    multiplications += even ? 1 : 2
    frames.push({ phase: 'return', n: exponent, stack: [...stack], expression: even ? `${half} × ${half} = ${result}` : `${x} × ${half} × ${half} = ${result}`, result, multiplications })
    stack.pop()
    return result
  }
  visit(n)
  return frames
}
