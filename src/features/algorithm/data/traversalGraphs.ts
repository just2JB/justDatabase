import { mockExamGraphs } from './mockExamGraphs'

export type TraversalGraph = {
  start: string
  order: 'alphabet' | 'number'
  edges: [string, string][]
  positions: Record<string, [number, number]>
  directed?: boolean
}

const letterPositions: TraversalGraph['positions'] = {
  A: [45, 125], B: [160, 45], C: [160, 200], D: [290, 45],
  E: [290, 200], F: [440, 45], G: [440, 160], H: [440, 260],
}

export const traversalGraphs = {
  ...mockExamGraphs,
  one: { start: 'A', order: 'alphabet', positions: letterPositions, edges: [['A','B'],['A','C'],['B','D'],['C','D'],['C','E'],['D','F'],['E','G'],['E','H'],['G','H']] },
  two: { start: 'A', order: 'alphabet', positions: letterPositions, edges: [['A','B'],['A','C'],['B','D'],['B','E'],['C','E'],['C','F'],['D','E']] },
  branch: { start: 'A', order: 'alphabet', positions: { A:[250,40], B:[140,135], C:[360,135], D:[65,255], E:[200,255], F:[310,255], G:[440,255] }, edges: [['A','B'],['A','C'],['B','D'],['B','E'],['C','F'],['C','G']] },
  cycle: { start: 'A', order: 'alphabet', positions: { A:[45,140], B:[155,45], C:[155,250], D:[285,45], E:[285,250], F:[390,140], G:[465,250] }, edges: [['A','B'],['A','C'],['B','D'],['C','E'],['D','F'],['E','F'],['E','G'],['F','G']] },
  number: { start: '1', order: 'number', positions: { '1':[250,35], '2':[150,110], '3':[290,110], '4':[410,110], '5':[65,190], '6':[210,190], '7':[410,240], '8':[140,265] }, edges: [['1','2'],['1','3'],['1','4'],['2','5'],['2','6'],['4','7'],['5','8'],['6','8']] },
  restart: { start: 'C', order: 'alphabet', positions: { A:[250,140], B:[360,60], C:[140,140], D:[455,40], E:[455,145], F:[45,65], G:[45,245] }, edges: [['A','B'],['A','C'],['B','D'],['B','E'],['C','F'],['C','G']] },
} satisfies Record<string, TraversalGraph>

export type TraversalGraphKind = keyof typeof traversalGraphs
export function isTraversalGraph(value: string | undefined): value is TraversalGraphKind {
  return value !== undefined && Object.hasOwn(traversalGraphs, value)
}
