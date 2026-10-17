export type Student = { student_id: number; name: string; grade: number; email?: string | null }
export type Column = { key: keyof Student; type: string; constraint?: string }
export const columns: Column[] = [
  { key: 'student_id', type: 'INTEGER', constraint: 'PRIMARY KEY · 양의 정수' },
  { key: 'name', type: 'VARCHAR(30)', constraint: 'NOT NULL' },
  { key: 'grade', type: 'INTEGER', constraint: 'NOT NULL · 1~4' },
]
export const emailColumn: Column = { key: 'email', type: 'VARCHAR(80)' }
export const students: Student[] = [
  { student_id: 101, name: '김하늘', grade: 1 }, { student_id: 102, name: '이서준', grade: 2 },
  { student_id: 103, name: '박민서', grade: 3 }, { student_id: 104, name: '정다은', grade: 2 },
  { student_id: 105, name: '최지우', grade: 4 }, { student_id: 106, name: '윤도현', grade: 1 },
]
export const languageSections = [
  { title: '세 언어의 역할 비교', target: 'language-overview' },
  { title: 'DDL · 구조 바꾸기', target: 'language-ddl' },
  { title: 'DML · 데이터 다루기', target: 'language-dml' },
  { title: 'DCL · 권한 제어하기', target: 'language-dcl' },
  { title: '헷갈리는 명령 비교', target: 'language-compare' },
]
export const definitionCommands = ['CREATE', 'ALTER', 'DROP', 'TRUNCATE'] as const
export type DefinitionCommand = typeof definitionCommands[number]
export type TableState = { exists: boolean; columns: Column[]; rows: Student[] }
export function definitionScenario(command: DefinitionCommand, email: boolean) {
  const before: TableState = { exists: command !== 'CREATE', columns, rows: command === 'CREATE' ? [] : students }
  let after: TableState = before
  let sql = '', message = ''
  switch (command) {
    case 'CREATE':
      sql = `CREATE TABLE Student (\n  student_id INTEGER PRIMARY KEY CHECK (student_id > 0),\n  name VARCHAR(30) NOT NULL,\n  grade INTEGER NOT NULL CHECK (grade BETWEEN 1 AND 4)${email ? ',\n  email VARCHAR(80)' : ''}\n);`
      after = { exists: true, columns: email ? [...columns, emailColumn] : columns, rows: [] }
      message = '테이블 구조가 만들어졌습니다. CREATE만으로 학생 행이 자동 생성되지는 않습니다.'
      break
    case 'ALTER':
      before.columns = email ? columns : [...columns, emailColumn]
      before.rows = email ? students : students.map(row => ({ ...row, email: `student${row.student_id}@example.com` }))
      sql = `ALTER TABLE Student\n  ${email ? 'ADD COLUMN email VARCHAR(80)' : 'DROP COLUMN email'};`
      after = { exists: true, columns: email ? [...columns, emailColumn] : columns, rows: email ? students.map(row => ({ ...row, email: null })) : students }
      message = email ? 'email 열을 추가했습니다. DEFAULT를 지정하지 않아 기존 행의 email은 NULL입니다.' : 'email 열과 그 열의 값이 사라졌습니다. 학생 행 6개와 나머지 열은 유지됩니다.'
      break
    case 'DROP':
      sql = 'DROP TABLE Student;'
      after = { exists: false, columns: [], rows: [] }
      message = '테이블 정의와 그 안의 데이터가 함께 사라졌습니다. 빈 테이블이 남는 것이 아닙니다.'
      break
    case 'TRUNCATE':
      sql = 'TRUNCATE TABLE Student;'
      after = { exists: true, columns, rows: [] }
      message = '전체 행을 비웠지만 열과 기본키 같은 테이블 정의는 유지됩니다. WHERE 조건은 붙이지 않습니다.'
  }
  return { before, after, sql, message }
}

