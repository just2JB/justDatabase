import { useState } from 'react'
import { subqueryLessons } from '../data/subqueryLessons'
import type { SubqueryLesson } from '../data/subqueryLessons'
import { SqlCode, SqlTable } from './SqlLessonParts'
import './subquery-walkthrough.css'

export default function SubqueryWalkthrough({ lessons = subqueryLessons }: { lessons?: SubqueryLesson[] }) {
  const [lessonIndex, setLessonIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const lesson = lessons[lessonIndex]
  const step = lesson.steps[stepIndex]
  return <div className="subquery-walkthrough">
    <header><h3>안쪽부터 한 단계씩 이해하기</h3><p>서브쿼리 = 부속질의. 괄호 안의 SELECT 결과를 바깥 조건에 넣는 연습입니다.</p></header>
    <div className="sql-option-buttons" role="group" aria-label="서브쿼리 난이도">{lessons.map((item, index) => <button type="button" key={item.title} aria-pressed={lessonIndex === index} onClick={() => { setLessonIndex(index); setStepIndex(0) }}>{item.title}</button>)}</div>
    <p className="subquery-question">{lesson.question}</p>
    <p className="subquery-depth">주질의 1개 + 부속질의 {lesson.nesting}개 = SELECT 총 {lesson.nesting + 1}개. “3중”이라는 표현보다 문제의 조건과 괄호 구조를 확인하세요.</p>
    <div className="subquery-stage-tabs" role="group" aria-label="안쪽부터 따라가는 순서">{lesson.steps.map((item, index) => <button key={item.title} type="button" aria-pressed={stepIndex === index} onClick={() => setStepIndex(index)}><span>{index + 1}</span><strong>{item.title}</strong><small>{item.table}</small></button>)}</div>
    <div className="subquery-active-step" aria-live="polite"><span>이해 순서 {stepIndex + 1} / {lesson.steps.length}</span><h4>{step.title}</h4><p>{step.explanation}</p><div className="subquery-step-result"><SqlCode>{step.sql}</SqlCode><SqlTable caption="이 단계가 다음으로 넘기는 값" data={step.result}/></div><p className="subquery-next-value">{step.next}</p><div className="sql-question-pagination"><button type="button" disabled={stepIndex === 0} onClick={() => setStepIndex(index => index - 1)}>← 이전 단계</button><button type="button" disabled={stepIndex === lesson.steps.length - 1} onClick={() => setStepIndex(index => index + 1)}>다음 단계 →</button></div></div>
    <details className="subquery-full-sql" key={lessonIndex}><summary>단계를 합친 전체 SQL과 읽는 법</summary><SqlCode>{lesson.sql}</SqlCode><p>{lesson.hint}</p><p>{lesson.caution}</p><p>들여쓰기마다 괄호 하나가 열리고 닫힙니다. 각 IN 앞의 열과 안쪽 SELECT가 반환하는 열의 의미를 맞춰 보세요.</p></details>
    <div className="subquery-exam-note"><strong>손코딩할 때 확인할 것</strong><p>가장 바깥 SELECT에는 최종 출력할 열을 씁니다. 그 열이 들어 있는 테이블을 FROM에 쓰고, 조건을 거슬러 안쪽 SELECT를 채웁니다. 한 값은 =·&gt; 같은 비교 연산자, 여러 값은 IN을 사용합니다. 부속질의는 바깥 비교에 맞는 한 열을 반환해야 합니다.</p><p>여기서는 이해를 위해 안쪽 결과부터 대입합니다. 실제 DBMS가 반드시 이 순서로 실행한다는 뜻은 아닙니다. 상관 부속질의는 외부 행을 참조하므로 별도로 구분합니다. ORDER BY 없는 결과의 행 순서는 보장하지 않습니다.</p></div>
  </div>
}
