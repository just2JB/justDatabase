import { sqlKeywordHelp } from './sqlKeywordHelp'

export type SqlToken = { text: string; start: number; end: number; kind: 'text' | 'keyword' | 'function' | 'string' | 'comment' | 'number'; keyword?: string }
const keywords = [...sqlKeywordHelp].sort((a, b) => b.keyword.length - a.keyword.length).map(item => item.keyword.replaceAll(' ', '\\s+')).join('|')
const pattern = new RegExp(`--[^\\n]*|#[^\\n]*|/\\*[\\s\\S]*?(?:\\*/|$)|'(?:''|[^'])*(?:'|$)|"(?:""|[^"])*(?:"|$)|\x60[^\x60]*(?:\x60|$)|\\b(?:${keywords})\\b|\\b\\d+(?:\\.\\d+)?\\b`, 'gi')
const functions = new Set(['COALESCE', 'SUM', 'AVG', 'COUNT', 'MAX', 'MIN'])

export function tokenizeSql(source: string): SqlToken[] {
  const tokens: SqlToken[] = []
  let cursor = 0
  for (const match of source.matchAll(pattern)) {
    const start = match.index!, text = match[0], end = start + text.length
    if (cursor < start) tokens.push({ text: source.slice(cursor, start), start: cursor, end: start, kind: 'text' })
    const keyword = text.replace(/\s+/g, ' ').toUpperCase()
    const kind = /^(--|#|\/\*)/.test(text) ? 'comment' : /^["'`]/.test(text) ? 'string' : /^\d/.test(text) ? 'number' : functions.has(keyword) ? 'function' : 'keyword'
    tokens.push({ text, start, end, kind, ...(['keyword', 'function'].includes(kind) ? { keyword } : {}) })
    cursor = end
  }
  if (cursor < source.length) tokens.push({ text: source.slice(cursor), start: cursor, end: source.length, kind: 'text' })
  return tokens
}
