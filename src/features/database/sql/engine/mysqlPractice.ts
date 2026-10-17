import type { Database, SqlJsStatic } from 'sql.js'
import { sampleTables } from '../data/sqlLessonData'
import type { SqlResult } from '../data/sqlLessonData'

const identifier = '(?:`[A-Za-z_][A-Za-z0-9_]*`|"[A-Za-z_][A-Za-z0-9_]*"|[A-Za-z_][A-Za-z0-9_]*)'
const unquote = (name: string) => name.trim().replace(/^[`"]|[`"]$/g, '')
const quote = (name: string) => `"${name.replaceAll('"', '""')}"`
export type PracticeExecution = { sql: string; message: string; data?: SqlResult }
export type PracticeRun = { executions: PracticeExecution[]; error?: string; failedSql?: string }

// Delimit SQL outside quoted values/comments, so strings such as 'a;b--c' survive.
export function splitSql(source: string, delimiter = ';') {
  const parts: string[] = []; let buffer = '', quoted = '', depth = 0
  for (let i = 0; i < source.length; i++) {
    const ch = source[i], next = source[i + 1]
    if (quoted) {
      buffer += ch
      if (ch === quoted) { if (next === quoted) { buffer += next; i++ } else quoted = '' }
      continue
    }
    if (ch === "'" || ch === '"' || ch === '`') { quoted = ch; buffer += ch; continue }
    if (ch === '-' && next === '-') { while (i < source.length && source[i] !== '\n') i++; buffer += ' '; continue }
    if (ch === '#') { while (i < source.length && source[i] !== '\n') i++; buffer += ' '; continue }
    if (ch === '/' && next === '*') { const end = source.indexOf('*/', i + 2); if (end < 0) throw new Error('주석을 닫는 */가 없습니다.'); i = end + 1; buffer += ' '; continue }
    if (ch === '(') depth++
    if (ch === ')') depth--
    if (ch === delimiter && (delimiter === ';' || depth === 0)) { if (buffer.trim()) parts.push(buffer.trim()); buffer = '' } else buffer += ch
  }
  if (quoted || depth !== 0) throw new Error('따옴표 또는 괄호가 닫혔는지 확인하세요.')
  if (buffer.trim()) parts.push(buffer.trim())
  return parts
}

function columnsOf(definitions: string[]) {
  return definitions.filter(def => !/^(?:CONSTRAINT|PRIMARY|FOREIGN|UNIQUE|CHECK)\b/i.test(def)).map(def => {
    const match = def.match(new RegExp(`^(${identifier})\\s+([\\s\\S]+)$`))
    if (!match) throw new Error('열 이름과 자료형을 확인하세요.')
    return { name: unquote(match[1]), definition: def, rest: match[2] }
  })
}
function definitionsOf(create: string) { return splitSql(create.slice(create.indexOf('(') + 1, create.lastIndexOf(')')), ',') }
function normalizeDefinitions(definitions: string[]) {
  const columns = columnsOf(definitions)
  const tablePrimary = definitions.find(def => /^(?:CONSTRAINT\s+\S+\s+)?PRIMARY\s+KEY\b/i.test(def))
  const primary = tablePrimary ? splitSql(tablePrimary.slice(tablePrimary.indexOf('(') + 1, tablePrimary.lastIndexOf(')')), ',').map(unquote) : []
  return definitions.map(def => {
    const col = columns.find(item => item.definition === def)
    if (!col) return def
    let rest = col.rest
    const auto = /\bAUTO_INCREMENT\b/i.test(rest)
    if (auto) {
      if (!/^(?:INT|INTEGER)\b/i.test(rest) || !(/\bPRIMARY\s+KEY\b/i.test(rest) || primary.length === 1 && primary[0].toLowerCase() === col.name.toLowerCase())) throw new Error('이 실습의 AUTO_INCREMENT는 단일 INT/INTEGER 기본키에 사용하세요.')
      rest = rest.replace(/^(?:INTEGER|INT)\b(?:\(\d+\))?/i, 'INTEGER').replace(/\bAUTO_INCREMENT\b/i, '')
      if (!/\bPRIMARY\s+KEY\b/i.test(rest)) rest += ' PRIMARY KEY'
      rest = rest.replace(/PRIMARY\s+KEY/i, 'PRIMARY KEY AUTOINCREMENT')
    }
    if (/\bPRIMARY\s+KEY\b/i.test(rest) || primary.some(name => name.toLowerCase() === col.name.toLowerCase())) {
      if (!/\bNOT\s+NULL\b/i.test(rest)) rest += ' NOT NULL'
      // Only AUTO_INCREMENT may generate a key when NULL is inserted.
      if (!/\bAUTOINCREMENT\b/i.test(rest)) rest = rest.replace(/^INTEGER\b/i, 'INT')
    }
    return `${quote(col.name)} ${rest}`
  }).filter(def => !(tablePrimary === def && columns.some(col => /\bAUTO_INCREMENT\b/i.test(col.rest))))
}

export class MysqlPractice {
  private databases = new Map<string, Database>()
  current = 'madang'
  constructor(private SQL: SqlJsStatic) { this.createDatabase('madang'); this.seed() }
  get db() { return this.databases.get(this.current)! }
  private createDatabase(name: string) { const db = new this.SQL.Database(); db.run('PRAGMA foreign_keys = ON'); this.databases.set(name.toLowerCase(), db) }
  close() { this.databases.forEach(db => db.close()); this.databases.clear() }
  private seed() {
    this.db.run('CREATE TABLE Book(bookid INT NOT NULL PRIMARY KEY,bookname VARCHAR(40),publisher VARCHAR(40),price INTEGER); CREATE TABLE Customer(custid INT NOT NULL PRIMARY KEY,name VARCHAR(40),address VARCHAR(40),phone VARCHAR(30)); CREATE TABLE Orders(orderid INT NOT NULL PRIMARY KEY,custid INTEGER,bookid INTEGER,saleprice INTEGER,orderdate DATE,FOREIGN KEY(custid) REFERENCES Customer(custid),FOREIGN KEY(bookid) REFERENCES Book(bookid));')
    for (const table of sampleTables) {
      const stmt = this.db.prepare(`INSERT INTO ${quote(table.name)} VALUES (${table.result.columns.map(() => '?').join(',')})`)
      try { table.result.rows.forEach(row => stmt.run(row)) } finally { stmt.free() }
    }
  }
  names() { return [...this.databases.keys()] }
  tables() { return this.db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name")[0]?.values.map(row => String(row[0])) ?? [] }
  private createSql(table: string) {
    const stmt = this.db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name=? COLLATE NOCASE")
    try { stmt.bind([table]); if (!stmt.step()) throw new Error(`${table} 테이블이 없습니다.`); return String(stmt.get()[0]) } finally { stmt.free() }
  }
  private rawResult(sql: string, limit = 200): SqlResult {
    const stmt = this.db.prepare(sql)
    try { const columns = stmt.getColumnNames(), rows: SqlResult['rows'] = []; while (rows.length < limit && stmt.step()) rows.push(stmt.get().map(value => value instanceof Uint8Array ? '[BLOB]' : value)); return { columns, rows } } finally { stmt.free() }
  }
  describe(table: string): SqlResult {
    const create = this.createSql(table), fields = this.db.exec(`PRAGMA table_info(${quote(table)})`)[0].values
    const uniqueColumns = new Set<string>()
    for (const index of this.db.exec(`PRAGMA index_list(${quote(table)})`)[0]?.values ?? []) {
      if (!index[2]) continue
      const cols = this.db.exec(`PRAGMA index_info(${quote(String(index[1]))})`)[0]?.values ?? []
      if (cols.length === 1) uniqueColumns.add(String(cols[0][2]))
    }
    return { columns: ['Field', 'Type', 'Null', 'Key', 'Default', 'Extra'], rows: fields.map(field => [String(field[1]), String(field[2]), field[3] || field[5] ? 'NO' : 'YES', field[5] ? 'PRI' : uniqueColumns.has(String(field[1])) ? 'UNI' : '', field[4] == null ? null : String(field[4]), field[5] && /\bAUTOINCREMENT\b/i.test(create) ? 'auto_increment' : '']) }
  }
  inspect(table: string) { return { structure: this.describe(table), rows: this.rawResult(`SELECT * FROM ${quote(table)}`, 100), foreignKeys: this.rawResult(`PRAGMA foreign_key_list(${quote(table)})`) } }
  private assertParents(create: string) {
    for (const match of create.matchAll(new RegExp(`\\bREFERENCES\\s+(${identifier})`, 'gi'))) this.createSql(unquote(match[1]))
  }
  private assertDrop(table: string) {
    for (const other of this.tables()) if (other.toLowerCase() !== table.toLowerCase()) {
      const refs = this.db.exec(`PRAGMA foreign_key_list(${quote(other)})`)[0]?.values ?? []
      if (refs.some(row => String(row[2]).toLowerCase() === table.toLowerCase())) throw new Error(`${other}가 ${table}을 외래키로 참조합니다. 자식 테이블을 먼저 삭제하세요.`)
    }
  }
  private rebuild(table: string, definitions: string[], rename?: { from: string; to: string }, numericColumn?: string) {
    const original = this.createSql(table), oldColumns = columnsOf(definitionsOf(original)), normalized = normalizeDefinitions(definitions), newColumns = columnsOf(normalized)
    const previousSequence = /\bAUTOINCREMENT\b/i.test(original) ? this.db.exec(`SELECT seq FROM sqlite_sequence WHERE name='${table.replaceAll("'", "''")}'`)[0]?.values[0]?.[0] : undefined
    if (numericColumn) {
      const oldName = rename?.to === numericColumn ? rename.from : numericColumn
      const values = this.db.prepare(`SELECT ${quote(oldName)} FROM ${quote(table)} WHERE ${quote(oldName)} IS NOT NULL`)
      try { while (values.step()) if (!/^[+-]?\d+(?:\.\d+)?$/.test(String(values.get()[0]).trim())) throw new Error(`${oldName}에 숫자로 바꿀 수 없는 값이 있습니다. 데이터를 정리한 뒤 자료형을 변경하세요.`) } finally { values.free() }
    }
    // Rebuild atomically with foreign-key actions disabled, then validate every link.
    this.db.run('PRAGMA foreign_keys = OFF')
    this.db.run('BEGIN')
    let temp = '__practice_rebuild'; while (this.tables().includes(temp)) temp += '_'
    try {
      this.db.run(`CREATE TABLE ${quote(temp)} (${normalized.join(', ')})`)
      const copy = newColumns.flatMap(col => { const source = rename?.to === col.name ? rename.from : col.name; return oldColumns.some(old => old.name.toLowerCase() === source.toLowerCase()) ? [{ target: col.name, source }] : [] })
      if (copy.length) this.db.run(`INSERT INTO ${quote(temp)} (${copy.map(col => quote(col.target)).join(',')}) SELECT ${copy.map(col => numericColumn === col.target ? `CAST(${quote(col.source)} AS NUMERIC)` : quote(col.source)).join(',')} FROM ${quote(table)}`)
      this.db.run(`DROP TABLE ${quote(table)}`)
      this.db.run(`ALTER TABLE ${quote(temp)} RENAME TO ${quote(table)}`)
      if (previousSequence !== undefined && normalized.some(def => /\bAUTOINCREMENT\b/i.test(def))) this.db.run('UPDATE sqlite_sequence SET seq = MAX(seq, ?) WHERE name = ?', [Number(previousSequence), table])
      if (this.db.exec('PRAGMA foreign_key_check')[0]?.values.length) throw new Error('구조 변경 후 외래키 연결이 유효하지 않습니다.')
      this.db.run('COMMIT')
    } catch (error) { this.db.run('ROLLBACK'); throw error } finally { this.db.run('PRAGMA foreign_keys = ON') }
  }
  private alter(table: string, operation: string) {
    const definitions = definitionsOf(this.createSql(table))
    const modify = operation.match(new RegExp(`^MODIFY\\s+(?:COLUMN\\s+)?(${identifier})\\s+([\\s\\S]+)$`, 'i'))
    const change = operation.match(new RegExp(`^CHANGE\\s+(?:COLUMN\\s+)?(${identifier})\\s+(${identifier})\\s+([\\s\\S]+)$`, 'i'))
    const primary = operation.match(/^ADD\s+PRIMARY\s+KEY\s*\(([^)]+)\)$/i)
    if (modify || change) {
      const from = unquote((change ?? modify)![1]), to = change ? unquote(change[2]) : from, rest = change ? change[3] : modify![2]
      const old = columnsOf(definitions).find(col => col.name.toLowerCase() === from.toLowerCase())
      if (!old) throw new Error(`${from} 열이 없습니다.`)
      if (change && to.toLowerCase() !== from.toLowerCase() && columnsOf(definitions).some(col => col.name.toLowerCase() === to.toLowerCase())) throw new Error(`${to} 열이 이미 있습니다.`)
      if (change && to !== from && definitions.some(def => def !== old.definition && new RegExp(`\\b${from}\\b`, 'i').test(def))) throw new Error('다른 제약이 참조하는 열의 CHANGE는 이 실습에서 지원하지 않습니다.')
      let next = `${quote(to)} ${rest}`
      if (/\bPRIMARY\s+KEY\b/i.test(old.rest) && !/\bPRIMARY\s+KEY\b/i.test(rest)) next += ' PRIMARY KEY'
      if (/\bUNIQUE\b/i.test(old.rest) && !/\bUNIQUE\b/i.test(rest)) next += ' UNIQUE'
      if (/\b(?:CHECK|REFERENCES)\b/i.test(old.rest)) throw new Error('CHECK 또는 외래키를 직접 포함한 열의 MODIFY는 이 실습에서 지원하지 않습니다.')
      definitions[definitions.indexOf(old.definition)] = next
      this.rebuild(table, definitions, change ? { from, to } : undefined, /^(?:INT|INTEGER|SMALLINT|DECIMAL|NUMERIC)\b/i.test(rest) ? to : undefined)
    } else if (primary) {
      if (definitions.some(def => /\bPRIMARY\s+KEY\b/i.test(def))) throw new Error('이미 기본키가 있습니다. 기본키가 없는 테이블에서 연습하세요.')
      definitions.push(`PRIMARY KEY (${primary[1]})`); this.rebuild(table, definitions)
    } else if (/^ADD\b/i.test(operation) && !/^ADD\s+(?:CONSTRAINT|FOREIGN|UNIQUE|CHECK)\b/i.test(operation)) {
      definitions.push(operation.replace(/^ADD\s+(?:COLUMN\s+)?/i, '')); this.rebuild(table, definitions)
    } else if (/^DROP\s+(?:COLUMN\s+)?[\w`]+$/i.test(operation) || /^RENAME\s+(?:COLUMN\s+\S+\s+TO\s+\S+|TO\s+\S+)$/i.test(operation)) this.db.run(`ALTER TABLE ${quote(table)} ${operation}`)
    else throw new Error('이 실습은 ADD 열, DROP COLUMN, MODIFY, CHANGE, ADD PRIMARY KEY, RENAME을 지원합니다.')
  }
  private execute(sql: string): PracticeExecution {
    let m: RegExpMatchArray | null
    if ((m = sql.match(new RegExp(`^CREATE\\s+DATABASE\\s+(IF NOT EXISTS\\s+)?(${identifier})$`, 'i')))) {
      const name = unquote(m[2]).toLowerCase(); if (this.databases.has(name)) { if (!m[1]) throw new Error(`${name} 데이터베이스가 이미 있습니다.`) } else this.createDatabase(name)
      return { sql, message: `${name} 데이터베이스를 준비했습니다. USE ${name};으로 선택하세요.` }
    }
    if ((m = sql.match(new RegExp(`^USE\\s+(${identifier})$`, 'i')))) { const name = unquote(m[1]).toLowerCase(); if (!this.databases.has(name)) throw new Error(`${name} 데이터베이스가 없습니다.`); this.current = name; return { sql, message: `${name} 데이터베이스를 선택했습니다.` } }
    if (/^SHOW\s+DATABASES$/i.test(sql)) return { sql, message: '데이터베이스 목록', data: { columns: ['Database'], rows: this.names().map(name => [name]) } }
    if (/^SHOW\s+TABLES$/i.test(sql)) return { sql, message: '테이블 목록', data: { columns: [`Tables_in_${this.current}`], rows: this.tables().map(name => [name]) } }
    if ((m = sql.match(new RegExp(`^(?:DESC|DESCRIBE)\\s+(${identifier})$`, 'i')))) return { sql, message: '테이블 구조', data: this.describe(unquote(m[1])) }
    if ((m = sql.match(new RegExp(`^CREATE\\s+TABLE\\s+(IF NOT EXISTS\\s+)?(${identifier})\\s*\\(([\\s\\S]*)\\)$`, 'i')))) {
      this.assertParents(sql); const definitions = normalizeDefinitions(splitSql(m[3], ',')); this.db.run(`CREATE TABLE ${m[1] ?? ''}${quote(unquote(m[2]))} (${definitions.join(',')})`)
    } else if ((m = sql.match(new RegExp(`^ALTER\\s+TABLE\\s+(${identifier})\\s+([\\s\\S]+)$`, 'i')))) this.alter(unquote(m[1]), m[2])
    else if ((m = sql.match(new RegExp(`^RENAME\\s+TABLE\\s+(${identifier})\\s+TO\\s+(${identifier})$`, 'i')))) this.db.run(`ALTER TABLE ${quote(unquote(m[1]))} RENAME TO ${quote(unquote(m[2]))}`)
    else if ((m = sql.match(new RegExp(`^DROP\\s+TABLE\\s+(IF EXISTS\\s+)?(${identifier})$`, 'i')))) { this.assertDrop(unquote(m[2])); this.db.run(sql) }
    else if (/^(?:SELECT|WITH)\b/i.test(sql)) { const data = this.rawResult(sql); return { sql, message: `${data.rows.length}행 표시${data.rows.length === 200 ? ' (최대 200행)' : ''}`, data } }
    else if (/^(?:INSERT\s+INTO|UPDATE\s+|DELETE\s+FROM)\b/i.test(sql)) { this.db.run(sql); return { sql, message: `${this.db.getRowsModified()}행에 데이터 변경 명령을 적용했습니다.` } }
    else throw new Error('지원 명령: CREATE DATABASE/TABLE, USE, SHOW, DESC, ALTER, RENAME, DROP TABLE, SELECT, INSERT, UPDATE, DELETE. 서버 계정·권한·관리 명령은 실행하지 않습니다.')
    return { sql, message: '명령을 실행했습니다. 아래 테이블 구조와 데이터를 확인하세요.' }
  }
  run(source: string): PracticeRun {
    const executions: PracticeExecution[] = []
    let statements: string[]
    try { statements = splitSql(source); if (!statements.length) throw new Error('실행할 SQL을 입력하세요.'); if (statements.length > 64 || source.length > 50000) throw new Error('한 번에 64문장, 50,000자 이내로 실행하세요.') } catch (error) { return { executions, error: String((error as Error).message) } }
    for (const sql of statements) {
      try { executions.push(this.execute(sql)) } catch (error) { return { executions, error: String((error as Error).message), failedSql: sql } }
    }
    return { executions }
  }
}
