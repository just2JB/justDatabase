import { useEffect, useState } from 'react'
import ExamSession from '../../../shared/components/ExamSession'
import { SqlTable } from '../sql/components/SqlLessonParts'
import { mockExamKinds } from './relationMockExams'
import { fullMockExams } from './fullMockExams'
import './database-exam.css'

const selectionKey = 'justStudy.database.fullExamPaper.v1'
function readPaper() {
  try {
    const saved = localStorage.getItem(selectionKey)
    return fullMockExams.some(paper => paper.id === saved) ? saved! : fullMockExams[0].id
  } catch { return fullMockExams[0].id }
}

export default function DatabaseExamPractice() {
  const [paperId, setPaperId] = useState(readPaper)
  const [saveFailed, setSaveFailed] = useState(false)
  const paper = fullMockExams.find(item => item.id === paperId) ?? fullMockExams[0]
  const questions = paper.questions
  const counts = Object.entries(mockExamKinds).map(([kind, label]) => `${label} ${questions.filter(question => question.kind === kind).length}`).join(' · ')
  useEffect(() => {
    try { localStorage.setItem(selectionKey, paperId); setSaveFailed(false) }
    catch { setSaveFailed(true) }
  }, [paperId])
  return <>
    <div className="database-exam-picker">
      <label htmlFor="database-exam-paper">시험 회차</label>
      <select id="database-exam-paper" value={paperId} onChange={event => setPaperId(event.target.value)} aria-describedby="database-exam-description">
        {fullMockExams.map(item => <option key={item.id} value={item.id}>{item.title} · {item.questions.length}문제</option>)}
      </select>
      <p id="database-exam-description">모든 회차가 같은 전 범위를 다룹니다.</p>
    </div>
    <div className="database-exam-guide"><strong>{paper.title} · {questions.length}문제</strong><span>{counts}</span><p>{paper.description}</p><p>회차마다 전 범위를 처음부터 끝까지 복습합니다. 관계 모델 문항은 확인학습 자료의 유형을 참고했습니다.</p><details><summary>SQL 문제의 공통 조건 · {paper.context}</summary><p>각 SQL 문항은 제시된 기준 데이터에서 독립적으로 시작합니다. 한 문제의 INSERT·UPDATE·DELETE가 다음 문제의 데이터에 영향을 주지 않습니다. Item.price는 개당 정가, Purchase.qty는 수량, Purchase.paid는 해당 구매 건 전체의 실제 결제액입니다.</p><p>Item.item_id, Member.member_id, Purchase.purchase_id가 각 기본키입니다. Purchase.member_id와 item_id는 각각 Member와 Item을 참조합니다. MySQL 문법을 기준으로 풀고, 별도 조건이 없다면 나머지 제약은 모두 만족한다고 가정하세요.</p></details></div>
    {saveFailed ? <p role="status">브라우저 저장 공간을 사용할 수 없어 회차 선택이 저장되지 않습니다.</p> : null}
    <ExamSession key={paperId} questions={questions} kinds={mockExamKinds} storageKey={`justStudy.database.fullMockExam.${paper.id}.v1`} renderQuestion={question => { const item = questions.find(item => item.id === question.id); return <><p className="course-tag">{item?.unit}</p>{item?.tables?.map(table => <div className="database-exam-table" key={table.caption}><SqlTable caption={table.caption} data={table.data}/></div>)}</> }}/>
  </>
}
