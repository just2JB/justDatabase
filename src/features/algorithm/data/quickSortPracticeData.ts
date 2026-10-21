import { quickSortTrace } from './quickSortTrace'
export const quickPracticeProblems = [[5,3,8,4,9,1,6,2,7],[7,2,9,4,1,8,3,6,5],[4,8,2,7,1,6,3,5],[6,1,8,3,7,2,5,4],[347,182,591,264,438,125,763,306],[45,12,23,50,18,25,40,30,27,35],[29,10,14,37,13,18,30,28,20,25]]
export const quickPracticeStorageKey = 'justStudy.algorithm.quickRounds.bidirectional.v2'
export function quickPracticeRounds(input: number[]) { return quickSortTrace(input).filter(frame => frame.partitionDone).map(frame => ({ pivot: frame.values[frame.pivot], low: frame.low, high: frame.high, at: frame.pivot, values: frame.values })) }
export type QuickPracticeRound = ReturnType<typeof quickPracticeRounds>[number]
// First two cells are the chosen pivot value and its final zero-based index.
export function quickRoundAnswerValues(round: QuickPracticeRound) { return [round.pivot, round.at, ...round.values] }
export function quickPracticeAnswerCells(answer: string, listLength: number) {
  const cells = answer.replace(/[\[\]]/g, '').trim().split(/[\s,]+/).filter(Boolean)
  // Preserve the old list-only drafts; the newly required fields start empty.
  if (cells.length === listLength) return ['_', '_', ...cells]
  return Array.from({ length: listLength + 2 }, (_, index) => cells[index] || '_')
}
export function matchesQuickPracticeRound(answer: string, round: QuickPracticeRound) { return matchesQuickRound(answer, quickRoundAnswerValues(round)) }
export function matchesQuickRound(answer: string, expected: number[]) {
  const tokens = answer.replace(/[\[\]]/g, '').trim().split(/[\s,]+/)
  return tokens.length === expected.length && tokens.every((token, index) => token !== '' && Number(token) === expected[index])
}
