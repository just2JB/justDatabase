import { useEffect, useState } from 'react'
import QuickSortVisual from './QuickSortVisual'
import { quickPartitionCode } from '../data/quickSortTrace'
import { quickPracticeProblems as problems, quickPracticeRounds as getRounds, quickPracticeStorageKey as key, quickPracticeAnswerCells, matchesQuickPracticeRound as matches } from '../data/quickSortPracticeData'
import { recordMistake, progressChangeEvent } from '../../../shared/quiz/mistakeStorage'

function readAnswers(): Record<string, string> {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? '{}')
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
    return Object.fromEntries(Object.entries(value).filter(([, answer]) => typeof answer === 'string').map(([id, answer]) => {
      const input = problems[Number(id.split('-')[0])]
      return [id, input ? quickPracticeAnswerCells(answer as string, input.length).join(', ') : answer as string]
    }))
  } catch { return {} }
}

export default function QuickSortPractice() {
  const [selected, setSelected] = useState(0)
  const [answers, setAnswers] = useState(readAnswers)
  const [checked, setChecked] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [failed, setFailed] = useState(false)
  const [showVisual, setShowVisual] = useState(false)
  const input = problems[selected], rounds = getRounds(input)
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(answers)); setFailed(false) } catch { setFailed(true) } }, [answers])
  useEffect(() => {
    const restore = (event: Event) => {
      if ((event as CustomEvent<{ key: string }>).detail?.key !== key) return
      setAnswers(readAnswers())
      setChecked(false)
    }
    window.addEventListener(progressChangeEvent, restore)
    return () => window.removeEventListener(progressChangeEvent, restore)
  }, [])
  function changeCell(id: string, column: number, value: string) {
    setAnswers(previous => {
      const cells = quickPracticeAnswerCells(previous[id] ?? '', input.length)
      cells[column] = value.replace(/[^0-9-]/g, '') || '_'
      return { ...previous, [id]: cells.join(', ') }
    })
    setChecked(false)
  }
  function checkAnswers() {
    setChecked(true)
    rounds.forEach((round, index) => {
      const id = `${selected}-${index}`, answer = answers[id] ?? ''
      if (answer.replace(/[_ ,]/g, '')) recordMistake(key, 'algorithm', id, { text: answer, submitted: true }, matches(answer, round))
    })
  }
  function chooseProblem(index: number) { setSelected(index); setChecked(false); setRevealed(false); setShowVisual(false) }
  return <section id="quick-round-practice">
    <h2>퀵 정렬 · 회차별 피벗과 리스트 쓰기</h2>
    <p>각 회차의 <strong>선택 피벗 값</strong>, <strong>피벗 최종 위치</strong>, 피벗 위치 확정 직후의 <strong>전체 리스트</strong>를 적으세요. 최종 위치는 전체 리스트의 <strong>0부터 시작하는 인덱스</strong>입니다.</p>
    <div className="algo-controls">{problems.map((_, i) => <button key={i} aria-pressed={selected === i} onClick={() => chooseProblem(i)}>문제 {i + 1}</button>)}<a href="?course=algorithm&topic=divide#divide-quick">퀵 정렬 설명·시각화 바로가기 →</a></div>
    <div className="algo-caution"><strong>풀이 규칙</strong><p>현재 구간의 첫 원소를 피벗으로 선택합니다. low=left+1, high=right로 시작합니다. low는 피벗 이상인 값에서, high는 피벗 이하인 값에서 멈춥니다. low&lt;high이면 교환 후 양쪽 포인터를 이동합니다. 만나거나 엇갈리면 반복을 끝내고 첫 원소와 A[high]를 교환합니다. 왼쪽 구간부터 재귀적으로 처리하며, 원소가 1개 이하인 구간은 회차에 포함하지 않습니다.</p><p>분할 방식에 따라 중간 결과가 달라지므로 아래 기준 코드를 사용하세요.</p><details><summary>기준 분할 코드 보기</summary><pre className="python-output"><code>{quickPartitionCode}</code></pre></details></div>
    <p><strong>입력: [{input.join(', ')}]</strong> · 총 {rounds.length}회 분할</p>
    <div className="algo-controls"><button type="button" aria-expanded={showVisual} aria-controls="question-quick-visual" onClick={() => setShowVisual(!showVisual)}>{showVisual ? '시각화 접기' : '이 문제 시각화 보기'}</button></div>
    {showVisual ? <div id="question-quick-visual" className="content-enter"><QuickSortVisual key={selected} initialValues={input} practice /></div> : null}
    <div className="table-wrap"><table className="quick-practice-table quick-cell-table">
      <caption>각 칸에 숫자 하나씩 입력하세요. 피벗·최종 위치·전체 리스트가 모두 맞아야 해당 회차가 정답입니다.</caption>
      <thead><tr><th scope="col">회차</th><th scope="col">선택 피벗</th><th scope="col">피벗 최종 위치<br />(0부터)</th>{input.map((_, j) => <th scope="col" key={j}>[{j}]</th>)}<th scope="col">확인</th></tr></thead>
      <tbody><tr><th scope="row">초기 상태</th><td>—</td><td>—</td>{input.map((value, j) => <td key={j}>{value}</td>)}<td>—</td></tr>
        {rounds.map((round, i) => {
          const id = `${selected}-${i}`, answer = answers[id] ?? '', cells = quickPracticeAnswerCells(answer, input.length)
          const correct = matches(answer, round)
          return <tr key={id}><th scope="row">{i + 1}회차</th>
            {[0, 1].map(column => <td key={column}><input inputMode="numeric" aria-label={`${i + 1}회차 ${column === 0 ? '선택 피벗' : '피벗 최종 위치'}`} value={cells[column] === '_' ? '' : cells[column]} onChange={event => changeCell(id, column, event.target.value)} /></td>)}
            {input.map((_, j) => <td key={j}><input inputMode="numeric" aria-label={`${i + 1}회차 인덱스 ${j}`} value={cells[j + 2] === '_' ? '' : cells[j + 2]} onChange={event => changeCell(id, j + 2, event.target.value)} /></td>)}
            <td>{checked ? correct ? '정답 ✓' : answer.replace(/[_ ,]/g, '') ? '다시 확인' : '미작성' : '—'}</td>
          </tr>
        })}
      </tbody>
    </table></div>
    <div className="algo-controls">
      <button onClick={checkAnswers}>답안 확인</button>
      <button aria-expanded={revealed} aria-controls="quick-model-answers" onClick={() => setRevealed(!revealed)}>{revealed ? '모범 답안 접기' : '모범 답안 보기'}</button>
      <button onClick={() => { setAnswers(previous => Object.fromEntries(Object.entries(previous).filter(([id]) => !id.startsWith(`${selected}-`)))); setChecked(false); setRevealed(false) }}>이 문제 초기화</button>
    </div>
    {checked ? <p role="status">정답 {rounds.filter((round, i) => matches(answers[`${selected}-${i}`] ?? '', round)).length} / {rounds.length}회차 · 피벗·최종 위치·전체 리스트를 함께 확인합니다.</p> : null}
    <p className="python-note" role="status">{failed ? '저장 공간을 사용할 수 없어 현재 화면에서만 답안이 유지됩니다.' : '작성한 답안은 이 브라우저에 문제별로 자동 저장됩니다.'}</p>
    {revealed ? <section id="quick-model-answers" className="content-enter" aria-labelledby="quick-model-title"><h3 id="quick-model-title">모범 답안</h3><div className="table-wrap"><table className="quick-practice-table">
      <caption>문제 {selected + 1} · 각 분할 직후의 결과 · 인덱스는 전체 리스트 기준 0부터 시작합니다.</caption>
      <thead><tr><th scope="col">회차</th><th scope="col">분할 구간</th><th scope="col">선택 피벗</th><th scope="col">피벗 최종 위치</th><th scope="col">전체 리스트</th></tr></thead>
      <tbody>{rounds.map((round, i) => <tr key={i}><th scope="row">{i + 1}회차</th><td>[{round.low}] ~ [{round.high}]</td><td>{round.pivot}</td><td>[{round.at}]</td><td><code>[{round.values.join(', ')}]</code></td></tr>)}</tbody>
    </table></div></section> : null}
  </section>
}
