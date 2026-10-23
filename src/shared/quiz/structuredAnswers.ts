export type AnswerTableSpec = { columns: string[]; rows: string[]; initial?: number[]; checkRows?: boolean }
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

export function checkAnswerRow(table: AnswerTableSpec, value: string, answer: string, row: number) {
  const count = table.columns.length * table.rows.length
  const cells = readAnswerCells(value, count), expected = readAnswerCells(answer, count)
  const results = table.columns.map((_, column) => {
    const index = row * table.columns.length + column
    return { filled: cells[index].trim() !== '', correct: cells[index].replace(/\s/g, '') === expected[index].replace(/\s/g, ''), answer: expected[index] }
  })
  return { ready: results.every(result => result.filled), correct: results.filter(result => result.correct).length, total: results.length, results }
}
