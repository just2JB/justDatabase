import type { PracticeQuestion } from '../components/ExamSession'

export type CourseId = 'database' | 'algorithm' | 'engineering-project'
export type ReviewResponse = { text: string; choice?: number; selections?: number[]; submitted?: boolean; review?: 'correct' | 'again' }
export type ReviewQuestion = PracticeQuestion & { multiOptions?: string[]; correctSelections?: number[]; numericSequence?: number[]; numericSequenceLabel?: string; sourceIndex?: number; unit?: string }
export type ReviewSource = { key: string; label: string; course: CourseId; format: 'concept' | 'exam' | 'relation' | 'quick'; questions: ReviewQuestion[]; initial?: Record<string, unknown> }
export type Mistake = { id: string; source: string; questionId: string; course: CourseId; status: 'open' | 'resolved'; misses: number; lastWrong: ReviewResponse; updatedAt: string; imported: boolean }
export const mistakeStorageKey = 'justStudy.mistakes.v1'
export const progressChangeEvent = 'justStudy:progress-change'
export const mistakeChangeEvent = 'justStudy:mistakes-change'
export const mistakeId = (source: string, questionId: string) => `${source}::${questionId}`
const normalize = (value: string) => value.trim().toLocaleLowerCase().replace(/\s+/g, '')

export function gradeResponse(question: ReviewQuestion, response: ReviewResponse): boolean | undefined {
  if (question.numericSequence) { const tokens = response.text.replace(/[\[\]]/g, '').trim().split(/[\s,]+/); return tokens.length === question.numericSequence.length && tokens.every((token,index) => token !== '' && Number(token) === question.numericSequence![index]) }
  if (question.correctSelections) return response.selections?.length === question.correctSelections.length && response.selections.every(value => question.correctSelections!.includes(value))
  if (question.options) return response.choice === question.correct
  if (question.accepted) return question.accepted.some(answer => normalize(answer) === normalize(response.text))
  return response.review === 'correct' ? true : response.review === 'again' ? false : undefined
}
function object(value: unknown): value is Record<string, unknown> { return !!value && typeof value === 'object' && !Array.isArray(value) }
export function readObject(key: string): Record<string, unknown> {
  try { const value: unknown = JSON.parse(localStorage.getItem(key) ?? 'null'); return object(value) ? value : {} } catch { return {} }
}
export function readMistakes(): Mistake[] {
  const saved = readObject(mistakeStorageKey)
  return Object.values(saved).filter((value): value is Mistake => {
    if (!object(value) || !object(value.lastWrong)) return false
    if (typeof value.updatedAt !== 'string' || value.updatedAt !== '' && Number.isNaN(Date.parse(value.updatedAt))) return false
    if (value.lastWrong.choice !== undefined && !(typeof value.lastWrong.choice === 'number' && Number.isInteger(value.lastWrong.choice))) return false
    if (value.lastWrong.selections !== undefined && !(Array.isArray(value.lastWrong.selections) && value.lastWrong.selections.every(item => typeof item === 'number' && Number.isInteger(item) && item >= 0))) return false
    return typeof value.source === 'string' && typeof value.questionId === 'string' && value.id === mistakeId(value.source, value.questionId) && (value.course === 'database' || value.course === 'algorithm' || value.course === 'engineering-project') && (value.status === 'open' || value.status === 'resolved') && typeof value.misses === 'number' && Number.isInteger(value.misses) && value.misses > 0 && typeof value.updatedAt === 'string' && typeof value.lastWrong.text === 'string'
  })
}
function persist(entries: Mistake[]) {
  localStorage.setItem(mistakeStorageKey, JSON.stringify(Object.fromEntries(entries.map(entry => [entry.id, entry]))))
}
export function recordMistake(source: string, course: CourseId, questionId: string, response: ReviewResponse, correct: boolean | undefined) {
  if (correct === undefined) return true
  try {
    const entries = readMistakes(), id = mistakeId(source, questionId), old = entries.find(entry => entry.id === id)
    if (correct && !old) return true
    const entry: Mistake = correct
      ? { ...old!, status: 'resolved' }
      : { id, source, course, questionId, status: 'open', misses: (old?.misses ?? 0) + 1, lastWrong: { ...response }, updatedAt: new Date().toISOString(), imported: old?.imported ?? false }
    persist([...entries.filter(item => item.id !== id), entry])
    window.dispatchEvent(new Event(mistakeChangeEvent))
    return true
  } catch { return false }
}

