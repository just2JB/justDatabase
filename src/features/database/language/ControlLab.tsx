import { useState } from 'react'
import { CommandPicker, Grammar } from './LanguageParts'
import { initialPermissions, privileges, users } from './languageLab'
import type { LabUser, Privilege } from './languageLab'

export default function ControlLab({ initialCommand = 'GRANT' }: { initialCommand?: 'GRANT' | 'REVOKE' }) {
  const [command, setCommand] = useState<'GRANT' | 'REVOKE'>(initialCommand)
  const [user, setUser] = useState<LabUser>('analyst')
  const [privilege, setPrivilege] = useState<Privilege>('SELECT')
  const [permissions, setPermissions] = useState(() => initialCommand === 'REVOKE' ? { analyst: ['SELECT'] as Privilege[], assistant: [] as Privilege[] } : initialPermissions())
  const [message, setMessage] = useState(initialCommand === 'REVOKE' ? '이 예시는 analyst에게 SELECT 권한이 직접 부여된 상태에서 시작합니다.' : '아직 어떤 권한도 직접 부여하지 않았습니다. analyst에게 SELECT를 부여해 보세요.')
  const [actor, setActor] = useState<LabUser>('analyst')
  const [action, setAction] = useState<Privilege>('SELECT')
  const [trial, setTrial] = useState<{ allowed: boolean; actor: LabUser; action: Privilege; serial: number } | null>(null)
  const sql = `${command} ${privilege}\nON madang.Book\n${command === 'GRANT' ? 'TO' : 'FROM'} '${user}'@'localhost';`
  function execute() {
    if (command === 'REVOKE' && !permissions[user].includes(privilege)) {
      setTrial(null)
      setMessage('회수할 직접 부여 권한이 없습니다. 이 시뮬레이션에서는 권한 상태를 바꾸지 않습니다.')
      return
    }
    setPermissions(previous => ({ ...previous, [user]: command === 'GRANT' ? [...new Set([...previous[user], privilege])] : previous[user].filter(item => item !== privilege) }))
    setTrial(null)
    setMessage(`${user}의 ${privilege} 권한을 ${command === 'GRANT' ? '부여했습니다' : '회수했습니다'}. 도서 데이터와 테이블 구조는 바뀌지 않습니다.`)
  }
  return <div className="language-lab" data-testid="dcl-lab">
    <CommandPicker commands={['GRANT', 'REVOKE'] as const} value={command} onChange={setCommand} label="DCL 명령 선택"/>
    <div className="language-instruction"><h3>{command} · {command === 'GRANT' ? '접근 권한 부여' : '직접 부여한 권한 회수'}</h3><p>관리자 입장에서 사용자에게 madang.Book 테이블의 작업 권한을 설정합니다. 표의 칸을 눌러 사용자와 권한을 선택해도 됩니다.</p></div>
    <div className="language-fields"><label>대상 사용자<select value={user} onChange={event => setUser(event.target.value as LabUser)}>{users.map(value => <option key={value}>{value}</option>)}</select></label><label>대상 권한<select value={privilege} onChange={event => setPrivilege(event.target.value as Privilege)}>{privileges.map(value => <option key={value}>{value}</option>)}</select></label></div>
    <Grammar syntax={command === 'GRANT' ? "GRANT 권한 ON DB명.테이블명 TO '사용자'@'호스트';" : "REVOKE 권한 ON DB명.테이블명 FROM '사용자'@'호스트';"} sql={sql}/>
    <div className="language-actions"><button type="button" className="quiz-primary" onClick={execute}>권한 변경 실행</button><button type="button" className="visual-button" onClick={() => { setPermissions(initialPermissions()); setTrial(null); setMessage('직접 부여한 권한을 모두 초기화했습니다.') }}>모든 권한 초기화</button></div>
    <p className="language-status" role="status">{message}</p>
    <div className="language-permissions table-wrap"><table><caption>madang.Book 테이블 · 직접 부여한 권한</caption><thead><tr><th scope="col">사용자</th>{privileges.map(item => <th scope="col" key={item}>{item}</th>)}</tr></thead><tbody>{users.map(item => <tr key={item}><th scope="row">{item}</th>{privileges.map(value => <td key={value}><button type="button" aria-label={`${item} ${value} 선택 · ${permissions[item].includes(value) ? '허용' : '권한 없음'}`} aria-pressed={item === user && value === privilege} className={permissions[item].includes(value) ? 'is-allowed' : ''} onClick={() => { setUser(item); setPrivilege(value) }}>{permissions[item].includes(value) ? '✓ 허용' : '− 없음'}</button></td>)}</tr>)}</tbody></table></div>
    <div className="language-access-test"><h4>이번에는 사용자가 되어 접근해 보기</h4><div className="language-fields"><label>접근하는 사용자<select value={actor} onChange={event => { setActor(event.target.value as LabUser); setTrial(null) }}>{users.map(value => <option key={value}>{value}</option>)}</select></label><label>시도할 작업<select value={action} onChange={event => { setAction(event.target.value as Privilege); setTrial(null) }}>{privileges.map(value => <option key={value}>{value}</option>)}</select></label><button type="button" className="visual-button" onClick={() => setTrial(previous => ({ allowed: permissions[actor].includes(action), actor, action, serial: (previous?.serial ?? 0) + 1 }))}>접근 시도</button></div>
      <div className={`language-gate ${trial ? trial.allowed ? 'is-open' : 'is-closed' : ''}`} key={trial?.serial ?? 'ready'} role="status"><div><span>사용자</span><strong>{actor}</strong></div><i aria-hidden="true">→</i><div className="language-lock"><span>{action} 권한 검사</span><strong>{trial ? trial.allowed ? '✓ 통과' : '✕ 거부' : '대기'}</strong></div><i aria-hidden="true">{trial && !trial.allowed ? '⊣' : '→'}</i><div><span>테이블</span><strong>Book</strong></div></div>
      <p>{trial ? trial.allowed ? `${trial.actor}에게 ${trial.action} 권한이 있어 작업을 허용합니다.` : `${trial.actor}에게 ${trial.action} 권한이 없어 작업을 거부합니다.` : '권한을 부여하기 전·후, 회수한 뒤의 결과를 비교해 보세요.'}</p>
      <p className="dbs-mini">이 버튼은 접근 권한만 검사합니다. 데이터 변경은 DML 실습에서 확인하세요. 실제 DBMS의 역할 상속·PUBLIC·소유자 권한 등은 생략하고, 여기서 직접 부여한 권한만 비교합니다.</p>
    </div>
  </div>
}
