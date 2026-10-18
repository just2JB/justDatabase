import { quickSortTrace } from './quickSortTrace'
export const quickPracticeProblems = [[5,3,8,4,9,1,6,2,7],[7,2,9,4,1,8,3,6,5],[4,8,2,7,1,6,3,5],[6,1,8,3,7,2,5,4],[347,182,591,264,438,125,763,306],[45,12,23,50,18,25,40,30,27,35],[29,10,14,37,13,18,30,28,20,25]]
export const quickPracticeStorageKey = 'justStudy.algorithm.quickRounds.bidirectional.v2'
export function quickPracticeRounds(input: number[]) { return quickSortTrace(input).filter(frame => frame.partitionDone).map(frame => ({ pivot: frame.values[frame.pivot], low: frame.low, high: frame.high, at: frame.pivot, values: frame.values })) }
export function matchesQuickRound(answer: string, expected: number[]) {
  const tokens = answer.replace(/[\[\]]/g, '').trim().split(/[\s,]+/)
  return tokens.length === expected.length && tokens.every((token, index) => token !== '' && Number(token) === expected[index])
}
