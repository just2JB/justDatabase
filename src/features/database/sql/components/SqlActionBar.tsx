import './sql-action-bar.css'
import './sql-action-compact.css'

type Props = {
  busy: boolean
  onRun: () => void
  onReset: () => void
  onHint?: () => void
  hintOpen?: boolean
  onAnswer?: () => void
  answerOpen?: boolean
  onResetDatabase?: () => void
}

export default function SqlActionBar({ busy, onRun, onReset, onHint, hintOpen, onAnswer, answerOpen, onResetDatabase }: Props) {
  return <div className="sql-action-bar">
    <div className="sql-action-bar-main">
      <div className="sql-action-group" role="group" aria-label="코드 실행과 초기화">
        <button type="button" className="sql-action-run" disabled={busy} onClick={onRun} title="SQL 실행 · Ctrl+Enter"><span aria-hidden="true">▶️</span>{busy ? '실행 중…' : '실행'}</button>
        <button type="button" className="sql-action-reset" disabled={busy} onClick={onReset} title="작성한 SQL 입력 초기화"><span aria-hidden="true">🧹</span>초기화</button>
      </div>
      {onHint || onAnswer ? <div className="sql-action-group sql-action-learning" role="group" aria-label="풀이 도움말">
        {onHint ? <button type="button" className="sql-action-hint" aria-expanded={!!hintOpen} onClick={onHint} title={hintOpen ? '힌트 숨기기' : '풀이 방향과 주의사항 보기'}><span aria-hidden="true">💡</span>힌트</button> : null}
        {onAnswer ? <button type="button" className="sql-action-answer" aria-expanded={!!answerOpen} onClick={onAnswer} title={answerOpen ? '모범답안 숨기기' : '확인 후 모범답안 보기'}><span aria-hidden="true">📖</span>모범답안</button> : null}
      </div> : null}
      {onResetDatabase ? <button type="button" className="sql-action-db-reset" disabled={busy} onClick={onResetDatabase} title="실습 DB 초기화 · 현재 문제의 DB를 초기 상태로 복원" aria-label="실습 DB 초기화"><span aria-hidden="true">🗃️</span></button> : null}
    </div>
  </div>
}
