import { useState } from 'react'
import { CommandPicker, Grammar, LanguageTable } from './LanguageParts'
import { definitionCommands, definitionScenario } from './languageLab'
import type { DefinitionCommand } from './languageLab'

const descriptions = {
  CREATE: ['새 구조 만들기', '열 이름·자료형·제약조건을 정의하고 빈 테이블을 만듭니다.', 'CREATE TABLE 테이블명 (\n  열이름 자료형 제약조건, ...\n);'],
  ALTER: ['기존 구조 바꾸기', '이미 있는 테이블의 열이나 제약조건을 변경합니다. 여기서는 email 열을 추가·삭제합니다.', 'ALTER TABLE 테이블명 ADD COLUMN 열이름 자료형;\nALTER TABLE 테이블명 DROP COLUMN 열이름;'],
  DROP: ['테이블 자체 없애기', '정의와 데이터가 함께 사라집니다. 이 예시는 다른 테이블의 참조 관계가 없는 경우입니다.', 'DROP TABLE 테이블명;'],
  TRUNCATE: ['전체 행 비우기', 'WHERE 없이 모든 행을 비우고 테이블 정의를 유지합니다. 보통 DDL로 분류합니다.', 'TRUNCATE TABLE 테이블명;'],
}
export default function DefinitionLab() {
  const [command, setCommand] = useState<DefinitionCommand>('CREATE')
  const [email, setEmail] = useState(true)
  const [executed, setExecuted] = useState(false)
  const scenario = definitionScenario(command, email)
  const info = descriptions[command]
  return <div className="language-lab" data-testid="ddl-lab">
    <CommandPicker commands={definitionCommands} value={command} label="DDL 명령 선택" onChange={value => { setCommand(value); setExecuted(false) }}/>
    <div className="language-instruction"><h3>{command} · {info[0]}</h3><p>{info[1]}</p></div>
    {command === 'CREATE' ? <label className="language-check"><input type="checkbox" checked={email} onChange={event => { setEmail(event.target.checked); setExecuted(false) }}/>email 열도 함께 만들기</label> : command === 'ALTER' ? <div className="language-fields"><label>변경할 작업<select value={email ? 'add' : 'drop'} onChange={event => { setEmail(event.target.value === 'add'); setExecuted(false) }}><option value="add">email 열 추가</option><option value="drop">email 열 삭제</option></select></label></div> : null}
    <Grammar syntax={info[2]} sql={scenario.sql}/>
    <div className="language-actions"><button type="button" className="quiz-primary" disabled={executed} onClick={() => setExecuted(true)}>구조 변화 실행</button><button type="button" className="visual-button" onClick={() => setExecuted(false)}>실행 전으로</button></div>
    <p className="language-status" role="status">{executed ? scenario.message : '실행 전과 실행 후를 나란히 비교해 보세요. 명령을 바꾸면 해당 명령의 예시로 다시 시작합니다.'}</p>
    <div className="language-comparison"><LanguageTable title="실행 전" state={scenario.before}/><div className="language-after" key={`${command}-${email}-${executed}`}><LanguageTable title={executed ? '실행 후' : '실행 후 · 아직 실행하지 않음'} state={executed ? scenario.after : scenario.before} version={Number(executed)}/></div></div>
  </div>
}
