import { useEffect, useRef, useState } from 'react'
import { pythonExercises } from '../data/pythonExercises'
import { pythonSolutions } from '../data/pythonSolutions'
import './python-practice.css'

type Draft = { code: string; input: string }
const storageKey = 'justStudy.algorithm.python.v1'
function readDrafts(): Record<string, Draft> {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '{}')
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
    return Object.fromEntries(Object.entries(value).filter(([id, draft]) => pythonExercises.some(e => e.id === id) && draft && typeof draft === 'object' && typeof draft.code === 'string' && typeof draft.input === 'string'))
  } catch { return {} }
}
function normalized(text: string) {
  return text.trim().split('\n').map(line => { const s = line.trimEnd(); return s.trim() && Number.isFinite(Number(s)) ? String(Number(s)) : s }).join('\n')
}

export default function PythonRunner() {
  const [selected, setSelected] = useState('gcd3')
  const [drafts, setDrafts] = useState<Record<string, Draft>>(readDrafts)
  const [saveError, setSaveError] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'running'>('idle')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [milliseconds, setMilliseconds] = useState<number | null>(null)
  const [hint, setHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [comparison, setComparison] = useState<string | null>(null)
  const worker = useRef<Worker | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const exercise = pythonExercises.find(e => e.id === selected) ?? pythonExercises[0]
  const draft = drafts[exercise.id] ?? { code: exercise.starter, input: '' }
  const solution = pythonSolutions[exercise.id]

  useEffect(() => { try { localStorage.setItem(storageKey, JSON.stringify(drafts)); setSaveError(false) } catch { setSaveError(true) } }, [drafts])
  useEffect(() => () => { worker.current?.terminate(); if (timer.current) clearTimeout(timer.current) }, [])

  function finish() { if (timer.current) clearTimeout(timer.current); timer.current = null; setStatus('idle') }
  function stop(message = '실행을 중지했습니다. 다시 실행하면 Python을 새로 준비합니다.') {
    worker.current?.terminate(); worker.current = null; finish(); setError(message)
  }
  function update(field: keyof Draft, value: string) {
    setDrafts(previous => ({ ...previous, [exercise.id]: { ...draft, [field]: value } }))
    setComparison(null)
  }
  function run() {
    if (status !== 'idle' || !draft.code.trim()) return
    setOutput(''); setError(''); setMilliseconds(null); setComparison(null)
    setStatus(worker.current ? 'running' : 'loading')
    try {
      if (!worker.current) worker.current = new Worker(`${import.meta.env.BASE_URL}python-worker.js?v=0.27.7`)
      const current = worker.current
      current.onmessage = ({ data }) => {
        if (worker.current !== current) return
        if (data.type === 'loading') setStatus('loading')
        else if (data.type === 'started') {
          setStatus('running'); if (timer.current) clearTimeout(timer.current)
          timer.current = setTimeout(() => stop('10초 실행 제한을 넘었습니다. 입력 크기와 반복 종료 조건을 확인하세요.'), 10000)
        } else if (data.type === 'done') {
          finish(); setOutput(data.output ?? ''); setError(data.error ?? ''); setMilliseconds(data.milliseconds ?? null)
          if (!data.error && exercise.expected) setComparison(normalized(data.output ?? '') === normalized(exercise.expected) ? '기본 예시 출력과 일치합니다. 다른 입력도 바꿔 실행해 보세요.' : '기본 예시 출력과 다릅니다. 출력 형식과 반환값을 비교해 보세요.')
        } else if (data.type === 'failed') stop(data.error)
      }
      current.onerror = event => { event.preventDefault(); stop('Python 실행 환경을 불러오지 못했습니다. 인터넷 연결을 확인하고 다시 시도하세요.') }
      timer.current = setTimeout(() => stop('Python 준비 시간이 길어 중지했습니다. 인터넷 연결을 확인하고 다시 시도하세요.'), 90000)
      current.postMessage({ code: draft.code, input: draft.input })
    } catch (caught) { stop(caught instanceof Error ? caught.message : '실행 환경을 준비하지 못했습니다.') }
  }

  const topics = [...new Set(pythonExercises.map(e => e.topic))]
  const exerciseIndex = pythonExercises.findIndex(item => item.id === exercise.id)
  const busy = status !== 'idle'

  function chooseExercise(id: string) {
    setSelected(id)
    setOutput(''); setError(''); setHint(false); setShowSolution(false)
    setComparison(null); setMilliseconds(null)
  }

  return <section id="python-practice" className="python-practice python-practice-runner" aria-labelledby="python-practice-title">
    <header className="python-runner-header">
      <h2 id="python-practice-title">직접 Python 작성하기</h2>
      <p>문제를 읽고 Python을 작성한 뒤 실행 결과를 확인하세요.</p>
    </header>
    <div className="python-question-picker">
      <label className="python-select"><span className="sr-only">연습 문제</span>
        <select disabled={busy} value={selected} onChange={event => chooseExercise(event.target.value)}>
          {topics.map(topic => <optgroup label={topic} key={topic}>{pythonExercises.filter(item => item.topic === topic).map(item => <option value={item.id} key={item.id}>{pythonExercises.indexOf(item) + 1}. {item.title}</option>)}</optgroup>)}
        </select>
      </label>
      <span className="python-picker-count" aria-live="polite">{exerciseIndex + 1}/{pythonExercises.length}</span>
      <button type="button" disabled={busy || exerciseIndex === 0} onClick={() => chooseExercise(pythonExercises[exerciseIndex - 1].id)} title="이전 문제" aria-label="이전 문제">←</button>
      <button type="button" disabled={busy || exerciseIndex === pythonExercises.length - 1} onClick={() => chooseExercise(pythonExercises[exerciseIndex + 1].id)} title="다음 문제" aria-label="다음 문제">→</button>
    </div>
    <div className="python-task">
      <span className="python-question-badge">{exercise.topic} · {exercise.title}</span>
      <p>{exercise.task}</p>
    </div>
    <div className="python-workspace">
      <div className="python-editor-pane">
        <label className="python-field" htmlFor="python-code">Python 입력</label>
        <textarea id="python-code" className="python-code" spellCheck={false} value={draft.code} disabled={busy} onChange={event => update('code', event.target.value)} onKeyDown={event => {
          if (event.key === 'Tab') {
            event.preventDefault()
            const element = event.currentTarget
            const start = element.selectionStart
            const end = element.selectionEnd
            update('code', draft.code.slice(0, start) + '    ' + draft.code.slice(end))
            requestAnimationFrame(() => element.setSelectionRange(start + 4, start + 4))
          }
          if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            event.preventDefault()
            run()
          }
        }} />
        <label className="python-field" htmlFor="python-input">입력값 · input() 호출 순서대로 한 줄씩</label>
        <textarea id="python-input" className="python-input" spellCheck={false} value={draft.input} disabled={busy} onChange={event => update('input', event.target.value)} placeholder={'예: 메뉴 번호와 점수를 한 줄씩 입력\n1\n90\n80\n70\n0'} />
        <div className="python-actions" role="group" aria-label="Python 실습 도구">
          <div className="python-action-group">
            <button type="button" className="python-run" disabled={busy || !draft.code.trim()} onClick={run}>{status === 'loading' ? 'Python 준비 중…' : status === 'running' ? '실행 중…' : '▶ 실행'}</button>
            {busy ? <button type="button" onClick={() => stop()}>중지</button> : null}
            <button type="button" disabled={busy} onClick={() => { setDrafts(previous => ({ ...previous, [exercise.id]: { code: exercise.starter, input: '' } })); setOutput(''); setError(''); setComparison(null); setMilliseconds(null) }}>초기화</button>
          </div>
          <div className="python-action-group python-action-learning">
            <button type="button" aria-expanded={hint} aria-controls="python-hint" onClick={() => setHint(!hint)}>{hint ? '힌트 접기' : '힌트'}</button>
            {solution ? <button type="button" aria-expanded={showSolution} aria-controls="python-solution" onClick={() => setShowSolution(!showSolution)}>{showSolution ? '답안 접기' : '모범 답안'}</button> : null}
          </div>
        </div>
        <p className="python-note">{saveError ? '저장 공간을 사용할 수 없어 현재 화면에서만 작업합니다.' : '코드와 입력값은 이 브라우저에 문제별로 자동 저장됩니다.'}</p>
      </div>
      <section className="python-results" aria-label="Python 실행 결과" aria-busy={busy}>
        <h3>실행 결과</h3>
        <p className="python-note" role="status">{status === 'loading' ? '처음 실행할 때 Python을 내려받습니다. 잠시 기다려 주세요.' : status === 'running' ? '코드를 실행하고 있습니다.' : milliseconds !== null ? `실행 시간 ${(milliseconds / 1000).toFixed(4)}초 · 준비 시간 제외` : 'Python을 작성하고 실행하면 여기에 결과가 표시됩니다.'}</p>
        <pre className="python-output" aria-label="Python 표준 출력">{output || '(출력 없음)'}</pre>
        {error ? <pre className="python-error" role="alert">{error}</pre> : null}
        {comparison ? <p className="python-comparison" role="status">{comparison}</p> : null}
        {exercise.expected ? <details className="python-expected"><summary>기본 예시의 예상 출력</summary><pre>{exercise.expected}</pre><p>시작 코드의 입력 기준입니다. 전체 정답 판정은 아닙니다. 디버깅 출력이 추가되면 다르게 표시됩니다.</p></details> : null}
      </section>
    </div>
    {hint ? <div id="python-hint" className="python-hint content-enter" role="note"><strong>풀이 방향</strong><p>{exercise.hint}</p></div> : null}
    {showSolution && solution ? <div id="python-solution" className="python-solution content-enter"><strong>모범 답안</strong><p>가능한 구현 중 하나입니다. 현재 작성 중인 코드는 그대로 유지됩니다.</p><pre><code>{solution}</code></pre></div> : null}
    {!solution ? <p className="python-solution-empty">자유 실습은 정해진 모범 답안 없이 직접 설계해 보는 문제입니다.</p> : null}
    <p className="python-note">브라우저 안에서 실제 Python을 실행합니다. 첫 준비에는 인터넷 연결이 필요합니다. 실행당 변수는 새로 시작하며, 입력이 부족하면 EOFError가 표시됩니다. 실행시간은 기기마다 다르며 PPT의 예시 시간과 같을 필요가 없습니다.</p>
  </section>
}
