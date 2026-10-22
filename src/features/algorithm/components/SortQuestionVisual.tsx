import { lazy, Suspense, useId, useState } from 'react'
import type { PracticeQuestion } from '../../../shared/components/ExamSession'
import './sort-question-visual.css'

const SortRoundPlayer = lazy(() => import('./SortRoundPlayer'))

export default function SortQuestionVisual({ question }: { question: PracticeQuestion }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  if (!question.sortVisual) return null
  return <div className="mock-sort-help">
    <button type="button" className="visual-button" aria-expanded={open} aria-controls={id} onClick={()=>setOpen(!open)}>{open ? '시각화 접기' : '시각화 보기'}</button>
    {open ? <div id={id} className="mock-sort-panel">
      <p>이 문제의 입력 배열 <strong>[{question.sortVisual.values.join(', ')}]</strong>로 진행합니다. 단계별 풀이와 정답을 볼 수 있습니다. ‘N회전 결과’를 눌러 답안 표와 비교하세요.</p>
      <Suspense fallback={<p role="status">정렬 과정을 불러오는 중…</p>}><SortRoundPlayer {...question.sortVisual}/></Suspense>
    </div> : null}
  </div>
}
