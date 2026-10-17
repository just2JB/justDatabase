import { useState } from 'react'
import { SqlCode } from '../sql/components/SqlLessonParts'
import { answers } from './answers'

export default function MissionSolution({ id }: { id: number }) {
  const [copyMessage, setCopyMessage] = useState('')
  const answer = answers[id]
  async function copy() {
    try { await navigator.clipboard.writeText(answer.sql); setCopyMessage('SQL을 복사했습니다.') }
    catch { setCopyMessage('복사할 수 없습니다. 아래 SQL을 직접 선택해 복사하세요.') }
  }
  return <section className="wb-solution" aria-label="미션 모범 답안">
    <h3>모범 답안</h3><p>조건을 충족하는 답안의 한 예입니다. 같은 결과를 내는 다른 SQL도 가능합니다.</p>
    {answer.rejected ? <div className="wb-rejected"><h4>실패를 확인하는 문장</h4><p>각 문장을 한 개씩 선택해 실행하세요. 오류가 발생해야 정상입니다. 아래 정상 실행 SQL과 한꺼번에 실행하지 마세요.</p>{answer.rejected.map(sql => <SqlCode key={sql}>{sql}</SqlCode>)}</div> : null}
    <div className="wb-copy"><h4>{answer.rejected ? '이후 정상 실행할 SQL' : '실행 SQL'}</h4><button type="button" onClick={copy}>SQL 복사</button></div><p role="status" className="muted">{copyMessage}</p><SqlCode>{answer.sql}</SqlCode>
    <h4>왜 이렇게 작성할까?</h4><p>{answer.explanation}</p>
    <div className="wb-check"><strong>예상 결과·확인 기준</strong><p>{answer.expected}</p></div>
  </section>
}