function legacyResponse(source: ReviewSource, question: ReviewQuestion, saved: Record<string, unknown>): ReviewResponse | undefined {
  if (source.format === 'concept') {
    const value = object(saved.answers) ? saved.answers[question.id] : undefined
    return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value < (question.options?.length ?? 0) ? { text: '', choice: value, submitted: true } : undefined
  }
  if (source.format === 'exam') {
    const value = object(saved.responses) ? saved.responses[question.id] : undefined
    if (!object(value) || value.submitted !== true || typeof value.text !== 'string') return undefined
    if (question.options && !(typeof value.choice === 'number' && Number.isInteger(value.choice) && value.choice >= 0 && value.choice < question.options.length)) return undefined
    return { text: value.text, choice: typeof value.choice === 'number' ? value.choice : undefined, submitted: true, review: value.review === 'again' || value.review === 'correct' ? value.review : undefined }
  }
  if (source.format === 'relation' && object(saved.results) && saved.results[question.id] === false) {
    const selections = saved.submitted === true && saved.index === question.sourceIndex && Array.isArray(saved.selected) ? saved.selected.filter((value): value is number => typeof value === 'number' && Number.isInteger(value) && value >= 0 && value < (question.multiOptions?.length ?? 0)) : undefined
    return { text: '', selections, submitted: true, review: 'again' }
  }
  // Quick-sort answers used to store drafts without a submitted flag. Do not treat drafts as mistakes.
  return undefined
}
export function collectMistakes(sources: ReviewSource[]): Mistake[] {
  const entries = readMistakes(), seen = new Set(entries.map(entry => entry.id))
  for (const source of sources) {
    const saved = readObject(source.key)
    for (const question of source.questions) {
      const id = mistakeId(source.key, question.id)
      if (seen.has(id)) continue
      const response = legacyResponse(source, question, saved)
      if (!response || gradeResponse(question, response) !== false) continue
      entries.push({ id, source: source.key, course: source.course, questionId: question.id, status: 'open', misses: 1, lastWrong: response, updatedAt: '', imported: true })
      seen.add(id)
    }
  }
  return entries
}
export function importExistingMistakes(sources: ReviewSource[]) {
  const entries = collectMistakes(sources)
  try { persist(entries); return true } catch { return false }
}

export function saveReviewResponse(source: ReviewSource, question: ReviewQuestion, response: ReviewResponse) {
  try {
    const saved = { ...source.initial, ...readObject(source.key) }
    if (source.format === 'concept') saved.answers = { ...(object(saved.answers) ? saved.answers : {}), [question.id]: response.choice }
    else if (source.format === 'exam') saved.responses = { ...(object(saved.responses) ? saved.responses : {}), [question.id]: { ...response, submitted: true } }
    else if (source.format === 'relation') {
      saved.index = question.sourceIndex ?? 0; saved.selected = response.selections ?? []; saved.submitted = true
      saved.results = { ...(object(saved.results) ? saved.results : {}), [question.id]: gradeResponse(question, response) }
    } else saved[question.id] = response.text
    localStorage.setItem(source.key, JSON.stringify(saved))
    if (!recordMistake(source.key, source.course, question.id, response, gradeResponse(question, response))) return false
    window.dispatchEvent(new CustomEvent(progressChangeEvent, { detail: { key: source.key } }))
    return true
  } catch { return false }
}

export function describeResponse(question: ReviewQuestion, response: ReviewResponse) {
  if (question.multiOptions) return response.selections?.length ? response.selections.map(index => question.multiOptions![index]).join(' · ') : '이전 선택값이 저장되어 있지 않습니다.'
  if (question.options) return question.options[response.choice ?? -1] ?? '이전 선택값이 저장되어 있지 않습니다.'
  return response.text || '이전 답안이 저장되어 있지 않습니다.'
}