export const manipulationCommands = ['SELECT', 'INSERT', 'UPDATE', 'DELETE'] as const
export type ManipulationCommand = typeof manipulationCommands[number]
export type ManipulationInput = {
  command: ManipulationCommand; selectedColumns: (keyof Student)[]; minGrade: number;
  studentId: number; name: string; grade: number; allRows: boolean;
}
export function matchingIds(rows: Student[], input: ManipulationInput) {
  return rows.filter(row => input.command === 'SELECT' ? row.grade >= input.minGrade : input.allRows || row.student_id === input.studentId).map(row => row.student_id)
}
export function manipulationSql(input: ManipulationInput) {
  const id = Number.isFinite(input.studentId) ? input.studentId : '학번'
  const where = input.allRows ? '' : `\nWHERE student_id = ${id}`
  if (input.command === 'SELECT') return `SELECT ${input.selectedColumns.join(', ')}\nFROM Student\nWHERE grade >= ${input.minGrade};`
  if (input.command === 'INSERT') return `INSERT INTO Student (student_id, name, grade)\nVALUES (${id}, '${input.name.replaceAll("'", "''")}', ${input.grade});`
  if (input.command === 'UPDATE') return `UPDATE Student\nSET grade = ${input.grade}${where};`
  return `DELETE FROM Student${where};`
}
export function manipulate(rows: Student[], input: ManipulationInput): { rows: Student[]; result: Student[]; ids: number[]; message: string; error?: string } {
  const ids = matchingIds(rows, input)
  const failure = (error: string) => ({ rows, result: [], ids: [], message: '실행이 거부되어 데이터는 바뀌지 않았습니다.', error })
  if (['UPDATE', 'DELETE'].includes(input.command) && !input.allRows && (!Number.isSafeInteger(input.studentId) || input.studentId <= 0)) return failure('조건 학번을 양의 정수로 입력하세요.')
  if (input.command === 'INSERT') {
    if (!Number.isSafeInteger(input.studentId) || input.studentId <= 0) return failure('student_id는 양의 정수여야 합니다.')
    if (rows.some(row => row.student_id === input.studentId)) return failure('기본키 중복: 같은 student_id를 가진 학생이 이미 있습니다.')
    if (!input.name.trim() || input.name.length > 30) return failure('이름을 1~30자로 입력하세요. 빈 이름은 이 실습에서 허용하지 않습니다.')
    if (![1, 2, 3, 4].includes(input.grade)) return failure('grade는 1~4의 정수여야 합니다.')
    const row = { student_id: input.studentId, name: input.name, grade: input.grade }
    return { rows: [...rows, row], result: [row], ids: [row.student_id], message: '새 학생 1행이 추가되었습니다. 테이블 구조는 그대로입니다.' }
  }
  const result = rows.filter(row => ids.includes(row.student_id))
  if (input.command === 'SELECT') return { rows, result, ids, message: `${result.length}행을 조회했습니다. 원본 데이터는 바뀌지 않습니다.` }
  if (input.command === 'DELETE') return { rows: rows.filter(row => !ids.includes(row.student_id)), result, ids, message: `${ids.length}행을 삭제했습니다. 열과 제약조건은 유지됩니다.` }
  if (![1, 2, 3, 4].includes(input.grade)) return failure('grade는 1~4의 정수여야 합니다.')
  const updated = rows.map(row => ids.includes(row.student_id) ? { ...row, grade: input.grade } : row)
  return { rows: updated, result: updated.filter(row => ids.includes(row.student_id)), ids, message: `${ids.length}행이 UPDATE 대상입니다. 대상 학생의 grade를 ${input.grade}로 설정했습니다.` }
}

export const users = ['analyst', 'assistant'] as const
export type LabUser = typeof users[number]
export const privileges = ['SELECT', 'INSERT', 'UPDATE', 'DELETE'] as const
export type Privilege = typeof privileges[number]
export type Permissions = Record<LabUser, Privilege[]>
export const initialPermissions = (): Permissions => ({ analyst: [], assistant: [] })
