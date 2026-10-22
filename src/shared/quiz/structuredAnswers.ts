export type AnswerTableSpec = { columns: string[]; rows: string[]; initial?: number[] }
export type StructuredQuestion = { answerTable?: AnswerTableSpec; answerFields?: string[] }

export function answerCellCount(question: StructuredQuestion) {
  return question.answerTable ? question.answerTable.columns.length * question.answerTable.rows.length : question.answerFields?.length ?? 0
}

export function readAnswerCells(value: string, count: number): string[] {
  try {
    const parsed: unknown = JSON.parse(value)
    return Array.from({ length: count }, (_, index) => Array.isArray(parsed) && typeof parsed[index] === 'string' ? parsed[index] : '')
  } catch { return Array(count).fill('') }
}

export function structuredAnswerReady(question: StructuredQuestion, value: string) {
  const count = answerCellCount(question)
  return count ? readAnswerCells(value, count).every(cell => cell.trim() !== '') : value.trim() !== ''
}
