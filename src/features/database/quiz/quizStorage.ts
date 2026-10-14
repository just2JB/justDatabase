import { useEffect, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { quizQuestions } from './quizContent'
import type { QuizTopic } from './quizContent'

// 문제 내용을 변경했을 때 오래된 답안을 새 문제의 답안으로 읽지 않도록 버전을 구분합니다.
export const progressPrefix = 'justDatabase.quiz.v2.'
export function useSavedProgress<T>(key: string, initial: T, validate: (value: unknown) => value is T): [T, Dispatch<SetStateAction<T>>, boolean] {
  const [state, setState] = useState<T>(() => {
    try { const raw = localStorage.getItem(progressPrefix + key); if (raw) { const parsed: unknown = JSON.parse(raw); if (validate(parsed)) return parsed } } catch { /* 읽을 수 없는 저장 내용은 기본 상태로 복구합니다. */ }
    return initial
  })
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    try { localStorage.setItem(progressPrefix + key, JSON.stringify(state)); setFailed(false) } catch { setFailed(true) }
  }, [key, state])
  return [state, setState, failed]
}

export type QuizProgress = { topic: QuizTopic | 'all'; type: 'all' | 'choice' | 'ox'; random: boolean; ids: string[]; index: number; selection: number | null; answers: Record<string, number>; finished: boolean }
export const emptyProgress: QuizProgress = { topic: 'all', type: 'all', random: true, ids: [], index: 0, selection: null, answers: {}, finished: false }
export function isQuizProgress(value: unknown): value is QuizProgress {
  if (!value || typeof value !== 'object') return false
  const data = value as QuizProgress
  if (!['all', 'basics', 'dbms', 'dbs', 'relation'].includes(data.topic) || !['all', 'choice', 'ox'].includes(data.type) || typeof data.random !== 'boolean' || typeof data.finished !== 'boolean') return false
  if (!Array.isArray(data.ids) || new Set(data.ids).size !== data.ids.length || !data.ids.every(id => quizQuestions.some(question => question.id === id))) return false
  if (!Number.isInteger(data.index) || data.index < 0 || (data.ids.length ? data.index >= data.ids.length : data.index !== 0)) return false
  if (!data.answers || typeof data.answers !== 'object' || Array.isArray(data.answers)) return false
  if (!Object.entries(data.answers).every(([id, answer]) => { const question = quizQuestions.find(item => item.id === id); return data.ids.includes(id) && question && Number.isInteger(answer) && answer >= 0 && answer < question.options.length })) return false
  const current = quizQuestions.find(question => question.id === data.ids[data.index])
  if (data.selection !== null && (!current || !Number.isInteger(data.selection) || data.selection < 0 || data.selection >= current.options.length)) return false
  if (data.finished && (!data.ids.length || data.ids.some(id => data.answers[id] === undefined))) return false
  return true
}
